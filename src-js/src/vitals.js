/**
 * Core Web Vitals for the page the bar is on: LCP, CLS and INP, with TTFB and FCP.
 *
 * Each metric is worked out from the browser's own performance entries the way Google's
 * web-vitals library does it, and rated against the thresholds Google publishes. Every
 * function here is plain and takes its entries as arguments, so `node --test` can hand it a
 * list of entries without a browser.
 *
 * The entries are the browser's, with their elements on them. The model is not: it carries
 * an index into a separate list of elements, so it is safe to put in reactive state, and a
 * row can still point at the element it is about.
 */

/**
 * Google's thresholds: at or under the first is good, over the second is poor.
 * https://web.dev/articles/vitals
 */
export const THRESHOLDS = {
  lcp: [2500, 4000],
  cls: [0.1, 0.25],
  inp: [200, 500],
  fcp: [1800, 3000],
  ttfb: [800, 1800],
}

/** The entry types each metric is read from. */
export const ENTRY_TYPES = {
  lcp: 'largest-contentful-paint',
  cls: 'layout-shift',
  inp: 'event',
  fcp: 'paint',
  ttfb: 'navigation',
}

/**
 * Chromium only buffers event entries of this duration or longer, so an interaction from
 * before the bar's observer that was quicker than this is counted but never seen.
 */
export const BUFFERED_EVENT_MIN_MS = 104

const LABELS = {
  lcp: 'Largest Contentful Paint',
  cls: 'Cumulative Layout Shift',
  inp: 'Interaction to Next Paint',
  fcp: 'First Contentful Paint',
  ttfb: 'Time to First Byte',
}

const ORDER = ['lcp', 'cls', 'inp', 'fcp', 'ttfb']

/** CLS session windows: a gap of a second ends one, and none runs longer than five. */
const SESSION_GAP_MS = 1000
const SESSION_MAX_MS = 5000

/**
 * The fewest interactions trimEntries keeps: the slowest hundred.
 *
 * INP is the 98th percentile, which reaches one place further down the slowest for every
 * fifty interactions. An interaction that ends up within reach was within reach at every
 * earlier read too, because interactions are only ever added, so none is trimmed that is
 * later needed while the reach stays within this. That makes INP exact up to 5000
 * interactions on one page. Past that, the reach is kept, but an interaction trimmed
 * earlier can no longer come back, so it is close rather than exact. Google's web-vitals
 * library keeps ten.
 */
export const KEPT_INTERACTIONS = 100

/** The session windows trimEntries keeps: the worst one, and the latest after it. */
export const KEPT_SHIFT_WINDOWS = 20

/**
 * @param {string} metric
 * @param {number|null} value
 * @returns {''|'good'|'needs-improvement'|'poor'} '' when there is nothing to rate
 */
export function rate(metric, value) {
  const thresholds = THRESHOLDS[metric]

  if (!thresholds || value === null || value === undefined || Number.isNaN(value)) return ''
  if (value > thresholds[1]) return 'poor'
  if (value > thresholds[0]) return 'needs-improvement'

  return 'good'
}

/**
 * @param {string} metric
 * @param {number|null} value
 * @returns {string}
 */
export function display(metric, value) {
  if (value === null || value === undefined) return ''
  if (metric === 'cls') return value.toFixed(3).replace(/0+$/, '').replace(/\.$/, '') || '0'
  if (value >= 1000) return `${(value / 1000).toFixed(2)} s`

  return `${Math.round(value)} ms`
}

/**
 * Enough to find an element again by eye: its tag, then its id or first class.
 *
 * @param {Element|null|undefined} element
 * @returns {string}
 */
export function elementLabel(element) {
  if (!element || !element.tagName) return ''

  const tag = element.tagName.toLowerCase()

  if (element.id) return `${tag}#${element.id}`

  const className = typeof element.className === 'string' ? element.className.trim().split(/\s+/)[0] : ''

  return className ? `${tag}.${className}` : tag
}

/**
 * Collects elements as the model refers to them, one index per element however often it
 * comes up.
 */
function registry(known = []) {
  /** @type {Array<Element>} */
  const elements = [...known]

  return {
    elements,
    /**
     * @param {Element|null|undefined} element
     * @returns {number} -1 when there is no element to point at
     */
    add(element) {
      if (!element || !element.tagName) return -1

      const known = elements.indexOf(element)

      if (known !== -1) return known

      elements.push(element)

      return elements.length - 1
    },
  }
}

/**
 * @param {Array<object>} entries largest-contentful-paint entries, in order
 * @param {number} activation when a prerendered page was shown, 0 otherwise
 * @param {ReturnType<typeof registry>} found
 * @returns {{value: number|null, element: {label: string, index: number, url: string, size: number}|null}}
 */
export function largestContentfulPaint(entries, activation, found) {
  // The browser stops adding candidates at the first input or scroll, so the last one is
  // the answer.
  const last = entries[entries.length - 1]

  if (!last) return { value: null, element: null }

  return {
    value: Math.max(0, last.startTime - activation),
    element: {
      label: elementLabel(last.element) || (last.url ? 'an image no longer on the page' : 'an element no longer on the page'),
      index: found.add(last.element),
      url: last.url || '',
      size: last.size || 0,
    },
  }
}

/**
 * @param {Element|null|undefined} node
 * @param {(node: Element) => boolean} own
 * @returns {boolean}
 */
function isOwn(node, own) {
  return Boolean(node && own(node))
}

/**
 * The shifts CLS counts, grouped into session windows.
 *
 * A shift right after an input is the page answering it, which is not a surprise. A shift
 * only the bar took part in is not the page's.
 *
 * @param {Array<object>} entries layout-shift entries, in order
 * @param {(node: Element) => boolean} own whether a node belongs to the bar
 * @returns {Array<Array<object>>}
 */
export function sessionWindows(entries, own) {
  const counted = entries.filter((entry) => !entry.hadRecentInput
    && !((entry.sources || []).length > 0 && entry.sources.every((source) => isOwn(source.node, own))))

  /** @type {Array<Array<object>>} */
  const windows = []

  counted.forEach((entry) => {
    const current = windows[windows.length - 1]
    const first = current && current[0]
    const previous = current && current[current.length - 1]

    if (current
      && entry.startTime - previous.startTime < SESSION_GAP_MS
      && entry.startTime - first.startTime < SESSION_MAX_MS) {
      current.push(entry)
    } else {
      windows.push([entry])
    }
  })

  return windows
}

/**
 * @param {Array<object>} window
 * @returns {number}
 */
function windowSum(window) {
  return window.reduce((sum, entry) => sum + entry.value, 0)
}

/**
 * CLS is the worst session window, not the sum of every shift: a long-lived page would
 * otherwise only ever get worse.
 *
 * @param {Array<object>} entries layout-shift entries, in order
 * @param {(node: Element) => boolean} own whether a node belongs to the bar
 * @param {ReturnType<typeof registry>} found
 * @param {WeakMap<object, number>} numbers each window's number, by its first shift, kept
 *   across reads so trimming earlier windows does not renumber the rest
 * @returns {{value: number|null, shifts: Array<object>}}
 */
export function cumulativeLayoutShift(entries, own, found, numbers = new WeakMap()) {
  const windows = sessionWindows(entries, own)
  const sums = windows.map(windowSum)
  const worst = sums.length ? sums.indexOf(Math.max(...sums)) : -1

  // Numbered by their first shift, which stays first however the list is trimmed, so a
  // window keeps its number when the ones before it are dropped. One not seen before is
  // the next after the window ahead of it, because windows only ever start at the end.
  let number = 0
  const numbered = windows.map((window) => {
    number = numbers.get(window[0]) ?? number + 1
    numbers.set(window[0], number)

    return number
  })

  const shifts = []

  windows.forEach((window, windowIndex) => {
    window.forEach((entry) => {
      shifts.push({
        at: Math.round(entry.startTime),
        value: entry.value,
        display: display('cls', entry.value),
        window: numbered[windowIndex],
        worst: windowIndex === worst,
        sources: (entry.sources || [])
          .filter((source) => !isOwn(source.node, own))
          .map((source) => ({
            label: elementLabel(source.node) || 'an element no longer on the page',
            index: found.add(source.node),
          })),
      })
    })
  })

  return {
    // No shifts at all is a measured zero, as long as the browser can measure shifts.
    value: worst === -1 ? 0 : sums[worst],
    shifts,
  }
}

/**
 * INP is close to the slowest interaction: the 98th percentile, so one outlier in fifty is
 * forgiven on a page that is used a lot.
 *
 * @param {Array<object>} entries event entries
 * @param {number} interactionCount performance.interactionCount where the browser has it
 * @param {(node: Element) => boolean} own
 * @param {ReturnType<typeof registry>} found
 * @param {{seen: number, measured: number}|null} totals the interactions counted so far, when
 *   the entries have been trimmed and no longer hold every one
 * @returns {{value: number|null, interaction: object|null, count: number, unseen: number}}
 */
export function interactionToNextPaint(entries, interactionCount, own, found, totals = null) {
  /** @type {Map<number, object>} the longest entry of each interaction */
  const longest = new Map()
  /** @type {Set<number>} every interaction seen, the bar's own included */
  const seen = new Set()

  entries.forEach((entry) => {
    if (!entry.interactionId) return

    seen.add(entry.interactionId)

    // Clicks on the bar are interactions with the bar, not with the page it is measuring.
    if (isOwn(entry.target, own)) return

    const known = longest.get(entry.interactionId)

    if (!known || entry.duration > known.duration) longest.set(entry.interactionId, entry)
  })

  const unseen = Math.max(0, (interactionCount || 0) - (totals ? totals.seen : seen.size))
  const ranked = Array.from(longest.values()).sort((a, b) => b.duration - a.duration)
  const measured = totals ? totals.measured : ranked.length

  if (ranked.length === 0) return { value: null, interaction: null, count: 0, unseen }

  const total = Math.max(interactionCount || 0, measured)
  const chosen = ranked[Math.min(ranked.length - 1, Math.floor(total / 50))]

  return {
    value: chosen.duration,
    interaction: {
      name: chosen.name,
      at: Math.round(chosen.startTime),
      label: elementLabel(chosen.target) || 'an element no longer on the page',
      index: found.add(chosen.target),
    },
    count: measured,
    unseen,
  }
}

/**
 * @param {Array<object>} paints paint entries
 * @param {number} activation
 * @returns {number|null}
 */
export function firstContentfulPaint(paints, activation) {
  const entry = paints.find((paint) => paint.name === 'first-contentful-paint')

  return entry ? Math.max(0, entry.startTime - activation) : null
}

/**
 * @param {object|undefined} navigation the navigation entry
 * @returns {number|null}
 */
export function timeToFirstByte(navigation) {
  if (!navigation || !(navigation.responseStart > 0)) return null

  return Math.max(0, navigation.responseStart - (navigation.activationStart || 0))
}

/**
 * @returns {object} the model before anything has been read
 */
export function emptyVitals() {
  return {
    metrics: ORDER.map((id) => ({
      id,
      label: id.toUpperCase(),
      name: LABELS[id],
      value: null,
      display: '',
      rating: '',
      supported: true,
    })),
    lcp: null,
    shifts: [],
    inp: { interaction: null, count: 0, unseen: 0 },
    poorCount: 0,
  }
}

/**
 * @typedef {object} VitalsInput
 * @property {Record<string, Array<object>>} entries by entry type
 * @property {Array<string>} supported PerformanceObserver.supportedEntryTypes
 * @property {number} interactionCount
 * @property {(node: Element) => boolean} own whether a node belongs to the bar
 * @property {Array<Element>} [known] the elements an earlier read returned, so an index the
 *   panel already holds keeps pointing at the same element
 * @property {{seen: number, measured: number}|null} [interactions] from countInteractions,
 *   for entries that trimEntries has trimmed
 * @property {WeakMap<object, number>} [windowNumbers] kept across reads, for the same reason
 */

/**
 * @param {VitalsInput} input
 * @returns {{model: object, elements: Array<Element>}}
 */
export function inspectVitals({
  entries,
  supported,
  interactionCount = 0,
  own = () => false,
  known = [],
  interactions = null,
  windowNumbers = new WeakMap(),
}) {
  const found = registry(known)
  const of = (type) => entries[type] || []
  const navigation = of('navigation')[0]
  const activation = (navigation && navigation.activationStart) || 0

  const lcp = largestContentfulPaint(of('largest-contentful-paint'), activation, found)
  const cls = cumulativeLayoutShift(of('layout-shift'), own, found, windowNumbers)
  const inp = interactionToNextPaint(of('event'), interactionCount, own, found, interactions)

  const values = {
    lcp: lcp.value,
    cls: cls.value,
    inp: inp.value,
    fcp: firstContentfulPaint(of('paint'), activation),
    ttfb: timeToFirstByte(navigation),
  }

  const metrics = ORDER.map((id) => {
    const isSupported = supported.includes(ENTRY_TYPES[id])
    let value = isSupported ? values[id] : null
    let shown = display(id, value)
    let rating = rate(id, value)

    // Interactions happened, but every one was too quick to be buffered before the bar was
    // listening. Too quick to be buffered is also too quick to be anything but good.
    if (id === 'inp' && isSupported && value === null && inp.unseen > 0) {
      value = null
      shown = `under ${BUFFERED_EVENT_MIN_MS} ms`
      rating = 'good'
    }

    return { id, label: id.toUpperCase(), name: LABELS[id], value, display: shown, rating, supported: isSupported }
  })

  return {
    model: {
      metrics,
      lcp: lcp.element,
      shifts: cls.shifts,
      inp: { interaction: inp.interaction, count: inp.count, unseen: inp.unseen },
      poorCount: metrics.filter((metric) => metric.rating === 'poor').length,
    },
    elements: found.elements,
  }
}

/**
 * Adds the interactions in these event entries to the running sets INP is counted from.
 *
 * The sets hold interaction ids, one number each. The entries they came from hold the
 * element that was interacted with, which is what trimEntries can then let go of.
 *
 * @param {Array<object>} events event entries
 * @param {(node: Element) => boolean} own
 * @param {{seen: Set<number>, measured: Set<number>}} into every interaction, and the page's own
 */
export function countInteractions(events, own, into) {
  events.forEach((entry) => {
    if (!entry.interactionId) return

    into.seen.add(entry.interactionId)

    if (!isOwn(entry.target, own)) into.measured.add(entry.interactionId)
  })
}

/**
 * The entries a long-lived page needs to keep, and no more, so the lists stop growing.
 *
 * Nothing the panel shows changes, provided the interactions were counted first with
 * countInteractions and the windows numbered with the same map:
 *
 * - LCP reads the last candidate, so only that is kept.
 * - INP reads the slowest interactions, as far down as the 98th percentile. The slowest
 *   entry of each is kept, for at least KEPT_INTERACTIONS interactions and as many as the
 *   percentile reaches. A plain cut-off would keep the first ones rather than the slow ones.
 * - CLS reads the worst session window, and the latest can still grow into a worse one. The
 *   worst is kept with the latest windows after it, up to KEPT_SHIFT_WINDOWS. Shifts CLS
 *   does not count are never shown, so they are dropped too.
 *
 * @param {Record<string, Array<object>>} entries by entry type
 * @param {(node: Element) => boolean} own
 * @param {{interactionCount: number, measured: number}} totals
 * @returns {Record<string, Array<object>>} new lists; the ones not trimmed are the same arrays
 */
export function trimEntries(entries, own, { interactionCount = 0, measured = 0 } = {}) {
  const trimmed = { ...entries }
  const lcp = entries['largest-contentful-paint']

  if (lcp && lcp.length > 1) trimmed['largest-contentful-paint'] = lcp.slice(-1)

  if (entries.event) {
    const reach = Math.floor(Math.max(interactionCount || 0, measured) / 50) + 1

    trimmed.event = slowestInteractions(entries.event, own, Math.max(KEPT_INTERACTIONS, reach))
  }

  if (entries['layout-shift']) {
    trimmed['layout-shift'] = worstAndLatestWindows(entries['layout-shift'], own)
  }

  return trimmed
}

/**
 * @param {Array<object>} events
 * @param {(node: Element) => boolean} own
 * @param {number} keep
 * @returns {Array<object>} the slowest entry of each of the slowest interactions, in order
 */
function slowestInteractions(events, own, keep) {
  /** @type {Map<number, object>} */
  const longest = new Map()

  events.forEach((entry) => {
    if (!entry.interactionId || isOwn(entry.target, own)) return

    const known = longest.get(entry.interactionId)

    if (!known || entry.duration > known.duration) longest.set(entry.interactionId, entry)
  })

  const kept = new Set(Array.from(longest.values())
    .sort((a, b) => b.duration - a.duration)
    .slice(0, keep))

  return events.filter((entry) => kept.has(entry))
}

/**
 * @param {Array<object>} shifts
 * @param {(node: Element) => boolean} own
 * @returns {Array<object>}
 */
function worstAndLatestWindows(shifts, own) {
  const windows = sessionWindows(shifts, own)
  const sums = windows.map(windowSum)
  const worst = sums.indexOf(Math.max(...sums))

  // Dropping the windows between the two cannot join them: they were already separate, and
  // removing what lay between only widens the gap.
  return windows
    .filter((window, index) => index === worst || index >= windows.length - (KEPT_SHIFT_WINDOWS - 1))
    .flat()
}
