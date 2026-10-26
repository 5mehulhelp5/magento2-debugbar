/**
 * Sections other modules add: what the bar accepts from them, and what it makes of it.
 *
 * The promise under test is that nothing another module sends can break the panel or
 * reach it as markup. Every case here is something a module could plausibly get wrong.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  MAX_ROWS,
  countFromSummary,
  mergeViews,
  normalizeBlock,
  normalizeView,
  readDefinitions,
} from '../src/extensions.js'
import { enabledSections } from '../src/sections.js'

test('definitions are read from the attribute, and anything unusable is left out', () => {
  const json = JSON.stringify([
    { id: 'c365', label: 'Commerce365', lead: 'Prices', graded: true },
    { id: 'c365', label: 'A second one under the same id' },
    { id: 'queries', label: 'Taken by the bar' },
    { id: 'Bad-Id', label: 'Not an id' },
    { label: 'No id at all' },
    { id: 'bare' },
  ])

  assert.deepEqual(readDefinitions(json, ['queries']), [
    { id: 'c365', label: 'Commerce365', lead: 'Prices', graded: true },
    { id: 'bare', label: 'bare', lead: '', graded: false },
  ])
})

test('an attribute that is missing or not JSON means no sections, not a broken bar', () => {
  assert.deepEqual(readDefinitions(undefined), [])
  assert.deepEqual(readDefinitions('{not json'), [])
  assert.deepEqual(readDefinitions('{"id": "c365"}'), [])
})

test('a view of plain blocks becomes one unnamed tab', () => {
  const view = normalizeView({ blocks: [{ type: 'heading', text: 'Calls' }], count: 4 })

  assert.equal(view.tabs.length, 1)
  assert.equal(view.tabs[0].label, '')
  assert.deepEqual(view.tabs[0].blocks, [{ type: 'heading', text: 'Calls' }])
  assert.equal(view.count, 4)
})

test('tabs keep their order, and a tab without an id or label still gets both', () => {
  const view = normalizeView({ tabs: [{ id: 'prices', label: 'Prices', count: 3, blocks: [] }, { blocks: [] }] })

  assert.deepEqual(view.tabs.map((tab) => [tab.id, tab.label, tab.count]), [
    ['prices', 'Prices', '3'],
    ['tab1', 'Tab 2', ''],
  ])
})

test('nothing usable is still a view with one empty tab', () => {
  for (const raw of [null, undefined, 'text', 42, [], { tabs: [] }]) {
    const view = normalizeView(raw)

    assert.equal(view.tabs.length, 1)
    assert.deepEqual(view.tabs[0].blocks, [])
    assert.equal(view.count, null)
  }
})

test('a count that is not a positive number is no badge', () => {
  for (const count of [0, -1, '3', NaN, Infinity, null]) {
    assert.equal(normalizeView({ count }).count, null, String(count))
  }

  assert.equal(countFromSummary({ count: 2 }), 2)
  assert.equal(countFromSummary({}), null)
  assert.equal(countFromSummary(undefined), null)
})

test('every value reaches the panel as text, markup included', () => {
  const block = normalizeBlock({
    type: 'facts',
    items: [
      { label: 'Price', value: 12.4 },
      { label: 'Markup', value: '<img src=x onerror=alert(1)>' },
      { label: 'Object', value: { a: 1 }, tone: 'loud', mono: 1 },
    ],
  })

  assert.deepEqual(block.items, [
    { label: 'Price', value: '12.4', tone: '', mono: false },
    { label: 'Markup', value: '<img src=x onerror=alert(1)>', tone: '', mono: false },
    { label: 'Object', value: '{"a":1}', tone: '', mono: true },
  ])
})

test('json becomes a highlighted code block, and a value JSON cannot hold is still shown', () => {
  assert.deepEqual(normalizeBlock({ type: 'json', value: { a: [1] } }), {
    type: 'code',
    language: 'json',
    text: '{\n  "a": [\n    1\n  ]\n}',
  })

  const circular = {}
  circular.self = circular

  assert.equal(normalizeBlock({ type: 'json', value: circular }).text, '[object Object]')
})

test('a code block in a language the bar has no grammar for is drawn plain', () => {
  assert.equal(normalizeBlock({ type: 'code', language: 'php', text: '<?php' }).language, '')
  assert.equal(normalizeBlock({ type: 'code', language: 'sql', text: 'SELECT 1' }).language, 'sql')
})

test('a table takes rows keyed by column or in column order, with tones and targets', () => {
  const block = normalizeBlock({
    type: 'table',
    columns: ['sku', { key: 'price', label: 'Price', num: true }],
    rows: [
      { sku: 'A', price: { text: 12, tone: 'ok' }, _tone: 'warn', _target: 'p1' },
      ['B', 9],
      null,
    ],
  })

  assert.deepEqual(block.columns, [
    { key: 'sku', label: 'sku', num: false, mono: false },
    { key: 'price', label: 'Price', num: true, mono: false },
  ])
  assert.deepEqual(block.rows, [
    { cells: [{ text: 'A', tone: '' }, { text: '12', tone: 'ok' }], tone: 'warn', target: 'p1' },
    { cells: [{ text: 'B', tone: '' }, { text: '9', tone: '' }], tone: '', target: '' },
    { cells: [{ text: '', tone: '' }, { text: '', tone: '' }], tone: '', target: '' },
  ])
  assert.equal(block.empty, 'Nothing to show.')
  assert.equal(block.cut, 0)
})

test('a table past the row limit is cut and says by how much', () => {
  const rows = Array.from({ length: MAX_ROWS + 7 }, (_, index) => ({ n: index }))
  const block = normalizeBlock({ type: 'table', columns: ['n'], rows })

  assert.equal(block.rows.length, MAX_ROWS)
  assert.equal(block.cut, 7)
})

test('a block type this version does not know is a note saying so', () => {
  const block = normalizeBlock({ type: 'sparkline', points: [1, 2] })

  assert.equal(block.type, 'note')
  assert.equal(block.tone, 'warn')
  assert.match(block.text, /"sparkline"/)
  assert.match(normalizeBlock(null).text, /"untyped"/)
})

test('server and live views merge tab by tab, server blocks first', () => {
  const server = normalizeView({ tabs: [{ id: 'prices', label: 'Prices', blocks: [{ type: 'heading', text: 'Recorded' }] }], count: 3 })
  const live = normalizeView({
    tabs: [
      { id: 'prices', label: 'Prices', blocks: [{ type: 'heading', text: 'On the page' }] },
      { id: 'events', label: 'Events', blocks: [] },
    ],
    count: 5,
  })

  const view = mergeViews(server, live)

  assert.deepEqual(view.tabs.map((tab) => tab.id), ['prices', 'events'])
  assert.deepEqual(view.tabs[0].blocks.map((block) => block.text), ['Recorded', 'On the page'])
  assert.equal(view.count, 5, 'the live count is the newer one')
  assert.equal(server.tabs[0].blocks.length, 1, 'the server view itself is left alone')
})

test('an unnamed tab beside named ones is folded into the first, not drawn as a blank button', () => {
  const server = normalizeView({ blocks: [{ type: 'note', text: 'From the server' }], count: 2 })
  const live = normalizeView({ tabs: [{ id: 'page', label: 'Page', blocks: [{ type: 'note', text: 'Live' }] }] })

  const view = mergeViews(server, live)

  assert.deepEqual(view.tabs.map((tab) => tab.label), ['Page'])
  assert.deepEqual(view.tabs[0].blocks.map((block) => block.text), ['From the server', 'Live'])
  assert.equal(view.count, 2, 'no live count, so the server one stands')
})

test('either half alone is the view, and neither is an empty one', () => {
  const only = normalizeView({ blocks: [] })

  assert.equal(mergeViews(only, null), only)
  assert.equal(mergeViews(null, only), only)
  assert.equal(mergeViews(null, null).tabs.length, 1)
})

test('contributed sections are listed before History, and switched off like the bar\'s own', () => {
  const extra = [{ id: 'c365', label: 'Commerce365', lead: '' }]
  const all = enabledSections('', extra).map((section) => section.id)

  assert.deepEqual(all.slice(-2), ['c365', 'history'])
  assert.deepEqual(enabledSections('queries', extra).map((section) => section.id), ['findings', 'overview', 'queries'])
  assert.deepEqual(enabledSections('c365', extra).map((section) => section.id), ['findings', 'overview', 'c365'])
})
