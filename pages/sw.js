/*
 * Service worker do modo "GitHub Pages".
 * No computador, dev/claude-shim.js conversa com dev/server.mjs (/__db, /__assets, /_blob, /__config).
 * No GitHub Pages não há servidor: este arquivo intercepta esses mesmos pedidos e responde
 * com o que está guardado no navegador (pages/armazem.js). Assim o simulador e o app não mudam.
 * IA: só existe onde houver as funções de api/ (Vercel). A chave fica no servidor; o aparelho guarda
 * apenas a senha de acesso (digitada em dados.html), que vai no cabeçalho x-audis-senha.
 * No GitHub Pages não há api/, então os recursos com IA ficam escondidos.
 */
importScripts("armazem.js");
const A = self.AudisArmazem;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const SEG = /^[A-Za-z0-9_\-.~:@+]{1,200}$/;
const caminhoOk = (p, par) => { const s = String(p || "").split("/"); return s.length >= (par ? 2 : 1) && (s.length % 2 === 0) === par && s.every(x => SEG.test(x) && x !== "." && x !== ".."); };
const TIPOS = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "application/pdf", "video/mp4", "video/webm", "text/plain", "text/csv", "text/markdown", "application/json"];
const API = caminho => new URL("api/" + caminho, self.registration.scope).href;
// A IA aparece no app quando o endereço tem api/ configurada e este aparelho tem a senha guardada.
// O mesmo vale para a voz da ElevenLabs (api/voz).
async function iaDisponivel() {
  try {
    if (!(await A.lerAjuste("senha-ia"))) return { ia: false, voz: false };
    const r = await fetch(API("config"), { cache: "no-store" });
    const c = r.ok ? await r.json() : {};
    return { ia: c.ia === true, voz: c.voz === true, vozChave: c.vozChave || null };
  } catch { return { ia: false, voz: false }; }
}
const novoId = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, "0")).join("");

async function atender(req, url) {
  const p = url.pathname, m = req.method;
  if (m === "GET" && p === "/__config") { const { ia, voz, vozChave } = await iaDisponivel(); return json(200, { sample: ia, images: ia, ia: ia ? "anthropic" : null, modelos: null, voz, vozChave: vozChave || null }); }
  if (m === "GET" && p === "/__db") {
    const c = url.searchParams.get("c");
    if (!caminhoOk(c, false)) return json(500, { code: "upstream_error", message: "coleção inválida: " + c });
    return json(200, await A.lerColecao(c));
  }
  if (m === "POST" && (p === "/__db/set" || p === "/__db/delete")) {
    const { path, data } = await req.json();
    if (!caminhoOk(path, true)) return json(500, { code: "upstream_error", message: "caminho inválido: " + path });
    if (p === "/__db/set") await A.gravar(path, data); else await A.apagar(path);
    return json(200, { ok: true });
  }
  if (p === "/__assets" && m === "POST") {
    const tipo = String(req.headers.get("content-type") || "").split(";")[0].trim();
    if (!TIPOS.includes(tipo)) return json(415, { code: "unsupported_type", message: "tipo não aceito: " + tipo });
    const dados = await req.arrayBuffer();
    if (!dados.byteLength) return json(400, { code: "invalid_request", message: "arquivo vazio" });
    const id = novoId();
    await A.gravarAsset(id, tipo, dados);
    return json(200, { id, url: "/_blob/" + id, sizeBytes: dados.byteLength, contentType: tipo });
  }
  if (p === "/__assets" && m === "GET") {
    const lista = (await A.listarAssets()).map(a => ({ id: a.id, url: "/_blob/" + a.id, contentType: a.tipo, sizeBytes: a.bytes, createdAt: a.criado }));
    return json(200, { assets: lista, usage: { files: lista.length, bytes: lista.reduce((n, x) => n + x.sizeBytes, 0), maxFiles: 5000, maxBytes: 1073741824 } });
  }
  if (p.startsWith("/__assets/") && m === "DELETE") {
    const id = decodeURIComponent(p.slice(10)), tinha = !!(await A.lerAsset(id));
    if (tinha) await A.apagarAsset(id);
    return json(200, { deleted: tinha });
  }
  if (p.startsWith("/_blob/") && m === "GET") {
    const a = await A.lerAsset(p.slice(7));
    return a ? new Response(a.dados, { status: 200, headers: { "content-type": a.tipo, "cache-control": "no-store" } }) : json(404, { message: "imagem não encontrada" });
  }
  if (p === "/__sample" && m === "POST") {
    const senha = await A.lerAjuste("senha-ia");
    if (!senha) return json(503, { code: "unavailable", message: "Informe a senha da IA em Dados neste aparelho." });
    const r = await fetch(API("sample"), { method: "POST", headers: { "content-type": "application/json", "x-audis-senha": senha }, body: await req.text(), signal: req.signal });
    if (r.status === 413) return json(413, { code: "invalid_request", message: "O pedido ficou grande demais para enviar (imagem muito pesada?)." });
    if (!(r.headers.get("content-type") || "").includes("json")) return json(502, { code: "upstream_error", message: "A IA não respondeu (" + r.status + "). Tente de novo." });
    return new Response(r.body, { status: r.status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
  }
  if (p === "/__voz" && m === "POST") {
    const senha = await A.lerAjuste("senha-ia");
    if (!senha) return json(503, { code: "unavailable", message: "Informe a senha em Dados neste aparelho." });
    const r = await fetch(API("voz"), { method: "POST", headers: { "content-type": "application/json", "x-audis-senha": senha }, body: await req.text(), signal: req.signal });
    const tipo = r.headers.get("content-type") || "";
    if (!r.ok && !tipo.includes("json")) return json(502, { code: "upstream_error", message: "A voz não respondeu (" + r.status + ")." });
    return new Response(r.body, { status: r.status, headers: { "content-type": tipo || "audio/mpeg", "cache-control": "no-store" } });
  }
  return json(404, { message: "não encontrado: " + p });
}

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/__") || url.pathname.startsWith("/_blob/"))
    e.respondWith(atender(e.request, url).catch(err => json(500, { code: "upstream_error", message: String((err && err.message) || err) })));
});
