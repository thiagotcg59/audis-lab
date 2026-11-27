  // Página de um assunto do edital (/assunto?a=<id do assunto>): reúne num lugar só o que existe sobre ele.
  // Marca de estudado (guardada no andamento do Ciclo, `est`), teoria, mapa, leitura em voz alta, blocos do Ciclo
  // e os subtemas do Material ligados aos ramos do mapa ou achados pelo Claude ao escrever a teoria.
  // Não guarda nada próprio e não usa IA.
  function __asCartao(titulo, estado, acoes) {
    let h = __rdR.createElement;
    return h("section", { className: "as-c" }, h("span", { className: "small-label" }, titulo), h("p", null, estado), h("div", { className: "mm-btns" }, acoes));
  }
  function __AS() {
    __ciUse();
    __teUse();
    let h = __rdR.createElement,
      { state } = W(),
      aid = Yr().get("a") || "",
      [copia, setCopia] = __rdR.useState(!1),
      ed = __ciEd(),
      an = __ciAn(),
      d = ed.discs.find((x) => x.as.some((a) => a.id === aid)),
      a = d?.as.find((x) => x.id === aid);
    if (!a) {
      // assunto que saiu na atualização do edital: diz onde o conteúdo está hoje e dá o atalho para o que já existe
      let f = (__ciRef.fora || []).find((x) => x.id === aid),
        mf = f ? __ciMapaDe(f.id) : null,
        para = f && f.p ? ed.discs.flatMap((x) => x.as).find((x) => x.id === f.p) : null;
      return h(
        "main",
        { className: "page mp as" },
        h(re, { className: "text-link mp-back", href: "/edital" }, "‹ Edital"),
        h(
          "div",
          { className: "page-intro" },
          h("h1", null, f ? __edNome(f.t) : "Assunto"),
          h("p", null, f ? "Este assunto saiu do edital na atualização. O que você tem nele continua guardado." : "Este assunto não está mais no edital."),
        ),
        f
          ? h(
              "div",
              { className: "mm-btns as-fora" },
              mf && __teStore.items[mf.id]?.caps?.length
                ? h(re, { className: "qd-btn", href: "/teoria?m=" + encodeURIComponent(mf.id) }, "Abrir a teoria")
                : null,
              mf ? h(re, { className: "qd-btn", href: "/mapas?m=" + encodeURIComponent(mf.id) }, "Abrir o mapa") : null,
              para ? h(re, { className: "qd-btn pri", href: "/assunto?a=" + encodeURIComponent(para.id) }, "Hoje está em: ", __edNome(para.t)) : null,
            )
          : null,
      );
    }
    let info = __edInfo(a, an),
      m = info.m,
      doc = m ? __teStore.items[m.id] : null,
      caps = doc?.caps || [],
      ramos = m ? __mpAllRamos(m).map((r) => r.b) : [],
      byId = new Map(ramos.map((b) => [b.id, b])),
      { nodes } = __mpIdx(state),
      subs = [...new Set([...ramos.flatMap((b) => b.subs || []), ...caps.flatMap((c) => c.auto || [])])].filter((k) => nodes.has(k)),
      st = subs.length ? __mpRamoStats(state, { subs }) : null,
      blocos = an.cont[a.id] || 0,
      pronto = __mpStore.loaded,
      nome = __edNome(a.t),
      ouvir = caps.length ? __ovDaTeoria(caps, (c) => (!doc.livre && byId.get(c.rid)?.t) || c.t) : [],
      lk = (rota) => "/" + rota + "?m=" + encodeURIComponent(m.id);
    return h(
      "main",
      { className: "page mp as", style: { "--ci": __ciCor(ed.discs.indexOf(d)) } },
      h(re, { className: "text-link mp-back", href: "/edital" }, "‹ Edital"),
      h(
        "div",
        { className: "page-intro" },
        h("div", { className: "small-label" }, d.n.toUpperCase()),
        h("h1", null, nome),
        a.t.replace(/\s+/g, " ").trim().replace(/\.$/, "") !== nome ? h("p", null, a.t) : null,
      ),
      h(
        "div",
        { className: "as-est" + (info.est ? " on" : "") },
        h(
          "span",
          null,
          info.est
            ? h(__rdR.Fragment, null, h("b", null, "✓ Estudado"), " · marcado em ", __mpBR(info.est))
            : info.st === "n"
              ? "Ainda sem material e sem marca de estudado."
              : "Tem material, mas ainda não está marcado como estudado.",
        ),
        h(
          "button",
          { type: "button", className: "qd-btn" + (info.est ? "" : " pri"), onClick: () => __ciEstudado(a.id, !info.est) },
          info.est ? "Desmarcar" : "Marcar como estudado",
        ),
      ),
      h(
        "div",
        { className: "as-grid" },
        __asCartao(
          "TEORIA",
          caps.length ? `${caps.length} ${caps.length === 1 ? "capítulo escrito" : "capítulos escritos"}` + (info.mudou ? " · o mapa mudou, dá para atualizar" : "") : "Ainda não escrita.",
          [
            m
              ? h(re, { key: "a", className: "qd-btn" + (caps.length ? " pri" : ""), href: lk("teoria") }, "Abrir a teoria")
              : h("button", { key: "a", type: "button", className: "qd-btn", disabled: !pronto, onClick: () => __ciAbrir(d, a, "teoria") }, "Criar e abrir a teoria"),
            caps.length ? h(__OVBtn, { key: "o", tit: m.nome || nome, pars: ouvir, disc: m.disc, className: "qd-btn" }, "Ouvir a teoria") : null,
            Object.values(__teStore.items).some((x) => x?.caps?.length && x.id !== m?.id)
              ? h("button", { key: "c", type: "button", className: "qd-btn", disabled: !pronto, onClick: () => setCopia(!0) }, "Copiar capítulos de outra teoria")
              : null,
          ],
        ),
        __asCartao(
          "MAPA MENTAL",
          m
            ? m.pags.length
              ? `${m.pags.length} ${m.pags.length === 1 ? "página" : "páginas"} · ${ramos.length} ${ramos.length === 1 ? "ramo" : "ramos"}`
              : "Mapa criado, ainda sem páginas."
            : "Ainda não criado.",
          m
            ? h(re, { className: "qd-btn", href: lk("mapas") }, "Abrir o mapa")
            : h("button", { type: "button", className: "qd-btn", disabled: !pronto, onClick: () => __ciAbrir(d, a, "mapas") }, "Criar o mapa do assunto"),
        ),
        __asCartao(
          "CICLO",
          blocos ? `${blocos} ${blocos === 1 ? "bloco de 25 min feito" : "blocos de 25 min feitos"} neste assunto.` : "Nenhum bloco feito neste assunto ainda.",
          h(re, { className: "qd-btn", href: "/ciclo" }, "Abrir o Ciclo"),
        ),
        h(
          "section",
          { className: "as-c" },
          h("span", { className: "small-label" }, "MATERIAL E QUESTÕES"),
          st
            ? h(
                __rdR.Fragment,
                null,
                h(
                  "p",
                  null,
                  st.qs.length === 1 ? "1 questão" : `${st.qs.length} questões`,
                  st.qs.length ? ` · ${st.erros} ${st.erros === 1 ? "erro" : "erros"}` : "",
                  " · ",
                  st.grifos.length === 1 ? "1 trecho marcado" : `${st.grifos.length} trechos marcados`,
                ),
                h(
                  "ul",
                  { className: "as-subs" },
                  subs.map((k) =>
                    h(
                      "li",
                      { key: k },
                      h(re, { className: "text-link", href: "/material?subtema=" + __sbEnc(k), title: nodes.get(k).path.join(" › ") }, nodes.get(k).label),
                    ),
                  ),
                ),
              )
            : h("p", null, "Nenhum subtema do Material ligado a este assunto ainda. A ligação aparece quando a teoria é escrita ou quando você liga um ramo do mapa a um subtema."),
          h("div", { className: "mm-btns" }, h(re, { className: "qd-btn", href: "/material" }, "Abrir o Material")),
        ),
        h("section", { className: "as-c" }, h("span", { className: "small-label" }, "ÁUDIO"), h(__OVTempo, { disc: m?.disc || d.n.slice(0, 60) })),
      ),
      copia ? h(__TECopia, { para: { d, a }, onClose: () => setCopia(!1) }) : null,
      h(__OVPlayer, null),
    );
  }
