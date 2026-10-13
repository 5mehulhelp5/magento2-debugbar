/**
 * The Web Vitals arithmetic, against lists of entries shaped like the browser's.
 *
 * Elements are plain objects with a tag name: the module only ever reads tagName, id and
 * className from them, and compares them by identity.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  THRESHOLDS,
  display,
  elementLabel,
  emptyVitals,
  inspectVitals,
  rate,
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
