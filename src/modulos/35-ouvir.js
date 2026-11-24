  // Ouvir (módulo 35): leitura em voz alta com a voz do próprio aparelho (speechSynthesis do navegador).
  // Não usa IA, não usa a internet e não guarda nada no banco. Usado pela Teoria (módulo 31).
  // A fila é feita de frases curtas, porque alguns navegadores cortam falas longas; os parágrafos servem
  // para destacar o trecho na tela e para voltar/avançar. Pausar cancela a fala e guarda a posição
  // (o "pause" do navegador não funciona no Android).
  // Preferências no aparelho: audis:ov { v: velocidade, voz: nome da voz }.
  var __ovS = { on: !1, play: !1, tit: "", pars: [], fila: [], i: 0, gen: 0, dorme: 0, dormeMin: 0, tm: 0, err: "", fim: !1, listeners: new Set() };
  var __ovLSK = "audis:ov",
    __ovVels = [0.8, 1, 1.25, 1.5, 1.75, 2],
    __ovSonos = [0, 15, 30, 60];
  function __ovOk() {
    return typeof window != "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance == "function";
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
      return { v: __ovVels.includes(c?.v) ? c.v : 1, voz: typeof c?.voz == "string" ? c.voz : "" };
    } catch {
      return { v: 1, voz: "" };
    }
  }
  function __ovSetCfg(p) {
    __rdSS(__ovLSK, JSON.stringify({ ...__ovCfg(), ...p }));
  }
  // vozes em português do aparelho, as do Brasil primeiro
  function __ovVozes() {
    try {
      return speechSynthesis
        .getVoices()
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
  function __ovAbrir(tit, pars, cap) {
    let S = __ovS;
    S.pars = pars;
    S.fila = pars.flatMap((p, pi) => __ovFrases(p.x).map((x) => ({ p: pi, x })));
    let n = 0;
    S.fila.forEach((f) => ((f.a = n), (n += f.x.length)));
    S.total = n;
    S.tit = tit;
    S.on = !0;
    S.err = "";
    S.fim = !1;
    S.i = Math.max(0, cap ? S.fila.findIndex((f) => pars[f.p].cap === cap) : 0);
    __ovTocar();
  }
  function __ovFalar() {
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
    __ovS.play = !0;
    __ovS.err = "";
    __ovS.fim = !1;
    __ovFalar();
  }
  function __ovPausar() {
    __ovS.gen++;
    __ovS.play = !1;
    try {
      speechSynthesis.cancel();
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
    S.on = S.play = !1;
    S.dorme = S.dormeMin = 0;
    S.pars = [];
    S.fila = [];
    S.i = 0;
    try {
      __ovOk() && speechSynthesis.cancel();
    } catch {}
    __ovEmit();
  }
  function __ovUse() {
    let [, f] = __rdR.useReducer((x) => x + 1, 0);
    __rdR.useEffect(() => {
      __ovS.listeners.add(f);
      // as vozes chegam depois da página em alguns navegadores
      let ok = __ovOk();
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
      h("span", { className: "ov-resta" }, S.err || resta),
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
      vozes.length > 1
        ? h(
            "label",
            { className: "ov-voz" },
            "Voz",
            h(
              "select",
              {
                value: (vozes.find((v) => v.name === cfg.voz) || vozes[0]).name,
                onChange: (e) => {
                  __ovSetCfg({ voz: e.target.value });
                  S.play ? __ovFalar() : __ovEmit();
                },
              },
              vozes.map((v) => h("option", { key: v.name, value: v.name }, v.name)),
            ),
          )
        : !vozes.length && speechSynthesis.getVoices().length
          ? h("span", { className: "ov-resta" }, "Este aparelho não tem voz em português instalada; a leitura pode sair com sotaque.")
          : null,
    );
  }
