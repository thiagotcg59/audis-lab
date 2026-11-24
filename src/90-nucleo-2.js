function t0() {
    let { state: e, service: t } = W(),
      a = Yr(),
      [__sbk, __sbK] = (0, kt.useState)(() => a.get("subtema")),
      [n, r] = (0, kt.useState)(() => a.get("topico") ?? t3()),
      [o, i] = (0, kt.useState)(() => a.get("trilha") === "1"),
      [s, l] = (0, kt.useState)(() => (a.get("quadro") ? "Quadro" : "Completo")),
      [u, c] = (0, kt.useState)(null),
      [f, d] = (0, kt.useState)(!1),
      [m, p] = (0, kt.useState)(""),
      [v, b] = (0, kt.useState)(""),
      [y, g] = (0, kt.useState)(""),
      h = t.activeMaterial(),
      x = h.find((M) => M.id === n) ?? h[0];
    ((0, kt.useEffect)(() => {
      if (!(!x?.id || o))
        try {
          localStorage.setItem(aM, x.id);
        } catch {}
    }, [x?.id, o]),
      (0, kt.useEffect)(() => {
        let M = () => {
          let Je = new URLSearchParams(window.location.hash.split("?")[1] ?? "");
          __sbK(Je.get("subtema"));
          i(Je.get("trilha") === "1");
          let Dn = Je.get("topico");
          (Dn && r(Dn), c(null));
        };
        return (window.addEventListener("popstate", M), () => window.removeEventListener("popstate", M));
      }, []));
    let C = (0, kt.useMemo)(() => XO(e.questions), [e.questions]),
      $ = C.options.find((M) => M.value === v),
      A = (0, kt.useMemo)(() => JO(x?.highlights ?? [], $?.value ?? "", C), [x?.highlights, $?.value, C]),
      D = x ? { ...x, highlights: A } : void 0,
      [ae, J] = (0, kt.useState)("todos"),
      q = (0, kt.useMemo)(() => KO(A, ae), [A, ae]),
      Y = (0, kt.useMemo)(
        () => new Set(q.items.filter((M) => !M.focused).map((M) => M.highlight.phrase)),
        [q],
      ),
      Q = A.find((M) => M.phrase === u),
      _ = Q?.references ?? [],
      N = Q ? (Q.legacyCount ?? Math.max(0, Q.count - _.length)) : 0,
      Ce = e.proposals.filter((M) => M.sectionId === x?.id && M.status === "pending"),
      Ud = (0, kt.useMemo)(
        () => (x ? t.incidenceContext(x.id) : { questions: [] }),
        [t, x?.id, e.questions, e.material, e.proposals],
      ).questions.filter((M) => !M.linkedPhrases.length && (!$ || Od(M.question.board) === $.value)),
      Yt = Object.entries(e.responses).filter(
        ([M, Je]) => Je.visualSuggestion?.useful && t.question(M).sectionId === x?.id,
      ),
      Rd = (M) => {
        let Je = o || !!__sbk;
        (__sbK(null),
          i(!1),
          r(M),
          c(null),
          d(!1),
          g(""),
          window.history[Je ? "pushState" : "replaceState"](
            null,
            "",
            `#/material?topico=${encodeURIComponent(M)}`,
          ));
      },
      CM = () => {
        (__sbK(null), i(!0), c(null), d(!1), window.history.pushState(null, "", "#/material?trilha=1"));
      },
      kM = (M) => {
        (b(""), Rd(M.sectionId), c(M.phrase));
      },
      __sbOpen = (M) => {
        (__sbK(M),
          i(!1),
          c(null),
          d(!1),
          window.history.pushState(null, "", "#/material?subtema=" + M),
          setTimeout(
            () => document.querySelector(".subtheme-reader")?.scrollIntoView({ block: "start" }),
            60,
          ));
      };
    if (!x || !D)
      return (0, k.jsxs)("main", {
        className: "page",
        children: [
          (0, k.jsx)("h1", { children: "Material \xDAnico" }),
          (0, k.jsx)("p", {
            children:
              "Nenhuma se\xE7\xE3o ativa. Voc\xEA pode restaurar uma se\xE7\xE3o da lixeira ou adicionar novas quest\xF5es.",
          }),
          (0, k.jsx)(e0, {}),
          (0, k.jsx)(re, { className: "button", href: "/adicionar", children: "Adicionar quest\xE3o" }),
        ],
      });
    let Eh = t.sectionPerformance(x.id),
      jd = iN(h),
      Gl = jd.findIndex((M) => M.id === x.id),
      qd = Gl > 0 ? jd[Gl - 1] : void 0,
      Bd = Gl >= 0 ? jd[Gl + 1] : void 0,
      v0 = (M) => [M.subject, ...Ee(M)].join(" \u203A "),
      Fd = null;
    return (0, k.jsxs)("main", {
      className: "material-layout",
      children: [
        (0, k.jsxs)("aside", {
          className: "material-tree",
          children: [
            (0, k.jsxs)("div", {
              className: "tree-heading",
              children: [(0, k.jsx)(Ln, { size: 19 }), (0, k.jsx)("h1", { children: "Material \xDAnico" })],
            }),
            (0, k.jsx)("p", { className: "meta", children: "Um material que evolui com voc\xEA." }),
            (0, k.jsx)(wO, { active: o, onOpen: CM }),
            (0, k.jsx)(OO, {
              material: h,
              selected: o || __sbk ? "" : x.id,
              onSelect: Rd,
              onSub: __sbOpen,
              subKey: __sbk,
            }),
            (0, k.jsx)(e0, {
              section: x,
              onRemoved: () => {
                (c(null), d(!1));
              },
            }),
            (0, k.jsxs)("div", {
              className: "tree-footer",
              children: [
                (0, k.jsx)("span", { className: "small-label", children: "SEU ACERVO" }),
                (0, k.jsxs)("p", { children: [h.length, " t\xF3picos \xB7 inclui exemplos"] }),
              ],
            }),
          ],
        }),
        __sbk
          ? (0, k.jsx)(
              __SBV,
              {
                nodeKey: __sbk,
                onOpen: (M) => {
                  (Rd(M), window.scrollTo({ top: 0 }));
                },
              },
              __sbk,
            )
          : o
            ? (0, k.jsx)("div", { className: "material-reader", children: (0, k.jsx)(SO, { onOpen: kM }) })
            : (0, k.jsxs)("div", {
                className: "material-reader",
                children: [
                  (0, k.jsxs)("div", {
                    className: "reader-toolbar",
                    children: [
                      (0, k.jsxs)("span", {
                        children: [
                          [x.subject, ...Ee(x)].join(" \u203A "),
                          " ",
                          (0, k.jsx)(yd, { size: 13 }),
                          (0, k.jsx)(MO, { section: x }, x.id),
                        ],
                      }),
                      (0, k.jsxs)("span", { children: ["Vers\xE3o ", x.version] }),
                    ],
                  }),
                  (0, k.jsx)("div", {
                    className: "reader-tabs",
                    role: "tablist",
                    "aria-label": "Modo de leitura",
                    children: ["Completo", "Revis\xE3o", "Visual", "Quadro"].map((M) =>
                      (0, k.jsx)(
                        "button",
                        {
                          id: `tab-${M}`,
                          "aria-controls": "material-panel",
                          role: "tab",
                          "aria-selected": s === M,
                          onClick: () => {
                            (l(M), d(!1));
                          },
                          onKeyDown: (Je) => {
                            if (Je.key === "ArrowRight" || Je.key === "ArrowLeft") {
                              let Dn = ["Completo", "Revis\xE3o", "Visual", "Quadro"],
                                y0 = (Dn.indexOf(M) + (Je.key === "ArrowRight" ? 1 : 3)) % 4;
                              (l(Dn[y0]), document.getElementById(`tab-${Dn[y0]}`)?.focus());
                            }
                          },
                          children: M === "Quadro" ? (0, k.jsx)(__QDTab, { id: x.id }) : M,
                        },
                        M,
                      ),
                    ),
                  }),
                  (0, k.jsxs)("article", {
                    className: "book-page" + (s === "Quadro" ? " qd-mode" : ""),
                    id: "material-panel",
                    role: "tabpanel",
                    "aria-labelledby": `tab-${s}`,
                    children: [
                      (0, k.jsxs)("div", {
                        className: "chapter-number",
                        children: [
                          String(e.material.indexOf(x) + 1).padStart(2, "0"),
                          " /",
                          " ",
                          x.subject.toUpperCase(),
                        ],
                      }),
                      (0, k.jsx)("h1", { children: x.title }),
                      (0, k.jsxs)("p", {
                        className: "book-subtitle",
                        children: [x.topic, " \xB7 ", x.concepts.join(" \xB7 ")],
                      }),
                      Fd &&
                        (0, k.jsxs)("p", {
                          className: "meta section-step",
                          children: ["Passo ", Fd.position, " de ", Fd.total, " \xB7 ", Ks(Fd.degrau)],
                        }),
                      s !== "Quadro" &&
                        Ud.length > 0 &&
                        (0, k.jsxs)("div", {
                          className: "callout",
                          children: [
                            (0, k.jsxs)("p", {
                              children: [
                                Ud.length,
                                " quest\xE3o(\xF5es) relacionada(s) ainda sem marca\xE7\xE3o aprovada. A contagem pode estar incompleta.",
                              ],
                            }),
                            (0, k.jsx)("button", {
                              className: "button",
                              onClick: async () => {
                                let M = `Use o conector Audis: leia get_material_incidence_context para sectionId=${x.id}. Compare todas as regras cobradas nas quest\xF5es com o material, incluindo alternativas incorretas. Proponha os v\xEDnculos que faltam por propose_material_update, usando record_occurrence quando o texto j\xE1 cobre a regra. Preserve o material e todas as refer\xEAncias existentes. Deixe tudo para minha revis\xE3o, sem aprovar nada.`;
                                try {
                                  (await navigator.clipboard.writeText(M),
                                    g(
                                      "Pedido copiado. Cole na conversa com o Claude para revisar as incid\xEAncias anteriores.",
                                    ));
                                } catch {
                                  g(M);
                                }
                              },
                              children: "Copiar pedido de revis\xE3o das incid\xEAncias",
                            }),
                          ],
                        }),
                      s !== "Quadro" && (0, k.jsx)(__MPLink, { sectionId: x.id }, "mp" + x.id),
                      s !== "Quadro" && (0, k.jsx)(__UTB, { highlights: A, level: ae, onLevel: J }, x.id),
                      s === "Completo" &&
                        (0, k.jsxs)(k.Fragment, {
                          children: [
                            (0, k.jsx)("div", { className: "book-rule" }),
                            (0, k.jsxs)("div", {
                              className: "section-heading",
                              children: [
                                (0, k.jsx)("h2", { children: "Compreender o fundamento" }),
                                (0, k.jsx)("button", {
                                  className: "icon-button",
                                  "aria-label": "Editar se\xE7\xE3o",
                                  onClick: () => {
                                    (p(x.text), d(!f));
                                  },
                                  children: (0, k.jsx)(La, { size: 16 }),
                                }),
                              ],
                            }),
                            f
                              ? (0, k.jsxs)("div", {
                                  className: "stack",
                                  children: [
                                    (0, k.jsxs)("label", {
                                      className: "field",
                                      children: [
                                        "Editar trecho",
                                        (0, k.jsx)("textarea", {
                                          rows: 14,
                                          value: m,
                                          maxLength: 2e4,
                                          onChange: (M) => p(M.target.value),
                                        }),
                                      ],
                                    }),
                                    (0, k.jsx)("p", {
                                      className: "meta",
                                      children:
                                        "A edi\xE7\xE3o ser\xE1 preparada como proposta para sua revis\xE3o.",
                                    }),
                                    (0, k.jsxs)("div", {
                                      className: "actions",
                                      children: [
                                        (0, k.jsx)("button", {
                                          className: "button",
                                          onClick: () => d(!1),
                                          children: "Cancelar",
                                        }),
                                        (0, k.jsx)("button", {
                                          className: "button primary",
                                          disabled: !m.trim() || m === x.text,
                                          onClick: () => {
                                            try {
                                              (t.proposeManual({
                                                sectionId: x.id,
                                                baseVersion: x.version,
                                                currentText: x.text,
                                                proposedText: m,
                                                kind: "replace",
                                                justification:
                                                  "Edi\xE7\xE3o manual solicitada pela usu\xE1ria.",
                                              }),
                                                d(!1),
                                                g(
                                                  "Edi\xE7\xE3o preparada. Revise a proposta abaixo antes de incorporar.",
                                                ));
                                            } catch (M) {
                                              g(M.message);
                                            }
                                          },
                                          children: "Revisar edi\xE7\xE3o",
                                        }),
                                      ],
                                    }),
                                  ],
                                })
                              : x.text
                                  .split(
                                    `

`,
                                  )
                                  .map((M, Je) =>
                                    (0, k.jsx)(
                                      "p",
                                      {
                                        className: "book-paragraph",
                                        children: (0, k.jsx)(tM, {
                                          text: M,
                                          section: D,
                                          onSelect: (Dn) => c(Dn.phrase),
                                          dimmed: Y,
                                        }),
                                      },
                                      Je,
                                    ),
                                  ),
                          ],
                        }),
                      s === "Revis\xE3o" &&
                        (0, k.jsxs)("div", {
                          className: "review-blocks",
                          children: [
                            (0, k.jsxs)("section", {
                              children: [
                                (0, k.jsx)("span", {
                                  className: "small-label",
                                  children: "O QUE MAIS CAI NESTE TRECHO",
                                }),
                                (0, k.jsx)("p", {
                                  children: A.length
                                    ? YO(
                                        q.items.toSorted((M, Je) => Je.highlight.count - M.highlight.count),
                                      ).map(({ highlight: M }, Je) =>
                                        (0, k.jsxs)(
                                          "span",
                                          {
                                            className: "review-sentence",
                                            children: [
                                              (0, k.jsx)("mark", {
                                                className: `incidence incidence-${zn(M.count)}${Y.has(M.phrase) ? " dimmed" : ""}`,
                                                children: M.phrase,
                                              }),
                                              (0, k.jsxs)("button", {
                                                className: `incidence-count incidence-${zn(M.count)}${Y.has(M.phrase) ? " dimmed" : ""}`,
                                                "aria-label": `Ver ${M.count} quest\xF5es relacionadas \xE0 frase: ${M.phrase}${qC(M.understanding)}${XC(M)}${KC(M)}`,
                                                onClick: () => c(M.phrase),
                                                children: [
                                                  M.count,
                                                  "\xD7",
                                                  (0, k.jsx)(jC, { level: M.understanding }),
                                                  (0, k.jsx)(JC, { highlight: M }),
                                                  (0, k.jsx)(YC, { highlight: M }),
                                                ],
                                              }),
                                            ],
                                          },
                                          Je,
                                        ),
                                      )
                                    : $
                                      ? `Nenhuma ocorr\xEAncia aprovada de ${$.label} neste trecho.`
                                      : x.text.split(`

`)[0],
                                }),
                              ],
                            }),
                            (0, k.jsxs)("section", {
                              children: [
                                (0, k.jsx)("span", { className: "small-label", children: "ATEN\xC7\xC3O" }),
                                (0, k.jsx)("p", {
                                  children:
                                    x.id === "legalidade"
                                      ? "Discricionariedade \xE9 margem de escolha dentro do direito. N\xE3o \xE9 aus\xEAncia de vincula\xE7\xE3o."
                                      : `Identifique a regra de ${x.topic.toLowerCase()} antes de analisar as exce\xE7\xF5es.`,
                                }),
                              ],
                            }),
                            (0, k.jsxs)("section", {
                              children: [
                                (0, k.jsx)("span", {
                                  className: "small-label",
                                  children: "VOC\xCA J\xC1 ERROU",
                                }),
                                (0, k.jsx)("p", {
                                  children: e.errors.some(
                                    (M) => M.sectionId === x.id && M.questionSnapshot.source === "tec-manual",
                                  )
                                    ? "Este assunto aparece no seu caderno. Retome o conceito e compare as alternativas antes de responder."
                                    : "Nenhum erro registrado neste t\xF3pico. Use a recupera\xE7\xE3o ativa para consolidar.",
                                }),
                              ],
                            }),
                            (0, k.jsxs)(re, {
                              className: "button primary",
                              href: `/foco?topico=${x.id}`,
                              children: ["Testar novamente ", (0, k.jsx)(gt, { size: 16 })],
                            }),
                          ],
                        }),
                      s === "Quadro" && (0, k.jsx)(__QD, { section: x, onMode: l, onOpen: Rd }, x.id),
                      s === "Visual" &&
                        (0, k.jsxs)(k.Fragment, {
                          children: [
                            (0, k.jsx)(FO, { section: x, suggestions: Yt }, x.id),
                            (0, k.jsxs)("div", {
                              className: "concept-map",
                              children: [
                                (0, k.jsx)("div", { className: "map-root", children: x.topic }),
                                (0, k.jsx)("div", { className: "map-connector" }),
                                (0, k.jsx)("div", {
                                  className: "map-branches",
                                  children: (A.length
                                    ? A.toSorted((M, Je) => Je.count - M.count)
                                        .slice(0, 6)
                                        .map((M) => ({
                                          text: M.phrase,
                                          label: `${M.count} quest\xE3o(\xF5es) vinculada(s)${$ ? ` \xB7 ${$.label}` : ""}`,
                                        }))
                                    : x.text
                                        .split(
                                          `

`,
                                        )
                                        .filter(Boolean)
                                        .slice(0, 3)
                                        .map((M) => ({ text: M, label: "Trecho do material" }))
                                  ).map((M, Je) =>
                                    (0, k.jsxs)(
                                      "div",
                                      {
                                        children: [
                                          (0, k.jsx)("span", { className: "small-label", children: M.label }),
                                          (0, k.jsx)("p", { className: "preserve-lines", children: M.text }),
                                        ],
                                      },
                                      Je,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                            (0, k.jsx)("div", {
                              className: "visual-footer",
                              children: (0, k.jsxs)("p", {
                                className: "meta",
                                children: [
                                  "Esquema de leitura dos trechos da vers\xE3o ",
                                  x.version,
                                  ". Atualizado junto com o material.",
                                ],
                              }),
                            }),
                          ],
                        }),
                      (0, k.jsxs)("section", {
                        className: "material-incidence-controls",
                        "aria-label": "Incid\xEAncia por banca",
                        children: [
                          (0, k.jsxs)("div", {
                            className: "incidence-legend",
                            children: [
                              (0, k.jsx)("span", { children: "INCID\xCANCIA EM QUEST\xD5ES" }),
                              (0, k.jsx)("div", {
                                children: HC.map((M) =>
                                  (0, k.jsxs)(
                                    "span",
                                    {
                                      title: M.description,
                                      "aria-label": M.description,
                                      children: [
                                        (0, k.jsx)("i", {
                                          className: `incidence-${M.min}`,
                                          "aria-hidden": "true",
                                        }),
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
                                children: Vl.map(([M, Je]) =>
                                  (0, k.jsx)("option", { value: M, children: Je }, M),
                                ),
                              }),
                            ],
                          }),
                          (0, k.jsxs)("p", {
                            className: "meta",
                            role: "status",
                            children: [
                              $
                                ? A.length
                                  ? `Grifos e contadores de ${$.label}. Cada quest\xE3o distinta conta uma vez por trecho.`
                                  : `Nenhuma ocorr\xEAncia aprovada de ${$.label} neste material. O texto continua dispon\xEDvel para leitura.`
                                : "Contagem por trecho: cada quest\xE3o distinta conta uma vez. Todas as bancas.",
                              q.active && ae !== "todos" ? ` ${eM(WO[ae], q.focusedCount, q.total)}` : "",
                            ],
                          }),
                          (0, k.jsx)("p", {
                            className: "meta",
                            children:
                              "A lista inclui as bancas das quest\xF5es cadastradas. Ocorr\xEAncias antigas sem banca identificada aparecem apenas em \u201CTodas as bancas\u201D.",
                          }),
                        ],
                      }),
                      y && (0, k.jsx)(te, { children: y }),
                      (0, k.jsxs)("nav", {
                        className: "section-pager",
                        "aria-label": "Se\xE7\xE3o anterior e pr\xF3xima",
                        children: [
                          qd
                            ? (0, k.jsxs)("button", {
                                type: "button",
                                className: "pager-link previous",
                                onClick: () => {
                                  (Rd(qd.id), window.scrollTo({ top: 0 }));
                                },
                                children: [
                                  (0, k.jsx)(bd, { size: 18 }),
                                  (0, k.jsxs)("span", {
                                    children: [
                                      (0, k.jsxs)("small", { children: ["Anterior \xB7 ", v0(qd)] }),
                                      (0, k.jsx)("strong", { children: qd.title }),
                                    ],
                                  }),
                                ],
                              })
                            : (0, k.jsx)("span", {
                                className: "pager-link disabled",
                                children: (0, k.jsx)("span", {
                                  children: (0, k.jsx)("small", { children: "In\xEDcio do material" }),
                                }),
                              }),
                          (0, k.jsxs)("span", {
                            className: "pager-position meta",
                            children: [Gl + 1, " de ", jd.length],
                          }),
                          Bd
                            ? (0, k.jsxs)("button", {
                                type: "button",
                                className: "pager-link next",
                                onClick: () => {
                                  (Rd(Bd.id), window.scrollTo({ top: 0 }));
                                },
                                children: [
                                  (0, k.jsxs)("span", {
                                    children: [
                                      (0, k.jsxs)("small", { children: ["Pr\xF3xima \xB7 ", v0(Bd)] }),
                                      (0, k.jsx)("strong", { children: Bd.title }),
                                    ],
                                  }),
                                  (0, k.jsx)(Bi, { size: 18 }),
                                ],
                              })
                            : (0, k.jsx)("span", {
                                className: "pager-link disabled",
                                children: (0, k.jsx)("span", {
                                  children: (0, k.jsx)("small", { children: "Fim do material" }),
                                }),
                              }),
                        ],
                      }),
                      (0, k.jsxs)("footer", {
                        className: "book-footer",
                        children: [
                          (0, k.jsx)("span", { children: "Audis \xB7 MATERIAL \xDANICO" }),
                          (0, k.jsx)("span", {
                            children:
                              Eh.accuracy === null
                                ? "Sem respostas registradas"
                                : `${Eh.accuracy}% de acertos \xB7 ${Eh.answered} quest\xE3o(\xF5es)`,
                          }),
                        ],
                      }),
                    ],
                  }),
                  Ce.length > 0 &&
                    (0, k.jsxs)("div", {
                      className: "material-proposals",
                      children: [
                        (0, k.jsx)("h2", { children: "Altera\xE7\xF5es aguardando revis\xE3o" }),
                        Ce.map((M) => (0, k.jsx)(Sh, { proposal: M }, M.id)),
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
  var Ha = U(Le());
  function Ih(e) {
    let t = new Map(e.material.filter((n) => !n.deletedAt).map((n) => [n.id, n])),
      a = new Map();
    for (let n of e.proposals)
      (n.status === "approved" || n.status === "edited") &&
        !a.has(n.questionId) &&
        a.set(n.questionId, n.resultSectionId ?? n.sectionId);
    return (n) => {
      let r = t.get(n.sectionId) ?? t.get(a.get(n.id) ?? "");
      return { theme: (r && Ee(r)[0]) || n.topic || "Sem tema", subtopic: (r && Ee(r)[1]) || "" };
    };
  }
  var R = U(X()),
    rM = "magis:errors-filter",
    wh = { subject: "", theme: "", subtopic: "", level: "todos", due: !1 },
    a3 = () => {
      try {
        return { ...wh, ...JSON.parse(localStorage.getItem(rM) ?? "{}"), due: !1 };
      } catch {
        return wh;
      }
    };
  function r3({ questionId: e }) {
    let { state: t, service: a } = W(),
      [n, r] = (0, Ha.useState)(""),
      [o, i] = (0, Ha.useState)(!1),
      [s, l] = (0, Ha.useState)(""),
      [u, c] = (0, Ha.useState)(!1);
    return (
      (0, Ha.useEffect)(() => {
        try {
          o || r(t.notes?.[e] ?? localStorage.getItem(`magis:note:${e}`) ?? "");
        } catch {
          (l(
            "N\xE3o foi poss\xEDvel recuperar a anota\xE7\xE3o antiga deste navegador. Voc\xEA pode escrever e salvar uma anota\xE7\xE3o na conta.",
          ),
            c(!0));
        }
      }, [e, t.notes?.[e], o]),
      (0, R.jsxs)("div", {
        className: "stack",
        children: [
          (0, R.jsxs)("label", {
            className: "field",
            children: [
              "Minha anota\xE7\xE3o",
              (0, R.jsx)("textarea", {
                rows: 4,
                placeholder: "O que voc\xEA quer lembrar na pr\xF3xima vez?",
                value: n,
                onChange: (f) => {
                  (r(f.target.value), i(!0), l(""));
                },
                maxLength: 1e4,
              }),
            ],
          }),
          (0, R.jsx)("div", {
            className: "actions",
            children: (0, R.jsxs)("button", {
              className: "button",
              onClick: () => {
                try {
                  (a.saveNote(e, n),
                    i(!1),
                    l(
                      "Anota\xE7\xE3o registrada para salvar na sua conta. Acompanhe a sincroniza\xE7\xE3o no topo da p\xE1gina.",
                    ),
                    c(!1));
                } catch {
                  (l("N\xE3o foi poss\xEDvel salvar. Copie sua anota\xE7\xE3o antes de sair."), c(!0));
                }
              },
              children: [(0, R.jsx)(Ld, { size: 15 }), "Salvar anota\xE7\xE3o"],
            }),
          }),
          s && (0, R.jsx)(te, { error: u, children: s }),
        ],
      })
    );
  }
  function a0() {
    let { state: e, service: t } = W(),
      a = Yr(),
      n = e.errors.filter((N) => N.questionSnapshot.source === "tec-manual"),
      r = (0, Ha.useMemo)(() => Ih(e), [e]),
      o = (N) =>
        r({
          id: N.questionId,
          sectionId: N.sectionId || N.questionSnapshot.sectionId,
          topic: N.questionSnapshot.topic,
        }),
      i = (N) => o(N).theme,
      s = (N) => o(N).subtopic,
      l = (N) => N.questionSnapshot.subject || "Sem mat\xE9ria",
      [u, c] = (0, Ha.useState)(wh);
    (0, Ha.useEffect)(() => c({ ...a3(), ...(a.get("revisar") ? { due: !0 } : {}) }), [a]);
    let f = (N) =>
        c((Ce) => {
          let Bo = { ...Ce, ...N };
          try {
            localStorage.setItem(rM, JSON.stringify({ ...Bo, due: !1 }));
          } catch {}
          return Bo;
        }),
      d = [...new Set(n.map(l))].sort((N, Ce) => N.localeCompare(Ce, "pt-BR")),
      m = d.includes(u.subject) ? u.subject : "",
      p = n.filter((N) => !m || l(N) === m),
      v = [...new Set(p.map(i))].sort((N, Ce) => N.localeCompare(Ce, "pt-BR")),
      b = v.includes(u.theme) ? u.theme : "",
      y = p.filter((N) => !b || i(N) === b),
      g = new Set(yh(e).map((N) => N.id)),
      h = vi(y.map(s)),
      x = h.find((N) => Z(N) === Z(u.subtopic)) ?? "",
      C = y.filter((N) => !x || Z(s(N)) === Z(x)),
      $ = C.filter((N) => bn(N.understanding, u.level)),
      A = $.filter((N) => !u.due || g.has(N.id) || RC(N)),
      D = n.find((N) => N.questionId === a.get("questao")),
      [ae, J] = (0, Ha.useState)(D?.questionId ?? ""),
      q = A.find((N) => N.questionId === ae) ?? A[0],
      Y = q?.questionSnapshot ?? null;
    (0, Ha.useEffect)(
      () => (
        t.selectQuestion(Y?.id ?? null),
        () => {
          t.selectQuestion(null);
        }
      ),
      [Y?.id, t],
    );
    let Q = (N) => JSON.stringify([l(N), i(N)]),
      _ = Array.from(new Set(A.map(Q))).sort();
    return (0, R.jsxs)("main", {
      className: "page wide-page",
      children: [
        (0, R.jsx)(Za, {
          eyebrow: "TRANSFORMAR ERROS EM APRENDIZADO",
          title: "Meus Erros",
          description: "Retome o racioc\xEDnio. Descubra o ponto que faltou.",
        }),
        n.length > 0 &&
          (0, R.jsxs)("section", {
            className: "error-filters",
            "aria-label": "Filtrar o caderno de erros",
            children: [
              (0, R.jsxs)("label", {
                className: "field",
                children: [
                  "Mat\xE9ria",
                  (0, R.jsxs)("select", {
                    id: "errors-subject",
                    value: m,
                    onChange: (N) => f({ subject: N.target.value, theme: "", subtopic: "" }),
                    children: [
                      (0, R.jsxs)("option", {
                        value: "",
                        children: ["Todas as mat\xE9rias (", n.length, ")"],
                      }),
                      d.map((N) =>
                        (0, R.jsxs)(
                          "option",
                          { value: N, children: [N, " (", n.filter((Ce) => l(Ce) === N).length, ")"] },
                          N,
                        ),
                      ),
                    ],
                  }),
                ],
              }),
              (0, R.jsxs)("label", {
                className: "field",
                children: [
                  "Tema principal",
                  (0, R.jsxs)("select", {
                    id: "errors-theme",
                    value: b,
                    onChange: (N) => f({ theme: N.target.value, subtopic: "" }),
                    children: [
                      (0, R.jsxs)("option", { value: "", children: ["Todos os temas (", p.length, ")"] }),
                      v.map((N) =>
                        (0, R.jsxs)(
                          "option",
                          { value: N, children: [N, " (", p.filter((Ce) => i(Ce) === N).length, ")"] },
                          N,
                        ),
                      ),
                    ],
                  }),
                ],
              }),
              h.length > 0 &&
                (0, R.jsxs)("label", {
                  className: "field",
                  children: [
                    "Subtema",
                    (0, R.jsxs)("select", {
                      id: "errors-subtopic",
                      value: x,
                      onChange: (N) => f({ subtopic: N.target.value }),
                      children: [
                        (0, R.jsxs)("option", {
                          value: "",
                          children: ["Todos os subtemas (", y.length, ")"],
                        }),
                        h.map((N) =>
                          (0, R.jsxs)(
                            "option",
                            {
                              value: N,
                              children: [N, " (", y.filter((Ce) => Z(s(Ce)) === Z(N)).length, ")"],
                            },
                            N,
                          ),
                        ),
                      ],
                    }),
                  ],
                }),
              (0, R.jsx)("div", {
                className: "filter-chips",
                role: "tablist",
                "aria-label": "Filtrar por entendimento",
                children: Vl.map(([N, Ce]) =>
                  (0, R.jsxs)(
                    "button",
                    {
                      role: "tab",
                      "aria-selected": u.level === N,
                      className: "chip" + (u.level === N ? " active" : ""),
                      onClick: () => f({ level: N }),
                      children: [
                        Ce,
                        " ",
                        (0, R.jsx)("span", { children: C.filter((Bo) => bn(Bo.understanding, N)).length }),
                      ],
                    },
                    N,
                  ),
                ),
              }),
              (0, R.jsxs)("button", {
                className: "chip" + (u.due ? " active" : ""),
                "aria-pressed": u.due,
                onClick: () => f({ due: !u.due }),
                children: [
                  "Para revisar hoje ",
                  (0, R.jsx)("span", { children: $.filter((N) => g.has(N.id)).length }),
                ],
              }),
            ],
          }),
        (0, R.jsxs)("div", {
          className: "errors-layout",
          children: [
            (0, R.jsxs)("aside", {
              className: "error-list",
              children: [
                n.length > 0 &&
                  !A.length &&
                  (0, R.jsx)("p", {
                    className: "meta",
                    children: u.due
                      ? "Nenhuma revis\xE3o para hoje com esses filtros."
                      : "Nenhum erro com esses filtros.",
                  }),
                _.map((N) => {
                  let Ce = A.filter((Yt) => Q(Yt) === N),
                    [Bo, Ud] = JSON.parse(N);
                  return (0, R.jsxs)(
                    "details",
                    {
                      open: !0,
                      children: [
                        (0, R.jsxs)("summary", {
                          children: [
                            (0, R.jsxs)("span", { children: [Bo, (0, R.jsx)("strong", { children: Ud })] }),
                            (0, R.jsxs)("small", {
                              children: [Ce.length, " ", Ce.length === 1 ? "erro" : "erros"],
                            }),
                          ],
                        }),
                        Ce.map((Yt) =>
                          (0, R.jsxs)(
                            "button",
                            {
                              className: "error-item" + (q?.id === Yt.id ? " selected" : ""),
                              onClick: () => J(Yt.questionId),
                              children: [
                                (0, R.jsx)(_n, { size: 15 }),
                                (0, R.jsxs)("span", {
                                  children: [
                                    Yt.questionSnapshot.topic || "Quest\xE3o",
                                    (0, R.jsx)("small", {
                                      children: [
                                        Yt.questionSnapshot.board,
                                        Yt.questionSnapshot.number
                                          ? "#" + Yt.questionSnapshot.number
                                          : "Sem n\xFAmero",
                                      ]
                                        .filter(Boolean)
                                        .join(" \xB7 "),
                                    }),
                                    (0, R.jsx)("small", {
                                      className: "level-pill level-" + (Yt.understanding ?? "none"),
                                      children: jo(Yt.understanding),
                                    }),
                                    g.has(Yt.id)
                                      ? (0, R.jsx)("small", {
                                          className: "level-pill review-due",
                                          children: "Revisar hoje",
                                        })
                                      : RC(Yt) &&
                                        (0, R.jsx)("small", {
                                          className: "level-pill review-done",
                                          children: "Revisado hoje",
                                        }),
                                  ],
                                }),
                              ],
                            },
                            Yt.id,
                          ),
                        ),
                      ],
                    },
                    N,
                  );
                }),
              ],
            }),
            Y && q
              ? (0, R.jsxs)("article", {
                  className: "paper error-detail",
                  children: [
                    (0, R.jsxs)("div", {
                      className: "section-heading",
                      children: [
                        (0, R.jsx)("span", {
                          className: "small-label",
                          children: o(q).subtopic
                            ? [Y.subject, o(q).theme, o(q).subtopic].join(" \u203A ")
                            : `${Y.subject} \xB7 ${Y.topic}`,
                        }),
                        (0, R.jsx)("span", {
                          className: "badge",
                          children: Y.source === "tec-manual" ? "Adicionada por voc\xEA" : "Fict\xEDcia",
                        }),
                      ],
                    }),
                    (0, R.jsx)("p", {
                      className: "meta",
                      children: [Y.board, Y.year || "", Y.exam, Y.number ? `TEC #${Y.number}` : ""]
                        .filter(Boolean)
                        .join(" \xB7 "),
                    }),
                    (0, R.jsx)("h2", { children: "Encontre o ponto de virada." }),
                    (0, R.jsx)(Zl, {
                      value: q.understanding,
                      at: q.understandingAt,
                      onChange: (N) => t.setErrorUnderstanding(q.id, N),
                    }),
                    (0, R.jsx)(pO, { error: q }, q.id),
                    (0, R.jsx)("p", { className: "question-statement", children: Y.statement }),
                    (0, R.jsx)("div", {
                      className: "alternatives",
                      children: Object.entries(Y.alternatives).map(([N, Ce]) =>
                        (0, R.jsxs)(
                          "div",
                          {
                            className: `alternative ${N === Y.correct ? "correct" : N === Y.chosen ? "incorrect" : ""}`,
                            children: [
                              (0, R.jsx)("span", { className: "option-letter", children: N }),
                              (0, R.jsx)("span", { children: Ce }),
                              N === Y.correct && (0, R.jsx)(ca, { size: 18 }),
                            ],
                          },
                          N,
                        ),
                      ),
                    }),
                    (0, R.jsxs)("div", {
                      className: "answer-summary",
                      children: [
                        (0, R.jsxs)("span", {
                          className: "wrong-answer",
                          children: ["Voc\xEA marcou: ", (0, R.jsx)("strong", { children: Y.chosen })],
                        }),
                        (0, R.jsxs)("span", {
                          children: ["Gabarito: ", (0, R.jsx)("strong", { children: Y.correct })],
                        }),
                      ],
                    }),
                    (0, R.jsxs)("div", {
                      className: "callout",
                      children: [
                        (0, R.jsx)("h3", { children: "Por que essa \xE9 a resposta?" }),
                        (0, R.jsx)("p", {
                          children: Y.commentary || "Coment\xE1rio do gabarito n\xE3o informado.",
                        }),
                      ],
                    }),
                    (0, R.jsxs)("div", {
                      className: "error-concepts",
                      children: [
                        (0, R.jsx)("h3", { children: "O que levar desta quest\xE3o" }),
                        (0, R.jsxs)("p", {
                          children: [(0, R.jsx)("strong", { children: "Conceito:" }), " ", q.concept],
                        }),
                        (0, R.jsxs)("p", {
                          children: [
                            (0, R.jsx)("strong", { children: "Motivo prov\xE1vel:" }),
                            " ",
                            q.probableCause,
                          ],
                        }),
                        (0, R.jsxs)("p", {
                          children: [
                            (0, R.jsx)("strong", { children: "Regra correta:" }),
                            " ",
                            q.correctRule ||
                              "Ainda n\xE3o analisada. Use o Professor para registrar a explica\xE7\xE3o.",
                          ],
                        }),
                        q.trap &&
                          (0, R.jsxs)("p", {
                            children: [(0, R.jsx)("strong", { children: "Pegadinha:" }), " ", q.trap],
                          }),
                        q.memorizationPhrase && (0, R.jsx)("blockquote", { children: q.memorizationPhrase }),
                        t.activeMaterial().some((N) => N.id === q.sectionId) &&
                          (0, R.jsx)(re, {
                            className: "text-link",
                            href: `/material?topico=${q.sectionId}`,
                            children: "Abrir trecho no Material \xDAnico \u2192",
                          }),
                      ],
                    }),
                    (0, R.jsx)(r3, { questionId: Y.id }, Y.id),
                    (0, R.jsxs)("div", {
                      className: "actions",
                      children: [
                        t.activeMaterial().some((N) => N.id === Y.sectionId) &&
                          (0, R.jsxs)(re, {
                            className: "button primary",
                            href: `/foco?topico=${Y.sectionId}&questao=${Y.id}`,
                            children: ["Testar novamente ", (0, R.jsx)(gt, { size: 16 })],
                          }),
                        (0, R.jsx)(re, {
                          className: "button",
                          href: `/professor?questao=${Y.id}`,
                          children: "Explicar com Professor Audis",
                        }),
                      ],
                    }),
                    (0, R.jsxs)("details", {
                      children: [
                        (0, R.jsxs)("summary", {
                          children: ["Hist\xF3rico de revis\xE3o \xB7 ", q.reviews.length],
                        }),
                        q.reviews.length
                          ? q.reviews.map((N, Ce) =>
                              (0, R.jsxs)(
                                "p",
                                {
                                  className: "meta",
                                  children: [
                                    new Date(N.date).toLocaleString("pt-BR"),
                                    " \xB7",
                                    " ",
                                    N.recalled
                                      ? "Lembrou na revis\xE3o"
                                      : "N\xE3o lembrou; revisar novamente",
                                  ],
                                },
                                Ce,
                              ),
                            )
                          : (0, R.jsx)("p", {
                              className: "meta",
                              children: "Nenhuma revis\xE3o registrada.",
                            }),
                      ],
                    }),
                  ],
                })
              : n.length
                ? (0, R.jsxs)("div", {
                    className: "empty-state",
                    children: [
                      (0, R.jsx)(_n, { size: 28 }),
                      (0, R.jsx)("h2", {
                        children: u.due ? "Nenhuma revis\xE3o para hoje" : "Nenhum erro com esses filtros",
                      }),
                      (0, R.jsx)("p", {
                        children: u.due
                          ? "Cada erro volta aqui no dia marcado para a revis\xE3o dele."
                          : "Mude a mat\xE9ria, o tema ou o entendimento para ver outros erros.",
                      }),
                      (0, R.jsx)("button", {
                        className: "button",
                        onClick: () => f(wh),
                        children: "Limpar filtros",
                      }),
                    ],
                  })
                : (0, R.jsxs)("div", {
                    className: "empty-state",
                    children: [
                      (0, R.jsx)(_n, { size: 28 }),
                      (0, R.jsx)("h2", { children: "Sem erros por aqui" }),
                      (0, R.jsx)("p", {
                        children: "Somente quest\xF5es respondidas incorretamente entram neste caderno.",
                      }),
                    ],
                  }),
          ],
        }),
      ],
    });
  }
  var Et = U(Le());
  var Md = U(Le());
  var $h = U(Le());
  var Kt = U(X()),
    r0 = (e) => e.sectionId + "\0" + e.phrase;
  function nM({ notice: e }) {
    let { service: t } = W(),
      a = (0, $h.useRef)(e);
    e && (a.current = e);
    let [n, r] = (0, $h.useState)({}),
      o = a.current;
    if (!o) return null;
    let i = (s, l) => {
      let u = r0(s);
      if (!l) {
        r((c) => ({ ...c, [u]: { kind: "kept" } }));
        return;
      }
      try {
        (t.setHighlightUnderstanding(s.sectionId, s.phrase, "partial"),
          r((c) => ({ ...c, [u]: { kind: "reviewed" } })));
      } catch (c) {
        r((f) => ({ ...f, [u]: { kind: "failed", message: c.message } }));
      }
    };
    return (0, Kt.jsxs)("div", {
      className: "understood-check",
      children: [
        o.items.map((s) => {
          let l = n[r0(s)];
          return (0, Kt.jsxs)(
            "div",
            {
              className: "understood-item",
              children: [
                (0, Kt.jsxs)("p", {
                  children: [
                    s.text,
                    " ",
                    (0, Kt.jsxs)("span", {
                      className: "meta",
                      children: ["Se\xE7\xE3o: ", s.sectionTitle, "."],
                    }),
                  ],
                }),
                l?.kind === "reviewed"
                  ? (0, Kt.jsx)("p", { className: "meta", children: tc.reviewed })
                  : l?.kind === "kept"
                    ? (0, Kt.jsx)("p", { className: "meta", children: tc.kept })
                    : (0, Kt.jsxs)(Kt.Fragment, {
                        children: [
                          l?.kind === "failed" &&
                            (0, Kt.jsx)("p", { className: "understood-error", children: l.message }),
                          (0, Kt.jsxs)("div", {
                            className: "understood-actions",
                            children: [
                              (0, Kt.jsx)("button", {
                                type: "button",
                                className: "button",
                                onClick: () => i(s, !0),
                                children: tc.review,
                              }),
                              (0, Kt.jsx)("button", {
                                type: "button",
                                className: "button",
                                onClick: () => i(s, !1),
                                children: tc.keep,
                              }),
                            ],
                          }),
                        ],
                      }),
              ],
            },
            r0(s),
          );
        }),
        o.more > 0 && (0, Kt.jsx)("p", { className: "meta", children: o.moreText }),
      ],
    });
  }
  var ut = U(X());
  function n0({ feedback: e, inSession: t = !1 }) {
    return (0, ut.jsxs)("div", {
      className: "answer-feedback " + e.tone,
      children: [
        (0, ut.jsx)("p", {
          className: "meta",
          children: "Resposta registrada. Seu desempenho foi atualizado.",
        }),
        (0, ut.jsx)("strong", { children: e.title }),
        (0, ut.jsx)("p", { children: e.detail }),
        e.milestones.map((a) => (0, ut.jsx)("p", { className: "feedback-milestone", children: a }, a)),
        (0, ut.jsx)(nM, { notice: e.understood }),
        !t &&
          e.material &&
          (0, ut.jsxs)(re, {
            className: "text-link",
            href: `/material?topico=${e.material.id}`,
            children: ["Rever no material: ", e.material.topic, " \u2192"],
          }),
        !t && (0, ut.jsx)("p", { className: "meta", children: e.nextStep.text }),
      ],
    });
  }
  function oM({ question: e }) {
    let { service: t, state: a } = W(),
      n = a.errors.find((d) => Ae(d.questionSnapshot) === Ae(e)),
      [r, o] = (0, Md.useState)(e.chosen ?? ""),
      [i, s] = (0, Md.useState)(""),
      [l, u] = (0, Md.useState)(!1),
      [c, f] = (0, Md.useState)(null);
    return (0, ut.jsxs)("section", {
      className: "callout stack",
      children: [
        (0, ut.jsx)("h3", { children: e.chosen ? "Atualizar minha resposta" : "Informar minha resposta" }),
        (0, ut.jsxs)("p", {
          children: ["A resposta marcada permite calcular seu desempenho. Gabarito: ", e.correct, "."],
        }),
        (0, ut.jsxs)("label", {
          className: "field",
          children: [
            "Alternativa que voc\xEA marcou",
            (0, ut.jsxs)("select", {
              value: r,
              onChange: (d) => {
                (o(d.target.value), f(null));
              },
              children: [
                (0, ut.jsx)("option", { value: "", children: "Selecione sua resposta" }),
                Object.keys(e.alternatives).map((d) => (0, ut.jsx)("option", { value: d, children: d }, d)),
              ],
            }),
          ],
        }),
        (0, ut.jsx)("button", {
          className: "button",
          disabled: !r,
          onClick: () => {
            try {
              (t.recordAnswer(e.id, r), f(t.answerFeedback(e.id)), u(!1), s(""));
            } catch (d) {
              (f(null), u(!0), s(d.message));
            }
          },
          children: "Salvar resposta",
        }),
        n
          ? (0, ut.jsx)(re, {
              className: "text-link",
              href: `/erros?questao=${n.questionId}`,
              children: "Abrir registro no Caderno de Erros \u2192",
            })
          : e.answeredCorrectly === !1 &&
            (0, ut.jsx)("button", {
              className: "button",
              onClick: () => {
                try {
                  (t.addError(e.id),
                    c && f(t.answerFeedback(e.id)),
                    s(c ? "" : "Quest\xE3o adicionada ao Caderno de Erros."),
                    u(!1));
                } catch (d) {
                  (u(!0), s(d.message));
                }
              },
              children: "Adicionar ao Caderno de Erros",
            }),
        (0, ut.jsx)("div", {
          role: "status",
          "aria-live": "polite",
          children: c && !l && (0, ut.jsx)(n0, { feedback: c }),
        }),
        i && (0, ut.jsx)(te, { error: l, children: i }),
      ],
    });
  }
  async function iM(e, t, a) {
    let n = await ka("sample");
    if (!n) throw { code: "unavailable", message: "Abra o Audis pelo Claude para criar o resumo." };
    let r = e.question(t),
      o = e.repository.get().responses[t],
      i = Object.entries(r.alternatives).map(([l, u]) => `${l}) ${u}`).join(`
`),
      s = `Voc\xEA explica quest\xF5es de concurso para uma pessoa de 16 anos que nunca estudou o assunto. Escreva em portugu\xEAs do Brasil, com frases curtas, palavras do dia a dia e, quando precisar de um termo t\xE9cnico, explique-o entre par\xEAnteses na primeira vez. Nada de "como vimos" ou de citar artigos de lei sem dizer o que eles significam. Use um exemplo concreto do cotidiano quando ajudar.

Formato da resposta (texto corrido, sem markdown, sem t\xEDtulos em negrito):
1. "Do que a quest\xE3o trata": 2 ou 3 frases sobre o assunto, como se contasse a um amigo.
2. "O que a quest\xE3o pergunta": 1 ou 2 frases.
3. Uma linha para CADA alternativa, come\xE7ando pela letra, dizendo em palavras simples o que ela afirma e por que est\xE1 certa ou errada. Marque a correta com "\u2714".
4. "Para lembrar": uma frase curta e f\xE1cil de guardar.
Entre 150 e 300 palavras no total.

Enunciado:
${r.statement}

Alternativas:
${i}

Gabarito: ${r.correct}${r.chosen ? ` \xB7 a pessoa marcou ${r.chosen}` : ""}
${
  r.commentary
    ? `
Coment\xE1rio do professor (use como base, sem copiar):
${r.commentary.slice(0, 4e3)}`
    : ""
}${
        o?.explanation
          ? `
An\xE1lise j\xE1 feita (use como base):
${o.explanation.slice(0, 3e3)}`
          : ""
      }`;
    try {
      let l = await n(s, {
        signal: a.signal,
        modelTier: "default",
        onText: ({ text: u }) => a.onText?.(u),
        ...(a.refresh ? { cache: !1 } : {}),
      });
      return e.saveSimpleSummary(
        t,
        l.text,
        `Claude (${l.modelTierApplied === "complex" ? "aprofundado" : "padr\xE3o"}) no Audis`,
      );
    } catch (l) {
      throw new Error(Sr(l));
    }
  }
  var L = U(X()),
    sM = "magis:professor-filter",
    o0 = { subject: "", theme: "", subtopic: "", level: "todos" },
    n3 = () => {
      try {
        return { ...o0, ...JSON.parse(localStorage.getItem(sM) ?? "{}") };
      } catch {
        return o0;
      }
    },
    o3 = (e) =>
      e.answeredCorrectly ? "acertou" : e.answeredCorrectly === !1 ? "errou" : "n\xE3o respondida";
  function i3({ question: e }) {
    let { service: t } = W(),
      [a, n] = (0, Et.useState)(!1),
      [r, o] = (0, Et.useState)(""),
      [i, s] = (0, Et.useState)(""),
      [l, u] = (0, Et.useState)(null),
      c = e.simpleSummary,
      f = async (d) => {
        let m = new AbortController();
        (u(m), n(!0), o(""), s(""));
        try {
          await iM(t, e.id, { signal: m.signal, refresh: d, onText: o });
        } catch (p) {
          s(p.message);
        } finally {
          (n(!1), u(null), o(""));
        }
      };
    return (0, L.jsxs)("section", {
      className: "paper simple-summary",
      children: [
        (0, L.jsx)("span", {
          className: "small-label",
          children: "EXPLICA\xC7\xC3O PARA ALGU\xC9M DE 16 ANOS",
        }),
        (0, L.jsx)("h2", { children: "Em palavras simples." }),
        a &&
          (0, L.jsxs)("div", {
            className: "analysis-run",
            role: "status",
            "aria-live": "polite",
            children: [
              (0, L.jsx)("p", {
                className: "preserve-lines analysis-text",
                children: r || "O Claude est\xE1 escrevendo o resumo\u2026",
              }),
              (0, L.jsx)("div", {
                className: "actions",
                children: (0, L.jsx)("button", {
                  className: "button",
                  onClick: () => l?.abort(),
                  children: "Parar",
                }),
              }),
            ],
          }),
        !a &&
          c &&
          (0, L.jsxs)(L.Fragment, {
            children: [
              (0, L.jsx)("p", { className: "preserve-lines summary-text", children: c.text }),
              (0, L.jsxs)("p", {
                className: "meta",
                children: [
                  "Escrito em ",
                  new Date(c.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
                  " \xB7 ",
                  c.model,
                ],
              }),
            ],
          }),
        !a &&
          !c &&
          (0, L.jsxs)("p", {
            className: "muted",
            children: [
              "Ainda n\xE3o h\xE1 resumo para esta quest\xE3o. ",
              "Pe\xE7a um ao Claude: ele resume o assunto, a pergunta e cada alternativa em linguagem simples.",
            ],
          }),
        i && (0, L.jsx)(te, { error: !0, children: i }),
        !a &&
          (0, L.jsx)("div", {
            className: "actions",
            children: (0, L.jsx)("button", {
              className: "button primary",
              onClick: () => f(!!c),
              children: c ? "Refazer resumo" : "Criar resumo com o Claude",
            }),
          }),
      ],
    });
  }
  function s3() {
    let [e, t] = (0, Et.useState)(""),
      [a, n] = (0, Et.useState)("");
    (0, Et.useEffect)(() => t(window.location.origin), []);
    let r = e ? `${e}/mcp` : "",
      o = `claude mcp add --transport http magis ${r}`,
      i = async (s, l) => {
        try {
          (await navigator.clipboard.writeText(s), n(l));
        } catch {
          n("");
        }
      };
    return (0, L.jsxs)("details", {
      className: "paper integration-status",
      id: "conector",
      children: [
        (0, L.jsxs)("summary", {
          children: [
            (0, L.jsx)(Oo, { size: 19 }),
            (0, L.jsx)("strong", { children: "Professor pelo Claude" }),
            (0, L.jsx)("span", { className: "muted", children: "conector Audis (MCP)" }),
          ],
        }),
        (0, L.jsxs)("div", {
          className: "stack",
          children: [
            (0, L.jsx)("p", {
              children:
                "O Claude l\xEA seu material, analisa as quest\xF5es e salva fichas, incid\xEAncias e material j\xE1 validados. Usa sua assinatura do Claude, sem API paga.",
            }),
            (0, L.jsxs)("label", {
              className: "field",
              children: [
                "Endere\xE7o do conector",
                (0, L.jsx)("input", { readOnly: !0, value: r, onFocus: (s) => s.currentTarget.select() }),
              ],
            }),
            (0, L.jsxs)("div", {
              className: "actions",
              children: [
                (0, L.jsxs)("button", {
                  className: "button",
                  onClick: () => i(r, "endere\xE7o"),
                  children: [(0, L.jsx)(xr, { size: 16 }), "Copiar endere\xE7o"],
                }),
                (0, L.jsxs)("button", {
                  className: "button",
                  onClick: () => i(o, "comando"),
                  children: [(0, L.jsx)(xr, { size: 16 }), "Copiar comando do Claude Code"],
                }),
              ],
            }),
            a && (0, L.jsxs)("p", { className: "meta", children: ["Copiado: ", a, "."] }),
            (0, L.jsxs)("ol", {
              className: "steps",
              children: [
                (0, L.jsxs)("li", {
                  children: [
                    (0, L.jsx)("strong", { children: "App do Claude (celular e computador):" }),
                    " no claude.ai, Configura\xE7\xF5es \u2192 Conectores \u2192 Adicionar conector personalizado \u2192 cole o endere\xE7o \u2192 Conectar. Entre com sua senha do Audis e permita. O conector passa a aparecer tamb\xE9m no app do celular.",
                  ],
                }),
                (0, L.jsxs)("li", {
                  children: [
                    (0, L.jsx)("strong", { children: "Claude Code:" }),
                    " rode o comando copiado no terminal e, dentro do Claude Code, use /mcp para autenticar.",
                  ],
                }),
                (0, L.jsx)("li", {
                  children:
                    "Na conversa: cole quest\xF5es do TEC ou pe\xE7a \u201CAnalise as quest\xF5es pendentes do Audis\u201D.",
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }
  function i0() {
    let { state: e, service: t } = W(),
      a = Yr(),
      [n, r] = (0, Et.useState)(() => t.openQuestionId(a.get("questao")) ?? ""),
      [o, i] = (0, Et.useState)(""),
      [s, l] = (0, Et.useState)(""),
      [u, c] = (0, Et.useState)(o0);
    (0, Et.useEffect)(() => {
      a.get("questao") || c(n3());
    }, [a]);
    let f = (_) =>
        c((N) => {
          let Ce = { ...N, ..._ };
          try {
            localStorage.setItem(sM, JSON.stringify(Ce));
          } catch {}
          return Ce;
        }),
      d = (0, Et.useMemo)(() => Ih(e), [e]),
      m = (_) => d(_).theme,
      p = (_) => d(_).subtopic,
      v = e.questions.filter((_) => _.source === "tec-manual"),
      b = v.length ? v : e.questions,
      y = [...new Set(b.map((_) => _.subject || "Sem mat\xE9ria"))].sort((_, N) =>
        _.localeCompare(N, "pt-BR"),
      ),
      g = y.includes(u.subject) ? u.subject : "",
      h = b.filter((_) => !g || (_.subject || "Sem mat\xE9ria") === g),
      x = [...new Set(h.map(m))].sort((_, N) => _.localeCompare(N, "pt-BR")),
      C = x.includes(u.theme) ? u.theme : "",
      $ = h.filter((_) => !C || m(_) === C),
      A = vi($.map(p)),
      D = A.find((_) => Z(_) === Z(u.subtopic)) ?? "",
      ae = $.filter((_) => !D || Z(p(_)) === Z(D)),
      J = ae.filter((_) => bn(_.understanding, u.level));
    (0, Et.useEffect)(() => {
      J.length && !J.some((_) => _.id === n) && r(J[0].id);
    }, [J, n]);
    let q = e.questions.find((_) => _.id === n) ?? J[0] ?? b[0],
      Y = q && e.responses[q.id],
      Q = e.proposals.filter((_) => _.questionId === q?.id);
    return (
      (0, Et.useEffect)(
        () => (
          t.selectQuestion(q?.id ?? null),
          () => {
            t.selectQuestion(null);
          }
        ),
        [t, q?.id],
      ),
      q
        ? (0, L.jsxs)("main", {
            className: "page wide-page",
            children: [
              (0, L.jsx)(Za, {
                eyebrow: "UM PROFESSOR AO SEU LADO",
                title: "Professor Audis",
                description: "Entenda a quest\xE3o. Conecte o conceito. Aprimore seu material.",
              }),
              (0, L.jsx)("div", {
                className: "actions",
                children: (0, L.jsxs)(re, {
                  className: "button primary",
                  href: "/adicionar",
                  children: ["Adicionar quest\xE3o do TEC ", (0, L.jsx)(Eo, { size: 16 })],
                }),
              }),
              a.get("questao") &&
                !e.questions.some((_) => _.id === a.get("questao")) &&
                (0, L.jsx)(te, {
                  error: !0,
                  children:
                    "A quest\xE3o desta sess\xE3o n\xE3o est\xE1 mais dispon\xEDvel. Adicione-a novamente; abaixo est\xE1 sua quest\xE3o mais recente.",
                }),
              !!0 && (0, L.jsx)(s3, {}),
              (0, L.jsxs)("section", {
                className: "paper professor-filters",
                "aria-label": "Filtrar quest\xF5es",
                children: [
                  (0, L.jsxs)("div", {
                    className: "error-filters",
                    children: [
                      (0, L.jsxs)("label", {
                        className: "field",
                        children: [
                          "Mat\xE9ria",
                          (0, L.jsxs)("select", {
                            id: "professor-subject",
                            value: g,
                            onChange: (_) => f({ subject: _.target.value, theme: "", subtopic: "" }),
                            children: [
                              (0, L.jsxs)("option", {
                                value: "",
                                children: ["Todas as mat\xE9rias (", b.length, ")"],
                              }),
                              y.map((_) =>
                                (0, L.jsxs)(
                                  "option",
                                  {
                                    value: _,
                                    children: [
                                      _,
                                      " (",
                                      b.filter((N) => (N.subject || "Sem mat\xE9ria") === _).length,
                                      ")",
                                    ],
                                  },
                                  _,
                                ),
                              ),
                            ],
                          }),
                        ],
                      }),
                      (0, L.jsxs)("label", {
                        className: "field",
                        children: [
                          "Tema principal",
                          (0, L.jsxs)("select", {
                            id: "professor-theme",
                            value: C,
                            onChange: (_) => f({ theme: _.target.value, subtopic: "" }),
                            children: [
                              (0, L.jsxs)("option", {
                                value: "",
                                children: ["Todos os temas (", h.length, ")"],
                              }),
                              x.map((_) =>
                                (0, L.jsxs)(
                                  "option",
                                  { value: _, children: [_, " (", h.filter((N) => m(N) === _).length, ")"] },
                                  _,
                                ),
                              ),
                            ],
                          }),
                        ],
                      }),
                      A.length > 0 &&
                        (0, L.jsxs)("label", {
                          className: "field",
                          children: [
                            "Subtema",
                            (0, L.jsxs)("select", {
                              id: "professor-subtopic",
                              value: D,
                              onChange: (_) => f({ subtopic: _.target.value }),
                              children: [
                                (0, L.jsxs)("option", {
                                  value: "",
                                  children: ["Todos os subtemas (", $.length, ")"],
                                }),
                                A.map((_) =>
                                  (0, L.jsxs)(
                                    "option",
                                    {
                                      value: _,
                                      children: [_, " (", $.filter((N) => Z(p(N)) === Z(_)).length, ")"],
                                    },
                                    _,
                                  ),
                                ),
                              ],
                            }),
                          ],
                        }),
                      (0, L.jsx)("div", {
                        className: "filter-chips",
                        role: "tablist",
                        "aria-label": "Filtrar por entendimento",
                        children: Vl.map(([_, N]) =>
                          (0, L.jsxs)(
                            "button",
                            {
                              role: "tab",
                              "aria-selected": u.level === _,
                              className: "chip" + (u.level === _ ? " active" : ""),
                              onClick: () => f({ level: _ }),
                              children: [
                                N,
                                " ",
                                (0, L.jsx)("span", {
                                  children: ae.filter((Ce) => bn(Ce.understanding, _)).length,
                                }),
                              ],
                            },
                            _,
                          ),
                        ),
                      }),
                    ],
                  }),
                  (0, L.jsx)(vO, {
                    levels: ae.map((_) => _.understanding),
                    title: [g || "Todas as mat\xE9rias", C || "todos os temas", D]
                      .filter(Boolean)
                      .join(" \xB7 "),
                  }),
                  (0, L.jsxs)("label", {
                    className: "field question-picker",
                    children: [
                      "Quest\xE3o em estudo",
                      J.length !== b.length ? ` (${J.length} de ${b.length})` : "",
                      (0, L.jsxs)("select", {
                        value: J.some((_) => _.id === n) ? n : "",
                        onChange: (_) => r(_.target.value),
                        children: [
                          !J.some((_) => _.id === n) &&
                            (0, L.jsx)("option", {
                              value: "",
                              children: J.length
                                ? "Escolha uma quest\xE3o"
                                : "Nenhuma quest\xE3o com esses filtros",
                            }),
                          J.map((_) =>
                            (0, L.jsxs)(
                              "option",
                              {
                                value: _.id,
                                children: [
                                  _.topic,
                                  " \xB7 ",
                                  _.number ? `#${_.number}` : "sem n\xFAmero",
                                  " \xB7 ",
                                  o3(_),
                                  _.understanding
                                    ? ` \xB7 ${_.understanding === "understood" ? "entendido" : _.understanding === "partial" ? "parcial" : "n\xE3o entendido"}`
                                    : "",
                                ],
                              },
                              _.id,
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              (0, L.jsxs)("section", {
                className: "paper question-summary",
                children: [
                  q.source === "tec-manual" && (0, L.jsx)(oM, { question: q }, q.id),
                  (0, L.jsxs)("div", {
                    className: "section-heading",
                    children: [
                      (0, L.jsx)("span", {
                        className: "small-label",
                        children:
                          [q.board, q.year || "", q.exam].filter(Boolean).join(" \xB7 ") ||
                          "Dados da banca n\xE3o informados",
                      }),
                      (0, L.jsx)("span", {
                        className: "badge",
                        children:
                          q.source === "tec-manual" ? "Adicionada por voc\xEA" : "Quest\xE3o fict\xEDcia",
                      }),
                    ],
                  }),
                  (0, L.jsx)("h2", { children: q.topic }),
                  d(q).subtopic &&
                    (0, L.jsx)("p", {
                      className: "meta",
                      children: [q.subject || "Sem mat\xE9ria", d(q).theme, d(q).subtopic].join(" \u203A "),
                    }),
                  (0, L.jsx)("p", { children: q.statement }),
                  (0, L.jsxs)("div", {
                    className: "answer-summary",
                    children: [
                      (0, L.jsxs)("span", {
                        children: [
                          "Voc\xEA marcou: ",
                          (0, L.jsx)("strong", { children: q.chosen ?? "\u2014" }),
                        ],
                      }),
                      (0, L.jsxs)("span", {
                        children: ["Gabarito: ", (0, L.jsx)("strong", { children: q.correct })],
                      }),
                    ],
                  }),
                  (0, L.jsx)(Zl, {
                    value: q.understanding,
                    at: q.understandingAt,
                    onChange: (_) => t.setQuestionUnderstanding(q.id, _),
                  }),
                  (0, L.jsxs)("details", {
                    children: [
                      (0, L.jsx)("summary", { children: "Ver alternativas e coment\xE1rio" }),
                      (0, L.jsx)("ol", {
                        className: "alternatives-text",
                        children: Object.entries(q.alternatives).map(([_, N]) =>
                          (0, L.jsxs)(
                            "li",
                            { children: [(0, L.jsxs)("strong", { children: [_, "."] }), " ", N] },
                            _,
                          ),
                        ),
                      }),
                      (0, L.jsx)("p", { children: q.commentary }),
                    ],
                  }),
                ],
              }),
              Y &&
                (0, L.jsxs)("section", {
                  className: "paper analysis-result",
                  children: [
                    (0, L.jsx)("span", {
                      className: "small-label",
                      children: "AN\xC1LISE IMPORTADA \xB7 N\xC3O GERADA PELO Audis",
                    }),
                    (0, L.jsx)("h2", { children: "Compreender antes de memorizar." }),
                    (0, L.jsx)("p", { className: "preserve-lines", children: Y.explanation }),
                    (0, L.jsxs)("div", {
                      className: "callout",
                      children: [
                        (0, L.jsx)("h3", { children: "Conceito nuclear" }),
                        (0, L.jsx)("p", { children: Y.coreThesis }),
                      ],
                    }),
                    Y.foundation &&
                      (0, L.jsxs)("div", {
                        children: [
                          (0, L.jsx)("h3", { children: "Fundamento" }),
                          (0, L.jsx)("p", { children: Y.foundation }),
                        ],
                      }),
                    !!Y.exceptions?.length &&
                      (0, L.jsxs)("div", {
                        children: [
                          (0, L.jsx)("h3", { children: "Exce\xE7\xF5es" }),
                          (0, L.jsx)("ul", {
                            children: Y.exceptions.map((_, N) => (0, L.jsx)("li", { children: _ }, N)),
                          }),
                        ],
                      }),
                    Y.examinerTrap &&
                      (0, L.jsxs)("div", {
                        children: [
                          (0, L.jsx)("h3", { children: "Pegadinha da banca" }),
                          (0, L.jsx)("p", { children: Y.examinerTrap }),
                        ],
                      }),
                    Y.memorizationPhrase && (0, L.jsx)("blockquote", { children: Y.memorizationPhrase }),
                    (0, L.jsx)("div", {
                      className: "classification",
                      children: [Y.subject, Y.topic, ...(Y.subtopics ?? []), ...(Y.tags ?? [])]
                        .filter(Boolean)
                        .map((_, N) => (0, L.jsx)("span", { className: "badge", children: _ }, N)),
                    }),
                    (0, L.jsxs)("div", {
                      id: "lacunas",
                      className: "callout",
                      children: [
                        (0, L.jsx)("h3", { children: "Rela\xE7\xE3o com o Material \xDAnico" }),
                        (0, L.jsxs)("p", {
                          children: [
                            Y.materialAnalysis.hasGap ? "A an\xE1lise aponta uma lacuna. " : "",
                            Y.materialAnalysis.hasConflict
                              ? "A an\xE1lise aponta um poss\xEDvel conflito. "
                              : "",
                            Y.materialAnalysis.alreadyCovered
                              ? "O conceito j\xE1 tem cobertura no material. "
                              : "",
                            Y.materialAnalysis.explanation,
                          ],
                        }),
                        Q.some((_) => _.status === "pending") &&
                          (0, L.jsx)("a", {
                            href: "#propostas",
                            className: "text-link",
                            children: "Ver propostas para revis\xE3o \u2192",
                          }),
                      ],
                    }),
                    Y.visualSuggestion?.useful &&
                      (0, L.jsxs)("div", {
                        className: "callout",
                        children: [
                          (0, L.jsxs)("h3", {
                            children: [
                              "Sugest\xE3o visual \xB7",
                              " ",
                              Y.visualSuggestion.title ?? "Esquema de estudo",
                            ],
                          }),
                          (0, L.jsx)("p", { children: Y.visualSuggestion.description }),
                          (0, L.jsxs)("p", {
                            className: "meta",
                            children: [
                              "Tipo: ",
                              Y.visualSuggestion.type ?? "a definir",
                              " \xB7 Vinculada a ",
                              q.topic,
                              ". Recurso ainda n\xE3o gerado.",
                            ],
                          }),
                          Y.visualSuggestion.generationPrompt &&
                            (0, L.jsxs)("details", {
                              children: [
                                (0, L.jsx)("summary", { children: "Ver prompt guardado" }),
                                (0, L.jsx)("p", {
                                  className: "preserve-lines",
                                  children: Y.visualSuggestion.generationPrompt,
                                }),
                              ],
                            }),
                        ],
                      }),
                    q.source !== "tec-manual" &&
                      (0, L.jsxs)("div", {
                        className: "actions",
                        children: [
                          q.answeredCorrectly === !1
                            ? (0, L.jsx)("button", {
                                className: "button",
                                disabled: e.errors.some((_) => _.questionId === q.id),
                                onClick: () => {
                                  try {
                                    (t.addError(q.id),
                                      i("Quest\xE3o incorreta registrada no Caderno de Erros."));
                                  } catch (_) {
                                    l(_.message);
                                  }
                                },
                                children: e.errors.some((_) => _.questionId === q.id)
                                  ? "J\xE1 est\xE1 no Caderno de Erros"
                                  : "Adicionar ao Caderno de Erros",
                              })
                            : (0, L.jsx)("span", {
                                className: "meta",
                                children:
                                  q.answeredCorrectly === !0
                                    ? "Quest\xE3o correta: n\xE3o ser\xE1 inclu\xEDda no Caderno de Erros."
                                    : "Quest\xE3o ainda n\xE3o respondida: n\xE3o ser\xE1 inclu\xEDda no Caderno de Erros.",
                              }),
                          (0, L.jsx)(re, {
                            className: "text-link",
                            href: `/erros?questao=${q.id}`,
                            children: "Ver rela\xE7\xE3o com meus erros \u2192",
                          }),
                        ],
                      }),
                  ],
                }),
              q.source === "tec-manual" && (0, L.jsx)(i3, { question: q }, q.id),
              o && (0, L.jsx)(te, { children: o }),
              s && (0, L.jsx)(te, { error: !0, children: s }),
              (0, L.jsxs)("section", {
                id: "propostas",
                className: "stack",
                children: [
                  (0, L.jsxs)("div", {
                    className: "section-heading",
                    children: [
                      (0, L.jsx)("h2", { children: "Propostas para o Material \xDAnico" }),
                      (0, L.jsxs)("span", {
                        className: "meta",
                        children: [Q.filter((_) => _.status === "pending").length, " pendentes"],
                      }),
                    ],
                  }),
                  Q.length
                    ? Q.map((_) => (0, L.jsx)(Sh, { proposal: _ }, _.id))
                    : (0, L.jsxs)("div", {
                        className: "empty-state compact",
                        children: [
                          (0, L.jsx)(Ln, { size: 25 }),
                          (0, L.jsx)("h3", { children: "Nenhuma proposta para esta quest\xE3o" }),
                          (0, L.jsx)("p", {
                            children:
                              "As an\xE1lises recebidas podem sugerir complementos. A decis\xE3o final \xE9 sua.",
                          }),
                        ],
                      }),
                ],
              }),
              (0, L.jsx)("p", {
                className: "session-note",
                children:
                  "Quest\xF5es, an\xE1lises, propostas e aprova\xE7\xF5es s\xE3o salvas na sua conta. Confira a sincroniza\xE7\xE3o antes de fechar.",
              }),
            ],
          })
        : (0, L.jsxs)("main", {
            className: "page wide-page",
            children: [
              (0, L.jsx)(Za, {
                eyebrow: "UM PROFESSOR AO SEU LADO",
                title: "Professor Audis",
                description: "Entenda a quest\xE3o. Conecte o conceito. Aprimore seu material.",
              }),
              (0, L.jsxs)("div", {
                className: "empty-state",
                children: [
                  (0, L.jsx)(Oo, { size: 28 }),
                  (0, L.jsx)("h2", { children: "Nenhuma quest\xE3o no acervo" }),
                  (0, L.jsx)("p", {
                    children: "Adicione uma quest\xE3o do TEC para estudar com o Professor.",
                  }),
                  (0, L.jsxs)(re, {
                    className: "button primary",
                    href: "/adicionar",
                    children: ["Adicionar quest\xE3o do TEC ", (0, L.jsx)(Eo, { size: 16 })],
                  }),
                ],
              }),
            ],
          })
    );
  }
  var Ch = U(Le());
  var le = U(X()),
    l0 = (e) => `${e.slice(8, 10)}/${e.slice(5, 7)}`,
    s0 = (e) => `${l0(e)}/${e.slice(0, 4)}`;
  function u0({ state: e }) {
    let [t, a] = (0, Ch.useState)(14),
      n = (0, Ch.useMemo)(() => G1(e, t), [e, t]),
      r = Math.max(1, n.best.count),
      o = [...new Set([0, Math.ceil(r / 2), r])],
      i = t === 7 ? 440 : 800,
      s = 36,
      l = i - 60,
      u = 22,
      c = 164,
      f = l / t,
      d = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return (0, le.jsxs)("section", {
      className: "paper spaced stack submission-chart",
      "aria-labelledby": "submission-chart-title",
      children: [
        (0, le.jsxs)("div", {
          className: "section-heading",
          children: [
            (0, le.jsxs)("div", {
              children: [
                (0, le.jsx)("span", { className: "eyebrow", children: "SEU RITMO DE ESTUDO" }),
                (0, le.jsx)("h2", { id: "submission-chart-title", children: "Quest\xF5es enviadas por dia" }),
              ],
            }),
            (0, le.jsxs)("label", {
              className: "field",
              children: [
                "Per\xEDodo",
                (0, le.jsxs)("select", {
                  value: t,
                  onChange: (m) => a(Number(m.target.value)),
                  children: [
                    (0, le.jsx)("option", { value: 7, children: "\xDAltimos 7 dias" }),
                    (0, le.jsx)("option", { value: 14, children: "\xDAltimos 14 dias" }),
                    (0, le.jsx)("option", { value: 30, children: "\xDAltimos 30 dias" }),
                  ],
                }),
              ],
            }),
          ],
        }),
        (0, le.jsx)("div", {
          className: "performance-stats submission-stats",
          "aria-live": "polite",
          children: [
            [n.total, "no per\xEDodo"],
            [n.today, "hoje"],
            [n.average.toLocaleString("pt-BR", { maximumFractionDigits: 1 }), "m\xE9dia por dia"],
            [n.best.count, n.total ? `recorde \xB7 ${l0(n.best.day)}` : "recorde di\xE1rio"],
          ].map(([m, p]) =>
            (0, le.jsxs)(
              "div",
              { children: [(0, le.jsx)("strong", { children: m }), (0, le.jsx)("span", { children: p })] },
              p,
            ),
          ),
        }),
        n.total
          ? (0, le.jsxs)(le.Fragment, {
              children: [
                (0, le.jsx)("div", {
                  className: "submission-chart-scroll",
                  tabIndex: 0,
                  role: "region",
                  "aria-label": "Gr\xE1fico di\xE1rio; role horizontalmente em telas pequenas",
                  children: (0, le.jsxs)("svg", {
                    className: t === 7 ? "submission-bars week" : "submission-bars",
                    viewBox: `0 0 ${i} 228`,
                    role: "img",
                    "aria-label": `${n.total} quest\xF5es em ${t} dias. Maior volume: ${n.best.count} em ${s0(n.best.day)}. Valores detalhados na tabela abaixo.`,
                    children: [
                      o.map((m) => {
                        let p = u + c - (m / r) * c;
                        return (0, le.jsxs)(
                          "g",
                          {
                            children: [
                              (0, le.jsx)("line", {
                                x1: s,
                                x2: s + l,
                                y1: p,
                                y2: p,
                                className: "submission-grid",
                              }),
                              (0, le.jsx)("text", {
                                x: s - 10,
                                y: p + 4,
                                textAnchor: "end",
                                className: "submission-tick",
                                children: m,
                              }),
                            ],
                          },
                          m,
                        );
                      }),
                      n.days.map((m, p) => {
                        let v = (m.count / r) * c,
                          b = s + p * f;
                        return (0, le.jsxs)(
                          "g",
                          {
                            children: [
                              (0, le.jsx)("title", {
                                children: `${s0(m.day)}: ${m.count} ${m.count === 1 ? "quest\xE3o" : "quest\xF5es"}`,
                              }),
                              m.count > 0 &&
                                (0, le.jsx)("rect", {
                                  x: b + f * 0.2,
                                  y: u + c - v,
                                  width: f * 0.6,
                                  height: v,
                                  rx: 3,
                                  className: p === t - 1 ? "submission-bar today" : "submission-bar",
                                }),
                              (0, le.jsx)("text", {
                                x: b + f / 2,
                                y: u + c - v - 7,
                                textAnchor: "middle",
                                className: "submission-value",
                                children: m.count,
                              }),
                              (t <= 14 || p % 3 === 0 || p === t - 1) &&
                                (0, le.jsx)("text", {
                                  x: b + f / 2,
                                  y: u + c + 23,
                                  textAnchor: "middle",
                                  className: "submission-tick",
                                  children: l0(m.day),
                                }),
                            ],
                          },
                          m.day,
                        );
                      }),
                    ],
                  }),
                }),
                (0, le.jsxs)("p", {
                  className: "meta",
                  children: [
                    "Voc\xEA enviou quest\xF5es em ",
                    n.activeDays,
                    " de ",
                    t,
                    " dias. A m\xE9dia inclui os dias sem envios. Datas no fuso do navegador: ",
                    d,
                    ".",
                  ],
                }),
              ],
            })
          : (0, le.jsx)("p", {
              className: "callout",
              children:
                "Nenhum envio registrado neste per\xEDodo. As quest\xF5es aparecer\xE3o aqui assim que forem enviadas ao Professor.",
            }),
        (0, le.jsx)("p", {
          className: "meta",
          children:
            "Uma contagem por quest\xE3o, no primeiro envio. Inclui an\xE1lises em andamento e fichas em revis\xE3o; repetir a an\xE1lise ou aprovar depois n\xE3o aumenta a contagem. Exemplos e pedidos apenas preparados n\xE3o entram.",
        }),
        n.estimated > 0 &&
          (0, le.jsxs)("p", {
            className: "meta",
            children: [
              n.estimated,
              " quest\xE3o(\xF5es) do per\xEDodo n\xE3o t\xEAm hor\xE1rio de envio dispon\xEDvel (hist\xF3rico ou entrada manual). Para elas, usamos a data de cria\xE7\xE3o do pedido ou do cadastro, como aproxima\xE7\xE3o.",
            ],
          }),
        (0, le.jsxs)("details", {
          children: [
            (0, le.jsx)("summary", { children: "Ver n\xFAmeros por dia" }),
            (0, le.jsxs)("table", {
              className: "submission-table",
              children: [
                (0, le.jsxs)("caption", {
                  children: ["Quest\xF5es distintas por dia nos \xFAltimos ", t, " dias"],
                }),
                (0, le.jsx)("thead", {
                  children: (0, le.jsxs)("tr", {
                    children: [
                      (0, le.jsx)("th", { scope: "col", children: "Data" }),
                      (0, le.jsx)("th", { scope: "col", children: "Quest\xF5es" }),
                      (0, le.jsx)("th", { scope: "col", children: "Data aproximada" }),
                    ],
                  }),
                }),
                (0, le.jsx)("tbody", {
                  children: [...n.days]
                    .reverse()
                    .map((m) =>
                      (0, le.jsxs)(
                        "tr",
                        {
                          children: [
                            (0, le.jsx)("th", { scope: "row", children: s0(m.day) }),
                            (0, le.jsx)("td", { children: m.count }),
                            (0, le.jsx)("td", { children: m.estimated || "\u2014" }),
                          ],
                        },
                        m.day,
                      ),
                    ),
                }),
              ],
            }),
          ],
        }),
      ],
    });
  }
  var ge = U(X());
  function c0() {
    let { service: e, state: t } = W(),
      a = e.statistics(),
      n = e.topicPerformance(),
      r = e.performanceQuestions().filter((o) => o.answeredCorrectly === void 0);
    return (0, ge.jsxs)("main", {
      className: "page",
      children: [
        (0, ge.jsx)(Za, {
          eyebrow: "CONSIST\xCANCIA, UM DIA DE CADA VEZ",
          title: "Seu desempenho",
          description: "Resultados das quest\xF5es que voc\xEA trouxe para o Audis.",
        }),
        (0, ge.jsxs)("div", {
          className: "paper spaced",
          children: [
            (0, ge.jsx)("div", {
              className: "performance-stats",
              children: [
                [a.answered, "respondidas"],
                [a.correct, "acertos"],
                [a.incorrect, "erros"],
                [a.accuracy === null ? "\u2014" : `${a.accuracy}%`, "taxa de acerto"],
              ].map(([o, i]) =>
                (0, ge.jsxs)(
                  "div",
                  {
                    children: [(0, ge.jsx)("strong", { children: o }), (0, ge.jsx)("span", { children: i })],
                  },
                  i,
                ),
              ),
            }),
            (0, ge.jsx)("p", {
              className: "meta",
              children:
                "Uma contagem por quest\xE3o distinta, usando a \xFAltima resposta registrada. Reimporta\xE7\xF5es n\xE3o duplicam o resultado. Quest\xF5es de exemplo e fichas ainda em revis\xE3o ficam fora da conta.",
            }),
            (0, ge.jsxs)("p", {
              children: [
                a.unanswered,
                " sem resposta marcada \xB7 ",
                a.xp,
                " XP \xB7 n\xEDvel ",
                a.level,
                " \xB7 sequ\xEAncia de ",
                a.streak,
                " dia(s).",
              ],
            }),
            (0, ge.jsx)("p", {
              className: "meta",
              children:
                "10 XP por quest\xE3o respondida e 35 XP por miss\xE3o conclu\xEDda. A taxa de acerto mede suas respostas, n\xE3o certifica dom\xEDnio do assunto.",
            }),
          ],
        }),
        (0, ge.jsx)(u0, { state: t }),
        !!r.length &&
          (0, ge.jsxs)("section", {
            className: "paper spaced stack",
            children: [
              (0, ge.jsx)("h2", { children: "Falta informar sua resposta" }),
              (0, ge.jsx)("p", {
                children:
                  "Estas quest\xF5es j\xE1 foram cadastradas, mas ainda n\xE3o entram nos acertos ou erros.",
              }),
              r.map((o) =>
                (0, ge.jsxs)(
                  re,
                  {
                    className: "list-row",
                    href: `/professor?questao=${o.id}`,
                    children: [
                      (0, ge.jsxs)("div", {
                        children: [
                          (0, ge.jsx)("strong", { children: o.number ? `TEC #${o.number}` : o.topic }),
                          (0, ge.jsxs)("p", { children: [o.subject, " \xB7 ", o.topic] }),
                        ],
                      }),
                      (0, ge.jsx)("span", { children: "Registrar resposta \u2192" }),
                    ],
                  },
                  o.id,
                ),
              ),
            ],
          }),
        (0, ge.jsxs)("section", {
          className: "stack spaced",
          children: [
            (0, ge.jsx)("h2", { className: "section-title", children: "Acertos por assunto" }),
            !n.length &&
              (0, ge.jsxs)("p", {
                children: [
                  "Nenhuma quest\xE3o sua cadastrada. ",
                  (0, ge.jsx)(re, {
                    className: "text-link",
                    href: "/adicionar",
                    children: "Adicionar uma quest\xE3o",
                  }),
                ],
              }),
            n.map((o) =>
              (0, ge.jsxs)(
                re,
                {
                  className: "list-row",
                  href: o.sectionId
                    ? `/material?topico=${o.sectionId}`
                    : `/professor?questao=${o.questionId}`,
                  children: [
                    (0, ge.jsxs)("div", {
                      children: [
                        (0, ge.jsx)("strong", { children: o.topic }),
                        (0, ge.jsx)("p", { children: o.subject }),
                        (0, ge.jsxs)("p", {
                          children: [
                            o.correct,
                            " acerto(s) \xB7 ",
                            o.incorrect,
                            " erro(s) \xB7 ",
                            o.unanswered,
                            " sem resposta",
                          ],
                        }),
                      ],
                    }),
                    (0, ge.jsxs)("div", {
                      className: "mastery",
                      children: [
                        (0, ge.jsx)("div", {
                          className: "progress-track",
                          children: (0, ge.jsx)("span", { style: { width: `${o.accuracy ?? 0}%` } }),
                        }),
                        (0, ge.jsx)("span", { children: o.accuracy === null ? "\u2014" : `${o.accuracy}%` }),
                      ],
                    }),
                  ],
                },
                JSON.stringify([o.subject, o.topic]),
              ),
            ),
          ],
        }),
        (0, ge.jsxs)("section", {
          className: "stack spaced",
          children: [
            (0, ge.jsx)("h2", { className: "section-title", children: "\xDAltimos resultados registrados" }),
            !a.answered &&
              (0, ge.jsx)("p", {
                children:
                  "Nenhuma resposta registrada ainda. Informe a alternativa que voc\xEA marcou em uma quest\xE3o e ela aparece aqui.",
              }),
            e
              .performanceQuestions()
              .filter((o) => o.answeredCorrectly !== void 0)
              .sort((o, i) => i.date.localeCompare(o.date))
              .slice(0, 20)
              .map((o) =>
                (0, ge.jsxs)(
                  re,
                  {
                    className: "list-row",
                    href: `/professor?questao=${o.id}`,
                    children: [
                      (0, ge.jsxs)("div", {
                        children: [
                          (0, ge.jsx)("strong", { children: o.number ? `TEC #${o.number}` : o.topic }),
                          (0, ge.jsxs)("p", { children: [o.subject, " \xB7 ", o.topic] }),
                          (0, ge.jsxs)("p", {
                            children: ["Voc\xEA marcou ", o.chosen, " \xB7 gabarito ", o.correct],
                          }),
                        ],
                      }),
                      (0, ge.jsx)("span", {
                        className: "badge",
                        children: o.answeredCorrectly ? "Acerto" : "Erro",
                      }),
                    ],
                  },
                  o.id,
                ),
              ),
          ],
        }),
      ],
    });
  }
  var Ot = U(Le());
  var kh = U(Le());
  function uM(e, t) {
    let a = e.questions.find((s) => s.id === t);
    if (!a || a.source !== "tec-manual") return null;
    let n = Ae(a),
      r = [];
    for (let s of e.material)
      if (!s.deletedAt)
        for (let l of s.highlights) {
          let u = Em(l),
            c = u.references ?? [];
          c.some((f) => f.key === n) &&
            r.push({
              sectionId: s.id,
              subject: s.subject,
              topic: s.topic,
              phrase: u.phrase,
              identified: c.length,
              legacy: u.legacyCount ?? 0,
              onlyThis: c.length === 1,
            });
        }
    let o;
    for (let s of e.answerHistory ?? []) {
      let l = Date.parse(s.date);
      s.questionId === t &&
        Number.isFinite(l) &&
        (!o || l >= o.time) &&
        (o = { time: l, correct: s.chosen === s.correct });
    }
    let i = o ? o.correct : a.chosen && a.alternatives[a.chosen] ? a.chosen === a.correct : null;
    return {
      passages: r,
      missed: i === !1,
      pendingProposals: e.proposals.filter((s) => s.questionId === t && s.status === "pending").length,
    };
  }
  var lM = (e, t, a) => `${e} ${e === 1 ? t : a}`;
  function cM(e, t) {
    let a = [
        e.legacy > 0
          ? `${lM(e.identified, "quest\xE3o identificada", "quest\xF5es identificadas")} e ${lM(e.legacy, "contagem antiga sem origem", "contagens antigas sem origem")}.`
          : e.onlyThis
            ? "Primeira quest\xE3o do seu acervo a cobrar este trecho."
            : `Com esta, ${e.identified} quest\xF5es do seu acervo cobraram este trecho.`,
      ],
      n = e.identified - 1;
    return (
      t &&
        n > 0 &&
        a.push(
          `Voc\xEA errou esta, e o trecho j\xE1 apareceu em ${n === 1 ? "outra quest\xE3o sua" : `outras ${n} quest\xF5es suas`}: vale reler.`,
        ),
      a
    );
  }
  function dM(e) {
    let t = [];
    return (
      e.passages.length ||
        t.push("Esta an\xE1lise n\xE3o vinculou a quest\xE3o a nenhum trecho do material."),
      e.pendingProposals > 0 &&
        t.push(
          `${e.pendingProposals === 1 ? "H\xE1 1 proposta aguardando" : `H\xE1 ${e.pendingProposals} propostas aguardando`} sua aprova\xE7\xE3o; as contagens s\xF3 mudam depois.`,
        ),
      t
    );
  }
  var lr = U(X()),
    d0 = 5;
  function Lh({ questionId: e }) {
    let { state: t } = W(),
      a = (0, kh.useMemo)(() => uM(t, e), [t, e]),
      [n, r] = (0, kh.useState)(!1);
    if (!a) return null;
    let o = n ? a.passages : a.passages.slice(0, d0);
    return (0, lr.jsxs)("section", {
      className: "question-finding",
      "aria-label": "O que esta quest\xE3o trouxe",
      children: [
        (0, lr.jsx)("span", { className: "small-label", children: "O QUE ESTA QUEST\xC3O TROUXE" }),
        o.length > 0 &&
          (0, lr.jsx)("ul", {
            className: "finding-list",
            children: o.map((i) =>
              (0, lr.jsxs)(
                "li",
                {
                  children: [
                    (0, lr.jsx)("blockquote", { children: i.phrase }),
                    (0, lr.jsxs)("p", { className: "meta", children: [i.subject, " \xB7 ", i.topic] }),
                    cM(i, a.missed).map((s) => (0, lr.jsx)("p", { children: s }, s)),
                    (0, lr.jsx)(re, {
                      className: "text-link",
                      href: `/material?topico=${i.sectionId}`,
                      "aria-label": `Ver no Material: ${i.topic}`,
                      children: "Ver no Material \u2192",
                    }),
                  ],
                },
                i.sectionId + i.phrase,
              ),
            ),
          }),
        a.passages.length > d0 &&
          !n &&
          (0, lr.jsxs)("button", {
            className: "text-link",
            onClick: () => r(!0),
            children: ["Mostrar mais ", a.passages.length - d0],
          }),
        dM(a).map((i) => (0, lr.jsx)("p", { className: "meta", children: i }, i)),
      ],
    });
  }
  var en = U(Le());
  var de = U(X()),
    Nh = 5,
    pM = "magis:recent-analyses",
    l3 = () => {
      try {
        let e = JSON.parse(localStorage.getItem(pM) ?? "[]");
        return Array.isArray(e) ? e.slice(0, Nh) : [];
      } catch {
        return [];
      }
    },
    Dt = null,
    Pd = typeof window > "u" ? [] : l3(),
    _h = null,
    at = null,
    Ah = null,
    gM = "default",
    f0 = new Set(),
    hM = { current: Dt, recent: Pd, batch: at },
    En = () => {
      ((hM = { current: Dt, recent: Pd, batch: at && { ...at, queued: [...at.queued] } }),
        f0.forEach((e) => e()));
    },
    u3 = new Set(["cancelled", "not_granted", "rate_limited", "unavailable", "tools_unavailable"]);
  function fM(e) {
    Pd = [e, ...Pd.filter((t) => t.intakeId !== e.intakeId)].slice(0, Nh);
    try {
      localStorage.setItem(pM, JSON.stringify(Pd));
    } catch {}
  }
  var c3 = (e, t, a) => {
      let n = a.outcome;
      return {
        intakeId: e,
        label: t,
        finishedAt: Date.now(),
        text: a.text.slice(0, 6e3),
        truncated: a.truncated,
        questionId: n?.status === "approved" ? n.question.id : void 0,
        issues: n?.status === "invalid" ? n.issues.slice(0, 3).map((r) => r.message) : void 0,
      };
    },
    d3 = (e) => (
      f0.add(e),
      () => {
        f0.delete(e);
      }
    ),
    mM = () => hM,
    vM = "magis:analysis-tier",
    m0 = () => {
      try {
        return localStorage.getItem(vM) === "complex" ? "complex" : "default";
      } catch {
        return "default";
      }
    };
  function yM(e, t, a) {
    if (Dt) return;
    let n = e.repository.get().intakes.find((i) => i.id === t),
      r = n ? na(n) : null;
    ((Dt = {
      intakeId: t,
      label: r ? `TEC #${r}` : "Quest\xE3o sem c\xF3digo",
      steps: [],
      text: "",
      startedAt: Date.now(),
    }),
      (_h = new AbortController()),
      En());
    let o = _h.signal;
    kO(e, t, {
      tier: a,
      signal: o,
      onText: (i) => {
        Dt && ((Dt = { ...Dt, text: i }), En());
      },
      onStep: (i) => {
        Dt && Dt.steps.at(-1) !== i && ((Dt = { ...Dt, steps: [...Dt.steps, i] }), En());
      },
    })
      .then((i) => fM(c3(t, Dt?.label ?? "", i)))
      .catch((i) => {
        fM({ intakeId: t, label: Dt?.label ?? "", finishedAt: Date.now(), error: Sr(i) });
        let s = i?.code ?? "";
        at &&
          u3.has(s) &&
          ((at.stoppedReason =
            s === "cancelled" ? "Fila interrompida por voc\xEA." : `Fila interrompida: ${Sr(i)}`),
          (at.queued = []));
      })
      .finally(() => {
        ((Dt = null), (_h = null), at && (at.done += 1), En(), bM());
      });
  }
  function bM() {
    if (!at || Dt || !Ah) return;
    let e = Ah.repository.get().intakes;
    for (; at.queued.length;) {
      let t = at.queued.shift();
      if (e.find((a) => a.id === t)?.status === "waiting") {
        (En(), yM(Ah, t, gM));
        return;
      }
      at.done += 1;
    }
    (at.stoppedReason || (at = null), En());
  }
  function f3(e, t, a) {
    Dt ||
      at?.queued.length ||
      !t.length ||
      ((at = { queued: [...t], total: t.length, done: 0 }), (Ah = e), (gM = a), bM());
  }
  var m3 = () => {
      (at?.queued.length && ((at.queued = []), (at.stoppedReason = "Fila interrompida por voc\xEA."), En()),
        _h?.abort());
    },
    p3 = () => {
      at &&
        ((at.queued = []),
        (at.stoppedReason = "Fila interrompida por voc\xEA depois da an\xE1lise em andamento."),
        En());
    },
    g3 = () => {
      at && !Dt && !at.queued.length && ((at = null), En());
    },
    Zi = () => (0, en.useSyncExternalStore)(d3, mM, mM);
  function Th() {
    let [e, t] = (0, en.useState)(null);
    return (
      (0, en.useEffect)(() => {
        let a = !0;
        return (
          CO().then((n) => {
            a && t(n);
          }),
          () => {
            a = !1;
          }
        );
      }, []),
      e
    );
  }
  function xM() {
    let [e, t] = (0, en.useState)("default");
    return (
      (0, en.useEffect)(() => t(m0()), []),
      (0, de.jsxs)("label", {
        className: "field tier-picker",
        children: [
          "Profundidade",
          (0, de.jsxs)("select", {
            id: "analysis-tier",
            value: e,
            onChange: (a) => {
              let n = a.target.value;
              t(n);
              try {
                localStorage.setItem(vM, n);
              } catch {}
            },
            children: [
              (0, de.jsx)("option", { value: "default", children: "Padr\xE3o (mais r\xE1pida)" }),
              (0, de.jsx)("option", { value: "complex", children: "Aprofundada (casos dif\xEDceis)" }),
            ],
          }),
        ],
      })
    );
  }
  function SM({ ids: e }) {
    let { service: t } = W(),
      { current: a, batch: n } = Zi(),
      r = Th();
    return r === !1 || e.length < 2
      ? null
      : (0, de.jsxs)("button", {
          className: "button",
          disabled: !!a || !!n?.queued.length || r === null,
          onClick: () => f3(t, e, m0()),
          children: [(0, de.jsx)(Id, { size: 16 }), "Analisar todas da fila (", e.length, ")"],
        });
  }
  function zh({ intakeId: e, label: t = "Analisar com o Claude", primary: a = !0 }) {
    let { service: n } = W(),
      { current: r } = Zi(),
      o = Th();
    return o === !1
      ? null
      : (0, de.jsxs)("button", {
          className: `button ${a ? "primary" : ""}`,
          disabled: !!r || o === null,
          onClick: () => yM(n, e, m0()),
          children: [(0, de.jsx)(Ro, { size: 16 }), t],
        });
  }
  function h3({ done: e, open: t }) {
    let { state: a } = W(),
      n = a.intakes.find((s) => s.id === e.intakeId),
      r = e.questionId ?? (n?.status === "approved" ? n.questionId : void 0),
      o = e.error
        ? "falhou"
        : r
          ? "an\xE1lise aprovada e salva"
          : n?.status === "review"
            ? "ficha guardada para revis\xE3o"
            : "an\xE1lise sem aprova\xE7\xE3o",
      i = new Date(e.finishedAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    return (0, de.jsxs)("details", {
      className: `analysis-run ${r ? "approved" : ""} ${e.error ? "failed" : ""}`,
      open: t,
      children: [
        (0, de.jsxs)("summary", {
          className: "section-heading",
          children: [
            (0, de.jsxs)("strong", { children: [e.label, ": ", o] }),
            (0, de.jsx)("span", { className: "meta", children: i }),
          ],
        }),
        e.error && (0, de.jsx)(te, { error: !0, children: e.error }),
        r && (0, de.jsx)(Lh, { questionId: r }),
        e.text && (0, de.jsx)("p", { className: "preserve-lines analysis-text", children: e.text }),
        !r && e.issues?.length
          ? (0, de.jsxs)(te, {
              error: !0,
              children: ["A valida\xE7\xE3o ainda apontou: ", e.issues.join(" \xB7 ")],
            })
          : null,
        e.truncated &&
          (0, de.jsx)("p", {
            className: "meta",
            children: "A resposta foi interrompida pelo limite de tamanho.",
          }),
        r &&
          (0, de.jsx)("div", {
            className: "actions",
            children: (0, de.jsxs)(re, {
              className: "button primary",
              href: `/professor?questao=${r}`,
              children: ["Abrir no Professor ", (0, de.jsx)(gt, { size: 16 })],
            }),
          }),
      ],
    });
  }
  function IM() {
    let { current: e, recent: t } = Zi(),
      [a, n] = (0, en.useState)(Date.now());
    (0, en.useEffect)(() => {
      if (!e) return;
      let u = setInterval(() => n(Date.now()), 1e3);
      return () => clearInterval(u);
    }, [e]);
    let r = e ? Math.max(0, Math.round((a - e.startedAt) / 1e3)) : 0,
      { batch: o } = Zi(),
      { state: i } = W(),
      s = t.filter((u) => u.intakeId !== e?.intakeId).slice(0, e ? Nh - 1 : Nh);
    if (!e && !s.length && !o) return null;
    let l = (u) => {
      let c = i.intakes.find((d) => d.id === u),
        f = c ? na(c) : null;
      return f ? `TEC #${f}` : "Quest\xE3o sem c\xF3digo";
    };
    return (0, de.jsxs)("div", {
      className: "analysis-list",
      children: [
        o &&
          (0, de.jsxs)("div", {
            className: "batch-progress",
            role: "status",
            children: [
              (0, de.jsxs)("div", {
                className: "section-heading",
                children: [
                  (0, de.jsx)("strong", {
                    children:
                      o.queued.length || e
                        ? `Analisando a fila: ${Math.min(o.done + 1, o.total)} de ${o.total}`
                        : `${o.stoppedReason ? "Fila interrompida" : "Fila conclu\xEDda"}: ${o.done} de ${o.total} analisadas`,
                  }),
                  !e &&
                    !o.queued.length &&
                    (0, de.jsx)("button", { className: "text-link", onClick: g3, children: "Fechar" }),
                ],
              }),
              (0, de.jsx)("progress", { max: o.total, value: o.done, "aria-label": "Andamento da fila" }),
              o.queued.length > 0 &&
                (0, de.jsxs)("p", {
                  className: "meta",
                  children: ["Na fila para an\xE1lise: ", o.queued.map(l).join(" \xB7 ")],
                }),
              o.stoppedReason && (0, de.jsx)("p", { className: "meta", children: o.stoppedReason }),
              e &&
                o.queued.length > 0 &&
                (0, de.jsx)("div", {
                  className: "actions",
                  children: (0, de.jsx)("button", {
                    className: "button",
                    onClick: p3,
                    children: "Parar depois desta",
                  }),
                }),
            ],
          }),
        e &&
          (0, de.jsxs)("div", {
            className: "analysis-run",
            role: "status",
            "aria-live": "polite",
            children: [
              (0, de.jsxs)("div", {
                className: "section-heading",
                children: [
                  (0, de.jsxs)("strong", { children: ["Analisando ", e.label] }),
                  (0, de.jsxs)("span", {
                    className: "meta tabular",
                    children: [Math.floor(r / 60), ":", String(r % 60).padStart(2, "0")],
                  }),
                ],
              }),
              (0, de.jsx)("ol", {
                className: "analysis-steps",
                children: (e.steps.length ? e.steps : ["O Claude est\xE1 lendo a quest\xE3o"]).map(
                  (u, c, f) =>
                    (0, de.jsx)("li", { className: c === f.length - 1 ? "active" : "", children: u }, c),
                ),
              }),
              e.text && (0, de.jsx)("p", { className: "preserve-lines analysis-text", children: e.text }),
              (0, de.jsx)("div", {
                className: "actions",
                children: (0, de.jsxs)("button", {
                  className: "button",
                  onClick: m3,
                  children: [(0, de.jsx)(_d, { size: 14 }), o?.queued.length ? "Parar tudo" : "Parar"],
                }),
              }),
              (0, de.jsx)("p", {
                className: "meta",
                children: "Pode continuar usando o Audis; a an\xE1lise segue em segundo plano nesta aba.",
              }),
            ],
          }),
        s.length > 0 &&
          (0, de.jsxs)("p", {
            className: "meta",
            children: ["\xDAltimas an\xE1lises", s.length > 1 ? " (toque para abrir)" : ""],
          }),
        s.map((u, c) => (0, de.jsx)(h3, { done: u, open: !e && c === 0 }, u.intakeId + u.finishedAt)),
      ],
    });
  }
  var ur = U(Le());
  var wr = U(X());
  function Hi({ match: e, onContinue: t }) {
    if (!e.code) return null;
    let { questions: a, intakes: n, material: r, code: o } = e;
    return (0, wr.jsxs)("div", {
      className: "callout stack question-code-notice",
      role: "status",
      "aria-live": "polite",
      children: [
        (0, wr.jsx)("strong", {
          children: a.length
            ? `A quest\xE3o TEC #${o} j\xE1 est\xE1 no seu acervo.`
            : n.length
              ? `A quest\xE3o TEC #${o} tem uma solicita\xE7\xE3o em andamento.`
              : r.length
                ? `O c\xF3digo TEC #${o} j\xE1 aparece no seu material, mas ainda n\xE3o tem ficha.`
                : `Quest\xE3o TEC #${o} n\xE3o encontrada no seu acervo.`,
        }),
        a.length > 0 &&
          (0, wr.jsx)("p", { children: "Abra a ficha existente para estudar ou registrar outra resposta." }),
        !a.length &&
          !n.length &&
          r.length > 0 &&
          (0, wr.jsx)("p", {
            children:
              "Voc\xEA pode completar o cadastro. Os v\xEDnculos existentes ser\xE3o preservados, sem contar a mesma quest\xE3o novamente.",
          }),
        a.length > 1 &&
          (0, wr.jsx)("p", {
            children:
              "H\xE1 fichas antigas com esse c\xF3digo. Elas foram preservadas; escolha qual deseja consultar.",
          }),
        a.map((i, s) =>
          (0, wr.jsxs)(
            re,
            {
              className: "text-link",
              href: `/professor?questao=${encodeURIComponent(i.id)}`,
              children: [
                "Abrir quest\xE3o",
                a.length > 1 ? ` ${s + 1}` : "",
                " \xB7 ",
                i.subject,
                " \xB7 ",
                i.topic,
              ],
            },
            i.id,
          ),
        ),
        n.map((i) =>
          t
            ? (0, wr.jsxs)(
                "button",
                {
                  className: "button",
                  type: "button",
                  onClick: () => t(i.id),
                  children: [
                    "Continuar solicita\xE7\xE3o existente \xB7 ",
                    i.status === "waiting" ? "aguardando IA" : "revisar ficha",
                  ],
                },
                i.id,
              )
            : (0, wr.jsxs)(
                "p",
                {
                  children: [
                    "H\xE1 outra solicita\xE7\xE3o ",
                    i.status === "waiting" ? "aguardando IA" : "em revis\xE3o",
                    " no seletor abaixo.",
                  ],
                },
                i.id,
              ),
        ),
        r.map((i) =>
          (0, wr.jsxs)(
            re,
            {
              className: "text-link",
              href: i.deletedAt ? "/material?lixeira=1" : `/material?topico=${encodeURIComponent(i.id)}`,
              children: [i.deletedAt ? "Material na lixeira" : "Ver material relacionado", " \xB7 ", i.title],
            },
            i.id,
          ),
        ),
      ],
    });
  }
  var ee = U(X());
  function p0({ onContinue: e }) {
    let { state: t, service: a } = W(),
      n = hh(),
      [r, o] = (0, ur.useState)(""),
      [i, s] = (0, ur.useState)(""),
      [l, u] = (0, ur.useState)({}),
      [c, f] = (0, ur.useState)(""),
      [d, m] = (0, ur.useState)(""),
      [p, v] = (0, ur.useState)(""),
      [b, y] = (0, ur.useState)(""),
      [g, h] = (0, ur.useState)(""),
      [x, C] = (0, ur.useState)(""),
      [$, A] = (0, ur.useState)(""),
      [D, ae] = (0, ur.useState)(""),
      J = jr(t, D),
      q = "ABCDE".split("");
    function Y(Q) {
      Q.preventDefault();
      let _ = new FormData(Q.currentTarget),
        N = (Ce) => String(_.get(Ce) ?? "");
      try {
        let Ce = a.addQuestion({
          statement: i,
          alternatives: l,
          chosen: c,
          correct: d,
          subject: p,
          topic: b,
          sectionId: g,
          commentary: N("commentary"),
          number: N("number"),
          board: N("board"),
          year: Number(N("year")),
          exam: N("exam"),
          subtopics: N("subtopics").split(","),
          tags: N("tags").split(","),
        });
        n.push(`/professor?questao=${encodeURIComponent(Ce.id)}`);
      } catch (Ce) {
        C(Ce.message);
      }
    }
    return (0, ee.jsxs)("div", {
      className: "add-question-page",
      children: [
        (0, ee.jsx)(Za, {
          eyebrow: "DO TEC PARA O SEU ESTUDO",
          title: "Adicionar quest\xE3o",
          description:
            "Copie o enunciado e as alternativas do TEC. Revise os campos e leve a quest\xE3o ao Professor.",
        }),
        (0, ee.jsxs)("section", {
          className: "paper stack",
          children: [
            (0, ee.jsxs)("label", {
              className: "field",
              children: [
                "Cole a quest\xE3o do TEC",
                (0, ee.jsx)("textarea", {
                  rows: 6,
                  maxLength: 13e4,
                  value: r,
                  onChange: (Q) => o(Q.target.value),
                  placeholder: `Enunciado da quest\xE3o\u2026
A) Primeira alternativa
B) Segunda alternativa
C) Terceira alternativa`,
                }),
              ],
            }),
            (0, ee.jsx)("div", {
              className: "actions",
              children: (0, ee.jsxs)("button", {
                className: "button",
                type: "button",
                disabled: !r.trim(),
                onClick: () => {
                  try {
                    let Q = $N(r);
                    (s(Q.statement),
                      u(Q.alternatives),
                      f(""),
                      m(""),
                      C(""),
                      A("Texto separado. Confira o enunciado e cada alternativa abaixo antes de salvar."));
                  } catch (Q) {
                    (C(Q.message), A(""));
                  }
                },
                children: [(0, ee.jsx)(Eo, { size: 16 }), "Separar enunciado e alternativas"],
              }),
            }),
            (0, ee.jsx)("p", {
              className: "meta",
              children:
                "Voc\xEA tamb\xE9m pode preencher os campos abaixo diretamente. Para quest\xF5es de certo ou errado, use A = Certo e B = Errado.",
            }),
            $ && (0, ee.jsx)(te, { children: $ }),
          ],
        }),
        (0, ee.jsxs)("form", {
          onSubmit: Y,
          className: "stack",
          children: [
            (0, ee.jsxs)("section", {
              className: "paper stack",
              children: [
                (0, ee.jsx)("h2", { children: "Revise a quest\xE3o" }),
                (0, ee.jsxs)("label", {
                  className: "field",
                  children: [
                    "Enunciado",
                    (0, ee.jsx)("textarea", {
                      required: !0,
                      rows: 5,
                      maxLength: 3e4,
                      value: i,
                      onChange: (Q) => s(Q.target.value),
                    }),
                  ],
                }),
                q.map((Q) =>
                  (0, ee.jsxs)(
                    "label",
                    {
                      className: "field",
                      children: [
                        "Alternativa ",
                        Q,
                        Q > "B" ? " (opcional)" : "",
                        (0, ee.jsx)("textarea", {
                          rows: 2,
                          maxLength: 2e4,
                          value: l[Q] ?? "",
                          onChange: (_) => u({ ...l, [Q]: _.target.value }),
                        }),
                      ],
                    },
                    Q,
                  ),
                ),
                (0, ee.jsxs)("div", {
                  className: "question-form-grid",
                  children: [
                    (0, ee.jsxs)("label", {
                      className: "field",
                      children: [
                        "Sua resposta",
                        (0, ee.jsxs)("select", {
                          value: c,
                          onChange: (Q) => f(Q.target.value),
                          children: [
                            (0, ee.jsx)("option", { value: "", children: "Ainda n\xE3o respondi" }),
                            q
                              .filter((Q) => l[Q]?.trim())
                              .map((Q) => (0, ee.jsx)("option", { children: Q }, Q)),
                          ],
                        }),
                      ],
                    }),
                    (0, ee.jsxs)("label", {
                      className: "field",
                      children: [
                        "Gabarito",
                        (0, ee.jsxs)("select", {
                          required: !0,
                          value: d,
                          onChange: (Q) => m(Q.target.value),
                          children: [
                            (0, ee.jsx)("option", { value: "", children: "Selecione" }),
                            q
                              .filter((Q) => l[Q]?.trim())
                              .map((Q) => (0, ee.jsx)("option", { children: Q }, Q)),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                c &&
                  d &&
                  (0, ee.jsx)("p", {
                    className: "callout",
                    children:
                      c === d
                        ? "Voc\xEA acertou. Esta quest\xE3o n\xE3o entra no Caderno de Erros."
                        : "Voc\xEA errou. Ap\xF3s a an\xE1lise, poder\xE1 incluir a quest\xE3o no Caderno de Erros.",
                  }),
              ],
            }),
            (0, ee.jsxs)("section", {
              className: "paper stack",
              children: [
                (0, ee.jsx)("h2", { children: "Onde ela se encaixa" }),
                (0, ee.jsxs)("label", {
                  className: "field",
                  children: [
                    "Trecho relacionado do Material \xDAnico (opcional)",
                    (0, ee.jsxs)("select", {
                      value: g,
                      onChange: (Q) => {
                        h(Q.target.value);
                        let _ = t.material.find((N) => N.id === Q.target.value);
                        _ && (v(_.subject), y(_.topic));
                      },
                      children: [
                        (0, ee.jsx)("option", { value: "", children: "Sem trecho relacionado por enquanto" }),
                        a
                          .activeMaterial()
                          .map((Q) =>
                            (0, ee.jsxs)(
                              "option",
                              { value: Q.id, children: [Q.subject, " \xB7 ", Q.title] },
                              Q.id,
                            ),
                          ),
                      ],
                    }),
                  ],
                }),
                (0, ee.jsxs)("div", {
                  className: "question-form-grid",
                  children: [
                    (0, ee.jsxs)("label", {
                      className: "field",
                      children: [
                        "Disciplina",
                        (0, ee.jsx)("input", {
                          required: !0,
                          maxLength: 200,
                          value: p,
                          onChange: (Q) => {
                            (v(Q.target.value), h(""));
                          },
                          placeholder: "Ex.: Direito Tribut\xE1rio",
                        }),
                      ],
                    }),
                    (0, ee.jsxs)("label", {
                      className: "field",
                      children: [
                        "Assunto",
                        (0, ee.jsx)("input", {
                          required: !0,
                          maxLength: 200,
                          value: b,
                          onChange: (Q) => {
                            (y(Q.target.value), h(""));
                          },
                          placeholder: "Ex.: Obriga\xE7\xE3o tribut\xE1ria",
                        }),
                      ],
                    }),
                  ],
                }),
                (0, ee.jsxs)("label", {
                  className: "field",
                  children: [
                    "Coment\xE1rio / justificativa do gabarito (opcional)",
                    (0, ee.jsx)("textarea", {
                      name: "commentary",
                      rows: 4,
                      maxLength: 3e4,
                      placeholder: "Cole aqui o coment\xE1rio que deseja enviar ao Professor.",
                    }),
                  ],
                }),
                (0, ee.jsxs)("details", {
                  children: [
                    (0, ee.jsx)("summary", { children: "Outros dados da quest\xE3o (opcional)" }),
                    (0, ee.jsxs)("div", {
                      className: "question-form-grid spaced",
                      children: [
                        (0, ee.jsxs)("label", {
                          className: "field",
                          children: [
                            "N\xFAmero no TEC",
                            (0, ee.jsx)("input", {
                              name: "number",
                              maxLength: 100,
                              value: D,
                              onChange: (Q) => ae(Q.target.value),
                            }),
                          ],
                        }),
                        (0, ee.jsxs)("label", {
                          className: "field",
                          children: ["Banca", (0, ee.jsx)("input", { name: "board", maxLength: 200 })],
                        }),
                        (0, ee.jsxs)("label", {
                          className: "field",
                          children: [
                            "Ano",
                            (0, ee.jsx)("input", { name: "year", type: "number", min: 1900, max: 2100 }),
                          ],
                        }),
                        (0, ee.jsxs)("label", {
                          className: "field",
                          children: ["Concurso", (0, ee.jsx)("input", { name: "exam", maxLength: 300 })],
                        }),
                        (0, ee.jsxs)("label", {
                          className: "field",
                          children: [
                            "Subassuntos",
                            (0, ee.jsx)("input", {
                              name: "subtopics",
                              maxLength: 3e3,
                              placeholder: "Separe por v\xEDrgula",
                            }),
                          ],
                        }),
                        (0, ee.jsxs)("label", {
                          className: "field",
                          children: [
                            "Tags",
                            (0, ee.jsx)("input", {
                              name: "tags",
                              maxLength: 1500,
                              placeholder: "Separe por v\xEDrgula",
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            x && (0, ee.jsx)(te, { error: !0, children: x }),
            (0, ee.jsx)(Hi, { match: J, onContinue: e }),
            (0, ee.jsx)("p", {
              className: "session-note",
              children:
                "A quest\xE3o ser\xE1 salva na sua conta. O Material \xDAnico s\xF3 muda ap\xF3s sua aprova\xE7\xE3o.",
            }),
            (0, ee.jsx)("div", {
              className: "actions",
              children: (0, ee.jsxs)("button", {
                className: "button primary",
                type: "submit",
                disabled: J.questions.length > 0 || J.intakes.length > 0,
                children: ["Salvar e abrir no Professor ", (0, ee.jsx)(gt, { size: 16 })],
              }),
            }),
          ],
        }),
      ],
    });
  }
  var S = U(X());
  function v3({ result: e, onContinue: t }) {
    let { service: a, state: n } = W(),
      r = hh(),
      [o, i] = (0, Ot.useState)(() => {
        let b = structuredClone(e);
        return ((b.response.materialUpdates = b.response.materialUpdates.map((y) => Hs(y, b.question))), b);
      }),
      [s, l] = (0, Ot.useState)(!1),
      [u, c] = (0, Ot.useState)(""),
      f = o.question,
      d = (0, Ot.useMemo)(() => Yu(o.response.materialUpdates, o.question), [o]),
      m = (0, Ot.useMemo)(() => {
        let b = [],
          y = o.response.materialUpdates.map((g, h) => {
            try {
              return a.prepareProposal(g);
            } catch (x) {
              return (b.push({ index: h, message: x.message }), g);
            }
          });
        return {
          result: { ...o, response: { ...o.response, materialUpdates: y } },
          issues: b,
          changed: JSON.stringify(y) !== JSON.stringify(o.response.materialUpdates),
        };
      }, [o, a, n.material, n.history]),
      p = (0, Ot.useMemo)(() => jr(n, f.number, e.intakeId), [n, f.number, e.intakeId]),
      v = (b, y) => i({ ...o, question: { ...f, [b]: y } });
    return (0, S.jsxs)("section", {
      className: "paper stack",
      children: [
        (0, S.jsxs)("div", {
          className: "section-heading",
          children: [
            (0, S.jsx)("span", {
              className: "badge",
              children: "Preenchido pela IA \xB7 aguardando revis\xE3o",
            }),
            (0, S.jsxs)("button", {
              className: "button",
              onClick: () => l(!s),
              children: [(0, S.jsx)(La, { size: 16 }), s ? "Ver ficha" : "Editar dados"],
            }),
          ],
        }),
        (0, S.jsxs)("h2", { children: [f.subject, " \xB7 ", f.topic] }),
        o.warnings.map((b, y) => (0, S.jsx)(te, { children: b }, y)),
        (0, S.jsx)(Hi, { match: p, onContinue: t }),
        s
          ? (0, S.jsxs)("div", {
              className: "stack",
              children: [
                (0, S.jsxs)("div", {
                  className: "question-form-grid",
                  children: [
                    [
                      ["subject", "Disciplina"],
                      ["topic", "Tema"],
                      ["number", "N\xFAmero TEC"],
                      ["board", "Banca"],
                      ["exam", "Concurso"],
                    ].map(([b, y]) =>
                      (0, S.jsxs)(
                        "label",
                        {
                          className: "field",
                          children: [
                            y,
                            (0, S.jsx)("input", { value: f[b], onChange: (g) => v(b, g.target.value) }),
                          ],
                        },
                        b,
                      ),
                    ),
                    (0, S.jsxs)("label", {
                      className: "field",
                      children: [
                        "Ano",
                        (0, S.jsx)("input", {
                          type: "number",
                          value: f.year || "",
                          onChange: (b) => v("year", Number(b.target.value)),
                        }),
                      ],
                    }),
                    (0, S.jsxs)("label", {
                      className: "field",
                      children: [
                        "Subtemas",
                        (0, S.jsx)("input", {
                          value: f.subtopics.join(","),
                          onChange: (b) => v("subtopics", b.target.value.split(",")),
                        }),
                      ],
                    }),
                    (0, S.jsxs)("label", {
                      className: "field",
                      children: [
                        "Tags",
                        (0, S.jsx)("input", {
                          value: f.tags.join(","),
                          onChange: (b) => v("tags", b.target.value.split(",")),
                        }),
                      ],
                    }),
                  ],
                }),
                (0, S.jsxs)("label", {
                  className: "field",
                  children: [
                    "Enunciado",
                    (0, S.jsx)("textarea", {
                      rows: 7,
                      value: f.statement,
                      onChange: (b) => v("statement", b.target.value),
                    }),
                  ],
                }),
                "ABCDE"
                  .split("")
                  .map((b) =>
                    (0, S.jsxs)(
                      "label",
                      {
                        className: "field",
                        children: [
                          "Alternativa ",
                          b,
                          (0, S.jsx)("textarea", {
                            rows: 2,
                            value: f.alternatives[b] ?? "",
                            onChange: (y) => v("alternatives", { ...f.alternatives, [b]: y.target.value }),
                          }),
                        ],
                      },
                      b,
                    ),
                  ),
                (0, S.jsxs)("div", {
                  className: "question-form-grid",
                  children: [
                    (0, S.jsxs)("label", {
                      className: "field",
                      children: [
                        "Resposta marcada",
                        (0, S.jsxs)("select", {
                          value: f.chosen ?? "",
                          onChange: (b) => v("chosen", b.target.value),
                          children: [
                            (0, S.jsx)("option", { value: "", children: "N\xE3o identificada" }),
                            Object.keys(f.alternatives).map((b) => (0, S.jsx)("option", { children: b }, b)),
                          ],
                        }),
                      ],
                    }),
                    (0, S.jsxs)("label", {
                      className: "field",
                      children: [
                        "Gabarito",
                        (0, S.jsxs)("select", {
                          value: f.correct,
                          onChange: (b) => v("correct", b.target.value),
                          children: [
                            (0, S.jsx)("option", { value: "", children: "N\xE3o identificado" }),
                            Object.keys(f.alternatives).map((b) => (0, S.jsx)("option", { children: b }, b)),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, S.jsxs)("label", {
                  className: "field",
                  children: [
                    "Coment\xE1rios da fonte",
                    (0, S.jsx)("textarea", {
                      rows: 8,
                      value: f.commentary ?? "",
                      onChange: (b) => v("commentary", b.target.value),
                    }),
                  ],
                }),
              ],
            })
          : (0, S.jsxs)(S.Fragment, {
              children: [
                (0, S.jsx)("p", {
                  className: "meta",
                  children: [
                    f.number ? `TEC #${f.number}` : "N\xFAmero n\xE3o identificado",
                    f.board,
                    f.year || "",
                    f.exam,
                  ]
                    .filter(Boolean)
                    .join(" \xB7 "),
                }),
                (0, S.jsxs)("p", {
                  children: [
                    (0, S.jsx)("strong", { children: "Subtemas:" }),
                    " ",
                    f.subtopics.join(" \xB7 ") || "N\xE3o identificados",
                  ],
                }),
                (0, S.jsxs)("p", {
                  children: [
                    (0, S.jsx)("strong", { children: "Tags:" }),
                    " ",
                    f.tags.join(" \xB7 ") || "Nenhuma",
                  ],
                }),
                (0, S.jsx)("p", { className: "preserve-lines", children: f.statement }),
                (0, S.jsx)("div", {
                  className: "alternatives",
                  children: Object.entries(f.alternatives).map(([b, y]) =>
                    (0, S.jsxs)(
                      "div",
                      {
                        className: "alternative",
                        children: [
                          (0, S.jsx)("span", { className: "option-letter", children: b }),
                          (0, S.jsx)("span", { children: y }),
                        ],
                      },
                      b,
                    ),
                  ),
                }),
                (0, S.jsxs)("div", {
                  className: "answer-summary",
                  children: [
                    (0, S.jsxs)("span", {
                      children: [
                        "Resposta marcada: ",
                        (0, S.jsx)("strong", { children: f.chosen || "N\xE3o identificada" }),
                      ],
                    }),
                    (0, S.jsxs)("span", {
                      children: [
                        "Gabarito: ",
                        (0, S.jsx)("strong", { children: f.correct || "N\xE3o identificado" }),
                      ],
                    }),
                  ],
                }),
                (0, S.jsxs)("details", {
                  children: [
                    (0, S.jsx)("summary", { children: "Coment\xE1rios extra\xEDdos da fonte" }),
                    (0, S.jsx)("p", {
                      className: "preserve-lines",
                      children: f.commentary || "N\xE3o identificados.",
                    }),
                  ],
                }),
              ],
            }),
        (0, S.jsxs)("div", {
          className: "callout",
          children: [
            (0, S.jsx)("h3", { children: "Material de estudo proposto" }),
            (0, S.jsx)("p", {
              children:
                "Cada altera\xE7\xE3o continuar\xE1 pendente at\xE9 voc\xEA aprovar sua incorpora\xE7\xE3o no Professor. Voc\xEA poder\xE1 editar o texto antes de aprovar.",
            }),
          ],
        }),
        m.changed &&
          (0, S.jsx)(te, {
            children:
              "Proposta conferida com o material mais recente. As altera\xE7\xF5es compat\xEDveis e as marca\xE7\xF5es j\xE1 aprovadas foram preservadas na pr\xE9via abaixo; nenhuma contagem muda antes da sua aprova\xE7\xE3o.",
          }),
        m.issues.map((b) =>
          (0, S.jsxs)(te, { error: !0, children: ["Proposta ", b.index + 1, ": ", b.message] }, b.index),
        ),
        !!d.length &&
          (0, S.jsxs)(te, {
            error: !0,
            children: [
              "A an\xE1lise foi preservada, mas ",
              d.length === 1 ? "uma cita\xE7\xE3o precisa" : `${d.length} cita\xE7\xF5es precisam`,
              " de confer\xEAncia. Nos v\xEDnculos sinalizados abaixo, copie uma passagem cont\xEDnua do enunciado ou de uma alternativa (coment\xE1rios n\xE3o valem como evid\xEAncia). N\xE3o \xE9 necess\xE1rio repetir a an\xE1lise. A aprova\xE7\xE3o ficar\xE1 bloqueada at\xE9 corrigir as cita\xE7\xF5es.",
              !s &&
                (0, S.jsxs)("button", {
                  className: "button",
                  onClick: () => l(!0),
                  children: [(0, S.jsx)(La, { size: 16 }), "Corrigir cita\xE7\xF5es"],
                }),
            ],
          }),
        (s ? o : m.result).response.materialUpdates.map((b, y) => {
          let g = n.material.find((h) => h.id === b.sectionId);
          return (0, S.jsxs)(
            "details",
            {
              open: !0,
              children: [
                (0, S.jsx)("summary", {
                  children:
                    b.kind === "record_occurrence"
                      ? "Vincular quest\xE3o ao trecho existente"
                      : b.title || b.topic || "Atualiza\xE7\xE3o do material",
                }),
                (0, S.jsx)("p", { className: "meta", children: jm(b, g) }),
                (0, S.jsx)("p", { children: b.justification }),
                m.issues.some((h) => h.index === y) &&
                  g &&
                  (0, S.jsxs)("details", {
                    open: !0,
                    children: [
                      (0, S.jsx)("summary", { children: "Texto atual para conferir" }),
                      (0, S.jsx)("p", { className: "preserve-lines", children: g.text }),
                    ],
                  }),
                s
                  ? (0, S.jsxs)("div", {
                      className: "stack",
                      children: [
                        m.issues.some((h) => h.index === y) &&
                          g &&
                          !g.deletedAt &&
                          (0, S.jsxs)("div", {
                            className: "callout",
                            children: [
                              (0, S.jsx)("p", {
                                children:
                                  "Compare o texto atual acima com a proposta. Ao atualizar a base, preserve as regras e marca\xE7\xF5es j\xE1 aprovadas antes de continuar.",
                              }),
                              (0, S.jsx)("button", {
                                className: "button",
                                onClick: () =>
                                  i({
                                    ...o,
                                    response: {
                                      ...o.response,
                                      materialUpdates: o.response.materialUpdates.map((h, x) =>
                                        x === y
                                          ? {
                                              ...h,
                                              baseVersion: g.version,
                                              currentText: g.text,
                                              proposedText:
                                                h.kind === "record_occurrence" ? g.text : h.proposedText,
                                            }
                                          : h,
                                      ),
                                    },
                                  }),
                                children: "Usar texto atual como base da revis\xE3o",
                              }),
                            ],
                          }),
                        ["create_section", "create_subtopic"].includes(b.kind) &&
                          (0, S.jsxs)("label", {
                            className: "field",
                            children: [
                              "Temas do material (um n\xEDvel por linha)",
                              (0, S.jsx)("textarea", {
                                rows: 2,
                                placeholder: "Reforma Tribut\xE1ria",
                                value: (b.topicPath ?? hi(b, g)).join(`
`),
                                onChange: (h) =>
                                  i({
                                    ...o,
                                    response: {
                                      ...o.response,
                                      materialUpdates: o.response.materialUpdates.map((x, C) =>
                                        C === y
                                          ? {
                                              ...x,
                                              topicPath: h.target.value.split(`
`),
                                            }
                                          : x,
                                      ),
                                    },
                                  }),
                              }),
                            ],
                          }),
                        (b.kind === "create_section"
                          ? ["subject", "topic", "title", "proposedText"]
                          : ["proposedText"]
                        ).map((h) =>
                          (0, S.jsxs)(
                            "label",
                            {
                              className: "field",
                              children: [
                                {
                                  subject: "Disciplina do material",
                                  topic: "Subtema do material",
                                  title: "T\xEDtulo da se\xE7\xE3o",
                                  proposedText: "Texto de estudo",
                                }[h],
                                (0, S.jsx)("textarea", {
                                  rows: h === "proposedText" ? 10 : 2,
                                  value: String(b[h] ?? ""),
                                  onChange: (x) =>
                                    i({
                                      ...o,
                                      response: {
                                        ...o.response,
                                        materialUpdates: o.response.materialUpdates.map((C, $) =>
                                          $ === y ? { ...C, [h]: x.target.value } : C,
                                        ),
                                      },
                                    }),
                                }),
                              ],
                            },
                            h,
                          ),
                        ),
                      ],
                    })
                  : (0, S.jsx)("p", { className: "preserve-lines", children: b.proposedText }),
              ],
            },
            y,
          );
        }),
        o.response.materialUpdates.some((b) => b.occurrences?.length) &&
          (0, S.jsxs)("div", {
            className: "stack",
            children: [
              (0, S.jsx)("h3", { children: "Trechos e incid\xEAncias para revisar" }),
              o.response.materialUpdates.flatMap((b, y) =>
                (b.occurrences ?? []).map((g, h) =>
                  (0, S.jsxs)(
                    "div",
                    {
                      className: "callout",
                      children: [
                        (0, S.jsx)("p", {
                          children: (0, S.jsxs)("strong", {
                            children: [
                              "Proposta ",
                              y + 1,
                              " \xB7 v\xEDnculo ",
                              h + 1,
                              ": ",
                              b.kind === "record_occurrence"
                                ? "Reutilizar trecho existente"
                                : "Consolidar e vincular trecho",
                            ],
                          }),
                        }),
                        (0, S.jsx)("p", { children: g.phrase }),
                        d.some((x) => x.proposalIndex === y && x.occurrenceIndex === h) &&
                          (0, S.jsx)(te, {
                            error: !0,
                            children:
                              "Esta cita\xE7\xE3o n\xE3o foi localizada na ficha. Confira o texto original acima e corrija a evid\xEAncia.",
                          }),
                        s
                          ? (0, S.jsxs)("div", {
                              className: "stack",
                              children: [
                                (0, S.jsxs)("label", {
                                  className: "field",
                                  children: [
                                    "Trecho exato da proposta ",
                                    y + 1,
                                    ", v\xEDnculo ",
                                    h + 1,
                                    (0, S.jsx)("textarea", {
                                      rows: 3,
                                      maxLength: 4e3,
                                      value: g.phrase,
                                      onChange: (x) =>
                                        i({
                                          ...o,
                                          response: {
                                            ...o.response,
                                            materialUpdates: o.response.materialUpdates.map((C, $) =>
                                              $ === y
                                                ? {
                                                    ...C,
                                                    occurrences: C.occurrences?.map((A, D) =>
                                                      D === h ? { ...A, phrase: x.target.value } : A,
                                                    ),
                                                  }
                                                : C,
                                            ),
                                          },
                                        }),
                                    }),
                                  ],
                                }),
                                (0, S.jsxs)("label", {
                                  className: "field",
                                  children: [
                                    "Evid\xEAncia da proposta ",
                                    y + 1,
                                    ", v\xEDnculo ",
                                    h + 1,
                                    " (cita\xE7\xE3o da fonte)",
                                    (0, S.jsx)("textarea", {
                                      rows: 3,
                                      maxLength: 4e3,
                                      value: g.evidence,
                                      onChange: (x) =>
                                        i({
                                          ...o,
                                          response: {
                                            ...o.response,
                                            materialUpdates: o.response.materialUpdates.map((C, $) =>
                                              $ === y
                                                ? {
                                                    ...C,
                                                    occurrences: C.occurrences?.map((A, D) =>
                                                      D === h ? { ...A, evidence: x.target.value } : A,
                                                    ),
                                                  }
                                                : C,
                                            ),
                                          },
                                        }),
                                    }),
                                  ],
                                }),
                                (0, S.jsxs)("label", {
                                  className: "field",
                                  children: [
                                    "Reda\xE7\xF5es anteriores equivalentes (uma por linha)",
                                    (0, S.jsx)("textarea", {
                                      rows: 2,
                                      value: (g.previousPhrases ?? []).join(`
`),
                                      onChange: (x) =>
                                        i({
                                          ...o,
                                          response: {
                                            ...o.response,
                                            materialUpdates: o.response.materialUpdates.map((C, $) =>
                                              $ === y
                                                ? {
                                                    ...C,
                                                    occurrences: C.occurrences?.map((A, D) =>
                                                      D === h
                                                        ? {
                                                            ...A,
                                                            previousPhrases: x.target.value
                                                              .split(
                                                                `
`,
                                                              )
                                                              .filter(Boolean),
                                                          }
                                                        : A,
                                                    ),
                                                  }
                                                : C,
                                            ),
                                          },
                                        }),
                                    }),
                                  ],
                                }),
                              ],
                            })
                          : (0, S.jsxs)("p", { className: "meta", children: ["Evid\xEAncia: ", g.evidence] }),
                        g.explanation &&
                          (0, S.jsxs)("p", {
                            className: "preserve-lines",
                            children: [
                              (0, S.jsx)("strong", { children: "Como foi cobrado:" }),
                              " ",
                              g.explanation,
                            ],
                          }),
                        !!g.previousPhrases?.length &&
                          (0, S.jsxs)("p", {
                            className: "meta",
                            children: ["Preservar incid\xEAncias de: ", g.previousPhrases.join(" \xB7 ")],
                          }),
                      ],
                    },
                    `${y}-${h}`,
                  ),
                ),
              ),
              (0, S.jsx)("p", {
                className: "meta",
                children:
                  "Uma quest\xE3o conta uma vez em cada trecho. As contagens s\xF3 mudar\xE3o quando voc\xEA aprovar os v\xEDnculos no Professor.",
              }),
            ],
          }),
        !o.response.materialUpdates.length &&
          (0, S.jsx)("p", { children: "Nenhuma altera\xE7\xE3o de material proposta nesta an\xE1lise." }),
        u && (0, S.jsx)(te, { error: !0, children: u }),
        (0, S.jsxs)("div", {
          className: "actions",
          children: [
            (0, S.jsx)("button", {
              className: "button",
              onClick: () => a.rejectIntake(e.intakeId),
              children: "Rejeitar rascunho",
            }),
            (0, S.jsxs)("button", {
              className: "button primary",
              disabled: p.questions.length > 0 || d.length > 0,
              onClick: () => {
                try {
                  let b = a.approveIntake(e.intakeId, m.result);
                  r.push(`/professor?questao=${b.id}`);
                } catch (b) {
                  c(b.message);
                }
              },
              children: [(0, S.jsx)(ca, { size: 16 }), "Aprovar ficha e revisar material"],
            }),
          ],
        }),
      ],
    });
  }
  var y3 = { waiting: "Na fila", review: "Em revis\xE3o", approved: "Aprovada", rejected: "Descartada" },
    b3 = [
      ["andamento", "Em andamento"],
      ["waiting", "Na fila"],
      ["review", "Em revis\xE3o"],
      ["approved", "Aprovadas"],
      ["rejected", "Descartadas"],
      ["todas", "Todas"],
    ],
    x3 = (e) => {
      let t = new Date(e);
      return Number.isNaN(t.getTime())
        ? ""
        : t.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
    };
  function S3({ selected: e, onSelect: t }) {
    let { state: a } = W(),
      { current: n, batch: r } = Zi(),
      o = new Set(r?.queued ?? []),
      [i, s] = (0, Ot.useState)("andamento"),
      [l, u] = (0, Ot.useState)(30),
      c = (m) =>
        a.intakes.filter(
          (p) =>
            m === "todas" ||
            (m === "andamento" ? p.status === "waiting" || p.status === "review" : p.status === m),
        ).length,
      f = a.intakes
        .filter(
          (m) =>
            i === "todas" ||
            (i === "andamento" ? m.status === "waiting" || m.status === "review" : m.status === i),
        )
        .sort((m, p) =>
          i === "andamento" || i === "waiting"
            ? m.status === p.status
              ? m.createdAt.localeCompare(p.createdAt)
              : m.status === "review"
                ? -1
                : 1
            : (p.submittedAt ?? p.createdAt).localeCompare(m.submittedAt ?? m.createdAt),
        ),
      d = (m) => {
        let p = m.questionId ? a.questions.find(($) => $.id === m.questionId) : void 0,
          v = p ?? m.result?.question,
          b = na(m) ?? (v?.number || ""),
          y = m.rawText
            .split(
              `
`,
            )
            .map(($) => $.trim())
            .filter(Boolean),
          g = b
            ? y
                .find(($) => $.includes(`#${b}`))
                ?.replace(`#${b}`, "")
                .trim()
            : void 0,
          h = v
            ? [v.subject, v.topic].filter(Boolean).join(" \xB7 ")
            : /Matéria:\s*(.+)/.exec(m.rawText)?.[1]?.trim(),
          x = v ? [v.board, v.year || "", v.exam].filter(Boolean).join(" \xB7 ") : g,
          C = v?.chosen ? (v.chosen === v.correct ? "acertou" : "errou") : void 0;
        return {
          code: b,
          subject: h,
          meta: x || y.find(($) => $.length > 20)?.slice(0, 120),
          answer: C,
          questionId: p?.id,
        };
      };
    return (0, S.jsxs)("section", {
      className: "paper stack intake-tracker",
      id: "intake-picker",
      "aria-label": "Quest\xF5es adicionadas",
      children: [
        (0, S.jsxs)("div", {
          className: "section-heading",
          children: [
            (0, S.jsx)("h2", { children: "Suas quest\xF5es" }),
            (0, S.jsxs)("span", { className: "meta", children: [a.intakes.length, " no total"] }),
          ],
        }),
        (0, S.jsx)("div", {
          className: "filter-chips",
          role: "tablist",
          "aria-label": "Filtrar por situa\xE7\xE3o",
          children: b3.map(([m, p]) =>
            (0, S.jsxs)(
              "button",
              {
                role: "tab",
                "aria-selected": i === m,
                className: `chip ${i === m ? "active" : ""}`,
                onClick: () => {
                  (s(m), u(30));
                },
                children: [p, " ", (0, S.jsx)("span", { children: c(m) })],
              },
              m,
            ),
          ),
        }),
        !f.length &&
          (0, S.jsx)("p", {
            className: "meta",
            children:
              i === "andamento" || i === "waiting"
                ? "Nada na fila. Cole uma quest\xE3o acima para come\xE7ar."
                : "Nenhuma quest\xE3o nesta situa\xE7\xE3o.",
          }),
        (0, S.jsx)("div", {
          className: "intake-list",
          children: f.slice(0, l).map((m) => {
            let p = d(m);
            return (0, S.jsxs)(
              "button",
              {
                className: `intake-row ${e === m.id ? "selected" : ""}`,
                onClick: () => t(m.id),
                "aria-current": e === m.id ? "true" : void 0,
                children: [
                  n?.intakeId === m.id
                    ? (0, S.jsx)("span", { className: "status-pill status-running", children: "Analisando" })
                    : m.status === "waiting" && o.has(m.id)
                      ? (0, S.jsx)("span", {
                          className: "status-pill status-queued",
                          children: "Na fila para an\xE1lise",
                        })
                      : (0, S.jsx)("span", {
                          className: `status-pill status-${m.status}`,
                          children: y3[m.status],
                        }),
                  (0, S.jsxs)("span", {
                    className: "intake-main",
                    children: [
                      (0, S.jsxs)("strong", {
                        children: [
                          p.code ? `TEC #${p.code}` : "Sem c\xF3digo TEC",
                          p.subject ? (0, S.jsxs)(S.Fragment, { children: [" \xB7 ", p.subject] }) : null,
                        ],
                      }),
                      p.meta && (0, S.jsx)("small", { children: p.meta }),
                      (0, S.jsxs)("small", {
                        className: "intake-dates",
                        children: [
                          "Colada em ",
                          x3(m.createdAt),
                          m.analysisModel ? ` \xB7 analisada por ${m.analysisModel}` : "",
                          p.answer ? ` \xB7 voc\xEA ${p.answer}` : "",
                        ],
                      }),
                    ],
                  }),
                  (0, S.jsx)("span", { className: "intake-open", "aria-hidden": !0, children: "\u203A" }),
                ],
              },
              m.id,
            );
          }),
        }),
        f.length > l &&
          (0, S.jsxs)("button", {
            className: "button",
            onClick: () => u(l + 30),
            children: ["Mostrar mais (", f.length - l, ")"],
          }),
      ],
    });
  }
  function I3() {
    let { state: e } = W(),
      t = Th(),
      { current: a } = Zi(),
      n = e.intakes
        .filter((i) => i.status === "waiting")
        .sort((i, s) => i.createdAt.localeCompare(s.createdAt)),
      r = n[0],
      o = r ? na(r) : null;
    return (0, S.jsxs)("section", {
      className: "paper stack claude-queue",
      children: [
        (0, S.jsxs)("div", {
          className: "section-heading",
          children: [
            (0, S.jsx)("h2", { children: "Fila do Claude" }),
            (0, S.jsx)("span", {
              className: "badge",
              children: n.length ? `${n.length} aguardando` : "Vazia",
            }),
          ],
        }),
        t === !1
          ? (0, S.jsx)("p", {
              children:
                "Para analisar, abra o Audis pelo Claude (app ou claude.ai). Suas quest\xF5es continuam salvas na fila.",
            })
          : (0, S.jsxs)(S.Fragment, {
              children: [
                (0, S.jsx)("p", {
                  children:
                    "O Claude l\xEA a quest\xE3o, compara com o seu material e salva a ficha, as incid\xEAncias e o caderno de erros quando a valida\xE7\xE3o passa. Cada an\xE1lise usa a sua cota do Claude e leva de 30 segundos a 2 minutos.",
                }),
                (0, S.jsxs)("div", {
                  className: "queue-controls",
                  children: [
                    (0, S.jsx)(xM, {}),
                    r &&
                      (0, S.jsx)(zh, {
                        intakeId: r.id,
                        label: `Analisar a pr\xF3xima${o ? ` (TEC #${o})` : ""}`,
                      }),
                    (0, S.jsx)(SM, { ids: n.map((i) => i.id) }),
                  ],
                }),
                !r &&
                  !a &&
                  (0, S.jsx)("p", {
                    className: "meta",
                    children:
                      "Nada na fila. Cole uma quest\xE3o acima e toque em \u201CColocar na fila do Claude\u201D.",
                  }),
                (0, S.jsx)(IM, {}),
              ],
            }),
      ],
    });
  }
  function w3({ waiting: e, onCopied: t }) {
    if (!0) return (0, S.jsx)(I3, {});
    let a = "Analise as quest\xF5es pendentes do Audis.";
    return (0, S.jsxs)("section", {
      className: "paper stack claude-queue",
      children: [
        (0, S.jsxs)("div", {
          className: "section-heading",
          children: [
            (0, S.jsx)("h2", { children: "Fila do Claude" }),
            (0, S.jsx)("span", { className: "badge", children: e ? `${e} aguardando` : "Vazia" }),
          ],
        }),
        (0, S.jsxs)("p", {
          children: [
            "No app do Claude (celular ou computador) ou no Claude Code, com o conector Audis, pe\xE7a: ",
            (0, S.jsxs)("strong", { children: ["\u201C", a, "\u201D"] }),
            ". Tamb\xE9m d\xE1 para colar as quest\xF5es direto na conversa, sem passar por aqui.",
          ],
        }),
        (0, S.jsxs)("div", {
          className: "actions",
          children: [
            (0, S.jsxs)("button", {
              className: "button",
              onClick: async () => {
                try {
                  (await navigator.clipboard.writeText(a), t());
                } catch {}
              },
              children: [(0, S.jsx)(xr, { size: 16 }), "Copiar pedido"],
            }),
            (0, S.jsx)("a", {
              className: "text-link",
              href: "https://claude.ai/new",
              target: "_blank",
              rel: "noreferrer",
              children: "Abrir o Claude \u2197",
            }),
            (0, S.jsx)("a", {
              className: "text-link",
              href: "/professor/#conector",
              children: "Como conectar",
            }),
          ],
        }),
      ],
    });
  }
  function g0() {
    let { state: e, service: t } = W(),
      [a, n] = (0, Ot.useState)(""),
      [r, o] = (0, Ot.useState)(""),
      [i, s] = (0, Ot.useState)(null),
      [l, u] = (0, Ot.useState)(""),
      [c, f] = (0, Ot.useState)(""),
      [d, m] = (0, Ot.useState)(""),
      p = (0, Ot.useMemo)(() => Ju(a), [a]),
      v = i ?? (p.length === 1 ? p[0] : ""),
      b = (0, Ot.useMemo)(() => jr(e, v), [e, v]),
      y = !!v.trim() && !Ft(v),
      g = p.length > 0 && !v.trim(),
      h = ($) => {
        (o($),
          m(""),
          f(""),
          u(""),
          requestAnimationFrame(() =>
            document.getElementById("intake-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }),
          ));
      },
      x = e.intakes.find(($) => $.id === r),
      C = x ? kN(x, t.intakeMaterial(x.id)) : "";
    return (0, S.jsxs)("main", {
      className: "page wide-page add-question-page",
      children: [
        (0, S.jsx)(Za, {
          eyebrow: "COLAR \xB7 ORGANIZAR \xB7 REVISAR",
          title: "Trazer quest\xE3o do TEC",
          description:
            "Cole tudo: quest\xE3o, alternativas, resultado e coment\xE1rios. A quest\xE3o entra na fila e o Claude (Professor Audis) preenche a ficha, vincula ao material e salva as incid\xEAncias.",
        }),
        (0, S.jsxs)("section", {
          className: "paper stack",
          children: [
            (0, S.jsxs)("label", {
              className: "field",
              children: [
                "Conte\xFAdo completo do TEC",
                (0, S.jsx)("textarea", {
                  rows: 10,
                  value: a,
                  onChange: ($) => {
                    (n($.target.value), s(null), m(""), f(""));
                  },
                  maxLength: 15e4,
                  placeholder:
                    "Cole o bloco inteiro, mesmo se os coment\xE1rios vierem antes do enunciado. Inclua n\xFAmero TEC, banca, ano, gabarito e a mensagem com sua resposta, quando dispon\xEDveis.",
                }),
              ],
            }),
            !!a.trim() &&
              (0, S.jsxs)(S.Fragment, {
                children: [
                  (0, S.jsxs)("label", {
                    className: "field",
                    children: [
                      "C\xF3digo TEC da quest\xE3o",
                      (0, S.jsx)("input", {
                        value: v,
                        maxLength: 100,
                        inputMode: "numeric",
                        onChange: ($) => {
                          (s($.target.value), m(""));
                        },
                        placeholder: "Ex.: 3863218",
                        "aria-describedby": "question-code-help",
                      }),
                    ],
                  }),
                  (0, S.jsx)("p", {
                    id: "question-code-help",
                    className: "meta",
                    children:
                      p.length > 1
                        ? `Encontramos mais de um c\xF3digo: ${p.join(", ")}. Confirme qual identifica a quest\xE3o principal.`
                        : p.length === 1
                          ? "C\xF3digo identificado no conte\xFAdo. Confira ou corrija antes de continuar."
                          : "N\xE3o identificamos um c\xF3digo no conte\xFAdo. Informe-o, se dispon\xEDvel; sem ele, a duplicidade por c\xF3digo n\xE3o poder\xE1 ser verificada.",
                  }),
                  y &&
                    (0, S.jsx)(te, {
                      error: !0,
                      children: "Confira o c\xF3digo TEC: use apenas o n\xFAmero da quest\xE3o.",
                    }),
                  (0, S.jsx)(Hi, { match: b, onContinue: h }),
                ],
              }),
            (0, S.jsxs)("div", {
              className: "actions",
              children: [
                (0, S.jsxs)("button", {
                  className: "button primary",
                  disabled: !a.trim() || y || g || b.questions.length > 0 || b.intakes.length > 0,
                  onClick: () => {
                    try {
                      (t.createIntake(a, v),
                        n(""),
                        s(null),
                        m(""),
                        f("Quest\xE3o na fila. Pode colar a pr\xF3xima."));
                    } catch ($) {
                      m($.message);
                    }
                  },
                  children: ["Colocar na fila do Claude ", (0, S.jsx)(gt, { size: 16 })],
                }),
                (0, S.jsx)("button", {
                  className: "button",
                  disabled: !a.trim() || y || g || b.questions.length > 0 || b.intakes.length > 0,
                  onClick: () => {
                    try {
                      let $ = t.createIntake(a, v);
                      h($.id);
                    } catch ($) {
                      m($.message);
                    }
                  },
                  children: "Preparar pedido manual",
                }),
              ],
            }),
          ],
        }),
        (0, S.jsx)(w3, {
          waiting: e.intakes.filter(($) => $.status === "waiting").length,
          onCopied: () => f("Pedido copiado. Cole na conversa com o Claude."),
        }),
        e.intakes.length > 0 && (0, S.jsx)(S3, { selected: r, onSelect: h }),
        (0, S.jsx)("div", { id: "intake-detail" }),
        x?.status === "waiting" &&
          (0, S.jsxs)("section", {
            className: "paper stack",
            children: [
              (0, S.jsx)("span", { className: "badge", children: "Na fila \xB7 aguardando an\xE1lise" }),
              (0, S.jsx)("h2", { children: "Aguardando o Claude ou o interc\xE2mbio manual." }),
              (0, S.jsxs)("details", {
                children: [
                  (0, S.jsx)("summary", { children: "Texto colado do TEC" }),
                  (0, S.jsx)("p", { className: "preserve-lines pasted-text", children: x.rawText }),
                ],
              }),
              (0, S.jsx)(Hi, { match: jr(e, na(x) ?? "", x.id), onContinue: h }),
              (0, S.jsx)("div", {
                className: "actions",
                children: (0, S.jsx)(zh, { intakeId: x.id, label: "Analisar esta quest\xE3o com o Claude" }),
              }),
              !!0 &&
                (0, S.jsxs)("button", {
                  className: "button",
                  onClick: async () => {
                    try {
                      (await navigator.clipboard.writeText(
                        `Analise a quest\xE3o pendente do Audis (intakeId ${x.id}) seguindo get_analysis_guide e envie por submit_question_analysis.`,
                      ),
                        f("Pedido copiado. Cole na conversa com o Claude."));
                    } catch {
                      m("N\xE3o foi poss\xEDvel copiar. Use o interc\xE2mbio manual abaixo.");
                    }
                  },
                  children: [(0, S.jsx)(xr, { size: 16 }), "Copiar pedido para o Claude"],
                }),
              (0, S.jsxs)("details", {
                children: [
                  (0, S.jsx)("summary", { children: "Interc\xE2mbio manual (sem conector)" }),
                  (0, S.jsxs)("div", {
                    className: "stack",
                    children: [
                      (0, S.jsxs)("label", {
                        className: "field",
                        children: [
                          "Pedido completo para colar em qualquer conversa com IA",
                          (0, S.jsx)("textarea", { readOnly: !0, rows: 6, value: C }),
                        ],
                      }),
                      (0, S.jsxs)("label", {
                        className: "field",
                        children: [
                          "Resposta do Professor",
                          (0, S.jsx)("textarea", {
                            value: l,
                            rows: 6,
                            maxLength: 2e5,
                            onChange: ($) => u($.target.value),
                            placeholder:
                              "Cole a resposta JSON recebida; voc\xEA n\xE3o precisa escrever os campos.",
                          }),
                        ],
                      }),
                      (0, S.jsx)("button", {
                        className: "button",
                        disabled: !l.trim(),
                        onClick: () => {
                          try {
                            let $ = bi(l);
                            if ($.intakeId !== x.id)
                              throw new Error("A resposta pertence a outra solicita\xE7\xE3o.");
                            (t.receiveIntake($), u(""), m(""));
                          } catch ($) {
                            m($.message);
                          }
                        },
                        children: "Receber ficha preenchida",
                      }),
                    ],
                  }),
                ],
              }),
              (0, S.jsx)("div", {
                className: "actions",
                children: (0, S.jsx)("button", {
                  className: "button",
                  onClick: () => t.rejectIntake(x.id),
                  children: "Descartar solicita\xE7\xE3o",
                }),
              }),
            ],
          }),
        x?.status === "review" &&
          !0 &&
          (0, S.jsx)("div", {
            className: "actions",
            children: (0, S.jsx)(zh, {
              intakeId: x.id,
              label: "Refazer a an\xE1lise com o Claude",
              primary: !1,
            }),
          }),
        x?.status === "review" && x.result && (0, S.jsx)(v3, { result: x.result, onContinue: h }, x.id),
        x?.status === "approved" &&
          (0, S.jsxs)("section", {
            className: "paper stack",
            children: [
              (0, S.jsxs)("span", {
                className: "badge",
                children: ["Aprovada", x.analysisModel ? ` \xB7 analisada por ${x.analysisModel}` : ""],
              }),
              x.questionId && e.questions.some(($) => $.id === x.questionId && $.source === "tec-manual")
                ? (0, S.jsx)(Lh, { questionId: x.questionId })
                : (0, S.jsx)("p", {
                    children: "A quest\xE3o, a an\xE1lise e as incid\xEAncias j\xE1 est\xE3o no seu acervo.",
                  }),
              (0, S.jsx)("div", {
                className: "actions",
                children:
                  x.questionId &&
                  (0, S.jsxs)(re, {
                    className: "button primary",
                    href: `/professor/?questao=${x.questionId}`,
                    children: ["Abrir no Professor ", (0, S.jsx)(gt, { size: 16 })],
                  }),
              }),
              (0, S.jsxs)("details", {
                children: [
                  (0, S.jsx)("summary", { children: "Texto colado do TEC" }),
                  (0, S.jsx)("p", { className: "preserve-lines pasted-text", children: x.rawText }),
                ],
              }),
            ],
          }),
        x?.status === "rejected" &&
          (0, S.jsxs)("section", {
            className: "paper stack",
            children: [
              (0, S.jsx)(te, {
                children:
                  "Descartada. Nenhuma quest\xE3o ou altera\xE7\xE3o de material foi incorporada por ela. Para analisar de novo, cole o texto outra vez.",
              }),
              (0, S.jsxs)("details", {
                children: [
                  (0, S.jsx)("summary", { children: "Texto colado do TEC" }),
                  (0, S.jsx)("p", { className: "preserve-lines pasted-text", children: x.rawText }),
                ],
              }),
            ],
          }),
        c && (0, S.jsx)(te, { children: c }),
        d && (0, S.jsx)(te, { error: !0, children: d }),
        (0, S.jsx)("p", {
          className: "session-note",
          children:
            "Quest\xF5es, rascunhos e aprova\xE7\xF5es s\xE3o salvos na sua conta. Aguarde a confirma\xE7\xE3o de sincroniza\xE7\xE3o antes de fechar.",
        }),
        (0, S.jsxs)("details", {
          children: [
            (0, S.jsx)("summary", { children: "Cadastro manual (opcional)" }),
            (0, S.jsx)(p0, { onContinue: h }),
          ],
        }),
      ],
    });
  }
  var Ga = U(Le());
  var B = U(X());
  function h0() {
    let { service: e, state: t } = W(),
      a = Yr(),
      n = e.activeMaterial(),
      r = n.find((l) => l.id === a.get("topico")) ?? n[0];
    if (!r)
      return (0, B.jsxs)("main", {
        className: "page",
        children: [
          (0, B.jsx)("h1", { children: "Nenhum material dispon\xEDvel" }),
          (0, B.jsx)("p", {
            children:
              "Restaure uma se\xE7\xE3o da lixeira ou adicione um novo material para iniciar uma miss\xE3o.",
          }),
          (0, B.jsx)(re, { className: "button", href: "/material", children: "Ir ao Material" }),
        ],
      });
    let o = new Set(r.highlights.flatMap((l) => l.references?.map((u) => u.key) ?? [])),
      i = t.questions.filter((l) => l.sectionId === r.id || o.has(Ae(l))),
      s =
        i.find((l) => l.id === a.get("questao")) ??
        i.find((l) => l.source === "tec-manual" && l.answeredCorrectly === !1) ??
        i.find((l) => l.source === "tec-manual") ??
        i[0];
    return (0, B.jsx)($3, { section: r, question: s }, `${r.id}:${a.get("questao") ?? "session"}`);
  }
  function $3({ section: e, question: t }) {
    let { service: a, state: n } = W(),
      [r] = (0, Ga.useState)(t?.id),
      o = n.questions.find((_) => _.id === r),
      [i, s] = (0, Ga.useState)(0),
      [l, u] = (0, Ga.useState)(""),
      [c, f] = (0, Ga.useState)(!1),
      [d, m] = (0, Ga.useState)(!1),
      [p, v] = (0, Ga.useState)(""),
      [b] = (0, Ga.useState)(() => crypto.randomUUID()),
      [y] = (0, Ga.useState)(Date.now),
      [g, h] = (0, Ga.useState)(null),
      [x, C] = (0, Ga.useState)(null),
      $ =
        e.highlights[0]?.phrase ??
        e.text
          .split(
            `

`,
          )
          .find((_) => _.length > 60) ??
        e.text,
      A = [...$.matchAll(/[\p{L}]{5,}/gu)],
      D = A[Math.floor(A.length / 2)],
      ae = D?.[0] ?? "",
      J = D ? $.slice(0, D.index) + "______" + $.slice(D.index + ae.length) : $,
      q = n.completedMissions.find((_) => _.id === b);
    (0, Ga.useEffect)(
      () => (
        a.selectQuestion(i === 2 && o ? o.id : null),
        () => {
          a.selectQuestion(null);
        }
      ),
      [a, i, o?.id],
    );
    let Y = () => {
        try {
          (i === 4 &&
            a.completeMission(b, e.topic, {
              durationSeconds: Math.max(0, Math.floor((Date.now() - y) / 1e3)),
              answered: g === null ? 0 : 1,
              correct: g === !0 ? 1 : 0,
            }),
            s((_) => _ + 1),
            u(""),
            f(!1),
            C(null),
            v(""));
        } catch (_) {
          v(_.message);
        }
      },
      Q = () => {
        if (l.trim())
          try {
            (i === 2 &&
              o &&
              (a.recordAnswer(o.id, l),
              h(l === o.correct),
              l !== o.correct && a.addError(o.id),
              o.source === "tec-manual" && C(a.answerFeedback(o.id))),
              f(!0),
              v(""));
          } catch (_) {
            v(_.message);
          }
      };
    return (0, B.jsxs)("div", {
      className: "focus-layout",
      children: [
        (0, B.jsxs)("header", {
          className: "focus-header",
          children: [
            (0, B.jsxs)(re, {
              href: "/",
              className: "brand",
              children: [
                (0, B.jsx)("span", { className: "brand-mark", children: "a." }),
                (0, B.jsx)("span", { className: "brand-name", children: "Audis" }),
              ],
            }),
            (0, B.jsx)("span", { children: "MODO FOCO" }),
            (0, B.jsx)("button", {
              className: "icon-button",
              "aria-label": "Sair da miss\xE3o",
              onClick: () => m(!0),
              children: (0, B.jsx)(An, { size: 20 }),
            }),
          ],
        }),
        i < 5
          ? (0, B.jsxs)("main", {
              className: "focus-content",
              children: [
                (0, B.jsxs)("div", {
                  className: "focus-progress",
                  children: [
                    (0, B.jsxs)("span", { children: ["Miss\xE3o ", i + 1, "/5"] }),
                    (0, B.jsxs)("span", { children: [Math.round((i / 5) * 100), "%"] }),
                  ],
                }),
                (0, B.jsx)("div", {
                  className: "progress-track",
                  children: (0, B.jsx)("span", { style: { width: `${(i / 5) * 100}%` } }),
                }),
                (0, B.jsxs)("p", { className: "focus-subject", children: [e.subject, " \xB7 ", e.topic] }),
                (0, B.jsx)("span", {
                  className: "small-label",
                  children: [
                    "01 \xB7 RECUPERA\xC7\xC3O ATIVA",
                    "02 \xB7 COMPLETE A LACUNA",
                    "03 \xB7 APLIQUE O CONCEITO",
                    "04 \xB7 PR\xC1TICA NO TEC",
                    "05 \xB7 CONSOLIDE",
                  ][i],
                }),
                i === 3
                  ? (0, B.jsxs)(B.Fragment, {
                      children: [
                        (0, B.jsx)("h1", { children: "Hora de praticar." }),
                        (0, B.jsxs)("p", {
                          children: [
                            "Pratique quest\xF5es sobre ",
                            (0, B.jsx)("strong", { children: e.topic }),
                            " no TEC e traga os resultados para o Audis.",
                          ],
                        }),
                        (0, B.jsxs)("div", {
                          className: "callout",
                          children: [
                            (0, B.jsx)("h3", { children: "Ao voltar, registre" }),
                            (0, B.jsx)("p", {
                              children:
                                "A quest\xE3o, o gabarito e a alternativa que voc\xEA marcou. Assim seu desempenho ser\xE1 calculado com base na sua resposta.",
                            }),
                          ],
                        }),
                        (0, B.jsx)("p", {
                          className: "meta",
                          children:
                            "Quest\xF5es feitas no TEC s\xF3 entram na conta quando voc\xEA as cadastra; n\xE3o h\xE1 leitura autom\xE1tica da sua atividade externa.",
                        }),
                        (0, B.jsxs)("div", {
                          className: "actions",
                          children: [
                            (0, B.jsxs)("a", {
                              className: "button",
                              href: "https://www.tecconcursos.com.br/",
                              target: "_blank",
                              rel: "noreferrer",
                              children: ["Abrir TEC ", (0, B.jsx)(xd, { size: 16 })],
                            }),
                            (0, B.jsx)(re, {
                              className: "button",
                              href: "/adicionar",
                              target: "_blank",
                              children: "Trazer quest\xE3o",
                            }),
                            (0, B.jsxs)("button", {
                              className: "button primary",
                              onClick: Y,
                              children: ["Continuar para a s\xEDntese ", (0, B.jsx)(gt, { size: 16 })],
                            }),
                          ],
                        }),
                      ],
                    })
                  : (0, B.jsxs)(B.Fragment, {
                      children: [
                        (0, B.jsx)("h1", {
                          children:
                            i === 0
                              ? "Antes de consultar, lembre."
                              : i === 1
                                ? "Complete a ideia."
                                : i === 2
                                  ? "Aplique o que estudou."
                                  : "O que ficou com voc\xEA?",
                        }),
                        (0, B.jsx)("p", {
                          className: "focus-question",
                          children:
                            i === 0
                              ? `Como voc\xEA explicaria ${e.topic.toLowerCase()} com suas pr\xF3prias palavras?`
                              : i === 1
                                ? J
                                : i === 2
                                  ? (o?.statement ??
                                    `Explique um exemplo de aplica\xE7\xE3o desta regra: ${$}`)
                                  : `Resuma ${e.topic.toLowerCase()} e cite uma confus\xE3o que voc\xEA evitar\xE1 na pr\xF3xima quest\xE3o.`,
                        }),
                        i === 2 && o
                          ? (0, B.jsxs)(B.Fragment, {
                              children: [
                                o.source !== "tec-manual" &&
                                  (0, B.jsx)("p", {
                                    className: "meta",
                                    children: "Quest\xE3o de exemplo; n\xE3o entra no seu desempenho.",
                                  }),
                                (0, B.jsxs)("fieldset", {
                                  className: "alternatives",
                                  disabled: c,
                                  children: [
                                    (0, B.jsx)("legend", {
                                      className: "sr-only",
                                      children: "Escolha uma alternativa",
                                    }),
                                    Object.entries(o.alternatives).map(([_, N]) =>
                                      (0, B.jsxs)(
                                        "label",
                                        {
                                          className: `alternative ${l === _ ? "selected" : ""} ${c && _ === o.correct ? "correct" : ""}`,
                                          children: [
                                            (0, B.jsx)("input", {
                                              type: "radio",
                                              name: "answer",
                                              value: _,
                                              checked: l === _,
                                              onChange: () => u(_),
                                            }),
                                            (0, B.jsx)("span", { className: "option-letter", children: _ }),
                                            (0, B.jsx)("span", { children: N }),
                                          ],
                                        },
                                        _,
                                      ),
                                    ),
                                  ],
                                }),
                              ],
                            })
                          : (0, B.jsxs)("label", {
                              className: "field",
                              children: [
                                "Sua resposta",
                                i === 1 && ae
                                  ? (0, B.jsx)("input", {
                                      value: l,
                                      onChange: (_) => u(_.target.value),
                                      disabled: c,
                                      placeholder: "Complete a lacuna",
                                    })
                                  : (0, B.jsx)("textarea", {
                                      rows: 5,
                                      value: l,
                                      onChange: (_) => u(_.target.value),
                                      disabled: c,
                                      placeholder: "Escreva com suas pr\xF3prias palavras\u2026",
                                    }),
                              ],
                            }),
                        (0, B.jsx)("div", {
                          role: "status",
                          "aria-live": "polite",
                          children: x && (0, B.jsx)(n0, { feedback: x, inSession: !0 }),
                        }),
                        c
                          ? (0, B.jsxs)(B.Fragment, {
                              children: [
                                (0, B.jsx)(te, {
                                  children:
                                    i === 1 && ae
                                      ? l.trim().toLocaleLowerCase() === ae.toLocaleLowerCase()
                                        ? `Isso mesmo: ${ae}.`
                                        : `A palavra esperada \xE9 \u201C${ae}\u201D. Compare com o trecho do material.`
                                      : i === 2 && o
                                        ? `${l === o.correct ? "Resposta correta." : "Vamos retomar este ponto."} Gabarito: ${o.correct}.`
                                        : "Compare seu racioc\xEDnio com o material abaixo. Respostas abertas n\xE3o recebem nota autom\xE1tica.",
                                }),
                                (0, B.jsxs)("div", {
                                  className: "callout",
                                  children: [
                                    (0, B.jsx)("h3", {
                                      children:
                                        i === 2 && o
                                          ? "Explica\xE7\xE3o dispon\xEDvel"
                                          : "Trecho para compara\xE7\xE3o",
                                    }),
                                    (0, B.jsx)("p", {
                                      className: "preserve-lines",
                                      children:
                                        i === 2 && o
                                          ? (n.responses[o.id]?.explanation ??
                                            o.commentary ??
                                            "Ainda n\xE3o h\xE1 coment\xE1rio salvo para esta quest\xE3o.")
                                          : $,
                                    }),
                                  ],
                                }),
                                (0, B.jsxs)("button", {
                                  className: "button primary",
                                  onClick: Y,
                                  children: [
                                    i === 4 ? "Concluir miss\xE3o" : "Pr\xF3xima etapa",
                                    (0, B.jsx)(gt, { size: 16 }),
                                  ],
                                }),
                              ],
                            })
                          : (0, B.jsxs)("button", {
                              className: "button primary",
                              disabled: !l.trim(),
                              onClick: Q,
                              children: ["Responder ", (0, B.jsx)(gt, { size: 16 })],
                            }),
                      ],
                    }),
                p && (0, B.jsx)(te, { error: !0, children: p }),
                (0, B.jsx)("p", {
                  className: "focus-footnote",
                  children: "Sem pressa. A compreens\xE3o vem antes da velocidade.",
                }),
              ],
            })
          : (0, B.jsxs)("main", {
              className: "focus-content completion",
              children: [
                (0, B.jsx)("div", { className: "completion-check", children: (0, B.jsx)(ca, { size: 30 }) }),
                (0, B.jsx)("span", { className: "small-label", children: "UM PASSO A MAIS" }),
                (0, B.jsx)("h1", { children: "Miss\xE3o conclu\xEDda." }),
                (0, B.jsx)("div", {
                  className: "completion-stats",
                  children: [
                    [`${Math.floor((q?.durationSeconds ?? 0) / 60)} min`, "tempo nesta sess\xE3o"],
                    [q?.answered ?? 0, "quest\xE3o respondida aqui"],
                    [q?.correct ?? 0, "acertos aqui"],
                    [(q?.answered ?? 0) - (q?.correct ?? 0), "erros aqui"],
                  ].map(([_, N]) =>
                    (0, B.jsxs)(
                      "div",
                      {
                        children: [
                          (0, B.jsx)("strong", { children: _ }),
                          (0, B.jsx)("span", { children: N }),
                        ],
                      },
                      N,
                    ),
                  ),
                }),
                (0, B.jsx)("p", {
                  className: "meta",
                  children:
                    "Este resumo inclui apenas a pr\xE1tica nesta miss\xE3o. Exemplos n\xE3o entram no desempenho; resultados externos precisam ser cadastrados.",
                }),
                (0, B.jsxs)("span", {
                  className: "badge",
                  children: ["+35 XP pela miss\xE3o \xB7 n\xEDvel ", a.statistics().level],
                }),
                (0, B.jsxs)("div", {
                  className: "actions",
                  children: [
                    (0, B.jsxs)(re, {
                      className: "button primary",
                      href: "/",
                      children: ["Voltar para Hoje ", (0, B.jsx)(gt, { size: 16 })],
                    }),
                    (0, B.jsx)(re, {
                      className: "button",
                      href: `/material?topico=${e.id}`,
                      children: "Revisar material",
                    }),
                  ],
                }),
              ],
            }),
        d &&
          (0, B.jsxs)(da, {
            title: "Sair do modo foco?",
            onClose: () => m(!1),
            children: [
              (0, B.jsx)("p", {
                children:
                  "As respostas objetivas j\xE1 enviadas permanecem salvas. Os textos desta sess\xE3o ser\xE3o descartados e a miss\xE3o n\xE3o ser\xE1 marcada como conclu\xEDda.",
              }),
              (0, B.jsxs)("div", {
                className: "actions",
                children: [
                  (0, B.jsx)("button", {
                    className: "button",
                    onClick: () => m(!1),
                    children: "Continuar estudando",
                  }),
                  (0, B.jsxs)(re, {
                    className: "button primary",
                    href: "/missoes",
                    children: [(0, B.jsx)(pd, { size: 16 }), "Sair da miss\xE3o"],
                  }),
                ],
              }),
            ],
          }),
      ],
    });
  }
  var Qa = U(X()),
    wM = {
      "/": () => (0, Qa.jsx)(ZC, {}),
      "/missoes": () => (0, Qa.jsx)(__PLW, {}),
      "/missoes/criar": () => (0, Qa.jsx)(MC, {}),
      "/material": () => (0, Qa.jsx)(t0, {}),
      "/erros": () => (0, Qa.jsx)(__RXW, {}),
      "/professor": () => (0, Qa.jsx)(i0, {}),
      "/desempenho": () => (0, Qa.jsx)(c0, {}),
      "/radar": () => (0, Qa.jsx)(__RDR, {}),
      "/flashcards": () => (0, Qa.jsx)(__FC, {}),
      "/mapas": () => (0, Qa.jsx)(__MP, {}),
      "/teoria": () => (0, Qa.jsx)(__TE, {}),
      "/conquistas": () => (0, Qa.jsx)(__CQ, {}),
      "/adicionar": () => (0, Qa.jsx)(g0, {}),
    };
  function C3() {
    let e = gh().replace(/\/$/, "") || "/";
    if (e === "/foco") return (0, Qa.jsx)(h0, {}, e);
    let t = wM[e] ?? wM["/"];
    return (0, Qa.jsx)(rO, { children: t() }, e);
  }
  document.title = "Audis";
  (0, $M.createRoot)(document.getElementById("root")).render(
    (0, Qa.jsx)(JD, { children: (0, Qa.jsx)(C3, {}) }),
  );
})();
