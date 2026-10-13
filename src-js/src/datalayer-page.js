/**
 * The Data layer section's hold on the live page.
 *
 * The checks in datalayer.js are pure; this is the part that is not. It reads the pushes
 * early.js recorded, the requests it saw, Google's own list of what it loaded, and the log
 * this tab kept on earlier pages.
 */
import { emptyDataLayer, inspectDataLayer, readLog, writeLog } from './datalayer.js'

/** @type {Array<object>|null} read once per page: earlier pages do not change */
let earlier = null

/** @returns {Storage|null} */
function session() {
  try {
    return window.sessionStorage
  } catch {
    return null
  }
}

/** @returns {object} what early.js buffered, or an empty buffer when it did not run */
function buffer() {
  const state = window.__siteationDebugBar

  return state && Array.isArray(state.pushes) ? state : { pushes: [], requests: [] }
}

/**
 * Calls back on every push from now on. early.js has one slot for this, as it does for
 * requests, and the bar is the only thing that fills it.
 *
 * @param {() => void} onPush
 */
export function watchPushes(onPush) {
  const state = window.__siteationDebugBar

  if (state) state.onPush = onPush
}

/**
 * @param {string} policy the store's value policy
 * @returns {{model: object, earlier: Array<object>}}
 */
export function readDataLayer(policy) {
  const state = buffer()

  if (earlier === null) earlier = readLog(session())

  // Google's runtime registers every container and measurement id it loaded under its own
  // global, which says what actually ran rather than what a script tag asked for.
  let loaded = []

  try {
    loaded = window.google_tag_manager ? Object.keys(window.google_tag_manager) : []
  } catch {
    loaded = []
  }

  const model = inspectDataLayer({
    pushes: state.pushes,
    requests: state.requests || [],
    doc: document,
    loaded,
    policy,
    page: window.location.pathname,
    present: Array.isArray(window.dataLayer),
  })

  writeLog(session(), earlier, model.pushes, policy)

  return { model, earlier }
}

export { emptyDataLayer }
