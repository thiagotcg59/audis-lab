  // Ciclo de estudos (/ciclo): quadro visual por blocos de 25 minutos.
  // No topo, a fila da volta: cada disciplina tem um número de blocos por volta, espalhados na fila;
  // quando todos são feitos, a volta recomeça. Embaixo, o mapa do edital: uma coluna por disciplina,
  // com os assuntos e quantos blocos cada um já recebeu.
  // Coleção "ciclo", dois documentos:
  //   edital     { nome, discs: [{ id, n, grupo, q, peso, b (blocos por volta), as: [{ id, t }] }] }
  //   andamento  { volta, done: { "<id da disciplina>#<nº>": 1 }, cont: { <id do assunto>: n },
  //                tot: { <id da disciplina>: n }, log: [{ d, k, a, s, v }] }
  // Enquanto o aluno não mexe no edital, vale o de referência (__ciRef, módulo 32).
  var __ciStore = { ed: null, an: null, ready: !1, loaded: !1, listeners: new Set(), err: "" };
  var __ciLSK = "audis:ci",
    __ciTK = "audis:ci-timer",
    __ciMin = 25;
  function __ciEmit() {
    __ciStore.listeners.forEach((f) => {
      try {
        f();
      } catch {}
    });
  }
  function __ciLS() {
    try {
      localStorage.setItem(__ciLSK, JSON.stringify({ ed: __ciStore.ed, an: __ciStore.an }));
    } catch {}
  }
  function __ciInit() {
    if (__ciStore.ready) return;
    __ciStore.ready = !0;
    try {
      let v = JSON.parse(localStorage.getItem(__ciLSK) || "null");
      v && typeof v == "object" && ((__ciStore.ed = v.ed || null), (__ciStore.an = v.an || null));
    } catch {}
    (async () => {
      let db = await ka("db");
      if (!db) {
        __ciStore.loaded = !0;
        __ciEmit();
        return;
      }
      try {
        db.collection("ciclo")
          .limit(10)
          .onSnapshot(
            (snap) => {
              let pend = __ciStore.pend || {};
              for (let d of snap.docs) {
                if (!d.exists || pend[d.id]) continue;
                let x = d.data();
                d.id === "edital" && x && Array.isArray(x.discs) && (__ciStore.ed = x);
                d.id === "andamento" && x && typeof x == "object" && (__ciStore.an = x);
              }
              __ciStore.loaded = !0;
              __ciLS();
              __ciEmit();
            },
            () => {},
          );
      } catch {}
    })();
  }
  function __ciUse() {
    let [, f] = __rdR.useReducer((x) => x + 1, 0);
    __rdR.useEffect(() => {
      __ciInit();
      __ciStore.listeners.add(f);
      return () => {
        __ciStore.listeners.delete(f);
      };
    }, []);
  }
  function __ciSave(id, data) {
    __ciStore[id === "edital" ? "ed" : "an"] = data;
    (__ciStore.pend ||= {})[id] = (__ciStore.pend[id] || 0) + 1;
    __ciLS();
    __ciEmit();
    return __qdQueue("ci:" + id, async () => {
      try {
        let db = await ka("db");
        if (!db) throw { code: "unavailable" };
        await db.doc("ciclo/" + id).set({ ...__ciStore[id === "edital" ? "ed" : "an"], up: __qdNow() });
        __ciStore.err = "";
      } catch {
        __ciStore.err = "Não foi possível salvar agora. A mudança ficou neste aparelho e é salva de novo na próxima alteração.";
        __ciEmit();
      } finally {
        __ciStore.pend[id]--;
      }
    });
  }
  function __ciEd() {
    return __ciStore.ed || __ciRef;
  }
  function __ciAn() {
    let a = __ciStore.an || {};
    return { volta: a.volta || 1, done: a.done || {}, cont: a.cont || {}, tot: a.tot || {}, log: a.log || [] };
  }
  function __ciSetEd(fn) {
    let e = __ciEd();
    return __ciSave("edital", fn({ ...e, discs: e.discs.map((d) => ({ ...d, as: [...d.as] })) }));
  }
  function __ciId(p) {
    return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
  // fila de uma volta: os blocos de cada disciplina espalhados por igual ao longo da volta
  function __ciFila(discs) {
    let out = [];
    discs.forEach((d, i) => {
      let b = Math.max(0, Math.min(12, d.b | 0));
      for (let k = 0; k < b; k++) out.push({ key: d.id + "#" + k, k: d.id, pos: (k + 0.5) / b, i });
    });
    return out.sort((x, y) => x.pos - y.pos || x.i - y.i);
  }
  function __ciCor(i) {
    return `hsl(${(i * 47 + 95) % 360} 32% 42%)`;
  }
  function __ciHoras(blocos) {
    let m = blocos * __ciMin,
      h = Math.floor(m / 60);
    return h ? `${h}h${m % 60 ? String(m % 60).padStart(2, "0") : ""}` : `${m} min`;
  }
  // registra um bloco de 25 min feito. Sem `slot`, usa o primeiro bloco livre da disciplina na volta.
  function __ciFeito(discId, assId, slot) {
    let ed = __ciEd(),
      an = __ciAn(),
      fila = __ciFila(ed.discs),
      s = slot && !an.done[slot] ? slot : fila.find((x) => x.k === discId && !an.done[x.key])?.key || "",
      done = s ? { ...an.done, [s]: 1 } : an.done,
      cont = assId ? { ...an.cont, [assId]: (an.cont[assId] || 0) + 1 } : an.cont,
      tot = { ...an.tot, [discId]: (an.tot[discId] || 0) + 1 },
      log = [...an.log, { d: __qdNow(), k: discId, a: assId || "", s, v: an.volta }].slice(-400),
      fechou = fila.length > 0 && fila.every((x) => done[x.key]);
    __ciSave("andamento", { volta: fechou ? an.volta + 1 : an.volta, done: fechou ? {} : done, cont, tot, log });
    return fechou;
  }
  function __ciDesfazer() {
    let an = __ciAn(),
      u = an.log.at(-1);
    if (!u) return;
    let cont = { ...an.cont },
      tot = { ...an.tot },
      done = { ...an.done };
    u.a && cont[u.a] && (cont[u.a]--, cont[u.a] || delete cont[u.a]);
    tot[u.k] && (tot[u.k]--, tot[u.k] || delete tot[u.k]);
    u.s && u.v === an.volta && delete done[u.s];
    __ciSave("andamento", { ...an, done, cont, tot, log: an.log.slice(0, -1) });
  }
  // cronômetro: guardado no aparelho para continuar valendo se a página recarregar
  function __ciTimer() {
    try {
      let t = JSON.parse(localStorage.getItem(__ciTK) || "null");
      return t && t.k ? t : null;
    } catch {
      return null;
    }
  }
  function __ciSetTimer(t) {
    try {
      t ? localStorage.setItem(__ciTK, JSON.stringify(t)) : localStorage.removeItem(__ciTK);
    } catch {}
    __ciEmit();
  }
  function __ciAviso() {
    try {
      navigator.vibrate && navigator.vibrate([200, 100, 200]);
      let C = window.AudioContext || window.webkitAudioContext,
        c = new C();
      [0, 0.35, 0.7].forEach((t) => {
        let o = c.createOscillator(),
          g = c.createGain();
        o.frequency.value = 880;
        g.gain.setValueAtTime(0.0001, c.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.25, c.currentTime + t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t + 0.28);
        o.connect(g).connect(c.destination);
        o.start(c.currentTime + t);
        o.stop(c.currentTime + t + 0.3);
      });
      setTimeout(() => c.close().catch(() => {}), 1500);
    } catch {}
  }

  // Mapa mental de um assunto do edital: o mapa guarda `ci` (id do assunto). É criado na primeira vez
  // que o aluno pede para abrir o mapa ou a teoria do assunto, com o nome do assunto e a disciplina.
  function __ciMapaDe(assId) {
    return Object.values(__mpStore.items).find((m) => m && m.ci === assId && Array.isArray(m.pags)) || null;
  }
  // devolve o mapa do assunto, criando um vazio se ainda não existir (null enquanto os mapas não carregaram)
  function __ciMapaCriar(d, a) {
    let m = __ciMapaDe(a.id);
    if (!m) {
      if (!__mpStore.loaded) return null;
      let nome = a.t
        .replace(/^\s*\d+(\.\d+)*\.?\s+/, "")
        .replace(/\s+/g, " ")
        .trim();
      nome.length > 90
        ? (nome = nome.slice(0, 89).replace(/\s+\S*$/, "") + "…")
        : (nome = nome.replace(/\.$/, ""));
      m = { id: __mpId("m"), nome: nome || "Assunto do edital", disc: d.n.slice(0, 60), at: __qdNow(), pags: [], ci: a.id };
      __mpPut(m);
    }
    return m;
  }
  function __ciAbrir(d, a, rota) {
    let m = __ciMapaCriar(d, a);
    m && (location.hash = "#/" + rota + "?m=" + encodeURIComponent(m.id));
  }
  function __CIAtalhos({ d, a }) {
    let h = __rdR.createElement,
      m = __ciMapaDe(a.id),
      n = m ? __mpAllRamos(m).length : 0;
    return h(
      "div",
      { className: "ci-atalhos" },
      h(
        "button",
        { type: "button", className: "qd-btn", disabled: !m && !__mpStore.loaded, onClick: () => __ciAbrir(d, a, "mapas") },
        m ? "Abrir o mapa" : "Criar o mapa do assunto",
      ),
      h(
        "button",
        { type: "button", className: "qd-btn", disabled: !m && !__mpStore.loaded, onClick: () => __ciAbrir(d, a, "teoria") },
        "Abrir a teoria",
      ),
      h(
        "span",
        { className: "meta" },
        !m
          ? "O mapa é criado com o nome deste assunto."
          : n
            ? `Mapa com ${n} ${n === 1 ? "ramo" : "ramos"}.`
            : "Mapa criado. Envie as páginas nele para escrever a teoria.",
      ),
    );
  }

  // --- uma disciplina no mapa do edital ---
  function __CIDisc({ d, i, an, sel, onPick }) {
    let h = __rdR.createElement,
      [open, setOpen] = __rdR.useState(!1),
      [edit, setEdit] = __rdR.useState(!1),
      [conf, setConf] = __rdR.useState(!1),
      tot = an.tot[d.id] || 0,
      vistos = d.as.filter((a) => an.cont[a.id]).length,
      L = open || edit ? d.as : d.as.slice(0, 6),
      upd = (fn) => __ciSetEd((e) => ({ ...e, discs: e.discs.map((x) => (x.id === d.id ? fn(x) : x)) }));
    return h(
      "section",
      { className: "ci-disc", style: { "--ci": __ciCor(i) } },
      h(
        "header",
        null,
        edit
          ? h("input", {
              className: "ci-in",
              defaultValue: d.n,
              maxLength: 90,
              "aria-label": "Nome da disciplina",
              onBlur: (e) => {
                let n = e.target.value.trim();
                n && n !== d.n && upd((x) => ({ ...x, n }));
              },
            })
          : h("b", null, d.n),
        h(
          "span",
          { className: "meta" },
          tot === 1 ? "1 bloco" : `${tot} blocos`,
          tot ? ` · ${__ciHoras(tot)}` : "",
          d.as.length ? ` · ${vistos} de ${d.as.length} assuntos vistos` : "",
        ),
        h(
          "div",
          { className: "ci-step" },
          h(
            "button",
            {
              type: "button",
              "aria-label": "Menos blocos por volta em " + d.n,
              disabled: (d.b | 0) <= 0,
              onClick: () => upd((x) => ({ ...x, b: Math.max(0, (x.b | 0) - 1) })),
            },
            "−",
          ),
          h("span", null, d.b | 0, (d.b | 0) === 1 ? " bloco por volta" : " blocos por volta"),
          h(
            "button",
            {
              type: "button",
              "aria-label": "Mais blocos por volta em " + d.n,
              disabled: (d.b | 0) >= 12,
              onClick: () => upd((x) => ({ ...x, b: Math.min(12, (x.b | 0) + 1) })),
            },
            "+",
          ),
        ),
      ),
      h(
        "ul",
        { className: "ci-as" },
        L.map((a) => {
          let n = an.cont[a.id] || 0;
          return h(
            "li",
            { key: a.id },
            edit
              ? h(
                  __rdR.Fragment,
                  null,
                  h("textarea", {
                    className: "ci-in",
                    defaultValue: a.t,
                    maxLength: 400,
                    rows: 2,
                    "aria-label": "Assunto",
                    onBlur: (e) => {
                      let t = e.target.value.replace(/\s+/g, " ").trim();
                      t && t !== a.t && upd((x) => ({ ...x, as: x.as.map((y) => (y.id === a.id ? { ...y, t } : y)) }));
                    },
                  }),
                  h(
                    "button",
                    {
                      type: "button",
                      className: "ci-x",
                      "aria-label": "Excluir o assunto",
                      onClick: () => upd((x) => ({ ...x, as: x.as.filter((y) => y.id !== a.id) })),
                    },
                    "✕",
                  ),
                )
              : h(
                  "button",
                  {
                    type: "button",
                    className: "ci-a" + (sel.k === d.id && sel.a === a.id ? " on" : ""),
                    onClick: () => onPick(d.id, a.id),
                    title: "Estudar este assunto no próximo bloco",
                  },
                  h(
                    "span",
                    { className: "ci-sq", "aria-label": n === 1 ? "1 bloco feito" : `${n} blocos feitos` },
                    n
                      ? Array.from({ length: Math.min(n, 6) }, (_, j) => h("i", { key: j, className: "f" }))
                      : h("i", null),
                    n > 6 ? h("small", null, "+", n - 6) : null,
                  ),
                  h(
                    "span",
                    { className: "ci-t" },
                    a.t,
                    __ciMapaDe(a.id) ? h("small", { className: "ci-tem" }, " · tem mapa") : null,
                  ),
                ),
          );
        }),
      ),
      edit
        ? h(
            "div",
            { className: "mm-btns ci-edit" },
            h(
              "button",
              {
                type: "button",
                className: "qd-btn",
                onClick: () => upd((x) => ({ ...x, as: [...x.as, { id: __ciId("a"), t: "Novo assunto" }] })),
              },
              "+ Assunto",
            ),
            conf
              ? h(
                  "span",
                  { className: "qd-conf" },
                  "Excluir a disciplina? ",
                  h(
                    "button",
                    {
                      type: "button",
                      className: "qd-btn danger",
                      onClick: () => __ciSetEd((e) => ({ ...e, discs: e.discs.filter((x) => x.id !== d.id) })),
                    },
                    "Excluir",
                  ),
                  h("button", { type: "button", className: "qd-btn", onClick: () => setConf(!1) }, "Cancelar"),
                )
              : h("button", { type: "button", className: "qd-btn", onClick: () => setConf(!0) }, "Excluir disciplina"),
            h("button", { type: "button", className: "qd-btn pri", onClick: () => setEdit(!1) }, "Pronto"),
          )
        : h(
            "div",
            { className: "ci-foot" },
            d.as.length > 6
              ? h(
                  "button",
                  { type: "button", className: "text-link", onClick: () => setOpen(!open) },
                  open ? "mostrar menos" : `ver os ${d.as.length} assuntos`,
                )
              : h("span", null),
            h("button", { type: "button", className: "text-link", onClick: () => setEdit(!0) }, "editar"),
          ),
    );
  }

  // --- tela Ciclo ---
  function __CI() {
    __ciUse();
    __mpUse();
    let h = __rdR.createElement,
      ed = __ciEd(),
      an = __ciAn(),
      fila = __ciFila(ed.discs),
      feitos = fila.filter((x) => an.done[x.key]).length,
      prox = fila.find((x) => !an.done[x.key]),
      timer = __ciTimer(),
      [pick, setPick] = __rdR.useState(null),
      [, tick] = __rdR.useReducer((x) => x + 1, 0),
      [msg, setMsg] = __rdR.useState(""),
      [confRef, setConfRef] = __rdR.useState(!1),
      byId = new Map(ed.discs.map((d, i) => [d.id, { d, i }])),
      sel = timer
        ? { k: timer.k, a: timer.a || "", s: timer.s || "" }
        : pick && byId.has(pick.k)
          ? pick
          : { k: prox?.k || ed.discs[0]?.id || "", a: "", s: prox?.key || "" },
      cur = byId.get(sel.k),
      resta = timer ? (timer.fim ? Math.max(0, timer.fim - Date.now()) : timer.resta) : __ciMin * 6e4,
      hoje = ot(new Date()),
      nHoje = an.log.filter((l) => ot(new Date(l.d)) === hoje).length,
      total = Object.values(an.tot).reduce((n, x) => n + x, 0);
    // relógio: confere o fim também ao voltar para a página, porque o navegador pausa o intervalo em segundo plano
    __rdR.useEffect(() => {
      if (!timer || !timer.fim) return;
      let fim = () => {
        let t = __ciTimer();
        if (!t || !t.fim) return;
        if (Date.now() >= t.fim) {
          __ciSetTimer(null);
          let fechou = __ciFeito(t.k, t.a, t.s);
          __ciAviso();
          setPick(null);
          setMsg(fechou ? "Bloco concluído. Você fechou a volta do ciclo!" : "Bloco de 25 minutos concluído.");
        } else tick();
      };
      let id = setInterval(fim, 500),
        lock = null;
      document.addEventListener("visibilitychange", fim);
      navigator.wakeLock
        ?.request("screen")
        .then((l) => (lock = l))
        .catch(() => {});
      return () => {
        clearInterval(id);
        document.removeEventListener("visibilitychange", fim);
        lock?.release().catch(() => {});
      };
    }, [timer?.fim]);
    let mm = String(Math.floor(resta / 6e4)).padStart(2, "0"),
      ss = String(Math.floor((resta % 6e4) / 1e3)).padStart(2, "0"),
      marcar = () => {
        let fechou = __ciFeito(sel.k, sel.a, sel.s);
        __ciSetTimer(null);
        setPick(null);
        setMsg(fechou ? "Bloco marcado. Você fechou a volta do ciclo!" : "Bloco marcado como feito.");
      },
      ass = cur ? cur.d.as.find((a) => a.id === sel.a) : null;
    return h(
      "main",
      { className: "page mp ci" },
      h(
        "div",
        { className: "page-intro" },
        h("div", { className: "small-label" }, "CICLO DE ESTUDOS · BLOCOS DE ", __ciMin, " MINUTOS"),
        h("h1", null, "Ciclo"),
        h(
          "p",
          null,
          ed.nome || "Seu edital",
          " · volta ",
          an.volta,
          " · hoje: ",
          nHoje === 1 ? "1 bloco" : `${nHoje} blocos`,
          nHoje ? ` (${__ciHoras(nHoje)})` : "",
          " · no total: ",
          total === 1 ? "1 bloco" : `${total} blocos`,
          total ? ` (${__ciHoras(total)})` : "",
        ),
      ),
      __ciStore.err ? h("p", { className: "understood-error", role: "alert" }, __ciStore.err) : null,
      !ed.discs.length
        ? h(
            "div",
            { className: "qd-empty" },
            h("b", null, "O edital está vazio."),
            h("p", null, "Crie uma disciplina para montar o ciclo, ou recarregue o edital de referência no fim da página."),
          )
        : h(
            "section",
            { className: "ci-now" + (timer ? " run" : ""), style: { "--ci": cur ? __ciCor(cur.i) : "#35432e" } },
            h("span", { className: "small-label" }, timer ? (timer.fim ? "ESTUDANDO AGORA" : "PAUSADO") : "PRÓXIMO BLOCO"),
            timer
              ? h(
                  __rdR.Fragment,
                  null,
                  h("div", { className: "ci-clock", role: "timer", "aria-live": "off" }, mm, ":", ss),
                  h("b", { className: "ci-now-d" }, cur?.d.n || "Disciplina"),
                  ass ? h("p", { className: "ci-now-a" }, ass.t) : null,
                  ass ? h(__CIAtalhos, { d: cur.d, a: ass }) : null,
                  h(
                    "div",
                    { className: "mm-btns" },
                    timer.fim
                      ? h(
                          "button",
                          {
                            type: "button",
                            className: "qd-btn pri",
                            onClick: () => __ciSetTimer({ ...timer, fim: null, resta: Math.max(0, timer.fim - Date.now()) }),
                          },
                          "Pausar",
                        )
                      : h(
                          "button",
                          {
                            type: "button",
                            className: "qd-btn pri",
                            onClick: () => __ciSetTimer({ ...timer, fim: Date.now() + timer.resta, resta: 0 }),
                          },
                          "Continuar",
                        ),
                    h("button", { type: "button", className: "qd-btn", onClick: marcar }, "Concluir agora"),
                    h(
                      "button",
                      {
                        type: "button",
                        className: "qd-btn",
                        onClick: () => {
                          __ciSetTimer(null);
                          setMsg("Bloco cancelado. Nada foi marcado.");
                        },
                      },
                      "Cancelar",
                    ),
                  ),
                )
              : h(
                  __rdR.Fragment,
                  null,
                  h(
                    "div",
                    { className: "ci-pick" },
                    h(
                      "label",
                      null,
                      "Disciplina",
                      h(
                        "select",
                        {
                          value: sel.k,
                          onChange: (e) => {
                            setPick({ k: e.target.value, a: "", s: "" });
                            setMsg("");
                          },
                        },
                        ed.discs.map((d) => h("option", { key: d.id, value: d.id }, d.n)),
                      ),
                    ),
                    h(
                      "label",
                      null,
                      "Assunto",
                      h(
                        "select",
                        { value: sel.a, onChange: (e) => setPick({ ...sel, a: e.target.value }) },
                        h("option", { value: "" }, "sem assunto definido"),
                        (cur?.d.as || []).map((a) =>
                          h("option", { key: a.id, value: a.id }, a.t.length > 90 ? a.t.slice(0, 90) + "…" : a.t),
                        ),
                      ),
                    ),
                  ),
                  ass ? h(__CIAtalhos, { d: cur.d, a: ass }) : null,
                  h(
                    "div",
                    { className: "mm-btns" },
                    h(
                      "button",
                      {
                        type: "button",
                        className: "qd-btn pri",
                        disabled: !sel.k,
                        onClick: () => {
                          setMsg("");
                          __ciSetTimer({ k: sel.k, a: sel.a, s: sel.s, fim: Date.now() + __ciMin * 6e4, resta: 0 });
                        },
                      },
                      "Começar ",
                      __ciMin,
                      " min",
                    ),
                    h(
                      "button",
                      { type: "button", className: "qd-btn", disabled: !sel.k, onClick: marcar },
                      "Marcar como feito",
                    ),
                  ),
                ),
            msg
              ? h(
                  "p",
                  { className: "ci-msg", role: "status" },
                  msg,
                  /conclu|marcado/.test(msg) && an.log.length
                    ? h(
                        __rdR.Fragment,
                        null,
                        " ",
                        h(
                          "button",
                          {
                            type: "button",
                            className: "text-link",
                            onClick: () => {
                              __ciDesfazer();
                              setMsg("Último bloco desfeito.");
                            },
                          },
                          "desfazer",
                        ),
                      )
                    : null,
                )
              : null,
          ),
      fila.length
        ? h(
            "section",
            { className: "ci-volta" },
            h(
              "div",
              { className: "ci-volta-h" },
              h("span", { className: "small-label" }, "VOLTA ", an.volta),
              h("span", { className: "meta" }, feitos, " de ", fila.length, " blocos · ", __ciHoras(fila.length), " por volta"),
            ),
            h("span", { className: "mp-bar" }, h("i", { style: { width: (feitos / fila.length) * 100 + "%" } })),
            h(
              "ol",
              { className: "ci-fila" },
              fila.map((x) => {
                let it = byId.get(x.k),
                  ok = !!an.done[x.key];
                return h(
                  "li",
                  { key: x.key },
                  h(
                    "button",
                    {
                      type: "button",
                      className: (ok ? "ok" : "") + (!ok && sel.s === x.key ? " on" : ""),
                      style: { "--ci": __ciCor(it.i) },
                      disabled: ok || !!timer,
                      title: it.d.n + (ok ? " · feito" : ""),
                      onClick: () => {
                        setPick({ k: x.k, a: "", s: x.key });
                        setMsg("");
                      },
                    },
                    it.d.n,
                  ),
                );
              }),
            ),
          )
        : ed.discs.length
          ? h("p", { className: "meta" }, "Nenhuma disciplina tem blocos na volta. Use o + em uma disciplina abaixo.")
          : null,
      h(
        "section",
        { className: "ci-mapa" },
        h("span", { className: "small-label" }, "MAPA DO EDITAL"),
        h(
          "p",
          { className: "meta" },
          "Toque em um assunto para estudá-lo no próximo bloco. Cada quadradinho cheio é um bloco de ",
          __ciMin,
          " minutos feito.",
        ),
        h(
          "div",
          { className: "ci-grid" },
          ed.discs.map((d, i) =>
            h(__CIDisc, {
              key: d.id,
              d,
              i,
              an,
              sel,
              onPick: (k, a) => {
                if (timer) return;
                setPick({ k, a, s: fila.find((x) => x.k === k && !an.done[x.key])?.key || "" });
                setMsg("");
                document.querySelector(".ci-now")?.scrollIntoView({ behavior: "smooth", block: "start" });
              },
            }),
          ),
        ),
        h(
          "div",
          { className: "mm-btns ci-acts" },
          h(
            "button",
            {
              type: "button",
              className: "qd-btn",
              onClick: () =>
                __ciSetEd((e) => ({ ...e, discs: [...e.discs, { id: __ciId("d"), n: "Nova disciplina", b: 1, as: [] }] })),
            },
            "+ Disciplina",
          ),
          __ciStore.ed
            ? confRef
              ? h(
                  "span",
                  { className: "qd-conf" },
                  "Trocar o seu edital pelo de referência? Os blocos já feitos ficam. ",
                  h(
                    "button",
                    {
                      type: "button",
                      className: "qd-btn danger",
                      onClick: () => {
                        __ciSave("edital", JSON.parse(JSON.stringify(__ciRef)));
                        setConfRef(!1);
                      },
                    },
                    "Trocar",
                  ),
                  h("button", { type: "button", className: "qd-btn", onClick: () => setConfRef(!1) }, "Cancelar"),
                )
              : h(
                  "button",
                  { type: "button", className: "qd-btn", onClick: () => setConfRef(!0) },
                  "Recarregar o edital de referência",
                )
            : null,
        ),
        __ciRef.fonte ? h("p", { className: "meta ci-fonte" }, "Edital de referência: ", __ciRef.fonte) : null,
      ),
    );
  }
