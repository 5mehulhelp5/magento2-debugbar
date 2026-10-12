const $n = window.Alpine;
var Pn = !1, Ln = !1, pe = [], Dn = -1, Gt = !1, ii = !1;
function Kr(e) {
  Xr(e);
}
function Gr() {
  ii = !0;
}
function Vr() {
  ii = !1, Ts();
}
function Xr(e) {
  pe.includes(e) || (pe.push(e), e._x_schedulerPriority !== void 0 && (Gt = !0)), Ts();
}
function Jr(e) {
  let t = pe.indexOf(e);
  t !== -1 && t > Dn && pe.splice(t, 1);
}
function Ts() {
  if (!Ln && !Pn) {
    if (ii)
      return;
    Pn = !0, queueMicrotask(Zr);
  }
}
function Zr() {
  Pn = !1, Ln = !0;
  for (let e = 0; e < pe.length; e++)
    Gt && Yr(e), pe[e](), Dn = e;
  pe.length = 0, Dn = -1, Gt = !1, Ln = !1;
}
function Yr(e) {
  let t = /* @__PURE__ */ new Map(), n = pe.slice(e).sort((i, s) => Qr(i, s, t));
  for (let i = 0; i < n.length; i++)
    pe[e + i] = n[i];
  Gt = !1;
}
function Qr(e, t, n) {
  return kn(e) ? kn(t) ? Zi(e._x_schedulerPriority.el, n) - Zi(t._x_schedulerPriority.el, n) || e._x_schedulerPriority.order - t._x_schedulerPriority.order : -1 : kn(t) ? 1 : 0;
}
function kn(e) {
  return e._x_schedulerPriority !== void 0;
}
function Zi(e, t) {
  if (t.has(e))
    return t.get(e);
  let n = 0, i = e;
  for (; e; )
    n++, e._x_teleportBack ? e = e._x_teleportBack : typeof ShadowRoot == "function" && e.parentNode instanceof ShadowRoot ? e = e.parentNode.host : e = e.parentElement;
  return t.set(i, n), n;
}
var nt, He, it, Ms, eo = 0, qn = !0;
function to(e) {
  qn = !1, e(), qn = !0;
}
function no(e) {
  nt = e.reactive, it = e.release, He = (t) => e.effect(t, { scheduler: (n) => {
    qn ? Kr(n) : n();
  } }), Ms = e.raw;
}
function Yi(e) {
  He = e;
}
function io(e) {
  let t = () => {
  };
  return [(i, s) => {
    let a = s?.priority === "structural" ? eo++ : void 0, r = He(i);
    return a !== void 0 && r !== void 0 && (r._x_schedulerPriority = { el: e, order: a }), e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), it(r));
    }, r;
  }, () => {
    t();
  }];
}
function Ns(e, t) {
  let n = !0, i, s, a = He(() => {
    let r = e(), o = JSON.stringify(r);
    if (!n && (typeof r == "object" || r !== i)) {
      let c = typeof i == "object" ? JSON.parse(s) : i;
      queueMicrotask(() => {
        t(r, c);
      });
    }
    i = r, s = o, n = !1;
  });
  return () => it(a);
}
async function so(e) {
  Gr();
  try {
    await e(), await Promise.resolve();
  } finally {
    Vr();
  }
}
var Cs = [], Rs = [], Is = [];
function ao(e) {
  Is.push(e);
}
function si(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Rs.push(t));
}
function $s(e) {
  Cs.push(e);
}
function Ps(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function Ls(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, i]) => {
    (t === void 0 || t.includes(n)) && (i.forEach((s) => s()), delete e._x_attributeCleanups[n]);
  });
}
function ro(e) {
  for (e._x_effects?.forEach(Jr); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var ai = new MutationObserver(ci), ri = !1;
function oi() {
  ai.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), ri = !0;
}
function Ds() {
  oo(), ai.disconnect(), ri = !1;
}
var lt = [];
function oo() {
  let e = ai.takeRecords();
  lt.push(() => e.length > 0 && ci(e));
  let t = lt.length;
  queueMicrotask(() => {
    if (lt.length === t)
      for (; lt.length > 0; )
        lt.shift()();
  });
}
function B(e) {
  if (!ri)
    return e();
  Ds();
  let t = e();
  return oi(), t;
}
var li = !1, Vt = [];
function lo() {
  li = !0;
}
function co() {
  li = !1, ci(Vt), Vt = [];
}
function ci(e) {
  if (li) {
    Vt = Vt.concat(e);
    return;
  }
  let t = [], n = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (let a = 0; a < e.length; a++)
    if (!e[a].target._x_ignoreMutationObserver && (e[a].type === "childList" && (e[a].removedNodes.forEach((r) => {
      r.nodeType === 1 && r._x_marker && n.add(r);
    }), e[a].addedNodes.forEach((r) => {
      if (r.nodeType === 1) {
        if (n.has(r)) {
          n.delete(r);
          return;
        }
        r._x_marker || t.push(r);
      }
    })), e[a].type === "attributes")) {
      let r = e[a].target, o = e[a].attributeName, c = e[a].oldValue, d = () => {
        i.has(r) || i.set(r, []), i.get(r).push({ name: o, value: r.getAttribute(o) });
      }, u = () => {
        s.has(r) || s.set(r, []), s.get(r).push(o);
      };
      r.hasAttribute(o) && c === null ? d() : r.hasAttribute(o) ? (u(), d()) : u();
    }
  s.forEach((a, r) => {
    Ls(r, a);
  }), i.forEach((a, r) => {
    Cs.forEach((o) => o(r, a));
  });
  for (let a of n)
    t.some((r) => r.contains(a)) || Rs.forEach((r) => r(a));
  for (let a of t)
    a.isConnected && Is.forEach((r) => r(a));
  t = null, n = null, i = null, s = null;
}
function qs(e) {
  return Pe(et(e));
}
function At(e, t, n) {
  return e._x_dataStack = [t, ...et(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((i) => i !== t);
  };
}
function et(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? et(e.host) : e.parentNode ? et(e.parentNode) : [];
}
function Pe(e) {
  return new Proxy({ objects: e }, uo);
}
function Us(e, t) {
  return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : Us(Object.getPrototypeOf(e), t);
}
var uo = {
  ownKeys({ objects: e }) {
    return Array.from(
      new Set(e.flatMap((t) => Object.keys(t)))
    );
  },
  has({ objects: e }, t) {
    return t == Symbol.unscopables ? !1 : e.some(
      (n) => Object.prototype.hasOwnProperty.call(n, t) || Reflect.has(n, t)
    );
  },
  get({ objects: e }, t, n) {
    return t == "toJSON" ? po : Reflect.get(
      e.find(
        (i) => Reflect.has(i, t)
      ) || {},
      t,
      n
    );
  },
  set({ objects: e }, t, n, i) {
    let s;
    for (const r of e)
      if (s = Us(r, t), s)
        break;
    s || (s = e[e.length - 1]);
    const a = Object.getOwnPropertyDescriptor(s, t);
    return a?.set && a?.get ? a.set.call(i, n) || !0 : Reflect.set(s, t, n);
  }
};
function po() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function di(e, t = () => {
}) {
  let n = (s) => typeof s == "object" && !Array.isArray(s) && s !== null, i = (s, a = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(s)).forEach(([r, { value: o, enumerable: c }]) => {
      if (c === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let d = a === "" ? r : `${a}.${r}`;
      typeof o == "object" && o !== null && o._x_interceptor ? s[r] = o.initialize(e, d, r, t) : n(o) && o !== s && !(o instanceof Element) && i(o, d);
    });
  };
  return i(e);
}
function Bs(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(i, s, a, r) {
      return e(this.initialValue, () => ho(i, s), (o) => Un(i, s, o), s, a, r);
    }
  };
  return t(n), (i) => {
    if (typeof i == "object" && i !== null && i._x_interceptor) {
      let s = n.initialize.bind(n);
      n.initialize = (a, r, o, c) => {
        let d = i.initialize(a, r, o, c);
        return n.initialValue = d, s(a, r, o, c);
      };
    } else
      n.initialValue = i;
    return n;
  };
}
function ho(e, t) {
  return t.split(".").reduce((n, i) => n[i], e);
}
function Un(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Un(e[t[0]], t.slice(1), n);
  }
}
var js = {};
function se(e, t) {
  js[e] = t;
}
function Xt(e, t) {
  let n = fo(t);
  return Object.entries(js).forEach(([i, s]) => {
    Object.defineProperty(e, `$${i}`, {
      get() {
        return s(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function fo(e) {
  let [t, n] = Vs(e), i = { interceptor: Bs, ...t };
  return si(e, n), i;
}
function bo(e, t, n, ...i) {
  try {
    return n(...i);
  } catch (s) {
    ui(s, e, t);
  }
}
function ui(...e) {
  return Fs(...e);
}
var Fs = mo;
function go(e) {
  Fs = e;
}
function mo(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var Re = !0;
function Hs(e) {
  let t = Re;
  Re = !1;
  let n = e();
  return Re = t, n;
}
function Ie(e, t, n = {}) {
  let i;
  return Z(e, t)((s) => i = s, n), i;
}
function Z(...e) {
  return Ws(...e);
}
var Ws = () => {
};
function vo(e) {
  Ws = e;
}
var zs;
function yo(e) {
  zs = e;
}
function wo(e, t) {
  return (n = () => {
  }, { scope: i = {}, params: s = [], context: a } = {}) => {
    if (!Re) {
      Bn(n, t, Pe([i, ...e]), s);
      return;
    }
    let r = t.apply(Pe([i, ...e]), s);
    Bn(n, r);
  };
}
function Bn(e, t, n, i, s) {
  if (Re && typeof t == "function") {
    let a = t.apply(n, i);
    a instanceof Promise ? a.then((r) => Bn(e, r, n, i)).catch((r) => ui(r, s, t)) : e(a);
  } else typeof t == "object" && t instanceof Promise ? t.then((a) => e(a)) : e(t);
}
function _o(...e) {
  return zs(...e);
}
var pi = "x-";
function st(e = "") {
  return pi + e;
}
function xo(e) {
  pi = e;
}
var Jt = {};
function j(e, t) {
  return Jt[e] = t, {
    before(n) {
      if (!Jt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const i = Ce.indexOf(n);
      Ce.splice(i >= 0 ? i : Ce.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Eo(e) {
  return Object.keys(Jt).includes(e);
}
function hi(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let a = Object.entries(e._x_virtualDirectives).map(([o, c]) => ({ name: o, value: c })), r = Ks(a);
    a = a.map((o) => r.find((c) => c.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(a);
  }
  let i = {};
  return t.map(Zs((a, r) => i[a] = r)).filter(Qs).map(Ao(i, n)).sort(Oo).map((a) => So(e, a));
}
function Ks(e) {
  return Array.from(e).map(Zs()).filter((t) => !Qs(t));
}
var jn = !1, pt = /* @__PURE__ */ new Map(), Gs = /* @__PURE__ */ Symbol();
function ko(e) {
  jn = !0;
  let t = /* @__PURE__ */ Symbol();
  Gs = t, pt.set(t, []);
  let n = () => {
    for (; pt.get(t).length; )
      pt.get(t).shift()();
    pt.delete(t);
  }, i = () => {
    jn = !1, n();
  };
  e(n), i();
}
function Vs(e) {
  let t = [], n = (o) => t.push(o), [i, s] = io(e);
  return t.push(s), [{
    Alpine: at,
    effect: i,
    cleanup: n,
    evaluateLater: Z.bind(Z, e),
    evaluate: Ie.bind(Ie, e)
  }, () => t.forEach((o) => o())];
}
function So(e, t) {
  let n = () => {
  }, i = Jt[t.type] || n, [s, a] = Vs(e);
  Ps(e, t.original, a);
  let r = () => {
    e._x_ignore || e._x_ignoreSelf || (i.inline && i.inline(e, t, s), i = i.bind(i, e, t, s), jn ? pt.get(Gs).push(i) : i());
  };
  return r.runCleanups = a, r;
}
var Xs = (e, t) => ({ name: n, value: i }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: i }), Js = (e) => e;
function Zs(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: i, value: s } = Ys.reduce((a, r) => r(a), { name: t, value: n });
    return i !== t && e(i, t), { name: i, value: s };
  };
}
var Ys = [];
function fi(e) {
  Ys.push(e);
}
function Qs({ name: e }) {
  return ea().test(e);
}
var ea = () => new RegExp(`^${pi}([^:^.]+)\\b`);
function Ao(e, t) {
  return ({ name: n, value: i }) => {
    n === i && (i = "");
    let s = n.match(ea()), a = n.match(/:([a-zA-Z0-9\-_:]+)/), r = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: s ? s[1] : null,
      value: a ? a[1] : null,
      modifiers: r.map((c) => c.replace(".", "")),
      expression: i,
      original: o
    };
  };
}
var Fn = "DEFAULT", Ce = [
  "ignore",
  "ref",
  "id",
  "data",
  "anchor",
  "bind",
  "init",
  "for",
  "model",
  "modelable",
  "transition",
  "show",
  "if",
  Fn,
  "teleport"
];
function Oo(e, t) {
  let n = Ce.indexOf(e.type) === -1 ? Fn : e.type, i = Ce.indexOf(t.type) === -1 ? Fn : t.type;
  return Ce.indexOf(n) - Ce.indexOf(i);
}
function ht(e, t, n = {}, i = {}) {
  return e.dispatchEvent(
    new CustomEvent(t, {
      detail: n,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0,
      // Allows overriding the default event options.
      ...i
    })
  );
}
function Le(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((s) => Le(s, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let i = e.firstElementChild;
  for (; i; )
    Le(i, t), i = i.nextElementSibling;
}
function le(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var Qi = !1;
function To() {
  Qi && le("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), Qi = !0, document.body || le("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), ht(document, "alpine:init"), ht(document, "alpine:initializing"), oi(), ao((t) => fe(t, Le)), si((t) => We(t)), $s((t, n) => {
    hi(t, n).forEach((i) => i());
  });
  let e = (t) => !rn(t.parentElement, !0);
  Array.from(document.querySelectorAll(ia().join(","))).filter(e).forEach((t) => {
    fe(t);
  }), ht(document, "alpine:initialized"), setTimeout(() => {
    Ro();
  });
}
var bi = [], ta = [];
function na() {
  return bi.map((e) => e());
}
function ia() {
  return bi.concat(ta).map((e) => e());
}
function sa(e) {
  bi.push(e);
}
function aa(e) {
  ta.push(e);
}
function rn(e, t = !1) {
  return he(e, (n) => {
    if ((t ? ia() : na()).some((s) => n.matches(s)))
      return !0;
  });
}
function he(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack)
      return he(e._x_teleportBack, t);
    if (e.parentNode instanceof ShadowRoot)
      return he(e.parentNode.host, t);
    if (e.parentElement)
      return he(e.parentElement, t);
  }
}
function Mo(e) {
  return na().some((t) => e.matches(t));
}
var ra = [];
function No(e) {
  ra.push(e);
}
var Co = 1;
function fe(e, t = Le, n = () => {
}) {
  he(e, (i) => i._x_ignore) || ko(() => {
    t(e, (i, s) => {
      i._x_marker || (n(i, s), ra.forEach((a) => a(i, s)), hi(i, i.attributes).forEach((a) => a()), i._x_ignore || (i._x_marker = Co++), i._x_ignore && s());
    });
  });
}
function We(e, t = Le) {
  t(e, (n) => {
    ro(n), Ls(n), delete n._x_marker;
  });
}
function Ro() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, i]) => {
    Eo(n) || i.some((s) => {
      if (document.querySelector(s))
        return le(`found "${s}", but missing ${t} plugin`), !0;
    });
  });
}
var Hn = [], gi = !1;
function mi(e = () => {
}) {
  return queueMicrotask(() => {
    gi || setTimeout(() => {
      Wn();
    });
  }), new Promise((t) => {
    Hn.push(() => {
      e(), t();
    });
  });
}
function Wn() {
  for (gi = !1; Hn.length; )
    Hn.shift()();
}
function Io() {
  gi = !0;
}
function vi(e, t) {
  return Array.isArray(t) ? es(e, t.join(" ")) : typeof t == "object" && t !== null ? $o(e, t) : typeof t == "function" ? vi(e, t()) : es(e, t);
}
function zn(e) {
  return e.split(/\s/).filter(Boolean);
}
function es(e, t) {
  let n = (s) => zn(s).filter((a) => !e.classList.contains(a)).filter(Boolean), i = (s) => (e.classList.add(...s), () => {
    e.classList.remove(...s);
  });
  return t = t === !0 ? t = "" : t || "", i(n(t));
}
function $o(e, t) {
  let n = Object.entries(t).flatMap(([r, o]) => o ? zn(r) : !1).filter(Boolean), i = Object.entries(t).flatMap(([r, o]) => o ? !1 : zn(r)).filter(Boolean), s = [], a = [];
  return i.forEach((r) => {
    e.classList.contains(r) && (e.classList.remove(r), a.push(r));
  }), n.forEach((r) => {
    e.classList.contains(r) || (e.classList.add(r), s.push(r));
  }), () => {
    a.forEach((r) => e.classList.add(r)), s.forEach((r) => e.classList.remove(r));
  };
}
function on(e, t) {
  return typeof t == "object" && t !== null ? Po(e, t) : Lo(e, t);
}
function Po(e, t) {
  let n = {};
  return Object.entries(t).forEach(([i, s]) => {
    n[i] = e.style[i], i.startsWith("--") || (i = Do(i)), e.style.setProperty(i, s);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    on(e, n);
  };
}
function Lo(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function Do(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Kn(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
j("transition", (e, { value: t, modifiers: n, expression: i }, { evaluate: s }) => {
  typeof i == "function" && (i = s(i)), i !== !1 && (!i || typeof i == "boolean" ? Uo(e, n, t) : qo(e, i, t));
});
function qo(e, t, n) {
  oa(e, vi, ""), {
    enter: (s) => {
      e._x_transition.enter.during = s;
    },
    "enter-start": (s) => {
      e._x_transition.enter.start = s;
    },
    "enter-end": (s) => {
      e._x_transition.enter.end = s;
    },
    leave: (s) => {
      e._x_transition.leave.during = s;
    },
    "leave-start": (s) => {
      e._x_transition.leave.start = s;
    },
    "leave-end": (s) => {
      e._x_transition.leave.end = s;
    }
  }[n](t);
}
function Uo(e, t, n) {
  oa(e, on);
  let i = !t.includes("in") && !t.includes("out") && !n, s = i || t.includes("in") || ["enter"].includes(n), a = i || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !i && (t = t.filter((k, P) => P < t.indexOf("out"))), t.includes("out") && !i && (t = t.filter((k, P) => P > t.indexOf("out")));
  let r = !t.includes("opacity") && !t.includes("scale"), o = r || t.includes("opacity"), c = r || t.includes("scale"), d = o ? 0 : 1, u = c ? ct(t, "scale", 95) / 100 : 1, h = ct(t, "delay", 0) / 1e3, w = ct(t, "origin", "center"), M = "opacity, transform", C = ct(t, "duration", 150) / 1e3, m = ct(t, "duration", 75) / 1e3, v = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  s && (e._x_transition.enter.during = {
    transformOrigin: w,
    transitionDelay: `${h}s`,
    transitionProperty: M,
    transitionDuration: `${C}s`,
    transitionTimingFunction: v
  }, e._x_transition.enter.start = {
    opacity: d,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), a && (e._x_transition.leave.during = {
    transformOrigin: w,
    transitionDelay: `${h}s`,
    transitionProperty: M,
    transitionDuration: `${m}s`,
    transitionTimingFunction: v
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: d,
    transform: `scale(${u})`
  });
}
function oa(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(i = () => {
    }, s = () => {
    }) {
      Gn(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, i, s);
    },
    out(i = () => {
    }, s = () => {
    }) {
      Gn(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, i, s);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, n, i) {
  const s = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let a = () => s(n);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(n) : a() : e._x_transition ? e._x_transition.in(n) : a();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((r, o) => {
    e._x_transition.out(() => {
    }, () => r(i)), e._x_transitioning && e._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(i), queueMicrotask(() => {
    let r = la(e);
    r ? (r._x_hideChildren || (r._x_hideChildren = []), r._x_hideChildren.push(e)) : s(() => {
      let o = (c) => {
        let d = Promise.all([
          c._x_hidePromise,
          ...(c._x_hideChildren || []).map(o)
        ]).then(([u]) => u?.());
        return delete c._x_hidePromise, delete c._x_hideChildren, d;
      };
      o(e).catch((c) => {
        if (!c.isFromCancelledTransition)
          throw c;
      });
    });
  });
};
function la(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : la(t);
}
function Gn(e, t, { during: n, start: i, end: s } = {}, a = () => {
}, r = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(i).length === 0 && Object.keys(s).length === 0) {
    a(), r();
    return;
  }
  let o, c, d;
  Bo(e, {
    start() {
      o = t(e, i);
    },
    during() {
      c = t(e, n);
    },
    before: a,
    end() {
      o(), d = t(e, s);
    },
    after: r,
    cleanup() {
      c(), d();
    }
  });
}
function Bo(e, t) {
  let n, i, s, a = Kn(() => {
    B(() => {
      n = !0, i || t.before(), s || (t.end(), Wn()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(r) {
      this.beforeCancels.push(r);
    },
    cancel: Kn(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      a();
    }),
    finish: a
  }, B(() => {
    t.start(), t.during();
  }), Io(), requestAnimationFrame(() => {
    if (n)
      return;
    let r = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    r === 0 && (r = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), B(() => {
      t.before();
    }), i = !0, requestAnimationFrame(() => {
      n || (B(() => {
        t.end();
      }), Wn(), setTimeout(e._x_transitioning.finish, r + o), s = !0);
    });
  });
}
function ct(e, t, n) {
  if (e.indexOf(t) === -1)
    return n;
  const i = e[e.indexOf(t) + 1];
  if (!i || t === "scale" && isNaN(i))
    return n;
  if (t === "duration" || t === "delay") {
    let s = i.match(/([0-9]+)ms/);
    if (s)
      return s[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [i, e[e.indexOf(t) + 2]].join(" ") : i;
}
var xe = !1;
function Ee(e, t = () => {
}) {
  return (...n) => xe ? t(...n) : e(...n);
}
function jo(e) {
  return (...t) => xe && e(...t);
}
var ca = [];
function ln(e) {
  ca.push(e);
}
function Fo(e, t) {
  ca.forEach((n) => n(e, t)), xe = !0, da(() => {
    fe(t, (n, i) => {
      i(n, () => {
      });
    });
  }), xe = !1;
}
var Vn = !1;
function Ho(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), xe = !0, Vn = !0, da(() => {
    Wo(t);
  }), xe = !1, Vn = !1;
}
function Wo(e) {
  let t = !1;
  fe(e, (i, s) => {
    Le(i, (a, r) => {
      if (t && Mo(a))
        return r();
      t = !0, s(a, r);
    });
  });
}
function da(e) {
  let t = He;
  Yi((n, i) => {
    let s = t(n);
    return it(s), () => {
    };
  }), e(), Yi(t);
}
function ua(e, t, n, i = []) {
  switch (e._x_bindings || (e._x_bindings = nt({})), e._x_bindings[t] = n, t = i.includes("camel") ? Yo(t) : t, t) {
    case "value":
      zo(e, n);
      break;
    case "style":
      Go(e, n);
      break;
    case "class":
      Ko(e, n);
      break;
    case "selected":
    case "checked":
      Vo(e, t, n);
      break;
    default:
      yi(e, t, n);
      break;
  }
}
function zo(e, t) {
  if (wi(e))
    e.attributes.value === void 0 && (e.value = t);
  else if (Zt(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Qo(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Zo(e, t);
  else if (e.tagName === "OPTION")
    yi(e, "value", t);
  else {
    if (e.value === t && (typeof t != "object" || t === null))
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Ko(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = vi(e, t);
}
function Go(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = on(e, t);
}
function Vo(e, t, n) {
  yi(e, t, n), Jo(e, t, n);
}
function yi(e, t, n) {
  [null, void 0, !1].includes(n) && tl(t) ? e.removeAttribute(t) : (pa(t) && (n = t), nl(n) && (n = JSON.stringify(n)), Xo(e, t, n));
}
function Xo(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function Jo(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Zo(e, t) {
  const n = [].concat(t).map((i) => i + "");
  Array.from(e.options).forEach((i) => {
    i.selected = n.includes(i.value);
  });
}
function Yo(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Qo(e, t) {
  return e == t;
}
function zt(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var el = /* @__PURE__ */ new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "inert",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
  "shadowrootclonable",
  "shadowrootdelegatesfocus",
  "shadowrootserializable"
]);
function pa(e) {
  return el.has(e);
}
function tl(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function nl(e) {
  return typeof e == "object" && e !== null;
}
function il(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : ha(e, t, n);
}
function sl(e, t, n, i = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let s = e._x_inlineBindings[t];
    return s.extract = i, Hs(() => Ie(e, s.expression));
  }
  return ha(e, t, n);
}
function ha(e, t, n) {
  let i = e.getAttribute(t);
  return i === null ? typeof n == "function" ? n() : n : i === "" ? !0 : pa(t) ? !![t, "true"].includes(i) : i;
}
function Zt(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function wi(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function fa(e, t) {
  let n;
  return function() {
    const i = this, s = arguments, a = function() {
      n = null, e.apply(i, s);
    };
    clearTimeout(n), n = setTimeout(a, t);
  };
}
function ba(e, t) {
  let n;
  return function() {
    let i = this, s = arguments;
    n || (e.apply(i, s), n = !0, setTimeout(() => n = !1, t));
  };
}
function ga({ get: e, set: t }, { get: n, set: i }) {
  let s = !0, a, r = He(() => {
    let o = e(), c = n();
    if (s)
      i(Sn(o)), s = !1;
    else {
      let d = JSON.stringify(o), u = JSON.stringify(c);
      d !== a ? i(Sn(o)) : d !== u && t(Sn(c));
    }
    a = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    it(r);
  };
}
function Sn(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function al(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(at));
}
var ue = {}, ts = !1;
function rl(e, t) {
  if (ts || (ue = nt(ue), ts = !0), t === void 0)
    return ue[e];
  ue[e] = t, typeof t == "object" && t !== null && t._x_interceptor ? ue[e] = t.initialize(ue, e, e, () => {
  }) : di(ue[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ue[e].init();
}
function ol() {
  return ue;
}
var ma = {};
function ll(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? va(e, n()) : (ma[e] = n, () => {
  });
}
function cl(e) {
  return Object.entries(ma).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...i) => n(...i);
      }
    });
  }), e;
}
function va(e, t, n) {
  let i = [];
  for (; i.length; )
    i.pop()();
  let s = Object.entries(t).map(([r, o]) => ({ name: r, value: o })), a = Ks(s);
  return s = s.map((r) => a.find((o) => o.name === r.name) ? {
    name: `x-bind:${r.name}`,
    value: `"${r.value}"`
  } : r), hi(e, s, n).map((r) => {
    i.push(r.runCleanups), r();
  }), () => {
    for (; i.length; )
      i.pop()();
  };
}
var ya = {};
function dl(e, t) {
  ya[e] = t;
}
function ul(e, t) {
  return Object.entries(ya).forEach(([n, i]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...s) => i.bind(t)(...s);
      },
      enumerable: !1
    });
  }), e;
}
var pl = {
  get reactive() {
    return nt;
  },
  get release() {
    return it;
  },
  get effect() {
    return He;
  },
  get raw() {
    return Ms;
  },
  get transaction() {
    return so;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: co,
  dontAutoEvaluateFunctions: Hs,
  disableEffectScheduling: to,
  startObservingMutations: oi,
  stopObservingMutations: Ds,
  setReactivityEngine: no,
  onAttributeRemoved: Ps,
  onAttributesAdded: $s,
  closestDataStack: et,
  skipDuringClone: Ee,
  onlyDuringClone: jo,
  addRootSelector: sa,
  addInitSelector: aa,
  setErrorHandler: go,
  interceptClone: ln,
  addScopeToNode: At,
  deferMutations: lo,
  mapAttributes: fi,
  evaluateLater: Z,
  interceptInit: No,
  initInterceptors: di,
  injectMagics: Xt,
  setEvaluator: vo,
  setRawEvaluator: yo,
  mergeProxies: Pe,
  extractProp: sl,
  findClosest: he,
  onElRemoved: si,
  closestRoot: rn,
  destroyTree: We,
  interceptor: Bs,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Gn,
  // INTERNAL
  setStyles: on,
  // INTERNAL
  mutateDom: B,
  directive: j,
  entangle: ga,
  throttle: ba,
  debounce: fa,
  evaluate: Ie,
  evaluateRaw: _o,
  initTree: fe,
  nextTick: mi,
  prefixed: st,
  prefix: xo,
  plugin: al,
  magic: se,
  store: rl,
  start: To,
  clone: Ho,
  // INTERNAL
  cloneNode: Fo,
  // INTERNAL
  bound: il,
  $data: qs,
  watch: Ns,
  walk: Le,
  data: dl,
  bind: ll
}, at = pl, ns = /* @__PURE__ */ new WeakMap(), wa = /* @__PURE__ */ new Set();
Object.getOwnPropertyNames(globalThis).forEach((e) => {
  e === "styleMedia" || e === "sharedStorage" || wa.add(globalThis[e]);
});
var z = class {
  constructor(e, t, n, i) {
    this.type = e, this.value = t, this.start = n, this.end = i;
  }
}, hl = class {
  constructor(e) {
    this.input = e, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const e = this.input[this.position];
      this.isDigit(e) ? this.readNumber() : this.isAlpha(e) || e === "_" || e === "$" ? this.readIdentifierOrKeyword() : e === '"' || e === "'" ? this.readString() : e === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new z("EOF", null, this.position, this.position)), this.tokens;
  }
  skipWhitespace() {
    for (; this.position < this.input.length && /\s/.test(this.input[this.position]); )
      this.position++;
  }
  skipLineComment() {
    for (; this.position < this.input.length && this.input[this.position] !== `
`; )
      this.position++;
  }
  isDigit(e) {
    return /[0-9]/.test(e);
  }
  isAlpha(e) {
    return /[a-zA-Z]/.test(e);
  }
  isAlphaNumeric(e) {
    return /[a-zA-Z0-9_$]/.test(e);
  }
  peek(e = 1) {
    return this.input[this.position + e] || "";
  }
  readNumber() {
    const e = this.position;
    let t = !1;
    for (; this.position < this.input.length; ) {
      const i = this.input[this.position];
      if (this.isDigit(i))
        this.position++;
      else if (i === "." && !t)
        t = !0, this.position++;
      else
        break;
    }
    const n = this.input.slice(e, this.position);
    this.tokens.push(new z("NUMBER", parseFloat(n), e, this.position));
  }
  readIdentifierOrKeyword() {
    const e = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const t = this.input.slice(e, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(t) ? t === "true" || t === "false" ? this.tokens.push(new z("BOOLEAN", t === "true", e, this.position)) : t === "null" ? this.tokens.push(new z("NULL", null, e, this.position)) : t === "undefined" ? this.tokens.push(new z("UNDEFINED", void 0, e, this.position)) : this.tokens.push(new z("KEYWORD", t, e, this.position)) : this.tokens.push(new z("IDENTIFIER", t, e, this.position));
  }
  readString() {
    const e = this.position, t = this.input[this.position];
    this.position++;
    let n = "", i = !1;
    for (; this.position < this.input.length; ) {
      const s = this.input[this.position];
      if (i) {
        switch (s) {
          case "n":
            n += `
`;
            break;
          case "t":
            n += "	";
            break;
          case "r":
            n += "\r";
            break;
          case "\\":
            n += "\\";
            break;
          case t:
            n += t;
            break;
          default:
            n += s;
        }
        i = !1;
      } else if (s === "\\")
        i = !0;
      else if (s === t) {
        this.position++, this.tokens.push(new z("STRING", n, e, this.position));
        return;
      } else
        n += s;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${e}`);
  }
  readOperatorOrPunctuation() {
    const e = this.position, t = this.input[this.position], n = this.peek(), i = this.peek(2);
    if (t === "=" && n === "=" && i === "=")
      this.position += 3, this.tokens.push(new z("OPERATOR", "===", e, this.position));
    else if (t === "!" && n === "=" && i === "=")
      this.position += 3, this.tokens.push(new z("OPERATOR", "!==", e, this.position));
    else if (t === "=" && n === "=")
      this.position += 2, this.tokens.push(new z("OPERATOR", "==", e, this.position));
    else if (t === "!" && n === "=")
      this.position += 2, this.tokens.push(new z("OPERATOR", "!=", e, this.position));
    else if (t === "<" && n === "=")
      this.position += 2, this.tokens.push(new z("OPERATOR", "<=", e, this.position));
    else if (t === ">" && n === "=")
      this.position += 2, this.tokens.push(new z("OPERATOR", ">=", e, this.position));
    else if (t === "&" && n === "&")
      this.position += 2, this.tokens.push(new z("OPERATOR", "&&", e, this.position));
    else if (t === "|" && n === "|")
      this.position += 2, this.tokens.push(new z("OPERATOR", "||", e, this.position));
    else if (t === "+" && n === "+")
      this.position += 2, this.tokens.push(new z("OPERATOR", "++", e, this.position));
    else if (t === "-" && n === "-")
      this.position += 2, this.tokens.push(new z("OPERATOR", "--", e, this.position));
    else {
      this.position++;
      const s = "()[]{},.;:?".includes(t) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new z(s, t, e, this.position));
    }
  }
}, fl = class {
  constructor(e) {
    this.tokens = e, this.position = 0;
  }
  parse() {
    if (this.isAtEnd())
      throw new Error("Empty expression");
    const e = this.parseExpression();
    if (this.match("PUNCTUATION", ";"), !this.isAtEnd())
      throw new Error(`Unexpected token: ${this.current().value}`);
    return e;
  }
  parseExpression() {
    return this.parseAssignment();
  }
  parseAssignment() {
    const e = this.parseTernary();
    if (this.match("OPERATOR", "=")) {
      const t = this.parseAssignment();
      if (e.type === "Identifier" || e.type === "MemberExpression")
        return {
          type: "AssignmentExpression",
          left: e,
          operator: "=",
          right: t
        };
      throw new Error("Invalid assignment target");
    }
    return e;
  }
  parseTernary() {
    const e = this.parseLogicalOr();
    if (this.match("PUNCTUATION", "?")) {
      const t = this.parseExpression();
      this.consume("PUNCTUATION", ":");
      const n = this.parseExpression();
      return {
        type: "ConditionalExpression",
        test: e,
        consequent: t,
        alternate: n
      };
    }
    return e;
  }
  parseLogicalOr() {
    let e = this.parseLogicalAnd();
    for (; this.match("OPERATOR", "||"); ) {
      const t = this.previous().value, n = this.parseLogicalAnd();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseLogicalAnd() {
    let e = this.parseEquality();
    for (; this.match("OPERATOR", "&&"); ) {
      const t = this.previous().value, n = this.parseEquality();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseEquality() {
    let e = this.parseRelational();
    for (; this.match("OPERATOR", "==", "!=", "===", "!=="); ) {
      const t = this.previous().value, n = this.parseRelational();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseRelational() {
    let e = this.parseAdditive();
    for (; this.match("OPERATOR", "<", ">", "<=", ">="); ) {
      const t = this.previous().value, n = this.parseAdditive();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseAdditive() {
    let e = this.parseMultiplicative();
    for (; this.match("OPERATOR", "+", "-"); ) {
      const t = this.previous().value, n = this.parseMultiplicative();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseMultiplicative() {
    let e = this.parseUnary();
    for (; this.match("OPERATOR", "*", "/", "%"); ) {
      const t = this.previous().value, n = this.parseUnary();
      e = {
        type: "BinaryExpression",
        operator: t,
        left: e,
        right: n
      };
    }
    return e;
  }
  parseUnary() {
    if (this.match("OPERATOR", "++", "--")) {
      const e = this.previous().value, t = this.parseUnary();
      return {
        type: "UpdateExpression",
        operator: e,
        argument: t,
        prefix: !0
      };
    }
    if (this.match("OPERATOR", "!", "-", "+")) {
      const e = this.previous().value, t = this.parseUnary();
      return {
        type: "UnaryExpression",
        operator: e,
        argument: t,
        prefix: !0
      };
    }
    return this.parsePostfix();
  }
  parsePostfix() {
    let e = this.parseMember();
    return this.match("OPERATOR", "++", "--") ? {
      type: "UpdateExpression",
      operator: this.previous().value,
      argument: e,
      prefix: !1
    } : e;
  }
  parseMember() {
    let e = this.parsePrimary();
    for (; ; )
      if (this.match("PUNCTUATION", ".")) {
        const t = this.consume("IDENTIFIER");
        e = {
          type: "MemberExpression",
          object: e,
          property: { type: "Identifier", name: t.value },
          computed: !1
        };
      } else if (this.match("PUNCTUATION", "[")) {
        const t = this.parseExpression();
        this.consume("PUNCTUATION", "]"), e = {
          type: "MemberExpression",
          object: e,
          property: t,
          computed: !0
        };
      } else if (this.match("PUNCTUATION", "(")) {
        const t = this.parseArguments();
        e = {
          type: "CallExpression",
          callee: e,
          arguments: t
        };
      } else
        break;
    return e;
  }
  parseArguments() {
    const e = [];
    if (!this.check("PUNCTUATION", ")"))
      do
        e.push(this.parseExpression());
      while (this.match("PUNCTUATION", ","));
    return this.consume("PUNCTUATION", ")"), e;
  }
  parsePrimary() {
    if (this.match("NUMBER"))
      return { type: "Literal", value: this.previous().value };
    if (this.match("STRING"))
      return { type: "Literal", value: this.previous().value };
    if (this.match("BOOLEAN"))
      return { type: "Literal", value: this.previous().value };
    if (this.match("NULL"))
      return { type: "Literal", value: null };
    if (this.match("UNDEFINED"))
      return { type: "Literal", value: void 0 };
    if (this.match("IDENTIFIER"))
      return { type: "Identifier", name: this.previous().value };
    if (this.match("PUNCTUATION", "(")) {
      const e = this.parseExpression();
      return this.consume("PUNCTUATION", ")"), e;
    }
    if (this.match("PUNCTUATION", "["))
      return this.parseArrayLiteral();
    if (this.match("PUNCTUATION", "{"))
      return this.parseObjectLiteral();
    throw new Error(`Unexpected token: ${this.current().type} "${this.current().value}"`);
  }
  parseArrayLiteral() {
    const e = [];
    for (; !this.check("PUNCTUATION", "]") && !this.isAtEnd() && (e.push(this.parseExpression()), this.match("PUNCTUATION", ",")); )
      if (this.check("PUNCTUATION", "]"))
        break;
    return this.consume("PUNCTUATION", "]"), {
      type: "ArrayExpression",
      elements: e
    };
  }
  parseObjectLiteral() {
    const e = [];
    for (; !this.check("PUNCTUATION", "}") && !this.isAtEnd(); ) {
      let t, n = !1;
      if (this.match("STRING"))
        t = { type: "Literal", value: this.previous().value };
      else if (this.match("IDENTIFIER"))
        t = { type: "Identifier", name: this.previous().value };
      else if (this.match("PUNCTUATION", "["))
        t = this.parseExpression(), n = !0, this.consume("PUNCTUATION", "]");
      else
        throw new Error("Expected property key");
      this.consume("PUNCTUATION", ":");
      const i = this.parseExpression();
      if (e.push({
        type: "Property",
        key: t,
        value: i,
        computed: n,
        shorthand: !1
      }), this.match("PUNCTUATION", ",")) {
        if (this.check("PUNCTUATION", "}"))
          break;
      } else
        break;
    }
    return this.consume("PUNCTUATION", "}"), {
      type: "ObjectExpression",
      properties: e
    };
  }
  match(...e) {
    for (let t = 0; t < e.length; t++) {
      const n = e[t];
      if (t === 0 && e.length > 1) {
        const i = n;
        for (let s = 1; s < e.length; s++)
          if (this.check(i, e[s]))
            return this.advance(), !0;
        return !1;
      } else if (e.length === 1)
        return this.checkType(n) ? (this.advance(), !0) : !1;
    }
    return !1;
  }
  check(e, t) {
    return this.isAtEnd() ? !1 : t !== void 0 ? this.current().type === e && this.current().value === t : this.current().type === e;
  }
  checkType(e) {
    return this.isAtEnd() ? !1 : this.current().type === e;
  }
  advance() {
    return this.isAtEnd() || this.position++, this.previous();
  }
  isAtEnd() {
    return this.current().type === "EOF";
  }
  current() {
    return this.tokens[this.position];
  }
  previous() {
    return this.tokens[this.position - 1];
  }
  consume(e, t) {
    if (t !== void 0) {
      if (this.check(e, t))
        return this.advance();
      throw new Error(`Expected ${e} "${t}" but got ${this.current().type} "${this.current().value}"`);
    }
    if (this.check(e))
      return this.advance();
    throw new Error(`Expected ${e} but got ${this.current().type} "${this.current().value}"`);
  }
}, bl = class {
  evaluate({ node: e, scope: t = {}, context: n = null, forceBindingRootScopeToFunctions: i = !0 }) {
    switch (e.type) {
      case "Literal":
        return e.value;
      case "Identifier":
        if (e.name in t) {
          const v = t[e.name];
          return this.checkForDangerousValues(v), typeof v == "function" ? v.bind(t) : v;
        }
        throw new Error(`Undefined variable: ${e.name}`);
      case "MemberExpression":
        const s = this.evaluate({ node: e.object, scope: t, context: n, forceBindingRootScopeToFunctions: i });
        if (s == null)
          throw new Error("Cannot read property of null or undefined");
        let a;
        e.computed ? a = this.evaluate({ node: e.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : a = e.property.name, this.checkForDangerousKeywords(a);
        let r = s[a];
        return this.checkForDangerousValues(r), typeof r == "function" ? i ? r.bind(t) : r.bind(s) : r;
      case "CallExpression":
        const o = e.arguments.map((v) => this.evaluate({ node: v, scope: t, context: n, forceBindingRootScopeToFunctions: i }));
        let c;
        if (e.callee.type === "MemberExpression") {
          const v = this.evaluate({ node: e.callee.object, scope: t, context: n, forceBindingRootScopeToFunctions: i });
          let k;
          e.callee.computed ? k = this.evaluate({ node: e.callee.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : k = e.callee.property.name, this.checkForDangerousKeywords(k);
          let P = v[k];
          if (typeof P != "function")
            throw new Error("Value is not a function");
          c = P.apply(v, o);
        } else if (e.callee.type === "Identifier") {
          const v = e.callee.name;
          let k;
          if (v in t)
            k = t[v];
          else
            throw new Error(`Undefined variable: ${v}`);
          if (typeof k != "function")
            throw new Error("Value is not a function");
          const P = n !== null ? n : t;
          c = k.apply(P, o);
        } else {
          const v = this.evaluate({ node: e.callee, scope: t, context: n, forceBindingRootScopeToFunctions: i });
          if (typeof v != "function")
            throw new Error("Value is not a function");
          c = v.apply(n, o);
        }
        return this.checkForDangerousValues(c), c;
      case "UnaryExpression":
        const d = this.evaluate({ node: e.argument, scope: t, context: n, forceBindingRootScopeToFunctions: i });
        switch (e.operator) {
          case "!":
            return !d;
          case "-":
            return -d;
          case "+":
            return +d;
          default:
            throw new Error(`Unknown unary operator: ${e.operator}`);
        }
      case "UpdateExpression":
        if (e.argument.type === "Identifier") {
          const v = e.argument.name;
          if (!(v in t))
            throw new Error(`Undefined variable: ${v}`);
          const k = t[v];
          return e.operator === "++" ? t[v] = k + 1 : e.operator === "--" && (t[v] = k - 1), e.prefix ? t[v] : k;
        } else if (e.argument.type === "MemberExpression") {
          const v = this.evaluate({ node: e.argument.object, scope: t, context: n, forceBindingRootScopeToFunctions: i }), k = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : e.argument.property.name;
          if (this.isDOMObject(v))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          this.checkForDangerousKeywords(k);
          const P = v[k];
          return e.operator === "++" ? v[k] = P + 1 : e.operator === "--" && (v[k] = P - 1), e.prefix ? v[k] : P;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const u = this.evaluate({ node: e.left, scope: t, context: n, forceBindingRootScopeToFunctions: i }), h = () => this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: i });
        if (e.operator === "&&")
          return u && h();
        if (e.operator === "||")
          return u || h();
        const w = h();
        switch (e.operator) {
          case "+":
            return u + w;
          case "-":
            return u - w;
          case "*":
            return u * w;
          case "/":
            return u / w;
          case "%":
            return u % w;
          case "==":
            return u == w;
          case "!=":
            return u != w;
          case "===":
            return u === w;
          case "!==":
            return u !== w;
          case "<":
            return u < w;
          case ">":
            return u > w;
          case "<=":
            return u <= w;
          case ">=":
            return u >= w;
          default:
            throw new Error(`Unknown binary operator: ${e.operator}`);
        }
      case "ConditionalExpression":
        return this.evaluate({ node: e.test, scope: t, context: n, forceBindingRootScopeToFunctions: i }) ? this.evaluate({ node: e.consequent, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : this.evaluate({ node: e.alternate, scope: t, context: n, forceBindingRootScopeToFunctions: i });
      case "AssignmentExpression":
        const C = this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: i });
        if (e.left.type === "Identifier")
          return t[e.left.name] = C, C;
        if (e.left.type === "MemberExpression") {
          const v = this.evaluate({ node: e.left.object, scope: t, context: n, forceBindingRootScopeToFunctions: i }), k = e.left.computed ? this.evaluate({ node: e.left.property, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : e.left.property.name;
          if (this.isDOMObject(v))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          return this.checkForDangerousKeywords(k), v[k] = C, C;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((v) => this.evaluate({ node: v, scope: t, context: n, forceBindingRootScopeToFunctions: i }));
      case "ObjectExpression":
        const m = {};
        for (const v of e.properties) {
          const k = v.computed ? this.evaluate({ node: v.key, scope: t, context: n, forceBindingRootScopeToFunctions: i }) : v.key.type === "Identifier" ? v.key.name : this.evaluate({ node: v.key, scope: t, context: n, forceBindingRootScopeToFunctions: i }), P = this.evaluate({ node: v.value, scope: t, context: n, forceBindingRootScopeToFunctions: i });
          m[k] = P;
        }
        return m;
      default:
        throw new Error(`Unknown node type: ${e.type}`);
    }
  }
  isDOMObject(e) {
    return e instanceof Node || typeof CSSStyleDeclaration < "u" && e instanceof CSSStyleDeclaration || typeof DOMStringMap < "u" && e instanceof DOMStringMap || typeof DOMTokenList < "u" && e instanceof DOMTokenList || typeof NamedNodeMap < "u" && e instanceof NamedNodeMap;
  }
  checkForDangerousKeywords(e) {
    if ([
      "constructor",
      "prototype",
      "__proto__",
      "__defineGetter__",
      "__defineSetter__",
      "insertAdjacentHTML",
      "setAttribute",
      "setAttributeNS",
      "setAttributeNode",
      "setAttributeNodeNS"
    ].includes(e))
      throw new Error(`Accessing "${e}" is prohibited in the CSP build`);
  }
  checkForDangerousValues(e) {
    if (e !== null && !(typeof e != "object" && typeof e != "function") && !ns.has(e)) {
      if (e instanceof HTMLIFrameElement || e instanceof HTMLScriptElement)
        throw new Error("Accessing iframes and scripts is prohibited in the CSP build");
      if (wa.has(e))
        throw new Error("Accessing global variables is prohibited in the CSP build");
      return ns.set(e, !0), !0;
    }
  }
};
function _a(e) {
  try {
    const n = new hl(e).tokenize(), s = new fl(n).parse(), a = new bl();
    return function(r = {}) {
      const { scope: o = {}, context: c = null, forceBindingRootScopeToFunctions: d = !1 } = r;
      return a.evaluate({ node: s, scope: o, context: c, forceBindingRootScopeToFunctions: d });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function gl(e, t, n = {}) {
  let i = xa(e), s = Pe([n.scope ?? {}, ...i]), a = n.params ?? [], o = _a(t)({
    scope: s,
    forceBindingRootScopeToFunctions: !0
  });
  return typeof o == "function" && Re ? o.apply(s, a) : o;
}
function ml(e, t) {
  let n = xa(e);
  if (typeof t == "function")
    return wo(n, t);
  let i = vl(e, t, n);
  return bo.bind(null, e, t, i);
}
function xa(e) {
  let t = {};
  return Xt(t, e), [t, ...et(e)];
}
function vl(e, t, n) {
  if (e instanceof HTMLIFrameElement)
    throw new Error("Evaluating expressions on an iframe is prohibited in the CSP build");
  if (e instanceof HTMLScriptElement)
    throw new Error("Evaluating expressions on a script is prohibited in the CSP build");
  return (i = () => {
  }, { scope: s = {}, params: a = [] } = {}) => {
    let r = Pe([s, ...n]), c = _a(t)({
      scope: r,
      forceBindingRootScopeToFunctions: !0
    });
    if (Re && typeof c == "function") {
      let d = c.apply(c, a);
      d instanceof Promise ? d.then((u) => i(u)) : i(d);
    } else typeof c == "object" && c instanceof Promise ? c.then((d) => i(d)) : i(c);
  };
}
function yl(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(","))
    t[n] = 1;
  return (n) => n in t;
}
var yt = Object.assign, wl = Object.prototype.hasOwnProperty, Xn = (e, t) => wl.call(e, t), wt = Array.isArray, ft = (e) => Ea(e) === "[object Map]", _l = (e) => typeof e == "string", Ot = (e) => typeof e == "symbol", _t = (e) => e !== null && typeof e == "object", xl = Object.prototype.toString, Ea = (e) => xl.call(e), ka = (e) => Ea(e).slice(8, -1), _i = (e) => _l(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, El = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, kl = El((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ne = (e, t) => !Object.is(e, t);
function De(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var I, An = /* @__PURE__ */ new WeakSet(), is = class {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, An.has(this) && (An.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Sl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ss(this), Aa(this);
    const e = I, t = ie;
    I = this, ie = !0;
    try {
      return this.fn();
    } finally {
      I !== this && De(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Oa(this), I = e, ie = t, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        ki(e);
      this.deps = this.depsTail = void 0, ss(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? An.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    Jn(this) && this.run();
  }
  get dirty() {
    return Jn(this);
  }
}, Sa = 0, bt, gt;
function Sl(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = gt, gt = e;
    return;
  }
  e.next = bt, bt = e;
}
function xi() {
  Sa++;
}
function Ei() {
  if (--Sa > 0)
    return;
  if (gt) {
    let t = gt;
    for (gt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; bt; ) {
    let t = bt;
    for (bt = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (i) {
          e || (e = i);
        }
      t = n;
    }
  }
  if (e)
    throw e;
}
function Aa(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Oa(e) {
  let t, n = e.depsTail, i = n;
  for (; i; ) {
    const s = i.prevDep;
    i.version === -1 ? (i === n && (n = s), ki(i), Ol(i)) : t = i, i.dep.activeLink = i.prevActiveLink, i.prevActiveLink = void 0, i = s;
  }
  e.deps = t, e.depsTail = n;
}
function Jn(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Al(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Al(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === Yt) || (e.globalVersion = Yt, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Jn(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = I, i = ie;
  I = e, ie = !0;
  try {
    Aa(e);
    const s = e.fn(e._value);
    (t.version === 0 || Ne(s, e._value)) && (e.flags |= 128, e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    I = n, ie = i, Oa(e), e.flags &= -3;
  }
}
function ki(e, t = !1) {
  const { dep: n, prevSub: i, nextSub: s } = e;
  if (i && (i.nextSub = s, e.prevSub = void 0), s && (s.prevSub = i, e.nextSub = void 0), n.subsHead === e && (n.subsHead = s), n.subs === e && (n.subs = i, !i && n.computed)) {
    n.computed.flags &= -5;
    for (let a = n.computed.deps; a; a = a.nextDep)
      ki(a, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ol(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function Tl(e, t) {
  e.effect instanceof is && (e = e.effect.fn);
  const n = new is(e);
  t && yt(n, t);
  try {
    n.run();
  } catch (s) {
    throw n.stop(), s;
  }
  const i = n.run.bind(n);
  return i.effect = n, i;
}
function Ml(e) {
  e.effect.stop();
}
var ie = !0, Ta = [];
function Nl() {
  Ta.push(ie), ie = !1;
}
function Cl() {
  const e = Ta.pop();
  ie = e === void 0 ? !0 : e;
}
function ss(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = I;
    I = void 0;
    try {
      t();
    } finally {
      I = n;
    }
  }
}
var Yt = 0, Rl = class {
  constructor(e, t) {
    this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, Il = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(e) {
    if (!I || !ie || I === this.computed)
      return;
    let t = this.activeLink;
    if (t === void 0 || t.sub !== I)
      t = this.activeLink = new Rl(I, this), I.deps ? (t.prevDep = I.depsTail, I.depsTail.nextDep = t, I.depsTail = t) : I.deps = I.depsTail = t, Ma(t);
    else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
      const n = t.nextDep;
      n.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = n), t.prevDep = I.depsTail, t.nextDep = void 0, I.depsTail.nextDep = t, I.depsTail = t, I.deps === t && (I.deps = n);
    }
    return I.onTrack && I.onTrack(
      yt(
        {
          effect: I
        },
        e
      )
    ), t;
  }
  trigger(e) {
    this.version++, Yt++, this.notify(e);
  }
  notify(e) {
    xi();
    try {
      for (let t = this.subsHead; t; t = t.nextSub)
        t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(
          yt(
            {
              effect: t.sub
            },
            e
          )
        );
      for (let t = this.subs; t; t = t.prevSub)
        t.sub.notify() && t.sub.dep.notify();
    } finally {
      Ei();
    }
  }
};
function Ma(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let i = t.deps; i; i = i.nextDep)
        Ma(i);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
var Zn = /* @__PURE__ */ new WeakMap(), $e = /* @__PURE__ */ Symbol(
  "Object iterate"
), Yn = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), xt = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function Y(e, t, n) {
  if (ie && I) {
    let i = Zn.get(e);
    i || Zn.set(e, i = /* @__PURE__ */ new Map());
    let s = i.get(n);
    s || (i.set(n, s = new Il()), s.map = i, s.key = n), s.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function _e(e, t, n, i, s, a) {
  const r = Zn.get(e);
  if (!r) {
    Yt++;
    return;
  }
  const o = (c) => {
    c && c.trigger({
      target: e,
      type: t,
      key: n,
      newValue: i,
      oldValue: s,
      oldTarget: a
    });
  };
  if (xi(), t === "clear")
    r.forEach(o);
  else {
    const c = wt(e), d = c && _i(n);
    if (c && n === "length") {
      const u = Number(i);
      r.forEach((h, w) => {
        (w === "length" || w === xt || !Ot(w) && w >= u) && o(h);
      });
    } else
      switch ((n !== void 0 || r.has(void 0)) && o(r.get(n)), d && o(r.get(xt)), t) {
        case "add":
          c ? d && o(r.get("length")) : (o(r.get($e)), ft(e) && o(r.get(Yn)));
          break;
        case "delete":
          c || (o(r.get($e)), ft(e) && o(r.get(Yn)));
          break;
        case "set":
          ft(e) && o(r.get($e));
          break;
      }
  }
  Ei();
}
function Ze(e) {
  const t = $(e);
  return t === e ? t : (Y(t, "iterate", xt), Ue(e) ? t : t.map(Be));
}
function Si(e) {
  return Y(e = $(e), "iterate", xt), e;
}
function oe(e, t) {
  return qe(e) ? La(e) ? Et(Be(t)) : Et(t) : Be(t);
}
var $l = {
  __proto__: null,
  [Symbol.iterator]() {
    return On(this, Symbol.iterator, (e) => oe(this, e));
  },
  concat(...e) {
    return Ze(this).concat(
      ...e.map((t) => wt(t) ? Ze(t) : t)
    );
  },
  entries() {
    return On(this, "entries", (e) => (e[1] = oe(this, e[1]), e));
  },
  every(e, t) {
    return de(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return de(
      this,
      "filter",
      e,
      t,
      (n) => n.map((i) => oe(this, i)),
      arguments
    );
  },
  find(e, t) {
    return de(
      this,
      "find",
      e,
      t,
      (n) => oe(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return de(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return de(
      this,
      "findLast",
      e,
      t,
      (n) => oe(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return de(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return de(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Tn(this, "includes", e);
  },
  indexOf(...e) {
    return Tn(this, "indexOf", e);
  },
  join(e) {
    return Ze(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Tn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return de(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return dt(this, "pop");
  },
  push(...e) {
    return dt(this, "push", e);
  },
  reduce(e, ...t) {
    return as(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return as(this, "reduceRight", e, t);
  },
  shift() {
    return dt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return de(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return dt(this, "splice", e);
  },
  toReversed() {
    return Ze(this).toReversed();
  },
  toSorted(e) {
    return Ze(this).toSorted(e);
  },
  toSpliced(...e) {
    return Ze(this).toSpliced(...e);
  },
  unshift(...e) {
    return dt(this, "unshift", e);
  },
  values() {
    return On(this, "values", (e) => oe(this, e));
  }
};
function On(e, t, n) {
  const i = Si(e), s = i[t]();
  return i !== e && !Ue(e) && (s._next = s.next, s.next = () => {
    const a = s._next();
    return a.done || (a.value = n(a.value)), a;
  }), s;
}
var Pl = Array.prototype;
function de(e, t, n, i, s, a) {
  const r = Si(e), o = r !== e && !Ue(e), c = r[t];
  if (c !== Pl[t]) {
    const h = c.apply(e, a);
    return o ? Be(h) : h;
  }
  let d = n;
  r !== e && (o ? d = function(h, w) {
    return n.call(this, oe(e, h), w, e);
  } : n.length > 2 && (d = function(h, w) {
    return n.call(this, h, w, e);
  }));
  const u = c.call(r, d, i);
  return o && s ? s(u) : u;
}
function as(e, t, n, i) {
  const s = Si(e), a = s !== e && !Ue(e);
  let r = n, o = !1;
  s !== e && (a ? (o = i.length === 0, r = function(d, u, h) {
    return o && (o = !1, d = oe(e, d)), n.call(this, d, oe(e, u), h, e);
  }) : n.length > 3 && (r = function(d, u, h) {
    return n.call(this, d, u, h, e);
  }));
  const c = s[t](r, ...i);
  return o ? oe(e, c) : c;
}
function Tn(e, t, n) {
  const i = $(e);
  Y(i, "iterate", xt);
  const s = i[t](...n);
  return (s === -1 || s === !1) && Xl(n[0]) ? (n[0] = $(n[0]), i[t](...n)) : s;
}
function dt(e, t, n = []) {
  Nl(), xi();
  const i = $(e)[t].apply(e, n);
  return Ei(), Cl(), i;
}
var Ll = /* @__PURE__ */ yl("__proto__,__v_isRef,__isVue"), Na = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Ot)
);
function Dl(e) {
  Ot(e) || (e = String(e));
  const t = $(this);
  return Y(t, "has", e), t.hasOwnProperty(e);
}
var Ca = class {
  constructor(e = !1, t = !1) {
    this._isReadonly = e, this._isShallow = t;
  }
  get(e, t, n) {
    if (t === "__v_skip")
      return e.__v_skip;
    const i = this._isReadonly, s = this._isShallow;
    if (t === "__v_isReactive")
      return !i;
    if (t === "__v_isReadonly")
      return i;
    if (t === "__v_isShallow")
      return s;
    if (t === "__v_raw")
      return n === (i ? s ? Gl : $a : s ? Kl : Ia).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const a = wt(e);
    if (!i) {
      let o;
      if (a && (o = $l[t]))
        return o;
      if (t === "hasOwnProperty")
        return Dl;
    }
    const r = Reflect.get(
      e,
      t,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      mt(e) ? e : n
    );
    if ((Ot(t) ? Na.has(t) : Ll(t)) || (i || Y(e, "get", t), s))
      return r;
    if (mt(r)) {
      const o = a && _i(t) ? r : r.value;
      return i && _t(o) ? Qn(o) : o;
    }
    return _t(r) ? i ? Qn(r) : Ai(r) : r;
  }
}, ql = class extends Ca {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, t, n, i) {
    let s = e[t];
    const a = wt(e) && _i(t);
    if (!this._isShallow) {
      const c = qe(s);
      if (!Ue(n) && !qe(n) && (s = $(s), n = $(n)), !a && mt(s) && !mt(n))
        return c ? (De(
          `Set operation on key "${String(t)}" failed: target is readonly.`,
          e[t]
        ), !0) : (s.value = n, !0);
    }
    const r = a ? Number(t) < e.length : Xn(e, t), o = Reflect.set(
      e,
      t,
      n,
      mt(e) ? e : i
    );
    return e === $(i) && o && (r ? Ne(n, s) && _e(e, "set", t, n, s) : _e(e, "add", t, n)), o;
  }
  deleteProperty(e, t) {
    const n = Xn(e, t), i = e[t], s = Reflect.deleteProperty(e, t);
    return s && n && _e(e, "delete", t, void 0, i), s;
  }
  has(e, t) {
    const n = Reflect.has(e, t);
    return (!Ot(t) || !Na.has(t)) && Y(e, "has", t), n;
  }
  ownKeys(e) {
    return Y(
      e,
      "iterate",
      wt(e) ? "length" : $e
    ), Reflect.ownKeys(e);
  }
}, Ul = class extends Ca {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, t) {
    return De(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, t) {
    return De(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, Bl = /* @__PURE__ */ new ql(), jl = /* @__PURE__ */ new Ul(), Ut = (e) => Reflect.getPrototypeOf(e);
function Fl(e, t, n) {
  return function(...i) {
    const s = this.__v_raw, a = $(s), r = ft(a), o = e === "entries" || e === Symbol.iterator && r, c = e === "keys" && r, d = s[e](...i), u = t ? Et : Be;
    return !t && Y(
      a,
      "iterate",
      c ? Yn : $e
    ), yt(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: h, done: w } = d.next();
          return w ? { value: h, done: w } : {
            value: o ? [u(h[0]), u(h[1])] : u(h),
            done: w
          };
        }
      }
    );
  };
}
function Bt(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      De(
        `${kl(e)} operation ${n}failed: target is readonly.`,
        $(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Hl(e, t) {
  const n = {
    get(s) {
      const a = this.__v_raw, r = $(a), o = $(s);
      e || (Ne(s, o) && Y(r, "get", s), Y(r, "get", o));
      const { has: c } = Ut(r), d = e ? Et : Be;
      if (c.call(r, s))
        return d(a.get(s));
      if (c.call(r, o))
        return d(a.get(o));
      a !== r && a.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && Y($(s), "iterate", $e), s.size;
    },
    has(s) {
      const a = this.__v_raw, r = $(a), o = $(s);
      return e || (Ne(s, o) && Y(r, "has", s), Y(r, "has", o)), s === o ? a.has(s) : a.has(s) || a.has(o);
    },
    forEach(s, a) {
      const r = this, o = r.__v_raw, c = $(o), d = e ? Et : Be;
      return !e && Y(c, "iterate", $e), o.forEach((u, h) => s.call(a, d(u), d(h), r));
    }
  };
  return yt(
    n,
    e ? {
      add: Bt("add"),
      set: Bt("set"),
      delete: Bt("delete"),
      clear: Bt("clear")
    } : {
      add(s) {
        const a = $(this), r = Ut(a), o = $(s), c = !Ue(s) && !qe(s) ? o : s;
        return r.has.call(a, c) || Ne(s, c) && r.has.call(a, s) || Ne(o, c) && r.has.call(a, o) || (a.add(c), _e(a, "add", c, c)), this;
      },
      set(s, a) {
        !Ue(a) && !qe(a) && (a = $(a));
        const r = $(this), { has: o, get: c } = Ut(r);
        let d = o.call(r, s);
        d ? rs(r, o, s) : (s = $(s), d = o.call(r, s));
        const u = c.call(r, s);
        return r.set(s, a), d ? Ne(a, u) && _e(r, "set", s, a, u) : _e(r, "add", s, a), this;
      },
      delete(s) {
        const a = $(this), { has: r, get: o } = Ut(a);
        let c = r.call(a, s);
        c ? rs(a, r, s) : (s = $(s), c = r.call(a, s));
        const d = o ? o.call(a, s) : void 0, u = a.delete(s);
        return c && _e(a, "delete", s, void 0, d), u;
      },
      clear() {
        const s = $(this), a = s.size !== 0, r = ft(s) ? new Map(s) : new Set(s), o = s.clear();
        return a && _e(
          s,
          "clear",
          void 0,
          void 0,
          r
        ), o;
      }
    }
  ), [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ].forEach((s) => {
    n[s] = Fl(s, e);
  }), n;
}
function Ra(e, t) {
  const n = Hl(e);
  return (i, s, a) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? i : Reflect.get(
    Xn(n, s) && s in i ? n : i,
    s,
    a
  );
}
var Wl = {
  get: /* @__PURE__ */ Ra(!1)
}, zl = {
  get: /* @__PURE__ */ Ra(!0)
};
function rs(e, t, n) {
  const i = $(n);
  if (i !== n && t.call(e, i)) {
    const s = ka(e);
    De(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var Ia = /* @__PURE__ */ new WeakMap(), Kl = /* @__PURE__ */ new WeakMap(), $a = /* @__PURE__ */ new WeakMap(), Gl = /* @__PURE__ */ new WeakMap();
function Vl(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Ai(e) {
  return /* @__PURE__ */ qe(e) ? e : Pa(
    e,
    !1,
    Bl,
    Wl,
    Ia
  );
}
function Qn(e) {
  return Pa(
    e,
    !0,
    jl,
    zl,
    $a
  );
}
function Pa(e, t, n, i, s) {
  if (!_t(e))
    return De(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const a = s.get(e);
  if (a)
    return a;
  const r = Vl(ka(e));
  if (r === 0)
    return e;
  const o = new Proxy(
    e,
    r === 2 ? i : n
  );
  return s.set(e, o), o;
}
function La(e) {
  return /* @__PURE__ */ qe(e) ? /* @__PURE__ */ La(e.__v_raw) : !!(e && e.__v_isReactive);
}
function qe(e) {
  return !!(e && e.__v_isReadonly);
}
function Ue(e) {
  return !!(e && e.__v_isShallow);
}
function Xl(e) {
  return e ? !!e.__v_raw : !1;
}
function $(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ $(t) : e;
}
var Be = (e) => _t(e) ? /* @__PURE__ */ Ai(e) : e, Et = (e) => _t(e) ? /* @__PURE__ */ Qn(e) : e;
function mt(e) {
  return e ? e.__v_isRef === !0 : !1;
}
se("nextTick", () => mi);
se("dispatch", (e) => ht.bind(ht, e));
se("watch", (e, { evaluateLater: t, cleanup: n }) => (i, s) => {
  let a = t(i), o = Ns(() => {
    let c;
    return a((d) => c = d), c;
  }, s);
  n(o);
});
se("store", ol);
se("data", (e) => qs(e));
se("root", (e) => rn(e));
se("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Pe(Jl(e))), e._x_refs_proxy));
function Jl(e) {
  let t = [];
  return he(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var Mn = {};
function Da(e) {
  return Mn[e] || (Mn[e] = 0), ++Mn[e];
}
function Zl(e, t) {
  return he(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Yl(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Da(t));
}
se("id", (e, { cleanup: t }) => (n, i = null) => {
  let s = `${n}${i ? `-${i}` : ""}`;
  return Ql(e, s, t, () => {
    let a = Zl(e, n), r = a ? a._x_ids[n] : Da(n);
    return i ? `${n}-${r}-${i}` : `${n}-${r}`;
  });
});
ln((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Ql(e, t, n, i) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let s = i();
  return e._x_id[t] = s, n(() => {
    delete e._x_id[t];
  }), s;
}
se("el", (e) => e);
qa("Focus", "focus", "focus");
qa("Persist", "persist", "persist");
function qa(e, t, n) {
  se(t, (i) => le(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
j("modelable", (e, { expression: t }, { effect: n, evaluateLater: i, cleanup: s }) => {
  let a = i(t), r = () => {
    let u;
    return a((h) => u = h), u;
  }, o = i(`${t} = __placeholder`), c = (u) => o(() => {
  }, { scope: { __placeholder: u } }), d = r();
  c(d), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, h = e._x_model.setWithModifiers, w = ga(
      {
        get() {
          return u();
        },
        set(M) {
          h(M);
        }
      },
      {
        get() {
          return r();
        },
        set(M) {
          c(M);
        }
      }
    );
    s(w);
  });
});
j("teleport", (e, { modifiers: t, expression: n }, { cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && le("x-teleport can only be used on a <template> tag", e);
  let s = os(n), a = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = a, a._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), a.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    a.addEventListener(o, (c) => {
      c.stopPropagation(), e.dispatchEvent(new c.constructor(c.type, c));
    });
  }), At(a, {}, e);
  let r = (o, c, d) => {
    d.includes("prepend") ? c.parentNode.insertBefore(o, c) : d.includes("append") ? c.parentNode.insertBefore(o, c.nextSibling) : c.appendChild(o);
  };
  B(() => {
    Ee(() => {
      r(a, s, t), fe(a);
    })();
  }), e._x_teleportPutBack = () => {
    let o = os(n);
    B(() => {
      r(e._x_teleport, o, t);
    });
  }, i(
    () => B(() => {
      a.remove(), We(a);
    })
  );
});
var ec = document.createElement("div");
function os(e) {
  let t = Ee(() => document.querySelector(e), () => ec)();
  return t || le(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Ua = () => {
};
Ua.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
j("ignore", Ua);
j("effect", Ee((e, { expression: t }, { effect: n }) => {
  n(Z(e, t));
}));
function Qe(e, t, n, i) {
  let s = e, a = (c) => i(c), r = {}, o = (c, d) => (u) => d(c, u);
  return n.includes("dot") && (t = tc(t)), n.includes("camel") && (t = nc(t)), n.includes("capture") && (r.capture = !0), n.includes("window") && (s = window), n.includes("document") && (s = document), n.includes("passive") && (r.passive = n[n.indexOf("passive") + 1] !== "false"), a = Ba(n, a), n.includes("prevent") && (a = o(a, (c, d) => {
    d.preventDefault(), c(d);
  })), n.includes("stop") && (a = o(a, (c, d) => {
    d.stopPropagation(), c(d);
  })), n.includes("once") && (a = o(a, (c, d) => {
    c(d), s.removeEventListener(t, a, r);
  })), (n.includes("away") || n.includes("outside")) && (s = document, a = o(a, (c, d) => {
    e.contains(d.target) || d.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && c(d));
  })), n.includes("self") && (a = o(a, (c, d) => {
    d.target === e && c(d);
  })), t === "submit" && (a = o(a, (c, d) => {
    d.target._x_pendingModelUpdates && d.target._x_pendingModelUpdates.forEach((u) => u()), c(d);
  })), (sc(t) || ja(t)) && (a = o(a, (c, d) => {
    ac(d, n) || c(d);
  })), s.addEventListener(t, a, r), () => {
    s.removeEventListener(t, a, r);
  };
}
function Ba(e, t) {
  if (e.includes("debounce")) {
    let n = e[e.indexOf("debounce") + 1] || "invalid-wait", i = Qt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = fa(t, i);
  }
  if (e.includes("throttle")) {
    let n = e[e.indexOf("throttle") + 1] || "invalid-wait", i = Qt(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = ba(t, i);
  }
  return t;
}
function tc(e) {
  return e.replace(/-/g, ".");
}
function nc(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Qt(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function ic(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function sc(e) {
  return ["keydown", "keyup"].includes(e);
}
function ja(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function ac(e, t) {
  let n = t.filter((a) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(a));
  if (n.includes("debounce")) {
    let a = n.indexOf("debounce");
    n.splice(a, Qt((n[a + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let a = n.indexOf("throttle");
    n.splice(a, Qt((n[a + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && ls(e.key).includes(n[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((a) => n.includes(a));
  return n = n.filter((a) => !s.includes(a)), !(s.length > 0 && s.filter((r) => ((r === "cmd" || r === "super") && (r = "meta"), e[`${r}Key`])).length === s.length && (ja(e.type) || ls(e.key).includes(n[0])));
}
function ls(e) {
  if (!e)
    return [];
  e = ic(e);
  let t = {
    ctrl: "control",
    slash: "/",
    space: " ",
    spacebar: " ",
    cmd: "meta",
    esc: "escape",
    up: "arrow-up",
    down: "arrow-down",
    left: "arrow-left",
    right: "arrow-right",
    period: ".",
    comma: ",",
    equal: "=",
    minus: "-",
    underscore: "_"
  };
  return t[e] = e, Object.keys(t).map((n) => {
    if (t[n] === e)
      return n;
  }).filter((n) => n);
}
j("model", (e, { modifiers: t, expression: n }, { effect: i, cleanup: s }) => {
  let a = e;
  t.includes("parent") && (a = he(e, (m) => m !== e));
  let r = Z(a, n), o;
  typeof n == "string" ? o = Z(a, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = Z(a, `${n()} = __placeholder`) : o = () => {
  };
  let c = () => {
    let m;
    return r((v) => m = v), cs(m) ? m.get() : m;
  }, d = (m) => {
    let v;
    r((k) => v = k), cs(v) ? v.set(m) : o(() => {
    }, {
      scope: { __placeholder: m }
    });
  };
  typeof n == "string" && e.type === "radio" && B(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = t.includes("change") || t.includes("lazy"), h = t.includes("blur"), w = t.includes("enter"), M = u || h || w, C;
  if (xe)
    C = () => {
    };
  else if (M) {
    let m = [], v = (k) => d(jt(e, t, k, c()));
    if (u && m.push(Qe(e, "change", t, v)), h && (m.push(Qe(e, "blur", t, v)), e.form)) {
      let k = e.form, P = () => v({ target: e });
      k._x_pendingModelUpdates || (k._x_pendingModelUpdates = []), k._x_pendingModelUpdates.push(P), s(() => {
        k._x_pendingModelUpdates && k._x_pendingModelUpdates.splice(k._x_pendingModelUpdates.indexOf(P), 1);
      });
    }
    w && m.push(Qe(e, "keydown", t, (k) => {
      k.key === "Enter" && v(k);
    })), C = () => m.forEach((k) => k());
  } else {
    let m = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    C = Qe(e, m, t, (v) => {
      d(jt(e, t, v, c()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(c()) || Zt(e) && Array.isArray(c()) || e.tagName.toLowerCase() === "select" && e.multiple) && d(
    jt(e, t, { target: e }, c())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = C, s(() => e._x_removeModelListeners.default()), e.form) {
    let m = Qe(e.form, "reset", [], (v) => {
      mi(() => e._x_model && e._x_model.set(jt(e, t, { target: e }, c())));
    });
    s(() => m());
  }
  if (e._x_model = {
    get() {
      return c();
    },
    set(m) {
      d(m);
    },
    setWithModifiers: Ba(t, d)
  }, e._x_forceModelUpdate = (m) => {
    m === void 0 && typeof n == "string" && n.match(/\./) && (m = ""), B(() => {
      Zt(e) ? Array.isArray(m) ? e.checked = m.some((v) => v == e.value) : e.checked = !!m : wi(e) ? typeof m == "boolean" ? e.checked = zt(e.value) === m : e.checked = e.value == m : ua(e, "value", m);
    });
  }, e.tagName === "SELECT") {
    let m = new MutationObserver(() => {
      e._x_forceModelUpdate(c());
    });
    m.observe(e, { childList: !0 }), s(() => m.disconnect());
  }
  i(() => {
    let m = c();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(m);
  });
});
function jt(e, t, n, i) {
  return B(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (Zt(e))
      if (Array.isArray(i)) {
        let s = null;
        return t.includes("number") ? s = Nn(n.target.value) : t.includes("boolean") ? s = zt(n.target.value) : s = n.target.value, n.target.checked ? i.includes(s) ? i : i.concat([s]) : i.filter((a) => !rc(a, s));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((s) => {
          let a = s.value || s.text;
          return Nn(a);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((s) => {
          let a = s.value || s.text;
          return zt(a);
        }) : Array.from(n.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return wi(e) ? n.target.checked ? s = n.target.value : s = i : s = n.target.value, t.includes("number") ? Nn(s) : t.includes("boolean") ? zt(s) : t.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function Nn(e) {
  let t = e ? parseFloat(e) : null;
  return oc(t) ? t : e;
}
function rc(e, t) {
  return e == t;
}
function oc(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function cs(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
j("cloak", (e) => queueMicrotask(() => B(() => e.removeAttribute(st("cloak")))));
aa(() => `[${st("init")}]`);
j("init", Ee((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
j("text", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let s = i(t);
  n(() => {
    s((a) => {
      B(() => {
        e.textContent = a;
      });
    });
  });
});
j("html", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  let s = i(t);
  n(() => {
    s((a) => {
      B(() => {
        Array.from(e.children).forEach((r) => We(r)), e.innerHTML = a ?? "", e._x_ignoreSelf = !0, fe(e), delete e._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
fi(Xs(":", Js(st("bind:"))));
var Fa = (e, { value: t, modifiers: n, expression: i, original: s }, { effect: a, cleanup: r }) => {
  if (!t) {
    let c = {};
    cl(c), Z(e, i)((u) => {
      va(e, u, s);
    }, { scope: c });
    return;
  }
  if (t === "key")
    return lc(e, i);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = Z(e, i);
  a(() => o((c) => {
    c === void 0 && typeof i == "string" && i.match(/\./) && (c = ""), B(() => ua(e, t, c, n));
  })), r(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
Fa.inline = (e, { value: t, modifiers: n, expression: i }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: i, extract: !1 });
};
j("bind", Fa);
function lc(e, t) {
  e._x_keyExpression = t;
}
sa(() => `[${st("data")}]`);
var Te = /* @__PURE__ */ Symbol();
j("data", (e, { expression: t }, { cleanup: n }) => {
  if (dc(e))
    return;
  let i = e[Te];
  if (i?.expression === t)
    return;
  t = t === "" ? "{}" : t;
  let s = {};
  Xt(s, e);
  let a = {};
  ul(a, s);
  let r = Ie(e, t, { scope: a });
  (r === void 0 || r === !0) && (r = {}), Xt(r, e);
  let o;
  if (i?.reactiveData) {
    o = i.reactiveData, cc(o, r);
    let d = { expression: t };
    e[Te] = d, queueMicrotask(() => {
      e[Te] === d && delete e[Te];
    });
  } else
    o = nt(r);
  di(o, n);
  let c = At(e, o);
  o.init && Ie(e, o.init), n(() => {
    o.destroy && Ie(e, o.destroy), c();
    let d = { reactiveData: o };
    e[Te] = d, queueMicrotask(() => {
      e[Te] === d && delete e[Te];
    });
  });
});
function cc(e, t) {
  Object.keys(t).forEach((n) => {
    let i = Object.getOwnPropertyDescriptor(t, n), s = Object.getOwnPropertyDescriptor(e, n);
    i.get || i.set || s?.get || s?.set ? (s && delete e[n], s || (e[n] = void 0), i.get || i.set ? Object.defineProperty(e, n, i) : e[n] = t[n]) : e[n] = t[n];
  }), Object.keys(e).filter((n) => !Object.prototype.hasOwnProperty.call(t, n)).forEach((n) => delete e[n]);
}
ln((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function dc(e) {
  return xe ? Vn ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
j("show", (e, { modifiers: t, expression: n }, { effect: i }) => {
  let s = Z(e, n);
  e._x_doHide || (e._x_doHide = () => {
    B(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    B(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let a = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, r = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, o = () => setTimeout(r), c = Kn(
    (h) => h ? r() : a(),
    (h) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, h, r, a) : h ? o() : a();
    }
  ), d, u = !0;
  i(() => s((h) => {
    !u && h === d || (t.includes("immediate") && (h ? o() : a()), c(h), d = h, u = !1);
  }));
});
j("for", Ee((e, { expression: t }, { effect: n, cleanup: i }) => {
  let s = hc(t), a = Z(e, s.items), r = Z(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_lookup = /* @__PURE__ */ new Map(), n(() => pc(e, s, a, r), { priority: "structural" }), i(() => {
    e._x_lookup.forEach(
      (o) => B(() => {
        We(o), o.remove();
      })
    ), delete e._x_lookup, delete e._x_lastRenderedEl;
  });
}));
function uc(e) {
  return (t) => {
    Object.entries(t).forEach(([n, i]) => {
      e[n] = i;
    });
  };
}
function pc(e, t, n, i) {
  n((s) => {
    bc(s) && (s = Array.from({ length: s }, (d, u) => u + 1)), s == null && (s = []), s instanceof Set && (s = Array.from(s)), s instanceof Map && (s = Array.from(s));
    let a = e._x_lookup, r = /* @__PURE__ */ new Map();
    e._x_lookup = r;
    let o = gc(s), c = Object.entries(s).map(([d, u]) => {
      o || (d = parseInt(d));
      let h = fc(t, u, d, s), w;
      return i((M) => {
        typeof M == "object" && le("x-for key cannot be an object, it must be a string or an integer", e), a.has(M) && (r.set(M, a.get(M)), a.delete(M)), w = M;
      }, { scope: { index: d, ...h } }), [w, h];
    });
    B(() => {
      a.forEach((h) => {
        We(h), h.remove();
      });
      let d = /* @__PURE__ */ new Set(), u = e;
      c.forEach(([h, w]) => {
        if (r.has(h)) {
          let m = r.get(h);
          m._x_refreshXForScope(w), u.nextElementSibling !== m && (u.nextElementSibling && m.replaceWith(u.nextElementSibling), u.after(m)), u = m, m._x_currentIfEl && (m.nextElementSibling !== m._x_currentIfEl && u.after(m._x_currentIfEl), u = m._x_currentIfEl);
          return;
        }
        e.content.children.length > 1 && le("x-for templates require a single root element, additional elements will be ignored.", e);
        let M = document.importNode(e.content, !0).firstElementChild, C = nt(w);
        At(M, C, e), M._x_refreshXForScope = uc(C), r.set(h, M), d.add(M), u.after(M), u = M;
      }), d.forEach((h) => fe(h)), u !== e ? e._x_lastRenderedEl = u : delete e._x_lastRenderedEl;
    });
  });
}
function hc(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, i = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, s = e.match(i);
  if (!s)
    return;
  let a = {};
  a.items = s[2].trim();
  let r = s[1].replace(n, "").trim(), o = r.match(t);
  return o ? (a.item = r.replace(t, "").trim(), a.index = o[1].trim(), o[2] && (a.collection = o[2].trim())) : a.item = r, a;
}
function fc(e, t, n, i) {
  let s = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((r) => r.trim()).forEach((r, o) => {
    s[r] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((r) => r.trim()).forEach((r) => {
    s[r] = t[r];
  }) : s[e.item] = t, e.index && (s[e.index] = n), e.collection && (s[e.collection] = i), s;
}
function bc(e) {
  return typeof e != "object" && !isNaN(e);
}
function gc(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function Ha() {
}
Ha.inline = (e, { expression: t }, { cleanup: n }) => {
  let i = rn(e);
  i && (i._x_refs || (i._x_refs = {}), i._x_refs[t] = e, n(() => delete i._x_refs[t]));
};
j("ref", Ha);
j("if", Ee((e, { expression: t }, { effect: n, cleanup: i }) => {
  e.tagName.toLowerCase() !== "template" && le("x-if can only be used on a <template> tag", e);
  let s = Z(e, t), a = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return At(o, {}, e), B(() => {
      e.after(o), fe(o);
    }), e._x_currentIfEl = o, e._x_lastRenderedEl = o, e._x_undoIf = () => {
      B(() => {
        We(o), o.remove();
      }), delete e._x_currentIfEl, delete e._x_lastRenderedEl;
    }, o;
  }, r = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => s((o) => {
    o ? a() : r();
  }), { priority: "structural" }), i(() => e._x_undoIf && e._x_undoIf());
}));
j("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((s) => Yl(e, s));
});
ln((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
fi(Xs("@", Js(st("on:"))));
j("on", Ee((e, { value: t, modifiers: n, expression: i }, { cleanup: s }) => {
  let a = i ? Z(e, i) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let r = Qe(e, t, n, (o) => {
    a(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  s(() => r());
}));
cn("Collapse", "collapse", "collapse");
cn("Intersect", "intersect", "intersect");
cn("Focus", "trap", "focus");
cn("Mask", "mask", "mask");
function cn(e, t, n) {
  j(t, (i) => le(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, i));
}
j("html", (e, { expression: t }) => {
  ui(new Error("Using the x-html directive is prohibited in the CSP build"), e);
});
at.setEvaluator(ml);
at.setRawEvaluator(gl);
at.setReactivityEngine({
  reactive: Ai,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (e, t = {}) => {
    let n;
    return n = Tl(e, {
      scheduler: () => {
        n && (t.scheduler ? t.scheduler(n) : n());
      }
    }), n;
  },
  release: Ml,
  raw: $
});
var mc = at, vt = mc;
function vc(e) {
  const t = window.__siteationDebugBar;
  return t ? (t.onRequest = e, t.requests.slice()) : [];
}
const en = "__siteationDebugBarHostLock";
function yc(e) {
  if (!e || window[en]) return;
  const t = document.body, n = Math.max(0, window.innerWidth - document.documentElement.clientWidth), i = {
    overflow: t.style.overflow,
    paddingRight: t.style.paddingRight,
    inert: []
  };
  if (Array.from(t.children).forEach((s) => {
    s === e || s.contains(e) || !(s instanceof HTMLElement) || s.matches("script, style, link") || (i.inert.push([s, s.inert]), s.inert = !0);
  }), t.style.overflow = "hidden", n > 0) {
    const s = Number.parseFloat(window.getComputedStyle(t).paddingRight || "0");
    t.style.paddingRight = `${s + n}px`;
  }
  window[en] = i;
}
function wc() {
  const e = window[en];
  e && (e.inert.forEach(([t, n]) => {
    t.inert = n;
  }), document.body.style.overflow = e.overflow, document.body.style.paddingRight = e.paddingRight, delete window[en]);
}
function ds(e, t) {
  if (e.key !== "Tab" || !t) return;
  const n = Array.from(t.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((r) => r.offsetParent !== null);
  if (n.length === 0) return;
  const i = n[0], s = n[n.length - 1], a = t.getRootNode().activeElement;
  e.shiftKey && a === i ? (e.preventDefault(), s.focus()) : !e.shiftKey && a === s && (e.preventDefault(), i.focus());
}
const Ye = 12;
function _c(e) {
  return !!(e && typeof e == "object" && Number.isFinite(e.left) && Number.isFinite(e.top));
}
function Cn(e, t, n) {
  const i = Math.max(Ye, n.width - t.width - Ye), s = Math.max(Ye, n.height - t.height - Ye);
  return {
    left: Math.min(Math.max(e.left, Ye), i),
    top: Math.min(Math.max(e.top, Ye), s)
  };
}
function xc(e, t, n) {
  return e.top + t.height / 2 < n / 2 ? "top" : "bottom";
}
const Ec = 3;
function kc(e, t) {
  return Math.hypot(e, t) >= Ec;
}
function Sc(e) {
  const t = String(e || "").split(",").map((n) => n.trim()).filter(Boolean);
  return t.length === 0 ? tn : tn.filter((n) => Ac.includes(n.id) || t.includes(n.id));
}
const Ac = ["findings", "overview"], tn = [
  {
    id: "findings",
    label: "Findings",
    lead: "What is worth your attention on this request, worst first."
  },
  {
    id: "overview",
    label: "Overview",
    lead: "What was asked for, what came back, and what it cost."
  },
  {
    id: "timeline",
    label: "Timeline",
    lead: "Follow important work in the order it happened across the request.",
    graded: !1
  },
  {
    id: "queries",
    label: "Queries",
    lead: "Every database query, timed, with the application frame it came from."
  },
  {
    id: "blocks",
    label: "Blocks",
    lead: "Block render times. Own time excludes anything a block renders inside it."
  },
  {
    id: "observers",
    label: "Observers",
    lead: "Every observer that actually ran, grouped by event and ranked by cost."
  },
  {
    id: "events",
    label: "Events",
    lead: "Every dispatched event, including the ones nothing is listening to.",
    graded: !1
  },
  {
    id: "cache",
    label: "Cache",
    lead: "Reads and writes grouped by key prefix, with the hit rate for each."
  },
  {
    id: "plugins",
    label: "Plugins",
    lead: "Which interceptors were built for this request, and on what.",
    graded: !1
  },
  {
    id: "alpine",
    label: "Alpine",
    lead: "The components on the page right now, their state, and what has not started.",
    graded: !1
  },
  {
    id: "magewire",
    label: "Magewire",
    lead: "The components on the page right now, their state, and what each update cost.",
    graded: !1
  },
  {
    id: "seo",
    label: "SEO",
    lead: "This page as a search engine or a link preview reads it: tags, headings, images and links.",
    graded: !1
  },
  {
    id: "history",
    label: "History",
    lead: "Every request still on disk, so an earlier one is one click away.",
    graded: !1
  }
];
function Wa(e, t) {
  switch (e) {
    case "findings":
      return t.findings.length || null;
    case "overview":
      return null;
    case "timeline":
      return t.timeline.count || null;
    case "queries":
      return t.queries.count || null;
    case "blocks":
      return t.blocks.unique_count || null;
    case "observers":
      return t.observers.unique_count || null;
    case "events":
      return t.events.unique_count || null;
    case "cache":
      return t.cache.count || null;
    case "plugins":
      return t.interception.plugin_count || null;
    case "alpine":
      return t.alpineComponents.length || null;
    case "magewire":
      return t.magewireComponents.length || null;
    case "seo":
      return t.seo.warningCount || null;
    case "history":
      return t.history.length || null;
    default:
      return null;
  }
}
const Oc = {
  database: '<path d="M12 2.5c4.14 0 7.5 1.12 7.5 2.5S16.14 7.5 12 7.5 4.5 6.38 4.5 5 7.86 2.5 12 2.5Z"/><path d="M19.5 5v14c0 1.38-3.36 2.5-7.5 2.5S4.5 20.38 4.5 19V5"/><path d="M19.5 12c0 1.38-3.36 2.5-7.5 2.5S4.5 13.38 4.5 12"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 2.5v3M14 2.5v3M10 18.5v3M14 18.5v3M2.5 10h3M2.5 14h3M18.5 10h3M18.5 14h3"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-3.5-3.5"/>',
  alert: '<path d="M12 3.5 2.5 20h19L12 3.5Z"/><path d="M12 10v4"/><path d="M12 17.2v.1"/>',
  monitor: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
  minimise: '<path d="M5 12h14"/>',
  expand: '<path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5"/>',
  collapse: '<path d="M9 4v5H4M15 20v-5h5M15 4v5h5M9 20v-5H4"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  star: '<path d="m12 3.5 2.6 5.6 6 .8-4.4 4.2 1.1 6L12 17.3 6.7 20.1l1.1-6L3.4 9.9l6-.8L12 3.5Z"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  caret: '<path d="m6 9 6 6 6-6"/>',
  pulse: '<path d="M3 12h3.5l2.5-6 4 12 2.5-6H21"/>',
  grip: '<circle cx="9" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.5" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.5" fill="currentColor" stroke="none"/>'
};
function H(e, t = "") {
  return `<svg class="ndb-icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${Oc[e] || ""}</svg>`;
}
function Tc(e) {
  return [...Mc(e), ...Nc(e), ...Cc(e)];
}
function Mc(e) {
  return tn.map((t) => {
    const n = Wa(t.id, e);
    return {
      id: `section:${t.id}`,
      group: "Go to",
      label: t.label,
      hint: e.section === t.id ? "Active section" : n ? String(n) : "",
      keywords: t.id,
      kind: "section",
      arg: t.id
    };
  });
}
function Nc(e) {
  const t = [
    { value: "system", label: "Follow the system theme" },
    { value: "light", label: "Use the light theme" },
    { value: "dark", label: "Use the dark theme" }
  ], n = e.currentSection || {};
  return [
    ...t.map((i) => ({
      id: `theme:${i.value}`,
      group: "Appearance",
      label: i.label,
      hint: e.theme === i.value ? "Current" : "",
      keywords: `theme ${i.value}`,
      kind: "theme",
      arg: i.value
    })),
    {
      id: "placement",
      group: "Appearance",
      label: e.placement === "bottom" ? "Move the bar to the top" : "Move the bar to the bottom",
      hint: "",
      keywords: "placement dock top bottom move",
      kind: "placement",
      arg: ""
    },
    ...e.dockPosition ? [{
      id: "dock-reset",
      group: "Appearance",
      label: "Put the bar back on its edge",
      hint: "moved",
      keywords: "reset dock position centre center move drag restore default",
      kind: "dock-reset",
      arg: ""
    }] : [],
    {
      id: "favourite",
      group: "Appearance",
      label: e.isFavourite(e.section) ? `Unpin ${n.label} from favourites` : `Pin ${n.label} to favourites`,
      hint: "",
      keywords: "favourite pin star sidebar",
      kind: "favourite",
      arg: e.section
    }
  ];
}
function Cc(e) {
  return [
    {
      id: "copy",
      group: "Window",
      label: "Copy this request for an AI",
      hint: "markdown",
      keywords: "copy clipboard ai assistant chatgpt claude markdown report share",
      kind: "copy",
      arg: ""
    },
    {
      id: "inspector",
      group: "Window",
      label: e.open ? "Minimise the inspector" : "Open the inspector",
      hint: "",
      keywords: "open close minimise inspector panel",
      kind: "inspector",
      arg: ""
    },
    {
      id: "maximise",
      group: "Window",
      label: e.maximised ? "Restore the inspector" : "Maximise the inspector",
      hint: "",
      keywords: "maximise restore fullscreen size",
      kind: "maximise",
      arg: ""
    },
    {
      id: "collapse",
      group: "Window",
      label: e.collapsed ? "Show the bar again" : "Collapse the bar to a bubble",
      hint: "",
      keywords: "collapse bubble corner minimise restore show out of the way",
      kind: "collapse",
      arg: ""
    },
    {
      id: "dismiss",
      group: "Window",
      label: "Hide the bar until the next page load",
      hint: "nothing on screen",
      keywords: "hide dismiss close screenshot",
      kind: "dismiss",
      arg: ""
    }
  ];
}
function Rc(e, t) {
  const n = String(t || "").trim().toLowerCase(), i = n ? e.filter((s) => `${s.group} ${s.label} ${s.keywords}`.toLowerCase().includes(n)) : e;
  return i.map((s, a) => ({
    ...s,
    leads: a === 0 || i[a - 1].group !== s.group
  }));
}
function Ic() {
  return `
<div class="ndb-palette" data-ndb-bind:class="paletteOpen && 'is-open'"
     data-ndb-on:keydown="paletteKeys($event)">
  <div class="ndb-palette-backdrop" data-ndb-on:click="closePalette()"></div>

  <div class="ndb-palette-box" data-ndb-ref="palette"
       role="dialog" aria-modal="true" aria-label="Commands">
    <div class="ndb-palette-field">
      ${H("search")}
      <input class="ndb-palette-input" type="text" data-ndb-ref="paletteInput"
             data-ndb-model="paletteSearch" autocomplete="off" spellcheck="false"
             placeholder="Search sections and settings" aria-label="Search commands">
    </div>

    <ul class="ndb-palette-list">
      <template data-ndb-for="(command, position) in visibleCommands"
                data-ndb-bind:key="command.id">
        <li>
          <p class="ndb-palette-heading" data-ndb-show="command.leads"
             data-ndb-text="command.group"></p>
          <button type="button" class="ndb-palette-item"
                  data-ndb-bind:class="paletteIndex === position && 'is-active'"
                  data-ndb-on:click="runCommand(command)"
                  data-ndb-on:mousemove="paletteIndex = position">
            <span class="ndb-palette-label" data-ndb-text="command.label"></span>
            <span class="ndb-palette-hint" data-ndb-text="command.hint"></span>
          </button>
        </li>
      </template>
    </ul>

    <p class="ndb-palette-empty" data-ndb-show="visibleCommands.length === 0">
      Nothing matches.
    </p>

    <div class="ndb-palette-foot">
      <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
      <span><kbd>&crarr;</kbd> Select</span>
      <span><kbd>Esc</kbd> Close</span>
    </div>
  </div>
</div>`;
}
const tt = "full", za = "masked", be = "none", $c = "[redacted]", Pc = "[masked]", Lc = "[maximum depth reached]", Dc = "[circular]", qc = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, Uc = 5, Kt = 100, us = 400;
function Bc(e) {
  return [tt, za, be].includes(e) ? e : tt;
}
function jc(e) {
  return qc.test(String(e));
}
function Oi(e, t = tt) {
  if (t !== be)
    return Ti(e, t, 0, /* @__PURE__ */ new WeakSet());
}
function nn(e, t = tt) {
  return t === be ? "" : t === za ? e === "" ? "" : Pc : e.length <= us ? e : `${e.slice(0, us)}...`;
}
function Ka(e, t = tt) {
  if (t === be) return "";
  const n = e.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return nn(n, tt);
}
function Ti(e, t, n, i) {
  if (e == null) return e;
  const s = typeof e;
  return s === "string" ? nn(e, t) : s === "number" || s === "boolean" ? e : s === "function" ? `ƒ ${e.name || "anonymous"}()` : s === "symbol" ? e.toString() : s === "bigint" ? `${e}n` : s !== "object" ? s : e instanceof Node ? Wc(e) : e instanceof Date ? e.toISOString() : e instanceof Error ? `${e.name}: ${nn(e.message, t)}` : e instanceof Map ? `Map(${e.size})` : e instanceof Set ? `Set(${e.size})` : n >= Uc ? Lc : i.has(e) ? Dc : (i.add(e), Array.isArray(e) ? Fc(e, t, n, i) : Hc(e, t, n, i));
}
function Fc(e, t, n, i) {
  const s = e.slice(0, Kt).map((a) => Ti(a, t, n + 1, i));
  return e.length > Kt && s.push(`[${e.length - Kt} more]`), s;
}
function Hc(e, t, n, i) {
  const s = dn(e), a = /* @__PURE__ */ Object.create(null);
  let r = 0;
  for (const o of s) {
    if (r >= Kt) {
      a.__truncated__ = s.length - r;
      break;
    }
    if (jc(o)) {
      a[o] = $c, r++;
      continue;
    }
    try {
      a[o] = Ti(e[o], t, n + 1, i);
    } catch (c) {
      a[o] = `[unreadable: ${c && c.message ? c.message : "threw"}]`;
    }
    r++;
  }
  return a;
}
function dn(e) {
  try {
    const t = Object.keys(e);
    return t.length > 0 ? t : Reflect.ownKeys(e).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function Wc(e) {
  if (!(e instanceof Element)) return `<${e.nodeName.toLowerCase()}>`;
  const t = e.id ? `#${e.id}` : "", n = typeof e.className == "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${e.tagName.toLowerCase()}${t}${n}>`;
}
function zc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Rn, ps;
function Kc() {
  if (ps) return Rn;
  ps = 1;
  function e(l) {
    return l instanceof Map ? l.clear = l.delete = l.set = function() {
      throw new Error("map is read-only");
    } : l instanceof Set && (l.add = l.clear = l.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(l), Object.getOwnPropertyNames(l).forEach((p) => {
      const b = l[p], A = typeof b;
      (A === "object" || A === "function") && !Object.isFrozen(b) && e(b);
    }), l;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(p) {
      p.data === void 0 && (p.data = {}), this.data = p.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(l) {
    return l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function i(l, ...p) {
    const b = /* @__PURE__ */ Object.create(null);
    for (const A in l)
      b[A] = l[A];
    return p.forEach(function(A) {
      for (const q in A)
        b[q] = A[q];
    }), /** @type {T} */
    b;
  }
  const s = "</span>", a = (l) => !!l.scope, r = (l, { prefix: p }) => {
    if (l.startsWith("language:"))
      return l.replace("language:", "language-");
    if (l.includes(".")) {
      const b = l.split(".");
      return [
        `${p}${b.shift()}`,
        ...b.map((A, q) => `${A}${"_".repeat(q + 1)}`)
      ].join(" ");
    }
    return `${p}${l}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(p, b) {
      this.buffer = "", this.classPrefix = b.classPrefix, p.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(p) {
      this.buffer += n(p);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(p) {
      if (!a(p)) return;
      const b = r(
        p.scope,
        { prefix: this.classPrefix }
      );
      this.span(b);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(p) {
      a(p) && (this.buffer += s);
    }
    /**
     * returns the accumulated buffer
    */
    value() {
      return this.buffer;
    }
    // helpers
    /**
     * Builds a span element
     *
     * @param {string} className */
    span(p) {
      this.buffer += `<span class="${p}">`;
    }
  }
  const c = (l = {}) => {
    const p = { children: [] };
    return Object.assign(p, l), p;
  };
  class d {
    constructor() {
      this.rootNode = c(), this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    /** @param {Node} node */
    add(p) {
      this.top.children.push(p);
    }
    /** @param {string} scope */
    openNode(p) {
      const b = c({ scope: p });
      this.add(b), this.stack.push(b);
    }
    closeNode() {
      if (this.stack.length > 1)
        return this.stack.pop();
    }
    closeAllNodes() {
      for (; this.closeNode(); ) ;
    }
    toJSON() {
      return JSON.stringify(this.rootNode, null, 4);
    }
    /**
     * @typedef { import("./html_renderer").Renderer } Renderer
     * @param {Renderer} builder
     */
    walk(p) {
      return this.constructor._walk(p, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(p, b) {
      return typeof b == "string" ? p.addText(b) : b.children && (p.openNode(b), b.children.forEach((A) => this._walk(p, A)), p.closeNode(b)), p;
    }
    /**
     * @param {Node} node
     */
    static _collapse(p) {
      typeof p != "string" && p.children && (p.children.every((b) => typeof b == "string") ? p.children = [p.children.join("")] : p.children.forEach((b) => {
        d._collapse(b);
      }));
    }
  }
  class u extends d {
    /**
     * @param {*} options
     */
    constructor(p) {
      super(), this.options = p;
    }
    /**
     * @param {string} text
     */
    addText(p) {
      p !== "" && this.add(p);
    }
    /** @param {string} scope */
    startScope(p) {
      this.openNode(p);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(p, b) {
      const A = p.root;
      b && (A.scope = `language:${b}`), this.add(A);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function h(l) {
    return l ? typeof l == "string" ? l : l.source : null;
  }
  function w(l) {
    return m("(?=", l, ")");
  }
  function M(l) {
    return m("(?:", l, ")*");
  }
  function C(l) {
    return m("(?:", l, ")?");
  }
  function m(...l) {
    return l.map((b) => h(b)).join("");
  }
  function v(l) {
    const p = l[l.length - 1];
    return typeof p == "object" && p.constructor === Object ? (l.splice(l.length - 1, 1), p) : {};
  }
  function k(...l) {
    return "(" + (v(l).capture ? "" : "?:") + l.map((A) => h(A)).join("|") + ")";
  }
  function P(l) {
    return new RegExp(l.toString() + "|").exec("").length - 1;
  }
  function ze(l, p) {
    const b = l && l.exec(p);
    return b && b.index === 0;
  }
  const Ke = new RegExp(k(
    /\[(?:[^\\\]]|\\.)*\]/,
    // a character class, inside which ( and \ lose their meaning
    /\(\?<(?![=!])[^>]+>/,
    // a named capture group `(?<name>` (not a lookbehind `(?<=` / `(?<!`)
    /\(\?'[^']+'/,
    // a named capture group `(?'name'`
    /\(\??/,
    // an opening parenthesis, capturing or non-capturing / lookahead
    /\\([1-9][0-9]*)/,
    // a backreference like `\1`
    /\\./
    // any other escape sequence
  ));
  function J(l, { joinWith: p }) {
    let b = 0;
    return l.map((A) => {
      b += 1;
      const q = b;
      let U = h(A), _ = "";
      for (; U.length > 0; ) {
        const y = Ke.exec(U);
        if (!y) {
          _ += U;
          break;
        }
        _ += U.substring(0, y.index), U = U.substring(y.index + y[0].length), y[0][0] === "\\" && y[1] ? _ += "\\" + String(Number(y[1]) + q) : (_ += y[0], (y[0] === "(" || /^\(\?[<']/.test(y[0])) && b++);
      }
      return _;
    }).map((A) => `(${A})`).join(p);
  }
  const Q = /\b\B/, Ge = "[a-zA-Z]\\w*", ge = "[a-zA-Z_]\\w*", te = "\\b\\d+(\\.\\d+)?", Tt = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", Mt = "\\b(0b[01]+)", hn = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", fn = (l = {}) => {
    const p = /^#![ ]*\//;
    return l.binary && (l.begin = m(
      p,
      /.*\b/,
      l.binary,
      /\b.*/
    )), i({
      scope: "meta",
      begin: p,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (b, A) => {
        b.index !== 0 && A.ignoreMatch();
      }
    }, l);
  }, ke = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, bn = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [ke]
  }, Nt = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [ke]
  }, gn = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, G = function(l, p, b = {}) {
    const A = i(
      {
        scope: "comment",
        begin: l,
        end: p,
        contains: []
      },
      b
    );
    A.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const q = k(
      // list of common 1 and 2 letter words in English
      "I",
      "a",
      "is",
      "so",
      "us",
      "to",
      "at",
      "if",
      "in",
      "it",
      "on",
      // note: this is not an exhaustive list of contractions, just popular ones
      /[A-Za-z]+['](d|ve|re|ll|t|s|n)/,
      // contractions - can't we'd they're let's, etc
      /[A-Za-z]+[-][a-z]+/,
      // `no-way`, etc.
      /[A-Za-z][a-z]{2,}/
      // allow capitalized words at beginning of sentences
    );
    return A.contains.push(
      {
        // TODO: how to include ", (, ) without breaking grammars that use these for
        // comment delimiters?
        // begin: /[ ]+([()"]?([A-Za-z'-]{3,}|is|a|I|so|us|[tT][oO]|at|if|in|it|on)[.]?[()":]?([.][ ]|[ ]|\))){3}/
        // ---
        // this tries to find sequences of 3 english words in a row (without any
        // "programming" type syntax) this gives us a strong signal that we've
        // TRULY found a comment - vs perhaps scanning with the wrong language.
        // It's possible to find something that LOOKS like the start of the
        // comment - but then if there is no readable text - good chance it is a
        // false match and not a comment.
        //
        // for a visual example please see:
        // https://github.com/highlightjs/highlight.js/issues/2827
        begin: m(
          /[ ]+/,
          // necessary to prevent us gobbling up doctags like /* @author Bob Mcgill */
          "(",
          q,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), A;
  }, me = G("//", "$"), Se = G("/\\*", "\\*/"), Ve = G("#", "$"), rt = {
    scope: "number",
    begin: te,
    relevance: 0
  }, Ct = {
    scope: "number",
    begin: Tt,
    relevance: 0
  }, ir = {
    scope: "number",
    begin: Mt,
    relevance: 0
  }, sr = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      ke,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [ke]
      }
    ]
  }, ar = {
    scope: "title",
    begin: Ge,
    relevance: 0
  }, rr = {
    scope: "title",
    begin: ge,
    relevance: 0
  }, or = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + ge,
    relevance: 0
  };
  var Rt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: bn,
    BACKSLASH_ESCAPE: ke,
    BINARY_NUMBER_MODE: ir,
    BINARY_NUMBER_RE: Mt,
    COMMENT: G,
    C_BLOCK_COMMENT_MODE: Se,
    C_LINE_COMMENT_MODE: me,
    C_NUMBER_MODE: Ct,
    C_NUMBER_RE: Tt,
    END_SAME_AS_BEGIN: function(l) {
      return Object.assign(
        l,
        {
          /** @type {ModeCallback} */
          "on:begin": (p, b) => {
            b.data._beginMatch = p[1];
          },
          /** @type {ModeCallback} */
          "on:end": (p, b) => {
            b.data._beginMatch !== p[1] && b.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: Ve,
    IDENT_RE: Ge,
    MATCH_NOTHING_RE: Q,
    METHOD_GUARD: or,
    NUMBER_MODE: rt,
    NUMBER_RE: te,
    PHRASAL_WORDS_MODE: gn,
    QUOTE_STRING_MODE: Nt,
    REGEXP_MODE: sr,
    RE_STARTERS_RE: hn,
    SHEBANG: fn,
    TITLE_MODE: ar,
    UNDERSCORE_IDENT_RE: ge,
    UNDERSCORE_TITLE_MODE: rr
  });
  function lr(l, p) {
    l.input[l.index - 1] === "." && p.ignoreMatch();
  }
  function cr(l, p) {
    l.className !== void 0 && (l.scope = l.className, delete l.className);
  }
  function dr(l, p) {
    p && l.beginKeywords && (l.begin = "\\b(" + l.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", l.__beforeBegin = lr, l.keywords = l.keywords || l.beginKeywords, delete l.beginKeywords, l.relevance === void 0 && (l.relevance = 0));
  }
  function ur(l, p) {
    Array.isArray(l.illegal) && (l.illegal = k(...l.illegal));
  }
  function pr(l, p) {
    if (l.match) {
      if (l.begin || l.end) throw new Error("begin & end are not supported with match");
      l.begin = l.match, delete l.match;
    }
  }
  function hr(l, p) {
    l.relevance === void 0 && (l.relevance = 1);
  }
  const fr = (l, p) => {
    if (!l.beforeMatch) return;
    if (l.starts) throw new Error("beforeMatch cannot be used with starts");
    const b = Object.assign({}, l);
    Object.keys(l).forEach((A) => {
      delete l[A];
    }), l.keywords = b.keywords, l.begin = m(b.beforeMatch, w(b.begin)), l.starts = {
      relevance: 0,
      contains: [
        Object.assign(b, { endsParent: !0 })
      ]
    }, l.relevance = 0, delete b.beforeMatch;
  }, br = [
    "of",
    "and",
    "for",
    "in",
    "not",
    "or",
    "if",
    "then",
    "parent",
    // common variable name
    "list",
    // common variable name
    "value"
    // common variable name
  ], gr = "keyword";
  function Pi(l, p, b = gr) {
    const A = /* @__PURE__ */ Object.create(null);
    return typeof l == "string" ? q(b, l.split(" ")) : Array.isArray(l) ? q(b, l) : Object.keys(l).forEach(function(U) {
      Object.assign(
        A,
        Pi(l[U], p, U)
      );
    }), A;
    function q(U, _) {
      p && (_ = _.map((y) => y.toLowerCase())), _.forEach(function(y) {
        const S = y.split("|");
        A[S[0]] = [U, mr(S[0], S[1])];
      });
    }
  }
  function mr(l, p) {
    return p ? Number(p) : vr(l) ? 0 : 1;
  }
  function vr(l) {
    return br.includes(l.toLowerCase());
  }
  const Li = {}, Ae = (l) => {
    console.error(l);
  }, Di = (l, ...p) => {
    console.log(`WARN: ${l}`, ...p);
  }, Xe = (l, p) => {
    Li[`${l}/${p}`] || (console.log(`Deprecated as of ${l}. ${p}`), Li[`${l}/${p}`] = !0);
  }, It = new Error();
  function qi(l, p, { key: b }) {
    let A = 0;
    const q = l[b], U = {}, _ = {};
    for (let y = 1; y <= p.length; y++)
      _[y + A] = q[y], U[y + A] = !0, A += P(p[y - 1]);
    l[b] = _, l[b]._emit = U, l[b]._multi = !0;
  }
  function yr(l) {
    if (Array.isArray(l.begin)) {
      if (l.skip || l.excludeBegin || l.returnBegin)
        throw Ae("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), It;
      if (typeof l.beginScope != "object" || l.beginScope === null)
        throw Ae("beginScope must be object"), It;
      qi(l, l.begin, { key: "beginScope" }), l.begin = J(l.begin, { joinWith: "" });
    }
  }
  function wr(l) {
    if (Array.isArray(l.end)) {
      if (l.skip || l.excludeEnd || l.returnEnd)
        throw Ae("skip, excludeEnd, returnEnd not compatible with endScope: {}"), It;
      if (typeof l.endScope != "object" || l.endScope === null)
        throw Ae("endScope must be object"), It;
      qi(l, l.end, { key: "endScope" }), l.end = J(l.end, { joinWith: "" });
    }
  }
  function _r(l) {
    l.scope && typeof l.scope == "object" && l.scope !== null && (l.beginScope = l.scope, delete l.scope);
  }
  function xr(l) {
    _r(l), typeof l.beginScope == "string" && (l.beginScope = { _wrap: l.beginScope }), typeof l.endScope == "string" && (l.endScope = { _wrap: l.endScope }), yr(l), wr(l);
  }
  function Er(l) {
    function p(_, y) {
      return new RegExp(
        h(_),
        "m" + (l.case_insensitive ? "i" : "") + (l.unicodeRegex ? "u" : "") + (y ? "g" : "")
      );
    }
    class b {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(y, S) {
        S.position = this.position++, this.matchIndexes[this.matchAt] = S, this.regexes.push([S, y]), this.matchAt += P(y) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const y = this.regexes.map((S) => S[1]);
        this.matcherRe = p(J(y, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(y) {
        this.matcherRe.lastIndex = this.lastIndex;
        const S = this.matcherRe.exec(y);
        if (!S)
          return null;
        const K = S.findIndex((ot, vn) => vn > 0 && ot !== void 0), F = this.matchIndexes[K];
        return S.splice(0, K), Object.assign(S, F);
      }
    }
    class A {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(y) {
        if (this.multiRegexes[y]) return this.multiRegexes[y];
        const S = new b();
        return this.rules.slice(y).forEach(([K, F]) => S.addRule(K, F)), S.compile(), this.multiRegexes[y] = S, S;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(y, S) {
        this.rules.push([y, S]), S.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(y) {
        const S = this.getMatcher(this.regexIndex);
        S.lastIndex = this.lastIndex;
        let K = S.exec(y);
        if (this.resumingScanAtSamePosition() && !(K && K.index === this.lastIndex)) {
          const F = this.getMatcher(0);
          F.lastIndex = this.lastIndex + 1, K = F.exec(y);
        }
        return K && (this.regexIndex += K.position + 1, this.regexIndex === this.count && this.considerAll()), K;
      }
    }
    function q(_) {
      const y = new A();
      return _.contains.forEach((S) => y.addRule(S.begin, { rule: S, type: "begin" })), _.terminatorEnd && y.addRule(_.terminatorEnd, { type: "end" }), _.illegal && y.addRule(_.illegal, { type: "illegal" }), y;
    }
    function U(_, y) {
      const S = (
        /** @type CompiledMode */
        _
      );
      if (_.isCompiled) return S;
      [
        cr,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        pr,
        xr,
        fr
      ].forEach((F) => F(_, y)), l.compilerExtensions.forEach((F) => F(_, y)), _.__beforeBegin = null, [
        dr,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        ur,
        // default to 1 relevance if not specified
        hr
      ].forEach((F) => F(_, y)), _.isCompiled = !0;
      let K = null;
      return typeof _.keywords == "object" && _.keywords.$pattern && (_.keywords = Object.assign({}, _.keywords), K = _.keywords.$pattern, delete _.keywords.$pattern), K = K || /\w+/, _.keywords && (_.keywords = Pi(_.keywords, l.case_insensitive)), S.keywordPatternRe = p(K, !0), y && (_.begin || (_.begin = /\B|\b/), S.beginRe = p(S.begin), !_.end && !_.endsWithParent && (_.end = /\B|\b/), _.end && (S.endRe = p(S.end)), S.terminatorEnd = h(S.end) || "", _.endsWithParent && y.terminatorEnd && (S.terminatorEnd += (_.end ? "|" : "") + y.terminatorEnd)), _.illegal && (S.illegalRe = p(
        /** @type {RegExp | string} */
        _.illegal
      )), _.contains || (_.contains = []), _.contains = [].concat(..._.contains.map(function(F) {
        return kr(F === "self" ? _ : F);
      })), _.contains.forEach(function(F) {
        U(
          /** @type Mode */
          F,
          S
        );
      }), _.starts && U(_.starts, y), S.matcher = q(S), S;
    }
    if (l.compilerExtensions || (l.compilerExtensions = []), l.contains && l.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return l.classNameAliases = i(l.classNameAliases || {}), U(
      /** @type Mode */
      l
    );
  }
  function Ui(l) {
    return l ? l.endsWithParent || Ui(l.starts) : !1;
  }
  function kr(l) {
    return l.variants && !l.cachedVariants && (l.cachedVariants = l.variants.map(function(p) {
      return i(l, { variants: null }, p);
    })), l.cachedVariants ? l.cachedVariants : Ui(l) ? i(l, { starts: l.starts ? i(l.starts) : null }) : Object.isFrozen(l) ? i(l) : l;
  }
  var Sr = "11.12.0";
  class Ar extends Error {
    constructor(p, b) {
      super(p), this.name = "HTMLInjectionError", this.html = b;
    }
  }
  const mn = n, Bi = i, ji = /* @__PURE__ */ Symbol("nomatch"), Or = 7, Fi = function(l) {
    const p = /* @__PURE__ */ Object.create(null), b = /* @__PURE__ */ Object.create(null), A = [];
    let q = !0;
    const U = "Could not find the language '{}', did you forget to load/include a language module?", _ = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let y = {
      ignoreUnescapedHTML: !1,
      throwUnescapedHTML: !1,
      noHighlightRe: /^(no-?highlight)$/i,
      languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
      classPrefix: "hljs-",
      cssSelector: "pre code",
      languages: null,
      // beta configuration options, subject to change, welcome to discuss
      // https://github.com/highlightjs/highlight.js/issues/1086
      __emitter: u
    };
    function S(f) {
      return y.noHighlightRe.test(f);
    }
    function K(f) {
      let E = f.className + " ";
      E += f.parentNode ? f.parentNode.className : "";
      const N = y.languageDetectRe.exec(E);
      if (N) {
        const L = ve(N[1]);
        return L || (Di(U.replace("{}", N[1])), Di("Falling back to no-highlight mode for this block.", f)), L ? N[1] : "no-highlight";
      }
      return E.split(/\s+/).find((L) => S(L) || ve(L));
    }
    function F(f, E, N) {
      let L = "", W = "";
      typeof E == "object" ? (L = f, N = E.ignoreIllegals, W = E.language) : (Xe("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Xe("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), W = f, L = E), N === void 0 && (N = !0);
      const ne = {
        code: L,
        language: W
      };
      Pt("before:highlight", ne);
      const ye = ne.result ? ne.result : ot(ne.language, ne.code, N);
      return ye.code = ne.code, Pt("after:highlight", ye), ye;
    }
    function ot(f, E, N, L) {
      const W = /* @__PURE__ */ Object.create(null);
      function ne(g, x) {
        return g.keywords[x];
      }
      function ye() {
        if (!O.keywords) {
          V.addText(D);
          return;
        }
        let g = 0;
        O.keywordPatternRe.lastIndex = 0;
        let x = O.keywordPatternRe.exec(D), T = "";
        for (; x; ) {
          T += D.substring(g, x.index);
          const R = re.case_insensitive ? x[0].toLowerCase() : x[0], X = ne(O, R);
          if (X) {
            const [ce, Wr] = X;
            if (V.addText(T), T = "", W[R] = (W[R] || 0) + 1, W[R] <= Or && (qt += Wr), ce.startsWith("_"))
              T += x[0];
            else {
              const zr = re.classNameAliases[ce] || ce;
              ae(x[0], zr);
            }
          } else
            T += x[0];
          g = O.keywordPatternRe.lastIndex, x = O.keywordPatternRe.exec(D);
        }
        T += D.substring(g), V.addText(T);
      }
      function Lt() {
        if (D === "") return;
        let g = null;
        if (typeof O.subLanguage == "string") {
          if (!p[O.subLanguage]) {
            V.addText(D);
            return;
          }
          g = ot(O.subLanguage, D, !0, Ji[O.subLanguage]), Ji[O.subLanguage] = /** @type {CompiledMode} */
          g._top;
        } else
          g = yn(D, O.subLanguage.length ? O.subLanguage : null);
        O.relevance > 0 && (qt += g.relevance), V.__addSublanguage(g._emitter, g.language);
      }
      function ee() {
        O.subLanguage != null ? Lt() : ye(), D = "";
      }
      function ae(g, x) {
        g !== "" && (V.startScope(x), V.addText(g), V.endScope());
      }
      function Ki(g, x) {
        let T = 1;
        const R = x.length - 1;
        for (; T <= R; ) {
          if (!g._emit[T]) {
            T++;
            continue;
          }
          const X = re.classNameAliases[g[T]] || g[T], ce = x[T];
          X ? ae(ce, X) : (D = ce, ye(), D = ""), T++;
        }
      }
      function Gi(g, x) {
        return g.scope && typeof g.scope == "string" && V.openNode(re.classNameAliases[g.scope] || g.scope), g.beginScope && (g.beginScope._wrap ? (ae(D, re.classNameAliases[g.beginScope._wrap] || g.beginScope._wrap), D = "") : g.beginScope._multi && (Ki(g.beginScope, x), D = "")), O = Object.create(g, { parent: { value: O } }), O;
      }
      function Vi(g, x, T) {
        let R = ze(g.endRe, T);
        if (R) {
          if (g["on:end"]) {
            const X = new t(g);
            g["on:end"](x, X), X.isMatchIgnored && (R = !1);
          }
          if (R) {
            for (; g.endsParent && g.parent; )
              g = g.parent;
            return g;
          }
        }
        if (g.endsWithParent)
          return Vi(g.parent, x, T);
      }
      function Ur(g) {
        return O.matcher.regexIndex === 0 ? (D += g[0], 1) : (En = !0, 0);
      }
      function Br(g) {
        const x = g[0], T = g.rule, R = new t(T), X = [T.__beforeBegin, T["on:begin"]];
        for (const ce of X)
          if (ce && (ce(g, R), R.isMatchIgnored))
            return Ur(x);
        return T.skip ? D += x : (T.excludeBegin && (D += x), ee(), !T.returnBegin && !T.excludeBegin && (D = x)), Gi(T, g), T.returnBegin ? 0 : x.length;
      }
      function jr(g) {
        const x = g[0], T = E.substring(g.index), R = Vi(O, g, T);
        if (!R)
          return ji;
        const X = O;
        O.endScope && O.endScope._wrap ? (ee(), ae(x, O.endScope._wrap)) : O.endScope && O.endScope._multi ? (ee(), Ki(O.endScope, g)) : X.skip ? D += x : (X.returnEnd || X.excludeEnd || (D += x), ee(), X.excludeEnd && (D = x));
        do
          O.scope && V.closeNode(), !O.skip && !O.subLanguage && (qt += O.relevance), O = O.parent;
        while (O !== R.parent);
        return R.starts && Gi(R.starts, g), X.returnEnd ? 0 : x.length;
      }
      function Fr() {
        const g = [];
        for (let x = O; x !== re; x = x.parent)
          x.scope && g.unshift(x.scope);
        g.forEach((x) => V.openNode(x));
      }
      let Dt = {};
      function Xi(g, x) {
        const T = x && x[0];
        if (D += g, T == null)
          return ee(), 0;
        if (Dt.type === "begin" && x.type === "end" && Dt.index === x.index && T === "") {
          if (D += E.slice(x.index, x.index + 1), !q) {
            const R = new Error(`0 width match regex (${f})`);
            throw R.languageName = f, R.badRule = Dt.rule, R;
          }
          return 1;
        }
        if (Dt = x, x.type === "begin")
          return Br(x);
        if (x.type === "illegal" && !N) {
          const R = new Error('Illegal lexeme "' + T + '" for mode "' + (O.scope || "<unnamed>") + '"');
          throw R.mode = O, R;
        } else if (x.type === "end") {
          const R = jr(x);
          if (R !== ji)
            return R;
        }
        if (x.type === "illegal" && T === "")
          return x.index === E.length || (D += `
`), 1;
        if (xn > 1e5 && xn > x.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return D += T, T.length;
      }
      const re = ve(f);
      if (!re)
        throw Ae(U.replace("{}", f)), new Error('Unknown language: "' + f + '"');
      const Hr = Er(re);
      let _n = "", O = L || Hr;
      const Ji = {}, V = new y.__emitter(y);
      Fr();
      let D = "", qt = 0, Oe = 0, xn = 0, En = !1;
      try {
        if (re.__emitTokens)
          re.__emitTokens(E, V);
        else {
          for (O.matcher.considerAll(); ; ) {
            xn++, En ? En = !1 : O.matcher.considerAll(), O.matcher.lastIndex = Oe;
            const g = O.matcher.exec(E);
            if (!g) break;
            const x = E.substring(Oe, g.index), T = Xi(x, g);
            Oe = g.index + T;
          }
          Xi(E.substring(Oe));
        }
        return V.finalize(), _n = V.toHTML(), {
          language: f,
          value: _n,
          relevance: qt,
          illegal: !1,
          _emitter: V,
          _top: O
        };
      } catch (g) {
        if (g.message && g.message.includes("Illegal"))
          return {
            language: f,
            value: mn(E),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: g.message,
              index: Oe,
              context: E.slice(Oe - 100, Oe + 100),
              mode: g.mode,
              resultSoFar: _n
            },
            _emitter: V
          };
        if (q)
          return {
            language: f,
            value: mn(E),
            illegal: !1,
            relevance: 0,
            errorRaised: g,
            _emitter: V,
            _top: O
          };
        throw g;
      }
    }
    function vn(f) {
      const E = {
        value: mn(f),
        illegal: !1,
        relevance: 0,
        _top: _,
        _emitter: new y.__emitter(y)
      };
      return E._emitter.addText(f), E;
    }
    function yn(f, E) {
      E = E || y.languages || Object.keys(p);
      const N = vn(f), L = E.filter(ve).filter(zi).map(
        (ee) => ot(ee, f, !1)
      );
      L.unshift(N);
      const W = L.sort((ee, ae) => {
        if (ee.relevance !== ae.relevance) return ae.relevance - ee.relevance;
        if (ee.language && ae.language) {
          if (ve(ee.language).supersetOf === ae.language)
            return 1;
          if (ve(ae.language).supersetOf === ee.language)
            return -1;
        }
        return 0;
      }), [ne, ye] = W, Lt = ne;
      return Lt.secondBest = ye, Lt;
    }
    function Tr(f, E, N) {
      const L = E && b[E] || N;
      f.classList.add("hljs"), f.classList.add(`language-${L}`);
    }
    function wn(f) {
      let E = null;
      const N = K(f);
      if (S(N)) return;
      if (Pt(
        "before:highlightElement",
        { el: f, language: N }
      ), f.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", f);
        return;
      }
      if (f.children.length > 0 && (y.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(f)), y.throwUnescapedHTML))
        throw new Ar(
          "One of your code blocks includes unescaped HTML.",
          f.innerHTML
        );
      E = f;
      const L = E.textContent, W = N ? F(L, { language: N, ignoreIllegals: !0 }) : yn(L);
      f.innerHTML = W.value, f.dataset.highlighted = "yes", Tr(f, N, W.language), f.result = {
        language: W.language,
        // TODO: remove with version 11.0
        re: W.relevance,
        relevance: W.relevance
      }, W.secondBest && (f.secondBest = {
        language: W.secondBest.language,
        relevance: W.secondBest.relevance
      }), Pt("after:highlightElement", { el: f, result: W, text: L });
    }
    function Mr(f) {
      y = Bi(y, f);
    }
    const Nr = () => {
      $t(), Xe("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Cr() {
      $t(), Xe("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Hi = !1;
    function $t() {
      function f() {
        $t();
      }
      if (document.readyState === "loading") {
        Hi || window.addEventListener("DOMContentLoaded", f, !1), Hi = !0;
        return;
      }
      document.querySelectorAll(y.cssSelector).forEach(wn);
    }
    function Rr(f, E) {
      let N = null;
      try {
        N = E(l);
      } catch (L) {
        if (Ae("Language definition for '{}' could not be registered.".replace("{}", f)), q)
          Ae(L);
        else
          throw L;
        N = _;
      }
      N.name || (N.name = f), p[f] = N, N.rawDefinition = E.bind(null, l), N.aliases && Wi(N.aliases, { languageName: f });
    }
    function Ir(f) {
      delete p[f];
      for (const E of Object.keys(b))
        b[E] === f && delete b[E];
    }
    function $r() {
      return Object.keys(p);
    }
    function ve(f) {
      return f = (f || "").toLowerCase(), p[f] || p[b[f]];
    }
    function Wi(f, { languageName: E }) {
      typeof f == "string" && (f = [f]), f.forEach((N) => {
        b[N.toLowerCase()] = E;
      });
    }
    function zi(f) {
      const E = ve(f);
      return E && !E.disableAutodetect;
    }
    function Pr(f) {
      f["before:highlightBlock"] && !f["before:highlightElement"] && (f["before:highlightElement"] = (E) => {
        f["before:highlightBlock"](
          Object.assign({ block: E.el }, E)
        );
      }), f["after:highlightBlock"] && !f["after:highlightElement"] && (f["after:highlightElement"] = (E) => {
        f["after:highlightBlock"](
          Object.assign({ block: E.el }, E)
        );
      });
    }
    function Lr(f) {
      Pr(f), A.push(f);
    }
    function Dr(f) {
      const E = A.indexOf(f);
      E !== -1 && A.splice(E, 1);
    }
    function Pt(f, E) {
      const N = f;
      A.forEach(function(L) {
        L[N] && L[N](E);
      });
    }
    function qr(f) {
      return Xe("10.7.0", "highlightBlock will be removed entirely in v12.0"), Xe("10.7.0", "Please use highlightElement now."), wn(f);
    }
    Object.assign(l, {
      highlight: F,
      highlightAuto: yn,
      highlightAll: $t,
      highlightElement: wn,
      // TODO: Remove with v12 API
      highlightBlock: qr,
      configure: Mr,
      initHighlighting: Nr,
      initHighlightingOnLoad: Cr,
      registerLanguage: Rr,
      unregisterLanguage: Ir,
      listLanguages: $r,
      getLanguage: ve,
      registerAliases: Wi,
      autoDetection: zi,
      inherit: Bi,
      addPlugin: Lr,
      removePlugin: Dr
    }), l.debugMode = function() {
      q = !1;
    }, l.safeMode = function() {
      q = !0;
    }, l.versionString = Sr, l.regex = {
      concat: m,
      lookahead: w,
      either: k,
      optional: C,
      anyNumberOfTimes: M
    };
    for (const f in Rt)
      typeof Rt[f] == "object" && e(Rt[f]);
    return Object.assign(l, Rt), l;
  }, Je = Fi({});
  return Je.newInstance = () => Fi({}), Rn = Je, Je.HighlightJS = Je, Je.default = Je, Rn;
}
var Gc = /* @__PURE__ */ Kc();
const un = /* @__PURE__ */ zc(Gc), hs = "[A-Za-z$_][0-9A-Za-z$_]*", Vc = [
  "as",
  // for exports
  "in",
  "of",
  "if",
  "for",
  "while",
  "finally",
  "var",
  "new",
  "function",
  "do",
  "return",
  "void",
  "else",
  "break",
  "catch",
  "instanceof",
  "with",
  "throw",
  "case",
  "default",
  "try",
  "switch",
  "continue",
  "typeof",
  "delete",
  "let",
  "yield",
  "const",
  "class",
  // JS handles these with a special rule
  // "get",
  // "set",
  "debugger",
  "async",
  "await",
  "static",
  "import",
  "from",
  "export",
  "extends",
  // It's reached stage 3, which is "recommended for implementation":
  "using"
], Xc = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], Ga = [
  // Fundamental objects
  "Object",
  "Function",
  "Boolean",
  "Symbol",
  // numbers and dates
  "Math",
  "Date",
  "Number",
  "BigInt",
  // text
  "String",
  "RegExp",
  // Indexed collections
  "Array",
  "Float32Array",
  "Float64Array",
  "Int8Array",
  "Uint8Array",
  "Uint8ClampedArray",
  "Int16Array",
  "Int32Array",
  "Uint16Array",
  "Uint32Array",
  "BigInt64Array",
  "BigUint64Array",
  // Keyed collections
  "Set",
  "Map",
  "WeakSet",
  "WeakMap",
  // Structured data
  "ArrayBuffer",
  "SharedArrayBuffer",
  "Atomics",
  "DataView",
  "JSON",
  // Control abstraction objects
  "Promise",
  "Generator",
  "GeneratorFunction",
  "AsyncFunction",
  // Reflection
  "Reflect",
  "Proxy",
  // Internationalization
  "Intl",
  // WebAssembly
  "WebAssembly"
], Va = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], Xa = [
  "setInterval",
  "setTimeout",
  "clearInterval",
  "clearTimeout",
  "require",
  "exports",
  "eval",
  "isFinite",
  "isNaN",
  "parseFloat",
  "parseInt",
  "decodeURI",
  "decodeURIComponent",
  "encodeURI",
  "encodeURIComponent",
  "escape",
  "unescape"
], Jc = [
  "arguments",
  "this",
  "super",
  "console",
  "window",
  "document",
  "localStorage",
  "sessionStorage",
  "module",
  "self",
  "global"
  // Node.js
], Zc = [].concat(
  Xa,
  Ga,
  Va
);
function Yc(e) {
  const t = e.regex, n = (G, { after: me }) => {
    const Se = "</" + G[0].slice(1);
    return G.input.indexOf(Se, me) !== -1;
  }, i = hs, s = {
    begin: "<>",
    end: "</>"
  }, a = /<[A-Za-z0-9\\._:-]+\s*\/>/, r = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (G, me) => {
      const Se = G[0].length + G.index, Ve = G.input[Se];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        Ve === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        Ve === ","
      ) {
        me.ignoreMatch();
        return;
      }
      Ve === ">" && (n(G, { after: Se }) || me.ignoreMatch());
      let rt;
      const Ct = G.input.substring(Se);
      if (rt = Ct.match(/^\s*=/)) {
        me.ignoreMatch();
        return;
      }
      if ((rt = Ct.match(/^\s+extends\s+/)) && rt.index === 0) {
        me.ignoreMatch();
        return;
      }
    }
  }, o = {
    $pattern: hs,
    keyword: Vc,
    literal: Xc,
    built_in: Zc,
    "variable.language": Jc
  }, c = "[0-9](_?[0-9])*", d = `\\.(${c})`, u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", h = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${u})((${d})|\\.)?|(${d}))[eE][+-]?(${c})\\b` },
      { begin: `\\b(${u})\\b((${d})\\b|\\.)?|(${d})\\b` },
      // DecimalBigIntegerLiteral
      { begin: "\\b(0|[1-9](_?[0-9])*)n\\b" },
      // NonDecimalIntegerLiteral
      { begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b" },
      { begin: "\\b0[bB][0-1](_?[0-1])*n?\\b" },
      { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" },
      // LegacyOctalIntegerLiteral (does not include underscore separators)
      // https://tc39.es/ecma262/#sec-additional-syntax-numeric-literals
      { begin: "\\b0[0-7]+n?\\b" }
    ],
    relevance: 0
  }, w = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: o,
    contains: []
    // defined later
  }, M = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        w
      ],
      subLanguage: "xml"
    }
  }, C = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        w
      ],
      subLanguage: "css"
    }
  }, m = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        w
      ],
      subLanguage: "graphql"
    }
  }, v = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      e.BACKSLASH_ESCAPE,
      w
    ]
  }, P = {
    className: "comment",
    variants: [
      e.COMMENT(
        /\/\*\*(?!\/)/,
        "\\*/",
        {
          relevance: 0,
          contains: [
            {
              begin: "(?=@[A-Za-z]+)",
              relevance: 0,
              contains: [
                {
                  className: "doctag",
                  begin: "@[A-Za-z]+"
                },
                {
                  className: "type",
                  begin: "\\{",
                  end: "\\}",
                  excludeEnd: !0,
                  excludeBegin: !0,
                  relevance: 0
                },
                {
                  className: "variable",
                  begin: i + "(?=\\s*(-)|$)",
                  endsParent: !0,
                  relevance: 0
                },
                // eat spaces (not newlines) so we can find
                // types or variables
                {
                  begin: /(?=[^\n])\s/,
                  relevance: 0
                }
              ]
            }
          ]
        }
      ),
      e.C_BLOCK_COMMENT_MODE,
      e.C_LINE_COMMENT_MODE
    ]
  }, ze = [
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE,
    M,
    C,
    m,
    v,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    h
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  w.contains = ze.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: o,
    contains: [
      "self"
    ].concat(ze)
  });
  const Ke = [].concat(P, w.contains), J = Ke.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: o,
      contains: ["self"].concat(Ke)
    }
  ]), Q = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: o,
    contains: J
  }, Ge = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          i,
          /\s+/,
          /extends/,
          /\s+/,
          t.concat(i, "(", t.concat(/\./, i), ")*")
        ],
        scope: {
          1: "keyword",
          3: "title.class",
          5: "keyword",
          7: "title.class.inherited"
        }
      },
      // class Car
      {
        match: [
          /class/,
          /\s+/,
          i
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, ge = {
    relevance: 0,
    match: t.either(
      // Hard coded exceptions
      /\bJSON/,
      // Float32Array, OutT
      /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,
      // CSSFactory, CSSFactoryT
      /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,
      // FPs, FPsT
      /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/
      // P
      // single letters are not highlighted
      // BLAH
      // this will be flagged as a UPPER_CASE_CONSTANT instead
    ),
    className: "title.class",
    keywords: {
      _: [
        // se we still get relevance credit for JS library classes
        ...Ga,
        ...Va
      ]
    }
  }, te = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, Tt = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          i,
          /(?=\s*\()/
        ]
      },
      // anonymous function
      {
        match: [
          /function/,
          /\s*(?=\()/
        ]
      }
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    label: "func.def",
    contains: [Q],
    illegal: /%/
  }, Mt = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function hn(G) {
    return t.concat("(?!", G.join("|"), ")");
  }
  const fn = {
    match: t.concat(
      /\b/,
      hn([
        ...Xa,
        "super",
        "import",
        "await"
      ].map((G) => `${G}\\s*\\(`)),
      i,
      t.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, ke = {
    begin: t.concat(/\./, t.lookahead(
      t.concat(i, /(?![0-9A-Za-z$_(])/)
    )),
    end: i,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, bn = {
    match: [
      /get|set/,
      /\s+/,
      i,
      /(?=\()/
    ],
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      {
        // eat to avoid empty params
        begin: /\(\)/
      },
      Q
    ]
  }, Nt = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", gn = {
    match: [
      /const|var|let/,
      /\s+/,
      i,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      t.lookahead(Nt)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      Q
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: o,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: J, CLASS_REFERENCE: ge },
    illegal: /#(?![$_A-Za-z])/,
    contains: [
      e.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      te,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      M,
      C,
      m,
      v,
      P,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      h,
      ge,
      {
        scope: "attr",
        match: i + t.lookahead(":"),
        relevance: 0
      },
      gn,
      {
        // "value" container
        begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          P,
          e.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: Nt,
            returnBegin: !0,
            end: "\\s*=>",
            contains: [
              {
                className: "params",
                variants: [
                  {
                    begin: e.UNDERSCORE_IDENT_RE,
                    relevance: 0
                  },
                  {
                    className: null,
                    begin: /\(\s*\)/,
                    skip: !0
                  },
                  {
                    begin: /(\s*)\(/,
                    end: /\)/,
                    excludeBegin: !0,
                    excludeEnd: !0,
                    keywords: o,
                    contains: J
                  }
                ]
              }
            ]
          },
          {
            // could be a comma delimited list of params to a function call
            begin: /,/,
            relevance: 0
          },
          {
            match: /\s+/,
            relevance: 0
          },
          {
            // JSX
            variants: [
              { begin: s.begin, end: s.end },
              { match: a },
              {
                begin: r.begin,
                // we carefully check the opening tag to see if it truly
                // is a tag and not a false positive
                "on:begin": r.isTrulyOpeningTag,
                end: r.end
              }
            ],
            subLanguage: "xml",
            contains: [
              {
                begin: r.begin,
                end: r.end,
                skip: !0,
                contains: ["self"]
              }
            ]
          }
        ]
      },
      Tt,
      {
        // prevent this from getting swallowed up by function
        // since they appear "function like"
        beginKeywords: "while if switch catch for"
      },
      {
        // we have to count the parens to make sure we actually have the correct
        // bounding ( ).  There could be any number of sub-expressions inside
        // also surrounded by parens.
        begin: "\\b(?!function)" + e.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
        // end parens
        returnBegin: !0,
        label: "func.def",
        contains: [
          Q,
          e.inherit(e.TITLE_MODE, { begin: i, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      ke,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + i,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [Q]
      },
      fn,
      Mt,
      Ge,
      bn,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const Qc = "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity", ed = {
  scope: "number",
  match: Qc,
  relevance: 0
};
function td(e) {
  const t = {
    className: "attr",
    begin: /(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,
    relevance: 1.01
  }, n = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, i = [
    "true",
    "false",
    "null"
  ], s = {
    scope: "literal",
    beginKeywords: i.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc", "json5"],
    keywords: {
      literal: i
    },
    contains: [
      t,
      n,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      s,
      ed,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function nd(e) {
  const t = e.regex, n = e.COMMENT("--", "$"), i = {
    scope: "string",
    variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [{ match: /''/ }]
      }
    ]
  }, s = {
    begin: /"/,
    end: /"/,
    contains: [{ match: /""/ }]
  }, a = [
    "true",
    "false",
    // Not sure it's correct to call NULL literal, and clauses like IS [NOT] NULL look strange that way.
    // "null",
    "unknown"
  ], r = [
    "double precision",
    "large object",
    "with timezone",
    "without timezone"
  ], o = [
    "bigint",
    "binary",
    "blob",
    "boolean",
    "char",
    "character",
    "clob",
    "date",
    "dec",
    "decfloat",
    "decimal",
    "float",
    "int",
    "integer",
    "interval",
    "nchar",
    "nclob",
    "national",
    "numeric",
    "real",
    "row",
    "smallint",
    "time",
    "timestamp",
    "varchar",
    "varying",
    // modifier (character varying)
    "varbinary"
  ], c = [
    "add",
    "asc",
    "collation",
    "desc",
    "final",
    "first",
    "last",
    "view"
  ], d = [
    "abs",
    "acos",
    "all",
    "allocate",
    "alter",
    "and",
    "any",
    "are",
    "array",
    "array_agg",
    "array_max_cardinality",
    "as",
    "asensitive",
    "asin",
    "asymmetric",
    "at",
    "atan",
    "atomic",
    "authorization",
    "avg",
    "begin",
    "begin_frame",
    "begin_partition",
    "between",
    "bigint",
    "binary",
    "blob",
    "boolean",
    "both",
    "by",
    "call",
    "called",
    "cardinality",
    "cascaded",
    "case",
    "cast",
    "ceil",
    "ceiling",
    "char",
    "char_length",
    "character",
    "character_length",
    "check",
    "classifier",
    "clob",
    "close",
    "coalesce",
    "collate",
    "collect",
    "column",
    "commit",
    "condition",
    "connect",
    "constraint",
    "contains",
    "convert",
    "copy",
    "corr",
    "corresponding",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "create",
    "cross",
    "cube",
    "cume_dist",
    "current",
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_row",
    "current_schema",
    "current_time",
    "current_timestamp",
    "current_path",
    "current_role",
    "current_transform_group_for_type",
    "current_user",
    "cursor",
    "cycle",
    "date",
    "day",
    "deallocate",
    "dec",
    "decimal",
    "decfloat",
    "declare",
    "default",
    "define",
    "delete",
    "dense_rank",
    "deref",
    "describe",
    "deterministic",
    "disconnect",
    "distinct",
    "double",
    "drop",
    "dynamic",
    "each",
    "element",
    "else",
    "empty",
    "end",
    "end_frame",
    "end_partition",
    "end-exec",
    "equals",
    "escape",
    "every",
    "except",
    "exec",
    "execute",
    "exists",
    "exp",
    "external",
    "extract",
    "false",
    "fetch",
    "filter",
    "first_value",
    "float",
    "floor",
    "for",
    "foreign",
    "frame_row",
    "free",
    "from",
    "full",
    "function",
    "fusion",
    "get",
    "global",
    "grant",
    "group",
    "grouping",
    "groups",
    "having",
    "hold",
    "hour",
    "identity",
    "in",
    "indicator",
    "initial",
    "inner",
    "inout",
    "insensitive",
    "insert",
    "int",
    "integer",
    "intersect",
    "intersection",
    "interval",
    "into",
    "is",
    "join",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "language",
    "large",
    "last_value",
    "lateral",
    "lead",
    "leading",
    "left",
    "like",
    "like_regex",
    "listagg",
    "ln",
    "local",
    "localtime",
    "localtimestamp",
    "log",
    "log10",
    "lower",
    "match",
    "match_number",
    "match_recognize",
    "matches",
    "max",
    "member",
    "merge",
    "method",
    "min",
    "minute",
    "mod",
    "modifies",
    "module",
    "month",
    "multiset",
    "national",
    "natural",
    "nchar",
    "nclob",
    "new",
    "no",
    "none",
    "normalize",
    "not",
    "nth_value",
    "ntile",
    "null",
    "nullif",
    "numeric",
    "octet_length",
    "occurrences_regex",
    "of",
    "offset",
    "old",
    "omit",
    "on",
    "one",
    "only",
    "open",
    "or",
    "order",
    "out",
    "outer",
    "over",
    "overlaps",
    "overlay",
    "parameter",
    "partition",
    "pattern",
    "per",
    "percent",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "period",
    "portion",
    "position",
    "position_regex",
    "power",
    "precedes",
    "precision",
    "prepare",
    "primary",
    "procedure",
    "ptf",
    "range",
    "rank",
    "reads",
    "real",
    "recursive",
    "ref",
    "references",
    "referencing",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "release",
    "result",
    "return",
    "returns",
    "revoke",
    "right",
    "rollback",
    "rollup",
    "row",
    "row_number",
    "rows",
    "running",
    "savepoint",
    "scope",
    "scroll",
    "search",
    "second",
    "seek",
    "select",
    "sensitive",
    "session_user",
    "set",
    "show",
    "similar",
    "sin",
    "sinh",
    "skip",
    "smallint",
    "some",
    "specific",
    "specifictype",
    "sql",
    "sqlexception",
    "sqlstate",
    "sqlwarning",
    "sqrt",
    "start",
    "static",
    "stddev_pop",
    "stddev_samp",
    "submultiset",
    "subset",
    "substring",
    "substring_regex",
    "succeeds",
    "sum",
    "symmetric",
    "system",
    "system_time",
    "system_user",
    "table",
    "tablesample",
    "tan",
    "tanh",
    "then",
    "time",
    "timestamp",
    "timezone_hour",
    "timezone_minute",
    "to",
    "trailing",
    "translate",
    "translate_regex",
    "translation",
    "treat",
    "trigger",
    "trim",
    "trim_array",
    "true",
    "truncate",
    "uescape",
    "union",
    "unique",
    "unknown",
    "unnest",
    "update",
    "upper",
    "user",
    "using",
    "value",
    "values",
    "value_of",
    "var_pop",
    "var_samp",
    "varbinary",
    "varchar",
    "varying",
    "versioning",
    "when",
    "whenever",
    "where",
    "width_bucket",
    "window",
    "with",
    "within",
    "without",
    "year"
  ], u = [
    "abs",
    "acos",
    "array_agg",
    "asin",
    "atan",
    "avg",
    "cast",
    "ceil",
    "ceiling",
    "coalesce",
    "corr",
    "cos",
    "cosh",
    "count",
    "covar_pop",
    "covar_samp",
    "cume_dist",
    "dense_rank",
    "deref",
    "element",
    "exp",
    "extract",
    "first_value",
    "floor",
    "json_array",
    "json_arrayagg",
    "json_exists",
    "json_object",
    "json_objectagg",
    "json_query",
    "json_table",
    "json_table_primitive",
    "json_value",
    "lag",
    "last_value",
    "lead",
    "listagg",
    "ln",
    "log",
    "log10",
    "lower",
    "max",
    "min",
    "mod",
    "nth_value",
    "ntile",
    "nullif",
    "percent_rank",
    "percentile_cont",
    "percentile_disc",
    "position",
    "position_regex",
    "power",
    "rank",
    "regr_avgx",
    "regr_avgy",
    "regr_count",
    "regr_intercept",
    "regr_r2",
    "regr_slope",
    "regr_sxx",
    "regr_sxy",
    "regr_syy",
    "row_number",
    "sin",
    "sinh",
    "sqrt",
    "stddev_pop",
    "stddev_samp",
    "substring",
    "substring_regex",
    "sum",
    "tan",
    "tanh",
    "translate",
    "translate_regex",
    "treat",
    "trim",
    "trim_array",
    "unnest",
    "upper",
    "value_of",
    "var_pop",
    "var_samp",
    "width_bucket"
  ], h = [
    "current_catalog",
    "current_date",
    "current_default_transform_group",
    "current_path",
    "current_role",
    "current_schema",
    "current_transform_group_for_type",
    "current_user",
    "session_user",
    "system_time",
    "system_user",
    "current_time",
    "localtime",
    "current_timestamp",
    "localtimestamp"
  ], w = [
    "create table",
    "insert into",
    "primary key",
    "foreign key",
    "not null",
    "alter table",
    "add constraint",
    "grouping sets",
    "on overflow",
    "character set",
    "respect nulls",
    "ignore nulls",
    "nulls first",
    "nulls last",
    "depth first",
    "breadth first"
  ], M = u, C = [
    ...d,
    ...c
  ].filter((J) => !u.includes(J)), m = {
    scope: "variable",
    match: /@[a-z0-9][a-z0-9_]*/
  }, v = {
    scope: "operator",
    match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  }, k = {
    match: t.concat(/\b/, t.either(...M), /\s*\(/),
    relevance: 0,
    keywords: { built_in: M }
  };
  function P(J) {
    return t.concat(
      /\b/,
      t.either(...J.map((Q) => Q.replace(/\s+/, "\\s+"))),
      /\b/
    );
  }
  const ze = {
    scope: "keyword",
    match: P(w),
    relevance: 0
  };
  function Ke(J, {
    exceptions: Q,
    when: Ge
  } = {}) {
    const ge = Ge;
    return Q = Q || [], J.map((te) => te.match(/\|\d+$/) || Q.includes(te) ? te : ge(te) ? `${te}|0` : te);
  }
  return {
    name: "SQL",
    case_insensitive: !0,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: Ke(C, { when: (J) => J.length < 3 }),
      literal: a,
      type: o,
      built_in: h
    },
    contains: [
      {
        scope: "type",
        match: P(r)
      },
      ze,
      k,
      m,
      i,
      s,
      e.C_NUMBER_MODE,
      e.C_BLOCK_COMMENT_MODE,
      n,
      v
    ]
  };
}
un.registerLanguage("javascript", Yc);
un.registerLanguage("json", td);
un.registerLanguage("sql", nd);
const Ft = /* @__PURE__ */ new Map(), id = 400, sd = 2e4;
function fs(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function ad(e, t) {
  const n = String(e ?? "");
  if (n === "") return "";
  if (n.length > sd) return fs(n);
  const i = `${t}:${n}`, s = Ft.get(i);
  if (s !== void 0) return s;
  let a;
  try {
    a = un.highlight(n, { language: t, ignoreIllegals: !0 }).value;
  } catch {
    a = fs(n);
  }
  return Ft.size >= id && Ft.clear(), Ft.set(i, a), a;
}
async function ei(e) {
  const t = await fetch(e, { headers: { Accept: "application/json" } }), n = await t.json().catch(() => null);
  if (!t.ok) throw new Error(n && n.error || `HTTP ${t.status}`);
  if (n === null) throw new Error("The response was not JSON.");
  return n;
}
async function bs(e) {
  const t = await ei(e), n = {};
  return Object.entries(t.sections || {}).forEach(([i, s]) => {
    n[i] = s.payload || {};
  }), { profile: t, payloads: n };
}
function Mi(e, t = 0) {
  return Number(e || 0).toFixed(t);
}
function Ni(e) {
  const t = Number(e || 0);
  return t < 1024 ? `${t} B` : t < 1048576 ? `${(t / 1024).toFixed(1)} kB` : `${(t / 1048576).toFixed(1)} MB`;
}
function rd(e, t, n) {
  return `${e} ${Number(e) === 1 ? t : n}`;
}
function od(e, t = Date.now() / 1e3) {
  const n = Math.max(0, t - Number(e || 0));
  return n < 60 ? `${Math.round(n)}s ago` : n < 3600 ? `${Math.round(n / 60)}m ago` : `${Math.round(n / 3600)}h ago`;
}
function ld(e, t) {
  let n = e;
  try {
    n = new URL(e, t).pathname;
  } catch {
    return e;
  }
  if (n.length <= 42) return n;
  const i = n.split("/").filter(Boolean);
  return i.length > 2 ? `…/${i.slice(-2).join("/")}` : n;
}
function cd(e) {
  const t = e && e.magewire;
  return t && t.component ? `${t.component} ${t.action || ""}`.trim() : e && e.path || "/";
}
function dd(e) {
  if (!e || e.delta === null || e.delta === void 0) return "not comparable";
  if (e.delta === 0) return "no change";
  const t = e.delta > 0 ? "+" : "-", n = e.unit === "B" ? Ni(Math.abs(e.delta)) : `${Mi(Math.abs(e.delta), e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
  return `${t}${n}`;
}
function ud(e, t) {
  const n = e[t];
  return n == null ? "none" : e.unit === "B" ? Ni(n) : `${Mi(n, e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
}
function pd(e) {
  return Object.entries(e.methods || {}).map(([t, n]) => `${n} ${t}`).join(", ");
}
function Ja(e, t, n, i) {
  if (!e || !n || !/^[a-z][a-z0-9+.-]*:\/\//i.test(e) || /^(javascript|data|vbscript):/i.test(e))
    return "";
  const s = n.startsWith("/") ? n : `${t}/${n}`;
  return e.replace("%f", () => encodeURI(s)).replace("%l", () => String(i || 1));
}
function hd(e, t, n) {
  const i = String(n || "").match(/^(.+\.php):(\d+)$/);
  return i ? Ja(e, t, i[1], Number(i[2])) : "";
}
const ti = /* @__PURE__ */ new Map(), Ht = /* @__PURE__ */ new Map();
function Ci() {
  const e = window.Magewire || window.magewire;
  return e && typeof e == "object" ? e : null;
}
function Ri() {
  const e = Ci();
  try {
    return Object.values(e?.components?.componentsById ?? {});
  } catch {
    return [];
  }
}
function fd(e) {
  try {
    return JSON.stringify(e ?? {}).length;
  } catch {
    return 0;
  }
}
function bd(e) {
  return ti.clear(), Ri().map((t) => {
    const n = t.fingerprint ?? {}, i = t.serverMemo ?? {}, s = String(n.id ?? "");
    return t.el && ti.set(s, t.el), {
      id: s,
      name: String(n.name ?? "unknown"),
      resolver: String(n.resolver ?? "unknown"),
      handle: String(n.handle ?? ""),
      keys: e === be ? 0 : dn(i.data ?? {}).length,
      memo_bytes: fd(i),
      listeners: (t.effects?.listeners ?? []).length,
      children: Object.keys(i.children ?? {}).length,
      path: t.el ? gd(t.el) : ""
    };
  });
}
function gd(e) {
  const t = e.tagName ? e.tagName.toLowerCase() : "?";
  return e.id ? `${t}#${e.id}` : t;
}
function gs(e, t) {
  if (t === be)
    return "The value policy is set to none, so component state is not read.";
  const n = Ri().find((i) => String(i.fingerprint?.id) === String(e));
  if (!n) return "This component is no longer on the page.";
  try {
    return JSON.stringify(Oi(n.serverMemo?.data ?? {}, t), null, 2);
  } catch (i) {
    return `Could not read this component: ${i && i.message ? i.message : "threw"}`;
  }
}
function md() {
  return {
    present: Ci() !== null,
    components: Ri().length,
    // Already the route, not the base: Magewire publishes it as /magewire/post and the
    // client appends the action itself.
    endpoint: String(window.livewire_app_url || "")
  };
}
function ms(e) {
  const t = Ci();
  if (!t || typeof t.hook != "function") return !1;
  const n = /* @__PURE__ */ new Map(), i = (a) => String(a?.fingerprint?.name ?? "unknown"), s = (a) => String(a?.component?.fingerprint?.id ?? "");
  try {
    t.hook("message.sent", (a, r) => {
      n.set(s(a), { at: performance.now(), name: i(r) });
    }), t.hook("message.processed", (a, r) => {
      const o = n.get(s(a));
      n.delete(s(a)), e({
        component: i(r),
        action: vs(a),
        duration_ms: o ? Math.round((performance.now() - o.at) * 10) / 10 : null,
        failed: !1
      });
    }), t.hook("message.failed", (a, r) => {
      n.delete(s(a)), e({
        component: i(r),
        action: vs(a),
        duration_ms: null,
        failed: !0
      });
    });
  } catch {
    return !1;
  }
  return !0;
}
function vs(e) {
  const t = (e?.updateQueue ?? [])[0];
  if (!t) return "refresh";
  const n = t.payload ?? {}, i = (...s) => s.map((a) => n[a] ?? t[a]).find(Boolean) ?? "unknown";
  return t.type === "callMethod" ? `${i("method")}()` : t.type === "syncInput" ? `set ${i("name")}` : t.type === "fireEvent" ? `on ${i("event")}` : String(t.type || "update");
}
function vd(e, t) {
  const n = ti.get(String(e));
  if (!n || !n.style) return;
  if (t) {
    Ht.has(String(e)) || Ht.set(String(e), {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  const i = Ht.get(String(e));
  i && (n.style.outline = i.outline, n.style.outlineOffset = i.offset, Ht.delete(String(e)));
}
const In = /* @__PURE__ */ new WeakMap(), sn = /* @__PURE__ */ new Map(), ut = /* @__PURE__ */ new Map();
let ys = 0;
function pn() {
  const e = $n || window.Alpine;
  return !e || typeof e != "object" || e === vt ? null : e;
}
function Za(e) {
  try {
    return typeof e.prefixed == "function" ? e.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function ni(e) {
  const t = console.warn;
  try {
    return console.warn = () => {
    }, e();
  } catch {
    return;
  } finally {
    console.warn = t;
  }
}
function yd(e) {
  if (typeof e.evaluate != "function") return null;
  const t = ni(() => e.evaluate(document.body, "1"));
  return t === 1 ? !1 : t === void 0 ? !0 : null;
}
function ws() {
  return Array.from(document.scripts).map((e) => e.src).filter((e) => /alpine/i.test(e)).map((e) => e.split("/").pop().split("?")[0]).join(", ");
}
function wd(e) {
  if (typeof e.injectMagics == "function") {
    const t = ni(() => {
      const n = {};
      return e.injectMagics(n, document.body), n.$store;
    });
    if (t && typeof t == "object") return t;
  }
  if (typeof e.evaluate == "function") {
    const t = ni(() => e.evaluate(document.body, "$store"));
    if (t && typeof t == "object") return t;
  }
  return null;
}
function _d(e) {
  const t = e.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return t ? t[1] : "inline";
}
function xd(e) {
  if (e.id) return `#${e.id}`;
  const t = [];
  let n = e;
  for (; n && n !== document.body && t.length < 4; ) {
    const i = n.parentElement, s = n.tagName.toLowerCase();
    if (n.id) {
      t.unshift(`#${n.id}`);
      break;
    }
    if (i) {
      const a = Array.from(i.children).filter((r) => r.tagName === n.tagName);
      t.unshift(a.length > 1 ? `${s}:nth-of-type(${a.indexOf(n) + 1})` : s);
    } else
      t.unshift(s);
    n = i;
  }
  return t.join(" > ");
}
function Ed(e) {
  return In.has(e) || (ys += 1, In.set(e, ys)), In.get(e);
}
function Ya(e, t) {
  const n = t._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof e.$data != "function") return null;
  try {
    return e.$data(t);
  } catch {
    return null;
  }
}
function kd(e) {
  const t = pn();
  if (sn.clear(), !t) return [];
  const n = Za(t), i = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((a) => {
    const r = Ed(a), o = (a.getAttribute(n) || "").trim(), c = (a.getAttribute(i) || "").trim(), d = Ya(t, a);
    return sn.set(r, a), {
      id: r,
      name: _d(o),
      expression: Ka(o, e),
      path: xd(a),
      initialised: !!a._x_dataStack,
      deferred: a.hasAttribute(i),
      strategy: c || "none",
      keys: e === be || !d ? 0 : dn(d).length
    };
  });
}
function _s(e, t) {
  if (t === be)
    return "The value policy is set to none, so component state is not read.";
  const n = pn(), i = sn.get(e);
  if (!n || !i) return "This component is no longer on the page.";
  if (!i._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const s = Ya(n, i);
  if (!s) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(Oi(s, t), null, 2);
  } catch (a) {
    return `Could not read this component: ${a && a.message ? a.message : "threw"}`;
  }
}
function Sd(e) {
  const t = pn();
  if (!t) return [];
  const n = wd(t);
  return n ? Object.keys(n).map((i) => {
    let s = n[i], a = 0;
    if (a = s && typeof s == "object" ? dn(s).length : 0, e === be)
      return { name: i, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      s = JSON.stringify(Oi(s, e), null, 2);
    } catch (r) {
      s = `Could not read this store: ${r && r.message ? r.message : "threw"}`;
    }
    return { name: i, keys: a, value: s };
  }) : [];
}
function Ad(e) {
  const t = window.__siteationDebugBar;
  return !t || !Array.isArray(t.alpineErrors) ? [] : t.alpineErrors.map((n) => {
    const i = String(n.message || ""), s = i.match(/Expression: "([\s\S]*?)"/);
    return {
      // An expression that threw is still a server rendered expression, and a message that
      // names the value it choked on is still that value. The rest of this section applies
      // the policy to exactly these two things; this was the one reader that did not.
      message: nn(i.split(`
`)[0].replace(/^Alpine (Expression )?Error:\s*/, ""), e),
      expression: s ? Ka(s[1], e) : "",
      element: String(n.element || ""),
      during_init: !!n.during_init
    };
  });
}
function Od() {
  const e = pn();
  return e ? {
    present: !0,
    version: String(e.version || "unknown"),
    csp: yd(e),
    source: ws(),
    prefix: Za(e)
  } : { present: !1, version: "", csp: null, source: ws(), prefix: "" };
}
function Td(e, t) {
  const n = sn.get(e);
  if (!n || !n.style) return;
  if (t) {
    ut.has(e) || ut.set(e, {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  if (!ut.has(e)) return;
  const i = ut.get(e);
  n.style.outline = i.outline, n.style.outlineOffset = i.offset, ut.delete(e);
}
const Md = { min: 30, max: 60 }, Nd = { min: 70, max: 160 }, Cd = ["og:title", "og:type", "og:image", "og:url"], Rd = ["twitter:card"], Id = 2, $d = 200, xs = 160, Pd = /^[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?$/i;
function Ld(e) {
  const t = e.getBoundingClientRect(), n = e.ownerDocument.defaultView, i = n ? n.getComputedStyle(e) : null, s = !!i && (i.clip === "rect(0px, 0px, 0px, 0px)" || i.clipPath === "inset(50%)");
  return {
    visible: (typeof e.checkVisibility == "function" ? e.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 }) : t.width > 0 && t.height > 0) && !s && t.width > 1 && t.height > 1,
    top: t.top + (n ? n.scrollY : 0),
    width: t.width,
    height: t.height,
    naturalWidth: Number(e.naturalWidth || 0),
    naturalHeight: Number(e.naturalHeight || 0)
  };
}
function Dd() {
  return {
    measure: Ld,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
}
function je(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length <= xs ? t : `${t.slice(0, xs)}...`;
}
function Fe(e, t) {
  try {
    return new URL(e, t);
  } catch {
    return null;
  }
}
function Ii(e, t) {
  return String(e.getAttribute(t) || "").toLowerCase().split(/\s+/).filter(Boolean);
}
function an(e, t) {
  return Array.from(e.querySelectorAll("meta")).filter((n) => (n.getAttribute("name") || n.getAttribute("property") || "").toLowerCase() === t);
}
function Es(e, t) {
  return e === 0 ? "missing" : e < t.min ? `too short, under ${t.min} characters` : e > t.max ? `too long, over ${t.max} characters, so it will be cut` : "";
}
function Qa(e) {
  return e === "" ? "missing" : Pd.test(e) ? /-uk$/i.test(e) ? `"${e}" uses UK, which is not a region code; use GB` : "" : `"${e}" is not a valid language code`;
}
function kt(e) {
  return `${e.protocol}//${e.host}${e.pathname}${e.search}`;
}
function qd(e, t) {
  if (kt(e) === kt(t)) return "";
  if (e.protocol !== t.protocol)
    return `it uses ${e.protocol.replace(":", "")} and this page uses ${t.protocol.replace(":", "")}`;
  if (e.host !== t.host) return `it points to another host, ${e.host}`;
  const n = e.pathname.replace(/\/$/, "") === t.pathname.replace(/\/$/, "");
  return e.pathname !== t.pathname && n ? "only the trailing slash differs" : e.pathname !== t.pathname ? `it points to ${e.pathname}` : t.search && !e.search ? `this URL has a query string (${t.search}) that the canonical leaves out` : e.search && !t.search ? `it adds a query string (${e.search}) that this URL does not have` : "the query string differs";
}
function Ud(e, t) {
  const n = Array.from(e.querySelectorAll("link[rel]")).filter((c) => Ii(c, "rel").includes("canonical")), i = [];
  if (n.length === 0)
    return { href: "", resolved: "", count: 0, warnings: ["No canonical URL."] };
  n.length > 1 && i.push(`${n.length} canonical links. Search engines ignore all of them when they disagree, and may when they do not.`);
  const s = (n[0].getAttribute("href") || "").trim(), a = Fe(s, t), r = Fe(t, t);
  if (s === "" || !a)
    return i.push("The canonical link has no usable URL."), { href: s, resolved: "", count: n.length, warnings: i };
  /^[a-z][a-z0-9+.-]*:/i.test(s) || i.push("The canonical URL is relative. Use the full URL, with the scheme and host.");
  const o = r ? qd(a, r) : "";
  return o && i.push(`The canonical URL is not this page: ${o}.`), { href: s, resolved: a.href, count: n.length, warnings: i };
}
function Bd(e, t) {
  const n = Fe(t, t), i = Array.from(e.querySelectorAll("link[hreflang]")).filter((a) => Ii(a, "rel").includes("alternate")).map((a) => {
    const r = (a.getAttribute("hreflang") || "").trim(), o = Fe(a.getAttribute("href") || "", t);
    return {
      lang: r,
      href: o ? o.href : "",
      self: !!(o && n && kt(o) === kt(n)),
      problem: r.toLowerCase() === "x-default" ? "" : Qa(r)
    };
  });
  if (i.length === 0) return { items: i, warnings: [] };
  const s = [];
  return i.some((a) => a.self) || s.push("No hreflang link points to this page. Every page in the set has to list itself."), i.some((a) => a.lang.toLowerCase() === "x-default") || s.push("No x-default alternate, so visitors whose language is not listed get no fallback."), i.filter((a) => a.problem).forEach((a) => {
    s.push(`hreflang ${a.problem}.`);
  }), { items: i, warnings: s };
}
function jd(e) {
  if (!e) return 0;
  let t = 0;
  const n = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG"]), i = (s) => {
    s.childNodes.forEach((a) => {
      a.nodeType === 3 ? t += (a.textContent.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length : a.nodeType === 1 && !n.has(a.nodeName.toUpperCase()) && i(a);
    });
  };
  return i(e), t;
}
function Fd(e, t = "") {
  const n = [...an(e, "robots"), ...an(e, "googlebot")].map((a) => (a.getAttribute("content") || "").trim()).filter(Boolean).join(", "), i = [], s = `${n}, ${t}`.toLowerCase();
  return /\b(noindex|none)\b/.test(s) && i.push("This page asks not to be indexed."), /\b(nofollow|none)\b/.test(s) && i.push("This page asks search engines not to follow its links."), { meta: n, header: String(t || ""), warnings: i };
}
function Hd(e, t, n = "") {
  const i = e.querySelector("head title") || e.querySelector("title"), s = je(i ? i.textContent : ""), a = an(e, "description")[0], r = je(a ? a.getAttribute("content") : ""), o = (e.documentElement.getAttribute("lang") || "").trim(), c = an(e, "viewport")[0], d = e.querySelector("meta[charset]") || Array.from(e.querySelectorAll("meta[http-equiv]")).find((h) => /charset=/i.test(h.getAttribute("content") || "")), u = {
    title: { value: s, length: s.length, hint: Es(s.length, Md) },
    description: {
      value: r,
      length: r.length,
      hint: Es(r.length, Nd)
    },
    canonical: Ud(e, t),
    robots: Fd(e, n),
    hreflang: Bd(e, t),
    lang: { value: o, problem: Qa(o) },
    viewport: c ? (c.getAttribute("content") || "").trim() : "",
    charset: {
      value: String(e.characterSet || e.charset || ""),
      declared: !!d
    },
    words: jd(e.body),
    warnings: []
  };
  return u.title.hint && u.warnings.push(`Title ${u.title.hint}.`), u.description.hint && u.warnings.push(`Meta description ${u.description.hint}.`), u.lang.problem && u.warnings.push(`<html lang> ${u.lang.problem}.`), u.viewport || u.warnings.push("No viewport meta tag, so phones draw the desktop layout."), u.charset.declared || u.warnings.push("No charset declared in the markup."), u.warnings.push(
    ...u.canonical.warnings,
    ...u.robots.warnings,
    ...u.hreflang.warnings
  ), u;
}
function Wd(e, t) {
  const n = Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  let i = 0;
  const s = n.map((o, c) => {
    const d = Number(o.tagName.slice(1)), u = je(o.textContent), h = [];
    return u === "" && h.push("empty"), i > 0 && d > i + 1 && h.push(`skips from h${i} to h${d}`), t.measure(o).visible || h.push("hidden from view"), i = d, { index: c, level: d, text: u, warnings: h };
  }), a = s.filter((o) => o.level === 1).length, r = [];
  return a === 0 && r.push("No H1."), a > 1 && r.push(`${a} H1 headings. One page, one main heading.`), s.forEach((o) => o.warnings.forEach((c) => {
    r.push(`H${o.level} ${o.text ? `"${o.text}"` : `#${o.index + 1}`}: ${c}.`);
  })), { items: s, warnings: r, elements: n };
}
function zd(e, t) {
  const n = e.trim().toLowerCase();
  if (n === "") return !1;
  if (/\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?)$/.test(n) || /^(img|image|dsc|dscn|photo|pic|screenshot)[-_ ]?\d+$/.test(n)) return !0;
  const s = String(t || "").split(/[?#]/)[0].split("/").pop().toLowerCase().replace(/\.[a-z0-9]+$/, "");
  return s !== "" && n === s;
}
function Kd(e, t) {
  const n = Array.from(e.querySelectorAll("img")), i = n.map((r, o) => {
    const c = r.currentSrc || r.getAttribute("src") || r.getAttribute("data-src") || "", d = r.hasAttribute("alt") ? r.getAttribute("alt") : null, u = t.measure(r), h = [];
    d === null ? h.push("no alt attribute") : d.trim() === "" ? h.push("empty alt, which is right only for a decorative image") : zd(d, c) && h.push("alt text is a file name"), (!r.hasAttribute("width") || !r.hasAttribute("height")) && h.push("no width and height, so the page shifts when it loads");
    const w = u.width * t.pixelRatio;
    return u.visible && u.width > 0 && u.naturalWidth > w * Id && u.naturalWidth - w > $d && h.push(`${u.naturalWidth}px wide but drawn at ${Math.round(u.width)}px`), (r.getAttribute("loading") || "").toLowerCase() === "lazy" && u.visible && u.top < t.viewportHeight && h.push("lazy loaded but visible on the first screen, which delays it"), {
      index: o,
      src: c,
      alt: d === null ? null : je(d),
      size: u.naturalWidth && u.width ? `${Math.round(u.width)} × ${Math.round(u.height)} of ${u.naturalWidth} × ${u.naturalHeight}` : "",
      warnings: h
    };
  }), s = i.filter((r) => r.warnings.length > 0), a = s.length > 0 ? [`${s.length} of ${i.length} images have a problem.`] : [];
  return { items: i, warnings: a, elements: n };
}
function Gd(e) {
  const t = je(e.textContent);
  if (t) return t;
  const n = Array.from(e.querySelectorAll("img[alt]")).map((i) => i.getAttribute("alt")).find(Boolean);
  return je(e.getAttribute("aria-label") || n || e.getAttribute("title") || "");
}
function Vd(e, t) {
  const n = Fe(t, t), i = Array.from(e.querySelectorAll("a[href]")), s = { internal: 0, external: 0, nofollow: 0 }, a = i.map((c, d) => {
    const u = (c.getAttribute("href") || "").trim(), h = Fe(u, t), w = Ii(c, "rel").includes("nofollow"), M = Gd(c), C = [];
    let m = "other";
    return h && /^https?:$/.test(h.protocol) && (m = n && h.host === n.host ? "internal" : "external"), m !== "other" && (s[m] += 1), w && (s.nofollow += 1), M === "" && C.push("no text"), (u === "" || u === "#") && C.push("goes nowhere"), /^javascript:/i.test(u) && C.push("a javascript: link, which is a button pretending"), m === "internal" && w && C.push("internal link marked nofollow"), n && n.protocol === "https:" && h && h.protocol === "http:" && C.push("http: on an https: page"), { index: d, href: u, text: M, kind: m, nofollow: w, warnings: C };
  }), r = a.filter((c) => c.warnings.length > 0), o = r.length > 0 ? [`${r.length} of ${a.length} links have a problem.`] : [];
  return { items: a, counts: s, warnings: o, elements: i };
}
function Xd(e) {
  const t = Array.from(e.querySelectorAll("meta")).map((o) => ({
    name: (o.getAttribute("property") || o.getAttribute("name") || "").trim().toLowerCase(),
    value: je(o.getAttribute("content"))
  })), n = t.filter((o) => o.name.startsWith("og:")), i = t.filter((o) => o.name.startsWith("twitter:")), s = (o) => t.some((c) => c.name === o && c.value !== ""), a = [];
  Cd.filter((o) => !s(o)).forEach((o) => {
    a.push(`Missing ${o}.`);
  }), Rd.filter((o) => !s(o)).forEach((o) => {
    a.push(`Missing ${o}, so X shows a bare link.`);
  });
  const r = n.find((o) => o.name === "og:image");
  return r && r.value && !/^https?:\/\//i.test(r.value) && a.push("og:image is not a full URL, and link previews will not fetch it."), { openGraph: n, x: i, warnings: a };
}
function Jd(e) {
  const t = Fe(e, e);
  return t ? [
    { label: "robots.txt", href: `${t.origin}/robots.txt` },
    { label: "sitemap.xml", href: `${t.origin}/sitemap.xml` },
    {
      label: "PageSpeed Insights",
      href: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(kt(t))}`
    }
  ] : [];
}
function Zd(e, { url: t, robotsHeader: n = "", env: i }) {
  const { elements: s, ...a } = Wd(e, i), { elements: r, ...o } = Kd(e, i), { elements: c, ...d } = Vd(e, t), u = (M) => M.items.filter((C) => C.warnings.length > 0).length, h = {
    overview: 0,
    headings: a.warnings.length,
    images: u(o),
    links: u(d),
    social: 0
  }, w = {
    overview: Hd(e, t, n),
    headings: a,
    images: o,
    links: d,
    social: Xd(e),
    quickLinks: Jd(t),
    counts: h
  };
  return h.overview = w.overview.warnings.length, h.social = w.social.warnings.length, w.warningCount = Object.values(h).reduce((M, C) => M + C, 0), {
    model: w,
    elements: { headings: s, images: r, links: c }
  };
}
function ks() {
  const e = { value: "", length: 0, hint: "" };
  return {
    overview: {
      title: e,
      description: e,
      canonical: { href: "", resolved: "", count: 0, warnings: [] },
      robots: { meta: "", header: "", warnings: [] },
      hreflang: { items: [], warnings: [] },
      lang: { value: "", problem: "" },
      viewport: "",
      charset: { value: "", declared: !1 },
      words: 0,
      warnings: []
    },
    headings: { items: [], warnings: [] },
    images: { items: [], warnings: [] },
    links: { items: [], counts: { internal: 0, external: 0, nofollow: 0 }, warnings: [] },
    social: { openGraph: [], x: [], warnings: [] },
    quickLinks: [],
    counts: { overview: 0, headings: 0, images: 0, links: 0, social: 0 },
    warningCount: 0
  };
}
let $i = { headings: [], images: [], links: [] };
const St = /* @__PURE__ */ new Map();
function Yd(e = "") {
  Array.from(St.keys()).forEach((i) => er(i));
  const { model: t, elements: n } = Zd(document, {
    url: window.location.href,
    robotsHeader: e,
    env: Dd()
  });
  return $i = n, t;
}
function er(e) {
  const t = St.get(e);
  t && (e.style.outline = t.outline, e.style.outlineOffset = t.offset, St.delete(e));
}
function tr(e, t, n) {
  const i = ($i[e] || [])[t];
  if (!(!i || !i.style)) {
    if (!n) {
      er(i);
      return;
    }
    St.has(i) || St.set(i, {
      outline: i.style.outline || "",
      offset: i.style.outlineOffset || ""
    }), i.style.outline = "2px solid #7f9cf5", i.style.outlineOffset = "2px";
  }
}
function Qd(e, t) {
  const n = ($i[e] || [])[t];
  n && (n.scrollIntoView({ block: "center", behavior: "smooth" }), tr(e, t, !0));
}
const eu = 1e3, nr = "siteation.debugbar.v1", tu = "__PROFILE_ID__";
function nu() {
  const e = document.getElementById("siteation-debugbar-profile");
  if (!e) return {};
  try {
    return JSON.parse(e.textContent || "{}");
  } catch {
    return {};
  }
}
function iu() {
  const e = { open: !1, section: "overview" };
  try {
    return { ...e, ...JSON.parse(localStorage.getItem(nr) || "{}") };
  } catch {
    return e;
  }
}
function we(e, t, n) {
  const i = t.trim().toLowerCase();
  return i ? e.filter((s) => n.some(
    (a) => String(s[a] ?? "").toLowerCase().includes(i)
  )) : e;
}
function su() {
  return {
    profile: {},
    open: !1,
    section: "findings",
    placement: "bottom",
    dockPosition: null,
    dockDrag: null,
    dockDragMoved: !1,
    draggingDock: !1,
    maximised: !1,
    theme: "system",
    resolvedTheme: "dark",
    stopWatchingScheme: null,
    favourites: [],
    draggingId: null,
    dropTargetId: null,
    navOpen: !1,
    // Out of the way, not gone: the bubble is still on the page, so this is a preference
    // and survives navigation.
    collapsed: !1,
    // Deliberately not persisted. Nothing is left on screen to bring the bar back, and the
    // only way back is a reload, which reprofiles the page and throws away the request
    // being looked at.
    dismissed: !1,
    queryFilter: "all",
    querySearch: "",
    eventFilter: "all",
    eventSearch: "",
    observerSearch: "",
    blockSearch: "",
    pluginSearch: "",
    alpineTab: "components",
    alpineSearch: "",
    alpineLive: !0,
    alpineComponents: [],
    alpineStores: [],
    alpineHealth: { present: !1, version: "", csp: null, source: "", prefix: "" },
    alpineErrors: [],
    magewireTab: "components",
    magewireHealth: { present: !1, components: 0, endpoint: "" },
    /** @type {Array<object>} */
    magewireComponents: [],
    /** @type {Array<object>} */
    magewireMessages: [],
    /** @type {Array<string>} */
    magewireExpanded: [],
    /** @type {Record<string, string>} */
    magewireStates: {},
    alpineExpanded: [],
    alpineStates: {},
    seoTab: "overview",
    seoSearch: "",
    // On by default: a list of every link on a category page is the evidence, and the
    // rows with something wrong are the answer.
    seoProblemsOnly: !0,
    seo: ks(),
    seoError: "",
    alpineTimer: null,
    // The Alpine section reads live objects instead of a redacted profile, so it has to
    // apply the policy itself. See Model/Redactor.php for the stored half.
    valuePolicy: "full",
    timelineFilter: "key",
    timelineSearch: "",
    returnFocusTo: null,
    paletteOpen: !1,
    paletteSearch: "",
    paletteIndex: 0,
    paletteReturnFocus: null,
    payloads: {},
    loading: !1,
    loadError: "",
    requests: [],
    history: [],
    historyLoading: !1,
    historyError: "",
    historyLoaded: !1,
    historyTab: "recent",
    baselineId: "",
    comparison: null,
    comparing: !1,
    compareError: "",
    copyState: "",
    copyFallback: "",
    editorTemplate: "",
    editorRoot: "",
    activeId: null,
    pageProfile: {},
    init() {
      this.profile = nu(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const e = iu();
      this.collapsed = !!e.collapsed, this.open = e.open && !this.collapsed, this.section = e.section, this.placement = e.placement === "top" ? "top" : "bottom", this.dockPosition = _c(e.dockPosition) ? e.dockPosition : null, this.maximised = !!e.maximised, this.theme = ["system", "light", "dark"].includes(e.theme) ? e.theme : "system", this.favourites = Array.isArray(e.favourites) ? e.favourites.filter((t) => tn.some((n) => n.id === t)) : [], this.watchColorScheme(), this.valuePolicy = Bc(this.rootElement()?.dataset.valuePolicy), this.editorTemplate = this.rootElement()?.dataset.editor || "", this.editorRoot = this.rootElement()?.dataset.editorRoot || "", this.refreshAlpine(), this.refreshMagewire(), this.listenToMagewire(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.$watch("paletteSearch", () => {
        this.paletteIndex = 0;
      }), this.$watch("section", (t) => {
        t === "history" && this.loadHistory(), t === "seo" && this.refreshSeo();
      }), this.scheduleSeo(), this.open && this.section === "history" && this.loadHistory(), this.$watch("activeId", () => {
        this.comparison = null, this.baselineId = "";
      }), document.addEventListener("keydown", (t) => this.paletteShortcut(t)), this.open && this.$nextTick(() => this.lock()), this.requests = vc((t) => {
        this.requests.some((n) => n.id === t.id) || (this.requests = [t, ...this.requests].slice(0, 25));
      }).filter((t) => t.id !== this.profile.id), this.open && this.loadPayloads(), this.scheduleDockConstraint();
    },
    /** @returns {HTMLElement|null} the host element, which carries the bar's settings */
    rootElement() {
      return this.$root.getRootNode().host ?? null;
    },
    /**
     * @param {string} id
     * @returns {string|null}
     */
    profileUrlFor(e) {
      const t = this.rootElement()?.dataset.profileUrl;
      return t ? t.replace(tu, encodeURIComponent(e)) : null;
    },
    /**
     * Swap the whole bar over to another profile the page has since produced.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async showProfile(e) {
      if (e === this.activeId) return;
      const t = this.profileUrlFor(e);
      if (t) {
        this.loading = !0, this.loadError = "";
        try {
          const { profile: n, payloads: i } = await bs(t);
          this.profile = n, this.payloads = i, this.activeId = e;
        } catch (n) {
          this.loadError = String(n.message || n);
        } finally {
          this.loading = !1;
        }
      }
    },
    /**
     * @param {boolean} force refetch even if the list is already loaded
     * @returns {Promise<void>}
     */
    async loadHistory(e = !1) {
      if (this.historyLoading || this.historyLoaded && !e) return;
      const t = this.rootElement()?.dataset.historyUrl;
      if (t) {
        this.historyLoading = !0, this.historyError = "";
        try {
          const n = await ei(t);
          this.history = Array.isArray(n.profiles) ? n.profiles : [], this.historyLoaded = !0;
        } catch (n) {
          this.historyError = String(n.message || n);
        } finally {
          this.historyLoading = !1;
        }
      }
    },
    /** @returns {string} */
    get copyLabel() {
      return this.copyState === "working" ? "Copying" : this.copyState === "done" ? "Copied" : this.copyState === "failed" ? "Copy it yourself" : this.copyState === "error" ? "Report unavailable" : "Copy for AI";
    },
    /**
     * The profile as markdown, on the clipboard, for an assistant that cannot call the MCP
     * server: a browser tab, a chat window, a colleague. The rendering happens in PHP so
     * there is one definition of the report rather than one per consumer.
     *
     * @returns {Promise<void>}
     */
    async copyReport() {
      const e = this.profileUrlFor(this.activeId || this.profile.id || "");
      if (!e) return;
      this.copyState = "working", this.copyFallback = "";
      let t = "";
      try {
        const n = await fetch(`${e}format/markdown/`, { headers: { Accept: "text/markdown" } });
        if (!n.ok) throw new Error(`HTTP ${n.status}`);
        t = await n.text();
      } catch {
        this.copyState = "error", setTimeout(() => {
          this.copyState = "";
        }, 2500);
        return;
      }
      try {
        await navigator.clipboard.writeText(t), this.copyState = "done", setTimeout(() => {
          this.copyState = "";
        }, 2500);
      } catch {
        this.copyState = "failed", this.copyFallback = t;
      }
    },
    /**
     * The request to compare against, chosen for the reader: the most recent other profile
     * for the same path, because that is what "what did my change cost" means. Failing
     * that, whatever came before this one.
     *
     * @returns {string}
     */
    suggestedBaseline() {
      const e = this.history.filter((i) => i.profile_id !== this.activeId), t = this.request.path;
      return (e.find((i) => i.path === t) || e[0])?.profile_id || "";
    },
    /** @returns {Array<object>} everything except the profile being looked at */
    get baselineChoices() {
      return this.history.filter((e) => e.profile_id !== this.activeId);
    },
    /**
     * @returns {Promise<void>}
     */
    async compareProfiles() {
      const e = this.rootElement()?.dataset.compareUrl, t = this.baselineId || this.suggestedBaseline();
      if (!e || !t || !this.activeId || t === this.activeId) return;
      this.baselineId = t, this.comparing = !0, this.compareError = "";
      const n = `${e}baseline/${encodeURIComponent(t)}/subject/${encodeURIComponent(this.activeId)}/`;
      try {
        this.comparison = await ei(n);
      } catch (i) {
        this.comparison = null, this.compareError = String(i.message || i);
      } finally {
        this.comparing = !1;
      }
    },
    /**
     * @param {object} metric
     * @returns {string} the change, signed, in the metric's own unit
     */
    deltaLabel(e) {
      return dd(e);
    },
    /**
     * @param {object} metric
     * @param {'baseline'|'subject'} side which profile's value the cell shows
     * @returns {string}
     */
    metricValue(e, t) {
      return ud(e, t);
    },
    /**
     * Loading one from the history means looking at a different request, so it lands on
     * the overview rather than leaving the reader on a panel about the old one.
     *
     * @param {string} id
     */
    async openFromHistory(e) {
      await this.showProfile(e), this.loadError || (this.section = "overview");
    },
    /**
     * @param {number} seconds a unix timestamp
     * @returns {string}
     */
    ago(e) {
      return od(e);
    },
    /** Go back to the request that rendered the page. */
    showPageProfile() {
      this.activeId !== this.pageProfile.id && (this.profile = this.pageProfile, this.payloads = {}, this.activeId = this.pageProfile.id || null, this.loadPayloads());
    },
    /**
     * Where a waterfall span sits and how wide it is.
     *
     * Arithmetic belongs here rather than in the attribute: the bar renders through Alpine's
     * CSP evaluator, which resolves names from the component and knows nothing about globals
     * like Math.
     *
     * @param {object} entry
     * @returns {string}
     */
    waterfallBar(e) {
      const t = Math.max(Number(e.duration_percent) || 0, 0.4);
      return `left:${e.start_percent}%;width:${t}%`;
    },
    /**
     * @param {object} summary a request summary, or a history entry
     * @returns {string}
     */
    requestLabel(e) {
      return cd(e);
    },
    /**
     * @param {string} url
     * @returns {string}
     */
    shortUrl(e) {
      return ld(e, window.location.origin);
    },
    /**
     * Only summaries travel in the page. The items behind them are fetched once, the
     * first time the bar is opened, because a busy uncached page profiles to several
     * hundred kilobytes and that has no business on every response.
     *
     * @returns {Promise<void>}
     */
    async loadPayloads() {
      if (!this.profile.lazy || this.loading || Object.keys(this.payloads).length) return;
      const e = this.profileUrlFor(this.profile.id || "");
      if (e) {
        this.loading = !0, this.loadError = "";
        try {
          this.payloads = (await bs(e)).payloads;
        } catch (t) {
          this.loadError = String(t.message || t);
        } finally {
          this.loading = !1;
        }
      }
    },
    /**
     * @param {string} key
     * @returns {object}
     */
    summaryOf(e) {
      return this.profile.sections?.[e]?.summary || {};
    },
    /**
     * @param {string} key
     * @returns {Array<object>}
     */
    itemsOf(e) {
      return this.payloads[e]?.items || this.profile.sections?.[e]?.payload?.items || [];
    },
    /** @returns {Array<object>} */
    get findings() {
      return this.profile.findings || [];
    },
    /** @returns {number} */
    get errorCount() {
      return this.findings.filter((e) => e.severity === "error").length;
    },
    /** @returns {number} */
    get warningCount() {
      return this.findings.filter((e) => e.severity === "warning").length;
    },
    /** @returns {string} */
    get findingsTone() {
      return this.errorCount > 0 ? "bad" : this.warningCount > 0 ? "warn" : "ok";
    },
    /** @returns {object} */
    get request() {
      return this.summaryOf("request");
    },
    /** @returns {object} */
    get queries() {
      return this.summaryOf("queries");
    },
    /** @returns {object} */
    get events() {
      return this.summaryOf("events");
    },
    /** @returns {object} */
    get observers() {
      return this.summaryOf("observers");
    },
    /** @returns {object} */
    get cache() {
      return this.summaryOf("cache");
    },
    /** @returns {object} */
    get blocks() {
      return this.summaryOf("blocks");
    },
    /** @returns {object} */
    get interception() {
      return this.summaryOf("interception");
    },
    /** @returns {object} */
    get timeline() {
      return this.summaryOf("timeline");
    },
    /** @returns {object} */
    get metrics() {
      return this.profile.metrics || {};
    },
    /** @returns {Array<object>} */
    get visibleQueries() {
      const e = this.itemsOf("queries").filter((t) => this.queryFilter === "slow" ? t.slow : this.queryFilter === "repeated" ? Number(t.repeat_count || 1) > 1 : !0);
      return we(e, this.querySearch, ["sql"]);
    },
    /** @returns {number} how many statements ran a shape that ran more than once */
    get repeatedCount() {
      return this.itemsOf("queries").filter((e) => Number(e.repeat_count || 1) > 1).length;
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const e = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((t) => t.observer_count === 0) : this.itemsOf("events");
      return we(e, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return we(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      return we(this.itemsOf("blocks"), this.blockSearch, ["name", "template", "class"]);
    },
    /**
     * Key activity hides the long tail of fast points, which on a Magento page is most of
     * the list and none of the answer.
     *
     * @returns {Array<object>}
     */
    get visibleTimeline() {
      const e = this.timelineFilter === "key" ? this.itemsOf("timeline").filter(
        (t) => t.kind === "milestone" || Number(t.duration_ms || 0) >= 1
      ) : this.itemsOf("timeline");
      return we(e, this.timelineSearch, ["label", "section"]);
    },
    /** @returns {Array<object>} */
    get timelineAxis() {
      const e = Number(this.timeline.scale_ms || 0);
      return [0, 0.25, 0.5, 0.75, 1].map((t) => ({
        percent: t * 100,
        label: `${(e * t).toFixed(e < 10 ? 1 : 0)} ms`
      }));
    },
    /** @returns {Array<object>} */
    get visiblePlugins() {
      const e = this.pluginSearch.trim().toLowerCase();
      return e ? this.itemsOf("interception").filter((t) => t.type.toLowerCase().includes(e) || t.plugins.some((n) => n.code.toLowerCase().includes(e) || n.class.toLowerCase().includes(e))) : this.itemsOf("interception");
    },
    /** @returns {Array<object>} */
    get visibleAlpineComponents() {
      const e = this.alpineTab === "deferred" ? this.alpineComponents.filter((t) => t.deferred) : this.alpineComponents;
      return we(e, this.alpineSearch, ["name", "expression", "path"]);
    },
    /** @returns {number} */
    get alpineDeferredCount() {
      return this.alpineComponents.filter((e) => e.deferred).length;
    },
    /**
     * A deferred component that has not run yet is the usual answer to "why is nothing
     * happening", so it is worth counting on its own.
     *
     * @returns {number}
     */
    get alpinePendingCount() {
      return this.alpineComponents.filter((e) => !e.initialised).length;
    },
    /** @returns {string} */
    get alpineBuild() {
      return this.alpineHealth.csp === null ? "could not tell" : this.alpineHealth.csp ? "CSP friendly" : "standard";
    },
    /** @returns {Array<object>} */
    get commands() {
      return Tc(this);
    },
    /** @returns {Array<object>} */
    get visibleCommands() {
      return Rc(this.commands, this.paletteSearch);
    },
    /** @returns {boolean} whether the page should be re-read on a timer */
    get alpineLiveWanted() {
      return this.open && !this.dismissed && this.alpineLive && this.section === "alpine";
    },
    /** @returns {string} */
    get statusPhrase() {
      const e = Number(this.request.status || 0);
      return this.request.completed === !1 ? "Threw" : e >= 500 ? "Error" : e >= 400 ? "Refused" : e >= 300 ? "Redirect" : "Success";
    },
    /** @returns {string} */
    get statusTone() {
      const e = Number(this.request.status || 0);
      return this.request.completed === !1 || e >= 500 ? "bad" : e >= 400 ? "warn" : "ok";
    },
    /**
     * Developer mode is where the bar belongs. Default mode still allows it, and is close
     * enough to production to be worth a colour.
     *
     * @returns {string}
     */
    get modeTone() {
      return this.request.mode === "developer" ? "ok" : "warn";
    },
    /**
     * The one line version of what happened, for the top of the overview.
     *
     * @returns {string}
     */
    get outcomePhrase() {
      const e = Number(this.request.status || 0), t = `${this.number(this.metrics.duration_ms, 2)} ms`;
      return this.request.completed === !1 ? `Stopped after ${t}, nothing was sent` : e >= 500 ? `Failed after ${t}` : e >= 400 ? `Refused after ${t}` : e >= 300 ? `Redirected after ${t}` : `Completed successfully in ${t}`;
    },
    /** @returns {string} */
    get durationTone() {
      return Number(this.metrics.duration_ms || 0) >= 1e3 ? "warn" : "ok";
    },
    /** @returns {string} */
    get queryTone() {
      return Number(this.queries.slow_count || 0) > 0 ? "warn" : "ok";
    },
    /** @returns {string} */
    get cacheTone() {
      const e = this.cache.hit_rate;
      return e == null ? "ok" : e < 50 ? "warn" : "ok";
    },
    /**
     * A cached page never reaches most of the application, so an empty profile is the
     * expected result rather than a sign the bar is broken.
     *
     * @returns {boolean}
     */
    get looksLikeFullPageCacheHit() {
      return Number(this.queries.count || 0) === 0 && Number(this.events.count || 0) === 0;
    },
    /** @returns {Array<object>} every section with its count resolved */
    get sections() {
      return Sc(this.rootElement()?.dataset.sections).map((e) => ({ ...e, count: Wa(e.id, this) }));
    },
    /** @returns {Array<object>} pinned sections, in the order they were arranged */
    get favouriteSections() {
      return this.favourites.map((e) => this.sections.find((t) => t.id === e)).filter(Boolean);
    },
    /** @returns {Array<object>} */
    get otherSections() {
      return this.sections.filter((e) => !this.favourites.includes(e.id));
    },
    /** @returns {object} */
    get currentSection() {
      return this.sections.find((e) => e.id === this.section) || this.sections[0];
    },
    /**
     * A section shows its own findings at the top, so the evidence and the conclusion sit
     * together rather than in two different places.
     *
     * @returns {Array<object>}
     */
    get sectionFindings() {
      return this.section === "findings" ? [] : this.findings.filter((e) => e.section === this.section);
    },
    /** @param {string} id */
    isFavourite(e) {
      return this.favourites.includes(e);
    },
    /** @param {string} id */
    toggleFavourite(e) {
      this.favourites = this.isFavourite(e) ? this.favourites.filter((t) => t !== e) : [...this.favourites, e], this.persist();
    },
    /** @param {string} id */
    startDrag(e) {
      this.draggingId = e;
    },
    /** @param {string} id */
    dragOver(e) {
      this.draggingId && e !== this.draggingId && (this.dropTargetId = e);
    },
    /** @param {string} id */
    drop(e) {
      const t = this.favourites.indexOf(this.draggingId), n = this.favourites.indexOf(e);
      if (t > -1 && n > -1 && t !== n) {
        const i = [...this.favourites];
        i.splice(n, 0, i.splice(t, 1)[0]), this.favourites = i, this.persist();
      }
      this.endDrag();
    },
    endDrag() {
      this.draggingId = null, this.dropTargetId = null;
    },
    /**
     * System is the default, so the bar follows the developer's own setting until they
     * say otherwise. The media query stays watched, so changing the OS theme while a page
     * is open takes effect without a reload.
     */
    watchColorScheme() {
      const e = window.matchMedia("(prefers-color-scheme: light)"), t = () => {
        this.resolvedTheme = this.theme === "system" ? e.matches ? "light" : "dark" : this.theme;
      };
      t(), this.stopWatchingScheme?.(), e.addEventListener("change", t), this.stopWatchingScheme = () => e.removeEventListener("change", t);
    },
    /**
     * System, light, dark, and round again.
     *
     * The palette names all three, which is what you want when you know where you are
     * going. This is for the other case: it is dark, it should not be, and one click is
     * the whole thought.
     */
    cycleTheme() {
      const e = ["system", "light", "dark"];
      this.setTheme(e[(e.indexOf(this.theme) + 1) % e.length]);
    },
    /** @param {string} theme */
    setTheme(e) {
      this.theme = ["system", "light", "dark"].includes(e) ? e : "system", this.watchColorScheme(), this.persist();
    },
    /**
     * The whole collapsed bar is the button. Aiming for the expand icon to see a request
     * you are already looking at is a target the size of a thumbnail on a surface the
     * width of the page.
     *
     * Its own controls keep their meaning: a click that landed on one has already done
     * something, and so has a click that ended a text selection.
     *
     * The expand icon stays, because a div that reacts to a click is not reachable by
     * keyboard and does not announce itself.
     *
     * @param {MouseEvent} event
     */
    openFromBar(e) {
      if (e.target.closest("button")) return;
      const t = this.$root.getRootNode(), n = typeof t.getSelection == "function" ? t.getSelection() : document.getSelection();
      n && !n.isCollapsed || this.openInspector();
    },
    /** @returns {Record<string, string>} inline positioning only after the dock has moved */
    get dockStyle() {
      return {
        left: this.dockPosition ? `${this.dockPosition.left}px` : "",
        top: this.dockPosition ? `${this.dockPosition.top}px` : "",
        right: this.dockPosition ? "auto" : "",
        bottom: this.dockPosition ? "auto" : "",
        transform: this.dockPosition ? "none" : ""
      };
    },
    /**
     * Take the press, but stay a click until the pointer travels. A press that never moves
     * has to reach the grip's own click and double click, and pinning the dock where it
     * already sits would cost it the centring it has by default.
     *
     * Pointer capture keeps a drag alive after the pointer leaves the small handle or the
     * shadow root. The press is not cancelled, so the grip still takes focus and the arrow
     * keys are available straight after a drag.
     *
     * @param {PointerEvent} event
     */
    startDockDrag(e) {
      if (e.button !== 0 || !e.isPrimary) return;
      this.dockDragMoved = !1;
      const t = this.$refs.dock;
      if (!t) return;
      const n = t.getBoundingClientRect();
      this.dockDrag = {
        pointerId: e.pointerId,
        pointerX: e.clientX,
        pointerY: e.clientY,
        left: n.left,
        top: n.top,
        width: n.width,
        height: n.height,
        moved: !1
      }, e.currentTarget.setPointerCapture(e.pointerId);
    },
    /** @param {PointerEvent} event */
    moveDockDrag(e) {
      const t = this.dockDrag;
      if (!t || t.pointerId !== e.pointerId) return;
      const n = e.clientX - t.pointerX, i = e.clientY - t.pointerY;
      !t.moved && !kc(n, i) || (t.moved = !0, this.draggingDock = !0, this.dockPosition = Cn(
        { left: t.left + n, top: t.top + i },
        t,
        { width: window.innerWidth, height: window.innerHeight }
      ), e.preventDefault());
    },
    /** @param {PointerEvent} event */
    endDockDrag(e) {
      const t = this.dockDrag;
      !t || t.pointerId !== e.pointerId || (this.moveDockDrag(e), this.draggingDock = !1, this.dockDrag = null, t.moved && (this.dockDragMoved = !0, this.updatePlacementFromDock(), this.persist()));
    },
    /**
     * A button labelled "Move" must work without a pointing device too. Enter and Space are
     * the keyboard's double click, so they reset rather than doing nothing.
     *
     * @param {KeyboardEvent} event
     */
    moveDockWithKeyboard(e) {
      if (e.key === "Enter" || e.key === " ") {
        this.resetDockPosition(), e.preventDefault();
        return;
      }
      const t = {
        ArrowLeft: [-10, 0],
        ArrowRight: [10, 0],
        ArrowUp: [0, -10],
        ArrowDown: [0, 10]
      }[e.key];
      if (!t) return;
      const n = this.$refs.dock;
      if (!n) return;
      const i = n.getBoundingClientRect();
      this.dockPosition = Cn(
        { left: i.left + t[0], top: i.top + t[1] },
        i,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), this.persist(), e.preventDefault();
    },
    /** @param {MouseEvent} event */
    resetDockFromGrip(e) {
      e.preventDefault(), !this.dockDragMoved && this.resetDockPosition();
    },
    /**
     * Hand the dock back to the stylesheet, which centres it against the edge the placement
     * names. That edge is the one the bar was last dragged nearest, so a reset returns it to
     * the standard position closest to where it stood rather than across the viewport.
     */
    resetDockPosition() {
      this.dockPosition && (this.dockPosition = null, this.persist());
    },
    /**
     * x-show reveals the dock on a timer after its first display. Measure on the following
     * frame, when its width and height exist again, rather than clamping a zero-sized box.
     */
    scheduleDockConstraint() {
      this.$nextTick(() => requestAnimationFrame(() => this.constrainDock()));
    },
    /** Keep a restored or resized dock reachable. */
    constrainDock() {
      const e = this.$refs.dock;
      if (!this.dockPosition || !e || this.open || this.collapsed || this.dismissed) return;
      const t = e.getBoundingClientRect();
      if (t.width === 0 || t.height === 0) return;
      const n = this.dockPosition, i = this.placement;
      this.dockPosition = Cn(
        this.dockPosition,
        t,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), (n.left !== this.dockPosition.left || n.top !== this.dockPosition.top || i !== this.placement) && this.persist();
    },
    /** Keep the edge-bound inspector and bubble near the freely positioned dock. */
    updatePlacementFromDock() {
      const e = this.$refs.dock;
      !this.dockPosition || !e || (this.placement = xc(
        this.dockPosition,
        e.getBoundingClientRect(),
        window.innerHeight
      ));
    },
    openInspector() {
      this.open || (this.collapsed = !1, this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), wc(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus(), this.scheduleDockConstraint());
    },
    toggle() {
      this.open ? this.closeInspector() : this.openInspector();
    },
    toggleMaximised() {
      this.maximised = !this.maximised, this.persist();
    },
    movePlacement() {
      this.placement = this.placement === "bottom" ? "top" : "bottom", this.dockPosition = null, this.persist();
    },
    /**
     * Collapse the bar to its bubble.
     *
     * The X used to hide the bar until the next page load, and a reload is the thing this
     * bar cannot afford: it profiles the page again, so getting the bar back destroyed the
     * request being investigated. Anyone who closed the bar to click what was under it had
     * no way back to what they were reading.
     *
     * The bubble is not destructive, so unlike dismiss() it is remembered. Available but
     * out of the way is a preference, not a decision about one page.
     */
    collapse() {
      this.closeInspector(), this.collapsed = !0, this.persist();
    },
    expand() {
      this.collapsed = !1, this.persist(), this.scheduleDockConstraint();
    },
    toggleCollapsed() {
      this.collapsed ? this.expand() : this.collapse();
    },
    /**
     * Take the bar off the page entirely, for a screenshot or a sticky footer.
     *
     * This is the one that leaves nothing behind, which is why it is only in the palette
     * and why it is not remembered.
     */
    dismiss() {
      this.closeInspector(), this.dismissed = !0;
    },
    lock() {
      yc(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(e) {
      if (e.key === "Escape") {
        this.closeInspector();
        return;
      }
      ds(e, this.$refs.sheet);
    },
    /** @param {string} section */
    select(e) {
      this.section = e, this.navOpen = !1, this.openInspector(), this.persist();
    },
    /**
     * Findings are only useful if they lead somewhere, so each one carries the section
     * and filter that hold its evidence.
     *
     * @param {object} action
     */
    follow(e) {
      e && (e.filter && e.section === "queries" && (this.queryFilter = e.filter, this.querySearch = ""), this.select(e.section));
    },
    /**
     * The one section whose data is not in the profile, so it is read again rather than
     * waited for.
     */
    /**
     * The component list is read from the page, so it is asked for rather than watched: a
     * Magewire update replaces components, and a list from before it is a list of ghosts.
     */
    refreshMagewire() {
      this.magewireHealth = md(), this.magewireComponents = bd(this.valuePolicy), this.magewireExpanded.forEach((e) => {
        this.magewireStates[e] = gs(e, this.valuePolicy);
      });
    },
    /**
     * Magewire loads before Alpine and the bar loads after both, so its global is normally
     * there already. Normally is not always: a page that defers it, or one where the bar
     * boots first, would otherwise have no hooks at all and a permanently empty list.
     */
    listenToMagewire() {
      const e = (t) => {
        this.magewireMessages = [t, ...this.magewireMessages].slice(0, 25), this.refreshMagewire();
      };
      ms(e) || document.addEventListener("magewire:load", () => {
        ms(e), this.refreshMagewire();
      }, { once: !0, passive: !0 });
    },
    /** @param {string} id */
    toggleMagewireComponent(e) {
      if (this.magewireExpanded.includes(e)) {
        this.magewireExpanded = this.magewireExpanded.filter((t) => t !== e), delete this.magewireStates[e];
        return;
      }
      this.magewireExpanded = [...this.magewireExpanded, e], this.magewireStates[e] = gs(e, this.valuePolicy);
    },
    /** @param {string} id */
    isMagewireExpanded(e) {
      return this.magewireExpanded.includes(e);
    },
    /**
     * @param {string} id
     * @param {boolean} on
     */
    highlightMagewire(e, t) {
      vd(e, t);
    },
    /**
     * Read once the page has loaded, so images have their real sizes and the sidebar count
     * is there before the section is opened. Opening it reads again, since a page changes.
     */
    scheduleSeo() {
      if (!this.collects("seo")) return;
      const e = () => setTimeout(() => this.refreshSeo(), 0);
      document.readyState === "complete" ? e() : window.addEventListener("load", e, { once: !0, passive: !0 });
    },
    refreshSeo() {
      if (!this.collects("seo")) return;
      const e = this.pageProfile.sections?.request?.summary?.robots_header || "";
      try {
        this.seo = Yd(e), this.seoError = "";
      } catch (t) {
        this.seo = ks(), this.seoError = String(t && t.message || t);
      }
    },
    /**
     * @param {string} view
     * @param {number} index
     * @param {boolean} on
     */
    highlightSeo(e, t, n) {
      tr(e, t, n);
    },
    /**
     * @param {string} view
     * @param {number} index
     */
    revealSeo(e, t) {
      Qd(e, t);
    },
    /** @returns {string} the admin redirect for what this page shows, '' when it is not known */
    get adminEditUrl() {
      return this.rootElement()?.dataset.adminEdit || "";
    },
    /** @returns {Array<object>} */
    get visibleSeoImages() {
      const e = this.seo.images?.items || [], t = this.seoProblemsOnly ? e.filter((n) => n.warnings.length > 0) : e;
      return we(t, this.seoSearch, ["src", "alt"]);
    },
    /** @returns {Array<object>} */
    get visibleSeoLinks() {
      const e = this.seo.links?.items || [], t = this.seoProblemsOnly ? e.filter((n) => n.warnings.length > 0) : e;
      return we(t, this.seoSearch, ["href", "text"]);
    },
    /**
     * @param {string|null} alt
     * @returns {string}
     */
    altLabel(e) {
      return e === null ? "no alt" : e === "" ? 'alt=""' : e;
    },
    refreshAlpine() {
      this.alpineHealth = Od(), this.alpineComponents = kd(this.valuePolicy), this.alpineStores = Sd(this.valuePolicy), this.alpineErrors = Ad(this.valuePolicy), this.alpineExpanded.forEach((e) => {
        this.alpineStates[e] = _s(e, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, eu);
        return;
      }
      !this.alpineLiveWanted && this.alpineTimer && (clearInterval(this.alpineTimer), this.alpineTimer = null);
    },
    /**
     * @param {number} id
     * @returns {boolean}
     */
    isAlpineExpanded(e) {
      return this.alpineExpanded.includes(e);
    },
    /**
     * State is read here rather than during the scan, because a page carries dozens of
     * components and walking all of them to fill rows nobody opened is work for nothing.
     *
     * @param {number} id
     */
    toggleAlpineComponent(e) {
      if (this.isAlpineExpanded(e)) {
        this.alpineExpanded = this.alpineExpanded.filter((t) => t !== e), delete this.alpineStates[e];
        return;
      }
      this.alpineExpanded = [...this.alpineExpanded, e], this.alpineStates[e] = _s(e, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(e, t) {
      Td(e, t);
    },
    /**
     * The palette does not lock the host itself. When the inspector is open the page is
     * already inert, and when it is not, locking here would have to be undone in the one
     * case where the command that just ran opened the inspector.
     */
    openPalette() {
      this.paletteOpen || this.dismissed || (this.paletteReturnFocus = this.$root.getRootNode().activeElement, this.paletteSearch = "", this.paletteIndex = 0, this.paletteOpen = !0, this.$nextTick(() => this.$refs.paletteInput?.focus()));
    },
    closePalette() {
      this.paletteOpen && (this.paletteOpen = !1, typeof this.paletteReturnFocus?.focus == "function" && this.paletteReturnFocus.focus(), this.paletteReturnFocus = null);
    },
    togglePalette() {
      this.paletteOpen ? this.closePalette() : this.openPalette();
    },
    /** @param {KeyboardEvent} event */
    paletteShortcut(e) {
      this.dismissed || e.code !== "KeyP" || !e.shiftKey || !(e.metaKey || e.ctrlKey) || (e.preventDefault(), this.togglePalette());
    },
    /** @param {KeyboardEvent} event */
    paletteKeys(e) {
      if (e.key === "Escape") {
        e.stopPropagation(), this.closePalette();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault(), this.movePalette(1);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault(), this.movePalette(-1);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault(), this.runCommand(this.visibleCommands[this.paletteIndex]);
        return;
      }
      ds(e, this.$refs.palette);
    },
    /** @param {number} step */
    movePalette(e) {
      const t = this.visibleCommands.length;
      t !== 0 && (this.paletteIndex = (this.paletteIndex + e + t) % t, this.$nextTick(() => {
        this.$refs.palette?.querySelector(".ndb-palette-item.is-active")?.scrollIntoView({ block: "nearest" });
      }));
    },
    /**
     * The palette closes first, so focus goes back to whatever opened it before the
     * command moves it somewhere else.
     *
     * @param {object} command
     */
    runCommand(e) {
      if (e)
        switch (this.closePalette(), e.kind) {
          case "section":
            this.select(e.arg);
            break;
          case "theme":
            this.setTheme(e.arg);
            break;
          case "placement":
            this.movePlacement();
            break;
          case "dock-reset":
            this.resetDockPosition();
            break;
          case "favourite":
            this.toggleFavourite(e.arg);
            break;
          case "inspector":
            this.toggle();
            break;
          case "maximise":
            this.toggleMaximised();
            break;
          case "collapse":
            this.toggleCollapsed();
            break;
          case "dismiss":
            this.dismiss();
            break;
          case "copy":
            this.copyReport();
            break;
        }
    },
    /**
     * @param {string} section
     * @returns {boolean}
     */
    /**
     * Whether the store collects a section at all, which is not the same as it being empty.
     *
     * @param {string} id
     * @returns {boolean}
     */
    collects(e) {
      return this.sections.some((t) => t.id === e);
    },
    isSection(e) {
      return this.currentSection.id === e;
    },
    persist() {
      try {
        localStorage.setItem(nr, JSON.stringify({
          open: this.open,
          collapsed: this.collapsed,
          section: this.section,
          placement: this.placement,
          dockPosition: this.dockPosition,
          maximised: this.maximised,
          theme: this.theme,
          favourites: this.favourites
        }));
      } catch {
      }
    },
    /**
     * @param {number} value
     * @param {number} decimals
     * @returns {string}
     */
    number(e, t = 0) {
      return Mi(e, t);
    },
    /**
     * @param {object} plugin
     * @returns {string}
     */
    methodList(e) {
      return pd(e);
    },
    /**
     * @param {unknown} code
     * @param {string} language
     * @returns {string} HTML for x-html, escaped by the highlighter
     */
    highlight(e, t) {
      return ad(e, t);
    },
    /**
     * @param {string} file
     * @param {number} line
     * @returns {string}
     */
    editorUrl(e, t) {
      return Ja(this.editorTemplate, this.editorRoot, e, t);
    },
    /**
     * @param {string} location
     * @returns {string}
     */
    locationUrl(e) {
      return hd(this.editorTemplate, this.editorRoot, e);
    },
    /**
     * The frame a query came from. The resolver drops framework and generated code, so the
     * first frame left is the application's own.
     *
     * @param {object} query
     * @returns {object|null}
     */
    callSite(e) {
      const t = e?.callsite?.[0];
      return t && t.file ? t : null;
    },
    /**
     * @param {number} count
     * @param {string} one
     * @param {string} many
     * @returns {string}
     */
    plural(e, t, n) {
      return rd(e, t, n);
    },
    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(e) {
      return Ni(e);
    }
  };
}
function Me(e) {
  return `<dl class="ndb-facts">${e.map((n) => {
    const i = ["ndb-fact-value", n.mono ? "ndb-mono" : ""].filter(Boolean).join(" "), s = n.tone ? ` data-ndb-bind:class="'is-' + (${n.tone})"` : "", a = n.raw ? `<dd class="${i}"${s}>${n.value}</dd>` : `<dd class="${i}"${s} data-ndb-text="${n.value}"></dd>`, r = n.when ? ` data-ndb-if="${n.when}"` : "", o = `
  <div class="ndb-fact">
    <dt>${n.label}</dt>
    ${a}
  </div>`;
    return n.when ? `
  <template${r}>${o}
  </template>` : o;
  }).join("")}
</dl>`;
}
function Ss({ sheet: e }) {
  return `
<div class="ndb-header">
${e ? "" : `  <button type="button" class="ndb-icon-button ndb-drag-handle"
          data-ndb-on:pointerdown="startDockDrag($event)"
          data-ndb-on:pointermove="moveDockDrag($event)"
          data-ndb-on:pointerup="endDockDrag($event)"
          data-ndb-on:pointercancel="endDockDrag($event)"
          data-ndb-on:dblclick="resetDockFromGrip($event)"
          data-ndb-on:keydown="moveDockWithKeyboard($event)"
          aria-label="Move debug bar"
          title="Drag to move the debug bar, double click to put it back; arrow keys move it 10 pixels">
    ${H("grip")}
  </button>

`}
  <button type="button" class="ndb-request" data-ndb-on:click="select('overview')"
          data-ndb-bind:title="request.path">
    <span class="ndb-method" data-ndb-text="request.method || 'GET'"></span>
    <span class="ndb-request-body">
      <span class="ndb-path" data-ndb-text="requestLabel(request)"></span>
      <span class="ndb-request-meta">
        <span data-ndb-bind:class="'is-' + statusTone" data-ndb-text="request.status"></span>
        <span data-ndb-text="statusPhrase"></span>
        <span class="ndb-dim" data-ndb-text="bytes(request.response_bytes)"></span>
      </span>
    </span>
  </button>

${e ? "" : `  <div class="ndb-stats">
    <div class="ndb-stat">
      <span class="ndb-env-dot" data-ndb-bind:class="'is-' + modeTone"></span>
      <span>
        <span class="ndb-stat-key">Mode</span>
        <span class="ndb-stat-value" data-ndb-text="request.mode || 'unknown'"></span>
      </span>
    </div>

    <div class="ndb-stat">
      ${H("database", "is-accent")}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + queryTone">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </div>

    <div class="ndb-stat">
      ${H("clock", "is-accent")}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </div>

    <div class="ndb-stat is-secondary">
      ${H("chip", "is-accent")}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </div>
  </div>`}

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openPalette()"
            title="Search sections and settings">
      ${H("search")}
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="cycleTheme()"
            data-ndb-bind:title="'Theme: ' + theme + '. Click for the next one.'">
      <span data-ndb-show="theme === 'system'">${H("monitor")}</span>
      <span data-ndb-show="theme === 'light'">${H("sun")}</span>
      <span data-ndb-show="theme === 'dark'">${H("moon")}</span>
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="select('findings')"
            data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
            title="Findings">
      ${H("alert")}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
    </button>

    <span class="ndb-controls-divider"></span>

    ${e ? `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="toggleMaximised()"
            data-ndb-bind:title="maximised ? 'Restore' : 'Maximise'">
      <span data-ndb-show="!maximised">${H("expand")}</span>
      <span data-ndb-show="maximised">${H("collapse")}</span>
    </button>
    <button type="button" class="ndb-icon-button" data-ndb-on:click="closeInspector()"
            title="Minimise">
      ${H("minimise")}
    </button>
    ` : `
    <button type="button" class="ndb-icon-button is-open" data-ndb-on:click="openInspector()"
            title="Open the inspector">
      ${H("expand")}
    </button>
    `}

    <button type="button" class="ndb-icon-button" data-ndb-on:click="collapse()"
            title="Collapse to a bubble">
      ${H("close")}
    </button>
  </div>
</div>`;
}
function As(e, t) {
  return `
<template data-ndb-for="item in ${e}" data-ndb-bind:key="item.id">
  <div class="ndb-nav-row"
       data-ndb-bind:class="dropTargetId === item.id && 'is-drop-target'"
       ${t ? `
       draggable="true"
       data-ndb-on:dragstart="startDrag(item.id)"
       data-ndb-on:dragover.prevent="dragOver(item.id)"
       data-ndb-on:drop.prevent="drop(item.id)"
       data-ndb-on:dragend="endDrag()"` : ""}>
    <button type="button" class="ndb-nav-item"
            data-ndb-bind:class="isSection(item.id) && 'is-active'"
            data-ndb-on:click="select(item.id)">
      <span class="ndb-nav-label" data-ndb-text="item.label"></span>
      <span class="ndb-nav-count" data-ndb-show="item.count"
            data-ndb-text="item.count"></span>
    </button>
    <button type="button" class="ndb-nav-pin"
            data-ndb-bind:class="isFavourite(item.id) && 'is-on'"
            data-ndb-on:click="toggleFavourite(item.id)"
            data-ndb-bind:title="isFavourite(item.id) ? 'Unpin' : 'Pin to favourites'">
      ${H("star")}
    </button>
  </div>
</template>`;
}
function au() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${As("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${As("otherSections", !1)}
</nav>`;
}
function Wt(e, t) {
  return `<div class="ndb-subtabs" role="tablist">${t.map((i) => `
  <button type="button" class="ndb-subtab" role="tab"
          data-ndb-bind:aria-selected="${e} === '${i.id}' ? 'true' : 'false'"
          data-ndb-bind:class="${e} === '${i.id}' && 'is-active'"
          data-ndb-on:click="${e} = '${i.id}'">
    <span>${i.label}</span>
    ${i.count ? `<span class="ndb-pill"${i.tone ? ` data-ndb-bind:class="'is-' + (${i.tone})"` : ""}
            ${i.always ? "" : `data-ndb-show="${i.count}"`}
            data-ndb-text="${i.count}"></span>` : ""}
  </button>`).join("")}</div>`;
}
const ru = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme"
     data-ndb-on:resize.window="constrainDock()">

  <div class="ndb-dock" data-ndb-ref="dock"
       data-ndb-show="!open && !dismissed && !collapsed" data-ndb-cloak
       data-ndb-bind:class="draggingDock && 'is-dragging'"
       data-ndb-bind:style="dockStyle"
       title="Open the inspector" data-ndb-on:click="openFromBar($event)">
    ${Ss({ sheet: !1 })}
  </div>

  <button type="button" class="ndb-bubble" data-ndb-show="collapsed && !dismissed" data-ndb-cloak
          data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
          data-ndb-on:click="expand()"
          aria-label="Show the debug bar" title="Show the debug bar">
    ${H("pulse")}
    <span class="ndb-badge" data-ndb-show="findings.length > 0"
          data-ndb-text="findings.length"></span>
  </button>

  ${Ic()}

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${Ss({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${H("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${au()}

        <div class="ndb-nav-scrim" data-ndb-show="navOpen"
             data-ndb-on:click="navOpen = false"></div>

    <div class="ndb-panel-body">

      <header class="ndb-section-head">
        <h2 data-ndb-text="currentSection.label"></h2>
        <p data-ndb-text="currentSection.lead"></p>
      </header>

      <div class="ndb-callout is-warn" data-ndb-show="sectionFindings.length > 0">
        <template data-ndb-for="(finding, index) in sectionFindings" data-ndb-bind:key="index">
          <div>
            <p class="ndb-callout-title" data-ndb-text="finding.message"></p>
            <p data-ndb-text="finding.why"></p>
          </div>
        </template>
      </div>

      <div class="ndb-callout is-clear"
           data-ndb-show="currentSection.graded !== false && section !== 'findings'
                          && sectionFindings.length === 0">
        <p class="ndb-callout-title">No clear problem found</p>
        <p>Nothing in this section matched a rule.</p>
      </div>


      <div class="ndb-requests" data-ndb-show="requests.length > 0">
        <span class="ndb-requests-label">Requests</span>
        <button type="button" class="ndb-chip" data-ndb-on:click="showPageProfile()"
                data-ndb-bind:class="activeId === pageProfile.id && 'is-active'">
          Page
        </button>
        <template data-ndb-for="(entry, index) in requests" data-ndb-bind:key="index">
          <button type="button" class="ndb-chip"
                  data-ndb-on:click="showProfile(entry.id)"
                  data-ndb-bind:class="activeId === entry.id && 'is-active'"
                  data-ndb-bind:title="entry.method + ' ' + entry.url">
            <span data-ndb-text="entry.method"></span>
            <span class="ndb-mono ndb-truncate"
                  data-ndb-text="entry.label || shortUrl(entry.url)"></span>
            <span class="ndb-dim" data-ndb-text="entry.status"></span>
          </button>
        </template>
      </div>

      <p class="ndb-note" data-ndb-show="loading">Loading profile details.</p>
      <p class="ndb-note" data-ndb-show="loadError">
        Could not load profile details: <span data-ndb-text="loadError"></span>
      </p>

      <template data-ndb-if="isSection('findings')">
      <div>
        <p class="ndb-empty" data-ndb-show="findings.length === 0">
          Nothing worth flagging on this request.
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="(finding, index) in findings" data-ndb-bind:key="index">
            <li class="ndb-finding" data-ndb-bind:class="'is-' + finding.severity">
              <div class="ndb-finding-head">
                <span class="ndb-severity" data-ndb-bind:class="'is-' + finding.severity"
                      data-ndb-text="finding.severity"></span>
                <span class="ndb-finding-message" data-ndb-text="finding.message"></span>
                <code class="ndb-dim ndb-finding-id" data-ndb-text="finding.id"></code>
              </div>
              <p class="ndb-finding-why" data-ndb-text="finding.why"></p>
              <p class="ndb-finding-next">
                <strong>Next</strong> <span data-ndb-text="finding.next"></span>
              </p>
              <p class="ndb-finding-where" data-ndb-show="finding.location">
                <strong>Where</strong>
                <a class="ndb-callsite-link" data-ndb-show="locationUrl(finding.location)"
                   data-ndb-bind:href="locationUrl(finding.location)"
                   data-ndb-text="finding.location" title="Open at this line"></a>
                <code data-ndb-show="!locationUrl(finding.location)"
                      data-ndb-text="finding.location"></code>
              </p>
              <template data-ndb-if="finding.evidence && finding.evidence.groups">
                <ol class="ndb-evidence">
                  <template data-ndb-for="(group, groupIndex) in finding.evidence.groups"
                            data-ndb-bind:key="groupIndex">
                    <li>
                      <span class="ndb-tag is-warn"
                            data-ndb-text="'ran ' + group.count + ' times'"></span>
                      <span class="ndb-dim"
                            data-ndb-text="number(group.duration_ms, 2) + ' ms'"></span>
                      <code class="ndb-query-sql" data-ndb-code="highlight(group.sql, 'sql')"></code>
                    </li>
                  </template>
                </ol>
              </template>

              <template data-ndb-if="finding.evidence && finding.evidence.sql
                                     && !finding.evidence.groups">
                <ol class="ndb-evidence">
                  <li>
                    <span class="ndb-tag is-warn"
                          data-ndb-text="'ran ' + finding.evidence.count + ' times'"></span>
                    <code class="ndb-query-sql"
                          data-ndb-code="highlight(finding.evidence.sql, 'sql')"></code>
                  </li>
                </ol>
              </template>

              <button type="button" class="ndb-chip" data-ndb-show="finding.action"
                      data-ndb-on:click="follow(finding.action)"
                      data-ndb-text="finding.action ? finding.action.label : ''"></button>
            </li>
          </template>
        </ol>
      </div>
      </template>

      <template data-ndb-if="isSection('overview')">
      <div>
        <div class="ndb-summary">
          <span class="ndb-method" data-ndb-text="request.method || 'GET'"></span>
          <code class="ndb-summary-path" data-ndb-text="requestLabel(request)"></code>
          <span class="ndb-summary-status" data-ndb-bind:class="'is-' + statusTone">
            <span data-ndb-text="request.status"></span>
            <span data-ndb-text="statusPhrase"></span>
          </span>
          <span class="ndb-summary-note" data-ndb-text="outcomePhrase"></span>
          <button type="button" class="ndb-chip ndb-summary-copy"
                  data-ndb-bind:class="copyState && 'is-active'"
                  data-ndb-on:click="copyReport()"
                  title="Put this request on the clipboard as markdown, for an assistant"
                  data-ndb-text="copyLabel"></button>
        </div>

        <div class="ndb-note" data-ndb-show="copyFallback">
          <p>This browser would not take the clipboard. Select this and copy it by hand.</p>
          <textarea class="ndb-copy-fallback" readonly rows="6" data-ndb-model="copyFallback"
                    data-ndb-on:focus="$event.target.select()"></textarea>
        </div>

        <p class="ndb-note" data-ndb-show="looksLikeFullPageCacheHit">
          No queries and no events. This page was almost certainly served from the full
          page cache, so the application never ran.
        </p>

        <ol class="ndb-steps">
          <li class="ndb-step">
            <h3>Received</h3>
            <p>Magento accepted the request and chose an area for it.</p>
            ${Me([
  { label: "Path", value: "request.path || '/'", mono: !0 },
  { label: "Method", value: "request.method || 'GET'" },
  { label: "Area", value: "request.area" },
  { label: "Kind", value: "request.is_ajax ? 'AJAX' : 'Document'" },
  { label: "Scheme", value: "request.is_secure ? 'https' : 'http'" },
  { label: "Deploy mode", value: "request.mode || 'unknown'", tone: "modeTone" }
])}
          </li>

          <li class="ndb-step">
            <h3>Matched</h3>
            <p>Routing resolved a controller, and the object manager built what it needed.</p>
            ${Me([
  { label: "Route", value: "request.route || 'unknown'", mono: !0 },
  { label: "Action", value: "request.action || 'unknown'", mono: !0 },
  {
    label: "Intercepted types",
    value: "interception.plugin_count || 0",
    when: "collects('plugins')"
  },
  {
    label: "Observers run",
    value: "observers.count || 0",
    when: "collects('observers')"
  }
])}
          </li>

          <!--
            Only where the request was one. The controller and the path above are the same
            on every Magewire update, so this is the part that says which it was.
          -->
          <template data-ndb-if="request.magewire">
          <li class="ndb-step">
            <h3>Magewire</h3>
            <p>Which component was asked to do what, over the URL they all share.</p>
            ${Me([
  { label: "Component", value: "request.magewire.component", mono: !0 },
  { label: "Action", value: "request.magewire.action || 'none'", mono: !0 },
  { label: "Resolver", value: "request.magewire.resolver || 'unknown'" },
  { label: "Updates", value: "plural(request.magewire.update_count, 'update', 'updates')" }
])}
          </li>
          </template>

          <li class="ndb-step">
            <h3>Responded</h3>
            <p>What the work cost, and what went back to the browser.</p>
            ${Me([
  { label: "Status", value: "request.status", tone: "statusTone" },
  { label: "Response size", value: "bytes(request.response_bytes)" },
  { label: "Duration", value: "number(metrics.duration_ms, 2) + ' ms'", tone: "durationTone" },
  { label: "Memory peak", value: "number(metrics.memory_peak_mb, 1) + ' MB'" },
  {
    label: "Queries",
    when: "collects('queries')",
    raw: !0,
    value: `<span data-ndb-text="queries.count || 0"></span> <small data-ndb-text="'in ' + number(queries.duration_ms, 1) + ' ms'"></small>`
  },
  {
    label: "Blocks",
    when: "collects('blocks')",
    raw: !0,
    value: `<span data-ndb-text="blocks.unique_count || 0"></span> <small data-ndb-text="'in ' + number(blocks.duration_ms, 1) + ' ms'"></small>`
  },
  {
    label: "Events",
    when: "collects('events')",
    raw: !0,
    value: `<span data-ndb-text="events.count || 0"></span> <small data-ndb-text="events.unique_count + ' unique'"></small>`
  },
  {
    label: "Cache",
    when: "collects('cache')",
    value: "cache.hit_rate === null ? 'no reads' : number(cache.hit_rate, 1) + '% hit rate'",
    tone: "cacheTone"
  }
])}
          </li>
        </ol>

        <p class="ndb-profile-id">
          Profile <code class="ndb-mono ndb-dim" data-ndb-text="profile.id"></code>
        </p>
      </div>
      </template>

      <template data-ndb-if="isSection('timeline')">
      <div>
        <div class="ndb-subhead">
          <div>
            <h3>Waterfall</h3>
            <p>
              <span data-ndb-text="timeline.count || 0"></span> events across
              <span data-ndb-text="number(timeline.scale_ms, 0)"></span> ms
            </p>
          </div>
          <p class="ndb-legend">
            <span class="ndb-legend-bar"></span> Duration
            <span class="ndb-legend-dot"></span> Event
          </p>
        </div>

        <div class="ndb-fields">
          <div class="ndb-field">
            <span class="ndb-field-label">Show activity</span>
            <div class="ndb-chips">
              <button type="button" class="ndb-chip" data-ndb-on:click="timelineFilter = 'key'"
                      data-ndb-bind:class="timelineFilter === 'key' && 'is-active'">Key activity</button>
              <button type="button" class="ndb-chip" data-ndb-on:click="timelineFilter = 'all'"
                      data-ndb-bind:class="timelineFilter === 'all' && 'is-active'">Everything</button>
            </div>
          </div>

          <div class="ndb-field is-search">
            <span class="ndb-field-label">Search activity</span>
            <input class="ndb-search" type="search" placeholder="Event or section"
                   data-ndb-model="timelineSearch">
          </div>
        </div>

        <p class="ndb-dim ndb-count ndb-shown" data-ndb-show="visibleTimeline.length !== timeline.count">
          <span data-ndb-text="visibleTimeline.length"></span> of
          <span data-ndb-text="timeline.count || 0"></span> shown
        </p>

        <div class="ndb-wf">
          <div class="ndb-wf-head">
            <span class="ndb-wf-activity">Activity</span>
            <span class="ndb-wf-track">
              <template data-ndb-for="(tick, index) in timelineAxis" data-ndb-bind:key="index">
                <span class="ndb-wf-tick" data-ndb-bind:style="'left:' + tick.percent + '%'"
                      data-ndb-text="tick.label"></span>
              </template>
            </span>
            <span class="ndb-wf-timing">Timing</span>
          </div>

          <template data-ndb-for="(entry, index) in visibleTimeline" data-ndb-bind:key="index">
            <div class="ndb-wf-row" data-ndb-bind:class="'is-' + entry.kind">
              <span class="ndb-wf-activity">
                <span class="ndb-wf-label" data-ndb-text="entry.label"></span>
                <small class="ndb-wf-section" data-ndb-text="entry.section"></small>
              </span>
              <span class="ndb-wf-track">
                <span class="ndb-wf-grid"></span>
                <span class="ndb-wf-bar" data-ndb-show="entry.kind === 'span'"
                      data-ndb-bind:style="waterfallBar(entry)"></span>
                <span class="ndb-wf-dot" data-ndb-show="entry.kind !== 'span'"
                      data-ndb-bind:style="'left:' + entry.at_percent + '%'"></span>
              </span>
              <span class="ndb-wf-timing">
                <span class="ndb-wf-duration"
                      data-ndb-text="entry.duration_ms === null ? number(entry.at_ms, 1) + ' ms' : number(entry.duration_ms, 2) + ' ms'"></span>
                <small class="ndb-dim" data-ndb-show="entry.kind === 'span'"
                       data-ndb-text="number(entry.start_ms, 1) + '–' + number(entry.at_ms, 1) + ' ms'"></small>
              </span>
            </div>
          </template>
        </div>

        <p class="ndb-empty" data-ndb-show="visibleTimeline.length === 0">No activity matches.</p>
      </div>
      </template>

      <template data-ndb-if="isSection('queries')">
      <div>
        <div class="ndb-controls">
          <button type="button" class="ndb-chip" data-ndb-on:click="queryFilter = 'all'"
                  data-ndb-bind:class="queryFilter === 'all' && 'is-active'">All</button>
          <button type="button" class="ndb-chip" data-ndb-on:click="queryFilter = 'slow'"
                  data-ndb-bind:class="queryFilter === 'slow' && 'is-active'">
            Slow <span class="ndb-pill" data-ndb-text="queries.slow_count || 0"></span>
          </button>
          <button type="button" class="ndb-chip" data-ndb-show="repeatedCount"
                  data-ndb-on:click="queryFilter = 'repeated'"
                  data-ndb-bind:class="queryFilter === 'repeated' && 'is-active'"
                  title="Statements whose shape ran more than once. Findings are stricter and
                         only speak up at three.">
            Repeated <span class="ndb-pill" data-ndb-text="repeatedCount"></span>
          </button>
          <input class="ndb-search" type="search" placeholder="Filter SQL"
                 data-ndb-model="querySearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleQueries.length"></span> shown
          </span>
        </div>

        <p class="ndb-note" data-ndb-show="queries.truncated">
          Collector limit reached. <span data-ndb-text="queries.dropped_count"></span>
          of <span data-ndb-text="queries.count"></span> queries were not retained.
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="(query, index) in visibleQueries" data-ndb-bind:key="index">
            <li class="ndb-query" data-ndb-bind:class="query.slow && 'is-slow'">
              <div class="ndb-query-head">
                <span class="ndb-query-time" data-ndb-text="number(query.duration_ms, 2) + ' ms'"></span>
                <span class="ndb-query-type" data-ndb-text="query.type"></span>
                <span class="ndb-tag" data-ndb-show="query.repeat_count > 1"
                      data-ndb-bind:class="query.repeat_count >= 3 && 'is-warn'"
                      data-ndb-text="'ran ' + query.repeat_count + ' times'"></span>
              </div>
              <code class="ndb-query-sql" data-ndb-code="highlight(query.sql, 'sql')"></code>

              <p class="ndb-callsite" data-ndb-show="callSite(query)">
                <template data-ndb-if="callSite(query)">
                  <span>
                    <a class="ndb-callsite-link" data-ndb-show="editorTemplate"
                       data-ndb-bind:href="editorUrl(callSite(query).file, callSite(query).line)"
                       data-ndb-text="callSite(query).file + ':' + callSite(query).line"
                       title="Open at this line"></a>
                    <span class="ndb-mono" data-ndb-show="!editorTemplate"
                          data-ndb-text="callSite(query).file + ':' + callSite(query).line"></span>
                    <span class="ndb-dim" data-ndb-text="callSite(query).call"></span>
                  </span>
                </template>
              </p>
            </li>
          </template>
        </ol>

        <p class="ndb-empty" data-ndb-show="visibleQueries.length === 0">No queries match.</p>
      </div>
      </template>

      <template data-ndb-if="isSection('events')">
      <div>
        <div class="ndb-controls">
          <button type="button" class="ndb-chip" data-ndb-on:click="eventFilter = 'all'"
                  data-ndb-bind:class="eventFilter === 'all' && 'is-active'">All</button>
          <button type="button" class="ndb-chip" data-ndb-on:click="eventFilter = 'unobserved'"
                  data-ndb-bind:class="eventFilter === 'unobserved' && 'is-active'">
            Unobserved <span class="ndb-pill" data-ndb-text="events.unobserved_count || 0"></span>
          </button>
          <input class="ndb-search" type="search" placeholder="Filter events"
                 data-ndb-model="eventSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleEvents.length"></span> shown
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Event</th>
              <th class="ndb-num">Dispatched</th>
              <th class="ndb-num">Observers</th>
              <th class="ndb-num">Time</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(event, index) in visibleEvents" data-ndb-bind:key="index">
              <tr>
                <td class="ndb-mono" data-ndb-text="event.name"></td>
                <td class="ndb-num" data-ndb-text="event.count"></td>
                <td class="ndb-num" data-ndb-bind:class="event.observer_count === 0 && 'ndb-dim'"
                    data-ndb-text="event.observer_count"></td>
                <td class="ndb-num" data-ndb-text="number(event.duration_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="visibleEvents.length === 0">No events match.</p>
      </div>
      </template>

      <template data-ndb-if="isSection('observers')">
      <div>
        <div class="ndb-controls">
          <input class="ndb-search" type="search" placeholder="Filter observers"
                 data-ndb-model="observerSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleObservers.length"></span> shown
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Observer</th>
              <th>Event</th>
              <th class="ndb-num">Runs</th>
              <th class="ndb-num">Time</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(observer, index) in visibleObservers" data-ndb-bind:key="index">
              <tr>
                <td>
                  <span data-ndb-text="observer.name"></span>
                  <small class="ndb-dim ndb-mono ndb-block" data-ndb-text="observer.instance"></small>
                </td>
                <td class="ndb-mono" data-ndb-text="observer.event"></td>
                <td class="ndb-num" data-ndb-text="observer.count"></td>
                <td class="ndb-num" data-ndb-text="number(observer.duration_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="visibleObservers.length === 0">No observers match.</p>
      </div>
      </template>

      <template data-ndb-if="isSection('cache')">
      <div>
        <div class="ndb-controls">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="cache.hits || 0"></span> hits,
            <span data-ndb-text="cache.misses || 0"></span> misses,
            <span data-ndb-text="cache.hit_rate === null ? 'no reads' : number(cache.hit_rate, 1) + '% hit rate'"></span>
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Group</th>
              <th class="ndb-num">Operations</th>
              <th class="ndb-num">Hits</th>
              <th class="ndb-num">Misses</th>
              <th class="ndb-num">Size</th>
              <th class="ndb-num">Time</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(group, index) in cacheItems" data-ndb-bind:key="index">
              <tr>
                <td class="ndb-mono" data-ndb-text="group.group"></td>
                <td class="ndb-num" data-ndb-text="group.count"></td>
                <td class="ndb-num" data-ndb-text="group.hits"></td>
                <td class="ndb-num" data-ndb-bind:class="group.misses > group.hits && 'is-warn'"
                    data-ndb-text="group.misses"></td>
                <td class="ndb-num" data-ndb-text="bytes(group.bytes)"></td>
                <td class="ndb-num" data-ndb-text="number(group.duration_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="cacheItems.length === 0">No cache activity.</p>
      </div>
      </template>

      <template data-ndb-if="isSection('blocks')">
      <div>
        <div class="ndb-controls">
          <input class="ndb-search" type="search" placeholder="Filter blocks and templates"
                 data-ndb-model="blockSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleBlocks.length"></span> shown, own time excludes children
          </span>
        </div>

        <table class="ndb-table">
          <thead>
            <tr>
              <th>Block</th>
              <th class="ndb-num">Renders</th>
              <th class="ndb-num">Own</th>
              <th class="ndb-num">Total</th>
            </tr>
          </thead>
          <tbody>
            <template data-ndb-for="(block, index) in visibleBlocks" data-ndb-bind:key="index">
              <tr>
                <td>
                  <span data-ndb-text="block.name"></span>
                  <small class="ndb-dim ndb-mono ndb-block"
                         data-ndb-text="block.template || block.class"></small>
                </td>
                <td class="ndb-num" data-ndb-text="block.count"></td>
                <td class="ndb-num" data-ndb-text="number(block.own_ms, 2) + ' ms'"></td>
                <td class="ndb-num ndb-dim" data-ndb-text="number(block.total_ms, 2) + ' ms'"></td>
              </tr>
            </template>
          </tbody>
        </table>

        <p class="ndb-empty" data-ndb-show="visibleBlocks.length === 0">No blocks match.</p>
      </div>
      </template>

      <template data-ndb-if="isSection('plugins')">
      <div>
        <div class="ndb-controls">
          <input class="ndb-search" type="search" placeholder="Filter types and plugins"
                 data-ndb-model="pluginSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visiblePlugins.length"></span> intercepted types
          </span>
        </div>

        <p class="ndb-note" data-ndb-show="interception.available === false">
          Magento exposes no public API for the plugin list, so this panel reads internals.
          They moved, and the panel switched itself off rather than break the page.
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="(entry, index) in visiblePlugins" data-ndb-bind:key="index">
            <li class="ndb-intercept">
              <div class="ndb-intercept-type">
                <code data-ndb-text="entry.type"></code>
                <span class="ndb-pill" data-ndb-text="entry.plugin_count"></span>
              </div>
              <ul class="ndb-intercept-plugins">
                <template data-ndb-for="(plugin, pluginIndex) in entry.plugins"
                          data-ndb-bind:key="pluginIndex">
                  <li>
                    <span data-ndb-text="plugin.code"></span>
                    <span class="ndb-dim ndb-mono" data-ndb-text="methodList(plugin)"></span>
                    <small class="ndb-dim ndb-mono ndb-block" data-ndb-text="plugin.class"></small>
                  </li>
                </template>
              </ul>
            </li>
          </template>
        </ol>

        <p class="ndb-empty" data-ndb-show="visiblePlugins.length === 0">No plugins match.</p>
      </div>
      </template>

      <template data-ndb-if="isSection('magewire')">
      <div>
        <p class="ndb-note" data-ndb-show="!magewireHealth.present">
          No Magewire on this page. This section reads the page's own instance, and Magewire
          only loads where a component is in the layout.
        </p>

        <div data-ndb-show="magewireHealth.present">
          ${Wt("magewireTab", [
  { id: "components", label: "Components", count: "magewireComponents.length" },
  { id: "updates", label: "Updates", count: "magewireMessages.length" }
])}

          <div data-ndb-show="magewireTab === 'components'">
            <p class="ndb-empty" data-ndb-show="magewireComponents.length === 0">
              Magewire is on the page but no component has been mounted.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="component in magewireComponents"
                        data-ndb-bind:key="component.id">
                <li class="ndb-alpine">
                  <button type="button" class="ndb-alpine-head"
                          data-ndb-on:click="toggleMagewireComponent(component.id)"
                          data-ndb-on:mouseenter="highlightMagewire(component.id, true)"
                          data-ndb-on:mouseleave="highlightMagewire(component.id, false)"
                          data-ndb-on:focus="highlightMagewire(component.id, true)"
                          data-ndb-on:blur="highlightMagewire(component.id, false)">
                    ${H("caret", "ndb-alpine-caret")}
                    <span class="ndb-alpine-name" data-ndb-text="component.name"></span>
                    <span class="ndb-tag" data-ndb-show="component.children"
                          data-ndb-text="plural(component.children, 'child', 'children')"></span>
                    <span class="ndb-alpine-path ndb-dim ndb-truncate"
                          data-ndb-text="component.resolver
                            + ' · ' + plural(component.keys, 'property', 'properties')
                            + ' · ' + plural(component.listeners, 'listener', 'listeners')"></span>
                    <span class="ndb-pill"
                          data-ndb-bind:class="component.memo_bytes > 20480 && 'is-warn'"
                          data-ndb-text="bytes(component.memo_bytes)"></span>
                  </button>

                  <div class="ndb-alpine-body" data-ndb-show="isMagewireExpanded(component.id)">
                    <pre class="ndb-json"
                         data-ndb-code="highlight(magewireStates[component.id], 'json')"></pre>
                  </div>
                </li>
              </template>
            </ol>

            <p class="ndb-note">
              The size beside a component is the state it posts back and returns on every
              update. A collection on a public property is the usual reason it is large.
            </p>
          </div>

          <div data-ndb-show="magewireTab === 'updates'">
            <p class="ndb-empty" data-ndb-show="magewireMessages.length === 0">
              Nothing yet. Interact with a component and its round trip appears here.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="(message, index) in magewireMessages"
                        data-ndb-bind:key="index">
                <li class="ndb-alpine">
                  <div class="ndb-alpine-head is-static">
                    <span class="ndb-alpine-name"
                          data-ndb-text="message.component + ' ' + message.action"></span>
                    <span class="ndb-tag is-bad" data-ndb-show="message.failed">failed</span>
                    <span class="ndb-alpine-path ndb-dim ndb-truncate"
                          data-ndb-show="!message.failed">round trip, browser to browser</span>
                    <span class="ndb-pill" data-ndb-show="message.duration_ms !== null"
                          data-ndb-text="number(message.duration_ms, 1) + ' ms'"></span>
                  </div>
                </li>
              </template>
            </ol>

            <p class="ndb-note">
              Measured in the browser, so this is the network and the DOM morph as well as
              the server. The profile for the same update, in the request list above, is the
              server's share of it.
            </p>
          </div>
        </div>
      </div>
      </template>

      <template data-ndb-if="isSection('seo')">
      <div>
        ${Wt("seoTab", [
  { id: "overview", label: "Overview", count: "seo.counts.overview", tone: "'warn'" },
  { id: "headings", label: "Headings", count: "seo.counts.headings", tone: "'warn'" },
  { id: "images", label: "Images", count: "seo.counts.images", tone: "'warn'" },
  { id: "links", label: "Links", count: "seo.counts.links", tone: "'warn'" },
  { id: "social", label: "Social", count: "seo.counts.social", tone: "'warn'" }
])}

        <p class="ndb-note" data-ndb-show="seoError">
          Could not read this page: <span data-ndb-text="seoError"></span>
        </p>

        <div class="ndb-controls">
          <template data-ndb-if="seoTab === 'images' || seoTab === 'links'">
            <input class="ndb-search" type="search" data-ndb-model="seoSearch"
                   data-ndb-bind:placeholder="seoTab === 'images' ? 'Filter by source or alt' : 'Filter by URL or text'">
          </template>
          <template data-ndb-if="seoTab === 'images' || seoTab === 'links'">
            <button type="button" class="ndb-chip"
                    data-ndb-bind:class="seoProblemsOnly && 'is-active'"
                    data-ndb-on:click="seoProblemsOnly = !seoProblemsOnly">
              Problems only
            </button>
          </template>
          <button type="button" class="ndb-chip" data-ndb-on:click="refreshSeo()"
                  title="Read the page again">Refresh</button>
          <span class="ndb-dim ndb-count">Read from the page as it is now, not from the profile.</span>
        </div>

        <div data-ndb-show="seoTab === 'overview'">
          <div class="ndb-callout is-warn" data-ndb-show="seo.overview.warnings.length > 0">
            <template data-ndb-for="(warning, index) in seo.overview.warnings" data-ndb-bind:key="index">
              <p data-ndb-text="warning"></p>
            </template>
          </div>

          ${Me([
  { label: "Title", value: "seo.overview.title.value || 'missing'", tone: "seo.overview.title.hint ? 'warn' : 'ok'" },
  { label: "Title length", value: "seo.overview.title.length + ' characters'", tone: "seo.overview.title.hint ? 'warn' : 'ok'" },
  { label: "Meta description", value: "seo.overview.description.value || 'missing'", tone: "seo.overview.description.hint ? 'warn' : 'ok'" },
  { label: "Description length", value: "seo.overview.description.length + ' characters'", tone: "seo.overview.description.hint ? 'warn' : 'ok'" },
  { label: "Canonical", value: "seo.overview.canonical.href || 'missing'", mono: !0, tone: "seo.overview.canonical.warnings.length ? 'warn' : 'ok'" },
  { label: "Robots meta", value: "seo.overview.robots.meta || 'none, so index and follow'", mono: !0 },
  { label: "X-Robots-Tag", value: "seo.overview.robots.header || 'not sent'", mono: !0 },
  { label: "Language", value: "seo.overview.lang.value || 'missing'", mono: !0, tone: "seo.overview.lang.problem ? 'warn' : 'ok'" },
  { label: "Viewport", value: "seo.overview.viewport || 'missing'", mono: !0, tone: "seo.overview.viewport ? 'ok' : 'warn'" },
  { label: "Charset", value: "seo.overview.charset.value + (seo.overview.charset.declared ? '' : ', not declared')", mono: !0 },
  { label: "Words", value: "seo.overview.words" }
])}

          <template data-ndb-if="seo.overview.hreflang.items.length > 0">
          <div class="ndb-seo-block">
            <div class="ndb-subhead">
              <div>
                <h3>hreflang</h3>
                <p>The other language versions this page says it has.</p>
              </div>
            </div>
            <table class="ndb-table">
              <thead><tr><th>Language</th><th>URL</th></tr></thead>
              <tbody>
                <template data-ndb-for="(alternate, index) in seo.overview.hreflang.items" data-ndb-bind:key="index">
                  <tr>
                    <td class="ndb-mono">
                      <span data-ndb-text="alternate.lang"></span>
                      <span class="ndb-tag" data-ndb-show="alternate.self">this page</span>
                      <span class="ndb-tag is-warn" data-ndb-show="alternate.problem"
                            data-ndb-text="alternate.problem"></span>
                    </td>
                    <td class="ndb-mono" data-ndb-text="alternate.href"></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
          </template>

          <div class="ndb-subhead">
            <div>
              <h3>Links</h3>
              <p>View the source with Ctrl+U, or Option+Command+U on a Mac. Browsers do not
                let a page link to it.</p>
            </div>
          </div>
          <div class="ndb-controls">
            <template data-ndb-if="adminEditUrl">
              <a class="ndb-chip" data-ndb-bind:href="adminEditUrl" target="_blank" rel="noopener">
                Edit this page in the admin
              </a>
            </template>
            <template data-ndb-for="(link, index) in seo.quickLinks" data-ndb-bind:key="index">
              <a class="ndb-chip" data-ndb-bind:href="link.href" target="_blank" rel="noopener"
                 data-ndb-text="link.label"></a>
            </template>
          </div>
        </div>

        <div data-ndb-show="seoTab === 'headings'">
          <div class="ndb-callout is-warn" data-ndb-show="seo.headings.warnings.length > 0">
            <template data-ndb-for="(warning, index) in seo.headings.warnings" data-ndb-bind:key="index">
              <p data-ndb-text="warning"></p>
            </template>
          </div>

          <p class="ndb-empty" data-ndb-show="seo.headings.items.length === 0">
            No headings on this page.
          </p>

          <ol class="ndb-list ndb-seo-tree">
            <template data-ndb-for="heading in seo.headings.items" data-ndb-bind:key="heading.index">
              <li>
                <button type="button" class="ndb-seo-row"
                        data-ndb-bind:class="'is-level-' + heading.level"
                        data-ndb-on:click="revealSeo('headings', heading.index)"
                        data-ndb-on:mouseenter="highlightSeo('headings', heading.index, true)"
                        data-ndb-on:mouseleave="highlightSeo('headings', heading.index, false)"
                        data-ndb-on:focus="highlightSeo('headings', heading.index, true)"
                        data-ndb-on:blur="highlightSeo('headings', heading.index, false)"
                        title="Scroll to this heading">
                  <span class="ndb-tag" data-ndb-text="'H' + heading.level"></span>
                  <span class="ndb-seo-text" data-ndb-text="heading.text || '(empty)'"></span>
                  <template data-ndb-for="(warning, index) in heading.warnings" data-ndb-bind:key="index">
                    <span class="ndb-tag is-warn" data-ndb-text="warning"></span>
                  </template>
                </button>
              </li>
            </template>
          </ol>
        </div>

        <div data-ndb-show="seoTab === 'images'">
          <p class="ndb-dim ndb-count">
            <span data-ndb-text="plural(seo.images.items.length, 'image', 'images')"></span>,
            <span data-ndb-text="seo.counts.images"></span> with a problem
          </p>

          <ol class="ndb-list">
            <template data-ndb-for="image in visibleSeoImages" data-ndb-bind:key="image.index">
              <li>
                <button type="button" class="ndb-seo-row"
                        data-ndb-on:click="revealSeo('images', image.index)"
                        data-ndb-on:mouseenter="highlightSeo('images', image.index, true)"
                        data-ndb-on:mouseleave="highlightSeo('images', image.index, false)"
                        data-ndb-on:focus="highlightSeo('images', image.index, true)"
                        data-ndb-on:blur="highlightSeo('images', image.index, false)"
                        title="Scroll to this image">
                  <span class="ndb-seo-text">
                    <span data-ndb-text="altLabel(image.alt)"
                          data-ndb-bind:class="image.alt ? '' : 'ndb-dim'"></span>
                    <small class="ndb-dim ndb-mono ndb-block ndb-truncate" data-ndb-text="image.src"></small>
                    <small class="ndb-dim ndb-block" data-ndb-show="image.size" data-ndb-text="image.size"></small>
                  </span>
                  <template data-ndb-for="(warning, index) in image.warnings" data-ndb-bind:key="index">
                    <span class="ndb-tag is-warn" data-ndb-text="warning"></span>
                  </template>
                </button>
              </li>
            </template>
          </ol>

          <p class="ndb-empty" data-ndb-show="visibleSeoImages.length === 0">
            <span data-ndb-show="seoProblemsOnly && !seoSearch">No image has a problem.</span>
            <span data-ndb-show="!seoProblemsOnly || seoSearch">No images match.</span>
          </p>
        </div>

        <div data-ndb-show="seoTab === 'links'">
          ${Me([
  { label: "Internal", value: "seo.links.counts.internal" },
  { label: "External", value: "seo.links.counts.external" },
  { label: "Nofollow", value: "seo.links.counts.nofollow" },
  { label: "With a problem", value: "seo.counts.links", tone: "seo.counts.links ? 'warn' : 'ok'" }
])}

          <ol class="ndb-list">
            <template data-ndb-for="link in visibleSeoLinks" data-ndb-bind:key="link.index">
              <li>
                <button type="button" class="ndb-seo-row"
                        data-ndb-on:click="revealSeo('links', link.index)"
                        data-ndb-on:mouseenter="highlightSeo('links', link.index, true)"
                        data-ndb-on:mouseleave="highlightSeo('links', link.index, false)"
                        data-ndb-on:focus="highlightSeo('links', link.index, true)"
                        data-ndb-on:blur="highlightSeo('links', link.index, false)"
                        title="Scroll to this link">
                  <span class="ndb-seo-text">
                    <span data-ndb-text="link.text || '(no text)'"
                          data-ndb-bind:class="link.text ? '' : 'ndb-dim'"></span>
                    <small class="ndb-dim ndb-mono ndb-block ndb-truncate" data-ndb-text="link.href"></small>
                  </span>
                  <span class="ndb-tag" data-ndb-text="link.kind"></span>
                  <span class="ndb-tag" data-ndb-show="link.nofollow">nofollow</span>
                  <template data-ndb-for="(warning, index) in link.warnings" data-ndb-bind:key="index">
                    <span class="ndb-tag is-warn" data-ndb-text="warning"></span>
                  </template>
                </button>
              </li>
            </template>
          </ol>

          <p class="ndb-empty" data-ndb-show="visibleSeoLinks.length === 0">
            <span data-ndb-show="seoProblemsOnly && !seoSearch">No link has a problem.</span>
            <span data-ndb-show="!seoProblemsOnly || seoSearch">No links match.</span>
          </p>
        </div>

        <div data-ndb-show="seoTab === 'social'">
          <div class="ndb-callout is-warn" data-ndb-show="seo.social.warnings.length > 0">
            <template data-ndb-for="(warning, index) in seo.social.warnings" data-ndb-bind:key="index">
              <p data-ndb-text="warning"></p>
            </template>
          </div>

          <div class="ndb-subhead">
            <div>
              <h3>Open Graph</h3>
              <p>What Facebook, LinkedIn, Slack and most chat apps show when this page is shared.</p>
            </div>
          </div>
          <table class="ndb-table" data-ndb-show="seo.social.openGraph.length > 0">
            <tbody>
              <template data-ndb-for="(tag, index) in seo.social.openGraph" data-ndb-bind:key="index">
                <tr><td class="ndb-mono" data-ndb-text="tag.name"></td><td data-ndb-text="tag.value"></td></tr>
              </template>
            </tbody>
          </table>
          <p class="ndb-empty" data-ndb-show="seo.social.openGraph.length === 0">No Open Graph tags.</p>

          <div class="ndb-subhead">
            <div>
              <h3>X card</h3>
              <p>X falls back to Open Graph for the title, description and image.</p>
            </div>
          </div>
          <table class="ndb-table" data-ndb-show="seo.social.x.length > 0">
            <tbody>
              <template data-ndb-for="(tag, index) in seo.social.x" data-ndb-bind:key="index">
                <tr><td class="ndb-mono" data-ndb-text="tag.name"></td><td data-ndb-text="tag.value"></td></tr>
              </template>
            </tbody>
          </table>
          <p class="ndb-empty" data-ndb-show="seo.social.x.length === 0">No X card tags.</p>
        </div>
      </div>
      </template>

      <template data-ndb-if="isSection('history')">
      <div>
        ${Wt("historyTab", [
  { id: "recent", label: "Recent", count: "history.length" },
  { id: "compare", label: "Compare" }
])}

        <div data-ndb-show="historyTab === 'recent'">
        <div class="ndb-subhead">
          <div>
            <h3>Recent requests</h3>
            <p>
              <span data-ndb-text="history.length"></span> profiles on disk, newest first.
              The store keeps the last 20, or the last hour.
            </p>
          </div>
          <button type="button" class="ndb-chip" data-ndb-on:click="loadHistory(true)"
                  title="Read the store again">Refresh</button>
        </div>

        <p class="ndb-note" data-ndb-show="historyLoading">Loading the history.</p>
        <p class="ndb-note" data-ndb-show="historyError">
          Could not load the history: <span data-ndb-text="historyError"></span>
        </p>

        <ol class="ndb-list">
          <template data-ndb-for="entry in history" data-ndb-bind:key="entry.profile_id">
            <li>
              <button type="button" class="ndb-history"
                      data-ndb-bind:class="activeId === entry.profile_id && 'is-active'"
                      data-ndb-on:click="openFromHistory(entry.profile_id)">
                <span class="ndb-history-method" data-ndb-text="entry.method || 'GET'"></span>
                <span class="ndb-history-body">
                  <span class="ndb-history-path ndb-mono ndb-truncate"
                        data-ndb-text="requestLabel(entry)"></span>
                  <span class="ndb-history-meta">
                    <span data-ndb-text="entry.area"></span>
                    <span data-ndb-text="plural(entry.query_count, 'query', 'queries')"></span>
                    <span data-ndb-show="activeId === entry.profile_id">Showing now</span>
                  </span>
                </span>
                <span class="ndb-tag" data-ndb-show="entry.finding_count"
                      data-ndb-bind:class="entry.worst_severity === 'error' ? 'is-bad' : 'is-warn'"
                      data-ndb-text="plural(entry.finding_count, 'finding', 'findings')"></span>
                <span class="ndb-history-status"
                      data-ndb-bind:class="!entry.status || entry.status >= 400 ? 'is-bad' : 'is-ok'"
                      data-ndb-text="entry.status || 'threw'"></span>
                <span class="ndb-history-timing">
                  <span data-ndb-text="number(entry.duration_ms, 1) + ' ms'"></span>
                  <small class="ndb-dim" data-ndb-text="ago(entry.started_at)"></small>
                </span>
              </button>
            </li>
          </template>
        </ol>

        <p class="ndb-empty" data-ndb-show="!historyLoading && history.length === 0">
          Nothing stored yet.
        </p>
        </div>

        <div data-ndb-show="historyTab === 'compare'">
          <div class="ndb-subhead">
            <div>
              <h3>What changed</h3>
              <p>
                The request on screen, measured against an earlier one. Query shapes are
                matched by fingerprint, so the same statement with different ids counts
                once.
              </p>
            </div>
          </div>

          <div class="ndb-fields">
            <div class="ndb-field is-search">
              <span class="ndb-field-label">Compare against</span>
              <select class="ndb-search" data-ndb-model="baselineId">
                <template data-ndb-for="choice in baselineChoices"
                          data-ndb-bind:key="choice.profile_id">
                  <option data-ndb-bind:value="choice.profile_id"
                          data-ndb-text="choice.method + ' ' + choice.path + '  ·  '
                            + number(choice.duration_ms, 0) + ' ms  ·  ' + ago(choice.started_at)"></option>
                </template>
              </select>
            </div>

            <div class="ndb-field">
              <span class="ndb-field-label">&nbsp;</span>
              <button type="button" class="ndb-chip is-active"
                      data-ndb-on:click="compareProfiles()">Compare</button>
            </div>
          </div>

          <p class="ndb-note" data-ndb-show="comparing">Comparing.</p>
          <p class="ndb-note" data-ndb-show="compareError">
            Could not compare: <span data-ndb-text="compareError"></span>
          </p>
          <p class="ndb-empty" data-ndb-show="!comparison && !comparing && !compareError">
            Pick a request and compare. Nothing is fetched until you do.
          </p>

          <template data-ndb-if="comparison">
          <div>
            <div class="ndb-callout is-warn" data-ndb-show="!comparison.same_path">
              <p class="ndb-callout-title">These are different pages</p>
              <p>Comparing unlike requests measures the difference between the pages, not
                the difference a change made.</p>
            </div>

            <table class="ndb-table ndb-compare">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th class="ndb-num">Before</th>
                  <th class="ndb-num">Now</th>
                  <th class="ndb-num">Change</th>
                </tr>
              </thead>
              <tbody>
                <template data-ndb-for="metric in comparison.metrics"
                          data-ndb-bind:key="metric.key">
                  <tr>
                    <td data-ndb-text="metric.label"></td>
                    <td class="ndb-num ndb-dim" data-ndb-text="metricValue(metric, 'baseline')"></td>
                    <td class="ndb-num" data-ndb-text="metricValue(metric, 'subject')"></td>
                    <td class="ndb-num ndb-delta" data-ndb-bind:class="'is-' + metric.verdict">
                      <span data-ndb-text="deltaLabel(metric)"></span>
                      <small data-ndb-show="metric.percent !== null && metric.delta !== 0"
                             data-ndb-text="(metric.percent > 0 ? '+' : '') + metric.percent + '%'"></small>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>

            <div class="ndb-subhead" data-ndb-show="comparison.findings.added.length
                 || comparison.findings.resolved.length">
              <div>
                <h3>Findings</h3>
                <p>
                  <span data-ndb-text="comparison.findings.unchanged"></span> unchanged.
                </p>
              </div>
            </div>

            <ol class="ndb-list">
              <template data-ndb-for="(finding, index) in comparison.findings.added"
                        data-ndb-bind:key="'new' + index">
                <li class="ndb-finding" data-ndb-bind:class="'is-' + finding.severity">
                  <div class="ndb-finding-head">
                    <span class="ndb-severity" data-ndb-bind:class="'is-' + finding.severity">new</span>
                    <span class="ndb-finding-message" data-ndb-text="finding.message"></span>
                  </div>
                </li>
              </template>
              <template data-ndb-for="(finding, index) in comparison.findings.resolved"
                        data-ndb-bind:key="'gone' + index">
                <li class="ndb-finding">
                  <div class="ndb-finding-head">
                    <span class="ndb-severity is-clear">gone</span>
                    <span class="ndb-finding-message" data-ndb-text="finding.message"></span>
                  </div>
                </li>
              </template>
            </ol>

            <div class="ndb-subhead">
              <div>
                <h3>Query shapes</h3>
                <p>
                  <span data-ndb-text="comparison.queries.shapes_before"></span> before,
                  <span data-ndb-text="comparison.queries.shapes_after"></span> after.
                  <span data-ndb-text="comparison.queries.added_total"></span> added,
                  <span data-ndb-text="comparison.queries.removed_total"></span> gone,
                  <span data-ndb-text="comparison.queries.changed_total"></span> run a
                  different number of times.
                </p>
              </div>
            </div>

            <p class="ndb-empty" data-ndb-show="!comparison.queries.added_total
               && !comparison.queries.removed_total && !comparison.queries.changed_total">
              The same statements ran the same number of times.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="(row, index) in comparison.queries.added"
                        data-ndb-bind:key="'add' + index">
                <li class="ndb-query">
                  <div class="ndb-query-head">
                    <span class="ndb-delta is-worse"
                          data-ndb-text="'+' + row.count"></span>
                    <span class="ndb-query-type">added</span>
                  </div>
                  <code class="ndb-query-sql" data-ndb-code="highlight(row.sql, 'sql')"></code>
                </li>
              </template>

              <template data-ndb-for="(row, index) in comparison.queries.changed"
                        data-ndb-bind:key="'chg' + index">
                <li class="ndb-query">
                  <div class="ndb-query-head">
                    <span class="ndb-delta"
                          data-ndb-bind:class="row.delta > 0 ? 'is-worse' : 'is-better'"
                          data-ndb-text="(row.delta > 0 ? '+' : '') + row.delta"></span>
                    <span class="ndb-query-type"
                          data-ndb-text="row.baseline_count + ' to ' + row.count + ' runs'"></span>
                  </div>
                  <code class="ndb-query-sql" data-ndb-code="highlight(row.sql, 'sql')"></code>
                </li>
              </template>

              <template data-ndb-for="(row, index) in comparison.queries.removed"
                        data-ndb-bind:key="'rem' + index">
                <li class="ndb-query">
                  <div class="ndb-query-head">
                    <span class="ndb-delta is-better" data-ndb-text="row.delta"></span>
                    <span class="ndb-query-type">gone</span>
                  </div>
                  <code class="ndb-query-sql" data-ndb-code="highlight(row.sql, 'sql')"></code>
                </li>
              </template>
            </ol>
          </div>
          </template>
        </div>
      </div>
      </template>

      <template data-ndb-if="isSection('alpine')">
      <div>
        <p class="ndb-note" data-ndb-show="!alpineHealth.present">
          No Alpine on this page. This section reads the page's own instance, so it has
          nothing to show until a theme loads one.
        </p>

        <div data-ndb-show="alpineHealth.present">
          ${Wt("alpineTab", [
  { id: "components", label: "Components", count: "alpineComponents.length" },
  { id: "stores", label: "Stores", count: "alpineStores.length" },
  { id: "deferred", label: "Deferred", count: "alpineDeferredCount" },
  {
    id: "health",
    label: "Health",
    // A tick rather than a green zero: the tab says it checked, without colouring
    // a normal value the way every other count here would be.
    count: "alpineErrors.length || '✓'",
    tone: "alpineErrors.length ? 'bad' : 'ok'",
    always: !0
  }
])}

          <p class="ndb-note" data-ndb-show="valuePolicy !== 'full'">
            The value policy is set to <span data-ndb-text="valuePolicy"></span>, so
            component state is treated exactly as a stored profile would be.
          </p>

          <div data-ndb-show="alpineTab === 'components' || alpineTab === 'deferred'">
            <div class="ndb-controls">
              <input class="ndb-search" type="search" placeholder="Filter components"
                     data-ndb-model="alpineSearch">
              <button type="button" class="ndb-chip"
                      data-ndb-bind:class="alpineLive && 'is-active'"
                      data-ndb-on:click="alpineLive = !alpineLive"
                      data-ndb-bind:title="alpineLive ? 'Stop reading the page' : 'Read the page again every second'">
                Live
              </button>
              <button type="button" class="ndb-chip" data-ndb-on:click="refreshAlpine()"
                      title="Read the page now">Refresh</button>
              <span class="ndb-dim ndb-count">
                <span data-ndb-text="visibleAlpineComponents.length"></span> shown,
                <span data-ndb-text="alpinePendingCount"></span> not started
              </span>
            </div>

            <p class="ndb-note" data-ndb-show="alpineTab === 'deferred' && alpineDeferredCount === 0">
              Nothing on this page is deferred. Hyva defers a component with x-defer, and
              until it runs the component has no state at all.
            </p>

            <ol class="ndb-list">
              <template data-ndb-for="component in visibleAlpineComponents"
                        data-ndb-bind:key="component.id">
                <li class="ndb-alpine">
                  <button type="button" class="ndb-alpine-head"
                          data-ndb-on:click="toggleAlpineComponent(component.id)"
                          data-ndb-on:mouseenter="highlightAlpine(component.id, true)"
                          data-ndb-on:mouseleave="highlightAlpine(component.id, false)"
                          data-ndb-on:focus="highlightAlpine(component.id, true)"
                          data-ndb-on:blur="highlightAlpine(component.id, false)">
                    ${H("caret", "ndb-alpine-caret")}
                    <span class="ndb-alpine-name" data-ndb-text="component.name"></span>
                    <span class="ndb-tag is-warn" data-ndb-show="!component.initialised">
                      not started
                    </span>
                    <span class="ndb-tag" data-ndb-show="component.deferred"
                          data-ndb-text="'defer: ' + component.strategy"></span>
                    <span class="ndb-alpine-path ndb-mono ndb-dim ndb-truncate"
                          data-ndb-text="component.path"></span>
                    <span class="ndb-pill" data-ndb-show="component.keys"
                          data-ndb-text="component.keys"></span>
                  </button>

                  <div class="ndb-alpine-body" data-ndb-show="isAlpineExpanded(component.id)">
                    <code class="ndb-alpine-expression" data-ndb-show="component.expression"
                          data-ndb-code="highlight(component.expression, 'javascript')"></code>
                    <pre class="ndb-json" data-ndb-code="highlight(alpineStates[component.id], 'json')"></pre>
                  </div>
                </li>
              </template>
            </ol>

            <p class="ndb-empty" data-ndb-show="visibleAlpineComponents.length === 0">
              No components match.
            </p>
          </div>

          <div data-ndb-show="alpineTab === 'stores'">
            <div class="ndb-controls">
              <span class="ndb-dim ndb-count">
                <span data-ndb-text="alpineStores.length"></span> registered with
                Alpine.store()
              </span>
            </div>

            <ol class="ndb-list">
              <template data-ndb-for="store in alpineStores" data-ndb-bind:key="store.name">
                <li class="ndb-alpine">
                  <div class="ndb-alpine-head is-static">
                    <span class="ndb-alpine-name" data-ndb-text="store.name"></span>
                    <span class="ndb-pill" data-ndb-show="store.keys"
                          data-ndb-text="store.keys"></span>
                  </div>
                  <div class="ndb-alpine-body">
                    <pre class="ndb-json" data-ndb-code="highlight(store.value, 'json')"></pre>
                  </div>
                </li>
              </template>
            </ol>

            <p class="ndb-empty" data-ndb-show="alpineStores.length === 0">
              No stores. Alpine keeps them in module state with no public getter, so an
              empty list can also mean this version does not let the bar reach them.
            </p>
          </div>

          <div data-ndb-show="alpineTab === 'health'">
            ${Me([
  { label: "Version", value: "alpineHealth.version" },
  { label: "Build", value: "alpineBuild" },
  { label: "Prefix", value: "alpineHealth.prefix", mono: !0 },
  { label: "Loaded from", value: "alpineHealth.source || 'not a separate file'", mono: !0 },
  { label: "Components", value: "alpineComponents.length" },
  { label: "Not started", value: "alpinePendingCount" },
  { label: "Deferred", value: "alpineDeferredCount" },
  { label: "Stores", value: "alpineStores.length" }
])}

            <div class="ndb-callout is-bad" data-ndb-show="alpineErrors.length > 0">
              <p class="ndb-callout-title"
                 data-ndb-text="plural(alpineErrors.length, 'expression error', 'expression errors')"></p>
              <p>Something on this page threw while Alpine was evaluating it. A binding that
                throws renders as an empty element and says nothing, so this is the only
                place it shows.</p>
            </div>

            <div class="ndb-callout is-clear" data-ndb-show="alpineErrors.length === 0">
              <p class="ndb-callout-title">No expression errors</p>
              <p>Nothing threw while Alpine was evaluating this page.</p>
            </div>

            <ol class="ndb-list">
              <template data-ndb-for="(error, index) in alpineErrors"
                        data-ndb-bind:key="index">
                <li class="ndb-finding is-error">
                  <div class="ndb-finding-head">
                    <span class="ndb-severity is-error"
                          data-ndb-text="error.during_init ? 'init' : 'runtime'"></span>
                    <span class="ndb-finding-message" data-ndb-text="error.message"></span>
                  </div>
                  <p class="ndb-finding-where" data-ndb-show="error.expression">
                    <strong>Expression</strong> <code data-ndb-text="error.expression"></code>
                  </p>
                  <p class="ndb-finding-where" data-ndb-show="error.element">
                    <strong>Where</strong> <code data-ndb-text="error.element"></code>
                  </p>
                </li>
              </template>
            </ol>
          </div>
        </div>
      </div>
      </template>

      </div>
      </div>
    </div>
  </div>

</div>
`, ou = "data-ndb-", Os = "siteation-debugbar";
function lu(e) {
  const t = e.attachShadow({ mode: "open" }), n = e.dataset.css;
  if (n) {
    const s = document.createElement("link");
    s.rel = "stylesheet", s.href = n, t.append(s);
  }
  const i = document.createElement("div");
  return i.innerHTML = ru, t.append(...i.children), t.querySelector(".ndb");
}
class cu extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const t = lu(this);
    t && vt.initTree(t);
  }
}
customElements.get(Os) || (vt.prefix(ou), vt.data("debugBar", su), vt.directive("code", (e, { expression: t }, { effect: n, evaluateLater: i }) => {
  const s = i(t);
  n(() => s((a) => {
    e.innerHTML = typeof a == "string" ? a : "";
  }));
}), customElements.define(Os, cu));
$n && (window.Alpine = $n);
