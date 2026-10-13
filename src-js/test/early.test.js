/**
 * The data layer hook in early.js, run as the browser runs it: as a classic script against
 * a global object, before and after the page's own scripts.
 *
 * The cases are the ways real tags treat dataLayer.push. GTM and gtag.js both assign their
 * own push when they load, and call the one they found from inside it, which is the case
 * that loops or records twice when a wrapper is naive.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'

const SOURCE = readFileSync(new URL('../src/early.js', import.meta.url), 'utf8')

/**
 * A fresh page: a global with what early.js touches, then early.js, then whatever the
 * page's own scripts do.
 *
 * @param {string} [before] a script that runs before early.js
 * @returns {{run: (code: string) => unknown, pushes: () => Array<object>}}
 */
function browser(before = '') {
  let now = 0
  const context = {
    console: { warn() {} },
    performance: { now: () => (now += 1) },
    XMLHttpRequest: class { open() {} send() {} },
    addEventListener() {},
  }

  context.window = context
  vm.createContext(context)

  if (before) vm.runInContext(before, context)

  vm.runInContext(SOURCE, context)

  return {
    run: (code) => vm.runInContext(code, context),
    // Through JSON, so the copies are compared as plain values from this realm.
    pushes: () => JSON.parse(JSON.stringify(context.__siteationDebugBar.pushes)),
  }
}

test('a push on a page with no data layer yet is recorded once it is created', () => {
  const page = browser()

  page.run("window.dataLayer = window.dataLayer || []; dataLayer.push({event: 'view_item'})")

  assert.deepEqual(page.pushes().map((push) => [push.value.event, push.before, push.gtag]), [['view_item', false, false]])
  assert.equal(page.run('dataLayer.length'), 1)
})

test('what was pushed before the hook is history, and later pushes are not', () => {
  const page = browser("window.dataLayer = [{event: 'gtm.js'}, {pageType: 'product'}]")

  page.run("dataLayer.push({event: 'add_to_cart'})")

  assert.deepEqual(page.pushes().map((push) => [push.value.event ?? push.value.pageType, push.before]), [
    ['gtm.js', true],
    ['product', true],
    ['add_to_cart', false],
  ])
})

test('a push replaced the way GTM does it is recorded once, reaches both, and does not loop', () => {
  const page = browser()

  page.run(`
    window.dataLayer = window.dataLayer || []
    window.seen = []
    const found = dataLayer.push
    dataLayer.push = function () {
      const length = found.apply(dataLayer, arguments)
      for (const item of arguments) seen.push(item.event)
      return length
    }
  `)

  const length = page.run("dataLayer.push({event: 'purchase'})")

  assert.equal(length, 1, 'push still returns the new length')
  assert.equal(page.run('dataLayer.length'), 1, 'the item went into the array once')
  assert.deepEqual(JSON.parse(page.run('JSON.stringify(seen)')), ['purchase'], 'the tag\'s own push still ran')
  assert.deepEqual(page.pushes().map((push) => push.value.event), ['purchase'])
})

test('a push replaced before the hook arrived keeps working, behind the recorder', () => {
  const page = browser(`
    window.dataLayer = []
    window.seen = 0
    const found = dataLayer.push
    dataLayer.push = function () { seen += 1; return found.apply(dataLayer, arguments) }
  `)

  page.run("dataLayer.push({event: 'view_cart'})")

  assert.equal(page.run('seen'), 1)
  assert.equal(page.run('dataLayer.length'), 1)
  assert.deepEqual(page.pushes().map((push) => push.value.event), ['view_cart'])
})

test('gtag() pushes its arguments, and that is recorded as a gtag command', () => {
  const page = browser()

  page.run(`
    window.dataLayer = window.dataLayer || []
    function gtag() { dataLayer.push(arguments) }
    gtag('consent', 'default', {ad_storage: 'denied'})
    gtag('config', 'G-ABC123')
  `)

  assert.deepEqual(page.pushes().map((push) => [push.gtag, push.value]), [
    [true, ['consent', 'default', { ad_storage: 'denied' }]],
    [true, ['config', 'G-ABC123']],
  ])
})

test('a pushed object changed afterwards is recorded as it was when pushed', () => {
  const page = browser()

  page.run(`
    window.dataLayer = []
    const data = {event: 'view_item', ecommerce: {items: [{item_id: 'A'}]}}
    dataLayer.push(data)
    data.ecommerce.items[0].item_id = 'B'
  `)

  assert.equal(page.pushes()[0].value.ecommerce.items[0].item_id, 'A')
})

test('a replaced data layer is watched too, and its contents are history', () => {
  const page = browser("window.dataLayer = [{a: 1}]")

  page.run("window.dataLayer = [{b: 2}]; dataLayer.push({c: 3})")

  assert.deepEqual(page.pushes().map((push) => [Object.keys(push.value)[0], push.before]), [
    ['a', true],
    ['b', true],
    ['c', false],
  ])
})

test('a date is recorded as its time, the way gtag(\'js\', new Date()) sends it', () => {
  const page = browser()

  page.run("window.dataLayer = []; function gtag() { dataLayer.push(arguments) }; gtag('js', new Date(Date.UTC(2026, 9, 13)))")

  assert.deepEqual(page.pushes()[0].value, ['js', '2026-10-13T00:00:00.000Z'])
})

test('functions and circular values are labelled, not followed', () => {
  const page = browser()

  page.run(`
    window.dataLayer = []
    const loop = {event: 'x', eventCallback: function () {}}
    loop.self = loop
    dataLayer.push(loop)
  `)

  assert.deepEqual(page.pushes()[0].value, { event: 'x', eventCallback: '[function]', self: '[circular]' })
})

test('the buffer keeps the most recent pushes', () => {
  const page = browser()

  page.run('window.dataLayer = []; for (let i = 0; i < 310; i++) dataLayer.push({i})')

  const pushes = page.pushes()

  assert.equal(pushes.length, 300)
  assert.equal(pushes[0].value.i, 10)
  assert.equal(page.run('dataLayer.length'), 310, 'the page keeps everything; only the copy is bounded')
})
