const jn = window.Alpine;
var Un = !1, Bn = !1, fe = [], Fn = -1, Xt = !1, ds = !1;
function ho(e) {
  go(e);
}
function fo() {
  ds = !0;
}
function bo() {
  ds = !1, Ba();
}
function go(e) {
  fe.includes(e) || (fe.push(e), e._x_schedulerPriority !== void 0 && (Xt = !0)), Ba();
}
function mo(e) {
  let t = fe.indexOf(e);
  t !== -1 && t > Fn && fe.splice(t, 1);
}
function Ba() {
  if (!Bn && !Un) {
    if (ds)
      return;
    Un = !0, queueMicrotask(yo);
  }
}
function yo() {
  Un = !1, Bn = !0;
  for (let e = 0; e < fe.length; e++)
    Xt && vo(e), fe[e](), Fn = e;
  fe.length = 0, Fn = -1, Xt = !1, Bn = !1;
}
function vo(e) {
  let t = /* @__PURE__ */ new Map(), n = fe.slice(e).sort((s, a) => wo(s, a, t));
  for (let s = 0; s < n.length; s++)
    fe[e + s] = n[s];
  Xt = !1;
}
function wo(e, t, n) {
  return Tn(e) ? Tn(t) ? ra(e._x_schedulerPriority.el, n) - ra(t._x_schedulerPriority.el, n) || e._x_schedulerPriority.order - t._x_schedulerPriority.order : -1 : Tn(t) ? 1 : 0;
}
function Tn(e) {
  return e._x_schedulerPriority !== void 0;
}
function ra(e, t) {
  if (t.has(e))
    return t.get(e);
  let n = 0, s = e;
  for (; e; )
    n++, e._x_teleportBack ? e = e._x_teleportBack : typeof ShadowRoot == "function" && e.parentNode instanceof ShadowRoot ? e = e.parentNode.host : e = e.parentElement;
  return t.set(s, n), n;
}
var at, We, it, Fa, _o = 0, Hn = !0;
function xo(e) {
  Hn = !1, e(), Hn = !0;
}
function Eo(e) {
  at = e.reactive, it = e.release, We = (t) => e.effect(t, { scheduler: (n) => {
    Hn ? ho(n) : n();
  } }), Fa = e.raw;
}
function oa(e) {
  We = e;
}
function ko(e) {
  let t = () => {
  };
  return [(s, a) => {
    let i = a?.priority === "structural" ? _o++ : void 0, r = We(s);
    return i !== void 0 && r !== void 0 && (r._x_schedulerPriority = { el: e, order: i }), e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), it(r));
    }, r;
  }, () => {
    t();
  }];
}
function Ha(e, t) {
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
async function So(e) {
  fo();
  try {
    await e(), await Promise.resolve();
  } finally {
    bo();
  }
}
var Ga = [], Wa = [], za = [];
function Ao(e) {
  za.push(e);
}
function us(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Wa.push(t));
}
function Ka(e) {
  Ga.push(e);
}
function Va(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function Ja(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, s]) => {
    (t === void 0 || t.includes(n)) && (s.forEach((a) => a()), delete e._x_attributeCleanups[n]);
  });
}
function Oo(e) {
  for (e._x_effects?.forEach(mo); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var ps = new MutationObserver(gs), hs = !1;
function fs() {
  ps.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), hs = !0;
}
function Xa() {
  To(), ps.disconnect(), hs = !1;
}
var dt = [];
function To() {
  let e = ps.takeRecords();
  dt.push(() => e.length > 0 && gs(e));
  let t = dt.length;
  queueMicrotask(() => {
    if (dt.length === t)
      for (; dt.length > 0; )
        dt.shift()();
  });
}
function B(e) {
  if (!hs)
    return e();
  Xa();
  let t = e();
  return fs(), t;
}
var bs = !1, Zt = [];
function Mo() {
  bs = !0;
}
function Co() {
  bs = !1, gs(Zt), Zt = [];
}
function gs(e) {
  if (bs) {
    Zt = Zt.concat(e);
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
      let r = e[i].target, o = e[i].attributeName, l = e[i].oldValue, d = () => {
        s.has(r) || s.set(r, []), s.get(r).push({ name: o, value: r.getAttribute(o) });
      }, u = () => {
        a.has(r) || a.set(r, []), a.get(r).push(o);
      };
      r.hasAttribute(o) && l === null ? d() : r.hasAttribute(o) ? (u(), d()) : u();
    }
  a.forEach((i, r) => {
    Ja(r, i);
  }), s.forEach((i, r) => {
    Ga.forEach((o) => o(r, i));
  });
  for (let i of n)
    t.some((r) => r.contains(i)) || Wa.forEach((r) => r(i));
  for (let i of t)
    i.isConnected && za.forEach((r) => r(i));
  t = null, n = null, s = null, a = null;
}
function Za(e) {
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
  return new Proxy({ objects: e }, No);
}
function Ya(e, t) {
  return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : Ya(Object.getPrototypeOf(e), t);
}
var No = {
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
    return t == "toJSON" ? Ro : Reflect.get(
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
      if (a = Ya(r, t), a)
        break;
    a || (a = e[e.length - 1]);
    const i = Object.getOwnPropertyDescriptor(a, t);
    return i?.set && i?.get ? i.set.call(s, n) || !0 : Reflect.set(a, t, n);
  }
};
function Ro() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function ms(e, t = () => {
}) {
  let n = (a) => typeof a == "object" && !Array.isArray(a) && a !== null, s = (a, i = "") => {
    Object.entries(Object.getOwnPropertyDescriptors(a)).forEach(([r, { value: o, enumerable: l }]) => {
      if (l === !1 || o === void 0 || typeof o == "object" && o !== null && o.__v_skip)
        return;
      let d = i === "" ? r : `${i}.${r}`;
      typeof o == "object" && o !== null && o._x_interceptor ? a[r] = o.initialize(e, d, r, t) : n(o) && o !== a && !(o instanceof Element) && s(o, d);
    });
  };
  return s(e);
}
function Qa(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(s, a, i, r) {
      return e(this.initialValue, () => $o(s, a), (o) => Gn(s, a, o), a, i, r);
    }
  };
  return t(n), (s) => {
    if (typeof s == "object" && s !== null && s._x_interceptor) {
      let a = n.initialize.bind(n);
      n.initialize = (i, r, o, l) => {
        let d = s.initialize(i, r, o, l);
        return n.initialValue = d, a(i, r, o, l);
      };
    } else
      n.initialValue = s;
    return n;
  };
}
function $o(e, t) {
  return t.split(".").reduce((n, s) => n[s], e);
}
function Gn(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Gn(e[t[0]], t.slice(1), n);
  }
}
var ei = {};
function ie(e, t) {
  ei[e] = t;
}
function Yt(e, t) {
  let n = Lo(t);
  return Object.entries(ei).forEach(([s, a]) => {
    Object.defineProperty(e, `$${s}`, {
      get() {
        return a(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function Lo(e) {
  let [t, n] = oi(e), s = { interceptor: Qa, ...t };
  return us(e, n), s;
}
function Po(e, t, n, ...s) {
  try {
    return n(...s);
  } catch (a) {
    ys(a, e, t);
  }
}
function ys(...e) {
  return ti(...e);
}
var ti = Do;
function Io(e) {
  ti = e;
}
function Do(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var $e = !0;
function ni(e) {
  let t = $e;
  $e = !1;
  let n = e();
  return $e = t, n;
}
function Le(e, t, n = {}) {
  let s;
  return Z(e, t)((a) => s = a, n), s;
}
function Z(...e) {
  return si(...e);
}
var si = () => {
};
function qo(e) {
  si = e;
}
var ai;
function jo(e) {
  ai = e;
}
function Uo(e, t) {
  return (n = () => {
  }, { scope: s = {}, params: a = [], context: i } = {}) => {
    if (!$e) {
      Wn(n, t, De([s, ...e]), a);
      return;
    }
    let r = t.apply(De([s, ...e]), a);
    Wn(n, r);
  };
}
function Wn(e, t, n, s, a) {
  if ($e && typeof t == "function") {
    let i = t.apply(n, s);
    i instanceof Promise ? i.then((r) => Wn(e, r, n, s)).catch((r) => ys(r, a, t)) : e(i);
  } else typeof t == "object" && t instanceof Promise ? t.then((i) => e(i)) : e(t);
}
function Bo(...e) {
  return ai(...e);
}
var vs = "x-";
function rt(e = "") {
  return vs + e;
}
function Fo(e) {
  vs = e;
}
var Qt = {};
function F(e, t) {
  return Qt[e] = t, {
    before(n) {
      if (!Qt[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const s = Re.indexOf(n);
      Re.splice(s >= 0 ? s : Re.indexOf("DEFAULT"), 0, e);
    }
  };
}
function Ho(e) {
  return Object.keys(Qt).includes(e);
}
function ws(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let i = Object.entries(e._x_virtualDirectives).map(([o, l]) => ({ name: o, value: l })), r = ii(i);
    i = i.map((o) => r.find((l) => l.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(i);
  }
  let s = {};
  return t.map(di((i, r) => s[i] = r)).filter(pi).map(zo(s, n)).sort(Ko).map((i) => Wo(e, i));
}
function ii(e) {
  return Array.from(e).map(di()).filter((t) => !pi(t));
}
var zn = !1, bt = /* @__PURE__ */ new Map(), ri = /* @__PURE__ */ Symbol();
function Go(e) {
  zn = !0;
  let t = /* @__PURE__ */ Symbol();
  ri = t, bt.set(t, []);
  let n = () => {
    for (; bt.get(t).length; )
      bt.get(t).shift()();
    bt.delete(t);
  }, s = () => {
    zn = !1, n();
  };
  e(n), s();
}
function oi(e) {
  let t = [], n = (o) => t.push(o), [s, a] = ko(e);
  return t.push(a), [{
    Alpine: ot,
    effect: s,
    cleanup: n,
    evaluateLater: Z.bind(Z, e),
    evaluate: Le.bind(Le, e)
  }, () => t.forEach((o) => o())];
}
function Wo(e, t) {
  let n = () => {
  }, s = Qt[t.type] || n, [a, i] = oi(e);
  Va(e, t.original, i);
  let r = () => {
    e._x_ignore || e._x_ignoreSelf || (s.inline && s.inline(e, t, a), s = s.bind(s, e, t, a), zn ? bt.get(ri).push(s) : s());
  };
  return r.runCleanups = i, r;
}
var li = (e, t) => ({ name: n, value: s }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: s }), ci = (e) => e;
function di(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: s, value: a } = ui.reduce((i, r) => r(i), { name: t, value: n });
    return s !== t && e(s, t), { name: s, value: a };
  };
}
var ui = [];
function _s(e) {
  ui.push(e);
}
function pi({ name: e }) {
  return hi().test(e);
}
var hi = () => new RegExp(`^${vs}([^:^.]+)\\b`);
function zo(e, t) {
  return ({ name: n, value: s }) => {
    n === s && (s = "");
    let a = n.match(hi()), i = n.match(/:([a-zA-Z0-9\-_:]+)/), r = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: a ? a[1] : null,
      value: i ? i[1] : null,
      modifiers: r.map((l) => l.replace(".", "")),
      expression: s,
      original: o
    };
  };
}
var Kn = "DEFAULT", Re = [
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
  Kn,
  "teleport"
];
function Ko(e, t) {
  let n = Re.indexOf(e.type) === -1 ? Kn : e.type, s = Re.indexOf(t.type) === -1 ? Kn : t.type;
  return Re.indexOf(n) - Re.indexOf(s);
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
var la = !1;
function Vo() {
  la && ce("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), la = !0, document.body || ce("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), gt(document, "alpine:init"), gt(document, "alpine:initializing"), fs(), Ao((t) => ge(t, qe)), us((t) => ze(t)), Ka((t, n) => {
    ws(t, n).forEach((s) => s());
  });
  let e = (t) => !cn(t.parentElement, !0);
  Array.from(document.querySelectorAll(gi().join(","))).filter(e).forEach((t) => {
    ge(t);
  }), gt(document, "alpine:initialized"), setTimeout(() => {
    Yo();
  });
}
var xs = [], fi = [];
function bi() {
  return xs.map((e) => e());
}
function gi() {
  return xs.concat(fi).map((e) => e());
}
function mi(e) {
  xs.push(e);
}
function yi(e) {
  fi.push(e);
}
function cn(e, t = !1) {
  return be(e, (n) => {
    if ((t ? gi() : bi()).some((a) => n.matches(a)))
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
function Jo(e) {
  return bi().some((t) => e.matches(t));
}
var vi = [];
function Xo(e) {
  vi.push(e);
}
var Zo = 1;
function ge(e, t = qe, n = () => {
}) {
  be(e, (s) => s._x_ignore) || Go(() => {
    t(e, (s, a) => {
      s._x_marker || (n(s, a), vi.forEach((i) => i(s, a)), ws(s, s.attributes).forEach((i) => i()), s._x_ignore || (s._x_marker = Zo++), s._x_ignore && a());
    });
  });
}
function ze(e, t = qe) {
  t(e, (n) => {
    Oo(n), Ja(n), delete n._x_marker;
  });
}
function Yo() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, s]) => {
    Ho(n) || s.some((a) => {
      if (document.querySelector(a))
        return ce(`found "${a}", but missing ${t} plugin`), !0;
    });
  });
}
var Vn = [], Es = !1;
function ks(e = () => {
}) {
  return queueMicrotask(() => {
    Es || setTimeout(() => {
      Jn();
    });
  }), new Promise((t) => {
    Vn.push(() => {
      e(), t();
    });
  });
}
function Jn() {
  for (Es = !1; Vn.length; )
    Vn.shift()();
}
function Qo() {
  Es = !0;
}
function Ss(e, t) {
  return Array.isArray(t) ? ca(e, t.join(" ")) : typeof t == "object" && t !== null ? el(e, t) : typeof t == "function" ? Ss(e, t()) : ca(e, t);
}
function Xn(e) {
  return e.split(/\s/).filter(Boolean);
}
function ca(e, t) {
  let n = (a) => Xn(a).filter((i) => !e.classList.contains(i)).filter(Boolean), s = (a) => (e.classList.add(...a), () => {
    e.classList.remove(...a);
  });
  return t = t === !0 ? t = "" : t || "", s(n(t));
}
function el(e, t) {
  let n = Object.entries(t).flatMap(([r, o]) => o ? Xn(r) : !1).filter(Boolean), s = Object.entries(t).flatMap(([r, o]) => o ? !1 : Xn(r)).filter(Boolean), a = [], i = [];
  return s.forEach((r) => {
    e.classList.contains(r) && (e.classList.remove(r), i.push(r));
  }), n.forEach((r) => {
    e.classList.contains(r) || (e.classList.add(r), a.push(r));
  }), () => {
    i.forEach((r) => e.classList.add(r)), a.forEach((r) => e.classList.remove(r));
  };
}
function dn(e, t) {
  return typeof t == "object" && t !== null ? tl(e, t) : nl(e, t);
}
function tl(e, t) {
  let n = {};
  return Object.entries(t).forEach(([s, a]) => {
    n[s] = e.style[s], s.startsWith("--") || (s = sl(s)), e.style.setProperty(s, a);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    dn(e, n);
  };
}
function nl(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function sl(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Zn(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
F("transition", (e, { value: t, modifiers: n, expression: s }, { evaluate: a }) => {
  typeof s == "function" && (s = a(s)), s !== !1 && (!s || typeof s == "boolean" ? il(e, n, t) : al(e, s, t));
});
function al(e, t, n) {
  wi(e, Ss, ""), {
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
function il(e, t, n) {
  wi(e, dn);
  let s = !t.includes("in") && !t.includes("out") && !n, a = s || t.includes("in") || ["enter"].includes(n), i = s || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !s && (t = t.filter((S, P) => P < t.indexOf("out"))), t.includes("out") && !s && (t = t.filter((S, P) => P > t.indexOf("out")));
  let r = !t.includes("opacity") && !t.includes("scale"), o = r || t.includes("opacity"), l = r || t.includes("scale"), d = o ? 0 : 1, u = l ? ut(t, "scale", 95) / 100 : 1, p = ut(t, "delay", 0) / 1e3, f = ut(t, "origin", "center"), k = "opacity, transform", M = ut(t, "duration", 150) / 1e3, g = ut(t, "duration", 75) / 1e3, v = "cubic-bezier(0.4, 0.0, 0.2, 1)";
  a && (e._x_transition.enter.during = {
    transformOrigin: f,
    transitionDelay: `${p}s`,
    transitionProperty: k,
    transitionDuration: `${M}s`,
    transitionTimingFunction: v
  }, e._x_transition.enter.start = {
    opacity: d,
    transform: `scale(${u})`
  }, e._x_transition.enter.end = {
    opacity: 1,
    transform: "scale(1)"
  }), i && (e._x_transition.leave.during = {
    transformOrigin: f,
    transitionDelay: `${p}s`,
    transitionProperty: k,
    transitionDuration: `${g}s`,
    transitionTimingFunction: v
  }, e._x_transition.leave.start = {
    opacity: 1,
    transform: "scale(1)"
  }, e._x_transition.leave.end = {
    opacity: d,
    transform: `scale(${u})`
  });
}
function wi(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(s = () => {
    }, a = () => {
    }) {
      Yn(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, s, a);
    },
    out(s = () => {
    }, a = () => {
    }) {
      Yn(e, t, {
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
    let r = _i(e);
    r ? (r._x_hideChildren || (r._x_hideChildren = []), r._x_hideChildren.push(e)) : a(() => {
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
function _i(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : _i(t);
}
function Yn(e, t, { during: n, start: s, end: a } = {}, i = () => {
}, r = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(s).length === 0 && Object.keys(a).length === 0) {
    i(), r();
    return;
  }
  let o, l, d;
  rl(e, {
    start() {
      o = t(e, s);
    },
    during() {
      l = t(e, n);
    },
    before: i,
    end() {
      o(), d = t(e, a);
    },
    after: r,
    cleanup() {
      l(), d();
    }
  });
}
function rl(e, t) {
  let n, s, a, i = Zn(() => {
    B(() => {
      n = !0, s || t.before(), a || (t.end(), Jn()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(r) {
      this.beforeCancels.push(r);
    },
    cancel: Zn(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      i();
    }),
    finish: i
  }, B(() => {
    t.start(), t.during();
  }), Qo(), requestAnimationFrame(() => {
    if (n)
      return;
    let r = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    r === 0 && (r = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), B(() => {
      t.before();
    }), s = !0, requestAnimationFrame(() => {
      n || (B(() => {
        t.end();
      }), Jn(), setTimeout(e._x_transitioning.finish, r + o), a = !0);
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
function ol(e) {
  return (...t) => Ee && e(...t);
}
var xi = [];
function un(e) {
  xi.push(e);
}
function ll(e, t) {
  xi.forEach((n) => n(e, t)), Ee = !0, Ei(() => {
    ge(t, (n, s) => {
      s(n, () => {
      });
    });
  }), Ee = !1;
}
var Qn = !1;
function cl(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), Ee = !0, Qn = !0, Ei(() => {
    dl(t);
  }), Ee = !1, Qn = !1;
}
function dl(e) {
  let t = !1;
  ge(e, (s, a) => {
    qe(s, (i, r) => {
      if (t && Jo(i))
        return r();
      t = !0, a(i, r);
    });
  });
}
function Ei(e) {
  let t = We;
  oa((n, s) => {
    let a = t(n);
    return it(a), () => {
    };
  }), e(), oa(t);
}
function ki(e, t, n, s = []) {
  switch (e._x_bindings || (e._x_bindings = at({})), e._x_bindings[t] = n, t = s.includes("camel") ? yl(t) : t, t) {
    case "value":
      ul(e, n);
      break;
    case "style":
      hl(e, n);
      break;
    case "class":
      pl(e, n);
      break;
    case "selected":
    case "checked":
      fl(e, t, n);
      break;
    default:
      As(e, t, n);
      break;
  }
}
function ul(e, t) {
  if (Os(e))
    e.attributes.value === void 0 && (e.value = t);
  else if (en(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => vl(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    ml(e, t);
  else if (e.tagName === "OPTION")
    As(e, "value", t);
  else {
    if (e.value === t && (typeof t != "object" || t === null))
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function pl(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = Ss(e, t);
}
function hl(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = dn(e, t);
}
function fl(e, t, n) {
  As(e, t, n), gl(e, t, n);
}
function As(e, t, n) {
  [null, void 0, !1].includes(n) && _l(t) ? e.removeAttribute(t) : (Si(t) && (n = t), xl(n) && (n = JSON.stringify(n)), bl(e, t, n));
}
function bl(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function gl(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function ml(e, t) {
  const n = [].concat(t).map((s) => s + "");
  Array.from(e.options).forEach((s) => {
    s.selected = n.includes(s.value);
  });
}
function yl(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function vl(e, t) {
  return e == t;
}
function Vt(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var wl = /* @__PURE__ */ new Set([
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
function Si(e) {
  return wl.has(e);
}
function _l(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function xl(e) {
  return typeof e == "object" && e !== null;
}
function El(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : Ai(e, t, n);
}
function kl(e, t, n, s = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let a = e._x_inlineBindings[t];
    return a.extract = s, ni(() => Le(e, a.expression));
  }
  return Ai(e, t, n);
}
function Ai(e, t, n) {
  let s = e.getAttribute(t);
  return s === null ? typeof n == "function" ? n() : n : s === "" ? !0 : Si(t) ? !![t, "true"].includes(s) : s;
}
function en(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function Os(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function Oi(e, t) {
  let n;
  return function() {
    const s = this, a = arguments, i = function() {
      n = null, e.apply(s, a);
    };
    clearTimeout(n), n = setTimeout(i, t);
  };
}
function Ti(e, t) {
  let n;
  return function() {
    let s = this, a = arguments;
    n || (e.apply(s, a), n = !0, setTimeout(() => n = !1, t));
  };
}
function Mi({ get: e, set: t }, { get: n, set: s }) {
  let a = !0, i, r = We(() => {
    let o = e(), l = n();
    if (a)
      s(Mn(o)), a = !1;
    else {
      let d = JSON.stringify(o), u = JSON.stringify(l);
      d !== i ? s(Mn(o)) : d !== u && t(Mn(l));
    }
    i = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    it(r);
  };
}
function Mn(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Sl(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(ot));
}
var he = {}, da = !1;
function Al(e, t) {
  if (da || (he = at(he), da = !0), t === void 0)
    return he[e];
  he[e] = t, typeof t == "object" && t !== null && t._x_interceptor ? he[e] = t.initialize(he, e, e, () => {
  }) : ms(he[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && he[e].init();
}
function Ol() {
  return he;
}
var Ci = {};
function Tl(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? Ni(e, n()) : (Ci[e] = n, () => {
  });
}
function Ml(e) {
  return Object.entries(Ci).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...s) => n(...s);
      }
    });
  }), e;
}
function Ni(e, t, n) {
  let s = [];
  for (; s.length; )
    s.pop()();
  let a = Object.entries(t).map(([r, o]) => ({ name: r, value: o })), i = ii(a);
  return a = a.map((r) => i.find((o) => o.name === r.name) ? {
    name: `x-bind:${r.name}`,
    value: `"${r.value}"`
  } : r), ws(e, a, n).map((r) => {
    s.push(r.runCleanups), r();
  }), () => {
    for (; s.length; )
      s.pop()();
  };
}
var Ri = {};
function Cl(e, t) {
  Ri[e] = t;
}
function Nl(e, t) {
  return Object.entries(Ri).forEach(([n, s]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...a) => s.bind(t)(...a);
      },
      enumerable: !1
    });
  }), e;
}
var Rl = {
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
    return Fa;
  },
  get transaction() {
    return So;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Co,
  dontAutoEvaluateFunctions: ni,
  disableEffectScheduling: xo,
  startObservingMutations: fs,
  stopObservingMutations: Xa,
  setReactivityEngine: Eo,
  onAttributeRemoved: Va,
  onAttributesAdded: Ka,
  closestDataStack: nt,
  skipDuringClone: ke,
  onlyDuringClone: ol,
  addRootSelector: mi,
  addInitSelector: yi,
  setErrorHandler: Io,
  interceptClone: un,
  addScopeToNode: Mt,
  deferMutations: Mo,
  mapAttributes: _s,
  evaluateLater: Z,
  interceptInit: Xo,
  initInterceptors: ms,
  injectMagics: Yt,
  setEvaluator: qo,
  setRawEvaluator: jo,
  mergeProxies: De,
  extractProp: kl,
  findClosest: be,
  onElRemoved: us,
  closestRoot: cn,
  destroyTree: ze,
  interceptor: Qa,
  // INTERNAL: not public API and is subject to change without major release.
  transition: Yn,
  // INTERNAL
  setStyles: dn,
  // INTERNAL
  mutateDom: B,
  directive: F,
  entangle: Mi,
  throttle: Ti,
  debounce: Oi,
  evaluate: Le,
  evaluateRaw: Bo,
  initTree: ge,
  nextTick: ks,
  prefixed: rt,
  prefix: Fo,
  plugin: Sl,
  magic: ie,
  store: Al,
  start: Vo,
  clone: cl,
  // INTERNAL
  cloneNode: ll,
  // INTERNAL
  bound: El,
  $data: Za,
  watch: Ha,
  walk: qe,
  data: Cl,
  bind: Tl
}, ot = Rl, ua = /* @__PURE__ */ new WeakMap(), $i = /* @__PURE__ */ new Set();
Object.getOwnPropertyNames(globalThis).forEach((e) => {
  e === "styleMedia" || e === "sharedStorage" || $i.add(globalThis[e]);
});
var W = class {
  constructor(e, t, n, s) {
    this.type = e, this.value = t, this.start = n, this.end = s;
  }
}, $l = class {
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
}, Ll = class {
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
}, Pl = class {
  evaluate({ node: e, scope: t = {}, context: n = null, forceBindingRootScopeToFunctions: s = !0 }) {
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
        const a = this.evaluate({ node: e.object, scope: t, context: n, forceBindingRootScopeToFunctions: s });
        if (a == null)
          throw new Error("Cannot read property of null or undefined");
        let i;
        e.computed ? i = this.evaluate({ node: e.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : i = e.property.name, this.checkForDangerousKeywords(i);
        let r = a[i];
        return this.checkForDangerousValues(r), typeof r == "function" ? s ? r.bind(t) : r.bind(a) : r;
      case "CallExpression":
        const o = e.arguments.map((v) => this.evaluate({ node: v, scope: t, context: n, forceBindingRootScopeToFunctions: s }));
        let l;
        if (e.callee.type === "MemberExpression") {
          const v = this.evaluate({ node: e.callee.object, scope: t, context: n, forceBindingRootScopeToFunctions: s });
          let S;
          e.callee.computed ? S = this.evaluate({ node: e.callee.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : S = e.callee.property.name, this.checkForDangerousKeywords(S);
          let P = v[S];
          if (typeof P != "function")
            throw new Error("Value is not a function");
          l = P.apply(v, o);
        } else if (e.callee.type === "Identifier") {
          const v = e.callee.name;
          let S;
          if (v in t)
            S = t[v];
          else
            throw new Error(`Undefined variable: ${v}`);
          if (typeof S != "function")
            throw new Error("Value is not a function");
          const P = n !== null ? n : t;
          l = S.apply(P, o);
        } else {
          const v = this.evaluate({ node: e.callee, scope: t, context: n, forceBindingRootScopeToFunctions: s });
          if (typeof v != "function")
            throw new Error("Value is not a function");
          l = v.apply(n, o);
        }
        return this.checkForDangerousValues(l), l;
      case "UnaryExpression":
        const d = this.evaluate({ node: e.argument, scope: t, context: n, forceBindingRootScopeToFunctions: s });
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
          const S = t[v];
          return e.operator === "++" ? t[v] = S + 1 : e.operator === "--" && (t[v] = S - 1), e.prefix ? t[v] : S;
        } else if (e.argument.type === "MemberExpression") {
          const v = this.evaluate({ node: e.argument.object, scope: t, context: n, forceBindingRootScopeToFunctions: s }), S = e.argument.computed ? this.evaluate({ node: e.argument.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : e.argument.property.name;
          if (this.isDOMObject(v))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          this.checkForDangerousKeywords(S);
          const P = v[S];
          return e.operator === "++" ? v[S] = P + 1 : e.operator === "--" && (v[S] = P - 1), e.prefix ? v[S] : P;
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
        const M = this.evaluate({ node: e.right, scope: t, context: n, forceBindingRootScopeToFunctions: s });
        if (e.left.type === "Identifier")
          return t[e.left.name] = M, M;
        if (e.left.type === "MemberExpression") {
          const v = this.evaluate({ node: e.left.object, scope: t, context: n, forceBindingRootScopeToFunctions: s }), S = e.left.computed ? this.evaluate({ node: e.left.property, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : e.left.property.name;
          if (this.isDOMObject(v))
            throw new Error("Property assignments on DOM objects are prohibited in the CSP build");
          return this.checkForDangerousKeywords(S), v[S] = M, M;
        }
        throw new Error("Invalid assignment target");
      case "ArrayExpression":
        return e.elements.map((v) => this.evaluate({ node: v, scope: t, context: n, forceBindingRootScopeToFunctions: s }));
      case "ObjectExpression":
        const g = {};
        for (const v of e.properties) {
          const S = v.computed ? this.evaluate({ node: v.key, scope: t, context: n, forceBindingRootScopeToFunctions: s }) : v.key.type === "Identifier" ? v.key.name : this.evaluate({ node: v.key, scope: t, context: n, forceBindingRootScopeToFunctions: s }), P = this.evaluate({ node: v.value, scope: t, context: n, forceBindingRootScopeToFunctions: s });
          g[S] = P;
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
    if (e !== null && !(typeof e != "object" && typeof e != "function") && !ua.has(e)) {
      if (e instanceof HTMLIFrameElement || e instanceof HTMLScriptElement)
        throw new Error("Accessing iframes and scripts is prohibited in the CSP build");
      if ($i.has(e))
        throw new Error("Accessing global variables is prohibited in the CSP build");
      return ua.set(e, !0), !0;
    }
  }
};
function Li(e) {
  try {
    const n = new $l(e).tokenize(), a = new Ll(n).parse(), i = new Pl();
    return function(r = {}) {
      const { scope: o = {}, context: l = null, forceBindingRootScopeToFunctions: d = !1 } = r;
      return i.evaluate({ node: a, scope: o, context: l, forceBindingRootScopeToFunctions: d });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function Il(e, t, n = {}) {
  let s = Pi(e), a = De([n.scope ?? {}, ...s]), i = n.params ?? [], o = Li(t)({
    scope: a,
    forceBindingRootScopeToFunctions: !0
  });
  return typeof o == "function" && $e ? o.apply(a, i) : o;
}
function Dl(e, t) {
  let n = Pi(e);
  if (typeof t == "function")
    return Uo(n, t);
  let s = ql(e, t, n);
  return Po.bind(null, e, t, s);
}
function Pi(e) {
  let t = {};
  return Yt(t, e), [t, ...nt(e)];
}
function ql(e, t, n) {
  if (e instanceof HTMLIFrameElement)
    throw new Error("Evaluating expressions on an iframe is prohibited in the CSP build");
  if (e instanceof HTMLScriptElement)
    throw new Error("Evaluating expressions on a script is prohibited in the CSP build");
  return (s = () => {
  }, { scope: a = {}, params: i = [] } = {}) => {
    let r = De([a, ...n]), l = Li(t)({
      scope: r,
      forceBindingRootScopeToFunctions: !0
    });
    if ($e && typeof l == "function") {
      let d = l.apply(l, i);
      d instanceof Promise ? d.then((u) => s(u)) : s(d);
    } else typeof l == "object" && l instanceof Promise ? l.then((d) => s(d)) : s(l);
  };
}
function jl(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(","))
    t[n] = 1;
  return (n) => n in t;
}
var xt = Object.assign, Ul = Object.prototype.hasOwnProperty, es = (e, t) => Ul.call(e, t), Et = Array.isArray, mt = (e) => Ii(e) === "[object Map]", Bl = (e) => typeof e == "string", Ct = (e) => typeof e == "symbol", kt = (e) => e !== null && typeof e == "object", Fl = Object.prototype.toString, Ii = (e) => Fl.call(e), Di = (e) => Ii(e).slice(8, -1), Ts = (e) => Bl(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Hl = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, Gl = Hl((e) => e.charAt(0).toUpperCase() + e.slice(1)), Ne = (e, t) => !Object.is(e, t);
function je(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var $, Cn = /* @__PURE__ */ new WeakSet(), pa = class {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Cn.has(this) && (Cn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Wl(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ha(this), ji(this);
    const e = $, t = ae;
    $ = this, ae = !0;
    try {
      return this.fn();
    } finally {
      $ !== this && je(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Ui(this), $ = e, ae = t, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Ns(e);
      this.deps = this.depsTail = void 0, ha(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Cn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ts(this) && this.run();
  }
  get dirty() {
    return ts(this);
  }
}, qi = 0, yt, vt;
function Wl(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = vt, vt = e;
    return;
  }
  e.next = yt, yt = e;
}
function Ms() {
  qi++;
}
function Cs() {
  if (--qi > 0)
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
function ji(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ui(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const a = s.prevDep;
    s.version === -1 ? (s === n && (n = a), Ns(s), Kl(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = a;
  }
  e.deps = t, e.depsTail = n;
}
function ts(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (zl(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function zl(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === tn) || (e.globalVersion = tn, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ts(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = $, s = ae;
  $ = e, ae = !0;
  try {
    ji(e);
    const a = e.fn(e._value);
    (t.version === 0 || Ne(a, e._value)) && (e.flags |= 128, e._value = a, t.version++);
  } catch (a) {
    throw t.version++, a;
  } finally {
    $ = n, ae = s, Ui(e), e.flags &= -3;
  }
}
function Ns(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: a } = e;
  if (s && (s.nextSub = a, e.prevSub = void 0), a && (a.prevSub = s, e.nextSub = void 0), n.subsHead === e && (n.subsHead = a), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      Ns(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Kl(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function Vl(e, t) {
  e.effect instanceof pa && (e = e.effect.fn);
  const n = new pa(e);
  t && xt(n, t);
  try {
    n.run();
  } catch (a) {
    throw n.stop(), a;
  }
  const s = n.run.bind(n);
  return s.effect = n, s;
}
function Jl(e) {
  e.effect.stop();
}
var ae = !0, Bi = [];
function Xl() {
  Bi.push(ae), ae = !1;
}
function Zl() {
  const e = Bi.pop();
  ae = e === void 0 ? !0 : e;
}
function ha(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = $;
    $ = void 0;
    try {
      t();
    } finally {
      $ = n;
    }
  }
}
var tn = 0, Yl = class {
  constructor(e, t) {
    this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, Ql = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(e) {
    if (!$ || !ae || $ === this.computed)
      return;
    let t = this.activeLink;
    if (t === void 0 || t.sub !== $)
      t = this.activeLink = new Yl($, this), $.deps ? (t.prevDep = $.depsTail, $.depsTail.nextDep = t, $.depsTail = t) : $.deps = $.depsTail = t, Fi(t);
    else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
      const n = t.nextDep;
      n.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = n), t.prevDep = $.depsTail, t.nextDep = void 0, $.depsTail.nextDep = t, $.depsTail = t, $.deps === t && ($.deps = n);
    }
    return $.onTrack && $.onTrack(
      xt(
        {
          effect: $
        },
        e
      )
    ), t;
  }
  trigger(e) {
    this.version++, tn++, this.notify(e);
  }
  notify(e) {
    Ms();
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
      Cs();
    }
  }
};
function Fi(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Fi(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
var ns = /* @__PURE__ */ new WeakMap(), Pe = /* @__PURE__ */ Symbol(
  "Object iterate"
), ss = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), St = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function Y(e, t, n) {
  if (ae && $) {
    let s = ns.get(e);
    s || ns.set(e, s = /* @__PURE__ */ new Map());
    let a = s.get(n);
    a || (s.set(n, a = new Ql()), a.map = s, a.key = n), a.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function xe(e, t, n, s, a, i) {
  const r = ns.get(e);
  if (!r) {
    tn++;
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
  if (Ms(), t === "clear")
    r.forEach(o);
  else {
    const l = Et(e), d = l && Ts(n);
    if (l && n === "length") {
      const u = Number(s);
      r.forEach((p, f) => {
        (f === "length" || f === St || !Ct(f) && f >= u) && o(p);
      });
    } else
      switch ((n !== void 0 || r.has(void 0)) && o(r.get(n)), d && o(r.get(St)), t) {
        case "add":
          l ? d && o(r.get("length")) : (o(r.get(Pe)), mt(e) && o(r.get(ss)));
          break;
        case "delete":
          l || (o(r.get(Pe)), mt(e) && o(r.get(ss)));
          break;
        case "set":
          mt(e) && o(r.get(Pe));
          break;
      }
  }
  Cs();
}
function Qe(e) {
  const t = L(e);
  return t === e ? t : (Y(t, "iterate", St), Be(e) ? t : t.map(Fe));
}
function Rs(e) {
  return Y(e = L(e), "iterate", St), e;
}
function le(e, t) {
  return Ue(e) ? Ji(e) ? At(Fe(t)) : At(t) : Fe(t);
}
var ec = {
  __proto__: null,
  [Symbol.iterator]() {
    return Nn(this, Symbol.iterator, (e) => le(this, e));
  },
  concat(...e) {
    return Qe(this).concat(
      ...e.map((t) => Et(t) ? Qe(t) : t)
    );
  },
  entries() {
    return Nn(this, "entries", (e) => (e[1] = le(this, e[1]), e));
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
    return Rn(this, "includes", e);
  },
  indexOf(...e) {
    return Rn(this, "indexOf", e);
  },
  join(e) {
    return Qe(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Rn(this, "lastIndexOf", e);
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
    return fa(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return fa(this, "reduceRight", e, t);
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
    return Nn(this, "values", (e) => le(this, e));
  }
};
function Nn(e, t, n) {
  const s = Rs(e), a = s[t]();
  return s !== e && !Be(e) && (a._next = a.next, a.next = () => {
    const i = a._next();
    return i.done || (i.value = n(i.value)), i;
  }), a;
}
var tc = Array.prototype;
function ue(e, t, n, s, a, i) {
  const r = Rs(e), o = r !== e && !Be(e), l = r[t];
  if (l !== tc[t]) {
    const p = l.apply(e, i);
    return o ? Fe(p) : p;
  }
  let d = n;
  r !== e && (o ? d = function(p, f) {
    return n.call(this, le(e, p), f, e);
  } : n.length > 2 && (d = function(p, f) {
    return n.call(this, p, f, e);
  }));
  const u = l.call(r, d, s);
  return o && a ? a(u) : u;
}
function fa(e, t, n, s) {
  const a = Rs(e), i = a !== e && !Be(e);
  let r = n, o = !1;
  a !== e && (i ? (o = s.length === 0, r = function(d, u, p) {
    return o && (o = !1, d = le(e, d)), n.call(this, d, le(e, u), p, e);
  }) : n.length > 3 && (r = function(d, u, p) {
    return n.call(this, d, u, p, e);
  }));
  const l = a[t](r, ...s);
  return o ? le(e, l) : l;
}
function Rn(e, t, n) {
  const s = L(e);
  Y(s, "iterate", St);
  const a = s[t](...n);
  return (a === -1 || a === !1) && bc(n[0]) ? (n[0] = L(n[0]), s[t](...n)) : a;
}
function pt(e, t, n = []) {
  Xl(), Ms();
  const s = L(e)[t].apply(e, n);
  return Cs(), Zl(), s;
}
var nc = /* @__PURE__ */ jl("__proto__,__v_isRef,__isVue"), Hi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Ct)
);
function sc(e) {
  Ct(e) || (e = String(e));
  const t = L(this);
  return Y(t, "has", e), t.hasOwnProperty(e);
}
var Gi = class {
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
      return n === (s ? a ? hc : Ki : a ? pc : zi).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const i = Et(e);
    if (!s) {
      let o;
      if (i && (o = ec[t]))
        return o;
      if (t === "hasOwnProperty")
        return sc;
    }
    const r = Reflect.get(
      e,
      t,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      wt(e) ? e : n
    );
    if ((Ct(t) ? Hi.has(t) : nc(t)) || (s || Y(e, "get", t), a))
      return r;
    if (wt(r)) {
      const o = i && Ts(t) ? r : r.value;
      return s && kt(o) ? as(o) : o;
    }
    return kt(r) ? s ? as(r) : $s(r) : r;
  }
}, ac = class extends Gi {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, t, n, s) {
    let a = e[t];
    const i = Et(e) && Ts(t);
    if (!this._isShallow) {
      const l = Ue(a);
      if (!Be(n) && !Ue(n) && (a = L(a), n = L(n)), !i && wt(a) && !wt(n))
        return l ? (je(
          `Set operation on key "${String(t)}" failed: target is readonly.`,
          e[t]
        ), !0) : (a.value = n, !0);
    }
    const r = i ? Number(t) < e.length : es(e, t), o = Reflect.set(
      e,
      t,
      n,
      wt(e) ? e : s
    );
    return e === L(s) && o && (r ? Ne(n, a) && xe(e, "set", t, n, a) : xe(e, "add", t, n)), o;
  }
  deleteProperty(e, t) {
    const n = es(e, t), s = e[t], a = Reflect.deleteProperty(e, t);
    return a && n && xe(e, "delete", t, void 0, s), a;
  }
  has(e, t) {
    const n = Reflect.has(e, t);
    return (!Ct(t) || !Hi.has(t)) && Y(e, "has", t), n;
  }
  ownKeys(e) {
    return Y(
      e,
      "iterate",
      Et(e) ? "length" : Pe
    ), Reflect.ownKeys(e);
  }
}, ic = class extends Gi {
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
}, rc = /* @__PURE__ */ new ac(), oc = /* @__PURE__ */ new ic(), Ft = (e) => Reflect.getPrototypeOf(e);
function lc(e, t, n) {
  return function(...s) {
    const a = this.__v_raw, i = L(a), r = mt(i), o = e === "entries" || e === Symbol.iterator && r, l = e === "keys" && r, d = a[e](...s), u = t ? At : Fe;
    return !t && Y(
      i,
      "iterate",
      l ? ss : Pe
    ), xt(
      // inheriting all iterator properties
      Object.create(d),
      {
        // iterator protocol
        next() {
          const { value: p, done: f } = d.next();
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
        `${Gl(e)} operation ${n}failed: target is readonly.`,
        L(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function cc(e, t) {
  const n = {
    get(a) {
      const i = this.__v_raw, r = L(i), o = L(a);
      e || (Ne(a, o) && Y(r, "get", a), Y(r, "get", o));
      const { has: l } = Ft(r), d = e ? At : Fe;
      if (l.call(r, a))
        return d(i.get(a));
      if (l.call(r, o))
        return d(i.get(o));
      i !== r && i.get(a);
    },
    get size() {
      const a = this.__v_raw;
      return !e && Y(L(a), "iterate", Pe), a.size;
    },
    has(a) {
      const i = this.__v_raw, r = L(i), o = L(a);
      return e || (Ne(a, o) && Y(r, "has", a), Y(r, "has", o)), a === o ? i.has(a) : i.has(a) || i.has(o);
    },
    forEach(a, i) {
      const r = this, o = r.__v_raw, l = L(o), d = e ? At : Fe;
      return !e && Y(l, "iterate", Pe), o.forEach((u, p) => a.call(i, d(u), d(p), r));
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
        const i = L(this), r = Ft(i), o = L(a), l = !Be(a) && !Ue(a) ? o : a;
        return r.has.call(i, l) || Ne(a, l) && r.has.call(i, a) || Ne(o, l) && r.has.call(i, o) || (i.add(l), xe(i, "add", l, l)), this;
      },
      set(a, i) {
        !Be(i) && !Ue(i) && (i = L(i));
        const r = L(this), { has: o, get: l } = Ft(r);
        let d = o.call(r, a);
        d ? ba(r, o, a) : (a = L(a), d = o.call(r, a));
        const u = l.call(r, a);
        return r.set(a, i), d ? Ne(i, u) && xe(r, "set", a, i, u) : xe(r, "add", a, i), this;
      },
      delete(a) {
        const i = L(this), { has: r, get: o } = Ft(i);
        let l = r.call(i, a);
        l ? ba(i, r, a) : (a = L(a), l = r.call(i, a));
        const d = o ? o.call(i, a) : void 0, u = i.delete(a);
        return l && xe(i, "delete", a, void 0, d), u;
      },
      clear() {
        const a = L(this), i = a.size !== 0, r = mt(a) ? new Map(a) : new Set(a), o = a.clear();
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
    n[a] = lc(a, e);
  }), n;
}
function Wi(e, t) {
  const n = cc(e);
  return (s, a, i) => a === "__v_isReactive" ? !e : a === "__v_isReadonly" ? e : a === "__v_raw" ? s : Reflect.get(
    es(n, a) && a in s ? n : s,
    a,
    i
  );
}
var dc = {
  get: /* @__PURE__ */ Wi(!1)
}, uc = {
  get: /* @__PURE__ */ Wi(!0)
};
function ba(e, t, n) {
  const s = L(n);
  if (s !== n && t.call(e, s)) {
    const a = Di(e);
    je(
      `Reactive ${a} contains both the raw and reactive versions of the same object${a === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var zi = /* @__PURE__ */ new WeakMap(), pc = /* @__PURE__ */ new WeakMap(), Ki = /* @__PURE__ */ new WeakMap(), hc = /* @__PURE__ */ new WeakMap();
function fc(e) {
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
function $s(e) {
  return /* @__PURE__ */ Ue(e) ? e : Vi(
    e,
    !1,
    rc,
    dc,
    zi
  );
}
function as(e) {
  return Vi(
    e,
    !0,
    oc,
    uc,
    Ki
  );
}
function Vi(e, t, n, s, a) {
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
  const r = fc(Di(e));
  if (r === 0)
    return e;
  const o = new Proxy(
    e,
    r === 2 ? s : n
  );
  return a.set(e, o), o;
}
function Ji(e) {
  return /* @__PURE__ */ Ue(e) ? /* @__PURE__ */ Ji(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Ue(e) {
  return !!(e && e.__v_isReadonly);
}
function Be(e) {
  return !!(e && e.__v_isShallow);
}
function bc(e) {
  return e ? !!e.__v_raw : !1;
}
function L(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ L(t) : e;
}
var Fe = (e) => kt(e) ? /* @__PURE__ */ $s(e) : e, At = (e) => kt(e) ? /* @__PURE__ */ as(e) : e;
function wt(e) {
  return e ? e.__v_isRef === !0 : !1;
}
ie("nextTick", () => ks);
ie("dispatch", (e) => gt.bind(gt, e));
ie("watch", (e, { evaluateLater: t, cleanup: n }) => (s, a) => {
  let i = t(s), o = Ha(() => {
    let l;
    return i((d) => l = d), l;
  }, a);
  n(o);
});
ie("store", Ol);
ie("data", (e) => Za(e));
ie("root", (e) => cn(e));
ie("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = De(gc(e))), e._x_refs_proxy));
function gc(e) {
  let t = [];
  return be(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var $n = {};
function Xi(e) {
  return $n[e] || ($n[e] = 0), ++$n[e];
}
function mc(e, t) {
  return be(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function yc(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = Xi(t));
}
ie("id", (e, { cleanup: t }) => (n, s = null) => {
  let a = `${n}${s ? `-${s}` : ""}`;
  return vc(e, a, t, () => {
    let i = mc(e, n), r = i ? i._x_ids[n] : Xi(n);
    return s ? `${n}-${r}-${s}` : `${n}-${r}`;
  });
});
un((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function vc(e, t, n, s) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let a = s();
  return e._x_id[t] = a, n(() => {
    delete e._x_id[t];
  }), a;
}
ie("el", (e) => e);
Zi("Focus", "focus", "focus");
Zi("Persist", "persist", "persist");
function Zi(e, t, n) {
  ie(t, (s) => ce(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, s));
}
F("modelable", (e, { expression: t }, { effect: n, evaluateLater: s, cleanup: a }) => {
  let i = s(t), r = () => {
    let u;
    return i((p) => u = p), u;
  }, o = s(`${t} = __placeholder`), l = (u) => o(() => {
  }, { scope: { __placeholder: u } }), d = r();
  l(d), queueMicrotask(() => {
    if (!e._x_model)
      return;
    e._x_removeModelListeners.default();
    let u = e._x_model.get, p = e._x_model.setWithModifiers, f = Mi(
      {
        get() {
          return u();
        },
        set(k) {
          p(k);
        }
      },
      {
        get() {
          return r();
        },
        set(k) {
          l(k);
        }
      }
    );
    a(f);
  });
});
F("teleport", (e, { modifiers: t, expression: n }, { cleanup: s }) => {
  e.tagName.toLowerCase() !== "template" && ce("x-teleport can only be used on a <template> tag", e);
  let a = ga(n), i = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = i, i._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), i.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    i.addEventListener(o, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Mt(i, {}, e);
  let r = (o, l, d) => {
    d.includes("prepend") ? l.parentNode.insertBefore(o, l) : d.includes("append") ? l.parentNode.insertBefore(o, l.nextSibling) : l.appendChild(o);
  };
  B(() => {
    ke(() => {
      r(i, a, t), ge(i);
    })();
  }), e._x_teleportPutBack = () => {
    let o = ga(n);
    B(() => {
      r(e._x_teleport, o, t);
    });
  }, s(
    () => B(() => {
      i.remove(), ze(i);
    })
  );
});
var wc = document.createElement("div");
function ga(e) {
  let t = ke(() => document.querySelector(e), () => wc)();
  return t || ce(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var Yi = () => {
};
Yi.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
F("ignore", Yi);
F("effect", ke((e, { expression: t }, { effect: n }) => {
  n(Z(e, t));
}));
function tt(e, t, n, s) {
  let a = e, i = (l) => s(l), r = {}, o = (l, d) => (u) => d(l, u);
  return n.includes("dot") && (t = _c(t)), n.includes("camel") && (t = xc(t)), n.includes("capture") && (r.capture = !0), n.includes("window") && (a = window), n.includes("document") && (a = document), n.includes("passive") && (r.passive = n[n.indexOf("passive") + 1] !== "false"), i = Qi(n, i), n.includes("prevent") && (i = o(i, (l, d) => {
    d.preventDefault(), l(d);
  })), n.includes("stop") && (i = o(i, (l, d) => {
    d.stopPropagation(), l(d);
  })), n.includes("once") && (i = o(i, (l, d) => {
    l(d), a.removeEventListener(t, i, r);
  })), (n.includes("away") || n.includes("outside")) && (a = document, i = o(i, (l, d) => {
    e.contains(d.target) || d.target.isConnected !== !1 && (e.offsetWidth < 1 && e.offsetHeight < 1 || e._x_isShown !== !1 && l(d));
  })), n.includes("self") && (i = o(i, (l, d) => {
    d.target === e && l(d);
  })), t === "submit" && (i = o(i, (l, d) => {
    d.target._x_pendingModelUpdates && d.target._x_pendingModelUpdates.forEach((u) => u()), l(d);
  })), (kc(t) || er(t)) && (i = o(i, (l, d) => {
    Sc(d, n) || l(d);
  })), a.addEventListener(t, i, r), () => {
    a.removeEventListener(t, i, r);
  };
}
function Qi(e, t) {
  if (e.includes("debounce")) {
    let n = e[e.indexOf("debounce") + 1] || "invalid-wait", s = nn(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Oi(t, s);
  }
  if (e.includes("throttle")) {
    let n = e[e.indexOf("throttle") + 1] || "invalid-wait", s = nn(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Ti(t, s);
  }
  return t;
}
function _c(e) {
  return e.replace(/-/g, ".");
}
function xc(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function nn(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ec(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function kc(e) {
  return ["keydown", "keyup"].includes(e);
}
function er(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function Sc(e, t) {
  let n = t.filter((i) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(i));
  if (n.includes("debounce")) {
    let i = n.indexOf("debounce");
    n.splice(i, nn((n[i + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let i = n.indexOf("throttle");
    n.splice(i, nn((n[i + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && ma(e.key).includes(n[0]))
    return !1;
  const a = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((i) => n.includes(i));
  return n = n.filter((i) => !a.includes(i)), !(a.length > 0 && a.filter((r) => ((r === "cmd" || r === "super") && (r = "meta"), e[`${r}Key`])).length === a.length && (er(e.type) || ma(e.key).includes(n[0])));
}
function ma(e) {
  if (!e)
    return [];
  e = Ec(e);
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
    return r((v) => g = v), ya(g) ? g.get() : g;
  }, d = (g) => {
    let v;
    r((S) => v = S), ya(v) ? v.set(g) : o(() => {
    }, {
      scope: { __placeholder: g }
    });
  };
  typeof n == "string" && e.type === "radio" && B(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = t.includes("change") || t.includes("lazy"), p = t.includes("blur"), f = t.includes("enter"), k = u || p || f, M;
  if (Ee)
    M = () => {
    };
  else if (k) {
    let g = [], v = (S) => d(Gt(e, t, S, l()));
    if (u && g.push(tt(e, "change", t, v)), p && (g.push(tt(e, "blur", t, v)), e.form)) {
      let S = e.form, P = () => v({ target: e });
      S._x_pendingModelUpdates || (S._x_pendingModelUpdates = []), S._x_pendingModelUpdates.push(P), a(() => {
        S._x_pendingModelUpdates && S._x_pendingModelUpdates.splice(S._x_pendingModelUpdates.indexOf(P), 1);
      });
    }
    f && g.push(tt(e, "keydown", t, (S) => {
      S.key === "Enter" && v(S);
    })), M = () => g.forEach((S) => S());
  } else {
    let g = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    M = tt(e, g, t, (v) => {
      d(Gt(e, t, v, l()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || en(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && d(
    Gt(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = M, a(() => e._x_removeModelListeners.default()), e.form) {
    let g = tt(e.form, "reset", [], (v) => {
      ks(() => e._x_model && e._x_model.set(Gt(e, t, { target: e }, l())));
    });
    a(() => g());
  }
  if (e._x_model = {
    get() {
      return l();
    },
    set(g) {
      d(g);
    },
    setWithModifiers: Qi(t, d)
  }, e._x_forceModelUpdate = (g) => {
    g === void 0 && typeof n == "string" && n.match(/\./) && (g = ""), B(() => {
      en(e) ? Array.isArray(g) ? e.checked = g.some((v) => v == e.value) : e.checked = !!g : Os(e) ? typeof g == "boolean" ? e.checked = Vt(e.value) === g : e.checked = e.value == g : ki(e, "value", g);
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
    if (en(e))
      if (Array.isArray(s)) {
        let a = null;
        return t.includes("number") ? a = Ln(n.target.value) : t.includes("boolean") ? a = Vt(n.target.value) : a = n.target.value, n.target.checked ? s.includes(a) ? s : s.concat([a]) : s.filter((i) => !Ac(i, a));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((a) => {
          let i = a.value || a.text;
          return Ln(i);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((a) => {
          let i = a.value || a.text;
          return Vt(i);
        }) : Array.from(n.target.selectedOptions).map((a) => a.value || a.text);
      {
        let a;
        return Os(e) ? n.target.checked ? a = n.target.value : a = s : a = n.target.value, t.includes("number") ? Ln(a) : t.includes("boolean") ? Vt(a) : t.includes("trim") ? a.trim() : a;
      }
    }
  });
}
function Ln(e) {
  let t = e ? parseFloat(e) : null;
  return Oc(t) ? t : e;
}
function Ac(e, t) {
  return e == t;
}
function Oc(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function ya(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
F("cloak", (e) => queueMicrotask(() => B(() => e.removeAttribute(rt("cloak")))));
yi(() => `[${rt("init")}]`);
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
_s(li(":", ci(rt("bind:"))));
var tr = (e, { value: t, modifiers: n, expression: s, original: a }, { effect: i, cleanup: r }) => {
  if (!t) {
    let l = {};
    Ml(l), Z(e, s)((u) => {
      Ni(e, u, a);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return Tc(e, s);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = Z(e, s);
  i(() => o((l) => {
    l === void 0 && typeof s == "string" && s.match(/\./) && (l = ""), B(() => ki(e, t, l, n));
  })), r(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
tr.inline = (e, { value: t, modifiers: n, expression: s }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: s, extract: !1 });
};
F("bind", tr);
function Tc(e, t) {
  e._x_keyExpression = t;
}
mi(() => `[${rt("data")}]`);
var Me = /* @__PURE__ */ Symbol();
F("data", (e, { expression: t }, { cleanup: n }) => {
  if (Cc(e))
    return;
  let s = e[Me];
  if (s?.expression === t)
    return;
  t = t === "" ? "{}" : t;
  let a = {};
  Yt(a, e);
  let i = {};
  Nl(i, a);
  let r = Le(e, t, { scope: i });
  (r === void 0 || r === !0) && (r = {}), Yt(r, e);
  let o;
  if (s?.reactiveData) {
    o = s.reactiveData, Mc(o, r);
    let d = { expression: t };
    e[Me] = d, queueMicrotask(() => {
      e[Me] === d && delete e[Me];
    });
  } else
    o = at(r);
  ms(o, n);
  let l = Mt(e, o);
  o.init && Le(e, o.init), n(() => {
    o.destroy && Le(e, o.destroy), l();
    let d = { reactiveData: o };
    e[Me] = d, queueMicrotask(() => {
      e[Me] === d && delete e[Me];
    });
  });
});
function Mc(e, t) {
  Object.keys(t).forEach((n) => {
    let s = Object.getOwnPropertyDescriptor(t, n), a = Object.getOwnPropertyDescriptor(e, n);
    s.get || s.set || a?.get || a?.set ? (a && delete e[n], a || (e[n] = void 0), s.get || s.set ? Object.defineProperty(e, n, s) : e[n] = t[n]) : e[n] = t[n];
  }), Object.keys(e).filter((n) => !Object.prototype.hasOwnProperty.call(t, n)).forEach((n) => delete e[n]);
}
un((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Cc(e) {
  return Ee ? Qn ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
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
  }, o = () => setTimeout(r), l = Zn(
    (p) => p ? r() : i(),
    (p) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, p, r, i) : p ? o() : i();
    }
  ), d, u = !0;
  s(() => a((p) => {
    !u && p === d || (t.includes("immediate") && (p ? o() : i()), l(p), d = p, u = !1);
  }));
});
F("for", ke((e, { expression: t }, { effect: n, cleanup: s }) => {
  let a = $c(t), i = Z(e, a.items), r = Z(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_lookup = /* @__PURE__ */ new Map(), n(() => Rc(e, a, i, r), { priority: "structural" }), s(() => {
    e._x_lookup.forEach(
      (o) => B(() => {
        ze(o), o.remove();
      })
    ), delete e._x_lookup, delete e._x_lastRenderedEl;
  });
}));
function Nc(e) {
  return (t) => {
    Object.entries(t).forEach(([n, s]) => {
      e[n] = s;
    });
  };
}
function Rc(e, t, n, s) {
  n((a) => {
    Pc(a) && (a = Array.from({ length: a }, (d, u) => u + 1)), a == null && (a = []), a instanceof Set && (a = Array.from(a)), a instanceof Map && (a = Array.from(a));
    let i = e._x_lookup, r = /* @__PURE__ */ new Map();
    e._x_lookup = r;
    let o = Ic(a), l = Object.entries(a).map(([d, u]) => {
      o || (d = parseInt(d));
      let p = Lc(t, u, d, a), f;
      return s((k) => {
        typeof k == "object" && ce("x-for key cannot be an object, it must be a string or an integer", e), i.has(k) && (r.set(k, i.get(k)), i.delete(k)), f = k;
      }, { scope: { index: d, ...p } }), [f, p];
    });
    B(() => {
      i.forEach((p) => {
        ze(p), p.remove();
      });
      let d = /* @__PURE__ */ new Set(), u = e;
      l.forEach(([p, f]) => {
        if (r.has(p)) {
          let g = r.get(p);
          g._x_refreshXForScope(f), u.nextElementSibling !== g && (u.nextElementSibling && g.replaceWith(u.nextElementSibling), u.after(g)), u = g, g._x_currentIfEl && (g.nextElementSibling !== g._x_currentIfEl && u.after(g._x_currentIfEl), u = g._x_currentIfEl);
          return;
        }
        e.content.children.length > 1 && ce("x-for templates require a single root element, additional elements will be ignored.", e);
        let k = document.importNode(e.content, !0).firstElementChild, M = at(f);
        Mt(k, M, e), k._x_refreshXForScope = Nc(M), r.set(p, k), d.add(k), u.after(k), u = k;
      }), d.forEach((p) => ge(p)), u !== e ? e._x_lastRenderedEl = u : delete e._x_lastRenderedEl;
    });
  });
}
function $c(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, s = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, a = e.match(s);
  if (!a)
    return;
  let i = {};
  i.items = a[2].trim();
  let r = a[1].replace(n, "").trim(), o = r.match(t);
  return o ? (i.item = r.replace(t, "").trim(), i.index = o[1].trim(), o[2] && (i.collection = o[2].trim())) : i.item = r, i;
}
function Lc(e, t, n, s) {
  let a = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((r) => r.trim()).forEach((r, o) => {
    a[r] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((r) => r.trim()).forEach((r) => {
    a[r] = t[r];
  }) : a[e.item] = t, e.index && (a[e.index] = n), e.collection && (a[e.collection] = s), a;
}
function Pc(e) {
  return typeof e != "object" && !isNaN(e);
}
function Ic(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function nr() {
}
nr.inline = (e, { expression: t }, { cleanup: n }) => {
  let s = cn(e);
  s && (s._x_refs || (s._x_refs = {}), s._x_refs[t] = e, n(() => delete s._x_refs[t]));
};
F("ref", nr);
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
  n(t).forEach((a) => yc(e, a));
});
un((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
_s(li("@", ci(rt("on:"))));
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
pn("Collapse", "collapse", "collapse");
pn("Intersect", "intersect", "intersect");
pn("Focus", "trap", "focus");
pn("Mask", "mask", "mask");
function pn(e, t, n) {
  F(t, (s) => ce(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, s));
}
F("html", (e, { expression: t }) => {
  ys(new Error("Using the x-html directive is prohibited in the CSP build"), e);
});
ot.setEvaluator(Dl);
ot.setRawEvaluator(Il);
ot.setReactivityEngine({
  reactive: $s,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (e, t = {}) => {
    let n;
    return n = Vl(e, {
      scheduler: () => {
        n && (t.scheduler ? t.scheduler(n) : n());
      }
    }), n;
  },
  release: Jl,
  raw: L
});
var Dc = ot, _t = Dc;
function qc(e) {
  const t = window.__siteationDebugBar;
  return t ? (t.onRequest = e, t.requests.slice()) : [];
}
const sn = "__siteationDebugBarHostLock";
function jc(e) {
  if (!e || window[sn]) return;
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
  window[sn] = s;
}
function Uc() {
  const e = window[sn];
  e && (e.inert.forEach(([t, n]) => {
    t.inert = n;
  }), document.body.style.overflow = e.overflow, document.body.style.paddingRight = e.paddingRight, delete window[sn]);
}
function va(e, t) {
  if (e.key !== "Tab" || !t) return;
  const n = Array.from(t.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((r) => r.offsetParent !== null);
  if (n.length === 0) return;
  const s = n[0], a = n[n.length - 1], i = t.getRootNode().activeElement;
  e.shiftKey && i === s ? (e.preventDefault(), a.focus()) : !e.shiftKey && i === a && (e.preventDefault(), s.focus());
}
const et = 12;
function Bc(e) {
  return !!(e && typeof e == "object" && Number.isFinite(e.left) && Number.isFinite(e.top));
}
function Pn(e, t, n) {
  const s = Math.max(et, n.width - t.width - et), a = Math.max(et, n.height - t.height - et);
  return {
    left: Math.min(Math.max(e.left, et), s),
    top: Math.min(Math.max(e.top, et), a)
  };
}
function Fc(e, t, n) {
  return e.top + t.height / 2 < n / 2 ? "top" : "bottom";
}
const Hc = 3;
function Gc(e, t) {
  return Math.hypot(e, t) >= Hc;
}
function Wc(e) {
  const t = String(e || "").split(",").map((n) => n.trim()).filter(Boolean);
  return t.length === 0 ? an : an.filter((n) => zc.includes(n.id) || t.includes(n.id));
}
const zc = ["findings", "overview"], an = [
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
    id: "history",
    label: "History",
    lead: "Every request still on disk, so an earlier one is one click away.",
    graded: !1
  }
];
function sr(e, t) {
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
    case "history":
      return t.history.length || null;
    default:
      return null;
  }
}
const Kc = {
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
    aria-hidden="true">${Kc[e] || ""}</svg>`;
}
function Vc(e) {
  return [...Jc(e), ...Xc(e), ...Zc(e)];
}
function Jc(e) {
  return an.map((t) => {
    const n = sr(t.id, e);
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
function Xc(e) {
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
function Zc(e) {
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
function Yc(e, t) {
  const n = String(t || "").trim().toLowerCase(), s = n ? e.filter((a) => `${a.group} ${a.label} ${a.keywords}`.toLowerCase().includes(n)) : e;
  return s.map((a, i) => ({
    ...a,
    leads: i === 0 || s[i - 1].group !== a.group
  }));
}
function Qc() {
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
const st = "full", ar = "masked", te = "none", ed = "[redacted]", td = "[masked]", nd = "[maximum depth reached]", sd = "[circular]", ad = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, id = 5, Jt = 100, wa = 400;
function rd(e) {
  return [st, ar, te].includes(e) ? e : st;
}
function od(e) {
  return ad.test(String(e));
}
function hn(e, t = st) {
  if (t !== te)
    return Ls(e, t, 0, /* @__PURE__ */ new WeakSet());
}
function rn(e, t = st) {
  return t === te ? "" : t === ar ? e === "" ? "" : td : e.length <= wa ? e : `${e.slice(0, wa)}...`;
}
function ir(e, t = st) {
  if (t === te) return "";
  const n = e.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return rn(n, st);
}
function Ls(e, t, n, s) {
  if (e == null) return e;
  const a = typeof e;
  return a === "string" ? rn(e, t) : a === "number" || a === "boolean" ? e : a === "function" ? `ƒ ${e.name || "anonymous"}()` : a === "symbol" ? e.toString() : a === "bigint" ? `${e}n` : a !== "object" ? a : e instanceof Node ? dd(e) : e instanceof Date ? e.toISOString() : e instanceof Error ? `${e.name}: ${rn(e.message, t)}` : e instanceof Map ? `Map(${e.size})` : e instanceof Set ? `Set(${e.size})` : n >= id ? nd : s.has(e) ? sd : (s.add(e), Array.isArray(e) ? ld(e, t, n, s) : cd(e, t, n, s));
}
function ld(e, t, n, s) {
  const a = e.slice(0, Jt).map((i) => Ls(i, t, n + 1, s));
  return e.length > Jt && a.push(`[${e.length - Jt} more]`), a;
}
function cd(e, t, n, s) {
  const a = fn(e), i = /* @__PURE__ */ Object.create(null);
  let r = 0;
  for (const o of a) {
    if (r >= Jt) {
      i.__truncated__ = a.length - r;
      break;
    }
    if (od(o)) {
      i[o] = ed, r++;
      continue;
    }
    try {
      i[o] = Ls(e[o], t, n + 1, s);
    } catch (l) {
      i[o] = `[unreadable: ${l && l.message ? l.message : "threw"}]`;
    }
    r++;
  }
  return i;
}
function fn(e) {
  try {
    const t = Object.keys(e);
    return t.length > 0 ? t : Reflect.ownKeys(e).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function dd(e) {
  if (!(e instanceof Element)) return `<${e.nodeName.toLowerCase()}>`;
  const t = e.id ? `#${e.id}` : "", n = typeof e.className == "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${e.tagName.toLowerCase()}${t}${n}>`;
}
function ud(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var In, _a;
function pd() {
  if (_a) return In;
  _a = 1;
  function e(c) {
    return c instanceof Map ? c.clear = c.delete = c.set = function() {
      throw new Error("map is read-only");
    } : c instanceof Set && (c.add = c.clear = c.delete = function() {
      throw new Error("set is read-only");
    }), Object.freeze(c), Object.getOwnPropertyNames(c).forEach((h) => {
      const m = c[h], O = typeof m;
      (O === "object" || O === "function") && !Object.isFrozen(m) && e(m);
    }), c;
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
  function n(c) {
    return c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }
  function s(c, ...h) {
    const m = /* @__PURE__ */ Object.create(null);
    for (const O in c)
      m[O] = c[O];
    return h.forEach(function(O) {
      for (const j in O)
        m[j] = O[j];
    }), /** @type {T} */
    m;
  }
  const a = "</span>", i = (c) => !!c.scope, r = (c, { prefix: h }) => {
    if (c.startsWith("language:"))
      return c.replace("language:", "language-");
    if (c.includes(".")) {
      const m = c.split(".");
      return [
        `${h}${m.shift()}`,
        ...m.map((O, j) => `${O}${"_".repeat(j + 1)}`)
      ].join(" ");
    }
    return `${h}${c}`;
  };
  class o {
    /**
     * Creates a new HTMLRenderer
     *
     * @param {Tree} parseTree - the parse tree (must support `walk` API)
     * @param {{classPrefix: string}} options
     */
    constructor(h, m) {
      this.buffer = "", this.classPrefix = m.classPrefix, h.walk(this);
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
      const m = r(
        h.scope,
        { prefix: this.classPrefix }
      );
      this.span(m);
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
  const l = (c = {}) => {
    const h = { children: [] };
    return Object.assign(h, c), h;
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
    add(h) {
      this.top.children.push(h);
    }
    /** @param {string} scope */
    openNode(h) {
      const m = l({ scope: h });
      this.add(m), this.stack.push(m);
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
    static _walk(h, m) {
      return typeof m == "string" ? h.addText(m) : m.children && (h.openNode(m), m.children.forEach((O) => this._walk(h, O)), h.closeNode(m)), h;
    }
    /**
     * @param {Node} node
     */
    static _collapse(h) {
      typeof h != "string" && h.children && (h.children.every((m) => typeof m == "string") ? h.children = [h.children.join("")] : h.children.forEach((m) => {
        d._collapse(m);
      }));
    }
  }
  class u extends d {
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
    __addSublanguage(h, m) {
      const O = h.root;
      m && (O.scope = `language:${m}`), this.add(O);
    }
    toHTML() {
      return new o(this, this.options).value();
    }
    finalize() {
      return this.closeAllNodes(), !0;
    }
  }
  function p(c) {
    return c ? typeof c == "string" ? c : c.source : null;
  }
  function f(c) {
    return g("(?=", c, ")");
  }
  function k(c) {
    return g("(?:", c, ")*");
  }
  function M(c) {
    return g("(?:", c, ")?");
  }
  function g(...c) {
    return c.map((m) => p(m)).join("");
  }
  function v(c) {
    const h = c[c.length - 1];
    return typeof h == "object" && h.constructor === Object ? (c.splice(c.length - 1, 1), h) : {};
  }
  function S(...c) {
    return "(" + (v(c).capture ? "" : "?:") + c.map((O) => p(O)).join("|") + ")";
  }
  function P(c) {
    return new RegExp(c.toString() + "|").exec("").length - 1;
  }
  function Ke(c, h) {
    const m = c && c.exec(h);
    return m && m.index === 0;
  }
  const Ve = new RegExp(S(
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
  function X(c, { joinWith: h }) {
    let m = 0;
    return c.map((O) => {
      m += 1;
      const j = m;
      let U = p(O), _ = "";
      for (; U.length > 0; ) {
        const w = Ve.exec(U);
        if (!w) {
          _ += U;
          break;
        }
        _ += U.substring(0, w.index), U = U.substring(w.index + w[0].length), w[0][0] === "\\" && w[1] ? _ += "\\" + String(Number(w[1]) + j) : (_ += w[0], (w[0] === "(" || /^\(\?[<']/.test(w[0])) && m++);
      }
      return _;
    }).map((O) => `(${O})`).join(h);
  }
  const Q = /\b\B/, Je = "[a-zA-Z]\\w*", ye = "[a-zA-Z_]\\w*", ne = "\\b\\d+(\\.\\d+)?", Nt = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", Rt = "\\b(0b[01]+)", mn = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", yn = (c = {}) => {
    const h = /^#![ ]*\//;
    return c.binary && (c.begin = g(
      h,
      /.*\b/,
      c.binary,
      /\b.*/
    )), s({
      scope: "meta",
      begin: h,
      end: /$/,
      relevance: 0,
      /** @type {ModeCallback} */
      "on:begin": (m, O) => {
        m.index !== 0 && O.ignoreMatch();
      }
    }, c);
  }, Se = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, vn = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [Se]
  }, $t = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [Se]
  }, wn = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, K = function(c, h, m = {}) {
    const O = s(
      {
        scope: "comment",
        begin: c,
        end: h,
        contains: []
      },
      m
    );
    O.contains.push({
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
    return O.contains.push(
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
    ), O;
  }, ve = K("//", "$"), Ae = K("/\\*", "\\*/"), Xe = K("#", "$"), lt = {
    scope: "number",
    begin: ne,
    relevance: 0
  }, Lt = {
    scope: "number",
    begin: Nt,
    relevance: 0
  }, Er = {
    scope: "number",
    begin: Rt,
    relevance: 0
  }, kr = {
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
  }, Sr = {
    scope: "title",
    begin: Je,
    relevance: 0
  }, Ar = {
    scope: "title",
    begin: ye,
    relevance: 0
  }, Or = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + ye,
    relevance: 0
  };
  var Pt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: vn,
    BACKSLASH_ESCAPE: Se,
    BINARY_NUMBER_MODE: Er,
    BINARY_NUMBER_RE: Rt,
    COMMENT: K,
    C_BLOCK_COMMENT_MODE: Ae,
    C_LINE_COMMENT_MODE: ve,
    C_NUMBER_MODE: Lt,
    C_NUMBER_RE: Nt,
    END_SAME_AS_BEGIN: function(c) {
      return Object.assign(
        c,
        {
          /** @type {ModeCallback} */
          "on:begin": (h, m) => {
            m.data._beginMatch = h[1];
          },
          /** @type {ModeCallback} */
          "on:end": (h, m) => {
            m.data._beginMatch !== h[1] && m.ignoreMatch();
          }
        }
      );
    },
    HASH_COMMENT_MODE: Xe,
    IDENT_RE: Je,
    MATCH_NOTHING_RE: Q,
    METHOD_GUARD: Or,
    NUMBER_MODE: lt,
    NUMBER_RE: ne,
    PHRASAL_WORDS_MODE: wn,
    QUOTE_STRING_MODE: $t,
    REGEXP_MODE: kr,
    RE_STARTERS_RE: mn,
    SHEBANG: yn,
    TITLE_MODE: Sr,
    UNDERSCORE_IDENT_RE: ye,
    UNDERSCORE_TITLE_MODE: Ar
  });
  function Tr(c, h) {
    c.input[c.index - 1] === "." && h.ignoreMatch();
  }
  function Mr(c, h) {
    c.className !== void 0 && (c.scope = c.className, delete c.className);
  }
  function Cr(c, h) {
    h && c.beginKeywords && (c.begin = "\\b(" + c.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", c.__beforeBegin = Tr, c.keywords = c.keywords || c.beginKeywords, delete c.beginKeywords, c.relevance === void 0 && (c.relevance = 0));
  }
  function Nr(c, h) {
    Array.isArray(c.illegal) && (c.illegal = S(...c.illegal));
  }
  function Rr(c, h) {
    if (c.match) {
      if (c.begin || c.end) throw new Error("begin & end are not supported with match");
      c.begin = c.match, delete c.match;
    }
  }
  function $r(c, h) {
    c.relevance === void 0 && (c.relevance = 1);
  }
  const Lr = (c, h) => {
    if (!c.beforeMatch) return;
    if (c.starts) throw new Error("beforeMatch cannot be used with starts");
    const m = Object.assign({}, c);
    Object.keys(c).forEach((O) => {
      delete c[O];
    }), c.keywords = m.keywords, c.begin = g(m.beforeMatch, f(m.begin)), c.starts = {
      relevance: 0,
      contains: [
        Object.assign(m, { endsParent: !0 })
      ]
    }, c.relevance = 0, delete m.beforeMatch;
  }, Pr = [
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
  ], Ir = "keyword";
  function Gs(c, h, m = Ir) {
    const O = /* @__PURE__ */ Object.create(null);
    return typeof c == "string" ? j(m, c.split(" ")) : Array.isArray(c) ? j(m, c) : Object.keys(c).forEach(function(U) {
      Object.assign(
        O,
        Gs(c[U], h, U)
      );
    }), O;
    function j(U, _) {
      h && (_ = _.map((w) => w.toLowerCase())), _.forEach(function(w) {
        const A = w.split("|");
        O[A[0]] = [U, Dr(A[0], A[1])];
      });
    }
  }
  function Dr(c, h) {
    return h ? Number(h) : qr(c) ? 0 : 1;
  }
  function qr(c) {
    return Pr.includes(c.toLowerCase());
  }
  const Ws = {}, Oe = (c) => {
    console.error(c);
  }, zs = (c, ...h) => {
    console.log(`WARN: ${c}`, ...h);
  }, Ze = (c, h) => {
    Ws[`${c}/${h}`] || (console.log(`Deprecated as of ${c}. ${h}`), Ws[`${c}/${h}`] = !0);
  }, It = new Error();
  function Ks(c, h, { key: m }) {
    let O = 0;
    const j = c[m], U = {}, _ = {};
    for (let w = 1; w <= h.length; w++)
      _[w + O] = j[w], U[w + O] = !0, O += P(h[w - 1]);
    c[m] = _, c[m]._emit = U, c[m]._multi = !0;
  }
  function jr(c) {
    if (Array.isArray(c.begin)) {
      if (c.skip || c.excludeBegin || c.returnBegin)
        throw Oe("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), It;
      if (typeof c.beginScope != "object" || c.beginScope === null)
        throw Oe("beginScope must be object"), It;
      Ks(c, c.begin, { key: "beginScope" }), c.begin = X(c.begin, { joinWith: "" });
    }
  }
  function Ur(c) {
    if (Array.isArray(c.end)) {
      if (c.skip || c.excludeEnd || c.returnEnd)
        throw Oe("skip, excludeEnd, returnEnd not compatible with endScope: {}"), It;
      if (typeof c.endScope != "object" || c.endScope === null)
        throw Oe("endScope must be object"), It;
      Ks(c, c.end, { key: "endScope" }), c.end = X(c.end, { joinWith: "" });
    }
  }
  function Br(c) {
    c.scope && typeof c.scope == "object" && c.scope !== null && (c.beginScope = c.scope, delete c.scope);
  }
  function Fr(c) {
    Br(c), typeof c.beginScope == "string" && (c.beginScope = { _wrap: c.beginScope }), typeof c.endScope == "string" && (c.endScope = { _wrap: c.endScope }), jr(c), Ur(c);
  }
  function Hr(c) {
    function h(_, w) {
      return new RegExp(
        p(_),
        "m" + (c.case_insensitive ? "i" : "") + (c.unicodeRegex ? "u" : "") + (w ? "g" : "")
      );
    }
    class m {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(w, A) {
        A.position = this.position++, this.matchIndexes[this.matchAt] = A, this.regexes.push([A, w]), this.matchAt += P(w) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const w = this.regexes.map((A) => A[1]);
        this.matcherRe = h(X(w, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(w) {
        this.matcherRe.lastIndex = this.lastIndex;
        const A = this.matcherRe.exec(w);
        if (!A)
          return null;
        const z = A.findIndex((ct, xn) => xn > 0 && ct !== void 0), H = this.matchIndexes[z];
        return A.splice(0, z), Object.assign(A, H);
      }
    }
    class O {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(w) {
        if (this.multiRegexes[w]) return this.multiRegexes[w];
        const A = new m();
        return this.rules.slice(w).forEach(([z, H]) => A.addRule(z, H)), A.compile(), this.multiRegexes[w] = A, A;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(w, A) {
        this.rules.push([w, A]), A.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(w) {
        const A = this.getMatcher(this.regexIndex);
        A.lastIndex = this.lastIndex;
        let z = A.exec(w);
        if (this.resumingScanAtSamePosition() && !(z && z.index === this.lastIndex)) {
          const H = this.getMatcher(0);
          H.lastIndex = this.lastIndex + 1, z = H.exec(w);
        }
        return z && (this.regexIndex += z.position + 1, this.regexIndex === this.count && this.considerAll()), z;
      }
    }
    function j(_) {
      const w = new O();
      return _.contains.forEach((A) => w.addRule(A.begin, { rule: A, type: "begin" })), _.terminatorEnd && w.addRule(_.terminatorEnd, { type: "end" }), _.illegal && w.addRule(_.illegal, { type: "illegal" }), w;
    }
    function U(_, w) {
      const A = (
        /** @type CompiledMode */
        _
      );
      if (_.isCompiled) return A;
      [
        Mr,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Rr,
        Fr,
        Lr
      ].forEach((H) => H(_, w)), c.compilerExtensions.forEach((H) => H(_, w)), _.__beforeBegin = null, [
        Cr,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        Nr,
        // default to 1 relevance if not specified
        $r
      ].forEach((H) => H(_, w)), _.isCompiled = !0;
      let z = null;
      return typeof _.keywords == "object" && _.keywords.$pattern && (_.keywords = Object.assign({}, _.keywords), z = _.keywords.$pattern, delete _.keywords.$pattern), z = z || /\w+/, _.keywords && (_.keywords = Gs(_.keywords, c.case_insensitive)), A.keywordPatternRe = h(z, !0), w && (_.begin || (_.begin = /\B|\b/), A.beginRe = h(A.begin), !_.end && !_.endsWithParent && (_.end = /\B|\b/), _.end && (A.endRe = h(A.end)), A.terminatorEnd = p(A.end) || "", _.endsWithParent && w.terminatorEnd && (A.terminatorEnd += (_.end ? "|" : "") + w.terminatorEnd)), _.illegal && (A.illegalRe = h(
        /** @type {RegExp | string} */
        _.illegal
      )), _.contains || (_.contains = []), _.contains = [].concat(..._.contains.map(function(H) {
        return Gr(H === "self" ? _ : H);
      })), _.contains.forEach(function(H) {
        U(
          /** @type Mode */
          H,
          A
        );
      }), _.starts && U(_.starts, w), A.matcher = j(A), A;
    }
    if (c.compilerExtensions || (c.compilerExtensions = []), c.contains && c.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return c.classNameAliases = s(c.classNameAliases || {}), U(
      /** @type Mode */
      c
    );
  }
  function Vs(c) {
    return c ? c.endsWithParent || Vs(c.starts) : !1;
  }
  function Gr(c) {
    return c.variants && !c.cachedVariants && (c.cachedVariants = c.variants.map(function(h) {
      return s(c, { variants: null }, h);
    })), c.cachedVariants ? c.cachedVariants : Vs(c) ? s(c, { starts: c.starts ? s(c.starts) : null }) : Object.isFrozen(c) ? s(c) : c;
  }
  var Wr = "11.12.0";
  class zr extends Error {
    constructor(h, m) {
      super(h), this.name = "HTMLInjectionError", this.html = m;
    }
  }
  const _n = n, Js = s, Xs = /* @__PURE__ */ Symbol("nomatch"), Kr = 7, Zs = function(c) {
    const h = /* @__PURE__ */ Object.create(null), m = /* @__PURE__ */ Object.create(null), O = [];
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
    function A(b) {
      return w.noHighlightRe.test(b);
    }
    function z(b) {
      let E = b.className + " ";
      E += b.parentNode ? b.parentNode.className : "";
      const N = w.languageDetectRe.exec(E);
      if (N) {
        const I = we(N[1]);
        return I || (zs(U.replace("{}", N[1])), zs("Falling back to no-highlight mode for this block.", b)), I ? N[1] : "no-highlight";
      }
      return E.split(/\s+/).find((I) => A(I) || we(I));
    }
    function H(b, E, N) {
      let I = "", G = "";
      typeof E == "object" ? (I = b, N = E.ignoreIllegals, G = E.language) : (Ze("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ze("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), G = b, I = E), N === void 0 && (N = !0);
      const se = {
        code: I,
        language: G
      };
      qt("before:highlight", se);
      const _e = se.result ? se.result : ct(se.language, se.code, N);
      return _e.code = se.code, qt("after:highlight", _e), _e;
    }
    function ct(b, E, N, I) {
      const G = /* @__PURE__ */ Object.create(null);
      function se(y, x) {
        return y.keywords[x];
      }
      function _e() {
        if (!T.keywords) {
          V.addText(D);
          return;
        }
        let y = 0;
        T.keywordPatternRe.lastIndex = 0;
        let x = T.keywordPatternRe.exec(D), C = "";
        for (; x; ) {
          C += D.substring(y, x.index);
          const R = oe.case_insensitive ? x[0].toLowerCase() : x[0], J = se(T, R);
          if (J) {
            const [de, uo] = J;
            if (V.addText(C), C = "", G[R] = (G[R] || 0) + 1, G[R] <= Kr && (Bt += uo), de.startsWith("_"))
              C += x[0];
            else {
              const po = oe.classNameAliases[de] || de;
              re(x[0], po);
            }
          } else
            C += x[0];
          y = T.keywordPatternRe.lastIndex, x = T.keywordPatternRe.exec(D);
        }
        C += D.substring(y), V.addText(C);
      }
      function jt() {
        if (D === "") return;
        let y = null;
        if (typeof T.subLanguage == "string") {
          if (!h[T.subLanguage]) {
            V.addText(D);
            return;
          }
          y = ct(T.subLanguage, D, !0, ia[T.subLanguage]), ia[T.subLanguage] = /** @type {CompiledMode} */
          y._top;
        } else
          y = En(D, T.subLanguage.length ? T.subLanguage : null);
        T.relevance > 0 && (Bt += y.relevance), V.__addSublanguage(y._emitter, y.language);
      }
      function ee() {
        T.subLanguage != null ? jt() : _e(), D = "";
      }
      function re(y, x) {
        y !== "" && (V.startScope(x), V.addText(y), V.endScope());
      }
      function ta(y, x) {
        let C = 1;
        const R = x.length - 1;
        for (; C <= R; ) {
          if (!y._emit[C]) {
            C++;
            continue;
          }
          const J = oe.classNameAliases[y[C]] || y[C], de = x[C];
          J ? re(de, J) : (D = de, _e(), D = ""), C++;
        }
      }
      function na(y, x) {
        return y.scope && typeof y.scope == "string" && V.openNode(oe.classNameAliases[y.scope] || y.scope), y.beginScope && (y.beginScope._wrap ? (re(D, oe.classNameAliases[y.beginScope._wrap] || y.beginScope._wrap), D = "") : y.beginScope._multi && (ta(y.beginScope, x), D = "")), T = Object.create(y, { parent: { value: T } }), T;
      }
      function sa(y, x, C) {
        let R = Ke(y.endRe, C);
        if (R) {
          if (y["on:end"]) {
            const J = new t(y);
            y["on:end"](x, J), J.isMatchIgnored && (R = !1);
          }
          if (R) {
            for (; y.endsParent && y.parent; )
              y = y.parent;
            return y;
          }
        }
        if (y.endsWithParent)
          return sa(y.parent, x, C);
      }
      function io(y) {
        return T.matcher.regexIndex === 0 ? (D += y[0], 1) : (On = !0, 0);
      }
      function ro(y) {
        const x = y[0], C = y.rule, R = new t(C), J = [C.__beforeBegin, C["on:begin"]];
        for (const de of J)
          if (de && (de(y, R), R.isMatchIgnored))
            return io(x);
        return C.skip ? D += x : (C.excludeBegin && (D += x), ee(), !C.returnBegin && !C.excludeBegin && (D = x)), na(C, y), C.returnBegin ? 0 : x.length;
      }
      function oo(y) {
        const x = y[0], C = E.substring(y.index), R = sa(T, y, C);
        if (!R)
          return Xs;
        const J = T;
        T.endScope && T.endScope._wrap ? (ee(), re(x, T.endScope._wrap)) : T.endScope && T.endScope._multi ? (ee(), ta(T.endScope, y)) : J.skip ? D += x : (J.returnEnd || J.excludeEnd || (D += x), ee(), J.excludeEnd && (D = x));
        do
          T.scope && V.closeNode(), !T.skip && !T.subLanguage && (Bt += T.relevance), T = T.parent;
        while (T !== R.parent);
        return R.starts && na(R.starts, y), J.returnEnd ? 0 : x.length;
      }
      function lo() {
        const y = [];
        for (let x = T; x !== oe; x = x.parent)
          x.scope && y.unshift(x.scope);
        y.forEach((x) => V.openNode(x));
      }
      let Ut = {};
      function aa(y, x) {
        const C = x && x[0];
        if (D += y, C == null)
          return ee(), 0;
        if (Ut.type === "begin" && x.type === "end" && Ut.index === x.index && C === "") {
          if (D += E.slice(x.index, x.index + 1), !j) {
            const R = new Error(`0 width match regex (${b})`);
            throw R.languageName = b, R.badRule = Ut.rule, R;
          }
          return 1;
        }
        if (Ut = x, x.type === "begin")
          return ro(x);
        if (x.type === "illegal" && !N) {
          const R = new Error('Illegal lexeme "' + C + '" for mode "' + (T.scope || "<unnamed>") + '"');
          throw R.mode = T, R;
        } else if (x.type === "end") {
          const R = oo(x);
          if (R !== Xs)
            return R;
        }
        if (x.type === "illegal" && C === "")
          return x.index === E.length || (D += `
`), 1;
        if (An > 1e5 && An > x.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return D += C, C.length;
      }
      const oe = we(b);
      if (!oe)
        throw Oe(U.replace("{}", b)), new Error('Unknown language: "' + b + '"');
      const co = Hr(oe);
      let Sn = "", T = I || co;
      const ia = {}, V = new w.__emitter(w);
      lo();
      let D = "", Bt = 0, Te = 0, An = 0, On = !1;
      try {
        if (oe.__emitTokens)
          oe.__emitTokens(E, V);
        else {
          for (T.matcher.considerAll(); ; ) {
            An++, On ? On = !1 : T.matcher.considerAll(), T.matcher.lastIndex = Te;
            const y = T.matcher.exec(E);
            if (!y) break;
            const x = E.substring(Te, y.index), C = aa(x, y);
            Te = y.index + C;
          }
          aa(E.substring(Te));
        }
        return V.finalize(), Sn = V.toHTML(), {
          language: b,
          value: Sn,
          relevance: Bt,
          illegal: !1,
          _emitter: V,
          _top: T
        };
      } catch (y) {
        if (y.message && y.message.includes("Illegal"))
          return {
            language: b,
            value: _n(E),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: y.message,
              index: Te,
              context: E.slice(Te - 100, Te + 100),
              mode: y.mode,
              resultSoFar: Sn
            },
            _emitter: V
          };
        if (j)
          return {
            language: b,
            value: _n(E),
            illegal: !1,
            relevance: 0,
            errorRaised: y,
            _emitter: V,
            _top: T
          };
        throw y;
      }
    }
    function xn(b) {
      const E = {
        value: _n(b),
        illegal: !1,
        relevance: 0,
        _top: _,
        _emitter: new w.__emitter(w)
      };
      return E._emitter.addText(b), E;
    }
    function En(b, E) {
      E = E || w.languages || Object.keys(h);
      const N = xn(b), I = E.filter(we).filter(ea).map(
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
    function Vr(b, E, N) {
      const I = E && m[E] || N;
      b.classList.add("hljs"), b.classList.add(`language-${I}`);
    }
    function kn(b) {
      let E = null;
      const N = z(b);
      if (A(N)) return;
      if (qt(
        "before:highlightElement",
        { el: b, language: N }
      ), b.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", b);
        return;
      }
      if (b.children.length > 0 && (w.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(b)), w.throwUnescapedHTML))
        throw new zr(
          "One of your code blocks includes unescaped HTML.",
          b.innerHTML
        );
      E = b;
      const I = E.textContent, G = N ? H(I, { language: N, ignoreIllegals: !0 }) : En(I);
      b.innerHTML = G.value, b.dataset.highlighted = "yes", Vr(b, N, G.language), b.result = {
        language: G.language,
        // TODO: remove with version 11.0
        re: G.relevance,
        relevance: G.relevance
      }, G.secondBest && (b.secondBest = {
        language: G.secondBest.language,
        relevance: G.secondBest.relevance
      }), qt("after:highlightElement", { el: b, result: G, text: I });
    }
    function Jr(b) {
      w = Js(w, b);
    }
    const Xr = () => {
      Dt(), Ze("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function Zr() {
      Dt(), Ze("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let Ys = !1;
    function Dt() {
      function b() {
        Dt();
      }
      if (document.readyState === "loading") {
        Ys || window.addEventListener("DOMContentLoaded", b, !1), Ys = !0;
        return;
      }
      document.querySelectorAll(w.cssSelector).forEach(kn);
    }
    function Yr(b, E) {
      let N = null;
      try {
        N = E(c);
      } catch (I) {
        if (Oe("Language definition for '{}' could not be registered.".replace("{}", b)), j)
          Oe(I);
        else
          throw I;
        N = _;
      }
      N.name || (N.name = b), h[b] = N, N.rawDefinition = E.bind(null, c), N.aliases && Qs(N.aliases, { languageName: b });
    }
    function Qr(b) {
      delete h[b];
      for (const E of Object.keys(m))
        m[E] === b && delete m[E];
    }
    function eo() {
      return Object.keys(h);
    }
    function we(b) {
      return b = (b || "").toLowerCase(), h[b] || h[m[b]];
    }
    function Qs(b, { languageName: E }) {
      typeof b == "string" && (b = [b]), b.forEach((N) => {
        m[N.toLowerCase()] = E;
      });
    }
    function ea(b) {
      const E = we(b);
      return E && !E.disableAutodetect;
    }
    function to(b) {
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
    function no(b) {
      to(b), O.push(b);
    }
    function so(b) {
      const E = O.indexOf(b);
      E !== -1 && O.splice(E, 1);
    }
    function qt(b, E) {
      const N = b;
      O.forEach(function(I) {
        I[N] && I[N](E);
      });
    }
    function ao(b) {
      return Ze("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ze("10.7.0", "Please use highlightElement now."), kn(b);
    }
    Object.assign(c, {
      highlight: H,
      highlightAuto: En,
      highlightAll: Dt,
      highlightElement: kn,
      // TODO: Remove with v12 API
      highlightBlock: ao,
      configure: Jr,
      initHighlighting: Xr,
      initHighlightingOnLoad: Zr,
      registerLanguage: Yr,
      unregisterLanguage: Qr,
      listLanguages: eo,
      getLanguage: we,
      registerAliases: Qs,
      autoDetection: ea,
      inherit: Js,
      addPlugin: no,
      removePlugin: so
    }), c.debugMode = function() {
      j = !1;
    }, c.safeMode = function() {
      j = !0;
    }, c.versionString = Wr, c.regex = {
      concat: g,
      lookahead: f,
      either: S,
      optional: M,
      anyNumberOfTimes: k
    };
    for (const b in Pt)
      typeof Pt[b] == "object" && e(Pt[b]);
    return Object.assign(c, Pt), c;
  }, Ye = Zs({});
  return Ye.newInstance = () => Zs({}), In = Ye, Ye.HighlightJS = Ye, Ye.default = Ye, In;
}
var hd = /* @__PURE__ */ pd();
const bn = /* @__PURE__ */ ud(hd), xa = "[A-Za-z$_][0-9A-Za-z$_]*", fd = [
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
], bd = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], rr = [
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
], or = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], lr = [
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
], gd = [
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
], md = [].concat(
  lr,
  rr,
  or
);
function yd(e) {
  const t = e.regex, n = (K, { after: ve }) => {
    const Ae = "</" + K[0].slice(1);
    return K.input.indexOf(Ae, ve) !== -1;
  }, s = xa, a = {
    begin: "<>",
    end: "</>"
  }, i = /<[A-Za-z0-9\\._:-]+\s*\/>/, r = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (K, ve) => {
      const Ae = K[0].length + K.index, Xe = K.input[Ae];
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
      Xe === ">" && (n(K, { after: Ae }) || ve.ignoreMatch());
      let lt;
      const Lt = K.input.substring(Ae);
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
    $pattern: xa,
    keyword: fd,
    literal: bd,
    built_in: md,
    "variable.language": gd
  }, l = "[0-9](_?[0-9])*", d = `\\.(${l})`, u = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", p = {
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
  }, f = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: o,
    contains: []
    // defined later
  }, k = {
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
  }, M = {
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
  }, v = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [
      e.BACKSLASH_ESCAPE,
      f
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
  }, Ke = [
    e.APOS_STRING_MODE,
    e.QUOTE_STRING_MODE,
    k,
    M,
    g,
    v,
    // Skip numbers when they are part of a variable name
    { match: /\$\d+/ },
    p
    // This is intentional:
    // See https://github.com/highlightjs/highlight.js/issues/3288
    // hljs.REGEXP_MODE
  ];
  f.contains = Ke.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: o,
    contains: [
      "self"
    ].concat(Ke)
  });
  const Ve = [].concat(P, f.contains), X = Ve.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: o,
      contains: ["self"].concat(Ve)
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
        ...rr,
        ...or
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
  }, Rt = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function mn(K) {
    return t.concat("(?!", K.join("|"), ")");
  }
  const yn = {
    match: t.concat(
      /\b/,
      mn([
        ...lr,
        "super",
        "import",
        "await"
      ].map((K) => `${K}\\s*\\(`)),
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
  }, vn = {
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
  }, $t = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", wn = {
    match: [
      /const|var|let/,
      /\s+/,
      s,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      t.lookahead($t)
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
      k,
      M,
      g,
      v,
      P,
      // Skip numbers when they are part of a variable name
      { match: /\$\d+/ },
      p,
      ye,
      {
        scope: "attr",
        match: s + t.lookahead(":"),
        relevance: 0
      },
      wn,
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
            begin: $t,
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
      yn,
      Rt,
      Je,
      vn,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const vd = "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity", wd = {
  scope: "number",
  match: vd,
  relevance: 0
};
function _d(e) {
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
      wd,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function xd(e) {
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
  ], k = u, M = [
    ...d,
    ...l
  ].filter((X) => !u.includes(X)), g = {
    scope: "variable",
    match: /@[a-z0-9][a-z0-9_]*/
  }, v = {
    scope: "operator",
    match: /[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,
    relevance: 0
  }, S = {
    match: t.concat(/\b/, t.either(...k), /\s*\(/),
    relevance: 0,
    keywords: { built_in: k }
  };
  function P(X) {
    return t.concat(
      /\b/,
      t.either(...X.map((Q) => Q.replace(/\s+/, "\\s+"))),
      /\b/
    );
  }
  const Ke = {
    scope: "keyword",
    match: P(f),
    relevance: 0
  };
  function Ve(X, {
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
      keyword: Ve(M, { when: (X) => X.length < 3 }),
      literal: i,
      type: o,
      built_in: p
    },
    contains: [
      {
        scope: "type",
        match: P(r)
      },
      Ke,
      S,
      g,
      s,
      a,
      e.C_NUMBER_MODE,
      e.C_BLOCK_COMMENT_MODE,
      n,
      v
    ]
  };
}
bn.registerLanguage("javascript", yd);
bn.registerLanguage("json", _d);
bn.registerLanguage("sql", xd);
const Wt = /* @__PURE__ */ new Map(), Ed = 400, kd = 2e4;
function Ea(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Sd(e, t) {
  const n = String(e ?? "");
  if (n === "") return "";
  if (n.length > kd) return Ea(n);
  const s = `${t}:${n}`, a = Wt.get(s);
  if (a !== void 0) return a;
  let i;
  try {
    i = bn.highlight(n, { language: t, ignoreIllegals: !0 }).value;
  } catch {
    i = Ea(n);
  }
  return Wt.size >= Ed && Wt.clear(), Wt.set(s, i), i;
}
async function is(e) {
  const t = await fetch(e, { headers: { Accept: "application/json" } }), n = await t.json().catch(() => null);
  if (!t.ok) throw new Error(n && n.error || `HTTP ${t.status}`);
  if (n === null) throw new Error("The response was not JSON.");
  return n;
}
async function ka(e) {
  const t = await is(e), n = {};
  return Object.entries(t.sections || {}).forEach(([s, a]) => {
    n[s] = a.payload || {};
  }), { profile: t, payloads: n };
}
function Ps(e, t = 0) {
  return Number(e || 0).toFixed(t);
}
function Is(e) {
  const t = Number(e || 0);
  return t < 1024 ? `${t} B` : t < 1048576 ? `${(t / 1024).toFixed(1)} kB` : `${(t / 1048576).toFixed(1)} MB`;
}
function Ad(e, t, n) {
  return `${e} ${Number(e) === 1 ? t : n}`;
}
function Od(e, t = Date.now() / 1e3) {
  const n = Math.max(0, t - Number(e || 0));
  return n < 60 ? `${Math.round(n)}s ago` : n < 3600 ? `${Math.round(n / 60)}m ago` : `${Math.round(n / 3600)}h ago`;
}
function Td(e, t) {
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
function Md(e) {
  const t = e && e.magewire;
  return t && t.component ? `${t.component} ${t.action || ""}`.trim() : e && e.path || "/";
}
function Cd(e) {
  if (!e || e.delta === null || e.delta === void 0) return "not comparable";
  if (e.delta === 0) return "no change";
  const t = e.delta > 0 ? "+" : "-", n = e.unit === "B" ? Is(Math.abs(e.delta)) : `${Ps(Math.abs(e.delta), e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
  return `${t}${n}`;
}
function Nd(e, t) {
  const n = e[t];
  return n == null ? "none" : e.unit === "B" ? Is(n) : `${Ps(n, e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
}
function Rd(e) {
  return Object.entries(e.methods || {}).map(([t, n]) => `${n} ${t}`).join(", ");
}
function cr(e, t, n, s) {
  if (!e || !n || !/^[a-z][a-z0-9+.-]*:\/\//i.test(e) || /^(javascript|data|vbscript):/i.test(e))
    return "";
  const a = n.startsWith("/") ? n : `${t}/${n}`;
  return e.replace("%f", () => encodeURI(a)).replace("%l", () => String(s || 1));
}
function $d(e, t, n) {
  const s = String(n || "").match(/^(.+\.php):(\d+)$/);
  return s ? cr(e, t, s[1], Number(s[2])) : "";
}
const rs = /* @__PURE__ */ new Map(), zt = /* @__PURE__ */ new Map();
function Ds() {
  const e = window.Magewire || window.magewire;
  return e && typeof e == "object" ? e : null;
}
function qs() {
  const e = Ds();
  try {
    return Object.values(e?.components?.componentsById ?? {});
  } catch {
    return [];
  }
}
function Ld(e) {
  try {
    return JSON.stringify(e ?? {}).length;
  } catch {
    return 0;
  }
}
function Pd(e) {
  return rs.clear(), qs().map((t) => {
    const n = t.fingerprint ?? {}, s = t.serverMemo ?? {}, a = String(n.id ?? "");
    return t.el && rs.set(a, t.el), {
      id: a,
      name: String(n.name ?? "unknown"),
      resolver: String(n.resolver ?? "unknown"),
      handle: String(n.handle ?? ""),
      keys: e === te ? 0 : fn(s.data ?? {}).length,
      memo_bytes: Ld(s),
      listeners: (t.effects?.listeners ?? []).length,
      children: Object.keys(s.children ?? {}).length,
      path: t.el ? Id(t.el) : ""
    };
  });
}
function Id(e) {
  const t = e.tagName ? e.tagName.toLowerCase() : "?";
  return e.id ? `${t}#${e.id}` : t;
}
function Sa(e, t) {
  if (t === te)
    return "The value policy is set to none, so component state is not read.";
  const n = qs().find((s) => String(s.fingerprint?.id) === String(e));
  if (!n) return "This component is no longer on the page.";
  try {
    return JSON.stringify(hn(n.serverMemo?.data ?? {}, t), null, 2);
  } catch (s) {
    return `Could not read this component: ${s && s.message ? s.message : "threw"}`;
  }
}
function Dd() {
  return {
    present: Ds() !== null,
    components: qs().length,
    // Already the route, not the base: Magewire publishes it as /magewire/post and the
    // client appends the action itself.
    endpoint: String(window.livewire_app_url || "")
  };
}
function Aa(e) {
  const t = Ds();
  if (!t || typeof t.hook != "function") return !1;
  const n = /* @__PURE__ */ new Map(), s = (i) => String(i?.fingerprint?.name ?? "unknown"), a = (i) => String(i?.component?.fingerprint?.id ?? "");
  try {
    t.hook("message.sent", (i, r) => {
      n.set(a(i), { at: performance.now(), name: s(r) });
    }), t.hook("message.processed", (i, r) => {
      const o = n.get(a(i));
      n.delete(a(i)), e({
        component: s(r),
        action: Oa(i),
        duration_ms: o ? Math.round((performance.now() - o.at) * 10) / 10 : null,
        failed: !1
      });
    }), t.hook("message.failed", (i, r) => {
      n.delete(a(i)), e({
        component: s(r),
        action: Oa(i),
        duration_ms: null,
        failed: !0
      });
    });
  } catch {
    return !1;
  }
  return !0;
}
function Oa(e) {
  const t = (e?.updateQueue ?? [])[0];
  if (!t) return "refresh";
  const n = t.payload ?? {}, s = (...a) => a.map((i) => n[i] ?? t[i]).find(Boolean) ?? "unknown";
  return t.type === "callMethod" ? `${s("method")}()` : t.type === "syncInput" ? `set ${s("name")}` : t.type === "fireEvent" ? `on ${s("event")}` : String(t.type || "update");
}
function qd(e, t) {
  const n = rs.get(String(e));
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
const Dn = /* @__PURE__ */ new WeakMap(), on = /* @__PURE__ */ new Map(), ht = /* @__PURE__ */ new Map();
let Ta = 0;
function gn() {
  const e = jn || window.Alpine;
  return !e || typeof e != "object" || e === _t ? null : e;
}
function dr(e) {
  try {
    return typeof e.prefixed == "function" ? e.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function os(e) {
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
function jd(e) {
  if (typeof e.evaluate != "function") return null;
  const t = os(() => e.evaluate(document.body, "1"));
  return t === 1 ? !1 : t === void 0 ? !0 : null;
}
function Ma() {
  return Array.from(document.scripts).map((e) => e.src).filter((e) => /alpine/i.test(e)).map((e) => e.split("/").pop().split("?")[0]).join(", ");
}
function Ud(e) {
  if (typeof e.injectMagics == "function") {
    const t = os(() => {
      const n = {};
      return e.injectMagics(n, document.body), n.$store;
    });
    if (t && typeof t == "object") return t;
  }
  if (typeof e.evaluate == "function") {
    const t = os(() => e.evaluate(document.body, "$store"));
    if (t && typeof t == "object") return t;
  }
  return null;
}
function Bd(e) {
  const t = e.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return t ? t[1] : "inline";
}
function Fd(e) {
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
function Hd(e) {
  return Dn.has(e) || (Ta += 1, Dn.set(e, Ta)), Dn.get(e);
}
function ur(e, t) {
  const n = t._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof e.$data != "function") return null;
  try {
    return e.$data(t);
  } catch {
    return null;
  }
}
function Gd(e) {
  const t = gn();
  if (on.clear(), !t) return [];
  const n = dr(t), s = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((i) => {
    const r = Hd(i), o = (i.getAttribute(n) || "").trim(), l = (i.getAttribute(s) || "").trim(), d = ur(t, i);
    return on.set(r, i), {
      id: r,
      name: Bd(o),
      expression: ir(o, e),
      path: Fd(i),
      initialised: !!i._x_dataStack,
      deferred: i.hasAttribute(s),
      strategy: l || "none",
      keys: e === te || !d ? 0 : fn(d).length
    };
  });
}
function Ca(e, t) {
  if (t === te)
    return "The value policy is set to none, so component state is not read.";
  const n = gn(), s = on.get(e);
  if (!n || !s) return "This component is no longer on the page.";
  if (!s._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const a = ur(n, s);
  if (!a) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(hn(a, t), null, 2);
  } catch (i) {
    return `Could not read this component: ${i && i.message ? i.message : "threw"}`;
  }
}
function Wd(e) {
  const t = gn();
  if (!t) return [];
  const n = Ud(t);
  return n ? Object.keys(n).map((s) => {
    let a = n[s], i = 0;
    if (i = a && typeof a == "object" ? fn(a).length : 0, e === te)
      return { name: s, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      a = JSON.stringify(hn(a, e), null, 2);
    } catch (r) {
      a = `Could not read this store: ${r && r.message ? r.message : "threw"}`;
    }
    return { name: s, keys: i, value: a };
  }) : [];
}
function zd(e) {
  const t = window.__siteationDebugBar;
  return !t || !Array.isArray(t.alpineErrors) ? [] : t.alpineErrors.map((n) => {
    const s = String(n.message || ""), a = s.match(/Expression: "([\s\S]*?)"/);
    return {
      // An expression that threw is still a server rendered expression, and a message that
      // names the value it choked on is still that value. The rest of this section applies
      // the policy to exactly these two things; this was the one reader that did not.
      message: rn(s.split(`
`)[0].replace(/^Alpine (Expression )?Error:\s*/, ""), e),
      expression: a ? ir(a[1], e) : "",
      element: String(n.element || ""),
      during_init: !!n.during_init
    };
  });
}
function Kd() {
  const e = gn();
  return e ? {
    present: !0,
    version: String(e.version || "unknown"),
    csp: jd(e),
    source: Ma(),
    prefix: dr(e)
  } : { present: !1, version: "", csp: null, source: Ma(), prefix: "" };
}
function Vd(e, t) {
  const n = on.get(e);
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
const Na = 2e5, Jd = /^https?:\/\/(www\.)?schema\.org\//i, pr = {
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
}, js = {
  NewsArticle: "Article",
  BlogPosting: "Article",
  ProductGroup: "Product",
  Corporation: "Organization",
  OnlineStore: "Organization",
  OnlineBusiness: "Organization",
  LocalBusiness: "Organization",
  Store: "Organization"
}, Xd = ["BreadcrumbList", "WebSite", "Organization", "FAQPage"];
function me(e) {
  return (Array.isArray(e) ? e : String(e ?? "").split(/\s+/)).map((n) => String(n ?? "").trim().replace(Jd, "")).filter(Boolean);
}
function hr(e) {
  for (const t of e) {
    const n = js[t] || t;
    if (pr[n]) return n;
  }
  return "";
}
function Zd(e, t) {
  const n = /line (\d+) column (\d+)/i.exec(e);
  if (n) return { line: Number(n[1]), column: Number(n[2]) };
  const s = /position (\d+)/i.exec(e);
  if (!s) return null;
  const a = t.slice(0, Number(s[1])).split(`
`);
  return { line: a.length, column: a[a.length - 1].length + 1 };
}
function Yd(e) {
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
    } catch (d) {
      r.error = String(d && d.message || d), r.at = Zd(r.error, i), r.excerpt = r.at ? (i.split(`
`)[r.at.line - 1] || "").trim().slice(0, 160) : "";
      return;
    }
    (Array.isArray(o) ? o : [o]).forEach((d) => {
      if (!d || typeof d != "object") return;
      const u = Array.isArray(d["@graph"]) ? d["@graph"] : [d], p = d["@context"];
      u.forEach((f) => {
        if (!f || typeof f != "object") return;
        const k = p && !f["@context"] && f !== d ? { "@context": p, ...f } : f;
        n.push({ source: "json-ld", block: a, data: k }), r.entities += 1;
      });
    });
  }), { blocks: t, entities: n };
}
function Qd(e) {
  const t = e.tagName.toLowerCase(), n = (s) => (e.getAttribute(s) || "").trim();
  return t === "meta" ? n("content") : ["a", "area", "link"].includes(t) ? n("href") : ["audio", "embed", "iframe", "img", "source", "track", "video"].includes(t) ? n("src") : t === "object" ? n("data") : ["data", "meter"].includes(t) ? n("value") : t === "time" && e.hasAttribute("datetime") ? n("datetime") : e.hasAttribute("content") ? n("content") : String(e.textContent || "").replace(/\s+/g, " ").trim();
}
function fr(e) {
  const t = {}, n = me(e.getAttribute("itemtype"));
  n.length === 1 ? t["@type"] = n[0] : n.length > 1 && (t["@type"] = n), e.getAttribute("itemid") && (t["@id"] = e.getAttribute("itemid"));
  const s = (i, r) => {
    i in t ? Array.isArray(t[i]) ? t[i].push(r) : t[i] = [t[i], r] : t[i] = r;
  }, a = (i) => {
    Array.from(i.children).forEach((r) => {
      const o = (r.getAttribute("itemprop") || "").trim().split(/\s+/).filter(Boolean), l = r.hasAttribute("itemscope");
      o.forEach((d) => s(d, l ? fr(r) : Qd(r))), l || a(r);
    });
  };
  return a(e), t;
}
function br(e) {
  const t = Array.from(e.querySelectorAll("[itemscope]")).filter((n) => !n.hasAttribute("itemprop"));
  return {
    entities: t.map((n, s) => {
      const a = me(n.getAttribute("itemtype")), i = t.findIndex((r) => r !== n && r.contains(n) && me(r.getAttribute("itemtype")).some((o) => a.includes(o)));
      return {
        source: "microdata",
        block: s,
        where: eu(n),
        inside: i,
        data: fr(n)
      };
    }),
    elements: t
  };
}
function eu(e) {
  const t = e.tagName.toLowerCase(), n = e.getAttribute("id"), s = (e.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
  return n ? `<${t} id="${n}">` : s.length > 0 ? `<${t} class="${s[0]}">` : `<${t}>`;
}
function Us(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.some(Us) : !0;
}
function Ie(e, t) {
  const [n, ...s] = t.split("."), a = e[n];
  return s.length === 0 ? Us(a) : (Array.isArray(a) ? a : [a]).some((r) => r && typeof r == "object" && Ie(r, s.join(".")));
}
function gr(e, t, n, s = 0) {
  if (s > 6) return;
  const a = me(e["@type"]), i = hr(a), r = t ? `${t} > ${a[0] || "item"}` : a[0] || "item", o = pr[i];
  if (o) {
    const l = (d, u) => n.push({ level: d, path: r, message: u, docs: o.docs });
    (o.required || []).filter((d) => !Ie(e, d)).forEach((d) => {
      l("required", `Missing ${d}.`);
    }), (o.oneOf || []).filter((d) => !d.some((u) => Ie(e, u))).forEach((d) => {
      l("required", `Needs one of ${d.join(", ")}.`);
    }), (o.recommended || []).filter((d) => !Ie(e, d)).forEach((d) => {
      l("recommended", `No ${d}.`);
    }), o.note && l("note", o.note), i === "BreadcrumbList" && tu(e, l), i === "WebSite" && nu(e, l), (i === "Offer" || i === "AggregateOffer") && su(e, l);
  }
  Object.entries(e).forEach(([l, d]) => {
    if (l.startsWith("@")) return;
    (Array.isArray(d) ? d : [d]).forEach((p) => {
      p && typeof p == "object" && p["@type"] && gr(p, `${r} > ${l}`, n, s + 1);
    });
  });
}
function tu(e, t) {
  const s = (Array.isArray(e.itemListElement) ? e.itemListElement : [e.itemListElement]).filter((i) => i && typeof i == "object");
  s.forEach((i, r) => {
    const o = Ie(i, "name") || Ie(i, "item.name"), l = Ie(i, "item");
    o || t("required", `Crumb ${r + 1} has no name.`), !l && r < s.length - 1 && t("required", `Crumb ${r + 1} has no item URL.`);
  }), s.map((i) => Number(i.position)).some((i, r) => i !== r + 1) && t("required", "The crumb positions do not count up from 1.");
}
function nu(e, t) {
  (Array.isArray(e.potentialAction) ? e.potentialAction : [e.potentialAction]).filter((s) => s && typeof s == "object" && me(s["@type"]).includes("SearchAction")).forEach((s) => {
    const a = typeof s.target == "object" && s.target ? String(s.target.urlTemplate || "") : String(s.target || ""), i = String(s["query-input"] || ""), r = (/name=([\w-]+)/.exec(i) || [])[1] || "";
    a ? r && !a.includes(`{${r}}`) && t("required", `The SearchAction target has no {${r}} for the query-input to fill.`) : t("required", "The SearchAction has no target.");
  });
}
function su(e, t) {
  const n = e.price ?? e.lowPrice;
  Us(n) && !/^\d+(\.\d+)?$/.test(String(n).trim()) && t("required", `The price "${n}" is not a plain number. Use a dot for decimals and leave out the currency sign.`);
  const s = String(e.priceCurrency || "").trim();
  s && !/^[A-Z]{3}$/.test(s) && t("required", `"${s}" is not a three letter ISO 4217 currency code.`);
}
function au(e) {
  const t = e.name ?? e.headline ?? e.url ?? e["@id"] ?? "", n = Array.isArray(t) ? t[0] : t;
  return typeof n == "string" ? n.replace(/\s+/g, " ").trim().slice(0, 120) : "";
}
function mr(e) {
  const t = me(e["@type"]).map((s) => js[s] || s).sort(), n = e["@id"] || e.sku || e.url || e.name;
  return t.length === 0 || !n || typeof n != "string" ? "" : `${t.join("+")}|${n.trim().toLowerCase()}`;
}
function Ra(e) {
  const t = e.map((n) => mr(n.data));
  return t[0] !== "" && t.every((n) => n === t[0]);
}
function iu(e) {
  const t = [], n = /* @__PURE__ */ new Map(), s = e.filter((r) => r.source === "microdata"), a = /* @__PURE__ */ new Set();
  s.forEach((r) => {
    if (r.inside === void 0 || r.inside < 0) return;
    const o = s.find((l) => l.block === r.inside);
    o && (a.add(o), t.push(`${r.type} is declared on ${o.where} and again on ${r.where} inside it. Its properties go to the inner one, so the outer one is a second, empty ${r.type}. Remove one itemscope.`));
  }), e = e.filter((r) => !a.has(r)), e.forEach((r) => {
    const o = mr(r.data);
    o && n.set(o, [...n.get(o) || [], r]);
  }), n.forEach((r) => {
    if (r.length < 2) return;
    const o = [...new Set(r.map((d) => d.source === "json-ld" ? "JSON-LD" : "microdata"))], l = o.length > 1 ? `in both ${o.join(" and ")}` : `${r.length} times in ${o[0]}`;
    t.push(`${r[0].type} "${r[0].name}" is described ${l}. Usually a theme and a module both write it; keep one.`);
  }), Xd.forEach((r) => {
    const o = e.filter((l) => me(l.data["@type"]).some((d) => (js[d] || d) === r));
    o.length > 1 && !Ra(o) && t.push(`${o.length} ${r} entities on one page. A page has one; keep the one that is right.`);
  });
  const i = e.filter((r) => hr(me(r.data["@type"])) === "Product");
  return i.length > 1 && !Ra(i) && t.push(`${i.length} different top level products. A product page describes one; a list of products belongs in an ItemList.`), t;
}
function ru(e) {
  let t;
  try {
    t = new URL(e).hostname.toLowerCase();
  } catch {
    return !1;
  }
  return !(t === "localhost" || !t.includes(".") || /\.(test|local|localhost|internal|example|invalid|lan|home|dev\.local)$/.test(t) || /^(10|127)\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^169\.254\./.test(t) || t.startsWith("["));
}
function ou(e) {
  const t = ru(e), n = encodeURIComponent(e);
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
function lu(e) {
  const t = Array.from(e.querySelectorAll("script[type]")).filter((a) => a.getAttribute("type").trim().toLowerCase() === "application/ld+json").map((a) => `<script type="application/ld+json">${a.textContent}<\/script>`), n = br(e).elements.map((a) => a.outerHTML), s = [...t, ...n].join(`
`);
  return s.length > Na ? s.slice(0, Na) : s;
}
function cu(e, t) {
  const n = Yd(e), s = br(e), a = [...n.entities, ...s.entities].map((r, o) => {
    const l = [];
    return gr(r.data, "", l), {
      index: o,
      source: r.source,
      block: r.block,
      where: r.where || "",
      inside: r.inside ?? -1,
      type: me(r.data["@type"]).join(", ") || "untyped",
      name: au(r.data),
      json: JSON.stringify(r.data, null, 2),
      data: r.data,
      findings: l
    };
  }), i = [];
  return n.blocks.filter((r) => r.error).forEach((r) => {
    const o = r.at ? ` at line ${r.at.line}, column ${r.at.column}` : "";
    i.push(`JSON-LD block ${r.index + 1} does not parse${o}: ${r.error}`);
  }), i.push(...iu(a)), a.forEach((r) => {
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
      links: ou(t)
    },
    elements: s.elements
  };
}
function du() {
  return { blocks: [], entities: [], warnings: [], links: { public: !1, tools: [] } };
}
const uu = { min: 30, max: 60 }, pu = { min: 70, max: 160 }, hu = ["og:title", "og:type", "og:image", "og:url"], fu = ["twitter:card"], bu = 2, gu = 200, $a = 160, mu = /^[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?$/i;
function yu(e) {
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
function vu() {
  return {
    measure: yu,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
}
function He(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length <= $a ? t : `${t.slice(0, $a)}...`;
}
function Ge(e, t) {
  try {
    return new URL(e, t);
  } catch {
    return null;
  }
}
function Bs(e, t) {
  return String(e.getAttribute(t) || "").toLowerCase().split(/\s+/).filter(Boolean);
}
function ln(e, t) {
  return Array.from(e.querySelectorAll("meta")).filter((n) => (n.getAttribute("name") || n.getAttribute("property") || "").toLowerCase() === t);
}
function La(e, t) {
  return e === 0 ? "missing" : e < t.min ? `too short, under ${t.min} characters` : e > t.max ? `too long, over ${t.max} characters, so it will be cut` : "";
}
function yr(e) {
  return e === "" ? "missing" : mu.test(e) ? /-uk$/i.test(e) ? `"${e}" uses UK, which is not a region code; use GB` : "" : `"${e}" is not a valid language code`;
}
function Ot(e) {
  return `${e.protocol}//${e.host}${e.pathname}${e.search}`;
}
function wu(e, t) {
  if (Ot(e) === Ot(t)) return "";
  if (e.protocol !== t.protocol)
    return `it uses ${e.protocol.replace(":", "")} and this page uses ${t.protocol.replace(":", "")}`;
  if (e.host !== t.host) return `it points to another host, ${e.host}`;
  const n = e.pathname.replace(/\/$/, "") === t.pathname.replace(/\/$/, "");
  return e.pathname !== t.pathname && n ? "only the trailing slash differs" : e.pathname !== t.pathname ? `it points to ${e.pathname}` : t.search && !e.search ? `this URL has a query string (${t.search}) that the canonical leaves out` : e.search && !t.search ? `it adds a query string (${e.search}) that this URL does not have` : "the query string differs";
}
function _u(e, t) {
  const n = Array.from(e.querySelectorAll("link[rel]")).filter((l) => Bs(l, "rel").includes("canonical")), s = [];
  if (n.length === 0)
    return { href: "", resolved: "", count: 0, warnings: ["No canonical URL."] };
  n.length > 1 && s.push(`${n.length} canonical links. Search engines ignore all of them when they disagree, and may when they do not.`);
  const a = (n[0].getAttribute("href") || "").trim(), i = Ge(a, t), r = Ge(t, t);
  if (a === "" || !i)
    return s.push("The canonical link has no usable URL."), { href: a, resolved: "", count: n.length, warnings: s };
  /^[a-z][a-z0-9+.-]*:/i.test(a) || s.push("The canonical URL is relative. Use the full URL, with the scheme and host.");
  const o = r ? wu(i, r) : "";
  return o && s.push(`The canonical URL is not this page: ${o}.`), { href: a, resolved: i.href, count: n.length, warnings: s };
}
function xu(e, t) {
  const n = Ge(t, t), s = Array.from(e.querySelectorAll("link[hreflang]")).filter((i) => Bs(i, "rel").includes("alternate")).map((i) => {
    const r = (i.getAttribute("hreflang") || "").trim(), o = Ge(i.getAttribute("href") || "", t);
    return {
      lang: r,
      href: o ? o.href : "",
      self: !!(o && n && Ot(o) === Ot(n)),
      problem: r.toLowerCase() === "x-default" ? "" : yr(r)
    };
  });
  if (s.length === 0) return { items: s, warnings: [] };
  const a = [];
  return s.some((i) => i.self) || a.push("No hreflang link points to this page. Every page in the set has to list itself."), s.some((i) => i.lang.toLowerCase() === "x-default") || a.push("No x-default alternate, so visitors whose language is not listed get no fallback."), s.filter((i) => i.problem).forEach((i) => {
    a.push(`hreflang ${i.problem}.`);
  }), { items: s, warnings: a };
}
function Eu(e) {
  if (!e) return 0;
  let t = 0;
  const n = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG"]), s = (a) => {
    a.childNodes.forEach((i) => {
      i.nodeType === 3 ? t += (i.textContent.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length : i.nodeType === 1 && !n.has(i.nodeName.toUpperCase()) && s(i);
    });
  };
  return s(e), t;
}
function ku(e, t = "") {
  const n = [...ln(e, "robots"), ...ln(e, "googlebot")].map((i) => (i.getAttribute("content") || "").trim()).filter(Boolean).join(", "), s = [], a = `${n}, ${t}`.toLowerCase();
  return /\b(noindex|none)\b/.test(a) && s.push("This page asks not to be indexed."), /\b(nofollow|none)\b/.test(a) && s.push("This page asks search engines not to follow its links."), { meta: n, header: String(t || ""), warnings: s };
}
function Su(e, t, n = "") {
  const s = e.querySelector("head title") || e.querySelector("title"), a = He(s ? s.textContent : ""), i = ln(e, "description")[0], r = He(i ? i.getAttribute("content") : ""), o = (e.documentElement.getAttribute("lang") || "").trim(), l = ln(e, "viewport")[0], d = e.querySelector("meta[charset]") || Array.from(e.querySelectorAll("meta[http-equiv]")).find((p) => /charset=/i.test(p.getAttribute("content") || "")), u = {
    title: { value: a, length: a.length, hint: La(a.length, uu) },
    description: {
      value: r,
      length: r.length,
      hint: La(r.length, pu)
    },
    canonical: _u(e, t),
    robots: ku(e, n),
    hreflang: xu(e, t),
    lang: { value: o, problem: yr(o) },
    viewport: l ? (l.getAttribute("content") || "").trim() : "",
    charset: {
      value: String(e.characterSet || e.charset || ""),
      declared: !!d
    },
    words: Eu(e.body),
    warnings: []
  };
  return u.title.hint && u.warnings.push(`Title ${u.title.hint}.`), u.description.hint && u.warnings.push(`Meta description ${u.description.hint}.`), u.lang.problem && u.warnings.push(`<html lang> ${u.lang.problem}.`), u.viewport || u.warnings.push("No viewport meta tag, so phones draw the desktop layout."), u.charset.declared || u.warnings.push("No charset declared in the markup."), u.warnings.push(
    ...u.canonical.warnings,
    ...u.robots.warnings,
    ...u.hreflang.warnings
  ), u;
}
function Au(e, t) {
  const n = Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  let s = 0;
  const a = n.map((o, l) => {
    const d = Number(o.tagName.slice(1)), u = He(o.textContent), p = [];
    return u === "" && p.push("empty"), s > 0 && d > s + 1 && p.push(`skips from h${s} to h${d}`), t.measure(o).visible || p.push("hidden from view"), s = d, { index: l, level: d, text: u, warnings: p };
  }), i = a.filter((o) => o.level === 1).length, r = [];
  return i === 0 && r.push("No H1."), i > 1 && r.push(`${i} H1 headings. One page, one main heading.`), a.forEach((o) => o.warnings.forEach((l) => {
    r.push(`H${o.level} ${o.text ? `"${o.text}"` : `#${o.index + 1}`}: ${l}.`);
  })), { items: a, warnings: r, elements: n };
}
function Ou(e, t) {
  const n = e.trim().toLowerCase();
  if (n === "") return !1;
  if (/\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?)$/.test(n) || /^(img|image|dsc|dscn|photo|pic|screenshot)[-_ ]?\d+$/.test(n)) return !0;
  const a = String(t || "").split(/[?#]/)[0].split("/").pop().toLowerCase().replace(/\.[a-z0-9]+$/, "");
  return a !== "" && n === a;
}
function Tu(e, t) {
  const n = Array.from(e.querySelectorAll("img")), s = n.map((r, o) => {
    const l = r.currentSrc || r.getAttribute("src") || r.getAttribute("data-src") || "", d = r.hasAttribute("alt") ? r.getAttribute("alt") : null, u = t.measure(r), p = [];
    d === null ? p.push("no alt attribute") : d.trim() === "" ? p.push("empty alt, which is right only for a decorative image") : Ou(d, l) && p.push("alt text is a file name"), (!r.hasAttribute("width") || !r.hasAttribute("height")) && p.push("no width and height, so the page shifts when it loads");
    const f = u.width * t.pixelRatio;
    return u.visible && u.width > 0 && u.naturalWidth > f * bu && u.naturalWidth - f > gu && p.push(`${u.naturalWidth}px wide but drawn at ${Math.round(u.width)}px`), (r.getAttribute("loading") || "").toLowerCase() === "lazy" && u.visible && u.top < t.viewportHeight && p.push("lazy loaded but visible on the first screen, which delays it"), {
      index: o,
      src: l,
      alt: d === null ? null : He(d),
      size: u.naturalWidth && u.width ? `${Math.round(u.width)} × ${Math.round(u.height)} of ${u.naturalWidth} × ${u.naturalHeight}` : "",
      warnings: p
    };
  }), a = s.filter((r) => r.warnings.length > 0), i = a.length > 0 ? [`${a.length} of ${s.length} images have a problem.`] : [];
  return { items: s, warnings: i, elements: n };
}
function Mu(e) {
  const t = He(e.textContent);
  if (t) return t;
  const n = Array.from(e.querySelectorAll("img[alt]")).map((s) => s.getAttribute("alt")).find(Boolean);
  return He(e.getAttribute("aria-label") || n || e.getAttribute("title") || "");
}
function Cu(e, t) {
  const n = Ge(t, t), s = Array.from(e.querySelectorAll("a[href]")), a = { internal: 0, external: 0, nofollow: 0 }, i = s.map((l, d) => {
    const u = (l.getAttribute("href") || "").trim(), p = Ge(u, t), f = Bs(l, "rel").includes("nofollow"), k = Mu(l), M = [];
    let g = "other";
    return p && /^https?:$/.test(p.protocol) && (g = n && p.host === n.host ? "internal" : "external"), g !== "other" && (a[g] += 1), f && (a.nofollow += 1), k === "" && M.push("no text"), (u === "" || u === "#") && M.push("goes nowhere"), /^javascript:/i.test(u) && M.push("a javascript: link, which is a button pretending"), g === "internal" && f && M.push("internal link marked nofollow"), n && n.protocol === "https:" && p && p.protocol === "http:" && M.push("http: on an https: page"), { index: d, href: u, text: k, kind: g, nofollow: f, warnings: M };
  }), r = i.filter((l) => l.warnings.length > 0), o = r.length > 0 ? [`${r.length} of ${i.length} links have a problem.`] : [];
  return { items: i, counts: a, warnings: o, elements: s };
}
function Nu(e) {
  const t = Array.from(e.querySelectorAll("meta")).map((o) => ({
    name: (o.getAttribute("property") || o.getAttribute("name") || "").trim().toLowerCase(),
    value: He(o.getAttribute("content"))
  })), n = t.filter((o) => o.name.startsWith("og:")), s = t.filter((o) => o.name.startsWith("twitter:")), a = (o) => t.some((l) => l.name === o && l.value !== ""), i = [];
  hu.filter((o) => !a(o)).forEach((o) => {
    i.push(`Missing ${o}.`);
  }), fu.filter((o) => !a(o)).forEach((o) => {
    i.push(`Missing ${o}, so X shows a bare link.`);
  });
  const r = n.find((o) => o.name === "og:image");
  return r && r.value && !/^https?:\/\//i.test(r.value) && i.push("og:image is not a full URL, and link previews will not fetch it."), { openGraph: n, x: s, warnings: i };
}
function Ru(e) {
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
function $u(e, { url: t, robotsHeader: n = "", env: s }) {
  const { elements: a, ...i } = Au(e, s), { elements: r, ...o } = Tu(e, s), { elements: l, ...d } = Cu(e, t), { elements: u, model: p } = cu(e, t), f = (g) => g.items.filter((v) => v.warnings.length > 0).length, k = {
    overview: 0,
    headings: i.warnings.length,
    images: f(o),
    links: f(d),
    schema: p.warnings.length,
    social: 0
  }, M = {
    overview: Su(e, t, n),
    headings: i,
    images: o,
    links: d,
    schema: p,
    social: Nu(e),
    quickLinks: Ru(t),
    counts: k
  };
  return k.overview = M.overview.warnings.length, k.social = M.social.warnings.length, M.warningCount = Object.values(k).reduce((g, v) => g + v, 0), {
    model: M,
    elements: {
      headings: a,
      images: r,
      links: l,
      schema: u
    }
  };
}
function Pa() {
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
    schema: du(),
    social: { openGraph: [], x: [], warnings: [] },
    quickLinks: [],
    counts: { overview: 0, headings: 0, images: 0, links: 0, schema: 0, social: 0 },
    warningCount: 0
  };
}
let Fs = { headings: [], images: [], links: [], schema: [] };
const Tt = /* @__PURE__ */ new Map();
function Lu(e = "") {
  Array.from(Tt.keys()).forEach((s) => vr(s));
  const { model: t, elements: n } = $u(document, {
    url: window.location.href,
    robotsHeader: e,
    env: vu()
  });
  return Fs = n, t;
}
function vr(e) {
  const t = Tt.get(e);
  t && (e.style.outline = t.outline, e.style.outlineOffset = t.offset, Tt.delete(e));
}
function Pu() {
  return lu(document);
}
function ls(e, t, n) {
  const s = (Fs[e] || [])[t];
  if (!(!s || !s.style)) {
    if (!n) {
      vr(s);
      return;
    }
    Tt.has(s) || Tt.set(s, {
      outline: s.style.outline || "",
      offset: s.style.outlineOffset || ""
    }), s.style.outline = "2px solid #7f9cf5", s.style.outlineOffset = "2px";
  }
}
function Iu(e, t) {
  const n = (Fs[e] || [])[t];
  n && (n.scrollIntoView({ block: "center", behavior: "smooth" }), ls(e, t, !0));
}
const wr = [
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
], Du = wr.filter((e) => !["refund"].includes(e)), Hs = ["ad_storage", "analytics_storage", "ad_user_data", "ad_personalization"], qu = 2e3, cs = "siteation.debugbar.datalayer.v1", ju = 500, Uu = 4e5;
function Bu(e) {
  const t = e.value;
  if (e.gtag && Array.isArray(t)) {
    const n = String(t[0] ?? ""), s = typeof t[1] == "string" ? t[1] : "";
    return { kind: "gtag", name: s ? `${n} ${s}` : n, args: t };
  }
  return t && typeof t == "object" && !Array.isArray(t) ? typeof t.event == "string" ? { kind: "event", name: t.event, args: [] } : { kind: "object", name: Object.keys(t).slice(0, 3).join(", ") || "empty object", args: [] } : { kind: "other", name: typeof t, args: [] };
}
function Fu(e) {
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
function Hu(e) {
  const t = e && e.value;
  return !!(t && typeof t == "object" && !Array.isArray(t) && "ecommerce" in t && t.ecommerce === null);
}
function Gu(e, t) {
  const { event: n, data: s, viaGtag: a } = Fu(e[t]);
  if (!wr.includes(n)) return [];
  const i = [];
  if (!s)
    return i.push(a ? "no parameters" : "no ecommerce object"), i;
  if (Du.includes(n)) {
    const r = s.items;
    !Array.isArray(r) || r.length === 0 ? i.push("no items[]") : r.forEach((o, l) => {
      o && typeof o == "object" && (o.item_id !== void 0 && o.item_id !== "" || o.item_name !== void 0 && o.item_name !== "") || i.push(`items[${l}] has neither item_id nor item_name`);
    });
  }
  return s.value !== void 0 && s.value !== null && !s.currency && i.push("value without currency"), n === "purchase" && !s.transaction_id && i.push("purchase without transaction_id"), !a && !Hu(e[t - 1]) && i.push("no {ecommerce: null} pushed right before it"), i;
}
function _r(e, t = "", n = []) {
  if (n.length >= 500) return n;
  if (e !== null && typeof e == "object") {
    const s = Array.isArray(e) ? e.map((a, i) => [`${t}[${i}]`, a]) : Object.keys(e).map((a) => [
      /^[A-Za-z_$][\w$]*$/.test(a) ? t ? `${t}.${a}` : a : `${t}[${JSON.stringify(a)}]`,
      e[a]
    ]);
    return s.length === 0 && n.push({ path: t, value: Array.isArray(e) ? "[]" : "{}" }), s.forEach(([a, i]) => _r(i, a, n)), n;
  }
  return n.push({ path: t, value: e === void 0 ? "undefined" : JSON.stringify(e) }), n;
}
function Wu(e, t) {
  const n = t.filter((a) => typeof a.at == "number" && a.at <= e && e - a.at <= qu).sort((a, i) => i.at - a.at);
  if (n.length === 0) return null;
  const s = n[0];
  return { id: s.id, label: `${s.method} ${s.url}`, gap: Math.round(e - s.at) };
}
const zu = [
  { vendor: "Google Tag Manager", host: /googletagmanager\.com\/gtm\.js/, id: /[?&]id=(GTM-[A-Z0-9]+)/i },
  { vendor: "Google tag", host: /googletagmanager\.com\/gtag\/js/, id: /[?&]id=((?:G|AW|DC|GT)-[A-Z0-9]+)/i },
  { vendor: "Meta pixel", host: /connect\.facebook\.net\/.*\/fbevents\.js/, id: null },
  { vendor: "TikTok pixel", host: /analytics\.tiktok\.com/, id: /[?&]sdkid=([A-Z0-9]+)/i },
  { vendor: "Microsoft Clarity", host: /clarity\.ms\/tag\/([a-z0-9]+)/i, id: /clarity\.ms\/tag\/([a-z0-9]+)/i },
  { vendor: "Microsoft Ads (UET)", host: /bat\.bing\.com\/bat\.js/, id: null },
  { vendor: "Hotjar", host: /static\.hotjar\.com\/c\/hotjar-(\d+)/, id: /hotjar-(\d+)/ },
  { vendor: "LinkedIn Insight", host: /snap\.licdn\.com/, id: null },
  { vendor: "Pinterest tag", host: /s\.pinimg\.com\/ct\/core\.js/, id: null }
], Ku = [
  { vendor: "Meta pixel", pattern: /fbq\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/g },
  { vendor: "Pinterest tag", pattern: /pintrk\(\s*['"]load['"]\s*,\s*['"](\d+)['"]/g },
  { vendor: "TikTok pixel", pattern: /ttq\.load\(\s*['"]([A-Z0-9]+)['"]/gi },
  { vendor: "LinkedIn Insight", pattern: /_linkedin_partner_id\s*=\s*['"]?(\d+)/g }
];
function qn(e) {
  return /^GTM-/i.test(e) ? "Google Tag Manager" : /^G-/i.test(e) ? "Google Analytics 4" : /^AW-/i.test(e) ? "Google Ads" : /^DC-/i.test(e) ? "Campaign Manager" : "Google tag";
}
function Vu(e, t, n = []) {
  const s = /* @__PURE__ */ new Map(), a = (u, p, f, k = !1) => {
    const M = `${u}|${p}`, g = s.get(M) || { id: p, vendor: u, via: [], loads: 0 };
    g.via.includes(f) || g.via.push(f), k && (g.loads += 1), s.set(M, g);
  };
  Array.from(e.querySelectorAll("script[src]")).forEach((u) => {
    const p = u.getAttribute("src") || "";
    zu.forEach((f) => {
      if (!f.host.test(p)) return;
      const k = f.id ? f.id.exec(p) : null, M = k ? f.vendor.startsWith("Google") ? k[1].toUpperCase() : k[1] : "";
      a(f.vendor === "Google tag" && M ? qn(M) : f.vendor, M, "script", !0);
    });
  }), Array.from(e.querySelectorAll("script:not([src])")).forEach((u) => {
    const p = u.textContent || "";
    Ku.forEach((f) => {
      for (const k of p.matchAll(f.pattern)) a(f.vendor, k[1], "inline script");
    });
  });
  const i = /* @__PURE__ */ new Map();
  t.forEach((u) => {
    if (!u.gtag || !Array.isArray(u.value) || u.value[0] !== "config") return;
    const p = String(u.value[1] || "").toUpperCase();
    p && (i.set(p, (i.get(p) || 0) + 1), a(qn(p), p, "gtag('config')"));
  }), n.filter((u) => /^(GTM|G|AW|DC|GT)-[A-Z0-9]+$/i.test(u)).forEach((u) => a(qn(u.toUpperCase()), u.toUpperCase(), "loaded by Google"));
  const r = Array.from(s.values()), o = [];
  r.filter((u) => u.loads > 1).forEach((u) => {
    o.push(`${[u.vendor, u.id].filter(Boolean).join(" ")} is loaded ${u.loads} times.`);
  }), i.forEach((u, p) => {
    u > 1 && o.push(`${p} is configured ${u} times, so its page view can be sent more than once.`);
  });
  const l = r.filter((u) => u.vendor === "Google Tag Manager" && u.id);
  l.length > 1 && o.push(`${l.length} GTM containers (${l.map((u) => u.id).join(", ")}). Check that they do not both send to the same GA4 property; the page cannot tell which property a container sends to.`);
  const d = r.filter((u) => u.vendor === "Google Analytics 4");
  return d.length > 0 && l.length > 0 && d.some((u) => u.via.includes("gtag('config')")) && o.push("GA4 is configured with gtag() on a page that also loads GTM. If the container has a GA4 tag for the same property, every hit is sent twice."), { items: r, warnings: o };
}
function Ju(e) {
  const t = {}, n = {}, s = [];
  e.forEach((o, l) => {
    const d = o.value;
    if (!o.gtag || !Array.isArray(d) || d[0] !== "consent") return;
    const u = String(d[1] || ""), p = d[2] && typeof d[2] == "object" ? d[2] : {};
    s.push({ kind: u, index: l, values: p }), Object.keys(p).forEach((f) => {
      const k = String(p[f]);
      u === "default" && !(f in t) && (t[f] = k), n[f] = k;
    });
  });
  const a = [], i = s.find((o) => o.kind === "default"), r = e.findIndex((o) => Xu(o));
  return i ? (r !== -1 && r < i.index && a.push("A tag fires before the consent default is set, so it runs with no consent state."), Hs.filter((o) => !(o in t)).forEach((o) => {
    a.push(`The consent default does not set ${o}${o.startsWith("ad_user") || o.startsWith("ad_pers") ? ", which Consent Mode v2 requires" : ""}.`);
  })) : r !== -1 && a.push("No consent default is set. Google's tags run without Consent Mode."), { defaults: t, current: n, calls: s, warnings: a };
}
function Xu(e) {
  const t = e.value;
  return e.gtag && Array.isArray(t) ? t[0] === "config" || t[0] === "event" : !!(t && typeof t == "object" && t.event === "gtm.js");
}
function Zu(e, t, { policy: n, page: s, requests: a }) {
  const i = e[t], { kind: r, name: o } = Bu(i), l = hn(i.value, n);
  return {
    index: t,
    page: s,
    current: !0,
    kind: r,
    name: o,
    before: !!i.before,
    at: Math.round(i.at || 0),
    request: i.before ? null : Wu(i.at, a),
    problems: Gu(e, t),
    json: n === te ? "" : JSON.stringify(l, null, 2),
    flat: n === te ? [] : _r(l)
  };
}
function Yu({ pushes: e, requests: t, doc: n, loaded: s = [], policy: a, page: i, present: r }) {
  const o = e.map((f, k) => Zu(e, k, { policy: a, page: i, requests: t })), l = Vu(n, e, s), d = Ju(e), p = {
    pushes: o.filter((f) => f.problems.length > 0).length,
    tags: l.warnings.length,
    consent: d.warnings.length
  };
  return {
    present: r,
    pushes: o,
    tags: { items: l.items.map((f) => ({ ...f, where: f.via.join(", ") })), warnings: l.warnings },
    consent: {
      keys: Hs.map((f) => ({
        key: f,
        default: d.defaults[f] || "",
        current: d.current[f] || ""
      })),
      calls: d.calls.map((f) => ({ kind: f.kind, index: f.index })),
      updates: d.calls.filter((f) => f.kind === "update").length,
      warnings: d.warnings
    },
    counts: p,
    warningCount: p.pushes + p.tags + p.consent
  };
}
function Ia() {
  return {
    present: !1,
    pushes: [],
    tags: { items: [], warnings: [] },
    consent: { keys: Hs.map((e) => ({ key: e, default: "", current: "" })), calls: [], updates: 0, warnings: [] },
    counts: { pushes: 0, tags: 0, consent: 0 },
    warningCount: 0
  };
}
function Qu(e) {
  try {
    const t = JSON.parse(e && e.getItem(cs) || "[]");
    return Array.isArray(t) ? t.map((n) => ({ ...n, current: !1 })) : [];
  } catch {
    return [];
  }
}
function ep(e, t, n, s) {
  if (e)
    try {
      if (s === te) {
        e.removeItem(cs);
        return;
      }
      let a = [...t, ...n].slice(-ju).map((r) => ({ ...r, current: !1 })), i = JSON.stringify(a);
      for (; i.length > Uu && a.length > 0; )
        a = a.slice(Math.ceil(a.length / 4)), i = JSON.stringify(a);
      e.setItem(cs, i);
    } catch {
    }
}
let Kt = null;
function Da() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
function tp() {
  const e = window.__siteationDebugBar;
  return e && Array.isArray(e.pushes) ? e : { pushes: [], requests: [] };
}
function np(e) {
  const t = window.__siteationDebugBar;
  t && (t.onPush = e);
}
function sp(e) {
  const t = tp();
  Kt === null && (Kt = Qu(Da()));
  let n = [];
  try {
    n = window.google_tag_manager ? Object.keys(window.google_tag_manager) : [];
  } catch {
    n = [];
  }
  const s = Yu({
    pushes: t.pushes,
    requests: t.requests || [],
    doc: document,
    loaded: n,
    policy: e,
    page: window.location.pathname,
    present: Array.isArray(window.dataLayer)
  });
  return ep(Da(), Kt, s.pushes, e), { model: s, earlier: Kt };
}
const ap = 1e3, xr = "siteation.debugbar.v1", ip = "__PROFILE_ID__";
function rp() {
  const e = document.getElementById("siteation-debugbar-profile");
  if (!e) return {};
  try {
    return JSON.parse(e.textContent || "{}");
  } catch {
    return {};
  }
}
function op() {
  const e = { open: !1, section: "overview" };
  try {
    return { ...e, ...JSON.parse(localStorage.getItem(xr) || "{}") };
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
function lp() {
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
    seo: Pa(),
    seoError: "",
    /** @type {Array<number>} */
    schemaExpanded: [],
    schemaCopyState: "",
    schemaFallback: "",
    dataLayerTab: "pushes",
    dataLayer: Ia(),
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
      this.profile = rp(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const e = op();
      this.collapsed = !!e.collapsed, this.open = e.open && !this.collapsed, this.section = e.section, this.placement = e.placement === "top" ? "top" : "bottom", this.dockPosition = Bc(e.dockPosition) ? e.dockPosition : null, this.maximised = !!e.maximised, this.theme = ["system", "light", "dark"].includes(e.theme) ? e.theme : "system", this.favourites = Array.isArray(e.favourites) ? e.favourites.filter((t) => an.some((n) => n.id === t)) : [], this.watchColorScheme(), this.valuePolicy = rd(this.rootElement()?.dataset.valuePolicy), this.editorTemplate = this.rootElement()?.dataset.editor || "", this.editorRoot = this.rootElement()?.dataset.editorRoot || "", this.refreshAlpine(), this.refreshMagewire(), this.listenToMagewire(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.$watch("paletteSearch", () => {
        this.paletteIndex = 0;
      }), this.$watch("section", (t) => {
        t === "history" && this.loadHistory(), t === "seo" && this.refreshSeo(), t === "datalayer" && this.refreshDataLayer();
      }), this.scheduleSeo(), this.collects("datalayer") && (this.refreshDataLayer(), np(() => {
        this.dataLayerTimer || (this.dataLayerTimer = setTimeout(() => {
          this.dataLayerTimer = null, this.refreshDataLayer();
        }, 50));
      })), this.open && this.section === "history" && this.loadHistory(), this.$watch("activeId", () => {
        this.comparison = null, this.baselineId = "";
      }), document.addEventListener("keydown", (t) => this.paletteShortcut(t)), this.open && this.$nextTick(() => this.lock()), this.requests = qc((t) => {
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
      return t ? t.replace(ip, encodeURIComponent(e)) : null;
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
          const { profile: n, payloads: s } = await ka(t);
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
          const n = await is(t);
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
        this.comparison = await is(n);
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
      return Cd(e);
    },
    /**
     * @param {object} metric
     * @param {'baseline'|'subject'} side which profile's value the cell shows
     * @returns {string}
     */
    metricValue(e, t) {
      return Nd(e, t);
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
      return Od(e);
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
      return Md(e);
    },
    /**
     * @param {string} url
     * @returns {string}
     */
    shortUrl(e) {
      return Td(e, window.location.origin);
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
          this.payloads = (await ka(e)).payloads;
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
      return Vc(this);
    },
    /** @returns {Array<object>} */
    get visibleCommands() {
      return Yc(this.commands, this.paletteSearch);
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
      return Wc(this.rootElement()?.dataset.sections).map((e) => ({ ...e, count: sr(e.id, this) }));
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
      !t.moved && !Gc(n, s) || (t.moved = !0, this.draggingDock = !0, this.dockPosition = Pn(
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
      this.dockPosition = Pn(
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
      this.dockPosition = Pn(
        this.dockPosition,
        t,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), (n.left !== this.dockPosition.left || n.top !== this.dockPosition.top || s !== this.placement) && this.persist();
    },
    /** Keep the edge-bound inspector and bubble near the freely positioned dock. */
    updatePlacementFromDock() {
      const e = this.$refs.dock;
      !this.dockPosition || !e || (this.placement = Fc(
        this.dockPosition,
        e.getBoundingClientRect(),
        window.innerHeight
      ));
    },
    openInspector() {
      this.open || (this.collapsed = !1, this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), Uc(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus(), this.scheduleDockConstraint());
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
      jc(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(e) {
      if (e.key === "Escape") {
        this.closeInspector();
        return;
      }
      va(e, this.$refs.sheet);
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
      this.magewireHealth = Dd(), this.magewireComponents = Pd(this.valuePolicy), this.magewireExpanded.forEach((e) => {
        this.magewireStates[e] = Sa(e, this.valuePolicy);
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
      Aa(e) || document.addEventListener("magewire:load", () => {
        Aa(e), this.refreshMagewire();
      }, { once: !0, passive: !0 });
    },
    /** @param {string} id */
    toggleMagewireComponent(e) {
      if (this.magewireExpanded.includes(e)) {
        this.magewireExpanded = this.magewireExpanded.filter((t) => t !== e), delete this.magewireStates[e];
        return;
      }
      this.magewireExpanded = [...this.magewireExpanded, e], this.magewireStates[e] = Sa(e, this.valuePolicy);
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
      qd(e, t);
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
        this.seo = Lu(e), this.seoError = "";
      } catch (t) {
        this.seo = Pa(), this.seoError = String(t && t.message || t);
      }
    },
    /**
     * @param {string} view
     * @param {number} index
     * @param {boolean} on
     */
    highlightSeo(e, t, n) {
      ls(e, t, n);
    },
    /**
     * @param {string} view
     * @param {number} index
     */
    revealSeo(e, t) {
      Iu(e, t);
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
      e.source === "microdata" && ls("schema", e.block, t);
    },
    /**
     * The validators cannot fetch a dev shop, so what they need goes on the clipboard to be
     * pasted into their code mode instead.
     *
     * @returns {Promise<void>}
     */
    async copySchemaMarkup() {
      const e = Pu();
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
          const { model: e, earlier: t } = sp(this.valuePolicy);
          e.pushes.forEach((n) => {
            n.key = `c${n.index}`;
          }), this.dataLayer = e, this.dataLayerEarlier = t.map((n, s) => ({ ...n, key: `e${s}` })), this.dataLayerError = "";
        } catch (e) {
          this.dataLayer = Ia(), this.dataLayerError = String(e && e.message || e);
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
      this.alpineHealth = Kd(), this.alpineComponents = Gd(this.valuePolicy), this.alpineStores = Wd(this.valuePolicy), this.alpineErrors = zd(this.valuePolicy), this.alpineExpanded.forEach((e) => {
        this.alpineStates[e] = Ca(e, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, ap);
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
      this.alpineExpanded = [...this.alpineExpanded, e], this.alpineStates[e] = Ca(e, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(e, t) {
      Vd(e, t);
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
      va(e, this.$refs.palette);
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
        localStorage.setItem(xr, JSON.stringify({
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
      return Ps(e, t);
    },
    /**
     * @param {object} plugin
     * @returns {string}
     */
    methodList(e) {
      return Rd(e);
    },
    /**
     * @param {unknown} code
     * @param {string} language
     * @returns {string} HTML for x-html, escaped by the highlighter
     */
    highlight(e, t) {
      return Sd(e, t);
    },
    /**
     * @param {string} file
     * @param {number} line
     * @returns {string}
     */
    editorUrl(e, t) {
      return cr(this.editorTemplate, this.editorRoot, e, t);
    },
    /**
     * @param {string} location
     * @returns {string}
     */
    locationUrl(e) {
      return $d(this.editorTemplate, this.editorRoot, e);
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
      return Ad(e, t, n);
    },
    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(e) {
      return Is(e);
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
function qa({ sheet: e }) {
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
function ja(e, t) {
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
function cp() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${ja("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${ja("otherSections", !1)}
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
const dp = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme"
     data-ndb-on:resize.window="constrainDock()">

  <div class="ndb-dock" data-ndb-ref="dock"
       data-ndb-show="!open && !dismissed && !collapsed" data-ndb-cloak
       data-ndb-bind:class="draggingDock && 'is-dragging'"
       data-ndb-bind:style="dockStyle"
       title="Open the inspector" data-ndb-on:click="openFromBar($event)">
    ${qa({ sheet: !1 })}
  </div>

  <button type="button" class="ndb-bubble" data-ndb-show="collapsed && !dismissed" data-ndb-cloak
          data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
          data-ndb-on:click="expand()"
          aria-label="Show the debug bar" title="Show the debug bar">
    ${q("pulse")}
    <span class="ndb-badge" data-ndb-show="findings.length > 0"
          data-ndb-text="findings.length"></span>
  </button>

  ${Qc()}

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${qa({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${q("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${cp()}

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
`, up = "data-ndb-", Ua = "siteation-debugbar";
function pp(e) {
  const t = e.attachShadow({ mode: "open" }), n = e.dataset.css;
  if (n) {
    const a = document.createElement("link");
    a.rel = "stylesheet", a.href = n, t.append(a);
  }
  const s = document.createElement("div");
  return s.innerHTML = dp, t.append(...s.children), t.querySelector(".ndb");
}
class hp extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const t = pp(this);
    t && _t.initTree(t);
  }
}
customElements.get(Ua) || (_t.prefix(up), _t.data("debugBar", lp), _t.directive("code", (e, { expression: t }, { effect: n, evaluateLater: s }) => {
  const a = s(t);
  n(() => a((i) => {
    e.innerHTML = typeof i == "string" ? i : "";
  }));
}), customElements.define(Ua, hp));
jn && (window.Alpine = jn);
