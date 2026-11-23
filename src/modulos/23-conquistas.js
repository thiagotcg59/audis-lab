var __cqSK = "magis:cq-stars",
    __cqFK = "magis:cq-filter";
  function __cqTerr(state) {
    let rows = new Map(),
      order = [],
      now = ot(new Date());
    for (let s of state.material) {
      if (s.deletedAt) continue;
      let p = __rdPath(s),
        id = JSON.stringify(p.map(Z)),
        r = rows.get(id);
      if (!r) {
        r = {
          id,
          subject: p[0],
          theme: p.length >= 3 ? p[1] : "",
          label: p[p.length - 1],
          deep: p.length >= 3,
          sections: [],
          counts: [0, 0, 0, 0],
          today: 0,
        };
        rows.set(id, r);
        order.push(r);
      }
      r.sections.push(s);
      for (let hl of s.highlights) {
        let k = __utKey(hl);
        r.counts[["understood", "partial", "not_understood", "none"].indexOf(k)]++;
        if (hl.understanding === "understood" && hl.understandingAt && ot(hl.understandingAt) === now)
          r.today++;
      }
    }
    for (let r of order) {
      r.total = r.counts.reduce((a, b) => a + b, 0);
      r.pct = r.total ? Math.round((r.counts[0] * 100) / r.total) : 0;
      r.star = r.total > 0 && (r.counts[0] * 100) / r.total >= 80;
      r.need = r.total ? Math.max(0, Math.ceil(r.total * 0.8) - r.counts[0]) : 0;
    }
    return order;
  }
  function __cqTodayN(state) {
    try {
      return __cqTerr(state).filter((r) => r.today > 0).length;
    } catch {
      return 0;
    }
  }
  function __cqMedals(state) {
    let since = Date.now() - 7 * 864e5,
      inWeek = (d) => {
        let t = Date.parse(d);
        return Number.isFinite(t) && t >= since;
      };
    let days = new Set(
      Fb(state)
        .filter((x) => x.time >= since)
        .map((x) => x.day),
    ).size;
    let grifos = 0;
    for (let s of state.material)
      if (!s.deletedAt)
        for (let hl of s.highlights)
          hl.understanding === "understood" && hl.understandingAt && inWeek(hl.understandingAt) && grifos++;
    let recalls = 0;
    for (let e of state.errors) for (let r of e.reviews ?? []) r.recalled && inWeek(r.date) && recalls++;
    return [
      {
        key: "dias",
        icon: "7",
        title: "Semana cheia",
        goal: 5,
        n: days,
        text: (n, g) =>
          n >= g
            ? `respondeu questões em ${n} dos últimos 7 dias`
            : `${n} de ${g} dias com questões · faltam ${g - n}`,
      },
      {
        key: "grifos",
        icon: "✓",
        title: "Grifos em dia",
        goal: 10,
        n: grifos,
        text: (n, g) =>
          n >= g
            ? `${n} grifos marcados como Entendido em 7 dias`
            : `${n} de ${g} grifos entendidos na semana`,
      },
      {
        key: "virada",
        icon: "★",
        title: "Virada",
        goal: 3,
        n: recalls,
        text: (n, g) =>
          n >= g ? `lembrou ${n} erros do caderno na revisão` : `${n} de ${g} erros lembrados na revisão`,
      },
    ];
  }
  function __CQ() {
    let h = __rdR.createElement,
      { state: e, service: t } = W();
    let [flt, setFlt] = __rdR.useState(() => __rdLS(__cqFK, "todas")),
      [toast, setToast] = __rdR.useState(null);
    let terr = __rdR.useMemo(() => __cqTerr(e), [e]),
      st = t.statistics();
    __rdR.useEffect(() => {
      if (!t.repository.getSync?.()?.loaded) return;
      let cur = terr.filter((r) => r.star).map((r) => r.id),
        prev = null;
      try {
        prev = JSON.parse(localStorage.getItem(__cqSK) || "null");
      } catch {}
      if (Array.isArray(prev)) {
        let ps = new Set(prev),
          nw = terr.filter((r) => r.star && !ps.has(r.id));
        nw.length && setToast(nw.slice(0, 3));
      }
      try {
        localStorage.setItem(__cqSK, JSON.stringify(cur));
      } catch {}
    }, [terr]);
    let withG = terr.filter((r) => r.total > 0),
      stars = terr.filter((r) => r.star).length,
      tot = [0, 1, 2, 3].map((i) => terr.reduce((a, r) => a + r.counts[i], 0)),
      T = tot.reduce((a, b) => a + b, 0),
      P = tot.map((c) => (T ? Math.round((c * 100) / T) : 0));
    let todayG = terr.reduce((a, r) => a + r.today, 0),
      todayT = terr.filter((r) => r.today > 0).length;
    let xpIn = st.xp % 100,
      toNext = 100 - xpIn;
    let subjects = [];
    for (let r of terr) {
      let g = subjects.find((x) => x.name === r.subject);
      g || ((g = { name: r.subject, rows: [] }), subjects.push(g));
      g.rows.push(r);
    }
    subjects.sort(
      (a, b) =>
        b.rows.reduce((x, r) => x + r.total, 0) - a.rows.reduce((x, r) => x + r.total, 0) ||
        a.name.localeCompare(b.name, "pt-BR"),
    );
    let next = withG
      .filter((r) => !r.star && r.need > 0)
      .sort((a, b) => a.need - b.need || b.total - a.total)
      .slice(0, 3);
    let medals = __cqMedals(e);
    __fcInit();
    let [, fcTick] = __rdR.useReducer((x) => x + 1, 0);
    __rdR.useEffect(() => {
      __fcStore.listeners.add(fcTick);
      return () => {
        __fcStore.listeners.delete(fcTick);
      };
    }, []);
    let now = ot(new Date()),
      fcS = __fcStore.srs,
      fcCards = __fcCards(e),
      fc = { tot: fcCards.length, res: 0, ans: 0, today: 0, u: 0, p: 0, n: 0 },
      fcT = new Map();
    for (let c of fcCards) {
      let x = fcS[c.id];
      if (!x || !fc.hasOwnProperty(x.r)) continue;
      fc.res++;
      fc.ans += x.n || 1;
      x.t && ot(x.t) === now && fc.today++;
      fc[x.r]++;
      let m = fcT.get(c.deck);
      m || fcT.set(c.deck, (m = { u: 0, p: 0, n: 0 }));
      m[x.r]++;
    }
    let fcPct = (k) => (fc.res ? Math.round((fc[k] * 100) / fc.res) : 0);
    let qd = __rdR.useMemo(() => {
      let m = new Map(),
        tot = { n: 0, ok: 0, bad: 0, today: 0 };
      try {
        let d = __rdData(e, t, 0);
        for (let r of d.rows) {
          let x = { n: r.qs.size, ok: 0, bad: 0, today: 0, keys: new Set(r.qs.keys()) };
          for (let q of r.qs.values()) {
            q.answeredCorrectly === !0 ? x.ok++ : q.answeredCorrectly === !1 && x.bad++;
            q.date && ot(q.date) === now && x.today++;
          }
          m.set(r.id, x);
        }
        for (let q of d.qs) {
          tot.n++;
          q.answeredCorrectly === !0 ? tot.ok++ : q.answeredCorrectly === !1 && tot.bad++;
          q.date && ot(q.date) === now && tot.today++;
        }
      } catch {}
      return { m, tot };
    }, [e]);
    let [qsort, setQsort] = __rdR.useState(() => __rdLS("magis:cq-qsort", "materia")),
      pickQ = (v) => {
        setQsort(v);
        __rdSS("magis:cq-qsort", v);
      };
    let qOf = (r) => qd.m.get(r.id) || { n: 0, ok: 0, bad: 0, today: 0 },
      qAcc = (x) => (x.ok + x.bad ? Math.round((x.ok * 100) / (x.ok + x.bad)) : 0);
    let qRank = terr
        .filter((r) => qOf(r).n > 0)
        .sort((a, b) => qOf(b).n - qOf(a).n || a.label.localeCompare(b.label, "pt-BR")),
      qMax = qRank.length ? qOf(qRank[0]).n : 1;
    let qLow = terr
      .filter((r) => r.total > 0 && qOf(r).n <= 2)
      .sort((a, b) => qOf(a).n - qOf(b).n || b.total - a.total);
    let pick = (v) => {
      setFlt(v);
      __rdSS(__cqFK, v);
    };
    let cats = [
      ["u", "Entendido"],
      ["p", "Parcialmente"],
      ["n", "Não entendido"],
      ["o", "Sem marcação"],
    ];
    let tile = (r) => {
      if (!r.total)
        return h(
          re,
          { key: r.id, href: __rdLink(r), className: "cq-tile cq-empty" },
          h("span", { className: "cq-name" }, r.label),
          r.theme ? h("small", { className: "cq-theme" }, r.theme) : null,
          h("span", { className: "cq-none" }, "sem grifos ainda"),
        );
      return h(
        re,
        {
          key: r.id,
          href: __rdLink(r),
          className: "cq-tile" + (r.star ? " cq-dom" : "") + (r.today ? " cq-glow" : ""),
          title: `${r.label}: ${cats.map(([, l], i) => `${l} ${r.counts[i]}`).join(" · ")}`,
        },
        r.today ? h("b", { className: "cq-up" }, "+", r.today, " hoje") : null,
        r.star ? h("i", { className: "cq-star", "aria-label": "80% ou mais entendido" }, "★") : null,
        h("span", { className: "cq-name" }, r.label),
        r.theme ? h("small", { className: "cq-theme" }, r.theme) : null,
        h("span", { className: "cq-pct" }, h("b", null, r.pct, "%"), " entendido"),
        h(
          "span",
          {
            className: "cq-band",
            role: "img",
            "aria-label": cats.map(([, l], i) => `${l} ${r.counts[i]}`).join(", "),
          },
          cats.map(([k], i) =>
            r.counts[i] ? h("i", { key: k, className: "b-" + k, style: { flexGrow: r.counts[i] } }) : null,
          ),
        ),
        h(
          "span",
          { className: "cq-counts" },
          r.counts[0],
          " de ",
          r.total,
          " ",
          r.total === 1 ? "grifo" : "grifos",
        ),
        ((x) =>
          h(
            "span",
            {
              className: "cq-qline" + (x.n ? "" : " none"),
              title: x.n
                ? `${x.n} questões: ${x.ok} certas, ${x.bad} erradas`
                : "Nenhuma questão ligada a este subtema",
            },
            x.n
              ? h(
                  __rdR.Fragment,
                  null,
                  h("b", null, x.n),
                  " ",
                  x.n === 1 ? "questão" : "questões",
                  h(
                    "i",
                    { className: "cq-qbar" },
                    x.ok ? h("i", { className: "q-ok", style: { flexGrow: x.ok } }) : null,
                    x.bad ? h("i", { className: "q-bad", style: { flexGrow: x.bad } }) : null,
                  ),
                  qAcc(x),
                  "% certas",
                  x.today ? h("em", null, "+", x.today, " hoje") : null,
                )
              : "nenhuma questão ainda",
          ))(qOf(r)),
        ((m) =>
          m
            ? h(
                "span",
                {
                  className: "cq-fcline",
                  title: `Flashcards: ${m.u} consolidados, ${m.p} parcialmente consolidados, ${m.n} não consolidados`,
                  "aria-label": `Flashcards: ${m.u} consolidados, ${m.p} parcialmente consolidados, ${m.n} não consolidados`,
                },
                "Flashcards",
                h("i", { className: "fc-c3" }),
                m.u,
                h("i", { className: "fc-c2" }),
                m.p,
                h("i", { className: "fc-c1" }),
                m.n,
              )
            : null)(fcT.get(r.id)),
      );
    };
    return h(
      "main",
      { className: "page cq-page" },
      h(
        "div",
        { className: "page-intro" },
        h("div", { className: "small-label" }, "CADA DIA CONTA"),
        h("h1", null, "Seu mapa de conquista"),
        h(
          "p",
          null,
          "Cada subtema vira um território. A cor mostra o quanto você já entendeu dos grifos dele.",
        ),
      ),
      toast
        ? h(
            "div",
            { className: "cq-toast", role: "status" },
            h(
              "div",
              { className: "cq-confetti", "aria-hidden": "true" },
              [0, 1, 2, 3, 4, 5, 6, 7].map((i) => h("i", { key: i })),
            ),
            h("span", { className: "cq-toast-star" }, "★"),
            h(
              "div",
              null,
              h(
                "strong",
                null,
                toast.length === 1
                  ? `${toast[0].label} ganhou ★!`
                  : `${toast.length} territórios ganharam ★!`,
              ),
              h(
                "p",
                null,
                toast.length === 1
                  ? `${toast[0].counts[0]} de ${toast[0].total} grifos entendidos (${toast[0].pct}%).`
                  : toast.map((r) => r.label).join(" · "),
              ),
            ),
            h("button", { className: "text-link", onClick: () => setToast(null) }, "Fechar"),
          )
        : null,
      h(
        "section",
        { className: "cq-stats", "aria-label": "Resumo" },
        h(
          "div",
          { className: "cq-level" },
          h("span", { className: "cq-badge" }, st.level),
          h(
            "div",
            null,
            h("span", { className: "small-label" }, "NÍVEL"),
            h("strong", null, "Nível ", st.level),
            h("i", { className: "cq-xp" }, h("i", { style: { width: xpIn + "%" } })),
            h("span", { className: "meta" }, st.xp, " XP · faltam ", toNext, " para o nível ", st.level + 1),
          ),
        ),
        h(
          "div",
          { className: "cq-streak" },
          h(
            "svg",
            {
              width: 30,
              height: 30,
              viewBox: "0 0 24 24",
              fill: st.streak ? "#f3a53b" : "#e3e6e0",
              stroke: st.streak ? "#c96f12" : "#b8bbb4",
              strokeWidth: 1.4,
              strokeLinejoin: "round",
              "aria-hidden": "true",
            },
            h("path", {
              d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z",
            }),
          ),
          h(
            "div",
            null,
            h(
              "strong",
              null,
              st.streak
                ? `${st.streak} ${st.streak === 1 ? "dia seguido" : "dias seguidos"}`
                : "Sequência zerada",
            ),
            h(
              "span",
              { className: "meta" },
              st.streak
                ? "responder questões hoje mantém a sequência"
                : "responda uma questão hoje para começar",
            ),
          ),
        ),
        h(
          "div",
          null,
          h("span", { className: "small-label" }, "TERRITÓRIOS COM ★"),
          h("strong", null, stars, " de ", terr.length),
          h(
            "i",
            { className: "cq-xp" },
            h("i", {
              style: {
                width: (terr.length ? Math.round((stars * 100) / terr.length) : 0) + "%",
                background: "#3d8b57",
              },
            }),
          ),
        ),
        h(
          "div",
          { className: "cq-today" },
          h("span", { className: "small-label" }, "HOJE"),
          h(
            "strong",
            null,
            todayG
              ? `+${todayG} ${todayG === 1 ? "grifo entendido" : "grifos entendidos"}`
              : "Nenhum grifo novo",
          ),
          h(
            "span",
            { className: "meta" },
            todayG
              ? `em ${todayT} ${todayT === 1 ? "território" : "territórios"}`
              : "marque grifos no Material",
          ),
        ),
      ),
      h(
        "section",
        { className: "paper cq-fc", "aria-label": "Flashcards" },
        h(
          "div",
          { className: "cq-fc-head" },
          h("span", { className: "small-label" }, "FLASHCARDS"),
          h(re, { className: "text-link", href: "/flashcards" }, "Abrir os Flashcards →"),
        ),
        fc.res
          ? h(
              __rdR.Fragment,
              null,
              h(
                "div",
                { className: "cq-fc-grid" },
                h(
                  "div",
                  { className: "cq-fc-main" },
                  h("strong", null, fc.res),
                  h("span", null, fc.res === 1 ? "flashcard resolvido" : "flashcards resolvidos"),
                  h(
                    "span",
                    { className: "meta" },
                    "de ",
                    fc.tot,
                    " cards · ",
                    fc.ans,
                    " ",
                    fc.ans === 1 ? "resposta" : "respostas",
                    fc.today ? ` · +${fc.today} hoje` : "",
                  ),
                ),
                [
                  ["u", "c3", fc.u === 1 ? "Consolidado" : "Consolidados"],
                  ["p", "c2", fc.p === 1 ? "Parcialmente consolidado" : "Parcialmente consolidados"],
                  ["n", "c1", fc.n === 1 ? "Não consolidado" : "Não consolidados"],
                ].map(([k, c, l]) =>
                  h(
                    "div",
                    { key: k, className: "cq-fc-k" },
                    h("i", { className: "fc-" + c, "aria-hidden": "true" }),
                    h("b", null, fc[k]),
                    h("span", null, l),
                    h("em", null, fcPct(k), "% dos resolvidos"),
                  ),
                ),
              ),
              h(
                "div",
                {
                  className: "cq-sum-bar fc-cbar",
                  role: "img",
                  "aria-label": `Consolidados ${fc.u}, parcialmente ${fc.p}, não consolidados ${fc.n}, ainda não resolvidos ${fc.tot - fc.res}`,
                },
                [
                  ["u", "c3"],
                  ["p", "c2"],
                  ["n", "c1"],
                ].map(([k, c]) =>
                  fc[k] ? h("i", { key: k, className: "fc-" + c, style: { flexGrow: fc[k] } }) : null,
                ),
                fc.tot - fc.res > 0
                  ? h("i", { className: "fc-c0", style: { flexGrow: fc.tot - fc.res } })
                  : null,
              ),
              h(
                "p",
                { className: "meta cq-fc-note" },
                "Listrado = cards ainda não resolvidos. A consolidação vem da classificação dos Flashcards e não muda o entendimento do mapa.",
              ),
            )
          : h(
              "p",
              { className: "meta cq-fc-note" },
              fc.tot
                ? `Nenhum flashcard resolvido ainda. Você tem ${fc.tot} ${fc.tot === 1 ? "card" : "cards"} esperando, um para cada grifo que você classificou no Material.`
                : "Os flashcards aparecem quando você classificar grifos no Material.",
            ),
      ),
      qd.tot.n
        ? h(
            "section",
            { className: "paper cq-qs", "aria-label": "Questões por subtema" },
            h(
              "div",
              { className: "cq-fc-head" },
              h("span", { className: "small-label" }, "QUESTÕES POR SUBTEMA"),
              h(re, { className: "text-link", href: "/desempenho" }, "Ver desempenho →"),
            ),
            h(
              "div",
              { className: "cq-qs-body" },
              h(
                "div",
                { className: "cq-qs-tot" },
                h("strong", null, qd.tot.n),
                h("span", null, "questões resolvidas"),
                h(
                  "div",
                  { className: "cq-qs-split" },
                  h(
                    "span",
                    null,
                    h("i", { className: "q-ok" }),
                    h("b", null, qd.tot.ok),
                    " certas (",
                    qAcc(qd.tot),
                    "%)",
                  ),
                  h("span", null, h("i", { className: "q-bad" }), h("b", null, qd.tot.bad), " erradas"),
                ),
                h(
                  "span",
                  { className: "meta" },
                  "em ",
                  qRank.length,
                  " de ",
                  terr.length,
                  " subtemas",
                  qd.tot.today ? ` · +${qd.tot.today} hoje` : "",
                ),
                qLow.length
                  ? h(
                      "div",
                      { className: "cq-qs-low" },
                      h("span", { className: "small-label" }, "POUCO TREINADOS"),
                      h("p", { className: "meta" }, qLow.length, " subtemas com grifos e até 2 questões:"),
                      h(
                        "div",
                        { className: "cq-qs-chips" },
                        qLow
                          .slice(0, 6)
                          .map((r) =>
                            h(
                              re,
                              { key: r.id, className: "cq-qs-chip", href: __rdLink(r) },
                              r.label,
                              h("b", null, qOf(r).n),
                            ),
                          ),
                      ),
                    )
                  : null,
              ),
              h(
                "div",
                { className: "cq-qs-rank" },
                h("span", { className: "meta" }, "Mais resolvidos"),
                qRank.slice(0, 8).map((r) => {
                  let x = qOf(r);
                  return h(
                    re,
                    {
                      key: r.id,
                      className: "cq-qs-row",
                      href: __rdLink(r),
                      title: `${r.label}: ${x.n} questões, ${x.ok} certas, ${x.bad} erradas`,
                    },
                    h(
                      "span",
                      { className: "cq-qs-name" },
                      r.label,
                      r.theme ? h("small", null, r.theme) : null,
                    ),
                    h(
                      "span",
                      { className: "cq-qs-track" },
                      h(
                        "span",
                        {
                          className: "cq-qs-bar",
                          style: { width: Math.max(4, Math.round((x.n * 100) / qMax)) + "%" },
                        },
                        x.ok ? h("i", { className: "q-ok", style: { flexGrow: x.ok } }) : null,
                        x.bad ? h("i", { className: "q-bad", style: { flexGrow: x.bad } }) : null,
                        x.n - x.ok - x.bad > 0
                          ? h("i", { className: "q-none", style: { flexGrow: x.n - x.ok - x.bad } })
                          : null,
                      ),
                    ),
                    h("b", { className: "cq-qs-n" }, x.n),
                    h("span", { className: "cq-qs-acc" }, qAcc(x), "%"),
                  );
                }),
                h(
                  "p",
                  { className: "meta cq-qs-key" },
                  h("i", { className: "q-ok" }),
                  " certas  ",
                  h("i", { className: "q-bad" }),
                  " erradas · número = questões do subtema; % = certas. Uma questão que cobra dois subtemas conta nos dois.",
                ),
              ),
            ),
          )
        : null,
      !terr.length
        ? h(
            "p",
            { className: "callout" },
            "Seu Material ainda não tem seções. Adicione questões para os territórios aparecerem.",
          )
        : h(
            "section",
            { className: "paper cq-map", "aria-label": "Mapa de conquista" },
            h(
              "div",
              { className: "cq-map-head" },
              h(
                "div",
                null,
                h("h2", { className: "section-title" }, "Mapa de conquista"),
                h("span", { className: "meta" }, "toque num território para abrir o material dele"),
              ),
              h(
                "div",
                { className: "cq-filter", role: "tablist" },
                [
                  ["todas", "Todos os territórios"],
                  ["falta", "Só o que falta entender"],
                ].map(([v, l]) =>
                  h(
                    "button",
                    {
                      key: v,
                      role: "tab",
                      "aria-selected": flt === v,
                      className: "chip" + (flt === v ? " active" : ""),
                      onClick: () => pick(v),
                    },
                    l,
                  ),
                ),
                h(
                  "label",
                  { className: "cq-sort" },
                  "Ordenar ",
                  h(
                    "select",
                    { value: qsort, onChange: (x) => pickQ(x.target.value) },
                    h("option", { value: "materia" }, "por entendimento"),
                    h("option", { value: "mais" }, "mais questões"),
                    h("option", { value: "menos" }, "menos questões"),
                  ),
                ),
              ),
            ),
            h(
              "div",
              { className: "cq-summary" },
              h(
                "div",
                { className: "cq-sum-head" },
                h("span", { className: "small-label" }, "ENTENDIMENTO DOS GRIFOS NO MAPA TODO"),
                h(
                  "span",
                  { className: "meta" },
                  T,
                  " ",
                  T === 1 ? "grifo" : "grifos",
                  " em ",
                  withG.length,
                  " ",
                  withG.length === 1 ? "território" : "territórios",
                ),
              ),
              T
                ? h(
                    "div",
                    {
                      className: "cq-sum-bar",
                      role: "img",
                      "aria-label": cats.map(([, l], i) => `${l} ${P[i]}%`).join(", "),
                    },
                    cats.map(([k, l], i) =>
                      tot[i]
                        ? h("i", {
                            key: k,
                            className: "b-" + k,
                            style: { flexGrow: tot[i] },
                            title: `${l}: ${tot[i]} (${P[i]}%)`,
                          })
                        : null,
                    ),
                  )
                : null,
              h(
                "div",
                { className: "cq-legend" },
                cats.map(([k, l], i) =>
                  h(
                    "span",
                    { key: k, className: "cq-lg" },
                    h("i", { className: "b-" + k }),
                    l,
                    " ",
                    h("b", null, P[i], "%"),
                    h("em", null, tot[i]),
                  ),
                ),
              ),
              h(
                "p",
                { className: "meta cq-key" },
                h("b", null, "Como ler cada território: "),
                "o número grande é a % de grifos entendidos; a barra mostra a divisão entre as 4 situações. ★ = 80% ou mais dos grifos entendidos. Contorno tracejado = ainda sem grifos.",
              ),
            ),
            subjects.map((g) => {
              let rows = flt === "falta" ? g.rows.filter((r) => !r.star) : g.rows;
              if (!rows.length) return null;
              qsort !== "materia" &&
                (rows = [...rows].sort(
                  (a, b) =>
                    (qsort === "mais" ? qOf(b).n - qOf(a).n : qOf(a).n - qOf(b).n) ||
                    a.label.localeCompare(b.label, "pt-BR"),
                ));
              let gs = g.rows.filter((r) => r.star).length;
              return h(
                "div",
                { key: g.name, className: "cq-subj" },
                h(
                  "div",
                  { className: "cq-subj-head" },
                  h("strong", null, g.name),
                  h(
                    "span",
                    { className: "meta" },
                    ((n) => `${n} ${n === 1 ? "questão" : "questões"} · `)(
                      ((u) => (g.rows.forEach((r) => qOf(r).keys?.forEach((k) => u.add(k))), u.size))(
                        new Set(),
                      ),
                    ),
                    gs,
                    " de ",
                    g.rows.length,
                    " com ★",
                  ),
                ),
                h("div", { className: "cq-tiles" }, rows.map(tile)),
              );
            }),
            flt === "falta" && !terr.some((r) => !r.star)
              ? h("p", { className: "meta" }, "Todos os territórios já têm ★.")
              : null,
          ),
      h(
        "div",
        { className: "cq-below" },
        h(
          "section",
          { className: "paper cq-next" },
          h("span", { className: "small-label" }, "PRÓXIMAS CONQUISTAS"),
          next.length
            ? next.map((r) => {
                let goal = r.counts[0] + r.need;
                return h(
                  "div",
                  { key: r.id, className: "cq-goal" },
                  h(
                    "div",
                    null,
                    h("strong", null, r.label),
                    h("span", { className: "meta" }, r.pct, "% → ★ 80%"),
                  ),
                  h(
                    "i",
                    { className: "cq-xp" },
                    h("i", { style: { width: Math.round((r.counts[0] * 100) / goal) + "%" } }),
                  ),
                  h(
                    "p",
                    null,
                    r.need === 1 ? "Falta " : "Faltam ",
                    h("b", null, r.need, " ", r.need === 1 ? "grifo entendido" : "grifos entendidos"),
                    " (",
                    r.counts[0],
                    " de ",
                    goal,
                    ")",
                  ),
                  h(
                    re,
                    { className: "text-link", href: __rdLink(r) },
                    r.deep ? "Abrir o Material único →" : "Abrir no Material →",
                  ),
                );
              })
            : h(
                "p",
                { className: "meta" },
                withG.length
                  ? "Todos os territórios com grifos já têm ★."
                  : "Marque grifos no Material para ver as próximas conquistas.",
              ),
        ),
        h(
          "section",
          { className: "paper cq-medals" },
          h("span", { className: "small-label" }, "MEDALHAS DOS ÚLTIMOS 7 DIAS"),
          medals.map((m) => {
            let on = m.n >= m.goal;
            return h(
              "div",
              { key: m.key, className: "cq-medal" + (on ? " on" : "") },
              h("span", { "aria-hidden": "true" }, m.icon),
              h("div", null, h("strong", null, m.title), h("p", { className: "meta" }, m.text(m.n, m.goal))),
            );
          }),
        ),
      ),
    );
  }
  