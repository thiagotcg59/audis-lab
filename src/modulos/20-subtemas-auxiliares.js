function __sbEnc(k) {
    try {
      return btoa(unescape(encodeURIComponent(k)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    } catch {
      return "";
    }
  }
  function __sbDec(s) {
    try {
      return decodeURIComponent(escape(atob(String(s).replace(/-/g, "+").replace(/_/g, "/"))));
    } catch {
      return null;
    }
  }
  function __sbAll(n) {
    return [...n.sections, ...n.children.flatMap(__sbAll)];
  }
  function __sbFind(ns, key, trail = []) {
    for (let n of ns) {
      let p = [...trail, n];
      if (n.key === key) return p;
      let r = __sbFind(n.children, key, p);
      if (r) return r;
    }
    return null;
  }
  