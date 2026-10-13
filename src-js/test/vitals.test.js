/**
 * The Web Vitals arithmetic, against lists of entries shaped like the browser's.
 *
 * Elements are plain objects with a tag name: the module only ever reads tagName, id and
 * className from them, and compares them by identity.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  KEPT_INTERACTIONS,
  KEPT_SHIFT_WINDOWS,
  THRESHOLDS,
  countInteractions,
  display,
  elementLabel,
  emptyVitals,
  inspectVitals,
  rate,
  trimEntries,
} from '../src/vitals.js'

const ALL_TYPES = ['largest-contentful-paint', 'layout-shift', 'event', 'paint', 'navigation']

/**
 * @param {string} tagName
 * @param {object} rest
 * @returns {object}
 */
function element(tagName, rest = {}) {
  return { tagName: tagName.toUpperCase(), id: '', className: '', ...rest }
}

/**
 * @param {Record<string, Array<object>>} entries
 * @param {object} extra
 * @returns {{model: object, elements: Array<object>}}
 */
function inspect(entries, extra = {}) {
  return inspectVitals({ entries, supported: ALL_TYPES, ...extra })
}

/**
 * @param {object} model
 * @param {string} id
 * @returns {object}
 */
function metric(model, id) {
  return model.metrics.find((item) => item.id === id)
}

test('ratings use Google\'s thresholds, inclusive of the good one', () => {
  assert.deepEqual(THRESHOLDS.lcp, [2500, 4000])
  assert.equal(rate('lcp', 2500), 'good')
  assert.equal(rate('lcp', 2501), 'needs-improvement')
  assert.equal(rate('lcp', 4000), 'needs-improvement')
  assert.equal(rate('lcp', 4001), 'poor')
  assert.equal(rate('cls', 0.1), 'good')
  assert.equal(rate('cls', 0.25), 'needs-improvement')
  assert.equal(rate('cls', 0.26), 'poor')
  assert.equal(rate('inp', 200), 'good')
  assert.equal(rate('inp', 501), 'poor')
  assert.equal(rate('fcp', 1801), 'needs-improvement')
  assert.equal(rate('ttfb', 1801), 'poor')
  assert.equal(rate('lcp', null), '')
})

test('values read the way the thresholds are written', () => {
  assert.equal(display('cls', 0), '0')
  assert.equal(display('cls', 0.05), '0.05')
  assert.equal(display('cls', 0.1234), '0.123')
  assert.equal(display('lcp', 812.4), '812 ms')
  assert.equal(display('lcp', 2345), '2.35 s')
  assert.equal(display('inp', null), '')
})

test('an element is labelled by its tag and its id, or else its first class', () => {
  assert.equal(elementLabel(element('img', { id: 'hero', className: 'a b' })), 'img#hero')
  assert.equal(elementLabel(element('img', { className: '  product-image  photo' })), 'img.product-image')
  assert.equal(elementLabel(element('p')), 'p')
  assert.equal(elementLabel(null), '')
})

test('LCP is the last candidate, counted from activation, and points at its element', () => {
  const first = element('h1')
  const last = element('img', { className: 'hero' })
  const { model, elements } = inspect({
    navigation: [{ responseStart: 100, activationStart: 200 }],
    'largest-contentful-paint': [
      { startTime: 900, element: first, size: 1000 },
      { startTime: 2900, element: last, url: 'https://shop.test/hero.jpg', size: 50000 },
    ],
  })

  assert.equal(metric(model, 'lcp').value, 2700)
  assert.equal(metric(model, 'lcp').rating, 'needs-improvement')
  assert.equal(model.lcp.label, 'img.hero')
  assert.equal(model.lcp.url, 'https://shop.test/hero.jpg')
  assert.equal(elements[model.lcp.index], last)
})

test('CLS is the worst session window, not every shift added up', () => {
  const a = element('div', { className: 'banner' })
  const b = element('ul', { className: 'products' })
  const { model, elements } = inspect({
    'layout-shift': [
      // One window: 0.1 + 0.05, within a second of each other.
      { startTime: 100, value: 0.1, sources: [{ node: a }] },
      { startTime: 900, value: 0.05, sources: [{ node: b }] },
      // A gap of more than a second starts the next: 0.12 + 0.08 = 0.2, the worst.
      { startTime: 2500, value: 0.12, sources: [{ node: b }] },
      { startTime: 3000, value: 0.08, sources: [] },
    ],
  })

  assert.equal(Math.round(metric(model, 'cls').value * 1000) / 1000, 0.2)
  assert.equal(metric(model, 'cls').rating, 'needs-improvement')
  assert.deepEqual(model.shifts.map((shift) => [shift.window, shift.worst]),
    [[1, false], [1, false], [2, true], [2, true]])
  assert.equal(elements[model.shifts[0].sources[0].index], a)
  // The same element moving twice is one element to point at.
  assert.equal(model.shifts[1].sources[0].index, model.shifts[2].sources[0].index)
})

test('a session window closes after five seconds, however close the shifts are', () => {
  const shifts = Array.from({ length: 7 }, (_, index) => ({ startTime: index * 900, value: 0.05, sources: [] }))
  const { model } = inspect({ 'layout-shift': shifts })

  // 0, 900 ... 4500 are within five seconds of the first; 5400 starts a second window.
  assert.deepEqual(model.shifts.map((shift) => shift.window), [1, 1, 1, 1, 1, 1, 2])
  assert.equal(Math.round(metric(model, 'cls').value * 100) / 100, 0.3)
})

test('shifts after input and shifts only the bar took part in do not count', () => {
  const host = element('siteation-debugbar')
  const page = element('main')
  const { model } = inspect({
    'layout-shift': [
      { startTime: 100, value: 0.3, hadRecentInput: true, sources: [{ node: page }] },
      { startTime: 200, value: 0.4, sources: [{ node: host }] },
      { startTime: 300, value: 0.02, sources: [{ node: host }, { node: page }] },
    ],
  }, { own: (node) => node === host })

  assert.equal(metric(model, 'cls').value, 0.02)
  assert.equal(model.shifts.length, 1)
  assert.deepEqual(model.shifts[0].sources.map((source) => source.label), ['main'])
})

test('no shifts at all is a measured zero', () => {
  const { model } = inspect({ 'layout-shift': [] })

  assert.equal(metric(model, 'cls').value, 0)
  assert.equal(metric(model, 'cls').display, '0')
  assert.equal(metric(model, 'cls').rating, 'good')
})

test('INP takes each interaction\'s longest entry and leaves the bar\'s own out', () => {
  const host = element('siteation-debugbar')
  const button = element('button', { id: 'add-to-cart' })
  const { model, elements } = inspect({
    event: [
      { name: 'pointerdown', interactionId: 1, duration: 80, startTime: 1000, target: button },
      { name: 'click', interactionId: 1, duration: 240, startTime: 1000, target: button },
      { name: 'click', interactionId: 2, duration: 900, startTime: 3000, target: host },
      // Hovers carry no interaction.
      { name: 'pointerover', interactionId: 0, duration: 2000, startTime: 500, target: button },
    ],
  }, { own: (node) => node === host, interactionCount: 2 })

  assert.equal(metric(model, 'inp').value, 240)
  assert.equal(metric(model, 'inp').rating, 'needs-improvement')
  assert.equal(model.inp.interaction.name, 'click')
  assert.equal(model.inp.interaction.label, 'button#add-to-cart')
  assert.equal(elements[model.inp.interaction.index], button)
  assert.equal(model.inp.count, 1)
  assert.equal(model.inp.unseen, 0)
})

test('INP forgives one slow interaction in every fifty', () => {
  const target = element('a')
  const event = Array.from({ length: 60 }, (_, index) => ({
    name: 'click', interactionId: index + 1, duration: index === 0 ? 1200 : 40 + index, startTime: index * 100, target,
  }))
  const { model } = inspect({ event }, { interactionCount: 60 })

  // Sixty interactions: the slowest is skipped, the next one (99 ms) is INP.
  assert.equal(metric(model, 'inp').value, 99)
})

test('interactions too quick to have been kept from before the bar are good, not missing', () => {
  const { model } = inspect({ event: [] }, { interactionCount: 3 })

  assert.equal(metric(model, 'inp').value, null)
  assert.equal(metric(model, 'inp').display, 'under 104 ms')
  assert.equal(metric(model, 'inp').rating, 'good')
  assert.equal(model.inp.unseen, 3)
  assert.equal(model.poorCount, 0)
})

test('FCP and TTFB are counted from activation', () => {
  const { model } = inspect({
    navigation: [{ responseStart: 950, activationStart: 100 }],
    paint: [{ name: 'first-paint', startTime: 1500 }, { name: 'first-contentful-paint', startTime: 3500 }],
  })

  assert.equal(metric(model, 'ttfb').value, 850)
  assert.equal(metric(model, 'ttfb').rating, 'needs-improvement')
  assert.equal(metric(model, 'fcp').value, 3400)
  assert.equal(metric(model, 'fcp').rating, 'poor')
})

test('a metric the browser cannot measure says so instead of reading as zero', () => {
  const { model } = inspectVitals({
    entries: { paint: [{ name: 'first-contentful-paint', startTime: 4000 }] },
    supported: ['paint', 'navigation'],
  })

  assert.equal(metric(model, 'cls').supported, false)
  assert.equal(metric(model, 'cls').value, null)
  assert.equal(metric(model, 'cls').rating, '')
  assert.equal(metric(model, 'inp').display, '')
  assert.equal(metric(model, 'fcp').rating, 'poor')
  assert.equal(model.poorCount, 1)
})

test('the poor count is what the sidebar shows', () => {
  const { model } = inspect({
    navigation: [{ responseStart: 2000 }],
    'largest-contentful-paint': [{ startTime: 5000, element: element('img') }],
    'layout-shift': [{ startTime: 10, value: 0.5, sources: [] }],
  })

  assert.equal(model.poorCount, 3)
})

test('an element keeps its index across reads, so a hovered row still points at it', () => {
  const banner = element('div', { className: 'banner' })
  const hero = element('img', { className: 'hero' })
  const first = inspect({ 'layout-shift': [{ startTime: 10, value: 0.01, sources: [{ node: banner }] }] })
  const second = inspect({
    'largest-contentful-paint': [{ startTime: 900, element: hero }],
    'layout-shift': [{ startTime: 10, value: 0.01, sources: [{ node: banner }] }],
  }, { known: first.elements })

  assert.equal(second.model.shifts[0].sources[0].index, first.model.shifts[0].sources[0].index)
  assert.equal(second.elements[second.model.lcp.index], hero)
})

test('the empty model has every metric, unrated', () => {
  const model = emptyVitals()

  assert.deepEqual(model.metrics.map((item) => item.id), ['lcp', 'cls', 'inp', 'fcp', 'ttfb'])
  assert.ok(model.metrics.every((item) => item.rating === '' && item.value === null))
  assert.equal(model.poorCount, 0)
})

/**
 * A page left open: the entries arrive in batches, and after each batch the panel is read
 * and the lists trimmed, the way vitals-page.js does it.
 *
 * @param {Array<Record<string, Array<object>>>} batches
 * @param {{interactionCount?: number, own?: (node: object) => boolean}} options
 * @returns {{model: object, entries: Record<string, Array<object>>}}
 */
function leftOpen(batches, { interactionCount = 0, own = () => false } = {}) {
  const entries = {}
  const interactions = { seen: new Set(), measured: new Set() }
  const windowNumbers = new WeakMap()
  let model = null

  batches.forEach((batch) => {
    Object.entries(batch).forEach(([type, list]) => {
      entries[type] = [...(entries[type] || []), ...list]
    })

    countInteractions(entries.event || [], own, interactions)
    model = inspect(entries, {
      own,
      interactionCount,
      interactions: { seen: interactions.seen.size, measured: interactions.measured.size },
      windowNumbers,
    }).model
    Object.assign(entries, trimEntries(entries, own, { interactionCount, measured: interactions.measured.size }))
  })

  return { model, entries }
}

/**
 * The same entries, every one kept, read once at the end.
 *
 * @param {Array<Record<string, Array<object>>>} batches
 * @param {object} extra
 * @returns {object}
 */
function readOnce(batches, extra = {}) {
  const entries = {}

  batches.forEach((batch) => {
    Object.entries(batch).forEach(([type, list]) => {
      entries[type] = [...(entries[type] || []), ...list]
    })
  })

  return inspect(entries, extra).model
}

/**
 * The parts of a model a trim could change: the INP and CLS readings and the shifts listed.
 *
 * @param {object} model
 * @returns {object}
 */
function reading(model) {
  return {
    metrics: model.metrics.map(({ id, value, display: shown, rating }) => ({ id, value, shown, rating })),
    lcp: model.lcp && { label: model.lcp.label, url: model.lcp.url, size: model.lcp.size },
    inp: {
      count: model.inp.count,
      unseen: model.inp.unseen,
      interaction: model.inp.interaction && {
        name: model.inp.interaction.name,
        at: model.inp.interaction.at,
        label: model.inp.interaction.label,
      },
    },
  }
}

/**
 * A long session: interactions with two entries each, some on the bar, layout shifts in
 * windows a few seconds apart, and an LCP candidate now and then. Durations and shift values
 * vary without ties, so which interaction or window is the worst is never a coin toss.
 *
 * @param {number} count batches of ten interactions and ten shifts
 * @param {object} host the bar
 * @returns {Array<Record<string, Array<object>>>}
 */
function session(count, host) {
  const button = element('button', { id: 'add' })
  const batches = []
  let id = 0

  for (let batch = 0; batch < count; batch++) {
    const event = []
    const shifts = []
    const at = batch * 20000

    for (let i = 0; i < 10; i++) {
      id += 7
      // Every thirteenth interaction is with the bar, and slow, as clicks on it can be.
      const target = id % 13 === 0 ? host : button
      const duration = ((id * 7919) % 997) + 16 + (target === host ? 2000 : 0)

      event.push(
        { name: 'pointerdown', interactionId: id, duration: duration / 2, startTime: at + i * 100, target },
        { name: 'click', interactionId: id, duration, startTime: at + i * 100, target },
      )
      // Two shifts per window, windows two seconds apart.
      shifts.push({
        value: (((batch * 10 + i) * 104729) % 1009) / 100000,
        startTime: at + Math.floor(i / 2) * 2000 + (i % 2) * 300,
        hadRecentInput: i === 9,
        sources: [{ node: element('div', { id: `card-${batch}-${i}` }) }],
      })
    }

    batches.push({
      event,
      'layout-shift': shifts,
      ...(batch % 50 === 0 ? { 'largest-contentful-paint': [{ startTime: 900 + batch, element: element('img'), url: `/hero-${batch}.jpg`, size: batch + 1 }] } : {}),
    })
  }

  return batches
}

test('a page left open shows what it would have shown had every entry been kept', () => {
  const host = element('siteation-debugbar')
  const own = (node) => node === host
  const batches = session(400, host)

  for (const interactionCount of [0, 4100]) {
    const trimmed = leftOpen(batches, { own, interactionCount })
    const everything = readOnce(batches, { own, interactionCount })

    assert.deepEqual(reading(trimmed.model), reading(everything), `interactionCount ${interactionCount}`)
  }
})

test('a page left open keeps the worst layout shift window and its number', () => {
  const host = element('siteation-debugbar')
  const batches = session(400, host)
  const trimmed = leftOpen(batches, { own: (node) => node === host }).model
  const everything = readOnce(batches, { own: (node) => node === host })
  const key = (shift) => `${shift.at} ${shift.window} ${shift.worst}`
  const all = new Set(everything.shifts.map(key))

  // Every shift still listed is listed as it was, window number included.
  assert.ok(trimmed.shifts.length < everything.shifts.length)
  trimmed.shifts.forEach((shift) => assert.ok(all.has(key(shift)), key(shift)))
  assert.deepEqual(
    trimmed.shifts.filter((shift) => shift.worst).map(key),
    everything.shifts.filter((shift) => shift.worst).map(key)
  )
})

test('a page left open stops growing', () => {
  const host = element('siteation-debugbar')
  const own = (node) => node === host
  const { entries } = leftOpen(session(400, host), { own, interactionCount: 4100 })
  const interactions = new Set(entries.event.map((entry) => entry.interactionId))
  const own_ = entries.event.filter((entry) => own(entry.target))

  // 4000 interactions in, 4100 counted: the 98th percentile is the 83rd slowest, within
  // the hundred that are always kept.
  assert.equal(interactions.size, KEPT_INTERACTIONS)
  assert.equal(entries.event.length, interactions.size, 'one entry per interaction, its slowest')
  assert.deepEqual(own_, [], 'the bar\'s own interactions are counted, not kept')
  // Two shifts to a window, and the last of every ten is after an input and never counted.
  assert.ok(entries['layout-shift'].length <= KEPT_SHIFT_WINDOWS * 2)
  assert.ok(entries['layout-shift'].every((shift) => !shift.hadRecentInput))
  assert.equal(entries['largest-contentful-paint'].length, 1)
  assert.equal(entries['largest-contentful-paint'][0].url, '/hero-350.jpg')
})

test('the slowest interactions are the ones kept, and more once the percentile reaches past them', () => {
  const button = element('button')
  const event = Array.from({ length: 300 }, (_, i) => ({
    name: 'click', interactionId: (i + 1) * 7, duration: 20 + i, startTime: i * 100, target: button,
  }))

  const quiet = trimEntries({ event }, () => false, { interactionCount: 300, measured: 300 })
  const busy = trimEntries({ event }, () => false, { interactionCount: 6000, measured: 300 })

  assert.equal(quiet.event.length, KEPT_INTERACTIONS)
  assert.equal(Math.min(...quiet.event.map((entry) => entry.duration)), 20 + 300 - KEPT_INTERACTIONS)
  // 6000 interactions put the 98th percentile 121st from the slowest.
  assert.equal(busy.event.length, 121)
})

test('trimming leaves the lists it has nothing to do with alone', () => {
  const paint = [{ name: 'first-contentful-paint', startTime: 800 }]
  const navigation = [{ responseStart: 120 }]

  const trimmed = trimEntries({ paint, navigation }, () => false)

  assert.equal(trimmed.paint, paint)
  assert.equal(trimmed.navigation, navigation)
})
