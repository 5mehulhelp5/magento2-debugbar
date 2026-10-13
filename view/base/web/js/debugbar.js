const Fn = window.Alpine;
var Hn = !1, Gn = !1, fe = [], Wn = -1, Zt = !1, fs = !1;
function Ao(e) {
  Mo(e);
}
function Oo() {
  fs = !0;
}
function To() {
  fs = !1, Ka();
}
function Mo(e) {
  fe.includes(e) || (fe.push(e), e._x_schedulerPriority !== void 0 && (Zt = !0)), Ka();
}
function Co(e) {
  let t = fe.indexOf(e);
  t !== -1 && t > Wn && fe.splice(t, 1);
}
function Ka() {
  if (!Gn && !Hn) {
    if (fs)
      return;
    Hn = !0, queueMicrotask(No);
  }
}
function No() {
  Hn = !1, Gn = !0;
  for (let e = 0; e < fe.length; e++)
    Zt && $o(e), fe[e](), Wn = e;
  fe.length = 0, Wn = -1, Zt = !1, Gn = !1;
}
function $o(e) {
  let t = /* @__PURE__ */ new Map(), n = fe.slice(e).sort((s, a) => Ro(s, a, t));
  for (let s = 0; s < n.length; s++)
    fe[e + s] = n[s];
  Zt = !1;
}
function Ro(e, t, n) {
  return Nn(e) ? Nn(t) ? ua(e._x_schedulerPriority.el, n) - ua(t._x_schedulerPriority.el, n) || e._x_schedulerPriority.order - t._x_schedulerPriority.order : -1 : Nn(t) ? 1 : 0;
}
function Nn(e) {
  return e._x_schedulerPriority !== void 0;
}
function ua(e, t) {
  if (t.has(e))
    return t.get(e);
  let n = 0, s = e;
  for (; e; )
    n++, e._x_teleportBack ? e = e._x_teleportBack : typeof ShadowRoot == "function" && e.parentNode instanceof ShadowRoot ? e = e.parentNode.host : e = e.parentElement;
  return t.set(s, n), n;
}
var at, We, it, Ja, Lo = 0, zn = !0;
function Po(e) {
  zn = !1, e(), zn = !0;
}
function Io(e) {
  at = e.reactive, it = e.release, We = (t) => e.effect(t, { scheduler: (n) => {
    zn ? Ao(n) : n();
  } }), Ja = e.raw;
}
function pa(e) {
  We = e;
}
function Do(e) {
  let t = () => {
  };
  return [(s, a) => {
    let i = a?.priority === "structural" ? Lo++ : void 0, r = We(s);
    return i !== void 0 && r !== void 0 && (r._x_schedulerPriority = { el: e, order: i }), e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), it(r));
    }, r;
  }, () => {
    t();
  }];
}
function Xa(e, t) {
  let n = !0, s, a, i = We(() => {
    let r = e(), o = JSON.stringify(r);
    if (!n && (typeof r == "object" || r !== s)) {
      let l = typeof s == "object" ? JSON.parse(a) : s;
      queueMicrotask(() => {
        t(r, l);
      });
    }
    s = r, a = o, n = !1;
  });
  return () => it(i);
}
async function qo(e) {
  Oo();
  try {
    await e(), await Promise.resolve();
  } finally {
    To();
  }
}
var Za = [], Ya = [], Qa = [];
function jo(e) {
  Qa.push(e);
}
function bs(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Ya.push(t));
}
function ei(e) {
  Za.push(e);
}
function ti(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function ni(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, s]) => {
    (t === void 0 || t.includes(n)) && (s.forEach((a) => a()), delete e._x_attributeCleanups[n]);
  });
}
function Uo(e) {
  for (e._x_effects?.forEach(Co); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var gs = new MutationObserver(ws), ms = !1;
function ys() {
  gs.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), ms = !0;
}
function si() {
  Bo(), gs.disconnect(), ms = !1;
}
var dt = [];
function Bo() {
  let e = gs.takeRecords();
  dt.push(() => e.length > 0 && ws(e));
  let t = dt.length;
  queueMicrotask(() => {
    if (dt.length === t)
      for (; dt.length > 0; )
        dt.shift()();
  });
}
function B(e) {
  if (!ms)
    return e();
  si();
  let t = e();
  return ys(), t;
}
var vs = !1, Yt = [];
function Fo() {
  vs = !0;
}
function Ho() {
  vs = !1, ws(Yt), Yt = [];
}
function ws(e) {
  if (vs) {
    Yt = Yt.concat(e);
    return;
  }
  let t = [], n = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
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
      let r = e[i].target, o = e[i].attributeName, l = e[i].oldValue, c = () => {
        s.has(r) || s.set(r, []), s.get(r).push({ name: o, value: r.getAttribute(o) });
      }, u = () => {
        a.has(r) || a.set(r, []), a.get(r).push(o);
      };
      r.hasAttribute(o) && l === null ? c() : r.hasAttribute(o) ? (u(), c()) : u();
    }
  a.forEach((i, r) => {
    ni(r, i);
  }), s.forEach((i, r) => {
    Za.forEach((o) => o(r, i));
  });
  for (let i of n)
    t.some((r) => r.contains(i)) || Ya.forEach((r) => r(i));
  for (let i of t)
    i.isConnected && Qa.forEach((r) => r(i));
  t = null, n = null, s = null, a = null;
}
function ai(e) {
  return De(nt(e));
}
function Mt(e, t, n) {
  return e._x_dataStack = [t, ...nt(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((s) => s !== t);
  };
}
function nt(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? nt(e.host) : e.parentNode ? nt(e.parentNode) : [];
}
function De(e) {
  return new Proxy({ objects: e }, Go);
}
function ii(e, t) {
  return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : ii(Object.getPrototypeOf(e), t);
}
var Go = {
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
    return t == "toJSON" ? Wo : Reflect.get(
      e.find(
        (s) => Reflect.has(s, t)
      ) || {},
      t,
      n
    );
  },
  set({ objects: e }, t, n, s) {
    let a;
    for (const r of e)
      if (a = ii(r, t), a)
        break;
    a || (a = e[e.length - 1]);
    const i = Object.getOwnPropertyDescriptor(a, t);
    return i?.set && i?.get ? i.set.call(s, n) || !0 : Reflect.set(a, t, n);
  }
};
function Wo() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function _s(e, t = () => {
}) {
  let n = (a) => typeof a == "object" && !Array.isArray(a) && a !== null, s = (a, i = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(a)).forEach(([r, { value: o, enumerable: l }]) => {
      if (l === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let c = i === "" ? r : `${i}.${r}`;
      typeof o == "object" && o !== null && o._x_interceptor ? a[r] = o.initialize(e, c, r, t) : n(o) && o !== a && !(o instanceof Element) && s(o, c);
    });
  };
  return s(e);
}
function ri(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(s, a, i, r) {
      return e(this.initialValue, () => zo(s, a), (o) => Vn(s, a, o), a, i, r);
    }
  };
  return t(n), (s) => {
    if (typeof s == "object" && s !== null && s._x_interceptor) {
      let a = n.initialize.bind(n);
      n.initialize = (i, r, o, l) => {
        let c = s.initialize(i, r, o, l);
        return n.initialValue = c, a(i, r, o, l);
      };
    } else
      n.initialValue = s;
    return n;
  };
}
function zo(e, t) {
  return t.split(".").reduce((n, s) => n[s], e);
}
function Vn(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Vn(e[t[0]], t.slice(1), n);
  }
}
var oi = {};
function ie(e, t) {
  oi[e] = t;
}
function Qt(e, t) {
  let n = Vo(t);
  return Object.entries(oi).forEach(([s, a]) => {
    Object.defineProperty(e, `$${s}`, {
      get() {
        return a(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function Vo(e) {
  let [t, n] = fi(e), s = { interceptor: ri, ...t };
  return bs(e, n), s;
}
function Ko(e, t, n, ...s) {
  try {
    return n(...s);
  } catch (a) {
    xs(a, e, t);
  }
}
function xs(...e) {
  return li(...e);
}
var li = Xo;
function Jo(e) {
  li = e;
}
function Xo(e, t, n = void 0) {
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
function ci(e) {
  let t = Re;
  Re = !1;
  let n = e();
  return Re = t, n;
}
function Le(e, t, n = {}) {
  let s;
  return Z(e, t)((a) => s = a, n), s;
}
function Z(...e) {
  return di(...e);
}
var di = () => {
};
function Zo(e) {
  di = e;
}
var ui;
function Yo(e) {
  ui = e;
}
function Qo(e, t) {
  return (n = () => {
  }, { scope: s = {}, params: a = [], context: i } = {}) => {
    if (!Re) {
      Kn(n, t, De([s, ...e]), a);
      return;
    }
    let r = t.apply(De([s, ...e]), a);
    Kn(n, r);
  };
}
function Kn(e, t, n, s, a) {
  if (Re && typeof t == "function") {
    let i = t.apply(n, s);
    i instanceof Promise ? i.then((r) => Kn(e, r, n, s)).catch((r) => xs(r, a, t)) : e(i);
  } else typeof t == "object" && t instanceof Promise ? t.then((i) => e(i)) : e(t);
}
function el(...e) {
  return ui(...e);
}
var Es = "x-";
function rt(e = "") {
  return Es + e;
}
function tl(e) {
  Es = e;
}
var en = {};
function F(e, t) {
  return en[e] = t, {
    before(n) {
      if (!en[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const s = $e.indexOf(n);
      $e.splice(s >= 0 ? s : $e.indexOf("DEFAULT"), 0, e);
    }
  };
}
function nl(e) {
  return Object.keys(en).includes(e);
}
function ks(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let i = Object.entries(e._x_virtualDirectives).map(([o, l]) => ({ name: o, value: l })), r = pi(i);
    i = i.map((o) => r.find((l) => l.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(i);
  }
  let s = {};
  return t.map(mi((i, r) => s[i] = r)).filter(vi).map(il(s, n)).sort(rl).map((i) => al(e, i));
}
function pi(e) {
  return Array.from(e).map(mi()).filter((t) => !vi(t));
}
var Jn = !1, bt = /* @__PURE__ */ new Map(), hi = /* @__PURE__ */ Symbol();
function sl(e) {
  Jn = !0;
  let t = /* @__PURE__ */ Symbol();
  hi = t, bt.set(t, []);
  let n = () => {
    for (; bt.get(t).length; )
      bt.get(t).shift()();
    bt.delete(t);
  }, s = () => {
    Jn = !1, n();
  };
  e(n), s();
}
function fi(e) {
  let t = [], n = (o) => t.push(o), [s, a] = Do(e);
  return t.push(a), [{
    Alpine: ot,
    effect: s,
    cleanup: n,
    evaluateLater: Z.bind(Z, e),
    evaluate: Le.bind(Le, e)
  }, () => t.forEach((o) => o())];
}
function al(e, t) {
  let n = () => {
  }, s = en[t.type] || n, [a, i] = fi(e);
  ti(e, t.original, i);
  let r = () => {
    e._x_ignore || e._x_ignoreSelf || (s.inline && s.inline(e, t, a), s = s.bind(s, e, t, a), Jn ? bt.get(hi).push(s) : s());
  };
  return r.runCleanups = i, r;
}
var bi = (e, t) => ({ name: n, value: s }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: s }), gi = (e) => e;
function mi(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: s, value: a } = yi.reduce((i, r) => r(i), { name: t, value: n });
    return s !== t && e(s, t), { name: s, value: a };
  };
}
var yi = [];
function Ss(e) {
  yi.push(e);
}
function vi({ name: e }) {
  return wi().test(e);
}
var wi = () => new RegExp(`^${Es}([^:^.]+)\\b`);
function il(e, t) {
  return ({ name: n, value: s }) => {
    n === s && (s = "");
    let a = n.match(wi()), i = n.match(/:([a-zA-Z0-9\-_:]+)/), r = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: a ? a[1] : null,
      value: i ? i[1] : null,
      modifiers: r.map((l) => l.replace(".", "")),
      expression: s,
      original: o
    };
  };
}
var Xn = "DEFAULT", $e = [
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
  Xn,
  "teleport"
];
function rl(e, t) {
  let n = $e.indexOf(e.type) === -1 ? Xn : e.type, s = $e.indexOf(t.type) === -1 ? Xn : t.type;
  return $e.indexOf(n) - $e.indexOf(s);
}
function gt(e, t, n = {}, s = {}) {
  return e.dispatchEvent(
    new CustomEvent(t, {
      detail: n,
      bubbles: !0,
      // Allows events to pass the shadow DOM barrier.
      composed: !0,
      cancelable: !0,
      // Allows overriding the default event options.
      ...s
    })
  );
}
function qe(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((a) => qe(a, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let s = e.firstElementChild;
  for (; s; )
    qe(s, t), s = s.nextElementSibling;
}
function ce(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var ha = !1;
function ol() {
  ha && ce("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), ha = !0, document.body || ce("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), gt(document, "alpine:init"), gt(document, "alpine:initializing"), ys(), jo((t) => ge(t, qe)), bs((t) => ze(t)), ei((t, n) => {
    ks(t, n).forEach((s) => s());
  });
  let e = (t) => !pn(t.parentElement, !0);
  Array.from(document.querySelectorAll(Ei().join(","))).filter(e).forEach((t) => {
    ge(t);
  }), gt(document, "alpine:initialized"), setTimeout(() => {
    ul();
  });
}
var As = [], _i = [];
function xi() {
  return As.map((e) => e());
}
function Ei() {
  return As.concat(_i).map((e) => e());
}
function ki(e) {
  As.push(e);
}
function Si(e) {
  _i.push(e);
}
function pn(e, t = !1) {
  return be(e, (n) => {
    if ((t ? Ei() : xi()).some((a) => n.matches(a)))
      return !0;
  });
}
function be(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack)
      return be(e._x_teleportBack, t);
    if (e.parentNode instanceof ShadowRoot)
      return be(e.parentNode.host, t);
    if (e.parentElement)
      return be(e.parentElement, t);
  }
}
function ll(e) {
  return xi().some((t) => e.matches(t));
}
var Ai = [];
function cl(e) {
  Ai.push(e);
}
var dl = 1;
function ge(e, t = qe, n = () => {
}) {
  be(e, (s) => s._x_ignore) || sl(() => {
    t(e, (s, a) => {
      s._x_marker || (n(s, a), Ai.forEach((i) => i(s, a)), ks(s, s.attributes).forEach((i) => i()), s._x_ignore || (s._x_marker = dl++), s._x_ignore && a());
    });
  });
}
function ze(e, t = qe) {
  t(e, (n) => {
    Uo(n), ni(n), delete n._x_marker;
  });
}
function ul() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, s]) => {
    nl(n) || s.some((a) => {
      if (document.querySelector(a))
        return ce(`found "${a}", but missing ${t} plugin`), !0;
    });
  });
}
var Zn = [], Os = !1;
function Ts(e = () => {
}) {
  return queueMicrotask(() => {
    Os || setTimeout(() => {
      Yn();
    });
  }), new Promise((t) => {
    Zn.push(() => {
      e(), t();
    });
  });
}
function Yn() {
  for (Os = !1; Zn.length; )
    Zn.shift()();
}
function pl() {
  Os = !0;
}
function Ms(e, t) {
  return Array.isArray(t) ? fa(e, t.join(" ")) : typeof t == "object" && t !== null ? hl(e, t) : typeof t == "function" ? Ms(e, t()) : fa(e, t);
}
function Qn(e) {
  return e.split(/\s/).filter(Boolean);
}
function fa(e, t) {
  let n = (a) => Qn(a).filter((i) => !e.classList.contains(i)).filter(Boolean), s = (a) => (e.classList.add(...a), () => {
    e.classList.remove(...a);
  });
  return t = t === !0 ? t = "" : t || "", s(n(t));
}
function hl(e, t) {
  let n = Object.entries(t).flatMap(([r, o]) => o ? Qn(r) : !1).filter(Boolean), s = Object.entries(t).flatMap(([r, o]) => o ? !1 : Qn(r)).filter(Boolean), a = [], i = [];
  return s.forEach((r) => {
    e.classList.contains(r) && (e.classList.remove(r), i.push(r));
  }), n.forEach((r) => {
    e.classList.contains(r) || (e.classList.add(r), a.push(r));
  }), () => {
    i.forEach((r) => e.classList.add(r)), a.forEach((r) => e.classList.remove(r));
  };
}
function hn(e, t) {
  return typeof t == "object" && t !== null ? fl(e, t) : bl(e, t);
}
function fl(e, t) {
  let n = {};
  return Object.entries(t).forEach(([s, a]) => {
    n[s] = e.style[s], s.startsWith("--") || (s = gl(s)), e.style.setProperty(s, a);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    hn(e, n);
  };
}
function bl(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function gl(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function es(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
F("transition", (e, { value: t, modifiers: n, expression: s }, { evaluate: a }) => {
  typeof s == "function" && (s = a(s)), s !== !1 && (!s || typeof s == "boolean" ? yl(e, n, t) : ml(e, s, t));
});
function ml(e, t, n) {
  Oi(e, Ms, ""), {
    enter: (a) => {
      e._x_transition.enter.during = a;
    },
    "enter-start": (a) => {
      e._x_transition.enter.start = a;
    },
    "enter-end": (a) => {
      e._x_transition.enter.end = a;
    },
    leave: (a) => {
      e._x_transition.leave.during = a;
    },
    "leave-start": (a) => {
      e._x_transition.leave.start = a;
    },
    "leave-end": (a) => {
      e._x_transition.leave.end = a;
    }
  }[n](t);
}
function yl(e, t, n) {
  Oi(e, hn);
  let s = !t.includes("in") && !t.includes("out") && !n, a = s || t.includes("in") || ["enter"].includes(n), i = s || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !s && (t = t.filter((A, $) => $ < t.indexOf("out"))), t.includes("out") && !s && (t = t.filter((A, $) => $ > t.indexOf("out")));
  let r = !t.includes("opacity") && !t.includes("scale"), o = r || t.includes("opacity"), l = r || t.includes("scale"), c = o ? 0 : 1, u = l ? ut(t, "scale", 95) / 100 : 1, p = ut(t, "delay", 0) / 1e3, f = ut(t, "origin", "center"), E = "opacity, transform", S = ut(t, "duration", 150) / 1e3, g = ut(t, "duration", 75) / 1e3, m = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  a && (e._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${p}s`,
    transitionProperty: E,
    transitionDuration: `${S}s`,
    transitionTimingFunction: m
  }, e._x_transition.enter.start = {
    opacity: c,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), i && (e._x_transition.leave.during = {
    transformOrigin: f,
    transitionDelay: `${p}s`,
    transitionProperty: E,
    transitionDuration: `${g}s`,
    transitionTimingFunction: m
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: c,
    transform: `scale(${u})`
  });
}
function Oi(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(s = () => {
    }, a = () => {
    }) {
      ts(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, s, a);
    },
    out(s = () => {
    }, a = () => {
    }) {
      ts(e, t, {
        during: this.leave.during,
        start: this.leave.start,
        end: this.leave.end
      }, s, a);
    }
  });
}
window.Element.prototype._x_toggleAndCascadeWithTransitions = function(e, t, n, s) {
  const a = document.visibilityState === "visible" ? requestAnimationFrame : setTimeout;
  let i = () => a(n);
  if (t) {
    e._x_transition && (e._x_transition.enter || e._x_transition.leave) ? e._x_transition.enter && (Object.entries(e._x_transition.enter.during).length || Object.entries(e._x_transition.enter.start).length || Object.entries(e._x_transition.enter.end).length) ? e._x_transition.in(n) : i() : e._x_transition ? e._x_transition.in(n) : i();
    return;
  }
  e._x_hidePromise = e._x_transition ? new Promise((r, o) => {
    e._x_transition.out(() => {
    }, () => r(s)), e._x_transitioning && e._x_transitioning.beforeCancel(() => o({ isFromCancelledTransition: !0 }));
  }) : Promise.resolve(s), queueMicrotask(() => {
    let r = Ti(e);
    r ? (r._x_hideChildren || (r._x_hideChildren = []), r._x_hideChildren.push(e)) : a(() => {
      let o = (l) => {
        let c = Promise.all([
          l._x_hidePromise,
          ...(l._x_hideChildren || []).map(o)
        ]).then(([u]) => u?.());
        return delete l._x_hidePromise, delete l._x_hideChildren, c;
      };
      o(e).catch((l) => {
        if (!l.isFromCancelledTransition)
          throw l;
      });
    });
  });
};
function Ti(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Ti(t);
}
function ts(e, t, { during: n, start: s, end: a } = {}, i = () => {
}, r = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(s).length === 0 && Object.keys(a).length === 0) {
    i(), r();
    return;
  }
  let o, l, c;
  vl(e, {
    start() {
      o = t(e, s);
    },
    during() {
      l = t(e, n);
    },
    before: i,
    end() {
      o(), c = t(e, a);
    },
    after: r,
    cleanup() {
      l(), c();
    }
  });
}
function vl(e, t) {
  let n, s, a, i = es(() => {
    B(() => {
      n = !0, s || t.before(), a || (t.end(), Yn()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(r) {
      this.beforeCancels.push(r);
    },
    cancel: es(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      i();
    }),
    finish: i
  }, B(() => {
    t.start(), t.during();
  }), pl(), requestAnimationFrame(() => {
    if (n)
      return;
    let r = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    r === 0 && (r = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), B(() => {
      t.before();
    }), s = !0, requestAnimationFrame(() => {
      n || (B(() => {
        t.end();
      }), Yn(), setTimeout(e._x_transitioning.finish, r + o), a = !0);
    });
  });
}
function ut(e, t, n) {
  if (e.indexOf(t) === -1)
    return n;
  const s = e[e.indexOf(t) + 1];
  if (!s || t === "scale" && isNaN(s))
    return n;
  if (t === "duration" || t === "delay") {
    let a = s.match(/([0-9]+)ms/);
    if (a)
      return a[1];
  }
  return t === "origin" && ["top", "right", "left", "center", "bottom"].includes(e[e.indexOf(t) + 2]) ? [s, e[e.indexOf(t) + 2]].join(" ") : s;
}
var Ee = !1;
function ke(e, t = () => {
}) {
  return (...n) => Ee ? t(...n) : e(...n);
}
function wl(e) {
  return (...t) => Ee && e(...t);
}
var Mi = [];
function fn(e) {
  Mi.push(e);
}
function _l(e, t) {
  Mi.forEach((n) => n(e, t)), Ee = !0, Ci(() => {
    ge(t, (n, s) => {
      s(n, () => {
      });
    });
  }), Ee = !1;
}
var ns = !1;
function xl(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), Ee = !0, ns = !0, Ci(() => {
    El(t);
  }), Ee = !1, ns = !1;
}
function El(e) {
  let t = !1;
  ge(e, (s, a) => {
    qe(s, (i, r) => {
      if (t && ll(i))
        return r();
      t = !0, a(i, r);
    });
  });
}
function Ci(e) {
  let t = We;
  pa((n, s) => {
    let a = t(n);
    return it(a), () => {
    };
  }), e(), pa(t);
}
function Ni(e, t, n, s = []) {
  switch (e._x_bindings || (e._x_bindings = at({})), e._x_bindings[t] = n, t = s.includes("camel") ? Nl(t) : t, t) {
    case "value":
      kl(e, n);
      break;
    case "style":
      Al(e, n);
      break;
    case "class":
      Sl(e, n);
      break;
    case "selected":
    case "checked":
      Ol(e, t, n);
      break;
    default:
      Cs(e, t, n);
      break;
  }
}
function kl(e, t) {
  if (Ns(e))
    e.attributes.value === void 0 && (e.value = t);
  else if (tn(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => $l(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Cl(e, t);
  else if (e.tagName === "OPTION")
    Cs(e, "value", t);
  else {
    if (e.value === t && (typeof t != "object" || t === null))
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Sl(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = Ms(e, t);
}
function Al(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = hn(e, t);
}
function Ol(e, t, n) {
  Cs(e, t, n), Ml(e, t, n);
}
function Cs(e, t, n) {
  [null, void 0, !1].includes(n) && Ll(t) ? e.removeAttribute(t) : ($i(t) && (n = t), Pl(n) && (n = JSON.stringify(n)), Tl(e, t, n));
}
function Tl(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function Ml(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Cl(e, t) {
  const n = [].concat(t).map((s) => s + "");
  Array.from(e.options).forEach((s) => {
    s.selected = n.includes(s.value);
  });
}
function Nl(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function $l(e, t) {
  return e == t;
}
function Kt(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Rl = /* @__PURE__ */ new Set([
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
function $i(e) {
  return Rl.has(e);
}
function Ll(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function Pl(e) {
  return typeof e == "object" && e !== null;
}
function Il(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Ri(e, t, n);
}
function Dl(e, t, n, s = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let a = e._x_inlineBindings[t];
    return a.extract = s, ci(() => Le(e, a.expression));
  }
  return Ri(e, t, n);
}
function Ri(e, t, n) {
  let s = e.getAttribute(t);
  return s === null ? typeof n == "function" ? n() : n : s === "" ? !0 : $i(t) ? !![t, "true"].includes(s) : s;
}
function tn(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function Ns(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function Li(e, t) {
  let n;
  return function() {
    const s = this, a = arguments, i = function() {
      n = null, e.apply(s, a);
    };
    clearTimeout(n), n = setTimeout(i, t);
  };
}
function Pi(e, t) {
  let n;
  return function() {
    let s = this, a = arguments;
    n || (e.apply(s, a), n = !0, setTimeout(() => n = !1, t));
  };
}
function Ii({ get: e, set: t }, { get: n, set: s }) {
  let a = !0, i, r = We(() => {
    let o = e(), l = n();
    if (a)
      s($n(o)), a = !1;
    else {
      let c = JSON.stringify(o), u = JSON.stringify(l);
      c !== i ? s($n(o)) : c !== u && t($n(l));
    }
    i = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    it(r);
  };
}
function $n(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function ql(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(ot));
}
var he = {}, ba = !1;
function jl(e, t) {
  if (ba || (he = at(he), ba = !0), t === void 0)
    return he[e];
  he[e] = t, typeof t == "object" && t !== null && t._x_interceptor ? he[e] = t.initialize(he, e, e, () => {
  }) : _s(he[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && he[e].init();
}
function Ul() {
  return he;
}
var Di = {};
function Bl(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? qi(e, n()) : (Di[e] = n, () => {
  });
}
function Fl(e) {
  return Object.entries(Di).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...s) => n(...s);
      }
    });
  }), e;
}
function qi(e, t, n) {
  let s = [];
  for (; s.length; )
    s.pop()();
  let a = Object.entries(t).map(([r, o]) => ({ name: r, value: o })), i = pi(a);
  return a = a.map((r) => i.find((o) => o.name === r.name) ? {
    name: `x-bind:${r.name}`,
    value: `"${r.value}"`
  } : r), ks(e, a, n).map((r) => {
    s.push(r.runCleanups), r();
  }), () => {
    for (; s.length; )
      s.pop()();
  };
}
var ji = {};
function Hl(e, t) {
  ji[e] = t;
}
function Gl(e, t) {
  return Object.entries(ji).forEach(([n, s]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...a) => s.bind(t)(...a);
      },
      enumerable: !1
    });
  }), e;
}
var Wl = {
  get reactive() {
    return at;
  },
  get release() {
    return it;
  },
  get effect() {
    return We;
  },
  get raw() {
    return Ja;
  },
  get transaction() {
    return qo;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Ho,
  dontAutoEvaluateFunctions: ci,
  disableEffectScheduling: Po,
  startObservingMutations: ys,
  stopObservingMutations: si,
  setReactivityEngine: Io,
  onAttributeRemoved: ti,
  onAttributesAdded: ei,
  closestDataStack: nt,
  skipDuringClone: ke,
  onlyDuringClone: wl,
  addRootSelector: ki,
  addInitSelector: Si,
  setErrorHandler: Jo,
  interceptClone: fn,
  addScopeToNode: Mt,
  deferMutations: Fo,
  mapAttributes: Ss,
  evaluateLater: Z,
  interceptInit: cl,
  initInterceptors: _s,
  injectMagics: Qt,
  setEvaluator: Zo,
  setRawEvaluator: Yo,
  mergeProxies: De,
  extractProp: Dl,
  findClosest: be,
  onElRemoved: bs,
  closestRoot: pn,
  destroyTree: ze,
  interceptor: ri,
  // INTERNAL: not public API and is subject to change without major release.
  transition: ts,
  // INTERNAL
  setStyles: hn,
  // INTERNAL
  mutateDom: B,
  directive: F,
  entangle: Ii,
  throttle: Pi,
  debounce: Li,
  evaluate: Le,
  evaluateRaw: el,
  initTree: ge,
  nextTick: Ts,
  prefixed: rt,
  prefix: tl,
  plugin: ql,
  magic: ie,
  store: jl,
  start: ol,
  clone: xl,
  // INTERNAL
  cloneNode: _l,
  // INTERNAL
  bound: Il,
  $data: ai,
  watch: Xa,
  walk: qe,
  data: Hl,
  bind: Bl
}, ot = Wl, ga = /* @__PURE__ */ new WeakMap(), Ui = /* @__PURE__ */ new Set();
Object.getOwnPropertyNames(globalThis).forEach((e) => {
  e === "styleMedia" || e === "sharedStorage" || Ui.add(globalThis[e]);
});
var W = class {
  constructor(e, t, n, s) {
    this.type = e, this.value = t, this.start = n, this.end = s;
  }
}, zl = class {
  constructor(e) {
    this.input = e, this.position = 0, this.tokens = [];
  }
  tokenize() {
    for (; this.position < this.input.length && (this.skipWhitespace(), !(this.position >= this.input.length)); ) {
      const e = this.input[this.position];
      this.isDigit(e) ? this.readNumber() : this.isAlpha(e) || e === "_" || e === "$" ? this.readIdentifierOrKeyword() : e === '"' || e === "'" ? this.readString() : e === "/" && this.peek() === "/" ? this.skipLineComment() : this.readOperatorOrPunctuation();
    }
    return this.tokens.push(new W("EOF", null, this.position, this.position)), this.tokens;
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
      const s = this.input[this.position];
      if (this.isDigit(s))
        this.position++;
      else if (s === "." && !t)
        t = !0, this.position++;
      else
        break;
    }
    const n = this.input.slice(e, this.position);
    this.tokens.push(new W("NUMBER", parseFloat(n), e, this.position));
  }
  readIdentifierOrKeyword() {
    const e = this.position;
    for (; this.position < this.input.length && this.isAlphaNumeric(this.input[this.position]); )
      this.position++;
    const t = this.input.slice(e, this.position);
    ["true", "false", "null", "undefined", "new", "typeof", "void", "delete", "in", "instanceof"].includes(t) ? t === "true" || t === "false" ? this.tokens.push(new W("BOOLEAN", t === "true", e, this.position)) : t === "null" ? this.tokens.push(new W("NULL", null, e, this.position)) : t === "undefined" ? this.tokens.push(new W("UNDEFINED", void 0, e, this.position)) : this.tokens.push(new W("KEYWORD", t, e, this.position)) : this.tokens.push(new W("IDENTIFIER", t, e, this.position));
  }
  readString() {
    const e = this.position, t = this.input[this.position];
    this.position++;
    let n = "", s = !1;
    for (; this.position < this.input.length; ) {
      const a = this.input[this.position];
      if (s) {
        switch (a) {
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
            n += a;
        }
        s = !1;
      } else if (a === "\\")
        s = !0;
      else if (a === t) {
        this.position++, this.tokens.push(new W("STRING", n, e, this.position));
        return;
      } else
        n += a;
      this.position++;
    }
    throw new Error(`Unterminated string starting at position ${e}`);
  }
  readOperatorOrPunctuation() {
    const e = this.position, t = this.input[this.position], n = this.peek(), s = this.peek(2);
    if (t === "=" && n === "=" && s === "=")
      this.position += 3, this.tokens.push(new W("OPERATOR", "===", e, this.position));
    else if (t === "!" && n === "=" && s === "=")
      this.position += 3, this.tokens.push(new W("OPERATOR", "!==", e, this.position));
    else if (t === "=" && n === "=")
      this.position += 2, this.tokens.push(new W("OPERATOR", "==", e, this.position));
    else if (t === "!" && n === "=")
      this.position += 2, this.tokens.push(new W("OPERATOR", "!=", e, this.position));
    else if (t === "<" && n === "=")
      this.position += 2, this.tokens.push(new W("OPERATOR", "<=", e, this.position));
    else if (t === ">" && n === "=")
      this.position += 2, this.tokens.push(new W("OPERATOR", ">=", e, this.position));
    else if (t === "&" && n === "&")
      this.position += 2, this.tokens.push(new W("OPERATOR", "&&", e, this.position));
    else if (t === "|" && n === "|")
      this.position += 2, this.tokens.push(new W("OPERATOR", "||", e, this.position));
    else if (t === "+" && n === "+")
      this.position += 2, this.tokens.push(new W("OPERATOR", "++", e, this.position));
    else if (t === "-" && n === "-")
      this.position += 2, this.tokens.push(new W("OPERATOR", "--", e, this.position));
    else {
      this.position++;
      const a = "()[]{},.;:?".includes(t) ? "PUNCTUATION" : "OPERATOR";
      this.tokens.push(new W(a, t, e, this.position));
    }
  }
}, Vl = class {
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
      const s = this.parseExpression();
      if (e.push({
        type: "Property",
        key: t,
        value: s,
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
        const s = n;
        for (let a = 1; a < e.length; a++)
          if (this.check(s, e[a]))
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
}, Kl = class {
  evaluate({ node: e, scope: t = {}, context: n = null, forceBindingRootScopeToFunctions: s = !0 }) {
    switch (e.type) {
      case "Literal":
        return e.value;
      case "Identifier":
        if (e.name in t) {
          const m = t[e.name];
          return this.checkForDangerousValues(m), typeof m == "function" ? m.bind(t) : m;
        }
        throw new Error(`Undefined variable: ${e.name}`);
      case "MemberExpression":
        const a = this.evaluate({ node: e.object, scope: t, context: n, forceBindingRootScopeToFunctions: s });
        if (a == null)
          throw new Error("Cannot read property of null or undefined");
        let i;
        e.computed ? i = this.evaluate({ node: e.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : i = e.property.name, this.checkForDangerousKeywords(i);
        let r = a[i];
        return this.checkForDangerousValues(r), typeof r == "function" ? s ? r.bind(t) : r.bind(a) : r;
      case "CallExpression":
        const o = e.arguments.map((m) => this.evaluate({ node: m, scope: t, context: n, forceBindingRootScopeToFunctions: s }));
        let l;
        if (e.callee.type === "MemberExpression") {
          const m = this.evaluate({ node: e.callee.object, scope: t, context: n, forceBindingRootScopeToFunctions: s });
          let A;
          e.callee.computed ? A = this.evaluate({ node: e.callee.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : A = e.callee.property.name, this.checkForDangerousKeywords(A);
          let $ = m[A];
          if (typeof $ != "function")
            throw new Error("Value is not a function");
          l = $.apply(m, o);
        } else if (e.callee.type === "Identifier") {
          const m = e.callee.name;
          let A;
          if (m in t)
            A = t[m];
          else
            throw new Error(`Undefined variable: ${m}`);
          if (typeof A != "function")
            throw new Error("Value is not a function");
          const $ = n !== null ? n : t;
          l = A.apply($, o);
        } else {
          const m = this.evaluate({ node: e.callee, scope: t, context: n, forceBindingRootScopeToFunctions: s });
          if (typeof m != "function")
            throw new Error("Value is not a function");
          l = m.apply(n, o);
        }
        return this.checkForDangerousValues(l), l;
      case "UnaryExpression":
        const c = this.evaluate({ node: e.argument, scope: t, context: n, forceBindingRootScopeToFunctions: s });
        switch (e.operator) {
          case "!":
            return !c;
          case "-":
            return -c;
          case "+":
            return +c;
          default:
            throw new Error(`Unknown unary operator: ${e.operator}`);
        }
      case "UpdateExpression":
        if (e.argument.type === "Identifier") {
          const m = e.argument.name;
          if (!(m in t))
            throw new Error(`Undefined variable: ${m}`);
          const A = t[m];
          return e.operator === "++" ? t[m] = A + 1 : e.operator === "--" && (t[m] = A - 1), e.prefix ? t[m] : A;
        } else if (e.argument.type === "MemberExpression") {
          const m = this.evaluate({ node: e.argument.object, scope: t, context: n, forceBindingRootScopeToFunctions: s }), A = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : e.argument.property.name;
          if (this.isDOMObject(m))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          this.checkForDangerousKeywords(A);
          const $ = m[A];
          return e.operator === "++" ? m[A] = $ + 1 : e.operator === "--" && (m[A] = $ - 1), e.prefix ? m[A] : $;
        }
        throw new Error("Invalid update expression target");
      case "BinaryExpression":
        const u = this.evaluate({ node: e.left, scope: t, context: n, forceBindingRootScopeToFunctions: s }), p = () => this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: s });
        if (e.operator === "&&")
          return u && p();
        if (e.operator === "||")
          return u || p();
        const f = p();
        switch (e.operator) {
          case "+":
            return u + f;
          case "-":
            return u - f;
          case "*":
            return u * f;
          case "/":
            return u / f;
          case "%":
            return u % f;
          case "==":
            return u == f;
          case "!=":
            return u != f;
          case "===":
            return u === f;
          case "!==":
            return u !== f;
          case "<":
            return u < f;
          case ">":
            return u > f;
          case "<=":
            return u <= f;
          case ">=":
            return u >= f;
          default:
            throw new Error(`Unknown binary operator: ${e.operator}`);
        }
      case "ConditionalExpression":
        return this.evaluate({ node: e.test, scope: t, context: n, forceBindingRootScopeToFunctions: s }) ? this.evaluate({ node: e.consequent, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : this.evaluate({ node: e.alternate, scope: t, context: n, forceBindingRootScopeToFunctions: s });
      case "AssignmentExpression":
        const S = this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: s });
        if (e.left.type === "Identifier")
          return t[e.left.name] = S, S;
        if (e.left.type === "MemberExpression") {
          const m = this.evaluate({ node: e.left.object, scope: t, context: n, forceBindingRootScopeToFunctions: s }), A = e.left.computed ? this.evaluate({ node: e.left.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : e.left.property.name;
          if (this.isDOMObject(m))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          return this.checkForDangerousKeywords(A), m[A] = S, S;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((m) => this.evaluate({ node: m, scope: t, context: n, forceBindingRootScopeToFunctions: s }));
      case "ObjectExpression":
        const g = {};
        for (const m of e.properties) {
          const A = m.computed ? this.evaluate({ node: m.key, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : m.key.type === "Identifier" ? m.key.name : this.evaluate({ node: m.key, scope: t, context: n, forceBindingRootScopeToFunctions: s }), $ = this.evaluate({ node: m.value, scope: t, context: n, forceBindingRootScopeToFunctions: s });
          g[A] = $;
        }
        return g;
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
    if (e !== null && !(typeof e != "object" && typeof e != "function") && !ga.has(e)) {
      if (e instanceof HTMLIFrameElement || e instanceof HTMLScriptElement)
        throw new Error("Accessing iframes and scripts is prohibited in the CSP build");
      if (Ui.has(e))
        throw new Error("Accessing global variables is prohibited in the CSP build");
      return ga.set(e, !0), !0;
    }
  }
};
function Bi(e) {
  try {
    const n = new zl(e).tokenize(), a = new Vl(n).parse(), i = new Kl();
    return function(r = {}) {
      const { scope: o = {}, context: l = null, forceBindingRootScopeToFunctions: c = !1 } = r;
      return i.evaluate({ node: a, scope: o, context: l, forceBindingRootScopeToFunctions: c });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function Jl(e, t, n = {}) {
  let s = Fi(e), a = De([n.scope ?? {}, ...s]), i = n.params ?? [], o = Bi(t)({
    scope: a,
    forceBindingRootScopeToFunctions: !0
  });
  return typeof o == "function" && Re ? o.apply(a, i) : o;
}
function Xl(e, t) {
  let n = Fi(e);
  if (typeof t == "function")
    return Qo(n, t);
  let s = Zl(e, t, n);
  return Ko.bind(null, e, t, s);
}
function Fi(e) {
  let t = {};
  return Qt(t, e), [t, ...nt(e)];
}
function Zl(e, t, n) {
  if (e instanceof HTMLIFrameElement)
    throw new Error("Evaluating expressions on an iframe is prohibited in the CSP build");
  if (e instanceof HTMLScriptElement)
    throw new Error("Evaluating expressions on a script is prohibited in the CSP build");
  return (s = () => {
  }, { scope: a = {}, params: i = [] } = {}) => {
    let r = De([a, ...n]), l = Bi(t)({
      scope: r,
      forceBindingRootScopeToFunctions: !0
    });
    if (Re && typeof l == "function") {
      let c = l.apply(l, i);
      c instanceof Promise ? c.then((u) => s(u)) : s(c);
    } else typeof l == "object" && l instanceof Promise ? l.then((c) => s(c)) : s(l);
  };
}
function Yl(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(","))
    t[n] = 1;
  return (n) => n in t;
}
var xt = Object.assign, Ql = Object.prototype.hasOwnProperty, ss = (e, t) => Ql.call(e, t), Et = Array.isArray, mt = (e) => Hi(e) === "[object Map]", ec = (e) => typeof e == "string", Ct = (e) => typeof e == "symbol", kt = (e) => e !== null && typeof e == "object", tc = Object.prototype.toString, Hi = (e) => tc.call(e), Gi = (e) => Hi(e).slice(8, -1), $s = (e) => ec(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, nc = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, sc = nc((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ne = (e, t) => !Object.is(e, t);
function je(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var L, Rn = /* @__PURE__ */ new WeakSet(), ma = class {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Rn.has(this) && (Rn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || ac(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ya(this), zi(this);
    const e = L, t = ae;
    L = this, ae = !0;
    try {
      return this.fn();
    } finally {
      L !== this && je(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Vi(this), L = e, ae = t, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Ps(e);
      this.deps = this.depsTail = void 0, ya(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Rn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    as(this) && this.run();
  }
  get dirty() {
    return as(this);
  }
}, Wi = 0, yt, vt;
function ac(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = vt, vt = e;
    return;
  }
  e.next = yt, yt = e;
}
function Rs() {
  Wi++;
}
function Ls() {
  if (--Wi > 0)
    return;
  if (vt) {
    let t = vt;
    for (vt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; yt; ) {
    let t = yt;
    for (yt = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e)
    throw e;
}
function zi(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Vi(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const a = s.prevDep;
    s.version === -1 ? (s === n && (n = a), Ps(s), rc(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = a;
  }
  e.deps = t, e.depsTail = n;
}
function as(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ic(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ic(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === nn) || (e.globalVersion = nn, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !as(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = L, s = ae;
  L = e, ae = !0;
  try {
    zi(e);
    const a = e.fn(e._value);
    (t.version === 0 || Ne(a, e._value)) && (e.flags |= 128, e._value = a, t.version++);
  } catch (a) {
    throw t.version++, a;
  } finally {
    L = n, ae = s, Vi(e), e.flags &= -3;
  }
}
function Ps(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: a } = e;
  if (s && (s.nextSub = a, e.prevSub = void 0), a && (a.prevSub = s, e.nextSub = void 0), n.subsHead === e && (n.subsHead = a), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      Ps(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function rc(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function oc(e, t) {
  e.effect instanceof ma && (e = e.effect.fn);
  const n = new ma(e);
  t && xt(n, t);
  try {
    n.run();
  } catch (a) {
    throw n.stop(), a;
  }
  const s = n.run.bind(n);
  return s.effect = n, s;
}
function lc(e) {
  e.effect.stop();
}
var ae = !0, Ki = [];
function cc() {
  Ki.push(ae), ae = !1;
}
function dc() {
  const e = Ki.pop();
  ae = e === void 0 ? !0 : e;
}
function ya(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = L;
    L = void 0;
    try {
      t();
    } finally {
      L = n;
    }
  }
}
var nn = 0, uc = class {
  constructor(e, t) {
    this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, pc = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(e) {
    if (!L || !ae || L === this.computed)
      return;
    let t = this.activeLink;
    if (t === void 0 || t.sub !== L)
      t = this.activeLink = new uc(L, this), L.deps ? (t.prevDep = L.depsTail, L.depsTail.nextDep = t, L.depsTail = t) : L.deps = L.depsTail = t, Ji(t);
    else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
      const n = t.nextDep;
      n.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = n), t.prevDep = L.depsTail, t.nextDep = void 0, L.depsTail.nextDep = t, L.depsTail = t, L.deps === t && (L.deps = n);
    }
    return L.onTrack && L.onTrack(
      xt(
        {
          effect: L
        },
        e
      )
    ), t;
  }
  trigger(e) {
    this.version++, nn++, this.notify(e);
  }
  notify(e) {
    Rs();
    try {
      for (let t = this.subsHead; t; t = t.nextSub)
        t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(
          xt(
            {
              effect: t.sub
            },
            e
          )
        );
      for (let t = this.subs; t; t = t.prevSub)
        t.sub.notify() && t.sub.dep.notify();
    } finally {
      Ls();
    }
  }
};
function Ji(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Ji(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
var is = /* @__PURE__ */ new WeakMap(), Pe = /* @__PURE__ */ Symbol(
  "Object iterate"
), rs = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), St = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function Y(e, t, n) {
  if (ae && L) {
    let s = is.get(e);
    s || is.set(e, s = /* @__PURE__ */ new Map());
    let a = s.get(n);
    a || (s.set(n, a = new pc()), a.map = s, a.key = n), a.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function xe(e, t, n, s, a, i) {
  const r = is.get(e);
  if (!r) {
    nn++;
    return;
  }
  const o = (l) => {
    l && l.trigger({
      target: e,
      type: t,
      key: n,
      newValue: s,
      oldValue: a,
      oldTarget: i
    });
  };
  if (Rs(), t === "clear")
    r.forEach(o);
  else {
    const l = Et(e), c = l && $s(n);
    if (l && n === "length") {
      const u = Number(s);
      r.forEach((p, f) => {
        (f === "length" || f === St || !Ct(f) && f >= u) && o(p);
      });
    } else
      switch ((n !== void 0 || r.has(void 0)) && o(r.get(n)), c && o(r.get(St)), t) {
        case "add":
          l ? c && o(r.get("length")) : (o(r.get(Pe)), mt(e) && o(r.get(rs)));
          break;
        case "delete":
          l || (o(r.get(Pe)), mt(e) && o(r.get(rs)));
          break;
        case "set":
          mt(e) && o(r.get(Pe));
          break;
      }
  }
  Ls();
}
function Qe(e) {
  const t = P(e);
  return t === e ? t : (Y(t, "iterate", St), Be(e) ? t : t.map(Fe));
}
function Is(e) {
  return Y(e = P(e), "iterate", St), e;
}
function le(e, t) {
  return Ue(e) ? nr(e) ? At(Fe(t)) : At(t) : Fe(t);
}
var hc = {
  __proto__: null,
  [Symbol.iterator]() {
    return Ln(this, Symbol.iterator, (e) => le(this, e));
  },
  concat(...e) {
    return Qe(this).concat(
      ...e.map((t) => Et(t) ? Qe(t) : t)
    );
  },
  entries() {
    return Ln(this, "entries", (e) => (e[1] = le(this, e[1]), e));
  },
  every(e, t) {
    return ue(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return ue(
      this,
      "filter",
      e,
      t,
      (n) => n.map((s) => le(this, s)),
      arguments
    );
  },
  find(e, t) {
    return ue(
      this,
      "find",
      e,
      t,
      (n) => le(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return ue(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return ue(
      this,
      "findLast",
      e,
      t,
      (n) => le(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return ue(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return ue(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Pn(this, "includes", e);
  },
  indexOf(...e) {
    return Pn(this, "indexOf", e);
  },
  join(e) {
    return Qe(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Pn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return ue(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return pt(this, "pop");
  },
  push(...e) {
    return pt(this, "push", e);
  },
  reduce(e, ...t) {
    return va(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return va(this, "reduceRight", e, t);
  },
  shift() {
    return pt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return ue(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return pt(this, "splice", e);
  },
  toReversed() {
    return Qe(this).toReversed();
  },
  toSorted(e) {
    return Qe(this).toSorted(e);
  },
  toSpliced(...e) {
    return Qe(this).toSpliced(...e);
  },
  unshift(...e) {
    return pt(this, "unshift", e);
  },
  values() {
    return Ln(this, "values", (e) => le(this, e));
  }
};
function Ln(e, t, n) {
  const s = Is(e), a = s[t]();
  return s !== e && !Be(e) && (a._next = a.next, a.next = () => {
    const i = a._next();
    return i.done || (i.value = n(i.value)), i;
  }), a;
}
var fc = Array.prototype;
function ue(e, t, n, s, a, i) {
  const r = Is(e), o = r !== e && !Be(e), l = r[t];
  if (l !== fc[t]) {
    const p = l.apply(e, i);
    return o ? Fe(p) : p;
  }
  let c = n;
  r !== e && (o ? c = function(p, f) {
    return n.call(this, le(e, p), f, e);
  } : n.length > 2 && (c = function(p, f) {
    return n.call(this, p, f, e);
  }));
  const u = l.call(r, c, s);
  return o && a ? a(u) : u;
}
function va(e, t, n, s) {
  const a = Is(e), i = a !== e && !Be(e);
  let r = n, o = !1;
  a !== e && (i ? (o = s.length === 0, r = function(c, u, p) {
    return o && (o = !1, c = le(e, c)), n.call(this, c, le(e, u), p, e);
  }) : n.length > 3 && (r = function(c, u, p) {
    return n.call(this, c, u, p, e);
  }));
  const l = a[t](r, ...s);
  return o ? le(e, l) : l;
}
function Pn(e, t, n) {
  const s = P(e);
  Y(s, "iterate", St);
  const a = s[t](...n);
  return (a === -1 || a === !1) && Tc(n[0]) ? (n[0] = P(n[0]), s[t](...n)) : a;
}
function pt(e, t, n = []) {
  cc(), Rs();
  const s = P(e)[t].apply(e, n);
  return Ls(), dc(), s;
}
var bc = /* @__PURE__ */ Yl("__proto__,__v_isRef,__isVue"), Xi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Ct)
);
function gc(e) {
  Ct(e) || (e = String(e));
  const t = P(this);
  return Y(t, "has", e), t.hasOwnProperty(e);
}
var Zi = class {
  constructor(e = !1, t = !1) {
    this._isReadonly = e, this._isShallow = t;
  }
  get(e, t, n) {
    if (t === "__v_skip")
      return e.__v_skip;
    const s = this._isReadonly, a = this._isShallow;
    if (t === "__v_isReactive")
      return !s;
    if (t === "__v_isReadonly")
      return s;
    if (t === "__v_isShallow")
      return a;
    if (t === "__v_raw")
      return n === (s ? a ? Ac : er : a ? Sc : Qi).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const i = Et(e);
    if (!s) {
      let o;
      if (i && (o = hc[t]))
        return o;
      if (t === "hasOwnProperty")
        return gc;
    }
    const r = Reflect.get(
      e,
      t,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      wt(e) ? e : n
    );
    if ((Ct(t) ? Xi.has(t) : bc(t)) || (s || Y(e, "get", t), a))
      return r;
    if (wt(r)) {
      const o = i && $s(t) ? r : r.value;
      return s && kt(o) ? os(o) : o;
    }
    return kt(r) ? s ? os(r) : Ds(r) : r;
  }
}, mc = class extends Zi {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, t, n, s) {
    let a = e[t];
    const i = Et(e) && $s(t);
    if (!this._isShallow) {
      const l = Ue(a);
      if (!Be(n) && !Ue(n) && (a = P(a), n = P(n)), !i && wt(a) && !wt(n))
        return l ? (je(
          `Set operation on key "${String(t)}" failed: target is readonly.`,
          e[t]
        ), !0) : (a.value = n, !0);
    }
    const r = i ? Number(t) < e.length : ss(e, t), o = Reflect.set(
      e,
      t,
      n,
      wt(e) ? e : s
    );
    return e === P(s) && o && (r ? Ne(n, a) && xe(e, "set", t, n, a) : xe(e, "add", t, n)), o;
  }
  deleteProperty(e, t) {
    const n = ss(e, t), s = e[t], a = Reflect.deleteProperty(e, t);
    return a && n && xe(e, "delete", t, void 0, s), a;
  }
  has(e, t) {
    const n = Reflect.has(e, t);
    return (!Ct(t) || !Xi.has(t)) && Y(e, "has", t), n;
  }
  ownKeys(e) {
    return Y(
      e,
      "iterate",
      Et(e) ? "length" : Pe
    ), Reflect.ownKeys(e);
  }
}, yc = class extends Zi {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, t) {
    return je(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, t) {
    return je(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, vc = /* @__PURE__ */ new mc(), wc = /* @__PURE__ */ new yc(), Ft = (e) => Reflect.getPrototypeOf(e);
function _c(e, t, n) {
  return function(...s) {
    const a = this.__v_raw, i = P(a), r = mt(i), o = e === "entries" || e === Symbol.iterator && r, l = e === "keys" && r, c = a[e](...s), u = t ? At : Fe;
    return !t && Y(
      i,
      "iterate",
      l ? rs : Pe
    ), xt(
      // inheriting all iterator properties
      Object.create(c),
      {
        // iterator protocol
        next() {
          const { value: p, done: f } = c.next();
          return f ? { value: p, done: f } : {
            value: o ? [u(p[0]), u(p[1])] : u(p),
            done: f
          };
        }
      }
    );
  };
}
function Ht(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      je(
        `${sc(e)} operation ${n}failed: target is readonly.`,
        P(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function xc(e, t) {
  const n = {
    get(a) {
      const i = this.__v_raw, r = P(i), o = P(a);
      e || (Ne(a, o) && Y(r, "get", a), Y(r, "get", o));
      const { has: l } = Ft(r), c = e ? At : Fe;
      if (l.call(r, a))
        return c(i.get(a));
      if (l.call(r, o))
        return c(i.get(o));
      i !== r && i.get(a);
    },
    get size() {
      const a = this.__v_raw;
      return !e && Y(P(a), "iterate", Pe), a.size;
    },
    has(a) {
      const i = this.__v_raw, r = P(i), o = P(a);
      return e || (Ne(a, o) && Y(r, "has", a), Y(r, "has", o)), a === o ? i.has(a) : i.has(a) || i.has(o);
    },
    forEach(a, i) {
      const r = this, o = r.__v_raw, l = P(o), c = e ? At : Fe;
      return !e && Y(l, "iterate", Pe), o.forEach((u, p) => a.call(i, c(u), c(p), r));
    }
  };
  return xt(
    n,
    e ? {
      add: Ht("add"),
      set: Ht("set"),
      delete: Ht("delete"),
      clear: Ht("clear")
    } : {
      add(a) {
        const i = P(this), r = Ft(i), o = P(a), l = !Be(a) && !Ue(a) ? o : a;
        return r.has.call(i, l) || Ne(a, l) && r.has.call(i, a) || Ne(o, l) && r.has.call(i, o) || (i.add(l), xe(i, "add", l, l)), this;
      },
      set(a, i) {
        !Be(i) && !Ue(i) && (i = P(i));
        const r = P(this), { has: o, get: l } = Ft(r);
        let c = o.call(r, a);
        c ? wa(r, o, a) : (a = P(a), c = o.call(r, a));
        const u = l.call(r, a);
        return r.set(a, i), c ? Ne(i, u) && xe(r, "set", a, i, u) : xe(r, "add", a, i), this;
      },
      delete(a) {
        const i = P(this), { has: r, get: o } = Ft(i);
        let l = r.call(i, a);
        l ? wa(i, r, a) : (a = P(a), l = r.call(i, a));
        const c = o ? o.call(i, a) : void 0, u = i.delete(a);
        return l && xe(i, "delete", a, void 0, c), u;
      },
      clear() {
        const a = P(this), i = a.size !== 0, r = mt(a) ? new Map(a) : new Set(a), o = a.clear();
        return i && xe(
          a,
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
  ].forEach((a) => {
    n[a] = _c(a, e);
  }), n;
}
function Yi(e, t) {
  const n = xc(e);
  return (s, a, i) => a === "__v_isReactive" ? !e : a === "__v_isReadonly" ? e : a === "__v_raw" ? s : Reflect.get(
    ss(n, a) && a in s ? n : s,
    a,
    i
  );
}
var Ec = {
  get: /* @__PURE__ */ Yi(!1)
}, kc = {
  get: /* @__PURE__ */ Yi(!0)
};
function wa(e, t, n) {
  const s = P(n);
  if (s !== n && t.call(e, s)) {
    const a = Gi(e);
    je(
      `Reactive ${a} contains both the raw and reactive versions of the same object${a === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var Qi = /* @__PURE__ */ new WeakMap(), Sc = /* @__PURE__ */ new WeakMap(), er = /* @__PURE__ */ new WeakMap(), Ac = /* @__PURE__ */ new WeakMap();
function Oc(e) {
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
function Ds(e) {
  return /* @__PURE__ */ Ue(e) ? e : tr(
    e,
    !1,
    vc,
    Ec,
    Qi
  );
}
function os(e) {
  return tr(
    e,
    !0,
    wc,
    kc,
    er
  );
}
function tr(e, t, n, s, a) {
  if (!kt(e))
    return je(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = a.get(e);
  if (i)
    return i;
  const r = Oc(Gi(e));
  if (r === 0)
    return e;
  const o = new Proxy(
    e,
    r === 2 ? s : n
  );
  return a.set(e, o), o;
}
function nr(e) {
  return /* @__PURE__ */ Ue(e) ? /* @__PURE__ */ nr(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Ue(e) {
  return !!(e && e.__v_isReadonly);
}
function Be(e) {
  return !!(e && e.__v_isShallow);
}
function Tc(e) {
  return e ? !!e.__v_raw : !1;
}
function P(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ P(t) : e;
}
var Fe = (e) => kt(e) ? /* @__PURE__ */ Ds(e) : e, At = (e) => kt(e) ? /* @__PURE__ */ os(e) : e;
function wt(e) {
  return e ? e.__v_isRef === !0 : !1;
}
ie("nextTick", () => Ts);
ie("dispatch", (e) => gt.bind(gt, e));
ie("watch", (e, { evaluateLater: t, cleanup: n }) => (s, a) => {
  let i = t(s), o = Xa(() => {
    let l;
    return i((c) => l = c), l;
  }, a);
  n(o);
});
ie("store", Ul);
ie("data", (e) => ai(e));
ie("root", (e) => pn(e));
ie("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = De(Mc(e))), e._x_refs_proxy));
function Mc(e) {
  let t = [];
  return be(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var In = {};
function sr(e) {
  return In[e] || (In[e] = 0), ++In[e];
}
function Cc(e, t) {
  return be(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function Nc(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = sr(t));
}
ie("id", (e, { cleanup: t }) => (n, s = null) => {
  let a = `${n}${s ? `-${s}` : ""}`;
  return $c(e, a, t, () => {
    let i = Cc(e, n), r = i ? i._x_ids[n] : sr(n);
    return s ? `${n}-${r}-${s}` : `${n}-${r}`;
  });
});
fn((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function $c(e, t, n, s) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let a = s();
  return e._x_id[t] = a, n(() => {
    delete e._x_id[t];
  }), a;
}
ie("el", (e) => e);
ar("Focus", "focus", "focus");
ar("Persist", "persist", "persist");
function ar(e, t, n) {
  ie(t, (s) => ce(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, s));
}
F("modelable", (e, { expression: t }, { effect: n, evaluateLater: s, cleanup: a }) => {
  let i = s(t), r = () => {
    let u;
    return i((p) => u = p), u;
  }, o = s(`${t} = __placeholder`), l = (u) => o(() => {
  }, { scope: { __placeholder: u } }), c = r();
  l(c), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, p = e._x_model.setWithModifiers, f = Ii(
      {
        get() {
          return u();
        },
        set(E) {
          p(E);
        }
      },
      {
        get() {
          return r();
        },
        set(E) {
          l(E);
        }
      }
    );
    a(f);
  });
});
F("teleport", (e, { modifiers: t, expression: n }, { cleanup: s }) => {
  e.tagName.toLowerCase() !== "template" && ce("x-teleport can only be used on a <template> tag", e);
  let a = _a(n), i = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = i, i._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), i.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    i.addEventListener(o, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Mt(i, {}, e);
  let r = (o, l, c) => {
    c.includes("prepend") ? l.parentNode.insertBefore(o, l) : c.includes("append") ? l.parentNode.insertBefore(o, l.nextSibling) : l.appendChild(o);
  };
  B(() => {
    ke(() => {
      r(i, a, t), ge(i);
    })();
  }), e._x_teleportPutBack = () => {
    let o = _a(n);
    B(() => {
      r(e._x_teleport, o, t);
    });
  }, s(
    () => B(() => {
      i.remove(), ze(i);
    })
  );
});
var Rc = document.createElement("div");
function _a(e) {
  let t = ke(() => document.querySelector(e), () => Rc)();
  return t || ce(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var ir = () => {
};
ir.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
F("ignore", ir);
F("effect", ke((e, { expression: t }, { effect: n }) => {
  n(Z(e, t));
}));
function tt(e, t, n, s) {
  let a = e, i = (l) => s(l), r = {}, o = (l, c) => (u) => c(l, u);
  return n.includes("dot") && (t = Lc(t)), n.includes("camel") && (t = Pc(t)), n.includes("capture") && (r.capture = !0), n.includes("window") && (a = window), n.includes("document") && (a = document), n.includes("passive") && (r.passive = n[n.indexOf("passive") + 1] !== "false"), i = rr(n, i), n.includes("prevent") && (i = o(i, (l, c) => {
    c.preventDefault(), l(c);
  })), n.includes("stop") && (i = o(i, (l, c) => {
    c.stopPropagation(), l(c);
  })), n.includes("once") && (i = o(i, (l, c) => {
    l(c), a.removeEventListener(t, i, r);
  })), (n.includes("away") || n.includes("outside")) && (a = document, i = o(i, (l, c) => {
    e.contains(c.target) || c.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && l(c));
  })), n.includes("self") && (i = o(i, (l, c) => {
    c.target === e && l(c);
  })), t === "submit" && (i = o(i, (l, c) => {
    c.target._x_pendingModelUpdates && c.target._x_pendingModelUpdates.forEach((u) => u()), l(c);
  })), (Dc(t) || or(t)) && (i = o(i, (l, c) => {
    qc(c, n) || l(c);
  })), a.addEventListener(t, i, r), () => {
    a.removeEventListener(t, i, r);
  };
}
function rr(e, t) {
  if (e.includes("debounce")) {
    let n = e[e.indexOf("debounce") + 1] || "invalid-wait", s = sn(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Li(t, s);
  }
  if (e.includes("throttle")) {
    let n = e[e.indexOf("throttle") + 1] || "invalid-wait", s = sn(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Pi(t, s);
  }
  return t;
}
function Lc(e) {
  return e.replace(/-/g, ".");
}
function Pc(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function sn(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ic(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Dc(e) {
  return ["keydown", "keyup"].includes(e);
}
function or(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function qc(e, t) {
  let n = t.filter((i) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(i));
  if (n.includes("debounce")) {
    let i = n.indexOf("debounce");
    n.splice(i, sn((n[i + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let i = n.indexOf("throttle");
    n.splice(i, sn((n[i + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && xa(e.key).includes(n[0]))
    return !1;
  const a = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((i) => n.includes(i));
  return n = n.filter((i) => !a.includes(i)), !(a.length > 0 && a.filter((r) => ((r === "cmd" || r === "super") && (r = "meta"), e[`${r}Key`])).length === a.length && (or(e.type) || xa(e.key).includes(n[0])));
}
function xa(e) {
  if (!e)
    return [];
  e = Ic(e);
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
F("model", (e, { modifiers: t, expression: n }, { effect: s, cleanup: a }) => {
  let i = e;
  t.includes("parent") && (i = be(e, (g) => g !== e));
  let r = Z(i, n), o;
  typeof n == "string" ? o = Z(i, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = Z(i, `${n()} = __placeholder`) : o = () => {
  };
  let l = () => {
    let g;
    return r((m) => g = m), Ea(g) ? g.get() : g;
  }, c = (g) => {
    let m;
    r((A) => m = A), Ea(m) ? m.set(g) : o(() => {
    }, {
      scope: { __placeholder: g }
    });
  };
  typeof n == "string" && e.type === "radio" && B(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = t.includes("change") || t.includes("lazy"), p = t.includes("blur"), f = t.includes("enter"), E = u || p || f, S;
  if (Ee)
    S = () => {
    };
  else if (E) {
    let g = [], m = (A) => c(Gt(e, t, A, l()));
    if (u && g.push(tt(e, "change", t, m)), p && (g.push(tt(e, "blur", t, m)), e.form)) {
      let A = e.form, $ = () => m({ target: e });
      A._x_pendingModelUpdates || (A._x_pendingModelUpdates = []), A._x_pendingModelUpdates.push($), a(() => {
        A._x_pendingModelUpdates && A._x_pendingModelUpdates.splice(A._x_pendingModelUpdates.indexOf($), 1);
      });
    }
    f && g.push(tt(e, "keydown", t, (A) => {
      A.key === "Enter" && m(A);
    })), S = () => g.forEach((A) => A());
  } else {
    let g = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    S = tt(e, g, t, (m) => {
      c(Gt(e, t, m, l()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || tn(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && c(
    Gt(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = S, a(() => e._x_removeModelListeners.default()), e.form) {
    let g = tt(e.form, "reset", [], (m) => {
      Ts(() => e._x_model && e._x_model.set(Gt(e, t, { target: e }, l())));
    });
    a(() => g());
  }
  if (e._x_model = {
    get() {
      return l();
    },
    set(g) {
      c(g);
    },
    setWithModifiers: rr(t, c)
  }, e._x_forceModelUpdate = (g) => {
    g === void 0 && typeof n == "string" && n.match(/\./) && (g = ""), B(() => {
      tn(e) ? Array.isArray(g) ? e.checked = g.some((m) => m == e.value) : e.checked = !!g : Ns(e) ? typeof g == "boolean" ? e.checked = Kt(e.value) === g : e.checked = e.value == g : Ni(e, "value", g);
    });
  }, e.tagName === "SELECT") {
    let g = new MutationObserver(() => {
      e._x_forceModelUpdate(l());
    });
    g.observe(e, { childList: !0 }), a(() => g.disconnect());
  }
  s(() => {
    let g = l();
    t.includes("unintrusive") && document.activeElement.isSameNode(e) || e._x_forceModelUpdate(g);
  });
});
function Gt(e, t, n, s) {
  return B(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (tn(e))
      if (Array.isArray(s)) {
        let a = null;
        return t.includes("number") ? a = Dn(n.target.value) : t.includes("boolean") ? a = Kt(n.target.value) : a = n.target.value, n.target.checked ? s.includes(a) ? s : s.concat([a]) : s.filter((i) => !jc(i, a));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((a) => {
          let i = a.value || a.text;
          return Dn(i);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((a) => {
          let i = a.value || a.text;
          return Kt(i);
        }) : Array.from(n.target.selectedOptions).map((a) => a.value || a.text);
      {
        let a;
        return Ns(e) ? n.target.checked ? a = n.target.value : a = s : a = n.target.value, t.includes("number") ? Dn(a) : t.includes("boolean") ? Kt(a) : t.includes("trim") ? a.trim() : a;
      }
    }
  });
}
function Dn(e) {
  let t = e ? parseFloat(e) : null;
  return Uc(t) ? t : e;
}
function jc(e, t) {
  return e == t;
}
function Uc(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ea(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
F("cloak", (e) => queueMicrotask(() => B(() => e.removeAttribute(rt("cloak")))));
Si(() => `[${rt("init")}]`);
F("init", ke((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
F("text", (e, { expression: t }, { effect: n, evaluateLater: s }) => {
  let a = s(t);
  n(() => {
    a((i) => {
      B(() => {
        e.textContent = i;
      });
    });
  });
});
F("html", (e, { expression: t }, { effect: n, evaluateLater: s }) => {
  let a = s(t);
  n(() => {
    a((i) => {
      B(() => {
        Array.from(e.children).forEach((r) => ze(r)), e.innerHTML = i ?? "", e._x_ignoreSelf = !0, ge(e), delete e._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
Ss(bi(":", gi(rt("bind:"))));
var lr = (e, { value: t, modifiers: n, expression: s, original: a }, { effect: i, cleanup: r }) => {
  if (!t) {
    let l = {};
    Fl(l), Z(e, s)((u) => {
      qi(e, u, a);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return Bc(e, s);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = Z(e, s);
  i(() => o((l) => {
    l === void 0 && typeof s == "string" && s.match(/\./) && (l = ""), B(() => Ni(e, t, l, n));
  })), r(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
lr.inline = (e, { value: t, modifiers: n, expression: s }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: s, extract: !1 });
};
F("bind", lr);
function Bc(e, t) {
  e._x_keyExpression = t;
}
ki(() => `[${rt("data")}]`);
var Me = /* @__PURE__ */ Symbol();
F("data", (e, { expression: t }, { cleanup: n }) => {
  if (Hc(e))
    return;
  let s = e[Me];
  if (s?.expression === t)
    return;
  t = t === "" ? "{}" : t;
  let a = {};
  Qt(a, e);
  let i = {};
  Gl(i, a);
  let r = Le(e, t, { scope: i });
  (r === void 0 || r === !0) && (r = {}), Qt(r, e);
  let o;
  if (s?.reactiveData) {
    o = s.reactiveData, Fc(o, r);
    let c = { expression: t };
    e[Me] = c, queueMicrotask(() => {
      e[Me] === c && delete e[Me];
    });
  } else
    o = at(r);
  _s(o, n);
  let l = Mt(e, o);
  o.init && Le(e, o.init), n(() => {
    o.destroy && Le(e, o.destroy), l();
    let c = { reactiveData: o };
    e[Me] = c, queueMicrotask(() => {
      e[Me] === c && delete e[Me];
    });
  });
});
function Fc(e, t) {
  Object.keys(t).forEach((n) => {
    let s = Object.getOwnPropertyDescriptor(t, n), a = Object.getOwnPropertyDescriptor(e, n);
    s.get || s.set || a?.get || a?.set ? (a && delete e[n], a || (e[n] = void 0), s.get || s.set ? Object.defineProperty(e, n, s) : e[n] = t[n]) : e[n] = t[n];
  }), Object.keys(e).filter((n) => !Object.prototype.hasOwnProperty.call(t, n)).forEach((n) => delete e[n]);
}
fn((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Hc(e) {
  return Ee ? ns ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
F("show", (e, { modifiers: t, expression: n }, { effect: s }) => {
  let a = Z(e, n);
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
  }, o = () => setTimeout(r), l = es(
    (p) => p ? r() : i(),
    (p) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, p, r, i) : p ? o() : i();
    }
  ), c, u = !0;
  s(() => a((p) => {
    !u && p === c || (t.includes("immediate") && (p ? o() : i()), l(p), c = p, u = !1);
  }));
});
F("for", ke((e, { expression: t }, { effect: n, cleanup: s }) => {
  let a = zc(t), i = Z(e, a.items), r = Z(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_lookup = /* @__PURE__ */ new Map(), n(() => Wc(e, a, i, r), { priority: "structural" }), s(() => {
    e._x_lookup.forEach(
      (o) => B(() => {
        ze(o), o.remove();
      })
    ), delete e._x_lookup, delete e._x_lastRenderedEl;
  });
}));
function Gc(e) {
  return (t) => {
    Object.entries(t).forEach(([n, s]) => {
      e[n] = s;
    });
  };
}
function Wc(e, t, n, s) {
  n((a) => {
    Kc(a) && (a = Array.from({ length: a }, (c, u) => u + 1)), a == null && (a = []), a instanceof Set && (a = Array.from(a)), a instanceof Map && (a = Array.from(a));
    let i = e._x_lookup, r = /* @__PURE__ */ new Map();
    e._x_lookup = r;
    let o = Jc(a), l = Object.entries(a).map(([c, u]) => {
      o || (c = parseInt(c));
      let p = Vc(t, u, c, a), f;
      return s((E) => {
        typeof E == "object" && ce("x-for key cannot be an object, it must be a string or an integer", e), i.has(E) && (r.set(E, i.get(E)), i.delete(E)), f = E;
      }, { scope: { index: c, ...p } }), [f, p];
    });
    B(() => {
      i.forEach((p) => {
        ze(p), p.remove();
      });
      let c = /* @__PURE__ */ new Set(), u = e;
      l.forEach(([p, f]) => {
        if (r.has(p)) {
          let g = r.get(p);
          g._x_refreshXForScope(f), u.nextElementSibling !== g && (u.nextElementSibling && g.replaceWith(u.nextElementSibling), u.after(g)), u = g, g._x_currentIfEl && (g.nextElementSibling !== g._x_currentIfEl && u.after(g._x_currentIfEl), u = g._x_currentIfEl);
          return;
        }
        e.content.children.length > 1 && ce("x-for templates require a single root element, additional elements will be ignored.", e);
        let E = document.importNode(e.content, !0).firstElementChild, S = at(f);
        Mt(E, S, e), E._x_refreshXForScope = Gc(S), r.set(p, E), c.add(E), u.after(E), u = E;
      }), c.forEach((p) => ge(p)), u !== e ? e._x_lastRenderedEl = u : delete e._x_lastRenderedEl;
    });
  });
}
function zc(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, s = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, a = e.match(s);
  if (!a)
    return;
  let i = {};
  i.items = a[2].trim();
  let r = a[1].replace(n, "").trim(), o = r.match(t);
  return o ? (i.item = r.replace(t, "").trim(), i.index = o[1].trim(), o[2] && (i.collection = o[2].trim())) : i.item = r, i;
}
function Vc(e, t, n, s) {
  let a = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((r) => r.trim()).forEach((r, o) => {
    a[r] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((r) => r.trim()).forEach((r) => {
    a[r] = t[r];
  }) : a[e.item] = t, e.index && (a[e.index] = n), e.collection && (a[e.collection] = s), a;
}
function Kc(e) {
  return typeof e != "object" && !isNaN(e);
}
function Jc(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function cr() {
}
cr.inline = (e, { expression: t }, { cleanup: n }) => {
  let s = pn(e);
  s && (s._x_refs || (s._x_refs = {}), s._x_refs[t] = e, n(() => delete s._x_refs[t]));
};
F("ref", cr);
F("if", ke((e, { expression: t }, { effect: n, cleanup: s }) => {
  e.tagName.toLowerCase() !== "template" && ce("x-if can only be used on a <template> tag", e);
  let a = Z(e, t), i = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return Mt(o, {}, e), B(() => {
      e.after(o), ge(o);
    }), e._x_currentIfEl = o, e._x_lastRenderedEl = o, e._x_undoIf = () => {
      B(() => {
        ze(o), o.remove();
      }), delete e._x_currentIfEl, delete e._x_lastRenderedEl;
    }, o;
  }, r = () => {
    e._x_undoIf && (e._x_undoIf(), delete e._x_undoIf);
  };
  n(() => a((o) => {
    o ? i() : r();
  }), { priority: "structural" }), s(() => e._x_undoIf && e._x_undoIf());
}));
F("id", (e, { expression: t }, { evaluate: n }) => {
  n(t).forEach((a) => Nc(e, a));
});
fn((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
Ss(bi("@", gi(rt("on:"))));
F("on", ke((e, { value: t, modifiers: n, expression: s }, { cleanup: a }) => {
  let i = s ? Z(e, s) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let r = tt(e, t, n, (o) => {
    i(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  a(() => r());
}));
bn("Collapse", "collapse", "collapse");
bn("Intersect", "intersect", "intersect");
bn("Focus", "trap", "focus");
bn("Mask", "mask", "mask");
function bn(e, t, n) {
  F(t, (s) => ce(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, s));
}
F("html", (e, { expression: t }) => {
  xs(new Error("Using the x-html directive is prohibited in the CSP build"), e);
});
ot.setEvaluator(Xl);
ot.setRawEvaluator(Jl);
ot.setReactivityEngine({
  reactive: Ds,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (e, t = {}) => {
    let n;
    return n = oc(e, {
      scheduler: () => {
        n && (t.scheduler ? t.scheduler(n) : n());
      }
    }), n;
  },
  release: lc,
  raw: P
});
var Xc = ot, _t = Xc;
function Zc(e) {
  const t = window.__siteationDebugBar;
  return t ? (t.onRequest = e, t.requests.slice()) : [];
}
const an = "__siteationDebugBarHostLock";
function Yc(e) {
  if (!e || window[an]) return;
  const t = document.body, n = Math.max(0, window.innerWidth - document.documentElement.clientWidth), s = {
    overflow: t.style.overflow,
    paddingRight: t.style.paddingRight,
    inert: []
  };
  if (Array.from(t.children).forEach((a) => {
    a === e || a.contains(e) || !(a instanceof HTMLElement) || a.matches("script, style, link") || (s.inert.push([a, a.inert]), a.inert = !0);
  }), t.style.overflow = "hidden", n > 0) {
    const a = Number.parseFloat(window.getComputedStyle(t).paddingRight || "0");
    t.style.paddingRight = `${a + n}px`;
  }
  window[an] = s;
}
function Qc() {
  const e = window[an];
  e && (e.inert.forEach(([t, n]) => {
    t.inert = n;
  }), document.body.style.overflow = e.overflow, document.body.style.paddingRight = e.paddingRight, delete window[an]);
}
function ka(e, t) {
  if (e.key !== "Tab" || !t) return;
  const n = Array.from(t.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((r) => r.offsetParent !== null);
  if (n.length === 0) return;
  const s = n[0], a = n[n.length - 1], i = t.getRootNode().activeElement;
  e.shiftKey && i === s ? (e.preventDefault(), a.focus()) : !e.shiftKey && i === a && (e.preventDefault(), s.focus());
}
const et = 12;
function ed(e) {
  return !!(e && typeof e == "object" && Number.isFinite(e.left) && Number.isFinite(e.top));
}
function qn(e, t, n) {
  const s = Math.max(et, n.width - t.width - et), a = Math.max(et, n.height - t.height - et);
  return {
    left: Math.min(Math.max(e.left, et), s),
    top: Math.min(Math.max(e.top, et), a)
  };
}
function td(e, t, n) {
  return e.top + t.height / 2 < n / 2 ? "top" : "bottom";
}
const nd = 3;
function sd(e, t) {
  return Math.hypot(e, t) >= nd;
}
function ad(e) {
  const t = String(e || "").split(",").map((n) => n.trim()).filter(Boolean);
  return t.length === 0 ? rn : rn.filter((n) => id.includes(n.id) || t.includes(n.id));
}
const id = ["findings", "overview"], rn = [
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
    lead: "This page as a search engine or a link preview reads it: tags, headings, images, links and structured data.",
    graded: !1
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
function dr(e, t) {
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
    case "datalayer":
      return t.dataLayer.warningCount || null;
    case "vitals":
      return t.vitals.poorCount || null;
    case "history":
      return t.history.length || null;
    default:
      return null;
  }
}
const rd = {
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
function q(e, t = "") {
  return `<svg class="ndb-icon ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${rd[e] || ""}</svg>`;
}
function od(e) {
  return [...ld(e), ...cd(e), ...dd(e)];
}
function ld(e) {
  return rn.map((t) => {
    const n = dr(t.id, e);
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
function cd(e) {
  const t = [
    { value: "system", label: "Follow the system theme" },
    { value: "light", label: "Use the light theme" },
    { value: "dark", label: "Use the dark theme" }
  ], n = e.currentSection || {};
  return [
    ...t.map((s) => ({
      id: `theme:${s.value}`,
      group: "Appearance",
      label: s.label,
      hint: e.theme === s.value ? "Current" : "",
      keywords: `theme ${s.value}`,
      kind: "theme",
      arg: s.value
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
function dd(e) {
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
function ud(e, t) {
  const n = String(t || "").trim().toLowerCase(), s = n ? e.filter((a) => `${a.group} ${a.label} ${a.keywords}`.toLowerCase().includes(n)) : e;
  return s.map((a, i) => ({
    ...a,
    leads: i === 0 || s[i - 1].group !== a.group
  }));
}
function pd() {
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
const st = "full", ur = "masked", te = "none", hd = "[redacted]", fd = "[masked]", bd = "[maximum depth reached]", gd = "[circular]", md = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, yd = 5, Jt = 100, Sa = 400;
function vd(e) {
  return [st, ur, te].includes(e) ? e : st;
}
function wd(e) {
  return md.test(String(e));
}
function gn(e, t = st) {
  if (t !== te)
    return qs(e, t, 0, /* @__PURE__ */ new WeakSet());
}
function on(e, t = st) {
  return t === te ? "" : t === ur ? e === "" ? "" : fd : e.length <= Sa ? e : `${e.slice(0, Sa)}...`;
}
function pr(e, t = st) {
  if (t === te) return "";
  const n = e.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return on(n, st);
}
function qs(e, t, n, s) {
  if (e == null) return e;
  const a = typeof e;
  return a === "string" ? on(e, t) : a === "number" || a === "boolean" ? e : a === "function" ? `ƒ ${e.name || "anonymous"}()` : a === "symbol" ? e.toString() : a === "bigint" ? `${e}n` : a !== "object" ? a : e instanceof Node ? Ed(e) : e instanceof Date ? e.toISOString() : e instanceof Error ? `${e.name}: ${on(e.message, t)}` : e instanceof Map ? `Map(${e.size})` : e instanceof Set ? `Set(${e.size})` : n >= yd ? bd : s.has(e) ? gd : (s.add(e), Array.isArray(e) ? _d(e, t, n, s) : xd(e, t, n, s));
}
function _d(e, t, n, s) {
  const a = e.slice(0, Jt).map((i) => qs(i, t, n + 1, s));
  return e.length > Jt && a.push(`[${e.length - Jt} more]`), a;
}
function xd(e, t, n, s) {
  const a = mn(e), i = /* @__PURE__ */ Object.create(null);
  let r = 0;
  for (const o of a) {
    if (r >= Jt) {
      i.__truncated__ = a.length - r;
      break;
    }
    if (wd(o)) {
      i[o] = hd, r++;
      continue;
    }
    try {
      i[o] = qs(e[o], t, n + 1, s);
    } catch (l) {
      i[o] = `[unreadable: ${l && l.message ? l.message : "threw"}]`;
    }
    r++;
  }
  return i;
}
function mn(e) {
  try {
    const t = Object.keys(e);
    return t.length > 0 ? t : Reflect.ownKeys(e).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function Ed(e) {
  if (!(e instanceof Element)) return `<${e.nodeName.toLowerCase()}>`;
  const t = e.id ? `#${e.id}` : "", n = typeof e.className == "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${e.tagName.toLowerCase()}${t}${n}>`;
}
function kd(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var jn, Aa;
function Sd() {
  if (Aa) return jn;
  Aa = 1;
  function e(d) {
    return d instanceof Map ? d.clear = d.delete = d.set = function() {
      throw new Error("map is read-only");
    } : d instanceof Set && (d.add = d.clear = d.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(d), Object.getOwnPropertyNames(d).forEach((h) => {
      const y = d[h], T = typeof y;
      (T === "object" || T === "function") && !Object.isFrozen(y) && e(y);
    }), d;
  }
  class t {
    /**
     * @param {CompiledMode} mode
     */
    constructor(h) {
      h.data === void 0 && (h.data = {}), this.data = h.data, this.isMatchIgnored = !1;
    }
    ignoreMatch() {
      this.isMatchIgnored = !0;
    }
  }
  function n(d) {
    return d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function s(d, ...h) {
    const y = /* @__PURE__ */ Object.create(null);
    for (const T in d)
      y[T] = d[T];
    return h.forEach(function(T) {
      for (const j in T)
        y[j] = T[j];
    }), /** @type {T} */
    y;
  }
  const a = "</span>", i = (d) => !!d.scope, r = (d, { prefix: h }) => {
    if (d.startsWith("language:"))
      return d.replace("language:", "language-");
    if (d.includes(".")) {
      const y = d.split(".");
      return [
        `${h}${y.shift()}`,
        ...y.map((T, j) => `${T}${"_".repeat(j + 1)}`)
      ].join(" ");
    }
    return `${h}${d}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(h, y) {
      this.buffer = "", this.classPrefix = y.classPrefix, h.walk(this);
    }
    /**
     * Adds texts to the output stream
     *
     * @param {string} text */
    addText(h) {
      this.buffer += n(h);
    }
    /**
     * Adds a node open to the output stream (if needed)
     *
     * @param {Node} node */
    openNode(h) {
      if (!i(h)) return;
      const y = r(
        h.scope,
        { prefix: this.classPrefix }
      );
      this.span(y);
    }
    /**
     * Adds a node close to the output stream (if needed)
     *
     * @param {Node} node */
    closeNode(h) {
      i(h) && (this.buffer += a);
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
    span(h) {
      this.buffer += `<span class="${h}">`;
    }
  }
  const l = (d = {}) => {
    const h = { children: [] };
    return Object.assign(h, d), h;
  };
  class c {
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
    add(h) {
      this.top.children.push(h);
    }
    /** @param {string} scope */
    openNode(h) {
      const y = l({ scope: h });
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
    walk(h) {
      return this.constructor._walk(h, this.rootNode);
    }
    /**
     * @param {Renderer} builder
     * @param {Node} node
     */
    static _walk(h, y) {
      return typeof y == "string" ? h.addText(y) : y.children && (h.openNode(y), y.children.forEach((T) => this._walk(h, T)), h.closeNode(y)), h;
    }
    /**
     * @param {Node} node
     */
    static _collapse(h) {
      typeof h != "string" && h.children && (h.children.every((y) => typeof y == "string") ? h.children = [h.children.join("")] : h.children.forEach((y) => {
        c._collapse(y);
      }));
    }
  }
  class u extends c {
    /**
     * @param {*} options
     */
    constructor(h) {
      super(), this.options = h;
    }
    /**
     * @param {string} text
     */
    addText(h) {
      h !== "" && this.add(h);
    }
    /** @param {string} scope */
    startScope(h) {
      this.openNode(h);
    }
    endScope() {
      this.closeNode();
    }
    /**
     * @param {Emitter & {root: DataNode}} emitter
     * @param {string} name
     */
    __addSublanguage(h, y) {
      const T = h.root;
      y && (T.scope = `language:${y}`), this.add(T);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function p(d) {
    return d ? typeof d == "string" ? d : d.source : null;
  }
  function f(d) {
    return g("(?=", d, ")");
  }
  function E(d) {
    return g("(?:", d, ")*");
  }
  function S(d) {
    return g("(?:", d, ")?");
  }
  function g(...d) {
    return d.map((y) => p(y)).join("");
  }
  function m(d) {
    const h = d[d.length - 1];
    return typeof h == "object" && h.constructor === Object ? (d.splice(d.length - 1, 1), h) : {};
  }
  function A(...d) {
    return "(" + (m(d).capture ? "" : "?:") + d.map((T) => p(T)).join("|") + ")";
  }
  function $(d) {
    return new RegExp(d.toString() + "|").exec("").length - 1;
  }
  function Ve(d, h) {
    const y = d && d.exec(h);
    return y && y.index === 0;
  }
  const Ke = new RegExp(A(
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
  function X(d, { joinWith: h }) {
    let y = 0;
    return d.map((T) => {
      y += 1;
      const j = y;
      let U = p(T), _ = "";
      for (; U.length > 0; ) {
        const w = Ke.exec(U);
        if (!w) {
          _ += U;
          break;
        }
        _ += U.substring(0, w.index), U = U.substring(w.index + w[0].length), w[0][0] === "\\" && w[1] ? _ += "\\" + String(Number(w[1]) + j) : (_ += w[0], (w[0] === "(" || /^\(\?[<']/.test(w[0])) && y++);
      }
      return _;
    }).map((T) => `(${T})`).join(h);
  }
  const Q = /\b\B/, Je = "[a-zA-Z]\\w*", ye = "[a-zA-Z_]\\w*", ne = "\\b\\d+(\\.\\d+)?", Nt = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", $t = "\\b(0b[01]+)", wn = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", _n = (d = {}) => {
    const h = /^#![ ]*\//;
    return d.binary && (d.begin = g(
      h,
      /.*\b/,
      d.binary,
      /\b.*/
    )), s({
      scope: "meta",
      begin: h,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (y, T) => {
        y.index !== 0 && T.ignoreMatch();
      }
    }, d);
  }, Se = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, xn = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [Se]
  }, Rt = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [Se]
  }, En = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, V = function(d, h, y = {}) {
    const T = s(
      {
        scope: "comment",
        begin: d,
        end: h,
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
    const j = A(
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
        begin: g(
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
  }, ve = V("//", "$"), Ae = V("/\\*", "\\*/"), Xe = V("#", "$"), lt = {
    scope: "number",
    begin: ne,
    relevance: 0
  }, Lt = {
    scope: "number",
    begin: Nt,
    relevance: 0
  }, Ir = {
    scope: "number",
    begin: $t,
    relevance: 0
  }, Dr = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      Se,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [Se]
      }
    ]
  }, qr = {
    scope: "title",
    begin: Je,
    relevance: 0
  }, jr = {
    scope: "title",
    begin: ye,
    relevance: 0
  }, Ur = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + ye,
    relevance: 0
  };
  var Pt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: xn,
    BACKSLASH_ESCAPE: Se,
    BINARY_NUMBER_MODE: Ir,
    BINARY_NUMBER_RE: $t,
    COMMENT: V,
    C_BLOCK_COMMENT_MODE: Ae,
    C_LINE_COMMENT_MODE: ve,
    C_NUMBER_MODE: Lt,
    C_NUMBER_RE: Nt,
    END_SAME_AS_BEGIN: function(d) {
      return Object.assign(
        d,
        {
          /** @type {ModeCallback} */
          "on:begin": (h, y) => {
            y.data._beginMatch = h[1];
          },
          /** @type {ModeCallback} */
          "on:end": (h, y) => {
            y.data._beginMatch !== h[1] && y.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: Xe,
    IDENT_RE: Je,
    MATCH_NOTHING_RE: Q,
    METHOD_GUARD: Ur,
    NUMBER_MODE: lt,
    NUMBER_RE: ne,
    PHRASAL_WORDS_MODE: En,
    QUOTE_STRING_MODE: Rt,
    REGEXP_MODE: Dr,
    RE_STARTERS_RE: wn,
    SHEBANG: _n,
    TITLE_MODE: qr,
    UNDERSCORE_IDENT_RE: ye,
    UNDERSCORE_TITLE_MODE: jr
  });
  function Br(d, h) {
    d.input[d.index - 1] === "." && h.ignoreMatch();
  }
  function Fr(d, h) {
    d.className !== void 0 && (d.scope = d.className, delete d.className);
  }
  function Hr(d, h) {
    h && d.beginKeywords && (d.begin = "\\b(" + d.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", d.__beforeBegin = Br, d.keywords = d.keywords || d.beginKeywords, delete d.beginKeywords, d.relevance === void 0 && (d.relevance = 0));
  }
  function Gr(d, h) {
    Array.isArray(d.illegal) && (d.illegal = A(...d.illegal));
  }
  function Wr(d, h) {
    if (d.match) {
      if (d.begin || d.end) throw new Error("begin & end are not supported with match");
      d.begin = d.match, delete d.match;
    }
  }
  function zr(d, h) {
    d.relevance === void 0 && (d.relevance = 1);
  }
  const Vr = (d, h) => {
    if (!d.beforeMatch) return;
    if (d.starts) throw new Error("beforeMatch cannot be used with starts");
    const y = Object.assign({}, d);
    Object.keys(d).forEach((T) => {
      delete d[T];
    }), d.keywords = y.keywords, d.begin = g(y.beforeMatch, f(y.begin)), d.starts = {
      relevance: 0,
      contains: [
        Object.assign(y, { endsParent: !0 })
      ]
    }, d.relevance = 0, delete y.beforeMatch;
  }, Kr = [
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
  ], Jr = "keyword";
  function Js(d, h, y = Jr) {
    const T = /* @__PURE__ */ Object.create(null);
    return typeof d == "string" ? j(y, d.split(" ")) : Array.isArray(d) ? j(y, d) : Object.keys(d).forEach(function(U) {
      Object.assign(
        T,
        Js(d[U], h, U)
      );
    }), T;
    function j(U, _) {
      h && (_ = _.map((w) => w.toLowerCase())), _.forEach(function(w) {
        const O = w.split("|");
        T[O[0]] = [U, Xr(O[0], O[1])];
      });
    }
  }
  function Xr(d, h) {
    return h ? Number(h) : Zr(d) ? 0 : 1;
  }
  function Zr(d) {
    return Kr.includes(d.toLowerCase());
  }
  const Xs = {}, Oe = (d) => {
    console.error(d);
  }, Zs = (d, ...h) => {
    console.log(`WARN: ${d}`, ...h);
  }, Ze = (d, h) => {
    Xs[`${d}/${h}`] || (console.log(`Deprecated as of ${d}. ${h}`), Xs[`${d}/${h}`] = !0);
  }, It = new Error();
  function Ys(d, h, { key: y }) {
    let T = 0;
    const j = d[y], U = {}, _ = {};
    for (let w = 1; w <= h.length; w++)
      _[w + T] = j[w], U[w + T] = !0, T += $(h[w - 1]);
    d[y] = _, d[y]._emit = U, d[y]._multi = !0;
  }
  function Yr(d) {
    if (Array.isArray(d.begin)) {
      if (d.skip || d.excludeBegin || d.returnBegin)
        throw Oe("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), It;
      if (typeof d.beginScope != "object" || d.beginScope === null)
        throw Oe("beginScope must be object"), It;
      Ys(d, d.begin, { key: "beginScope" }), d.begin = X(d.begin, { joinWith: "" });
    }
  }
  function Qr(d) {
    if (Array.isArray(d.end)) {
      if (d.skip || d.excludeEnd || d.returnEnd)
        throw Oe("skip, excludeEnd, returnEnd not compatible with endScope: {}"), It;
      if (typeof d.endScope != "object" || d.endScope === null)
        throw Oe("endScope must be object"), It;
      Ys(d, d.end, { key: "endScope" }), d.end = X(d.end, { joinWith: "" });
    }
  }
  function eo(d) {
    d.scope && typeof d.scope == "object" && d.scope !== null && (d.beginScope = d.scope, delete d.scope);
  }
  function to(d) {
    eo(d), typeof d.beginScope == "string" && (d.beginScope = { _wrap: d.beginScope }), typeof d.endScope == "string" && (d.endScope = { _wrap: d.endScope }), Yr(d), Qr(d);
  }
  function no(d) {
    function h(_, w) {
      return new RegExp(
        p(_),
        "m" + (d.case_insensitive ? "i" : "") + (d.unicodeRegex ? "u" : "") + (w ? "g" : "")
      );
    }
    class y {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(w, O) {
        O.position = this.position++, this.matchIndexes[this.matchAt] = O, this.regexes.push([O, w]), this.matchAt += $(w) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const w = this.regexes.map((O) => O[1]);
        this.matcherRe = h(X(w, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(w) {
        this.matcherRe.lastIndex = this.lastIndex;
        const O = this.matcherRe.exec(w);
        if (!O)
          return null;
        const z = O.findIndex((ct, Sn) => Sn > 0 && ct !== void 0), H = this.matchIndexes[z];
        return O.splice(0, z), Object.assign(O, H);
      }
    }
    class T {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(w) {
        if (this.multiRegexes[w]) return this.multiRegexes[w];
        const O = new y();
        return this.rules.slice(w).forEach(([z, H]) => O.addRule(z, H)), O.compile(), this.multiRegexes[w] = O, O;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(w, O) {
        this.rules.push([w, O]), O.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(w) {
        const O = this.getMatcher(this.regexIndex);
        O.lastIndex = this.lastIndex;
        let z = O.exec(w);
        if (this.resumingScanAtSamePosition() && !(z && z.index === this.lastIndex)) {
          const H = this.getMatcher(0);
          H.lastIndex = this.lastIndex + 1, z = H.exec(w);
        }
        return z && (this.regexIndex += z.position + 1, this.regexIndex === this.count && this.considerAll()), z;
      }
    }
    function j(_) {
      const w = new T();
      return _.contains.forEach((O) => w.addRule(O.begin, { rule: O, type: "begin" })), _.terminatorEnd && w.addRule(_.terminatorEnd, { type: "end" }), _.illegal && w.addRule(_.illegal, { type: "illegal" }), w;
    }
    function U(_, w) {
      const O = (
        /** @type CompiledMode */
        _
      );
      if (_.isCompiled) return O;
      [
        Fr,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Wr,
        to,
        Vr
      ].forEach((H) => H(_, w)), d.compilerExtensions.forEach((H) => H(_, w)), _.__beforeBegin = null, [
        Hr,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Gr,
        // default to 1 relevance if not specified
        zr
      ].forEach((H) => H(_, w)), _.isCompiled = !0;
      let z = null;
      return typeof _.keywords == "object" && _.keywords.$pattern && (_.keywords = Object.assign({}, _.keywords), z = _.keywords.$pattern, delete _.keywords.$pattern), z = z || /\w+/, _.keywords && (_.keywords = Js(_.keywords, d.case_insensitive)), O.keywordPatternRe = h(z, !0), w && (_.begin || (_.begin = /\B|\b/), O.beginRe = h(O.begin), !_.end && !_.endsWithParent && (_.end = /\B|\b/), _.end && (O.endRe = h(O.end)), O.terminatorEnd = p(O.end) || "", _.endsWithParent && w.terminatorEnd && (O.terminatorEnd += (_.end ? "|" : "") + w.terminatorEnd)), _.illegal && (O.illegalRe = h(
        /** @type {RegExp | string} */
        _.illegal
      )), _.contains || (_.contains = []), _.contains = [].concat(..._.contains.map(function(H) {
        return so(H === "self" ? _ : H);
      })), _.contains.forEach(function(H) {
        U(
          /** @type Mode */
          H,
          O
        );
      }), _.starts && U(_.starts, w), O.matcher = j(O), O;
    }
    if (d.compilerExtensions || (d.compilerExtensions = []), d.contains && d.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return d.classNameAliases = s(d.classNameAliases || {}), U(
      /** @type Mode */
      d
    );
  }
  function Qs(d) {
    return d ? d.endsWithParent || Qs(d.starts) : !1;
  }
  function so(d) {
    return d.variants && !d.cachedVariants && (d.cachedVariants = d.variants.map(function(h) {
      return s(d, { variants: null }, h);
    })), d.cachedVariants ? d.cachedVariants : Qs(d) ? s(d, { starts: d.starts ? s(d.starts) : null }) : Object.isFrozen(d) ? s(d) : d;
  }
  var ao = "11.12.0";
  class io extends Error {
    constructor(h, y) {
      super(h), this.name = "HTMLInjectionError", this.html = y;
    }
  }
  const kn = n, ea = s, ta = /* @__PURE__ */ Symbol("nomatch"), ro = 7, na = function(d) {
    const h = /* @__PURE__ */ Object.create(null), y = /* @__PURE__ */ Object.create(null), T = [];
    let j = !0;
    const U = "Could not find the language '{}', did you forget to load/include a language module?", _ = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let w = {
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
    function O(b) {
      return w.noHighlightRe.test(b);
    }
    function z(b) {
      let k = b.className + " ";
      k += b.parentNode ? b.parentNode.className : "";
      const N = w.languageDetectRe.exec(k);
      if (N) {
        const I = we(N[1]);
        return I || (Zs(U.replace("{}", N[1])), Zs("Falling back to no-highlight mode for this block.", b)), I ? N[1] : "no-highlight";
      }
      return k.split(/\s+/).find((I) => O(I) || we(I));
    }
    function H(b, k, N) {
      let I = "", G = "";
      typeof k == "object" ? (I = b, N = k.ignoreIllegals, G = k.language) : (Ze("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ze("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), G = b, I = k), N === void 0 && (N = !0);
      const se = {
        code: I,
        language: G
      };
      qt("before:highlight", se);
      const _e = se.result ? se.result : ct(se.language, se.code, N);
      return _e.code = se.code, qt("after:highlight", _e), _e;
    }
    function ct(b, k, N, I) {
      const G = /* @__PURE__ */ Object.create(null);
      function se(v, x) {
        return v.keywords[x];
      }
      function _e() {
        if (!M.keywords) {
          K.addText(D);
          return;
        }
        let v = 0;
        M.keywordPatternRe.lastIndex = 0;
        let x = M.keywordPatternRe.exec(D), C = "";
        for (; x; ) {
          C += D.substring(v, x.index);
          const R = oe.case_insensitive ? x[0].toLowerCase() : x[0], J = se(M, R);
          if (J) {
            const [de, ko] = J;
            if (K.addText(C), C = "", G[R] = (G[R] || 0) + 1, G[R] <= ro && (Bt += ko), de.startsWith("_"))
              C += x[0];
            else {
              const So = oe.classNameAliases[de] || de;
              re(x[0], So);
            }
          } else
            C += x[0];
          v = M.keywordPatternRe.lastIndex, x = M.keywordPatternRe.exec(D);
        }
        C += D.substring(v), K.addText(C);
      }
      function jt() {
        if (D === "") return;
        let v = null;
        if (typeof M.subLanguage == "string") {
          if (!h[M.subLanguage]) {
            K.addText(D);
            return;
          }
          v = ct(M.subLanguage, D, !0, da[M.subLanguage]), da[M.subLanguage] = /** @type {CompiledMode} */
          v._top;
        } else
          v = An(D, M.subLanguage.length ? M.subLanguage : null);
        M.relevance > 0 && (Bt += v.relevance), K.__addSublanguage(v._emitter, v.language);
      }
      function ee() {
        M.subLanguage != null ? jt() : _e(), D = "";
      }
      function re(v, x) {
        v !== "" && (K.startScope(x), K.addText(v), K.endScope());
      }
      function ra(v, x) {
        let C = 1;
        const R = x.length - 1;
        for (; C <= R; ) {
          if (!v._emit[C]) {
            C++;
            continue;
          }
          const J = oe.classNameAliases[v[C]] || v[C], de = x[C];
          J ? re(de, J) : (D = de, _e(), D = ""), C++;
        }
      }
      function oa(v, x) {
        return v.scope && typeof v.scope == "string" && K.openNode(oe.classNameAliases[v.scope] || v.scope), v.beginScope && (v.beginScope._wrap ? (re(D, oe.classNameAliases[v.beginScope._wrap] || v.beginScope._wrap), D = "") : v.beginScope._multi && (ra(v.beginScope, x), D = "")), M = Object.create(v, { parent: { value: M } }), M;
      }
      function la(v, x, C) {
        let R = Ve(v.endRe, C);
        if (R) {
          if (v["on:end"]) {
            const J = new t(v);
            v["on:end"](x, J), J.isMatchIgnored && (R = !1);
          }
          if (R) {
            for (; v.endsParent && v.parent; )
              v = v.parent;
            return v;
          }
        }
        if (v.endsWithParent)
          return la(v.parent, x, C);
      }
      function vo(v) {
        return M.matcher.regexIndex === 0 ? (D += v[0], 1) : (Cn = !0, 0);
      }
      function wo(v) {
        const x = v[0], C = v.rule, R = new t(C), J = [C.__beforeBegin, C["on:begin"]];
        for (const de of J)
          if (de && (de(v, R), R.isMatchIgnored))
            return vo(x);
        return C.skip ? D += x : (C.excludeBegin && (D += x), ee(), !C.returnBegin && !C.excludeBegin && (D = x)), oa(C, v), C.returnBegin ? 0 : x.length;
      }
      function _o(v) {
        const x = v[0], C = k.substring(v.index), R = la(M, v, C);
        if (!R)
          return ta;
        const J = M;
        M.endScope && M.endScope._wrap ? (ee(), re(x, M.endScope._wrap)) : M.endScope && M.endScope._multi ? (ee(), ra(M.endScope, v)) : J.skip ? D += x : (J.returnEnd || J.excludeEnd || (D += x), ee(), J.excludeEnd && (D = x));
        do
          M.scope && K.closeNode(), !M.skip && !M.subLanguage && (Bt += M.relevance), M = M.parent;
        while (M !== R.parent);
        return R.starts && oa(R.starts, v), J.returnEnd ? 0 : x.length;
      }
      function xo() {
        const v = [];
        for (let x = M; x !== oe; x = x.parent)
          x.scope && v.unshift(x.scope);
        v.forEach((x) => K.openNode(x));
      }
      let Ut = {};
      function ca(v, x) {
        const C = x && x[0];
        if (D += v, C == null)
          return ee(), 0;
        if (Ut.type === "begin" && x.type === "end" && Ut.index === x.index && C === "") {
          if (D += k.slice(x.index, x.index + 1), !j) {
            const R = new Error(`0 width match regex (${b})`);
            throw R.languageName = b, R.badRule = Ut.rule, R;
          }
          return 1;
        }
        if (Ut = x, x.type === "begin")
          return wo(x);
        if (x.type === "illegal" && !N) {
          const R = new Error('Illegal lexeme "' + C + '" for mode "' + (M.scope || "<unnamed>") + '"');
          throw R.mode = M, R;
        } else if (x.type === "end") {
          const R = _o(x);
          if (R !== ta)
            return R;
        }
        if (x.type === "illegal" && C === "")
          return x.index === k.length || (D += `
`), 1;
        if (Mn > 1e5 && Mn > x.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return D += C, C.length;
      }
      const oe = we(b);
      if (!oe)
        throw Oe(U.replace("{}", b)), new Error('Unknown language: "' + b + '"');
      const Eo = no(oe);
      let Tn = "", M = I || Eo;
      const da = {}, K = new w.__emitter(w);
      xo();
      let D = "", Bt = 0, Te = 0, Mn = 0, Cn = !1;
      try {
        if (oe.__emitTokens)
          oe.__emitTokens(k, K);
        else {
          for (M.matcher.considerAll(); ; ) {
            Mn++, Cn ? Cn = !1 : M.matcher.considerAll(), M.matcher.lastIndex = Te;
            const v = M.matcher.exec(k);
            if (!v) break;
            const x = k.substring(Te, v.index), C = ca(x, v);
            Te = v.index + C;
          }
          ca(k.substring(Te));
        }
        return K.finalize(), Tn = K.toHTML(), {
          language: b,
          value: Tn,
          relevance: Bt,
          illegal: !1,
          _emitter: K,
          _top: M
        };
      } catch (v) {
        if (v.message && v.message.includes("Illegal"))
          return {
            language: b,
            value: kn(k),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: v.message,
              index: Te,
              context: k.slice(Te - 100, Te + 100),
              mode: v.mode,
              resultSoFar: Tn
            },
            _emitter: K
          };
        if (j)
          return {
            language: b,
            value: kn(k),
            illegal: !1,
            relevance: 0,
            errorRaised: v,
            _emitter: K,
            _top: M
          };
        throw v;
      }
    }
    function Sn(b) {
      const k = {
        value: kn(b),
        illegal: !1,
        relevance: 0,
        _top: _,
        _emitter: new w.__emitter(w)
      };
      return k._emitter.addText(b), k;
    }
    function An(b, k) {
      k = k || w.languages || Object.keys(h);
      const N = Sn(b), I = k.filter(we).filter(ia).map(
        (ee) => ct(ee, b, !1)
      );
      I.unshift(N);
      const G = I.sort((ee, re) => {
        if (ee.relevance !== re.relevance) return re.relevance - ee.relevance;
        if (ee.language && re.language) {
          if (we(ee.language).supersetOf === re.language)
            return 1;
          if (we(re.language).supersetOf === ee.language)
            return -1;
        }
        return 0;
      }), [se, _e] = G, jt = se;
      return jt.secondBest = _e, jt;
    }
    function oo(b, k, N) {
      const I = k && y[k] || N;
      b.classList.add("hljs"), b.classList.add(`language-${I}`);
    }
    function On(b) {
      let k = null;
      const N = z(b);
      if (O(N)) return;
      if (qt(
        "before:highlightElement",
        { el: b, language: N }
      ), b.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", b);
        return;
      }
      if (b.children.length > 0 && (w.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(b)), w.throwUnescapedHTML))
        throw new io(
          "One of your code blocks includes unescaped HTML.",
          b.innerHTML
        );
      k = b;
      const I = k.textContent, G = N ? H(I, { language: N, ignoreIllegals: !0 }) : An(I);
      b.innerHTML = G.value, b.dataset.highlighted = "yes", oo(b, N, G.language), b.result = {
        language: G.language,
        // TODO: remove with version 11.0
        re: G.relevance,
        relevance: G.relevance
      }, G.secondBest && (b.secondBest = {
        language: G.secondBest.language,
        relevance: G.secondBest.relevance
      }), qt("after:highlightElement", { el: b, result: G, text: I });
    }
    function lo(b) {
      w = ea(w, b);
    }
    const co = () => {
      Dt(), Ze("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function uo() {
      Dt(), Ze("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let sa = !1;
    function Dt() {
      function b() {
        Dt();
      }
      if (document.readyState === "loading") {
        sa || window.addEventListener("DOMContentLoaded", b, !1), sa = !0;
        return;
      }
      document.querySelectorAll(w.cssSelector).forEach(On);
    }
    function po(b, k) {
      let N = null;
      try {
        N = k(d);
      } catch (I) {
        if (Oe("Language definition for '{}' could not be registered.".replace("{}", b)), j)
          Oe(I);
        else
          throw I;
        N = _;
      }
      N.name || (N.name = b), h[b] = N, N.rawDefinition = k.bind(null, d), N.aliases && aa(N.aliases, { languageName: b });
    }
    function ho(b) {
      delete h[b];
      for (const k of Object.keys(y))
        y[k] === b && delete y[k];
    }
    function fo() {
      return Object.keys(h);
    }
    function we(b) {
      return b = (b || "").toLowerCase(), h[b] || h[y[b]];
    }
    function aa(b, { languageName: k }) {
      typeof b == "string" && (b = [b]), b.forEach((N) => {
        y[N.toLowerCase()] = k;
      });
    }
    function ia(b) {
      const k = we(b);
      return k && !k.disableAutodetect;
    }
    function bo(b) {
      b["before:highlightBlock"] && !b["before:highlightElement"] && (b["before:highlightElement"] = (k) => {
        b["before:highlightBlock"](
          Object.assign({ block: k.el }, k)
        );
      }), b["after:highlightBlock"] && !b["after:highlightElement"] && (b["after:highlightElement"] = (k) => {
        b["after:highlightBlock"](
          Object.assign({ block: k.el }, k)
        );
      });
    }
    function go(b) {
      bo(b), T.push(b);
    }
    function mo(b) {
      const k = T.indexOf(b);
      k !== -1 && T.splice(k, 1);
    }
    function qt(b, k) {
      const N = b;
      T.forEach(function(I) {
        I[N] && I[N](k);
      });
    }
    function yo(b) {
      return Ze("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ze("10.7.0", "Please use highlightElement now."), On(b);
    }
    Object.assign(d, {
      highlight: H,
      highlightAuto: An,
      highlightAll: Dt,
      highlightElement: On,
      // TODO: Remove with v12 API
      highlightBlock: yo,
      configure: lo,
      initHighlighting: co,
      initHighlightingOnLoad: uo,
      registerLanguage: po,
      unregisterLanguage: ho,
      listLanguages: fo,
      getLanguage: we,
      registerAliases: aa,
      autoDetection: ia,
      inherit: ea,
      addPlugin: go,
      removePlugin: mo
    }), d.debugMode = function() {
      j = !1;
    }, d.safeMode = function() {
      j = !0;
    }, d.versionString = ao, d.regex = {
      concat: g,
      lookahead: f,
      either: A,
      optional: S,
      anyNumberOfTimes: E
    };
    for (const b in Pt)
      typeof Pt[b] == "object" && e(Pt[b]);
    return Object.assign(d, Pt), d;
  }, Ye = na({});
  return Ye.newInstance = () => na({}), jn = Ye, Ye.HighlightJS = Ye, Ye.default = Ye, jn;
}
var Ad = /* @__PURE__ */ Sd();
const yn = /* @__PURE__ */ kd(Ad), Oa = "[A-Za-z$_][0-9A-Za-z$_]*", Od = [
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
], Td = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], hr = [
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
], fr = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], br = [
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
], Md = [
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
], Cd = [].concat(
  br,
  hr,
  fr
);
function Nd(e) {
  const t = e.regex, n = (V, { after: ve }) => {
    const Ae = "</" + V[0].slice(1);
    return V.input.indexOf(Ae, ve) !== -1;
  }, s = Oa, a = {
    begin: "<>",
    end: "</>"
  }, i = /<[A-Za-z0-9\\._:-]+\s*\/>/, r = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (V, ve) => {
      const Ae = V[0].length + V.index, Xe = V.input[Ae];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        Xe === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        Xe === ","
      ) {
        ve.ignoreMatch();
        return;
      }
      Xe === ">" && (n(V, { after: Ae }) || ve.ignoreMatch());
      let lt;
      const Lt = V.input.substring(Ae);
      if (lt = Lt.match(/^\s*=/)) {
        ve.ignoreMatch();
        return;
      }
      if ((lt = Lt.match(/^\s+extends\s+/)) && lt.index === 0) {
        ve.ignoreMatch();
        return;
      }
    }
  }, o = {
    $pattern: Oa,
    keyword: Od,
    literal: Td,
    built_in: Cd,
    "variable.language": Md
  }, l = "[0-9](_?[0-9])*", c = `\\.(${l})`, u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", p = {
    className: "number",
    variants: [
      // DecimalLiteral
      { begin: `(\\b(${u})((${c})|\\.)?|(${c}))[eE][+-]?(${l})\\b` },
      { begin: `\\b(${u})\\b((${c})\\b|\\.)?|(${c})\\b` },
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
  }, f = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: o,
    contains: []
    // defined later
  }, E = {
    begin: ".?html`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        f
      ],
      subLanguage: "xml"
    }
  }, S = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        f
      ],
      subLanguage: "css"
    }
  }, g = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [
        e.BACKSLASH_ESCAPE,
        f
      ],
      subLanguage: "graphql"
    }
  }, m = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      e.BACKSLASH_ESCAPE,
      f
    ]
  }, $ = {
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
                  begin: s + "(?=\\s*(-)|$)",
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
  }, Ve = [
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE,
    E,
    S,
    g,
    m,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    p
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  f.contains = Ve.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: o,
    contains: [
      "self"
    ].concat(Ve)
  });
  const Ke = [].concat($, f.contains), X = Ke.concat([
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
    contains: X
  }, Je = {
    variants: [
      // class Car extends vehicle
      {
        match: [
          /class/,
          /\s+/,
          s,
          /\s+/,
          /extends/,
          /\s+/,
          t.concat(s, "(", t.concat(/\./, s), ")*")
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
          s
        ],
        scope: {
          1: "keyword",
          3: "title.class"
        }
      }
    ]
  }, ye = {
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
        ...hr,
        ...fr
      ]
    }
  }, ne = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, Nt = {
    variants: [
      {
        match: [
          /function/,
          /\s+/,
          s,
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
  }, $t = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function wn(V) {
    return t.concat("(?!", V.join("|"), ")");
  }
  const _n = {
    match: t.concat(
      /\b/,
      wn([
        ...br,
        "super",
        "import",
        "await"
      ].map((V) => `${V}\\s*\\(`)),
      s,
      t.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, Se = {
    begin: t.concat(/\./, t.lookahead(
      t.concat(s, /(?![0-9A-Za-z$_(])/)
    )),
    end: s,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, xn = {
    match: [
      /get|set/,
      /\s+/,
      s,
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
  }, Rt = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", En = {
    match: [
      /const|var|let/,
      /\s+/,
      s,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      t.lookahead(Rt)
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
    exports: { PARAMS_CONTAINS: X, CLASS_REFERENCE: ye },
    illegal: /#(?![$_A-Za-z])/,
    contains: [
      e.SHEBANG({
        label: "shebang",
        binary: "node",
        relevance: 5
      }),
      ne,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      E,
      S,
      g,
      m,
      $,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      p,
      ye,
      {
        scope: "attr",
        match: s + t.lookahead(":"),
        relevance: 0
      },
      En,
      {
        // "value" container
        begin: "(" + e.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
        keywords: "return throw case",
        relevance: 0,
        contains: [
          $,
          e.REGEXP_MODE,
          {
            className: "function",
            // we have to count the parens to make sure we actually have the
            // correct bounding ( ) before the =>.  There could be any number of
            // sub-expressions inside also surrounded by parens.
            begin: Rt,
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
                    contains: X
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
              { begin: a.begin, end: a.end },
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
      Nt,
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
          e.inherit(e.TITLE_MODE, { begin: s, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      Se,
      // hack: prevents detection of keywords in some circumstances
      // .keyword()
      // $keyword = x
      {
        match: "\\$" + s,
        relevance: 0
      },
      {
        match: [/\bconstructor(?=\s*\()/],
        className: { 1: "title.function" },
        contains: [Q]
      },
      _n,
      $t,
      Je,
      xn,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const $d = "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity", Rd = {
  scope: "number",
  match: $d,
  relevance: 0
};
function Ld(e) {
  const t = {
    className: "attr",
    begin: /(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,
    relevance: 1.01
  }, n = {
    match: /[{}[\],:]/,
    className: "punctuation",
    relevance: 0
  }, s = [
    "true",
    "false",
    "null"
  ], a = {
    scope: "literal",
    beginKeywords: s.join(" ")
  };
  return {
    name: "JSON",
    aliases: ["jsonc", "json5"],
    keywords: {
      literal: s
    },
    contains: [
      t,
      n,
      e.APOS_STRING_MODE,
      e.QUOTE_STRING_MODE,
      a,
      Rd,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function Pd(e) {
  const t = e.regex, n = e.COMMENT("--", "$"), s = {
    scope: "string",
    variants: [
      {
        begin: /'/,
        end: /'/,
        contains: [{ match: /''/ }]
      }
    ]
  }, a = {
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
  ], c = [
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
  ], p = [
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
  ], f = [
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
  ], E = u, S = [
    ...c,
    ...l
  ].filter((X) => !u.includes(X)), g = {
    scope: "variable",
    match: /@[a-z0-9][a-z0-9_]*/
  }, m = {
    scope: "operator",
    match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  }, A = {
    match: t.concat(/\b/, t.either(...E), /\s*\(/),
    relevance: 0,
    keywords: { built_in: E }
  };
  function $(X) {
    return t.concat(
      /\b/,
      t.either(...X.map((Q) => Q.replace(/\s+/, "\\s+"))),
      /\b/
    );
  }
  const Ve = {
    scope: "keyword",
    match: $(f),
    relevance: 0
  };
  function Ke(X, {
    exceptions: Q,
    when: Je
  } = {}) {
    const ye = Je;
    return Q = Q || [], X.map((ne) => ne.match(/\|\d+$/) || Q.includes(ne) ? ne : ye(ne) ? `${ne}|0` : ne);
  }
  return {
    name: "SQL",
    case_insensitive: !0,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: Ke(S, { when: (X) => X.length < 3 }),
      literal: i,
      type: o,
      built_in: p
    },
    contains: [
      {
        scope: "type",
        match: $(r)
      },
      Ve,
      A,
      g,
      s,
      a,
      e.C_NUMBER_MODE,
      e.C_BLOCK_COMMENT_MODE,
      n,
      m
    ]
  };
}
yn.registerLanguage("javascript", Nd);
yn.registerLanguage("json", Ld);
yn.registerLanguage("sql", Pd);
const Wt = /* @__PURE__ */ new Map(), Id = 400, Dd = 2e4;
function Ta(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function qd(e, t) {
  const n = String(e ?? "");
  if (n === "") return "";
  if (n.length > Dd) return Ta(n);
  const s = `${t}:${n}`, a = Wt.get(s);
  if (a !== void 0) return a;
  let i;
  try {
    i = yn.highlight(n, { language: t, ignoreIllegals: !0 }).value;
  } catch {
    i = Ta(n);
  }
  return Wt.size >= Id && Wt.clear(), Wt.set(s, i), i;
}
async function ls(e) {
  const t = await fetch(e, { headers: { Accept: "application/json" } }), n = await t.json().catch(() => null);
  if (!t.ok) throw new Error(n && n.error || `HTTP ${t.status}`);
  if (n === null) throw new Error("The response was not JSON.");
  return n;
}
async function Ma(e) {
  const t = await ls(e), n = {};
  return Object.entries(t.sections || {}).forEach(([s, a]) => {
    n[s] = a.payload || {};
  }), { profile: t, payloads: n };
}
function js(e, t = 0) {
  return Number(e || 0).toFixed(t);
}
function Us(e) {
  const t = Number(e || 0);
  return t < 1024 ? `${t} B` : t < 1048576 ? `${(t / 1024).toFixed(1)} kB` : `${(t / 1048576).toFixed(1)} MB`;
}
function jd(e, t, n) {
  return `${e} ${Number(e) === 1 ? t : n}`;
}
function Ud(e, t = Date.now() / 1e3) {
  const n = Math.max(0, t - Number(e || 0));
  return n < 60 ? `${Math.round(n)}s ago` : n < 3600 ? `${Math.round(n / 60)}m ago` : `${Math.round(n / 3600)}h ago`;
}
function Bd(e, t) {
  let n = e;
  try {
    n = new URL(e, t).pathname;
  } catch {
    return e;
  }
  if (n.length <= 42) return n;
  const s = n.split("/").filter(Boolean);
  return s.length > 2 ? `…/${s.slice(-2).join("/")}` : n;
}
function Fd(e) {
  const t = e && e.magewire;
  return t && t.component ? `${t.component} ${t.action || ""}`.trim() : e && e.path || "/";
}
function Hd(e) {
  if (!e || e.delta === null || e.delta === void 0) return "not comparable";
  if (e.delta === 0) return "no change";
  const t = e.delta > 0 ? "+" : "-", n = e.unit === "B" ? Us(Math.abs(e.delta)) : `${js(Math.abs(e.delta), e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
  return `${t}${n}`;
}
function Gd(e, t) {
  const n = e[t];
  return n == null ? "none" : e.unit === "B" ? Us(n) : `${js(n, e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
}
function Wd(e) {
  return Object.entries(e.methods || {}).map(([t, n]) => `${n} ${t}`).join(", ");
}
function gr(e, t, n, s) {
  if (!e || !n || !/^[a-z][a-z0-9+.-]*:\/\//i.test(e) || /^(javascript|data|vbscript):/i.test(e))
    return "";
  const a = n.startsWith("/") ? n : `${t}/${n}`;
  return e.replace("%f", () => encodeURI(a)).replace("%l", () => String(s || 1));
}
function zd(e, t, n) {
  const s = String(n || "").match(/^(.+\.php):(\d+)$/);
  return s ? gr(e, t, s[1], Number(s[2])) : "";
}
const cs = /* @__PURE__ */ new Map(), zt = /* @__PURE__ */ new Map();
function Bs() {
  const e = window.Magewire || window.magewire;
  return e && typeof e == "object" ? e : null;
}
function Fs() {
  const e = Bs();
  try {
    return Object.values(e?.components?.componentsById ?? {});
  } catch {
    return [];
  }
}
function Vd(e) {
  try {
    return JSON.stringify(e ?? {}).length;
  } catch {
    return 0;
  }
}
function Kd(e) {
  return cs.clear(), Fs().map((t) => {
    const n = t.fingerprint ?? {}, s = t.serverMemo ?? {}, a = String(n.id ?? "");
    return t.el && cs.set(a, t.el), {
      id: a,
      name: String(n.name ?? "unknown"),
      resolver: String(n.resolver ?? "unknown"),
      handle: String(n.handle ?? ""),
      keys: e === te ? 0 : mn(s.data ?? {}).length,
      memo_bytes: Vd(s),
      listeners: (t.effects?.listeners ?? []).length,
      children: Object.keys(s.children ?? {}).length,
      path: t.el ? Jd(t.el) : ""
    };
  });
}
function Jd(e) {
  const t = e.tagName ? e.tagName.toLowerCase() : "?";
  return e.id ? `${t}#${e.id}` : t;
}
function Ca(e, t) {
  if (t === te)
    return "The value policy is set to none, so component state is not read.";
  const n = Fs().find((s) => String(s.fingerprint?.id) === String(e));
  if (!n) return "This component is no longer on the page.";
  try {
    return JSON.stringify(gn(n.serverMemo?.data ?? {}, t), null, 2);
  } catch (s) {
    return `Could not read this component: ${s && s.message ? s.message : "threw"}`;
  }
}
function Xd() {
  return {
    present: Bs() !== null,
    components: Fs().length,
    // Already the route, not the base: Magewire publishes it as /magewire/post and the
    // client appends the action itself.
    endpoint: String(window.livewire_app_url || "")
  };
}
function Na(e) {
  const t = Bs();
  if (!t || typeof t.hook != "function") return !1;
  const n = /* @__PURE__ */ new Map(), s = (i) => String(i?.fingerprint?.name ?? "unknown"), a = (i) => String(i?.component?.fingerprint?.id ?? "");
  try {
    t.hook("message.sent", (i, r) => {
      n.set(a(i), { at: performance.now(), name: s(r) });
    }), t.hook("message.processed", (i, r) => {
      const o = n.get(a(i));
      n.delete(a(i)), e({
        component: s(r),
        action: $a(i),
        duration_ms: o ? Math.round((performance.now() - o.at) * 10) / 10 : null,
        failed: !1
      });
    }), t.hook("message.failed", (i, r) => {
      n.delete(a(i)), e({
        component: s(r),
        action: $a(i),
        duration_ms: null,
        failed: !0
      });
    });
  } catch {
    return !1;
  }
  return !0;
}
function $a(e) {
  const t = (e?.updateQueue ?? [])[0];
  if (!t) return "refresh";
  const n = t.payload ?? {}, s = (...a) => a.map((i) => n[i] ?? t[i]).find(Boolean) ?? "unknown";
  return t.type === "callMethod" ? `${s("method")}()` : t.type === "syncInput" ? `set ${s("name")}` : t.type === "fireEvent" ? `on ${s("event")}` : String(t.type || "update");
}
function Zd(e, t) {
  const n = cs.get(String(e));
  if (!n || !n.style) return;
  if (t) {
    zt.has(String(e)) || zt.set(String(e), {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  const s = zt.get(String(e));
  s && (n.style.outline = s.outline, n.style.outlineOffset = s.offset, zt.delete(String(e)));
}
const Un = /* @__PURE__ */ new WeakMap(), ln = /* @__PURE__ */ new Map(), ht = /* @__PURE__ */ new Map();
let Ra = 0;
function vn() {
  const e = Fn || window.Alpine;
  return !e || typeof e != "object" || e === _t ? null : e;
}
function mr(e) {
  try {
    return typeof e.prefixed == "function" ? e.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function ds(e) {
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
function Yd(e) {
  if (typeof e.evaluate != "function") return null;
  const t = ds(() => e.evaluate(document.body, "1"));
  return t === 1 ? !1 : t === void 0 ? !0 : null;
}
function La() {
  return Array.from(document.scripts).map((e) => e.src).filter((e) => /alpine/i.test(e)).map((e) => e.split("/").pop().split("?")[0]).join(", ");
}
function Qd(e) {
  if (typeof e.injectMagics == "function") {
    const t = ds(() => {
      const n = {};
      return e.injectMagics(n, document.body), n.$store;
    });
    if (t && typeof t == "object") return t;
  }
  if (typeof e.evaluate == "function") {
    const t = ds(() => e.evaluate(document.body, "$store"));
    if (t && typeof t == "object") return t;
  }
  return null;
}
function eu(e) {
  const t = e.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return t ? t[1] : "inline";
}
function tu(e) {
  if (e.id) return `#${e.id}`;
  const t = [];
  let n = e;
  for (; n && n !== document.body && t.length < 4; ) {
    const s = n.parentElement, a = n.tagName.toLowerCase();
    if (n.id) {
      t.unshift(`#${n.id}`);
      break;
    }
    if (s) {
      const i = Array.from(s.children).filter((r) => r.tagName === n.tagName);
      t.unshift(i.length > 1 ? `${a}:nth-of-type(${i.indexOf(n) + 1})` : a);
    } else
      t.unshift(a);
    n = s;
  }
  return t.join(" > ");
}
function nu(e) {
  return Un.has(e) || (Ra += 1, Un.set(e, Ra)), Un.get(e);
}
function yr(e, t) {
  const n = t._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof e.$data != "function") return null;
  try {
    return e.$data(t);
  } catch {
    return null;
  }
}
function su(e) {
  const t = vn();
  if (ln.clear(), !t) return [];
  const n = mr(t), s = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((i) => {
    const r = nu(i), o = (i.getAttribute(n) || "").trim(), l = (i.getAttribute(s) || "").trim(), c = yr(t, i);
    return ln.set(r, i), {
      id: r,
      name: eu(o),
      expression: pr(o, e),
      path: tu(i),
      initialised: !!i._x_dataStack,
      deferred: i.hasAttribute(s),
      strategy: l || "none",
      keys: e === te || !c ? 0 : mn(c).length
    };
  });
}
function Pa(e, t) {
  if (t === te)
    return "The value policy is set to none, so component state is not read.";
  const n = vn(), s = ln.get(e);
  if (!n || !s) return "This component is no longer on the page.";
  if (!s._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const a = yr(n, s);
  if (!a) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(gn(a, t), null, 2);
  } catch (i) {
    return `Could not read this component: ${i && i.message ? i.message : "threw"}`;
  }
}
function au(e) {
  const t = vn();
  if (!t) return [];
  const n = Qd(t);
  return n ? Object.keys(n).map((s) => {
    let a = n[s], i = 0;
    if (i = a && typeof a == "object" ? mn(a).length : 0, e === te)
      return { name: s, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      a = JSON.stringify(gn(a, e), null, 2);
    } catch (r) {
      a = `Could not read this store: ${r && r.message ? r.message : "threw"}`;
    }
    return { name: s, keys: i, value: a };
  }) : [];
}
function iu(e) {
  const t = window.__siteationDebugBar;
  return !t || !Array.isArray(t.alpineErrors) ? [] : t.alpineErrors.map((n) => {
    const s = String(n.message || ""), a = s.match(/Expression: "([\s\S]*?)"/);
    return {
      // An expression that threw is still a server rendered expression, and a message that
      // names the value it choked on is still that value. The rest of this section applies
      // the policy to exactly these two things; this was the one reader that did not.
      message: on(s.split(`
`)[0].replace(/^Alpine (Expression )?Error:\s*/, ""), e),
      expression: a ? pr(a[1], e) : "",
      element: String(n.element || ""),
      during_init: !!n.during_init
    };
  });
}
function ru() {
  const e = vn();
  return e ? {
    present: !0,
    version: String(e.version || "unknown"),
    csp: Yd(e),
    source: La(),
    prefix: mr(e)
  } : { present: !1, version: "", csp: null, source: La(), prefix: "" };
}
function ou(e, t) {
  const n = ln.get(e);
  if (!n || !n.style) return;
  if (t) {
    ht.has(e) || ht.set(e, {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  if (!ht.has(e)) return;
  const s = ht.get(e);
  n.style.outline = s.outline, n.style.outlineOffset = s.offset, ht.delete(e);
}
const Ia = 2e5, lu = /^https?:\/\/(www\.)?schema\.org\//i, vr = {
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
}, Hs = {
  NewsArticle: "Article",
  BlogPosting: "Article",
  ProductGroup: "Product",
  Corporation: "Organization",
  OnlineStore: "Organization",
  OnlineBusiness: "Organization",
  LocalBusiness: "Organization",
  Store: "Organization"
}, cu = ["BreadcrumbList", "WebSite", "Organization", "FAQPage"];
function me(e) {
  return (Array.isArray(e) ? e : String(e ?? "").split(/\s+/)).map((n) => String(n ?? "").trim().replace(lu, "")).filter(Boolean);
}
function wr(e) {
  for (const t of e) {
    const n = Hs[t] || t;
    if (vr[n]) return n;
  }
  return "";
}
function du(e, t) {
  const n = /line (\d+) column (\d+)/i.exec(e);
  if (n) return { line: Number(n[1]), column: Number(n[2]) };
  const s = /position (\d+)/i.exec(e);
  if (!s) return null;
  const a = t.slice(0, Number(s[1])).split(`
`);
  return { line: a.length, column: a[a.length - 1].length + 1 };
}
function uu(e) {
  const t = [], n = [];
  return Array.from(e.querySelectorAll("script[type]")).filter((s) => s.getAttribute("type").trim().toLowerCase() === "application/ld+json").forEach((s, a) => {
    const i = String(s.textContent || ""), r = { index: a, error: "", at: null, excerpt: "", entities: 0 };
    if (t.push(r), i.trim() === "") {
      r.error = "The block is empty.";
      return;
    }
    let o;
    try {
      o = JSON.parse(i);
    } catch (c) {
      r.error = String(c && c.message || c), r.at = du(r.error, i), r.excerpt = r.at ? (i.split(`
`)[r.at.line - 1] || "").trim().slice(0, 160) : "";
      return;
    }
    (Array.isArray(o) ? o : [o]).forEach((c) => {
      if (!c || typeof c != "object") return;
      const u = Array.isArray(c["@graph"]) ? c["@graph"] : [c], p = c["@context"];
      u.forEach((f) => {
        if (!f || typeof f != "object") return;
        const E = p && !f["@context"] && f !== c ? { "@context": p, ...f } : f;
        n.push({ source: "json-ld", block: a, data: E }), r.entities += 1;
      });
    });
  }), { blocks: t, entities: n };
}
function pu(e) {
  const t = e.tagName.toLowerCase(), n = (s) => (e.getAttribute(s) || "").trim();
  return t === "meta" ? n("content") : ["a", "area", "link"].includes(t) ? n("href") : ["audio", "embed", "iframe", "img", "source", "track", "video"].includes(t) ? n("src") : t === "object" ? n("data") : ["data", "meter"].includes(t) ? n("value") : t === "time" && e.hasAttribute("datetime") ? n("datetime") : e.hasAttribute("content") ? n("content") : String(e.textContent || "").replace(/\s+/g, " ").trim();
}
function _r(e) {
  const t = {}, n = me(e.getAttribute("itemtype"));
  n.length === 1 ? t["@type"] = n[0] : n.length > 1 && (t["@type"] = n), e.getAttribute("itemid") && (t["@id"] = e.getAttribute("itemid"));
  const s = (i, r) => {
    i in t ? Array.isArray(t[i]) ? t[i].push(r) : t[i] = [t[i], r] : t[i] = r;
  }, a = (i) => {
    Array.from(i.children).forEach((r) => {
      const o = (r.getAttribute("itemprop") || "").trim().split(/\s+/).filter(Boolean), l = r.hasAttribute("itemscope");
      o.forEach((c) => s(c, l ? _r(r) : pu(r))), l || a(r);
    });
  };
  return a(e), t;
}
function xr(e) {
  const t = Array.from(e.querySelectorAll("[itemscope]")).filter((n) => !n.hasAttribute("itemprop"));
  return {
    entities: t.map((n, s) => {
      const a = me(n.getAttribute("itemtype")), i = t.findIndex((r) => r !== n && r.contains(n) && me(r.getAttribute("itemtype")).some((o) => a.includes(o)));
      return {
        source: "microdata",
        block: s,
        where: hu(n),
        inside: i,
        data: _r(n)
      };
    }),
    elements: t
  };
}
function hu(e) {
  const t = e.tagName.toLowerCase(), n = e.getAttribute("id"), s = (e.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
  return n ? `<${t} id="${n}">` : s.length > 0 ? `<${t} class="${s[0]}">` : `<${t}>`;
}
function Gs(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.some(Gs) : !0;
}
function Ie(e, t) {
  const [n, ...s] = t.split("."), a = e[n];
  return s.length === 0 ? Gs(a) : (Array.isArray(a) ? a : [a]).some((r) => r && typeof r == "object" && Ie(r, s.join(".")));
}
function Er(e, t, n, s = 0) {
  if (s > 6) return;
  const a = me(e["@type"]), i = wr(a), r = t ? `${t} > ${a[0] || "item"}` : a[0] || "item", o = vr[i];
  if (o) {
    const l = (c, u) => n.push({ level: c, path: r, message: u, docs: o.docs });
    (o.required || []).filter((c) => !Ie(e, c)).forEach((c) => {
      l("required", `Missing ${c}.`);
    }), (o.oneOf || []).filter((c) => !c.some((u) => Ie(e, u))).forEach((c) => {
      l("required", `Needs one of ${c.join(", ")}.`);
    }), (o.recommended || []).filter((c) => !Ie(e, c)).forEach((c) => {
      l("recommended", `No ${c}.`);
    }), o.note && l("note", o.note), i === "BreadcrumbList" && fu(e, l), i === "WebSite" && bu(e, l), (i === "Offer" || i === "AggregateOffer") && gu(e, l);
  }
  Object.entries(e).forEach(([l, c]) => {
    if (l.startsWith("@")) return;
    (Array.isArray(c) ? c : [c]).forEach((p) => {
      p && typeof p == "object" && p["@type"] && Er(p, `${r} > ${l}`, n, s + 1);
    });
  });
}
function fu(e, t) {
  const s = (Array.isArray(e.itemListElement) ? e.itemListElement : [e.itemListElement]).filter((i) => i && typeof i == "object");
  s.forEach((i, r) => {
    const o = Ie(i, "name") || Ie(i, "item.name"), l = Ie(i, "item");
    o || t("required", `Crumb ${r + 1} has no name.`), !l && r < s.length - 1 && t("required", `Crumb ${r + 1} has no item URL.`);
  }), s.map((i) => Number(i.position)).some((i, r) => i !== r + 1) && t("required", "The crumb positions do not count up from 1.");
}
function bu(e, t) {
  (Array.isArray(e.potentialAction) ? e.potentialAction : [e.potentialAction]).filter((s) => s && typeof s == "object" && me(s["@type"]).includes("SearchAction")).forEach((s) => {
    const a = typeof s.target == "object" && s.target ? String(s.target.urlTemplate || "") : String(s.target || ""), i = String(s["query-input"] || ""), r = (/name=([\w-]+)/.exec(i) || [])[1] || "";
    a ? r && !a.includes(`{${r}}`) && t("required", `The SearchAction target has no {${r}} for the query-input to fill.`) : t("required", "The SearchAction has no target.");
  });
}
function gu(e, t) {
  const n = e.price ?? e.lowPrice;
  Gs(n) && !/^\d+(\.\d+)?$/.test(String(n).trim()) && t("required", `The price "${n}" is not a plain number. Use a dot for decimals and leave out the currency sign.`);
  const s = String(e.priceCurrency || "").trim();
  s && !/^[A-Z]{3}$/.test(s) && t("required", `"${s}" is not a three letter ISO 4217 currency code.`);
}
function mu(e) {
  const t = e.name ?? e.headline ?? e.url ?? e["@id"] ?? "", n = Array.isArray(t) ? t[0] : t;
  return typeof n == "string" ? n.replace(/\s+/g, " ").trim().slice(0, 120) : "";
}
function kr(e) {
  const t = me(e["@type"]).map((s) => Hs[s] || s).sort(), n = e["@id"] || e.sku || e.url || e.name;
  return t.length === 0 || !n || typeof n != "string" ? "" : `${t.join("+")}|${n.trim().toLowerCase()}`;
}
function Da(e) {
  const t = e.map((n) => kr(n.data));
  return t[0] !== "" && t.every((n) => n === t[0]);
}
function yu(e) {
  const t = [], n = /* @__PURE__ */ new Map(), s = e.filter((r) => r.source === "microdata"), a = /* @__PURE__ */ new Set();
  s.forEach((r) => {
    if (r.inside === void 0 || r.inside < 0) return;
    const o = s.find((l) => l.block === r.inside);
    o && (a.add(o), t.push(`${r.type} is declared on ${o.where} and again on ${r.where} inside it. Its properties go to the inner one, so the outer one is a second, empty ${r.type}. Remove one itemscope.`));
  }), e = e.filter((r) => !a.has(r)), e.forEach((r) => {
    const o = kr(r.data);
    o && n.set(o, [...n.get(o) || [], r]);
  }), n.forEach((r) => {
    if (r.length < 2) return;
    const o = [...new Set(r.map((c) => c.source === "json-ld" ? "JSON-LD" : "microdata"))], l = o.length > 1 ? `in both ${o.join(" and ")}` : `${r.length} times in ${o[0]}`;
    t.push(`${r[0].type} "${r[0].name}" is described ${l}. Usually a theme and a module both write it; keep one.`);
  }), cu.forEach((r) => {
    const o = e.filter((l) => me(l.data["@type"]).some((c) => (Hs[c] || c) === r));
    o.length > 1 && !Da(o) && t.push(`${o.length} ${r} entities on one page. A page has one; keep the one that is right.`);
  });
  const i = e.filter((r) => wr(me(r.data["@type"])) === "Product");
  return i.length > 1 && !Da(i) && t.push(`${i.length} different top level products. A product page describes one; a list of products belongs in an ItemList.`), t;
}
function vu(e) {
  let t;
  try {
    t = new URL(e).hostname.toLowerCase();
  } catch {
    return !1;
  }
  return !(t === "localhost" || !t.includes(".") || /\.(test|local|localhost|internal|example|invalid|lan|home|dev\.local)$/.test(t) || /^(10|127)\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^169\.254\./.test(t) || t.startsWith("["));
}
function wu(e) {
  const t = vu(e), n = encodeURIComponent(e);
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
function _u(e) {
  const t = Array.from(e.querySelectorAll("script[type]")).filter((a) => a.getAttribute("type").trim().toLowerCase() === "application/ld+json").map((a) => `<script type="application/ld+json">${a.textContent}<\/script>`), n = xr(e).elements.map((a) => a.outerHTML), s = [...t, ...n].join(`
`);
  return s.length > Ia ? s.slice(0, Ia) : s;
}
function xu(e, t) {
  const n = uu(e), s = xr(e), a = [...n.entities, ...s.entities].map((r, o) => {
    const l = [];
    return Er(r.data, "", l), {
      index: o,
      source: r.source,
      block: r.block,
      where: r.where || "",
      inside: r.inside ?? -1,
      type: me(r.data["@type"]).join(", ") || "untyped",
      name: mu(r.data),
      json: JSON.stringify(r.data, null, 2),
      data: r.data,
      findings: l
    };
  }), i = [];
  return n.blocks.filter((r) => r.error).forEach((r) => {
    const o = r.at ? ` at line ${r.at.line}, column ${r.at.column}` : "";
    i.push(`JSON-LD block ${r.index + 1} does not parse${o}: ${r.error}`);
  }), i.push(...yu(a)), a.forEach((r) => {
    r.wrapper = r.source === "microdata" && a.some((o) => o.source === "microdata" && o.inside === r.block);
  }), a.forEach((r) => {
    r.wrapper || r.findings.filter((o) => o.level === "required").forEach((o) => {
      i.push(`${o.path}: ${o.message}`);
    });
  }), a.forEach((r) => {
    delete r.data;
  }), {
    model: {
      blocks: n.blocks,
      entities: a,
      warnings: i,
      links: wu(t)
    },
    elements: s.elements
  };
}
function Eu() {
  return { blocks: [], entities: [], warnings: [], links: { public: !1, tools: [] } };
}
const ku = { min: 30, max: 60 }, Su = { min: 70, max: 160 }, Au = ["og:title", "og:type", "og:image", "og:url"], Ou = ["twitter:card"], Tu = 2, Mu = 200, qa = 160, Cu = /^[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?$/i;
function Nu(e) {
  const t = e.getBoundingClientRect(), n = e.ownerDocument.defaultView, s = n ? n.getComputedStyle(e) : null, a = !!s && (s.clip === "rect(0px, 0px, 0px, 0px)" || s.clipPath === "inset(50%)");
  return {
    visible: (typeof e.checkVisibility == "function" ? e.checkVisibility({ opacityProperty: !0, visibilityProperty: !0 }) : t.width > 0 && t.height > 0) && !a && t.width > 1 && t.height > 1,
    top: t.top + (n ? n.scrollY : 0),
    width: t.width,
    height: t.height,
    naturalWidth: Number(e.naturalWidth || 0),
    naturalHeight: Number(e.naturalHeight || 0)
  };
}
function $u() {
  return {
    measure: Nu,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
}
function He(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length <= qa ? t : `${t.slice(0, qa)}...`;
}
function Ge(e, t) {
  try {
    return new URL(e, t);
  } catch {
    return null;
  }
}
function Ws(e, t) {
  return String(e.getAttribute(t) || "").toLowerCase().split(/\s+/).filter(Boolean);
}
function cn(e, t) {
  return Array.from(e.querySelectorAll("meta")).filter((n) => (n.getAttribute("name") || n.getAttribute("property") || "").toLowerCase() === t);
}
function ja(e, t) {
  return e === 0 ? "missing" : e < t.min ? `too short, under ${t.min} characters` : e > t.max ? `too long, over ${t.max} characters, so it will be cut` : "";
}
function Sr(e) {
  return e === "" ? "missing" : Cu.test(e) ? /-uk$/i.test(e) ? `"${e}" uses UK, which is not a region code; use GB` : "" : `"${e}" is not a valid language code`;
}
function Ot(e) {
  return `${e.protocol}//${e.host}${e.pathname}${e.search}`;
}
function Ru(e, t) {
  if (Ot(e) === Ot(t)) return "";
  if (e.protocol !== t.protocol)
    return `it uses ${e.protocol.replace(":", "")} and this page uses ${t.protocol.replace(":", "")}`;
  if (e.host !== t.host) return `it points to another host, ${e.host}`;
  const n = e.pathname.replace(/\/$/, "") === t.pathname.replace(/\/$/, "");
  return e.pathname !== t.pathname && n ? "only the trailing slash differs" : e.pathname !== t.pathname ? `it points to ${e.pathname}` : t.search && !e.search ? `this URL has a query string (${t.search}) that the canonical leaves out` : e.search && !t.search ? `it adds a query string (${e.search}) that this URL does not have` : "the query string differs";
}
function Lu(e, t) {
  const n = Array.from(e.querySelectorAll("link[rel]")).filter((l) => Ws(l, "rel").includes("canonical")), s = [];
  if (n.length === 0)
    return { href: "", resolved: "", count: 0, warnings: ["No canonical URL."] };
  n.length > 1 && s.push(`${n.length} canonical links. Search engines ignore all of them when they disagree, and may when they do not.`);
  const a = (n[0].getAttribute("href") || "").trim(), i = Ge(a, t), r = Ge(t, t);
  if (a === "" || !i)
    return s.push("The canonical link has no usable URL."), { href: a, resolved: "", count: n.length, warnings: s };
  /^[a-z][a-z0-9+.-]*:/i.test(a) || s.push("The canonical URL is relative. Use the full URL, with the scheme and host.");
  const o = r ? Ru(i, r) : "";
  return o && s.push(`The canonical URL is not this page: ${o}.`), { href: a, resolved: i.href, count: n.length, warnings: s };
}
function Pu(e, t) {
  const n = Ge(t, t), s = Array.from(e.querySelectorAll("link[hreflang]")).filter((i) => Ws(i, "rel").includes("alternate")).map((i) => {
    const r = (i.getAttribute("hreflang") || "").trim(), o = Ge(i.getAttribute("href") || "", t);
    return {
      lang: r,
      href: o ? o.href : "",
      self: !!(o && n && Ot(o) === Ot(n)),
      problem: r.toLowerCase() === "x-default" ? "" : Sr(r)
    };
  });
  if (s.length === 0) return { items: s, warnings: [] };
  const a = [];
  return s.some((i) => i.self) || a.push("No hreflang link points to this page. Every page in the set has to list itself."), s.some((i) => i.lang.toLowerCase() === "x-default") || a.push("No x-default alternate, so visitors whose language is not listed get no fallback."), s.filter((i) => i.problem).forEach((i) => {
    a.push(`hreflang ${i.problem}.`);
  }), { items: s, warnings: a };
}
function Iu(e) {
  if (!e) return 0;
  let t = 0;
  const n = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG"]), s = (a) => {
    a.childNodes.forEach((i) => {
      i.nodeType === 3 ? t += (i.textContent.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length : i.nodeType === 1 && !n.has(i.nodeName.toUpperCase()) && s(i);
    });
  };
  return s(e), t;
}
function Du(e, t = "") {
  const n = [...cn(e, "robots"), ...cn(e, "googlebot")].map((i) => (i.getAttribute("content") || "").trim()).filter(Boolean).join(", "), s = [], a = `${n}, ${t}`.toLowerCase();
  return /\b(noindex|none)\b/.test(a) && s.push("This page asks not to be indexed."), /\b(nofollow|none)\b/.test(a) && s.push("This page asks search engines not to follow its links."), { meta: n, header: String(t || ""), warnings: s };
}
function qu(e, t, n = "") {
  const s = e.querySelector("head title") || e.querySelector("title"), a = He(s ? s.textContent : ""), i = cn(e, "description")[0], r = He(i ? i.getAttribute("content") : ""), o = (e.documentElement.getAttribute("lang") || "").trim(), l = cn(e, "viewport")[0], c = e.querySelector("meta[charset]") || Array.from(e.querySelectorAll("meta[http-equiv]")).find((p) => /charset=/i.test(p.getAttribute("content") || "")), u = {
    title: { value: a, length: a.length, hint: ja(a.length, ku) },
    description: {
      value: r,
      length: r.length,
      hint: ja(r.length, Su)
    },
    canonical: Lu(e, t),
    robots: Du(e, n),
    hreflang: Pu(e, t),
    lang: { value: o, problem: Sr(o) },
    viewport: l ? (l.getAttribute("content") || "").trim() : "",
    charset: {
      value: String(e.characterSet || e.charset || ""),
      declared: !!c
    },
    words: Iu(e.body),
    warnings: []
  };
  return u.title.hint && u.warnings.push(`Title ${u.title.hint}.`), u.description.hint && u.warnings.push(`Meta description ${u.description.hint}.`), u.lang.problem && u.warnings.push(`<html lang> ${u.lang.problem}.`), u.viewport || u.warnings.push("No viewport meta tag, so phones draw the desktop layout."), u.charset.declared || u.warnings.push("No charset declared in the markup."), u.warnings.push(
    ...u.canonical.warnings,
    ...u.robots.warnings,
    ...u.hreflang.warnings
  ), u;
}
function ju(e, t) {
  const n = Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  let s = 0;
  const a = n.map((o, l) => {
    const c = Number(o.tagName.slice(1)), u = He(o.textContent), p = [];
    return u === "" && p.push("empty"), s > 0 && c > s + 1 && p.push(`skips from h${s} to h${c}`), t.measure(o).visible || p.push("hidden from view"), s = c, { index: l, level: c, text: u, warnings: p };
  }), i = a.filter((o) => o.level === 1).length, r = [];
  return i === 0 && r.push("No H1."), i > 1 && r.push(`${i} H1 headings. One page, one main heading.`), a.forEach((o) => o.warnings.forEach((l) => {
    r.push(`H${o.level} ${o.text ? `"${o.text}"` : `#${o.index + 1}`}: ${l}.`);
  })), { items: a, warnings: r, elements: n };
}
function Uu(e, t) {
  const n = e.trim().toLowerCase();
  if (n === "") return !1;
  if (/\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?)$/.test(n) || /^(img|image|dsc|dscn|photo|pic|screenshot)[-_ ]?\d+$/.test(n)) return !0;
  const a = String(t || "").split(/[?#]/)[0].split("/").pop().toLowerCase().replace(/\.[a-z0-9]+$/, "");
  return a !== "" && n === a;
}
function Bu(e, t) {
  const n = Array.from(e.querySelectorAll("img")), s = n.map((r, o) => {
    const l = r.currentSrc || r.getAttribute("src") || r.getAttribute("data-src") || "", c = r.hasAttribute("alt") ? r.getAttribute("alt") : null, u = t.measure(r), p = [];
    c === null ? p.push("no alt attribute") : c.trim() === "" ? p.push("empty alt, which is right only for a decorative image") : Uu(c, l) && p.push("alt text is a file name"), (!r.hasAttribute("width") || !r.hasAttribute("height")) && p.push("no width and height, so the page shifts when it loads");
    const f = u.width * t.pixelRatio;
    return u.visible && u.width > 0 && u.naturalWidth > f * Tu && u.naturalWidth - f > Mu && p.push(`${u.naturalWidth}px wide but drawn at ${Math.round(u.width)}px`), (r.getAttribute("loading") || "").toLowerCase() === "lazy" && u.visible && u.top < t.viewportHeight && p.push("lazy loaded but visible on the first screen, which delays it"), {
      index: o,
      src: l,
      alt: c === null ? null : He(c),
      size: u.naturalWidth && u.width ? `${Math.round(u.width)} × ${Math.round(u.height)} of ${u.naturalWidth} × ${u.naturalHeight}` : "",
      warnings: p
    };
  }), a = s.filter((r) => r.warnings.length > 0), i = a.length > 0 ? [`${a.length} of ${s.length} images have a problem.`] : [];
  return { items: s, warnings: i, elements: n };
}
function Fu(e) {
  const t = He(e.textContent);
  if (t) return t;
  const n = Array.from(e.querySelectorAll("img[alt]")).map((s) => s.getAttribute("alt")).find(Boolean);
  return He(e.getAttribute("aria-label") || n || e.getAttribute("title") || "");
}
function Hu(e, t) {
  const n = Ge(t, t), s = Array.from(e.querySelectorAll("a[href]")), a = { internal: 0, external: 0, nofollow: 0 }, i = s.map((l, c) => {
    const u = (l.getAttribute("href") || "").trim(), p = Ge(u, t), f = Ws(l, "rel").includes("nofollow"), E = Fu(l), S = [];
    let g = "other";
    return p && /^https?:$/.test(p.protocol) && (g = n && p.host === n.host ? "internal" : "external"), g !== "other" && (a[g] += 1), f && (a.nofollow += 1), E === "" && S.push("no text"), (u === "" || u === "#") && S.push("goes nowhere"), /^javascript:/i.test(u) && S.push("a javascript: link, which is a button pretending"), g === "internal" && f && S.push("internal link marked nofollow"), n && n.protocol === "https:" && p && p.protocol === "http:" && S.push("http: on an https: page"), { index: c, href: u, text: E, kind: g, nofollow: f, warnings: S };
  }), r = i.filter((l) => l.warnings.length > 0), o = r.length > 0 ? [`${r.length} of ${i.length} links have a problem.`] : [];
  return { items: i, counts: a, warnings: o, elements: s };
}
function Gu(e) {
  const t = Array.from(e.querySelectorAll("meta")).map((o) => ({
    name: (o.getAttribute("property") || o.getAttribute("name") || "").trim().toLowerCase(),
    value: He(o.getAttribute("content"))
  })), n = t.filter((o) => o.name.startsWith("og:")), s = t.filter((o) => o.name.startsWith("twitter:")), a = (o) => t.some((l) => l.name === o && l.value !== ""), i = [];
  Au.filter((o) => !a(o)).forEach((o) => {
    i.push(`Missing ${o}.`);
  }), Ou.filter((o) => !a(o)).forEach((o) => {
    i.push(`Missing ${o}, so X shows a bare link.`);
  });
  const r = n.find((o) => o.name === "og:image");
  return r && r.value && !/^https?:\/\//i.test(r.value) && i.push("og:image is not a full URL, and link previews will not fetch it."), { openGraph: n, x: s, warnings: i };
}
function Wu(e) {
  const t = Ge(e, e);
  return t ? [
    { label: "robots.txt", href: `${t.origin}/robots.txt` },
    { label: "sitemap.xml", href: `${t.origin}/sitemap.xml` },
    {
      label: "PageSpeed Insights",
      href: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(Ot(t))}`
    }
  ] : [];
}
function zu(e, { url: t, robotsHeader: n = "", env: s }) {
  const { elements: a, ...i } = ju(e, s), { elements: r, ...o } = Bu(e, s), { elements: l, ...c } = Hu(e, t), { elements: u, model: p } = xu(e, t), f = (g) => g.items.filter((m) => m.warnings.length > 0).length, E = {
    overview: 0,
    headings: i.warnings.length,
    images: f(o),
    links: f(c),
    schema: p.warnings.length,
    social: 0
  }, S = {
    overview: qu(e, t, n),
    headings: i,
    images: o,
    links: c,
    schema: p,
    social: Gu(e),
    quickLinks: Wu(t),
    counts: E
  };
  return E.overview = S.overview.warnings.length, E.social = S.social.warnings.length, S.warningCount = Object.values(E).reduce((g, m) => g + m, 0), {
    model: S,
    elements: {
      headings: a,
      images: r,
      links: l,
      schema: u
    }
  };
}
function Ua() {
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
    schema: Eu(),
    social: { openGraph: [], x: [], warnings: [] },
    quickLinks: [],
    counts: { overview: 0, headings: 0, images: 0, links: 0, schema: 0, social: 0 },
    warningCount: 0
  };
}
let zs = { headings: [], images: [], links: [], schema: [] };
const Tt = /* @__PURE__ */ new Map();
function Vu(e = "") {
  Array.from(Tt.keys()).forEach((s) => Ar(s));
  const { model: t, elements: n } = zu(document, {
    url: window.location.href,
    robotsHeader: e,
    env: $u()
  });
  return zs = n, t;
}
function Ar(e) {
  const t = Tt.get(e);
  t && (e.style.outline = t.outline, e.style.outlineOffset = t.offset, Tt.delete(e));
}
function Ku() {
  return _u(document);
}
function us(e, t, n) {
  const s = (zs[e] || [])[t];
  if (!(!s || !s.style)) {
    if (!n) {
      Ar(s);
      return;
    }
    Tt.has(s) || Tt.set(s, {
      outline: s.style.outline || "",
      offset: s.style.outlineOffset || ""
    }), s.style.outline = "2px solid #7f9cf5", s.style.outlineOffset = "2px";
  }
}
function Ju(e, t) {
  const n = (zs[e] || [])[t];
  n && (n.scrollIntoView({ block: "center", behavior: "smooth" }), us(e, t, !0));
}
const Or = [
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
], Xu = Or.filter((e) => !["refund"].includes(e)), Vs = ["ad_storage", "analytics_storage", "ad_user_data", "ad_personalization"], Zu = 2e3, ps = "siteation.debugbar.datalayer.v1", Yu = 500, Qu = 4e5;
function ep(e) {
  const t = e.value;
  if (e.gtag && Array.isArray(t)) {
    const n = String(t[0] ?? ""), s = typeof t[1] == "string" ? t[1] : "";
    return { kind: "gtag", name: s ? `${n} ${s}` : n, args: t };
  }
  return t && typeof t == "object" && !Array.isArray(t) ? typeof t.event == "string" ? { kind: "event", name: t.event, args: [] } : { kind: "object", name: Object.keys(t).slice(0, 3).join(", ") || "empty object", args: [] } : { kind: "other", name: typeof t, args: [] };
}
function tp(e) {
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
function np(e) {
  const t = e && e.value;
  return !!(t && typeof t == "object" && !Array.isArray(t) && "ecommerce" in t && t.ecommerce === null);
}
function sp(e, t) {
  const { event: n, data: s, viaGtag: a } = tp(e[t]);
  if (!Or.includes(n)) return [];
  const i = [];
  if (!s)
    return i.push(a ? "no parameters" : "no ecommerce object"), i;
  if (Xu.includes(n)) {
    const r = s.items;
    !Array.isArray(r) || r.length === 0 ? i.push("no items[]") : r.forEach((o, l) => {
      o && typeof o == "object" && (o.item_id !== void 0 && o.item_id !== "" || o.item_name !== void 0 && o.item_name !== "") || i.push(`items[${l}] has neither item_id nor item_name`);
    });
  }
  return s.value !== void 0 && s.value !== null && !s.currency && i.push("value without currency"), n === "purchase" && !s.transaction_id && i.push("purchase without transaction_id"), !a && !np(e[t - 1]) && i.push("no {ecommerce: null} pushed right before it"), i;
}
function Tr(e, t = "", n = []) {
  if (n.length >= 500) return n;
  if (e !== null && typeof e == "object") {
    const s = Array.isArray(e) ? e.map((a, i) => [`${t}[${i}]`, a]) : Object.keys(e).map((a) => [
      /^[A-Za-z_$][\w$]*$/.test(a) ? t ? `${t}.${a}` : a : `${t}[${JSON.stringify(a)}]`,
      e[a]
    ]);
    return s.length === 0 && n.push({ path: t, value: Array.isArray(e) ? "[]" : "{}" }), s.forEach(([a, i]) => Tr(i, a, n)), n;
  }
  return n.push({ path: t, value: e === void 0 ? "undefined" : JSON.stringify(e) }), n;
}
function ap(e, t) {
  const n = t.filter((a) => typeof a.at == "number" && a.at <= e && e - a.at <= Zu).sort((a, i) => i.at - a.at);
  if (n.length === 0) return null;
  const s = n[0];
  return { id: s.id, label: `${s.method} ${s.url}`, gap: Math.round(e - s.at) };
}
const ip = [
  { vendor: "Google Tag Manager", host: /googletagmanager\.com\/gtm\.js/, id: /[?&]id=(GTM-[A-Z0-9]+)/i },
  { vendor: "Google tag", host: /googletagmanager\.com\/gtag\/js/, id: /[?&]id=((?:G|AW|DC|GT)-[A-Z0-9]+)/i },
  { vendor: "Meta pixel", host: /connect\.facebook\.net\/.*\/fbevents\.js/, id: null },
  { vendor: "TikTok pixel", host: /analytics\.tiktok\.com/, id: /[?&]sdkid=([A-Z0-9]+)/i },
  { vendor: "Microsoft Clarity", host: /clarity\.ms\/tag\/([a-z0-9]+)/i, id: /clarity\.ms\/tag\/([a-z0-9]+)/i },
  { vendor: "Microsoft Ads (UET)", host: /bat\.bing\.com\/bat\.js/, id: null },
  { vendor: "Hotjar", host: /static\.hotjar\.com\/c\/hotjar-(\d+)/, id: /hotjar-(\d+)/ },
  { vendor: "LinkedIn Insight", host: /snap\.licdn\.com/, id: null },
  { vendor: "Pinterest tag", host: /s\.pinimg\.com\/ct\/core\.js/, id: null }
], rp = [
  { vendor: "Meta pixel", pattern: /fbq\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/g },
  { vendor: "Pinterest tag", pattern: /pintrk\(\s*['"]load['"]\s*,\s*['"](\d+)['"]/g },
  { vendor: "TikTok pixel", pattern: /ttq\.load\(\s*['"]([A-Z0-9]+)['"]/gi },
  { vendor: "LinkedIn Insight", pattern: /_linkedin_partner_id\s*=\s*['"]?(\d+)/g }
];
function Bn(e) {
  return /^GTM-/i.test(e) ? "Google Tag Manager" : /^G-/i.test(e) ? "Google Analytics 4" : /^AW-/i.test(e) ? "Google Ads" : /^DC-/i.test(e) ? "Campaign Manager" : "Google tag";
}
function op(e, t, n = []) {
  const s = /* @__PURE__ */ new Map(), a = (u, p, f, E = !1) => {
    const S = `${u}|${p}`, g = s.get(S) || { id: p, vendor: u, via: [], loads: 0 };
    g.via.includes(f) || g.via.push(f), E && (g.loads += 1), s.set(S, g);
  };
  Array.from(e.querySelectorAll("script[src]")).forEach((u) => {
    const p = u.getAttribute("src") || "";
    ip.forEach((f) => {
      if (!f.host.test(p)) return;
      const E = f.id ? f.id.exec(p) : null, S = E ? f.vendor.startsWith("Google") ? E[1].toUpperCase() : E[1] : "";
      a(f.vendor === "Google tag" && S ? Bn(S) : f.vendor, S, "script", !0);
    });
  }), Array.from(e.querySelectorAll("script:not([src])")).forEach((u) => {
    const p = u.textContent || "";
    rp.forEach((f) => {
      for (const E of p.matchAll(f.pattern)) a(f.vendor, E[1], "inline script");
    });
  });
  const i = /* @__PURE__ */ new Map();
  t.forEach((u) => {
    if (!u.gtag || !Array.isArray(u.value) || u.value[0] !== "config") return;
    const p = String(u.value[1] || "").toUpperCase();
    p && (i.set(p, (i.get(p) || 0) + 1), a(Bn(p), p, "gtag('config')"));
  }), n.filter((u) => /^(GTM|G|AW|DC|GT)-[A-Z0-9]+$/i.test(u)).forEach((u) => a(Bn(u.toUpperCase()), u.toUpperCase(), "loaded by Google"));
  const r = Array.from(s.values()), o = [];
  r.filter((u) => u.loads > 1).forEach((u) => {
    o.push(`${[u.vendor, u.id].filter(Boolean).join(" ")} is loaded ${u.loads} times.`);
  }), i.forEach((u, p) => {
    u > 1 && o.push(`${p} is configured ${u} times, so its page view can be sent more than once.`);
  });
  const l = r.filter((u) => u.vendor === "Google Tag Manager" && u.id);
  l.length > 1 && o.push(`${l.length} GTM containers (${l.map((u) => u.id).join(", ")}). Check that they do not both send to the same GA4 property; the page cannot tell which property a container sends to.`);
  const c = r.filter((u) => u.vendor === "Google Analytics 4");
  return c.length > 0 && l.length > 0 && c.some((u) => u.via.includes("gtag('config')")) && o.push("GA4 is configured with gtag() on a page that also loads GTM. If the container has a GA4 tag for the same property, every hit is sent twice."), { items: r, warnings: o };
}
function lp(e) {
  const t = {}, n = {}, s = [];
  e.forEach((o, l) => {
    const c = o.value;
    if (!o.gtag || !Array.isArray(c) || c[0] !== "consent") return;
    const u = String(c[1] || ""), p = c[2] && typeof c[2] == "object" ? c[2] : {};
    s.push({ kind: u, index: l, values: p }), Object.keys(p).forEach((f) => {
      const E = String(p[f]);
      u === "default" && !(f in t) && (t[f] = E), n[f] = E;
    });
  });
  const a = [], i = s.find((o) => o.kind === "default"), r = e.findIndex((o) => cp(o));
  return i ? (r !== -1 && r < i.index && a.push("A tag fires before the consent default is set, so it runs with no consent state."), Vs.filter((o) => !(o in t)).forEach((o) => {
    a.push(`The consent default does not set ${o}${o.startsWith("ad_user") || o.startsWith("ad_pers") ? ", which Consent Mode v2 requires" : ""}.`);
  })) : r !== -1 && a.push("No consent default is set. Google's tags run without Consent Mode."), { defaults: t, current: n, calls: s, warnings: a };
}
function cp(e) {
  const t = e.value;
  return e.gtag && Array.isArray(t) ? t[0] === "config" || t[0] === "event" : !!(t && typeof t == "object" && t.event === "gtm.js");
}
function dp(e, t, { policy: n, page: s, requests: a }) {
  const i = e[t], { kind: r, name: o } = ep(i), l = gn(i.value, n);
  return {
    index: t,
    page: s,
    current: !0,
    kind: r,
    name: o,
    before: !!i.before,
    at: Math.round(i.at || 0),
    request: i.before ? null : ap(i.at, a),
    problems: sp(e, t),
    json: n === te ? "" : JSON.stringify(l, null, 2),
    flat: n === te ? [] : Tr(l)
  };
}
function up({ pushes: e, requests: t, doc: n, loaded: s = [], policy: a, page: i, present: r }) {
  const o = e.map((f, E) => dp(e, E, { policy: a, page: i, requests: t })), l = op(n, e, s), c = lp(e), p = {
    pushes: o.filter((f) => f.problems.length > 0).length,
    tags: l.warnings.length,
    consent: c.warnings.length
  };
  return {
    present: r,
    pushes: o,
    tags: { items: l.items.map((f) => ({ ...f, where: f.via.join(", ") })), warnings: l.warnings },
    consent: {
      keys: Vs.map((f) => ({
        key: f,
        default: c.defaults[f] || "",
        current: c.current[f] || ""
      })),
      calls: c.calls.map((f) => ({ kind: f.kind, index: f.index })),
      updates: c.calls.filter((f) => f.kind === "update").length,
      warnings: c.warnings
    },
    counts: p,
    warningCount: p.pushes + p.tags + p.consent
  };
}
function Ba() {
  return {
    present: !1,
    pushes: [],
    tags: { items: [], warnings: [] },
    consent: { keys: Vs.map((e) => ({ key: e, default: "", current: "" })), calls: [], updates: 0, warnings: [] },
    counts: { pushes: 0, tags: 0, consent: 0 },
    warningCount: 0
  };
}
function pp(e) {
  try {
    const t = JSON.parse(e && e.getItem(ps) || "[]");
    return Array.isArray(t) ? t.map((n) => ({ ...n, current: !1 })) : [];
  } catch {
    return [];
  }
}
function hp(e, t, n, s) {
  if (e)
    try {
      if (s === te) {
        e.removeItem(ps);
        return;
      }
      let a = [...t, ...n].slice(-Yu).map((r) => ({ ...r, current: !1 })), i = JSON.stringify(a);
      for (; i.length > Qu && a.length > 0; )
        a = a.slice(Math.ceil(a.length / 4)), i = JSON.stringify(a);
      e.setItem(ps, i);
    } catch {
    }
}
let Vt = null;
function Fa() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
function fp() {
  const e = window.__siteationDebugBar;
  return e && Array.isArray(e.pushes) ? e : { pushes: [], requests: [] };
}
function bp(e) {
  const t = window.__siteationDebugBar;
  t && (t.onPush = e);
}
function gp(e) {
  const t = fp();
  Vt === null && (Vt = pp(Fa()));
  let n = [];
  try {
    n = window.google_tag_manager ? Object.keys(window.google_tag_manager) : [];
  } catch {
    n = [];
  }
  const s = up({
    pushes: t.pushes,
    requests: t.requests || [],
    doc: document,
    loaded: n,
    policy: e,
    page: window.location.pathname,
    present: Array.isArray(window.dataLayer)
  });
  return hp(Fa(), Vt, s.pushes, e), { model: s, earlier: Vt };
}
const mp = {
  lcp: [2500, 4e3],
  cls: [0.1, 0.25],
  inp: [200, 500],
  fcp: [1800, 3e3],
  ttfb: [800, 1800]
}, Mr = {
  lcp: "largest-contentful-paint",
  cls: "layout-shift",
  inp: "event",
  fcp: "paint",
  ttfb: "navigation"
}, yp = 104, Cr = {
  lcp: "Largest Contentful Paint",
  cls: "Cumulative Layout Shift",
  inp: "Interaction to Next Paint",
  fcp: "First Contentful Paint",
  ttfb: "Time to First Byte"
}, Nr = ["lcp", "cls", "inp", "fcp", "ttfb"], vp = 1e3, wp = 5e3;
function _p(e, t) {
  const n = mp[e];
  return !n || t === null || t === void 0 || Number.isNaN(t) ? "" : t > n[1] ? "poor" : t > n[0] ? "needs-improvement" : "good";
}
function $r(e, t) {
  return t == null ? "" : e === "cls" ? t.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") || "0" : t >= 1e3 ? `${(t / 1e3).toFixed(2)} s` : `${Math.round(t)} ms`;
}
function Ks(e) {
  if (!e || !e.tagName) return "";
  const t = e.tagName.toLowerCase();
  if (e.id) return `${t}#${e.id}`;
  const n = typeof e.className == "string" ? e.className.trim().split(/\s+/)[0] : "";
  return n ? `${t}.${n}` : t;
}
function xp(e = []) {
  const t = [...e];
  return {
    elements: t,
    /**
     * @param {Element|null|undefined} element
     * @returns {number} -1 when there is no element to point at
     */
    add(n) {
      if (!n || !n.tagName) return -1;
      const s = t.indexOf(n);
      return s !== -1 ? s : (t.push(n), t.length - 1);
    }
  };
}
function Ep(e, t, n) {
  const s = e[e.length - 1];
  return s ? {
    value: Math.max(0, s.startTime - t),
    element: {
      label: Ks(s.element) || (s.url ? "an image no longer on the page" : "an element no longer on the page"),
      index: n.add(s.element),
      url: s.url || "",
      size: s.size || 0
    }
  } : { value: null, element: null };
}
function hs(e, t) {
  return !!(e && t(e));
}
function kp(e, t, n) {
  const s = e.filter((l) => !l.hadRecentInput && !((l.sources || []).length > 0 && l.sources.every((c) => hs(c.node, t)))), a = [];
  s.forEach((l) => {
    const c = a[a.length - 1], u = c && c[0], p = c && c[c.length - 1];
    c && l.startTime - p.startTime < vp && l.startTime - u.startTime < wp ? c.push(l) : a.push([l]);
  });
  const i = a.map((l) => l.reduce((c, u) => c + u.value, 0)), r = i.length ? i.indexOf(Math.max(...i)) : -1, o = [];
  return a.forEach((l, c) => {
    l.forEach((u) => {
      o.push({
        at: Math.round(u.startTime),
        value: u.value,
        display: $r("cls", u.value),
        window: c + 1,
        worst: c === r,
        sources: (u.sources || []).filter((p) => !hs(p.node, t)).map((p) => ({
          label: Ks(p.node) || "an element no longer on the page",
          index: n.add(p.node)
        }))
      });
    });
  }), {
    // No shifts at all is a measured zero, as long as the browser can measure shifts.
    value: r === -1 ? 0 : i[r],
    shifts: o
  };
}
function Sp(e, t, n, s) {
  const a = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Set();
  e.forEach((u) => {
    if (!u.interactionId || (i.add(u.interactionId), hs(u.target, n))) return;
    const p = a.get(u.interactionId);
    (!p || u.duration > p.duration) && a.set(u.interactionId, u);
  });
  const r = Math.max(0, (t || 0) - i.size), o = Array.from(a.values()).sort((u, p) => p.duration - u.duration);
  if (o.length === 0) return { value: null, interaction: null, count: 0, unseen: r };
  const l = Math.max(t || 0, o.length), c = o[Math.min(o.length - 1, Math.floor(l / 50))];
  return {
    value: c.duration,
    interaction: {
      name: c.name,
      at: Math.round(c.startTime),
      label: Ks(c.target) || "an element no longer on the page",
      index: s.add(c.target)
    },
    count: o.length,
    unseen: r
  };
}
function Ap(e, t) {
  const n = e.find((s) => s.name === "first-contentful-paint");
  return n ? Math.max(0, n.startTime - t) : null;
}
function Op(e) {
  return !e || !(e.responseStart > 0) ? null : Math.max(0, e.responseStart - (e.activationStart || 0));
}
function Ha() {
  return {
    metrics: Nr.map((e) => ({
      id: e,
      label: e.toUpperCase(),
      name: Cr[e],
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
function Tp({ entries: e, supported: t, interactionCount: n = 0, own: s = () => !1, known: a = [] }) {
  const i = xp(a), r = (S) => e[S] || [], o = r("navigation")[0], l = o && o.activationStart || 0, c = Ep(r("largest-contentful-paint"), l, i), u = kp(r("layout-shift"), s, i), p = Sp(r("event"), n, s, i), f = {
    lcp: c.value,
    cls: u.value,
    inp: p.value,
    fcp: Ap(r("paint"), l),
    ttfb: Op(o)
  }, E = Nr.map((S) => {
    const g = t.includes(Mr[S]);
    let m = g ? f[S] : null, A = $r(S, m), $ = _p(S, m);
    return S === "inp" && g && m === null && p.unseen > 0 && (m = null, A = `under ${yp} ms`, $ = "good"), { id: S, label: S.toUpperCase(), name: Cr[S], value: m, display: A, rating: $, supported: g };
  });
  return {
    model: {
      metrics: E,
      lcp: c.element,
      shifts: u.shifts,
      inp: { interaction: p.interaction, count: p.count, unseen: p.unseen },
      poorCount: E.filter((S) => S.rating === "poor").length
    },
    elements: i.elements
  };
}
const Xt = {};
let dn = [];
const un = /* @__PURE__ */ new Map();
let Ga = !1;
function Rr() {
  try {
    return Array.from(PerformanceObserver.supportedEntryTypes || []);
  } catch {
    return [];
  }
}
function Mp(e) {
  if (Ga || typeof PerformanceObserver > "u") return;
  Ga = !0;
  const t = Rr();
  new Set(Object.values(Mr)).forEach((n) => {
    if (t.includes(n)) {
      Xt[n] = [];
      try {
        new PerformanceObserver((s) => {
          const a = s.getEntries().filter((i) => n !== "event" || i.interactionId > 0);
          a.length !== 0 && (Xt[n].push(...a), e());
        }).observe({ type: n, buffered: !0, ...n === "event" ? { durationThreshold: 16 } : {} });
      } catch {
        delete Xt[n];
      }
    }
  });
}
function Cp(e) {
  let t = 0;
  try {
    t = Number(performance.interactionCount) || 0;
  } catch {
    t = 0;
  }
  const { model: n, elements: s } = Tp({
    entries: Xt,
    supported: Rr(),
    interactionCount: t,
    // Seeded with the last read's elements, so a row being hovered while an entry arrives
    // still outlines, and later un-outlines, the element it did before.
    known: dn,
    // The bar lives in a shadow root, so its nodes reach the page's entries as its host.
    own: (a) => !!e && (a === e || typeof e.contains == "function" && e.contains(a))
  });
  return dn = s, n;
}
function Np(e) {
  const t = un.get(e);
  t && (e.style.outline = t.outline, e.style.outlineOffset = t.offset, un.delete(e));
}
function Lr(e, t) {
  const n = dn[e];
  if (!(!n || !n.style)) {
    if (!t) {
      Np(n);
      return;
    }
    un.has(n) || un.set(n, {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "2px";
  }
}
function $p(e) {
  const t = dn[e];
  !t || !t.isConnected || (t.scrollIntoView({ block: "center", behavior: "smooth" }), Lr(e, !0));
}
const Rp = 1e3, Pr = "siteation.debugbar.v1", Lp = "__PROFILE_ID__";
function Pp() {
  const e = document.getElementById("siteation-debugbar-profile");
  if (!e) return {};
  try {
    return JSON.parse(e.textContent || "{}");
  } catch {
    return {};
  }
}
function Ip() {
  const e = { open: !1, section: "overview" };
  try {
    return { ...e, ...JSON.parse(localStorage.getItem(Pr) || "{}") };
  } catch {
    return e;
  }
}
function pe(e, t, n) {
  const s = t.trim().toLowerCase();
  return s ? e.filter((a) => n.some(
    (i) => String(a[i] ?? "").toLowerCase().includes(s)
  )) : e;
}
function Dp() {
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
    seo: Ua(),
    seoError: "",
    /** @type {Array<number>} */
    schemaExpanded: [],
    schemaCopyState: "",
    schemaFallback: "",
    dataLayerTab: "pushes",
    dataLayer: Ba(),
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
    vitals: Ha(),
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
      this.profile = Pp(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const e = Ip();
      this.collapsed = !!e.collapsed, this.open = e.open && !this.collapsed, this.section = e.section, this.placement = e.placement === "top" ? "top" : "bottom", this.dockPosition = ed(e.dockPosition) ? e.dockPosition : null, this.maximised = !!e.maximised, this.theme = ["system", "light", "dark"].includes(e.theme) ? e.theme : "system", this.favourites = Array.isArray(e.favourites) ? e.favourites.filter((t) => rn.some((n) => n.id === t)) : [], this.watchColorScheme(), this.valuePolicy = vd(this.rootElement()?.dataset.valuePolicy), this.editorTemplate = this.rootElement()?.dataset.editor || "", this.editorRoot = this.rootElement()?.dataset.editorRoot || "", this.refreshAlpine(), this.refreshMagewire(), this.listenToMagewire(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.$watch("paletteSearch", () => {
        this.paletteIndex = 0;
      }), this.$watch("section", (t) => {
        t === "history" && this.loadHistory(), t === "seo" && this.refreshSeo(), t === "datalayer" && this.refreshDataLayer(), t === "vitals" && this.refreshVitals();
      }), this.scheduleSeo(), this.collects("datalayer") && (this.refreshDataLayer(), bp(() => {
        this.dataLayerTimer || (this.dataLayerTimer = setTimeout(() => {
          this.dataLayerTimer = null, this.refreshDataLayer();
        }, 50));
      })), this.collects("vitals") && Mp(() => {
        this.vitalsTimer || (this.vitalsTimer = setTimeout(() => {
          this.vitalsTimer = null, this.refreshVitals();
        }, 50));
      }), this.open && this.section === "history" && this.loadHistory(), this.$watch("activeId", () => {
        this.comparison = null, this.baselineId = "";
      }), document.addEventListener("keydown", (t) => this.paletteShortcut(t)), this.open && this.$nextTick(() => this.lock()), this.requests = Zc((t) => {
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
      return t ? t.replace(Lp, encodeURIComponent(e)) : null;
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
          const { profile: n, payloads: s } = await Ma(t);
          this.profile = n, this.payloads = s, this.activeId = e;
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
          const n = await ls(t);
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
      const e = this.history.filter((s) => s.profile_id !== this.activeId), t = this.request.path;
      return (e.find((s) => s.path === t) || e[0])?.profile_id || "";
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
        this.comparison = await ls(n);
      } catch (s) {
        this.comparison = null, this.compareError = String(s.message || s);
      } finally {
        this.comparing = !1;
      }
    },
    /**
     * @param {object} metric
     * @returns {string} the change, signed, in the metric's own unit
     */
    deltaLabel(e) {
      return Hd(e);
    },
    /**
     * @param {object} metric
     * @param {'baseline'|'subject'} side which profile's value the cell shows
     * @returns {string}
     */
    metricValue(e, t) {
      return Gd(e, t);
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
      return Ud(e);
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
      return Fd(e);
    },
    /**
     * @param {string} url
     * @returns {string}
     */
    shortUrl(e) {
      return Bd(e, window.location.origin);
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
          this.payloads = (await Ma(e)).payloads;
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
      return pe(e, this.querySearch, ["sql"]);
    },
    /** @returns {number} how many statements ran a shape that ran more than once */
    get repeatedCount() {
      return this.itemsOf("queries").filter((e) => Number(e.repeat_count || 1) > 1).length;
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const e = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((t) => t.observer_count === 0) : this.itemsOf("events");
      return pe(e, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return pe(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      return pe(this.itemsOf("blocks"), this.blockSearch, ["name", "template", "class"]);
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
      return pe(e, this.timelineSearch, ["label", "section"]);
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
      return pe(e, this.alpineSearch, ["name", "expression", "path"]);
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
      return od(this);
    },
    /** @returns {Array<object>} */
    get visibleCommands() {
      return ud(this.commands, this.paletteSearch);
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
      return ad(this.rootElement()?.dataset.sections).map((e) => ({ ...e, count: dr(e.id, this) }));
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
        const s = [...this.favourites];
        s.splice(n, 0, s.splice(t, 1)[0]), this.favourites = s, this.persist();
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
      const n = e.clientX - t.pointerX, s = e.clientY - t.pointerY;
      !t.moved && !sd(n, s) || (t.moved = !0, this.draggingDock = !0, this.dockPosition = qn(
        { left: t.left + n, top: t.top + s },
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
      const s = n.getBoundingClientRect();
      this.dockPosition = qn(
        { left: s.left + t[0], top: s.top + t[1] },
        s,
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
      const n = this.dockPosition, s = this.placement;
      this.dockPosition = qn(
        this.dockPosition,
        t,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), (n.left !== this.dockPosition.left || n.top !== this.dockPosition.top || s !== this.placement) && this.persist();
    },
    /** Keep the edge-bound inspector and bubble near the freely positioned dock. */
    updatePlacementFromDock() {
      const e = this.$refs.dock;
      !this.dockPosition || !e || (this.placement = td(
        this.dockPosition,
        e.getBoundingClientRect(),
        window.innerHeight
      ));
    },
    openInspector() {
      this.open || (this.collapsed = !1, this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), Qc(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus(), this.scheduleDockConstraint());
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
      Yc(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(e) {
      if (e.key === "Escape") {
        this.closeInspector();
        return;
      }
      ka(e, this.$refs.sheet);
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
      this.magewireHealth = Xd(), this.magewireComponents = Kd(this.valuePolicy), this.magewireExpanded.forEach((e) => {
        this.magewireStates[e] = Ca(e, this.valuePolicy);
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
      Na(e) || document.addEventListener("magewire:load", () => {
        Na(e), this.refreshMagewire();
      }, { once: !0, passive: !0 });
    },
    /** @param {string} id */
    toggleMagewireComponent(e) {
      if (this.magewireExpanded.includes(e)) {
        this.magewireExpanded = this.magewireExpanded.filter((t) => t !== e), delete this.magewireStates[e];
        return;
      }
      this.magewireExpanded = [...this.magewireExpanded, e], this.magewireStates[e] = Ca(e, this.valuePolicy);
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
      Zd(e, t);
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
        this.seo = Vu(e), this.seoError = "";
      } catch (t) {
        this.seo = Ua(), this.seoError = String(t && t.message || t);
      }
    },
    /**
     * @param {string} view
     * @param {number} index
     * @param {boolean} on
     */
    highlightSeo(e, t, n) {
      us(e, t, n);
    },
    /**
     * @param {string} view
     * @param {number} index
     */
    revealSeo(e, t) {
      Ju(e, t);
    },
    /**
     * @param {number} index
     * @returns {boolean}
     */
    isSchemaExpanded(e) {
      return this.schemaExpanded.includes(e);
    },
    /**
     * @param {object} entity
     * @returns {number}
     */
    schemaRequired(e) {
      return (e.findings || []).filter((t) => t.level === "required").length;
    },
    /** @param {number} index */
    toggleSchemaEntity(e) {
      this.schemaExpanded = this.isSchemaExpanded(e) ? this.schemaExpanded.filter((t) => t !== e) : [...this.schemaExpanded, e];
    },
    /**
     * A microdata entity is an element on the page, so its row can point at it. A JSON-LD
     * one is a script, which has nothing to point at.
     *
     * @param {object} entity
     * @param {boolean} on
     */
    highlightSchema(e, t) {
      e.source === "microdata" && us("schema", e.block, t);
    },
    /**
     * The validators cannot fetch a dev shop, so what they need goes on the clipboard to be
     * pasted into their code mode instead.
     *
     * @returns {Promise<void>}
     */
    async copySchemaMarkup() {
      const e = Ku();
      this.schemaFallback = "";
      try {
        await navigator.clipboard.writeText(e), this.schemaCopyState = "done", setTimeout(() => {
          this.schemaCopyState = "";
        }, 2500);
      } catch {
        this.schemaCopyState = "", this.schemaFallback = e;
      }
    },
    refreshDataLayer() {
      if (this.collects("datalayer"))
        try {
          const { model: e, earlier: t } = gp(this.valuePolicy);
          e.pushes.forEach((n) => {
            n.key = `c${n.index}`;
          }), this.dataLayer = e, this.dataLayerEarlier = t.map((n, s) => ({ ...n, key: `e${s}` })), this.dataLayerError = "";
        } catch (e) {
          this.dataLayer = Ba(), this.dataLayerError = String(e && e.message || e);
        }
    },
    /**
     * Earlier pages first, then this one, newest last: the order they were pushed in.
     *
     * @returns {Array<object>}
     */
    get visibleDataLayerPushes() {
      const e = this.dataLayerThisPage ? this.dataLayer.pushes : [...this.dataLayerEarlier, ...this.dataLayer.pushes];
      return pe(e, this.dataLayerSearch, ["name", "page", "json"]);
    },
    /**
     * @param {string} key
     * @returns {boolean}
     */
    isDataLayerExpanded(e) {
      return this.dataLayerExpanded.includes(e);
    },
    /** @param {string} key */
    toggleDataLayerPush(e) {
      this.dataLayerExpanded = this.isDataLayerExpanded(e) ? this.dataLayerExpanded.filter((t) => t !== e) : [...this.dataLayerExpanded, e];
    },
    /**
     * Whether a push starts a new page in the list, so the page it was pushed on is shown
     * once above its pushes rather than on every row.
     *
     * @param {object} push
     * @param {number} position in visibleDataLayerPushes
     * @returns {boolean}
     */
    startsDataLayerPage(e, t) {
      const n = this.visibleDataLayerPushes[t - 1];
      return !n || n.page !== e.page || n.current !== e.current;
    },
    /**
     * The path of a value, as a GTM data layer variable wants it.
     *
     * @param {string} path
     * @returns {Promise<void>}
     */
    async copyDataLayerPath(e) {
      try {
        await navigator.clipboard.writeText(e), this.dataLayerCopied = e, setTimeout(() => {
          this.dataLayerCopied === e && (this.dataLayerCopied = "");
        }, 2e3);
      } catch {
        this.dataLayerCopied = "";
      }
    },
    refreshVitals() {
      if (this.collects("vitals"))
        try {
          this.vitals = Cp(this.rootElement()), this.vitalsError = "";
        } catch (e) {
          this.vitals = Ha(), this.vitalsError = String(e && e.message || e);
        }
    },
    /**
     * @param {number} index
     * @param {boolean} on
     */
    highlightVital(e, t) {
      Lr(e, t);
    },
    /** @param {number} index */
    revealVital(e) {
      $p(e);
    },
    /**
     * @param {string} rating good, needs-improvement or poor
     * @returns {string}
     */
    vitalTone(e) {
      return { good: "is-ok", "needs-improvement": "is-warn", poor: "is-bad" }[e] || "";
    },
    /** @returns {string} the admin redirect for what this page shows, '' when it is not known */
    get adminEditUrl() {
      return this.rootElement()?.dataset.adminEdit || "";
    },
    /** @returns {Array<object>} */
    get visibleSeoImages() {
      const e = this.seo.images?.items || [], t = this.seoProblemsOnly ? e.filter((n) => n.warnings.length > 0) : e;
      return pe(t, this.seoSearch, ["src", "alt"]);
    },
    /** @returns {Array<object>} */
    get visibleSeoLinks() {
      const e = this.seo.links?.items || [], t = this.seoProblemsOnly ? e.filter((n) => n.warnings.length > 0) : e;
      return pe(t, this.seoSearch, ["href", "text"]);
    },
    /**
     * @param {string|null} alt
     * @returns {string}
     */
    altLabel(e) {
      return e === null ? "no alt" : e === "" ? 'alt=""' : e;
    },
    refreshAlpine() {
      this.alpineHealth = ru(), this.alpineComponents = su(this.valuePolicy), this.alpineStores = au(this.valuePolicy), this.alpineErrors = iu(this.valuePolicy), this.alpineExpanded.forEach((e) => {
        this.alpineStates[e] = Pa(e, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, Rp);
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
      this.alpineExpanded = [...this.alpineExpanded, e], this.alpineStates[e] = Pa(e, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(e, t) {
      ou(e, t);
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
      ka(e, this.$refs.palette);
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
        localStorage.setItem(Pr, JSON.stringify({
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
      return js(e, t);
    },
    /**
     * @param {object} plugin
     * @returns {string}
     */
    methodList(e) {
      return Wd(e);
    },
    /**
     * @param {unknown} code
     * @param {string} language
     * @returns {string} HTML for x-html, escaped by the highlighter
     */
    highlight(e, t) {
      return qd(e, t);
    },
    /**
     * @param {string} file
     * @param {number} line
     * @returns {string}
     */
    editorUrl(e, t) {
      return gr(this.editorTemplate, this.editorRoot, e, t);
    },
    /**
     * @param {string} location
     * @returns {string}
     */
    locationUrl(e) {
      return zd(this.editorTemplate, this.editorRoot, e);
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
      return jd(e, t, n);
    },
    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(e) {
      return Us(e);
    }
  };
}
function Ce(e) {
  return `<dl class="ndb-facts">${e.map((n) => {
    const s = ["ndb-fact-value", n.mono ? "ndb-mono" : ""].filter(Boolean).join(" "), a = n.tone ? ` data-ndb-bind:class="'is-' + (${n.tone})"` : "", i = n.raw ? `<dd class="${s}"${a}>${n.value}</dd>` : `<dd class="${s}"${a} data-ndb-text="${n.value}"></dd>`, r = n.when ? ` data-ndb-if="${n.when}"` : "", o = `
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
function Wa({ sheet: e }) {
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

    <div class="ndb-stat is-secondary">
      ${q("chip", "is-accent")}
      <span>
        <span class="ndb-stat-key">Peak</span>
        <span class="ndb-stat-value" data-ndb-text="number(metrics.memory_peak_mb, 1) + ' MB'"></span>
      </span>
    </div>
  </div>`}

  <div class="ndb-controls-group">
    <button type="button" class="ndb-icon-button" data-ndb-on:click="openPalette()"
            title="Search sections and settings">
      ${q("search")}
    </button>

    <button type="button" class="ndb-icon-button" data-ndb-on:click="cycleTheme()"
            data-ndb-bind:title="'Theme: ' + theme + '. Click for the next one.'">
      <span data-ndb-show="theme === 'system'">${q("monitor")}</span>
      <span data-ndb-show="theme === 'light'">${q("sun")}</span>
      <span data-ndb-show="theme === 'dark'">${q("moon")}</span>
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
      <span data-ndb-show="!maximised">${q("expand")}</span>
      <span data-ndb-show="maximised">${q("collapse")}</span>
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
function za(e, t) {
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
function qp() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${za("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${za("otherSections", !1)}
</nav>`;
}
function ft(e, t) {
  return `<div class="ndb-subtabs" role="tablist">${t.map((s) => `
  <button type="button" class="ndb-subtab" role="tab"
          data-ndb-bind:aria-selected="${e} === '${s.id}' ? 'true' : 'false'"
          data-ndb-bind:class="${e} === '${s.id}' && 'is-active'"
          data-ndb-on:click="${e} = '${s.id}'">
    <span>${s.label}</span>
    ${s.count ? `<span class="ndb-pill"${s.tone ? ` data-ndb-bind:class="'is-' + (${s.tone})"` : ""}
            ${s.always ? "" : `data-ndb-show="${s.count}"`}
            data-ndb-text="${s.count}"></span>` : ""}
  </button>`).join("")}</div>`;
}
const jp = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme"
     data-ndb-on:resize.window="constrainDock()">

  <div class="ndb-dock" data-ndb-ref="dock"
       data-ndb-show="!open && !dismissed && !collapsed" data-ndb-cloak
       data-ndb-bind:class="draggingDock && 'is-dragging'"
       data-ndb-bind:style="dockStyle"
       title="Open the inspector" data-ndb-on:click="openFromBar($event)">
    ${Wa({ sheet: !1 })}
  </div>

  <button type="button" class="ndb-bubble" data-ndb-show="collapsed && !dismissed" data-ndb-cloak
          data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
          data-ndb-on:click="expand()"
          aria-label="Show the debug bar" title="Show the debug bar">
    ${q("pulse")}
    <span class="ndb-badge" data-ndb-show="findings.length > 0"
          data-ndb-text="findings.length"></span>
  </button>

  ${pd()}

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${Wa({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${q("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${qp()}

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
            ${Ce([
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
            ${Ce([
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
            ${Ce([
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
            ${Ce([
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
          ${ft("magewireTab", [
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
        ${ft("seoTab", [
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

          ${Ce([
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
          ${Ce([
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
        ${ft("dataLayerTab", [
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

      <template data-ndb-if="isSection('history')">
      <div>
        ${ft("historyTab", [
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
          ${ft("alpineTab", [
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
            ${Ce([
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
`, Up = "data-ndb-", Va = "siteation-debugbar";
function Bp(e) {
  const t = e.attachShadow({ mode: "open" }), n = e.dataset.css;
  if (n) {
    const a = document.createElement("link");
    a.rel = "stylesheet", a.href = n, t.append(a);
  }
  const s = document.createElement("div");
  return s.innerHTML = jp, t.append(...s.children), t.querySelector(".ndb");
}
class Fp extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const t = Bp(this);
    t && _t.initTree(t);
  }
}
customElements.get(Va) || (_t.prefix(Up), _t.data("debugBar", Dp), _t.directive("code", (e, { expression: t }, { effect: n, evaluateLater: s }) => {
  const a = s(t);
  n(() => a((i) => {
    e.innerHTML = typeof i == "string" ? i : "";
  }));
}), customElements.define(Va, Fp));
Fn && (window.Alpine = Fn);
