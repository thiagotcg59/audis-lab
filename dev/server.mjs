// Servidor local de desenvolvimento do Audis Lab (sem dependências: só Node 20+).
//   npm run dev  ->  http://127.0.0.1:5173
// Serve o app montado na hora a partir de src/ (basta recarregar a página depois de editar),
// guarda o banco em dados/db/ e as imagens em dados/assets/, e encaminha os pedidos de IA.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { montarJs } from '../scripts/build.mjs';

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = process.argv.includes('--dist'); // serve dist/ (o que vai ser publicado) em vez de montar src/ na hora

// .env simples (CHAVE=valor), sem dependências
const envFile = path.join(raiz, '.env');
if (fs.existsSync(envFile)) for (const linha of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
  const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(linha);
  if (m && !linha.trim().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
}

const PORT = Number(process.env.PORT || 5173);
const DADOS = path.resolve(raiz, process.env.AUDIS_DADOS || 'dados');
const DB = path.join(DADOS, 'db');
const ASSETS = path.join(DADOS, 'assets');
const IA = (process.env.AUDIS_IA || (process.env.ANTHROPIC_API_KEY ? 'anthropic' : process.env.GEMINI_API_KEY ? 'gemini' : '')).toLowerCase();
const MODELOS = {
  anthropic: { quick: process.env.AUDIS_MODELO_RAPIDO || 'claude-haiku-5-5', default: process.env.AUDIS_MODELO_PADRAO || 'claude-sonnet-5-5', complex: process.env.AUDIS_MODELO_COMPLEXO || 'claude-opus-5-5' }, // os mesmos padrões de ia/claude.mjs
  gemini: { quick: process.env.AUDIS_MODELO_RAPIDO || 'gemini-2.5-flash', default: process.env.AUDIS_MODELO_PADRAO || 'gemini-2.5-flash', complex: process.env.AUDIS_MODELO_COMPLEXO || 'gemini-2.5-pro' },
};
const temIA = (IA === 'anthropic' && !!process.env.ANTHROPIC_API_KEY) || (IA === 'gemini' && !!process.env.GEMINI_API_KEY);

const SEG = /^[A-Za-z0-9_\-.~:@+]{1,200}$/;
function caminhoSeguro(p) {
  const partes = String(p || '').split('/');
  if (partes.length < 2 || partes.length % 2 || partes.some(s => !SEG.test(s) || s === '.' || s === '..')) throw new Error('caminho inválido: ' + p);
  const dir = partes.slice(0, -1).map(encodeURIComponent);
  return path.join(DB, ...dir, encodeURIComponent(partes.at(-1)) + '.json');
}
function lerColecao(c) {
  const partes = String(c || '').split('/');
  if (!partes.length || partes.length % 2 === 0 || partes.some(s => !SEG.test(s))) throw new Error('coleção inválida: ' + c);
  const dir = path.join(DB, ...partes.map(encodeURIComponent));
  const out = {};
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('.json')) {
    try { out[decodeURIComponent(f.slice(0, -5))] = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { console.warn('ignorado (JSON inválido):', path.join(dir, f)); }
  }
  return out;
}
const EXT = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/svg+xml': 'svg', 'application/pdf': 'pdf', 'video/mp4': 'mp4', 'video/webm': 'webm', 'text/plain': 'txt', 'text/csv': 'csv', 'text/markdown': 'md', 'application/json': 'json' };
const TIPO = Object.fromEntries(Object.entries(EXT).map(([t, e]) => [e, t]));
const acharAsset = id => (/^[a-f0-9]{32}$/.test(id) && fs.existsSync(ASSETS) ? fs.readdirSync(ASSETS).find(f => f.startsWith(id + '.')) : null);

function corpo(req, limite = 25 * 1024 * 1024) {
  return new Promise((ok, no) => { const ch = []; let n = 0;
    req.on('data', c => { n += c.length; if (n > limite) { no(new Error('corpo grande demais')); req.destroy(); } else ch.push(c); });
    req.on('end', () => ok(Buffer.concat(ch))); req.on('error', no); });
}
const json = (res, status, obj) => { res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(JSON.stringify(obj)); };
const arquivo = (res, f, tipo) => { if (!fs.existsSync(f)) return json(res, 404, { message: 'não encontrado' }); res.writeHead(200, { 'content-type': tipo, 'cache-control': 'no-store' }); fs.createReadStream(f).pipe(res); };

// Converte a conversa neutra do simulador ({role:user|assistant|tool}) para a API escolhida.
// Rodadas com ferramentas: a resposta traz "calls"; o navegador executa e manda os resultados na próxima rodada.
const URL_GEMINI = (process.env.GEMINI_BASE_URL || 'https://generativelanguage.googleapis.com').replace(/\/$/, '');
const dataUrl = d => { const m = /^data:([^;]+);base64,(.*)$/s.exec(d || ''); return m ? { tipo: m[1], dados: m[2] } : null; };
const comoTexto = v => (typeof v === 'string' ? v : JSON.stringify(v));
function limparSchema(s) {
  if (!s || typeof s !== 'object') return s;
  const o = {};
  for (const k of ['type', 'description', 'enum', 'required', 'format', 'nullable']) if (s[k] !== undefined) o[k] = s[k];
  if (s.properties) o.properties = Object.fromEntries(Object.entries(s.properties).map(([k, v]) => [k, limparSchema(v)]));
  if (s.items) o.items = limparSchema(s.items);
  if (o.type === 'object' && !o.properties) o.properties = {};
  return o;
}
async function pedirIA({ turns, tools, modelTier }) {
  if (!Array.isArray(turns) || !turns.length) throw { status: 400, code: 'invalid_request', message: 'entrada vazia' };
  const modelo = (MODELOS[IA] || {})[modelTier] || (MODELOS[IA] || {}).default;
  const erro = (r, out, nome) => ({ status: r.status, code: r.status === 429 ? 'rate_limited' : r.status === 401 || r.status === 403 ? 'not_granted' : 'upstream_error', message: out?.error?.message || 'erro da API ' + nome });
  if (IA === 'anthropic') {
    // A conversa com o Claude fica em ia/claude.mjs (SDK oficial), a mesma usada na versão publicada no Vercel.
    let ponte;
    try { ponte = await import('../ia/claude.mjs'); }
    catch (e) { throw { status: 503, code: 'unavailable', message: 'Falta instalar as dependências da IA: rode "npm install" na pasta do projeto.' }; }
    return ponte.pedirClaude({ turns, tools, modelTier });
  }
  if (IA === 'gemini') {
    const contents = turns.map(t => t.role === 'tool'
      ? { role: 'user', parts: t.results.map(r => ({ functionResponse: { name: r.name, response: { result: r.output, ...(r.isError ? { erro: true } : {}) } } })) }
      : t.role === 'assistant'
        ? { role: 'model', parts: [...(t.text ? [{ text: t.text }] : []), ...(t.calls || []).map(c => ({ functionCall: { name: c.name, args: c.input || {} } }))] }
        : { role: 'user', parts: [...(t.images || []).map(dataUrl).filter(Boolean).map(x => ({ inline_data: { mime_type: x.tipo, data: x.dados } })), { text: t.text || ' ' }] });
    const body = { contents, ...(tools?.length ? { tools: [{ function_declarations: tools.map(t => ({ name: t.name, description: t.description, parameters: limparSchema(t.inputSchema) })) }] } : {}) };
    const r = await fetch(`${URL_GEMINI}/v1beta/models/${encodeURIComponent(modelo)}:generateContent`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY }, body: JSON.stringify(body) });
    const out = await r.json().catch(() => ({}));
    if (!r.ok) throw erro(r, out, 'do Gemini');
    const c = out.candidates?.[0], parts = c?.content?.parts || [];
    return { text: parts.map(p => p.text || '').join(''), calls: parts.filter(p => p.functionCall).map((p, i) => ({ id: 'g' + Date.now().toString(36) + i, name: p.functionCall.name, input: p.functionCall.args || {} })), truncated: c?.finishReason === 'MAX_TOKENS' };
  }
  throw { status: 503, code: 'unavailable', message: 'Nenhuma IA configurada no .env' };
}

const servidor = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;
  try {
    if (req.method === 'GET' && (p === '/' || p === '/index.html')) return arquivo(res, path.join(raiz, 'dev/index.html'), 'text/html; charset=utf-8');
    if (req.method === 'GET' && p === '/dev/claude-shim.js') return arquivo(res, path.join(raiz, 'dev/claude-shim.js'), 'text/javascript; charset=utf-8');
    if (req.method === 'GET' && p === '/app.js') { if (DIST) return arquivo(res, path.join(raiz, 'dist/app.js'), 'text/javascript; charset=utf-8'); res.writeHead(200, { 'content-type': 'text/javascript; charset=utf-8', 'cache-control': 'no-store' }); return res.end(montarJs()); }
    if (req.method === 'GET' && p === '/app.css') return arquivo(res, path.join(raiz, DIST ? 'dist/app.css' : 'src/app.css'), 'text/css; charset=utf-8');
    if (req.method === 'GET' && p === '/__config') return json(res, 200, { sample: temIA, images: temIA, ia: temIA ? IA : null, modelos: temIA ? MODELOS[IA] : null });
    if (req.method === 'GET' && p === '/__db') return json(res, 200, lerColecao(url.searchParams.get('c')));
    if (req.method === 'POST' && (p === '/__db/set' || p === '/__db/delete')) {
      const { path: doc, data } = JSON.parse((await corpo(req)).toString('utf8') || '{}');
      const f = caminhoSeguro(doc);
      if (p === '/__db/set') { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f + '.tmp', JSON.stringify(data, null, 2)); fs.renameSync(f + '.tmp', f); }
      else if (fs.existsSync(f)) fs.unlinkSync(f);
      return json(res, 200, { ok: true });
    }
    if (p === '/__assets' && req.method === 'POST') {
      const tipo = String(req.headers['content-type'] || '').split(';')[0].trim(), ext = EXT[tipo];
      if (!ext) return json(res, 415, { code: 'unsupported_type', message: 'tipo não aceito: ' + tipo });
      const dados = await corpo(req); if (!dados.length) return json(res, 400, { code: 'invalid_request', message: 'arquivo vazio' });
      const id = crypto.randomBytes(16).toString('hex'); fs.mkdirSync(ASSETS, { recursive: true }); fs.writeFileSync(path.join(ASSETS, `${id}.${ext}`), dados);
      return json(res, 200, { id, url: '/_blob/' + id, sizeBytes: dados.length, contentType: tipo });
    }
    if (p === '/__assets' && req.method === 'GET') {
      const lista = fs.existsSync(ASSETS) ? fs.readdirSync(ASSETS).filter(f => /^[a-f0-9]{32}\./.test(f)).map(f => { const st = fs.statSync(path.join(ASSETS, f)), id = f.split('.')[0]; return { id, url: '/_blob/' + id, contentType: TIPO[f.split('.').pop()] || 'application/octet-stream', sizeBytes: st.size, createdAt: st.mtime.toISOString() }; }) : [];
      return json(res, 200, { assets: lista, usage: { files: lista.length, bytes: lista.reduce((a, x) => a + x.sizeBytes, 0), maxFiles: 5000, maxBytes: 1073741824 } });
    }
    if (p.startsWith('/__assets/') && req.method === 'DELETE') { const f = acharAsset(decodeURIComponent(p.slice(10))); if (f) fs.unlinkSync(path.join(ASSETS, f)); return json(res, 200, { deleted: !!f }); }
    if (p.startsWith('/_blob/') && req.method === 'GET') { const f = acharAsset(p.slice(7)); return f ? arquivo(res, path.join(ASSETS, f), TIPO[f.split('.').pop()] || 'application/octet-stream') : json(res, 404, { message: 'imagem não encontrada' }); }
    if (p === '/__sample' && req.method === 'POST') {
      try { return json(res, 200, await pedirIA(JSON.parse((await corpo(req)).toString('utf8')))); }
      catch (e) { return json(res, e.status || 500, { code: e.code || 'upstream_error', message: e.message || String(e) }); }
    }
    return json(res, 404, { message: 'não encontrado: ' + p });
  } catch (e) {
    console.error(e); return json(res, 500, { code: 'upstream_error', message: String(e.message || e) });
  }
});
servidor.listen(PORT, '127.0.0.1', () => {
  console.log(`Audis Lab local: http://127.0.0.1:${PORT}${DIST ? '  (servindo dist/)' : ''}`);
  console.log(`Dados: ${DADOS}`);
  console.log(temIA ? `IA: ${IA} (${MODELOS[IA].default})` : 'IA: desligada (sem chave no .env). Recursos com o Claude ficam escondidos.');
});
