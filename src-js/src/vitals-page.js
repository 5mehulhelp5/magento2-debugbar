/**
 * The Web Vitals section's hold on the live page.
 *
 * The arithmetic in vitals.js is pure; this is the part that is not. It keeps a
 * PerformanceObserver on each entry type, with `buffered: true` so the entries from before
 * the bar loaded are delivered too, and keeps the elements the model points at so a row
 * can outline one. The outline puts the inline style back exactly as it was found.
 */
import { ENTRY_TYPES, emptyVitals, inspectVitals } from './vitals.js'

/** @type {Record<string, Array<PerformanceEntry>>} */
const entries = {}

/** @type {Array<Element>} */
let found = []

/** @type {Map<Element, {outline: string, offset: string}>} */
const outlines = new Map()

let started = false

/** @returns {Array<string>} */
function supportedTypes() {
  try {
    return Array.from(PerformanceObserver.supportedEntryTypes || [])
  } catch {
    return []
  }
}

/**
 * Starts observing, once per page. Every new entry calls back, so the panel updates as the
 * page is used: LCP until the first input, CLS and INP for as long as the page is open.
 *
 * @param {() => void} onEntry
 */
export function watchVitals(onEntry) {
  if (started || typeof PerformanceObserver === 'undefined') return

  started = true

  const supported = supportedTypes()

  new Set(Object.values(ENTRY_TYPES)).forEach((type) => {
    if (!supported.includes(type)) return

    entries[type] = []

    try {
      new PerformanceObserver((list) => {
        // Hovers and scrolls are event entries too, with no interaction behind them. Kept,
        // they would grow the list for as long as the page is open and count for nothing.
        const kept = list.getEntries().filter((entry) => type !== 'event' || entry.interactionId > 0)

        if (kept.length === 0) return

        entries[type].push(...kept)
        onEntry()
      // 16 ms is the lowest threshold the browser accepts, so INP sees nearly every
      // interaction from here on rather than only the ones over the default 104 ms.
      }).observe({ type, buffered: true, ...(type === 'event' ? { durationThreshold: 16 } : {}) })
    } catch {
      delete entries[type]
    }
  })
}

/**
 * @param {Element} host the bar's own host element
 * @returns {object} the model, safe to put in reactive state
 */
export function readVitals(host) {
  let interactionCount = 0

  try {
    interactionCount = Number(performance.interactionCount) || 0
  } catch {
    interactionCount = 0
  }

  const { model, elements } = inspectVitals({
    entries,
    supported: supportedTypes(),
    interactionCount,
    // Seeded with the last read's elements, so a row being hovered while an entry arrives
    // still outlines, and later un-outlines, the element it did before.
    known: found,
    // The bar lives in a shadow root, so its nodes reach the page's entries as its host.
    own: (node) => Boolean(host) && (node === host || (typeof host.contains === 'function' && host.contains(node))),
  })

  found = elements

  return model
}

/**
 * @param {Element} element
 */
function restore(element) {
  const previous = outlines.get(element)

  if (!previous) return

  element.style.outline = previous.outline
  element.style.outlineOffset = previous.offset
  outlines.delete(element)
}

/**
 * @param {number} index
 * @param {boolean} on
 */
export function outline(index, on) {
  const element = found[index]

  if (!element || !element.style) return

  if (!on) {
    restore(element)

    return
  }

  if (!outlines.has(element)) {
    outlines.set(element, {
      outline: element.style.outline || '',
      offset: element.style.outlineOffset || '',
    })
  }

  element.style.outline = '2px solid #7f9cf5'
  element.style.outlineOffset = '2px'
}

/**
 * Scrolls an element into the middle of the screen and outlines it.
 *
 * @param {number} index
 */
export function reveal(index) {
  const element = found[index]

  if (!element || !element.isConnected) return

  element.scrollIntoView({ block: 'center', behavior: 'smooth' })
  outline(index, true)
}

export { emptyVitals }
