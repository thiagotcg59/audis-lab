var __utCats = [
    ["understood", "Entendido", "u"],
    ["partial", "Parcialmente", "p"],
    ["not_understood", "Não entendido", "n"],
    ["none", "Sem marcação", "0"],
  ];
  function __utPct(counts, total) {
    return counts.map((c) => (total ? Math.round((c * 100) / total) : 0));
  }
  function __utKey(x) {
    return x.understanding === "understood" ||
      x.understanding === "partial" ||
      x.understanding === "not_understood"
      ? x.understanding
      : "none";
  }
  function __UTB({ highlights: hs, level: lv, onLevel: set, scope: sc }) {
    let h = __rdR.createElement;
    if (!hs || !hs.length) return null;
    let counts = __utCats.map(([c]) => hs.filter((x) => __utKey(x) === c).length),
      total = hs.length,
      pct = __utPct(counts, total);
    let refKeys = (x) =>
      (x.references ?? []).filter((r) => !String(r.key).startsWith("demo:")).map((r) => r.key);
    let all = new Set(hs.flatMap(refKeys)),
      pend = hs.filter((x) => x.understanding === "not_understood" || x.understanding === "partial"),
      pendQ = new Set(pend.flatMap(refKeys));
    let nU = counts[2],
      nP = counts[1],
      where = sc === "subtema" ? "neste subtema" : "neste trecho";
    let who =
      nU && nP
        ? `Os ${nU + nP} grifos ainda não entendidos (${nU} não ${nU === 1 ? "entendido" : "entendidos"} e ${nP} ${nP === 1 ? "parcial" : "parciais"})`
        : nU
          ? nU === 1
            ? "O grifo não entendido"
            : `Os ${nU} grifos não entendidos`
          : nP === 1
            ? "O grifo parcialmente entendido"
            : `Os ${nP} grifos parcialmente entendidos`;
    let insight =
      pend.length && all.size
        ? [
            who,
            nU + nP === 1 ? " concentra " : " concentram ",
            h("b", { key: "b" }, Math.round((pendQ.size / all.size) * 100), "% das questões"),
            " que caíram ",
            where,
            " (",
            pendQ.size,
            " de ",
            all.size,
            "). Comece por ",
            pend.length === 1 ? "ele" : "eles",
            ".",
          ]
        : null;
    return h(
      "section",
      {
        className: "und-summary" + (sc === "subtema" ? " compact" : ""),
        "aria-label": "Seu entendimento dos grifos",
      },
      h(
        "div",
        { className: "und-head" },
        h("span", { className: "small-label" }, "SEU ENTENDIMENTO DOS GRIFOS"),
        h("span", { className: "meta" }, `${total} ${total === 1 ? "grifo" : "grifos"} ${where}`),
      ),
      h(
        "div",
        {
          className: "und-bar",
          role: "img",
          "aria-label": __utCats.map(([, l], i) => `${l} ${pct[i]}%`).join(", "),
        },
        __utCats.map(([c, l, s], i) =>
          counts[i]
            ? h("span", {
                key: c,
                className: "lv-" + s,
                style: { flexGrow: counts[i] },
                title: `${l}: ${counts[i]} ${counts[i] === 1 ? "grifo" : "grifos"} (${pct[i]}%)`,
              })
            : null,
        ),
      ),
      h(
        "div",
        { className: "und-legend", role: "group", "aria-label": "Destacar grifos por entendimento" },
        __utCats.map(([c, l, s], i) =>
          h(
            "button",
            {
              key: c,
              type: "button",
              className: "und-chip" + (lv === c ? " active act-" + s : ""),
              "aria-pressed": lv === c,
              disabled: !counts[i],
              title: lv === c ? "Mostrar todos os grifos" : `Destacar só os grifos: ${l}`,
              onClick: () => set(lv === c ? "todos" : c),
            },
            h("i", { className: "lv-" + s }),
            l,
            " ",
            h("b", null, pct[i], "%"),
            h("span", null, counts[i]),
          ),
        ),
      ),
      insight ? h("p", { className: "und-insight" }, insight) : null,
    );
  }
  