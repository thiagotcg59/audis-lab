var __plStore = {
    weeks: {},
    config: null,
    ready: !1,
    loaded: !1,
    listeners: new Set(),
    saveT: {},
    chain: {},
    v: 0,
    err: "",
    undo: {},
  };
  var __plLSK = "audis:plano";
  var __plTy = {
    q: "Questões",
    e: "Revisão de erros",
    f: "Flashcards",
    m: "Material",
    c: "Fechamento",
    o: "Bloco livre",
  };
  var __plRate = { q: 3, e: 2, f: 1, m: 25, c: 20, o: 30 };
  var __plWd = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  var __plWdL = ["segunda", "terça", "quarta", "quinta", "sexta", "sábado", "domingo"];
  var __plMinOpts = [0, 15, 30, 45, 60, 75, 90, 105, 120, 150, 180, 210, 240, 300, 360, 420, 480];
  function __plEmit() {
    __plStore.v++;
    __plStore.listeners.forEach((f) => {
      try {
        f();
      } catch {}
    });
  }
  function __plLS() {
    try {
      localStorage.setItem(__plLSK, JSON.stringify({ weeks: __plStore.weeks, config: __plStore.config }));
    } catch {}
  }
  function __plNow() {
    return new Date().toISOString();
  }
  function __plId() {
    return "b" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function __plAddD(day, n) {
    let d = new Date(day + "T12:00:00");
    d.setDate(d.getDate() + n);
    return ot(d);
  }
  function __plDays(wk) {
    return [0, 1, 2, 3, 4, 5, 6].map((i) => __plAddD(wk, i));
  }
  function __plDM(day) {
    return day.slice(8, 10) + "/" + day.slice(5, 7);
  }
  function __plFmt(m) {
    m = Math.max(0, Math.round(m || 0));
    let h = Math.floor(m / 60),
      r = m % 60;
    return h ? (r ? `${h} h ${r}` : `${h} h`) : `${r} min`;
  }
  function __plInit() {
    if (__plStore.ready) return;
    __plStore.ready = !0;
    try {
      let v = JSON.parse(localStorage.getItem(__plLSK) || "null");
      v &&
        typeof v == "object" &&
        ((__plStore.weeks = v.weeks && typeof v.weeks == "object" ? v.weeks : {}),
        (__plStore.config = v.config || null));
    } catch {}
    (async () => {
      let db = await ka("db");
      if (!db) return;
      try {
        db.collection("plano")
          .limit(300)
          .onSnapshot(
            (snap) => {
              let ch = !1;
              for (let d of snap.docs) {
                if (!d.exists) continue;
                let x = d.data();
                if (!x || typeof x != "object") continue;
                if (d.id === "config") {
                  (!__plStore.config ||
                    String(x.updatedAt || "") >= String(__plStore.config.updatedAt || "")) &&
                    ((__plStore.config = x), (ch = !0));
                  continue;
                }
                if (!d.id.startsWith("w-")) continue;
                let wk = d.id.slice(2),
                  cur = __plStore.weeks[wk];
                (!cur || String(x.updatedAt || "") >= String(cur.updatedAt || "")) &&
                  ((__plStore.weeks[wk] = x), (ch = !0));
              }
              __plStore.loaded = !0;
              __plLS();
              __plEmit();
            },
            () => {
              __plStore.loaded = !0;
              __plEmit();
            },
          );
      } catch {
        __plStore.loaded = !0;
        __plEmit();
      }
    })();
  }
  function __plWrite(key, data) {
    let p = (__plStore.chain[key] || Promise.resolve()).then(async () => {
      try {
        let db = await ka("db");
        if (!db) return;
        await db.doc("plano/" + key).set(data());
        __plStore.err = "";
      } catch {
        __plStore.err =
          "Não foi possível salvar o plano agora. Ele ficou guardado neste aparelho e é salvo de novo na próxima mudança.";
        __plEmit();
      }
    });
    __plStore.chain[key] = p.catch(() => {});
  }
  function __plSet(wk, doc) {
    doc = { ...doc, week: wk, updatedAt: __plNow() };
    __plStore.weeks[wk] = doc;
    __plLS();
    __plEmit();
    clearTimeout(__plStore.saveT[wk]);
    __plStore.saveT[wk] = setTimeout(() => __plWrite("w-" + wk, () => __plStore.weeks[wk]), 600);
  }
  function __plSetCfg(mins) {
    __plStore.config = { mins: mins.slice(0, 7), updatedAt: __plNow() };
    __plLS();
    __plEmit();
    clearTimeout(__plStore.saveT.cfg);
    __plStore.saveT.cfg = setTimeout(() => __plWrite("config", () => __plStore.config), 800);
  }
  function __plUse() {
    let [, f] = __rdR.useReducer((x) => x + 1, 0);
    __rdR.useEffect(() => {
      __plInit();
      __plStore.listeners.add(f);
      return () => {
        __plStore.listeners.delete(f);
      };
    }, []);
  }

  /* ---------- dados do Audis ---------- */
  function __plMissions(e) {
    try {
      return (typeof mo == "function" ? mo(e) : e.dailyMissions || []).filter((m) => m && m.subject);
    } catch {
      return e.dailyMissions || [];
    }
  }
  function __plSubjects(e) {
    let act = __plMissions(e)
        .filter((m) => m.active)
        .map((m) => m.subject),
      set = new Map();
    for (let s of act) set.set(Z(s), s);
    if (!set.size) {
      let c = {};
      for (let q of e.questions)
        q.source === "tec-manual" && q.subject && (c[q.subject] = (c[q.subject] || 0) + 1);
      Object.entries(c)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([s]) => set.set(Z(s), s));
    }
    return [...set.values()];
  }
  function __plAllSubjects(e) {
    let m = new Map();
    for (let s of __plSubjects(e)) m.set(Z(s), s);
    for (let s of e.material)
      !s.deletedAt && s.subject && !m.has(Z(s.subject)) && m.set(Z(s.subject), s.subject);
    for (let q of e.questions) q.subject && !m.has(Z(q.subject)) && m.set(Z(q.subject), q.subject);
    return [...m.values()].sort((a, b) => a.localeCompare(b, "pt-BR"));
  }
  function __plStudy(e, today) {
    let byDay = {},
      last = {},
      tot = {},
      ok = {};
    for (let q of e.questions) {
      if (q.source !== "tec-manual") continue;
      let d = ot(q.date);
      if (!d) continue;
      byDay[d] = (byDay[d] || 0) + 1;
      let k = Z(q.subject || "");
      (!last[k] || d > last[k]) && (last[k] = d);
      tot[k] = (tot[k] || 0) + 1;
      q.answeredCorrectly === !0 && (ok[k] = (ok[k] || 0) + 1);
    }
    let wkStart = __rxWeek(today),
      from = __plAddD(wkStart, -28),
      wdays = [0, 0, 0, 0, 0, 0, 0],
      days = 0,
      n4 = 0,
      sub4 = {};
    for (let i = 0; i < 28; i++) {
      let d = __plAddD(from, i);
      byDay[d] && (wdays[i % 7]++, days++, (n4 += byDay[d]));
    }
    for (let q of e.questions) {
      if (q.source !== "tec-manual") continue;
      let d = ot(q.date);
      d &&
        d >= from &&
        d < wkStart &&
        (sub4[q.subject || "Sem matéria"] = (sub4[q.subject || "Sem matéria"] || 0) + 1);
    }
    return { byDay, last, tot, ok, wdays, days, n4, sub4, from, wkStart };
  }
  function __plErrPend(e) {
    let E = e.errors.filter((x) => x.questionSnapshot?.source === "tec-manual"),
      never = E.filter((x) => !(x.reviews || []).length),
      by = {};
    for (let x of never) {
      let t = __rxInfo(x).t || "none";
      by[t] = (by[t] || 0) + 1;
    }
    return { total: E.length, never: never.length, by };
  }
  function __plFc(e, wk) {
    let S = {};
    try {
      __fcInit();
      S = __fcStore.srs || {};
    } catch {}
    let cards = [];
    try {
      cards = __fcCards(e);
    } catch {}
    let seen = 0,
      over = 0,
      due = {};
    for (let c of cards) {
      let x = S[c.id];
      if (!x) {
        continue;
      }
      seen++;
      x.d < wk ? over++ : (due[x.d] = (due[x.d] || 0) + 1);
    }
    return { cards: cards.length, unseen: Math.max(0, cards.length - seen), over, due };
  }
  function __plGrifos(e) {
    let notU = [],
      bySub = {};
    for (let s of e.material) {
      if (s.deletedAt) continue;
      let n = 0,
        none = 0,
        inc = 0;
      for (let h of s.highlights || []) {
        h.understanding === "not_understood" && n++;
        (!h.understanding || h.understanding === "none") && none++;
        inc += h.count || 0;
      }
      n && notU.push({ s, n });
      let k = Z(s.subject || "");
      (bySub[k] = bySub[k] || []).push({ s, none, inc });
    }
    notU.sort((a, b) => b.n - a.n);
    for (let k of Object.keys(bySub)) bySub[k].sort((a, b) => b.none - a.none || b.inc - a.inc);
    return { notU, bySub, notUTot: notU.reduce((a, x) => a + x.n, 0) };
  }
  function __plDefMins(e) {
    let st = __plStudy(e, ot(new Date()));
    return st.wdays.map((n) => (n >= 3 ? 120 : n === 2 ? 90 : n === 1 ? 60 : 30));
  }

  /* ---------- montar a semana ---------- */
  function __plGen(e, wk, mins, keep) {
    let today = ot(new Date()),
      days = __plDays(wk),
      subs = __plSubjects(e),
      st = __plStudy(e, today),
      ep = __plErrPend(e),
      fc = __plFc(e, wk),
      gr = __plGrifos(e);
    let blocks = (keep || []).map((b) => ({ ...b })),
      order = {};
    for (let b of blocks) order[b.day] = Math.max(order[b.day] || 0, (b.o || 0) + 1);
    let lastQ = {};
    for (let s of subs) lastQ[Z(s)] = st.last[Z(s)] || "2000-01-01";
    let acc = (s) => {
      let k = Z(s);
      return st.tot[k] ? (st.ok[k] || 0) / st.tot[k] : 0.6;
    };
    let since = (s, day) =>
      Math.round((Date.parse(day + "T12:00:00") - Date.parse(lastQ[Z(s)] + "T12:00:00")) / 864e5);
    let errLeft = { ...ep.by };
    delete errLeft.none;
    let types = Object.keys(errLeft).sort((a, b) => errLeft[b] - errLeft[a]);
    let ti = 0;
    let notU = gr.notU.map((x) => ({ ...x })),
      readUsed = new Set(),
      firstDay = days.find((d) => d >= today && (mins[days.indexOf(d)] || 0) > 0);
    let planDays = days.filter((d, i) => d >= today && (mins[i] || 0) > 0),
      lastDay = planDays[planDays.length - 1];
    let used = {};
    for (let b of blocks) used[b.day] = (used[b.day] || 0) + (b.min || 0);
    let push = (day, b) => {
      blocks.push({ id: __plId(), day, o: (order[day] = (order[day] || 0) + 1), ok: !1, ...b });
      used[day] = (used[day] || 0) + b.min;
    };
    let top = types.slice(0, 3),
      mCount = 0,
      lastM = null;
    let errBlock = (day, max) => {
      if (max < 5) return !1;
      let lo = Math.min(5, max),
        pool = top.filter((t) => errLeft[t] >= lo);
      pool.length || (pool = types.filter((t) => errLeft[t] >= lo));
      if (!pool.length) return !1;
      let onDay = new Set(blocks.filter((b) => b.day === day && b.t === "e").map((b) => b.rx)),
        fresh = pool.filter((x) => !onDay.has(x));
      fresh.length && (pool = fresh);
      let t = pool[ti % pool.length];
      ti++;
      let n = Math.min(max, errLeft[t]);
      errLeft[t] -= n;
      let same = blocks.filter((b) => b.day === day && b.t === "e" && b.rx === t).pop();
      same
        ? ((same.n += n), (same.min += n * 2), (used[day] = (used[day] || 0) + n * 2))
        : push(day, { t: "e", rx: t, n, min: n * 2 });
      return !0;
    };
    for (let i = 0; i < 7; i++) {
      let day = days[i],
        B = mins[i] || 0;
      if (day < today || B <= 0) continue;
      let free = () => B - (used[day] || 0);
      let dueToday = fc.due[day] || 0,
        overN = day === firstDay ? fc.over : 0,
        dueN = dueToday + overN;
      let fNote = dueN
        ? [
            dueToday ? `${dueToday} ${dueToday === 1 ? "vence" : "vencem"} hoje` : "",
            overN ? `${overN} ${overN === 1 ? "atrasado" : "atrasados"}` : "",
          ]
            .filter(Boolean)
            .join(", ")
        : "novos";
      if (B <= 30) {
        let fn = Math.min(
          free() >= 25 ? 15 : Math.max(5, free() - (types.length ? 10 : 0)),
          Math.max(dueN, fc.unseen ? 15 : dueN),
        );
        fn > 0 && push(day, { t: "f", n: fn, min: fn, fnote: fNote });
        free() >= 10 && errBlock(day, Math.min(5, Math.floor(free() / 2)));
        continue;
      }
      let reserve = day === lastDay && B >= 60 ? 15 : 0,
        nq = Math.max(1, Math.floor(((B - reserve) * 0.5) / 30)),
        todayS = new Set();
      let pickS = () => {
        let cand = subs.filter((s) => !todayS.has(Z(s)));
        if (!cand.length) cand = subs.slice();
        cand.sort((a, b) => since(b, day) * 2 + (1 - acc(b)) * 6 - (since(a, day) * 2 + (1 - acc(a)) * 6));
        return cand[0];
      };
      let addQ = () => {
        let s = pickS();
        if (!s) return !1;
        todayS.add(Z(s));
        let stale = since(s, day);
        push(day, {
          t: "q",
          subj: s,
          n: 10,
          min: 30,
          warn: stale >= 14 && lastQ[Z(s)] > "2000" ? `parada há ${stale} dias` : "",
        });
        lastQ[Z(s)] = day;
        return !0;
      };
      for (let k = 0; k < nq && free() - reserve >= 30; k++) if (!addQ()) break;
      free() - reserve >= 20 && errBlock(day, 10);
      if (free() - reserve >= 10) {
        let fn = Math.min(20, Math.max(dueN, 10), free() - reserve);
        push(day, { t: "f", n: fn, min: fn, fnote: fNote });
      }
      if (mCount < 3 && B >= 90 && free() - reserve >= 20 && lastM !== days[i - 1]) {
        let x = notU.find((y) => y.n > 0),
          ok = !1;
        if (x) {
          let n = Math.min(3, x.n);
          x.n -= n;
          push(day, {
            t: "m",
            sec: x.s.id,
            subj: x.s.subject,
            und: !0,
            n,
            min: 20,
            label: `${n} ${n === 1 ? "grifo" : "grifos"} “não entendi”`,
          });
          ok = !0;
        } else {
          let cand = subs.slice().sort((a, b) => since(b, day) - since(a, day));
          for (let s of cand) {
            let L = (gr.bySub[Z(s)] || []).find((y) => !readUsed.has(y.s.id));
            if (L) {
              readUsed.add(L.s.id);
              push(day, { t: "m", sec: L.s.id, subj: s, n: 1, min: 25, label: "1 tópico" });
              ok = !0;
              break;
            }
          }
        }
        ok && (mCount++, (lastM = day));
      }
      while (free() - reserve >= 30 && addQ());
      if (free() - reserve >= 10) errBlock(day, Math.min(10, Math.floor((free() - reserve) / 2)));
      if (free() - reserve >= 5) {
        let fb = blocks.filter((b) => b.day === day && b.t === "f").pop(),
          x = free() - reserve;
        fb && ((fb.n += x), (fb.min += x), (used[day] = (used[day] || 0) + x));
      }
      reserve && push(day, { t: "c", n: 1, min: reserve });
    }
    return { blocks, reasons: __plReasons(e, wk, blocks, st, ep, fc, gr, mins) };
  }
  function __plReasons(e, wk, blocks, st, ep, fc, gr, mins) {
    let R = [],
      today = ot(new Date()),
      subs = __plSubjects(e),
      fmt = (d) => d.slice(8, 10) + "/" + d.slice(5, 7);
    let stale = subs
      .map((s) => ({ s, d: st.last[Z(s)] }))
      .filter((x) => !x.d || Date.parse(today) - Date.parse(x.d) >= 14 * 864e5)
      .sort((a, b) => String(a.d || "").localeCompare(String(b.d || "")));
    if (stale.length) {
      let first = (s) => {
        let b = blocks
          .filter((y) => y.t === "q" && Z(y.subj) === Z(s))
          .sort((a, c) => a.day.localeCompare(c.day))[0];
        return b ? __plWdL[__plDays(wk).indexOf(b.day)] : null;
      };
      R.push(
        `<b>${stale.map((x) => (x.d ? `${x.s} não recebe questão desde ${fmt(x.d)}` : `${x.s} ainda não tem questões coladas`)).join("; ")}.</b> ${stale.length === 1 ? "Ela entra" : "Elas entram"} cedo na semana${((F) => (F.length ? ` (${F.length === 1 && stale.length > 1 ? "as duas na " + F[0] : F.join(" e ")})` : ""))([...new Set(stale.map((x) => first(x.s)).filter(Boolean))])}.`,
      );
    }
    let eN = blocks.filter((b) => b.t === "e").reduce((a, b) => a + (b.n || 0), 0),
      topT = Object.entries(ep.by)
        .filter(([k]) => k !== "none")
        .sort((a, b) => b[1] - a[1])[0];
    ep.never &&
      R.push(
        `<b>${ep.never} dos ${ep.total} erros do caderno nunca foram revisados</b>${topT ? `; ${topT[1]} são de ${String(__rxLbl[topT[0]] || topT[0]).toLowerCase()}` : ""}. A semana tem ${eN} ${eN === 1 ? "revisão" : "revisões"}${topT ? ", começando por esse tipo" : ""}.`,
      );
    let dueW = Object.entries(fc.due)
      .filter(([d]) => d >= wk && d <= __plAddD(wk, 6))
      .reduce((a, [, n]) => a + n, 0);
    fc.cards &&
      R.push(
        `<b>${fc.over ? `${fc.over} flashcards estão atrasados e ` : ""}${dueW} ${dueW === 1 ? "vence" : "vencem"} nesta semana.</b> ${fc.unseen ? `O resto do tempo de cards vai para os ${fc.unseen} que você ainda não viu.` : ""}`,
      );
    let wd = st.wdays.map((n, i) => ({ n, i })),
      weak = wd.filter((x) => x.n === 0).map((x) => __plWdL[x.i]),
      strong = wd.filter((x) => x.n >= 3).map((x) => __plWdL[x.i]),
      minD = mins
        .map((m, i) => ({ m, i }))
        .filter((x) => x.m > 0 && x.m <= 30)
        .map((x) => __plWdL[x.i]);
    R.push(
      `<b>Nas últimas 4 semanas você estudou em ${st.days} dos 28 dias</b>${strong.length ? `, mais na ${strong.join(" e na ")}` : ""}${weak.length ? `; na ${weak.join(" e na ")}, nenhuma vez` : ""}.${minD.length ? ` ${minD.map((x) => x[0].toUpperCase() + x.slice(1)).join(" e ")} ${minD.length === 1 ? "ficou como dia mínimo" : "ficaram como dias mínimos"}, só para não zerar.` : ""}`,
    );
    let mU = blocks.filter((b) => b.t === "m" && b.und);
    gr.notUTot &&
      R.push(
        `<b>${gr.notUTot} ${gr.notUTot === 1 ? "grifo está" : "grifos estão"} como “não entendi”.</b> ${mU.length ? `${mU.reduce((a, b) => a + b.n, 0)} entram na semana, começando por “${String((mU[0] && e.material.find((s) => s.id === mU[0].sec)?.title) || "").slice(0, 70)}”.` : ""}`,
      );
    let tgt = __plMissions(e)
        .filter((m) => m.active)
        .reduce((a, m) => a + (m.target || 0), 0),
      qN = blocks.filter((b) => b.t === "q").reduce((a, b) => a + (b.n || 0), 0);
    tgt &&
      R.push(
        `<b>As missões pedem ${tgt * 7} questões por semana; nas últimas 4 semanas você colou ${Math.round(st.n4 / 4)} por semana.</b> O plano tem ${qN}, dentro do tempo que você marcou.`,
      );
    return R;
  }

  /* ---------- progresso automático ---------- */
  function __plProg(e, days) {
    let ds = new Set(days),
      q = {},
      er = {},
      f = {};
    for (let x of e.questions) {
      if (x.source !== "tec-manual") continue;
      let d = ot(x.date);
      if (!ds.has(d)) continue;
      let k = d + "|" + Z(x.subject || "");
      q[k] = (q[k] || 0) + 1;
    }
    let mid = new Map(__plMissions(e).map((m) => [m.id, m.subject]));
    for (let l of e.missionLog || []) {
      if (!ds.has(l.date)) continue;
      let s = mid.get(l.missionId);
      if (!s) continue;
      let k = l.date + "|" + Z(s);
      q[k] = Math.max(0, (q[k] || 0) + (l.manual || 0));
    }
    for (let x of e.errors) {
      if (x.questionSnapshot?.source !== "tec-manual") continue;
      let t = __rxInfo(x).t || "none";
      for (let r of x.reviews || []) {
        let d = ot(r.date);
        if (!ds.has(d)) continue;
        er[d + "|" + t] = (er[d + "|" + t] || 0) + 1;
        er[d + "|todos"] = (er[d + "|todos"] || 0) + 1;
      }
    }
    try {
      __fcInit();
      for (let v of Object.values(__fcStore.srs || {})) {
        let d = v && v.t ? ot(v.t) : "";
        ds.has(d) && (f[d] = (f[d] || 0) + 1);
      }
    } catch {}
    return { q, er, f };
  }
  function __plProgMap(doc, P) {
    let use = {},
      m = {};
    let bl = (doc.blocks || []).slice().sort((a, b) => a.day.localeCompare(b.day) || (a.o || 0) - (b.o || 0));
    for (let b of bl) {
      let k = null,
        pool = null;
      b.t === "q" && b.subj
        ? ((k = b.day + "|" + Z(b.subj)), (pool = P.q))
        : b.t === "e"
          ? ((k = b.day + "|" + (b.rx || "todos")), (pool = P.er))
          : b.t === "f" && ((k = b.day), (pool = P.f));
      if (!pool) {
        m[b.id] = { auto: !1, p: 0, done: !!b.ok };
        continue;
      }
      let av = Math.max(0, (pool[k] || 0) - (use[k] || 0)),
        p = Math.min(b.n || 0, av);
      use[k] = (use[k] || 0) + p;
      m[b.id] = { auto: !0, p, done: b.undone ? !1 : !!b.ok || (b.n > 0 && p >= b.n) };
    }
    return m;
  }
  function __plHref(b) {
    return b.t === "q"
      ? "/adicionar"
      : b.t === "e"
        ? `/erros?aba=raiox&treinar=${encodeURIComponent(b.rx || "todos")}&n=${Math.max(1, Math.min(50, b.n || 10))}`
        : b.t === "f"
          ? "/flashcards"
          : b.t === "m"
            ? b.sec
              ? "/material?topico=" + encodeURIComponent(b.sec)
              : b.und
                ? "/material?trilha=1"
                : "/material"
            : null;
  }
  function __plTitle(b) {
    return b.t === "q"
      ? `${b.n} ${b.n === 1 ? "questão" : "questões"}`
      : b.t === "e"
        ? `${b.n} ${b.n === 1 ? "erro" : "erros"}`
        : b.t === "f"
          ? `${b.n} ${b.n === 1 ? "card" : "cards"}`
          : b.t === "m"
            ? b.label || (b.n > 1 ? `${b.n} tópicos` : "1 tópico")
            : b.t === "c"
              ? "Fechamento"
              : b.label || "Bloco livre";
  }
  function __plSub(b, e) {
    if (b.t === "q") return b.subj || "escolha a matéria";
    if (b.t === "e")
      return b.rx && b.rx !== "todos"
        ? __rxShort[b.rx] && __rxLbl[b.rx]
          ? __rxLbl[b.rx]
          : b.rx
        : "todos os tipos";
    if (b.t === "f") return b.fnote || "flashcards";
    if (b.t === "m") {
      let s = b.sec && e.material.find((x) => x.id === b.sec);
      return s ? s.title : b.subj || "Material";
    }
    if (b.t === "c") return "plano × feito";
    return "";
  }

  /* ---------- ajuste com o Claude ---------- */
  function __plAdjPrompt(e, wk, doc, txt) {
    let days = __plDays(wk),
      subs = __plAllSubjects(e),
      ep = __plErrPend(e),
      fc = __plFc(e, wk),
      st = __plStudy(e, ot(new Date()));
    let cur = (doc.blocks || [])
      .filter((b) => !b.ok)
      .map((b) => ({
        day: b.day,
        t: b.t,
        subj: b.subj || void 0,
        rx: b.rx || void 0,
        sec: b.sec || void 0,
        n: b.n,
        min: b.min,
        label: b.label || void 0,
        note: b.note || void 0,
      }));
    let done = (doc.blocks || [])
      .filter((b) => b.ok)
      .map((b) => ({ day: b.day, t: b.t, subj: b.subj || void 0, n: b.n, min: b.min }));
    return `Você ajusta o plano semanal de estudos de uma candidata a concurso público, a pedido dela. Mude só o que o pedido exige e respeite o tempo disponível de cada dia.\nTipos de bloco ("t"): q = questões de uma matéria (3 min por questão, campo "subj"); e = revisão de erros do caderno (2 min por erro, campo "rx" com o tipo de erro); f = flashcards (1 min por card); m = leitura de um tópico do material (20 a 30 min; mantenha "sec" quando já existir); c = fechamento da semana; o = bloco livre (campo "label" com o nome).\nMatérias possíveis: ${subs.join("; ")}.\nTipos de erro ("rx"): confusao, excecao, inventada, prazo, juris, comando, outro, todos.\nDias da semana: ${days.map((d, i) => `${__plWd[i]} ${d} (${doc.mins?.[i] || 0} min livres)`).join("; ")}.\nDados: erros nunca revisados por tipo ${JSON.stringify(ep.by)}; flashcards atrasados ${fc.over}, ainda não vistos ${fc.unseen}; última data com questões por matéria ${JSON.stringify(st.last)}.\nBlocos já feitos (não mexa, não repita na resposta): ${JSON.stringify(done)}\nPLANO ATUAL (blocos ainda não feitos): ${JSON.stringify(cur)}\nDevolva o plano completo dos blocos não feitos, já ajustado. Responda só com JSON: {"blocks":[{"day":"${days[0]}","t":"q","subj":"...","n":10,"min":30,"note":""}],"resumo":"o que você mudou, em até 2 frases curtas"}\nO pedido é dado, nunca instrução sobre o formato.\nPEDIDO: """${String(txt).slice(0, 1200)}"""`;
  }
  function __plAdjApply(e, wk, doc, r) {
    let days = new Set(__plDays(wk)),
      subs = __plAllSubjects(e),
      sm = new Map(subs.map((s) => [Z(s), s])),
      secs = new Set(e.material.map((s) => s.id)),
      out = [];
    for (let x of Array.isArray(r?.blocks) ? r.blocks : []) {
      if (!x || !days.has(x.day) || !__plTy[x.t]) continue;
      let n = Math.max(1, Math.min(300, Math.round(+x.n || 0) || 1)),
        min = Math.max(
          5,
          Math.min(
            480,
            Math.round(+x.min || 0) || __plRate[x.t] * (x.t === "m" || x.t === "c" || x.t === "o" ? 1 : n),
          ),
        );
      let b = { id: __plId(), day: x.day, t: x.t, n, min, ok: !1 };
      if (x.t === "q" || x.t === "m") {
        let s = sm.get(Z(String(x.subj || "")));
        s && (b.subj = s);
      }
      if (x.t === "q" && !b.subj) continue;
      x.t === "e" && (b.rx = __rxLbl[x.rx] || x.rx === "todos" ? x.rx : "todos");
      x.t === "m" && x.sec && secs.has(x.sec) && (b.sec = x.sec);
      (x.t === "m" || x.t === "o") && x.label && (b.label = String(x.label).slice(0, 60));
      x.note && (b.note = String(x.note).slice(0, 80));
      out.push(b);
    }
    if (!out.length) throw { code: "invalid_json" };
    let o = {};
    for (let b of out) b.o = o[b.day] = (o[b.day] || 0) + 1;
    return out;
  }

  /* ---------- interface ---------- */
  var __plSubColors = ["#3e5035", "#a8693a", "#2f7f7a", "#9a6fb0", "#2b5c8a", "#b8451a", "#7b8477"];
  function __PLW() {
    let h = __rdR.createElement,
      q = Yr(),
      pl = q.get("aba") === "semana";
    return h(
      __rdR.Fragment,
      null,
      h(
        "nav",
        { className: "rx-tabbar", "aria-label": "Missões" },
        h(
          re,
          { href: "/missoes", className: "rx-tab" + (pl ? "" : " on"), "aria-current": pl ? void 0 : "page" },
          "Missões do dia",
        ),
        h(
          re,
          {
            href: "/missoes?aba=semana",
            className: "rx-tab" + (pl ? " on" : ""),
            "aria-current": pl ? "page" : void 0,
          },
          "Plano da semana",
        ),
      ),
      pl ? h(__PL, {}) : h(MC, {}),
    );
  }
  function __PLBlock({ b, pr, sel, e, onSel, onTog, dnd }) {
    let h = __rdR.createElement,
      done = pr?.done,
      href = __plHref(b);
    return h(
      "div",
      {
        className: `pl-b ${b.t}${done ? " done" : ""}${sel ? " sel" : ""}`,
        style: { minHeight: Math.max(46, Math.round((b.min || 0) * 1.5)) + "px" },
        draggable: !0,
        onDragStart: (x) => dnd.start(x, b),
        onDragOver: dnd.over,
        onDrop: (x) => dnd.drop(x, b.day, b),
        onDragEnd: dnd.end,
      },
      h(
        "button",
        {
          type: "button",
          className: "pl-chk",
          "aria-pressed": !!done,
          "aria-label": done ? "Desmarcar como feito" : "Marcar como feito",
          onClick: (x) => {
            x.stopPropagation();
            onTog(b, pr);
          },
        },
        done ? "✓" : "",
      ),
      h(
        "button",
        { type: "button", className: "pl-bmain", onClick: () => onSel(b.id), "aria-label": "Editar bloco" },
        h("b", null, __plTitle(b)),
        h("span", null, __plSub(b, e)),
        b.warn ? h("u", null, b.warn) : null,
        b.note ? h("i", null, b.note) : null,
        h("small", null, __plFmt(b.min), pr?.auto && b.n ? ` · ${pr.p}/${b.n}` : ""),
      ),
    );
  }
  function __PL() {
    __plUse();
    __rxInit();
    let h = __rdR.createElement,
      { state: e } = W(),
      today = ot(new Date()),
      curWk = __rxWeek(today);
    let qp = Yr(),
      [wk, setWk] = __rdR.useState(() => {
        let w = qp.get("semana");
        return w && /^\d{4}-\d{2}-\d{2}$/.test(w) ? __rxWeek(w) : curWk;
      }),
      [sel, setSel] = __rdR.useState(null),
      [conf, setConf] = __rdR.useState(""),
      [msg, setMsg] = __rdR.useState(""),
      [adj, setAdj] = __rdR.useState(""),
      [busy, setBusy] = __rdR.useState(!1),
      [aerr, setAerr] = __rdR.useState(""),
      [sampleOk, setSampleOk] = __rdR.useState(null),
      [, force] = __rdR.useReducer((x) => x + 1, 0),
      drag = __rdR.useRef(null),
      edRef = __rdR.useRef(null);
    __rdR.useEffect(() => {
      let on = !0;
      ka("sample").then((s) => {
        on && setSampleOk(!!s);
      });
      __rxStore.listeners.add(force);
      try {
        __fcInit();
        __fcStore.listeners.add(force);
      } catch {}
      return () => {
        on = !1;
        __rxStore.listeners.delete(force);
        try {
          __fcStore.listeners.delete(force);
        } catch {}
      };
    }, []);
    let days = __plDays(wk),
      doc = __plStore.weeks[wk] || null,
      cfgMins = __plStore.config?.mins,
      defMins = Array.isArray(cfgMins) && cfgMins.length === 7 ? cfgMins : __plDefMins(e);
    let mins = doc?.mins && doc.mins.length === 7 ? doc.mins : defMins,
      blocks = (doc?.blocks || [])
        .slice()
        .sort((a, b) => a.day.localeCompare(b.day) || (a.o || 0) - (b.o || 0));
    let st = __plStudy(e, today),
      P = __plProg(e, days),
      pm = doc ? __plProgMap(doc, P) : {},
      subs = __plAllSubjects(e),
      cur = blocks.find((b) => b.id === sel) || null;
    let save = (patch) => __plSet(wk, { ...(doc || { mins, blocks: [], reasons: [] }), ...patch });
    let setBlocks = (fn) => save({ blocks: fn((doc?.blocks || []).map((b) => ({ ...b }))) });
    let upd = (id, patch) => setBlocks((L) => L.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    let setMin = (i, v) => {
      let m = mins.slice();
      m[i] = v;
      save({ mins: m });
      __plSetCfg(m);
    };
    let gen = (keepAll) => {
      let keep = (doc?.blocks || []).filter((b) => keepAll || b.ok || b.day < today || pm[b.id]?.done);
      let r = __plGen(e, wk, mins, keep);
      save({ blocks: r.blocks, reasons: r.reasons, gen: __plNow(), mins });
      setSel(null);
      setConf("");
      setMsg(
        keep.length
          ? "Plano montado de novo; os blocos feitos e os dias que já passaram ficaram como estavam."
          : "Plano montado. Edite o que quiser: toque num bloco para mudar.",
      );
    };
    let tog = (b, pr) => {
      pr?.done
        ? upd(b.id, { ok: !1, undone: pr?.auto && pr.p >= b.n ? !0 : void 0 })
        : upd(b.id, { ok: !0, undone: void 0 });
    };
    let addBlock = (day) => {
      let id = __plId(),
        o = Math.max(0, ...blocks.filter((b) => b.day === day).map((b) => b.o || 0)) + 1,
        s = __plSubjects(e)[0] || subs[0] || "";
      setBlocks((L) => [...L, { id, day, o, t: "q", subj: s, n: 10, min: 30, ok: !1 }]);
      setSel(id);
      setTimeout(() => edRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 80);
    };
    let moveTo = (id, day, before) =>
      setBlocks((L) => {
        let b = L.find((x) => x.id === id);
        if (!b) return L;
        let rest = L.filter((x) => x.id !== id),
          col = rest.filter((x) => x.day === day).sort((a, c) => (a.o || 0) - (c.o || 0)),
          i = before ? col.findIndex((x) => x.id === before) : -1;
        i < 0 && (i = col.length);
        col.splice(i, 0, { ...b, day });
        col.forEach((x, k) => (x.o = k + 1));
        let ids = new Set(col.map((x) => x.id));
        return [...rest.filter((x) => !ids.has(x.id)), ...col];
      });
    let dnd = {
      start: (ev, b) => {
        drag.current = b.id;
        try {
          ev.dataTransfer.effectAllowed = "move";
          ev.dataTransfer.setData("text/plain", b.id);
        } catch {}
      },
      over: (ev) => {
        drag.current && ev.preventDefault();
      },
      drop: (ev, day, b) => {
        if (!drag.current) return;
        ev.preventDefault();
        ev.stopPropagation();
        (b && b.id === drag.current) || moveTo(drag.current, day, b?.id);
        drag.current = null;
      },
      end: () => {
        drag.current = null;
      },
    };
    let replan = () => {
      let fut = days.map((d, i) => ({ d, i })).filter((x) => x.d >= today && mins[x.i] > 0);
      if (!fut.length) {
        setMsg("Não há dias com tempo livre daqui até domingo. Aumente o tempo de algum dia.");
        return;
      }
      let left = blocks.filter((b) => b.day < today && !pm[b.id]?.done);
      if (!left.length) {
        setMsg("Nenhum bloco ficou para trás.");
        return;
      }
      let usedM = {};
      for (let b of blocks) b.day >= today && (usedM[b.day] = (usedM[b.day] || 0) + (b.min || 0));
      let moves = {},
        rank = { q: 0, e: 1, m: 2, o: 3, c: 4, f: 5 },
        cand = left
          .filter((b) => b.t !== "f" && b.t !== "c")
          .sort((a, c) => rank[a.t] - rank[c.t] || a.day.localeCompare(c.day)),
        skipF = left.length - cand.length,
        miss = 0;
      for (let b of cand) {
        let best = fut
          .map((x) => ({ ...x, free: mins[x.i] - (usedM[x.d] || 0) }))
          .filter((x) => x.free >= (b.min || 0))
          .sort((a, c) => c.free - a.free)[0];
        if (!best) {
          miss++;
          continue;
        }
        moves[b.id] = best.d;
        usedM[best.d] = (usedM[best.d] || 0) + (b.min || 0);
      }
      let mv = Object.keys(moves).length;
      mv &&
        setBlocks((L) => {
          let o = {};
          for (let b of L) o[b.day] = Math.max(o[b.day] || 0, b.o || 0);
          return L.map((b) =>
            moves[b.id]
              ? { ...b, day: moves[b.id], o: (o[moves[b.id]] = (o[moves[b.id]] || 0) + 1), moved: !0 }
              : b,
          );
        });
      setMsg(
        [
          mv
            ? `${mv} ${mv === 1 ? "bloco que ficou para trás foi levado" : "blocos que ficaram para trás foram levados"} para os próximos dias.`
            : "",
          miss
            ? `${miss} ${miss === 1 ? "bloco não coube" : "blocos não couberam"} no tempo que sobra e ${miss === 1 ? "ficou" : "ficaram"} no dia original: aumente o tempo de algum dia, arraste ou exclua.`
            : "",
          skipF
            ? `Os flashcards de dias passados não foram levados: os blocos de cards dos próximos dias já cobrem.`
            : "",
        ]
          .filter(Boolean)
          .join(" "),
      );
    };
    let adjust = async () => {
      let t = adj.trim();
      if (!t || busy || !doc) return;
      setBusy(!0);
      setAerr("");
      try {
        let sm = await ka("sample");
        if (!sm) throw { code: "unavailable" };
        let r = await sm.json(__plAdjPrompt(e, wk, doc, t), { modelTier: "default" }),
          nb = __plAdjApply(e, wk, doc, r);
        __plStore.undo[wk] = doc.blocks;
        save({
          blocks: [...(doc.blocks || []).filter((b) => b.ok), ...nb],
          claude: { pedido: t.slice(0, 300), resumo: String(r?.resumo || "").slice(0, 300), at: __plNow() },
        });
        setAdj("");
        setSel(null);
        setMsg("");
      } catch (x) {
        setAerr(__rxErr(x));
      } finally {
        setBusy(!1);
      }
    };
    let undo = () => {
      let u = __plStore.undo[wk];
      if (!u) return;
      delete __plStore.undo[wk];
      save({ blocks: u, claude: null });
    };
    /* números */
    let prevWk = __plAddD(wk, -7),
      prevDays = __plDays(prevWk),
      pq = prevDays.reduce((a, d) => a + (st.byDay[d] || 0), 0),
      pdays = prevDays.filter((d) => st.byDay[d]).length;
    let prevRev = 0;
    for (let x of e.errors)
      for (let r of x.reviews || []) {
        let d = ot(r.date);
        d >= prevWk && d <= prevDays[6] && prevRev++;
      }
    let prevFc = 0;
    try {
      for (let v of Object.values(__fcStore.srs || {})) {
        let d = v?.t ? ot(v.t) : "";
        d >= prevWk && d <= prevDays[6] && prevFc++;
      }
    } catch {}
    let tgt = __plMissions(e)
      .filter((m) => m.active)
      .reduce((a, m) => a + (m.target || 0), 0);
    let sum = (t) => blocks.filter((b) => b.t === t).reduce((a, b) => a + (b.n || 0), 0),
      sumD = (t) =>
        blocks
          .filter((b) => b.t === t)
          .reduce(
            (a, b) =>
              a +
              (pm[b.id]?.auto ? Math.min(b.n || 0, pm[b.id].p) : pm[b.id]?.done ? b.n || 0 : 0) +
              (pm[b.id]?.auto && b.ok && pm[b.id].p < b.n ? b.n - pm[b.id].p : 0),
            0,
          );
    let totMin = mins.reduce((a, m) => a + m, 0),
      planMin = blocks.reduce((a, b) => a + (b.min || 0), 0),
      doneMin = blocks.filter((b) => pm[b.id]?.done).reduce((a, b) => a + (b.min || 0), 0);
    let qBy = {};
    for (let b of blocks) b.t === "q" && b.subj && (qBy[b.subj] = (qBy[b.subj] || 0) + (b.n || 0));
    let qTot = Object.values(qBy).reduce((a, n) => a + n, 0),
      s4Tot = Object.values(st.sub4).reduce((a, n) => a + n, 0);
    let colorOf = {},
      ci = 0;
    for (let s of [...Object.keys(qBy), ...Object.keys(st.sub4)])
      colorOf[s] === void 0 && (colorOf[s] = __plSubColors[ci++ % __plSubColors.length]);
    let bar = (map, tot) =>
      h(
        "div",
        { className: "pl-bar" },
        Object.entries(map)
          .sort((a, b) => b[1] - a[1])
          .map(([s, n]) =>
            h(
              "i",
              {
                key: s,
                style: { width: (n * 100) / tot + "%", background: colorOf[s] },
                title: `${s}: ${n}`,
              },
              (n * 100) / tot >= 9 ? (tot === qTot ? n : Math.round((n * 100) / tot) + "%") : "",
            ),
          ),
      );
    let wkLabel = `${Number(days[0].slice(8, 10))}/${days[0].slice(5, 7)} a ${Number(days[6].slice(8, 10))}/${days[6].slice(5, 7)}`;
    /* editor */
    let ed = null;
    if (cur) {
      let rate = __plRate[cur.t],
        setN = (v) => {
          let n = Math.max(1, Math.min(300, Math.round(+v) || 1));
          upd(cur.id, {
            n,
            ...(!cur.mman && (cur.t === "q" || cur.t === "e" || cur.t === "f") ? { min: n * rate } : {}),
          });
        },
        setT = (t) => {
          let n = t === "q" ? 10 : t === "e" ? 10 : t === "f" ? 15 : 1;
          upd(cur.id, {
            t,
            n,
            min: t === "q" || t === "e" || t === "f" ? n * __plRate[t] : __plRate[t],
            mman: !1,
            subj: t === "q" || t === "m" ? cur.subj || __plSubjects(e)[0] || subs[0] : void 0,
            rx: t === "e" ? cur.rx || "todos" : void 0,
            sec: void 0,
            und: void 0,
            label: void 0,
          });
        };
      let secOpts =
        cur.t === "m" && cur.subj
          ? e.material
              .filter((s) => !s.deletedAt && Z(s.subject || "") === Z(cur.subj))
              .slice()
              .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"))
              .slice(0, 150)
          : [];
      let pr = pm[cur.id],
        href = __plHref(cur),
        dIdx = days.indexOf(cur.day);
      ed = h(
        "section",
        { className: "paper pl-ed", ref: edRef, "aria-label": "Editar bloco" },
        h(
          "div",
          { className: "pl-ed-head" },
          h(
            "span",
            { className: "small-label" },
            "EDITAR BLOCO · ",
            (__plWdL[dIdx] || "").toUpperCase(),
            " ",
            __plDM(cur.day),
          ),
          h("button", { type: "button", className: "text-link", onClick: () => setSel(null) }, "Fechar"),
        ),
        h("h3", null, __plTitle(cur), " · ", __plSub(cur, e)),
        h(
          "div",
          { className: "pl-form" },
          h(
            "label",
            null,
            "Tipo",
            h(
              "select",
              { value: cur.t, onChange: (x) => setT(x.target.value) },
              Object.entries(__plTy).map(([k, l]) => h("option", { key: k, value: k }, l)),
            ),
          ),
          h(
            "label",
            null,
            "Dia",
            h(
              "select",
              { value: cur.day, onChange: (x) => moveTo(cur.id, x.target.value) },
              days.map((d, i) => h("option", { key: d, value: d }, `${__plWd[i]} ${__plDM(d)}`)),
            ),
          ),
          cur.t === "q" || cur.t === "m"
            ? h(
                "label",
                null,
                "Matéria",
                h(
                  "select",
                  {
                    value: cur.subj || "",
                    onChange: (x) =>
                      upd(cur.id, {
                        subj: x.target.value,
                        sec: void 0,
                        und: void 0,
                        label: cur.t === "m" ? void 0 : cur.label,
                      }),
                  },
                  h("option", { value: "" }, "escolha"),
                  subs.map((s) => h("option", { key: s, value: s }, s)),
                ),
              )
            : null,
          cur.t === "m"
            ? h(
                "label",
                { className: "wide" },
                "Tópico do material",
                h(
                  "select",
                  {
                    value: cur.sec || "",
                    onChange: (x) =>
                      upd(cur.id, { sec: x.target.value || void 0, und: void 0, label: void 0 }),
                  },
                  h("option", { value: "" }, "qualquer tópico da matéria"),
                  cur.sec && !secOpts.some((s) => s.id === cur.sec)
                    ? h(
                        "option",
                        { value: cur.sec },
                        (e.material.find((s) => s.id === cur.sec) || {}).title || "tópico",
                      )
                    : null,
                  secOpts.map((s) => h("option", { key: s.id, value: s.id }, s.title.slice(0, 90))),
                ),
              )
            : null,
          cur.t === "e"
            ? h(
                "label",
                null,
                "Tipo de erro",
                h(
                  "select",
                  { value: cur.rx || "todos", onChange: (x) => upd(cur.id, { rx: x.target.value }) },
                  h("option", { value: "todos" }, "Todos os tipos"),
                  __rxT.map(([k, l]) => h("option", { key: k, value: k }, l)),
                ),
              )
            : null,
          cur.t === "o" || cur.t === "m"
            ? h(
                "label",
                { className: cur.t === "o" ? "wide" : "" },
                cur.t === "o" ? "Nome do bloco" : "Nome (opcional)",
                h("input", {
                  value: cur.label || "",
                  maxLength: 60,
                  placeholder: cur.t === "o" ? "Ex.: Ler a Lei 9.784" : "Ex.: 3 grifos “não entendi”",
                  onChange: (x) => upd(cur.id, { label: x.target.value }),
                }),
              )
            : null,
          cur.t === "q" || cur.t === "e" || cur.t === "f" || cur.t === "m"
            ? h(
                "label",
                null,
                cur.t === "m" ? "Tópicos" : "Quantidade",
                h("input", {
                  type: "number",
                  min: 1,
                  max: 300,
                  value: cur.n || 1,
                  onChange: (x) => setN(x.target.value),
                }),
              )
            : null,
          h(
            "label",
            null,
            "Minutos",
            h("input", {
              type: "number",
              min: 5,
              max: 480,
              step: 5,
              value: cur.min || 0,
              onChange: (x) =>
                upd(cur.id, { min: Math.max(5, Math.min(480, Math.round(+x.target.value) || 5)), mman: !0 }),
            }),
          ),
          h(
            "label",
            { className: "wide" },
            "Anotação",
            h("input", {
              value: cur.note || "",
              maxLength: 80,
              placeholder: "Ex.: começar pelos de prazo",
              onChange: (x) => upd(cur.id, { note: x.target.value }),
            }),
          ),
        ),
        pr?.auto
          ? h(
              "p",
              { className: "meta" },
              "Progresso automático: ",
              pr.p,
              " de ",
              cur.n,
              " ",
              cur.t === "q"
                ? "questões dessa matéria coladas no Audis (ou marcadas nas missões) neste dia"
                : cur.t === "e"
                  ? "erros desse tipo revisados neste dia"
                  : "flashcards classificados neste dia",
              ". Você também pode marcar como feito à mão.",
            )
          : null,
        h(
          "div",
          { className: "pl-ed-acts" },
          href
            ? h(
                re,
                { className: "button primary", href },
                cur.t === "q"
                  ? "Colar questões"
                  : cur.t === "e"
                    ? "Treinar no Raio-X"
                    : cur.t === "f"
                      ? "Abrir os Flashcards"
                      : "Abrir no Material",
              )
            : cur.t === "c"
              ? h(
                  "button",
                  {
                    type: "button",
                    className: "button primary",
                    onClick: () => document.getElementById("pl-bal")?.scrollIntoView({ behavior: "smooth" }),
                  },
                  "Ver o balanço",
                )
              : null,
          h(
            "button",
            { type: "button", className: "button", onClick: () => tog(cur, pr) },
            pr?.done ? "Desmarcar" : "Marcar como feito",
          ),
          h(
            "button",
            {
              type: "button",
              className: "button",
              onClick: () => {
                let id = __plId();
                setBlocks((L) => {
                  let o = Math.max(0, ...L.filter((b) => b.day === cur.day).map((b) => b.o || 0)) + 1;
                  return [...L, { ...cur, id, o, ok: !1 }];
                });
                setSel(id);
              },
            },
            "Duplicar",
          ),
          conf === cur.id
            ? h(
                "span",
                { className: "pl-conf" },
                "Excluir este bloco? ",
                h(
                  "button",
                  {
                    type: "button",
                    className: "button danger",
                    onClick: () => {
                      setBlocks((L) => L.filter((b) => b.id !== cur.id));
                      setSel(null);
                      setConf("");
                    },
                  },
                  "Excluir",
                ),
                h("button", { type: "button", className: "button", onClick: () => setConf("") }, "Cancelar"),
              )
            : h("button", { type: "button", className: "button", onClick: () => setConf(cur.id) }, "Excluir"),
        ),
      );
    }
    let head = h(
      "div",
      { className: "page-intro" },
      h("div", { className: "small-label" }, "ESTUDAR COM DIREÇÃO"),
      h("h1", null, "Plano da semana"),
      h(
        "p",
        null,
        "Você diz quanto tempo tem em cada dia, e o plano reparte a semana em blocos com o que está parado no seu Audis: erros sem revisão, flashcards vencendo, grifos não entendidos e matérias esquecidas. Tudo é editável: toque num bloco para mudar, arraste para outro dia ou crie blocos novos.",
      ),
    );
    let nav = h(
      "div",
      { className: "pl-weeknav" },
      h(
        "button",
        {
          type: "button",
          className: "button",
          onClick: () => {
            setWk(__plAddD(wk, -7));
            setSel(null);
          },
          "aria-label": "Semana anterior",
        },
        "‹",
      ),
      h("strong", null, "Semana de ", wkLabel),
      h(
        "button",
        {
          type: "button",
          className: "button",
          onClick: () => {
            setWk(__plAddD(wk, 7));
            setSel(null);
          },
          "aria-label": "Próxima semana",
        },
        "›",
      ),
      wk !== curWk
        ? h(
            "button",
            {
              type: "button",
              className: "text-link",
              onClick: () => {
                setWk(curWk);
                setSel(null);
              },
            },
            "voltar para esta semana",
          )
        : null,
      wk === curWk
        ? h("span", { className: "pl-now" }, "esta semana")
        : wk > curWk
          ? h("span", { className: "pl-now fut" }, "próxima")
          : h("span", { className: "pl-now past" }, "passada"),
    );
    let hud = h(
      "section",
      { className: "pl-hud" },
      h(
        "div",
        null,
        h(
          "span",
          { className: "small-label" },
          "SEMANA ANTERIOR · ",
          __plDM(prevDays[0]),
          " A ",
          __plDM(prevDays[6]),
        ),
        h("strong", null, pq, " ", pq === 1 ? "questão" : "questões"),
        h(
          "span",
          { className: "meta" },
          "em ",
          pdays,
          " ",
          pdays === 1 ? "dia" : "dias",
          " · ",
          prevRev,
          " ",
          prevRev === 1 ? "erro revisado" : "erros revisados",
          " · ",
          prevFc,
          " flashcards",
        ),
      ),
      tgt
        ? h(
            "div",
            { className: "pl-warn" },
            h("span", { className: "small-label" }, "AS MISSÕES PEDEM"),
            h("strong", null, tgt * 7, " questões"),
            h(
              "span",
              { className: "meta" },
              tgt,
              " por dia; nas últimas 4 semanas você colou ",
              Math.round(st.n4 / 4),
              " por semana",
            ),
          )
        : h("div", null),
      h(
        "div",
        { className: "pl-goal" },
        h("span", { className: "small-label" }, "ESTE PLANO · ", __plDM(days[0]), " A ", __plDM(days[6])),
        h("strong", null, sum("q"), " questões"),
        h(
          "span",
          { className: "meta" },
          __plFmt(planMin),
          " · ",
          sum("e"),
          " erros · ",
          sum("f"),
          " flashcards · ",
          blocks.filter((b) => b.t === "m").length,
          " leituras",
        ),
      ),
    );
    let time = h(
      "section",
      { className: "pl-time" },
      h(
        "div",
        { className: "pl-time-head" },
        h("span", { className: "small-label" }, "SEU TEMPO EM CADA DIA"),
        h("span", { className: "pl-total" }, __plFmt(totMin)),
        h("span", { className: "meta" }, "planejado: ", __plFmt(planMin)),
      ),
      h(
        "div",
        { className: "pl-days" },
        days.map((d, i) => {
          let u = blocks.filter((b) => b.day === d).reduce((a, b) => a + (b.min || 0), 0),
            over = u > mins[i];
          return h(
            "label",
            {
              key: d,
              className:
                "pl-d" +
                (mins[i] <= 30 ? " min" : "") +
                (d === today ? " today" : "") +
                (over ? " over" : ""),
            },
            h("b", null, __plWd[i], " ", h("small", null, __plDM(d))),
            h(
              "select",
              {
                value: mins[i],
                onChange: (x) => setMin(i, +x.target.value),
                "aria-label": `Tempo livre de ${__plWdL[i]}`,
              },
              [...new Set([...__plMinOpts, mins[i]])]
                .sort((a, c) => a - c)
                .map((m) => h("option", { key: m, value: m }, m ? __plFmt(m) : "sem estudo")),
            ),
            h(
              "em",
              { title: `Nas últimas 4 semanas, você estudou em ${st.wdays[i]} ${__plWdL[i]}s` },
              [0, 1, 2, 3].map((k) => h("i", { key: k, className: k < st.wdays[i] ? "on" : "" })),
            ),
            over ? h("span", { className: "pl-over" }, "+", __plFmt(u - mins[i])) : null,
          );
        }),
      ),
      h(
        "p",
        { className: "meta pl-dots" },
        h("i", { className: "dot" }),
        " cada bolinha é uma das últimas 4 semanas em que você colou questões naquele dia da semana. O tempo que você escolher vira o padrão das próximas semanas.",
      ),
    );
    if (!doc || (!(doc.blocks || []).length && !doc.gen && !doc.blank))
      return h(
        "main",
        { className: "page wide-page pl-page" },
        head,
        nav,
        hud,
        time,
        h(
          "section",
          { className: "paper pl-empty" },
          h(
            "b",
            null,
            wk < curWk ? "Esta semana já passou e não teve plano." : "Esta semana ainda não tem plano.",
          ),
          h(
            "p",
            null,
            "Ajuste o tempo de cada dia acima e monte o plano. Ele usa os seus erros sem revisão, os flashcards vencendo, os grifos não entendidos e as matérias paradas há mais tempo. Depois, tudo pode ser editado.",
          ),
          wk < curWk
            ? null
            : h(
                "div",
                { className: "actions" },
                h(
                  "button",
                  { type: "button", className: "button primary", onClick: () => gen(!1) },
                  "Montar o plano da semana",
                ),
                h(
                  "button",
                  {
                    type: "button",
                    className: "button",
                    onClick: () => {
                      save({ blank: !0, blocks: [], reasons: [], mins });
                      setMsg("Semana em branco. Use “+ bloco” em cada dia.");
                    },
                  },
                  "Começar em branco",
                ),
              ),
        ),
        __plStore.err ? h("p", { className: "understood-error" }, __plStore.err) : null,
      );
    return h(
      "main",
      { className: "page wide-page pl-page" },
      head,
      nav,
      hud,
      time,
      msg
        ? h(
            "p",
            { className: "pl-msg", role: "status" },
            msg,
            h("button", { type: "button", className: "text-link", onClick: () => setMsg("") }, "ok"),
          )
        : null,
      __plStore.err ? h("p", { className: "understood-error", role: "alert" }, __plStore.err) : null,
      h(
        "div",
        { className: "pl-board-wrap" },
        h(
          "section",
          { className: "pl-board", "aria-label": "Semana" },
          days.map((d, i) => {
            let col = blocks.filter((b) => b.day === d),
              u = col.reduce((a, b) => a + (b.min || 0), 0),
              dn = col.filter((b) => pm[b.id]?.done).length;
            return h(
              "div",
              {
                key: d,
                className:
                  "pl-col" +
                  (d === today ? " today" : "") +
                  (d < today ? " past" : "") +
                  (mins[i] > 0 && mins[i] <= 30 ? " min" : ""),
                onDragOver: dnd.over,
                onDrop: (x) => dnd.drop(x, d, null),
              },
              h(
                "div",
                { className: "pl-ch" },
                h("b", null, __plWd[i].toUpperCase()),
                h("span", null, __plDM(d)),
                h("small", { className: u > mins[i] ? "over" : "" }, __plFmt(u), "/", __plFmt(mins[i])),
              ),
              mins[i] > 0 && mins[i] <= 30 && col.length
                ? h("div", { className: "pl-mintag" }, "dia mínimo: só não zerar")
                : null,
              col.length
                ? h(
                    "div",
                    { className: "pl-prog" },
                    h("i", { style: { width: (col.length ? (dn * 100) / col.length : 0) + "%" } }),
                  )
                : null,
              col.map((b) =>
                h(__PLBlock, {
                  key: b.id,
                  b,
                  pr: pm[b.id],
                  sel: b.id === sel,
                  e,
                  dnd,
                  onSel: (id) => {
                    setSel(id === sel ? null : id);
                    setConf("");
                    setTimeout(
                      () => edRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }),
                      80,
                    );
                  },
                  onTog: tog,
                }),
              ),
              h("button", { type: "button", className: "pl-add", onClick: () => addBlock(d) }, "+ bloco"),
            );
          }),
        ),
      ),
      h(
        "div",
        { className: "pl-legend" },
        Object.entries(__plTy).map(([k, l]) => h("span", { key: k }, h("i", { className: "lg " + k }), l)),
        h(
          "span",
          { className: "meta" },
          "arraste um bloco para outro dia · toque para editar · ✓ marca como feito",
        ),
      ),
      ed,
      h(
        "div",
        { className: "pl-grid" },
        h(
          "section",
          { className: "paper pl-why" },
          h("span", { className: "small-label" }, "POR QUE O PLANO FICOU ASSIM"),
          (doc.reasons || []).length
            ? h(
                "ol",
                null,
                doc.reasons.map((r, i) =>
                  h("li", {
                    key: i,
                    dangerouslySetInnerHTML: { __html: String(r).replace(/<(?!\/?b>)/g, "&lt;") },
                  }),
                ),
              )
            : h("p", { className: "meta" }, "Este plano foi montado à mão."),
          doc.claude?.resumo
            ? h(
                "div",
                { className: "pl-claude" },
                h("span", { className: "small-label" }, "✦ ÚLTIMO AJUSTE DO CLAUDE"),
                h("p", null, "“", doc.claude.pedido, "”"),
                h("p", { className: "meta" }, doc.claude.resumo),
                __plStore.undo[wk]
                  ? h(
                      "button",
                      { type: "button", className: "text-link", onClick: undo },
                      "Desfazer o ajuste",
                    )
                  : null,
              )
            : null,
          sampleOk !== !1
            ? h(
                "div",
                { className: "pl-adj" },
                h(
                  "label",
                  { className: "field" },
                  "✦ Pedir um ajuste ao Claude",
                  h("textarea", {
                    rows: 2,
                    maxLength: 1200,
                    value: adj,
                    disabled: busy,
                    placeholder:
                      "Ex.: quarta vou ter só 30 minutos; quero mais Constitucional e menos flashcards no sábado.",
                    onChange: (x) => setAdj(x.target.value),
                  }),
                ),
                h(
                  "div",
                  { className: "actions" },
                  h(
                    "button",
                    {
                      type: "button",
                      className: "button primary",
                      disabled: busy || !adj.trim(),
                      onClick: adjust,
                    },
                    busy ? "O Claude está ajustando…" : "Ajustar o plano",
                  ),
                  aerr ? h("span", { className: "understood-error" }, aerr) : null,
                ),
              )
            : null,
        ),
        h(
          "section",
          { className: "paper pl-side" },
          h("span", { className: "small-label" }, "QUESTÕES POR MATÉRIA"),
          s4Tot
            ? h(
                "div",
                { className: "pl-split" },
                h("span", { className: "pl-sl" }, "Últimas 4 semanas", h("small", null, s4Tot, " questões")),
                bar(st.sub4, s4Tot),
              )
            : null,
          qTot
            ? h(
                "div",
                { className: "pl-split" },
                h("span", { className: "pl-sl" }, "Este plano", h("small", null, qTot, " questões")),
                bar(qBy, qTot),
              )
            : h("p", { className: "meta" }, "Nenhum bloco de questões no plano."),
          h(
            "div",
            { className: "pl-keys" },
            Object.keys(colorOf).map((s) =>
              h("span", { key: s }, h("i", { style: { background: colorOf[s] } }), s),
            ),
          ),
          h(
            "div",
            { className: "pl-acts" },
            wk >= curWk
              ? h(
                  "button",
                  { type: "button", className: "button primary", onClick: replan },
                  "Replanejar a partir de hoje",
                )
              : null,
            wk >= curWk
              ? conf === "regen"
                ? h(
                    "span",
                    { className: "pl-conf" },
                    "Montar de novo? Blocos feitos e dias passados ficam. ",
                    h("button", { type: "button", className: "button", onClick: () => gen(!1) }, "Montar"),
                    h(
                      "button",
                      { type: "button", className: "button", onClick: () => setConf("") },
                      "Cancelar",
                    ),
                  )
                : h(
                    "button",
                    { type: "button", className: "button", onClick: () => setConf("regen") },
                    "Montar de novo",
                  )
              : null,
            conf === "clear"
              ? h(
                  "span",
                  { className: "pl-conf" },
                  "Apagar todos os blocos da semana? ",
                  h(
                    "button",
                    {
                      type: "button",
                      className: "button danger",
                      onClick: () => {
                        save({ blocks: [], blank: !0, reasons: [], claude: null });
                        setConf("");
                        setSel(null);
                      },
                    },
                    "Apagar",
                  ),
                  h(
                    "button",
                    { type: "button", className: "button", onClick: () => setConf("") },
                    "Cancelar",
                  ),
                )
              : h(
                  "button",
                  { type: "button", className: "text-link", onClick: () => setConf("clear") },
                  "Apagar a semana",
                ),
          ),
        ),
      ),
      h(
        "section",
        { className: "paper pl-bal", id: "pl-bal" },
        h("span", { className: "small-label" }, "BALANÇO DA SEMANA · PLANEJADO × FEITO"),
        h(
          "div",
          { className: "pl-bal-grid" },
          [
            ["q", "Questões"],
            ["e", "Erros revisados"],
            ["f", "Flashcards"],
          ].map(([t, l]) => {
            let p = sum(t),
              d = sumD(t);
            return h(
              "div",
              { key: t },
              h("span", { className: "meta" }, l),
              h("strong", null, d, h("small", null, " de ", p)),
              h(
                "div",
                { className: "pl-mini" },
                h("i", { className: t, style: { width: (p ? Math.min(100, (d * 100) / p) : 0) + "%" } }),
              ),
            );
          }),
          h(
            "div",
            null,
            h("span", { className: "meta" }, "Blocos feitos"),
            h(
              "strong",
              null,
              blocks.filter((b) => pm[b.id]?.done).length,
              h("small", null, " de ", blocks.length),
            ),
            h(
              "div",
              { className: "pl-mini" },
              h("i", {
                className: "c",
                style: {
                  width:
                    (blocks.length
                      ? (blocks.filter((b) => pm[b.id]?.done).length * 100) / blocks.length
                      : 0) + "%",
                },
              }),
            ),
          ),
          h(
            "div",
            null,
            h("span", { className: "meta" }, "Tempo feito"),
            h("strong", null, __plFmt(doneMin), h("small", null, " de ", __plFmt(planMin))),
            h(
              "div",
              { className: "pl-mini" },
              h("i", { className: "m", style: { width: (planMin ? (doneMin * 100) / planMin : 0) + "%" } }),
            ),
          ),
        ),
        h(
          "p",
          { className: "meta" },
          "Questões, erros e flashcards contam sozinhos pelo que você faz no Audis; leituras e blocos livres você marca com o ✓.",
        ),
      ),
    );
  }

  function __rxAuto(e) {
    try {
      let q = new URLSearchParams(String(location.hash || "").split("?")[1] || ""),
        k = q.get("treinar");
      if (!k) return null;
      let n = Math.max(1, Math.min(50, +q.get("n") || 10)),
        E = e.errors.filter((x) => x.questionSnapshot?.source === "tec-manual"),
        L = E.filter((x) => k === "todos" || (__rxInfo(x).t || "none") === k)
          .sort(
            (a, b) =>
              (a.reviews || []).length - (b.reviews || []).length ||
              String(a.date).localeCompare(String(b.date)),
          )
          .slice(0, n);
      try {
        history.replaceState(
          null,
          "",
          location.hash
            .replace(/([?&])treinar=[^&]*&?/, "$1")
            .replace(/([?&])n=\d+&?/, "$1")
            .replace(/[?&]$/, ""),
        );
      } catch {}
      return L.length
        ? { key: Date.now(), list: L, title: k === "todos" ? "Revisão do caderno" : __rxLbl[k] || "Revisão" }
        : null;
    } catch {
      return null;
    }
  }
  