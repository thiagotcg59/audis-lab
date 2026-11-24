// Ponte com a ElevenLabs (texto em voz). Usada em dev/server.mjs (computador) e api/voz.js (Vercel).
// A chave vem do ambiente e nunca vai para o navegador. A ElevenLabs cobra por caractere lido.
//   ELEVENLABS_API_KEY    chave da API (elevenlabs.io › Developers › API Keys)
//   ELEVENLABS_VOICE_ID   id da voz escolhida (em Voices, menu da voz › "Copy voice ID")
//   ELEVENLABS_MODEL      opcional; padrão eleven_multilingual_v2
// Sem dependências: usa o fetch do Node.
const env = process.env;
const BASE = () => (env.ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io').replace(/\/$/, '');
export const MAX_TEXTO = 2500; // caracteres por pedido; o app manda um parágrafo de cada vez

export const vozConfigurada = () => !!env.ELEVENLABS_API_KEY && !!env.ELEVENLABS_VOICE_ID;

// Devolve { tipo, dados } com o áudio em MP3. Erros saem como { status, code, message }.
export async function pedirVoz({ text } = {}, { signal } = {}) {
  if (!vozConfigurada()) throw { status: 503, code: 'unavailable', message: 'A voz da ElevenLabs não está configurada.' };
  const texto = typeof text === 'string' ? text.replace(/\s+/g, ' ').trim() : '';
  if (!texto) throw { status: 400, code: 'invalid_request', message: 'texto vazio' };
  if (texto.length > MAX_TEXTO) throw { status: 400, code: 'invalid_request', message: 'texto longo demais para um pedido de voz' };
  const url = `${BASE()}/v1/text-to-speech/${encodeURIComponent(env.ELEVENLABS_VOICE_ID)}?output_format=mp3_44100_128`;
  let r;
  try {
    r = await fetch(url, {
      method: 'POST', signal,
      headers: { 'content-type': 'application/json', accept: 'audio/mpeg', 'xi-api-key': env.ELEVENLABS_API_KEY },
      body: JSON.stringify({ text: texto, model_id: env.ELEVENLABS_MODEL || 'eleven_multilingual_v2' }),
    });
  } catch (e) {
    throw { status: 502, code: 'upstream_error', message: 'Não foi possível falar com a ElevenLabs.' };
  }
  if (!r.ok) {
    const out = await r.json().catch(() => ({}));
    const d = out?.detail, motivo = typeof d === 'string' ? d : d?.message || '';
    throw {
      status: r.status,
      code: r.status === 401 || r.status === 403 ? 'not_granted' : r.status === 429 ? 'rate_limited' : 'upstream_error',
      message: r.status === 401 ? 'A ElevenLabs recusou a chave (ou os créditos acabaram).' + (motivo ? ' ' + motivo : '')
        : r.status === 404 ? 'A ElevenLabs não achou a voz: confira ELEVENLABS_VOICE_ID.'
        : r.status === 429 ? 'A ElevenLabs pediu para esperar um pouco (muitos pedidos).'
        : motivo || `A ElevenLabs respondeu com erro ${r.status}.`,
    };
  }
  return { tipo: r.headers.get('content-type') || 'audio/mpeg', dados: Buffer.from(await r.arrayBuffer()) };
}
