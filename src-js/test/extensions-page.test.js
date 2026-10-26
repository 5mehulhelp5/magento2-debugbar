/**
 * The bar's hold on the readers other modules register: one watch each, no stale reads,
 * and nothing a reader throws reaching further than its own panel.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'

const state = { sections: [], onSection: null }

globalThis.window = { __siteationDebugBar: state }

const { hasReader, highlightTarget, readSection, watchSection, watchSections } = await import('../src/extensions-page.js')

test('readers registered before the bar are taken, and later ones are handed over', () => {
  state.sections.push({ id: 'early', read: () => ({}) })

  const handed = []
  const ids = watchSections((id) => handed.push(id))

  state.onSection({ id: 'late', read: () => ({}) })

  assert.deepEqual(ids, ['early'])
  assert.deepEqual(handed, ['late'])
  assert.ok(hasReader('early'))
  assert.ok(hasReader('late'))
  assert.ok(!hasReader('never'))
})

test('a read is normalised, and one overtaken by a newer read resolves to null', async () => {
  let release
  const slow = new Promise((resolve) => { release = resolve })
  let calls = 0

  state.onSection({
    id: 'slow',
    read: () => (++calls === 1 ? slow : { blocks: [{ type: 'heading', text: 'fresh' }] }),
  })

  const first = readSection('slow', {})
  const second = await readSection('slow', {})

  release({ blocks: [{ type: 'heading', text: 'stale' }] })

  assert.equal(await first, null)
  assert.equal(second.tabs[0].blocks[0].text, 'fresh')
})

test('what a reader throws reaches the caller, so the panel can show it', async () => {
  state.onSection({ id: 'broken', read: () => { throw new Error('no price boxes') } })

  await assert.rejects(readSection('broken', {}), /no price boxes/)
})

test('a reader is watched once however often the bar asks', () => {
  let watches = 0

  state.onSection({ id: 'watched', read: () => ({}), watch: () => { watches += 1 } })

  watchSection('watched', () => {})
  watchSection('watched', () => {})

  assert.equal(watches, 1)
})

test('a highlight that throws, or a row with no target, never reaches the bar', () => {
  const calls = []

  state.onSection({ id: 'outlined', read: () => ({}), highlight: (target, on) => { calls.push([target, on]); throw new Error('gone') } })

  assert.doesNotThrow(() => highlightTarget('outlined', 'p1', true))
  highlightTarget('outlined', '', true)
  highlightTarget('unknown', 'p1', true)

  assert.deepEqual(calls, [['p1', true]])
})
