/**
 * Installs the request watcher before anything else on the page can run.
 *
 * The bar itself loads as a deferred module at the end of the body, by which time the
 * theme has already fetched its private content. Wrapping fetch and XMLHttpRequest from a
 * blocking script in the head is the only way to see those requests at all.
 *
 * It also watches for Alpine's expression errors, for the same reason: components
 * initialise long before the bar loads, so an error thrown during init is over by the
 * time anything could ask about it.
 *
 * Deliberately tiny and dependency free: it buffers what it sees and does nothing else.
 * The bar drains the buffer when it boots.
 */
(function () {
  const HEADER = 'x-siteation-debugbar-profile'
  // What the request was, when the URL does not say. Every Magewire component posts to the
  // same one, so without this the list is a column of identical rows.
  const LABEL_HEADER = 'x-siteation-debugbar-label'
  const MAX_ERRORS = 25
  const MAX_PUSHES = 300
  const state = {
    requests: [],
    onRequest: null,
    alpineErrors: [],
    alpineReady: false,
    pushes: [],
    onPush: null,
  }

  window.__siteationDebugBar = state

  function report(id, method, url, status, label) {
    // No URL filter for the bar's own endpoints: RequestEligibility::isOwnRequest excludes
    // them from collection, so their responses carry no profile header and the id check
    // above has already returned.
    if (!id) return

    const entry = {
      id: id,
      method: String(method || 'GET').toUpperCase(),
      // Without the query string. A section load carries ids and a search carries what was
      // typed, and this list only ever needs to say which request it was.
      url: String(url).split('?')[0],
      status: status,
      label: label ? String(label).slice(0, 240) : '',
      // When the response arrived, on the same clock as the data layer pushes, so a push
      // can be matched to the request it came after.
      at: performance.now(),
    }

    if (state.requests.some((seen) => seen.id === entry.id)) return

    state.requests.unshift(entry)
    state.requests = state.requests.slice(0, 25)

    if (typeof state.onRequest === 'function') state.onRequest(entry)
  }

  window.addEventListener('alpine:initialized', function () {
    state.alpineReady = true
  }, { once: true, passive: true })

  function describe(element) {
    if (!element || !element.tagName) return ''

    const classes = typeof element.className === 'string' ? element.className.trim() : ''

    return element.tagName.toLowerCase()
      + (element.id ? '#' + element.id : '')
      + (classes ? '.' + classes.split(/\s+/).slice(0, 2).join('.') : '')
  }

  /**
   * The bar lives in its own shadow root, which is the one thing that distinguishes its
   * elements from the page's without knowing anything about either.
   *
   * @param {unknown} element
   * @returns {boolean}
   */
  function isOurs(element) {
    try {
      const root = element && element.getRootNode && element.getRootNode()

      return Boolean(root && root.host && root.host.localName === 'siteation-debugbar')
    } catch (error) {
      return false
    }
  }

  // Alpine 3.14.3, which Hyva ships, has no setErrorHandler, so the warning it writes is
  // the only place an expression error surfaces. The original is always called.
  const nativeWarn = console.warn

  console.warn = function (message) {
    try {
      if (typeof message === 'string'
        && message.indexOf('Alpine') === 0
        && state.alpineErrors.length < MAX_ERRORS) {
        state.alpineErrors.push({
          message: message,
          element: describe(arguments[1]),
          during_init: !state.alpineReady,
          // Which Alpine reported it. The bar carries its own, so without this the panel
          // that lists the page's expression errors also lists the bar's, and a test that
          // asks whether the bar is healthy gets told about the theme instead.
          own: isOurs(arguments[1]),
        })
      }
    } catch (error) {
      // Watching for an error must never become one.
    }

    return nativeWarn.apply(console, arguments)
  }

  /**
   * A copy of a pushed value as it was at the moment of the push. Sites reuse and change
   * the objects they push, so a reference read later shows a value that was never sent.
   * Functions and elements become a label; nothing is evaluated.
   */
  function snapshot(value, depth, seen) {
    if (value === null || typeof value !== 'object') {
      if (typeof value === 'function') return '[function]'
      if (typeof value === 'undefined') return null

      return value
    }

    if (value instanceof Date) return isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString()
    if (depth > 8) return '[maximum depth reached]'
    if (seen.indexOf(value) !== -1) return '[circular]'
    if (typeof Node !== 'undefined' && value instanceof Node) return '[element]'

    seen.push(value)

    let copy

    if (Array.isArray(value) || Object.prototype.toString.call(value) === '[object Arguments]') {
      copy = []

      for (let index = 0; index < value.length && index < 200; index += 1) {
        copy.push(snapshot(value[index], depth + 1, seen))
      }
    } else {
      copy = {}

      Object.keys(value).slice(0, 200).forEach(function (key) {
        try {
          copy[key] = snapshot(value[key], depth + 1, seen)
        } catch (error) {
          copy[key] = '[unreadable]'
        }
      })
    }

    seen.pop()

    return copy
  }

  function record(value, before) {
    try {
      if (state.pushes.length >= MAX_PUSHES) state.pushes.shift()

      const entry = {
        // gtag() pushes its arguments object rather than an array, and that is the only
        // way to tell a gtag command from an object push once it is copied.
        gtag: Object.prototype.toString.call(value) === '[object Arguments]',
        value: snapshot(value, 0, []),
        at: performance.now(),
        before: before,
      }

      state.pushes.push(entry)

      if (typeof state.onPush === 'function') state.onPush(entry)
    } catch (error) {
      // As with requests: watching a push must never break it.
    }
  }

  /**
   * Puts a recorder in front of dataLayer.push and keeps it there.
   *
   * GTM and gtag.js assign their own push when they load, and some save the push they
   * found and call it from theirs. So push is an accessor: what a script assigns becomes
   * the function the recorder calls, and the recorder is what every caller gets. A call
   * that comes back into the recorder from inside that function is the saved push being
   * used, and goes straight to the array, so it is neither recorded twice nor a loop.
   */
  function watch(layer) {
    if (!Array.isArray(layer) || layer.__ndbWatched) return

    let inner = layer.push === Array.prototype.push ? null : layer.push
    let depth = 0

    function push() {
      if (depth > 0) return Array.prototype.push.apply(layer, arguments)

      depth += 1

      try {
        for (let index = 0; index < arguments.length; index += 1) record(arguments[index], false)

        return inner ? inner.apply(layer, arguments) : Array.prototype.push.apply(layer, arguments)
      } finally {
        depth -= 1
      }
    }

    try {
      Object.defineProperty(layer, '__ndbWatched', { value: true })
      Object.defineProperty(layer, 'push', {
        configurable: true,
        get: function () { return push },
        set: function (fn) { inner = typeof fn === 'function' && fn !== push ? fn : null },
      })
    } catch (error) {
      return
    }

    // What was pushed before this script ran is still in the array, unrecorded.
    for (let index = 0; index < layer.length; index += 1) record(layer[index], true)
  }

  try {
    let current = window.dataLayer

    watch(current)

    // The page may create the data layer after this script, or replace it.
    Object.defineProperty(window, 'dataLayer', {
      configurable: true,
      enumerable: true,
      get: function () { return current },
      set: function (value) {
        current = value
        watch(value)
      },
    })
  } catch (error) {
    // A page that froze window.dataLayer keeps it; the bar reads what it can later.
  }

  const nativeFetch = window.fetch

  if (typeof nativeFetch === 'function') {
    window.fetch = function () {
      const args = arguments

      return nativeFetch.apply(this, args).then(function (response) {
        try {
          const method = (args[1] && args[1].method)
            || (typeof Request !== 'undefined' && args[0] instanceof Request ? args[0].method : 'GET')

          report(
            response.headers.get(HEADER),
            method,
            response.url || args[0],
            response.status,
            response.headers.get(LABEL_HEADER)
          )
        } catch (error) {
          // Never let watching a request break it.
        }

        return response
      })
    }
  }

  const open = XMLHttpRequest.prototype.open
  const send = XMLHttpRequest.prototype.send

  XMLHttpRequest.prototype.open = function (method, url) {
    this.__ndbMethod = method
    this.__ndbUrl = url

    return open.apply(this, arguments)
  }

  XMLHttpRequest.prototype.send = function () {
    const request = this

    request.addEventListener('load', function () {
      try {
        report(
          request.getResponseHeader(HEADER),
          request.__ndbMethod,
          request.__ndbUrl,
          request.status,
          request.getResponseHeader(LABEL_HEADER)
        )
      } catch (error) {
        // As above.
      }
    })

    return send.apply(this, arguments)
  }
})()
