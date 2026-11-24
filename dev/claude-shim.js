/*
 * Simulador local do window.claude (o "runtime" que o claude.ai entrega aos artefatos).
 *
 * No claude.ai, o Audis chama window.claude.use("db" | "sample" | "assets" | "downloads").
 * Aqui, cada capacidade conversa com o servidor local (dev/server.mjs):
 *   db        -> documentos JSON em dados/db/<coleção>/<id>.json
 *   sample    -> Claude (API da Anthropic) ou Gemini, se houver chave no .env; sem chave, fica indisponível
 *   assets    -> arquivos em dados/assets/ (imagens do Quadro), servidos em /_blob/<id>
 *   downloads -> baixa o arquivo pelo navegador
 *
 * Mantém a mesma forma de chamada do claude.ai, para o código do app não precisar mudar.
 */
(function () {
  "use strict";
  const clone = x => (x === undefined ? undefined : JSON.parse(JSON.stringify(x)));
  const docs = {};                 // "colecao/id" -> dados
  const loaded = {};               // colecao -> Promise
  const listeners = new Map();     // colecao -> Set({next, q})
  const docListeners = new Map();  // caminho -> Set(next)
  let config = { sample: false, images: false };
  const configP = fetch("/__config").then(r => r.json()).then(c => (config = c)).catch(() => config);

  const collOf = p => p.split("/").slice(0, -1).join("/");
  function loadColl(c) {
    if (!loaded[c]) loaded[c] = fetch("/__db?c=" + encodeURIComponent(c)).then(r => {
      if (!r.ok) throw new Error("servidor local respondeu " + r.status);
      return r.json();
    }).then(m => { for (const [id, d] of Object.entries(m)) docs[c + "/" + id] = d; });
    return loaded[c];
  }
  async function post(acao, corpo) {
    const r = await fetch("/__db/" + acao, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) });
    if (!r.ok) throw { code: "unavailable", message: "Falha ao gravar no servidor local (" + r.status + ")" };
  }
  const cmp = (a, op, b) => {
    switch (op) {
      case "==": return a === b; case "!=": return a !== b; case "<": return a < b; case "<=": return a <= b;
      case ">": return a > b; case ">=": return a >= b; case "in": return Array.isArray(b) && b.includes(a);
      case "not-in": return Array.isArray(b) && !b.includes(a); case "array-contains": return Array.isArray(a) && a.includes(b);
      default: return false;
    }
  };
  const docSnap = (p, d) => ({ id: p.split("/").pop(), ref: { path: p }, exists: d !== undefined, data: () => clone(d), metadata: { fromCache: false, hasPendingWrites: false } });
  function snapOf(c, q) {
    let L = Object.entries(docs).filter(([p]) => collOf(p) === c);
    for (const [f, op, v] of q.where || []) L = L.filter(([, d]) => d && cmp(d[f], op, v));
    if (q.order) { const [f, dir] = q.order; L.sort(([, a], [, b]) => ((a?.[f] > b?.[f]) - (a?.[f] < b?.[f])) * (dir === "desc" ? -1 : 1)); }
    else L.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    if (q.limit) L = L.slice(0, q.limit);
    const list = L.map(([p, d]) => docSnap(p, d));
    return { docs: list, size: list.length, empty: !list.length, metadata: { fromCache: false, hasPendingWrites: false }, docChanges: () => [], forEach: fn => list.forEach(fn) };
  }
  function notify(p) {
    const c = collOf(p);
    for (const l of listeners.get(c) || []) setTimeout(() => l.next(snapOf(c, l.q)), 0);
    for (const fn of docListeners.get(p) || []) setTimeout(() => fn(docSnap(p, docs[p])), 0);
  }
  function query(c, q = {}) {
    return {
      path: c,
      where: (f, op, v) => query(c, { ...q, where: [...(q.where || []), [f, op, v]] }),
      orderBy: (f, dir) => query(c, { ...q, order: [f, dir || "asc"] }),
      limit: n => query(c, { ...q, limit: n }),
      async get() { await loadColl(c); return snapOf(c, q); },
      onSnapshot(next, error) {
        const l = { next, q }; if (!listeners.has(c)) listeners.set(c, new Set()); listeners.get(c).add(l);
        loadColl(c).then(() => next(snapOf(c, q))).catch(e => error && error({ code: "unavailable", message: String(e && e.message || e) }));
        return () => listeners.get(c).delete(l);
      },
      doc: id => docRef(c + "/" + (id || Date.now().toString(36) + Math.random().toString(36).slice(2, 8))),
      async add(data) { const r = docRef(c + "/" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)); await r.set(data); return r; },
    };
  }
  const merge = (a, b) => {
    const o = { ...(a || {}) };
    for (const [k, v] of Object.entries(b || {})) {
      if (v && typeof v === "object" && v.__delete__ === true) delete o[k];
      else if (v && typeof v === "object" && !Array.isArray(v) && o[k] && typeof o[k] === "object" && !Array.isArray(o[k])) o[k] = merge(o[k], v);
      else o[k] = v;
    }
    return o;
  };
  function docRef(p) {
    const c = collOf(p);
    return {
      path: p, id: p.split("/").pop(),
      async get() { await loadColl(c); return docSnap(p, docs[p]); },
      async set(data) { await loadColl(c); docs[p] = clone(data); notify(p); await post("set", { path: p, data }); },
      async update(data) { await loadColl(c); if (docs[p] === undefined) throw { code: "invalid_argument", message: "documento não existe: " + p }; docs[p] = merge(docs[p], clone(data)); notify(p); await post("set", { path: p, data: docs[p] }); },
      async delete() { await loadColl(c); delete docs[p]; notify(p); await post("delete", { path: p }); },
      async acquire(opts) { return { acquired: true, holder: opts && opts.holder, expiresAt: new Date(Date.now() + ((opts && opts.ttlMs) || 30000)).toISOString() }; },
      onSnapshot(next, error) {
        if (!docListeners.has(p)) docListeners.set(p, new Set()); docListeners.get(p).add(next);
        loadColl(c).then(() => next(docSnap(p, docs[p]))).catch(e => error && error({ code: "unavailable", message: String(e) }));
        return () => docListeners.get(p).delete(next);
      },
      collection: sub => query(p + "/" + sub),
    };
  }
  const db = Object.freeze({ collection: c => query(c), doc: p => docRef(p) });

  const blobToDataUrl = b => new Promise((ok, no) => { const f = new FileReader(); f.onload = () => ok(String(f.result)); f.onerror = no; f.readAsDataURL(b); });
  function parseJson(text) {
    let t = String(text || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    try { return JSON.parse(t); } catch {}
    const i = t.search(/[\[{]/), j = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
    if (i >= 0 && j > i) { try { return JSON.parse(t.slice(i, j + 1)); } catch {} }
    throw { code: "invalid_json", message: "A resposta não veio em JSON.", text };
  }
  async function rodada(corpo, signal) {
    const r = await fetch("/__sample", { method: "POST", headers: { "content-type": "application/json" }, signal, body: JSON.stringify(corpo) })
      .catch(e => { throw { code: e && e.name === "AbortError" ? "cancelled" : "unavailable", message: String(e) }; });
    const out = await r.json().catch(() => ({}));
    if (!r.ok) throw { code: out.code || "upstream_error", message: out.message || "Falha ao chamar a IA (" + r.status + ")" };
    return out;
  }
  // Uma chamada ao modelo. Com opts.tools, repete as rodadas: o modelo pede ferramentas,
  // a página executa (tool.execute) e devolve o resultado, até o modelo responder só com texto.
  async function chamar(input, opts = {}) {
    const signal = opts.signal || new AbortController().signal;
    if (signal.aborted) throw { code: "cancelled", message: "cancelado" };
    const modelTier = opts.modelTier || "default";
    const images = opts.images ? await Promise.all([...(opts.images instanceof Blob ? [opts.images] : opts.images)].map(blobToDataUrl)) : [];
    const turns = typeof input === "string" ? [{ role: "user", text: input }]
      : (Array.isArray(input) ? input : []).map(t => ({ role: t.role === "assistant" ? "assistant" : "user", text: String(t.content || "") }));
    if (!turns.length) throw { code: "invalid_request", message: "entrada vazia" };
    if (images.length) turns[turns.length - 1].images = images;
    const ferramentas = Array.isArray(opts.tools) ? opts.tools : [];
    const tools = ferramentas.map(t => ({ name: t.name, description: t.description || "", inputSchema: t.inputSchema || { type: "object", properties: {} } }));
    let texto = "";
    for (let n = 0; n < 16; n++) {
      if (signal.aborted) throw { code: "cancelled", message: "cancelado", text: texto };
      const out = await rodada({ turns, tools, modelTier }, signal);
      if (out.text) { texto += (texto ? "\n" : "") + out.text; if (opts.onText) { try { opts.onText({ text: texto, delta: out.text }); } catch {} } }
      const calls = Array.isArray(out.calls) ? out.calls : [];
      if (!calls.length || !ferramentas.length) return { text: texto, truncated: !!out.truncated, modelTierApplied: modelTier };
      turns.push({ role: "assistant", text: out.text || "", calls, bruto: out.raw }); // "bruto": blocos exatos do modelo, que a API exige de volta sem alteração
      const results = [];
      for (const c of calls) {
        const t = ferramentas.find(x => x.name === c.name);
        try {
          const v = t ? await t.execute(c.input || {}, { signal }) : { erro: "ferramenta desconhecida: " + c.name };
          results.push({ id: c.id, name: c.name, output: v === undefined ? null : v });
        } catch (e) { results.push({ id: c.id, name: c.name, output: String((e && e.message) || e), isError: true }); }
      }
      turns.push({ role: "tool", results });
    }
    throw { code: "upstream_error", message: "A IA pediu ferramentas demais em sequência.", text: texto };
  }
  function makeSample() {
    const sample = (input, opts) => chamar(input, opts);
    sample.json = async (input, opts) => { const r = await chamar(input, opts); return parseJson(r.text); };
    sample.limits = async () => ({ maxPromptBytes: 262144, ...(config.images ? { images: { maxCount: 5, maxInputBytes: 20 * 1024 * 1024, mediaTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"] } } : {}) });
    return Object.freeze(sample);
  }
  const assets = Object.freeze({
    async upload(blob, options) {
      const type = (options && options.type) || blob.type;
      if (!type) throw { code: "invalid_request", message: "tipo do arquivo ausente" };
      const r = await fetch("/__assets", { method: "POST", headers: { "content-type": type }, body: blob });
      const out = await r.json().catch(() => ({}));
      if (!r.ok) throw { code: out.code || "upstream_error", message: out.message || "falha no upload" };
      return out;
    },
    async list() { return (await fetch("/__assets")).json(); },
    async delete(ref) { const id = String(ref).split("/").pop(); const r = await fetch("/__assets/" + encodeURIComponent(id), { method: "DELETE" }); return r.json(); },
  });
  const downloads = Object.freeze({
    async save({ filename, data }) {
      const blob = data instanceof Blob ? data : new Blob([data], { type: "application/octet-stream" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename || "arquivo";
      document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
      return { saved: true };
    },
  });

  window.claude = Object.freeze({
    async use(nome) {
      await configP;
      if (nome === "db") return db;
      if (nome === "sample") return config.sample ? makeSample() : null;
      if (nome === "assets") return assets;
      if (nome === "downloads") return downloads;
      return null;
    },
  });
})();
