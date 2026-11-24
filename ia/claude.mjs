// Ponte com a API do Claude (SDK oficial da Anthropic).
// É usada em dois lugares: dev/server.mjs (computador) e api/sample.js (Vercel).
// A chave vem de ANTHROPIC_API_KEY no ambiente e nunca vai para o navegador.
//
// O app pede três níveis (modelTier). Cada um tem modelo e esforço, trocáveis por variável de ambiente:
//   quick    AUDIS_MODELO_RAPIDO    AUDIS_ESFORCO_RAPIDO    (corrigir flashcard, classificar erro)
//   default  AUDIS_MODELO_PADRAO    AUDIS_ESFORCO_PADRAO    (análise de questão, leitura de imagem, plano)
//   complex  AUDIS_MODELO_COMPLEXO  AUDIS_ESFORCO_COMPLEXO  (análise "aprofundada")
import crypto from 'node:crypto';
import Anthropic from '@anthropic-ai/sdk';

const env = process.env;
export const NIVEIS = {
  quick: { model: env.AUDIS_MODELO_RAPIDO || 'claude-haiku-5-5', effort: env.AUDIS_ESFORCO_RAPIDO || 'low' },
  default: { model: env.AUDIS_MODELO_PADRAO || 'claude-opus-5-5', effort: env.AUDIS_ESFORCO_PADRAO || 'medium' },
  complex: { model: env.AUDIS_MODELO_COMPLEXO || 'claude-opus-5-5', effort: env.AUDIS_ESFORCO_COMPLEXO || 'high' },
};
export const iaConfigurada = () => !!env.ANTHROPIC_API_KEY;

// Modelos que aceitam a troca automática de modelo quando um filtro de segurança recusa o pedido.
const COM_FALLBACK = /^claude-(opus-5|sonnet-5-5|fable-5)/;
// Modelos antigos que não aceitam o parâmetro de esforço.
const SEM_ESFORCO = /^claude-(haiku-4-5|sonnet-4-5)/;

let cliente = null;
const sdk = () => (cliente ||= new Anthropic()); // lê ANTHROPIC_API_KEY (e ANTHROPIC_BASE_URL, se houver)

const dataUrl = d => { const m = /^data:([^;]+);base64,(.*)$/s.exec(d || ''); return m ? { tipo: m[1], dados: m[2] } : null; };
const comoTexto = v => (typeof v === 'string' ? v : JSON.stringify(v));

// Conversa neutra do simulador ({role: user|assistant|tool}) -> mensagens da API.
function paraMensagem(t) {
  if (t.role === 'tool')
    return { role: 'user', content: (t.results || []).map(r => ({ type: 'tool_result', tool_use_id: r.id, content: comoTexto(r.output), is_error: !!r.isError })) };
  if (t.role === 'assistant') {
    // "bruto" é o conteúdo exato que o modelo devolveu na rodada anterior (inclui os blocos de raciocínio).
    // Ele precisa voltar sem alteração: a API confere esses blocos nas rodadas com ferramentas.
    if (Array.isArray(t.bruto) && t.bruto.length) return { role: 'assistant', content: t.bruto };
    return { role: 'assistant', content: [...(t.text ? [{ type: 'text', text: t.text }] : []), ...(t.calls || []).map(c => ({ type: 'tool_use', id: c.id, name: c.name, input: c.input || {} }))] };
  }
  const imagens = (t.images || []).map(dataUrl).filter(Boolean).map(x => ({ type: 'image', source: { type: 'base64', media_type: x.tipo, data: x.dados } }));
  return { role: 'user', content: [...imagens, { type: 'text', text: t.text || ' ' }] };
}

// Quando houve troca de modelo no meio da resposta, os blocos de raciocínio e de ferramenta
// anteriores ao último bloco "fallback" não podem ser reenviados; o bloco "fallback" fica no lugar.
function paraReenviar(content) {
  const corte = content.map(b => b.type).lastIndexOf('fallback');
  if (corte < 0) return content;
  return content.filter((b, i) => i >= corte || !['thinking', 'redacted_thinking', 'tool_use'].includes(b.type));
}

function erroDe(e) {
  if (e && e.code && e.status && !(e instanceof Anthropic.APIError)) return e; // já é um erro nosso
  if (e instanceof Anthropic.APIUserAbortError) return { status: 499, code: 'cancelled', message: 'cancelado' };
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError)
    return { status: 502, code: 'not_granted', message: 'A chave da API do Claude foi recusada. Confira ANTHROPIC_API_KEY.' };
  if (e instanceof Anthropic.RateLimitError) return { status: 429, code: 'rate_limited', message: 'Limite de pedidos da API atingido. Aguarde um pouco.' };
  if (e instanceof Anthropic.BadRequestError) return { status: 400, code: 'invalid_request', message: e.message };
  if (e instanceof Anthropic.APIConnectionError) return { status: 503, code: 'unavailable', message: 'Sem conexão com a API do Claude.' };
  if (e instanceof Anthropic.APIError) return { status: e.status || 502, code: 'upstream_error', message: e.message };
  return { status: 500, code: 'upstream_error', message: String((e && e.message) || e) };
}

// Uma rodada: devolve o texto e, se o modelo pediu ferramentas, as chamadas ("calls").
// O navegador executa as ferramentas e manda os resultados na rodada seguinte.
export async function pedirClaude({ turns, tools, modelTier } = {}, { signal } = {}) {
  if (!iaConfigurada()) throw { status: 503, code: 'unavailable', message: 'ANTHROPIC_API_KEY não está configurada.' };
  if (!Array.isArray(turns) || !turns.length) throw { status: 400, code: 'invalid_request', message: 'entrada vazia' };
  const nivel = NIVEIS[modelTier] || NIVEIS.default;
  const comFallback = COM_FALLBACK.test(nivel.model);
  const params = {
    model: nivel.model,
    max_tokens: 64000,
    messages: turns.map(paraMensagem),
    ...(SEM_ESFORCO.test(nivel.model) ? {} : { output_config: { effort: nivel.effort } }),
    // As ferramentas são executadas no navegador, que valida a entrada antes de usar.
    ...(Array.isArray(tools) && tools.length ? { tools: tools.map(t => ({ name: t.name, description: t.description || '', input_schema: t.inputSchema || { type: 'object', properties: {} } })) } : {}),
    ...(comFallback ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' } : {}),
  };
  let msg;
  try {
    // Com streaming a conexão não cai por tempo em respostas longas; finalMessage() junta tudo no fim.
    const stream = comFallback ? sdk().beta.messages.stream(params, { signal }) : sdk().messages.stream(params, { signal });
    msg = await stream.finalMessage();
  } catch (e) { throw erroDe(e); }

  if (msg.stop_reason === 'refusal')
    throw { status: 422, code: 'refused', message: 'O Claude não respondeu a este pedido' + (msg.stop_details?.category ? ` (filtro: ${msg.stop_details.category}).` : '.') };
  const cortada = msg.stop_reason === 'max_tokens';
  const blocos = msg.content || [];
  return {
    text: blocos.filter(b => b.type === 'text').map(b => b.text).join(''),
    // Resposta cortada pode trazer uma chamada de ferramenta pela metade: não é executada.
    calls: cortada ? [] : blocos.filter(b => b.type === 'tool_use').map(b => ({ id: b.id, name: b.name, input: b.input })),
    truncated: cortada,
    raw: paraReenviar(blocos),
    model: msg.model,
    uso: { entrada: msg.usage?.input_tokens ?? 0, saida: msg.usage?.output_tokens ?? 0 },
  };
}

// Senha de acesso da versão publicada (Vercel): sem ela, qualquer pessoa com o link gastaria os seus créditos.
export function senhaConfere(recebida) {
  const certa = env.AUDIS_SENHA || '';
  if (!certa || typeof recebida !== 'string' || !recebida) return false;
  const h = s => crypto.createHash('sha256').update(s).digest();
  return crypto.timingSafeEqual(h(recebida), h(certa));
}
