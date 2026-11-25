  // Ouvir (módulo 35): leitura em voz alta com a voz do próprio aparelho (speechSynthesis do navegador).
  // Não usa IA, não usa a internet e não guarda nada no banco. Usado pela Teoria (módulo 31).
  // A fila é feita de frases curtas, porque alguns navegadores cortam falas longas; os parágrafos servem
  // para destacar o trecho na tela e para voltar/avançar. Pausar cancela a fala e guarda a posição
  // (o "pause" do navegador não funciona no Android).
  // Onde o servidor tem a chave da ElevenLabs (computador com .env, ou Vercel com a senha neste aparelho),
  // a leitura pode usar a voz dela: o app pede o áudio de um parágrafo de cada vez em /__voz (ia/voz.mjs)
  // e toca num <audio>. É pago por caractere; por isso o áudio de cada parágrafo fica guardado neste aparelho
  // (Cache API do navegador, "audis-voz-v1"): ouvir de novo o mesmo texto com a mesma voz não gasta nada.
  // Se o pedido falhar, a leitura segue com a voz do aparelho.
  // No claude.ai não há /__voz (a página não acessa a internet): lá só existe a voz do aparelho.
  // Preferências no aparelho: audis:ov { v: velocidade, voz: nome da voz, fonte: "el" | "ap" }.
  var __ovS = { on: !1, play: !1, tit: "", pars: [], fila: [], i: 0, gen: 0, dorme: 0, dormeMin: 0, tm: 0, err: "", fim: !1, listeners: new Set() };
  var __ovLSK = "audis:ov",
    __ovVels = [0.8, 1, 1.25, 1.5, 1.75, 2],
    __ovSonos = [0, 15, 30, 60];
  var __ovSrv = { ok: null, p: null, chave: "", cache: new Map() };
  var __ovGuarda = "audis-voz-v1",
    __ovGuardaMax = 1500;
  var __ovMudo = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
  function __ovAp() {
    return typeof window != "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance == "function";
  }
  function __ovOk() {
    return __ovAp() || !!__ovSrv.ok;
  }
  // pergunta uma vez ao servidor se há voz da ElevenLabs
  function __ovSrvInit() {
    __ovSrv.p ||= fetch("/__config")
      .then((r) => r.json())
      .then((c) => {
        __ovSrv.chave = String(c?.vozChave || "");
        __ovSrv.ok = c?.voz === !0;
      })
      .catch(() => (__ovSrv.ok = !1))
      .then(__ovEmit);
  }
  function __ovUsaEl() {
    return !!__ovSrv.ok && !__ovS.semEl && (__ovCfg().fonte !== "ap" || !__ovAp());
  }
  function __ovAudio() {
    return (__ovS.au ||= new Audio());
  }
  // onde o áudio de um trecho fica guardado no aparelho: muda com o texto, a voz e o modelo
  async function __ovGuardaChave(x, chave = __ovSrv.chave) {
    if (typeof caches == "undefined" || !globalThis.crypto?.subtle) return null;
    let d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(chave + "|" + x));
    return "/voz-guardada/" + Array.from(new Uint8Array(d), (b) => b.toString(16).padStart(2, "0")).join("");
  }
  // áudio de um trecho: o que já está guardado no aparelho ou, se não houver, um pedido à ElevenLabs
  async function __ovAudioDe(x) {
    let k = null,
      g = null;
    try {
      k = await __ovGuardaChave(x);
      g = k ? await caches.open(__ovGuarda) : null;
      let r = g ? await g.match(k) : null;
      if (g && !r && __ovSrv.chave) {
        // áudio guardado quando o aparelho ainda não sabia qual era a voz (logo depois de uma atualização do app,
        // o service worker antigo não informava): aproveita e passa para a chave certa, sem pedir de novo
        let k0 = await __ovGuardaChave(x, "");
        r = await g.match(k0);
        if (r) {
          await g.put(k, r.clone());
          await g.delete(k0);
        }
      }
      if (r) {
        let b = await r.blob();
        if (b.size) return b;
      }
    } catch {}
    let r = await fetch("/__voz", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text: x }) });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).message || "A voz da ElevenLabs não respondeu.");
    let b = await r.blob();
    if (g && b.size)
      try {
        await g.put(k, new Response(b, { headers: { "content-type": b.type || "audio/mpeg" } }));
        // limite do que fica guardado: ao passar dele, saem os trechos mais antigos
        let ks = await g.keys();
        if (ks.length > __ovGuardaMax) for (let q of ks.slice(0, ks.length - __ovGuardaMax + 100)) await g.delete(q);
      } catch {}
    return b;
  }
  // devolve o endereço local do áudio de um trecho (um pedido por trecho enquanto a leitura está aberta)
  function __ovBusca(x) {
    let c = __ovSrv.cache;
    if (!c.has(x))
      c.set(
        x,
        __ovAudioDe(x)
          .then((b) => URL.createObjectURL(b))
          .catch((e) => {
            c.delete(x);
            throw e;
          }),
      );
    return c.get(x);
  }
  function __ovEmit() {
    __ovS.listeners.forEach((f) => {
      try {
        f();
      } catch {}
    });
  }
  function __ovCfg() {
    try {
      let c = JSON.parse(__rdLS(__ovLSK, "null"));
      return { v: __ovVels.includes(c?.v) ? c.v : 1, voz: typeof c?.voz == "string" ? c.voz : "", fonte: c?.fonte === "ap" ? "ap" : "el" };
    } catch {
      return { v: 1, voz: "", fonte: "el" };
    }
  }
  function __ovSetCfg(p) {
    __rdSS(__ovLSK, JSON.stringify({ ...__ovCfg(), ...p }));
  }
  // vozes em português do aparelho, as do Brasil primeiro
  function __ovVozes() {
    try {
      return (__ovAp() ? speechSynthesis.getVoices() : [])
        .filter((v) => /^pt/i.test(v.lang))
        .sort((a, b) => /br/i.test(b.lang) - /br/i.test(a.lang) || a.name.localeCompare(b.name));
    } catch {
      return [];
    }
  }
  // texto como se fala: abre as abreviações mais comuns de texto jurídico
  function __ovFalado(t) {
    return String(t || "")
      .replace(/\{\{|\}\}/g, "")
      .replace(/\barts\.\s*/gi, "artigos ")
      .replace(/\bart\.\s*/gi, "artigo ")
      .replace(/§§\s*/g, "parágrafos ")
      .replace(/§\s*/g, "parágrafo ")
      .replace(/\bn[º°]\s*/gi, "número ")
      .replace(/\binc\.\s*/gi, "inciso ")
      .replace(/\bc\/c\b/gi, "combinado com")
      .replace(/\bp\.\s*ex\.\s*/gi, "por exemplo ")
      .replace(/\s+/g, " ")
      .trim();
  }
  function __ovFrases(t) {
    let out = [];
    for (let f of __ovFalado(t).match(/[^.!?;]+[.!?;]*["”’)\]]*\s*/g) || []) {
      f = f.trim();
      if (!f) continue;
      // frase muito longa: quebra nas vírgulas
      while (f.length > 240) {
        let k = f.lastIndexOf(",", 220);
        k < 60 && (k = f.lastIndexOf(" ", 220));
        if (k < 1) break;
        out.push(f.slice(0, k + 1).trim());
        f = f.slice(k + 1).trim();
      }
      // pedaço curto demais (ex.: "1.") vai junto com o anterior
      out.length && (f.length < 12 || out.at(-1).length < 12) && out.at(-1).length + f.length < 240
        ? (out[out.length - 1] += " " + f)
        : out.push(f);
    }
    return out;
  }
  // parágrafos da Teoria: o título de cada capítulo e os seus blocos. Os ids são os dos elementos na tela.
  function __ovDaTeoria(caps, titulo) {
    return caps.flatMap((c, i) => {
      let k = __teChave(c);
      return [
        { id: "te-h-" + k, cap: i, x: `Capítulo ${i + 1}. ${titulo(c)}.` },
        ...c.bl.map((b, j) => ({ id: "te-b-" + k + "-" + j, cap: i, x: (b.k === "c" ? "Complemento. " : "") + b.x })),
      ];
    });
  }
  // trechos para a ElevenLabs: o parágrafo inteiro (a entonação fica melhor), partido só se for muito longo
  function __ovPedacos(t) {
    let out = [""];
    for (let f of __ovFrases(t)) out.at(-1).length + f.length > 2000 ? out.push(f) : (out[out.length - 1] += (out.at(-1) ? " " : "") + f);
    return out.filter(Boolean);
  }
  // monta a fila conforme a voz em uso e posiciona no começo do parágrafo p
  function __ovMontar(p) {
    let S = __ovS,
      n = 0;
    S.el = __ovUsaEl();
    S.fila = S.pars.flatMap((q, pi) => (S.el ? __ovPedacos(q.x) : __ovFrases(q.x)).map((x) => ({ p: pi, x })));
    S.fila.forEach((f) => ((f.a = n), (n += f.x.length)));
    S.total = n;
    S.auI = -1;
    S.i = Math.max(0, S.fila.findIndex((f) => f.p >= p));
  }
  function __ovAbrir(tit, pars, cap) {
    let S = __ovS;
    S.pars = pars;
    S.tit = tit;
    S.on = !0;
    S.err = S.aviso = "";
    S.fim = S.semEl = !1;
    __ovMontar(Math.max(0, cap ? pars.findIndex((p) => p.cap === cap) : 0));
    if (S.el) {
      // libera o áudio dentro do toque do aluno (alguns celulares só tocam som iniciado por um toque)
      let a = __ovAudio();
      a.onended = a.onerror = null;
      a.src = __ovMudo;
      a.play().catch(() => {});
    }
    __ovTocar();
  }
  function __ovLigar(a, g) {
    let S = __ovS;
    a.onended = () => {
      if (g !== S.gen) return;
      S.i++;
      __ovEmit();
      __ovFalar();
    };
    a.onerror = () => g === S.gen && __ovSemEl("O áudio da ElevenLabs não tocou.");
  }
  // a ElevenLabs falhou: avisa e continua do mesmo parágrafo com a voz do aparelho
  function __ovSemEl(motivo) {
    let S = __ovS,
      p = S.fila[S.i]?.p ?? 0;
    S.carrega = !1;
    S.semEl = !0;
    __ovMontar(p);
    if (__ovAp()) {
      S.aviso = motivo + " A leitura segue com a voz do aparelho.";
      S.play ? __ovFalar() : __ovEmit();
    } else {
      S.play = !1;
      S.err = motivo;
      __ovEmit();
    }
  }
  function __ovFalarEl() {
    let S = __ovS,
      g = ++S.gen,
      f = S.fila[S.i],
      a = __ovAudio();
    a.pause();
    if (!f) {
      S.play = S.carrega = !1;
      S.fim = !0;
      S.i = 0;
      __ovEmit();
      return;
    }
    let i = S.i;
    S.carrega = !0;
    __ovEmit();
    __ovBusca(f.x)
      .then((url) => {
        if (g !== S.gen) return;
        S.carrega = !1;
        S.auI = i;
        a.src = url;
        a.playbackRate = __ovCfg().v;
        __ovLigar(a, g);
        __ovEmit();
        return a.play();
      })
      .catch((e) => {
        if (g !== S.gen) return;
        if (e?.name === "NotAllowedError") {
          S.play = S.carrega = !1;
          S.err = "Toque em ouvir para começar.";
          __ovEmit();
        } else __ovSemEl((e && e.message) || "A voz da ElevenLabs não respondeu.");
      });
    // adianta o próximo trecho para não haver silêncio entre os parágrafos
    S.fila[i + 1] && __ovBusca(S.fila[i + 1].x).catch(() => {});
  }
  function __ovFalar() {
    if (__ovS.el) return __ovFalarEl();
    let S = __ovS,
      g = ++S.gen,
      f = S.fila[S.i];
    if (!f) {
      S.play = !1;
      S.fim = !0;
      S.i = 0;
      __ovEmit();
      return;
    }
    let cfg = __ovCfg(),
      vozes = __ovVozes(),
      voz = vozes.find((v) => v.name === cfg.voz) || vozes[0] || null,
      u = new SpeechSynthesisUtterance(f.x);
    u.lang = voz ? voz.lang : "pt-BR";
    voz && (u.voice = voz);
    u.rate = cfg.v;
    u.onend = () => {
      if (g !== S.gen) return;
      S.i++;
      __ovEmit();
      __ovFalar();
    };
    u.onerror = (e) => {
      if (g !== S.gen || e.error === "interrupted" || e.error === "canceled") return;
      S.play = !1;
      S.err = "O aparelho não conseguiu ler em voz alta agora.";
      __ovEmit();
    };
    S.u = u; // alguns navegadores descartam a fala se não houver referência a ela
    try {
      if (speechSynthesis.speaking || speechSynthesis.pending) {
        speechSynthesis.cancel();
        setTimeout(() => g === S.gen && speechSynthesis.speak(u), 80);
      } else speechSynthesis.speak(u);
    } catch {
      S.play = !1;
      S.err = "O aparelho não conseguiu ler em voz alta agora.";
    }
    __ovEmit();
  }
  function __ovTocar() {
    let S = __ovS;
    S.play = !0;
    S.err = "";
    S.fim = !1;
    if (S.el && S.auI === S.i && !__ovAudio().ended) {
      // continua o áudio de onde parou
      let a = __ovAudio();
      __ovLigar(a, ++S.gen);
      a.playbackRate = __ovCfg().v;
      a.play().catch(() => {});
      __ovEmit();
    } else __ovFalar();
  }
  function __ovPausar() {
    __ovS.gen++;
    __ovS.play = __ovS.carrega = !1;
    __ovS.au?.pause();
    try {
      __ovAp() && speechSynthesis.cancel();
    } catch {}
    __ovEmit();
  }
  // vai para o início de um parágrafo (d = -1 anterior, +1 próximo). Voltar no meio de um parágrafo recomeça o mesmo.
  function __ovPular(d) {
    let S = __ovS,
      p = S.fila[S.i]?.p ?? 0,
      ini = S.fila.findIndex((f) => f.p === p),
      alvo = d < 0 ? (S.i > ini ? p : p - 1) : p + 1,
      k = S.fila.findIndex((f) => f.p >= alvo);
    if (d > 0 && k < 0) return;
    S.i = Math.max(0, k);
    S.fim = !1;
    S.play ? __ovFalar() : __ovEmit();
  }
  function __ovVel() {
    let v = __ovCfg().v;
    __ovSetCfg({ v: __ovVels[(__ovVels.indexOf(v) + 1) % __ovVels.length] });
    if (__ovS.el) {
      __ovAudio().playbackRate = __ovCfg().v;
      return __ovEmit();
    }
    __ovS.play ? __ovFalar() : __ovEmit();
  }
  function __ovSono() {
    let S = __ovS,
      m = __ovSonos[(__ovSonos.indexOf(S.dormeMin) + 1) % __ovSonos.length];
    clearTimeout(S.tm);
    S.dormeMin = m;
    S.dorme = m ? Date.now() + m * 6e4 : 0;
    m &&
      (S.tm = setTimeout(() => {
        S.dormeMin = 0;
        S.dorme = 0;
        __ovPausar();
      }, m * 6e4));
    __ovEmit();
  }
  function __ovFechar() {
    let S = __ovS;
    clearTimeout(S.tm);
    S.gen++;
    S.on = S.play = S.carrega = !1;
    S.dorme = S.dormeMin = 0;
    S.pars = [];
    S.fila = [];
    S.i = 0;
    if (S.au) {
      S.au.pause();
      S.au.onended = S.au.onerror = null;
      S.au.removeAttribute("src");
    }
    __ovSrv.cache.forEach((u) => u.then((x) => URL.revokeObjectURL(x)).catch(() => {}));
    __ovSrv.cache.clear();
    try {
      __ovAp() && speechSynthesis.cancel();
    } catch {}
    __ovEmit();
  }
  function __ovUse() {
    let [, f] = __rdR.useReducer((x) => x + 1, 0);
    __rdR.useEffect(() => {
      __ovS.listeners.add(f);
      __ovSrvInit();
      // as vozes chegam depois da página em alguns navegadores
      let ok = __ovAp();
      ok && speechSynthesis.addEventListener?.("voiceschanged", f);
      return () => {
        __ovS.listeners.delete(f);
        ok && speechSynthesis.removeEventListener?.("voiceschanged", f);
      };
    }, []);
  }
  function __ovIc(d, fill) {
    let h = __rdR.createElement;
    return h(
      "svg",
      {
        width: 22,
        height: 22,
        viewBox: "0 0 24 24",
        fill: fill ? "currentColor" : "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": !0,
      },
      d.map((x, i) => h("path", { key: i, d: x })),
    );
  }
  // botão que começa a leitura (cap: índice do capítulo; sem ele, do início)
  function __OVBtn({ tit, pars, cap, className, children }) {
    __ovUse();
    if (!__ovOk() || !pars.length) return null;
    return __rdR.createElement(
      "button",
      { type: "button", className, onClick: () => __ovAbrir(tit, pars, cap || 0) },
      children,
    );
  }
  // barra do leitor: fica presa ao fim da tela enquanto a leitura está aberta
  function __OVPlayer() {
    __ovUse();
    let h = __rdR.createElement,
      S = __ovS,
      f = S.fila[S.i],
      par = f ? S.pars[f.p] : null,
      pid = S.on && par ? par.id : "";
    __rdR.useEffect(() => () => __ovFechar(), []);
    __rdR.useEffect(() => {
      pid && S.play && document.getElementById(pid)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, [pid]);
    if (!S.on) return null;
    let cfg = __ovCfg(),
      vozes = __ovVozes(),
      caps = new Set(S.pars.map((p) => p.cap)).size,
      feito = S.fim ? 1 : f && S.total ? f.a / S.total : 0,
      seg = f && !S.fim ? (S.total - f.a) / (15 * cfg.v) : 0,
      resta = S.fim ? "Fim da leitura." : seg < 50 ? "menos de 1 min" : `cerca de ${Math.round(seg / 60) || 1} min`,
      css = pid && window.CSS?.escape ? `#${CSS.escape(pid)}{background:#eef1ea;box-shadow:-10px 0 0 #eef1ea,10px 0 0 #eef1ea,-13px 0 0 #516a43;border-radius:2px}` : "";
    return h(
      "div",
      { className: "ov", role: "region", "aria-label": "Leitura em voz alta" },
      css ? h("style", null, css) : null,
      h(
        "div",
        { className: "ov-top" },
        h(
          "span",
          { className: "ov-tit" },
          h("b", null, S.tit),
          par && caps > 1 ? h("small", null, "capítulo ", par.cap + 1, " de ", caps) : null,
        ),
        h(
          "button",
          { type: "button", className: "ov-ic", "aria-label": "Fechar a leitura", onClick: __ovFechar },
          __ovIc(["M18 6 6 18", "m6 6 12 12"]),
        ),
      ),
      h(
        "span",
        { className: "ov-bar", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": Math.round(feito * 100) },
        h("i", { style: { width: feito * 100 + "%" } }),
      ),
      h("span", { className: "ov-resta" }, S.err || (S.carrega ? "preparando a voz…" : resta)),
      S.aviso ? h("span", { className: "ov-resta" }, S.aviso) : null,
      h(
        "div",
        { className: "ov-ctl" },
        h(
          "button",
          { type: "button", className: "ov-txt", "aria-label": "Velocidade da leitura", onClick: __ovVel },
          String(cfg.v).replace(".", ","),
          "x",
        ),
        h(
          "button",
          { type: "button", className: "ov-ic", "aria-label": "Parágrafo anterior", onClick: () => __ovPular(-1) },
          __ovIc(["m17 18-6-6 6-6", "M7 6v12"]),
        ),
        h(
          "button",
          {
            type: "button",
            className: "ov-play",
            "aria-label": S.play ? "Pausar" : "Ouvir",
            onClick: () => (S.play ? __ovPausar() : __ovTocar()),
          },
          S.play ? __ovIc(["M7 5h3v14H7z", "M14 5h3v14h-3z"], !0) : __ovIc(["M8 5v14l11-7z"], !0),
        ),
        h(
          "button",
          { type: "button", className: "ov-ic", "aria-label": "Próximo parágrafo", onClick: () => __ovPular(1) },
          __ovIc(["m7 18 6-6-6-6", "M17 6v12"]),
        ),
        h(
          "button",
          { type: "button", className: "ov-txt" + (S.dormeMin ? " on" : ""), "aria-label": "Parar a leitura sozinha depois de um tempo", onClick: __ovSono },
          S.dormeMin ? `para em ${S.dormeMin} min` : "sem hora de parar",
        ),
      ),
      vozes.length + (__ovSrv.ok ? 1 : 0) > 1
        ? h(
            "label",
            { className: "ov-voz" },
            "Voz",
            h(
              "select",
              {
                value: S.el ? "@el" : (vozes.find((v) => v.name === cfg.voz) || vozes[0]).name,
                onChange: (e) => {
                  let v = e.target.value,
                    p = S.fila[S.i]?.p ?? 0;
                  v === "@el" ? __ovSetCfg({ fonte: "el" }) : __ovSetCfg({ fonte: "ap", voz: v });
                  S.semEl = !1;
                  S.aviso = "";
                  S.au?.pause();
                  __ovMontar(p);
                  S.play ? __ovFalar() : __ovEmit();
                },
              },
              __ovSrv.ok ? h("option", { value: "@el" }, "ElevenLabs (paga por uso)") : null,
              vozes.map((v) => h("option", { key: v.name, value: v.name }, v.name + (__ovSrv.ok ? " (do aparelho)" : ""))),
            ),
          )
        : !S.el && !vozes.length && speechSynthesis.getVoices().length
          ? h("span", { className: "ov-resta" }, "Este aparelho não tem voz em português instalada; a leitura pode sair com sotaque.")
          : null,
    );
  }
