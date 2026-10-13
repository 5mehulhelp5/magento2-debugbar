const Wn = window.Alpine;
var Gn = !1, Vn = !1, me = [], zn = -1, Qt = !1, ga = !1;
function Co(e) {
  Lo(e);
}
function Mo() {
  ga = !0;
}
function No() {
  ga = !1, Js();
}
function Lo(e) {
  me.includes(e) || (me.push(e), e._x_schedulerPriority !== void 0 && (Qt = !0)), Js();
}
function Ro(e) {
  let t = me.indexOf(e);
  t !== -1 && t > zn && me.splice(t, 1);
}
function Js() {
  if (!Vn && !Gn) {
    if (ga)
      return;
    Gn = !0, queueMicrotask($o);
  }
}
function $o() {
  Gn = !1, Vn = !0;
  for (let e = 0; e < me.length; e++)
    Qt && Po(e), me[e](), zn = e;
  me.length = 0, zn = -1, Qt = !1, Vn = !1;
}
function Po(e) {
  let t = /* @__PURE__ */ new Map(), n = me.slice(e).sort((a, s) => Io(a, s, t));
  for (let a = 0; a < n.length; a++)
    me[e + a] = n[a];
  Qt = !1;
}
function Io(e, t, n) {
  return Rn(e) ? Rn(t) ? ps(e._x_schedulerPriority.el, n) - ps(t._x_schedulerPriority.el, n) || e._x_schedulerPriority.order - t._x_schedulerPriority.order : -1 : Rn(t) ? 1 : 0;
}
function Rn(e) {
  return e._x_schedulerPriority !== void 0;
}
function ps(e, t) {
  if (t.has(e))
    return t.get(e);
  let n = 0, a = e;
  for (; e; )
    n++, e._x_teleportBack ? e = e._x_teleportBack : typeof ShadowRoot == "function" && e.parentNode instanceof ShadowRoot ? e = e.parentNode.host : e = e.parentElement;
  return t.set(a, n), n;
}
var it, Ke, rt, Xs, Do = 0, Kn = !0;
function qo(e) {
  Kn = !1, e(), Kn = !0;
}
function jo(e) {
  it = e.reactive, rt = e.release, Ke = (t) => e.effect(t, { scheduler: (n) => {
    Kn ? Co(n) : n();
  } }), Xs = e.raw;
}
function fs(e) {
  Ke = e;
}
function Uo(e) {
  let t = () => {
  };
  return [(a, s) => {
    let i = s?.priority === "structural" ? Do++ : void 0, r = Ke(a);
    return i !== void 0 && r !== void 0 && (r._x_schedulerPriority = { el: e, order: i }), e._x_effects || (e._x_effects = /* @__PURE__ */ new Set(), e._x_runEffects = () => {
      e._x_effects.forEach((o) => o());
    }), e._x_effects.add(r), t = () => {
      r !== void 0 && (e._x_effects.delete(r), rt(r));
    }, r;
  }, () => {
    t();
  }];
}
function Zs(e, t) {
  let n = !0, a, s, i = Ke(() => {
    let r = e(), o = JSON.stringify(r);
    if (!n && (typeof r == "object" || r !== a)) {
      let l = typeof a == "object" ? JSON.parse(s) : a;
      queueMicrotask(() => {
        t(r, l);
      });
    }
    a = r, s = o, n = !1;
  });
  return () => rt(i);
}
async function Bo(e) {
  Mo();
  try {
    await e(), await Promise.resolve();
  } finally {
    No();
  }
}
var Ys = [], Qs = [], ei = [];
function Fo(e) {
  ei.push(e);
}
function ma(e, t) {
  typeof t == "function" ? (e._x_cleanups || (e._x_cleanups = []), e._x_cleanups.push(t)) : (t = e, Qs.push(t));
}
function ti(e) {
  Ys.push(e);
}
function ni(e, t, n) {
  e._x_attributeCleanups || (e._x_attributeCleanups = {}), e._x_attributeCleanups[t] || (e._x_attributeCleanups[t] = []), e._x_attributeCleanups[t].push(n);
}
function ai(e, t) {
  e._x_attributeCleanups && Object.entries(e._x_attributeCleanups).forEach(([n, a]) => {
    (t === void 0 || t.includes(n)) && (a.forEach((s) => s()), delete e._x_attributeCleanups[n]);
  });
}
function Ho(e) {
  for (e._x_effects?.forEach(Ro); e._x_cleanups?.length; )
    e._x_cleanups.pop()();
}
var ya = new MutationObserver(xa), va = !1;
function wa() {
  ya.observe(document, { subtree: !0, childList: !0, attributes: !0, attributeOldValue: !0 }), va = !0;
}
function si() {
  Wo(), ya.disconnect(), va = !1;
}
var ut = [];
function Wo() {
  let e = ya.takeRecords();
  ut.push(() => e.length > 0 && xa(e));
  let t = ut.length;
  queueMicrotask(() => {
    if (ut.length === t)
      for (; ut.length > 0; )
        ut.shift()();
  });
}
function B(e) {
  if (!va)
    return e();
  si();
  let t = e();
  return wa(), t;
}
var _a = !1, en = [];
function Go() {
  _a = !0;
}
function Vo() {
  _a = !1, xa(en), en = [];
}
function xa(e) {
  if (_a) {
    en = en.concat(e);
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
    ai(r, i);
  }), a.forEach((i, r) => {
    Ys.forEach((o) => o(r, i));
  });
  for (let i of n)
    t.some((r) => r.contains(i)) || Qs.forEach((r) => r(i));
  for (let i of t)
    i.isConnected && ei.forEach((r) => r(i));
  t = null, n = null, a = null, s = null;
}
function ii(e) {
  return Ue(at(e));
}
function Mt(e, t, n) {
  return e._x_dataStack = [t, ...at(n || e)], () => {
    e._x_dataStack = e._x_dataStack.filter((a) => a !== t);
  };
}
function at(e) {
  return e._x_dataStack ? e._x_dataStack : typeof ShadowRoot == "function" && e instanceof ShadowRoot ? at(e.host) : e.parentNode ? at(e.parentNode) : [];
}
function Ue(e) {
  return new Proxy({ objects: e }, zo);
}
function ri(e, t) {
  return e === null || e === Object.prototype ? null : Object.prototype.hasOwnProperty.call(e, t) ? e : ri(Object.getPrototypeOf(e), t);
}
var zo = {
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
    return t == "toJSON" ? Ko : Reflect.get(
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
      if (s = ri(r, t), s)
        break;
    s || (s = e[e.length - 1]);
    const i = Object.getOwnPropertyDescriptor(s, t);
    return i?.set && i?.get ? i.set.call(a, n) || !0 : Reflect.set(s, t, n);
  }
};
function Ko() {
  return Reflect.ownKeys(this).reduce((t, n) => (t[n] = Reflect.get(this, n), t), {});
}
function ka(e, t = () => {
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
function oi(e, t = () => {
}) {
  let n = {
    initialValue: void 0,
    _x_interceptor: !0,
    initialize(a, s, i, r) {
      return e(this.initialValue, () => Jo(a, s), (o) => Jn(a, s, o), s, i, r);
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
function Jo(e, t) {
  return t.split(".").reduce((n, a) => n[a], e);
}
function Jn(e, t, n) {
  if (typeof t == "string" && (t = t.split(".")), t.length === 1)
    e[t[0]] = n;
  else {
    if (t.length === 0)
      throw error;
    return e[t[0]] || (e[t[0]] = {}), Jn(e[t[0]], t.slice(1), n);
  }
}
var li = {};
function ie(e, t) {
  li[e] = t;
}
function tn(e, t) {
  let n = Xo(t);
  return Object.entries(li).forEach(([a, s]) => {
    Object.defineProperty(e, `$${a}`, {
      get() {
        return s(t, n);
      },
      enumerable: !1
    });
  }), e;
}
function Xo(e) {
  let [t, n] = bi(e), a = { interceptor: oi, ...t };
  return ma(e, n), a;
}
function Zo(e, t, n, ...a) {
  try {
    return n(...a);
  } catch (s) {
    Ea(s, e, t);
  }
}
function Ea(...e) {
  return di(...e);
}
var di = Qo;
function Yo(e) {
  di = e;
}
function Qo(e, t, n = void 0) {
  e = Object.assign(
    e ?? { message: "No error message given." },
    { el: t, expression: n }
  ), console.warn(`Alpine Expression Error: ${e.message}

${n ? 'Expression: "' + n + `"

` : ""}`, t), setTimeout(() => {
    throw e;
  }, 0);
}
var Ie = !0;
function ci(e) {
  let t = Ie;
  Ie = !1;
  let n = e();
  return Ie = t, n;
}
function De(e, t, n = {}) {
  let a;
  return Z(e, t)((s) => a = s, n), a;
}
function Z(...e) {
  return ui(...e);
}
var ui = () => {
};
function el(e) {
  ui = e;
}
var hi;
function tl(e) {
  hi = e;
}
function nl(e, t) {
  return (n = () => {
  }, { scope: a = {}, params: s = [], context: i } = {}) => {
    if (!Ie) {
      Xn(n, t, Ue([a, ...e]), s);
      return;
    }
    let r = t.apply(Ue([a, ...e]), s);
    Xn(n, r);
  };
}
function Xn(e, t, n, a, s) {
  if (Ie && typeof t == "function") {
    let i = t.apply(n, a);
    i instanceof Promise ? i.then((r) => Xn(e, r, n, a)).catch((r) => Ea(r, s, t)) : e(i);
  } else typeof t == "object" && t instanceof Promise ? t.then((i) => e(i)) : e(t);
}
function al(...e) {
  return hi(...e);
}
var Sa = "x-";
function ot(e = "") {
  return Sa + e;
}
function sl(e) {
  Sa = e;
}
var nn = {};
function F(e, t) {
  return nn[e] = t, {
    before(n) {
      if (!nn[n]) {
        console.warn(String.raw`Cannot find directive \`${n}\`. \`${e}\` will use the default order of execution`);
        return;
      }
      const a = $e.indexOf(n);
      $e.splice(a >= 0 ? a : $e.indexOf("DEFAULT"), 0, e);
    }
  };
}
function il(e) {
  return Object.keys(nn).includes(e);
}
function Aa(e, t, n) {
  if (t = Array.from(t), e._x_virtualDirectives) {
    let i = Object.entries(e._x_virtualDirectives).map(([o, l]) => ({ name: o, value: l })), r = pi(i);
    i = i.map((o) => r.find((l) => l.name === o.name) ? {
      name: `x-bind:${o.name}`,
      value: `"${o.value}"`
    } : o), t = t.concat(i);
  }
  let a = {};
  return t.map(yi((i, r) => a[i] = r)).filter(wi).map(ll(a, n)).sort(dl).map((i) => ol(e, i));
}
function pi(e) {
  return Array.from(e).map(yi()).filter((t) => !wi(t));
}
var Zn = !1, gt = /* @__PURE__ */ new Map(), fi = /* @__PURE__ */ Symbol();
function rl(e) {
  Zn = !0;
  let t = /* @__PURE__ */ Symbol();
  fi = t, gt.set(t, []);
  let n = () => {
    for (; gt.get(t).length; )
      gt.get(t).shift()();
    gt.delete(t);
  }, a = () => {
    Zn = !1, n();
  };
  e(n), a();
}
function bi(e) {
  let t = [], n = (o) => t.push(o), [a, s] = Uo(e);
  return t.push(s), [{
    Alpine: lt,
    effect: a,
    cleanup: n,
    evaluateLater: Z.bind(Z, e),
    evaluate: De.bind(De, e)
  }, () => t.forEach((o) => o())];
}
function ol(e, t) {
  let n = () => {
  }, a = nn[t.type] || n, [s, i] = bi(e);
  ni(e, t.original, i);
  let r = () => {
    e._x_ignore || e._x_ignoreSelf || (a.inline && a.inline(e, t, s), a = a.bind(a, e, t, s), Zn ? gt.get(fi).push(a) : a());
  };
  return r.runCleanups = i, r;
}
var gi = (e, t) => ({ name: n, value: a }) => (n.startsWith(e) && (n = n.replace(e, t)), { name: n, value: a }), mi = (e) => e;
function yi(e = () => {
}) {
  return ({ name: t, value: n }) => {
    let { name: a, value: s } = vi.reduce((i, r) => r(i), { name: t, value: n });
    return a !== t && e(a, t), { name: a, value: s };
  };
}
var vi = [];
function Ta(e) {
  vi.push(e);
}
function wi({ name: e }) {
  return _i().test(e);
}
var _i = () => new RegExp(`^${Sa}([^:^.]+)\\b`);
function ll(e, t) {
  return ({ name: n, value: a }) => {
    n === a && (a = "");
    let s = n.match(_i()), i = n.match(/:([a-zA-Z0-9\-_:]+)/), r = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [], o = t || e[n] || n;
    return {
      type: s ? s[1] : null,
      value: i ? i[1] : null,
      modifiers: r.map((l) => l.replace(".", "")),
      expression: a,
      original: o
    };
  };
}
var Yn = "DEFAULT", $e = [
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
  Yn,
  "teleport"
];
function dl(e, t) {
  let n = $e.indexOf(e.type) === -1 ? Yn : e.type, a = $e.indexOf(t.type) === -1 ? Yn : t.type;
  return $e.indexOf(n) - $e.indexOf(a);
}
function mt(e, t, n = {}, a = {}) {
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
function Be(e, t) {
  if (typeof ShadowRoot == "function" && e instanceof ShadowRoot) {
    Array.from(e.children).forEach((s) => Be(s, t));
    return;
  }
  let n = !1;
  if (t(e, () => n = !0), n)
    return;
  let a = e.firstElementChild;
  for (; a; )
    Be(a, t), a = a.nextElementSibling;
}
function ce(e, ...t) {
  console.warn(`Alpine Warning: ${e}`, ...t);
}
var bs = !1;
function cl() {
  bs && ce("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), bs = !0, document.body || ce("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), mt(document, "alpine:init"), mt(document, "alpine:initializing"), wa(), Fo((t) => ve(t, Be)), ma((t) => Je(t)), ti((t, n) => {
    Aa(t, n).forEach((a) => a());
  });
  let e = (t) => !fn(t.parentElement, !0);
  Array.from(document.querySelectorAll(Ei().join(","))).filter(e).forEach((t) => {
    ve(t);
  }), mt(document, "alpine:initialized"), setTimeout(() => {
    fl();
  });
}
var Oa = [], xi = [];
function ki() {
  return Oa.map((e) => e());
}
function Ei() {
  return Oa.concat(xi).map((e) => e());
}
function Si(e) {
  Oa.push(e);
}
function Ai(e) {
  xi.push(e);
}
function fn(e, t = !1) {
  return ye(e, (n) => {
    if ((t ? Ei() : ki()).some((s) => n.matches(s)))
      return !0;
  });
}
function ye(e, t) {
  if (e) {
    if (t(e))
      return e;
    if (e._x_teleportBack)
      return ye(e._x_teleportBack, t);
    if (e.parentNode instanceof ShadowRoot)
      return ye(e.parentNode.host, t);
    if (e.parentElement)
      return ye(e.parentElement, t);
  }
}
function ul(e) {
  return ki().some((t) => e.matches(t));
}
var Ti = [];
function hl(e) {
  Ti.push(e);
}
var pl = 1;
function ve(e, t = Be, n = () => {
}) {
  ye(e, (a) => a._x_ignore) || rl(() => {
    t(e, (a, s) => {
      a._x_marker || (n(a, s), Ti.forEach((i) => i(a, s)), Aa(a, a.attributes).forEach((i) => i()), a._x_ignore || (a._x_marker = pl++), a._x_ignore && s());
    });
  });
}
function Je(e, t = Be) {
  t(e, (n) => {
    Ho(n), ai(n), delete n._x_marker;
  });
}
function fl() {
  [
    ["ui", "dialog", ["[x-dialog], [x-popover]"]],
    ["anchor", "anchor", ["[x-anchor]"]],
    ["sort", "sort", ["[x-sort]"]]
  ].forEach(([t, n, a]) => {
    il(n) || a.some((s) => {
      if (document.querySelector(s))
        return ce(`found "${s}", but missing ${t} plugin`), !0;
    });
  });
}
var Qn = [], Ca = !1;
function Ma(e = () => {
}) {
  return queueMicrotask(() => {
    Ca || setTimeout(() => {
      ea();
    });
  }), new Promise((t) => {
    Qn.push(() => {
      e(), t();
    });
  });
}
function ea() {
  for (Ca = !1; Qn.length; )
    Qn.shift()();
}
function bl() {
  Ca = !0;
}
function Na(e, t) {
  return Array.isArray(t) ? gs(e, t.join(" ")) : typeof t == "object" && t !== null ? gl(e, t) : typeof t == "function" ? Na(e, t()) : gs(e, t);
}
function ta(e) {
  return e.split(/\s/).filter(Boolean);
}
function gs(e, t) {
  let n = (s) => ta(s).filter((i) => !e.classList.contains(i)).filter(Boolean), a = (s) => (e.classList.add(...s), () => {
    e.classList.remove(...s);
  });
  return t = t === !0 ? t = "" : t || "", a(n(t));
}
function gl(e, t) {
  let n = Object.entries(t).flatMap(([r, o]) => o ? ta(r) : !1).filter(Boolean), a = Object.entries(t).flatMap(([r, o]) => o ? !1 : ta(r)).filter(Boolean), s = [], i = [];
  return a.forEach((r) => {
    e.classList.contains(r) && (e.classList.remove(r), i.push(r));
  }), n.forEach((r) => {
    e.classList.contains(r) || (e.classList.add(r), s.push(r));
  }), () => {
    i.forEach((r) => e.classList.add(r)), s.forEach((r) => e.classList.remove(r));
  };
}
function bn(e, t) {
  return typeof t == "object" && t !== null ? ml(e, t) : yl(e, t);
}
function ml(e, t) {
  let n = {};
  return Object.entries(t).forEach(([a, s]) => {
    n[a] = e.style[a], a.startsWith("--") || (a = vl(a)), e.style.setProperty(a, s);
  }), setTimeout(() => {
    e.style.length === 0 && e.removeAttribute("style");
  }), () => {
    bn(e, n);
  };
}
function yl(e, t) {
  let n = e.getAttribute("style", t);
  return e.setAttribute("style", t), () => {
    e.setAttribute("style", n || "");
  };
}
function vl(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function na(e, t = () => {
}) {
  let n = !1;
  return function() {
    n ? t.apply(this, arguments) : (n = !0, e.apply(this, arguments));
  };
}
F("transition", (e, { value: t, modifiers: n, expression: a }, { evaluate: s }) => {
  typeof a == "function" && (a = s(a)), a !== !1 && (!a || typeof a == "boolean" ? _l(e, n, t) : wl(e, a, t));
});
function wl(e, t, n) {
  Oi(e, Na, ""), {
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
function _l(e, t, n) {
  Oi(e, bn);
  let a = !t.includes("in") && !t.includes("out") && !n, s = a || t.includes("in") || ["enter"].includes(n), i = a || t.includes("out") || ["leave"].includes(n);
  t.includes("in") && !a && (t = t.filter((S, L) => L < t.indexOf("out"))), t.includes("out") && !a && (t = t.filter((S, L) => L > t.indexOf("out")));
  let r = !t.includes("opacity") && !t.includes("scale"), o = r || t.includes("opacity"), l = r || t.includes("scale"), d = o ? 0 : 1, u = l ? ht(t, "scale", 95) / 100 : 1, h = ht(t, "delay", 0) / 1e3, p = ht(t, "origin", "center"), w = "opacity, transform", C = ht(t, "duration", 150) / 1e3, m = ht(t, "duration", 75) / 1e3, g = "cubic-bezier(0.4, 0.0, 0.2, 1)";
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
function Oi(e, t, n = {}) {
  e._x_transition || (e._x_transition = {
    enter: { during: n, start: n, end: n },
    leave: { during: n, start: n, end: n },
    in(a = () => {
    }, s = () => {
    }) {
      aa(e, t, {
        during: this.enter.during,
        start: this.enter.start,
        end: this.enter.end
      }, a, s);
    },
    out(a = () => {
    }, s = () => {
    }) {
      aa(e, t, {
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
    let r = Ci(e);
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
function Ci(e) {
  let t = e.parentNode;
  if (t)
    return t._x_hidePromise ? t : Ci(t);
}
function aa(e, t, { during: n, start: a, end: s } = {}, i = () => {
}, r = () => {
}) {
  if (e._x_transitioning && e._x_transitioning.cancel(), Object.keys(n).length === 0 && Object.keys(a).length === 0 && Object.keys(s).length === 0) {
    i(), r();
    return;
  }
  let o, l, d;
  xl(e, {
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
function xl(e, t) {
  let n, a, s, i = na(() => {
    B(() => {
      n = !0, a || t.before(), s || (t.end(), ea()), t.after(), e.isConnected && t.cleanup(), delete e._x_transitioning;
    });
  });
  e._x_transitioning = {
    beforeCancels: [],
    beforeCancel(r) {
      this.beforeCancels.push(r);
    },
    cancel: na(function() {
      for (; this.beforeCancels.length; )
        this.beforeCancels.shift()();
      i();
    }),
    finish: i
  }, B(() => {
    t.start(), t.during();
  }), bl(), requestAnimationFrame(() => {
    if (n)
      return;
    let r = Number(getComputedStyle(e).transitionDuration.replace(/,.*/, "").replace("s", "")) * 1e3, o = Number(getComputedStyle(e).transitionDelay.replace(/,.*/, "").replace("s", "")) * 1e3;
    r === 0 && (r = Number(getComputedStyle(e).animationDuration.replace("s", "")) * 1e3), B(() => {
      t.before();
    }), a = !0, requestAnimationFrame(() => {
      n || (B(() => {
        t.end();
      }), ea(), setTimeout(e._x_transitioning.finish, r + o), s = !0);
    });
  });
}
function ht(e, t, n) {
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
var Ae = !1;
function Te(e, t = () => {
}) {
  return (...n) => Ae ? t(...n) : e(...n);
}
function kl(e) {
  return (...t) => Ae && e(...t);
}
var Mi = [];
function gn(e) {
  Mi.push(e);
}
function El(e, t) {
  Mi.forEach((n) => n(e, t)), Ae = !0, Ni(() => {
    ve(t, (n, a) => {
      a(n, () => {
      });
    });
  }), Ae = !1;
}
var sa = !1;
function Sl(e, t) {
  t._x_dataStack || (t._x_dataStack = e._x_dataStack), Ae = !0, sa = !0, Ni(() => {
    Al(t);
  }), Ae = !1, sa = !1;
}
function Al(e) {
  let t = !1;
  ve(e, (a, s) => {
    Be(a, (i, r) => {
      if (t && ul(i))
        return r();
      t = !0, s(i, r);
    });
  });
}
function Ni(e) {
  let t = Ke;
  fs((n, a) => {
    let s = t(n);
    return rt(s), () => {
    };
  }), e(), fs(t);
}
function Li(e, t, n, a = []) {
  switch (e._x_bindings || (e._x_bindings = it({})), e._x_bindings[t] = n, t = a.includes("camel") ? $l(t) : t, t) {
    case "value":
      Tl(e, n);
      break;
    case "style":
      Cl(e, n);
      break;
    case "class":
      Ol(e, n);
      break;
    case "selected":
    case "checked":
      Ml(e, t, n);
      break;
    default:
      La(e, t, n);
      break;
  }
}
function Tl(e, t) {
  if (Ra(e))
    e.attributes.value === void 0 && (e.value = t);
  else if (an(e))
    Number.isInteger(t) ? e.value = t : !Array.isArray(t) && typeof t != "boolean" && ![null, void 0].includes(t) ? e.value = String(t) : Array.isArray(t) ? e.checked = t.some((n) => Pl(n, e.value)) : e.checked = !!t;
  else if (e.tagName === "SELECT")
    Rl(e, t);
  else if (e.tagName === "OPTION")
    La(e, "value", t);
  else {
    if (e.value === t && (typeof t != "object" || t === null))
      return;
    e.value = t === void 0 ? "" : t;
  }
}
function Ol(e, t) {
  e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedClasses = Na(e, t);
}
function Cl(e, t) {
  e._x_undoAddedStyles && e._x_undoAddedStyles(), e._x_undoAddedStyles = bn(e, t);
}
function Ml(e, t, n) {
  La(e, t, n), Ll(e, t, n);
}
function La(e, t, n) {
  [null, void 0, !1].includes(n) && Dl(t) ? e.removeAttribute(t) : (Ri(t) && (n = t), ql(n) && (n = JSON.stringify(n)), Nl(e, t, n));
}
function Nl(e, t, n) {
  e.getAttribute(t) != n && e.setAttribute(t, n);
}
function Ll(e, t, n) {
  e[t] !== n && (e[t] = n);
}
function Rl(e, t) {
  const n = [].concat(t).map((a) => a + "");
  Array.from(e.options).forEach((a) => {
    a.selected = n.includes(a.value);
  });
}
function $l(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function Pl(e, t) {
  return e == t;
}
function Zt(e) {
  return [1, "1", "true", "on", "yes", !0].includes(e) ? !0 : [0, "0", "false", "off", "no", !1].includes(e) ? !1 : e ? !!e : null;
}
var Il = /* @__PURE__ */ new Set([
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
function Ri(e) {
  return Il.has(e);
}
function Dl(e) {
  return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(e);
}
function ql(e) {
  return typeof e == "object" && e !== null;
}
function jl(e, t, n) {
  return e._x_bindings && e._x_bindings[t] !== void 0 ? e._x_bindings[t] : $i(e, t, n);
}
function Ul(e, t, n, a = !0) {
  if (e._x_bindings && e._x_bindings[t] !== void 0)
    return e._x_bindings[t];
  if (e._x_inlineBindings && e._x_inlineBindings[t] !== void 0) {
    let s = e._x_inlineBindings[t];
    return s.extract = a, ci(() => De(e, s.expression));
  }
  return $i(e, t, n);
}
function $i(e, t, n) {
  let a = e.getAttribute(t);
  return a === null ? typeof n == "function" ? n() : n : a === "" ? !0 : Ri(t) ? !![t, "true"].includes(a) : a;
}
function an(e) {
  return e.type === "checkbox" || e.localName === "ui-checkbox" || e.localName === "ui-switch";
}
function Ra(e) {
  return e.type === "radio" || e.localName === "ui-radio";
}
function Pi(e, t) {
  let n;
  return function() {
    const a = this, s = arguments, i = function() {
      n = null, e.apply(a, s);
    };
    clearTimeout(n), n = setTimeout(i, t);
  };
}
function Ii(e, t) {
  let n;
  return function() {
    let a = this, s = arguments;
    n || (e.apply(a, s), n = !0, setTimeout(() => n = !1, t));
  };
}
function Di({ get: e, set: t }, { get: n, set: a }) {
  let s = !0, i, r = Ke(() => {
    let o = e(), l = n();
    if (s)
      a($n(o)), s = !1;
    else {
      let d = JSON.stringify(o), u = JSON.stringify(l);
      d !== i ? a($n(o)) : d !== u && t($n(l));
    }
    i = JSON.stringify(e()), JSON.stringify(n());
  });
  return () => {
    rt(r);
  };
}
function $n(e) {
  return typeof e == "object" ? JSON.parse(JSON.stringify(e)) : e;
}
function Bl(e) {
  (Array.isArray(e) ? e : [e]).forEach((n) => n(lt));
}
var ge = {}, ms = !1;
function Fl(e, t) {
  if (ms || (ge = it(ge), ms = !0), t === void 0)
    return ge[e];
  ge[e] = t, typeof t == "object" && t !== null && t._x_interceptor ? ge[e] = t.initialize(ge, e, e, () => {
  }) : ka(ge[e]), typeof t == "object" && t !== null && t.hasOwnProperty("init") && typeof t.init == "function" && ge[e].init();
}
function Hl() {
  return ge;
}
var qi = {};
function Wl(e, t) {
  let n = typeof t != "function" ? () => t : t;
  return e instanceof Element ? ji(e, n()) : (qi[e] = n, () => {
  });
}
function Gl(e) {
  return Object.entries(qi).forEach(([t, n]) => {
    Object.defineProperty(e, t, {
      get() {
        return (...a) => n(...a);
      }
    });
  }), e;
}
function ji(e, t, n) {
  let a = [];
  for (; a.length; )
    a.pop()();
  let s = Object.entries(t).map(([r, o]) => ({ name: r, value: o })), i = pi(s);
  return s = s.map((r) => i.find((o) => o.name === r.name) ? {
    name: `x-bind:${r.name}`,
    value: `"${r.value}"`
  } : r), Aa(e, s, n).map((r) => {
    a.push(r.runCleanups), r();
  }), () => {
    for (; a.length; )
      a.pop()();
  };
}
var Ui = {};
function Vl(e, t) {
  Ui[e] = t;
}
function zl(e, t) {
  return Object.entries(Ui).forEach(([n, a]) => {
    Object.defineProperty(e, n, {
      get() {
        return (...s) => a.bind(t)(...s);
      },
      enumerable: !1
    });
  }), e;
}
var Kl = {
  get reactive() {
    return it;
  },
  get release() {
    return rt;
  },
  get effect() {
    return Ke;
  },
  get raw() {
    return Xs;
  },
  get transaction() {
    return Bo;
  },
  version: "3.16.2",
  flushAndStopDeferringMutations: Vo,
  dontAutoEvaluateFunctions: ci,
  disableEffectScheduling: qo,
  startObservingMutations: wa,
  stopObservingMutations: si,
  setReactivityEngine: jo,
  onAttributeRemoved: ni,
  onAttributesAdded: ti,
  closestDataStack: at,
  skipDuringClone: Te,
  onlyDuringClone: kl,
  addRootSelector: Si,
  addInitSelector: Ai,
  setErrorHandler: Yo,
  interceptClone: gn,
  addScopeToNode: Mt,
  deferMutations: Go,
  mapAttributes: Ta,
  evaluateLater: Z,
  interceptInit: hl,
  initInterceptors: ka,
  injectMagics: tn,
  setEvaluator: el,
  setRawEvaluator: tl,
  mergeProxies: Ue,
  extractProp: Ul,
  findClosest: ye,
  onElRemoved: ma,
  closestRoot: fn,
  destroyTree: Je,
  interceptor: oi,
  // INTERNAL: not public API and is subject to change without major release.
  transition: aa,
  // INTERNAL
  setStyles: bn,
  // INTERNAL
  mutateDom: B,
  directive: F,
  entangle: Di,
  throttle: Ii,
  debounce: Pi,
  evaluate: De,
  evaluateRaw: al,
  initTree: ve,
  nextTick: Ma,
  prefixed: ot,
  prefix: sl,
  plugin: Bl,
  magic: ie,
  store: Fl,
  start: cl,
  clone: Sl,
  // INTERNAL
  cloneNode: El,
  // INTERNAL
  bound: jl,
  $data: ii,
  watch: Zs,
  walk: Be,
  data: Vl,
  bind: Wl
}, lt = Kl, ys = /* @__PURE__ */ new WeakMap(), Bi = /* @__PURE__ */ new Set();
Object.getOwnPropertyNames(globalThis).forEach((e) => {
  e === "styleMedia" || e === "sharedStorage" || Bi.add(globalThis[e]);
});
var G = class {
  constructor(e, t, n, a) {
    this.type = e, this.value = t, this.start = n, this.end = a;
  }
}, Jl = class {
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
}, Xl = class {
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
}, Zl = class {
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
    if (e !== null && !(typeof e != "object" && typeof e != "function") && !ys.has(e)) {
      if (e instanceof HTMLIFrameElement || e instanceof HTMLScriptElement)
        throw new Error("Accessing iframes and scripts is prohibited in the CSP build");
      if (Bi.has(e))
        throw new Error("Accessing global variables is prohibited in the CSP build");
      return ys.set(e, !0), !0;
    }
  }
};
function Fi(e) {
  try {
    const n = new Jl(e).tokenize(), s = new Xl(n).parse(), i = new Zl();
    return function(r = {}) {
      const { scope: o = {}, context: l = null, forceBindingRootScopeToFunctions: d = !1 } = r;
      return i.evaluate({ node: s, scope: o, context: l, forceBindingRootScopeToFunctions: d });
    };
  } catch (t) {
    throw new Error(`CSP Parser Error: ${t.message}`);
  }
}
function Yl(e, t, n = {}) {
  let a = Hi(e), s = Ue([n.scope ?? {}, ...a]), i = n.params ?? [], o = Fi(t)({
    scope: s,
    forceBindingRootScopeToFunctions: !0
  });
  return typeof o == "function" && Ie ? o.apply(s, i) : o;
}
function Ql(e, t) {
  let n = Hi(e);
  if (typeof t == "function")
    return nl(n, t);
  let a = ed(e, t, n);
  return Zo.bind(null, e, t, a);
}
function Hi(e) {
  let t = {};
  return tn(t, e), [t, ...at(e)];
}
function ed(e, t, n) {
  if (e instanceof HTMLIFrameElement)
    throw new Error("Evaluating expressions on an iframe is prohibited in the CSP build");
  if (e instanceof HTMLScriptElement)
    throw new Error("Evaluating expressions on a script is prohibited in the CSP build");
  return (a = () => {
  }, { scope: s = {}, params: i = [] } = {}) => {
    let r = Ue([s, ...n]), l = Fi(t)({
      scope: r,
      forceBindingRootScopeToFunctions: !0
    });
    if (Ie && typeof l == "function") {
      let d = l.apply(l, i);
      d instanceof Promise ? d.then((u) => a(u)) : a(d);
    } else typeof l == "object" && l instanceof Promise ? l.then((d) => a(d)) : a(l);
  };
}
function td(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(","))
    t[n] = 1;
  return (n) => n in t;
}
var kt = Object.assign, nd = Object.prototype.hasOwnProperty, ia = (e, t) => nd.call(e, t), Et = Array.isArray, yt = (e) => Wi(e) === "[object Map]", ad = (e) => typeof e == "string", Nt = (e) => typeof e == "symbol", St = (e) => e !== null && typeof e == "object", sd = Object.prototype.toString, Wi = (e) => sd.call(e), Gi = (e) => Wi(e).slice(8, -1), $a = (e) => ad(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, id = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return (n) => t[n] || (t[n] = e(n));
}, rd = id((e) => e.charAt(0).toUpperCase() + e.slice(1)), Re = (e, t) => !Object.is(e, t);
function Fe(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
var $, Pn = /* @__PURE__ */ new WeakSet(), vs = class {
  constructor(e) {
    this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, Pn.has(this) && (Pn.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || od(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ws(this), zi(this);
    const e = $, t = se;
    $ = this, se = !0;
    try {
      return this.fn();
    } finally {
      $ !== this && Fe(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Ki(this), $ = e, se = t, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let e = this.deps; e; e = e.nextDep)
        Da(e);
      this.deps = this.depsTail = void 0, ws(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? Pn.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ra(this) && this.run();
  }
  get dirty() {
    return ra(this);
  }
}, Vi = 0, vt, wt;
function od(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = wt, wt = e;
    return;
  }
  e.next = vt, vt = e;
}
function Pa() {
  Vi++;
}
function Ia() {
  if (--Vi > 0)
    return;
  if (wt) {
    let t = wt;
    for (wt = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; vt; ) {
    let t = vt;
    for (vt = void 0; t; ) {
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
function zi(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ki(e) {
  let t, n = e.depsTail, a = n;
  for (; a; ) {
    const s = a.prevDep;
    a.version === -1 ? (a === n && (n = s), Da(a), dd(a)) : t = a, a.dep.activeLink = a.prevActiveLink, a.prevActiveLink = void 0, a = s;
  }
  e.deps = t, e.depsTail = n;
}
function ra(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (ld(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function ld(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === sn) || (e.globalVersion = sn, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ra(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = $, a = se;
  $ = e, se = !0;
  try {
    zi(e);
    const s = e.fn(e._value);
    (t.version === 0 || Re(s, e._value)) && (e.flags |= 128, e._value = s, t.version++);
  } catch (s) {
    throw t.version++, s;
  } finally {
    $ = n, se = a, Ki(e), e.flags &= -3;
  }
}
function Da(e, t = !1) {
  const { dep: n, prevSub: a, nextSub: s } = e;
  if (a && (a.nextSub = s, e.prevSub = void 0), s && (s.prevSub = a, e.nextSub = void 0), n.subsHead === e && (n.subsHead = s), n.subs === e && (n.subs = a, !a && n.computed)) {
    n.computed.flags &= -5;
    for (let i = n.computed.deps; i; i = i.nextDep)
      Da(i, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function dd(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function cd(e, t) {
  e.effect instanceof vs && (e = e.effect.fn);
  const n = new vs(e);
  t && kt(n, t);
  try {
    n.run();
  } catch (s) {
    throw n.stop(), s;
  }
  const a = n.run.bind(n);
  return a.effect = n, a;
}
function ud(e) {
  e.effect.stop();
}
var se = !0, Ji = [];
function hd() {
  Ji.push(se), se = !1;
}
function pd() {
  const e = Ji.pop();
  se = e === void 0 ? !0 : e;
}
function ws(e) {
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
var sn = 0, fd = class {
  constructor(e, t) {
    this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}, bd = class {
  // TODO isolatedDeclarations "__v_skip"
  constructor(e) {
    this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, this.subsHead = void 0;
  }
  track(e) {
    if (!$ || !se || $ === this.computed)
      return;
    let t = this.activeLink;
    if (t === void 0 || t.sub !== $)
      t = this.activeLink = new fd($, this), $.deps ? (t.prevDep = $.depsTail, $.depsTail.nextDep = t, $.depsTail = t) : $.deps = $.depsTail = t, Xi(t);
    else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
      const n = t.nextDep;
      n.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = n), t.prevDep = $.depsTail, t.nextDep = void 0, $.depsTail.nextDep = t, $.depsTail = t, $.deps === t && ($.deps = n);
    }
    return $.onTrack && $.onTrack(
      kt(
        {
          effect: $
        },
        e
      )
    ), t;
  }
  trigger(e) {
    this.version++, sn++, this.notify(e);
  }
  notify(e) {
    Pa();
    try {
      for (let t = this.subsHead; t; t = t.nextSub)
        t.sub.onTrigger && !(t.sub.flags & 8) && t.sub.onTrigger(
          kt(
            {
              effect: t.sub
            },
            e
          )
        );
      for (let t = this.subs; t; t = t.prevSub)
        t.sub.notify() && t.sub.dep.notify();
    } finally {
      Ia();
    }
  }
};
function Xi(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let a = t.deps; a; a = a.nextDep)
        Xi(a);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
var oa = /* @__PURE__ */ new WeakMap(), qe = /* @__PURE__ */ Symbol(
  "Object iterate"
), la = /* @__PURE__ */ Symbol(
  "Map keys iterate"
), At = /* @__PURE__ */ Symbol(
  "Array iterate"
);
function Y(e, t, n) {
  if (se && $) {
    let a = oa.get(e);
    a || oa.set(e, a = /* @__PURE__ */ new Map());
    let s = a.get(n);
    s || (a.set(n, s = new bd()), s.map = a, s.key = n), s.track({
      target: e,
      type: t,
      key: n
    });
  }
}
function Se(e, t, n, a, s, i) {
  const r = oa.get(e);
  if (!r) {
    sn++;
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
  if (Pa(), t === "clear")
    r.forEach(o);
  else {
    const l = Et(e), d = l && $a(n);
    if (l && n === "length") {
      const u = Number(a);
      r.forEach((h, p) => {
        (p === "length" || p === At || !Nt(p) && p >= u) && o(h);
      });
    } else
      switch ((n !== void 0 || r.has(void 0)) && o(r.get(n)), d && o(r.get(At)), t) {
        case "add":
          l ? d && o(r.get("length")) : (o(r.get(qe)), yt(e) && o(r.get(la)));
          break;
        case "delete":
          l || (o(r.get(qe)), yt(e) && o(r.get(la)));
          break;
        case "set":
          yt(e) && o(r.get(qe));
          break;
      }
  }
  Ia();
}
function et(e) {
  const t = P(e);
  return t === e ? t : (Y(t, "iterate", At), We(e) ? t : t.map(Ge));
}
function qa(e) {
  return Y(e = P(e), "iterate", At), e;
}
function de(e, t) {
  return He(e) ? ar(e) ? Tt(Ge(t)) : Tt(t) : Ge(t);
}
var gd = {
  __proto__: null,
  [Symbol.iterator]() {
    return In(this, Symbol.iterator, (e) => de(this, e));
  },
  concat(...e) {
    return et(this).concat(
      ...e.map((t) => Et(t) ? et(t) : t)
    );
  },
  entries() {
    return In(this, "entries", (e) => (e[1] = de(this, e[1]), e));
  },
  every(e, t) {
    return fe(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return fe(
      this,
      "filter",
      e,
      t,
      (n) => n.map((a) => de(this, a)),
      arguments
    );
  },
  find(e, t) {
    return fe(
      this,
      "find",
      e,
      t,
      (n) => de(this, n),
      arguments
    );
  },
  findIndex(e, t) {
    return fe(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return fe(
      this,
      "findLast",
      e,
      t,
      (n) => de(this, n),
      arguments
    );
  },
  findLastIndex(e, t) {
    return fe(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return fe(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return Dn(this, "includes", e);
  },
  indexOf(...e) {
    return Dn(this, "indexOf", e);
  },
  join(e) {
    return et(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return Dn(this, "lastIndexOf", e);
  },
  map(e, t) {
    return fe(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return pt(this, "pop");
  },
  push(...e) {
    return pt(this, "push", e);
  },
  reduce(e, ...t) {
    return _s(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return _s(this, "reduceRight", e, t);
  },
  shift() {
    return pt(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return fe(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return pt(this, "splice", e);
  },
  toReversed() {
    return et(this).toReversed();
  },
  toSorted(e) {
    return et(this).toSorted(e);
  },
  toSpliced(...e) {
    return et(this).toSpliced(...e);
  },
  unshift(...e) {
    return pt(this, "unshift", e);
  },
  values() {
    return In(this, "values", (e) => de(this, e));
  }
};
function In(e, t, n) {
  const a = qa(e), s = a[t]();
  return a !== e && !We(e) && (s._next = s.next, s.next = () => {
    const i = s._next();
    return i.done || (i.value = n(i.value)), i;
  }), s;
}
var md = Array.prototype;
function fe(e, t, n, a, s, i) {
  const r = qa(e), o = r !== e && !We(e), l = r[t];
  if (l !== md[t]) {
    const h = l.apply(e, i);
    return o ? Ge(h) : h;
  }
  let d = n;
  r !== e && (o ? d = function(h, p) {
    return n.call(this, de(e, h), p, e);
  } : n.length > 2 && (d = function(h, p) {
    return n.call(this, h, p, e);
  }));
  const u = l.call(r, d, a);
  return o && s ? s(u) : u;
}
function _s(e, t, n, a) {
  const s = qa(e), i = s !== e && !We(e);
  let r = n, o = !1;
  s !== e && (i ? (o = a.length === 0, r = function(d, u, h) {
    return o && (o = !1, d = de(e, d)), n.call(this, d, de(e, u), h, e);
  }) : n.length > 3 && (r = function(d, u, h) {
    return n.call(this, d, u, h, e);
  }));
  const l = s[t](r, ...a);
  return o ? de(e, l) : l;
}
function Dn(e, t, n) {
  const a = P(e);
  Y(a, "iterate", At);
  const s = a[t](...n);
  return (s === -1 || s === !1) && Nd(n[0]) ? (n[0] = P(n[0]), a[t](...n)) : s;
}
function pt(e, t, n = []) {
  hd(), Pa();
  const a = P(e)[t].apply(e, n);
  return Ia(), pd(), a;
}
var yd = /* @__PURE__ */ td("__proto__,__v_isRef,__isVue"), Zi = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(Nt)
);
function vd(e) {
  Nt(e) || (e = String(e));
  const t = P(this);
  return Y(t, "has", e), t.hasOwnProperty(e);
}
var Yi = class {
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
      return n === (a ? s ? Cd : tr : s ? Od : er).get(e) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
    const i = Et(e);
    if (!a) {
      let o;
      if (i && (o = gd[t]))
        return o;
      if (t === "hasOwnProperty")
        return vd;
    }
    const r = Reflect.get(
      e,
      t,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      _t(e) ? e : n
    );
    if ((Nt(t) ? Zi.has(t) : yd(t)) || (a || Y(e, "get", t), s))
      return r;
    if (_t(r)) {
      const o = i && $a(t) ? r : r.value;
      return a && St(o) ? da(o) : o;
    }
    return St(r) ? a ? da(r) : ja(r) : r;
  }
}, wd = class extends Yi {
  constructor(e = !1) {
    super(!1, e);
  }
  set(e, t, n, a) {
    let s = e[t];
    const i = Et(e) && $a(t);
    if (!this._isShallow) {
      const l = He(s);
      if (!We(n) && !He(n) && (s = P(s), n = P(n)), !i && _t(s) && !_t(n))
        return l ? (Fe(
          `Set operation on key "${String(t)}" failed: target is readonly.`,
          e[t]
        ), !0) : (s.value = n, !0);
    }
    const r = i ? Number(t) < e.length : ia(e, t), o = Reflect.set(
      e,
      t,
      n,
      _t(e) ? e : a
    );
    return e === P(a) && o && (r ? Re(n, s) && Se(e, "set", t, n, s) : Se(e, "add", t, n)), o;
  }
  deleteProperty(e, t) {
    const n = ia(e, t), a = e[t], s = Reflect.deleteProperty(e, t);
    return s && n && Se(e, "delete", t, void 0, a), s;
  }
  has(e, t) {
    const n = Reflect.has(e, t);
    return (!Nt(t) || !Zi.has(t)) && Y(e, "has", t), n;
  }
  ownKeys(e) {
    return Y(
      e,
      "iterate",
      Et(e) ? "length" : qe
    ), Reflect.ownKeys(e);
  }
}, _d = class extends Yi {
  constructor(e = !1) {
    super(!0, e);
  }
  set(e, t) {
    return Fe(
      `Set operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
  deleteProperty(e, t) {
    return Fe(
      `Delete operation on key "${String(t)}" failed: target is readonly.`,
      e
    ), !0;
  }
}, xd = /* @__PURE__ */ new wd(), kd = /* @__PURE__ */ new _d(), Wt = (e) => Reflect.getPrototypeOf(e);
function Ed(e, t, n) {
  return function(...a) {
    const s = this.__v_raw, i = P(s), r = yt(i), o = e === "entries" || e === Symbol.iterator && r, l = e === "keys" && r, d = s[e](...a), u = t ? Tt : Ge;
    return !t && Y(
      i,
      "iterate",
      l ? la : qe
    ), kt(
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
function Gt(e) {
  return function(...t) {
    {
      const n = t[0] ? `on key "${t[0]}" ` : "";
      Fe(
        `${rd(e)} operation ${n}failed: target is readonly.`,
        P(this)
      );
    }
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Sd(e, t) {
  const n = {
    get(s) {
      const i = this.__v_raw, r = P(i), o = P(s);
      e || (Re(s, o) && Y(r, "get", s), Y(r, "get", o));
      const { has: l } = Wt(r), d = e ? Tt : Ge;
      if (l.call(r, s))
        return d(i.get(s));
      if (l.call(r, o))
        return d(i.get(o));
      i !== r && i.get(s);
    },
    get size() {
      const s = this.__v_raw;
      return !e && Y(P(s), "iterate", qe), s.size;
    },
    has(s) {
      const i = this.__v_raw, r = P(i), o = P(s);
      return e || (Re(s, o) && Y(r, "has", s), Y(r, "has", o)), s === o ? i.has(s) : i.has(s) || i.has(o);
    },
    forEach(s, i) {
      const r = this, o = r.__v_raw, l = P(o), d = e ? Tt : Ge;
      return !e && Y(l, "iterate", qe), o.forEach((u, h) => s.call(i, d(u), d(h), r));
    }
  };
  return kt(
    n,
    e ? {
      add: Gt("add"),
      set: Gt("set"),
      delete: Gt("delete"),
      clear: Gt("clear")
    } : {
      add(s) {
        const i = P(this), r = Wt(i), o = P(s), l = !We(s) && !He(s) ? o : s;
        return r.has.call(i, l) || Re(s, l) && r.has.call(i, s) || Re(o, l) && r.has.call(i, o) || (i.add(l), Se(i, "add", l, l)), this;
      },
      set(s, i) {
        !We(i) && !He(i) && (i = P(i));
        const r = P(this), { has: o, get: l } = Wt(r);
        let d = o.call(r, s);
        d ? xs(r, o, s) : (s = P(s), d = o.call(r, s));
        const u = l.call(r, s);
        return r.set(s, i), d ? Re(i, u) && Se(r, "set", s, i, u) : Se(r, "add", s, i), this;
      },
      delete(s) {
        const i = P(this), { has: r, get: o } = Wt(i);
        let l = r.call(i, s);
        l ? xs(i, r, s) : (s = P(s), l = r.call(i, s));
        const d = o ? o.call(i, s) : void 0, u = i.delete(s);
        return l && Se(i, "delete", s, void 0, d), u;
      },
      clear() {
        const s = P(this), i = s.size !== 0, r = yt(s) ? new Map(s) : new Set(s), o = s.clear();
        return i && Se(
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
    n[s] = Ed(s, e);
  }), n;
}
function Qi(e, t) {
  const n = Sd(e);
  return (a, s, i) => s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? a : Reflect.get(
    ia(n, s) && s in a ? n : a,
    s,
    i
  );
}
var Ad = {
  get: /* @__PURE__ */ Qi(!1)
}, Td = {
  get: /* @__PURE__ */ Qi(!0)
};
function xs(e, t, n) {
  const a = P(n);
  if (a !== n && t.call(e, a)) {
    const s = Gi(e);
    Fe(
      `Reactive ${s} contains both the raw and reactive versions of the same object${s === "Map" ? " as keys" : ""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`
    );
  }
}
var er = /* @__PURE__ */ new WeakMap(), Od = /* @__PURE__ */ new WeakMap(), tr = /* @__PURE__ */ new WeakMap(), Cd = /* @__PURE__ */ new WeakMap();
function Md(e) {
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
function ja(e) {
  return /* @__PURE__ */ He(e) ? e : nr(
    e,
    !1,
    xd,
    Ad,
    er
  );
}
function da(e) {
  return nr(
    e,
    !0,
    kd,
    Td,
    tr
  );
}
function nr(e, t, n, a, s) {
  if (!St(e))
    return Fe(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e))
    return e;
  const i = s.get(e);
  if (i)
    return i;
  const r = Md(Gi(e));
  if (r === 0)
    return e;
  const o = new Proxy(
    e,
    r === 2 ? a : n
  );
  return s.set(e, o), o;
}
function ar(e) {
  return /* @__PURE__ */ He(e) ? /* @__PURE__ */ ar(e.__v_raw) : !!(e && e.__v_isReactive);
}
function He(e) {
  return !!(e && e.__v_isReadonly);
}
function We(e) {
  return !!(e && e.__v_isShallow);
}
function Nd(e) {
  return e ? !!e.__v_raw : !1;
}
function P(e) {
  const t = e && e.__v_raw;
  return t ? /* @__PURE__ */ P(t) : e;
}
var Ge = (e) => St(e) ? /* @__PURE__ */ ja(e) : e, Tt = (e) => St(e) ? /* @__PURE__ */ da(e) : e;
function _t(e) {
  return e ? e.__v_isRef === !0 : !1;
}
ie("nextTick", () => Ma);
ie("dispatch", (e) => mt.bind(mt, e));
ie("watch", (e, { evaluateLater: t, cleanup: n }) => (a, s) => {
  let i = t(a), o = Zs(() => {
    let l;
    return i((d) => l = d), l;
  }, s);
  n(o);
});
ie("store", Hl);
ie("data", (e) => ii(e));
ie("root", (e) => fn(e));
ie("refs", (e) => (e._x_refs_proxy || (e._x_refs_proxy = Ue(Ld(e))), e._x_refs_proxy));
function Ld(e) {
  let t = [];
  return ye(e, (n) => {
    n._x_refs && t.push(n._x_refs);
  }), t;
}
var qn = {};
function sr(e) {
  return qn[e] || (qn[e] = 0), ++qn[e];
}
function Rd(e, t) {
  return ye(e, (n) => {
    if (n._x_ids && n._x_ids[t])
      return !0;
  });
}
function $d(e, t) {
  e._x_ids || (e._x_ids = {}), e._x_ids[t] || (e._x_ids[t] = sr(t));
}
ie("id", (e, { cleanup: t }) => (n, a = null) => {
  let s = `${n}${a ? `-${a}` : ""}`;
  return Pd(e, s, t, () => {
    let i = Rd(e, n), r = i ? i._x_ids[n] : sr(n);
    return a ? `${n}-${r}-${a}` : `${n}-${r}`;
  });
});
gn((e, t) => {
  e._x_id && (t._x_id = e._x_id);
});
function Pd(e, t, n, a) {
  if (e._x_id || (e._x_id = {}), e._x_id[t])
    return e._x_id[t];
  let s = a();
  return e._x_id[t] = s, n(() => {
    delete e._x_id[t];
  }), s;
}
ie("el", (e) => e);
ir("Focus", "focus", "focus");
ir("Persist", "persist", "persist");
function ir(e, t, n) {
  ie(t, (a) => ce(`You can't use [$${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, a));
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
    let u = e._x_model.get, h = e._x_model.setWithModifiers, p = Di(
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
  e.tagName.toLowerCase() !== "template" && ce("x-teleport can only be used on a <template> tag", e);
  let s = ks(n), i = e.content.cloneNode(!0).firstElementChild;
  e._x_teleport = i, i._x_teleportBack = e, e.setAttribute("data-teleport-template", !0), i.setAttribute("data-teleport-target", !0), e._x_forwardEvents && e._x_forwardEvents.forEach((o) => {
    i.addEventListener(o, (l) => {
      l.stopPropagation(), e.dispatchEvent(new l.constructor(l.type, l));
    });
  }), Mt(i, {}, e);
  let r = (o, l, d) => {
    d.includes("prepend") ? l.parentNode.insertBefore(o, l) : d.includes("append") ? l.parentNode.insertBefore(o, l.nextSibling) : l.appendChild(o);
  };
  B(() => {
    Te(() => {
      r(i, s, t), ve(i);
    })();
  }), e._x_teleportPutBack = () => {
    let o = ks(n);
    B(() => {
      r(e._x_teleport, o, t);
    });
  }, a(
    () => B(() => {
      i.remove(), Je(i);
    })
  );
});
var Id = document.createElement("div");
function ks(e) {
  let t = Te(() => document.querySelector(e), () => Id)();
  return t || ce(`Cannot find x-teleport element for selector: "${e}"`), t;
}
var rr = () => {
};
rr.inline = (e, { modifiers: t }, { cleanup: n }) => {
  t.includes("self") ? e._x_ignoreSelf = !0 : e._x_ignore = !0, n(() => {
    t.includes("self") ? delete e._x_ignoreSelf : delete e._x_ignore;
  });
};
F("ignore", rr);
F("effect", Te((e, { expression: t }, { effect: n }) => {
  n(Z(e, t));
}));
function nt(e, t, n, a) {
  let s = e, i = (l) => a(l), r = {}, o = (l, d) => (u) => d(l, u);
  return n.includes("dot") && (t = Dd(t)), n.includes("camel") && (t = qd(t)), n.includes("capture") && (r.capture = !0), n.includes("window") && (s = window), n.includes("document") && (s = document), n.includes("passive") && (r.passive = n[n.indexOf("passive") + 1] !== "false"), i = or(n, i), n.includes("prevent") && (i = o(i, (l, d) => {
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
  })), (Ud(t) || lr(t)) && (i = o(i, (l, d) => {
    Bd(d, n) || l(d);
  })), s.addEventListener(t, i, r), () => {
    s.removeEventListener(t, i, r);
  };
}
function or(e, t) {
  if (e.includes("debounce")) {
    let n = e[e.indexOf("debounce") + 1] || "invalid-wait", a = rn(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Pi(t, a);
  }
  if (e.includes("throttle")) {
    let n = e[e.indexOf("throttle") + 1] || "invalid-wait", a = rn(n.split("ms")[0]) ? Number(n.split("ms")[0]) : 250;
    t = Ii(t, a);
  }
  return t;
}
function Dd(e) {
  return e.replace(/-/g, ".");
}
function qd(e) {
  return e.toLowerCase().replace(/-(\w)/g, (t, n) => n.toUpperCase());
}
function rn(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function jd(e) {
  return [" ", "_"].includes(
    e
  ) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
}
function Ud(e) {
  return ["keydown", "keyup"].includes(e);
}
function lr(e) {
  return ["contextmenu", "click", "mouse"].some((t) => e.includes(t));
}
function Bd(e, t) {
  let n = t.filter((i) => !["window", "document", "prevent", "stop", "once", "capture", "self", "away", "outside", "passive", "preserve-scroll", "blur", "change", "lazy"].includes(i));
  if (n.includes("debounce")) {
    let i = n.indexOf("debounce");
    n.splice(i, rn((n[i + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.includes("throttle")) {
    let i = n.indexOf("throttle");
    n.splice(i, rn((n[i + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1);
  }
  if (n.length === 0 || n.length === 1 && Es(e.key).includes(n[0]))
    return !1;
  const s = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((i) => n.includes(i));
  return n = n.filter((i) => !s.includes(i)), !(s.length > 0 && s.filter((r) => ((r === "cmd" || r === "super") && (r = "meta"), e[`${r}Key`])).length === s.length && (lr(e.type) || Es(e.key).includes(n[0])));
}
function Es(e) {
  if (!e)
    return [];
  e = jd(e);
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
  t.includes("parent") && (i = ye(e, (m) => m !== e));
  let r = Z(i, n), o;
  typeof n == "string" ? o = Z(i, `${n} = __placeholder`) : typeof n == "function" && typeof n() == "string" ? o = Z(i, `${n()} = __placeholder`) : o = () => {
  };
  let l = () => {
    let m;
    return r((g) => m = g), Ss(m) ? m.get() : m;
  }, d = (m) => {
    let g;
    r((S) => g = S), Ss(g) ? g.set(m) : o(() => {
    }, {
      scope: { __placeholder: m }
    });
  };
  typeof n == "string" && e.type === "radio" && B(() => {
    e.hasAttribute("name") || e.setAttribute("name", n);
  });
  let u = t.includes("change") || t.includes("lazy"), h = t.includes("blur"), p = t.includes("enter"), w = u || h || p, C;
  if (Ae)
    C = () => {
    };
  else if (w) {
    let m = [], g = (S) => d(Vt(e, t, S, l()));
    if (u && m.push(nt(e, "change", t, g)), h && (m.push(nt(e, "blur", t, g)), e.form)) {
      let S = e.form, L = () => g({ target: e });
      S._x_pendingModelUpdates || (S._x_pendingModelUpdates = []), S._x_pendingModelUpdates.push(L), s(() => {
        S._x_pendingModelUpdates && S._x_pendingModelUpdates.splice(S._x_pendingModelUpdates.indexOf(L), 1);
      });
    }
    p && m.push(nt(e, "keydown", t, (S) => {
      S.key === "Enter" && g(S);
    })), C = () => m.forEach((S) => S());
  } else {
    let m = e.tagName.toLowerCase() === "select" || ["checkbox", "radio"].includes(e.type) ? "change" : "input";
    C = nt(e, m, t, (g) => {
      d(Vt(e, t, g, l()));
    });
  }
  if (t.includes("fill") && ([void 0, null, ""].includes(l()) || an(e) && Array.isArray(l()) || e.tagName.toLowerCase() === "select" && e.multiple) && d(
    Vt(e, t, { target: e }, l())
  ), e._x_removeModelListeners || (e._x_removeModelListeners = {}), e._x_removeModelListeners.default = C, s(() => e._x_removeModelListeners.default()), e.form) {
    let m = nt(e.form, "reset", [], (g) => {
      Ma(() => e._x_model && e._x_model.set(Vt(e, t, { target: e }, l())));
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
    setWithModifiers: or(t, d)
  }, e._x_forceModelUpdate = (m) => {
    m === void 0 && typeof n == "string" && n.match(/\./) && (m = ""), B(() => {
      an(e) ? Array.isArray(m) ? e.checked = m.some((g) => g == e.value) : e.checked = !!m : Ra(e) ? typeof m == "boolean" ? e.checked = Zt(e.value) === m : e.checked = e.value == m : Li(e, "value", m);
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
function Vt(e, t, n, a) {
  return B(() => {
    if (n instanceof CustomEvent && n.detail !== void 0)
      return n.detail !== null && n.detail !== void 0 ? n.detail : n.target.value;
    if (an(e))
      if (Array.isArray(a)) {
        let s = null;
        return t.includes("number") ? s = jn(n.target.value) : t.includes("boolean") ? s = Zt(n.target.value) : s = n.target.value, n.target.checked ? a.includes(s) ? a : a.concat([s]) : a.filter((i) => !Fd(i, s));
      } else
        return n.target.checked;
    else {
      if (e.tagName.toLowerCase() === "select" && e.multiple)
        return t.includes("number") ? Array.from(n.target.selectedOptions).map((s) => {
          let i = s.value || s.text;
          return jn(i);
        }) : t.includes("boolean") ? Array.from(n.target.selectedOptions).map((s) => {
          let i = s.value || s.text;
          return Zt(i);
        }) : Array.from(n.target.selectedOptions).map((s) => s.value || s.text);
      {
        let s;
        return Ra(e) ? n.target.checked ? s = n.target.value : s = a : s = n.target.value, t.includes("number") ? jn(s) : t.includes("boolean") ? Zt(s) : t.includes("trim") ? s.trim() : s;
      }
    }
  });
}
function jn(e) {
  let t = e ? parseFloat(e) : null;
  return Hd(t) ? t : e;
}
function Fd(e, t) {
  return e == t;
}
function Hd(e) {
  return !Array.isArray(e) && !isNaN(e);
}
function Ss(e) {
  return e !== null && typeof e == "object" && typeof e.get == "function" && typeof e.set == "function";
}
F("cloak", (e) => queueMicrotask(() => B(() => e.removeAttribute(ot("cloak")))));
Ai(() => `[${ot("init")}]`);
F("init", Te((e, { expression: t }, { evaluate: n }) => typeof t == "string" ? !!t.trim() && n(t, {}, !1) : n(t, {}, !1)));
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
        Array.from(e.children).forEach((r) => Je(r)), e.innerHTML = i ?? "", e._x_ignoreSelf = !0, ve(e), delete e._x_ignoreSelf;
      });
    });
  }, { priority: "structural" });
});
Ta(gi(":", mi(ot("bind:"))));
var dr = (e, { value: t, modifiers: n, expression: a, original: s }, { effect: i, cleanup: r }) => {
  if (!t) {
    let l = {};
    Gl(l), Z(e, a)((u) => {
      ji(e, u, s);
    }, { scope: l });
    return;
  }
  if (t === "key")
    return Wd(e, a);
  if (e._x_inlineBindings && e._x_inlineBindings[t] && e._x_inlineBindings[t].extract)
    return;
  let o = Z(e, a);
  i(() => o((l) => {
    l === void 0 && typeof a == "string" && a.match(/\./) && (l = ""), B(() => Li(e, t, l, n));
  })), r(() => {
    e._x_undoAddedClasses && e._x_undoAddedClasses(), e._x_undoAddedStyles && e._x_undoAddedStyles();
  });
};
dr.inline = (e, { value: t, modifiers: n, expression: a }) => {
  t && (e._x_inlineBindings || (e._x_inlineBindings = {}), e._x_inlineBindings[t] = { expression: a, extract: !1 });
};
F("bind", dr);
function Wd(e, t) {
  e._x_keyExpression = t;
}
Si(() => `[${ot("data")}]`);
var Le = /* @__PURE__ */ Symbol();
F("data", (e, { expression: t }, { cleanup: n }) => {
  if (Vd(e))
    return;
  let a = e[Le];
  if (a?.expression === t)
    return;
  t = t === "" ? "{}" : t;
  let s = {};
  tn(s, e);
  let i = {};
  zl(i, s);
  let r = De(e, t, { scope: i });
  (r === void 0 || r === !0) && (r = {}), tn(r, e);
  let o;
  if (a?.reactiveData) {
    o = a.reactiveData, Gd(o, r);
    let d = { expression: t };
    e[Le] = d, queueMicrotask(() => {
      e[Le] === d && delete e[Le];
    });
  } else
    o = it(r);
  ka(o, n);
  let l = Mt(e, o);
  o.init && De(e, o.init), n(() => {
    o.destroy && De(e, o.destroy), l();
    let d = { reactiveData: o };
    e[Le] = d, queueMicrotask(() => {
      e[Le] === d && delete e[Le];
    });
  });
});
function Gd(e, t) {
  Object.keys(t).forEach((n) => {
    let a = Object.getOwnPropertyDescriptor(t, n), s = Object.getOwnPropertyDescriptor(e, n);
    a.get || a.set || s?.get || s?.set ? (s && delete e[n], s || (e[n] = void 0), a.get || a.set ? Object.defineProperty(e, n, a) : e[n] = t[n]) : e[n] = t[n];
  }), Object.keys(e).filter((n) => !Object.prototype.hasOwnProperty.call(t, n)).forEach((n) => delete e[n]);
}
gn((e, t) => {
  e._x_dataStack && (t._x_dataStack = e._x_dataStack, t.setAttribute("data-has-alpine-state", !0));
});
function Vd(e) {
  return Ae ? sa ? !0 : e.hasAttribute("data-has-alpine-state") : !1;
}
F("show", (e, { modifiers: t, expression: n }, { effect: a }) => {
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
  let i = () => {
    e._x_doHide(), e._x_isShown = !1;
  }, r = () => {
    e._x_doShow(), e._x_isShown = !0;
  }, o = () => setTimeout(r), l = na(
    (h) => h ? r() : i(),
    (h) => {
      typeof e._x_toggleAndCascadeWithTransitions == "function" ? e._x_toggleAndCascadeWithTransitions(e, h, r, i) : h ? o() : i();
    }
  ), d, u = !0;
  a(() => s((h) => {
    !u && h === d || (t.includes("immediate") && (h ? o() : i()), l(h), d = h, u = !1);
  }));
});
F("for", Te((e, { expression: t }, { effect: n, cleanup: a }) => {
  let s = Jd(t), i = Z(e, s.items), r = Z(
    e,
    // the x-bind:key expression is stored for our use instead of evaluated.
    e._x_keyExpression || "index"
  );
  e._x_lookup = /* @__PURE__ */ new Map(), n(() => Kd(e, s, i, r), { priority: "structural" }), a(() => {
    e._x_lookup.forEach(
      (o) => B(() => {
        Je(o), o.remove();
      })
    ), delete e._x_lookup, delete e._x_lastRenderedEl;
  });
}));
function zd(e) {
  return (t) => {
    Object.entries(t).forEach(([n, a]) => {
      e[n] = a;
    });
  };
}
function Kd(e, t, n, a) {
  n((s) => {
    Zd(s) && (s = Array.from({ length: s }, (d, u) => u + 1)), s == null && (s = []), s instanceof Set && (s = Array.from(s)), s instanceof Map && (s = Array.from(s));
    let i = e._x_lookup, r = /* @__PURE__ */ new Map();
    e._x_lookup = r;
    let o = Yd(s), l = Object.entries(s).map(([d, u]) => {
      o || (d = parseInt(d));
      let h = Xd(t, u, d, s), p;
      return a((w) => {
        typeof w == "object" && ce("x-for key cannot be an object, it must be a string or an integer", e), i.has(w) && (r.set(w, i.get(w)), i.delete(w)), p = w;
      }, { scope: { index: d, ...h } }), [p, h];
    });
    B(() => {
      i.forEach((h) => {
        Je(h), h.remove();
      });
      let d = /* @__PURE__ */ new Set(), u = e;
      l.forEach(([h, p]) => {
        if (r.has(h)) {
          let m = r.get(h);
          m._x_refreshXForScope(p), u.nextElementSibling !== m && (u.nextElementSibling && m.replaceWith(u.nextElementSibling), u.after(m)), u = m, m._x_currentIfEl && (m.nextElementSibling !== m._x_currentIfEl && u.after(m._x_currentIfEl), u = m._x_currentIfEl);
          return;
        }
        e.content.children.length > 1 && ce("x-for templates require a single root element, additional elements will be ignored.", e);
        let w = document.importNode(e.content, !0).firstElementChild, C = it(p);
        Mt(w, C, e), w._x_refreshXForScope = zd(C), r.set(h, w), d.add(w), u.after(w), u = w;
      }), d.forEach((h) => ve(h)), u !== e ? e._x_lastRenderedEl = u : delete e._x_lastRenderedEl;
    });
  });
}
function Jd(e) {
  let t = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, n = /^\s*\(|\)\s*$/g, a = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, s = e.match(a);
  if (!s)
    return;
  let i = {};
  i.items = s[2].trim();
  let r = s[1].replace(n, "").trim(), o = r.match(t);
  return o ? (i.item = r.replace(t, "").trim(), i.index = o[1].trim(), o[2] && (i.collection = o[2].trim())) : i.item = r, i;
}
function Xd(e, t, n, a) {
  let s = {};
  return /^\[.*\]$/.test(e.item) && Array.isArray(t) ? e.item.replace("[", "").replace("]", "").split(",").map((r) => r.trim()).forEach((r, o) => {
    s[r] = t[o];
  }) : /^\{.*\}$/.test(e.item) && !Array.isArray(t) && typeof t == "object" ? e.item.replace("{", "").replace("}", "").split(",").map((r) => r.trim()).forEach((r) => {
    s[r] = t[r];
  }) : s[e.item] = t, e.index && (s[e.index] = n), e.collection && (s[e.collection] = a), s;
}
function Zd(e) {
  return typeof e != "object" && !isNaN(e);
}
function Yd(e) {
  return typeof e == "object" && !Array.isArray(e);
}
function cr() {
}
cr.inline = (e, { expression: t }, { cleanup: n }) => {
  let a = fn(e);
  a && (a._x_refs || (a._x_refs = {}), a._x_refs[t] = e, n(() => delete a._x_refs[t]));
};
F("ref", cr);
F("if", Te((e, { expression: t }, { effect: n, cleanup: a }) => {
  e.tagName.toLowerCase() !== "template" && ce("x-if can only be used on a <template> tag", e);
  let s = Z(e, t), i = () => {
    if (e._x_currentIfEl)
      return e._x_currentIfEl;
    let o = e.content.cloneNode(!0).firstElementChild;
    return Mt(o, {}, e), B(() => {
      e.after(o), ve(o);
    }), e._x_currentIfEl = o, e._x_lastRenderedEl = o, e._x_undoIf = () => {
      B(() => {
        Je(o), o.remove();
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
  n(t).forEach((s) => $d(e, s));
});
gn((e, t) => {
  e._x_ids && (t._x_ids = e._x_ids);
});
Ta(gi("@", mi(ot("on:"))));
F("on", Te((e, { value: t, modifiers: n, expression: a }, { cleanup: s }) => {
  let i = a ? Z(e, a) : () => {
  };
  e.tagName.toLowerCase() === "template" && (e._x_forwardEvents || (e._x_forwardEvents = []), e._x_forwardEvents.includes(t) || e._x_forwardEvents.push(t));
  let r = nt(e, t, n, (o) => {
    i(() => {
    }, { scope: { $event: o }, params: [o] });
  });
  s(() => r());
}));
mn("Collapse", "collapse", "collapse");
mn("Intersect", "intersect", "intersect");
mn("Focus", "trap", "focus");
mn("Mask", "mask", "mask");
function mn(e, t, n) {
  F(t, (a) => ce(`You can't use [x-${t}] without first installing the "${e}" plugin here: https://alpinejs.dev/plugins/${n}`, a));
}
F("html", (e, { expression: t }) => {
  Ea(new Error("Using the x-html directive is prohibited in the CSP build"), e);
});
lt.setEvaluator(Ql);
lt.setRawEvaluator(Yl);
lt.setReactivityEngine({
  reactive: ja,
  // Since Vue 3.2, the scheduler is called with no arguments, so we wrap
  // the effect to hand Alpine's scheduler the runner it expects to queue.
  effect: (e, t = {}) => {
    let n;
    return n = cd(e, {
      scheduler: () => {
        n && (t.scheduler ? t.scheduler(n) : n());
      }
    }), n;
  },
  release: ud,
  raw: P
});
var Qd = lt, xt = Qd;
function ec(e) {
  const t = window.__siteationDebugBar;
  return t ? (t.onRequest = e, t.requests.slice()) : [];
}
const on = "__siteationDebugBarHostLock";
function tc(e) {
  if (!e || window[on]) return;
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
  window[on] = a;
}
function nc() {
  const e = window[on];
  e && (e.inert.forEach(([t, n]) => {
    t.inert = n;
  }), document.body.style.overflow = e.overflow, document.body.style.paddingRight = e.paddingRight, delete window[on]);
}
function As(e, t) {
  if (e.key !== "Tab" || !t) return;
  const n = Array.from(t.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'
  )).filter((r) => r.offsetParent !== null);
  if (n.length === 0) return;
  const a = n[0], s = n[n.length - 1], i = t.getRootNode().activeElement;
  e.shiftKey && i === a ? (e.preventDefault(), s.focus()) : !e.shiftKey && i === s && (e.preventDefault(), a.focus());
}
const tt = 12;
function ac(e) {
  return !!(e && typeof e == "object" && Number.isFinite(e.left) && Number.isFinite(e.top));
}
function Un(e, t, n) {
  const a = Math.max(tt, n.width - t.width - tt), s = Math.max(tt, n.height - t.height - tt);
  return {
    left: Math.min(Math.max(e.left, tt), a),
    top: Math.min(Math.max(e.top, tt), s)
  };
}
function sc(e, t, n) {
  return e.top + t.height / 2 < n / 2 ? "top" : "bottom";
}
const ic = 3;
function rc(e, t) {
  return Math.hypot(e, t) >= ic;
}
function oc(e) {
  const t = String(e || "").split(",").map((n) => n.trim()).filter(Boolean);
  return t.length === 0 ? ln : ln.filter((n) => lc.includes(n.id) || t.includes(n.id));
}
const lc = ["findings", "overview"], ln = [
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
function ur(e, t) {
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
      return null;
  }
}
const dc = {
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
    aria-hidden="true">${dc[e] || ""}</svg>`;
}
function cc(e) {
  return [...uc(e), ...hc(e), ...pc(e)];
}
function uc(e) {
  return ln.map((t) => {
    const n = ur(t.id, e);
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
function hc(e) {
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
function pc(e) {
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
function fc(e, t) {
  const n = String(t || "").trim().toLowerCase(), a = n ? e.filter((s) => `${s.group} ${s.label} ${s.keywords}`.toLowerCase().includes(n)) : e;
  return a.map((s, i) => ({
    ...s,
    leads: i === 0 || a[i - 1].group !== s.group
  }));
}
function bc() {
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
const st = "full", hr = "masked", te = "none", gc = "[redacted]", mc = "[masked]", yc = "[maximum depth reached]", vc = "[circular]", wc = /(pass|pwd|secret|token|api[_-]?key|authorization|cookie|session|csrf|form_key|credit|cc[_-]?number|cvv|iban|ssn|private[_-]?key)/i, _c = 5, Yt = 100, Ts = 400;
function xc(e) {
  return [st, hr, te].includes(e) ? e : st;
}
function kc(e) {
  return wc.test(String(e));
}
function yn(e, t = st) {
  if (t !== te)
    return Ua(e, t, 0, /* @__PURE__ */ new WeakSet());
}
function dn(e, t = st) {
  return t === te ? "" : t === hr ? e === "" ? "" : mc : e.length <= Ts ? e : `${e.slice(0, Ts)}...`;
}
function pr(e, t = st) {
  if (t === te) return "";
  const n = e.replace(/'(?:[^'\\]|\\.)*'/g, "'?'").replace(/"(?:[^"\\]|\\.)*"/g, '"?"');
  return dn(n, st);
}
function Ua(e, t, n, a) {
  if (e == null) return e;
  const s = typeof e;
  return s === "string" ? dn(e, t) : s === "number" || s === "boolean" ? e : s === "function" ? `ƒ ${e.name || "anonymous"}()` : s === "symbol" ? e.toString() : s === "bigint" ? `${e}n` : s !== "object" ? s : e instanceof Node ? Ac(e) : e instanceof Date ? e.toISOString() : e instanceof Error ? `${e.name}: ${dn(e.message, t)}` : e instanceof Map ? `Map(${e.size})` : e instanceof Set ? `Set(${e.size})` : n >= _c ? yc : a.has(e) ? vc : (a.add(e), Array.isArray(e) ? Ec(e, t, n, a) : Sc(e, t, n, a));
}
function Ec(e, t, n, a) {
  const s = e.slice(0, Yt).map((i) => Ua(i, t, n + 1, a));
  return e.length > Yt && s.push(`[${e.length - Yt} more]`), s;
}
function Sc(e, t, n, a) {
  const s = vn(e), i = /* @__PURE__ */ Object.create(null);
  let r = 0;
  for (const o of s) {
    if (r >= Yt) {
      i.__truncated__ = s.length - r;
      break;
    }
    if (kc(o)) {
      i[o] = gc, r++;
      continue;
    }
    try {
      i[o] = Ua(e[o], t, n + 1, a);
    } catch (l) {
      i[o] = `[unreadable: ${l && l.message ? l.message : "threw"}]`;
    }
    r++;
  }
  return i;
}
function vn(e) {
  try {
    const t = Object.keys(e);
    return t.length > 0 ? t : Reflect.ownKeys(e).filter((n) => typeof n == "string" && !n.startsWith("_x_"));
  } catch {
    return [];
  }
}
function Ac(e) {
  if (!(e instanceof Element)) return `<${e.nodeName.toLowerCase()}>`;
  const t = e.id ? `#${e.id}` : "", n = typeof e.className == "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : "";
  return `<${e.tagName.toLowerCase()}${t}${n}>`;
}
function Tc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Bn, Os;
function Oc() {
  if (Os) return Bn;
  Os = 1;
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
  function ue(c, f) {
    const y = c && c.exec(f);
    return y && y.index === 0;
  }
  const he = new RegExp(S(
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
  function X(c, { joinWith: f }) {
    let y = 0;
    return c.map((T) => {
      y += 1;
      const j = y;
      let U = h(T), x = "";
      for (; U.length > 0; ) {
        const _ = he.exec(U);
        if (!_) {
          x += U;
          break;
        }
        x += U.substring(0, _.index), U = U.substring(_.index + _[0].length), _[0][0] === "\\" && _[1] ? x += "\\" + String(Number(_[1]) + j) : (x += _[0], (_[0] === "(" || /^\(\?[<']/.test(_[0])) && y++);
      }
      return x;
    }).map((T) => `(${T})`).join(f);
  }
  const Q = /\b\B/, Xe = "[a-zA-Z]\\w*", _e = "[a-zA-Z_]\\w*", ne = "\\b\\d+(\\.\\d+)?", Rt = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", $t = "\\b(0b[01]+)", xn = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", kn = (c = {}) => {
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
  }, Oe = {
    begin: "\\\\[\\s\\S]",
    relevance: 0
  }, En = {
    scope: "string",
    begin: "'",
    end: "'",
    illegal: "\\n",
    contains: [Oe]
  }, Pt = {
    scope: "string",
    begin: '"',
    end: '"',
    illegal: "\\n",
    contains: [Oe]
  }, Sn = {
    begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
  }, z = function(c, f, y = {}) {
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
  }, xe = z("//", "$"), Ce = z("/\\*", "\\*/"), Ze = z("#", "$"), dt = {
    scope: "number",
    begin: ne,
    relevance: 0
  }, It = {
    scope: "number",
    begin: Rt,
    relevance: 0
  }, jr = {
    scope: "number",
    begin: $t,
    relevance: 0
  }, Ur = {
    scope: "regexp",
    begin: /\/(?=[^/\n]*\/)/,
    end: /\/[gimuy]*/,
    contains: [
      Oe,
      {
        begin: /\[/,
        end: /\]/,
        relevance: 0,
        contains: [Oe]
      }
    ]
  }, Br = {
    scope: "title",
    begin: Xe,
    relevance: 0
  }, Fr = {
    scope: "title",
    begin: _e,
    relevance: 0
  }, Hr = {
    // excludes method names from keyword processing
    begin: "\\.\\s*" + _e,
    relevance: 0
  };
  var Dt = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    APOS_STRING_MODE: En,
    BACKSLASH_ESCAPE: Oe,
    BINARY_NUMBER_MODE: jr,
    BINARY_NUMBER_RE: $t,
    COMMENT: z,
    C_BLOCK_COMMENT_MODE: Ce,
    C_LINE_COMMENT_MODE: xe,
    C_NUMBER_MODE: It,
    C_NUMBER_RE: Rt,
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
    HASH_COMMENT_MODE: Ze,
    IDENT_RE: Xe,
    MATCH_NOTHING_RE: Q,
    METHOD_GUARD: Hr,
    NUMBER_MODE: dt,
    NUMBER_RE: ne,
    PHRASAL_WORDS_MODE: Sn,
    QUOTE_STRING_MODE: Pt,
    REGEXP_MODE: Ur,
    RE_STARTERS_RE: xn,
    SHEBANG: kn,
    TITLE_MODE: Br,
    UNDERSCORE_IDENT_RE: _e,
    UNDERSCORE_TITLE_MODE: Fr
  });
  function Wr(c, f) {
    c.input[c.index - 1] === "." && f.ignoreMatch();
  }
  function Gr(c, f) {
    c.className !== void 0 && (c.scope = c.className, delete c.className);
  }
  function Vr(c, f) {
    f && c.beginKeywords && (c.begin = "\\b(" + c.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", c.__beforeBegin = Wr, c.keywords = c.keywords || c.beginKeywords, delete c.beginKeywords, c.relevance === void 0 && (c.relevance = 0));
  }
  function zr(c, f) {
    Array.isArray(c.illegal) && (c.illegal = S(...c.illegal));
  }
  function Kr(c, f) {
    if (c.match) {
      if (c.begin || c.end) throw new Error("begin & end are not supported with match");
      c.begin = c.match, delete c.match;
    }
  }
  function Jr(c, f) {
    c.relevance === void 0 && (c.relevance = 1);
  }
  const Xr = (c, f) => {
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
  }, Zr = [
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
  ], Yr = "keyword";
  function Za(c, f, y = Yr) {
    const T = /* @__PURE__ */ Object.create(null);
    return typeof c == "string" ? j(y, c.split(" ")) : Array.isArray(c) ? j(y, c) : Object.keys(c).forEach(function(U) {
      Object.assign(
        T,
        Za(c[U], f, U)
      );
    }), T;
    function j(U, x) {
      f && (x = x.map((_) => _.toLowerCase())), x.forEach(function(_) {
        const A = _.split("|");
        T[A[0]] = [U, Qr(A[0], A[1])];
      });
    }
  }
  function Qr(c, f) {
    return f ? Number(f) : eo(c) ? 0 : 1;
  }
  function eo(c) {
    return Zr.includes(c.toLowerCase());
  }
  const Ya = {}, Me = (c) => {
    console.error(c);
  }, Qa = (c, ...f) => {
    console.log(`WARN: ${c}`, ...f);
  }, Ye = (c, f) => {
    Ya[`${c}/${f}`] || (console.log(`Deprecated as of ${c}. ${f}`), Ya[`${c}/${f}`] = !0);
  }, qt = new Error();
  function es(c, f, { key: y }) {
    let T = 0;
    const j = c[y], U = {}, x = {};
    for (let _ = 1; _ <= f.length; _++)
      x[_ + T] = j[_], U[_ + T] = !0, T += L(f[_ - 1]);
    c[y] = x, c[y]._emit = U, c[y]._multi = !0;
  }
  function to(c) {
    if (Array.isArray(c.begin)) {
      if (c.skip || c.excludeBegin || c.returnBegin)
        throw Me("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), qt;
      if (typeof c.beginScope != "object" || c.beginScope === null)
        throw Me("beginScope must be object"), qt;
      es(c, c.begin, { key: "beginScope" }), c.begin = X(c.begin, { joinWith: "" });
    }
  }
  function no(c) {
    if (Array.isArray(c.end)) {
      if (c.skip || c.excludeEnd || c.returnEnd)
        throw Me("skip, excludeEnd, returnEnd not compatible with endScope: {}"), qt;
      if (typeof c.endScope != "object" || c.endScope === null)
        throw Me("endScope must be object"), qt;
      es(c, c.end, { key: "endScope" }), c.end = X(c.end, { joinWith: "" });
    }
  }
  function ao(c) {
    c.scope && typeof c.scope == "object" && c.scope !== null && (c.beginScope = c.scope, delete c.scope);
  }
  function so(c) {
    ao(c), typeof c.beginScope == "string" && (c.beginScope = { _wrap: c.beginScope }), typeof c.endScope == "string" && (c.endScope = { _wrap: c.endScope }), to(c), no(c);
  }
  function io(c) {
    function f(x, _) {
      return new RegExp(
        h(x),
        "m" + (c.case_insensitive ? "i" : "") + (c.unicodeRegex ? "u" : "") + (_ ? "g" : "")
      );
    }
    class y {
      constructor() {
        this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
      }
      // @ts-ignore
      addRule(_, A) {
        A.position = this.position++, this.matchIndexes[this.matchAt] = A, this.regexes.push([A, _]), this.matchAt += L(_) + 1;
      }
      compile() {
        this.regexes.length === 0 && (this.exec = () => null);
        const _ = this.regexes.map((A) => A[1]);
        this.matcherRe = f(X(_, { joinWith: "|" }), !0), this.lastIndex = 0;
      }
      /** @param {string} s */
      exec(_) {
        this.matcherRe.lastIndex = this.lastIndex;
        const A = this.matcherRe.exec(_);
        if (!A)
          return null;
        const V = A.findIndex((ct, Tn) => Tn > 0 && ct !== void 0), H = this.matchIndexes[V];
        return A.splice(0, V), Object.assign(A, H);
      }
    }
    class T {
      constructor() {
        this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
      }
      // @ts-ignore
      getMatcher(_) {
        if (this.multiRegexes[_]) return this.multiRegexes[_];
        const A = new y();
        return this.rules.slice(_).forEach(([V, H]) => A.addRule(V, H)), A.compile(), this.multiRegexes[_] = A, A;
      }
      resumingScanAtSamePosition() {
        return this.regexIndex !== 0;
      }
      considerAll() {
        this.regexIndex = 0;
      }
      // @ts-ignore
      addRule(_, A) {
        this.rules.push([_, A]), A.type === "begin" && this.count++;
      }
      /** @param {string} s */
      exec(_) {
        const A = this.getMatcher(this.regexIndex);
        A.lastIndex = this.lastIndex;
        let V = A.exec(_);
        if (this.resumingScanAtSamePosition() && !(V && V.index === this.lastIndex)) {
          const H = this.getMatcher(0);
          H.lastIndex = this.lastIndex + 1, V = H.exec(_);
        }
        return V && (this.regexIndex += V.position + 1, this.regexIndex === this.count && this.considerAll()), V;
      }
    }
    function j(x) {
      const _ = new T();
      return x.contains.forEach((A) => _.addRule(A.begin, { rule: A, type: "begin" })), x.terminatorEnd && _.addRule(x.terminatorEnd, { type: "end" }), x.illegal && _.addRule(x.illegal, { type: "illegal" }), _;
    }
    function U(x, _) {
      const A = (
        /** @type CompiledMode */
        x
      );
      if (x.isCompiled) return A;
      [
        Gr,
        // do this early so compiler extensions generally don't have to worry about
        // the distinction between match/begin
        Kr,
        so,
        Xr
      ].forEach((H) => H(x, _)), c.compilerExtensions.forEach((H) => H(x, _)), x.__beforeBegin = null, [
        Vr,
        // do this later so compiler extensions that come earlier have access to the
        // raw array if they wanted to perhaps manipulate it, etc.
        zr,
        // default to 1 relevance if not specified
        Jr
      ].forEach((H) => H(x, _)), x.isCompiled = !0;
      let V = null;
      return typeof x.keywords == "object" && x.keywords.$pattern && (x.keywords = Object.assign({}, x.keywords), V = x.keywords.$pattern, delete x.keywords.$pattern), V = V || /\w+/, x.keywords && (x.keywords = Za(x.keywords, c.case_insensitive)), A.keywordPatternRe = f(V, !0), _ && (x.begin || (x.begin = /\B|\b/), A.beginRe = f(A.begin), !x.end && !x.endsWithParent && (x.end = /\B|\b/), x.end && (A.endRe = f(A.end)), A.terminatorEnd = h(A.end) || "", x.endsWithParent && _.terminatorEnd && (A.terminatorEnd += (x.end ? "|" : "") + _.terminatorEnd)), x.illegal && (A.illegalRe = f(
        /** @type {RegExp | string} */
        x.illegal
      )), x.contains || (x.contains = []), x.contains = [].concat(...x.contains.map(function(H) {
        return ro(H === "self" ? x : H);
      })), x.contains.forEach(function(H) {
        U(
          /** @type Mode */
          H,
          A
        );
      }), x.starts && U(x.starts, _), A.matcher = j(A), A;
    }
    if (c.compilerExtensions || (c.compilerExtensions = []), c.contains && c.contains.includes("self"))
      throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
    return c.classNameAliases = a(c.classNameAliases || {}), U(
      /** @type Mode */
      c
    );
  }
  function ts(c) {
    return c ? c.endsWithParent || ts(c.starts) : !1;
  }
  function ro(c) {
    return c.variants && !c.cachedVariants && (c.cachedVariants = c.variants.map(function(f) {
      return a(c, { variants: null }, f);
    })), c.cachedVariants ? c.cachedVariants : ts(c) ? a(c, { starts: c.starts ? a(c.starts) : null }) : Object.isFrozen(c) ? a(c) : c;
  }
  var oo = "11.12.0";
  class lo extends Error {
    constructor(f, y) {
      super(f), this.name = "HTMLInjectionError", this.html = y;
    }
  }
  const An = n, ns = a, as = /* @__PURE__ */ Symbol("nomatch"), co = 7, ss = function(c) {
    const f = /* @__PURE__ */ Object.create(null), y = /* @__PURE__ */ Object.create(null), T = [];
    let j = !0;
    const U = "Could not find the language '{}', did you forget to load/include a language module?", x = { disableAutodetect: !0, name: "Plain text", contains: [] };
    let _ = {
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
      return _.noHighlightRe.test(b);
    }
    function V(b) {
      let E = b.className + " ";
      E += b.parentNode ? b.parentNode.className : "";
      const N = _.languageDetectRe.exec(E);
      if (N) {
        const I = ke(N[1]);
        return I || (Qa(U.replace("{}", N[1])), Qa("Falling back to no-highlight mode for this block.", b)), I ? N[1] : "no-highlight";
      }
      return E.split(/\s+/).find((I) => A(I) || ke(I));
    }
    function H(b, E, N) {
      let I = "", W = "";
      typeof E == "object" ? (I = b, N = E.ignoreIllegals, W = E.language) : (Ye("10.7.0", "highlight(lang, code, ...args) has been deprecated."), Ye("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), W = b, I = E), N === void 0 && (N = !0);
      const ae = {
        code: I,
        language: W
      };
      Ut("before:highlight", ae);
      const Ee = ae.result ? ae.result : ct(ae.language, ae.code, N);
      return Ee.code = ae.code, Ut("after:highlight", Ee), Ee;
    }
    function ct(b, E, N, I) {
      const W = /* @__PURE__ */ Object.create(null);
      function ae(v, k) {
        return v.keywords[k];
      }
      function Ee() {
        if (!O.keywords) {
          K.addText(D);
          return;
        }
        let v = 0;
        O.keywordPatternRe.lastIndex = 0;
        let k = O.keywordPatternRe.exec(D), M = "";
        for (; k; ) {
          M += D.substring(v, k.index);
          const R = oe.case_insensitive ? k[0].toLowerCase() : k[0], J = ae(O, R);
          if (J) {
            const [pe, To] = J;
            if (K.addText(M), M = "", W[R] = (W[R] || 0) + 1, W[R] <= co && (Ht += To), pe.startsWith("_"))
              M += k[0];
            else {
              const Oo = oe.classNameAliases[pe] || pe;
              re(k[0], Oo);
            }
          } else
            M += k[0];
          v = O.keywordPatternRe.lastIndex, k = O.keywordPatternRe.exec(D);
        }
        M += D.substring(v), K.addText(M);
      }
      function Bt() {
        if (D === "") return;
        let v = null;
        if (typeof O.subLanguage == "string") {
          if (!f[O.subLanguage]) {
            K.addText(D);
            return;
          }
          v = ct(O.subLanguage, D, !0, hs[O.subLanguage]), hs[O.subLanguage] = /** @type {CompiledMode} */
          v._top;
        } else
          v = On(D, O.subLanguage.length ? O.subLanguage : null);
        O.relevance > 0 && (Ht += v.relevance), K.__addSublanguage(v._emitter, v.language);
      }
      function ee() {
        O.subLanguage != null ? Bt() : Ee(), D = "";
      }
      function re(v, k) {
        v !== "" && (K.startScope(k), K.addText(v), K.endScope());
      }
      function ls(v, k) {
        let M = 1;
        const R = k.length - 1;
        for (; M <= R; ) {
          if (!v._emit[M]) {
            M++;
            continue;
          }
          const J = oe.classNameAliases[v[M]] || v[M], pe = k[M];
          J ? re(pe, J) : (D = pe, Ee(), D = ""), M++;
        }
      }
      function ds(v, k) {
        return v.scope && typeof v.scope == "string" && K.openNode(oe.classNameAliases[v.scope] || v.scope), v.beginScope && (v.beginScope._wrap ? (re(D, oe.classNameAliases[v.beginScope._wrap] || v.beginScope._wrap), D = "") : v.beginScope._multi && (ls(v.beginScope, k), D = "")), O = Object.create(v, { parent: { value: O } }), O;
      }
      function cs(v, k, M) {
        let R = ue(v.endRe, M);
        if (R) {
          if (v["on:end"]) {
            const J = new t(v);
            v["on:end"](k, J), J.isMatchIgnored && (R = !1);
          }
          if (R) {
            for (; v.endsParent && v.parent; )
              v = v.parent;
            return v;
          }
        }
        if (v.endsWithParent)
          return cs(v.parent, k, M);
      }
      function xo(v) {
        return O.matcher.regexIndex === 0 ? (D += v[0], 1) : (Ln = !0, 0);
      }
      function ko(v) {
        const k = v[0], M = v.rule, R = new t(M), J = [M.__beforeBegin, M["on:begin"]];
        for (const pe of J)
          if (pe && (pe(v, R), R.isMatchIgnored))
            return xo(k);
        return M.skip ? D += k : (M.excludeBegin && (D += k), ee(), !M.returnBegin && !M.excludeBegin && (D = k)), ds(M, v), M.returnBegin ? 0 : k.length;
      }
      function Eo(v) {
        const k = v[0], M = E.substring(v.index), R = cs(O, v, M);
        if (!R)
          return as;
        const J = O;
        O.endScope && O.endScope._wrap ? (ee(), re(k, O.endScope._wrap)) : O.endScope && O.endScope._multi ? (ee(), ls(O.endScope, v)) : J.skip ? D += k : (J.returnEnd || J.excludeEnd || (D += k), ee(), J.excludeEnd && (D = k));
        do
          O.scope && K.closeNode(), !O.skip && !O.subLanguage && (Ht += O.relevance), O = O.parent;
        while (O !== R.parent);
        return R.starts && ds(R.starts, v), J.returnEnd ? 0 : k.length;
      }
      function So() {
        const v = [];
        for (let k = O; k !== oe; k = k.parent)
          k.scope && v.unshift(k.scope);
        v.forEach((k) => K.openNode(k));
      }
      let Ft = {};
      function us(v, k) {
        const M = k && k[0];
        if (D += v, M == null)
          return ee(), 0;
        if (Ft.type === "begin" && k.type === "end" && Ft.index === k.index && M === "") {
          if (D += E.slice(k.index, k.index + 1), !j) {
            const R = new Error(`0 width match regex (${b})`);
            throw R.languageName = b, R.badRule = Ft.rule, R;
          }
          return 1;
        }
        if (Ft = k, k.type === "begin")
          return ko(k);
        if (k.type === "illegal" && !N) {
          const R = new Error('Illegal lexeme "' + M + '" for mode "' + (O.scope || "<unnamed>") + '"');
          throw R.mode = O, R;
        } else if (k.type === "end") {
          const R = Eo(k);
          if (R !== as)
            return R;
        }
        if (k.type === "illegal" && M === "")
          return k.index === E.length || (D += `
`), 1;
        if (Nn > 1e5 && Nn > k.index * 3)
          throw new Error("potential infinite loop, way more iterations than matches");
        return D += M, M.length;
      }
      const oe = ke(b);
      if (!oe)
        throw Me(U.replace("{}", b)), new Error('Unknown language: "' + b + '"');
      const Ao = io(oe);
      let Mn = "", O = I || Ao;
      const hs = {}, K = new _.__emitter(_);
      So();
      let D = "", Ht = 0, Ne = 0, Nn = 0, Ln = !1;
      try {
        if (oe.__emitTokens)
          oe.__emitTokens(E, K);
        else {
          for (O.matcher.considerAll(); ; ) {
            Nn++, Ln ? Ln = !1 : O.matcher.considerAll(), O.matcher.lastIndex = Ne;
            const v = O.matcher.exec(E);
            if (!v) break;
            const k = E.substring(Ne, v.index), M = us(k, v);
            Ne = v.index + M;
          }
          us(E.substring(Ne));
        }
        return K.finalize(), Mn = K.toHTML(), {
          language: b,
          value: Mn,
          relevance: Ht,
          illegal: !1,
          _emitter: K,
          _top: O
        };
      } catch (v) {
        if (v.message && v.message.includes("Illegal"))
          return {
            language: b,
            value: An(E),
            illegal: !0,
            relevance: 0,
            _illegalBy: {
              message: v.message,
              index: Ne,
              context: E.slice(Ne - 100, Ne + 100),
              mode: v.mode,
              resultSoFar: Mn
            },
            _emitter: K
          };
        if (j)
          return {
            language: b,
            value: An(E),
            illegal: !1,
            relevance: 0,
            errorRaised: v,
            _emitter: K,
            _top: O
          };
        throw v;
      }
    }
    function Tn(b) {
      const E = {
        value: An(b),
        illegal: !1,
        relevance: 0,
        _top: x,
        _emitter: new _.__emitter(_)
      };
      return E._emitter.addText(b), E;
    }
    function On(b, E) {
      E = E || _.languages || Object.keys(f);
      const N = Tn(b), I = E.filter(ke).filter(os).map(
        (ee) => ct(ee, b, !1)
      );
      I.unshift(N);
      const W = I.sort((ee, re) => {
        if (ee.relevance !== re.relevance) return re.relevance - ee.relevance;
        if (ee.language && re.language) {
          if (ke(ee.language).supersetOf === re.language)
            return 1;
          if (ke(re.language).supersetOf === ee.language)
            return -1;
        }
        return 0;
      }), [ae, Ee] = W, Bt = ae;
      return Bt.secondBest = Ee, Bt;
    }
    function uo(b, E, N) {
      const I = E && y[E] || N;
      b.classList.add("hljs"), b.classList.add(`language-${I}`);
    }
    function Cn(b) {
      let E = null;
      const N = V(b);
      if (A(N)) return;
      if (Ut(
        "before:highlightElement",
        { el: b, language: N }
      ), b.dataset.highlighted) {
        console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", b);
        return;
      }
      if (b.children.length > 0 && (_.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(b)), _.throwUnescapedHTML))
        throw new lo(
          "One of your code blocks includes unescaped HTML.",
          b.innerHTML
        );
      E = b;
      const I = E.textContent, W = N ? H(I, { language: N, ignoreIllegals: !0 }) : On(I);
      b.innerHTML = W.value, b.dataset.highlighted = "yes", uo(b, N, W.language), b.result = {
        language: W.language,
        // TODO: remove with version 11.0
        re: W.relevance,
        relevance: W.relevance
      }, W.secondBest && (b.secondBest = {
        language: W.secondBest.language,
        relevance: W.secondBest.relevance
      }), Ut("after:highlightElement", { el: b, result: W, text: I });
    }
    function ho(b) {
      _ = ns(_, b);
    }
    const po = () => {
      jt(), Ye("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    };
    function fo() {
      jt(), Ye("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    }
    let is = !1;
    function jt() {
      function b() {
        jt();
      }
      if (document.readyState === "loading") {
        is || window.addEventListener("DOMContentLoaded", b, !1), is = !0;
        return;
      }
      document.querySelectorAll(_.cssSelector).forEach(Cn);
    }
    function bo(b, E) {
      let N = null;
      try {
        N = E(c);
      } catch (I) {
        if (Me("Language definition for '{}' could not be registered.".replace("{}", b)), j)
          Me(I);
        else
          throw I;
        N = x;
      }
      N.name || (N.name = b), f[b] = N, N.rawDefinition = E.bind(null, c), N.aliases && rs(N.aliases, { languageName: b });
    }
    function go(b) {
      delete f[b];
      for (const E of Object.keys(y))
        y[E] === b && delete y[E];
    }
    function mo() {
      return Object.keys(f);
    }
    function ke(b) {
      return b = (b || "").toLowerCase(), f[b] || f[y[b]];
    }
    function rs(b, { languageName: E }) {
      typeof b == "string" && (b = [b]), b.forEach((N) => {
        y[N.toLowerCase()] = E;
      });
    }
    function os(b) {
      const E = ke(b);
      return E && !E.disableAutodetect;
    }
    function yo(b) {
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
    function vo(b) {
      yo(b), T.push(b);
    }
    function wo(b) {
      const E = T.indexOf(b);
      E !== -1 && T.splice(E, 1);
    }
    function Ut(b, E) {
      const N = b;
      T.forEach(function(I) {
        I[N] && I[N](E);
      });
    }
    function _o(b) {
      return Ye("10.7.0", "highlightBlock will be removed entirely in v12.0"), Ye("10.7.0", "Please use highlightElement now."), Cn(b);
    }
    Object.assign(c, {
      highlight: H,
      highlightAuto: On,
      highlightAll: jt,
      highlightElement: Cn,
      // TODO: Remove with v12 API
      highlightBlock: _o,
      configure: ho,
      initHighlighting: po,
      initHighlightingOnLoad: fo,
      registerLanguage: bo,
      unregisterLanguage: go,
      listLanguages: mo,
      getLanguage: ke,
      registerAliases: rs,
      autoDetection: os,
      inherit: ns,
      addPlugin: vo,
      removePlugin: wo
    }), c.debugMode = function() {
      j = !1;
    }, c.safeMode = function() {
      j = !0;
    }, c.versionString = oo, c.regex = {
      concat: m,
      lookahead: p,
      either: S,
      optional: C,
      anyNumberOfTimes: w
    };
    for (const b in Dt)
      typeof Dt[b] == "object" && e(Dt[b]);
    return Object.assign(c, Dt), c;
  }, Qe = ss({});
  return Qe.newInstance = () => ss({}), Bn = Qe, Qe.HighlightJS = Qe, Qe.default = Qe, Bn;
}
var Cc = /* @__PURE__ */ Oc();
const wn = /* @__PURE__ */ Tc(Cc), Cs = "[A-Za-z$_][0-9A-Za-z$_]*", Mc = [
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
], Nc = [
  "true",
  "false",
  "null",
  "undefined",
  "NaN",
  "Infinity"
], fr = [
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
], br = [
  "Error",
  "EvalError",
  "InternalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError"
], gr = [
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
], Lc = [
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
], Rc = [].concat(
  gr,
  fr,
  br
);
function $c(e) {
  const t = e.regex, n = (z, { after: xe }) => {
    const Ce = "</" + z[0].slice(1);
    return z.input.indexOf(Ce, xe) !== -1;
  }, a = Cs, s = {
    begin: "<>",
    end: "</>"
  }, i = /<[A-Za-z0-9\\._:-]+\s*\/>/, r = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    /**
     * @param {RegExpMatchArray} match
     * @param {CallbackResponse} response
     */
    isTrulyOpeningTag: (z, xe) => {
      const Ce = z[0].length + z.index, Ze = z.input[Ce];
      if (
        // HTML should not include another raw `<` inside a tag
        // nested type?
        // `<Array<Array<number>>`, etc.
        Ze === "<" || // the , gives away that this is not HTML
        // `<T, A extends keyof T, V>`
        Ze === ","
      ) {
        xe.ignoreMatch();
        return;
      }
      Ze === ">" && (n(z, { after: Ce }) || xe.ignoreMatch());
      let dt;
      const It = z.input.substring(Ce);
      if (dt = It.match(/^\s*=/)) {
        xe.ignoreMatch();
        return;
      }
      if ((dt = It.match(/^\s+extends\s+/)) && dt.index === 0) {
        xe.ignoreMatch();
        return;
      }
    }
  }, o = {
    $pattern: Cs,
    keyword: Mc,
    literal: Nc,
    built_in: Rc,
    "variable.language": Lc
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
  }, ue = [
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
  p.contains = ue.concat({
    // we need to pair up {} inside our subst to prevent
    // it from ending too early by matching another }
    begin: /\{/,
    end: /\}/,
    keywords: o,
    contains: [
      "self"
    ].concat(ue)
  });
  const he = [].concat(L, p.contains), X = he.concat([
    // eat recursive parens in sub expressions
    {
      begin: /(\s*)\(/,
      end: /\)/,
      keywords: o,
      contains: ["self"].concat(he)
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
  }, Xe = {
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
        ...fr,
        ...br
      ]
    }
  }, ne = {
    label: "use_strict",
    className: "meta",
    relevance: 10,
    begin: /^\s*['"]use (strict|asm)['"]/
  }, Rt = {
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
    contains: [Q],
    illegal: /%/
  }, $t = {
    relevance: 0,
    match: /\b[A-Z][A-Z_0-9]+\b/,
    className: "variable.constant"
  };
  function xn(z) {
    return t.concat("(?!", z.join("|"), ")");
  }
  const kn = {
    match: t.concat(
      /\b/,
      xn([
        ...gr,
        "super",
        "import",
        "await"
      ].map((z) => `${z}\\s*\\(`)),
      a,
      t.lookahead(/\s*\(/)
    ),
    className: "title.function",
    relevance: 0
  }, Oe = {
    begin: t.concat(/\./, t.lookahead(
      t.concat(a, /(?![0-9A-Za-z$_(])/)
    )),
    end: a,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, En = {
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
      Q
    ]
  }, Pt = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + e.UNDERSCORE_IDENT_RE + ")\\s*=>", Sn = {
    match: [
      /const|var|let/,
      /\s+/,
      a,
      /\s*/,
      /=\s*/,
      /(async\s*)?/,
      // async is optional
      t.lookahead(Pt)
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
    exports: { PARAMS_CONTAINS: X, CLASS_REFERENCE: _e },
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
      Sn,
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
            begin: Pt,
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
      Rt,
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
          e.inherit(e.TITLE_MODE, { begin: a, className: "title.function" })
        ]
      },
      // catch ... so it won't trigger the property rule below
      {
        match: /\.\.\./,
        relevance: 0
      },
      Oe,
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
        contains: [Q]
      },
      kn,
      $t,
      Xe,
      En,
      {
        match: /\$[(.]/
        // relevance booster for a pattern common to JS libs: `$(something)` and `$.something`
      }
    ]
  };
}
const Pc = "([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity", Ic = {
  scope: "number",
  match: Pc,
  relevance: 0
};
function Dc(e) {
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
      Ic,
      e.C_LINE_COMMENT_MODE,
      e.C_BLOCK_COMMENT_MODE
    ],
    illegal: "\\S"
  };
}
function qc(e) {
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
  ].filter((X) => !u.includes(X)), m = {
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
  function L(X) {
    return t.concat(
      /\b/,
      t.either(...X.map((Q) => Q.replace(/\s+/, "\\s+"))),
      /\b/
    );
  }
  const ue = {
    scope: "keyword",
    match: L(p),
    relevance: 0
  };
  function he(X, {
    exceptions: Q,
    when: Xe
  } = {}) {
    const _e = Xe;
    return Q = Q || [], X.map((ne) => ne.match(/\|\d+$/) || Q.includes(ne) ? ne : _e(ne) ? `${ne}|0` : ne);
  }
  return {
    name: "SQL",
    case_insensitive: !0,
    // does not include {} or HTML tags `</`
    illegal: /[{}]|<\//,
    keywords: {
      $pattern: /\b[\w\.]+/,
      keyword: he(C, { when: (X) => X.length < 3 }),
      literal: i,
      type: o,
      built_in: h
    },
    contains: [
      {
        scope: "type",
        match: L(r)
      },
      ue,
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
wn.registerLanguage("javascript", $c);
wn.registerLanguage("json", Dc);
wn.registerLanguage("sql", qc);
const zt = /* @__PURE__ */ new Map(), jc = 400, Uc = 2e4;
function Ms(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function Bc(e, t) {
  const n = String(e ?? "");
  if (n === "") return "";
  if (n.length > Uc) return Ms(n);
  const a = `${t}:${n}`, s = zt.get(a);
  if (s !== void 0) return s;
  let i;
  try {
    i = wn.highlight(n, { language: t, ignoreIllegals: !0 }).value;
  } catch {
    i = Ms(n);
  }
  return zt.size >= jc && zt.clear(), zt.set(a, i), i;
}
async function ca(e) {
  const t = await fetch(e, { headers: { Accept: "application/json" } }), n = await t.json().catch(() => null);
  if (!t.ok) throw new Error(n && n.error || `HTTP ${t.status}`);
  if (n === null) throw new Error("The response was not JSON.");
  return n;
}
async function Ns(e) {
  const t = await ca(e), n = {};
  return Object.entries(t.sections || {}).forEach(([a, s]) => {
    n[a] = s.payload || {};
  }), { profile: t, payloads: n };
}
function Ba(e, t = 0) {
  return Number(e || 0).toFixed(t);
}
function Fa(e) {
  const t = Number(e || 0);
  return t < 1024 ? `${t} B` : t < 1048576 ? `${(t / 1024).toFixed(1)} kB` : `${(t / 1048576).toFixed(1)} MB`;
}
function Fc(e, t, n) {
  return `${e} ${Number(e) === 1 ? t : n}`;
}
function Hc(e, t = Date.now() / 1e3) {
  const n = Math.max(0, t - Number(e || 0));
  return n < 60 ? `${Math.round(n)}s ago` : n < 3600 ? `${Math.round(n / 60)}m ago` : `${Math.round(n / 3600)}h ago`;
}
function Wc(e, t) {
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
function Gc(e) {
  const t = e && e.magewire;
  return t && t.component ? `${t.component} ${t.action || ""}`.trim() : e && e.path || "/";
}
function Vc(e) {
  if (!e || e.delta === null || e.delta === void 0) return "not comparable";
  if (e.delta === 0) return "no change";
  const t = e.delta > 0 ? "+" : "-", n = e.unit === "B" ? Fa(Math.abs(e.delta)) : `${Ba(Math.abs(e.delta), e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
  return `${t}${n}`;
}
function zc(e, t) {
  const n = e[t];
  return n == null ? "none" : e.unit === "B" ? Fa(n) : `${Ba(n, e.decimals)}${e.unit ? ` ${e.unit}` : ""}`;
}
function Kc(e) {
  return Object.entries(e.methods || {}).map(([t, n]) => `${n} ${t}`).join(", ");
}
function mr(e, t, n, a) {
  if (!e || !n || !/^[a-z][a-z0-9+.-]*:\/\//i.test(e) || /^(javascript|data|vbscript):/i.test(e))
    return "";
  const s = n.startsWith("/") ? n : `${t}/${n}`;
  return e.replace("%f", () => encodeURI(s)).replace("%l", () => String(a || 1));
}
function Jc(e, t, n) {
  const a = String(n || "").match(/^(.+\.php):(\d+)$/);
  return a ? mr(e, t, a[1], Number(a[2])) : "";
}
const ua = /* @__PURE__ */ new Map(), Kt = /* @__PURE__ */ new Map();
function Ha() {
  const e = window.Magewire || window.magewire;
  return e && typeof e == "object" ? e : null;
}
function Wa() {
  const e = Ha();
  try {
    return Object.values(e?.components?.componentsById ?? {});
  } catch {
    return [];
  }
}
function Xc(e) {
  try {
    return JSON.stringify(e ?? {}).length;
  } catch {
    return 0;
  }
}
function Zc(e) {
  return ua.clear(), Wa().map((t) => {
    const n = t.fingerprint ?? {}, a = t.serverMemo ?? {}, s = String(n.id ?? "");
    return t.el && ua.set(s, t.el), {
      id: s,
      name: String(n.name ?? "unknown"),
      resolver: String(n.resolver ?? "unknown"),
      handle: String(n.handle ?? ""),
      keys: e === te ? 0 : vn(a.data ?? {}).length,
      memo_bytes: Xc(a),
      listeners: (t.effects?.listeners ?? []).length,
      children: Object.keys(a.children ?? {}).length,
      path: t.el ? Yc(t.el) : ""
    };
  });
}
function Yc(e) {
  const t = e.tagName ? e.tagName.toLowerCase() : "?";
  return e.id ? `${t}#${e.id}` : t;
}
function Ls(e, t) {
  if (t === te)
    return "The value policy is set to none, so component state is not read.";
  const n = Wa().find((a) => String(a.fingerprint?.id) === String(e));
  if (!n) return "This component is no longer on the page.";
  try {
    return JSON.stringify(yn(n.serverMemo?.data ?? {}, t), null, 2);
  } catch (a) {
    return `Could not read this component: ${a && a.message ? a.message : "threw"}`;
  }
}
function Qc() {
  return {
    present: Ha() !== null,
    components: Wa().length,
    // Already the route, not the base: Magewire publishes it as /magewire/post and the
    // client appends the action itself.
    endpoint: String(window.livewire_app_url || "")
  };
}
function Rs(e) {
  const t = Ha();
  if (!t || typeof t.hook != "function") return !1;
  const n = /* @__PURE__ */ new Map(), a = (i) => String(i?.fingerprint?.name ?? "unknown"), s = (i) => String(i?.component?.fingerprint?.id ?? "");
  try {
    t.hook("message.sent", (i, r) => {
      n.set(s(i), { at: performance.now(), name: a(r) });
    }), t.hook("message.processed", (i, r) => {
      const o = n.get(s(i));
      n.delete(s(i)), e({
        component: a(r),
        action: $s(i),
        duration_ms: o ? Math.round((performance.now() - o.at) * 10) / 10 : null,
        failed: !1
      });
    }), t.hook("message.failed", (i, r) => {
      n.delete(s(i)), e({
        component: a(r),
        action: $s(i),
        duration_ms: null,
        failed: !0
      });
    });
  } catch {
    return !1;
  }
  return !0;
}
function $s(e) {
  const t = (e?.updateQueue ?? [])[0];
  if (!t) return "refresh";
  const n = t.payload ?? {}, a = (...s) => s.map((i) => n[i] ?? t[i]).find(Boolean) ?? "unknown";
  return t.type === "callMethod" ? `${a("method")}()` : t.type === "syncInput" ? `set ${a("name")}` : t.type === "fireEvent" ? `on ${a("event")}` : String(t.type || "update");
}
function eu(e, t) {
  const n = ua.get(String(e));
  if (!n || !n.style) return;
  if (t) {
    Kt.has(String(e)) || Kt.set(String(e), {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  const a = Kt.get(String(e));
  a && (n.style.outline = a.outline, n.style.outlineOffset = a.offset, Kt.delete(String(e)));
}
const Fn = /* @__PURE__ */ new WeakMap(), cn = /* @__PURE__ */ new Map(), ft = /* @__PURE__ */ new Map();
let Ps = 0;
function _n() {
  const e = Wn || window.Alpine;
  return !e || typeof e != "object" || e === xt ? null : e;
}
function yr(e) {
  try {
    return typeof e.prefixed == "function" ? e.prefixed("data") : "x-data";
  } catch {
    return "x-data";
  }
}
function ha(e) {
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
function tu(e) {
  if (typeof e.evaluate != "function") return null;
  const t = ha(() => e.evaluate(document.body, "1"));
  return t === 1 ? !1 : t === void 0 ? !0 : null;
}
function Is() {
  return Array.from(document.scripts).map((e) => e.src).filter((e) => /alpine/i.test(e)).map((e) => e.split("/").pop().split("?")[0]).join(", ");
}
function nu(e) {
  if (typeof e.injectMagics == "function") {
    const t = ha(() => {
      const n = {};
      return e.injectMagics(n, document.body), n.$store;
    });
    if (t && typeof t == "object") return t;
  }
  if (typeof e.evaluate == "function") {
    const t = ha(() => e.evaluate(document.body, "$store"));
    if (t && typeof t == "object") return t;
  }
  return null;
}
function au(e) {
  const t = e.trim().match(/^([A-Za-z_$][\w$]*)\s*(\(|$)/);
  return t ? t[1] : "inline";
}
function su(e) {
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
function iu(e) {
  return Fn.has(e) || (Ps += 1, Fn.set(e, Ps)), Fn.get(e);
}
function vr(e, t) {
  const n = t._x_dataStack;
  if (Array.isArray(n) && n.length > 0) return n[0];
  if (typeof e.$data != "function") return null;
  try {
    return e.$data(t);
  } catch {
    return null;
  }
}
function ru(e) {
  const t = _n();
  if (cn.clear(), !t) return [];
  const n = yr(t), a = `${n.replace(/data$/, "")}defer`;
  return Array.from(document.querySelectorAll(`[${n}]`)).map((i) => {
    const r = iu(i), o = (i.getAttribute(n) || "").trim(), l = (i.getAttribute(a) || "").trim(), d = vr(t, i);
    return cn.set(r, i), {
      id: r,
      name: au(o),
      expression: pr(o, e),
      path: su(i),
      initialised: !!i._x_dataStack,
      deferred: i.hasAttribute(a),
      strategy: l || "none",
      keys: e === te || !d ? 0 : vn(d).length
    };
  });
}
function Ds(e, t) {
  if (t === te)
    return "The value policy is set to none, so component state is not read.";
  const n = _n(), a = cn.get(e);
  if (!n || !a) return "This component is no longer on the page.";
  if (!a._x_dataStack) return "This component has not initialised, so it has no state yet.";
  const s = vr(n, a);
  if (!s) return "Alpine would not hand over this component's scope.";
  try {
    return JSON.stringify(yn(s, t), null, 2);
  } catch (i) {
    return `Could not read this component: ${i && i.message ? i.message : "threw"}`;
  }
}
function ou(e) {
  const t = _n();
  if (!t) return [];
  const n = nu(t);
  return n ? Object.keys(n).map((a) => {
    let s = n[a], i = 0;
    if (i = s && typeof s == "object" ? vn(s).length : 0, e === te)
      return { name: a, keys: 0, value: "The value policy is set to none, so stores are not read." };
    try {
      s = JSON.stringify(yn(s, e), null, 2);
    } catch (r) {
      s = `Could not read this store: ${r && r.message ? r.message : "threw"}`;
    }
    return { name: a, keys: i, value: s };
  }) : [];
}
function lu(e) {
  const t = window.__siteationDebugBar;
  return !t || !Array.isArray(t.alpineErrors) ? [] : t.alpineErrors.map((n) => {
    const a = String(n.message || ""), s = a.match(/Expression: "([\s\S]*?)"/);
    return {
      // An expression that threw is still a server rendered expression, and a message that
      // names the value it choked on is still that value. The rest of this section applies
      // the policy to exactly these two things; this was the one reader that did not.
      message: dn(a.split(`
`)[0].replace(/^Alpine (Expression )?Error:\s*/, ""), e),
      expression: s ? pr(s[1], e) : "",
      element: String(n.element || ""),
      during_init: !!n.during_init
    };
  });
}
function du() {
  const e = _n();
  return e ? {
    present: !0,
    version: String(e.version || "unknown"),
    csp: tu(e),
    source: Is(),
    prefix: yr(e)
  } : { present: !1, version: "", csp: null, source: Is(), prefix: "" };
}
function cu(e, t) {
  const n = cn.get(e);
  if (!n || !n.style) return;
  if (t) {
    ft.has(e) || ft.set(e, {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "-2px";
    return;
  }
  if (!ft.has(e)) return;
  const a = ft.get(e);
  n.style.outline = a.outline, n.style.outlineOffset = a.offset, ft.delete(e);
}
const qs = 2e5, uu = /^https?:\/\/(www\.)?schema\.org\//i, wr = {
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
}, Ga = {
  NewsArticle: "Article",
  BlogPosting: "Article",
  ProductGroup: "Product",
  Corporation: "Organization",
  OnlineStore: "Organization",
  OnlineBusiness: "Organization",
  LocalBusiness: "Organization",
  Store: "Organization"
}, hu = ["BreadcrumbList", "WebSite", "Organization", "FAQPage"];
function we(e) {
  return (Array.isArray(e) ? e : String(e ?? "").split(/\s+/)).map((n) => String(n ?? "").trim().replace(uu, "")).filter(Boolean);
}
function _r(e) {
  for (const t of e) {
    const n = Ga[t] || t;
    if (wr[n]) return n;
  }
  return "";
}
function pu(e, t) {
  const n = /line (\d+) column (\d+)/i.exec(e);
  if (n) return { line: Number(n[1]), column: Number(n[2]) };
  const a = /position (\d+)/i.exec(e);
  if (!a) return null;
  const s = t.slice(0, Number(a[1])).split(`
`);
  return { line: s.length, column: s[s.length - 1].length + 1 };
}
function fu(e) {
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
      r.error = String(d && d.message || d), r.at = pu(r.error, i), r.excerpt = r.at ? (i.split(`
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
function bu(e) {
  const t = e.tagName.toLowerCase(), n = (a) => (e.getAttribute(a) || "").trim();
  return t === "meta" ? n("content") : ["a", "area", "link"].includes(t) ? n("href") : ["audio", "embed", "iframe", "img", "source", "track", "video"].includes(t) ? n("src") : t === "object" ? n("data") : ["data", "meter"].includes(t) ? n("value") : t === "time" && e.hasAttribute("datetime") ? n("datetime") : e.hasAttribute("content") ? n("content") : String(e.textContent || "").replace(/\s+/g, " ").trim();
}
function xr(e) {
  const t = {}, n = we(e.getAttribute("itemtype"));
  n.length === 1 ? t["@type"] = n[0] : n.length > 1 && (t["@type"] = n), e.getAttribute("itemid") && (t["@id"] = e.getAttribute("itemid"));
  const a = (i, r) => {
    i in t ? Array.isArray(t[i]) ? t[i].push(r) : t[i] = [t[i], r] : t[i] = r;
  }, s = (i) => {
    Array.from(i.children).forEach((r) => {
      const o = (r.getAttribute("itemprop") || "").trim().split(/\s+/).filter(Boolean), l = r.hasAttribute("itemscope");
      o.forEach((d) => a(d, l ? xr(r) : bu(r))), l || s(r);
    });
  };
  return s(e), t;
}
function kr(e) {
  const t = Array.from(e.querySelectorAll("[itemscope]")).filter((n) => !n.hasAttribute("itemprop"));
  return {
    entities: t.map((n, a) => {
      const s = we(n.getAttribute("itemtype")), i = t.findIndex((r) => r !== n && r.contains(n) && we(r.getAttribute("itemtype")).some((o) => s.includes(o)));
      return {
        source: "microdata",
        block: a,
        where: gu(n),
        inside: i,
        data: xr(n)
      };
    }),
    elements: t
  };
}
function gu(e) {
  const t = e.tagName.toLowerCase(), n = e.getAttribute("id"), a = (e.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
  return n ? `<${t} id="${n}">` : a.length > 0 ? `<${t} class="${a[0]}">` : `<${t}>`;
}
function Va(e) {
  return e == null ? !1 : typeof e == "string" ? e.trim() !== "" : Array.isArray(e) ? e.some(Va) : !0;
}
function je(e, t) {
  const [n, ...a] = t.split("."), s = e[n];
  return a.length === 0 ? Va(s) : (Array.isArray(s) ? s : [s]).some((r) => r && typeof r == "object" && je(r, a.join(".")));
}
function Er(e, t, n, a = 0) {
  if (a > 6) return;
  const s = we(e["@type"]), i = _r(s), r = t ? `${t} > ${s[0] || "item"}` : s[0] || "item", o = wr[i];
  if (o) {
    const l = (d, u) => n.push({ level: d, path: r, message: u, docs: o.docs });
    (o.required || []).filter((d) => !je(e, d)).forEach((d) => {
      l("required", `Missing ${d}.`);
    }), (o.oneOf || []).filter((d) => !d.some((u) => je(e, u))).forEach((d) => {
      l("required", `Needs one of ${d.join(", ")}.`);
    }), (o.recommended || []).filter((d) => !je(e, d)).forEach((d) => {
      l("recommended", `No ${d}.`);
    }), o.note && l("note", o.note), i === "BreadcrumbList" && mu(e, l), i === "WebSite" && yu(e, l), (i === "Offer" || i === "AggregateOffer") && vu(e, l);
  }
  Object.entries(e).forEach(([l, d]) => {
    if (l.startsWith("@")) return;
    (Array.isArray(d) ? d : [d]).forEach((h) => {
      h && typeof h == "object" && h["@type"] && Er(h, `${r} > ${l}`, n, a + 1);
    });
  });
}
function mu(e, t) {
  const a = (Array.isArray(e.itemListElement) ? e.itemListElement : [e.itemListElement]).filter((i) => i && typeof i == "object");
  a.forEach((i, r) => {
    const o = je(i, "name") || je(i, "item.name"), l = je(i, "item");
    o || t("required", `Crumb ${r + 1} has no name.`), !l && r < a.length - 1 && t("required", `Crumb ${r + 1} has no item URL.`);
  }), a.map((i) => Number(i.position)).some((i, r) => i !== r + 1) && t("required", "The crumb positions do not count up from 1.");
}
function yu(e, t) {
  (Array.isArray(e.potentialAction) ? e.potentialAction : [e.potentialAction]).filter((a) => a && typeof a == "object" && we(a["@type"]).includes("SearchAction")).forEach((a) => {
    const s = typeof a.target == "object" && a.target ? String(a.target.urlTemplate || "") : String(a.target || ""), i = String(a["query-input"] || ""), r = (/name=([\w-]+)/.exec(i) || [])[1] || "";
    s ? r && !s.includes(`{${r}}`) && t("required", `The SearchAction target has no {${r}} for the query-input to fill.`) : t("required", "The SearchAction has no target.");
  });
}
function vu(e, t) {
  const n = e.price ?? e.lowPrice;
  Va(n) && !/^\d+(\.\d+)?$/.test(String(n).trim()) && t("required", `The price "${n}" is not a plain number. Use a dot for decimals and leave out the currency sign.`);
  const a = String(e.priceCurrency || "").trim();
  a && !/^[A-Z]{3}$/.test(a) && t("required", `"${a}" is not a three letter ISO 4217 currency code.`);
}
function wu(e) {
  const t = e.name ?? e.headline ?? e.url ?? e["@id"] ?? "", n = Array.isArray(t) ? t[0] : t;
  return typeof n == "string" ? n.replace(/\s+/g, " ").trim().slice(0, 120) : "";
}
function Sr(e) {
  const t = we(e["@type"]).map((a) => Ga[a] || a).sort(), n = e["@id"] || e.sku || e.url || e.name;
  return t.length === 0 || !n || typeof n != "string" ? "" : `${t.join("+")}|${n.trim().toLowerCase()}`;
}
function js(e) {
  const t = e.map((n) => Sr(n.data));
  return t[0] !== "" && t.every((n) => n === t[0]);
}
function _u(e) {
  const t = [], n = /* @__PURE__ */ new Map(), a = e.filter((r) => r.source === "microdata"), s = /* @__PURE__ */ new Set();
  a.forEach((r) => {
    if (r.inside === void 0 || r.inside < 0) return;
    const o = a.find((l) => l.block === r.inside);
    o && (s.add(o), t.push(`${r.type} is declared on ${o.where} and again on ${r.where} inside it. Its properties go to the inner one, so the outer one is a second, empty ${r.type}. Remove one itemscope.`));
  }), e = e.filter((r) => !s.has(r)), e.forEach((r) => {
    const o = Sr(r.data);
    o && n.set(o, [...n.get(o) || [], r]);
  }), n.forEach((r) => {
    if (r.length < 2) return;
    const o = [...new Set(r.map((d) => d.source === "json-ld" ? "JSON-LD" : "microdata"))], l = o.length > 1 ? `in both ${o.join(" and ")}` : `${r.length} times in ${o[0]}`;
    t.push(`${r[0].type} "${r[0].name}" is described ${l}. Usually a theme and a module both write it; keep one.`);
  }), hu.forEach((r) => {
    const o = e.filter((l) => we(l.data["@type"]).some((d) => (Ga[d] || d) === r));
    o.length > 1 && !js(o) && t.push(`${o.length} ${r} entities on one page. A page has one; keep the one that is right.`);
  });
  const i = e.filter((r) => _r(we(r.data["@type"])) === "Product");
  return i.length > 1 && !js(i) && t.push(`${i.length} different top level products. A product page describes one; a list of products belongs in an ItemList.`), t;
}
function xu(e) {
  let t;
  try {
    t = new URL(e).hostname.toLowerCase();
  } catch {
    return !1;
  }
  return !(t === "localhost" || !t.includes(".") || /\.(test|local|localhost|internal|example|invalid|lan|home|dev\.local)$/.test(t) || /^(10|127)\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\.|^169\.254\./.test(t) || t.startsWith("["));
}
function ku(e) {
  const t = xu(e), n = encodeURIComponent(e);
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
function Eu(e) {
  const t = Array.from(e.querySelectorAll("script[type]")).filter((s) => s.getAttribute("type").trim().toLowerCase() === "application/ld+json").map((s) => `<script type="application/ld+json">${s.textContent}<\/script>`), n = kr(e).elements.map((s) => s.outerHTML), a = [...t, ...n].join(`
`);
  return a.length > qs ? a.slice(0, qs) : a;
}
function Su(e, t) {
  const n = fu(e), a = kr(e), s = [...n.entities, ...a.entities].map((r, o) => {
    const l = [];
    return Er(r.data, "", l), {
      index: o,
      source: r.source,
      block: r.block,
      where: r.where || "",
      inside: r.inside ?? -1,
      type: we(r.data["@type"]).join(", ") || "untyped",
      name: wu(r.data),
      json: JSON.stringify(r.data, null, 2),
      data: r.data,
      findings: l
    };
  }), i = [];
  return n.blocks.filter((r) => r.error).forEach((r) => {
    const o = r.at ? ` at line ${r.at.line}, column ${r.at.column}` : "";
    i.push(`JSON-LD block ${r.index + 1} does not parse${o}: ${r.error}`);
  }), i.push(..._u(s)), s.forEach((r) => {
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
      links: ku(t)
    },
    elements: a.elements
  };
}
function Au() {
  return { blocks: [], entities: [], warnings: [], links: { public: !1, tools: [] } };
}
const Tu = { min: 30, max: 60 }, Ou = { min: 70, max: 160 }, Cu = ["og:title", "og:type", "og:image", "og:url"], Mu = ["twitter:card"], Nu = 2, Lu = 200, pa = 160, Ru = /^[a-z]{2,3}(-[a-z]{4})?(-([a-z]{2}|\d{3}))?$/i;
function $u(e) {
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
function Pu() {
  return {
    measure: $u,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1
  };
}
function Ve(e) {
  const t = String(e || "").replace(/\s+/g, " ").trim();
  return t.length <= pa ? t : `${t.slice(0, pa)}...`;
}
function ze(e, t) {
  try {
    return new URL(e, t);
  } catch {
    return null;
  }
}
function za(e, t) {
  return String(e.getAttribute(t) || "").toLowerCase().split(/\s+/).filter(Boolean);
}
function un(e, t) {
  return Array.from(e.querySelectorAll("meta")).filter((n) => (n.getAttribute("name") || n.getAttribute("property") || "").toLowerCase() === t);
}
function Us(e, t) {
  return e === 0 ? "missing" : e < t.min ? `too short, under ${t.min} characters` : e > t.max ? `too long, over ${t.max} characters, so it will be cut` : "";
}
function Ar(e) {
  return e === "" ? "missing" : Ru.test(e) ? /-uk$/i.test(e) ? `"${e}" uses UK, which is not a region code; use GB` : "" : `"${e}" is not a valid language code`;
}
function Ot(e) {
  return `${e.protocol}//${e.host}${e.pathname}${e.search}`;
}
function Iu(e, t) {
  if (Ot(e) === Ot(t)) return "";
  if (e.protocol !== t.protocol)
    return `it uses ${e.protocol.replace(":", "")} and this page uses ${t.protocol.replace(":", "")}`;
  if (e.host !== t.host) return `it points to another host, ${e.host}`;
  const n = e.pathname.replace(/\/$/, "") === t.pathname.replace(/\/$/, "");
  return e.pathname !== t.pathname && n ? "only the trailing slash differs" : e.pathname !== t.pathname ? `it points to ${e.pathname}` : t.search && !e.search ? `this URL has a query string (${t.search}) that the canonical leaves out` : e.search && !t.search ? `it adds a query string (${e.search}) that this URL does not have` : "the query string differs";
}
function Du(e, t) {
  const n = Array.from(e.querySelectorAll("link[rel]")).filter((l) => za(l, "rel").includes("canonical")), a = [];
  if (n.length === 0)
    return { href: "", resolved: "", count: 0, warnings: ["No canonical URL."] };
  n.length > 1 && a.push(`${n.length} canonical links. Search engines ignore all of them when they disagree, and may when they do not.`);
  const s = (n[0].getAttribute("href") || "").trim(), i = ze(s, t), r = ze(t, t);
  if (s === "" || !i)
    return a.push("The canonical link has no usable URL."), { href: s, resolved: "", count: n.length, warnings: a };
  /^[a-z][a-z0-9+.-]*:/i.test(s) || a.push("The canonical URL is relative. Use the full URL, with the scheme and host.");
  const o = r ? Iu(i, r) : "";
  return o && a.push(`The canonical URL is not this page: ${o}.`), { href: s, resolved: i.href, count: n.length, warnings: a };
}
function qu(e, t) {
  const n = ze(t, t), a = Array.from(e.querySelectorAll("link[hreflang]")).filter((i) => za(i, "rel").includes("alternate")).map((i) => {
    const r = (i.getAttribute("hreflang") || "").trim(), o = ze(i.getAttribute("href") || "", t);
    return {
      lang: r,
      href: o ? o.href : "",
      self: !!(o && n && Ot(o) === Ot(n)),
      problem: r.toLowerCase() === "x-default" ? "" : Ar(r)
    };
  });
  if (a.length === 0) return { items: a, warnings: [] };
  const s = [];
  return a.some((i) => i.self) || s.push("No hreflang link points to this page. Every page in the set has to list itself."), a.some((i) => i.lang.toLowerCase() === "x-default") || s.push("No x-default alternate, so visitors whose language is not listed get no fallback."), a.filter((i) => i.problem).forEach((i) => {
    s.push(`hreflang ${i.problem}.`);
  }), { items: a, warnings: s };
}
function ju(e) {
  if (!e) return 0;
  let t = 0;
  const n = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "SVG"]), a = (s) => {
    s.childNodes.forEach((i) => {
      i.nodeType === 3 ? t += (i.textContent.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length : i.nodeType === 1 && !n.has(i.nodeName.toUpperCase()) && a(i);
    });
  };
  return a(e), t;
}
function Uu(e, t = "") {
  const n = [...un(e, "robots"), ...un(e, "googlebot")].map((i) => (i.getAttribute("content") || "").trim()).filter(Boolean).join(", "), a = [], s = `${n}, ${t}`.toLowerCase();
  return /\b(noindex|none)\b/.test(s) && a.push("This page asks not to be indexed."), /\b(nofollow|none)\b/.test(s) && a.push("This page asks search engines not to follow its links."), { meta: n, header: String(t || ""), warnings: a };
}
function Bu(e, t, n = "") {
  const a = e.querySelector("head title") || e.querySelector("title"), s = Ve(a ? a.textContent : ""), i = un(e, "description")[0], r = Ve(i ? i.getAttribute("content") : ""), o = (e.documentElement.getAttribute("lang") || "").trim(), l = un(e, "viewport")[0], d = e.querySelector("meta[charset]") || Array.from(e.querySelectorAll("meta[http-equiv]")).find((h) => /charset=/i.test(h.getAttribute("content") || "")), u = {
    title: { value: s, length: s.length, hint: Us(s.length, Tu) },
    description: {
      value: r,
      length: r.length,
      hint: Us(r.length, Ou)
    },
    canonical: Du(e, t),
    robots: Uu(e, n),
    hreflang: qu(e, t),
    lang: { value: o, problem: Ar(o) },
    viewport: l ? (l.getAttribute("content") || "").trim() : "",
    charset: {
      value: String(e.characterSet || e.charset || ""),
      declared: !!d
    },
    words: ju(e.body),
    warnings: []
  };
  return u.title.hint && u.warnings.push(`Title ${u.title.hint}.`), u.description.hint && u.warnings.push(`Meta description ${u.description.hint}.`), u.lang.problem && u.warnings.push(`<html lang> ${u.lang.problem}.`), u.viewport || u.warnings.push("No viewport meta tag, so phones draw the desktop layout."), u.charset.declared || u.warnings.push("No charset declared in the markup."), u.warnings.push(
    ...u.canonical.warnings,
    ...u.robots.warnings,
    ...u.hreflang.warnings
  ), u;
}
function Fu(e, t) {
  const n = Array.from(e.querySelectorAll("h1, h2, h3, h4, h5, h6"));
  let a = 0;
  const s = n.map((o, l) => {
    const d = Number(o.tagName.slice(1)), u = Ve(o.textContent), h = [];
    return u === "" && h.push("empty"), a > 0 && d > a + 1 && h.push(`skips from h${a} to h${d}`), t.measure(o).visible || h.push("hidden from view"), a = d, { index: l, level: d, text: u, warnings: h };
  }), i = s.filter((o) => o.level === 1).length, r = [];
  return i === 0 && r.push("No H1."), i > 1 && r.push(`${i} H1 headings. One page, one main heading.`), s.forEach((o) => o.warnings.forEach((l) => {
    r.push(`H${o.level} ${o.text ? `"${o.text}"` : `#${o.index + 1}`}: ${l}.`);
  })), { items: s, warnings: r, elements: n };
}
function Hu(e, t) {
  const n = e.trim().toLowerCase();
  if (n === "") return !1;
  if (/\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?)$/.test(n) || /^(img|image|dsc|dscn|photo|pic|screenshot)[-_ ]?\d+$/.test(n)) return !0;
  const s = String(t || "").split(/[?#]/)[0].split("/").pop().toLowerCase().replace(/\.[a-z0-9]+$/, "");
  return s !== "" && n === s;
}
function Wu(e, t) {
  const n = Array.from(e.querySelectorAll("img")), a = n.map((r, o) => {
    const l = r.currentSrc || r.getAttribute("src") || r.getAttribute("data-src") || "", d = r.hasAttribute("alt") ? r.getAttribute("alt") : null, u = t.measure(r), h = [];
    d === null ? h.push("no alt attribute") : d.trim() === "" ? h.push("empty alt, which is right only for a decorative image") : Hu(d, l) && h.push("alt text is a file name"), (!r.hasAttribute("width") || !r.hasAttribute("height")) && h.push("no width and height, so the page shifts when it loads");
    const p = u.width * t.pixelRatio;
    return u.visible && u.width > 0 && u.naturalWidth > p * Nu && u.naturalWidth - p > Lu && h.push(`${u.naturalWidth}px wide but drawn at ${Math.round(u.width)}px`), (r.getAttribute("loading") || "").toLowerCase() === "lazy" && u.visible && u.top < t.viewportHeight && h.push("lazy loaded but visible on the first screen, which delays it"), {
      index: o,
      src: l,
      alt: d === null ? null : Ve(d),
      size: u.naturalWidth && u.width ? `${Math.round(u.width)} × ${Math.round(u.height)} of ${u.naturalWidth} × ${u.naturalHeight}` : "",
      warnings: h
    };
  }), s = a.filter((r) => r.warnings.length > 0), i = s.length > 0 ? [`${s.length} of ${a.length} images have a problem.`] : [];
  return { items: a, warnings: i, elements: n };
}
function Gu(e) {
  const t = Ve(e.textContent);
  if (t) return t;
  const n = Array.from(e.querySelectorAll("img[alt]")).map((a) => a.getAttribute("alt")).find(Boolean);
  return Ve(e.getAttribute("aria-label") || n || e.getAttribute("title") || "");
}
function Vu(e, t) {
  const n = ze(t, t), a = Array.from(e.querySelectorAll("a[href]")), s = { internal: 0, external: 0, nofollow: 0 }, i = a.map((l, d) => {
    const u = (l.getAttribute("href") || "").trim(), h = ze(u, t), p = za(l, "rel").includes("nofollow"), w = Gu(l), C = [];
    let m = "other";
    return h && /^https?:$/.test(h.protocol) && (m = n && h.host === n.host ? "internal" : "external"), m !== "other" && (s[m] += 1), p && (s.nofollow += 1), w === "" && C.push("no text"), (u === "" || u === "#") && C.push("goes nowhere"), /^javascript:/i.test(u) && C.push("a javascript: link, which is a button pretending"), m === "internal" && p && C.push("internal link marked nofollow"), n && n.protocol === "https:" && h && h.protocol === "http:" && C.push("http: on an https: page"), { index: d, href: u, text: w, kind: m, nofollow: p, warnings: C };
  }), r = i.filter((l) => l.warnings.length > 0), o = r.length > 0 ? [`${r.length} of ${i.length} links have a problem.`] : [];
  return { items: i, counts: s, warnings: o, elements: a };
}
function zu(e) {
  const t = Array.from(e.querySelectorAll("meta")).map((o) => ({
    name: (o.getAttribute("property") || o.getAttribute("name") || "").trim().toLowerCase(),
    value: Ve(o.getAttribute("content"))
  })), n = t.filter((o) => o.name.startsWith("og:")), a = t.filter((o) => o.name.startsWith("twitter:")), s = (o) => t.some((l) => l.name === o && l.value !== ""), i = [];
  Cu.filter((o) => !s(o)).forEach((o) => {
    i.push(`Missing ${o}.`);
  }), Mu.filter((o) => !s(o)).forEach((o) => {
    i.push(`Missing ${o}, so X shows a bare link.`);
  });
  const r = n.find((o) => o.name === "og:image");
  return r && r.value && !/^https?:\/\//i.test(r.value) && i.push("og:image is not a full URL, and link previews will not fetch it."), { openGraph: n, x: a, warnings: i };
}
function Ku(e) {
  const t = ze(e, e);
  return t ? [
    { label: "robots.txt", href: `${t.origin}/robots.txt` },
    { label: "sitemap.xml", href: `${t.origin}/sitemap.xml` },
    {
      label: "PageSpeed Insights",
      href: `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(Ot(t))}`
    }
  ] : [];
}
const Ju = {
  not_frontend: "the request was not a storefront page",
  not_html: "the response was not HTML",
  too_large: "the response was too large to read",
  unreadable: "the server could not parse the HTML"
};
function Xu(e) {
  return String(e ?? "").replace(/\s+/g, " ").trim().replace(/\.\.\.$/, "").slice(0, pa);
}
function Zu(e, t) {
  const n = (o) => ({ available: !1, reason: o, rows: [], changed: 0 });
  if (!e || typeof e != "object" || !("title" in e || "skipped" in e))
    return n("The server kept no SEO record for this page.");
  if (e.skipped)
    return n(`The server kept no SEO record: ${Ju[e.skipped] || e.skipped}.`);
  const a = t.headings.items.filter((o) => o.level === 1), s = (o, l, d) => [o, l, String(e[o] ?? ""), d, Xu], i = (o, l, d) => [o, l, Number(e[o] ?? 0), d, Number], r = [
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
function Yu(e, { url: t, robotsHeader: n = "", env: a }) {
  const { elements: s, ...i } = Fu(e, a), { elements: r, ...o } = Wu(e, a), { elements: l, ...d } = Vu(e, t), { elements: u, model: h } = Su(e, t), p = (m) => m.items.filter((g) => g.warnings.length > 0).length, w = {
    overview: 0,
    headings: i.warnings.length,
    images: p(o),
    links: p(d),
    schema: h.warnings.length,
    social: 0
  }, C = {
    overview: Bu(e, t, n),
    headings: i,
    images: o,
    links: d,
    schema: h,
    social: zu(e),
    quickLinks: Ku(t),
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
function Bs() {
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
    schema: Au(),
    social: { openGraph: [], x: [], warnings: [] },
    quickLinks: [],
    counts: { overview: 0, headings: 0, images: 0, links: 0, schema: 0, social: 0 },
    warningCount: 0
  };
}
let Ka = { headings: [], images: [], links: [], schema: [] };
const Ct = /* @__PURE__ */ new Map();
function Qu(e = "") {
  Array.from(Ct.keys()).forEach((a) => Tr(a));
  const { model: t, elements: n } = Yu(document, {
    url: window.location.href,
    robotsHeader: e,
    env: Pu()
  });
  return Ka = n, t;
}
function Tr(e) {
  const t = Ct.get(e);
  t && (e.style.outline = t.outline, e.style.outlineOffset = t.offset, Ct.delete(e));
}
function eh() {
  return Eu(document);
}
function fa(e, t, n) {
  const a = (Ka[e] || [])[t];
  if (!(!a || !a.style)) {
    if (!n) {
      Tr(a);
      return;
    }
    Ct.has(a) || Ct.set(a, {
      outline: a.style.outline || "",
      offset: a.style.outlineOffset || ""
    }), a.style.outline = "2px solid #7f9cf5", a.style.outlineOffset = "2px";
  }
}
function th(e, t) {
  const n = (Ka[e] || [])[t];
  n && (n.scrollIntoView({ block: "center", behavior: "smooth" }), fa(e, t, !0));
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
], nh = Or.filter((e) => !["refund"].includes(e)), Ja = ["ad_storage", "analytics_storage", "ad_user_data", "ad_personalization"], ah = 2e3, ba = "siteation.debugbar.datalayer.v1", sh = 500, ih = 4e5;
function rh(e) {
  const t = e.value;
  if (e.gtag && Array.isArray(t)) {
    const n = String(t[0] ?? ""), a = typeof t[1] == "string" ? t[1] : "";
    return { kind: "gtag", name: a ? `${n} ${a}` : n, args: t };
  }
  return t && typeof t == "object" && !Array.isArray(t) ? typeof t.event == "string" ? { kind: "event", name: t.event, args: [] } : { kind: "object", name: Object.keys(t).slice(0, 3).join(", ") || "empty object", args: [] } : { kind: "other", name: typeof t, args: [] };
}
function oh(e) {
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
function lh(e) {
  const t = e && e.value;
  return !!(t && typeof t == "object" && !Array.isArray(t) && "ecommerce" in t && t.ecommerce === null);
}
function dh(e, t) {
  const { event: n, data: a, viaGtag: s } = oh(e[t]);
  if (!Or.includes(n)) return [];
  const i = [];
  if (!a)
    return i.push(s ? "no parameters" : "no ecommerce object"), i;
  if (nh.includes(n)) {
    const r = a.items;
    !Array.isArray(r) || r.length === 0 ? i.push("no items[]") : r.forEach((o, l) => {
      o && typeof o == "object" && (o.item_id !== void 0 && o.item_id !== "" || o.item_name !== void 0 && o.item_name !== "") || i.push(`items[${l}] has neither item_id nor item_name`);
    });
  }
  return a.value !== void 0 && a.value !== null && !a.currency && i.push("value without currency"), n === "purchase" && !a.transaction_id && i.push("purchase without transaction_id"), !s && !lh(e[t - 1]) && i.push("no {ecommerce: null} pushed right before it"), i;
}
function Cr(e, t = "", n = []) {
  if (n.length >= 500) return n;
  if (e !== null && typeof e == "object") {
    const a = Array.isArray(e) ? e.map((s, i) => [`${t}[${i}]`, s]) : Object.keys(e).map((s) => [
      /^[A-Za-z_$][\w$]*$/.test(s) ? t ? `${t}.${s}` : s : `${t}[${JSON.stringify(s)}]`,
      e[s]
    ]);
    return a.length === 0 && n.push({ path: t, value: Array.isArray(e) ? "[]" : "{}" }), a.forEach(([s, i]) => Cr(i, s, n)), n;
  }
  return n.push({ path: t, value: e === void 0 ? "undefined" : JSON.stringify(e) }), n;
}
function ch(e, t) {
  const n = t.filter((s) => typeof s.at == "number" && s.at <= e && e - s.at <= ah).sort((s, i) => i.at - s.at);
  if (n.length === 0) return null;
  const a = n[0];
  return { id: a.id, label: `${a.method} ${a.url}`, gap: Math.round(e - a.at) };
}
const uh = [
  { vendor: "Google Tag Manager", host: /googletagmanager\.com\/gtm\.js/, id: /[?&]id=(GTM-[A-Z0-9]+)/i },
  { vendor: "Google tag", host: /googletagmanager\.com\/gtag\/js/, id: /[?&]id=((?:G|AW|DC|GT)-[A-Z0-9]+)/i },
  { vendor: "Meta pixel", host: /connect\.facebook\.net\/.*\/fbevents\.js/, id: null },
  { vendor: "TikTok pixel", host: /analytics\.tiktok\.com/, id: /[?&]sdkid=([A-Z0-9]+)/i },
  { vendor: "Microsoft Clarity", host: /clarity\.ms\/tag\/([a-z0-9]+)/i, id: /clarity\.ms\/tag\/([a-z0-9]+)/i },
  { vendor: "Microsoft Ads (UET)", host: /bat\.bing\.com\/bat\.js/, id: null },
  { vendor: "Hotjar", host: /static\.hotjar\.com\/c\/hotjar-(\d+)/, id: /hotjar-(\d+)/ },
  { vendor: "LinkedIn Insight", host: /snap\.licdn\.com/, id: null },
  { vendor: "Pinterest tag", host: /s\.pinimg\.com\/ct\/core\.js/, id: null }
], hh = [
  { vendor: "Meta pixel", pattern: /fbq\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/g },
  { vendor: "Pinterest tag", pattern: /pintrk\(\s*['"]load['"]\s*,\s*['"](\d+)['"]/g },
  { vendor: "TikTok pixel", pattern: /ttq\.load\(\s*['"]([A-Z0-9]+)['"]/gi },
  { vendor: "LinkedIn Insight", pattern: /_linkedin_partner_id\s*=\s*['"]?(\d+)/g }
];
function Hn(e) {
  return /^GTM-/i.test(e) ? "Google Tag Manager" : /^G-/i.test(e) ? "Google Analytics 4" : /^AW-/i.test(e) ? "Google Ads" : /^DC-/i.test(e) ? "Campaign Manager" : "Google tag";
}
function ph(e, t, n = []) {
  const a = /* @__PURE__ */ new Map(), s = (u, h, p, w = !1) => {
    const C = `${u}|${h}`, m = a.get(C) || { id: h, vendor: u, via: [], loads: 0 };
    m.via.includes(p) || m.via.push(p), w && (m.loads += 1), a.set(C, m);
  };
  Array.from(e.querySelectorAll("script[src]")).forEach((u) => {
    const h = u.getAttribute("src") || "";
    uh.forEach((p) => {
      if (!p.host.test(h)) return;
      const w = p.id ? p.id.exec(h) : null, C = w ? p.vendor.startsWith("Google") ? w[1].toUpperCase() : w[1] : "";
      s(p.vendor === "Google tag" && C ? Hn(C) : p.vendor, C, "script", !0);
    });
  }), Array.from(e.querySelectorAll("script:not([src])")).forEach((u) => {
    const h = u.textContent || "";
    hh.forEach((p) => {
      for (const w of h.matchAll(p.pattern)) s(p.vendor, w[1], "inline script");
    });
  });
  const i = /* @__PURE__ */ new Map();
  t.forEach((u) => {
    if (!u.gtag || !Array.isArray(u.value) || u.value[0] !== "config") return;
    const h = String(u.value[1] || "").toUpperCase();
    h && (i.set(h, (i.get(h) || 0) + 1), s(Hn(h), h, "gtag('config')"));
  }), n.filter((u) => /^(GTM|G|AW|DC|GT)-[A-Z0-9]+$/i.test(u)).forEach((u) => s(Hn(u.toUpperCase()), u.toUpperCase(), "loaded by Google"));
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
function fh(e) {
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
  const s = [], i = a.find((o) => o.kind === "default"), r = e.findIndex((o) => bh(o));
  return i ? (r !== -1 && r < i.index && s.push("A tag fires before the consent default is set, so it runs with no consent state."), Ja.filter((o) => !(o in t)).forEach((o) => {
    s.push(`The consent default does not set ${o}${o.startsWith("ad_user") || o.startsWith("ad_pers") ? ", which Consent Mode v2 requires" : ""}.`);
  })) : r !== -1 && s.push("No consent default is set. Google's tags run without Consent Mode."), { defaults: t, current: n, calls: a, warnings: s };
}
function bh(e) {
  const t = e.value;
  return e.gtag && Array.isArray(t) ? t[0] === "config" || t[0] === "event" : !!(t && typeof t == "object" && t.event === "gtm.js");
}
function gh(e, t, { policy: n, page: a, requests: s }) {
  const i = e[t], { kind: r, name: o } = rh(i), l = yn(i.value, n);
  return {
    index: t,
    page: a,
    current: !0,
    kind: r,
    name: o,
    before: !!i.before,
    at: Math.round(i.at || 0),
    request: i.before ? null : ch(i.at, s),
    problems: dh(e, t),
    json: n === te ? "" : JSON.stringify(l, null, 2),
    flat: n === te ? [] : Cr(l)
  };
}
function mh({ pushes: e, requests: t, doc: n, loaded: a = [], policy: s, page: i, present: r }) {
  const o = e.map((p, w) => gh(e, w, { policy: s, page: i, requests: t })), l = ph(n, e, a), d = fh(e), h = {
    pushes: o.filter((p) => p.problems.length > 0).length,
    tags: l.warnings.length,
    consent: d.warnings.length
  };
  return {
    present: r,
    pushes: o,
    tags: { items: l.items.map((p) => ({ ...p, where: p.via.join(", ") })), warnings: l.warnings },
    consent: {
      keys: Ja.map((p) => ({
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
function Fs() {
  return {
    present: !1,
    pushes: [],
    tags: { items: [], warnings: [] },
    consent: { keys: Ja.map((e) => ({ key: e, default: "", current: "" })), calls: [], updates: 0, warnings: [] },
    counts: { pushes: 0, tags: 0, consent: 0 },
    warningCount: 0
  };
}
function yh(e) {
  try {
    const t = JSON.parse(e && e.getItem(ba) || "[]");
    return Array.isArray(t) ? t.map((n) => ({ ...n, current: !1 })) : [];
  } catch {
    return [];
  }
}
function vh(e, t, n, a) {
  if (e)
    try {
      if (a === te) {
        e.removeItem(ba);
        return;
      }
      let s = [...t, ...n].slice(-sh).map((r) => ({ ...r, current: !1 })), i = JSON.stringify(s);
      for (; i.length > ih && s.length > 0; )
        s = s.slice(Math.ceil(s.length / 4)), i = JSON.stringify(s);
      e.setItem(ba, i);
    } catch {
    }
}
let Jt = null;
function Hs() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
function wh() {
  const e = window.__siteationDebugBar;
  return e && Array.isArray(e.pushes) ? e : { pushes: [], requests: [] };
}
function _h(e) {
  const t = window.__siteationDebugBar;
  t && (t.onPush = e);
}
function xh(e) {
  const t = wh();
  Jt === null && (Jt = yh(Hs()));
  let n = [];
  try {
    n = window.google_tag_manager ? Object.keys(window.google_tag_manager) : [];
  } catch {
    n = [];
  }
  const a = mh({
    pushes: t.pushes,
    requests: t.requests || [],
    doc: document,
    loaded: n,
    policy: e,
    page: window.location.pathname,
    present: Array.isArray(window.dataLayer)
  });
  return vh(Hs(), Jt, a.pushes, e), { model: a, earlier: Jt };
}
const kh = {
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
}, Eh = 104, Nr = {
  lcp: "Largest Contentful Paint",
  cls: "Cumulative Layout Shift",
  inp: "Interaction to Next Paint",
  fcp: "First Contentful Paint",
  ttfb: "Time to First Byte"
}, Lr = ["lcp", "cls", "inp", "fcp", "ttfb"], Sh = 1e3, Ah = 5e3, Th = 100, Oh = 20;
function Ch(e, t) {
  const n = kh[e];
  return !n || t === null || t === void 0 || Number.isNaN(t) ? "" : t > n[1] ? "poor" : t > n[0] ? "needs-improvement" : "good";
}
function Rr(e, t) {
  return t == null ? "" : e === "cls" ? t.toFixed(3).replace(/0+$/, "").replace(/\.$/, "") || "0" : t >= 1e3 ? `${(t / 1e3).toFixed(2)} s` : `${Math.round(t)} ms`;
}
function Xa(e) {
  if (!e || !e.tagName) return "";
  const t = e.tagName.toLowerCase();
  if (e.id) return `${t}#${e.id}`;
  const n = typeof e.className == "string" ? e.className.trim().split(/\s+/)[0] : "";
  return n ? `${t}.${n}` : t;
}
function Mh(e = []) {
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
function Nh(e, t, n) {
  const a = e[e.length - 1];
  return a ? {
    value: Math.max(0, a.startTime - t),
    element: {
      label: Xa(a.element) || (a.url ? "an image no longer on the page" : "an element no longer on the page"),
      index: n.add(a.element),
      url: a.url || "",
      size: a.size || 0
    }
  } : { value: null, element: null };
}
function Lt(e, t) {
  return !!(e && t(e));
}
function $r(e, t) {
  const n = e.filter((s) => !s.hadRecentInput && !((s.sources || []).length > 0 && s.sources.every((i) => Lt(i.node, t)))), a = [];
  return n.forEach((s) => {
    const i = a[a.length - 1], r = i && i[0], o = i && i[i.length - 1];
    i && s.startTime - o.startTime < Sh && s.startTime - r.startTime < Ah ? i.push(s) : a.push([s]);
  }), a;
}
function Pr(e) {
  return e.reduce((t, n) => t + n.value, 0);
}
function Lh(e, t, n, a = /* @__PURE__ */ new WeakMap()) {
  const s = $r(e, t), i = s.map(Pr), r = i.length ? i.indexOf(Math.max(...i)) : -1;
  let o = 0;
  const l = s.map((u) => (o = a.get(u[0]) ?? o + 1, a.set(u[0], o), o)), d = [];
  return s.forEach((u, h) => {
    u.forEach((p) => {
      d.push({
        at: Math.round(p.startTime),
        value: p.value,
        display: Rr("cls", p.value),
        window: l[h],
        worst: h === r,
        sources: (p.sources || []).filter((w) => !Lt(w.node, t)).map((w) => ({
          label: Xa(w.node) || "an element no longer on the page",
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
function Rh(e, t, n, a, s = null) {
  const i = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
  e.forEach((p) => {
    if (!p.interactionId || (r.add(p.interactionId), Lt(p.target, n))) return;
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
      label: Xa(h.target) || "an element no longer on the page",
      index: a.add(h.target)
    },
    count: d,
    unseen: o
  };
}
function $h(e, t) {
  const n = e.find((a) => a.name === "first-contentful-paint");
  return n ? Math.max(0, n.startTime - t) : null;
}
function Ph(e) {
  return !e || !(e.responseStart > 0) ? null : Math.max(0, e.responseStart - (e.activationStart || 0));
}
function Ws() {
  return {
    metrics: Lr.map((e) => ({
      id: e,
      label: e.toUpperCase(),
      name: Nr[e],
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
function Ih({
  entries: e,
  supported: t,
  interactionCount: n = 0,
  own: a = () => !1,
  known: s = [],
  interactions: i = null,
  windowNumbers: r = /* @__PURE__ */ new WeakMap()
}) {
  const o = Mh(s), l = (g) => e[g] || [], d = l("navigation")[0], u = d && d.activationStart || 0, h = Nh(l("largest-contentful-paint"), u, o), p = Lh(l("layout-shift"), a, o, r), w = Rh(l("event"), n, a, o, i), C = {
    lcp: h.value,
    cls: p.value,
    inp: w.value,
    fcp: $h(l("paint"), u),
    ttfb: Ph(d)
  }, m = Lr.map((g) => {
    const S = t.includes(Mr[g]);
    let L = S ? C[g] : null, ue = Rr(g, L), he = Ch(g, L);
    return g === "inp" && S && L === null && w.unseen > 0 && (L = null, ue = `under ${Eh} ms`, he = "good"), { id: g, label: g.toUpperCase(), name: Nr[g], value: L, display: ue, rating: he, supported: S };
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
function Dh(e, t, n) {
  e.forEach((a) => {
    a.interactionId && (n.seen.add(a.interactionId), Lt(a.target, t) || n.measured.add(a.interactionId));
  });
}
function qh(e, t, { interactionCount: n = 0, measured: a = 0 } = {}) {
  const s = { ...e }, i = e["largest-contentful-paint"];
  if (i && i.length > 1 && (s["largest-contentful-paint"] = i.slice(-1)), e.event) {
    const r = Math.floor(Math.max(n || 0, a) / 50) + 1;
    s.event = jh(e.event, t, Math.max(Th, r));
  }
  return e["layout-shift"] && (s["layout-shift"] = Uh(e["layout-shift"], t)), s;
}
function jh(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  e.forEach((i) => {
    if (!i.interactionId || Lt(i.target, t)) return;
    const r = a.get(i.interactionId);
    (!r || i.duration > r.duration) && a.set(i.interactionId, i);
  });
  const s = new Set(Array.from(a.values()).sort((i, r) => r.duration - i.duration).slice(0, n));
  return e.filter((i) => s.has(i));
}
function Uh(e, t) {
  const n = $r(e, t), a = n.map(Pr), s = a.indexOf(Math.max(...a));
  return n.filter((i, r) => r === s || r >= n.length - (Oh - 1)).flat();
}
const Pe = {}, Xt = { seen: /* @__PURE__ */ new Set(), measured: /* @__PURE__ */ new Set() }, Bh = /* @__PURE__ */ new WeakMap();
let hn = [];
const pn = /* @__PURE__ */ new Map();
let Gs = !1;
function Ir() {
  try {
    return Array.from(PerformanceObserver.supportedEntryTypes || []);
  } catch {
    return [];
  }
}
function Fh(e) {
  if (Gs || typeof PerformanceObserver > "u") return;
  Gs = !0;
  const t = Ir();
  new Set(Object.values(Mr)).forEach((n) => {
    if (t.includes(n)) {
      Pe[n] = [];
      try {
        new PerformanceObserver((a) => {
          const s = a.getEntries().filter((i) => n !== "event" || i.interactionId > 0);
          s.length !== 0 && (Pe[n].push(...s), e());
        }).observe({ type: n, buffered: !0, ...n === "event" ? { durationThreshold: 16 } : {} });
      } catch {
        delete Pe[n];
      }
    }
  });
}
function Hh(e) {
  let t = 0;
  try {
    t = Number(performance.interactionCount) || 0;
  } catch {
    t = 0;
  }
  const n = (i) => !!e && (i === e || typeof e.contains == "function" && e.contains(i));
  Dh(Pe.event || [], n, Xt);
  const { model: a, elements: s } = Ih({
    entries: Pe,
    supported: Ir(),
    interactionCount: t,
    // Seeded with the last read's elements, so a row being hovered while an entry arrives
    // still outlines, and later un-outlines, the element it did before.
    known: hn,
    own: n,
    interactions: { seen: Xt.seen.size, measured: Xt.measured.size },
    windowNumbers: Bh
  });
  return hn = s, Object.assign(Pe, qh(Pe, n, {
    interactionCount: t,
    measured: Xt.measured.size
  })), a;
}
function Wh(e) {
  const t = pn.get(e);
  t && (e.style.outline = t.outline, e.style.outlineOffset = t.offset, pn.delete(e));
}
function Dr(e, t) {
  const n = hn[e];
  if (!(!n || !n.style)) {
    if (!t) {
      Wh(n);
      return;
    }
    pn.has(n) || pn.set(n, {
      outline: n.style.outline || "",
      offset: n.style.outlineOffset || ""
    }), n.style.outline = "2px solid #7f9cf5", n.style.outlineOffset = "2px";
  }
}
function Gh(e) {
  const t = hn[e];
  !t || !t.isConnected || (t.scrollIntoView({ block: "center", behavior: "smooth" }), Dr(e, !0));
}
const Vh = 1e3, qr = "siteation.debugbar.v1", zh = "__PROFILE_ID__";
function Kh() {
  const e = document.getElementById("siteation-debugbar-profile");
  if (!e) return {};
  try {
    return JSON.parse(e.textContent || "{}");
  } catch {
    return {};
  }
}
function Jh() {
  const e = { open: !1, section: "overview" };
  try {
    return { ...e, ...JSON.parse(localStorage.getItem(qr) || "{}") };
  } catch {
    return e;
  }
}
function be(e, t, n) {
  const a = t.trim().toLowerCase();
  return a ? e.filter((s) => n.some(
    (i) => String(s[i] ?? "").toLowerCase().includes(a)
  )) : e;
}
function Xh() {
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
    seo: Bs(),
    seoError: "",
    /** @type {Array<number>} */
    schemaExpanded: [],
    schemaCopyState: "",
    schemaFallback: "",
    dataLayerTab: "pushes",
    dataLayer: Fs(),
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
    vitals: Ws(),
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
      this.profile = Kh(), this.pageProfile = this.profile, this.activeId = this.profile.id || null;
      const e = Jh();
      this.collapsed = !!e.collapsed, this.open = e.open && !this.collapsed, this.section = e.section, this.placement = e.placement === "top" ? "top" : "bottom", this.dockPosition = ac(e.dockPosition) ? e.dockPosition : null, this.maximised = !!e.maximised, this.theme = ["system", "light", "dark"].includes(e.theme) ? e.theme : "system", this.favourites = Array.isArray(e.favourites) ? e.favourites.filter((t) => ln.some((n) => n.id === t)) : [], this.watchColorScheme(), this.valuePolicy = xc(this.rootElement()?.dataset.valuePolicy), this.editorTemplate = this.rootElement()?.dataset.editor || "", this.editorRoot = this.rootElement()?.dataset.editorRoot || "", this.refreshAlpine(), this.refreshMagewire(), this.listenToMagewire(), this.$watch("alpineLiveWanted", () => this.syncAlpineLive()), this.syncAlpineLive(), this.$watch("paletteSearch", () => {
        this.paletteIndex = 0;
      }), this.$watch("section", (t) => {
        t === "history" && this.loadHistory(), t === "seo" && this.refreshSeo(), t === "datalayer" && this.refreshDataLayer(), t === "vitals" && this.refreshVitals();
      }), this.scheduleSeo(), this.collects("datalayer") && (this.refreshDataLayer(), _h(() => {
        this.dataLayerTimer || (this.dataLayerTimer = setTimeout(() => {
          this.dataLayerTimer = null, this.refreshDataLayer();
        }, 50));
      })), this.collects("vitals") && Fh(() => {
        this.vitalsTimer || (this.vitalsTimer = setTimeout(() => {
          this.vitalsTimer = null, this.refreshVitals();
        }, 50));
      }), this.open && this.section === "history" && this.loadHistory(), this.$watch("activeId", () => {
        this.comparison = null, this.baselineId = "";
      }), document.addEventListener("keydown", (t) => this.paletteShortcut(t)), this.open && this.$nextTick(() => this.lock()), this.requests = ec((t) => {
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
      return t ? t.replace(zh, encodeURIComponent(e)) : null;
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
          const { profile: n, payloads: a } = await Ns(t);
          this.profile = n, this.payloads = a, this.activeId = e;
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
          const n = await ca(t);
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
      const e = this.history.filter((a) => a.profile_id !== this.activeId), t = this.request.path;
      return (e.find((a) => a.path === t) || e[0])?.profile_id || "";
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
        this.comparison = await ca(n);
      } catch (a) {
        this.comparison = null, this.compareError = String(a.message || a);
      } finally {
        this.comparing = !1;
      }
    },
    /**
     * @param {object} metric
     * @returns {string} the change, signed, in the metric's own unit
     */
    deltaLabel(e) {
      return Vc(e);
    },
    /**
     * @param {object} metric
     * @param {'baseline'|'subject'} side which profile's value the cell shows
     * @returns {string}
     */
    metricValue(e, t) {
      return zc(e, t);
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
      return Hc(e);
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
      return Gc(e);
    },
    /**
     * @param {string} url
     * @returns {string}
     */
    shortUrl(e) {
      return Wc(e, window.location.origin);
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
          this.payloads = (await Ns(e)).payloads;
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
      const e = this.itemsOf("queries").filter((t) => this.queryFilter === "slow" ? t.slow : this.queryFilter === "repeated" ? Number(t.repeat_count || 1) > 1 : !0);
      return be(e, this.querySearch, ["sql"]);
    },
    /** @returns {number} how many statements ran a shape that ran more than once */
    get repeatedCount() {
      return this.itemsOf("queries").filter((e) => Number(e.repeat_count || 1) > 1).length;
    },
    /** @returns {Array<object>} */
    get visibleEvents() {
      const e = this.eventFilter === "unobserved" ? this.itemsOf("events").filter((t) => t.observer_count === 0) : this.itemsOf("events");
      return be(e, this.eventSearch, ["name"]);
    },
    /** @returns {Array<object>} */
    get visibleObservers() {
      return be(this.itemsOf("observers"), this.observerSearch, ["name", "event", "instance"]);
    },
    /** @returns {Array<object>} */
    get cacheItems() {
      return this.itemsOf("cache");
    },
    /** @returns {Array<object>} */
    get visibleBlocks() {
      const e = this.blockHandle ? this.itemsOf("blocks").filter((t) => this.blockHandles[t.name] === this.blockHandle) : this.itemsOf("blocks");
      return be(e, this.blockSearch, ["name", "template", "class"]);
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
      const e = this.layoutSearch.trim().toLowerCase(), t = this.itemsOf("layout");
      return e ? t.filter((n) => String(n.handle).toLowerCase().includes(e) || (n.files || []).some((a) => String(a.file).toLowerCase().includes(e))) : t;
    },
    /**
     * @param {object} file one of a handle's files
     * @returns {string} the theme that overrides it, or the module that ships it
     */
    layoutSource(e) {
      return e.theme ? e.theme + " theme" : e.module || "unknown module";
    },
    /**
     * The link from a handle to the blocks it put on the page.
     *
     * @param {string} handle
     */
    showHandleBlocks(e) {
      this.blockHandle = e, this.blockSearch = "", this.select("blocks");
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
      return be(e, this.timelineSearch, ["label", "section"]);
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
      return be(e, this.alpineSearch, ["name", "expression", "path"]);
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
      return cc(this);
    },
    /** @returns {Array<object>} */
    get visibleCommands() {
      return fc(this.commands, this.paletteSearch);
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
      return this.pageCache.status ? this.pageCache.status === "hit" : Number(this.queries.count || 0) === 0 && Number(this.events.count || 0) === 0;
    },
    /** @returns {Array<object>} every section with its count resolved */
    get sections() {
      return oc(this.rootElement()?.dataset.sections).map((e) => ({ ...e, count: ur(e.id, this) }));
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
        const a = [...this.favourites];
        a.splice(n, 0, a.splice(t, 1)[0]), this.favourites = a, this.persist();
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
      const n = e.clientX - t.pointerX, a = e.clientY - t.pointerY;
      !t.moved && !rc(n, a) || (t.moved = !0, this.draggingDock = !0, this.dockPosition = Un(
        { left: t.left + n, top: t.top + a },
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
      const a = n.getBoundingClientRect();
      this.dockPosition = Un(
        { left: a.left + t[0], top: a.top + t[1] },
        a,
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
      const n = this.dockPosition, a = this.placement;
      this.dockPosition = Un(
        this.dockPosition,
        t,
        { width: window.innerWidth, height: window.innerHeight }
      ), this.updatePlacementFromDock(), (n.left !== this.dockPosition.left || n.top !== this.dockPosition.top || a !== this.placement) && this.persist();
    },
    /** Keep the edge-bound inspector and bubble near the freely positioned dock. */
    updatePlacementFromDock() {
      const e = this.$refs.dock;
      !this.dockPosition || !e || (this.placement = sc(
        this.dockPosition,
        e.getBoundingClientRect(),
        window.innerHeight
      ));
    },
    openInspector() {
      this.open || (this.collapsed = !1, this.returnFocusTo = this.$root.getRootNode().activeElement, this.open = !0, this.persist(), this.loadPayloads(), this.$nextTick(() => this.lock()));
    },
    closeInspector() {
      this.open && (this.open = !1, this.persist(), nc(), this.returnFocusTo && typeof this.returnFocusTo.focus == "function" && this.returnFocusTo.focus(), this.scheduleDockConstraint());
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
      tc(this.rootElement()), this.$refs.sheet?.focus();
    },
    /** @param {KeyboardEvent} event */
    trapFocus(e) {
      if (e.key === "Escape") {
        this.closeInspector();
        return;
      }
      As(e, this.$refs.sheet);
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
      e && (e.filter && e.section === "queries" && (this.queryFilter = e.filter, this.querySearch = ""), e.filter && e.section === "seo" && (this.seoTab = e.filter), this.select(e.section));
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
      this.magewireHealth = Qc(), this.magewireComponents = Zc(this.valuePolicy), this.magewireExpanded.forEach((e) => {
        this.magewireStates[e] = Ls(e, this.valuePolicy);
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
      Rs(e) || document.addEventListener("magewire:load", () => {
        Rs(e), this.refreshMagewire();
      }, { once: !0, passive: !0 });
    },
    /** @param {string} id */
    toggleMagewireComponent(e) {
      if (this.magewireExpanded.includes(e)) {
        this.magewireExpanded = this.magewireExpanded.filter((t) => t !== e), delete this.magewireStates[e];
        return;
      }
      this.magewireExpanded = [...this.magewireExpanded, e], this.magewireStates[e] = Ls(e, this.valuePolicy);
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
      eu(e, t);
    },
    /**
     * What the server sent for this document against the page as it is now. The page's own
     * profile, never the one in view: only that request sent this HTML.
     */
    get seoServer() {
      return Zu(this.pageProfile.sections?.seo?.summary, this.seo);
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
      const e = () => setTimeout(() => this.refreshSeo(), 0);
      document.readyState === "complete" ? e() : window.addEventListener("load", e, { once: !0, passive: !0 });
    },
    refreshSeo() {
      if (!this.collects("seo")) return;
      const e = this.pageProfile.sections?.request?.summary?.robots_header || "";
      try {
        this.seo = Qu(e), this.seoError = "";
      } catch (t) {
        this.seo = Bs(), this.seoError = String(t && t.message || t);
      }
    },
    /**
     * @param {string} view
     * @param {number} index
     * @param {boolean} on
     */
    highlightSeo(e, t, n) {
      fa(e, t, n);
    },
    /**
     * @param {string} view
     * @param {number} index
     */
    revealSeo(e, t) {
      th(e, t);
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
      e.source === "microdata" && fa("schema", e.block, t);
    },
    /**
     * The validators cannot fetch a dev shop, so what they need goes on the clipboard to be
     * pasted into their code mode instead.
     *
     * @returns {Promise<void>}
     */
    async copySchemaMarkup() {
      const e = eh();
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
          const { model: e, earlier: t } = xh(this.valuePolicy);
          e.pushes.forEach((n) => {
            n.key = `c${n.index}`;
          }), this.dataLayer = e, this.dataLayerEarlier = t.map((n, a) => ({ ...n, key: `e${a}` })), this.dataLayerError = "";
        } catch (e) {
          this.dataLayer = Fs(), this.dataLayerError = String(e && e.message || e);
        }
    },
    /**
     * Earlier pages first, then this one, newest last: the order they were pushed in.
     *
     * @returns {Array<object>}
     */
    get visibleDataLayerPushes() {
      const e = this.dataLayerThisPage ? this.dataLayer.pushes : [...this.dataLayerEarlier, ...this.dataLayer.pushes];
      return be(e, this.dataLayerSearch, ["name", "page", "json"]);
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
          this.vitals = Hh(this.rootElement()), this.vitalsError = "";
        } catch (e) {
          this.vitals = Ws(), this.vitalsError = String(e && e.message || e);
        }
    },
    /**
     * @param {number} index
     * @param {boolean} on
     */
    highlightVital(e, t) {
      Dr(e, t);
    },
    /** @param {number} index */
    revealVital(e) {
      Gh(e);
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
      return be(t, this.seoSearch, ["src", "alt"]);
    },
    /** @returns {Array<object>} */
    get visibleSeoLinks() {
      const e = this.seo.links?.items || [], t = this.seoProblemsOnly ? e.filter((n) => n.warnings.length > 0) : e;
      return be(t, this.seoSearch, ["href", "text"]);
    },
    /**
     * @param {string|null} alt
     * @returns {string}
     */
    altLabel(e) {
      return e === null ? "no alt" : e === "" ? 'alt=""' : e;
    },
    refreshAlpine() {
      this.alpineHealth = du(), this.alpineComponents = ru(this.valuePolicy), this.alpineStores = ou(this.valuePolicy), this.alpineErrors = lu(this.valuePolicy), this.alpineExpanded.forEach((e) => {
        this.alpineStates[e] = Ds(e, this.valuePolicy);
      });
    },
    /** Reads the page only while the section is the one on screen. */
    syncAlpineLive() {
      if (this.alpineLiveWanted && !this.alpineTimer) {
        this.alpineTimer = setInterval(() => {
          document.hidden || this.refreshAlpine();
        }, Vh);
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
      this.alpineExpanded = [...this.alpineExpanded, e], this.alpineStates[e] = Ds(e, this.valuePolicy);
    },
    /**
     * @param {number} id
     * @param {boolean} on
     */
    highlightAlpine(e, t) {
      cu(e, t);
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
      As(e, this.$refs.palette);
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
        localStorage.setItem(qr, JSON.stringify({
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
      return Ba(e, t);
    },
    /**
     * @param {object} plugin
     * @returns {string}
     */
    methodList(e) {
      return Kc(e);
    },
    /**
     * @param {unknown} code
     * @param {string} language
     * @returns {string} HTML for x-html, escaped by the highlighter
     */
    highlight(e, t) {
      return Bc(e, t);
    },
    /**
     * @param {string} file
     * @param {number} line
     * @returns {string}
     */
    editorUrl(e, t) {
      return mr(this.editorTemplate, this.editorRoot, e, t);
    },
    /**
     * @param {string} location
     * @returns {string}
     */
    locationUrl(e) {
      return Jc(this.editorTemplate, this.editorRoot, e);
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
      return Fc(e, t, n);
    },
    /**
     * @param {number} bytes
     * @returns {string}
     */
    bytes(e) {
      return Fa(e);
    }
  };
}
function le(e) {
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
function Vs({ sheet: e }) {
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
function zs(e, t) {
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
function Zh() {
  return `
<nav class="ndb-nav" aria-label="Debug sections"
     data-ndb-bind:class="navOpen && 'is-open'">
  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Favourites</p>
  ${zs("favouriteSections", !0)}

  <p class="ndb-nav-heading" data-ndb-show="favourites.length > 0">Sections</p>
  ${zs("otherSections", !1)}
</nav>`;
}
function bt(e, t) {
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
const Yh = `
<div class="ndb" data-ndb-data="debugBar" data-ndb-cloak
     data-ndb-bind:class="'is-' + placement + ' is-theme-' + resolvedTheme"
     data-ndb-on:resize.window="constrainDock()">

  <div class="ndb-dock" data-ndb-ref="dock"
       data-ndb-show="!open && !dismissed && !collapsed" data-ndb-cloak
       data-ndb-bind:class="draggingDock && 'is-dragging'"
       data-ndb-bind:style="dockStyle"
       title="Open the inspector" data-ndb-on:click="openFromBar($event)">
    ${Vs({ sheet: !1 })}
  </div>

  <button type="button" class="ndb-bubble" data-ndb-show="collapsed && !dismissed" data-ndb-cloak
          data-ndb-bind:class="findings.length > 0 && 'is-' + findingsTone"
          data-ndb-on:click="expand()"
          aria-label="Show the debug bar" title="Show the debug bar">
    ${q("pulse")}
    <span class="ndb-badge" data-ndb-show="findings.length > 0"
          data-ndb-text="findings.length"></span>
  </button>

  ${bc()}

  <div class="ndb-overlay" data-ndb-show="open && !dismissed" data-ndb-cloak>
    <div class="ndb-backdrop" data-ndb-on:click="closeInspector()"></div>

    <div class="ndb-sheet" data-ndb-ref="sheet" tabindex="-1"
         role="dialog" aria-modal="true" aria-label="Request inspector"
         data-ndb-bind:class="maximised && 'is-maximised'"
         data-ndb-on:keydown="trapFocus($event)">
      ${Vs({ sheet: !0 })}

      <div class="ndb-body">
        <button type="button" class="ndb-nav-toggle" data-ndb-on:click="navOpen = !navOpen"
                title="Sections">
          ${q("menu")}
          <span data-ndb-text="currentSection.label"></span>
        </button>

        ${Zh()}

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
            ${le([
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
            ${le([
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
            ${le([
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
            ${le([
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
        ${le([
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
        ${le([
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
        ${le([
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
          ${bt("magewireTab", [
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
        ${bt("seoTab", [
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

          ${le([
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
          ${le([
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
        ${bt("dataLayerTab", [
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
        ${bt("historyTab", [
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
          ${bt("alpineTab", [
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
            ${le([
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
`, Qh = "data-ndb-", Ks = "siteation-debugbar";
function ep(e) {
  const t = e.attachShadow({ mode: "open" }), n = e.dataset.css;
  if (n) {
    const s = document.createElement("link");
    s.rel = "stylesheet", s.href = n, t.append(s);
  }
  const a = document.createElement("div");
  return a.innerHTML = Yh, t.append(...a.children), t.querySelector(".ndb");
}
class tp extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const t = ep(this);
    t && xt.initTree(t);
  }
}
customElements.get(Ks) || (xt.prefix(Qh), xt.data("debugBar", Xh), xt.directive("code", (e, { expression: t }, { effect: n, evaluateLater: a }) => {
  const s = a(t);
  n(() => s((i) => {
    e.innerHTML = typeof i == "string" ? i : "";
  }));
}), customElements.define(Ks, tp));
Wn && (window.Alpine = Wn);
