function __SBV({ nodeKey: sk, onOpen: op }) {
    let { state: e, service: t } = W(),
      h = t.activeMaterial(),
      key = __sbDec(sk),
      chain = (0, kt.useMemo)(() => (key ? __sbFind(Zb(h), key) : null), [h, key]),
      C = (0, kt.useMemo)(() => XO(e.questions), [e.questions]),
      [v, b] = (0, kt.useState)(""),
      [ae, J] = (0, kt.useState)("todos"),
      [sel, c] = (0, kt.useState)(null),
      $ = C.options.find((M) => M.value === v),
      node = chain?.at(-1),
      secs = node ? __sbAll(node) : [],
      rows = secs.map((s) => {
        let A = JO(s.highlights, $?.value ?? "", C),
          q = KO(A, ae);
        return {
          s,
          A,
          D: { ...s, highlights: A },
          dim: new Set(q.items.filter((M) => !M.focused).map((M) => M.highlight.phrase)),
          n: new Set(A.flatMap((z) => (z.references ?? []).map((y) => y.key))).size,
        };
      }),
      all = new Set(rows.flatMap((r) => r.A.flatMap((z) => (z.references ?? []).map((y) => y.key)))),
      marks = rows.reduce((z, r) => z + r.A.length, 0),
      xr = sel ? rows.find((r) => r.s.id === sel.id) : null,
      x = xr?.s,
      Q = xr?.A.find((M) => M.phrase === sel.phrase),
      _ = Q?.references ?? [],
      N = Q ? (Q.legacyCount ?? Math.max(0, Q.count - _.length)) : 0;
    if (!node || !secs.length)
      return (0, k.jsx)("div", {
        className: "material-reader",
        children: (0, k.jsxs)("article", {
          className: "book-page",
          children: [
            (0, k.jsx)("div", { className: "chapter-number", children: "MATERIAL ÚNICO DO SUBTEMA" }),
            (0, k.jsx)("h1", { children: "Subtema sem seções" }),
            (0, k.jsx)("p", {
              children: "Este subtema não tem seções ativas agora. Escolha outro subtema na lista ao lado.",
            }),
          ],
        }),
      });
    let labels = chain.map((z) => z.label),
      pl = (z, a, b2) => `${z} ${z === 1 ? a : b2}`;
    return (0, k.jsxs)(k.Fragment, {
      children: [
        (0, k.jsxs)("div", {
          className: "material-reader subtheme-reader",
          children: [
            (0, k.jsxs)("div", {
              className: "reader-toolbar",
              children: [
                (0, k.jsx)("span", { children: labels.join(" › ") }),
                (0, k.jsx)("span", { children: pl(secs.length, "seção", "seções") }),
              ],
            }),
            (0, k.jsxs)("article", {
              className: "book-page",
              children: [
                (0, k.jsx)("div", { className: "chapter-number", children: "MATERIAL ÚNICO DO SUBTEMA" }),
                (0, k.jsx)("h1", { children: node.label }),
                (0, k.jsx)("p", {
                  className: "book-subtitle",
                  children: [
                    labels.slice(0, -1).join(" · "),
                    pl(secs.length, "seção", "seções"),
                    pl(marks, "trecho marcado", "trechos marcados"),
                    pl(all.size, "questão identificada", "questões identificadas") +
                      ($ ? ` · ${$.label}` : ""),
                  ]
                    .filter(Boolean)
                    .join(" · "),
                }),
                (0, k.jsx)(__MPLink, { nodeKey: key }),
                (0, k.jsx)(__UTB, {
                  highlights: rows.flatMap((r) => r.A),
                  level: ae,
                  onLevel: J,
                  scope: "subtema",
                }),
                (0, k.jsxs)("nav", {
                  className: "subtheme-toc",
                  "aria-label": "Sumário do subtema",
                  children: [
                    (0, k.jsx)("span", { className: "small-label", children: "SUMÁRIO" }),
                    (0, k.jsx)("ol", {
                      children: rows.map((r) =>
                        (0, k.jsxs)(
                          "li",
                          {
                            children: [
                              (0, k.jsx)("a", {
                                href: "#",
                                onClick: (M) => {
                                  M.preventDefault();
                                  document
                                    .getElementById("sb-" + r.s.id)
                                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                                },
                                children: r.s.title,
                              }),
                              r.n > 0 &&
                                (0, k.jsxs)("span", {
                                  className: "meta",
                                  children: [" · ", pl(r.n, "questão", "questões")],
                                }),
                            ],
                          },
                          r.s.id,
                        ),
                      ),
                    }),
                  ],
                }),
                rows.map((r, i) =>
                  (0, k.jsxs)(
                    "section",
                    {
                      className: "subtheme-section",
                      id: "sb-" + r.s.id,
                      children: [
                        (0, k.jsx)("div", { className: "book-rule" }),
                        (0, k.jsxs)("div", {
                          className: "chapter-number",
                          children: [String(i + 1).padStart(2, "0"), " / ", r.s.subject.toUpperCase()],
                        }),
                        (0, k.jsx)("h2", { children: r.s.title }),
                        (0, k.jsx)("p", {
                          className: "book-subtitle",
                          children: [r.s.topic, ...r.s.concepts].join(" · "),
                        }),
                        r.s.text
                          .split("\n\n")
                          .map((M, j) =>
                            (0, k.jsx)(
                              "p",
                              {
                                className: "book-paragraph",
                                children: (0, k.jsx)(tM, {
                                  text: M,
                                  section: r.D,
                                  onSelect: (z) => c({ id: r.s.id, phrase: z.phrase }),
                                  dimmed: r.dim,
                                }),
                              },
                              j,
                            ),
                          ),
                        (0, k.jsx)("div", {
                          className: "actions subtheme-open",
                          children: (0, k.jsx)("button", {
                            type: "button",
                            className: "text-link",
                            onClick: () => op(r.s.id),
                            children: "Abrir só esta seção →",
                          }),
                        }),
                      ],
                    },
                    r.s.id,
                  ),
                ),
                (0, k.jsxs)("section", {
                  className: "material-incidence-controls",
                  "aria-label": "Incidência por banca",
                  children: [
                    (0, k.jsxs)("div", {
                      className: "incidence-legend",
                      children: [
                        (0, k.jsx)("span", { children: "INCIDÊNCIA EM QUESTÕES" }),
                        (0, k.jsx)("div", {
                          children: HC.map((M) =>
                            (0, k.jsxs)(
                              "span",
                              {
                                title: M.description,
                                "aria-label": M.description,
                                children: [
                                  (0, k.jsx)("i", { className: `incidence-${M.min}`, "aria-hidden": "true" }),
                                  M.label,
                                ],
                              },
                              M.min,
                            ),
                          ),
                        }),
                      ],
                    }),
                    (0, k.jsxs)("label", {
                      className: "field incidence-board-select",
                      children: [
                        "Filtrar grifos por banca",
                        (0, k.jsxs)("select", {
                          value: $?.value ?? "",
                          onChange: (M) => {
                            (b(M.target.value), c(null));
                          },
                          children: [
                            (0, k.jsx)("option", { value: "", children: "Todas as bancas" }),
                            C.options.map((M) =>
                              (0, k.jsx)("option", { value: M.value, children: M.label }, M.value),
                            ),
                          ],
                        }),
                      ],
                    }),
                    (0, k.jsxs)("label", {
                      className: "field incidence-board-select",
                      children: [
                        "Filtrar grifos por entendimento",
                        (0, k.jsx)("select", {
                          value: ae,
                          onChange: (M) => J(M.target.value),
                          children: Vl.map(([M, z]) => (0, k.jsx)("option", { value: M, children: z }, M)),
                        }),
                      ],
                    }),
                    (0, k.jsx)("p", {
                      className: "meta",
                      role: "status",
                      children:
                        "Mesma contagem do Material: cada questão distinta conta uma vez por trecho. Toque no contador (N×) de um grifo para ver as questões que cobraram aquele trecho.",
                    }),
                  ],
                }),
                (0, k.jsxs)("footer", {
                  className: "book-footer",
                  children: [
                    (0, k.jsx)("span", { children: "MATERIAL ÚNICO DO SUBTEMA" }),
                    (0, k.jsx)("span", { children: "Atualiza sozinho junto com as seções" }),
                  ],
                }),
              ],
            }),
          ],
        }),
        Q &&
          (0, k.jsxs)(da, {
            title: "Quest\xF5es relacionadas \xE0 marca\xE7\xE3o",
            onClose: () => c(null),
            children: [
              (0, k.jsxs)("div", {
                className: "reference-rule",
                children: [
                  (0, k.jsx)("h3", { children: "Regra do material" }),
                  (0, k.jsx)("p", { children: Q.phrase }),
                ],
              }),
              (0, k.jsx)(Zl, {
                title: "COMO EST\xC1 ESTA REGRA PARA VOC\xCA?",
                value: Q.understanding,
                at: Q.understandingAt,
                onChange: (M) => t.setHighlightUnderstanding(x.id, Q.phrase, M),
              }),
              (0, k.jsx)(VO, { section: x, highlight: Q }, `${x.id}:${Q.phrase}`),
              (0, k.jsx)(ZO, { sectionId: x.id, highlight: Q }, `note:${x.id}:${Q.phrase}`),
              (0, k.jsxs)("p", {
                className: "reference-summary",
                children: [
                  _.length,
                  " ",
                  _.length === 1 ? "quest\xE3o identificada" : "quest\xF5es identificadas",
                  " neste trecho",
                  $ ? ` \xB7 ${$.label}` : " \xB7 Todas as bancas",
                ],
              }),
              _.length > 0 &&
                (0, k.jsx)("ul", {
                  className: "reference-codes",
                  "aria-label": "C\xF3digos de todas as quest\xF5es relacionadas",
                  children: _.map((M) =>
                    (0, k.jsxs)(
                      "li",
                      {
                        children: [
                          M.key.startsWith("demo:") ? "Exemplo \xB7 " : "",
                          M.number ? `TEC #${M.number}` : `Sem c\xF3digo TEC \xB7 ${M.questionId}`,
                        ],
                      },
                      M.key,
                    ),
                  ),
                }),
              N > 0 &&
                (0, k.jsxs)("p", {
                  className: "meta",
                  children: [
                    "H\xE1 ainda ",
                    N,
                    " ocorr\xEAncia(s) antiga(s) sem c\xF3digo de origem recuper\xE1vel. O contador foi preservado.",
                  ],
                }),
              (0, k.jsx)("div", {
                className: "stack",
                children: _.map((M) => {
                  let Je = HO(M, e.questions);
                  return (0, k.jsx)(
                    QO,
                    { reference: M, question: Je, response: Je ? e.responses[Je.id] : void 0 },
                    M.key,
                  );
                }),
              }),
            ],
          }),
      ],
    });
  }
  