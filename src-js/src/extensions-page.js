/**
 * The readers other modules register for their sections, and the bar's hold on them.
 *
 * A reader is registered from the module's own script, through the watcher early.js
 * installs, so it does not matter whether that script runs before the bar or after it:
 *
 *     window.__siteationDebugBar.registerSection({
 *       id: 'c365',
 *       read(context) { return { blocks: [...] } },
 *       watch(refresh) { window.addEventListener('update-prices', refresh) },
 *       highlight(target, on) { ... },
 *     })
 *
 * Readers are kept here rather than in the component, so Alpine never wraps another
 * module's objects in its reactive proxies.
 */
import { normalizeView } from './extensions.js'

/**
 * @typedef {object} Reader
 * @property {string} id the section it draws, as its di.xml names it
 * @property {(context: object) => (object|Promise<object>)} read returns a view
 * @property {(refresh: () => void) => void} [watch] called once; call refresh when the page changes
 * @property {(target: string, on: boolean) => void} [highlight] outlines what a table row points at
 */

/** @type {Map<string, Reader>} */
const readers = new Map()

/** @type {Map<string, number>} */
const reads = new Map()

/** @type {Set<string>} */
const watched = new Set()

/**
 * Takes every reader registered before the bar booted and stays subscribed for the rest.
 *
 * @param {(id: string) => void} onSection
 * @returns {Array<string>} the ids registered so far
 */
export function watchSections(onSection) {
  const state = window.__siteationDebugBar

  if (!state) return []

  ;(state.sections || []).forEach((reader) => readers.set(reader.id, reader))

  state.onSection = (reader) => {
    readers.set(reader.id, reader)
    onSection(reader.id)
  }

  return Array.from(readers.keys())
}

/**
 * @param {string} id
 * @returns {boolean}
 */
export function hasReader(id) {
  return readers.has(id)
}

/**
 * Starts the reader's own watch, once, whatever the bar asks for after.
 *
 * @param {string} id
 * @param {() => void} refresh
 */
export function watchSection(id, refresh) {
  const reader = readers.get(id)

  if (!reader || typeof reader.watch !== 'function' || watched.has(id)) return

  watched.add(id)

  try {
    reader.watch(refresh)
  } catch (error) {
    console.warn(`Siteation_DebugBar: the ${id} section could not watch the page.`, error)
  }
}

/**
 * Reads the section and normalises what came back.
 *
 * Resolves to null when a newer read of the same section started meanwhile, so a slow
 * read cannot overwrite a fresher one when it finally lands.
 *
 * @param {string} id
 * @param {object} context
 * @returns {Promise<import('./extensions.js').View|null>}
 * @throws {Error} whatever the reader threw, for the panel to show
 */
export async function readSection(id, context) {
  const reader = readers.get(id)

  if (!reader) return null

  const token = (reads.get(id) || 0) + 1

  reads.set(id, token)

  const view = await reader.read(context)

  return reads.get(id) === token ? normalizeView(view) : null
}

/**
 * @param {string} id
 * @param {string} target
 * @param {boolean} on
 */
export function highlightTarget(id, target, on) {
  const reader = readers.get(id)

  if (!reader || typeof reader.highlight !== 'function' || !target) return

  try {
    reader.highlight(target, on)
  } catch {
    // An outline that fails is an outline not drawn, never a broken bar.
  }
}
