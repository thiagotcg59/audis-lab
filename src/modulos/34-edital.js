  // Edital (/edital): gestão visual do edital. Um painel por disciplina e, dentro dele, um quadro por assunto.
  // O quadro mostra em que ponto o assunto está (sem teoria, com mapa, com teoria escrita) e quantos blocos
  // do Ciclo ele já recebeu. Tocar no quadro abre a Teoria do assunto.
  // Não guarda nada: lê o edital e o andamento do Ciclo (módulo 33), os mapas (29) e a teoria (31).
  // A ligação assunto › mapa é a mesma do Ciclo (`ci` no mapa, veja __ciMapaDe).
  function __edNome(t) {
    return (
      String(t || "")
        .replace(/^\s*\d+(\.\d+)*\.?\s+/, "")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\.$/, "") || "Assunto do edital"
    );
  }
  // st: "t" teoria escrita, "m" só o mapa, "n" nada ainda
  function __edInfo(a) {
    let m = __ciMapaDe(a.id),
      doc = m ? __teStore.items[m.id] : null,
      caps = doc && Array.isArray(doc.caps) ? doc.caps.length : 0;
    return {
      m,
      caps,
      st: caps ? "t" : m ? "m" : "n",
      mudou: !!(caps && !doc.livre && __teFalta(m, doc).length),
    };
  }
  function __EDQuadro({ a, info, blocos, onNovo }) {
    let h = __rdR.createElement,
      nome = __edNome(a.t),
      estado =
        info.st === "t"
          ? `${info.caps} ${info.caps === 1 ? "capítulo" : "capítulos"}` + (info.mudou ? " · atualizar" : "")
          : info.st === "m"
            ? "mapa criado, sem teoria"
            : "sem teoria",
      dentro = [
        h("span", { key: "t", className: "ed-q-t" }, nome),
        h(
          "span",
          { key: "f", className: "ed-q-f" },
          h("span", null, estado),
          blocos ? h("span", { className: "ed-q-b" }, blocos === 1 ? "1 bloco" : `${blocos} blocos`) : null,
        ),
      ];
    return info.m
      ? h(
          re,
          { className: "ed-q " + info.st, href: "/teoria?m=" + encodeURIComponent(info.m.id), title: a.t },
          dentro,
        )
      : h("button", { type: "button", className: "ed-q n", title: a.t, onClick: onNovo }, dentro);
  }
  function __ED() {
    __ciUse();
    __mpUse();
    __teUse();
    let h = __rdR.createElement,
      ed = __ciEd(),
      an = __ciAn(),
      [filtro, setFiltro] = __rdR.useState("todos"),
      [novo, setNovo] = __rdR.useState(null),
      [copia, setCopia] = __rdR.useState(null),
      discs = ed.discs.map((d, i) => {
        let itens = d.as.map((a) => ({ a, info: __edInfo(a), blocos: an.cont[a.id] || 0 }));
        return { d, i, itens, comT: itens.filter((x) => x.info.st === "t").length };
      }),
      todos = discs.flatMap((x) => x.itens),
      nT = todos.filter((x) => x.info.st === "t").length,
      nM = todos.filter((x) => x.info.st === "m").length,
      nB = todos.filter((x) => x.blocos).length,
      passa = (x) => (filtro === "com" ? x.info.st === "t" : filtro === "sem" ? x.info.st !== "t" : !0),
      vis = discs.map((x) => ({ ...x, L: x.itens.filter(passa) })).filter((x) => x.L.length || filtro === "todos"),
      num = (n, rotulo) => h("div", null, h("b", null, n), h("span", null, rotulo)),
      chip = (id, rotulo) =>
        h(
          "button",
          { type: "button", className: filtro === id ? "on" : "", "aria-pressed": filtro === id, onClick: () => setFiltro(id) },
          rotulo,
        );
    return h(
      "main",
      { className: "page mp ed" },
      h(
        "div",
        { className: "page-intro" },
        h("div", { className: "small-label" }, "VISÃO GERAL DO EDITAL"),
        h("h1", null, "Edital"),
        h(
          "p",
          null,
          ed.nome || "Seu edital",
          ". Cada quadro é um assunto. Toque em um quadro para abrir a teoria dele.",
        ),
      ),
      !ed.discs.length
        ? h(
            "div",
            { className: "qd-empty" },
            h("b", null, "O edital está vazio."),
            h("p", null, "Monte as disciplinas e os assuntos no ", h(re, { className: "text-link", href: "/ciclo" }, "Ciclo"), "."),
          )
        : h(
            __rdR.Fragment,
            null,
            h(
              "div",
              { className: "ed-resumo" },
              num(todos.length, todos.length === 1 ? "assunto" : "assuntos"),
              num(nT, "com teoria escrita"),
              num(nM, "com mapa, sem teoria"),
              num(nB, "já estudados no Ciclo"),
            ),
            h(
              "div",
              { className: "ed-barra" },
              h(
                "div",
                { className: "ed-filtro", role: "group", "aria-label": "Quais assuntos mostrar" },
                chip("todos", "Todos"),
                chip("com", "Com teoria"),
                chip("sem", "Sem teoria"),
              ),
              h(
                "div",
                { className: "ed-leg" },
                h("span", null, h("i", { className: "t" }), "teoria escrita"),
                h("span", null, h("i", { className: "m" }), "só o mapa"),
                h("span", null, h("i", { className: "n" }), "sem teoria"),
              ),
            ),
            !vis.length ? h("p", { className: "meta ed-vazio" }, "Nenhum assunto neste filtro.") : null,
            vis.map(({ d, i, itens, comT, L }) =>
              h(
                "section",
                { key: d.id, className: "ed-disc", style: { "--ci": __ciCor(i) } },
                h(
                  "header",
                  null,
                  h("h2", null, d.n),
                  h(
                    "span",
                    { className: "meta" },
                    d.q ? `${d.q} questões` + (d.peso ? ` · peso ${d.peso}` : "") + " · " : "",
                    itens.length ? `${comT} de ${itens.length} com teoria` : "sem assuntos",
                  ),
                ),
                itens.length
                  ? h("span", { className: "mp-bar" }, h("i", { style: { width: (comT / itens.length) * 100 + "%" } }))
                  : null,
                h(
                  "div",
                  { className: "ed-grid" },
                  L.map((x) =>
                    h(__EDQuadro, { key: x.a.id, a: x.a, info: x.info, blocos: x.blocos, onNovo: () => setNovo({ d, a: x.a }) }),
                  ),
                ),
              ),
            ),
            h(
              "p",
              { className: "meta ed-pe" },
              "Para mudar disciplinas e assuntos, ou marcar blocos de estudo, use o ",
              h(re, { className: "text-link", href: "/ciclo" }, "Ciclo"),
              ".",
            ),
          ),
      novo
        ? h(
            da,
            { title: novo.d.n, onClose: () => setNovo(null) },
            h("p", { className: "ed-dlg-t" }, novo.a.t),
            h(
              "p",
              { className: "meta" },
              "Este assunto ainda não tem teoria. Ao criar, o app abre um mapa com o nome do assunto; a teoria é escrita a partir das páginas que você enviar nele.",
            ),
            h(
              "div",
              { className: "mm-btns" },
              h(
                "button",
                {
                  type: "button",
                  className: "qd-btn pri",
                  disabled: !__mpStore.loaded,
                  onClick: () => __ciAbrir(novo.d, novo.a, "teoria"),
                },
                "Criar e abrir a teoria",
              ),
              Object.values(__teStore.items).some((d) => d?.caps?.length)
                ? h(
                    "button",
                    {
                      type: "button",
                      className: "qd-btn",
                      disabled: !__mpStore.loaded,
                      onClick: () => {
                        setCopia({ d: novo.d, a: novo.a });
                        setNovo(null);
                      },
                    },
                    "Copiar capítulos de outra teoria",
                  )
                : null,
              h("button", { type: "button", className: "qd-btn", onClick: () => setNovo(null) }, "Cancelar"),
            ),
          )
        : null,
      copia ? h(__TECopia, { para: copia, onClose: () => setCopia(null) }) : null,
    );
  }
