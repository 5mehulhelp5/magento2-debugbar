/**
 * The data layer checks, against lists of pushes as early.js records them.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseHTML } from 'linkedom'

globalThis.Node = class {}

const {
  CONSENT_KEYS,
  LOG_KEY,
  consent,
  describePush,
  emptyDataLayer,
  flatten,
  ga4Problems,
  inspectDataLayer,
  readLog,
  requestBefore,
  showPush,
  tags,
  writeLog,
} = await import('../src/datalayer.js')

let clock = 0

/** @returns {object} a push from dataLayer.push(value) */
function object(value, extra = {}) {
  return { gtag: false, value, at: (clock += 10), before: false, ...extra }
}

/** @returns {object} a push from gtag(...args) */
function gtag(...args) {
  return { gtag: true, value: args, at: (clock += 10), before: false }
}

const ITEMS = [{ item_id: '24-MB01', item_name: 'Joust Duffle Bag', price: 34 }]

/**
 * @param {string} head
 * @param {string} body
 * @returns {Document}
 */
function page(head = '', body = '') {
  return parseHTML(`<!doctype html><html><head>${head}</head><body>${body}</body></html>`).document
}

test('a push says what it is: an event, a gtag command, or the keys of an object', () => {
  assert.deepEqual(describePush(object({ event: 'add_to_cart' })).name, 'add_to_cart')
  assert.deepEqual(describePush(gtag('consent', 'update', {})).name, 'consent update')
  assert.deepEqual(describePush(gtag('js', '2026-10-13')).name, 'js 2026-10-13')
  assert.deepEqual(describePush(object({ pageType: 'product', storeCode: 'default' })).name, 'pageType, storeCode')
  assert.deepEqual(describePush(object({})).name, 'empty object')
})

test('a clean GA4 ecommerce push after its reset has no problem', () => {
  const pushes = [
    object({ ecommerce: null }),
    object({ event: 'add_to_cart', ecommerce: { currency: 'EUR', value: 34, items: ITEMS } }),
  ]

  assert.deepEqual(ga4Problems(pushes, 1), [])
  assert.deepEqual(ga4Problems(pushes, 0), [], 'the reset itself is not an ecommerce event')
})

test('each GA4 ecommerce rule names what is missing', () => {
  const pushes = [
    object({ event: 'view_item', ecommerce: { value: 34, items: [{ price: 34 }] } }),
    object({ event: 'purchase', ecommerce: { currency: 'EUR', value: 34, items: ITEMS } }),
    object({ event: 'view_item_list' }),
    object({ ecommerce: null }),
    object({ event: 'begin_checkout', ecommerce: { currency: 'EUR', items: [] } }),
  ]

  assert.deepEqual(ga4Problems(pushes, 0), [
    'items[0] has neither item_id nor item_name',
    'value without currency',
    'no {ecommerce: null} pushed right before it',
  ])
  assert.deepEqual(ga4Problems(pushes, 1), [
    'purchase without transaction_id',
    'no {ecommerce: null} pushed right before it',
  ])
  assert.deepEqual(ga4Problems(pushes, 2), ['no ecommerce object'])
  assert.deepEqual(ga4Problems(pushes, 4), ['no items[]'])
})

test('gtag ecommerce events are read from their parameters and need no reset', () => {
  const pushes = [
    gtag('event', 'add_to_cart', { currency: 'EUR', value: 34, items: ITEMS }),
    gtag('event', 'view_item', { value: 34, items: ITEMS }),
    gtag('event', 'page_view'),
  ]

  assert.deepEqual(ga4Problems(pushes, 0), [])
  assert.deepEqual(ga4Problems(pushes, 1), ['value without currency'])
  assert.deepEqual(ga4Problems(pushes, 2), [], 'not an ecommerce event')
})

test('a value flattens to paths that can be pasted into a GTM variable', () => {
  assert.deepEqual(flatten({ event: 'x', ecommerce: { items: [{ item_id: 'A' }], 'odd key': 1 }, empty: [] }), [
    { path: 'event', value: '"x"' },
    { path: 'ecommerce.items[0].item_id', value: '"A"' },
    { path: 'ecommerce["odd key"]', value: '1' },
    { path: 'empty', value: '[]' },
  ])
  assert.deepEqual(flatten(['config', 'G-1']), [
    { path: '[0]', value: '"config"' },
    { path: '[1]', value: '"G-1"' },
  ])
})

test('a push is matched to the request that came back just before it', () => {
  const requests = [
    { id: 'a', method: 'GET', url: '/customer/section/load/', at: 1000 },
    { id: 'b', method: 'POST', url: '/checkout/cart/add/', at: 1500 },
    { id: 'c', method: 'GET', url: '/later/', at: 1700 },
  ]

  assert.deepEqual(requestBefore(1600, requests), { id: 'b', label: 'POST /checkout/cart/add/', gap: 100 })
  assert.equal(requestBefore(900, requests), null, 'nothing had come back yet')
  assert.equal(requestBefore(5000, requests), null, 'too long after to be the cause')
  assert.equal(requestBefore(1600, [{ id: 'x', method: 'GET', url: '/', }]), null, 'a request with no time cannot match')
})

test('tags are found in script URLs, inline snippets, gtag config and Google\'s own list', () => {
  const doc = page(`
    <script async src="https://www.googletagmanager.com/gtm.js?id=GTM-ABC12"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XYZ789&l=dataLayer"></script>
    <script>fbq('init', '1234567890');</script>
    <script src="https://www.clarity.ms/tag/k3abc"></script>`)
  const view = tags(doc, [gtag('config', 'AW-555')], ['GTM-ABC12', 'G-XYZ789', 'dataLayer'])
  const found = view.items.map((tag) => [tag.vendor, tag.id, tag.via.join(' + ')])

  assert.deepEqual(found, [
    ['Google Tag Manager', 'GTM-ABC12', 'script + loaded by Google'],
    ['Google Analytics 4', 'G-XYZ789', 'script + loaded by Google'],
    ['Microsoft Clarity', 'k3abc', 'script'],
    ['Meta pixel', '1234567890', 'inline script'],
    ['Google Ads', 'AW-555', "gtag('config')"],
  ])
  assert.deepEqual(view.warnings, [])
})

test('the same tag loaded or configured twice is a warning, and so are two containers', () => {
  const doc = page(`
    <script src="https://www.googletagmanager.com/gtm.js?id=GTM-ONE"></script>
    <script src="https://www.googletagmanager.com/gtm.js?id=GTM-ONE"></script>
    <script src="https://www.googletagmanager.com/gtm.js?id=GTM-TWO"></script>`)
  const view = tags(doc, [gtag('config', 'G-1'), gtag('config', 'G-1')])

  assert.deepEqual(view.warnings, [
    'Google Tag Manager GTM-ONE is loaded 2 times.',
    'G-1 is configured 2 times, so its page view can be sent more than once.',
    '2 GTM containers (GTM-ONE, GTM-TWO). Check that they do not both send to the same GA4 property; the page cannot tell which property a container sends to.',
    'GA4 is configured with gtag() on a page that also loads GTM. If the container has a GA4 tag for the same property, every hit is sent twice.',
  ])
})

test('consent defaults and updates replay to the current state', () => {
  const state = consent([
    gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 }),
    object({ event: 'gtm.js' }),
    gtag('consent', 'update', { analytics_storage: 'granted' }),
  ])

  assert.equal(state.defaults.analytics_storage, 'denied')
  assert.equal(state.current.analytics_storage, 'granted')
  assert.equal(state.current.ad_storage, 'denied')
  assert.deepEqual(state.calls.map((call) => call.kind), ['default', 'update'])
  assert.deepEqual(state.warnings, [])
})

test('consent set after the first tag, or set without the v2 keys, is a warning', () => {
  assert.deepEqual(consent([
    object({ event: 'gtm.js' }),
    gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied' }),
  ]).warnings, [
    'A tag fires before the consent default is set, so it runs with no consent state.',
    'The consent default does not set ad_user_data, which Consent Mode v2 requires.',
    'The consent default does not set ad_personalization, which Consent Mode v2 requires.',
  ])

  assert.deepEqual(consent([gtag('config', 'G-1')]).warnings, [
    'No consent default is set. Google\'s tags run without Consent Mode.',
  ])

  assert.deepEqual(consent([object({ pageType: 'home' })]).warnings, [], 'no tag, so nothing to warn about')
})

test('a shown push is checked against the raw value and shows the cleaned one', () => {
  const pushes = [object({ event: 'purchase', user: { email: 'a@b.nl' }, auth_token: 'secret', ecommerce: { currency: 'EUR', value: 34, items: ITEMS } })]
  const masked = showPush(pushes, 0, { policy: 'masked', page: '/checkout/onepage/success/', requests: [] })

  assert.equal(masked.name, 'purchase', 'the event name is kept under every policy')
  assert.deepEqual(masked.problems, ['purchase without transaction_id', 'no {ecommerce: null} pushed right before it'])
  assert.doesNotMatch(masked.json, /a@b\.nl/)
  assert.doesNotMatch(masked.json, /secret/)
  assert.ok(masked.flat.some((row) => row.path === 'user.email' && row.value === '"[masked]"'))

  const full = showPush(pushes, 0, { policy: 'full', page: '/', requests: [] })

  assert.match(full.json, /a@b\.nl/, 'the full policy shows values')
  assert.doesNotMatch(full.json, /secret/, 'but never a key that names a secret')

  const none = showPush(pushes, 0, { policy: 'none', page: '/', requests: [] })

  assert.equal(none.json, '')
  assert.deepEqual(none.flat, [])
  assert.equal(none.name, 'purchase')
})

test('the section model counts each view and has the empty model\'s shape', () => {
  const model = inspectDataLayer({
    pushes: [object({ event: 'add_to_cart', ecommerce: { items: ITEMS } }), gtag('config', 'G-1')],
    requests: [],
    doc: page(),
    policy: 'full',
    page: '/',
    present: true,
  })

  assert.deepEqual(model.counts, { pushes: 1, tags: 0, consent: 1 })
  assert.equal(model.warningCount, 2)
  assert.deepEqual(model.consent.keys.map((key) => key.key), CONSENT_KEYS)

  const shape = (value) => (value && typeof value === 'object' && !Array.isArray(value)
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])]))
    : Array.isArray(value) ? 'array' : typeof value)

  assert.deepEqual(shape(emptyDataLayer()), shape(model))
})

test('the log of earlier pages is stored cleaned, bounded, and not at all under the none policy', () => {
  const store = new Map()
  const storage = {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
  }
  const pushes = [object({ event: 'view_item', email: 'a@b.nl' })]
  const shown = showPush(pushes, 0, { policy: 'masked', page: '/a.html', requests: [] })

  writeLog(storage, [], [shown], 'masked')

  assert.doesNotMatch(store.get(LOG_KEY), /a@b\.nl/)

  const earlier = readLog(storage)

  assert.equal(earlier.length, 1)
  assert.equal(earlier[0].page, '/a.html')
  assert.equal(earlier[0].current, false)

  writeLog(storage, earlier, Array.from({ length: 600 }, () => shown), 'masked')
  assert.equal(readLog(storage).length, 500)

  writeLog(storage, earlier, [shown], 'none')
  assert.equal(store.has(LOG_KEY), false)

  store.set(LOG_KEY, '{not json')
  assert.deepEqual(readLog(storage), [])
  assert.deepEqual(readLog(null), [])
})
