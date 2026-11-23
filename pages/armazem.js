/*
 * Armazém do modo "GitHub Pages": guarda o banco e as imagens no IndexedDB do navegador.
 * É usado por pages/sw.js (que responde no lugar do servidor local) e por pages/dados.html
 * (carregar e baixar o pacote de dados). Funciona tanto na página quanto no service worker.
 *
 *   docs    chave "colecao/id" -> documento JSON
 *   assets  chave id (32 hex)  -> { tipo, dados: ArrayBuffer, criado }
 */
(function (global) {
  "use strict";
  const NOME = "audis-local";
  let aberto = null;
  function abrir() {
    if (!aberto) aberto = new Promise((ok, no) => {
      const r = indexedDB.open(NOME, 1);
      r.onupgradeneeded = () => { r.result.createObjectStore("docs"); r.result.createObjectStore("assets"); };
      r.onsuccess = () => ok(r.result);
      r.onerror = () => { aberto = null; no(r.error || new Error("IndexedDB indisponível")); };
    });
    return aberto;
  }
  // Roda fn(store) numa transação e espera ela terminar. fn pode devolver um IDBRequest: o resultado dele é o retorno.
  async function tx(loja, modo, fn) {
    const db = await abrir();
    return new Promise((ok, no) => {
      const t = db.transaction(loja, modo);
      let saida;
      const r = fn(t.objectStore(loja));
      if (r && "onsuccess" in r) r.onsuccess = () => { saida = r.result; };
      t.oncomplete = () => ok(saida);
      t.onerror = t.onabort = () => no(t.error || new Error("falha ao gravar no navegador"));
    });
  }
  const faixa = c => IDBKeyRange.bound(c + "/", c + "/￿");

  const Armazem = {
    // Todos os documentos de uma coleção: { id: dados }
    async lerColecao(c) {
      const out = {};
      const db = await abrir();
      await new Promise((ok, no) => {
        const cur = db.transaction("docs").objectStore("docs").openCursor(faixa(c));
        cur.onsuccess = () => {
          const k = cur.result;
          if (!k) return ok();
          const id = String(k.key).slice(c.length + 1);
          if (!id.includes("/")) out[id] = k.value;
          k.continue();
        };
        cur.onerror = () => no(cur.error);
      });
      return out;
    },
    gravar: (caminho, dados) => tx("docs", "readwrite", s => { s.put(dados, caminho); }),
    apagar: caminho => tx("docs", "readwrite", s => { s.delete(caminho); }),
    contar: async () => ({ docs: await tx("docs", "readonly", s => s.count()), assets: await tx("assets", "readonly", s => s.count()) }),
    async temDados() { return (await tx("docs", "readonly", s => s.count())) > 0; },

    lerAsset: id => tx("assets", "readonly", s => s.get(id)),
    gravarAsset: (id, tipo, dados) => tx("assets", "readwrite", s => { s.put({ tipo, dados, criado: new Date().toISOString() }, id); }),
    apagarAsset: id => tx("assets", "readwrite", s => { s.delete(id); }),
    async listarAssets() {
      const db = await abrir(), out = [];
      await new Promise((ok, no) => {
        const cur = db.transaction("assets").objectStore("assets").openCursor();
        cur.onsuccess = () => { const k = cur.result; if (!k) return ok(); out.push({ id: k.key, tipo: k.value.tipo, bytes: k.value.dados.byteLength, criado: k.value.criado, dados: k.value.dados }); k.continue(); };
        cur.onerror = () => no(cur.error);
      });
      return out;
    },

    // Pacote de dados: { formato: "audis-dados", versao: 1, geradoEm, db: { "colecao/id": {...} }, assets: { id: { tipo, base64 } } }
    // O mesmo formato é gerado no computador por scripts/empacotar-dados.mjs.
    async exportar() {
      const db = await abrir(), docs = {};
      await new Promise((ok, no) => {
        const cur = db.transaction("docs").objectStore("docs").openCursor();
        cur.onsuccess = () => { const k = cur.result; if (!k) return ok(); docs[k.key] = k.value; k.continue(); };
        cur.onerror = () => no(cur.error);
      });
      const assets = {};
      for (const a of await Armazem.listarAssets()) assets[a.id] = { tipo: a.tipo, base64: paraBase64(a.dados) };
      return { formato: "audis-dados", versao: 1, geradoEm: new Date().toISOString(), db: docs, assets };
    },
    // Substitui tudo o que há no navegador pelo conteúdo do pacote.
    async importar(pacote) {
      if (!pacote || pacote.formato !== "audis-dados" || !pacote.db || typeof pacote.db !== "object") throw new Error("Este arquivo não é um pacote de dados do Audis.");
      const docs = Object.entries(pacote.db);
      if (!docs.some(([p]) => p.startsWith("pages/"))) throw new Error("O pacote não tem o acervo principal (pages). Nada foi alterado.");
      const assets = Object.entries(pacote.assets || {}).map(([id, a]) => [id, { tipo: a.tipo, dados: deBase64(a.base64), criado: new Date().toISOString() }]);
      const db = await abrir();
      await new Promise((ok, no) => {
        const t = db.transaction(["docs", "assets"], "readwrite");
        const d = t.objectStore("docs"), a = t.objectStore("assets");
        d.clear(); a.clear();
        for (const [p, v] of docs) d.put(v, p);
        for (const [id, v] of assets) a.put(v, id);
        t.oncomplete = ok;
        t.onerror = t.onabort = () => no(t.error || new Error("falha ao gravar no navegador"));
      });
      return { docs: docs.length, assets: assets.length };
    },
  };

  function paraBase64(buf) {
    const b = new Uint8Array(buf); let s = "";
    for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function deBase64(t) {
    const s = atob(t), b = new Uint8Array(s.length);
    for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i);
    return b.buffer;
  }

  global.AudisArmazem = Armazem;
})(typeof self !== "undefined" ? self : window);
