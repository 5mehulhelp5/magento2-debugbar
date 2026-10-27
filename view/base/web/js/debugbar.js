const Jn = window.Alpine;
var Xn = !1, Zn = !1, ye = [], Yn = -1, sn = !1, wa = !1;
function jo(e) {
  Fo(e);
}
function Uo() {
  wa = !0;
}
function Bo() {
  wa = !1, ni();
}
function Fo(e) {
  ye.includes(e) || (ye.push(e), e._x_schedulerPriority !== void 0 && (sn = !0)), ni();
}
function Ho(e) {
  let t = ye.indexOf(e);
  t !== -1 && t > Yn && ye.splice(t, 1);
}
function ni() {
  if (!Zn && !Xn) {
    if (wa)
      return;
    Xn = !0, queueMicrotask(Wo);
  }
}
function Wo() {
  Xn = !1, Zn = !0;
  for (let e = 0; e < ye.length; e++)
    sn && Go(e), ye[e](), Yn = e;
  ye.length = 0, Yn = -1, sn = !1, Zn = !1;
}
function Go(e) {
  let t = /* @__PURE__ */ new Map(), n = ye.slice(e).sort((a, s) => zo(a, s, t));
  for (let a = 0; a < n.length; a++)
    ye[e + a] = n[a];
  sn = !1;
}
function zo(e, t, n) {
  return Dn(e) ? Dn(t) ? ys(e._x_schedulerPriority.el, n) - ys(t._x_schedulerPriority.el, n) || e._x_schedulerPriority.order - t._x_schedulerPriority.order : -1 : Dn(t) ? 1 : 0;
}
function Dn(e) {
  return e._x_schedulerPriority !== void 0;
}
function ys(e, t) {
  if (t.has(e))
    return t.get(e);
  let n = 0, a = e;
  for (; e; )
    n++, e._x_teleportBack ? e = e._x_teleportBack : typeof ShadowRoot == "function" && e.parentNode instanceof ShadowRoot ? e = e.parentNode.host : e = e.parentElement;
  return t.set(a, n), n;
}
var lt, Xe, dt, ai, Vo = 0, Qn = !0;
function Ko(e) {
  Qn = !1, e(), Qn = !0;
}
function Jo(e) {
  lt = e.reactive, dt = e.release, Xe = (t) => e.effect(t, { scheduler: (n) => {
    Qn ? jo(n) : n();
  } }), ai = e.raw;
}
function vs(e) {
  Xe = e;
}
function Xo(e) {
  let t = () => {
  };
  return [(a, s) => {
    let i = s?.priority === "structural" ? Vo++ : void 0, r = Xe(a);
    return i !== void 0 && r !== void 0 && (r._x_schedulerPriority = { el: e, order: i }), e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), dt(r));
    }, r;
  }, () => {
    t();
  }];
}
function si(e, t) {
  let n = !0, a, s, i = Xe(() => {
    let r = e(), o = JSON.stringify(r);
    if (!n && (typeof r == "object" || r !== a)) {
      let l = typeof a == "object" ? JSON.parse(s) : a;
      queueMicrotask(() => {
        t(r, l);
      });
    }
    a = r, s = o, n = !1;
  });
  return () => dt(i);
}
async function Zo(e) {
  Uo();
  try {
    await e(), await Promise.resolve();
  } finally {
    Bo();
  }
}
var ii = [], ri = [], oi = [];
function Yo(e) {
  oi.push(e);
}
function xa(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, ri.push(t));
}
function li(e) {
  ii.push(e);
}
function di(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function ci(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, a]) => {
    (t === void 0 || t.includes(n)) && (a.forEach((s) => s()), delete e._x_attributeCleanups[n]);
  });
}
function Qo(e) {
  for (e._x_effects?.forEach(Ho); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var _a = new MutationObserver(Aa), ka = !1;
function Ea() {
  _a.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), ka = !0;
}
function ui() {
  el(), _a.disconnect(), ka = !1;
}
var ft = [];
function el() {
  let e = _a.takeRecords();
  ft.push(() => e.length > 0 && Aa(e));
  let t = ft.length;
  queueMicrotask(() => {
    if (ft.length === t)
      for (; ft.length > 0; )
        ft.shift()();
  });
}
function B(e) {
  if (!ka)
    return e();
  ui();
  let t = e();
  return Ea(), t;
}
var Sa = !1, rn = [];
function tl() {
  Sa = !0;
}
function nl() {
  Sa = !1, Aa(rn), rn = [];
}
function Aa(e) {
  if (Sa) {
    rn = rn.concat(e);
    return;
  }
  let t = [], n = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  for (let i = 0; i < e.length; i++)
    if (!e[i].target._x_ignoreMutationObserver && (e[i].type === "childList" && (e[i].removedNodes.forEach((r) => {
      r.nodeType === 1 && r._x_marker && n.add(r);
    }), e[i].addedNodes.forEach((r) => {
      if (r.nodeType === 1) {
        if (n.has(r)) {
          n.delete(r);
          return;
        }
        r._x_marker || t.push(r);
      }
    })), e[i].type === "attributes")) {
      let r = e[i].target, o = e[i].attributeName, l = e[i].oldValue, d = () => {
        a.has(r) || a.set(r, []), a.get(r).push({ name: o, value: r.getAttribute(o) });
      }, u = () => {
        s.has(r) || s.set(r, []), s.get(r).push(o);
      };
      r.hasAttribute(o) && l === null ? d() : r.hasAttribute(o) ? (u(), d()) : u();
    }
  s.forEach((i, r) => {
    ci(r, i);
  }), a.forEach((i, r) => {
    ii.forEach((o) => o(r, i));
  });
  for (let i of n)
    t.some((r) => r.contains(i)) || ri.forEach((r) => r(i));
  for (let i of t)
    i.isConnected && oi.forEach((r) => r(i));
  t = null, n = null, a = null, s = null;
}
function hi(e) {
  return Fe(rt(e));
}
function $t(e, t, n) {
  return e._x_dataStack = [t, ...rt(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((a) => a !== t);
  };
}
function rt(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? rt(e.host) : e.parentNode ? rt(e.parentNode) : [];
}
function Fe(e) {
  return new Proxy({ objects: e }, al);
}
function pi(e, t) {
  return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : pi(Object.getPrototypeOf(e), t);
}
var al = {
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
    return t == "toJSON" ? sl : Reflect.get(
      e.find(
        (a) => Reflect.has(a, t)
      ) || {},
      t,
      n
    );
  },
  set({ objects: e }, t, n, a) {
    let s;
    for (const r of e)
      if (s = pi(r, t), s)
        break;
    s || (s = e[e.length - 1]);
    const i = Object.getOwnPropertyDescriptor(s, t);
    return i?.set && i?.get ? i.set.call(a, n) || !0 : Reflect.set(s, t, n);
  }
};
function sl() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function Ta(e, t = () => {
}) {
  let n = (s) => typeof s == "object" && !Array.isArray(s) && s !== null, a = (s, i = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(s)).forEach(([r, { value: o, enumerable: l }]) => {
      if (l === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let d = i === "" ? r : `${i}.${r}`;
      typeof o == "object" && o !== null && o._x_interceptor ? s[r] = o.initialize(e, d, r, t) : n(o) && o !== s && !(o instanceof Element) && a(o, d);
    });
  };
  return a(e);
}
function fi(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(a, s, i, r) {
      return e(this.initialValue, () => il(a, s), (o) => ea(a, s, o), s, i, r);
    }
  };
  return t(n), (a) => {
    if (typeof a == "object" && a !== null && a._x_interceptor) {
      let s = n.initialize.bind(n);
      n.initialize = (i, r, o, l) => {
        let d = a.initialize(i, r, o, l);
        return n.initialValue = d, s(i, r, o, l);
      };
    } else
      n.initialValue = a;
    return n;
  };
}
function il(e, t) {
  return t.split(".").reduce((n, a) => n[a], e);
}
function ea(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), ea(e[t[0]], t.slice(1), n);
  }
}
var bi = {};
function re(e, t) {
  bi[e] = t;
}
function on(e, t) {
  let n = rl(t);
  return Object.entries(bi).forEach(([a, s]) => {
    Object.defineProperty(e, `$${a}`, {
      get() {
        return s(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function rl(e) {
  let [t, n] = _i(e), a = { interceptor: fi, ...t };
  return xa(e, n), a;
}
function ol(e, t, n, ...a) {
  try {
    return n(...a);
  } catch (s) {
    Oa(s, e, t);
  }
}
function Oa(...e) {
  return gi(...e);
}
var gi = dl;
function ll(e) {
  gi = e;
}
function dl(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var De = !0;
function mi(e) {
  let t = De;
  De = !1;
  let n = e();
  return De = t, n;
}
function qe(e, t, n = {}) {
  let a;
  return Y(e, t)((s) => a = s, n), a;
}
function Y(...e) {
  return yi(...e);
}
var yi = () => {
};
function cl(e) {
  yi = e;
}
var vi;
function ul(e) {
  vi = e;
}
function hl(e, t) {
  return (n = () => {
  }, { scope: a = {}, params: s = [], context: i } = {}) => {
    if (!De) {
      ta(n, t, Fe([a, ...e]), s);
      return;
    }
    let r = t.apply(Fe([a, ...e]), s);
    ta(n, r);
  };
}
function ta(e, t, n, a, s) {
  if (De && typeof t == "function") {
    let i = t.apply(n, a);
    i instanceof Promise ? i.then((r) => ta(e, r, n, a)).catch((r) => Oa(r, s, t)) : e(i);
  } else typeof t == "object" && t instanceof Promise ? t.then((i) => e(i)) : e(t);
}
function pl(...e) {
  return vi(...e);
}
var Ca = "x-";
function ct(e = "") {
  return Ca + e;
}
function fl(e) {
  Ca = e;
}
var ln = {};
function F(e, t) {
  return ln[e] = t, {
    before(n) {
      if (!ln[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const a = Pe.indexOf(n);
      Pe.splice(a >= 0 ? a : Pe.indexOf("DEFAULT"), 0, e);
    }
  };
}
function bl(e) {
  return Object.keys(ln).includes(e);
}
function Ma(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let i = Object.entries(e._x_virtualDirectives).map(([o, l]) => ({ name: o, value: l })), r = wi(i);
    i = i.map((o) => r.find((l) => l.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(i);
  }
  let a = {};
  return t.map(Si((i, r) => a[i] = r)).filter(Ti).map(yl(a, n)).sort(vl).map((i) => ml(e, i));
}
function wi(e) {
  return Array.from(e).map(Si()).filter((t) => !Ti(t));
}
var na = !1, vt = /* @__PURE__ */ new Map(), xi = /* @__PURE__ */ Symbol();
function gl(e) {
  na = !0;
  let t = /* @__PURE__ */ Symbol();
  xi = t, vt.set(t, []);
  let n = () => {
    for (; vt.get(t).length; )
      vt.get(t).shift()();
    vt.delete(t);
  }, a = () => {
    na = !1, n();
  };
  e(n), a();
}
function _i(e) {
  let t = [], n = (o) => t.push(o), [a, s] = Xo(e);
  return t.push(s), [{
    Alpine: ut,
    effect: a,
    cleanup: n,
    evaluateLater: Y.bind(Y, e),
    evaluate: qe.bind(qe, e)
  }, () => t.forEach((o) => o())];
}
function ml(e, t) {
  let n = () => {
  }, a = ln[t.type] || n, [s, i] = _i(e);
  di(e, t.original, i);
  let r = () => {
    e._x_ignore || e._x_ignoreSelf || (a.inline && a.inline(e, t, s), a = a.bind(a, e, t, s), na ? vt.get(xi).push(a) : a());
  };
  return r.runCleanups = i, r;
}
var ki = (e, t) => ({ name: n, value: a }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: a }), Ei = (e) => e;
function Si(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: a, value: s } = Ai.reduce((i, r) => r(i), { name: t, value: n });
    return a !== t && e(a, t), { name: a, value: s };
  };
}
var Ai = [];
function Na(e) {
  Ai.push(e);
}
function Ti({ name: e }) {
  return Oi().test(e);
}
var Oi = () => new RegExp(`^${Ca}([^:^.]+)\\b`);
function yl(e, t) {
  return ({ name: n, value: a }) => {
    n === a && (a = "");
    let s = n.match(Oi()), i = n.match(/:([a-zA-Z0-9\-_:]+)/), r = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: s ? s[1] : null,
      value: i ? i[1] : null,
      modifiers: r.map((l) => l.replace(".", "")),
      expression: a,
      original: o
    };
  };
}
var aa = "DEFAULT", Pe = [
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
  aa,
  "teleport"
];
function vl(e, t) {
  let n = Pe.indexOf(e.type) === -1 ? aa : e.type, a = Pe.indexOf(t.type) === -1 ? aa : t.type;
  return Pe.indexOf(n) - Pe.indexOf(a);
}
function wt(e, t, n = {}, a = {}) {
  return e.dispatchEvent(
    new CustomEvent(t, {
      detail: n,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0,
      // Allows overriding the default event options.
      ...a
    })
  );
}
function He(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((s) => He(s, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let a = e.firstElementChild;
  for (; a; )
    He(a, t), a = a.nextElementSibling;
}
function ue(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var ws = !1;
function wl() {
  ws && ue("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), ws = !0, document.body || ue("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), wt(document, "alpine:init"), wt(document, "alpine:initializing"), Ea(), Yo((t) => we(t, He)), xa((t) => Ze(t)), li((t, n) => {
    Ma(t, n).forEach((a) => a());
  });
  let e = (t) => !vn(t.parentElement, !0);
  Array.from(document.querySelectorAll(Ni().join(","))).filter(e).forEach((t) => {
    we(t);
  }), wt(document, "alpine:initialized"), setTimeout(() => {
    El();
  });
}
var La = [], Ci = [];
function Mi() {
  return La.map((e) => e());
}
function Ni() {
  return La.concat(Ci).map((e) => e());
}
function Li(e) {
  La.push(e);
}
function $i(e) {
  Ci.push(e);
}
function vn(e, t = !1) {
  return ve(e, (n) => {
    if ((t ? Ni() : Mi()).some((s) => n.matches(s)))
      return !0;
  });
}
function ve(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack)
      return ve(e._x_teleportBack, t);
    if (e.parentNode instanceof ShadowRoot)
      return ve(e.parentNode.host, t);
    if (e.parentElement)
      return ve(e.parentElement, t);
  }
}
function xl(e) {
  return Mi().some((t) => e.matches(t));
}
var Ri = [];
function _l(e) {
  Ri.push(e);
}
var kl = 1;
function we(e, t = He, n = () => {
}) {
  ve(e, (a) => a._x_ignore) || gl(() => {
    t(e, (a, s) => {
      a._x_marker || (n(a, s), Ri.forEach((i) => i(a, s)), Ma(a, a.attributes).forEach((i) => i()), a._x_ignore || (a._x_marker = kl++), a._x_ignore && s());
    });
  });
}
function Ze(e, t = He) {
  t(e, (n) => {
    Qo(n), ci(n), delete n._x_marker;
  });
}
function El() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, a]) => {
    bl(n) || a.some((s) => {
      if (document.querySelector(s))
        return ue(`found "${s}", but missing ${t} plugin`), !0;
    });
  });
}
var sa = [], $a = !1;
function Ra(e = () => {
}) {
  return queueMicrotask(() => {
    $a || setTimeout(() => {
      ia();
    });
  }), new Promise((t) => {
    sa.push(() => {
      e(), t();
    });
  });
}
function ia() {
  for ($a = !1; sa.length; )
    sa.shift()();
}
function Sl() {
  $a = !0;
}
function Pa(e, t) {
  return Array.isArray(t) ? xs(e, t.join(" ")) : typeof t == "object" && t !== null ? Al(e, t) : typeof t == "function" ? Pa(e, t()) : xs(e, t);
}
function ra(e) {
  return e.split(/\s/).filter(Boolean);
}
function xs(e, t) {
  let n = (s) => ra(s).filter((i) => !e.classList.contains(i)).filter(Boolean), a = (s) => (e.classList.add(...s), () => {
    e.classList.remove(...s);
  });
  return t = t === !0 ? t = "" : t || "", a(n(t));
}
function Al(e, t) {
  let n = Object.entries(t).flatMap(([r, o]) => o ? ra(r) : !1).filter(Boolean), a = Object.entries(t).flatMap(([r, o]) => o ? !1 : ra(r)).filter(Boolean), s = [], i = [];
  return a.forEach((r) => {
    e.classList.contains(r) && (e.classList.remove(r), i.push(r));
  }), n.forEach((r) => {
    e.classList.contains(r) || (e.classList.add(r), s.push(r));
  }), () => {
    i.forEach((r) => e.classList.add(r)), s.forEach((r) => e.classList.remove(r));
  };
}
function wn(e, t) {
  return typeof t == "object" && t !== null ? Tl(e, t) : Ol(e, t);
}
function Tl(e, t) {
  let n = {};
  return Object.entries(t).forEach(([a, s]) => {
    n[a] = e.style[a], a.startsWith("--") || (a = Cl(a)), e.style.setProperty(a, s);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    wn(e, n);
  };
}
function Ol(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function Cl(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function oa(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
F("transition", (e, { value: t, modifiers: n, expression: a }, { evaluate: s }) => {
  typeof a == "function" && (a = s(a)), a !== !1 && (!a || typeof a == "boolean" ? Nl(e, n, t) : Ml(e, a, t));
});
function Ml(e, t, n) {
  Pi(e, Pa, ""), {
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
function Nl(e, t, n) {
  Pi(e, wn);
  let a = !t.includes("in") && !t.includes("out") && !n, s = a || t.includes("in") || ["enter"].includes(n), i = a || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !a && (t = t.filter((S, L) => L < t.indexOf("out"))), t.includes("out") && !a && (t = t.filter((S, L) => L > t.indexOf("out")));
  let r = !t.includes("opacity") && !t.includes("scale"), o = r || t.includes("opacity"), l = r || t.includes("scale"), d = o ? 0 : 1, u = l ? bt(t, "scale", 95) / 100 : 1, h = bt(t, "delay", 0) / 1e3, p = bt(t, "origin", "center"), w = "opacity, transform", C = bt(t, "duration", 150) / 1e3, m = bt(t, "duration", 75) / 1e3, g = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  s && (e._x_transition.enter.during = {
    transformOrigin: p,
    transitionDelay: `${h}s`,
    transitionProperty: w,
    transitionDuration: `${C}s`,
    transitionTimingFunction: g
  }, e._x_transition.enter.start = {
    opacity: d,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), i && (e._x_transition.leave.during = {
    transformOrigin: p,
    transitionDelay: `${h}s`,
    transitionProperty: w,
    transitionDuration: `${m}s`,
    transitionTimingFunction: g
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: d,
    transform: `scale(${u})`
  });
}
function Pi(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(a = () => {
    }, s = () => {
    }) {
      la(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, a, s);
    },
    out(a = () => {
    }, s = () => {
    }) {
      la(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, a, s);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, n, a) {
  const s = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let i = () => s(n);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(n) : i() : e._x_transition ? e._x_transition.in(n) : i();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((r, o) => {
    e._x_transition.out(() => {
    }, () => r(a)), e._x_transitioning && e._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(a), queueMicrotask(() => {
    let r = Ii(e);
    r ? (r._x_hideChildren || (r._x_hideChildren = []), r._x_hideChildren.push(e)) : s(() => {
      let o = (l) => {
        let d = Promise.all([
          l._x_hidePromise,
          ...(l._x_hideChildren || []).map(o)
        ]).then(([u]) => u?.());
        return delete l._x_hidePromise, delete l._x_hideChildren, d;
      };
      o(e).catch((l) => {
        if (!l.isFromCancelledTransition)
          throw l;
      });
    });
  });
};
function Ii(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Ii(t);
}
function la(e, t, { during: n, start: a, end: s } = {}, i = () => {
}, r = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(a).length === 0 && Object.keys(s).length === 0) {
    i(), r();
    return;
  }
  let o, l, d;
  Ll(e, {
    start() {
      o = t(e, a);
    },
    during() {
      l = t(e, n);
    },
    before: i,
    end() {
      o(), d = t(e, s);
    },
    after: r,
    cleanup() {
      l(), d();
    }
  });
}
function Ll(e, t) {
  let n, a, s, i = oa(() => {
    B(() => {
      n = !0, a || t.before(), s || (t.end(), ia()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(r) {
      this.beforeCancels.push(r);
    },
    cancel: oa(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      i();
    }),
    finish: i
  }, B(() => {
    t.start(), t.during();
  }), Sl(), requestAnimationFrame(() => {
    if (n)
      return;
    let r = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    r === 0 && (r = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), B(() => {
      t.before();
    }), a = !0, requestAnimationFrame(() => {
      n || (B(() => {
        t.end();
      }), ia(), setTimeout(e._x_transitioning.finish, r + o), s = !0);
    });
  });
}
function bt(e, t, n) {
  if (e.indexOf(t) === -1)
    return n;
  const a = e[e.indexOf(t) + 1];
  if (!a || t === "scale" && isNaN(a))
    return n;
  if (t === "duration" || t === "delay") {
    let s = a.match(/([0-9]+)ms/);
    if (s)
      return s[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [a, e[e.indexOf(t) + 2]].join(" ") : a;
}
var Te = !1;
function Oe(e, t = () => {
}) {
  return (...n) => Te ? t(...n) : e(...n);
}
function $l(e) {
  return (...t) => Te && e(...t);
}
var Di = [];
function xn(e) {
  Di.push(e);
}
function Rl(e, t) {
  Di.forEach((n) => n(e, t)), Te = !0, qi(() => {
    we(t, (n, a) => {
      a(n, () => {
      });
    });
  }), Te = !1;
}
var da = !1;
function Pl(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), Te = !0, da = !0, qi(() => {
    Il(t);
  }), Te = !1, da = !1;
}
function Il(e) {
  let t = !1;
  we(e, (a, s) => {
    He(a, (i, r) => {
      if (t && xl(i))
        return r();
      t = !0, s(i, r);
    });
  });
}
function qi(e) {
  let t = Xe;
  vs((n, a) => {
    let s = t(n);
    return dt(s), () => {
    };
  }), e(), vs(t);
}
function ji(e, t, n, a = []) {
  switch (e._x_bindings || (e._x_bindings = lt({})), e._x_bindings[t] = n, t = a.includes("camel") ? Wl(t) : t, t) {
    case "value":
      Dl(e, n);
      break;
    case "style":
      jl(e, n);
      break;
    case "class":
      ql(e, n);
      break;
    case "selected":
    case "checked":
      Ul(e, t, n);
      break;
    default:
      Ia(e, t, n);
      break;
  }
}
function Dl(e, t) {
  if (Da(e))
    e.attributes.value === void 0 && (e.value = t);
  else if (dn(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Gl(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Hl(e, t);
  else if (e.tagName === "OPTION")
    Ia(e, "value", t);
  else {
    if (e.value === t && (typeof t != "object" || t === null))
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function ql(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = Pa(e, t);
}
function jl(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = wn(e, t);
}
function Ul(e, t, n) {
  Ia(e, t, n), Fl(e, t, n);
}
function Ia(e, t, n) {
  [null, void 0, !1].includes(n) && Vl(t) ? e.removeAttribute(t) : (Ui(t) && (n = t), Kl(n) && (n = JSON.stringify(n)), Bl(e, t, n));
}
function Bl(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function Fl(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Hl(e, t) {
  const n = [].concat(t).map((a) => a + "");
  Array.from(e.options).forEach((a) => {
    a.selected = n.includes(a.value);
  });
}
function Wl(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Gl(e, t) {
  return e == t;
}
function tn(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var zl = /* @__PURE__ */ new Set([
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
function Ui(e) {
  return zl.has(e);
}
function Vl(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Kl(e) {
  return typeof e == "object" && e !== null;
}
function Jl(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Bi(e, t, n);
}
function Xl(e, t, n, a = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let s = e._x_inlineBindings[t];
    return s.extract = a, mi(() => qe(e, s.expression));
  }
  return Bi(e, t, n);
}
function Bi(e, t, n) {
  let a = e.getAttribute(t);
  return a === null ? typeof n == "function" ? n() : n : a === "" ? !0 : Ui(t) ? !![t, "true"].includes(a) : a;
}
function dn(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function Da(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function Fi(e, t) {
  let n;
  return function() {
    const a = this, s = arguments, i = function() {
      n = null, e.apply(a, s);
    };
    clearTimeout(n), n = setTimeout(i, t);
  };
}
function Hi(e, t) {
  let n;
  return function() {
    let a = this, s = arguments;
    n || (e.apply(a, s), n = !0, setTimeout(() => n = !1, t));
  };
}
function Wi({ get: e, set: t }, { get: n, set: a }) {
  let s = !0, i, r = Xe(() => {
    let o = e(), l = n();
    if (s)
      a(qn(o)), s = !1;
    else {
      let d = JSON.stringify(o), u = JSON.stringify(l);
      d !== i ? a(qn(o)) : d !== u && t(qn(l));
    }
    i = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    dt(r);
  };
}
function qn(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Zl(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(ut));
}
var me = {}, _s = !1;
function Yl(e, t) {
  if (_s || (me = lt(me), _s = !0), t === void 0)
    return me[e];
  me[e] = t, typeof t == "object" && t !== null && t._x_interceptor ? me[e] = t.initialize(me, e, e, () => {
  }) : Ta(me[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && me[e].init();
}
function Ql() {
  return me;
}
var Gi = {};
function ed(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? zi(e, n()) : (Gi[e] = n, () => {
  });
}
function td(e) {
  return Object.entries(Gi).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...a) => n(...a);
      }
    });
  }), e;
}
function zi(e, t, n) {
  let a = [];
  for (; a.length; )
    a.pop()();
  let s = Object.entries(t).map(([r, o]) => ({ name: r, value: o })), i = wi(s);
  return s = s.map((r) => i.find((o) => o.name === r.name) ? {
    name: `x-bind:${r.name}`,
    value: `"${r.value}"`
  } : r), Ma(e, s, n).map((r) => {
    a.push(r.runCleanups), r();
  }), () => {
    for (; a.length; )
      a.pop()();
  };
}
var Vi = {};
function nd(e, t) {
  Vi[e] = t;
}
function ad(e, t) {
  return Object.entries(Vi).forEach(([n, a]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...s) => a.bind(t)(...s);
      },
      enumerable: !1
    });
  }), e;
}
var sd = {
  get reactive() {
    return lt;
  },
  get release() {
    return dt;
  },
  get effect() {
    return Xe;
  },
  get raw() {
    return ai;
  },
  get transaction() {
    return Zo;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: nl,
  dontAutoEvaluateFunctions: mi,
  disableEffectScheduling: Ko,
  startObservingMutations: Ea,
  stopObservingMutations: ui,
  setReactivityEngine: Jo,
  onAttributeRemoved: di,
  onAttributesAdded: li,
  closestDataStack: rt,
  skipDuringClone: Oe,
  onlyDuringClone: $l,
  addRootSelector: Li,
  addInitSelector: $i,
  setErrorHandler: ll,
  interceptClone: xn,
  addScopeToNode: $t,
  deferMutations: tl,
  mapAttributes: Na,
  evaluateLater: Y,
  interceptInit: _l,
  initInterceptors: Ta,
  injectMagics: on,
  setEvaluator: cl,
  setRawEvaluator: ul,
  mergeProxies: Fe,
  extractProp: Xl,
  findClosest: ve,
  onElRemoved: xa,
  closestRoot: vn,
  destroyTree: Ze,
  interceptor: fi,
  // INTERNAL: not public API and is subject to change without major release.
  transition: la,
  // INTERNAL
  setStyles: wn,
  // INTERNAL
  mutateDom: B,
  directive: F,
  entangle: Wi,
  throttle: Hi,
  debounce: Fi,
  evaluate: qe,
  evaluateRaw: pl,
  initTree: we,
  nextTick: Ra,
  prefixed: ct,
  prefix: fl,
  plugin: Zl,
  magic: re,
  store: Yl,
  start: wl,
  clone: Pl,
  // INTERNAL
  cloneNode: Rl,
  // INTERNAL
  bound: Jl,
  $data: hi,
  watch: si,
  walk: He,
  data: nd,
  bind: ed
}, ut = sd, ks = /* @__PURE__ */ new WeakMap(), Ki = /* @__PURE__ */ new Set();
Object.getOwnPropertyNames(globalThis).forEach((e) => {
  e === "styleMedia" || e === "sharedStorage" || Ki.add(globalThis[e]);
});
var G = class {
  constructor(e, t, n, a) {
    this.type = e, this.value = t, this.start = n, this.end = a;
  }
}, id = class {
  constructor(e) {
    this.input = e, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const e = this.input[this.position];
      this.isDigit(e) ? this.readNumber() : this.isAlpha(e) || e === "_" || e === "$" ? this.readIdentifierOrKeyword() : e === '"' || e === "'" ? this.readString() : e === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new G("EOF", null, this.position, this.position)), this.tokens;
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
      const a = this.input[this.position];
      if (this.isDigit(a))
        this.position++;
      else if (a === "." && !t)
        t = !0, this.position++;
      else
        break;
    }
    const n = this.input.slice(e, this.position);
    this.tokens.push(new G("NUMBER", parseFloat(n), e, this.position));
  }
  readIdentifierOrKeyword() {
    const e = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const t = this.input.slice(e, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(t) ? t === "true" || t === "false" ? this.tokens.push(new G("BOOLEAN", t === "true", e, this.position)) : t === "null" ? this.tokens.push(new G("NULL", null, e, this.position)) : t === "undefined" ? this.tokens.push(new G("UNDEFINED", void 0, e, this.position)) : this.tokens.push(new G("KEYWORD", t, e, this.position)) : this.tokens.push(new G("IDENTIFIER", t, e, this.position));
  }
  readString() {
    const e = this.position, t = this.input[this.position];
    this.position++;
    let n = "", a = !1;
    for (; this.position < this.input.length; ) {
      const s = this.input[this.position];
      if (a) {
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
        a = !1;
      } else if (s === "\\")
        a = !0;
      else if (s === t) {
        this.position++, this.tokens.push(new G("STRING", n, e, this.position));
        return;
      } else
        n += s;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${e}`);
  }
  readOperatorOrPunctuation() {
    const e = this.position, t = this.input[this.position], n = this.peek(), a = this.peek(2);
    if (t === "=" && n === "=" && a === "=")
      this.position += 3, this.tokens.push(new G("OPERATOR", "===", e, this.position));
    else if (t === "!" && n === "=" && a === "=")
      this.position += 3, this.tokens.push(new G("OPERATOR", "!==", e, this.position));
    else if (t === "=" && n === "=")
      this.position += 2, this.tokens.push(new G("OPERATOR", "==", e, this.position));
    else if (t === "!" && n === "=")
      this.position += 2, this.tokens.push(new G("OPERATOR", "!=", e, this.position));
    else if (t === "<" && n === "=")
      this.position += 2, this.tokens.push(new G("OPERATOR", "<=", e, this.position));
    else if (t === ">" && n === "=")
      this.position += 2, this.tokens.push(new G("OPERATOR", ">=", e, this.position));
    else if (t === "&" && n === "&")
      this.position += 2, this.tokens.push(new G("OPERATOR", "&&", e, this.position));
    else if (t === "|" && n === "|")
      this.position += 2, this.tokens.push(new G("OPERATOR", "||", e, this.position));
    else if (t === "+" && n === "+")
      this.position += 2, this.tokens.push(new G("OPERATOR", "++", e, this.position));
    else if (t === "-" && n === "-")
      this.position += 2, this.tokens.push(new G("OPERATOR", "--", e, this.position));
    else {
      this.position++;
      const s = "()[]{},.;:?".includes(t) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new G(s, t, e, this.position));
    }
  }
}, rd = class {
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
      const a = this.parseExpression();
      if (e.push({
        type: "Property",
        key: t,
        value: a,
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
        const a = n;
        for (let s = 1; s < e.length; s++)
          if (this.check(a, e[s]))
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
}, od = class {
  evaluate({ node: e, scope: t = {}, context: n = null, forceBindingRootScopeToFunctions: a = !0 }) {
    switch (e.type) {
      case "Literal":
        return e.value;
      case "Identifier":
        if (e.name in t) {
          const g = t[e.name];
          return this.checkForDangerousValues(g), typeof g == "function" ? g.bind(t) : g;
        }
        throw new Error(`Undefined variable: ${e.name}`);
      case "MemberExpression":
        const s = this.evaluate({ node: e.object, scope: t, context: n, forceBindingRootScopeToFunctions: a });
        if (s == null)
          throw new Error("Cannot read property of null or undefined");
        let i;
        e.computed ? i = this.evaluate({ node: e.property, scope: t, context: n, forceBindingRootScopeToFunctions: a }) : i = e.property.name, this.checkForDangerousKeywords(i);
        let r = s[i];
        return this.checkForDangerousValues(r), typeof r == "function" ? a ? r.bind(t) : r.bind(s) : r;
      case "CallExpression":
        const o = e.arguments.map((g) => this.evaluate({ node: g, scope: t, context: n, forceBindingRootScopeToFunctions: a }));
        let l;
        if (e.callee.type === "MemberExpression") {
          const g = this.evaluate({ node: e.callee.object, scope: t, context: n, forceBindingRootScopeToFunctions: a });
          let S;
          e.callee.computed ? S = this.evaluate({ node: e.callee.property, scope: t, context: n, forceBindingRootScopeToFunctions: a }) : S = e.callee.property.name, this.checkForDangerousKeywords(S);
          let L = g[S];
          if (typeof L != "function")
            throw new Error("Value is not a function");
          l = L.apply(g, o);
        } else if (e.callee.type === "Identifier") {
          const g = e.callee.name;
          let S;
          if (g in t)
            S = t[g];
          else
            throw new Error(`Undefined variable: ${g}`);
          if (typeof S != "function")
            throw new Error("Value is not a function");
          const L = n !== null ? n : t;
          l = S.apply(L, o);
        } else {
          const g = this.evaluate({ node: e.callee, scope: t, context: n, forceBindingRootScopeToFunctions: a });
          if (typeof g != "function")
            throw new Error("Value is not a function");
          l = g.apply(n, o);
        }
        return this.checkForDangerousValues(l), l;
      case "UnaryExpression":
        const d = this.evaluate({ node: e.argument, scope: t, context: n, forceBindingRootScopeToFunctions: a });
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
          const g = e.argument.name;
          if (!(g in t))
            throw new Error(`Undefined variable: ${g}`);
          const S = t[g];
          return e.operator === "++" ? t[g] = S + 1 : e.operator === "--" && (t[g] = S - 1), e.prefix ? t[g] : S;
        } else if (e.argument.type === "MemberExpression") {
          const g = this.evaluate({ node: e.argument.object, scope: t, context: n, forceBindingRootScopeToFunctions: a }), S = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: n, forceBindingRootScopeToFunctions: a }) : e.argument.property.name;
          if (this.isDOMObject(g))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          this.checkForDangerousKeywords(S);
          const L = g[S];
          return e.operator === "++" ? g[S] = L + 1 : e.operator === "--" && (g[S] = L - 1), e.prefix ? g[S] : L;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const u = this.evaluate({ node: e.left, scope: t, context: n, forceBindingRootScopeToFunctions: a }), h = () => this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: a });
        if (e.operator === "&&")
          return u && h();
        if (e.operator === "||")
          return u || h();
        const p = h();
        switch (e.operator) {
          case "+":
            return u + p;
          case "-":
            return u - p;
          case "*":
            return u * p;
          case "/":
            return u / p;
          case "%":
            return u % p;
          case "==":
            return u == p;
          case "!=":
            return u != p;
          case "===":
            return u === p;
          case "!==":
            return u !== p;
          case "<":
            return u < p;
          case ">":
            return u > p;
          case "<=":
            return u <= p;
          case ">=":
            return u >= p;
          default:
            throw new Error(`Unknown binary operator: ${e.operator}`);
        }
      case "ConditionalExpression":
        return this.evaluate({ node: e.test, scope: t, context: n, forceBindingRootScopeToFunctions: a }) ? this.evaluate({ node: e.consequent, scope: t, context: n, forceBindingRootScopeToFunctions: a }) : this.evaluate({ node: e.alternate, scope: t, context: n, forceBindingRootScopeToFunctions: a });
      case "AssignmentExpression":
        const C = this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: a });
        if (e.left.type === "Identifier")
          return t[e.left.name] = C, C;
        if (e.left.type === "MemberExpression") {
          const g = this.evaluate({ node: e.left.object, scope: t, context: n, forceBindingRootScopeToFunctions: a }), S = e.left.computed ? this.evaluate({ node: e.left.property, scope: t, context: n, forceBindingRootScopeToFunctions: a }) : e.left.property.name;
          if (this.isDOMObject(g))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          return this.checkForDangerousKeywords(S), g[S] = C, C;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((g) => this.evaluate({ node: g, scope: t, context: n, forceBindingRootScopeToFunctions: a }));
      case "ObjectExpression":
        const m = {};
        for (const g of e.properties) {
          const S = g.computed ? this.evaluate({ node: g.key, scope: t, context: n, forceBindingRootScopeToFunctions: a }) : g.key.type === "Identifier" ? g.key.name : this.evaluate({ node: g.key, scope: t, context: n, forceBindingRootScopeToFunctions: a }), L = this.evaluate({ node: g.value, scope: t, context: n, forceBindingRootScopeToFunctions: a });
          m[S] = L;
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
    if (e !== null && !(typeof e != "object" && typeof e != "function") && !ks.has(e)) {
      if (e instanceof HTMLIFrameElement || e instanceof HTMLScriptElement)
        throw new Error("Accessing iframes and scripts is prohibited in the CSP build");
      if (Ki.has(e))
        throw new Error("Accessing global variables is prohibited in the CSP build");
      return ks.set(e, !0), !0;
    }
  }
};
function Ji(e) {
  try {
    const n = new id(e).tokenize(), s = new rd(n).parse(), i = new od();
    return function(r = {}) {
      const { scope: o = {}, context: l = null, forceBindingRootScopeToFunctions: d = !1 } = r;
      return i.evaluate({ node: s, scope: o, context: l, forceBindingRootScopeToFunctions: d });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function ld(e, t, n = {}) {
  let a = Xi(e), s = Fe([n.scope ?? {}, ...a]), i = n.params ?? [], o = Ji(t)({
    scope: s,
    forceBindingRootScopeToFunctions: !0
  });
  return typeof o == "function" && De ? o.apply(s, i) : o;
}
function dd(e, t) {
  let n = Xi(e);
  if (typeof t == "function")
    return hl(n, t);
  let a = cd(e, t, n);
  return ol.bind(null, e, t, a);
}
function Xi(e) {
  let t = {};
  return on(t, e), [t, ...rt(e)];
}
function cd(e, t, n) {
  if (e instanceof HTMLIFrameElement)
    throw new Error("Evaluating expressions on an iframe is prohibited in the CSP build");
  if (e instanceof HTMLScriptElement)
    throw new Error("Evaluating expressions on a script is prohibited in the CSP build");
  return (a = () => {
  }, { scope: s = {}, params: i = [] } = {}) => {
    let r = Fe([s, ...n]), l = Ji(t)({
      scope: r,
      forceBindingRootScopeToFunctions: !0
    });
    if (De && typeof l == "function") {
      let d = l.apply(l, i);
      d instanceof Promise ? d.then((u) => a(u)) : a(d);
    } else typeof l == "object" && l instanceof Promise ? l.then((d) => a(d)) : a(l);
  };
}
function ud(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(","))
    t[n] = 1;
  return (n) => n in t;
}
var At = Object.assign, hd = Object.prototype.hasOwnProperty, ca = (e, t) => hd.call(e, t), Tt = Array.isArray, xt = (e) => Zi(e) === "[object Map]", pd = (e) => typeof e == "string", Rt = (e) => typeof e == "symbol", Ot = (e) => e !== null && typeof e == "object", fd = Object.prototype.toString, Zi = (e) => fd.call(e), Yi = (e) => Zi(e).slice(8, -1), qa = (e) => pd(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, bd = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, gd = bd((e) => e.charAt(0).toUpperCase() + e.slice(1)), Re = (e, t) => !Object.is(e, t);
function We(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var R, jn = /* @__PURE__ */ new WeakSet(), Es = class {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, jn.has(this) && (jn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || md(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ss(this), er(this);
    const e = R, t = ie;
    R = this, ie = !0;
    try {
      return this.fn();
    } finally {
      R !== this && We(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), tr(this), R = e, ie = t, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Ba(e);
      this.deps = this.depsTail = void 0, Ss(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? jn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ua(this) && this.run();
  }
  get dirty() {
    return ua(this);
  }
}, Qi = 0, _t, kt;
function md(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = kt, kt = e;
    return;
  }
  e.next = _t, _t = e;
}
function ja() {
  Qi++;
}
function Ua() {
  if (--Qi > 0)
    return;
  if (kt) {
    let t = kt;
    for (kt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; _t; ) {
    let t = _t;
    for (_t = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (a) {
          e || (e = a);
        }
      t = n;
    }
  }
  if (e)
    throw e;
}
function er(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function tr(e) {
  let t, n = e.depsTail, a = n;
  for (; a; ) {
    const s = a.prevDep;
    a.version === -1 ? (a === n && (n = s), Ba(a), vd(a)) : t = a, a.dep.activeLink = a.prevActiveLink, a.prevActiveLink = void 0, a = s;
  }
  e.deps = t, e.depsTail = n;
}
function ua(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (yd(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function yd(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === cn) || (e.globalVersion = cn, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ua(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = R, a = ie;
  R = e, ie = !0;
  try {
    er(e);
    const s = e.fn(e._value);
    (t.version === 0 || Re(s, e._value)) && (e.flags |= 128, e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    R = n, ie = a, tr(e), e.flags &= -3;
  }
}
function Ba(e, t = !1) {
  const { dep: n, prevSub: a, nextSub: s } = e;
  if (a && (a.nextSub = s, e.prevSub = void 0), s && (s.prevSub = a, e.nextSub = void 0), n.subsHead === e && (n.subsHead = s), n.subs === e && (n.subs = a, !a && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      Ba(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function vd(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function wd(e, t) {
  e.effect instanceof Es && (e = e.effect.fn);
  const n = new Es(e);
  t && At(n, t);
  try {
    n.run();
  } catch (s) {
    throw n.stop(), s;
  }
  const a = n.run.bind(n);
  return a.effect = n, a;
}
function xd(e) {
  e.effect.stop();
}
var ie = !0, nr = [];
function _d() {
  nr.push(ie), ie = !1;
}
function kd() {
  const e = nr.pop();
  ie = e === void 0 ? !0 : e;
}
function Ss(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = R;
    R = void 0;
    try {
      t();
    } finally {
      R = n;
    }
  }
}
var cn = 0, Ed = class {
  constructor(e, t) {
    this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, Sd = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(e) {
    if (!R || !ie || R === this.computed)
      return;
    let t = this.activeLink;
    if (t === void 0 || t.sub !== R)
      t = this.activeLink = new Ed(R, this), R.deps ? (t.prevDep = R.depsTail, R.depsTail.nextDep = t, R.depsTail = t) : R.deps = R.depsTail = t, ar(t);
    else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
      const n = t.nextDep;
      n.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = n), t.prevDep = R.depsTail, t.nextDep = void 0, R.depsTail.nextDep = t, R.depsTail = t, R.deps === t && (R.deps = n);
    }
    return R.onTrack && R.onTrack(
      At(
        {
          effect: R
        },
        e
      )
    ), t;
  }
  trigger(e) {
    this.version++, cn++, this.notify(e);
  }
  notify(e) {
    ja();
    try {
      for (let t = this.subsHead; t; t = t.nextSub)
        t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(
          At(
            {
              effect: t.sub
            },
            e
          )
        );
      for (let t = this.subs; t; t = t.prevSub)
        t.sub.notify() && t.sub.dep.notify();
    } finally {
      Ua();
    }
  }
};
function ar(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let a = t.deps; a; a = a.nextDep)
        ar(a);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
var ha = /* @__PURE__ */ new WeakMap(), je = /* @__PURE__ */ Symbol(
  "Object iterate"
), pa = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), Ct = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function Q(e, t, n) {
  if (ie && R) {
    let a = ha.get(e);
    a || ha.set(e, a = /* @__PURE__ */ new Map());
    let s = a.get(n);
    s || (a.set(n, s = new Sd()), s.map = a, s.key = n), s.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function Ae(e, t, n, a, s, i) {
  const r = ha.get(e);
  if (!r) {
    cn++;
    return;
  }
  const o = (l) => {
    l && l.trigger({
      target: e,
      type: t,
      key: n,
      newValue: a,
      oldValue: s,
      oldTarget: i
    });
  };
  if (ja(), t === "clear")
    r.forEach(o);
  else {
    const l = Tt(e), d = l && qa(n);
    if (l && n === "length") {
      const u = Number(a);
      r.forEach((h, p) => {
        (p === "length" || p === Ct || !Rt(p) && p >= u) && o(h);
      });
    } else
      switch ((n !== void 0 || r.has(void 0)) && o(r.get(n)), d && o(r.get(Ct)), t) {
        case "add":
          l ? d && o(r.get("length")) : (o(r.get(je)), xt(e) && o(r.get(pa)));
          break;
        case "delete":
          l || (o(r.get(je)), xt(e) && o(r.get(pa)));
          break;
        case "set":
          xt(e) && o(r.get(je));
          break;
      }
  }
  Ua();
}
function nt(e) {
  const t = P(e);
  return t === e ? t : (Q(t, "iterate", Ct), ze(e) ? t : t.map(Ve));
}
function Fa(e) {
  return Q(e = P(e), "iterate", Ct), e;
}
function ce(e, t) {
  return Ge(e) ? cr(e) ? Mt(Ve(t)) : Mt(t) : Ve(t);
}
var Ad = {
  __proto__: null,
  [Symbol.iterator]() {
    return Un(this, Symbol.iterator, (e) => ce(this, e));
  },
  concat(...e) {
    return nt(this).concat(
      ...e.map((t) => Tt(t) ? nt(t) : t)
    );
  },
  entries() {
    return Un(this, "entries", (e) => (e[1] = ce(this, e[1]), e));
  },
  every(e, t) {
    return be(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return be(
      this,
      "filter",
      e,
      t,
      (n) => n.map((a) => ce(this, a)),
      arguments
    );
  },
  find(e, t) {
    return be(
      this,
      "find",
      e,
      t,
      (n) => ce(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return be(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return be(
      this,
      "findLast",
      e,
      t,
      (n) => ce(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return be(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return be(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Bn(this, "includes", e);
  },
  indexOf(...e) {
    return Bn(this, "indexOf", e);
  },
  join(e) {
    return nt(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Bn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return be(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return gt(this, "pop");
  },
  push(...e) {
    return gt(this, "push", e);
  },
  reduce(e, ...t) {
    return As(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return As(this, "reduceRight", e, t);
  },
  shift() {
    return gt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return be(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return gt(this, "splice", e);
  },
  toReversed() {
    return nt(this).toReversed();
  },
  toSorted(e) {
    return nt(this).toSorted(e);
  },
  toSpliced(...e) {
    return nt(this).toSpliced(...e);
  },
  unshift(...e) {
    return gt(this, "unshift", e);
  },
  values() {
    return Un(this, "values", (e) => ce(this, e));
  }
};
function Un(e, t, n) {
  const a = Fa(e), s = a[t]();
  return a !== e && !ze(e) && (s._next = s.next, s.next = () => {
    const i = s._next();
    return i.done || (i.value = n(i.value)), i;
  }), s;
}
var Td = Array.prototype;
function be(e, t, n, a, s, i) {
  const r = Fa(e), o = r !== e && !ze(e), l = r[t];
  if (l !== Td[t]) {
    const h = l.apply(e, i);
    return o ? Ve(h) : h;
  }
  let d = n;
  r !== e && (o ? d = function(h, p) {
    return n.call(this, ce(e, h), p, e);
  } : n.length > 2 && (d = function(h, p) {
    return n.call(this, h, p, e);
  }));
  const u = l.call(r, d, a);
  return o && s ? s(u) : u;
}
function As(e, t, n, a) {
  const s = Fa(e), i = s !== e && !ze(e);
  let r = n, o = !1;
  s !== e && (i ? (o = a.length === 0, r = function(d, u, h) {
    return o && (o = !1, d = ce(e, d)), n.call(this, d, ce(e, u), h, e);
  }) : n.length > 3 && (r = function(d, u, h) {
    return n.call(this, d, u, h, e);
  }));
  const l = s[t](r, ...a);
  return o ? ce(e, l) : l;
}
function Bn(e, t, n) {
  const a = P(e);
  Q(a, "iterate", Ct);
  const s = a[t](...n);
  return (s === -1 || s === !1) && Bd(n[0]) ? (n[0] = P(n[0]), a[t](...n)) : s;
}
function gt(e, t, n = []) {
  _d(), ja();
  const a = P(e)[t].apply(e, n);
  return Ua(), kd(), a;
}
var Od = /* @__PURE__ */ ud("__proto__,__v_isRef,__isVue"), sr = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Rt)
);
function Cd(e) {
  Rt(e) || (e = String(e));
  const t = P(this);
  return Q(t, "has", e), t.hasOwnProperty(e);
}
var ir = class {
  constructor(e = !1, t = !1) {
    this._isReadonly = e, this._isShallow = t;
  }
  get(e, t, n) {
    if (t === "__v_skip")
      return e.__v_skip;
    const a = this._isReadonly, s = this._isShallow;
    if (t === "__v_isReactive")
      return !a;
    if (t === "__v_isReadonly")
      return a;
    if (t === "__v_isShallow")
      return s;
    if (t === "__v_raw")
      return n === (a ? s ? jd : lr : s ? qd : or).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const i = Tt(e);
    if (!a) {
      let o;
      if (i && (o = Ad[t]))
        return o;
      if (t === "hasOwnProperty")
        return Cd;
    }
    const r = Reflect.get(
      e,
      t,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      Et(e) ? e : n
    );
    if ((Rt(t) ? sr.has(t) : Od(t)) || (a || Q(e, "get", t), s))
      return r;
    if (Et(r)) {
      const o = i && qa(t) ? r : r.value;
      return a && Ot(o) ? fa(o) : o;
    }
    return Ot(r) ? a ? fa(r) : Ha(r) : r;
  }
}, Md = class extends ir {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, t, n, a) {
    let s = e[t];
    const i = Tt(e) && qa(t);
    if (!this._isShallow) {
      const l = Ge(s);
      if (!ze(n) && !Ge(n) && (s = P(s), n = P(n)), !i && Et(s) && !Et(n))
        return l ? (We(
          `Set operation on key "${String(t)}" failed: target is readonly.`,
          e[t]
        ), !0) : (s.value = n, !0);
    }
    const r = i ? Number(t) < e.length : ca(e, t), o = Reflect.set(
      e,
      t,
      n,
      Et(e) ? e : a
    );
    return e === P(a) && o && (r ? Re(n, s) && Ae(e, "set", t, n, s) : Ae(e, "add", t, n)), o;
  }
  deleteProperty(e, t) {
    const n = ca(e, t), a = e[t], s = Reflect.deleteProperty(e, t);
    return s && n && Ae(e, "delete", t, void 0, a), s;
  }
  has(e, t) {
    const n = Reflect.has(e, t);
    return (!Rt(t) || !sr.has(t)) && Q(e, "has", t), n;
  }
  ownKeys(e) {
    return Q(
      e,
      "iterate",
      Tt(e) ? "length" : je
    ), Reflect.ownKeys(e);
  }
}, Nd = class extends ir {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, t) {
    return We(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, t) {
    return We(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, Ld = /* @__PURE__ */ new Md(), $d = /* @__PURE__ */ new Nd(), Kt = (e) => Reflect.getPrototypeOf(e);
function Rd(e, t, n) {
  return function(...a) {
    const s = this.__v_raw, i = P(s), r = xt(i), o = e === "entries" || e === Symbol.iterator && r, l = e === "keys" && r, d = s[e](...a), u = t ? Mt : Ve;
    return !t && Q(
      i,
      "iterate",
      l ? pa : je
    ), At(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: h, done: p } = d.next();
          return p ? { value: h, done: p } : {
            value: o ? [u(h[0]), u(h[1])] : u(h),
            done: p
          };
        }
      }
    );
  };
}
function Jt(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      We(
        `${gd(e)} operation ${n}failed: target is readonly.`,
        P(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Pd(e, t) {
  const n = {
    get(s) {
      const i = this.__v_raw, r = P(i), o = P(s);
      e || (Re(s, o) && Q(r, "get", s), Q(r, "get", o));
      const { has: l } = Kt(r), d = e ? Mt : Ve;
      if (l.call(r, s))
        return d(i.get(s));
      if (l.call(r, o))
        return d(i.get(o));
      i !== r && i.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && Q(P(s), "iterate", je), s.size;
    },
    has(s) {
      const i = this.__v_raw, r = P(i), o = P(s);
      return e || (Re(s, o) && Q(r, "has", s), Q(r, "has", o)), s === o ? i.has(s) : i.has(s) || i.has(o);
    },
    forEach(s, i) {
      const r = this, o = r.__v_raw, l = P(o), d = e ? Mt : Ve;
      return !e && Q(l, "iterate", je), o.forEach((u, h) => s.call(i, d(u), d(h), r));
    }
  };
  return At(
    n,
    e ? {
      add: Jt("add"),
      set: Jt("set"),
      delete: Jt("delete"),
      clear: Jt("clear")
    } : {
      add(s) {
        const i = P(this), r = Kt(i), o = P(s), l = !ze(s) && !Ge(s) ? o : s;
        return r.has.call(i, l) || Re(s, l) && r.has.call(i, s) || Re(o, l) && r.has.call(i, o) || (i.add(l), Ae(i, "add", l, l)), this;
      },
      set(s, i) {
        !ze(i) && !Ge(i) && (i = P(i));
        const r = P(this), { has: o, get: l } = Kt(r);
        let d = o.call(r, s);
        d ? Ts(r, o, s) : (s = P(s), d = o.call(r, s));
        const u = l.call(r, s);
        return r.set(s, i), d ? Re(i, u) && Ae(r, "set", s, i, u) : Ae(r, "add", s, i), this;
      },
      delete(s) {
        const i = P(this), { has: r, get: o } = Kt(i);
        let l = r.call(i, s);
        l ? Ts(i, r, s) : (s = P(s), l = r.call(i, s));
        const d = o ? o.call(i, s) : void 0, u = i.delete(s);
        return l && Ae(i, "delete", s, void 0, d), u;
      },
      clear() {
        const s = P(this), i = s.size !== 0, r = xt(s) ? new Map(s) : new Set(s), o = s.clear();
        return i && Ae(
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
    n[s] = Rd(s, e);
  }), n;
}
function rr(e, t) {
  const n = Pd(e);
  return (a, s, i) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? a : Reflect.get(
    ca(n, s) && s in a ? n : a,
    s,
    i
  );
}
var Id = {
  get: /* @__PURE__ */ rr(!1)
}, Dd = {
  get: /* @__PURE__ */ rr(!0)
};
function Ts(e, t, n) {
  const a = P(n);
  if (a !== n && t.call(e, a)) {
    const s = Yi(e);
    We(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var or = /* @__PURE__ */ new WeakMap(), qd = /* @__PURE__ */ new WeakMap(), lr = /* @__PURE__ */ new WeakMap(), jd = /* @__PURE__ */ new WeakMap();
function Ud(e) {
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
function Ha(e) {
  return /* @__PURE__ */ Ge(e) ? e : dr(
    e,
    !1,
    Ld,
    Id,
    or
  );
}
function fa(e) {
  return dr(
    e,
    !0,
    $d,
    Dd,
    lr
  );
}
function dr(e, t, n, a, s) {
  if (!Ot(e))
    return We(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = s.get(e);
  if (i)
    return i;
  const r = Ud(Yi(e));
  if (r === 0)
    return e;
  const o = new Proxy(
    e,
    r === 2 ? a : n
  );
  return s.set(e, o), o;
}
function cr(e) {
  return /* @__PURE__ */ Ge(e) ? /* @__PURE__ */ cr(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Ge(e) {
  return !!(e && e.__v_isReadonly);
}
function ze(e) {
  return !!(e && e.__v_isShallow);
}
function Bd(e) {
  return e ? !!e.__v_raw : !1;
}
function P(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ P(t) : e;
}
var Ve = (e) => Ot(e) ? /* @__PURE__ */ Ha(e) : e, Mt = (e) => Ot(e) ? /* @__PURE__ */ fa(e) : e;
function Et(e) {
  return e ? e.__v_isRef === !0 : !1;
}
re("nextTick", () => Ra);
re("dispatch", (e) => wt.bind(wt, e));
re("watch", (e, { evaluateLater: t, cleanup: n }) => (a, s) => {
  let i = t(a), o = si(() => {
    let l;
    return i((d) => l = d), l;
  }, s);
  n(o);
});
re("store", Ql);
re("data", (e) => hi(e));
re("root", (e) => vn(e));
re("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Fe(Fd(e))), e._x_refs_proxy));
function Fd(e) {
  let t = [];
  return ve(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var Fn = {};
function ur(e) {
  return Fn[e] || (Fn[e] = 0), ++Fn[e];
}
function Hd(e, t) {
  return ve(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Wd(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = ur(t));
}
re("id", (e, { cleanup: t }) => (n, a = null) => {
  let s = `${n}${a ? `-${a}` : ""}`;
  return Gd(e, s, t, () => {
    let i = Hd(e, n), r = i ? i._x_ids[n] : ur(n);
    return a ? `${n}-${r}-${a}` : `${n}-${r}`;
  });
});
xn((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Gd(e, t, n, a) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let s = a();
  return e._x_id[t] = s, n(() => {
    delete e._x_id[t];
  }), s;
}
re("el", (e) => e);
hr("Focus", "focus", "focus");
hr("Persist", "persist", "persist");
function hr(e, t, n) {
  re(t, (a) => ue(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, a));
}
F("modelable", (e, { expression: t }, { effect: n, evaluateLater: a, cleanup: s }) => {
  let i = a(t), r = () => {
    let u;
    return i((h) => u = h), u;
  }, o = a(`${t} = __placeholder`), l = (u) => o(() => {
  }, { scope: { __placeholder: u } }), d = r();
  l(d), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, h = e._x_model.setWithModifiers, p = Wi(
      {
        get() {
          return u();
        },
        set(w) {
          h(w);
        }
      },
      {
        get() {
          return r();
        },
        set(w) {
          l(w);
        }
      }
    );
    s(p);
  });
});
F("teleport", (e, { modifiers: t, expression: n }, { cleanup: a }) => {
  e.tagName.toLowerCase() !== "template" && ue("x-teleport can only be used on a <template> tag", e);
  let s = Os(n), i = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = i, i._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), i.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    i.addEventListener(o, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), $t(i, {}, e);
  let r = (o, l, d) => {
    d.includes("prepend") ? l.parentNode.insertBefore(o, l) : d.includes("append") ? l.parentNode.insertBefore(o, l.nextSibling) : l.appendChild(o);
  };
  B(() => {
    Oe(() => {
      r(i, s, t), we(i);
    })();
  }), e._x_teleportPutBack = () => {
    let o = Os(n);
    B(() => {
      r(e._x_teleport, o, t);
    });
  }, a(
    () => B(() => {
      i.remove(), Ze(i);
    })
  );
});
var zd = document.createElement("div");
function Os(e) {
  let t = Oe(() => document.querySelector(e), () => zd)();
  return t || ue(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var pr = () => {
};
pr.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
F("ignore", pr);
F("effect", Oe((e, { expression: t }, { effect: n }) => {
  n(Y(e, t));
}));
function st(e, t, n, a) {
  let s = e, i = (l) => a(l), r = {}, o = (l, d) => (u) => d(l, u);
  return n.includes("dot") && (t = Vd(t)), n.includes("camel") && (t = Kd(t)), n.includes("capture") && (r.capture = !0), n.includes("window") && (s = window), n.includes("document") && (s = document), n.includes("passive") && (r.passive = n[n.indexOf("passive") + 1] !== "false"), i = fr(n, i), n.includes("prevent") && (i = o(i, (l, d) => {
    d.preventDefault(), l(d);
  })), n.includes("stop") && (i = o(i, (l, d) => {
    d.stopPropagation(), l(d);
  })), n.includes("once") && (i = o(i, (l, d) => {
    l(d), s.removeEventListener(t, i, r);
  })), (n.includes("away") || n.includes("outside")) && (s = document, i = o(i, (l, d) => {
    e.contains(d.target) || d.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && l(d));
  })), n.includes("self") && (i = o(i, (l, d) => {
    d.target === e && l(d);
  })), t === "submit" && (i = o(i, (l, d) => {
    d.target._x_pendingModelUpdates && d.target._x_pendingModelUpdates.forEach((u) => u()), l(d);
  })), (Xd(t) || br(t)) && (i = o(i, (l, d) => {
    Zd(d, n) || l(d);
  })), s.addEventListener(t, i, r), () => {
    s.removeEventListener(t, i, r);
  };
}
function fr(e, t) {
  if (e.includes("debounce")) {
    let n = e[e.indexOf("debounce") + 1] || "invalid-wait", a = un(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Fi(t, a);
  }
  if (e.includes("throttle")) {
    let n = e[e.indexOf("throttle") + 1] || "invalid-wait", a = un(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Hi(t, a);
  }
  return t;
}
function Vd(e) {
  return e.replace(/-/g, ".");
}
function Kd(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function un(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Jd(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Xd(e) {
  return ["keydown", "keyup"].includes(e);
}
function br(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function Zd(e, t) {
  let n = t.filter((i) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(i));
  if (n.includes("debounce")) {
    let i = n.indexOf("debounce");
    n.splice(i, un((n[i + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let i = n.indexOf("throttle");
    n.splice(i, un((n[i + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Cs(e.key).includes(n[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((i) => n.includes(i));
  return n = n.filter((i) => !s.includes(i)), !(s.length > 0 && s.filter((r) => ((r === "cmd" || r === "super") && (r = "meta"), e[`${r}Key`])).length === s.length && (br(e.type) || Cs(e.key).includes(n[0])));
}
function Cs(e) {
  if (!e)
    return [];
  e = Jd(e);
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
F("model", (e, { modifiers: t, expression: n }, { effect: a, cleanup: s }) => {
  let i = e;
  t.includes("parent") && (i = ve(e, (m) => m !== e));
  let r = Y(i, n), o;
  typeof n == "string" ? o = Y(i, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = Y(i, `${n()} = __placeholder`) : o = () => {
  };
  let l = () => {
    let m;
    return r((g) => m = g), Ms(m) ? m.get() : m;
  }, d = (m) => {
    let g;
    r((S) => g = S), Ms(g) ? g.set(m) : o(() => {
    }, {
      scope: { __placeholder: m }
    });
  };
  typeof n == "string" && e.type === "radio" && B(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = t.includes("change") || t.includes("lazy"), h = t.includes("blur"), p = t.includes("enter"), w = u || h || p, C;
  if (Te)
    C = () => {
    };
  else if (w) {
    let m = [], g = (S) => d(Xt(e, t, S, l()));
    if (u && m.push(st(e, "change", t, g)), h && (m.push(st(e, "blur", t, g)), e.form)) {
      let S = e.form, L = () => g({ target: e });
      S._x_pendingModelUpdates || (S._x_pendingModelUpdates = []), S._x_pendingModelUpdates.push(L), s(() => {
        S._x_pendingModelUpdates && S._x_pendingModelUpdates.splice(S._x_pendingModelUpdates.indexOf(L), 1);
      });
    }
    p && m.push(st(e, "keydown", t, (S) => {
      S.key === "Enter" && g(S);
    })), C = () => m.forEach((S) => S());
  } else {
    let m = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    C = st(e, m, t, (g) => {
      d(Xt(e, t, g, l()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || dn(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && d(
    Xt(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = C, s(() => e._x_removeModelListeners.default()), e.form) {
    let m = st(e.form, "reset", [], (g) => {
      Ra(() => e._x_model && e._x_model.set(Xt(e, t, { target: e }, l())));
    });
    s(() => m());
  }
  if (e._x_model = {
    get() {
      return l();
    },
    set(m) {
      d(m);
    },
    setWithModifiers: fr(t, d)
  }, e._x_forceModelUpdate = (m) => {
    m === void 0 && typeof n == "string" && n.match(/\./) && (m = ""), B(() => {
      dn(e) ? Array.isArray(m) ? e.checked = m.some((g) => g == e.value) : e.checked = !!m : Da(e) ? typeof m == "boolean" ? e.checked = tn(e.value) === m : e.checked = e.value == m : ji(e, "value", m);
    });
  }, e.tagName === "SELECT") {
    let m = new MutationObserver(() => {
      e._x_forceModelUpdate(l());
    });
    m.observe(e, { childList: !0 }), s(() => m.disconnect());
  }
  a(() => {
    let m = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(m);
  });
});
function Xt(e, t, n, a) {
  return B(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (dn(e))
      if (Array.isArray(a)) {
        let s = null;
        return t.includes("number") ? s = Hn(n.target.value) : t.includes("boolean") ? s = tn(n.target.value) : s = n.target.value, n.target.checked ? a.includes(s) ? a : a.concat([s]) : a.filter((i) => !Yd(i, s));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((s) => {
          let i = s.value || s.text;
          return Hn(i);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((s) => {
          let i = s.value || s.text;
          return tn(i);
        }) : Array.from(n.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return Da(e) ? n.target.checked ? s = n.target.value : s = a : s = n.target.value, t.includes("number") ? Hn(s) : t.includes("boolean") ? tn(s) : t.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function Hn(e) {
  let t = e ? parseFloat(e) : null;
  return Qd(t) ? t : e;
}
function Yd(e, t) {
  return e == t;
}
function Qd(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ms(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
F("cloak", (e) => queueMicrotask(() => B(() => e.removeAttribute(ct("cloak")))));
$i(() => `[${ct("init")}]`);
F("init", Oe((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
F("text", (e, { expression: t }, { effect: n, evaluateLater: a }) => {
  let s = a(t);
  n(() => {
    s((i) => {
      B(() => {
        e.textContent = i;
      });
    });
  });
});
F("html", (e, { expression: t }, { effect: n, evaluateLater: a }) => {
  let s = a(t);
  n(() => {
    s((i) => {
      B(() => {
        Array.from(e.children).forEach((r) => Ze(r)), e.innerHTML = i ?? "", e._x_ignoreSelf = !0, we(e), delete e._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
Na(ki(":", Ei(ct("bind:"))));
var gr = (e, { value: t, modifiers: n, expression: a, original: s }, { effect: i, cleanup: r }) => {
  if (!t) {
    let l = {};
    td(l), Y(e, a)((u) => {
      zi(e, u, s);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return ec(e, a);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = Y(e, a);
  i(() => o((l) => {
    l === void 0 && typeof a == "string" && a.match(/\./) && (l = ""), B(() => ji(e, t, l, n));
  })), r(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
gr.inline = (e, { value: t, modifiers: n, expression: a }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: a, extract: !1 });
};
F("bind", gr);
function ec(e, t) {
  e._x_keyExpression = t;
}
Li(() => `[${ct("data")}]`);
var $e = /* @__PURE__ */ Symbol();
F("data", (e, { expression: t }, { cleanup: n }) => {
  if (nc(e))
    return;
  let a = e[$e];
  if (a?.expression === t)
    return;
  t = t === "" ? "{}" : t;
  let s = {};
  on(s, e);
  let i = {};
  ad(i, s);
  let r = qe(e, t, { scope: i });
  (r === void 0 || r === !0) && (r = {}), on(r, e);
  let o;
  if (a?.reactiveData) {
    o = a.reactiveData, tc(o, r);
    let d = { expression: t };
    e[$e] = d, queueMicrotask(() => {
      e[$e] === d && delete e[$e];
    });
  } else
    o = lt(r);
  Ta(o, n);
  let l = $t(e, o);
  o.init && qe(e, o.init), n(() => {
    o.destroy && qe(e, o.destroy), l();
    let d = { reactiveData: o };
    e[$e] = d, queueMicrotask(() => {
      e[$e] === d && delete e[$e];
    });
  });
});
function tc(e, t) {
  Object.keys(t).forEach((n) => {
    let a = Object.getOwnPropertyDescriptor(t, n), s = Object.getOwnPropertyDescriptor(e, n);
    a.get || a.set || s?.get || s?.set ? (s && delete e[n], s || (e[n] = void 0), a.get || a.set ? Object.defineProperty(e, n, a) : e[n] = t[n]) : e[n] = t[n];
  }), Object.keys(e).filter((n) => !Object.prototype.hasOwnProperty.call(t, n)).forEach((n) => delete e[n]);
}
xn((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function nc(e) {
  return Te ? da ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
F("show", (e, { modifiers: t, expression: n }, { effect: a }) => {
  let s = Y(e, n);
  e._x_doHide || (e._x_doHide = () => {
    B(() => {
      e.style.setProperty("display", "none", t.includes("important") ? "important" : void 0);
    });
  }), e._x_doShow || (e._x_doShow = () => {
    B(() => {
      e.style.length === 1 && e.style.display === "none" ? e.removeAttribute("style") : e.style.removeProperty("display");
    });
  });
  let i = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, r = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, o = () => setTimeout(r), l = oa(
    (h) => h ? r() : i(),
    (h) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, h, r, i) : h ? o() : i();
    }
  ), d, u = !0;
  a(() => s((h) => {
    !u && h === d || (t.includes("immediate") && (h ? o() : i()), l(h), d = h, u = !1);
  }));
});
F("for", Oe((e, { expression: t }, { effect: n, cleanup: a }) => {
  let s = ic(t), i = Y(e, s.items), r = Y(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_lookup = /* @__PURE__ */ new Map(), n(() => sc(e, s, i, r), { priority: "structural" }), a(() => {
    e._x_lookup.forEach(
      (o) => B(() => {
        Ze(o), o.remove();
      })
    ), delete e._x_lookup, delete e._x_lastRenderedEl;
  });
}));
function ac(e) {
  return (t) => {
    Object.entries(t).forEach(([n, a]) => {
      e[n] = a;
    });
  };
}
function sc(e, t, n, a) {
  n((s) => {
    oc(s) && (s = Array.from({ length: s }, (d, u) => u + 1)), s == null && (s = []), s instanceof Set && (s = Array.from(s)), s instanceof Map && (s = Array.from(s));
    let i = e._x_lookup, r = /* @__PURE__ */ new Map();
    e._x_lookup = r;
    let o = lc(s), l = Object.entries(s).map(([d, u]) => {
      o || (d = parseInt(d));
      let h = rc(t, u, d, s), p;
      return a((w) => {
        typeof w == "object" && ue("x-for key cannot be an object, it must be a string or an integer", e), i.has(w) && (r.set(w, i.get(w)), i.delete(w)), p = w;
      }, { scope: { index: d, ...h } }), [p, h];
    });
    B(() => {
      i.forEach((h) => {
        Ze(h), h.remove();
      });
      let d = /* @__PURE__ */ new Set(), u = e;
      l.forEach(([h, p]) => {
        if (r.has(h)) {
          let m = r.get(h);
          m._x_refreshXForScope(p), u.nextElementSibling !== m && (u.nextElementSibling && m.replaceWith(u.nextElementSibling), u.after(m)), u = m, m._x_currentIfEl && (m.nextElementSibling !== m._x_currentIfEl && u.after(m._x_currentIfEl), u = m._x_currentIfEl);
          return;
        }
        e.content.children.length > 1 && ue("x-for templates require a single root element, additional elements will be ignored.", e);
        let w = document.importNode(e.content, !0).firstElementChild, C = lt(p);
        $t(w, C, e), w._x_refreshXForScope = ac(C), r.set(h, w), d.add(w), u.after(w), u = w;
      }), d.forEach((h) => we(h)), u !== e ? e._x_lastRenderedEl = u : delete e._x_lastRenderedEl;
    });
  });
}
function ic(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, a = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, s = e.match(a);
  if (!s)
    return;
  let i = {};
  i.items = s[2].trim();
  let r = s[1].replace(n, "").trim(), o = r.match(t);
  return o ? (i.item = r.replace(t, "").trim(), i.index = o[1].trim(), o[2] && (i.collection = o[2].trim())) : i.item = r, i;
}
function rc(e, t, n, a) {
  let s = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((r) => r.trim()).forEach((r, o) => {
    s[r] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((r) => r.trim()).forEach((r) => {
    s[r] = t[r];
  }) : s[e.item] = t, e.index && (s[e.index] = n), e.collection && (s[e.collection] = a), s;
}
function oc(e) {
  return typeof e != "object" && !isNaN(e);
}
function lc(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function mr() {
}
mr.inline = (e, { expression: t }, { cleanup: n }) => {
  let a = vn(e);
  a && (a._x_refs || (a._x_refs = {}), a._x_refs[t] = e, n(() => delete a._x_refs[t]));
};
F("ref", mr);
F("if", Oe((e, { expression: t }, { effect: n, cleanup: a }) => {
  e.tagName.toLowerCase() !== "template" && ue("x-if can only be used on a <template> tag", e);
  let s = Y(e, t), i = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return $t(o, {}, e), B(() => {
      e.after(o), we(o);
    }), e._x_currentIfEl = o, e._x_lastRenderedEl = o, e._x_undoIf = () => {
      B(() => {
        Ze(o), o.remove();
      }), delete e._x_currentIfEl, delete e._x_lastRenderedEl;
    }, o;
  }, r = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => s((o) => {
    o ? i() : r();
  }), { priority: "structural" }), a(() => e._x_undoIf && e._x_undoIf());
}));
F("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((s) => Wd(e, s));
});
xn((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
Na(ki("@", Ei(ct("on:"))));
F("on", Oe((e, { value: t, modifiers: n, expression: a }, { cleanup: s }) => {
  let i = a ? Y(e, a) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let r = st(e, t, n, (o) => {
    i(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  s(() => r());
}));
_n("Collapse", "collapse", "collapse");
_n("Intersect", "intersect", "intersect");
_n("Focus", "trap", "focus");
_n("Mask", "mask", "mask");
function _n(e, t, n) {
  F(t, (a) => ue(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, a));
}
F("html", (e, { expression: t }) => {
  Oa(new Error("Using the x-html directive is prohibited in the CSP build"), e);
});
ut.setEvaluator(dd);
ut.setRawEvaluator(ld);
ut.setReactivityEngine({
  reactive: Ha,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (e, t = {}) => {
    let n;
    return n = wd(e, {
      scheduler: () => {
        n && (t.scheduler ? t.scheduler(n) : n());
      }
    }), n;
  },
  release: xd,
  raw: P
});
var dc = ut, St = dc;
function cc(e) {
  const t = window.__siteationDebugBar;
  return t ? (t.onRequest = e, t.requests.slice()) : [];
}
const hn = "__siteationDebugBarHostLock";
function uc(e) {
  if (!e || window[hn]) return;
  const t = document.body, n = Math.max(0, window.innerWidth - document.documentElement.clientWidth), a = {
    overflow: t.style.overflow,
    paddingRight: t.style.paddingRight,
    inert: []
  };
  if (Array.from(t.children).forEach((s) => {
    s === e || s.contains(e) || !(s instanceof HTMLElement) || s.matches("script, style, link") || (a.inert.push([s, s.inert]), s.inert = !0);
  }), t.style.overflow = "hidden", n > 0) {
    const s = Number.parseFloat(window.getComputedStyle(t).paddingRight || "0");
    t.style.paddingRight = `${s + n}px`;
  }
  window[hn] = a;
}
function hc() {
  const e = window[hn];
  e && (e.inert.forEach(([t, n]) => {
    t.inert = n;
  }), document.body.style.overflow = e.overflow, document.body.style.paddingRight = e.paddingRight, delete window[hn]);
}
function Ns(e, t) {
  if (e.key !== "Tab" || !t) return;
  const n = Array.from(t.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((r) => r.offsetParent !== null);
  if (n.length === 0) return;
  const a = n[0], s = n[n.length - 1], i = t.getRootNode().activeElement;
  e.shiftKey && i === a ? (e.preventDefault(), s.focus()) : !e.shiftKey && i === s && (e.preventDefault(), a.focus());
}
const at = 12;
function pc(e) {
  return !!(e && typeof e == "object" && Number.isFinite(e.left) && Number.isFinite(e.top));
}
function Wn(e, t, n) {
  const a = Math.max(at, n.width - t.width - at), s = Math.max(at, n.height - t.height - at);
  return {
    left: Math.min(Math.max(e.left, at), a),
    top: Math.min(Math.max(e.top, at), s)
  };
}
function fc(e, t, n) {
  return e.top + t.height / 2 < n / 2 ? "top" : "bottom";
}
const bc = 3;
function gc(e, t) {
  return Math.hypot(e, t) >= bc;
}
function mc(e, t = []) {
  const n = String(e || "").split(",").map((i) => i.trim()).filter(Boolean), a = it.findIndex((i) => i.id === "history"), s = [...it.slice(0, a), ...t, ...it.slice(a)];
  return n.length === 0 ? s : s.filter((i) => yc.includes(i.id) || n.includes(i.id));
}
const yc = ["findings", "overview"], it = [
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
    id: "pagecache",
    label: "Page cache",
    lead: "Whether this page went into the full page cache, and if not, every reason it did not."
  },
  {
    id: "layout",
    label: "Layout",
    lead: "The layout handles this request loaded, in order, and the XML files behind each one.",
    graded: !1
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
    lead: "This page as a search engine or a link preview reads it: tags, headings, images, links and structured data."
  },
  {
    id: "datalayer",
    label: "Data layer",
    lead: "What the page pushed to window.dataLayer, which tags it loads, and the consent they were given.",
    graded: !1
  },
  {
    id: "vitals",
    label: "Web Vitals",
    lead: "How fast this page loaded, how much it moved, and how quickly it answered input, rated against Google's thresholds.",
    graded: !1
  },
  {
    id: "history",
    label: "History",
    lead: "Every request still on disk, so an earlier one is one click away.",
    graded: !1
  }
];
function yr(e, t) {
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
    case "pagecache":
      return t.pageCache.reason_count || null;
    case "layout":
      return t.layout.handle_count || null;
    case "plugins":
      return t.interception.plugin_count || null;
    case "alpine":
      return t.alpineComponents.length || null;
    case "magewire":
      return t.magewireComponents.length || null;
    case "seo":
      return t.seo.warningCount || null;
    case "datalayer":
      return t.dataLayer.warningCount || null;
    case "vitals":
      return t.vitals.poorCount || null;
    case "history":
      return t.history.length || null;
    default:
      return typeof t.extensionCount == "function" ? t.extensionCount(e) : null;
  }
}
const vc = {
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
function q(e, t = "", n = "") {
  return `<svg class="ndb-icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true" ${n}>${vc[e] || ""}</svg>`;
}
function wc(e) {
  return [...xc(e), ..._c(e), ...kc(e)];
}
function xc(e) {
  return [...it, ...e.extensions || []].map((t) => {
    const n = yr(t.id, e);
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
function _c(e) {
  const t = [
    { value: "system", label: "Follow the system theme" },
    { value: "light", label: "Use the light theme" },
    { value: "dark", label: "Use the dark theme" }
  ], n = e.currentSection || {};
  return [
    ...t.map((a) => ({
      id: `theme:${a.value}`,
      group: "Appearance",
      label: a.label,
      hint: e.theme === a.value ? "Current" : "",
      keywords: `theme ${a.value}`,
      kind: "theme",
      arg: a.value
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
function kc(e) {
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
function Ec(e, t) {
  const n = String(t || "").trim().toLowerCase(), a = n ? e.filter((s) => `${s.group} ${s.label} ${s.keywords}`.toLowerCase().includes(n)) : e;
  return a.map((s, i) => ({
    ...s,
    leads: i === 0 || a[i - 1].group !== s.group
  }));
}
function Sc() {
  return `
<div class="ndb-palette" data-ndb-bind:class="paletteOpen && 'is-open'"
     data-ndb-on:keydown="paletteKeys($event)">
  <div class="ndb-palette-backdrop" data-ndb-on:click="closePalette()"></div>

  <div class="ndb-palette-box" data-ndb-ref="palette"
       role="dialog" aria-modal="true" aria-label="Commands">
    <div class="ndb-palette-field">
      ${q("search")}
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
const ot = "full", vr = "masked", ne = "none", Ac = "[redacted]", Tc = "[masked]", Oc = "[maximum depth reached]", Cc = "[circular]", Mc = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, Nc = 5, nn = 100, Ls = 400;
function Lc(e) {
  return [ot, vr, ne].includes(e) ? e : ot;
}
function $c(e) {
  return Mc.test(String(e));
}
function Pt(e, t = ot) {
  if (t !== ne)
    return Wa(e, t, 0, /* @__PURE__ */ new WeakSet());
}
function pn(e, t = ot) {
  return t === ne ? "" : t === vr ? e === "" ? "" : Tc : e.length <= Ls ? e : `${e.slice(0, Ls)}...`;
}
function wr(e, t = ot) {
  if (t === ne) return "";
  const n = e.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return pn(n, ot);
}
function Wa(e, t, n, a) {
  if (e == null) return e;
  const s = typeof e;
  return s === "string" ? pn(e, t) : s === "number" || s === "boolean" ? e : s === "function" ? `ƒ ${e.name || "anonymous"}()` : s === "symbol" ? e.toString() : s === "bigint" ? `${e}n` : s !== "object" ? s : e instanceof Node ? Ic(e) : e instanceof Date ? e.toISOString() : e instanceof Error ? `${e.name}: ${pn(e.message, t)}` : e instanceof Map ? `Map(${e.size})` : e instanceof Set ? `Set(${e.size})` : n >= Nc ? Oc : a.has(e) ? Cc : (a.add(e), Array.isArray(e) ? Rc(e, t, n, a) : Pc(e, t, n, a));
}
function Rc(e, t, n, a) {
  const s = e.slice(0, nn).map((i) => Wa(i, t, n + 1, a));
  return e.length > nn && s.push(`[${e.length - nn} more]`), s;
}
function Pc(e, t, n, a) {
  const s = kn(e), i = /* @__PURE__ */ Object.create(null);
  let r = 0;
  for (const o of s) {
    if (r >= nn) {
      i.__truncated__ = s.length - r;
      break;
    }
    if ($c(o)) {
      i[o] = Ac, r++;
      continue;
    }
    try {
      i[o] = Wa(e[o], t, n + 1, a);
    } catch (l) {
      i[o] = `[unreadable: ${l && l.message ? l.message : "threw"}]`;
    }
    r++;
  }
  return i;
}
function kn(e) {
  try {
    const t = Object.keys(e);
    return t.length > 0 ? t : Reflect.ownKeys(e).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function Ic(e) {
  if (!(e instanceof Element)) return `<${e.nodeName.toLowerCase()}>`;
  const t = e.id ? `#${e.id}` : "", n = typeof e.className == "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${e.tagName.toLowerCase()}${t}${n}>`;
}
function Dc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Gn, $s;
function qc() {
  if ($s) return Gn;
  $s = 1;
  function e(c) {
    return c instanceof Map ? c.clear = c.delete = c.set = function() {
      throw new Error("map is read-only");
    } : c instanceof Set && (c.add = c.clear = c.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(c), Object.getOwnPropertyNames(c).forEach((f) => {
      const y = c[f], T = typeof y;
      (T === "object" || T === "function") && !Object.isFrozen(y) && e(y);
    }), c;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(f) {
      f.data === void 0 && (f.data = {}), this.data = f.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(c) {
    return c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function a(c, ...f) {
    const y = /* @__PURE__ */ Object.create(null);
    for (const T in c)
      y[T] = c[T];
    return f.forEach(function(T) {
      for (const j in T)
        y[j] = T[j];
    }), /** @type {T} */
    y;
  }
  const s = "</span>", i = (c) => !!c.scope, r = (c, { prefix: f }) => {
    if (c.startsWith("language:"))
      return c.replace("language:", "language-");
    if (c.includes(".")) {
      const y = c.split(".");
      return [
        `${f}${y.shift()}`,
        ...y.map((T, j) => `${T}${"_".repeat(j + 1)}`)
      ].join(" ");
    }
    return `${f}${c}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(f, y) {
      this.buffer = "", this.classPrefix = y.classPrefix, f.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(f) {
      this.buffer += n(f);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(f) {
      if (!i(f)) return;
      const y = r(
        f.scope,
        { prefix: this.classPrefix }
      );
      this.span(y);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(f) {
      i(f) && (this.buffer += s);
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
    span(f) {
      this.buffer += `<span class="${f}">`;
    }
  }
  const l = (c = {}) => {
    const f = { children: [] };
    return Object.assign(f, c), f;
  };
  class d {
    constructor() {
      this.rootNode = l(), this.stack = [this.rootNode];
    }
    get top() {
      return this.stack[this.stack.length - 1];
    }
    get root() {
      return this.rootNode;
    }
    /** @param {Node} node */
    add(f) {
      this.top.children.push(f);
    }
    /** @param {string} scope */
    openNode(f) {
      const y = l({ scope: f });
      this.add(y), this.stack.push(y);
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
    walk(f) {
      return this.constructor._walk(f, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(f, y) {
      return typeof y == "string" ? f.addText(y) : y.children && (f.openNode(y), y.children.forEach((T) => this._walk(f, T)), f.closeNode(y)), f;
    }
    /**
     * @param {Node} node
     */
    static _collapse(f) {
      typeof f != "string" && f.children && (f.children.every((y) => typeof y == "string") ? f.children = [f.children.join("")] : f.children.forEach((y) => {
        d._collapse(y);
      }));
    }
  }
  class u extends d {
    /**
     * @param {*} options
     */
    constructor(f) {
      super(), this.options = f;
    }
    /**
     * @param {string} text
     */
    addText(f) {
      f !== "" && this.add(f);
    }
    /** @param {string} scope */
    startScope(f) {
      this.openNode(f);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(f, y) {
      const T = f.root;
      y && (T.scope = `language:${y}`), this.add(T);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function h(c) {
    return c ? typeof c == "string" ? c : c.source : null;
  }
  function p(c) {
    return m("(?=", c, ")");
  }
  function w(c) {
    return m("(?:", c, ")*");
  }
  function C(c) {
    return m("(?:", c, ")?");
  }
  function m(...c) {
    return c.map((y) => h(y)).join("");
  }
  function g(c) {
    const f = c[c.length - 1];
    return typeof f == "object" && f.constructor === Object ? (c.splice(c.length - 1, 1), f) : {};
  }
  function S(...c) {
    return "(" + (g(c).capture ? "" : "?:") + c.map((T) => h(T)).join("|") + ")";
  }
  function L(c) {
    return new RegExp(c.toString() + "|").exec("").length - 1;
  }
  function he(c, f) {
    const y = c && c.exec(f);
    return y && y.index === 0;
  }
  const pe = new RegExp(S(
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
  function Z(c, { joinWith: f }) {
    let y = 0;
    return c.map((T) => {
      y += 1;
      const j = y;
      let U = h(T), _ = "";
      for (; U.length > 0; ) {
        const x = pe.exec(U);
        if (!x) {
          _ += U;
          break;
        }
        _ += U.substring(0, x.index), U = U.substring(x.index + x[0].length), x[0][0] === "\\" && x[1] ? _ += "\\" + String(Number(x[1]) + j) : (_ += x[0], (x[0] === "(" || /^\(\?[<']/.test(x[0])) && y++);
      }
      return _;
    }).map((T) => `(${T})`).join(f);
  }
  const ee = /\b\B/, Ye = "[a-zA-Z]\\w*", _e = "[a-zA-Z_]\\w*", ae = "\\b\\d+(\\.\\d+)?", Dt = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", qt = "\\b(0b[01]+)", An = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", Tn = (c = {}) => {
    const f = /^#![ ]*\//;
    return c.binary && (c.begin = m(
      f,
      /.*\b/,
      c.binary,
      /\b.*/
    )), a({
      scope: "meta",
      begin: f,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (y, T) => {
        y.index !== 0 && T.ignoreMatch();
      }
    }, c);
  }, Ce = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, On = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [Ce]
  }, jt = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [Ce]
  }, Cn = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, K = function(c, f, y = {}) {
    const T = a(
      {
        scope: "comment",
        begin: c,
        end: f,
        contains: []
      },
      y
    );
    T.contains.push({
      scope: "doctag",
      // hack to avoid the space from being included. the space is necessary to
      // match here to prevent the plain text rule below from gobbling up doctags
      begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
      end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
      excludeBegin: !0,
      relevance: 0
    });
    const j = S(
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
    return T.contains.push(
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
          j,
          /[.]?[:]?([.][ ]|[ ])/,
          "){3}"
        )
        // look for 3 words in a row
      }
    ), T;
  }, ke = K("//", "$"), Me = K("/\\*", "\\*/"), Qe = K("#", "$"), ht = {
    scope: "number",
    begin: ae,
    relevance: 0
  }, Ut = {
    scope: "number",
    begin: Dt,
    relevance: 0
  }, Jr = {
    scope: "number",
    begin: qt,
    relevance: 0
  }, Xr = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      Ce,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [Ce]
      }
    ]
  }, Zr = {
    scope: "title",
    begin: Ye,
    relevance: 0
  }, Yr = {
    scope: "title",
    begin: _e,
    relevance: 0
  }, Qr = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + _e,
    relevance: 0
  };
  var Bt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: On,
    BACKSLASH_ESCAPE: Ce,
    BINARY_NUMBER_MODE: Jr,
    BINARY_NUMBER_RE: qt,
    COMMENT: K,
    C_BLOCK_COMMENT_MODE: Me,
    C_LINE_COMMENT_MODE: ke,
    C_NUMBER_MODE: Ut,
    C_NUMBER_RE: Dt,
    END_SAME_AS_BEGIN: function(c) {
      return Object.assign(
        c,
        {
          /** @type {ModeCallback} */
          "on:begin": (f, y) => {
            y.data._beginMatch = f[1];
          },
          /** @type {ModeCallback} */
          "on:end": (f, y) => {
            y.data._beginMatch !== f[1] && y.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: Qe,
    IDENT_RE: Ye,
    MATCH_NOTHING_RE: ee,
    METHOD_GUARD: Qr,
    NUMBER_MODE: ht,
    NUMBER_RE: ae,
    PHRASAL_WORDS_MODE: Cn,
    QUOTE_STRING_MODE: jt,
    REGEXP_MODE: Xr,
    RE_STARTERS_RE: An,
    SHEBANG: Tn,
    TITLE_MODE: Zr,
    UNDERSCORE_IDENT_RE: _e,
    UNDERSCORE_TITLE_MODE: Yr
  });
  function eo(c, f) {
    c.input[c.index - 1] === "." && f.ignoreMatch();
  }
  function to(c, f) {
    c.className !== void 0 && (c.scope = c.className, delete c.className);
  }
  function no(c, f) {
    f && c.beginKeywords && (c.begin = "\\b(" + c.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", c.__beforeBegin = eo, c.keywords = c.keywords || c.beginKeywords, delete c.beginKeywords, c.relevance === void 0 && (c.relevance = 0));
  }
  function ao(c, f) {
    Array.isArray(c.illegal) && (c.illegal = S(...c.illegal));
  }
  function so(c, f) {
    if (c.match) {
      if (c.begin || c.end) throw new Error("begin & end are not supported with match");
      c.begin = c.match, delete c.match;
    }
  }
  function io(c, f) {
    c.relevance === void 0 && (c.relevance = 1);
  }
  const ro = (c, f) => {
    if (!c.beforeMatch) return;
    if (c.starts) throw new Error("beforeMatch cannot be used with starts");
    const y = Object.assign({}, c);
    Object.keys(c).forEach((T) => {
      delete c[T];
    }), c.keywords = y.keywords, c.begin = m(y.beforeMatch, p(y.begin)), c.starts = {
      relevance: 0,
      contains: [
        Object.assign(y, { endsParent: !0 })
      ]
    }, c.relevance = 0, delete y.beforeMatch;
  }, oo = [
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
  ], lo = "keyword";
  function ns(c, f, y = lo) {
    const T = /* @__PURE__ */ Object.create(null);
    return typeof c == "string" ? j(y, c.split(" ")) : Array.isArray(c) ? j(y, c) : Object.keys(c).forEach(function(U) {
      Object.assign(
        T,
        ns(c[U], f, U)
      );
    }), T;
    function j(U, _) {
      f && (_ = _.map((x) => x.toLowerCase())), _.forEach(function(x) {
        const A = x.split("|");
        T[A[0]] = [U, co(A[0], A[1])];
      });
    }
  }
  function co(c, f) {
    return f ? Number(f) : uo(c) ? 0 : 1;
  }
  function uo(c) {
    return oo.includes(c.toLowerCase());
  }
  const as = {}, Ne = (c) => {
    console.error(c);
  }, ss = (c, ...f) => {
    console.log(`WARN: ${c}`, ...f);
  }, et = (c, f) => {
    as[`${c}/${f}`] || (console.log(`Deprecated as of ${c}. ${f}`), as[`${c}/${f}`] = !0);
  }, Ft = new Error();
  function is(c, f, { key: y }) {
    let T = 0;
    const j = c[y], U = {}, _ = {};
    for (let x = 1; x <= f.length; x++)
      _[x + T] = j[x], U[x + T] = !0, T += L(f[x - 1]);
    c[y] = _, c[y]._emit = U, c[y]._multi = !0;
  }
  function ho(c) {
    if (Array.isArray(c.begin)) {
      if (c.skip || c.excludeBegin || c.returnBegin)
        throw Ne("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), Ft;
      if (typeof c.beginScope != "object" || c.beginScope === null)
        throw Ne("beginScope must be object"), Ft;
      is(c, c.begin, { key: "beginScope" }), c.begin = Z(c.begin, { joinWith: "" });
    }
  }
  function po(c) {
    if (Array.isArray(c.end)) {
      if (c.skip || c.excludeEnd || c.returnEnd)
        throw Ne("skip, excludeEnd, returnEnd not compatible with endScope: {}"), Ft;
      if (typeof c.endScope != "object" || c.endScope === null)
        throw Ne("endScope must be object"), Ft;
      is(c, c.end, { key: "endScope" }), c.end = Z(c.end, { joinWith: "" });
    }
  }
  function fo(c) {
    c.scope && typeof c.scope == "object" && c.scope !== null && (c.beginScope = c.scope, delete c.scope);
  }
  function bo(c) {
    fo(c), typeof c.beginScope == "string" && (c.beginScope = { _wrap: c.beginScope }), typeof c.endScope == "string" && (c.endScope = { _wrap: c.endScope }), ho(c), po(c);
  }
  function go(c) {
    function f(_, x) {
      return new RegExp(
        h(_),
        "m" + (c.case_insensitive ? "i" : "") + (c.unicodeRegex ? "u" : "") + (x ? "g" : "")
      );
    }
    class y {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(x, A) {
        A.position = this.position++, this.matchIndexes[this.matchAt] = A, this.regexes.push([A, x]), this.matchAt += L(x) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const x = this.regexes.map((A) => A[1]);
        this.matcherRe = f(Z(x, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(x) {
        this.matcherRe.lastIndex = this.lastIndex;
        const A = this.matcherRe.exec(x);
        if (!A)
          return null;
        const V = A.findIndex((pt, Nn) => Nn > 0 && pt !== void 0), H = this.matchIndexes[V];
        return A.splice(0, V), Object.assign(A, H);
      }
    }
    class T {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(x) {
        if (this.multiRegexes[x]) return this.multiRegexes[x];
        const A = new y();
        return this.rules.slice(x).forEach(([V, H]) => A.addRule(V, H)), A.compile(), this.multiRegexes[x] = A, A;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(x, A) {
        this.rules.push([x, A]), A.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(x) {
        const A = this.getMatcher(this.regexIndex);
        A.lastIndex = this.lastIndex;
        let V = A.exec(x);
        if (this.resumingScanAtSamePosition() && !(V && V.index === this.lastIndex)) {
          const H = this.getMatcher(0);
          H.lastIndex = this.lastIndex + 1, V = H.exec(x);
        }
        return V && (this.regexIndex += V.position + 1, this.regexIndex === this.count && this.considerAll()), V;
      }
    }
    function j(_) {
      const x = new T();
      return _.contains.forEach((A) => x.addRule(A.begin, { rule: A, type: "begin" })), _.terminatorEnd && x.addRule(_.terminatorEnd, { type: "end" }), _.illegal && x.addRule(_.illegal, { type: "illegal" }), x;
    }
    function U(_, x) {
      const A = (
        /** @type CompiledMode */
        _
      );
      if (_.isCompiled) return A;
      [
        to,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        so,
        bo,
        ro
      ].forEach((H) => H(_, x)), c.compilerExtensions.forEach((H) => H(_, x)), _.__beforeBegin = null, [
        no,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        ao,
        // default to 1 relevance if not specified
        io
      ].forEach((H) => H(_, x)), _.isCompiled = !0;
      let V = null;
      return typeof _.keywords == "object" && _.keywords.$pattern && (_.keywords = Object.assign({}, _.keywords), V = _.keywords.$pattern, delete _.keywords.$pattern), V = V || /\w+/, _.keywords && (_.keywords = ns(_.keywords, c.case_insensitive)), A.keywordPatternRe = f(V, !0), x && (_.begin || (_.begin = /\B|\b/), A.beginRe = f(A.begin), !_.end && !_.endsWithParent && (_.end = /\B|\b/), _.end && (A.endRe = f(A.end)), A.terminatorEnd = h(A.end) || "", _.endsWithParent && x.terminatorEnd && (A.terminatorEnd += (_.end ? "|" : "") + x.terminatorEnd)), _.illegal && (A.illegalRe = f(
        /** @type {RegExp | string} */
        _.illegal
      )), _.contains || (_.contains = []), _.contains = [].concat(..._.contains.map(function(H) {
        return mo(H === "self" ? _ : H);
      })), _.contains.forEach(function(H) {
        U(
          /** @type Mode */
          H,
          A
        );
      }), _.starts && U(_.starts, x), A.matcher = j(A), A;
    }
    if (c.compilerExtensions || (c.compilerExtensions = []), c.contains && c.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return c.classNameAliases = a(c.classNameAliases || {}), U(
      /** @type Mode */
      c
    );
  }
  function rs(c) {
    return c ? c.endsWithParent || rs(c.starts) : !1;
  }
  function mo(c) {
    return c.variants && !c.cachedVariants && (c.cachedVariants = c.variants.map(function(f) {
      return a(c, { variants: null }, f);
    })), c.cachedVariants ? c.cachedVariants : rs(c) ? a(c, { starts: c.starts ? a(c.starts) : null }) : Object.isFrozen(c) ? a(c) : c;
  }
  var yo = "11.12.0";
  class vo extends Error {
    constructor(f, y) {
      super(f), this.name = "HTMLInjectionError", this.html = y;
    }
  }
  const Mn = n, os = a, ls = /* @__PURE__ */ Symbol("nomatch"), wo = 7, ds = function(c) {
    const f = /* @__PURE__ */ Object.create(null), y = /* @__PURE__ */ Object.create(null), T = [];
    let j = !0;
    const U = "Could not find the language '{}', did you forget to load/include a language module?", _ = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let x = {
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
    function A(b) {
      return x.noHighlightRe.test(b);
    }
    function V(b) {
      let E = b.className + " ";
      E += b.parentNode ? b.parentNode.className : "";
      const N = x.languageDetectRe.exec(E);
      if (N) {
        const I = Ee(N[1]);
        return I || (ss(U.replace("{}", N[1])), ss("Falling back to no-highlight mode for this block.", b)), I ? N[1] : "no-highlight";
      }
      return E.split(/\s+/).find((I) => A(I) || Ee(I));
    }
    function H(b, E, N) {
      let I = "", W = "";
      typeof E == "object" ? (I = b, N = E.ignoreIllegals, W = E.language) : (et("10.7.0", "highlight(lang, code, ...args) has been deprecated."), et("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), W = b, I = E), N === void 0 && (N = !0);
      const se = {
        code: I,
        language: W
      };
      Wt("before:highlight", se);
      const Se = se.result ? se.result : pt(se.language, se.code, N);
      return Se.code = se.code, Wt("after:highlight", Se), Se;
    }
    function pt(b, E, N, I) {
      const W = /* @__PURE__ */ Object.create(null);
      function se(v, k) {
        return v.keywords[k];
      }
      function Se() {
        if (!O.keywords) {
          J.addText(D);
          return;
        }
        let v = 0;
        O.keywordPatternRe.lastIndex = 0;
        let k = O.keywordPatternRe.exec(D), M = "";
        for (; k; ) {
          M += D.substring(v, k.index);
          const $ = le.case_insensitive ? k[0].toLowerCase() : k[0], X = se(O, $);
          if (X) {
            const [fe, Do] = X;
            if (J.addText(M), M = "", W[$] = (W[$] || 0) + 1, W[$] <= wo && (Vt += Do), fe.startsWith("_"))
              M += k[0];
            else {
              const qo = le.classNameAliases[fe] || fe;
              oe(k[0], qo);
            }
          } else
            M += k[0];
          v = O.keywordPatternRe.lastIndex, k = O.keywordPatternRe.exec(D);
        }
        M += D.substring(v), J.addText(M);
      }
      function Gt() {
        if (D === "") return;
        let v = null;
        if (typeof O.subLanguage == "string") {
          if (!f[O.subLanguage]) {
            J.addText(D);
            return;
          }
          v = pt(O.subLanguage, D, !0, ms[O.subLanguage]), ms[O.subLanguage] = /** @type {CompiledMode} */
          v._top;
        } else
          v = Ln(D, O.subLanguage.length ? O.subLanguage : null);
        O.relevance > 0 && (Vt += v.relevance), J.__addSublanguage(v._emitter, v.language);
      }
      function te() {
        O.subLanguage != null ? Gt() : Se(), D = "";
      }
      function oe(v, k) {
        v !== "" && (J.startScope(k), J.addText(v), J.endScope());
      }
      function ps(v, k) {
        let M = 1;
        const $ = k.length - 1;
        for (; M <= $; ) {
          if (!v._emit[M]) {
            M++;
            continue;
          }
          const X = le.classNameAliases[v[M]] || v[M], fe = k[M];
          X ? oe(fe, X) : (D = fe, Se(), D = ""), M++;
        }
      }
      function fs(v, k) {
        return v.scope && typeof v.scope == "string" && J.openNode(le.classNameAliases[v.scope] || v.scope), v.beginScope && (v.beginScope._wrap ? (oe(D, le.classNameAliases[v.beginScope._wrap] || v.beginScope._wrap), D = "") : v.beginScope._multi && (ps(v.beginScope, k), D = "")), O = Object.create(v, { parent: { value: O } }), O;
      }
      function bs(v, k, M) {
        let $ = he(v.endRe, M);
        if ($) {
          if (v["on:end"]) {
            const X = new t(v);
            v["on:end"](k, X), X.isMatchIgnored && ($ = !1);
          }
          if ($) {
            for (; v.endsParent && v.parent; )
              v = v.parent;
            return v;
          }
        }
        if (v.endsWithParent)
          return bs(v.parent, k, M);
      }
      function Lo(v) {
        return O.matcher.regexIndex === 0 ? (D += v[0], 1) : (In = !0, 0);
      }
      function $o(v) {
        const k = v[0], M = v.rule, $ = new t(M), X = [M.__beforeBegin, M["on:begin"]];
        for (const fe of X)
          if (fe && (fe(v, $), $.isMatchIgnored))
            return Lo(k);
        return M.skip ? D += k : (M.excludeBegin && (D += k), te(), !M.returnBegin && !M.excludeBegin && (D = k)), fs(M, v), M.returnBegin ? 0 : k.length;
      }
      function Ro(v) {
        const k = v[0], M = E.substring(v.index), $ = bs(O, v, M);
        if (!$)
          return ls;
        const X = O;
        O.endScope && O.endScope._wrap ? (te(), oe(k, O.endScope._wrap)) : O.endScope && O.endScope._multi ? (te(), ps(O.endScope, v)) : X.skip ? D += k : (X.returnEnd || X.excludeEnd || (D += k), te(), X.excludeEnd && (D = k));
        do
          O.scope && J.closeNode(), !O.skip && !O.subLanguage && (Vt += O.relevance), O = O.parent;
        while (O !== $.parent);
        return $.starts && fs($.starts, v), X.returnEnd ? 0 : k.length;
      }
      function Po() {
        const v = [];
        for (let k = O; k !== le; k = k.parent)
          k.scope && v.unshift(k.scope);
        v.forEach((k) => J.openNode(k));
      }
      let zt = {};
      function gs(v, k) {
        const M = k && k[0];
        if (D += v, M == null)
          return te(), 0;
        if (zt.type === "begin" && k.type === "end" && zt.index === k.index && M === "") {
          if (D += E.slice(k.index, k.index + 1), !j) {
            const $ = new Error(`0 width match regex (${b})`);
            throw $.languageName = b, $.badRule = zt.rule, $;
          }
          return 1;
        }
        if (zt = k, k.type === "begin")
          return $o(k);
        if (k.type === "illegal" && !N) {
          const $ = new Error('Illegal lexeme "' + M + '" for mode "' + (O.scope || "<unnamed>") + '"');
          throw $.mode = O, $;
        } else if (k.type === "end") {
          const $ = Ro(k);
          if ($ !== ls)
            return $;
        }
        if (k.type === "illegal" && M === "")
          return k.index === E.length || (D += `
`), 1;
        if (Pn > 1e5 && Pn > k.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return D += M, M.length;
      }
      const le = Ee(b);
      if (!le)
        throw Ne(U.replace("{}", b)), new Error('Unknown language: "' + b + '"');
      const Io = go(le);
      let Rn = "", O = I || Io;
      const ms = {}, J = new x.__emitter(x);
      Po();
      let D = "", Vt = 0, Le = 0, Pn = 0, In = !1;
      try {
        if (le.__emitTokens)
          le.__emitTokens(E, J);
        else {
          for (O.matcher.considerAll(); ; ) {
            Pn++, In ? In = !1 : O.matcher.considerAll(), O.matcher.lastIndex = Le;
            const v = O.matcher.exec(E);
            if (!v) break;
            const k = E.substring(Le, v.index), M = gs(k, v);
            Le = v.index + M;
          }
          gs(E.substring(Le));
        }
        return J.finalize(), Rn = J.toHTML(), {
          language: b,
          value: Rn,
          relevance: Vt,
          illegal: !1,
          _emitter: J,
          _top: O
        };
      } catch (v) {
        if (v.message && v.message.includes("Illegal"))
          return {
            language: b,
            value: Mn(E),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: v.message,
              index: Le,
              context: E.slice(Le - 100, Le + 100),
              mode: v.mode,
              resultSoFar: Rn
            },
            _emitter: J
          };
        if (j)
          return {
            language: b,
            value: Mn(E),
            illegal: !1,
            relevance: 0,
            errorRaised: v,
            _emitter: J,
            _top: O
          };
        throw v;
      }
    }
    function Nn(b) {
      const E = {
        value: Mn(b),
        illegal: !1,
        relevance: 0,
        _top: _,
        _emitter: new x.__emitter(x)
      };
      return E._emitter.addText(b), E;
    }
    function Ln(b, E) {
      E = E || x.languages || Object.keys(f);
      const N = Nn(b), I = E.filter(Ee).filter(hs).map(
        (te) => pt(te, b, !1)
      );
      I.unshift(N);
      const W = I.sort((te, oe) => {
        if (te.relevance !== oe.relevance) return oe.relevance - te.relevance;
        if (te.language && oe.language) {
          if (Ee(te.language).supersetOf === oe.language)
            return 1;
          if (Ee(oe.language).supersetOf === te.language)
            return -1;
        }
        return 0;
      }), [se, Se] = W, Gt = se;
      return Gt.secondBest = Se, Gt;
    }
    function xo(b, E, N) {
      const I = E && y[E] || N;
      b.classList.add("hljs"), b.classList.add(`language-${I}`);
    }
    function $n(b) {
      let E = null;
      const N = V(b);
      if (A(N)) return;
      if (Wt(
        "before:highlightElement",
        { el: b, language: N }
      ), b.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", b);
        return;
      }
      if (b.children.length > 0 && (x.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(b)), x.throwUnescapedHTML))
        throw new vo(
          "One of your code blocks includes unescaped HTML.",
          b.innerHTML
        );
      E = b;
      const I = E.textContent, W = N ? H(I, { language: N, ignoreIllegals: !0 }) : Ln(I);
      b.innerHTML = W.value, b.dataset.highlighted = "yes", xo(b, N, W.language), b.result = {
        language: W.language,
        // TODO: remove with version 11.0
        re: W.relevance,
        relevance: W.relevance
      }, W.secondBest && (b.secondBest = {
        language: W.secondBest.language,
        relevance: W.secondBest.relevance
      }), Wt("after:highlightElement", { el: b, result: W, text: I });
    }
    function _o(b) {
      x = os(x, b);
    }
    const ko = () => {
      Ht(), et("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Eo() {
      Ht(), et("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let cs = !1;
    function Ht() {
      function b() {
        Ht();
      }
      if (document.readyState === "loading") {
        cs || window.addEventListener("DOMContentLoaded", b, !1), cs = !0;
        return;
      }
      document.querySelectorAll(x.cssSelector).forEach($n);
    }
    function So(b, E) {
      let N = null;
      try {
        N = E(c);
      } catch (I) {
        if (Ne("Language definition for '{}' could not be registered.".replace("{}", b)), j)
          Ne(I);
        else
          throw I;
        N = _;
      }
      N.name || (N.name = b), f[b] = N, N.rawDefinition = E.bind(null, c), N.aliases && us(N.aliases, { languageName: b });
    }
    function Ao(b) {
      delete f[b];
      for (const E of Object.keys(y))
        y[E] === b && delete y[E];
    }
    function To() {
      return Object.keys(f);
    }
    function Ee(b) {
      return b = (b || "").toLowerCase(), f[b] || f[y[b]];
    }
    function us(b, { languageName: E }) {
      typeof b == "string" && (b = [b]), b.forEach((N) => {
        y[N.toLowerCase()] = E;
      });
    }
    function hs(b) {
      const E = Ee(b);
      return E && !E.disableAutodetect;
    }
    function Oo(b) {
      b["before:highlightBlock"] && !b["before:highlightElement"] && (b["before:highlightElement"] = (E) => {
        b["before:highlightBlock"](
          Object.assign({ block: E.el }, E)
        );
      }), b["after:highlightBlock"] && !b["after:highlightElement"] && (b["after:highlightElement"] = (E) => {
        b["after:highlightBlock"](
          Object.assign({ block: E.el }, E)
        );
      });
    }
    function Co(b) {
      Oo(b), T.push(b);
    }
    function Mo(b) {
      const E = T.indexOf(b);
      E !== -1 && T.splice(E, 1);
    }
    function Wt(b, E) {
      const N = b;
      T.forEach(function(I) {
        I[N] && I[N](E);
      });
    }
    function No(b) {
      return et("10.7.0", "highlightBlock will be removed entirely in v12.0"), et("10.7.0", "Please use highlightElement now."), $n(b);
    }
    Object.assign(c, {
      highlight: H,
      highlightAuto: Ln,
      highlightAll: Ht,
      highlightElement: $n,
      // TODO: Remove with v12 API
      highlightBlock: No,
      configure: _o,
      initHighlighting: ko,
      initHighlightingOnLoad: Eo,
      registerLanguage: So,
      unregisterLanguage: Ao,
      listLanguages: To,
      getLanguage: Ee,
      registerAliases: us,
      autoDetection: hs,
      inherit: os,
      addPlugin: Co,
      removePlugin: Mo
    }), c.debugMode = function() {
      j = !1;
    }, c.safeMode = function() {
      j = !0;
    }, c.versionString = yo, c.regex = {
      concat: m,
      lookahead: p,
      either: S,
      optional: C,
      anyNumberOfTimes: w
    };
    for (const b in Bt)
      typeof Bt[b] == "object" && e(Bt[b]);
    return Object.assign(c, Bt), c;
  }, tt = ds({});
  return tt.newInstance = () => ds({}), Gn = tt, tt.HighlightJS = tt, tt.default = tt, Gn;
}
var jc = /* @__PURE__ */ qc();
const En = /* @__PURE__ */ Dc(jc), Rs = "[A-Za-z$_][0-9A-Za-z$_]*", Uc = [
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
], Bc = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], xr = [
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
], _r = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], kr = [
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
], Fc = [
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
], Hc = [].concat(
  kr,
  xr,
  _r
);
function Wc(e) {
  const t = e.regex, n = (K, { after: ke }) => {
    const Me = "</" + K[0].slice(1);
    return K.input.indexOf(Me, ke) !== -1;
  }, a = Rs, s = {
    begin: "<>",
    end: "</>"
  }, i = /<[A-Za-z0-9\\._:-]+\s*\/>/, r = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (K, ke) => {
      const Me = K[0].length + K.index, Qe = K.input[Me];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        Qe === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        Qe === ","
      ) {
        ke.ignoreMatch();
        return;
      }
      Qe === ">" && (n(K, { after: Me }) || ke.ignoreMatch());
      let ht;
      const Ut = K.input.substring(Me);
      if (ht = Ut.match(/^\s*=/)) {
        ke.ignoreMatch();
        return;
      }
      if ((ht = Ut.match(/^\s+extends\s+/)) && ht.index === 0) {
        ke.ignoreMatch();
        return;
      }
    }
  }, o = {
    $pattern: Rs,
    keyword: Uc,
    literal: Bc,
    built_in: Hc,
    "variable.language": Fc
  }, l = "[0-9](_?[0-9])*", d = `\\.(${l})`, u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", h = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${u})((${d})|\\.)?|(${d}))[eE][+-]?(${l})\\b` },
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
  }, p = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: o,
    contains: []
    // defined later
  }, w = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        p
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
        p
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
        p
      ],
      subLanguage: "graphql"
    }
  }, g = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      e.BACKSLASH_ESCAPE,
      p
    ]
  }, L = {
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
                  begin: a + "(?=\\s*(-)|$)",
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
  }, he = [
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE,
    w,
    C,
    m,
    g,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    h
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  p.contains = he.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: o,
    contains: [
      "self"
    ].concat(he)
  });
  const pe = [].concat(L, p.contains), Z = pe.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: o,
      contains: ["self"].concat(pe)
    }
  ]), ee = {
    className: "params",
    // convert this to negative lookbehind in v12
    begin: /(\s*)\(/,
    // to match the parms with
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: o,
    contains: Z
  }, Ye = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          a,
          /\s+/,
          /extends/,
          /\s+/,
          t.concat(a, "(", t.concat(/\./, a), ")*")
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
          a
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, _e = {
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
        ...xr,
        ..._r
      ]
    }
  }, ae = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, Dt = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          a,
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
    contains: [ee],
    illegal: /%/
  }, qt = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function An(K) {
    return t.concat("(?!", K.join("|"), ")");
  }
  const Tn = {
    match: t.concat(
      /\b/,
      An([
        ...kr,
        "super",
        "import",
        "await"
      ].map((K) => `${K}\\s*\\(`)),
      a,
      t.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, Ce = {
    begin: t.concat(/\./, t.lookahead(
      t.concat(a, /(?![0-9A-Za-z$_(])/)
    )),
    end: a,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, On = {
    match: [
      /get|set/,
      /\s+/,
      a,
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
      ee
    ]
  }, jt = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", Cn = {
    match: [
      /const|var|let/,
      /\s+/,
      a,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      t.lookahead(jt)
    ],
    keywords: "async",
    className: {
      1: "keyword",
      3: "title.function"
    },
    contains: [
      ee
    ]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: o,
    // this will be extended by TypeScript
    exports: { PARAMS_CONTAINS: Z, CLASS_REFERENCE: _e },
    illegal: /#(?![$_A-Za-z])/,
    contains: [
      e.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      ae,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      w,
      C,
      m,
      g,
      L,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      h,
      _e,
      {
        scope: "attr",
        match: a + t.lookahead(":"),
        relevance: 0
      },
      Cn,
      {
        // "value" container
        begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          L,
          e.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: jt,
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
                    contains: Z
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
              { match: i },
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
      Dt,
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
          ee,
          e.inherit(e.TITLE_MODE, { begin: a, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      Ce,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + a,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [ee]
      },
      Tn,
      qt,
      Ye,
      On,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const Gc = "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity", zc = {
  scope: "number",
  match: Gc,
  relevance: 0
};
function Vc(e) {
  const t = {
    className: "attr",
    begin: /(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,
    relevance: 1.01
  }, n = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, a = [
    "true",
    "false",
    "null"
  ], s = {
    scope: "literal",
    beginKeywords: a.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc", "json5"],
    keywords: {
      literal: a
    },
    contains: [
      t,
      n,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      s,
      zc,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function Kc(e) {
  const t = e.regex, n = e.COMMENT("--", "$"), a = {
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
  }, i = [
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
  ], l = [
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
  ], p = [
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
  ], w = u, C = [
    ...d,
    ...l
  ].filter((Z) => !u.includes(Z)), m = {
    scope: "variable",
    match: /@[a-z0-9][a-z0-9_]*/
  }, g = {
    scope: "operator",
    match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  }, S = {
    match: t.concat(/\b/, t.either(...w), /\s*\(/),
    relevance: 0,
    keywords: { built_in: w }
  };
  function L(Z) {
    return t.concat(
      /\b/,
      t.either(...Z.map((ee) => ee.replace(/\s+/, "\\s+"))),
      /\b/
    );
  }
  const he = {
    scope: "keyword",
    match: L(p),
    relevance: 0
  };
  function pe(Z, {
    exceptions: ee,
    when: Ye
  } = {}) {
    const _e = Ye;
    return ee = ee || [], Z.map((ae) => ae.match(/\|\d+$/) || ee.includes(ae) ? ae : _e(ae) ? `${ae}|0` : ae);
  }
  return {
    name: "SQL",
    case_insensitive: !0,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: pe(C, { when: (Z) => Z.length < 3 }),
      literal: i,
      type: o,
      built_in: h
    },
    contains: [
      {
        scope: "type",
        match: L(r)
      },
      he,
      S,
      m,
      a,
      s,
      e.C_NUMBER_MODE,
      e.C_BLOCK_COMMENT_MODE,
      n,
      g
    ]
  };
}
En.registerLanguage("javascript", Wc);
En.registerLanguage("json", Vc);
En.registerLanguage("sql", Kc);
const Zt = /* @__PURE__ */ new Map(), Jc = 400, Xc = 2e4;
function Ps(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Zc(e, t) {
  const n = String(e ?? "");
  if (n === "") return "";
  if (n.length > Xc) return Ps(n);
  const a = `${t}:${n}`, s = Zt.get(a);
  if (s !== void 0) return s;
  let i;
  try {
    i = En.highlight(n, { language: t, ignoreIllegals: !0 }).value;
  } catch {
    i = Ps(n);
  }
  return Zt.size >= Jc && Zt.clear(), Zt.set(a, i), i;
}
async function an(e) {
  const t = await fetch(e, { headers: { Accept: "application/json" } }), n = await t.json().catch(() => null);
  if (!t.ok) throw new Error(n && n.error || `HTTP ${t.status}`);
  if (n === null) throw new Error("The response was not JSON.");
  return n;
}
async function Is(e) {
  const t = await an(e), n = {}, a = {};
  return Object.entries(t.sections || {}).forEach(([s, i]) => {
    n[s] = i.payload || {}, i.view && (a[s] = i.view);
  }), { profile: t, payloads: n, views: a };
}
const Yc = /^[a-z][a-z0-9_]{0,31}$/, Qc = ["ok", "warn", "bad"], eu = ["javascript", "json", "sql"], Ds = 500;
function tu(e, t = []) {
  let n;
  try {
    n = JSON.parse(e || "[]");
  } catch {
    return [];
  }
  if (!Array.isArray(n)) return [];
  const a = new Set(t);
  return n.filter((s) => !s || typeof s.id != "string" || !Yc.test(s.id) || a.has(s.id) ? !1 : (a.add(s.id), !0)).map((s) => ({
    id: s.id,
    label: z(s.label) || s.id,
    lead: z(s.lead),
    graded: s.graded === !0
  }));
}
function Ga(e) {
  const t = e && typeof e == "object" ? e : {};
  return { tabs: Array.isArray(t.tabs) && t.tabs.length > 0 ? t.tabs.map((a, s) => su(a, s)) : [{ id: "main", label: "", count: "", blocks: Er(t.blocks) }], count: Ar(t.count) };
}
function nu(e, t) {
  if (!e && !t) return Ga(null);
  if (!e) return t;
  if (!t) return e;
  const n = e.tabs.map((i) => ({ ...i, blocks: [...i.blocks] }));
  t.tabs.forEach((i) => {
    const r = n.find((o) => o.id === i.id);
    r ? (r.blocks.push(...i.blocks), r.count = i.count || r.count) : n.push(i);
  });
  const a = n.find((i) => i.id === "main" && i.label === ""), s = n.filter((i) => i !== a);
  return a && s.length > 0 ? (s[0] = { ...s[0], blocks: [...a.blocks, ...s[0].blocks] }, { tabs: s, count: t.count ?? e.count }) : { tabs: n, count: t.count ?? e.count };
}
function au(e) {
  return Ar(e && e.count);
}
function su(e, t) {
  const n = e && typeof e == "object" ? e : {};
  return {
    id: z(n.id) || `tab${t}`,
    label: z(n.label) || z(n.id) || `Tab ${t + 1}`,
    count: n.count === void 0 || n.count === null ? "" : z(n.count),
    blocks: Er(n.blocks)
  };
}
function Er(e) {
  return Array.isArray(e) ? e.map(iu) : [];
}
function iu(e) {
  const t = e && typeof e == "object" ? e : {};
  switch (t.type) {
    case "heading":
      return { type: "heading", text: z(t.text) };
    case "note":
      return { type: "note", text: z(t.text), tone: fn(t.tone) };
    case "list":
      return { type: "list", items: (Array.isArray(t.items) ? t.items : []).map(z) };
    case "facts":
      return {
        type: "facts",
        items: (Array.isArray(t.items) ? t.items : []).map((n) => ({
          label: z(n && n.label),
          value: z(n && n.value),
          tone: fn(n && n.tone),
          mono: !!(n && n.mono)
        }))
      };
    case "code":
      return {
        type: "code",
        language: eu.includes(t.language) ? t.language : "",
        text: z(t.text)
      };
    case "json":
      return { type: "code", language: "json", text: Sr(t.value) };
    case "table":
      return ru(t);
    default:
      return {
        type: "note",
        tone: "warn",
        text: `This section sent a "${z(t.type) || "untyped"}" block, which this version of the bar does not draw.`
      };
  }
}
function ru(e) {
  const t = (Array.isArray(e.columns) ? e.columns : []).map((s, i) => {
    const r = typeof s == "string" ? { key: s, label: s } : s || {}, o = z(r.key) || String(i);
    return {
      key: o,
      label: z(r.label) || o,
      num: !!r.num,
      mono: !!r.mono
    };
  }), n = Array.isArray(e.rows) ? e.rows : [], a = n.slice(0, Ds).map((s) => {
    const i = s && typeof s == "object" ? s : {};
    return {
      cells: t.map((r, o) => ou(Array.isArray(i) ? i[o] : i[r.key])),
      tone: Array.isArray(i) ? "" : fn(i._tone),
      target: Array.isArray(i) ? "" : z(i._target)
    };
  });
  return {
    type: "table",
    columns: t,
    rows: a,
    empty: z(e.empty) || "Nothing to show.",
    cut: Math.max(0, n.length - Ds)
  };
}
function ou(e) {
  return e && typeof e == "object" && !Array.isArray(e) && "text" in e ? { text: z(e.text), tone: fn(e.tone) } : { text: z(e), tone: "" };
}
function z(e) {
  return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" ? String(e) : Sr(e, 0);
}
function Sr(e, t = 2) {
  try {
    return JSON.stringify(e, null, t) ?? String(e);
  } catch {
    return String(e);
  }
}
function fn(e) {
  return Qc.includes(e) ? e : "";
}
function Ar(e) {
  return typeof e == "number" && Number.isFinite(e) && e > 0 ? e : null;
}
const Ue = /* @__PURE__ */ new Map(), zn = /* @__PURE__ */ new Map(), qs = /* @__PURE__ */ new Set();
function lu(e) {
  const t = window.__siteationDebugBar;
  return t ? ((t.sections || []).forEach((n) => Ue.set(n.id, n)), t.onSection = (n) => {
    Ue.set(n.id, n), e(n.id);
  }, Array.from(Ue.keys())) : [];
}
function du(e) {
  return Ue.has(e);
}
function cu(e, t) {
  const n = Ue.get(e);
  if (!(!n || typeof n.watch != "function" || qs.has(e))) {
    qs.add(e);
    try {
      n.watch(t);
    } catch (a) {
      console.warn(`Siteation_DebugBar: the ${e} section could not watch the page.`, a);
    }
  }
}
async function uu(e, t) {
  const n = Ue.get(e);
  if (!n) return null;
  const a = (zn.get(e) || 0) + 1;
  zn.set(e, a);
  const s = await n.read(t);
  return zn.get(e) === a ? Ga(s) : null;
}
function hu(e, t, n) {
  const a = Ue.get(e);
  if (!(!a || typeof a.highlight != "function" || !t))
    try {
      a.highlight(t, n);
    } catch {
    }
}
function za(e, t = 0) {
  return Number(e || 0).toFixed(t);
}
function Va(e) {
  const t = Number(e || 0);
  return t < 1024 ? `${t} B` : t < 1048576 ? `${(t / 1024).toFixed(1)} kB` : `${(t / 1048576).toFixed(1)} MB`;
}
function pu(e, t, n) {
  return `${e} ${Number(e) === 1 ? t : n}`;
}
function fu(e, t = Date.now() / 1e3) {
  const n = Math.max(0, t - Number(e || 0));
  return n < 60 ? `${Math.round(n)}s ago` : n < 3600 ? `${Math.round(n / 60)}m ago` : `${Math.round(n / 3600)}h ago`;
}
function bu(e, t) {
  let n = e;
  try {
    n = new URL(e, t).pathname;
  } catch {
    return e;
  }
  if (n.length <= 42) return n;
  const a = n.split("/").filter(Boolean);
  return a.length > 2 ? `…/${a.slice(-2).join("/")}` : n;
}
function gu(e) {
  const t = e && e.magewire;
  return t && t.component ? `${t.component} ${t.action || ""}`.trim() : e && e.path || "/";
}
function mu(e) {
  if (!e || e.delta === null || e.delta === void 0) return "not comparable";
  if (e.delta === 0) return "no change";
  const t = e.delta > 0 ? "+" : "-", n = e.unit === "B" ? Va(Math.abs(e.delta)) : `${za(Math.abs(e.delta), e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
  return `${t}${n}`;
}
function yu(e, t) {
  const n = e[t];
  return n == null ? "none" : e.unit === "B" ? Va(n) : `${za(n, e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
}
function vu(e) {
  return Object.entries(e.methods || {}).map(([t, n]) => `${n} ${t}`).join(", ");
}
function Tr(e, t, n, a) {
  if (!e || !n || !/^[a-z][a-z0-9+.-]*:\/\//i.test(e) || /^(javascript|data|vbscript):/i.test(e))
    return "";
  const s = n.startsWith("/") ? n : `${t}/${n}`;
  return e.replace("%f", () => encodeURI(s)).replace("%l", () => String(a || 1));
}
function wu(e, t, n) {
  const a = String(n || "").match(/^(.+\.php):(\d+)$/);
  return a ? Tr(e, t, a[1], Number(a[2])) : "";
}
const ba = /* @__PURE__ */ new Map(), Yt = /* @__PURE__ */ new Map();
function Ka() {
  const e = window.Magewire || window.magewire;
  return e && typeof e == "object" ? e : null;
}
function Ja() {
  const e = Ka();
  try {
    return Object.values(e?.components?.componentsById ?? {});
  } catch {
    return [];
  }
}
function xu(e) {
  try {
    return JSON.stringify(e ?? {}).length;
  } catch {
    return 0;
  }
}
function _u(e) {
  return ba.clear(), Ja().map((t) => {
    const n = t.fingerprint ?? {}, a = t.serverMemo ?? {}, s = String(n.id ?? "");
    return t.el && ba.set(s, t.el), {
      id: s,
      name: String(n.name ?? "unknown"),
      resolver: String(n.resolver ?? "unknown"),
      handle: String(n.handle ?? ""),
      keys: e === ne ? 0 : kn(a.data ?? {}).length,
      memo_bytes: xu(a),
      listeners: (t.effects?.listeners ?? []).length,
      children: Object.keys(a.children ?? {}).length,
      path: t.el ? ku(t.el) : ""
    };
  });
}
function ku(e) {
  const t = e.tagName ? e.tagName.toLowerCase() : "?";
  return e.id ? `${t}#${e.id}` : t;
}
function js(e, t) {
  if (t === ne)
    return "The value policy is set to none, so component state is not read.";
  const n = Ja().find((a) => String(a.fingerprint?.id) === String(e));
  if (!n) return "This component is no longer on the page.";
  try {
    return JSON.stringify(Pt(n.serverMemo?.data ?? {}, t), null, 2);
  } catch (a) {
    return `Could not read this component: ${a && a.message ? a.message : "threw"}`;
  }
}
function Eu() {
  return {
    present: Ka() !== null,
    components: Ja().length,
    // Already the route, not the base: Magewire publishes it as /magewire/post and the
    // client appends the action itself.
    endpoint: String(window.livewire_app_url || "")
  };
}
function Us(e) {
  const t = Ka();
  if (!t || typeof t.hook != "function") return !1;
  const n = /* @__PURE__ */ new Map(), a = (i) => String(i?.fingerprint?.name ?? "unknown"), s = (i) => String(i?.component?.fingerprint?.id ?? "");
  try {
    t.hook("message.sent", (i, r) => {
      n.set(s(i), { at: performance.now(), name: a(r) });
    }), t.hook("message.processed", (i, r) => {
      const o = n.get(s(i));
      n.delete(s(i)), e({
        component: a(r),
        action: Bs(i),
        duration_ms: o ? Math.round((performance.now() - o.at) * 10) / 10 : null,
        failed: !1
      });
    }), t.hook("message.failed", (i, r) => {
      n.delete(s(i)), e({
        component: a(r),
        action: Bs(i),
        duration_ms: null,
        failed: !0
      });
    });
  } catch {
    return !1;
  }
  return !0;
}
function Bs(e) {
  const t = (e?.updateQueue ?? [])[0];
  if (!t) return "refresh";
  const n = t.payload ?? {}, a = (...s) => s.map((i) => n[i] ?? t[i]).find(Boolean) ?? "unknown";
  return t.type === "callMethod" ? `${a("method")}()` : t.type === "syncInput" ? `set ${a("name")}` : t.type === "fireEvent" ? `on ${a("event")}` : String(t.type || "update");
}
function Su(e, t) {
  const n = ba.get(String(e));
  if (!n || !n.style) return;
  if (t) {
    Yt.has(String(e)) || Yt.set(String(e), {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  const a = Yt.get(String(e));
  a && (n.style.outline = a.outline, n.style.outlineOffset = a.offset, Yt.delete(String(e)));
}
const Vn = /* @__PURE__ */ new WeakMap(), bn = /* @__PURE__ */ new Map(), mt = /* @__PURE__ */ new Map();
let Fs = 0;
function Sn() {
  const e = Jn || window.Alpine;
  return !e || typeof e != "object" || e === St ? null : e;
}
function Or(e) {
  try {
    return typeof e.prefixed == "function" ? e.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function ga(e) {
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
function Au(e) {
  if (typeof e.evaluate != "function") return null;
  const t = ga(() => e.evaluate(document.body, "1"));
  return t === 1 ? !1 : t === void 0 ? !0 : null;
}
function Hs() {
  return Array.from(document.scripts).map((e) => e.src).filter((e) => /alpine/i.test(e)).map((e) => e.split("/").pop().split("?")[0]).join(", ");
}
function Tu(e) {
  if (typeof e.injectMagics == "function") {
    const t = ga(() => {
      const n = {};
      return e.injectMagics(n, document.body), n.$store;
    });
    if (t && typeof t == "object") return t;
  }
  if (typeof e.evaluate == "function") {
    const t = ga(() => e.evaluate(document.body, "$store"));
    if (t && typeof t == "object") return t;
  }
  return null;
}
function Ou(e) {
  const t = e.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return t ? t[1] : "inline";
}
function Cu(e) {
  if (e.id) return `#${e.id}`;
  const t = [];
  let n = e;
  for (; n && n !== document.body && t.length < 4; ) {
    const a = n.parentElement, s = n.tagName.toLowerCase();
    if (n.id) {
      t.unshift(`#${n.id}`);
      break;
    }
    if (a) {
      const i = Array.from(a.children).filter((r) => r.tagName === n.tagName);
      t.unshift(i.length > 1 ? `${s}:nth-of-type(${i.indexOf(n) + 1})` : s);
    } else
      t.unshift(s);
    n = a;
  }
  return t.join(" > ");
}
function Mu(e) {
  return Vn.has(e) || (Fs += 1, Vn.set(e, Fs)), Vn.get(e);
}
function Cr(e, t) {
  const n = t._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof e.$data != "function") return null;
  try {
    return e.$data(t);
  } catch {
    return null;
  }
}
function Nu(e) {
  const t = Sn();
  if (bn.clear(), !t) return [];
  const n = Or(t), a = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((i) => {
    const r = Mu(i), o = (i.getAttribute(n) || "").trim(), l = (i.getAttribute(a) || "").trim(), d = Cr(t, i);
    return bn.set(r, i), {
      id: r,
      name: Ou(o),
      expression: wr(o, e),
      path: Cu(i),
      initialised: !!i._x_dataStack,
      deferred: i.hasAttribute(a),
      strategy: l || "none",
      keys: e === ne || !d ? 0 : kn(d).length
    };
  });
}
function Ws(e, t) {
  if (t === ne)
    return "The value policy is set to none, so component state is not read.";
  const n = Sn(), a = bn.get(e);
  if (!n || !a) return "This component is no longer on the page.";
  if (!a._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const s = Cr(n, a);
  if (!s) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(Pt(s, t), null, 2);
  } catch (i) {
    return `Could not read this component: ${i && i.message ? i.message : "threw"}`;
  }
}
function Lu(e) {
  const t = Sn();
  if (!t) return [];
  const n = Tu(t);
  return n ? Object.keys(n).map((a) => {
    let s = n[a], i = 0;
    if (i = s && typeof s == "object" ? kn(s).length : 0, e === ne)
      return { name: a, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      s = JSON.stringify(Pt(s, e), null, 2);
    } catch (r) {
      s = `Could not read this store: ${r && r.message ? r.message : "threw"}`;
    }
    return { name: a, keys: i, value: s };
  }) : [];
}
function $u(e) {
  const t = window.__siteationDebugBar;
  return !t || !Array.isArray(t.alpineErrors) ? [] : t.alpineErrors.map((n) => {
    const a = String(n.message || ""), s = a.match(/Expression: "([\s\S]*?)"/);
    return {
      // An expression that threw is still a server rendered expression, and a message that
      // names the value it choked on is still that value. The rest of this section applies
      // the policy to exactly these two things; this was the one reader that did not.
      message: pn(a.split(`
`)[0].replace(/^Alpine (Expression )?Error:\s*/, ""), e),
      expression: s ? wr(s[1], e) : "",
      element: String(n.element || ""),
      during_init: !!n.during_init
    };
  });
}
function Ru() {
  const e = Sn();
  return e ? {
    present: !0,
    version: String(e.version || "unknown"),
    csp: Au(e),
    source: Hs(),
    prefix: Or(e)
  } : { present: !1, version: "", csp: null, source: Hs(), prefix: "" };
}
function Pu(e, t) {
  const n = bn.get(e);
  if (!n || !n.style) return;
  if (t) {
    mt.has(e) || mt.set(e, {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  if (!mt.has(e)) return;
  const a = mt.get(e);
  n.style.outline = a.outline, n.style.outlineOffset = a.offset, mt.delete(e);
}
const Gs = 2e5, Iu = /^https?:\/\/(www\.)?schema\.org\//i, Mr = {
  Product: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/product-snippet",
    required: ["name"],
    oneOf: [["offers", "review", "aggregateRating"]],
    recommended: ["image", "description", "sku", "brand"]
  },
  Offer: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/merchant-listing",
    oneOf: [["price", "priceSpecification"]],
    required: ["priceCurrency"],
    recommended: ["availability", "url", "itemCondition"]
  },
  AggregateOffer: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/product-snippet",
    required: ["lowPrice", "priceCurrency"],
    recommended: ["highPrice", "offerCount"]
  },
  AggregateRating: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/review-snippet",
    required: ["ratingValue"],
    oneOf: [["ratingCount", "reviewCount"]],
    recommended: ["bestRating", "worstRating"]
  },
  Review: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/review-snippet",
    required: ["author", "reviewRating"],
    recommended: ["datePublished", "author.name"]
  },
  BreadcrumbList: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
    required: ["itemListElement"]
  },
  ListItem: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/breadcrumb",
    required: ["position"]
  },
  Organization: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/organization",
    recommended: ["name", "url", "logo", "sameAs"]
  },
  WebSite: {
    docs: "https://developers.google.com/search/docs/appearance/site-names",
    required: ["name", "url"],
    recommended: ["alternateName"],
    note: "Google stopped drawing the sitelinks search box in November 2024, so a SearchAction here no longer changes the result. The site name still comes from this block."
  },
  FAQPage: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
    required: ["mainEntity"],
    note: "Google shows FAQ rich results only for well known government and health sites since August 2023."
  },
  Question: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
    required: ["name", "acceptedAnswer"]
  },
  Answer: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/faqpage",
    required: ["text"]
  },
  Article: {
    docs: "https://developers.google.com/search/docs/appearance/structured-data/article",
    recommended: ["headline", "image", "datePublished", "dateModified", "author", "author.name"]
  }
}, Xa = {
  NewsArticle: "Article",
  BlogPosting: "Article",
  ProductGroup: "Product",
  Corporation: "Organization",
  OnlineStore: "Organization",
  OnlineBusiness: "Organization",
  LocalBusiness: "Organization",
  Store: "Organization"
}, Du = ["BreadcrumbList", "WebSite", "Organization", "FAQPage"];
function xe(e) {
  return (Array.isArray(e) ? e : String(e ?? "").split(/\s+/)).map((n) => String(n ?? "").trim().replace(Iu, "")).filter(Boolean);
}
function Nr(e) {
  for (const t of e) {
    const n = Xa[t] || t;
    if (Mr[n]) return n;
  }
  return "";
}
function qu(e, t) {
  const n = /line (\d+) column (\d+)/i.exec(e);
  if (n) return { line: Number(n[1]), column: Number(n[2]) };
  const a = /position (\d+)/i.exec(e);
  if (!a) return null;
  const s = t.slice(0, Number(a[1])).split(`
`);
  return { line: s.length, column: s[s.length - 1].length + 1 };
}
function ju(e) {
  const t = [], n = [];
  return Array.from(e.querySelectorAll("script[type]")).filter((a) => a.getAttribute("type").trim().toLowerCase() === "application/ld+json").forEach((a, s) => {
    const i = String(a.textContent || ""), r = { index: s, error: "", at: null, excerpt: "", entities: 0 };
    if (t.push(r), i.trim() === "") {
      r.error = "The block is empty.";
      return;
    }
    let o;
    try {
      o = JSON.parse(i);
    } catch (d) {
      r.error = String(d && d.message || d), r.at = qu(r.error, i), r.excerpt = r.at ? (i.split(`
`)[r.at.line - 1] || "").trim().slice(0, 160) : "";
      return;
    }
    (Array.isArray(o) ? o : [o]).forEach((d) => {
      if (!d || typeof d != "object") return;
      const u = Array.isArray(d["@graph"]) ? d["@graph"] : [d], h = d["@context"];
      u.forEach((p) => {
        if (!p || typeof p != "object") return;
        const w = h && !p["@context"] && p !== d ? { "@context": h, ...p } : p;
        n.push({ source: "json-ld", block: s, data: w }), r.entities += 1;
      });
    });
  }), { blocks: t, entities: n };
}
function Uu(e) {
  const t = e.tagName.toLowerCase(), n = (a) => (e.getAttribute(a) || "").trim();
  return t === "meta" ? n("content") : ["a", "area", "link"].includes(t) ? n("href") : ["audio", "embed", "iframe", "img", "source", "track", "video"].includes(t) ? n("src") : t === "object" ? n("data") : ["data", "meter"].includes(t) ? n("value") : t === "time" && e.hasAttribute("datetime") ? n("datetime") : e.hasAttribute("content") ? n("content") : String(e.textContent || "").replace(/\s+/g, " ").trim();
}
function Lr(e) {
  const t = {}, n = xe(e.getAttribute("itemtype"));
  n.length === 1 ? t["@type"] = n[0] : n.length > 1 && (t["@type"] = n), e.getAttribute("itemid") && (t["@id"] = e.getAttribute("itemid"));
  const a = (i, r) => {
    i in t ? Array.isArray(t[i]) ? t[i].push(r) : t[i] = [t[i], r] : t[i] = r;
  }, s = (i) => {
    Array.from(i.children).forEach((r) => {
      const o = (r.getAttribute("itemprop") || "").trim().split(/\s+/).filter(Boolean), l = r.hasAttribute("itemscope");
      o.forEach((d) => a(d, l ? Lr(r) : Uu(r))), l || s(r);
    });
  };
  return s(e), t;
}
function $r(e) {
  const t = Array.from(e.querySelectorAll("[itemscope]")).filter((n) => !n.hasAttribute("itemprop"));
  return {
    entities: t.map((n, a) => {
      const s = xe(n.getAttribute("itemtype")), i = t.findIndex((r) => r !== n && r.contains(n) && xe(r.getAttribute("itemtype")).some((o) => s.includes(o)));
      return {
        source: "microdata",
        block: a,
        where: Bu(n),
        inside: i,
        data: Lr(n)
      };
    }),
    elements: t
  };
}
function Bu(e) {
  const t = e.tagName.toLowerCase(), n = e.getAttribute("id"), a = (e.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
  return n ? `<${t} id="${n}">` : a.length > 0 ? `<${t} class="${a[0]}">` : `<${t}>`;
}
function Za(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.some(Za) : !0;
}
function Be(e, t) {
  const [n, ...a] = t.split("."), s = e[n];
  return a.length === 0 ? Za(s) : (Array.isArray(s) ? s : [s]).some((r) => r && typeof r == "object" && Be(r, a.join(".")));
}
function Rr(e, t, n, a = 0) {
  if (a > 6) return;
  const s = xe(e["@type"]), i = Nr(s), r = t ? `${t} > ${s[0] || "item"}` : s[0] || "item", o = Mr[i];
  if (o) {
    const l = (d, u) => n.push({ level: d, path: r, message: u, docs: o.docs });
    (o.required || []).filter((d) => !Be(e, d)).forEach((d) => {
      l("required", `Missing ${d}.`);
    }), (o.oneOf || []).filter((d) => !d.some((u) => Be(e, u))).forEach((d) => {
      l("required", `Needs one of ${d.join(", ")}.`);
    }), (o.recommended || []).filter((d) => !Be(e, d)).forEach((d) => {
      l("recommended", `No ${d}.`);
    }), o.note && l("note", o.note), i === "BreadcrumbList" && Fu(e, l), i === "WebSite" && Hu(e, l), (i === "Offer" || i === "AggregateOffer") && Wu(e, l);
  }
  Object.entries(e).forEach(([l, d]) => {
    if (l.startsWith("@")) return;
    (Array.isArray(d) ? d : [d]).forEach((h) => {
      h && typeof h == "object" && h["@type"] && Rr(h, `${r} > ${l}`, n, a + 1);
    });
  });
}
function Fu(e, t) {
  const a = (Array.isArray(e.itemListElement) ? e.itemListElement : [e.itemListElement]).filter((i) => i && typeof i == "object");
  a.forEach((i, r) => {
    const o = Be(i, "name") || Be(i, "item.name"), l = Be(i, "item");
    o || t("required", `Crumb ${r + 1} has no name.`), !l && r < a.length - 1 && t("required", `Crumb ${r + 1} has no item URL.`);
  }), a.map((i) => Number(i.position)).some((i, r) => i !== r + 1) && t("required", "The crumb positions do not count up from 1.");
}
function Hu(e, t) {
  (Array.isArray(e.potentialAction) ? e.potentialAction : [e.potentialAction]).filter((a) => a && typeof a == "object" && xe(a["@type"]).includes("SearchAction")).forEach((a) => {
    const s = typeof a.target == "object" && a.target ? String(a.target.urlTemplate || "") : String(a.target || ""), i = String(a["query-input"] || ""), r = (/name=([\w-]+)/.exec(i) || [])[1] || "";
    s ? r && !s.includes(`{${r}}`) && t("required", `The SearchAction target has no {${r}} for the query-input to fill.`) : t("required", "The SearchAction has no target.");
  });
}
function Wu(e, t) {
  const n = e.price ?? e.lowPrice;
  Za(n) && !/^\d+(\.\d+)?$/.test(String(n).trim()) && t("required", `The price "${n}" is not a plain number. Use a dot for decimals and leave out the currency sign.`);
  const a = String(e.priceCurrency || "").trim();
  a && !/^[A-Z]{3}$/.test(a) && t("required", `"${a}" is not a three letter ISO 4217 currency code.`);
}
function Gu(e) {
  const t = e.name ?? e.headline ?? e.url ?? e["@id"] ?? "", n = Array.isArray(t) ? t[0] : t;
  return typeof n == "string" ? n.replace(/\s+/g, " ").trim().slice(0, 120) : "";
}
function Pr(e) {
  const t = xe(e["@type"]).map((a) => Xa[a] || a).sort(), n = e["@id"] || e.sku || e.url || e.name;
  return t.length === 0 || !n || typeof n != "string" ? "" : `${t.join("+")}|${n.trim().toLowerCase()}`;
}
function zs(e) {
  const t = e.map((n) => Pr(n.data));
  return t[0] !== "" && t.every((n) => n === t[0]);
}
function zu(e) {
  const t = [], n = /* @__PURE__ */ new Map(), a = e.filter((r) => r.source === "microdata"), s = /* @__PURE__ */ new Set();
  a.forEach((r) => {
    if (r.inside === void 0 || r.inside < 0) return;
    const o = a.find((l) => l.block === r.inside);
    o && (s.add(o), t.push(`${r.type} is declared on ${o.where} and again on ${r.where} inside it. Its properties go to the inner one, so the outer one is a second, empty ${r.type}. Remove one itemscope.`));
  }), e = e.filter((r) => !s.has(r)), e.forEach((r) => {
    const o = Pr(r.data);
    o && n.set(o, [...n.get(o) || [], r]);
  }), n.forEach((r) => {
    if (r.length < 2) return;
    const o = [...new Set(r.map((d) => d.source === "json-ld" ? "JSON-LD" : "microdata"))], l = o.length > 1 ? `in both ${o.join(" and ")}` : `${r.length} times in ${o[0]}`;
    t.push(`${r[0].type} "${r[0].name}" is described ${l}. Usually a theme and a module both write it; keep one.`);
  }), Du.forEach((r) => {
    const o = e.filter((l) => xe(l.data["@type"]).some((d) => (Xa[d] || d) === r));
    o.length > 1 && !zs(o) && t.push(`${o.length} ${r} entities on one page. A page has one; keep the one that is right.`);
  });
  const i = e.filter((r) => Nr(xe(r.data["@type"])) === "Product");
  return i.length > 1 && !zs(i) && t.push(`${i.length} different top level products. A product page describes one; a list of products belongs in an ItemList.`), t;
}
function Vu(e) {
  let t;
  try {
    t = new URL(e).hostname.toLowerCase();
  } catch {
    return !1;
  }
  return !(t === "localhost" || !t.includes(".") || /\.(test|local|localhost|internal|example|invalid|lan|home|dev\.local)$/.test(t) || /^(10|127)\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^169\.254\./.test(t) || t.startsWith("["));
}
function Ku(e) {
  const t = Vu(e), n = encodeURIComponent(e);
  return {
    public: t,
    tools: [
      {
        label: "Rich Results Test",
        href: t ? `https://search.google.com/test/rich-results?url=${n}` : "https://search.google.com/test/rich-results"
      },
      {
        label: "Schema Markup Validator",
        href: t ? `https://validator.schema.org/#url=${n}` : "https://validator.schema.org/"
      }
    ]
  };
}
function Ju(e) {
  const t = Array.from(e.querySelectorAll("script[type]")).filter((s) => s.getAttribute("type").trim().toLowerCase() === "application/ld+json").map((s) => `<script type="application/ld+json">${s.textContent}<\/script>`), n = $r(e).elements.map((s) => s.outerHTML), a = [...t, ...n].join(`
`);
  return a.length > Gs ? a.slice(0, Gs) : a;
}
function Xu(e, t) {
  const n = ju(e), a = $r(e), s = [...n.entities, ...a.entities].map((r, o) => {
    const l = [];
    return Rr(r.data, "", l), {
      index: o,
      source: r.source,
      block: r.block,
      where: r.where || "",
      inside: r.inside ?? -1,
      type: xe(r.data["@type"]).join(", ") || "untyped",
      name: Gu(r.data),
      json: JSON.stringify(r.data, null, 2),
      data: r.data,
      findings: l
    };
  }), i = [];
  return n.blocks.filter((r) => r.error).forEach((r) => {
    const o = r.at ? ` at line ${r.at.line}, column ${r.at.column}` : "";
    i.push(`JSON-LD block ${r.index + 1} does not parse${o}: ${r.error}`);
  }), i.push(...zu(s)), s.forEach((r) => {
    r.wrapper = r.source === "microdata" && s.some((o) => o.source === "microdata" && o.inside === r.block);
  }), s.forEach((r) => {
    r.wrapper || r.findings.filter((o) => o.level === "required").forEach((o) => {
      i.push(`${o.path}: ${o.message}`);
    });
  }), s.forEach((r) => {
    delete r.data;
  }), {
    model: {
      blocks: n.blocks,
      entities: s,
      warnings: i,
      links: Ku(t)
    },
    elements: a.elements
  };
}
function Zu() {
  return { blocks: [], entities: [], warnings: [], links: { public: !1, tools: [] } };
}
const Yu = { min: 30, max: 60 }, Qu = { min: 70, max: 160 }, eh = ["og:title", "og:type", "og:image", "og:url"], th = ["twitter:card"], nh = 2, ah = 200, ma = 160, sh = /^[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?$/i;
function ih(e) {
  const t = e.getBoundingClientRect(), n = e.ownerDocument.defaultView, a = n ? n.getComputedStyle(e) : null, s = !!a && (a.clip === "rect(0px, 0px, 0px, 0px)" || a.clipPath === "inset(50%)");
  return {
    visible: (typeof e.checkVisibility == "function" ? e.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 }) : t.width > 0 && t.height > 0) && !s && t.width > 1 && t.height > 1,
    top: t.top + (n ? n.scrollY : 0),
    width: t.width,
    height: t.height,
    naturalWidth: Number(e.naturalWidth || 0),
    naturalHeight: Number(e.naturalHeight || 0)
  };
}
function rh() {
  return {
    measure: ih,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
}
function Ke(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length <= ma ? t : `${t.slice(0, ma)}...`;
}
function Je(e, t) {
  try {
    return new URL(e, t);
  } catch {
    return null;
  }
}
function Ya(e, t) {
  return String(e.getAttribute(t) || "").toLowerCase().split(/\s+/).filter(Boolean);
}
function gn(e, t) {
  return Array.from(e.querySelectorAll("meta")).filter((n) => (n.getAttribute("name") || n.getAttribute("property") || "").toLowerCase() === t);
}
function Vs(e, t) {
  return e === 0 ? "missing" : e < t.min ? `too short, under ${t.min} characters` : e > t.max ? `too long, over ${t.max} characters, so it will be cut` : "";
}
function Ir(e) {
  return e === "" ? "missing" : sh.test(e) ? /-uk$/i.test(e) ? `"${e}" uses UK, which is not a region code; use GB` : "" : `"${e}" is not a valid language code`;
}
function Nt(e) {
  return `${e.protocol}//${e.host}${e.pathname}${e.search}`;
}
function oh(e, t) {
  if (Nt(e) === Nt(t)) return "";
  if (e.protocol !== t.protocol)
    return `it uses ${e.protocol.replace(":", "")} and this page uses ${t.protocol.replace(":", "")}`;
  if (e.host !== t.host) return `it points to another host, ${e.host}`;
  const n = e.pathname.replace(/\/$/, "") === t.pathname.replace(/\/$/, "");
  return e.pathname !== t.pathname && n ? "only the trailing slash differs" : e.pathname !== t.pathname ? `it points to ${e.pathname}` : t.search && !e.search ? `this URL has a query string (${t.search}) that the canonical leaves out` : e.search && !t.search ? `it adds a query string (${e.search}) that this URL does not have` : "the query string differs";
}
function lh(e, t) {
  const n = Array.from(e.querySelectorAll("link[rel]")).filter((l) => Ya(l, "rel").includes("canonical")), a = [];
  if (n.length === 0)
    return { href: "", resolved: "", count: 0, warnings: ["No canonical URL."] };
  n.length > 1 && a.push(`${n.length} canonical links. Search engines ignore all of them when they disagree, and may when they do not.`);
  const s = (n[0].getAttribute("href") || "").trim(), i = Je(s, t), r = Je(t, t);
  if (s === "" || !i)
    return a.push("The canonical link has no usable URL."), { href: s, resolved: "", count: n.length, warnings: a };
  /^[a-z][a-z0-9+.-]*:/i.test(s) || a.push("The canonical URL is relative. Use the full URL, with the scheme and host.");
  const o = r ? oh(i, r) : "";
  return o && a.push(`The canonical URL is not this page: ${o}.`), { href: s, resolved: i.href, count: n.length, warnings: a };
}
function dh(e, t) {
  const n = Je(t, t), a = Array.from(e.querySelectorAll("link[hreflang]")).filter((i) => Ya(i, "rel").includes("alternate")).map((i) => {
    const r = (i.getAttribute("hreflang") || "").trim(), o = Je(i.getAttribute("href") || "", t);
    return {
      lang: r,
      href: o ? o.href : "",
      self: !!(o && n && Nt(o) === Nt(n)),
      problem: r.toLowerCase() === "x-default" ? "" : Ir(r)
    };
  });
  if (a.length === 0) return { items: a, warnings: [] };
  const s = [];
  return a.some((i) => i.self) || s.push("No hreflang link points to this page. Every page in the set has to list itself."), a.some((i) => i.lang.toLowerCase() === "x-default") || s.push("No x-default alternate, so visitors whose language is not listed get no fallback."), a.filter((i) => i.problem).forEach((i) => {
    s.push(`hreflang ${i.problem}.`);
  }), { items: a, warnings: s };
}
function ch(e) {
  if (!e) return 0;
  let t = 0;
  const n = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG"]), a = (s) => {
    s.childNodes.forEach((i) => {
      i.nodeType === 3 ? t += (i.textContent.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length : i.nodeType === 1 && !n.has(i.nodeName.toUpperCase()) && a(i);
    });
  };
  return a(e), t;
}
function uh(e, t = "") {
  const n = [...gn(e, "robots"), ...gn(e, "googlebot")].map((i) => (i.getAttribute("content") || "").trim()).filter(Boolean).join(", "), a = [], s = `${n}, ${t}`.toLowerCase();
  return /\b(noindex|none)\b/.test(s) && a.push("This page asks not to be indexed."), /\b(nofollow|none)\b/.test(s) && a.push("This page asks search engines not to follow its links."), { meta: n, header: String(t || ""), warnings: a };
}
function hh(e, t, n = "") {
  const a = e.querySelector("head title") || e.querySelector("title"), s = Ke(a ? a.textContent : ""), i = gn(e, "description")[0], r = Ke(i ? i.getAttribute("content") : ""), o = (e.documentElement.getAttribute("lang") || "").trim(), l = gn(e, "viewport")[0], d = e.querySelector("meta[charset]") || Array.from(e.querySelectorAll("meta[http-equiv]")).find((h) => /charset=/i.test(h.getAttribute("content") || "")), u = {
    title: { value: s, length: s.length, hint: Vs(s.length, Yu) },
    description: {
      value: r,
      length: r.length,
      hint: Vs(r.length, Qu)
    },
    canonical: lh(e, t),
    robots: uh(e, n),
    hreflang: dh(e, t),
    lang: { value: o, problem: Ir(o) },
    viewport: l ? (l.getAttribute("content") || "").trim() : "",
    charset: {
      value: String(e.characterSet || e.charset || ""),
      declared: !!d
    },
    words: ch(e.body),
    warnings: []
  };
  return u.title.hint && u.warnings.push(`Title ${u.title.hint}.`), u.description.hint && u.warnings.push(`Meta description ${u.description.hint}.`), u.lang.problem && u.warnings.push(`<html lang> ${u.lang.problem}.`), u.viewport || u.warnings.push("No viewport meta tag, so phones draw the desktop layout."), u.charset.declared || u.warnings.push("No charset declared in the markup."), u.warnings.push(
    ...u.canonical.warnings,
    ...u.robots.warnings,
    ...u.hreflang.warnings
  ), u;
}
function ph(e, t) {
  const n = Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  let a = 0;
  const s = n.map((o, l) => {
    const d = Number(o.tagName.slice(1)), u = Ke(o.textContent), h = [];
    return u === "" && h.push("empty"), a > 0 && d > a + 1 && h.push(`skips from h${a} to h${d}`), t.measure(o).visible || h.push("hidden from view"), a = d, { index: l, level: d, text: u, warnings: h };
  }), i = s.filter((o) => o.level === 1).length, r = [];
  return i === 0 && r.push("No H1."), i > 1 && r.push(`${i} H1 headings. One page, one main heading.`), s.forEach((o) => o.warnings.forEach((l) => {
    r.push(`H${o.level} ${o.text ? `"${o.text}"` : `#${o.index + 1}`}: ${l}.`);
  })), { items: s, warnings: r, elements: n };
}
function fh(e, t) {
  const n = e.trim().toLowerCase();
  if (n === "") return !1;
  if (/\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?)$/.test(n) || /^(img|image|dsc|dscn|photo|pic|screenshot)[-_ ]?\d+$/.test(n)) return !0;
  const s = String(t || "").split(/[?#]/)[0].split("/").pop().toLowerCase().replace(/\.[a-z0-9]+$/, "");
  return s !== "" && n === s;
}
function bh(e, t) {
  const n = Array.from(e.querySelectorAll("img")), a = n.map((r, o) => {
    const l = r.currentSrc || r.getAttribute("src") || r.getAttribute("data-src") || "", d = r.hasAttribute("alt") ? r.getAttribute("alt") : null, u = t.measure(r), h = [];
    d === null ? h.push("no alt attribute") : d.trim() === "" ? h.push("empty alt, which is right only for a decorative image") : fh(d, l) && h.push("alt text is a file name"), (!r.hasAttribute("width") || !r.hasAttribute("height")) && h.push("no width and height, so the page shifts when it loads");
    const p = u.width * t.pixelRatio;
    return u.visible && u.width > 0 && u.naturalWidth > p * nh && u.naturalWidth - p > ah && h.push(`${u.naturalWidth}px wide but drawn at ${Math.round(u.width)}px`), (r.getAttribute("loading") || "").toLowerCase() === "lazy" && u.visible && u.top < t.viewportHeight && h.push("lazy loaded but visible on the first screen, which delays it"), {
      index: o,
      src: l,
      alt: d === null ? null : Ke(d),
      size: u.naturalWidth && u.width ? `${Math.round(u.width)} × ${Math.round(u.height)} of ${u.naturalWidth} × ${u.naturalHeight}` : "",
      warnings: h
    };
  }), s = a.filter((r) => r.warnings.length > 0), i = s.length > 0 ? [`${s.length} of ${a.length} images have a problem.`] : [];
  return { items: a, warnings: i, elements: n };
}
function gh(e) {
  const t = Ke(e.textContent);
  if (t) return t;
  const n = Array.from(e.querySelectorAll("img[alt]")).map((a) => a.getAttribute("alt")).find(Boolean);
  return Ke(e.getAttribute("aria-label") || n || e.getAttribute("title") || "");
}
function mh(e, t) {
  const n = Je(t, t), a = Array.from(e.querySelectorAll("a[href]")), s = { internal: 0, external: 0, nofollow: 0 }, i = a.map((l, d) => {
    const u = (l.getAttribute("href") || "").trim(), h = Je(u, t), p = Ya(l, "rel").includes("nofollow"), w = gh(l), C = [];
    let m = "other";
    return h && /^https?:$/.test(h.protocol) && (m = n && h.host === n.host ? "internal" : "external"), m !== "other" && (s[m] += 1), p && (s.nofollow += 1), w === "" && C.push("no text"), (u === "" || u === "#") && C.push("goes nowhere"), /^javascript:/i.test(u) && C.push("a javascript: link, which is a button pretending"), m === "internal" && p && C.push("internal link marked nofollow"), n && n.protocol === "https:" && h && h.protocol === "http:" && C.push("http: on an https: page"), { index: d, href: u, text: w, kind: m, nofollow: p, warnings: C };
  }), r = i.filter((l) => l.warnings.length > 0), o = r.length > 0 ? [`${r.length} of ${i.length} links have a problem.`] : [];
  return { items: i, counts: s, warnings: o, elements: a };
}
function yh(e) {
  const t = Array.from(e.querySelectorAll("meta")).map((o) => ({
    name: (o.getAttribute("property") || o.getAttribute("name") || "").trim().toLowerCase(),
    value: Ke(o.getAttribute("content"))
  })), n = t.filter((o) => o.name.startsWith("og:")), a = t.filter((o) => o.name.startsWith("twitter:")), s = (o) => t.some((l) => l.name === o && l.value !== ""), i = [];
  eh.filter((o) => !s(o)).forEach((o) => {
    i.push(`Missing ${o}.`);
  }), th.filter((o) => !s(o)).forEach((o) => {
    i.push(`Missing ${o}, so X shows a bare link.`);
  });
  const r = n.find((o) => o.name === "og:image");
  return r && r.value && !/^https?:\/\//i.test(r.value) && i.push("og:image is not a full URL, and link previews will not fetch it."), { openGraph: n, x: a, warnings: i };
}
function vh(e) {
  const t = Je(e, e);
  return t ? [
    { label: "robots.txt", href: `${t.origin}/robots.txt` },
    { label: "sitemap.xml", href: `${t.origin}/sitemap.xml` },
    {
      label: "PageSpeed Insights",
      href: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(Nt(t))}`
    }
  ] : [];
}
const wh = {
  not_frontend: "the request was not a storefront page",
  not_html: "the response was not HTML",
  too_large: "the response was too large to read",
  unreadable: "the server could not parse the HTML"
};
function xh(e) {
  return String(e ?? "").replace(/\s+/g, " ").trim().replace(/\.\.\.$/, "").slice(0, ma);
}
function _h(e, t) {
  const n = (o) => ({ available: !1, reason: o, rows: [], changed: 0 });
  if (!e || typeof e != "object" || !("title" in e || "skipped" in e))
    return n("The server kept no SEO record for this page.");
  if (e.skipped)
    return n(`The server kept no SEO record: ${wh[e.skipped] || e.skipped}.`);
  const a = t.headings.items.filter((o) => o.level === 1), s = (o, l, d) => [o, l, String(e[o] ?? ""), d, xh], i = (o, l, d) => [o, l, Number(e[o] ?? 0), d, Number], r = [
    s("title", "Title", t.overview.title.value),
    s("description", "Meta description", t.overview.description.value),
    s("canonical", "Canonical", t.overview.canonical.href),
    s("robots", "Robots meta", t.overview.robots.meta),
    s("lang", "Language", t.overview.lang.value),
    s("h1", "H1", a.length > 0 ? a[0].text : ""),
    i("h1_count", "H1 count", a.length),
    i("heading_count", "Headings", t.headings.items.length),
    i("json_ld_count", "JSON-LD blocks", t.schema.blocks.length)
  ].map(([o, l, d, u, h]) => ({
    key: o,
    label: l,
    server: d,
    live: u,
    changed: h(d) !== h(u)
  }));
  return { available: !0, reason: "", rows: r, changed: r.filter((o) => o.changed).length };
}
function kh(e, { url: t, robotsHeader: n = "", env: a }) {
  const { elements: s, ...i } = ph(e, a), { elements: r, ...o } = bh(e, a), { elements: l, ...d } = mh(e, t), { elements: u, model: h } = Xu(e, t), p = (m) => m.items.filter((g) => g.warnings.length > 0).length, w = {
    overview: 0,
    headings: i.warnings.length,
    images: p(o),
    links: p(d),
    schema: h.warnings.length,
    social: 0
  }, C = {
    overview: hh(e, t, n),
    headings: i,
    images: o,
    links: d,
    schema: h,
    social: yh(e),
    quickLinks: vh(t),
    counts: w
  };
  return w.overview = C.overview.warnings.length, w.social = C.social.warnings.length, C.warningCount = Object.values(w).reduce((m, g) => m + g, 0), {
    model: C,
    elements: {
      headings: s,
      images: r,
      links: l,
      schema: u
    }
  };
}
function Ks() {
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
    schema: Zu(),
    social: { openGraph: [], x: [], warnings: [] },
    quickLinks: [],
    counts: { overview: 0, headings: 0, images: 0, links: 0, schema: 0, social: 0 },
    warningCount: 0
  };
}
let Qa = { headings: [], images: [], links: [], schema: [] };
const Lt = /* @__PURE__ */ new Map();
function Eh(e = "") {
  Array.from(Lt.keys()).forEach((a) => Dr(a));
  const { model: t, elements: n } = kh(document, {
    url: window.location.href,
    robotsHeader: e,
    env: rh()
  });
  return Qa = n, t;
}
function Dr(e) {
  const t = Lt.get(e);
  t && (e.style.outline = t.outline, e.style.outlineOffset = t.offset, Lt.delete(e));
}
function Sh() {
  return Ju(document);
}
function ya(e, t, n) {
  const a = (Qa[e] || [])[t];
  if (!(!a || !a.style)) {
    if (!n) {
      Dr(a);
      return;
    }
    Lt.has(a) || Lt.set(a, {
      outline: a.style.outline || "",
      offset: a.style.outlineOffset || ""
    }), a.style.outline = "2px solid #7f9cf5", a.style.outlineOffset = "2px";
  }
}
function Ah(e, t) {
  const n = (Qa[e] || [])[t];
  n && (n.scrollIntoView({ block: "center", behavior: "smooth" }), ya(e, t, !0));
}
const qr = [
  "view_item_list",
  "select_item",
  "view_item",
  "add_to_wishlist",
  "add_to_cart",
  "remove_from_cart",
  "view_cart",
  "begin_checkout",
  "add_shipping_info",
  "add_payment_info",
  "purchase",
  "refund",
  "view_promotion",
  "select_promotion"
], Th = qr.filter((e) => !["refund"].includes(e)), es = ["ad_storage", "analytics_storage", "ad_user_data", "ad_personalization"], Oh = 2e3, va = "siteation.debugbar.datalayer.v1", Ch = 500, Mh = 4e5;
function Nh(e) {
  const t = e.value;
  if (e.gtag && Array.isArray(t)) {
    const n = String(t[0] ?? ""), a = typeof t[1] == "string" ? t[1] : "";
    return { kind: "gtag", name: a ? `${n} ${a}` : n, args: t };
  }
  return t && typeof t == "object" && !Array.isArray(t) ? typeof t.event == "string" ? { kind: "event", name: t.event, args: [] } : { kind: "object", name: Object.keys(t).slice(0, 3).join(", ") || "empty object", args: [] } : { kind: "other", name: typeof t, args: [] };
}
function Lh(e) {
  const t = e.value;
  if (e.gtag && Array.isArray(t) && t[0] === "event") {
    const n = t[2] && typeof t[2] == "object" ? t[2] : null;
    return { event: String(t[1] ?? ""), data: n, viaGtag: !0 };
  }
  if (t && typeof t == "object" && typeof t.event == "string") {
    const n = t.ecommerce && typeof t.ecommerce == "object" ? t.ecommerce : null;
    return { event: t.event, data: n, viaGtag: !1 };
  }
  return { event: "", data: null, viaGtag: !1 };
}
function $h(e) {
  const t = e && e.value;
  return !!(t && typeof t == "object" && !Array.isArray(t) && "ecommerce" in t && t.ecommerce === null);
}
function Rh(e, t) {
  const { event: n, data: a, viaGtag: s } = Lh(e[t]);
  if (!qr.includes(n)) return [];
  const i = [];
  if (!a)
    return i.push(s ? "no parameters" : "no ecommerce object"), i;
  if (Th.includes(n)) {
    const r = a.items;
    !Array.isArray(r) || r.length === 0 ? i.push("no items[]") : r.forEach((o, l) => {
      o && typeof o == "object" && (o.item_id !== void 0 && o.item_id !== "" || o.item_name !== void 0 && o.item_name !== "") || i.push(`items[${l}] has neither item_id nor item_name`);
    });
  }
  return a.value !== void 0 && a.value !== null && !a.currency && i.push("value without currency"), n === "purchase" && !a.transaction_id && i.push("purchase without transaction_id"), !s && !$h(e[t - 1]) && i.push("no {ecommerce: null} pushed right before it"), i;
}
function jr(e, t = "", n = []) {
  if (n.length >= 500) return n;
  if (e !== null && typeof e == "object") {
    const a = Array.isArray(e) ? e.map((s, i) => [`${t}[${i}]`, s]) : Object.keys(e).map((s) => [
      /^[A-Za-z_$][\w$]*$/.test(s) ? t ? `${t}.${s}` : s : `${t}[${JSON.stringify(s)}]`,
      e[s]
    ]);
    return a.length === 0 && n.push({ path: t, value: Array.isArray(e) ? "[]" : "{}" }), a.forEach(([s, i]) => jr(i, s, n)), n;
  }
  return n.push({ path: t, value: e === void 0 ? "undefined" : JSON.stringify(e) }), n;
}
function Ph(e, t) {
  const n = t.filter((s) => typeof s.at == "number" && s.at <= e && e - s.at <= Oh).sort((s, i) => i.at - s.at);
  if (n.length === 0) return null;
  const a = n[0];
  return { id: a.id, label: `${a.method} ${a.url}`, gap: Math.round(e - a.at) };
}
const Ih = [
  { vendor: "Google Tag Manager", host: /googletagmanager\.com\/gtm\.js/, id: /[?&]id=(GTM-[A-Z0-9]+)/i },
  { vendor: "Google tag", host: /googletagmanager\.com\/gtag\/js/, id: /[?&]id=((?:G|AW|DC|GT)-[A-Z0-9]+)/i },
  { vendor: "Meta pixel", host: /connect\.facebook\.net\/.*\/fbevents\.js/, id: null },
  { vendor: "TikTok pixel", host: /analytics\.tiktok\.com/, id: /[?&]sdkid=([A-Z0-9]+)/i },
  { vendor: "Microsoft Clarity", host: /clarity\.ms\/tag\/([a-z0-9]+)/i, id: /clarity\.ms\/tag\/([a-z0-9]+)/i },
  { vendor: "Microsoft Ads (UET)", host: /bat\.bing\.com\/bat\.js/, id: null },
  { vendor: "Hotjar", host: /static\.hotjar\.com\/c\/hotjar-(\d+)/, id: /hotjar-(\d+)/ },
  { vendor: "LinkedIn Insight", host: /snap\.licdn\.com/, id: null },
  { vendor: "Pinterest tag", host: /s\.pinimg\.com\/ct\/core\.js/, id: null }
], Dh = [
  { vendor: "Meta pixel", pattern: /fbq\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/g },
  { vendor: "Pinterest tag", pattern: /pintrk\(\s*['"]load['"]\s*,\s*['"](\d+)['"]/g },
  { vendor: "TikTok pixel", pattern: /ttq\.load\(\s*['"]([A-Z0-9]+)['"]/gi },
  { vendor: "LinkedIn Insight", pattern: /_linkedin_partner_id\s*=\s*['"]?(\d+)/g }
];
function Kn(e) {
  return /^GTM-/i.test(e) ? "Google Tag Manager" : /^G-/i.test(e) ? "Google Analytics 4" : /^AW-/i.test(e) ? "Google Ads" : /^DC-/i.test(e) ? "Campaign Manager" : "Google tag";
}
function qh(e, t, n = []) {
  const a = /* @__PURE__ */ new Map(), s = (u, h, p, w = !1) => {
    const C = `${u}|${h}`, m = a.get(C) || { id: h, vendor: u, via: [], loads: 0 };
    m.via.includes(p) || m.via.push(p), w && (m.loads += 1), a.set(C, m);
  };
  Array.from(e.querySelectorAll("script[src]")).forEach((u) => {
    const h = u.getAttribute("src") || "";
    Ih.forEach((p) => {
      if (!p.host.test(h)) return;
      const w = p.id ? p.id.exec(h) : null, C = w ? p.vendor.startsWith("Google") ? w[1].toUpperCase() : w[1] : "";
      s(p.vendor === "Google tag" && C ? Kn(C) : p.vendor, C, "script", !0);
    });
  }), Array.from(e.querySelectorAll("script:not([src])")).forEach((u) => {
    const h = u.textContent || "";
    Dh.forEach((p) => {
      for (const w of h.matchAll(p.pattern)) s(p.vendor, w[1], "inline script");
    });
  });
  const i = /* @__PURE__ */ new Map();
  t.forEach((u) => {
    if (!u.gtag || !Array.isArray(u.value) || u.value[0] !== "config") return;
    const h = String(u.value[1] || "").toUpperCase();
    h && (i.set(h, (i.get(h) || 0) + 1), s(Kn(h), h, "gtag('config')"));
  }), n.filter((u) => /^(GTM|G|AW|DC|GT)-[A-Z0-9]+$/i.test(u)).forEach((u) => s(Kn(u.toUpperCase()), u.toUpperCase(), "loaded by Google"));
  const r = Array.from(a.values()), o = [];
  r.filter((u) => u.loads > 1).forEach((u) => {
    o.push(`${[u.vendor, u.id].filter(Boolean).join(" ")} is loaded ${u.loads} times.`);
  }), i.forEach((u, h) => {
    u > 1 && o.push(`${h} is configured ${u} times, so its page view can be sent more than once.`);
  });
  const l = r.filter((u) => u.vendor === "Google Tag Manager" && u.id);
  l.length > 1 && o.push(`${l.length} GTM containers (${l.map((u) => u.id).join(", ")}). Check that they do not both send to the same GA4 property; the page cannot tell which property a container sends to.`);
  const d = r.filter((u) => u.vendor === "Google Analytics 4");
  return d.length > 0 && l.length > 0 && d.some((u) => u.via.includes("gtag('config')")) && o.push("GA4 is configured with gtag() on a page that also loads GTM. If the container has a GA4 tag for the same property, every hit is sent twice."), { items: r, warnings: o };
}
function jh(e) {
  const t = {}, n = {}, a = [];
  e.forEach((o, l) => {
    const d = o.value;
    if (!o.gtag || !Array.isArray(d) || d[0] !== "consent") return;
    const u = String(d[1] || ""), h = d[2] && typeof d[2] == "object" ? d[2] : {};
    a.push({ kind: u, index: l, values: h }), Object.keys(h).forEach((p) => {
      const w = String(h[p]);
      u === "default" && !(p in t) && (t[p] = w), n[p] = w;
    });
  });
  const s = [], i = a.find((o) => o.kind === "default"), r = e.findIndex((o) => Uh(o));
  return i ? (r !== -1 && r < i.index && s.push("A tag fires before the consent default is set, so it runs with no consent state."), es.filter((o) => !(o in t)).forEach((o) => {
    s.push(`The consent default does not set ${o}${o.startsWith("ad_user") || o.startsWith("ad_pers") ? ", which Consent Mode v2 requires" : ""}.`);
  })) : r !== -1 && s.push("No consent default is set. Google's tags run without Consent Mode."), { defaults: t, current: n, calls: a, warnings: s };
}
function Uh(e) {
  const t = e.value;
  return e.gtag && Array.isArray(t) ? t[0] === "config" || t[0] === "event" : !!(t && typeof t == "object" && t.event === "gtm.js");
}
function Bh(e, t, { policy: n, page: a, requests: s }) {
  const i = e[t], { kind: r, name: o } = Nh(i), l = Pt(i.value, n);
  return {
    index: t,
    page: a,
    current: !0,
    kind: r,
    name: o,
    before: !!i.before,
    at: Math.round(i.at || 0),
    request: i.before ? null : Ph(i.at, s),
    problems: Rh(e, t),
    json: n === ne ? "" : JSON.stringify(l, null, 2),
    flat: n === ne ? [] : jr(l)
  };
}
function Fh({ pushes: e, requests: t, doc: n, loaded: a = [], policy: s, page: i, present: r }) {
  const o = e.map((p, w) => Bh(e, w, { policy: s, page: i, requests: t })), l = qh(n, e, a), d = jh(e), h = {
    pushes: o.filter((p) => p.problems.length > 0).length,
    tags: l.warnings.length,
    consent: d.warnings.length
  };
  return {
    present: r,
    pushes: o,
    tags: { items: l.items.map((p) => ({ ...p, where: p.via.join(", ") })), warnings: l.warnings },
    consent: {
      keys: es.map((p) => ({
        key: p,
        default: d.defaults[p] || "",
        current: d.current[p] || ""
      })),
      calls: d.calls.map((p) => ({ kind: p.kind, index: p.index })),
      updates: d.calls.filter((p) => p.kind === "update").length,
      warnings: d.warnings
    },
    counts: h,
    warningCount: h.pushes + h.tags + h.consent
  };
}
function Js() {
  return {
    present: !1,
    pushes: [],
    tags: { items: [], warnings: [] },
    consent: { keys: es.map((e) => ({ key: e, default: "", current: "" })), calls: [], updates: 0, warnings: [] },
    counts: { pushes: 0, tags: 0, consent: 0 },
    warningCount: 0
  };
}
function Hh(e) {
  try {
    const t = JSON.parse(e && e.getItem(va) || "[]");
    return Array.isArray(t) ? t.map((n) => ({ ...n, current: !1 })) : [];
  } catch {
    return [];
  }
}
function Wh(e, t, n, a) {
  if (e)
    try {
      if (a === ne) {
        e.removeItem(va);
        return;
      }
      let s = [...t, ...n].slice(-Ch).map((r) => ({ ...r, current: !1 })), i = JSON.stringify(s);
      for (; i.length > Mh && s.length > 0; )
        s = s.slice(Math.ceil(s.length / 4)), i = JSON.stringify(s);
      e.setItem(va, i);
    } catch {
    }
}
let Qt = null;
function Xs() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
function Gh() {
  const e = window.__siteationDebugBar;
  return e && Array.isArray(e.pushes) ? e : { pushes: [], requests: [] };
}
function zh(e) {
  const t = window.__siteationDebugBar;
  t && (t.onPush = e);
}
function Vh(e) {
  const t = Gh();
  Qt === null && (Qt = Hh(Xs()));
  let n = [];
  try {
    n = window.google_tag_manager ? Object.keys(window.google_tag_manager) : [];
  } catch {
    n = [];
  }
  const a = Fh({
    pushes: t.pushes,
    requests: t.requests || [],
    doc: document,
    loaded: n,
    policy: e,
    page: window.location.pathname,
    present: Array.isArray(window.dataLayer)
  });
  return Wh(Xs(), Qt, a.pushes, e), { model: a, earlier: Qt };
}
const Kh = {
  lcp: [2500, 4e3],
  cls: [0.1, 0.25],
  inp: [200, 500],
  fcp: [1800, 3e3],
  ttfb: [800, 1800]
}, Ur = {
  lcp: "largest-contentful-paint",
  cls: "layout-shift",
  inp: "event",
  fcp: "paint",
  ttfb: "navigation"
}, Jh = 104, Br = {
  lcp: "Largest Contentful Paint",
  cls: "Cumulative Layout Shift",
  inp: "Interaction to Next Paint",
  fcp: "First Contentful Paint",
  ttfb: "Time to First Byte"
}, Fr = ["lcp", "cls", "inp", "fcp", "ttfb"], Xh = 1e3, Zh = 5e3, Yh = 100, Qh = 20;
function ep(e, t) {
  const n = Kh[e];
  return !n || t === null || t === void 0 || Number.isNaN(t) ? "" : t > n[1] ? "poor" : t > n[0] ? "needs-improvement" : "good";
}
function Hr(e, t) {
  return t == null ? "" : e === "cls" ? t.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") || "0" : t >= 1e3 ? `${(t / 1e3).toFixed(2)} s` : `${Math.round(t)} ms`;
}
function ts(e) {
  if (!e || !e.tagName) return "";
  const t = e.tagName.toLowerCase();
  if (e.id) return `${t}#${e.id}`;
  const n = typeof e.className == "string" ? e.className.trim().split(/\s+/)[0] : "";
  return n ? `${t}.${n}` : t;
}
function tp(e = []) {
  const t = [...e];
  return {
    elements: t,
    /**
     * @param {Element|null|undefined} element
     * @returns {number} -1 when there is no element to point at
     */
    add(n) {
      if (!n || !n.tagName) return -1;
      const a = t.indexOf(n);
      return a !== -1 ? a : (t.push(n), t.length - 1);
    }
  };
}
function np(e, t, n) {
  const a = e[e.length - 1];
  return a ? {
    value: Math.max(0, a.startTime - t),
    element: {
      label: ts(a.element) || (a.url ? "an image no longer on the page" : "an element no longer on the page"),
      index: n.add(a.element),
      url: a.url || "",
      size: a.size || 0
    }
  } : { value: null, element: null };
}
function It(e, t) {
  return !!(e && t(e));
}
function Wr(e, t) {
  const n = e.filter((s) => !s.hadRecentInput && !((s.sources || []).length > 0 && s.sources.every((i) => It(i.node, t)))), a = [];
  return n.forEach((s) => {
    const i = a[a.length - 1], r = i && i[0], o = i && i[i.length - 1];
    i && s.startTime - o.startTime < Xh && s.startTime - r.startTime < Zh ? i.push(s) : a.push([s]);
  }), a;
}
function Gr(e) {
  return e.reduce((t, n) => t + n.value, 0);
}
function ap(e, t, n, a = /* @__PURE__ */ new WeakMap()) {
  const s = Wr(e, t), i = s.map(Gr), r = i.length ? i.indexOf(Math.max(...i)) : -1;
  let o = 0;
  const l = s.map((u) => (o = a.get(u[0]) ?? o + 1, a.set(u[0], o), o)), d = [];
  return s.forEach((u, h) => {
    u.forEach((p) => {
      d.push({
        at: Math.round(p.startTime),
        value: p.value,
        display: Hr("cls", p.value),
        window: l[h],
        worst: h === r,
        sources: (p.sources || []).filter((w) => !It(w.node, t)).map((w) => ({
          label: ts(w.node) || "an element no longer on the page",
          index: n.add(w.node)
        }))
      });
    });
  }), {
    // No shifts at all is a measured zero, as long as the browser can measure shifts.
    value: r === -1 ? 0 : i[r],
    shifts: d
  };
}
function sp(e, t, n, a, s = null) {
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  e.forEach((p) => {
    if (!p.interactionId || (r.add(p.interactionId), It(p.target, n))) return;
    const w = i.get(p.interactionId);
    (!w || p.duration > w.duration) && i.set(p.interactionId, p);
  });
  const o = Math.max(0, (t || 0) - (s ? s.seen : r.size)), l = Array.from(i.values()).sort((p, w) => w.duration - p.duration), d = s ? s.measured : l.length;
  if (l.length === 0) return { value: null, interaction: null, count: 0, unseen: o };
  const u = Math.max(t || 0, d), h = l[Math.min(l.length - 1, Math.floor(u / 50))];
  return {
    value: h.duration,
    interaction: {
      name: h.name,
      at: Math.round(h.startTime),
      label: ts(h.target) || "an element no longer on the page",
      index: a.add(h.target)
    },
    count: d,
    unseen: o
  };
}
function ip(e, t) {
  const n = e.find((a) => a.name === "first-contentful-paint");
  return n ? Math.max(0, n.startTime - t) : null;
}
function rp(e) {
  return !e || !(e.responseStart > 0) ? null : Math.max(0, e.responseStart - (e.activationStart || 0));
}
function Zs() {
  return {
    metrics: Fr.map((e) => ({
      id: e,
      label: e.toUpperCase(),
      name: Br[e],
      value: null,
      display: "",
      rating: "",
      supported: !0
    })),
    lcp: null,
    shifts: [],
    inp: { interaction: null, count: 0, unseen: 0 },
    poorCount: 0
  };
}
function op({
  entries: e,
  supported: t,
  interactionCount: n = 0,
  own: a = () => !1,
  known: s = [],
  interactions: i = null,
  windowNumbers: r = /* @__PURE__ */ new WeakMap()
}) {
  const o = tp(s), l = (g) => e[g] || [], d = l("navigation")[0], u = d && d.activationStart || 0, h = np(l("largest-contentful-paint"), u, o), p = ap(l("layout-shift"), a, o, r), w = sp(l("event"), n, a, o, i), C = {
    lcp: h.value,
    cls: p.value,
    inp: w.value,
    fcp: ip(l("paint"), u),
    ttfb: rp(d)
  }, m = Fr.map((g) => {
    const S = t.includes(Ur[g]);
    let L = S ? C[g] : null, he = Hr(g, L), pe = ep(g, L);
    return g === "inp" && S && L === null && w.unseen > 0 && (L = null, he = `under ${Jh} ms`, pe = "good"), { id: g, label: g.toUpperCase(), name: Br[g], value: L, display: he, rating: pe, supported: S };
  });
  return {
    model: {
      metrics: m,
      lcp: h.element,
      shifts: p.shifts,
      inp: { interaction: w.interaction, count: w.count, unseen: w.unseen },
      poorCount: m.filter((g) => g.rating === "poor").length
    },
    elements: o.elements
  };
}
function lp(e, t, n) {
  e.forEach((a) => {
    a.interactionId && (n.seen.add(a.interactionId), It(a.target, t) || n.measured.add(a.interactionId));
  });
}
function dp(e, t, { interactionCount: n = 0, measured: a = 0 } = {}) {
  const s = { ...e }, i = e["largest-contentful-paint"];
  if (i && i.length > 1 && (s["largest-contentful-paint"] = i.slice(-1)), e.event) {
    const r = Math.floor(Math.max(n || 0, a) / 50) + 1;
    s.event = cp(e.event, t, Math.max(Yh, r));
  }
  return e["layout-shift"] && (s["layout-shift"] = up(e["layout-shift"], t)), s;
}
function cp(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  e.forEach((i) => {
    if (!i.interactionId || It(i.target, t)) return;
    const r = a.get(i.interactionId);
    (!r || i.duration > r.duration) && a.set(i.interactionId, i);
  });
  const s = new Set(Array.from(a.values()).sort((i, r) => r.duration - i.duration).slice(0, n));
  return e.filter((i) => s.has(i));
}
function up(e, t) {
  const n = Wr(e, t), a = n.map(Gr), s = a.indexOf(Math.max(...a));
  return n.filter((i, r) => r === s || r >= n.length - (Qh - 1)).flat();
}
const Ie = {}, en = { seen: /* @__PURE__ */ new Set(), measured: /* @__PURE__ */ new Set() }, hp = /* @__PURE__ */ new WeakMap();
let mn = [];
const yn = /* @__PURE__ */ new Map();
let Ys = !1;
function zr() {
  try {
    return Array.from(PerformanceObserver.supportedEntryTypes || []);
  } catch {
    return [];
  }
}
function pp(e) {
  if (Ys || typeof PerformanceObserver > "u") return;
  Ys = !0;
  const t = zr();
  new Set(Object.values(Ur)).forEach((n) => {
    if (t.includes(n)) {
      Ie[n] = [];
      try {
        new PerformanceObserver((a) => {
          const s = a.getEntries().filter((i) => n !== "event" || i.interactionId > 0);
          s.length !== 0 && (Ie[n].push(...s), e());
        }).observe({ type: n, buffered: !0, ...n === "event" ? { durationThreshold: 16 } : {} });
      } catch {
        delete Ie[n];
      }
    }
  });
}
function fp(e) {
  let t = 0;
  try {
    t = Number(performance.interactionCount) || 0;
  } catch {
    t = 0;
  }
  const n = (i) => !!e && (i === e || typeof e.contains == "function" && e.contains(i));
  lp(Ie.event || [], n, en);
  const { model: a, elements: s } = op({
    entries: Ie,
    supported: zr(),
    interactionCount: t,
    // Seeded with the last read's elements, so a row being hovered while an entry arrives
    // still outlines, and later un-outlines, the element it did before.
    known: mn,
    own: n,
    interactions: { seen: en.seen.size, measured: en.measured.size },
    windowNumbers: hp
  });
  return mn = s, Object.assign(Ie, dp(Ie, n, {
    interactionCount: t,
    measured: en.measured.size
  })), a;
}
function bp(e) {
  const t = yn.get(e);
  t && (e.style.outline = t.outline, e.style.outlineOffset = t.offset, yn.delete(e));
}
function Vr(e, t) {
  const n = mn[e];
  if (!(!n || !n.style)) {
    if (!t) {
      bp(n);
      return;
    }
    yn.has(n) || yn.set(n, {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "2px";
  }
}
function gp(e) {
  const t = mn[e];
  !t || !t.isConnected || (t.scrollIntoView({ block: "center", behavior: "smooth" }), Vr(e, !0));
}
const mp = 1e3, Kr = "siteation.debugbar.v1", yp = "__PROFILE_ID__";
function vp() {
  const e = document.getElementById("siteation-debugbar-profile");
  if (!e) return {};
  try {
    return JSON.parse(e.textContent || "{}");
  } catch {
    return {};
  }
}
function wp() {
  const e = { open: !1, section: "overview" };
  try {
    return { ...e, ...JSON.parse(localStorage.getItem(Kr) || "{}") };
  } catch {
    return e;
  }
}
function ge(e, t, n) {
  const a = t.trim().toLowerCase();
  return a ? e.filter((s) => n.some(
    (i) => String(s[i] ?? "").toLowerCase().includes(a)
  )) : e;
}
function xp() {
  const e = {}, t = /* @__PURE__ */ new Map();
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
    // A handle from the Layout section. Kept apart from the search box, which filters on
    // what a block is, where this filters on what put it there.
    blockHandle: "",
    layoutSearch: "",
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
    seo: Ks(),
    seoError: "",
    /** @type {Array<number>} */
    schemaExpanded: [],
    schemaCopyState: "",
    schemaFallback: "",
    dataLayerTab: "pushes",
    dataLayer: Js(),
    /** @type {Array<object>} pushes from earlier pages in this tab, already cleaned */
    dataLayerEarlier: [],
    dataLayerError: "",
    dataLayerSearch: "",
    dataLayerFlat: !1,
    dataLayerThisPage: !1,
    /** @type {Array<string>} */
    dataLayerExpanded: [],
    dataLayerCopied: "",
    dataLayerTimer: null,
    vitals: Zs(),
    vitalsError: "",
    vitalsTimer: null,
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
    /** @type {Record<string, object>} the server's views of contributed sections, by id */
    views: {},
    /** @type {Array<import('./extensions.js').Definition>} sections other modules add */
    extensions: [],
    /** @type {Record<string, import('./extensions.js').View>} what each contributed reader last drew */
    extensionLive: {},
    /** @type {Record<string, string>} */
    extensionErrors: {},
    /** @type {Record<string, string>} the tab open in each contributed section */
    extensionTabs: {},
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
      this.profile = vp(), this.pageProfile = this.profile, this.activeId = this.profile.id || null, this.extensions = tu(
        this.rootElement()?.dataset.extensions,
        it.map((a) => a.id)
      );
      const n = wp();
      this.collapsed = !!n.collapsed, this.open = n.open && !this.collapsed, this.section = n.section, this.placement = n.placement === "top" ? "top" : "bottom", this.dockPosition = pc(n.dockPosition) ? n.dockPosition : null, this.maximised = !!n.maximised, this.theme = ["system", "light", "dark"].includes(n.theme) ? n.theme : "system", this.favourites = Array.isArray(n.favourites) ? n.favourites.filter((a) => it.some((s) => s.id === a) || this.isExtension(a)) : [], this.watchColorScheme(), this.valuePolicy = Lc(this.rootElement()?.dataset.valuePolicy), this.editorTemplate = this.rootElement()?.dataset.editor || "", this.editorRoot = this.rootElement()?.dataset.editorRoot || "", this.refreshAlpine(), this.refreshMagewire(), this.listenToMagewire(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.$watch("paletteSearch", () => {
        this.paletteIndex = 0;
      }), this.$watch("section", (a) => {
        a === "history" && this.loadHistory(), a === "seo" && this.refreshSeo(), a === "datalayer" && this.refreshDataLayer(), a === "vitals" && this.refreshVitals(), this.isExtension(a) && this.refreshExtension(a);
      }), this.scheduleSeo(), this.collects("datalayer") && (this.refreshDataLayer(), zh(() => {
        this.dataLayerTimer || (this.dataLayerTimer = setTimeout(() => {
          this.dataLayerTimer = null, this.refreshDataLayer();
        }, 50));
      })), this.collects("vitals") && pp(() => {
        this.vitalsTimer || (this.vitalsTimer = setTimeout(() => {
          this.vitalsTimer = null, this.refreshVitals();
        }, 50));
      }), this.open && this.section === "history" && this.loadHistory(), this.$watch("activeId", () => {
        this.comparison = null, this.baselineId = "", this.extensions.forEach((a) => this.refreshExtension(a.id));
      }), document.addEventListener("keydown", (a) => this.paletteShortcut(a)), this.open && this.$nextTick(() => this.lock()), this.requests = cc((a) => {
        this.requests.some((s) => s.id === a.id) || (this.requests = [a, ...this.requests].slice(0, 25));
      }).filter((a) => a.id !== this.profile.id), this.open && this.loadPayloads(), lu((a) => this.startExtension(a)).forEach((a) => this.startExtension(a)), this.scheduleDockConstraint();
    },
    /** @returns {HTMLElement|null} the host element, which carries the bar's settings */
    rootElement() {
      return this.$root.getRootNode().host ?? null;
    },
    /**
     * @param {string} id
     * @returns {string|null}
     */
    profileUrlFor(n) {
      const a = this.rootElement()?.dataset.profileUrl;
      return a ? a.replace(yp, encodeURIComponent(n)) : null;
    },
    /**
     * Swap the whole bar over to another profile the page has since produced.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async showProfile(n) {
      if (n === this.activeId) return;
      const a = this.profileUrlFor(n);
      if (a) {
        this.loading = !0, this.loadError = "";
        try {
          const { profile: s, payloads: i, views: r } = await Is(a);
          this.profile = s, this.payloads = i, this.views = r, this.activeId = n;
        } catch (s) {
          this.loadError = String(s.message || s);
        } finally {
          this.loading = !1;
        }
      }
    },
    /**
     * @param {boolean} force refetch even if the list is already loaded
     * @returns {Promise<void>}
     */
    async loadHistory(n = !1) {
      if (this.historyLoading || this.historyLoaded && !n) return;
      const a = this.rootElement()?.dataset.historyUrl;
      if (a) {
        this.historyLoading = !0, this.historyError = "";
        try {
          const s = await an(a);
          this.history = Array.isArray(s.profiles) ? s.profiles : [], this.historyLoaded = !0;
        } catch (s) {
          this.historyError = String(s.message || s);
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
      const n = this.profileUrlFor(this.activeId || this.profile.id || "");
      if (!n) return;
      this.copyState = "working", this.copyFallback = "";
      let a = "";
      try {
        const s = await fetch(`${n}format/markdown/`, { headers: { Accept: "text/markdown" } });
        if (!s.ok) throw new Error(`HTTP ${s.status}`);
        a = await s.text();
      } catch {
        this.copyState = "error", setTimeout(() => {
          this.copyState = "";
        }, 2500);
        return;
      }
      try {
        await navigator.clipboard.writeText(a), this.copyState = "done", setTimeout(() => {
          this.copyState = "";
        }, 2500);
      } catch {
        this.copyState = "failed", this.copyFallback = a;
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
      const n = this.history.filter((i) => i.profile_id !== this.activeId), a = this.request.path;
      return (n.find((i) => i.path === a) || n[0])?.profile_id || "";
    },
    /** @returns {Array<object>} everything except the profile being looked at */
    get baselineChoices() {
      return this.history.filter((n) => n.profile_id !== this.activeId);
    },
    /**
     * @returns {Promise<void>}
     */
    async compareProfiles() {
      const n = this.rootElement()?.dataset.compareUrl, a = this.baselineId || this.suggestedBaseline();
      if (!n || !a || !this.activeId || a === this.activeId) return;
      this.baselineId = a, this.comparing = !0, this.compareError = "";
      const s = `${n}baseline/${encodeURIComponent(a)}/subject/${encodeURIComponent(this.activeId)}/`;
      try {
        this.comparison = await an(s);
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
    deltaLabel(n) {
      return mu(n);
    },
    /**
     * @param {object} metric
     * @param {'baseline'|'subject'} side which profile's value the cell shows
     * @returns {string}
     */
    metricValue(n, a) {
      return yu(n, a);
    },
    /**
     * Loading one from the history means looking at a different request, so it lands on
     * the overview rather than leaving the reader on a panel about the old one.
     *
     * @param {string} id
     */
    async openFromHistory(n) {
      await this.showProfile(n), this.loadError || (this.section = "overview");
    },
    /**
     * @param {number} seconds a unix timestamp
     * @returns {string}
     */
    ago(n) {
      return fu(n);
    },
    /** Go back to the request that rendered the page. */
    showPageProfile() {
      this.activeId !== this.pageProfile.id && (this.profile = this.pageProfile, this.payloads = {}, this.views = {}, this.activeId = this.pageProfile.id || null, this.loadPayloads());
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
    waterfallBar(n) {
      const a = Math.max(Number(n.duration_percent) || 0, 0.4);
      return `left:${n.start_percent}%;width:${a}%`;
    },
    /**
     * @param {object} summary a request summary, or a history entry
     * @returns {string}
     */
    requestLabel(n) {
      return gu(n);
    },
    /**
     * @param {string} url
     * @returns {string}
     */
    shortUrl(n) {
      return bu(n, window.location.origin);
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
      const n = this.profileUrlFor(this.profile.id || "");
      if (n) {
        this.loading = !0, this.loadError = "";
        try {
          const { payloads: a, views: s } = await Is(n);
          this.payloads = a, this.views = s;
        } catch (a) {
          this.loadError = String(a.message || a);
        } finally {
          this.loading = !1;
        }
      }
    },
    /**
     * @param {string} key
     * @returns {object}
     */
    summaryOf(n) {
      return this.profile.sections?.[n]?.summary || {};
    },
    /**
     * @param {string} key
     * @returns {Array<object>}
     */
    itemsOf(n) {
      return this.payloads[n]?.items || this.profile.sections?.[n]?.payload?.items || [];
    },
    /** @returns {Array<object>} */
    get findings() {
      return this.profile.findings || [];
    },
    /** @returns {number} */
    get errorCount() {
      return this.findings.filter((n) => n.severity === "error").length;
    },
    /** @returns {number} */
    get warningCount() {
      return this.findings.filter((n) => n.severity === "warning").length;
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
    get pageCache() {
      return this.summaryOf("pagecache");
    },
    /** @returns {Array<object>} the blocks marked cacheable="false" that reached the page */
    get uncacheableBlocks() {
      return this.itemsOf("pagecache");
    },
    /**
     * The panel's one line answer, worded for someone who asked "is this cached?".
     *
     * @returns {string}
     */
    get pageCacheVerdict() {
      switch (this.pageCache.status) {
        case "hit":
          return "Served from the full page cache";
        case "stored":
          return "Not in the cache yet, stored for the next request";
        case "cacheable":
          return "Offered to Varnish as cacheable";
        case "not_cached":
          return "Not cached";
        case "not_applicable":
          return "Not a storefront page, so the page cache does not apply";
        default:
          return "Unknown";
      }
    },
    /** @returns {string} */
    get pageCacheTone() {
      return this.pageCache.status === "not_cached" ? "warn" : this.pageCache.status === "not_applicable" ? "dim" : "ok";
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
      const n = this.itemsOf("queries").filter((a) => this.queryFilter === "slow" ? a.slow : this.queryFilter === "repeated" ? Number(a.repeat_count || 1) > 1 : !0);
      return ge(n, this.querySearch, ["sql"]);
    },
    /** @returns {number} how many statements ran a shape that ran more than once */
    get repeatedCount() {
      return this.itemsOf("queries").filter((n) => Number(n.repeat_count || 1) > 1).length;
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const n = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((a) => a.observer_count === 0) : this.itemsOf("events");
      return ge(n, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return ge(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      const n = this.blockHandle ? this.itemsOf("blocks").filter((a) => this.blockHandles[a.name] === this.blockHandle) : this.itemsOf("blocks");
      return ge(n, this.blockSearch, ["name", "template", "class"]);
    },
    /** @returns {object} */
    get layout() {
      return this.summaryOf("layout");
    },
    /** @returns {Record<string, string>} each block on the page, to the handle that declared it */
    get blockHandles() {
      return this.payloads.layout?.blocks || this.profile.sections?.layout?.payload?.blocks || {};
    },
    /**
     * Matches a handle by its name or by any of its files, because the question is as
     * often "where does this theme file come in" as "what does this handle load".
     *
     * @returns {Array<object>}
     */
    get visibleHandles() {
      const n = this.layoutSearch.trim().toLowerCase(), a = this.itemsOf("layout");
      return n ? a.filter((s) => String(s.handle).toLowerCase().includes(n) || (s.files || []).some((i) => String(i.file).toLowerCase().includes(n))) : a;
    },
    /**
     * @param {object} file one of a handle's files
     * @returns {string} the theme that overrides it, or the module that ships it
     */
    layoutSource(n) {
      return n.theme ? n.theme + " theme" : n.module || "unknown module";
    },
    /**
     * The link from a handle to the blocks it put on the page.
     *
     * @param {string} handle
     */
    showHandleBlocks(n) {
      this.blockHandle = n, this.blockSearch = "", this.select("blocks");
    },
    /**
     * Key activity hides the long tail of fast points, which on a Magento page is most of
     * the list and none of the answer.
     *
     * @returns {Array<object>}
     */
    get visibleTimeline() {
      const n = this.timelineFilter === "key" ? this.itemsOf("timeline").filter(
        (a) => a.kind === "milestone" || Number(a.duration_ms || 0) >= 1
      ) : this.itemsOf("timeline");
      return ge(n, this.timelineSearch, ["label", "section"]);
    },
    /** @returns {Array<object>} */
    get timelineAxis() {
      const n = Number(this.timeline.scale_ms || 0);
      return [0, 0.25, 0.5, 0.75, 1].map((a) => ({
        percent: a * 100,
        label: `${(n * a).toFixed(n < 10 ? 1 : 0)} ms`
      }));
    },
    /** @returns {Array<object>} */
    get visiblePlugins() {
      const n = this.pluginSearch.trim().toLowerCase();
      return n ? this.itemsOf("interception").filter((a) => a.type.toLowerCase().includes(n) || a.plugins.some((s) => s.code.toLowerCase().includes(n) || s.class.toLowerCase().includes(n))) : this.itemsOf("interception");
    },
    /** @returns {Array<object>} */
    get visibleAlpineComponents() {
      const n = this.alpineTab === "deferred" ? this.alpineComponents.filter((a) => a.deferred) : this.alpineComponents;
      return ge(n, this.alpineSearch, ["name", "expression", "path"]);
    },
    /** @returns {number} */
    get alpineDeferredCount() {
      return this.alpineComponents.filter((n) => n.deferred).length;
    },
    /**
     * A deferred component that has not run yet is the usual answer to "why is nothing
     * happening", so it is worth counting on its own.
     *
     * @returns {number}
     */
    get alpinePendingCount() {
      return this.alpineComponents.filter((n) => !n.initialised).length;
    },
    /** @returns {string} */
    get alpineBuild() {
      return this.alpineHealth.csp === null ? "could not tell" : this.alpineHealth.csp ? "CSP friendly" : "standard";
    },
    /** @returns {Array<object>} */
    get commands() {
      return wc(this);
    },
    /** @returns {Array<object>} */
    get visibleCommands() {
      return Ec(this.commands, this.paletteSearch);
    },
    /** @returns {boolean} whether the page should be re-read on a timer */
    get alpineLiveWanted() {
      return this.open && !this.dismissed && this.alpineLive && this.section === "alpine";
    },
    /** @returns {string} */
    get statusPhrase() {
      const n = Number(this.request.status || 0);
      return this.request.completed === !1 ? "Threw" : n >= 500 ? "Error" : n >= 400 ? "Refused" : n >= 300 ? "Redirect" : "Success";
    },
    /** @returns {string} */
    get statusTone() {
      const n = Number(this.request.status || 0);
      return this.request.completed === !1 || n >= 500 ? "bad" : n >= 400 ? "warn" : "ok";
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
      const n = Number(this.request.status || 0), a = `${this.number(this.metrics.duration_ms, 2)} ms`;
      return this.request.completed === !1 ? `Stopped after ${a}, nothing was sent` : n >= 500 ? `Failed after ${a}` : n >= 400 ? `Refused after ${a}` : n >= 300 ? `Redirected after ${a}` : `Completed successfully in ${a}`;
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
      const n = this.cache.hit_rate;
      return n == null ? "ok" : n < 50 ? "warn" : "ok";
    },
    /**
     * A cached page never reaches most of the application, so an empty profile is the
     * expected result rather than a sign the bar is broken.
     *
     * @returns {boolean}
     */
    get looksLikeFullPageCacheHit() {
      return this.pageCache.status ? this.pageCache.status === "hit" : Number(this.queries.count || 0) === 0 && Number(this.events.count || 0) === 0;
    },
    /** @returns {Array<object>} every section with its count resolved */
    get sections() {
      return mc(this.rootElement()?.dataset.sections, this.extensions).map((n) => ({ ...n, count: yr(n.id, this) }));
    },
    /** @returns {Array<object>} pinned sections, in the order they were arranged */
    get favouriteSections() {
      return this.favourites.map((n) => this.sections.find((a) => a.id === n)).filter(Boolean);
    },
    /** @returns {Array<object>} */
    get otherSections() {
      return this.sections.filter((n) => !this.favourites.includes(n.id));
    },
    /** @returns {object} */
    get currentSection() {
      return this.sections.find((n) => n.id === this.section) || this.sections[0];
    },
    /**
     * A section shows its own findings at the top, so the evidence and the conclusion sit
     * together rather than in two different places.
     *
     * @returns {Array<object>}
     */
    get sectionFindings() {
      return this.section === "findings" ? [] : this.findings.filter((n) => n.section === this.section);
    },
    /**
     * Whether to say that nothing in this section matched a rule.
     *
     * The SEO rules read the server's HTML, and the panel below reads the live page with
     * checks of its own. "No clear problem found" above a list of the panel's own warnings
     * would contradict it, so the line is only drawn when both agree.
     *
     * @returns {boolean}
     */
    get sectionClear() {
      return this.currentSection.graded === !1 || this.section === "findings" || this.sectionFindings.length > 0 ? !1 : this.section !== "seo" || !this.seo.warningCount;
    },
    /** @param {string} id */
    isFavourite(n) {
      return this.favourites.includes(n);
    },
    /** @param {string} id */
    toggleFavourite(n) {
      this.favourites = this.isFavourite(n) ? this.favourites.filter((a) => a !== n) : [...this.favourites, n], this.persist();
    },
    /** @param {string} id */
    startDrag(n) {
      this.draggingId = n;
    },
    /** @param {string} id */
    dragOver(n) {
      this.draggingId && n !== this.draggingId && (this.dropTargetId = n);
    },
    /** @param {string} id */
    drop(n) {
      const a = this.favourites.indexOf(this.draggingId), s = this.favourites.indexOf(n);
      if (a > -1 && s > -1 && a !== s) {
        const i = [...this.favourites];
        i.splice(s, 0, i.splice(a, 1)[0]), this.favourites = i, this.persist();
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
      const n = window.matchMedia("(prefers-color-scheme: light)"), a = () => {
        this.resolvedTheme = this.theme === "system" ? n.matches ? "light" : "dark" : this.theme;
      };
      a(), this.stopWatchingScheme?.(), n.addEventListener("change", a), this.stopWatchingScheme = () => n.removeEventListener("change", a);
    },
    /**
     * System, light, dark, and round again.
     *
     * The palette names all three, which is what you want when you know where you are
     * going. This is for the other case: it is dark, it should not be, and one click is
     * the whole thought.
     */
    cycleTheme() {
      const n = ["system", "light", "dark"];
      this.setTheme(n[(n.indexOf(this.theme) + 1) % n.length]);
    },
    /** @param {string} theme */
    setTheme(n) {
      this.theme = ["system", "light", "dark"].includes(n) ? n : "system", this.watchColorScheme(), this.persist();
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
    openFromBar(n) {
      if (n.target.closest("button")) return;
      const a = this.$root.getRootNode(), s = typeof a.getSelection == "function" ? a.getSelection() : document.getSelection();
      s && !s.isCollapsed || this.openInspector();
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
    startDockDrag(n) {
      if (n.button !== 0 || !n.isPrimary) return;
      this.dockDragMoved = !1;
      const a = this.$refs.dock;
      if (!a) return;
      const s = a.getBoundingClientRect();
      this.dockDrag = {
        pointerId: n.pointerId,
        pointerX: n.clientX,
        pointerY: n.clientY,
        left: s.left,
        top: s.top,
        width: s.width,
        height: s.height,
        moved: !1
      }, n.currentTarget.setPointerCapture(n.pointerId);
    },
    /** @param {PointerEvent} event */
    moveDockDrag(n) {
      const a = this.dockDrag;
      if (!a || a.pointerId !== n.pointerId) return;
      const s = n.clientX - a.pointerX, i = n.clientY - a.pointerY;
      !a.moved && !gc(s, i) || (a.moved = !0, this.draggingDock = !0, this.dockPosition = Wn(
        { left: a.left + s, top: a.top + i },
        a,
        { width: window.innerWidth, height: window.innerHeight }
      ), n.preventDefault());
    },
    /** @param {PointerEvent} event */
    endDockDrag(n) {
      const a = this.dockDrag;
      !a || a.pointerId !== n.pointerId || (this.moveDockDrag(n), this.draggingDock = !1, this.dockDrag = null, a.moved && (this.dockDragMoved = !0, this.updatePlacementFromDock(), this.persist()));
    },
    /**
     * A button labelled "Move" must work without a pointing device too. Enter and Space are
     * the keyboard's double click, so they reset rather than doing nothing.
     *
     * @param {KeyboardEvent} event
     */
    moveDockWithKeyboard(n) {
      if (n.key === "Enter" || n.key === " ") {
        this.resetDockPosition(), n.preventDefault();
        return;
      }
      const a = {
        ArrowLeft: [-10, 0],
        ArrowRight: [10, 0],
        ArrowUp: [0, -10],
        ArrowDown: [0, 10]
      }[n.key];
      if (!a) return;
      const s = this.$refs.dock;
      if (!s) return;
      const i = s.getBoundingClientRect();
      this.dockPosition = Wn(
        { left: i.left + a[0], top: i.top + a[1] },
        i,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), this.persist(), n.preventDefault();
    },
    /** @param {MouseEvent} event */
    resetDockFromGrip(n) {
      n.preventDefault(), !this.dockDragMoved && this.resetDockPosition();
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
      const n = this.$refs.dock;
      if (!this.dockPosition || !n || this.open || this.collapsed || this.dismissed) return;
      const a = n.getBoundingClientRect();
      if (a.width === 0 || a.height === 0) return;
      const s = this.dockPosition, i = this.placement;
      this.dockPosition = Wn(
        this.dockPosition,
        a,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), (s.left !== this.dockPosition.left || s.top !== this.dockPosition.top || i !== this.placement) && this.persist();
    },
    /** Keep the edge-bound inspector and bubble near the freely positioned dock. */
    updatePlacementFromDock() {
      const n = this.$refs.dock;
      !this.dockPosition || !n || (this.placement = fc(
        this.dockPosition,
        n.getBoundingClientRect(),
        window.innerHeight
      ));
    },
    openInspector() {
      this.open || (this.collapsed = !1, this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), hc(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus(), this.scheduleDockConstraint());
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
      uc(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(n) {
      if (n.key === "Escape") {
        this.closeInspector();
        return;
      }
      Ns(n, this.$refs.sheet);
    },
    /** @param {string} section */
    select(n) {
      this.section = n, this.navOpen = !1, this.openInspector(), this.persist();
    },
    /**
     * Findings are only useful if they lead somewhere, so each one carries the section
     * and filter that hold its evidence.
     *
     * @param {object} action
     */
    follow(n) {
      n && (n.filter && n.section === "queries" && (this.queryFilter = n.filter, this.querySearch = ""), n.filter && n.section === "seo" && (this.seoTab = n.filter), n.filter && this.isExtension(n.section) && (this.extensionTabs = { ...this.extensionTabs, [n.section]: n.filter }), this.select(n.section));
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
      this.magewireHealth = Eu(), this.magewireComponents = _u(this.valuePolicy), this.magewireExpanded.forEach((n) => {
        this.magewireStates[n] = js(n, this.valuePolicy);
      });
    },
    /**
     * Magewire loads before Alpine and the bar loads after both, so its global is normally
     * there already. Normally is not always: a page that defers it, or one where the bar
     * boots first, would otherwise have no hooks at all and a permanently empty list.
     */
    listenToMagewire() {
      const n = (a) => {
        this.magewireMessages = [a, ...this.magewireMessages].slice(0, 25), this.refreshMagewire();
      };
      Us(n) || document.addEventListener("magewire:load", () => {
        Us(n), this.refreshMagewire();
      }, { once: !0, passive: !0 });
    },
    /** @param {string} id */
    toggleMagewireComponent(n) {
      if (this.magewireExpanded.includes(n)) {
        this.magewireExpanded = this.magewireExpanded.filter((a) => a !== n), delete this.magewireStates[n];
        return;
      }
      this.magewireExpanded = [...this.magewireExpanded, n], this.magewireStates[n] = js(n, this.valuePolicy);
    },
    /** @param {string} id */
    isMagewireExpanded(n) {
      return this.magewireExpanded.includes(n);
    },
    /**
     * @param {string} id
     * @param {boolean} on
     */
    highlightMagewire(n, a) {
      Su(n, a);
    },
    /**
     * What the server sent for this document against the page as it is now. The page's own
     * profile, never the one in view: only that request sent this HTML.
     */
    get seoServer() {
      return _h(this.pageProfile.sections?.seo?.summary, this.seo);
    },
    /**
     * Where the server got each value: the attribute, CMS field or setting, with a link to
     * edit it. Only for this page, whose payload is the one loaded while it is in view.
     *
     * @returns {Array<object>}
     */
    get seoSources() {
      return !this.pageProfile.id || this.profile.id !== this.pageProfile.id ? [] : this.payloads.seo?.sources || this.profile.sections?.seo?.payload?.sources || [];
    },
    /** @returns {boolean} a page the server would have sources for, with none recorded */
    get seoSourcesMissing() {
      return !!this.pageProfile.sections?.seo?.summary?.page_type && !this.loading && this.seoSources.length === 0;
    },
    /**
     * Read once the page has loaded, so images have their real sizes and the sidebar count
     * is there before the section is opened. Opening it reads again, since a page changes.
     */
    scheduleSeo() {
      if (!this.collects("seo")) return;
      const n = () => setTimeout(() => this.refreshSeo(), 0);
      document.readyState === "complete" ? n() : window.addEventListener("load", n, { once: !0, passive: !0 });
    },
    refreshSeo() {
      if (!this.collects("seo")) return;
      const n = this.pageProfile.sections?.request?.summary?.robots_header || "";
      try {
        this.seo = Eh(n), this.seoError = "";
      } catch (a) {
        this.seo = Ks(), this.seoError = String(a && a.message || a);
      }
    },
    /**
     * @param {string} view
     * @param {number} index
     * @param {boolean} on
     */
    highlightSeo(n, a, s) {
      ya(n, a, s);
    },
    /**
     * @param {string} view
     * @param {number} index
     */
    revealSeo(n, a) {
      Ah(n, a);
    },
    /**
     * @param {number} index
     * @returns {boolean}
     */
    isSchemaExpanded(n) {
      return this.schemaExpanded.includes(n);
    },
    /**
     * @param {object} entity
     * @returns {number}
     */
    schemaRequired(n) {
      return (n.findings || []).filter((a) => a.level === "required").length;
    },
    /** @param {number} index */
    toggleSchemaEntity(n) {
      this.schemaExpanded = this.isSchemaExpanded(n) ? this.schemaExpanded.filter((a) => a !== n) : [...this.schemaExpanded, n];
    },
    /**
     * A microdata entity is an element on the page, so its row can point at it. A JSON-LD
     * one is a script, which has nothing to point at.
     *
     * @param {object} entity
     * @param {boolean} on
     */
    highlightSchema(n, a) {
      n.source === "microdata" && ya("schema", n.block, a);
    },
    /**
     * The validators cannot fetch a dev shop, so what they need goes on the clipboard to be
     * pasted into their code mode instead.
     *
     * @returns {Promise<void>}
     */
    async copySchemaMarkup() {
      const n = Sh();
      this.schemaFallback = "";
      try {
        await navigator.clipboard.writeText(n), this.schemaCopyState = "done", setTimeout(() => {
          this.schemaCopyState = "";
        }, 2500);
      } catch {
        this.schemaCopyState = "", this.schemaFallback = n;
      }
    },
    refreshDataLayer() {
      if (this.collects("datalayer"))
        try {
          const { model: n, earlier: a } = Vh(this.valuePolicy);
          n.pushes.forEach((s) => {
            s.key = `c${s.index}`;
          }), this.dataLayer = n, this.dataLayerEarlier = a.map((s, i) => ({ ...s, key: `e${i}` })), this.dataLayerError = "";
        } catch (n) {
          this.dataLayer = Js(), this.dataLayerError = String(n && n.message || n);
        }
    },
    /**
     * Earlier pages first, then this one, newest last: the order they were pushed in.
     *
     * @returns {Array<object>}
     */
    get visibleDataLayerPushes() {
      const n = this.dataLayerThisPage ? this.dataLayer.pushes : [...this.dataLayerEarlier, ...this.dataLayer.pushes];
      return ge(n, this.dataLayerSearch, ["name", "page", "json"]);
    },
    /**
     * @param {string} key
     * @returns {boolean}
     */
    isDataLayerExpanded(n) {
      return this.dataLayerExpanded.includes(n);
    },
    /** @param {string} key */
    toggleDataLayerPush(n) {
      this.dataLayerExpanded = this.isDataLayerExpanded(n) ? this.dataLayerExpanded.filter((a) => a !== n) : [...this.dataLayerExpanded, n];
    },
    /**
     * Whether a push starts a new page in the list, so the page it was pushed on is shown
     * once above its pushes rather than on every row.
     *
     * @param {object} push
     * @param {number} position in visibleDataLayerPushes
     * @returns {boolean}
     */
    startsDataLayerPage(n, a) {
      const s = this.visibleDataLayerPushes[a - 1];
      return !s || s.page !== n.page || s.current !== n.current;
    },
    /**
     * The path of a value, as a GTM data layer variable wants it.
     *
     * @param {string} path
     * @returns {Promise<void>}
     */
    async copyDataLayerPath(n) {
      try {
        await navigator.clipboard.writeText(n), this.dataLayerCopied = n, setTimeout(() => {
          this.dataLayerCopied === n && (this.dataLayerCopied = "");
        }, 2e3);
      } catch {
        this.dataLayerCopied = "";
      }
    },
    refreshVitals() {
      if (this.collects("vitals"))
        try {
          this.vitals = fp(this.rootElement()), this.vitalsError = "";
        } catch (n) {
          this.vitals = Zs(), this.vitalsError = String(n && n.message || n);
        }
    },
    /**
     * @param {number} index
     * @param {boolean} on
     */
    highlightVital(n, a) {
      Vr(n, a);
    },
    /** @param {number} index */
    revealVital(n) {
      gp(n);
    },
    /**
     * @param {string} rating good, needs-improvement or poor
     * @returns {string}
     */
    vitalTone(n) {
      return { good: "is-ok", "needs-improvement": "is-warn", poor: "is-bad" }[n] || "";
    },
    /** @returns {string} the admin redirect for what this page shows, '' when it is not known */
    get adminEditUrl() {
      return this.rootElement()?.dataset.adminEdit || "";
    },
    /** @returns {Array<object>} */
    get visibleSeoImages() {
      const n = this.seo.images?.items || [], a = this.seoProblemsOnly ? n.filter((s) => s.warnings.length > 0) : n;
      return ge(a, this.seoSearch, ["src", "alt"]);
    },
    /** @returns {Array<object>} */
    get visibleSeoLinks() {
      const n = this.seo.links?.items || [], a = this.seoProblemsOnly ? n.filter((s) => s.warnings.length > 0) : n;
      return ge(a, this.seoSearch, ["href", "text"]);
    },
    /**
     * @param {string|null} alt
     * @returns {string}
     */
    altLabel(n) {
      return n === null ? "no alt" : n === "" ? 'alt=""' : n;
    },
    refreshAlpine() {
      this.alpineHealth = Ru(), this.alpineComponents = Nu(this.valuePolicy), this.alpineStores = Lu(this.valuePolicy), this.alpineErrors = $u(this.valuePolicy), this.alpineExpanded.forEach((n) => {
        this.alpineStates[n] = Ws(n, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, mp);
        return;
      }
      !this.alpineLiveWanted && this.alpineTimer && (clearInterval(this.alpineTimer), this.alpineTimer = null);
    },
    /**
     * @param {number} id
     * @returns {boolean}
     */
    isAlpineExpanded(n) {
      return this.alpineExpanded.includes(n);
    },
    /**
     * State is read here rather than during the scan, because a page carries dozens of
     * components and walking all of them to fill rows nobody opened is work for nothing.
     *
     * @param {number} id
     */
    toggleAlpineComponent(n) {
      if (this.isAlpineExpanded(n)) {
        this.alpineExpanded = this.alpineExpanded.filter((a) => a !== n), delete this.alpineStates[n];
        return;
      }
      this.alpineExpanded = [...this.alpineExpanded, n], this.alpineStates[n] = Ws(n, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(n, a) {
      Pu(n, a);
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
    paletteShortcut(n) {
      this.dismissed || n.code !== "KeyP" || !n.shiftKey || !(n.metaKey || n.ctrlKey) || (n.preventDefault(), this.togglePalette());
    },
    /** @param {KeyboardEvent} event */
    paletteKeys(n) {
      if (n.key === "Escape") {
        n.stopPropagation(), this.closePalette();
        return;
      }
      if (n.key === "ArrowDown") {
        n.preventDefault(), this.movePalette(1);
        return;
      }
      if (n.key === "ArrowUp") {
        n.preventDefault(), this.movePalette(-1);
        return;
      }
      if (n.key === "Enter") {
        n.preventDefault(), this.runCommand(this.visibleCommands[this.paletteIndex]);
        return;
      }
      Ns(n, this.$refs.palette);
    },
    /** @param {number} step */
    movePalette(n) {
      const a = this.visibleCommands.length;
      a !== 0 && (this.paletteIndex = (this.paletteIndex + n + a) % a, this.$nextTick(() => {
        this.$refs.palette?.querySelector(".ndb-palette-item.is-active")?.scrollIntoView({ block: "nearest" });
      }));
    },
    /**
     * The palette closes first, so focus goes back to whatever opened it before the
     * command moves it somewhere else.
     *
     * @param {object} command
     */
    runCommand(n) {
      if (n)
        switch (this.closePalette(), n.kind) {
          case "section":
            this.select(n.arg);
            break;
          case "theme":
            this.setTheme(n.arg);
            break;
          case "placement":
            this.movePlacement();
            break;
          case "dock-reset":
            this.resetDockPosition();
            break;
          case "favourite":
            this.toggleFavourite(n.arg);
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
    /**
     * @param {string} id
     * @returns {boolean} whether another module added this section
     */
    isExtension(n) {
      return this.extensions.some((a) => a.id === n);
    },
    /**
     * Once per reader, whenever it registers: start its watch, then read.
     *
     * @param {string} id
     */
    startExtension(n) {
      !this.isExtension(n) || !this.collects(n) || (cu(n, () => this.scheduleExtension(n)), this.refreshExtension(n));
    },
    /**
     * A burst of page changes is one read, a frame later, as with the data layer.
     *
     * @param {string} id
     */
    scheduleExtension(n) {
      e[n] || (e[n] = setTimeout(() => {
        delete e[n], this.refreshExtension(n);
      }, 50));
    },
    /**
     * Asks the section's reader for its live view. What it throws is shown in the panel,
     * because a reader that fails quietly is a section that looks empty for no reason.
     *
     * @param {string} id
     * @returns {Promise<void>}
     */
    async refreshExtension(n) {
      if (!(!du(n) || !this.collects(n)))
        try {
          const a = await uu(n, this.extensionContext(n));
          if (a === null) return;
          this.extensionLive = { ...this.extensionLive, [n]: a }, this.extensionErrors = { ...this.extensionErrors, [n]: "" };
        } catch (a) {
          this.extensionErrors = { ...this.extensionErrors, [n]: String(a?.message || a) };
        }
    },
    /**
     * What a reader is given. Read only: these are the bar's own objects.
     *
     * @param {string} id
     * @returns {object}
     */
    extensionContext(n) {
      const a = this.valuePolicy;
      return {
        section: n,
        profile: this.profile,
        payload: this.payloads[n] || this.profile.sections?.[n]?.payload || {},
        requests: this.requests.slice(),
        valuePolicy: a,
        clean: (s) => Pt(s, a),
        loadProfile: (s) => {
          const i = this.profileUrlFor(s);
          return i ? an(i) : Promise.reject(new Error("The bar has no profile URL."));
        }
      };
    },
    /**
     * @param {string} id
     * @returns {import('./extensions.js').View}
     */
    extensionView(n) {
      const a = this.views[n], s = this.extensionLive[n], i = t.get(n);
      if (i && i.server === a && i.live === s) return i.view;
      const r = nu(a ? Ga(a) : null, s || null);
      return t.set(n, { server: a, live: s, view: r }), r;
    },
    /**
     * @param {string} id
     * @returns {number|null}
     */
    extensionCount(n) {
      return this.extensionView(n).count ?? au(this.summaryOf(n));
    },
    /**
     * The contributed section in view, shaped for the generic panel.
     *
     * @returns {{tabs: Array<object>, tab: string, blocks: Array<object>, error: string, empty: boolean}}
     */
    get extension() {
      const n = this.currentSection.id;
      if (!this.isExtension(n)) return { tabs: [], tab: "", blocks: [], error: "", empty: !0 };
      const a = this.extensionView(n), s = a.tabs.find((i) => i.id === this.extensionTabs[n]) || a.tabs[0];
      return {
        tabs: a.tabs.length > 1 ? a.tabs : [],
        tab: s.id,
        blocks: s.blocks,
        error: this.extensionErrors[n] || "",
        empty: a.tabs.every((i) => i.blocks.length === 0)
      };
    },
    /** @param {string} tab */
    selectExtensionTab(n) {
      this.extensionTabs = { ...this.extensionTabs, [this.currentSection.id]: n };
    },
    /**
     * @param {string} target
     * @param {boolean} on
     */
    highlightExtension(n, a) {
      hu(this.currentSection.id, n, a);
    },
    collects(n) {
      return this.sections.some((a) => a.id === n);
    },
    isSection(n) {
      return this.currentSection.id === n;
    },
    persist() {
      try {
        localStorage.setItem(Kr, JSON.stringify({
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
    number(n, a = 0) {
      return za(n, a);
    },
    /**
     * @param {object} plugin
     * @returns {string}
     */
    methodList(n) {
      return vu(n);
    },
    /**
     * @param {unknown} code
     * @param {string} language
     * @returns {string} HTML for x-html, escaped by the highlighter
     */
    highlight(n, a) {
      return Zc(n, a);
    },
    /**
     * @param {string} file
     * @param {number} line
     * @returns {string}
     */
    editorUrl(n, a) {
      return Tr(this.editorTemplate, this.editorRoot, n, a);
    },
    /**
     * @param {string} location
     * @returns {string}
     */
    locationUrl(n) {
      return wu(this.editorTemplate, this.editorRoot, n);
    },
    /**
     * The frame a query came from. The resolver drops framework and generated code, so the
     * first frame left is the application's own.
     *
     * @param {object} query
     * @returns {object|null}
     */
    callSite(n) {
      const a = n?.callsite?.[0];
      return a && a.file ? a : null;
    },
    /**
     * @param {number} count
     * @param {string} one
     * @param {string} many
     * @returns {string}
     */
    plural(n, a, s) {
      return pu(n, a, s);
    },
    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(n) {
      return Va(n);
    }
  };
}
function de(e) {
  return `<dl class="ndb-facts">${e.map((n) => {
    const a = ["ndb-fact-value", n.mono ? "ndb-mono" : ""].filter(Boolean).join(" "), s = n.tone ? ` data-ndb-bind:class="'is-' + (${n.tone})"` : "", i = n.raw ? `<dd class="${a}"${s}>${n.value}</dd>` : `<dd class="${a}"${s} data-ndb-text="${n.value}"></dd>`, r = n.when ? ` data-ndb-if="${n.when}"` : "", o = `
  <div class="ndb-fact">
    <dt>${n.label}</dt>
    ${i}
  </div>`;
    return n.when ? `
  <template${r}>${o}
  </template>` : o;
  }).join("")}
</dl>`;
}
function Qs({ sheet: e }) {
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
    ${q("grip")}
  </button>

`}
  <button type="button" class="ndb-request" data-ndb-on:click="select('overview')"
          data-ndb-bind:title="request.path">
    <span class="ndb-method" data-ndb-text="request.method || 'GET'"></span>
    <span class="ndb-request-body">
      <span class="ndb-path" data-ndb-text="requestLabel(request)"></span>
      <span class="ndb-request-meta">
        <span data-ndb-bind:class="'is-' + statusTone" data-ndb-text="request.status"></span>
        <span class="ndb-status-phrase" data-ndb-text="statusPhrase"></span>
        <span class="ndb-dim" data-ndb-text="bytes(request.response_bytes)"></span>
      </span>
    </span>
  </button>

${e ? "" : `  <div class="ndb-stats">
    <div class="ndb-stat is-mode">
      <span class="ndb-env-dot" data-ndb-bind:class="'is-' + modeTone"></span>
      <span>
        <span class="ndb-stat-key">Mode</span>
        <span class="ndb-stat-value" data-ndb-text="request.mode || 'unknown'"></span>
      </span>
    </div>

    <div class="ndb-stat is-queries">
      ${q("database", "is-accent")}
      <span>
        <span class="ndb-stat-key">Queries</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + queryTone">
          <span data-ndb-text="queries.count || 0"></span>
          <span class="ndb-dim" data-ndb-text="number(queries.duration_ms, 2) + ' ms'"></span>
        </span>
      </span>
    </div>

    <div class="ndb-stat">
      ${q("clock", "is-accent")}
      <span>
        <span class="ndb-stat-key">Duration</span>
        <span class="ndb-stat-value" data-ndb-bind:class="'is-' + durationTone"
              data-ndb-text="number(metrics.duration_ms, 2) + ' ms'"></span>
      </span>
    </div>

    <div class="ndb-stat is-peak">
      ${q("chip", "is-accent")}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </div>
  </div>`}

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button is-optional" data-ndb-on:click="openPalette()"
            title="Search sections and settings">
      ${q("search")}
    </button>

    <button type="button" class="ndb-icon-button is-optional" data-ndb-on:click="cycleTheme()"
            data-ndb-bind:title="'Theme: ' + theme + '. Click for the next one.'">
      ${q("monitor", "", `data-ndb-show="theme === 'system'"`)}
      ${q("sun", "", `data-ndb-show="theme === 'light'"`)}
      ${q("moon", "", `data-ndb-show="theme === 'dark'"`)}
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="select('findings')"
            data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
            title="Findings">
      ${q("alert")}
      <span class="ndb-badge" data-ndb-show="findings.length > 0"
            data-ndb-text="findings.length"></span>
    </button>

    <span class="ndb-controls-divider"></span>

    ${e ? `
    <button type="button" class="ndb-icon-button" data-ndb-on:click="toggleMaximised()"
            data-ndb-bind:title="maximised ? 'Restore' : 'Maximise'">
      ${q("expand", "", 'data-ndb-show="!maximised"')}
      ${q("collapse", "", 'data-ndb-show="maximised"')}
    </button>
    <button type="button" class="ndb-icon-button" data-ndb-on:click="closeInspector()"
            title="Minimise">
      ${q("minimise")}
    </button>
    ` : `
    <button type="button" class="ndb-icon-button is-open" data-ndb-on:click="openInspector()"
            title="Open the inspector">
      ${q("expand")}
    </button>
    `}

    <button type="button" class="ndb-icon-button" data-ndb-on:click="collapse()"
            title="Collapse to a bubble">
      ${q("close")}
    </button>
  </div>
</div>`;
}
function ei(e, t) {
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
      ${q("star")}
    </button>
  </div>
</template>`;
}
function _p() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${ei("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${ei("otherSections", !1)}
</nav>`;
}
function yt(e, t) {
  return `<div class="ndb-subtabs" role="tablist">${t.map((a) => `
  <button type="button" class="ndb-subtab" role="tab"
          data-ndb-bind:aria-selected="${e} === '${a.id}' ? 'true' : 'false'"
          data-ndb-bind:class="${e} === '${a.id}' && 'is-active'"
          data-ndb-on:click="${e} = '${a.id}'">
    <span>${a.label}</span>
    ${a.count ? `<span class="ndb-pill"${a.tone ? ` data-ndb-bind:class="'is-' + (${a.tone})"` : ""}
            ${a.always ? "" : `data-ndb-show="${a.count}"`}
            data-ndb-text="${a.count}"></span>` : ""}
  </button>`).join("")}</div>`;
}
const kp = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme"
     data-ndb-on:resize.window="constrainDock()">

  <div class="ndb-dock" data-ndb-ref="dock"
       data-ndb-show="!open && !dismissed && !collapsed" data-ndb-cloak
       data-ndb-bind:class="draggingDock && 'is-dragging'"
       data-ndb-bind:style="dockStyle"
       title="Open the inspector" data-ndb-on:click="openFromBar($event)">
    ${Qs({ sheet: !1 })}
  </div>

  <button type="button" class="ndb-bubble" data-ndb-show="collapsed && !dismissed" data-ndb-cloak
          data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
          data-ndb-on:click="expand()"
          aria-label="Show the debug bar" title="Show the debug bar">
    ${q("pulse")}
    <span class="ndb-badge" data-ndb-show="findings.length > 0"
          data-ndb-text="findings.length"></span>
  </button>

  ${Sc()}

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${Qs({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${q("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${_p()}

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

      <div class="ndb-callout is-clear" data-ndb-show="sectionClear">
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
            ${de([
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
            ${de([
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
            ${de([
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
            ${de([
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

      <template data-ndb-if="isSection('pagecache')">
      <div>
        ${de([
  { label: "Verdict", value: "pageCacheVerdict", tone: "pageCacheTone" },
  {
    label: "Full page cache",
    value: "(pageCache.type === 'varnish' ? 'Varnish' : 'Built-in') + (pageCache.enabled ? ', on' : ', off') + (pageCache.ttl ? ', ' + pageCache.ttl + ' s' : '')"
  },
  { label: "Request", value: "(pageCache.method || 'GET') + (pageCache.is_secure ? ' over HTTPS' : ' over HTTP')" },
  { label: "Action", value: "pageCache.action || 'none'", mono: !0 }
])}

        <p class="ndb-note" data-ndb-show="pageCache.status === 'hit'">
          The cache answered before Magento routed the request, so no layout, block or query
          ran. Reasons only exist for a page that was generated: reload with the cache cleaned
          to see them.
        </p>

        <p class="ndb-note" data-ndb-show="pageCache.status === 'cacheable'">
          Varnish decides out of sight of PHP. This says the response was offered as
          cacheable, not that Varnish kept it.
        </p>

        <template data-ndb-if="(pageCache.reasons || []).length">
        <div>
          <div class="ndb-subhead"><div><h3>Why it was not cached</h3></div></div>
          <ol class="ndb-list ndb-reasons">
            <template data-ndb-for="reason in pageCache.reasons" data-ndb-bind:key="reason.code">
              <li data-ndb-bind:data-code="reason.code" data-ndb-text="reason.text"></li>
            </template>
          </ol>
        </div>
        </template>

        <template data-ndb-if="uncacheableBlocks.length">
        <table class="ndb-table">
          <thead>
            <tr><th>Block marked cacheable="false"</th><th>Handle</th><th>Layout file</th></tr>
          </thead>
          <tbody>
            <template data-ndb-for="(block, index) in uncacheableBlocks" data-ndb-bind:key="index">
              <tr>
                <td class="ndb-mono" data-ndb-text="block.name"></td>
                <td class="ndb-mono" data-ndb-text="block.handle || 'unknown'"></td>
                <td class="ndb-mono ndb-dim" data-ndb-text="block.file || 'not found in a layout file'"></td>
              </tr>
            </template>
          </tbody>
        </table>
        </template>

        <div class="ndb-subhead"><div><h3>Response headers</h3></div></div>
        ${de([
  { label: "Cache-Control", value: "pageCache.cache_control || 'not sent'", mono: !0 },
  { label: "Pragma", value: "pageCache.pragma || 'not sent'", mono: !0 },
  { label: "X-Magento-Cache-Debug", value: "pageCache.cache_debug || 'not sent (developer mode only)'", mono: !0 },
  {
    label: "Set-Cookie",
    value: "(pageCache.set_cookies || []).join(', ') || 'none'",
    mono: !0,
    tone: "(pageCache.set_cookies || []).length && pageCache.page_type ? 'warn' : ''"
  }
])}
      </div>
      </template>

      <template data-ndb-if="isSection('layout')">
      <div>
        ${de([
  { label: "Handles", value: "layout.handle_count || 0" },
  { label: "Layout files", value: "layout.file_count || 0" },
  { label: "Blocks traced to a handle", value: "layout.block_count || 0" }
])}

        <p class="ndb-note" data-ndb-show="pageCache.status === 'hit'">
          The cache answered before Magento routed the request, so no layout was generated.
          Reload with the full_page cache cleaned to see the handles.
        </p>

        <div class="ndb-controls">
          <input class="ndb-search" type="search" placeholder="Filter handles and files"
                 data-ndb-model="layoutSearch">
          <span class="ndb-dim ndb-count">
            <span data-ndb-text="visibleHandles.length"></span> shown, in load order
          </span>
        </div>

        <ol class="ndb-list">
          <template data-ndb-for="(entry, index) in visibleHandles" data-ndb-bind:key="index">
            <li class="ndb-intercept">
              <div class="ndb-intercept-type">
                <code data-ndb-text="entry.handle"></code>
                <span class="ndb-tag" data-ndb-show="entry.via" data-ndb-text="'via ' + entry.via"
                      title="Pulled in by an update in this handle's files"></span>
                <span class="ndb-tag" data-ndb-show="entry.layout === 'separate'"
                      title="Generated as a layout of its own, such as price rendering or an email">separate layout</span>
                <button type="button" class="ndb-chip" data-ndb-show="entry.block_count"
                        data-ndb-on:click="showHandleBlocks(entry.handle)"
                        title="Show the blocks this handle put on the page">
                  <span data-ndb-text="entry.block_count === 1 ? '1 block' : entry.block_count + ' blocks'"></span>
                </button>
              </div>
              <ul class="ndb-intercept-plugins">
                <template data-ndb-for="(file, fileIndex) in entry.files" data-ndb-bind:key="fileIndex">
                  <li>
                    <span data-ndb-text="layoutSource(file)"></span>
                    <small class="ndb-dim ndb-mono ndb-block" data-ndb-text="file.file"></small>
                  </li>
                </template>
                <li class="ndb-dim" data-ndb-show="(entry.files || []).length === 0">
                  No layout file for this handle in this theme.
                </li>
              </ul>
            </li>
          </template>
        </ol>

        <p class="ndb-empty" data-ndb-show="visibleHandles.length === 0">No handles match.</p>
      </div>
      </template>

      <template data-ndb-if="isSection('blocks')">
      <div>
        <div class="ndb-controls">
          <button type="button" class="ndb-chip is-active" data-ndb-show="blockHandle"
                  data-ndb-on:click="blockHandle = ''" title="Show every block again">
            Handle <code data-ndb-text="blockHandle"></code> &times;
          </button>
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
          ${yt("magewireTab", [
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
                    ${q("caret", "ndb-alpine-caret")}
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
        ${yt("seoTab", [
  { id: "overview", label: "Overview", count: "seo.counts.overview", tone: "'warn'" },
  { id: "headings", label: "Headings", count: "seo.counts.headings", tone: "'warn'" },
  { id: "images", label: "Images", count: "seo.counts.images", tone: "'warn'" },
  { id: "links", label: "Links", count: "seo.counts.links", tone: "'warn'" },
  { id: "schema", label: "Schema", count: "seo.counts.schema", tone: "'warn'" },
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

          ${de([
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

          <div class="ndb-seo-block">
            <div class="ndb-subhead">
              <div>
                <h3>Server HTML against the live page</h3>
                <p data-ndb-show="seoServer.available && seoServer.changed === 0">
                  Scripts changed none of these, so a crawler that does not run JavaScript
                  reads the same.
                </p>
                <p data-ndb-show="seoServer.available && seoServer.changed > 0">
                  <span data-ndb-text="plural(seoServer.changed, 'value differs', 'values differ')"></span>.
                  A crawler that does not run JavaScript only gets the server's side.
                </p>
                <p data-ndb-show="!seoServer.available" data-ndb-text="seoServer.reason"></p>
              </div>
            </div>
            <table class="ndb-table" data-ndb-show="seoServer.available">
              <thead><tr><th></th><th>Server sent</th><th>Live page</th></tr></thead>
              <tbody>
                <template data-ndb-for="row in seoServer.rows" data-ndb-bind:key="row.key">
                  <tr>
                    <td class="ndb-fact">
                      <span data-ndb-text="row.label"></span>
                      <span class="ndb-tag is-warn" data-ndb-show="row.changed">changed</span>
                    </td>
                    <td class="ndb-dim" data-ndb-text="row.server === '' ? 'none' : row.server"></td>
                    <td data-ndb-text="row.live === '' ? 'none' : row.live"></td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div class="ndb-seo-block" data-ndb-show="seoSources.length > 0 || seoSourcesMissing">
            <div class="ndb-subhead">
              <div>
                <h3>Where each value came from</h3>
                <p data-ndb-show="seoSources.length > 0">
                  The attribute, CMS field or setting Magento takes it from. Marked when the page
                  does not match it: then a plugin, observer, layout XML, theme or SEO extension
                  set the value instead.
                </p>
                <p data-ndb-show="seoSourcesMissing">
                  Not recorded for this request. A page from the full page cache never loads the
                  product or category behind it; reload with the cache off to see where each
                  value came from.
                </p>
              </div>
            </div>
            <table class="ndb-table" data-ndb-show="seoSources.length > 0">
              <thead><tr><th></th><th>Comes from</th><th></th></tr></thead>
              <tbody>
                <template data-ndb-for="row in seoSources" data-ndb-bind:key="row.field">
                  <tr>
                    <td class="ndb-fact">
                      <span data-ndb-text="row.label"></span>
                      <span class="ndb-tag is-warn" data-ndb-show="row.matches === false">set elsewhere</span>
                    </td>
                    <td>
                      <span data-ndb-text="row.source"></span>
                      <code class="ndb-mono ndb-source-key" data-ndb-show="row.key" data-ndb-text="row.key"></code>
                      <small class="ndb-dim ndb-source-key" data-ndb-show="row.matches === false"
                             data-ndb-text="'Magento would give: ' + (row.expected || 'nothing')"></small>
                    </td>
                    <td class="ndb-action">
                      <a class="ndb-chip" data-ndb-show="row.edit" data-ndb-bind:href="row.edit"
                         target="_blank" rel="noopener">Edit</a>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

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
          ${de([
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

        <div data-ndb-show="seoTab === 'schema'">
          <div class="ndb-callout is-warn" data-ndb-show="seo.schema.warnings.length > 0">
            <template data-ndb-for="(warning, index) in seo.schema.warnings" data-ndb-bind:key="index">
              <p data-ndb-text="warning"></p>
            </template>
          </div>

          <p class="ndb-empty" data-ndb-show="seo.schema.entities.length === 0 && seo.schema.blocks.length === 0">
            No structured data on this page: no JSON-LD and no microdata.
          </p>

          <template data-ndb-for="block in seo.schema.blocks" data-ndb-bind:key="block.index">
            <div class="ndb-note" data-ndb-show="block.error">
              <p>
                JSON-LD block <span data-ndb-text="block.index + 1"></span> does not parse<span
                  data-ndb-show="block.at"
                  data-ndb-text="block.at ? ' at line ' + block.at.line + ', column ' + block.at.column : ''"></span>:
                <span data-ndb-text="block.error"></span>
              </p>
              <code class="ndb-mono" data-ndb-show="block.excerpt" data-ndb-text="block.excerpt"></code>
            </div>
          </template>

          <ol class="ndb-list">
            <template data-ndb-for="entity in seo.schema.entities" data-ndb-bind:key="entity.index">
              <li class="ndb-alpine ndb-schema-entity">
                <button type="button" class="ndb-alpine-head"
                        data-ndb-on:click="toggleSchemaEntity(entity.index)"
                        data-ndb-on:mouseenter="highlightSchema(entity, true)"
                        data-ndb-on:mouseleave="highlightSchema(entity, false)"
                        data-ndb-on:focus="highlightSchema(entity, true)"
                        data-ndb-on:blur="highlightSchema(entity, false)">
                  ${q("caret", "ndb-alpine-caret")}
                  <span class="ndb-alpine-name" data-ndb-text="entity.type"></span>
                  <span class="ndb-tag"
                        data-ndb-text="entity.source === 'json-ld' ? 'JSON-LD ' + (entity.block + 1) : 'microdata'"></span>
                  <span class="ndb-tag is-warn" data-ndb-show="entity.wrapper">declared twice</span>
                  <span class="ndb-alpine-path ndb-dim ndb-truncate"
                        data-ndb-text="entity.name || entity.where"></span>
                  <span class="ndb-pill is-warn"
                        data-ndb-show="schemaRequired(entity) > 0"
                        data-ndb-text="schemaRequired(entity) + ' required'"></span>
                </button>

                <div class="ndb-alpine-body" data-ndb-show="isSchemaExpanded(entity.index)">
                  <ul class="ndb-schema-findings" data-ndb-show="entity.findings.length > 0">
                    <template data-ndb-for="(finding, index) in entity.findings" data-ndb-bind:key="index">
                      <li>
                        <span class="ndb-tag"
                              data-ndb-bind:class="finding.level === 'required' ? 'is-warn' : ''"
                              data-ndb-text="finding.level"></span>
                        <span class="ndb-mono ndb-dim" data-ndb-text="finding.path"></span>
                        <span data-ndb-text="finding.message"></span>
                        <a data-ndb-bind:href="finding.docs" target="_blank" rel="noopener">Google's rules</a>
                      </li>
                    </template>
                  </ul>
                  <p class="ndb-dim" data-ndb-show="entity.source === 'microdata'">
                    Declared on <span class="ndb-mono" data-ndb-text="entity.where"></span>.
                  </p>
                  <pre class="ndb-json" data-ndb-code="highlight(entity.json, 'json')"></pre>
                </div>
              </li>
            </template>
          </ol>

          <div class="ndb-subhead">
            <div>
              <h3>Check it elsewhere</h3>
              <p data-ndb-show="seo.schema.links.public">These tools fetch this page by its URL.</p>
              <p data-ndb-show="!seo.schema.links.public">
                Google's tools cannot reach this host. Copy the markup and paste it into the
                tool's code tab.
              </p>
            </div>
          </div>
          <div class="ndb-controls">
            <button type="button" class="ndb-chip"
                    data-ndb-bind:class="schemaCopyState && 'is-active'"
                    data-ndb-on:click="copySchemaMarkup()"
                    data-ndb-text="schemaCopyState === 'done' ? 'Copied' : 'Copy the markup'"></button>
            <template data-ndb-for="(tool, index) in seo.schema.links.tools" data-ndb-bind:key="index">
              <a class="ndb-chip" data-ndb-bind:href="tool.href" target="_blank" rel="noopener"
                 data-ndb-text="tool.label"></a>
            </template>
          </div>
          <div class="ndb-note" data-ndb-show="schemaFallback">
            <p>This browser would not take the clipboard. Select this and copy it by hand.</p>
            <textarea class="ndb-copy-fallback" readonly rows="6" data-ndb-model="schemaFallback"
                      data-ndb-on:focus="$event.target.select()"></textarea>
          </div>
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

      <template data-ndb-if="isSection('datalayer')">
      <div>
        ${yt("dataLayerTab", [
  { id: "pushes", label: "Pushes", count: "dataLayer.counts.pushes", tone: "'warn'" },
  { id: "tags", label: "Tags", count: "dataLayer.counts.tags", tone: "'warn'" },
  { id: "consent", label: "Consent", count: "dataLayer.counts.consent", tone: "'warn'" }
])}

        <p class="ndb-note" data-ndb-show="dataLayerError">
          Could not read the data layer: <span data-ndb-text="dataLayerError"></span>
        </p>

        <div data-ndb-show="dataLayerTab === 'pushes'">
          <div class="ndb-controls">
            <input class="ndb-search" type="search" data-ndb-model="dataLayerSearch"
                   placeholder="Filter by event, page or value">
            <button type="button" class="ndb-chip"
                    data-ndb-bind:class="dataLayerThisPage && 'is-active'"
                    data-ndb-on:click="dataLayerThisPage = !dataLayerThisPage">
              This page only
            </button>
            <button type="button" class="ndb-chip"
                    data-ndb-bind:class="dataLayerFlat && 'is-active'"
                    data-ndb-on:click="dataLayerFlat = !dataLayerFlat"
                    title="Show each value with its path, ready for a GTM variable">
              Paths
            </button>
            <button type="button" class="ndb-chip" data-ndb-on:click="refreshDataLayer()"
                    title="Read the data layer again">Refresh</button>
          </div>

          <p class="ndb-empty" data-ndb-show="visibleDataLayerPushes.length === 0">
            <span data-ndb-show="!dataLayer.present && !dataLayerSearch">This page has no window.dataLayer.</span>
            <span data-ndb-show="dataLayer.present && !dataLayerSearch">Nothing has been pushed yet.</span>
            <span data-ndb-show="dataLayerSearch">No pushes match.</span>
          </p>

          <ol class="ndb-list">
            <template data-ndb-for="(push, position) in visibleDataLayerPushes" data-ndb-bind:key="push.key">
              <li class="ndb-alpine ndb-push">
                <p class="ndb-push-page" data-ndb-show="startsDataLayerPage(push, position)">
                  <span class="ndb-mono" data-ndb-text="push.page"></span>
                  <span class="ndb-dim" data-ndb-text="push.current ? 'this page' : 'an earlier page in this tab'"></span>
                </p>
                <button type="button" class="ndb-alpine-head"
                        data-ndb-on:click="toggleDataLayerPush(push.key)">
                  ${q("caret", "ndb-alpine-caret")}
                  <span class="ndb-alpine-name ndb-mono" data-ndb-text="push.name"></span>
                  <span class="ndb-tag" data-ndb-show="push.kind === 'gtag'">gtag</span>
                  <span class="ndb-tag" data-ndb-show="push.before"
                        title="In the array before the bar's hook arrived, so its time is not known">before the bar</span>
                  <span class="ndb-alpine-path ndb-dim ndb-truncate"
                        data-ndb-text="push.request ? 'after ' + push.request.label + ', ' + push.request.gap + ' ms' : ''"></span>
                  <span class="ndb-pill is-warn" data-ndb-show="push.problems.length > 0"
                        data-ndb-text="push.problems.length"></span>
                  <span class="ndb-pill" data-ndb-show="!push.before"
                        data-ndb-text="push.at + ' ms'"></span>
                </button>

                <div class="ndb-alpine-body" data-ndb-show="isDataLayerExpanded(push.key)">
                  <div class="ndb-callout is-warn" data-ndb-show="push.problems.length > 0">
                    <p>GA4 ecommerce:</p>
                    <template data-ndb-for="(problem, index) in push.problems" data-ndb-bind:key="index">
                      <p data-ndb-text="problem"></p>
                    </template>
                  </div>
                  <p class="ndb-dim" data-ndb-show="!push.json">
                    The store's value policy shows no values.
                  </p>
                  <pre class="ndb-json" data-ndb-show="push.json && !dataLayerFlat"
                       data-ndb-code="highlight(push.json, 'json')"></pre>
                  <table class="ndb-table ndb-push-paths" data-ndb-show="push.json && dataLayerFlat">
                    <tbody>
                      <template data-ndb-for="(row, index) in push.flat" data-ndb-bind:key="index">
                        <tr>
                          <td class="ndb-mono">
                            <button type="button" class="ndb-push-path"
                                    data-ndb-on:click="copyDataLayerPath(row.path)"
                                    title="Copy the path"
                                    data-ndb-text="dataLayerCopied === row.path ? 'Copied' : row.path"></button>
                          </td>
                          <td class="ndb-mono" data-ndb-text="row.value"></td>
                        </tr>
                      </template>
                    </tbody>
                  </table>
                </div>
              </li>
            </template>
          </ol>

          <p class="ndb-note">
            Values go through the store's value policy before they are shown or kept. Pushes
            from earlier pages in this tab are kept in session storage, which the browser
            clears when the tab closes.
          </p>
        </div>

        <div data-ndb-show="dataLayerTab === 'tags'">
          <div class="ndb-callout is-warn" data-ndb-show="dataLayer.tags.warnings.length > 0">
            <template data-ndb-for="(warning, index) in dataLayer.tags.warnings" data-ndb-bind:key="index">
              <p data-ndb-text="warning"></p>
            </template>
          </div>

          <table class="ndb-table" data-ndb-show="dataLayer.tags.items.length > 0">
            <thead><tr><th>Tag</th><th>Id</th><th>Found in</th></tr></thead>
            <tbody>
              <template data-ndb-for="(tag, index) in dataLayer.tags.items" data-ndb-bind:key="index">
                <tr>
                  <td data-ndb-text="tag.vendor"></td>
                  <td class="ndb-mono" data-ndb-text="tag.id || 'not in the URL'"></td>
                  <td class="ndb-dim" data-ndb-text="tag.where"></td>
                </tr>
              </template>
            </tbody>
          </table>
          <p class="ndb-empty" data-ndb-show="dataLayer.tags.items.length === 0">
            No known tags on this page.
          </p>
        </div>

        <div data-ndb-show="dataLayerTab === 'consent'">
          <div class="ndb-callout is-warn" data-ndb-show="dataLayer.consent.warnings.length > 0">
            <template data-ndb-for="(warning, index) in dataLayer.consent.warnings" data-ndb-bind:key="index">
              <p data-ndb-text="warning"></p>
            </template>
          </div>

          <p class="ndb-empty" data-ndb-show="dataLayer.consent.calls.length === 0">
            No consent commands in the data layer on this page.
          </p>

          <table class="ndb-table" data-ndb-show="dataLayer.consent.calls.length > 0">
            <thead><tr><th>Consent Mode v2</th><th>Default</th><th>Now</th></tr></thead>
            <tbody>
              <template data-ndb-for="row in dataLayer.consent.keys" data-ndb-bind:key="row.key">
                <tr>
                  <td class="ndb-mono" data-ndb-text="row.key"></td>
                  <td class="ndb-mono" data-ndb-text="row.default || 'not set'"
                      data-ndb-bind:class="row.default ? '' : 'ndb-dim'"></td>
                  <td class="ndb-mono" data-ndb-text="row.current || 'not set'"
                      data-ndb-bind:class="row.current === 'granted' ? 'is-ok' : ''"></td>
                </tr>
              </template>
            </tbody>
          </table>
          <p class="ndb-note" data-ndb-show="dataLayer.consent.calls.length > 0">
            <span data-ndb-text="plural(dataLayer.consent.updates, 'update', 'updates')"></span>
            after the default. Read from gtag('consent', ...) calls in the data layer, the way
            Google's tags read it.
          </p>
        </div>
      </div>
      </template>

      <template data-ndb-if="isSection('vitals')">
      <div>
        <div class="ndb-controls">
          <button type="button" class="ndb-chip" data-ndb-on:click="refreshVitals()"
                  title="Read the measurements again">Refresh</button>
          <span class="ndb-dim ndb-count">Measured by this browser on this page, and updated as it is used.</span>
        </div>

        <p class="ndb-note" data-ndb-show="vitalsError">
          Could not read the measurements: <span data-ndb-text="vitalsError"></span>
        </p>

        <table class="ndb-table ndb-vitals">
          <thead><tr><th>Metric</th><th>Value</th><th>Rating</th></tr></thead>
          <tbody>
            <template data-ndb-for="metric in vitals.metrics" data-ndb-bind:key="metric.id">
              <tr>
                <td>
                  <span class="ndb-mono" data-ndb-text="metric.label"></span>
                  <span class="ndb-dim" data-ndb-text="metric.name"></span>
                </td>
                <td class="ndb-mono"
                    data-ndb-text="metric.supported ? (metric.display || 'not yet') : 'not measured by this browser'"
                    data-ndb-bind:class="metric.supported && metric.display ? '' : 'ndb-dim'"></td>
                <td>
                  <span class="ndb-pill" data-ndb-show="metric.rating"
                        data-ndb-bind:class="vitalTone(metric.rating)"
                        data-ndb-text="metric.rating.replace('-', ' ')"></span>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <p class="ndb-note">
          Rated against Google's thresholds. A field score is the 75th percentile of real
          visits; this is one visit, on this machine, with the bar on the page.
        </p>

        <div class="ndb-subhead">
          <div>
            <h3>Largest Contentful Paint element</h3>
            <p>The biggest thing drawn before the first input. Point at it to find it on the page.</p>
          </div>
        </div>
        <p class="ndb-empty" data-ndb-show="!vitals.lcp">Nothing painted has been reported yet.</p>
        <template data-ndb-if="vitals.lcp">
          <button type="button" class="ndb-seo-row"
                  data-ndb-on:click="revealVital(vitals.lcp.index)"
                  data-ndb-on:mouseenter="highlightVital(vitals.lcp.index, true)"
                  data-ndb-on:mouseleave="highlightVital(vitals.lcp.index, false)"
                  data-ndb-on:focus="highlightVital(vitals.lcp.index, true)"
                  data-ndb-on:blur="highlightVital(vitals.lcp.index, false)"
                  title="Scroll to this element">
            <span class="ndb-tag ndb-mono" data-ndb-text="vitals.lcp.label"></span>
            <span class="ndb-seo-text ndb-mono" data-ndb-text="vitals.lcp.url"></span>
            <span class="ndb-dim" data-ndb-show="vitals.lcp.size"
                  data-ndb-text="number(vitals.lcp.size) + ' px²'"></span>
          </button>
        </template>

        <div class="ndb-subhead">
          <div>
            <h3>Slowest interaction</h3>
            <p>The interaction INP is taken from. Clicks on the bar are left out.</p>
          </div>
        </div>
        <p class="ndb-empty" data-ndb-show="!vitals.inp.interaction">
          <span data-ndb-show="vitals.inp.unseen === 0">No interaction yet. Click, tap or type on the page.</span>
          <span data-ndb-show="vitals.inp.unseen > 0">Every interaction so far was under 104 ms, too quick for the browser to keep from before the bar loaded.</span>
        </p>
        <template data-ndb-if="vitals.inp.interaction">
          <button type="button" class="ndb-seo-row"
                  data-ndb-on:click="revealVital(vitals.inp.interaction.index)"
                  data-ndb-on:mouseenter="highlightVital(vitals.inp.interaction.index, true)"
                  data-ndb-on:mouseleave="highlightVital(vitals.inp.interaction.index, false)"
                  data-ndb-on:focus="highlightVital(vitals.inp.interaction.index, true)"
                  data-ndb-on:blur="highlightVital(vitals.inp.interaction.index, false)"
                  title="Scroll to this element">
            <span class="ndb-tag" data-ndb-text="vitals.inp.interaction.name"></span>
            <span class="ndb-seo-text ndb-mono" data-ndb-text="vitals.inp.interaction.label"></span>
            <span class="ndb-dim" data-ndb-text="'at ' + vitals.inp.interaction.at + ' ms'"></span>
          </button>
        </template>
        <p class="ndb-note" data-ndb-show="vitals.inp.count > 0">
          <span data-ndb-text="plural(vitals.inp.count, 'interaction', 'interactions')"></span> measured.
          <span data-ndb-show="vitals.inp.unseen > 0"
                data-ndb-text="plural(vitals.inp.unseen, 'earlier one was', 'earlier ones were') + ' under 104 ms and not kept from before the bar loaded.'"></span>
        </p>

        <div class="ndb-subhead">
          <div>
            <h3>Layout shifts</h3>
            <p>Every shift not caused by input. CLS is the worst window, marked here. Point at an element to see what moved.</p>
          </div>
        </div>
        <p class="ndb-empty" data-ndb-show="vitals.shifts.length === 0">Nothing has moved.</p>
        <ol class="ndb-list">
          <template data-ndb-for="(shift, position) in vitals.shifts" data-ndb-bind:key="position">
            <li class="ndb-vitals-shift">
              <p class="ndb-push-page">
                <span class="ndb-mono" data-ndb-text="shift.display"></span>
                <span class="ndb-dim" data-ndb-text="'at ' + shift.at + ' ms, window ' + shift.window"></span>
                <span class="ndb-tag is-warn" data-ndb-show="shift.worst">counts for CLS</span>
              </p>
              <template data-ndb-for="(source, index) in shift.sources" data-ndb-bind:key="index">
                <button type="button" class="ndb-seo-row"
                        data-ndb-on:click="revealVital(source.index)"
                        data-ndb-on:mouseenter="highlightVital(source.index, true)"
                        data-ndb-on:mouseleave="highlightVital(source.index, false)"
                        data-ndb-on:focus="highlightVital(source.index, true)"
                        data-ndb-on:blur="highlightVital(source.index, false)"
                        title="Scroll to this element">
                  <span class="ndb-seo-text ndb-mono" data-ndb-text="source.label"></span>
                </button>
              </template>
            </li>
          </template>
        </ol>
      </div>
      </template>

      <template data-ndb-if="isExtension(currentSection.id)">
      <div class="ndb-extension">
        <div class="ndb-subtabs" role="tablist" data-ndb-show="extension.tabs.length > 0">
          <template data-ndb-for="tab in extension.tabs" data-ndb-bind:key="tab.id">
            <button type="button" class="ndb-subtab" role="tab"
                    data-ndb-bind:aria-selected="extension.tab === tab.id ? 'true' : 'false'"
                    data-ndb-bind:class="extension.tab === tab.id && 'is-active'"
                    data-ndb-on:click="selectExtensionTab(tab.id)">
              <span data-ndb-text="tab.label"></span>
              <span class="ndb-pill" data-ndb-show="tab.count" data-ndb-text="tab.count"></span>
            </button>
          </template>
        </div>

        <p class="ndb-note is-bad" data-ndb-show="extension.error">
          This section could not read the page: <span data-ndb-text="extension.error"></span>
        </p>

        <template data-ndb-for="(block, index) in extension.blocks" data-ndb-bind:key="extension.tab + index">
        <div class="ndb-extension-block">
          <template data-ndb-if="block.type === 'heading'">
            <div class="ndb-subhead"><div><h3 data-ndb-text="block.text"></h3></div></div>
          </template>

          <template data-ndb-if="block.type === 'note'">
            <p class="ndb-note" data-ndb-bind:class="'is-' + (block.tone || 'plain')"
               data-ndb-text="block.text"></p>
          </template>

          <template data-ndb-if="block.type === 'list'">
            <ul class="ndb-list ndb-reasons">
              <template data-ndb-for="(item, itemIndex) in block.items" data-ndb-bind:key="itemIndex">
                <li data-ndb-text="item"></li>
              </template>
            </ul>
          </template>

          <template data-ndb-if="block.type === 'facts'">
            <dl class="ndb-facts">
              <template data-ndb-for="(fact, factIndex) in block.items" data-ndb-bind:key="factIndex">
                <div class="ndb-fact">
                  <dt data-ndb-text="fact.label"></dt>
                  <dd class="ndb-fact-value"
                      data-ndb-bind:class="(fact.mono ? 'ndb-mono ' : '') + (fact.tone ? 'is-' + fact.tone : '')"
                      data-ndb-text="fact.value"></dd>
                </div>
              </template>
            </dl>
          </template>

          <template data-ndb-if="block.type === 'code'">
            <pre class="ndb-json" data-ndb-code="highlight(block.text, block.language)"></pre>
          </template>

          <template data-ndb-if="block.type === 'table'">
          <div>
            <table class="ndb-table" data-ndb-show="block.rows.length > 0">
              <thead>
                <tr>
                  <template data-ndb-for="(column, columnIndex) in block.columns" data-ndb-bind:key="columnIndex">
                    <th data-ndb-bind:class="column.num && 'ndb-num'" data-ndb-text="column.label"></th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <template data-ndb-for="(row, rowIndex) in block.rows" data-ndb-bind:key="rowIndex">
                  <tr data-ndb-bind:class="(row.tone ? 'is-' + row.tone : '') + (row.target ? ' is-target' : '')"
                      data-ndb-on:mouseenter="highlightExtension(row.target, true)"
                      data-ndb-on:mouseleave="highlightExtension(row.target, false)">
                    <template data-ndb-for="(cell, cellIndex) in row.cells" data-ndb-bind:key="cellIndex">
                      <td class="ndb-extension-cell"
                          data-ndb-bind:class="(block.columns[cellIndex].num ? 'ndb-num ' : '') + (block.columns[cellIndex].mono ? 'ndb-mono ' : '') + (cell.tone ? 'is-' + cell.tone : '')"
                          data-ndb-text="cell.text"></td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </table>
            <p class="ndb-empty" data-ndb-show="block.rows.length === 0" data-ndb-text="block.empty"></p>
            <p class="ndb-dim ndb-count" data-ndb-show="block.cut > 0"
               data-ndb-text="block.cut + ' more rows not shown.'"></p>
          </div>
          </template>
        </div>
        </template>

        <p class="ndb-empty" data-ndb-show="extension.empty && !extension.error">
          Nothing recorded for this request.
        </p>
      </div>
      </template>

      <template data-ndb-if="isSection('history')">
      <div>
        ${yt("historyTab", [
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

            <template data-ndb-if="comparison.seo && comparison.seo.available">
            <div>
              <div class="ndb-subhead">
                <div>
                  <h3>SEO, as the server sent it</h3>
                  <p>
                    <span data-ndb-text="comparison.seo.changed.length"></span> changed,
                    <span data-ndb-text="comparison.seo.unchanged"></span> the same.
                  </p>
                </div>
              </div>

              <table class="ndb-table ndb-compare" data-ndb-show="comparison.seo.changed.length > 0">
                <thead>
                  <tr>
                    <th>Fact</th>
                    <th>Before</th>
                    <th>Now</th>
                  </tr>
                </thead>
                <tbody>
                  <template data-ndb-for="row in comparison.seo.changed" data-ndb-bind:key="row.key">
                    <tr>
                      <td class="ndb-fact" data-ndb-text="row.label"></td>
                      <td class="ndb-dim" data-ndb-text="row.baseline || 'none'"></td>
                      <td data-ndb-text="row.subject || 'none'"></td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
            </template>
            <p class="ndb-note" data-ndb-show="comparison.seo && !comparison.seo.available"
               data-ndb-text="comparison.seo && comparison.seo.reason"></p>

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
          ${yt("alpineTab", [
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
                    ${q("caret", "ndb-alpine-caret")}
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
            ${de([
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
`, Ep = "data-ndb-", ti = "siteation-debugbar";
function Sp(e) {
  const t = e.attachShadow({ mode: "open" }), n = e.dataset.css;
  if (n) {
    const s = document.createElement("link");
    s.rel = "stylesheet", s.href = n, t.append(s);
  }
  const a = document.createElement("div");
  return a.innerHTML = kp, t.append(...a.children), t.querySelector(".ndb");
}
class Ap extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const t = Sp(this);
    t && St.initTree(t);
  }
}
customElements.get(ti) || (St.prefix(Ep), St.data("debugBar", xp), St.directive("code", (e, { expression: t }, { effect: n, evaluateLater: a }) => {
  const s = a(t);
  n(() => s((i) => {
    e.innerHTML = typeof i == "string" ? i : "";
  }));
}), customElements.define(ti, Ap));
Jn && (window.Alpine = Jn);
