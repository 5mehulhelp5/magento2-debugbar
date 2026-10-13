/**
 * Reads window.dataLayer: what was pushed, which tags the page loads, and what consent
 * state Google's tags were given.
 *
 * The pushes come from early.js, which copies each one at the moment it is made. Every
 * function here is plain and takes its inputs as arguments, so `node --test` can hand it a
 * list of pushes and a Document.
 *
 * Unlike the SEO section, a data layer holds what the page never draws: emails, hashed
 * emails, phone numbers, order totals. So the checks read the raw copy, and everything
 * that is shown or stored goes through clean() first, the same way Alpine state does.
 */
import { POLICY_NONE, clean } from './redact.js'

/** The GA4 ecommerce events, in the order a purchase usually passes through them. */
export const GA4_ECOMMERCE_EVENTS = [
  'view_item_list',
  'select_item',
  'view_item',
  'add_to_wishlist',
  'add_to_cart',
  'remove_from_cart',
  'view_cart',
  'begin_checkout',
  'add_shipping_info',
  'add_payment_info',
  'purchase',
  'refund',
  'view_promotion',
  'select_promotion',
]

/** Events that need items[], per Google's ecommerce reference. */
const NEEDS_ITEMS = GA4_ECOMMERCE_EVENTS.filter((name) => !['refund'].includes(name))

/** Consent Mode v2: the four keys Google's tags read. */
export const CONSENT_KEYS = ['ad_storage', 'analytics_storage', 'ad_user_data', 'ad_personalization']

/** How far before a push a request may have arrived and still be the one it followed. */
const REQUEST_WINDOW_MS = 2000

/** The cross page log: entries and characters, whichever runs out first. */
export const LOG_KEY = 'siteation.debugbar.datalayer.v1'
const LOG_MAX_ENTRIES = 500
const LOG_MAX_CHARS = 400000

/**
 * @typedef {object} RawPush what early.js records
 * @property {boolean} gtag pushed by gtag(), as its arguments
 * @property {unknown} value a copy taken at the moment of the push
 * @property {number} at performance.now() when it was pushed
 * @property {boolean} before already in the array when the bar's hook arrived
 */

/**
 * What a push is, in a word or two: the event name, the gtag command, or "object".
 *
 * @param {RawPush} push
 * @returns {{kind: string, name: string, args: Array<unknown>}}
 */
export function describePush(push) {
  const value = push.value

  if (push.gtag && Array.isArray(value)) {
    const command = String(value[0] ?? '')
    const second = typeof value[1] === 'string' ? value[1] : ''

    return { kind: 'gtag', name: second ? `${command} ${second}` : command, args: value }
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    if (typeof value.event === 'string') return { kind: 'event', name: value.event, args: [] }

    return { kind: 'object', name: Object.keys(value).slice(0, 3).join(', ') || 'empty object', args: [] }
  }

  return { kind: 'other', name: typeof value, args: [] }
}

/**
 * Where a push's ecommerce data lives: under `ecommerce` for a dataLayer.push, or in the
 * parameters for gtag('event', name, params).
 *
 * @param {RawPush} push
 * @returns {{event: string, data: object|null, viaGtag: boolean}}
 */
function ecommerceOf(push) {
  const value = push.value

  if (push.gtag && Array.isArray(value) && value[0] === 'event') {
    const params = value[2] && typeof value[2] === 'object' ? value[2] : null

    return { event: String(value[1] ?? ''), data: params, viaGtag: true }
  }

  if (value && typeof value === 'object' && typeof value.event === 'string') {
    const data = value.ecommerce && typeof value.ecommerce === 'object' ? value.ecommerce : null

    return { event: value.event, data, viaGtag: false }
  }

  return { event: '', data: null, viaGtag: false }
}

/**
 * @param {RawPush|undefined} push
 * @returns {boolean} whether it is the `{ecommerce: null}` that clears the last event's data
 */
function isEcommerceReset(push) {
  const value = push && push.value

  return Boolean(value && typeof value === 'object' && !Array.isArray(value)
    && 'ecommerce' in value && value.ecommerce === null)
}

/**
 * Problems with one GA4 ecommerce push, judged against the pushes before it.
 *
 * @param {Array<RawPush>} pushes
 * @param {number} index
 * @returns {Array<string>}
 */
export function ga4Problems(pushes, index) {
  const { event, data, viaGtag } = ecommerceOf(pushes[index])

  if (!GA4_ECOMMERCE_EVENTS.includes(event)) return []

  const problems = []

  if (!data) {
    problems.push(viaGtag ? 'no parameters' : 'no ecommerce object')

    return problems
  }

  if (NEEDS_ITEMS.includes(event)) {
    const items = data.items

    if (!Array.isArray(items) || items.length === 0) {
      problems.push('no items[]')
    } else {
      items.forEach((item, position) => {
        const named = item && typeof item === 'object'
          && ((item.item_id !== undefined && item.item_id !== '') || (item.item_name !== undefined && item.item_name !== ''))

        if (!named) problems.push(`items[${position}] has neither item_id nor item_name`)
      })
    }
  }

  if (data.value !== undefined && data.value !== null && !data.currency) {
    problems.push('value without currency')
  }

  if (event === 'purchase' && !data.transaction_id) problems.push('purchase without transaction_id')

  // A dataLayer.push merges into what GTM already holds, so the items of the last event
  // ride along unless they are cleared first. gtag() calls do not merge.
  if (!viaGtag && !isEcommerceReset(pushes[index - 1])) {
    problems.push('no {ecommerce: null} pushed right before it')
  }

  return problems
}

/**
 * Every leaf of a value as a path and a value, for the flat view and for copying a path.
 *
 * @param {unknown} value
 * @param {string} prefix
 * @param {Array<{path: string, value: string}>} out
 * @returns {Array<{path: string, value: string}>}
 */
export function flatten(value, prefix = '', out = []) {
  if (out.length >= 500) return out

  if (value !== null && typeof value === 'object') {
    const entries = Array.isArray(value)
      ? value.map((item, index) => [`${prefix}[${index}]`, item])
      : Object.keys(value).map((key) => [
        /^[A-Za-z_$][\w$]*$/.test(key) ? (prefix ? `${prefix}.${key}` : key) : `${prefix}[${JSON.stringify(key)}]`,
        value[key],
      ])

    if (entries.length === 0) out.push({ path: prefix, value: Array.isArray(value) ? '[]' : '{}' })

    entries.forEach(([path, inner]) => flatten(inner, path, out))

    return out
  }

  out.push({ path: prefix, value: value === undefined ? 'undefined' : JSON.stringify(value) })

  return out
}

/**
 * The request that came back most recently before a push, within a couple of seconds.
 * Most data layer pushes answer a response: a cart update, a section load.
 *
 * @param {number} at
 * @param {Array<{id: string, method: string, url: string, at?: number}>} requests
 * @returns {{id: string, label: string, gap: number}|null}
 */
export function requestBefore(at, requests) {
  const candidates = requests
    .filter((request) => typeof request.at === 'number' && request.at <= at && at - request.at <= REQUEST_WINDOW_MS)
    .sort((a, b) => b.at - a.at)

  if (candidates.length === 0) return null

  const request = candidates[0]

  return { id: request.id, label: `${request.method} ${request.url}`, gap: Math.round(at - request.at) }
}

/**
 * @typedef {object} Tag
 * @property {string} id GTM-XXXX, G-XXXX, AW-XXXX, or a vendor's own id
 * @property {string} vendor
 * @property {Array<string>} via where it was found
 * @property {number} loads how many times its script is on the page
 */

/** Script URLs that name a tag, and how to read the id out of each. */
const SCRIPT_TAGS = [
  { vendor: 'Google Tag Manager', host: /googletagmanager\.com\/gtm\.js/, id: /[?&]id=(GTM-[A-Z0-9]+)/i },
  { vendor: 'Google tag', host: /googletagmanager\.com\/gtag\/js/, id: /[?&]id=((?:G|AW|DC|GT)-[A-Z0-9]+)/i },
  { vendor: 'Meta pixel', host: /connect\.facebook\.net\/.*\/fbevents\.js/, id: null },
  { vendor: 'TikTok pixel', host: /analytics\.tiktok\.com/, id: /[?&]sdkid=([A-Z0-9]+)/i },
  { vendor: 'Microsoft Clarity', host: /clarity\.ms\/tag\/([a-z0-9]+)/i, id: /clarity\.ms\/tag\/([a-z0-9]+)/i },
  { vendor: 'Microsoft Ads (UET)', host: /bat\.bing\.com\/bat\.js/, id: null },
  { vendor: 'Hotjar', host: /static\.hotjar\.com\/c\/hotjar-(\d+)/, id: /hotjar-(\d+)/ },
  { vendor: 'LinkedIn Insight', host: /snap\.licdn\.com/, id: null },
  { vendor: 'Pinterest tag', host: /s\.pinimg\.com\/ct\/core\.js/, id: null },
]

/** Ids written in inline scripts: fbq('init', '123'), pintrk('load', '123'). */
const INLINE_IDS = [
  { vendor: 'Meta pixel', pattern: /fbq\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/g },
  { vendor: 'Pinterest tag', pattern: /pintrk\(\s*['"]load['"]\s*,\s*['"](\d+)['"]/g },
  { vendor: 'TikTok pixel', pattern: /ttq\.load\(\s*['"]([A-Z0-9]+)['"]/gi },
  { vendor: 'LinkedIn Insight', pattern: /_linkedin_partner_id\s*=\s*['"]?(\d+)/g },
]

/**
 * @param {string} id
 * @returns {string}
 */
function googleVendor(id) {
  if (/^GTM-/i.test(id)) return 'Google Tag Manager'
  if (/^G-/i.test(id)) return 'Google Analytics 4'
  if (/^AW-/i.test(id)) return 'Google Ads'
  if (/^DC-/i.test(id)) return 'Campaign Manager'

  return 'Google tag'
}

/**
 * The tags on the page, from three places: the script URLs, gtag('config') calls in the
 * data layer, and the ids Google's own runtime says it loaded.
 *
 * @param {Document} doc
 * @param {Array<RawPush>} pushes
 * @param {Array<string>} loaded the keys of window.google_tag_manager, [] when it is absent
 * @returns {{items: Array<Tag>, warnings: Array<string>}}
 */
export function tags(doc, pushes, loaded = []) {
  /** @type {Map<string, Tag>} */
  const found = new Map()
  const note = (vendor, id, via, load = false) => {
    const key = `${vendor}|${id}`
    const tag = found.get(key) || { id, vendor, via: [], loads: 0 }

    if (!tag.via.includes(via)) tag.via.push(via)
    if (load) tag.loads += 1

    found.set(key, tag)
  }

  Array.from(doc.querySelectorAll('script[src]')).forEach((script) => {
    const src = script.getAttribute('src') || ''

    SCRIPT_TAGS.forEach((rule) => {
      if (!rule.host.test(src)) return

      const match = rule.id ? rule.id.exec(src) : null
      // Google's ids are upper case wherever they are written; other vendors' are as given.
      const id = match ? (rule.vendor.startsWith('Google') ? match[1].toUpperCase() : match[1]) : ''

      note(rule.vendor === 'Google tag' && id ? googleVendor(id) : rule.vendor, id, 'script', true)
    })
  })

  Array.from(doc.querySelectorAll('script:not([src])')).forEach((script) => {
    const source = script.textContent || ''

    INLINE_IDS.forEach((rule) => {
      for (const match of source.matchAll(rule.pattern)) note(rule.vendor, match[1], 'inline script')
    })
  })

  const configured = new Map()

  pushes.forEach((push) => {
    if (!push.gtag || !Array.isArray(push.value) || push.value[0] !== 'config') return

    const id = String(push.value[1] || '').toUpperCase()

    if (!id) return

    configured.set(id, (configured.get(id) || 0) + 1)
    note(googleVendor(id), id, "gtag('config')")
  })

  loaded
    .filter((key) => /^(GTM|G|AW|DC|GT)-[A-Z0-9]+$/i.test(key))
    .forEach((key) => note(googleVendor(key.toUpperCase()), key.toUpperCase(), 'loaded by Google'))

  const items = Array.from(found.values())
  const warnings = []

  items.filter((tag) => tag.loads > 1).forEach((tag) => {
    warnings.push(`${[tag.vendor, tag.id].filter(Boolean).join(' ')} is loaded ${tag.loads} times.`)
  })

  configured.forEach((count, id) => {
    if (count > 1) warnings.push(`${id} is configured ${count} times, so its page view can be sent more than once.`)
  })

  const containers = items.filter((tag) => tag.vendor === 'Google Tag Manager' && tag.id)

  if (containers.length > 1) {
    warnings.push(`${containers.length} GTM containers (${containers.map((tag) => tag.id).join(', ')}). Check that they do not both send to the same GA4 property; the page cannot tell which property a container sends to.`)
  }

  const ga4 = items.filter((tag) => tag.vendor === 'Google Analytics 4')

  if (ga4.length > 0 && containers.length > 0 && ga4.some((tag) => tag.via.includes("gtag('config')"))) {
    warnings.push('GA4 is configured with gtag() on a page that also loads GTM. If the container has a GA4 tag for the same property, every hit is sent twice.')
  }

  return { items, warnings }
}

/**
 * @typedef {object} ConsentState
 * @property {Record<string, string>} defaults what consent('default') set, per key
 * @property {Record<string, string>} current after every update
 * @property {Array<{kind: string, index: number, values: object}>} calls
 * @property {Array<string>} warnings
 */

/**
 * Consent Mode state, replayed from the consent commands in the data layer.
 *
 * @param {Array<RawPush>} pushes
 * @returns {ConsentState}
 */
export function consent(pushes) {
  const defaults = {}
  const current = {}
  const calls = []

  pushes.forEach((push, index) => {
    const value = push.value

    if (!push.gtag || !Array.isArray(value) || value[0] !== 'consent') return

    const kind = String(value[1] || '')
    const values = value[2] && typeof value[2] === 'object' ? value[2] : {}

    calls.push({ kind, index, values })

    Object.keys(values).forEach((key) => {
      const setting = String(values[key])

      if (kind === 'default' && !(key in defaults)) defaults[key] = setting

      current[key] = setting
    })
  })

  const warnings = []
  const firstDefault = calls.find((call) => call.kind === 'default')
  const firstTag = pushes.findIndex((push) => firesATag(push))

  if (!firstDefault) {
    if (firstTag !== -1) warnings.push('No consent default is set. Google\'s tags run without Consent Mode.')
  } else {
    if (firstTag !== -1 && firstTag < firstDefault.index) {
      warnings.push('A tag fires before the consent default is set, so it runs with no consent state.')
    }

    CONSENT_KEYS.filter((key) => !(key in defaults)).forEach((key) => {
      warnings.push(`The consent default does not set ${key}${key.startsWith('ad_user') || key.startsWith('ad_pers') ? ', which Consent Mode v2 requires' : ''}.`)
    })
  }

  return { defaults, current, calls, warnings }
}

/**
 * The first push that makes a Google tag run: GTM starting, or a gtag config or event.
 *
 * @param {RawPush} push
 * @returns {boolean}
 */
function firesATag(push) {
  const value = push.value

  if (push.gtag && Array.isArray(value)) return value[0] === 'config' || value[0] === 'event'

  return Boolean(value && typeof value === 'object' && value.event === 'gtm.js')
}

/**
 * @typedef {object} Push what the panel shows for one push
 * @property {number} index
 * @property {string} page the path it was pushed on
 * @property {boolean} current pushed on this page rather than an earlier one
 * @property {string} kind
 * @property {string} name
 * @property {boolean} before
 * @property {number} at milliseconds since this page started
 * @property {{id: string, label: string, gap: number}|null} request
 * @property {Array<string>} problems
 * @property {string} json the cleaned value
 * @property {Array<{path: string, value: string}>} flat
 */

/**
 * One push, ready to show: checked against the raw copy, shown as the cleaned one.
 *
 * The event name and gtag command are kept as they are under every policy. They are the
 * page's vocabulary, like a key name, and without them the list says nothing at all.
 *
 * @param {Array<RawPush>} pushes
 * @param {number} index
 * @param {object} options
 * @param {string} options.policy
 * @param {string} options.page
 * @param {Array<object>} options.requests
 * @returns {Push}
 */
export function showPush(pushes, index, { policy, page, requests }) {
  const push = pushes[index]
  const { kind, name } = describePush(push)
  const shown = clean(push.value, policy)

  return {
    index,
    page,
    current: true,
    kind,
    name,
    before: Boolean(push.before),
    at: Math.round(push.at || 0),
    request: push.before ? null : requestBefore(push.at, requests),
    problems: ga4Problems(pushes, index),
    json: policy === POLICY_NONE ? '' : JSON.stringify(shown, null, 2),
    flat: policy === POLICY_NONE ? [] : flatten(shown),
  }
}

/**
 * Everything the section shows for this page.
 *
 * @param {object} input
 * @param {Array<RawPush>} input.pushes
 * @param {Array<object>} input.requests
 * @param {Document} input.doc
 * @param {Array<string>} [input.loaded]
 * @param {string} input.policy
 * @param {string} input.page
 * @param {boolean} input.present whether the page has a window.dataLayer at all
 * @returns {object}
 */
export function inspectDataLayer({ pushes, requests, doc, loaded = [], policy, page, present }) {
  const items = pushes.map((push, index) => showPush(pushes, index, { policy, page, requests }))
  const tagView = tags(doc, pushes, loaded)
  const consentView = consent(pushes)
  const ecommerce = items.filter((item) => item.problems.length > 0).length
  const counts = {
    pushes: ecommerce,
    tags: tagView.warnings.length,
    consent: consentView.warnings.length,
  }

  return {
    present,
    pushes: items,
    tags: { items: tagView.items.map((tag) => ({ ...tag, where: tag.via.join(', ') })), warnings: tagView.warnings },
    consent: {
      keys: CONSENT_KEYS.map((key) => ({
        key,
        default: consentView.defaults[key] || '',
        current: consentView.current[key] || '',
      })),
      calls: consentView.calls.map((call) => ({ kind: call.kind, index: call.index })),
      updates: consentView.calls.filter((call) => call.kind === 'update').length,
      warnings: consentView.warnings,
    },
    counts,
    warningCount: counts.pushes + counts.tags + counts.consent,
  }
}

/** @returns {object} */
export function emptyDataLayer() {
  return {
    present: false,
    pushes: [],
    tags: { items: [], warnings: [] },
    consent: { keys: CONSENT_KEYS.map((key) => ({ key, default: '', current: '' })), calls: [], updates: 0, warnings: [] },
    counts: { pushes: 0, tags: 0, consent: 0 },
    warningCount: 0,
  }
}

/**
 * The pushes of earlier pages in this tab, from sessionStorage. Only cleaned values are
 * ever written, and sessionStorage is gone when the tab closes.
 *
 * @param {Storage|null} storage
 * @returns {Array<Push>}
 */
export function readLog(storage) {
  try {
    const parsed = JSON.parse((storage && storage.getItem(LOG_KEY)) || '[]')

    return Array.isArray(parsed) ? parsed.map((entry) => ({ ...entry, current: false })) : []
  } catch {
    return []
  }
}

/**
 * Writes the earlier pages and this one back, oldest dropped first when it is too big.
 *
 * @param {Storage|null} storage
 * @param {Array<Push>} earlier
 * @param {Array<Push>} now
 * @param {string} policy
 */
export function writeLog(storage, earlier, now, policy) {
  if (!storage) return

  try {
    if (policy === POLICY_NONE) {
      storage.removeItem(LOG_KEY)

      return
    }

    let entries = [...earlier, ...now].slice(-LOG_MAX_ENTRIES).map((entry) => ({ ...entry, current: false }))
    let text = JSON.stringify(entries)

    while (text.length > LOG_MAX_CHARS && entries.length > 0) {
      entries = entries.slice(Math.ceil(entries.length / 4))
      text = JSON.stringify(entries)
    }

    storage.setItem(LOG_KEY, text)
  } catch {
    // A full or blocked sessionStorage costs the history, never the page.
  }
}
