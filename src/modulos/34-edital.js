  // Edital (/edital): gestão visual do edital. Um painel por disciplina e, dentro dele, um quadro por assunto.
  // O quadro mostra em que ponto o assunto está (cor forte: marcado como estudado; cor clara: tem teoria ou mapa;
  // tracejado: nada ainda) e quantos blocos do Ciclo ele já recebeu. Tocar no quadro abre a página do assunto
  // (módulo 36), que reúne teoria, mapa, áudio, Ciclo e Material.
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
  // st: "t" teoria escrita, "m" só o mapa, "n" nada ainda.  est: dia em que o aluno marcou o assunto como estudado.
  // cor do quadro: forte quando está marcado como estudado; clara quando só tem material (teoria ou mapa).
  function __edInfo(a, an) {
    let m = __ciMapaDe(a.id),
      doc = m ? __teStore.items[m.id] : null,
      caps = doc && Array.isArray(doc.caps) ? doc.caps.length : 0;
    return {
      m,
      caps,
      st: caps ? "t" : m ? "m" : "n",
      est: (an || __ciAn()).est[a.id] || "",
      mudou: !!(caps && !doc.livre && __teFalta(m, doc).length),
    };
  }
  // Assuntos que saíram do edital (`fora` no módulo 32) e em que o aluno tem alguma coisa: marca de estudado,
  // blocos do Ciclo, mapa com páginas ou teoria escrita. Nada disso é apagado; a tela só avisa e dá o atalho.
  // `para` é o assunto atual que cobre o mesmo conteúdo, quando existe.
  function __edFora(ed, an) {
    let tem = new Map();
    for (let d of ed.discs) for (let a of d.as) tem.set(a.id, a);
    return (__ciRef.fora || [])
      .filter((f) => !tem.has(f.id))
      .map((f) => {
        let m = __ciMapaDe(f.id),
          doc = m ? __teStore.items[m.id] : null;
        return {
          f,
          m,
          pags: m ? m.pags.length : 0,
          caps: doc && Array.isArray(doc.caps) ? doc.caps.length : 0,
          est: an.est[f.id] || "",
          blocos: an.cont[f.id] || 0,
          para: f.p ? tem.get(f.p) || null : null,
        };
      })
      .filter((x) => x.pags || x.caps || x.est || x.blocos);
  }
  function __EDFora({ L }) {
    let h = __rdR.createElement,
      lk = (rota, m) => "/" + rota + "?m=" + encodeURIComponent(m.id);
    return h(
      "details",
      { className: "ed-fora", open: !0 },
      h(
        "summary",
        null,
        h("b", null, L.length === 1 ? "1 assunto que você estudou saiu do edital" : `${L.length} assuntos que você estudou saíram do edital`),
      ),
      h("p", { className: "meta" }, "O edital foi atualizado. O que você tem nestes assuntos continua guardado, mas eles não contam mais no edital."),
      h(
        "ul",
        null,
        L.map((x) => {
          let tem = [
            x.est ? "marcado como estudado" : "",
            x.caps ? `teoria com ${x.caps} ${x.caps === 1 ? "capítulo" : "capítulos"}` : "",
            x.pags ? `mapa com ${x.pags} ${x.pags === 1 ? "página" : "páginas"}` : "",
            x.blocos ? (x.blocos === 1 ? "1 bloco no Ciclo" : `${x.blocos} blocos no Ciclo`) : "",
          ].filter(Boolean);
          return h(
            "li",
            { key: x.f.id },
            h("b", null, __edNome(x.f.t)),
            h("span", { className: "meta" }, x.f.n, " · ", tem.join(" · ")),
            h(
              "span",
              { className: "ed-fora-l" },
              x.caps ? h(re, { className: "text-link", href: lk("teoria", x.m) }, "Abrir a teoria") : null,
              x.pags ? h(re, { className: "text-link", href: lk("mapas", x.m) }, "Abrir o mapa") : null,
              x.para
                ? h(re, { className: "text-link", href: "/assunto?a=" + encodeURIComponent(x.para.id) }, "Hoje está em: ", __edNome(x.para.t))
                : null,
            ),
          );
        }),
      ),
    );
  }
  function __EDQuadro({ a, info, blocos }) {
    let h = __rdR.createElement,
      nome = __edNome(a.t),
      estado =
        info.st === "t"
          ? `${info.caps} ${info.caps === 1 ? "capítulo" : "capítulos"}` + (info.mudou ? " · atualizar" : "")
          : info.st === "m"
            ? "mapa criado, sem teoria"
            : "sem material";
    return h(
      re,
      { className: "ed-q " + (info.est ? "t" : info.st === "n" ? "n" : "m"), href: "/assunto?a=" + encodeURIComponent(a.id), title: a.t },
      h("span", { className: "ed-q-t" }, nome),
      h(
        "span",
        { className: "ed-q-f" },
        h("span", null, info.est ? "✓ estudado · " : "", estado),
        blocos ? h("span", { className: "ed-q-b" }, blocos === 1 ? "1 bloco" : `${blocos} blocos`) : null,
      ),
    );
  }
  function __ED() {
    __ciUse();
    __mpUse();
    __teUse();
    let h = __rdR.createElement,
      ed = __ciEd(),
      an = __ciAn(),
      [filtro, setFiltro] = __rdR.useState("todos"),
      discs = ed.discs.map((d, i) => {
        let itens = d.as.map((a) => ({ a, info: __edInfo(a, an), blocos: an.cont[a.id] || 0 }));
        return { d, i, itens, comT: itens.filter((x) => x.info.st === "t").length, est: itens.filter((x) => x.info.est).length };
      }),
      todos = discs.flatMap((x) => x.itens),
      fora = __edFora(ed, an),
      nT = todos.filter((x) => x.info.st === "t").length,
      nM = todos.filter((x) => x.info.st === "m").length,
      nE = todos.filter((x) => x.info.est).length,
      passa = (x) => (filtro === "est" ? !!x.info.est : filtro === "com" ? x.info.st === "t" : filtro === "sem" ? x.info.st !== "t" : !0),
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
          ". Cada quadro é um assunto. Toque em um quadro para abrir a página dele, com a teoria, o mapa e o resto.",
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
              num(nE, nE === 1 ? "marcado como estudado" : "marcados como estudados"),
              num(nT, "com teoria escrita"),
              num(nM, "com mapa, sem teoria"),
            ),
            fora.length ? h(__EDFora, { L: fora }) : null,
            h(
              "div",
              { className: "ed-barra" },
              h(
                "div",
                { className: "ed-filtro", role: "group", "aria-label": "Quais assuntos mostrar" },
                chip("todos", "Todos"),
                chip("est", "Estudados"),
                chip("com", "Com teoria"),
                chip("sem", "Sem teoria"),
              ),
              h(
                "div",
                { className: "ed-leg" },
                h("span", null, h("i", { className: "t" }), "estudado"),
                h("span", null, h("i", { className: "m" }), "tem material"),
                h("span", null, h("i", { className: "n" }), "sem material"),
              ),
            ),
            !vis.length ? h("p", { className: "meta ed-vazio" }, "Nenhum assunto neste filtro.") : null,
            vis.length > 1
              ? h(
                  "nav",
                  { className: "ed-indice", "aria-label": "Disciplinas do edital" },
                  h("span", { className: "small-label" }, "DISCIPLINAS"),
                  h(
                    "div",
                    null,
                    vis.map(({ d, i, itens, est }) =>
                      h(
                        "button",
                        {
                          key: d.id,
                          type: "button",
                          style: { "--ci": __ciCor(i) },
                          onClick: () => document.getElementById("ed-d-" + d.id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
                        },
                        h("i", null),
                        h("span", null, d.n),
                        itens.length ? h("small", { title: "assuntos marcados como estudados" }, est, "/", itens.length) : null,
                      ),
                    ),
                  ),
                )
              : null,
            vis.map(({ d, i, itens, comT, est, L }) =>
              h(
                "section",
                { key: d.id, id: "ed-d-" + d.id, className: "ed-disc", style: { "--ci": __ciCor(i) } },
                h(
                  "header",
                  null,
                  h("h2", null, d.n),
                  h(
                    "span",
                    { className: "meta" },
                    d.q ? `${d.q} questões` + (d.peso ? ` · peso ${d.peso}` : "") + " · " : "",
                    itens.length ? `${est} de ${itens.length} estudados · ${comT} com teoria` : "sem assuntos",
                  ),
                ),
                itens.length
                  ? h("span", { className: "mp-bar" }, h("i", { style: { width: (est / itens.length) * 100 + "%" } }))
                  : null,
                h(
                  "div",
                  { className: "ed-grid" },
                  L.map((x) =>
                    h(__EDQuadro, { key: x.a.id, a: x.a, info: x.info, blocos: x.blocos }),
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
    );
  }
