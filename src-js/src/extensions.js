/**
 * Sections another module adds to the bar, as plain functions.
 *
 * The server lists them on the host element and serves each one's view with the profile.
 * The module may also register a reader that draws from the live page. Both describe the
 * panel as blocks, and this file turns whatever arrived into the one shape the bar's
 * generic panel draws. Another module never hands the bar markup: every value ends up as
 * text, and the only HTML is what the highlighter makes of a code block.
 *
 * Whatever it is given, it returns something drawable. A module that sends a block this
 * version does not know gets a note saying so, rather than a panel that silently lacks it.
 */

const ID_PATTERN = /^[a-z][a-z0-9_]{0,31}$/

/** @type {Array<string>} */
const TONES = ['ok', 'warn', 'bad']

/** @type {Array<string>} the grammars highlight.js is built with */
const LANGUAGES = ['javascript', 'json', 'sql']

/** A table longer than this is cut, and says so. The bar is not a spreadsheet. */
export const MAX_ROWS = 500

/**
 * @typedef {object} Definition
 * @property {string} id
 * @property {string} label
 * @property {string} lead
 * @property {boolean} graded
 */

/**
 * @typedef {object} Cell
 * @property {string} text
 * @property {string} tone ok, warn, bad or empty
 */

/**
 * @typedef {object} Row
 * @property {Array<Cell>} cells one per column, in column order
 * @property {string} tone
 * @property {string} target what the module's reader is asked to outline on hover, or empty
 */

/**
 * @typedef {object} Block
 * @property {string} type facts, table, code, note, heading or list
 * @property {string} [text]
 * @property {string} [tone]
 * @property {string} [language]
 * @property {Array<{label: string, value: string, tone: string, mono: boolean}>} [items]
 * @property {Array<{key: string, label: string, num: boolean, mono: boolean}>} [columns]
 * @property {Array<Row>} [rows]
 * @property {string} [empty]
 * @property {number} [cut] rows left out past MAX_ROWS
 */

/**
 * @typedef {object} Tab
 * @property {string} id
 * @property {string} label
 * @property {string} count shown as a pill, or empty
 * @property {Array<Block>} blocks
 */

/**
 * @typedef {object} View
 * @property {Array<Tab>} tabs always at least one
 * @property {number|null} count the sidebar badge, when the view sets one
 */

/**
 * The host element's data-extensions attribute, as the server wrote it.
 *
 * @param {string|undefined} json
 * @param {Array<string>} taken the bar's own section ids, which a module may not reuse
 * @returns {Array<Definition>}
 */
export function readDefinitions(json, taken = []) {
  let parsed

  try {
    parsed = JSON.parse(json || '[]')
  } catch {
    return []
  }

  if (!Array.isArray(parsed)) return []

  const seen = new Set(taken)

  return parsed.filter((entry) => {
    if (!entry || typeof entry.id !== 'string' || !ID_PATTERN.test(entry.id) || seen.has(entry.id)) return false

    seen.add(entry.id)

    return true
  }).map((entry) => ({
    id: entry.id,
    label: text(entry.label) || entry.id,
    lead: text(entry.lead),
    graded: entry.graded === true,
  }))
}

/**
 * @param {unknown} raw a view as the server or a reader produced it
 * @returns {View}
 */
export function normalizeView(raw) {
  const view = raw && typeof raw === 'object' ? raw : {}
  const tabs = Array.isArray(view.tabs) && view.tabs.length > 0
    ? view.tabs.map((tab, index) => normalizeTab(tab, index))
    : [{ id: 'main', label: '', count: '', blocks: normalizeBlocks(view.blocks) }]

  return { tabs, count: positive(view.count) }
}

/**
 * The server's view first, then the live one. A tab both name is one tab, with the
 * server's blocks above the live ones, so a section can show what was recorded and what
 * the page holds now side by side.
 *
 * @param {View|null} server
 * @param {View|null} live
 * @returns {View}
 */
export function mergeViews(server, live) {
  if (!server && !live) return normalizeView(null)
  if (!server) return live
  if (!live) return server

  const tabs = server.tabs.map((tab) => ({ ...tab, blocks: [...tab.blocks] }))

  live.tabs.forEach((tab) => {
    const same = tabs.find((existing) => existing.id === tab.id)

    if (same) {
      same.blocks.push(...tab.blocks)
      same.count = tab.count || same.count
    } else {
      tabs.push(tab)
    }
  })

  // The implicit tab only exists so every view has one. Once there are named tabs it is
  // an unnamed button in the row, so its blocks go on top of the first named tab instead.
  const unnamed = tabs.find((tab) => tab.id === 'main' && tab.label === '')
  const named = tabs.filter((tab) => tab !== unnamed)

  if (unnamed && named.length > 0) {
    named[0] = { ...named[0], blocks: [...unnamed.blocks, ...named[0].blocks] }

    return { tabs: named, count: live.count ?? server.count }
  }

  return { tabs, count: live.count ?? server.count }
}

/**
 * The sidebar badge for a section the bar knows nothing about: its summary's `count`.
 *
 * @param {object} summary
 * @returns {number|null}
 */
export function countFromSummary(summary) {
  return positive(summary && summary.count)
}

/**
 * @param {unknown} tab
 * @param {number} index
 * @returns {Tab}
 */
function normalizeTab(tab, index) {
  const source = tab && typeof tab === 'object' ? tab : {}

  return {
    id: text(source.id) || `tab${index}`,
    label: text(source.label) || text(source.id) || `Tab ${index + 1}`,
    count: source.count === undefined || source.count === null ? '' : text(source.count),
    blocks: normalizeBlocks(source.blocks),
  }
}

/**
 * @param {unknown} blocks
 * @returns {Array<Block>}
 */
function normalizeBlocks(blocks) {
  return Array.isArray(blocks) ? blocks.map(normalizeBlock) : []
}

/**
 * @param {unknown} raw
 * @returns {Block}
 */
export function normalizeBlock(raw) {
  const block = raw && typeof raw === 'object' ? raw : {}

  switch (block.type) {
    case 'heading':
      return { type: 'heading', text: text(block.text) }
    case 'note':
      return { type: 'note', text: text(block.text), tone: tone(block.tone) }
    case 'list':
      return { type: 'list', items: (Array.isArray(block.items) ? block.items : []).map(text) }
    case 'facts':
      return {
        type: 'facts',
        items: (Array.isArray(block.items) ? block.items : []).map((item) => ({
          label: text(item && item.label),
          value: text(item && item.value),
          tone: tone(item && item.tone),
          mono: Boolean(item && item.mono),
        })),
      }
    case 'code':
      return {
        type: 'code',
        language: LANGUAGES.includes(block.language) ? block.language : '',
        text: text(block.text),
      }
    case 'json':
      return { type: 'code', language: 'json', text: pretty(block.value) }
    case 'table':
      return table(block)
    default:
      return {
        type: 'note',
        tone: 'warn',
        text: `This section sent a "${text(block.type) || 'untyped'}" block, which this version of the bar does not draw.`,
      }
  }
}

/**
 * Rows may be objects keyed by column or arrays in column order; either way each cell
 * becomes text, with a tone when the module gave the cell as `{text, tone}`.
 *
 * @param {object} block
 * @returns {Block}
 */
function table(block) {
  const columns = (Array.isArray(block.columns) ? block.columns : [])
    .map((column, index) => {
      const source = typeof column === 'string' ? { key: column, label: column } : (column || {})
      const key = text(source.key) || String(index)

      return {
        key,
        label: text(source.label) || key,
        num: Boolean(source.num),
        mono: Boolean(source.mono),
      }
    })
  const all = Array.isArray(block.rows) ? block.rows : []

  const rows = all.slice(0, MAX_ROWS).map((row) => {
    const source = row && typeof row === 'object' ? row : {}

    return {
      cells: columns.map((column, index) => cell(Array.isArray(source) ? source[index] : source[column.key])),
      tone: Array.isArray(source) ? '' : tone(source._tone),
      target: Array.isArray(source) ? '' : text(source._target),
    }
  })

  return {
    type: 'table',
    columns,
    rows,
    empty: text(block.empty) || 'Nothing to show.',
    cut: Math.max(0, all.length - MAX_ROWS),
  }
}

/**
 * @param {unknown} value
 * @returns {Cell}
 */
function cell(value) {
  if (value && typeof value === 'object' && !Array.isArray(value) && 'text' in value) {
    return { text: text(value.text), tone: tone(value.tone) }
  }

  return { text: text(value), tone: '' }
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function text(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)

  return pretty(value, 0)
}

/**
 * @param {unknown} value
 * @param {number} indent
 * @returns {string}
 */
function pretty(value, indent = 2) {
  try {
    return JSON.stringify(value, null, indent) ?? String(value)
  } catch {
    // Circular, or a BigInt. Saying what it was beats showing nothing.
    return String(value)
  }
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function tone(value) {
  return TONES.includes(value) ? value : ''
}

/**
 * @param {unknown} value
 * @returns {number|null}
 */
function positive(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : null
}
