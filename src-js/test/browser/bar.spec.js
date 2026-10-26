/**
 * The bar, in a browser, against a running store.
 *
 * Every bug found in the interface so far has been of one kind: a binding that throws, an
 * element that renders empty, a control that does nothing. None of them is a wrong answer,
 * so none of them is catchable by a unit test, and all of them are silent unless somebody
 * has the console open. This walks the bar and asks it whether anything threw.
 *
 * The bar answers that itself: early.js watches console.warn for every Alpine on the page,
 * including its own, and the Health tab lists what it caught. That buffer is the assertion.
 *
 * Needs the store at NDB_BASE_URL with the bar enabled. Run with `npm run test:browser`.
 */
import { expect, test } from '@playwright/test'

/** Never full page cached, and it produces queries with call sites. */
const PAGE = '/checkout/cart/'

/**
 * The bar's Alpine component, so a test can read what the panel is showing rather than
 * guessing from the DOM. Its markup lives in a shadow root; Playwright's locators pierce
 * that, but state does not.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(state: object) => unknown} read
 * @returns {Promise<unknown>}
 */
function state(page, read) {
  return page.evaluate(
    (source) => {
      const root = document.querySelector('siteation-debugbar')?.shadowRoot?.querySelector('.ndb')

      // eslint-disable-next-line no-new-func
      return new Function(`return (${source})`)()(root._x_dataStack[0])
    },
    read.toString()
  )
}

/**
 * Waits for the component to satisfy a condition, rather than for a length of time.
 *
 * Selecting a section starts work: history fetches itself, the Alpine section re-reads the
 * page. A test that asks the next question immediately gets the answer from before.
 *
 * Polled from here, one `state` call at a time, rather than with page.waitForFunction. That
 * runs its later checks from the page's own frames, where a store that enforces its CSP
 * refuses the `new Function` the check is built with. The first check ran inside
 * Playwright's evaluate and was allowed, so the helper only failed when it had to wait.
 *
 * @param {import('@playwright/test').Page} page
 * @param {(state: object) => boolean} until
 * @returns {Promise<void>}
 */
async function waitForState(page, until) {
  await expect.poll(async () => Boolean(await state(page, until))).toBe(true)
}

/**
 * What the bar's own error capture collected.
 *
 * The buffer's absence is asserted, not tolerated. `?? []` would turn every "nothing threw"
 * assertion in this file into one that passes when early.js failed to load, when the global
 * is renamed, or when the bar is not on the page at all: the suite would be green precisely
 * when it should be loudest.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<Array<object>>}
 */
async function alpineErrors(page) {
  const collected = await page.evaluate(() => {
    const buffer = window.__siteationDebugBar

    return buffer && Array.isArray(buffer.alpineErrors) ? buffer.alpineErrors : null
  })

  expect(collected, 'the error buffer is gone, so an empty one proves nothing').not.toBeNull()

  return collected
}

/**
 * Closes the inspector and waits for the dock to stand still.
 *
 * x-show reveals the dock on a timer and the bar clamps it on the frame after, so a box
 * read straight after closing is either null or a dock still on its way to its place.
 *
 * @param {import('@playwright/test').Page} page
 */
async function closeToDock(page) {
  await state(page, (data) => { data.closeInspector() })
  await expect(page.locator('.ndb-dock')).toBeVisible()
  await page.waitForFunction(() => new Promise((resolve) => {
    const dock = document.querySelector('siteation-debugbar').shadowRoot.querySelector('.ndb-dock')
    const first = JSON.stringify(dock.getBoundingClientRect())

    requestAnimationFrame(() => requestAnimationFrame(() => {
      resolve(first === JSON.stringify(dock.getBoundingClientRect()))
    }))
  }))
}

/**
 * @param {import('@playwright/test').Page} page
 */
async function openBar(page, path = PAGE) {
  await page.goto(path)
  await page.waitForFunction(
    () => document.querySelector('siteation-debugbar')?.shadowRoot?.querySelector('.ndb')
      ?._x_dataStack !== undefined
  )
  await page.evaluate(() => {
    const bar = document.querySelector('siteation-debugbar').shadowRoot.querySelector('.ndb')
    const data = bar._x_dataStack[0]

    data.openInspector()
    data.maximised = true
  })
  await expect(page.locator('.ndb-sheet')).toBeVisible()
}

/**
 * Serves every HTML document with a policy that forbids unsafe-eval.
 *
 * The store's own policy is report-only on most pages, so the violations the bar used to
 * commit were reported and never blocked. Hyvä Checkout enforces, and the bar was dead
 * there: no values, no controls, a console full of EvalError, and nothing in any suite
 * went red. Injecting the header here means the guarantee does not depend on which
 * modules a test store happens to have installed.
 *
 * @param {import('@playwright/test').Page} page
 */
/**
 * Only the bar's own expression errors.
 *
 * The buffer watches every Alpine on the page, which is what the Alpine panel is for. Under
 * an enforced policy the theme's standard-build Alpine fails on everything, so a test asking
 * whether the bar is healthy has to say whose errors it means.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<Array<object>>}
 */
async function ourAlpineErrors(page) {
  return (await alpineErrors(page)).filter((entry) => entry.own)
}

async function enforceCspWithoutEval(page) {
  await page.route('**/*', async (route) => {
    const response = await route.fetch()
    const headers = { ...response.headers() }

    if ((headers['content-type'] || '').includes('text/html')) {
      headers['content-security-policy'] =
        "default-src * data: blob: 'unsafe-inline'; script-src * data: blob: 'unsafe-inline'"
    }

    await route.fulfill({ response, headers })
  })
}

test.describe('under a policy that forbids unsafe-eval', () => {
  test('every section renders, and nothing evaluates a string', async ({ page }) => {
    await enforceCspWithoutEval(page)
    await openBar(page)

    const sections = await state(page, (data) => data.sections.map((section) => section.id))

    for (const section of sections) {
      await page.evaluate((id) => {
        document.querySelector('siteation-debugbar').shadowRoot
          .querySelector('.ndb')._x_dataStack[0].section = id
      }, section)

      await expect(page.locator('.ndb-section-head h2')).not.toBeEmpty()

      const errors = await ourAlpineErrors(page)

      expect(errors, `${section} threw under CSP: ${JSON.stringify(errors)}`).toEqual([])
    }

    await page.unrouteAll({ behavior: 'ignoreErrors' })
  })

  test('highlighted SQL still reaches the panel', async ({ page }) => {
    // x-html is banned outright by the CSP build, so the bar carries its own directive.
    // Losing it would empty every code block without throwing anything.
    await enforceCspWithoutEval(page)
    await openBar(page)
    await state(page, (data) => { data.section = 'queries' })

    await expect(page.locator('.ndb-query-sql .hljs-keyword').first()).toBeVisible()
    expect(await ourAlpineErrors(page)).toEqual([])

    // The store keeps fetching after the assertions pass, and a route handler that outlives
    // the test fails it on the way out.
    await page.unrouteAll({ behavior: 'ignoreErrors' })
  })
})

test.describe('the bar', () => {
  // First in the file on purpose. Every correctness assertion below reduces to
  // "alpineErrors is empty", and that buffer is filled by one string match on console.warn
  // inside early.js. An Alpine that reports through console.error, or prefixes its warning
  // with anything other than "Alpine", turns all of them into expect([]).toEqual([]) without
  // a single test going red. This proves the capture still captures.
  test('the error buffer these tests read can still be filled', async ({ page }) => {
    await openBar(page)

    expect(await alpineErrors(page)).toEqual([])

    await page.evaluate(() => {
      // eslint-disable-next-line no-console
      console.warn('Alpine Expression Error: deliberate, from the browser suite')
    })

    const captured = await alpineErrors(page)

    expect(captured, 'console.warn is no longer the channel the bar watches').toHaveLength(1)
    expect(captured[0].message).toContain('deliberate, from the browser suite')

    await page.evaluate(() => {
      window.__siteationDebugBar.alpineErrors.length = 0
    })

    expect(await alpineErrors(page)).toEqual([])
  })

  test('injects itself and reports the request', async ({ page }) => {
    await openBar(page)

    await expect(page.locator('.ndb-sheet .ndb-path')).toContainText(PAGE)
    await expect(page.locator('.ndb-sheet .ndb-nav-item').first()).toBeVisible()
    expect(await alpineErrors(page)).toEqual([])
  })

  test('the host is a defined custom element that mounted itself', async ({ page }) => {
    await openBar(page)

    // An upgraded element, not a div the script happened to find: if define() never ran
    // the element is a plain HTMLElement and the constructor name says so.
    expect(await page.evaluate(() => {
      const host = document.querySelector('siteation-debugbar')

      return {
        defined: Boolean(customElements.get('siteation-debugbar')),
        upgraded: host.constructor !== HTMLElement,
        shadow: Boolean(host.shadowRoot),
        display: getComputedStyle(host).display,
      }
    })).toEqual({ defined: true, upgraded: true, shadow: true, display: 'block' })
  })

  test('every section and sub-tab renders without an expression throwing', async ({ page }) => {
    await openBar(page)

    const sections = await state(page, (data) => data.sections.map((section) => section.id))

    // Whatever the store leaves on. Which sections exist is configuration now, so a count
    // here would fail the suite on a perfectly valid instance; that the two which cannot be
    // switched off are present is the part that is always true.
    expect(sections).toContain('findings')
    expect(sections).toContain('overview')

    for (const section of sections) {
      await page.evaluate((id) => {
        document.querySelector('siteation-debugbar').shadowRoot
          .querySelector('.ndb')._x_dataStack[0].section = id
      }, section)

      // The panel has to say what it is, whatever else it does or does not have.
      await expect(page.locator('.ndb-section-head h2')).not.toBeEmpty()

      const errors = await alpineErrors(page)

      expect(errors, `${section} threw: ${JSON.stringify(errors)}`).toEqual([])
    }

    for (const [section, property, tabs] of [
      ['alpine', 'alpineTab', ['components', 'stores', 'deferred', 'health']],
      ['history', 'historyTab', ['recent', 'compare']],
    ]) {
      for (const tab of tabs) {
        await page.evaluate(([id, key, value]) => {
          const data = document.querySelector('siteation-debugbar').shadowRoot
            .querySelector('.ndb')._x_dataStack[0]

          data.section = id
          data[key] = value
        }, [section, property, tab])
        await page.waitForTimeout(150)

        const errors = await alpineErrors(page)

        expect(errors, `${section}/${tab} threw: ${JSON.stringify(errors)}`).toEqual([])
      }
    }
  })

  test('the overview tells the request as stages', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'overview' })

    await expect(page.locator('.ndb-step')).toHaveCount(3)
    await expect(page.locator('.ndb-summary')).toContainText('200')
    await expect(page.locator('.ndb-fact').first()).toBeVisible()
  })

  test('queries carry their call site, and the waterfall has rows', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'queries' })

    const queries = page.locator('.ndb-query')

    await expect(queries.first()).toBeVisible()
    expect(await queries.count()).toBeGreaterThan(0)

    // Collected since 1.0, rendered nowhere until the editor links went in.
    await expect(page.locator('.ndb-query .ndb-callsite').first()).toContainText('.php:')

    await state(page, (data) => { data.section = 'timeline' })
    await expect(page.locator('.ndb-wf-row').first()).toBeVisible()
  })

  test('the palette opens on the shortcut and filters', async ({ page }) => {
    await openBar(page)

    await page.keyboard.press('ControlOrMeta+Shift+KeyP')
    await expect(page.locator('.ndb-palette.is-open')).toBeVisible()
    await expect(page.locator('.ndb-palette-input')).toBeFocused()

    const all = await page.locator('.ndb-palette-item').count()

    await page.locator('.ndb-palette-input').fill('dark')
    await expect(page.locator('.ndb-palette-item')).toHaveCount(1)
    expect(all).toBeGreaterThan(1)

    await page.keyboard.press('Enter')
    await expect(page.locator('.ndb-palette.is-open')).toBeHidden()
    expect(await state(page, (data) => data.theme)).toBe('dark')

    await state(page, (data) => { data.setTheme('system') })
  })

  test('the theme flips from the header, in both states', async ({ page }) => {
    await openBar(page)

    // Removed once as header clutter, which was wrong: the palette names a theme, this
    // flips one, and the bar renders on a light admin and a dark storefront.
    for (const where of ['.ndb-sheet', '.ndb-dock']) {
      await state(page, (data) => { data.setTheme('light') })

      if (where === '.ndb-dock') await state(page, (data) => { data.closeInspector() })

      const toggle = page.locator(`${where} .ndb-icon-button[title*="Theme"]`)

      await expect(toggle).toBeVisible()
      await toggle.click()
      expect(await state(page, (data) => data.theme), where).toBe('dark')
      // The root carries the theme as a class. It has no box of its own, so visibility is
      // the wrong question to ask it.
      await expect(page.locator('.ndb')).toHaveClass(/is-theme-dark/)
    }

    await state(page, (data) => { data.setTheme('system') })
  })

  test('the collapsed bar opens the inspector wherever it is clicked, except on a control',
    async ({ page }) => {
      await openBar(page)
      await state(page, (data) => { data.closeInspector() })

      // The metrics are not a button and never will be, so this is the click that used to
      // do nothing at all.
      await page.locator('.ndb-dock .ndb-stat').first().click()
      expect(await state(page, (data) => data.open)).toBe(true)

      await state(page, (data) => { data.closeInspector() })

      // A control the bar carries still means what it says, and only that.
      await page.locator('.ndb-dock .ndb-icon-button[title*="Theme"]').click()
      expect(await state(page, (data) => data.open)).toBe(false)

      expect(await alpineErrors(page)).toEqual([])

      await state(page, (data) => { data.setTheme('system') })
    })

  test('the dock can be dragged by its grip and remembers where it was left', async ({ page }) => {
    await openBar(page)
    await closeToDock(page)

    const dock = page.locator('.ndb-dock')
    const grip = page.locator('.ndb-drag-handle')
    const before = await dock.boundingBox()
    const handle = await grip.boundingBox()

    await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2)
    await page.mouse.down()
    await page.mouse.move(handle.x + handle.width / 2 - 120, 300, { steps: 5 })
    await page.mouse.up()

    const moved = await dock.boundingBox()

    expect(moved.y).toBeGreaterThan(250)
    expect(moved.x).toBeLessThan(before.x)
    expect(await state(page, (data) => data.open)).toBe(false)

    await page.reload()
    await expect(dock).toBeVisible()

    const restored = await dock.boundingBox()

    expect(restored.x).toBeCloseTo(moved.x, 0)
    expect(restored.y).toBeCloseTo(moved.y, 0)
    expect(await ourAlpineErrors(page)).toEqual([])
  })

  test('a click on the grip leaves the dock alone, and a double click puts it back',
    async ({ page }) => {
      await openBar(page)
      await closeToDock(page)

      const dock = page.locator('.ndb-dock')
      const grip = page.locator('.ndb-drag-handle')
      const before = await dock.boundingBox()

      await grip.click()

      expect(await state(page, (data) => data.dockPosition)).toBe(null)
      expect((await dock.boundingBox()).x).toBeCloseTo(before.x, 0)

      const handle = await grip.boundingBox()

      await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2)
      await page.mouse.down()
      // Stay in the lower half: a reset returns the dock to the edge it was dragged
      // nearest, and this test asks for the standard position it started from.
      const lowerHalf = page.viewportSize().height * 0.7

      await page.mouse.move(handle.x + handle.width / 2, lowerHalf, { steps: 5 })
      await page.mouse.up()

      expect(await state(page, (data) => data.dockPosition)).not.toBe(null)

      await grip.dblclick()

      expect(await state(page, (data) => data.dockPosition)).toBe(null)
      expect((await dock.boundingBox()).x).toBeCloseTo(before.x, 0)
      expect((await dock.boundingBox()).y).toBeCloseTo(before.y, 0)
      expect(await ourAlpineErrors(page)).toEqual([])
    })

  test('closing the bar leaves a bubble behind, and the bubble is remembered',
    async ({ page }) => {
      await openBar(page)
      await state(page, (data) => { data.closeInspector() })

      await page.locator('.ndb-dock .ndb-icon-button[title="Collapse to a bubble"]').click()

      await expect(page.locator('.ndb-bubble')).toBeVisible()
      await expect(page.locator('.ndb-dock')).toBeHidden()

      // The whole point: reopening costs a click, not a reload, so the profile being read
      // survives being got out of the way.
      const findings = await state(page, (data) => data.findings.length)
      const badge = page.locator('.ndb-bubble .ndb-badge')

      if (findings > 0) {
        await expect(badge).toHaveText(String(findings))
      } else {
        await expect(badge).toBeHidden()
      }

      const viewport = page.viewportSize()
      const atBottom = await page.locator('.ndb-bubble').boundingBox()

      expect(atBottom.y).toBeGreaterThan(viewport.height / 2)

      await state(page, (data) => { data.movePlacement() })
      expect((await page.locator('.ndb-bubble').boundingBox()).y).toBeLessThan(viewport.height / 2)
      await state(page, (data) => { data.movePlacement() })

      // Remembered, unlike hiding: out of the way is a preference, not a decision about
      // one page.
      await page.reload()
      await expect(page.locator('.ndb-bubble')).toBeVisible()
      await expect(page.locator('.ndb-dock')).toBeHidden()

      await page.locator('.ndb-bubble').click()
      await expect(page.locator('.ndb-dock')).toBeVisible()
      await expect(page.locator('.ndb-bubble')).toBeHidden()

      expect(await ourAlpineErrors(page)).toEqual([])
    })

  test('the palette can still take the bar off the page entirely', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.runCommand({ kind: 'dismiss' }) })

    await expect(page.locator('.ndb-dock')).toBeHidden()
    await expect(page.locator('.ndb-bubble')).toBeHidden()
    await expect(page.locator('.ndb-sheet')).toBeHidden()

    // Not remembered, because nothing is left on screen to undo it.
    await page.reload()
    await expect(page.locator('.ndb-dock')).toBeVisible()
  })

  test('a comparison renders, and its empty state does not throw', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'history'; data.historyTab = 'compare' })

    // The panel used to evaluate against null on every page load, sixteen bindings deep.
    await expect(page.getByText('Pick a request and compare')).toBeVisible()
    expect(await alpineErrors(page)).toEqual([])

    await waitForState(page, (data) => !data.historyLoading && data.historyLoaded)

    const hasBaseline = await state(page, (data) => {
      data.baselineId = data.suggestedBaseline()

      return Boolean(data.baselineId)
    })

    test.skip(!hasBaseline, 'needs a second stored profile to compare against')

    await state(page, (data) => data.compareProfiles())
    await waitForState(page, (data) => data.comparison !== null || data.compareError !== '')

    expect(await state(page, (data) => data.compareError)).toBe('')

    await expect(page.locator('.ndb-compare tbody tr').first()).toBeVisible()
    expect(await state(page, (data) => typeof data.comparison.seo.available)).toBe('boolean')
    expect(await alpineErrors(page)).toEqual([])
  })

  test('the report reaches the clipboard', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'overview' })

    await page.locator('.ndb-summary-copy').click()
    await expect(page.locator('.ndb-summary-copy')).toHaveText('Copied')

    const report = await page.evaluate(() => navigator.clipboard.readText())

    expect(report).toContain('# GET ' + PAGE)
    expect(report).toContain('## Findings')
    expect(report).toContain('## Cost')
  })

  test('an editor link points at a file and a line', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'queries' })

    const configured = await state(page, (data) => data.editorTemplate)

    test.skip(!configured, 'no editor configured, so call sites are plain text')

    // A finding's location uses the same class and is empty when it names a class rather
    // than a file, so the query rows are the ones to ask.
    const link = page.locator('.ndb-query .ndb-callsite-link').first()
    const href = await link.getAttribute('href')

    expect(href).toMatch(/^[a-z-]+:\/\//)
    expect(href, 'a path style template must not double the slash').not.toMatch(/file\/\//)
    expect(href).toMatch(/\d+$/)
  })
})

test.describe('the SEO section', () => {
  test('reads the page, walks every view, and points at a heading on it', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'seo' })

    // Read from the live page, so it is the document's own title and not a profile field.
    const title = await page.title()

    await waitForState(page, (data) => data.seo.overview.title.value !== '')
    expect(await state(page, (data) => data.seo.overview.title.value)).toBe(title.trim())

    for (const view of ['overview', 'headings', 'images', 'links', 'social']) {
      await page.evaluate((id) => {
        document.querySelector('siteation-debugbar').shadowRoot
          .querySelector('.ndb')._x_dataStack[0].seoTab = id
      }, view)

      const errors = await ourAlpineErrors(page)

      expect(errors, `the ${view} view threw: ${JSON.stringify(errors)}`).toEqual([])
    }

    await state(page, (data) => { data.seoTab = 'headings' })

    const headings = await page.evaluate(() => document.querySelectorAll('h1, h2, h3, h4, h5, h6').length)

    expect(await state(page, (data) => data.seo.headings.items.length)).toBe(headings)
    test.skip(headings === 0, 'this page has no headings to point at')

    await page.locator('.ndb-seo-tree .ndb-seo-row').first().hover()

    const outlined = await page.evaluate(
      () => document.querySelector('h1, h2, h3, h4, h5, h6').style.outline
    )

    expect(outlined, 'hovering a row outlines its heading').toContain('solid')

    // Moved off, the page gets its own inline style back, which on a store heading is none.
    await page.locator('.ndb-section-head h2').hover()

    expect(await page.evaluate(
      () => document.querySelector('h1, h2, h3, h4, h5, h6').style.outline
    )).toBe('')
  })

  test('keeps the server\'s reading in the profile, and never calls a page with live warnings clear', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'seo' })
    await waitForState(page, (data) => data.seo.overview.title.value !== '')

    // The collector read the HTML the server sent, before the bar was injected into it.
    const server = await state(page, (data) => data.pageProfile.sections.seo.summary)

    expect(server.skipped).toBeUndefined()
    expect(server.title).toBe((await page.title()).trim())

    const clear = page.locator('.ndb-sheet .ndb-callout.is-clear')

    // No SEO finding on either side: the line is earned.
    await state(page, (data) => {
      data.findings = data.findings.filter((finding) => finding.section !== 'seo')
      data.seo = { ...data.seo, warningCount: 0 }
    })
    await expect(clear).toBeVisible()

    // The live checks found something the server rules did not: saying "no clear problem"
    // above them would contradict the panel.
    await state(page, (data) => { data.seo = { ...data.seo, warningCount: 2 } })
    await expect(clear).toBeHidden()

    // A server finding opens the sub view that shows the same thing on the live page.
    await state(page, (data) => {
      data.seoTab = 'overview'
      data.section = 'findings'
      data.follow({ label: 'Review headings', section: 'seo', filter: 'headings' })
    })
    await waitForState(page, (data) => data.section === 'seo' && data.seoTab === 'headings')

    expect(await ourAlpineErrors(page)).toEqual([])
  })

  test('names what a script changed after the server sent the page', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'seo'; data.seoTab = 'overview' })
    await waitForState(page, (data) => data.seo.overview.title.value !== '')

    const changedKeys = () => state(page, (data) => data.seoServer.rows
      .filter((row) => row.changed).map((row) => row.key))
    const before = await changedKeys()

    expect(await state(page, (data) => data.seoServer.available)).toBe(true)
    expect(before).not.toContain('title')
    expect(before).not.toContain('robots')

    await page.evaluate(() => {
      const meta = document.createElement('meta')

      meta.name = 'robots'
      meta.content = 'noindex'
      document.head.appendChild(meta)
      document.title = `${document.title} | changed by a script`
    })
    await state(page, (data) => data.refreshSeo())
    await waitForState(page, (data) => data.seoServer.rows.some((row) => row.key === 'robots' && row.changed))

    expect(await changedKeys()).toEqual(expect.arrayContaining([...before, 'title', 'robots']))

    const robots = page.locator('.ndb-seo-block tr').filter({ hasText: 'Robots meta' })

    await expect(robots.locator('.ndb-tag.is-warn')).toHaveText('changed')
    await expect(robots).toContainText('noindex')
    expect(await alpineErrors(page)).toEqual([])
  })

  test('says where each value came from on the home page, and stays out of the way on the cart', async ({ page }) => {
    // The home page is a CMS page read by its id, so it has sources even from the cache.
    await openBar(page, '/')
    await state(page, (data) => { data.section = 'seo'; data.seoTab = 'overview' })
    await waitForState(page, (data) => !data.loading && Object.keys(data.payloads).length > 0)

    const { sources, missing, pageType } = await state(page, (data) => ({
      sources: JSON.parse(JSON.stringify(data.seoSources)),
      missing: data.seoSourcesMissing,
      pageType: data.pageProfile.sections.seo.summary.page_type || null,
    }))
    const block = page.locator('.ndb-seo-block').filter({ hasText: 'Where each value came from' })

    expect(pageType).toBe('cms')
    expect(missing).toBe(false)
    expect(sources.map((row) => row.field)).toEqual(['title', 'description', 'h1', 'canonical', 'robots'])
    await expect(block).toBeVisible()
    await expect(block.locator('tbody tr')).toHaveCount(5)
    expect(await alpineErrors(page)).toEqual([])

    // The cart has no entity behind it, so the block stays out of the way.
    await openBar(page)
    await state(page, (data) => { data.section = 'seo'; data.seoTab = 'overview' })
    await waitForState(page, (data) => !data.loading && Object.keys(data.payloads).length > 0)
    expect(await state(page, (data) => data.seoSources.length + Number(data.seoSourcesMissing))).toBe(0)
    await expect(block).toBeHidden()
  })

  test('reads structured data the page gains, draws it, and points at a microdata item', async ({ page }) => {
    await openBar(page)

    // Added to the page rather than expected from the store, so the test does not depend on
    // which theme or SEO module is installed. One block is broken on purpose.
    await page.evaluate(() => {
      const block = (text) => {
        const script = document.createElement('script')

        script.type = 'application/ld+json'
        script.className = 'ndb-test-schema'
        script.textContent = text
        document.head.appendChild(script)
      }

      block(JSON.stringify({ '@context': 'https://schema.org', '@type': 'Product', name: 'Test Bag' }))
      block('{"@type": "Product",}')

      const item = document.createElement('div')

      item.className = 'ndb-test-schema'
      item.setAttribute('itemscope', '')
      item.setAttribute('itemtype', 'https://schema.org/Organization')
      item.innerHTML = '<span itemprop="name">Test Shop</span>'
      document.body.appendChild(item)
    })

    await state(page, (data) => {
      data.section = 'seo'
      data.seoTab = 'schema'
      data.refreshSeo()
    })
    await waitForState(page, (data) => data.seo.schema.entities.some((entity) => entity.name === 'Test Bag'))

    const schema = await state(page, (data) => JSON.parse(JSON.stringify(data.seo.schema)))
    const ours = schema.entities.filter((entity) => ['Test Bag', 'Test Shop'].includes(entity.name))

    expect(ours.map((entity) => entity.source).sort()).toEqual(['json-ld', 'microdata'])
    expect(schema.warnings).toContain('Product: Needs one of offers, review, aggregateRating.')
    expect(schema.warnings.some((warning) => /^JSON-LD block \d+ does not parse/.test(warning))).toBe(true)
    expect(await state(page, (data) => data.seo.counts.schema)).toBe(schema.warnings.length)

    const bag = ours.find((entity) => entity.name === 'Test Bag')
    const row = page.locator('.ndb-schema-entity').filter({ hasText: 'Test Bag' })

    await row.locator('.ndb-alpine-head').click()
    await expect(row.locator('.ndb-json')).toContainText('"Test Bag"')
    await expect(row.locator('.ndb-schema-findings')).toContainText('Needs one of offers')
    expect(bag.findings.length).toBeGreaterThan(0)

    const shop = page.locator('.ndb-schema-entity').filter({ hasText: 'Test Shop' })

    await shop.locator('.ndb-alpine-head').hover()
    expect(await page.evaluate(
      () => document.querySelector('div.ndb-test-schema[itemscope]').style.outline
    ), 'hovering a microdata row outlines its element').toContain('solid')

    await page.locator('.ndb-section-head h2').hover()
    expect(await page.evaluate(
      () => document.querySelector('div.ndb-test-schema[itemscope]').style.outline
    )).toBe('')

    // A .test host is not one Google can fetch, so the tools open empty and the markup is
    // what gets carried over.
    expect(schema.links.public).toBe(false)
    await page.locator('.ndb-chip', { hasText: 'Copy the markup' }).click()

    const copied = await page.evaluate(() => navigator.clipboard.readText())

    expect(copied).toContain('"Test Bag"')
    expect(copied).toContain('itemtype="https://schema.org/Organization"')

    const errors = await ourAlpineErrors(page)

    expect(errors, `the schema view threw: ${JSON.stringify(errors)}`).toEqual([])
  })
})

test.describe('the data layer section', () => {
  test('records pushes from before and after the bar, behind a replaced push, and keeps them across pages', async ({ page }) => {
    // Before anything on the page runs, as a consent banner or a GTM snippet in the head
    // would. These are in the array before early.js arrives.
    await page.addInitScript(() => {
      window.dataLayer = window.dataLayer || []
      window.gtag = function () { window.dataLayer.push(arguments) }
      window.gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      })
      window.dataLayer.push({ event: 'gtm.js', 'gtm.start': 1 })
    })

    await openBar(page)

    const result = await page.evaluate(() => {
      // What GTM does when it loads: keep the push it found and assign its own.
      window.seenByTag = 0
      const found = window.dataLayer.push

      window.dataLayer.push = function () {
        window.seenByTag += arguments.length

        return found.apply(window.dataLayer, arguments)
      }

      window.dataLayer.push({ ecommerce: null })
      window.dataLayer.push({ event: 'add_to_cart', ecommerce: { value: 34, items: [{ item_id: 'NDB-1' }] } })
      window.gtag('consent', 'update', { analytics_storage: 'granted' })

      return { length: window.dataLayer.length, seenByTag: window.seenByTag }
    })

    expect(result, 'every push reached the array once and the tag saw each one').toEqual({ length: 5, seenByTag: 3 })

    await state(page, (data) => { data.section = 'datalayer' })
    await waitForState(page, (data) => data.dataLayer.pushes.length === 5)

    const model = await state(page, (data) => JSON.parse(JSON.stringify(data.dataLayer)))

    expect(model.pushes.map((push) => [push.name, push.before])).toEqual([
      ['consent default', true],
      ['gtm.js', true],
      ['ecommerce', false],
      ['add_to_cart', false],
      ['consent update', false],
    ])
    expect(model.pushes[3].problems).toEqual(['value without currency'])
    expect(model.consent.keys.find((row) => row.key === 'analytics_storage'))
      .toEqual({ key: 'analytics_storage', default: 'denied', current: 'granted' })
    expect(model.consent.warnings).toEqual([])
    expect(await state(page, (data) => data.sections.find((section) => section.id === 'datalayer') !== undefined)).toBe(true)

    const row = page.locator('.ndb-push').filter({ hasText: 'add_to_cart' })

    await row.locator('.ndb-alpine-head').click()
    await expect(row.locator('.ndb-json')).toContainText('"NDB-1"')
    await expect(row.locator('.ndb-callout')).toContainText('value without currency')

    await page.locator('.ndb-chip', { hasText: 'Paths' }).click()
    await row.locator('.ndb-push-path', { hasText: 'ecommerce.items[0].item_id' }).click()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('ecommerce.items[0].item_id')

    expect(await ourAlpineErrors(page), 'the data layer section threw').toEqual([])

    // The next page in this tab starts with this one's pushes, marked as earlier.
    await page.reload()
    await page.waitForFunction(
      () => document.querySelector('siteation-debugbar')?.shadowRoot?.querySelector('.ndb')?._x_dataStack !== undefined
    )
    await waitForState(page, (data) => data.dataLayerEarlier.length > 0)

    const earlier = await state(page, (data) => data.dataLayerEarlier.map((push) => [push.name, push.current]))

    expect(earlier).toContainEqual(['add_to_cart', false])
  })
})


test.describe('the Web Vitals section', () => {
  /**
   * Elements the bar has outlined, by their inline style, which is how it draws one.
   *
   * @param {import('@playwright/test').Page} page
   * @returns {Promise<Array<string>>}
   */
  function outlined(page) {
    return page.evaluate(() => Array.from(document.querySelectorAll('[style*="outline"]'))
      .filter((element) => element.style.outline.includes('solid'))
      .map((element) => element.tagName.toLowerCase() + (element.id ? `#${element.id}` : '')))
  }

  test('measures the page, points at what moved, and keeps the bar out of INP', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'vitals' })

    // The page loaded before the bar did, so these came from the buffered entries.
    await waitForState(page, (data) => ['lcp', 'fcp', 'ttfb']
      .every((id) => data.vitals.metrics.find((metric) => metric.id === id).value !== null))
    await expect(page.locator('.ndb-vitals tbody tr')).toHaveCount(5)
    expect(await ourAlpineErrors(page)).toEqual([])

    const lcp = await state(page, (data) => data.vitals.lcp)

    expect(lcp.label, 'LCP names its element').not.toBe('')

    await page.locator('.ndb-seo-row').first().hover()
    expect((await outlined(page)).length, 'hovering the LCP row outlines its element').toBe(1)
    await page.locator('.ndb-section-head h2').hover()
    expect(await outlined(page), 'moving off gives the page its own style back').toEqual([])

    // A shift nobody asked for, and a control on the page that is slow to answer. With the
    // inspector closed, so the page is not inert and the click is a real one.
    await closeToDock(page)
    await page.evaluate(() => {
      const slow = document.createElement('button')

      slow.id = 'ndb-vitals-slow'
      slow.textContent = 'slow'
      slow.style.cssText = 'display:block;height:200px;width:100%'
      slow.addEventListener('click', () => {
        const start = performance.now()

        while (performance.now() - start < 300) { /* hold the main thread */ }
      })
      document.body.prepend(slow)

      // And a bar that is slower still to answer, so if its clicks were counted, one of them
      // would be INP. Slow enough, too, for the browser to keep it in its buffer.
      document.querySelector('siteation-debugbar').addEventListener('click', () => {
        const start = performance.now()

        while (performance.now() - start < 600) { /* hold the main thread */ }
      })
    })
    await page.waitForTimeout(300)
    await page.click('#ndb-vitals-slow')

    // Opened by a real, slow click on the bar, which is an interaction with the bar.
    await page.locator('.ndb-dock').click()
    await expect(page.locator('.ndb-sheet')).toBeVisible()
    await state(page, (data) => { data.maximised = true; data.section = 'vitals' })

    // The browser reports an interaction after its next paint, so the bar's click can arrive
    // after the page's. Waited for here, from the browser's own buffer: until it is there,
    // a count of one would pass whether or not the bar leaves its own clicks out.
    await expect.poll(() => page.evaluate(() => new Promise((resolve) => {
      const host = document.querySelector('siteation-debugbar')
      const observer = new PerformanceObserver((list) => {
        observer.disconnect()
        resolve(list.getEntries().some((entry) => entry.interactionId > 0 && entry.target === host))
      })

      observer.observe({ type: 'event', buffered: true, durationThreshold: 16 })
    })), { message: 'the click on the bar reached the browser\'s event timing' }).toBe(true)

    await state(page, (data) => { data.refreshVitals() })
    await waitForState(page, (data) => data.vitals.shifts.length > 0
      && data.vitals.inp.interaction !== null)

    const inp = await state(page, (data) => ({
      metric: data.vitals.metrics.find((metric) => metric.id === 'inp'),
      interaction: data.vitals.inp.interaction,
      count: data.vitals.inp.count,
    }))

    expect(inp.interaction.label, 'the slow click on the page is INP, not the slower one on the bar')
      .toBe('button#ndb-vitals-slow')
    expect(inp.metric.value).toBeGreaterThanOrEqual(300)
    expect(inp.metric.rating).not.toBe('good')
    expect(inp.count, 'only the click on the page is counted').toBe(1)

    expect(await state(page, (data) => data.vitals.metrics.find((metric) => metric.id === 'cls').value))
      .toBeGreaterThan(0)

    const source = page.locator('.ndb-vitals-shift .ndb-seo-row').first()

    await source.hover()
    expect((await outlined(page)).length, 'hovering a shift source outlines what moved').toBe(1)
    await page.locator('.ndb-section-head h2').hover()
    expect(await outlined(page)).toEqual([])
    expect(await ourAlpineErrors(page)).toEqual([])
  })
})

test.describe('the Page cache section', () => {
  test('names the block that made the cart uncacheable, and the file it came from', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'pagecache' })

    // The cart is uncacheable by design: core declares its main block cacheable="false".
    await waitForState(page, (data) => data.pageCache.status === 'not_cached'
      && data.uncacheableBlocks.length > 0)
    expect(await state(page, (data) => data.pageCache.reasons.map((reason) => reason.code)))
      .toContain('layout')

    const row = page.locator('.ndb-sheet table tbody tr').first()
    await expect(row.locator('td').nth(1)).not.toHaveText('unknown')
    await expect(row.locator('td').nth(2)).toHaveText(/\/layout\/[a-z_]+\.xml$/)
    expect(await ourAlpineErrors(page)).toEqual([])
  })

  test('says a cached page was served from the cache rather than listing no reasons', async ({ page }) => {
    // Twice, so the second is a hit however the cache was left by whatever ran before.
    await page.goto('/')
    await page.goto('/')
    await page.waitForFunction(
      () => document.querySelector('siteation-debugbar')?.shadowRoot?.querySelector('.ndb')
        ?._x_dataStack !== undefined
    )
    await state(page, (data) => { data.openInspector(); data.maximised = true; data.section = 'pagecache' })

    await waitForState(page, (data) => data.pageCache.status === 'hit')
    expect(await state(page, (data) => data.looksLikeFullPageCacheHit)).toBe(true)
    await expect(page.locator('.ndb-sheet')).toContainText('Served from the full page cache')
    expect(await ourAlpineErrors(page)).toEqual([])
  })
})

test.describe('the Layout section', () => {
  test('lists the cart handles in load order, each with the files behind it', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'layout' })

    await waitForState(page, (data) => data.itemsOf('layout').length > 0)
    const handles = await state(page, (data) => data.itemsOf('layout').map((entry) => entry.handle))

    // default loads first on every storefront page, and the action's own handle after it,
    // ahead of the price layout that was generated before the page's.
    expect(handles[0]).toBe('default')
    expect(handles.indexOf('checkout_cart_index')).toBeGreaterThan(0)
    expect(await state(page, (data) => data.itemsOf('layout')
      .find((entry) => entry.handle === 'checkout_cart_item_renderers')?.via)).toBe('checkout_cart_index')
    await expect(page.locator('.ndb-sheet li.ndb-intercept', {
      has: page.locator('code', { hasText: /^checkout_cart_item_renderers$/ }),
    }).locator('.ndb-tag').first()).toHaveText('via checkout_cart_index')

    const cart = page.locator('.ndb-sheet li.ndb-intercept', {
      has: page.locator('code', { hasText: /^checkout_cart_index$/ }),
    })
    const file = cart.locator('.ndb-intercept-plugins li').first()
    // The file the merge read. A theme that rewrites layout files shows its rewritten copy,
    // so only the name is certain.
    await expect(file.locator('small')).toHaveText(/\/checkout_cart_index\.xml$/)
    await expect(file.locator('span').first()).toHaveText(/^[A-Z][A-Za-z0-9]+_[A-Za-z0-9]+$| theme$/)
    expect(await ourAlpineErrors(page)).toEqual([])
  })

  test('a handle opens the Blocks section filtered to the blocks it put on the page', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'layout' })
    await waitForState(page, (data) => data.itemsOf('layout').length > 0)

    await page.locator('.ndb-sheet li.ndb-intercept', {
      has: page.locator('code', { hasText: /^checkout_cart_index$/ }),
    }).locator('button.ndb-chip').click()

    await waitForState(page, (data) => data.section === 'blocks')
    const shown = await state(page, (data) => data.visibleBlocks.map((block) => block.name))
    const credited = await state(page, (data) => data.visibleBlocks
      .every((block) => data.blockHandles[block.name] === 'checkout_cart_index'))
    const all = await state(page, (data) => data.itemsOf('blocks').length)

    // Core's checkout_cart_index.xml declares the cart itself.
    expect(shown).toContain('checkout.cart')
    expect(credited).toBe(true)
    expect(shown.length).toBeLessThan(all)

    await page.locator('.ndb-sheet .ndb-controls button.ndb-chip', { hasText: 'checkout_cart_index' }).click()
    await waitForState(page, (data) => data.blockHandle === '')
    expect(await state(page, (data) => data.visibleBlocks.length)).toBe(all)
    expect(await ourAlpineErrors(page)).toEqual([])
  })
})

test.describe('the Events section', () => {
  test('lists what was dispatched, and its filters narrow the list rather than empty it', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'events' })
    await waitForState(page, (data) => data.itemsOf('events').length > 0)

    const names = await state(page, (data) => data.itemsOf('events').map((event) => event.name))
    const rows = page.locator('.ndb-sheet table tbody tr')

    // Dispatched on every controller action, the second one named for the action itself.
    expect(names).toContain('controller_action_predispatch')
    expect(names).toContain('controller_action_predispatch_checkout_cart_index')
    await expect(rows).toHaveCount(names.length)

    // The pill is the summary's count, the rows are the payload's. They come from the same
    // request, so with nothing dropped they agree.
    await page.locator('.ndb-sheet .ndb-controls button.ndb-chip', { hasText: 'Unobserved' }).click()
    await waitForState(page, (data) => data.eventFilter === 'unobserved')
    const unobserved = await state(page, (data) => data.visibleEvents.map((event) => event.observer_count))
    expect(unobserved.length).toBeGreaterThan(0)
    expect(unobserved.length).toBeLessThan(names.length)
    expect(unobserved.every((count) => count === 0)).toBe(true)
    if (await state(page, (data) => !data.events.truncated)) {
      await expect(page.locator('.ndb-sheet .ndb-controls button.ndb-chip .ndb-pill'))
        .toHaveText(String(unobserved.length))
    }
    await expect(rows).toHaveCount(unobserved.length)

    await page.locator('.ndb-sheet .ndb-controls button.ndb-chip', { hasText: /^All$/ }).click()
    await page.locator('.ndb-sheet input.ndb-search').fill('checkout_cart')
    await waitForState(page, (data) => data.eventSearch === 'checkout_cart')
    const found = await state(page, (data) => data.visibleEvents.map((event) => event.name))
    expect(found).toContain('controller_action_predispatch_checkout_cart_index')
    expect(found.every((name) => name.includes('checkout_cart'))).toBe(true)
    await expect(rows).toHaveCount(found.length)

    await page.locator('.ndb-sheet input.ndb-search').fill('no_event_is_called_this')
    await expect(page.locator('.ndb-sheet .ndb-empty', { hasText: 'No events match.' })).toBeVisible()
    expect(await ourAlpineErrors(page)).toEqual([])
  })

  test('an event with observers is the event the Observers section ran them for', async ({ page }) => {
    // Two collectors, one request. An event counted as unobserved while its observer is
    // listed would send the reader looking for a listener that is already there.
    await openBar(page)
    await state(page, (data) => { data.section = 'events' })
    await waitForState(page, (data) => data.itemsOf('events').length > 0)
    await state(page, (data) => { data.section = 'observers' })
    await waitForState(page, (data) => data.itemsOf('observers').length > 0)

    const observed = await state(page, (data) => data.itemsOf('events')
      .filter((event) => event.observer_count > 0).map((event) => event.name).sort())
    const ran = await state(page, (data) => [...new Set(data.itemsOf('observers')
      .map((observer) => observer.event))].sort())

    expect(ran.length).toBeGreaterThan(0)
    expect(observed).toEqual(ran)
  })
})

test.describe('the Observers section', () => {
  test('lists each observer with its class and event, and searches all three', async ({ page }) => {
    await openBar(page)
    await state(page, (data) => { data.section = 'observers' })
    await waitForState(page, (data) => data.itemsOf('observers').length > 0)

    const all = await state(page, (data) => data.itemsOf('observers').length)
    const rows = page.locator('.ndb-sheet table tbody tr')
    await expect(rows).toHaveCount(all)

    const first = await state(page, (data) => data.visibleObservers[0])
    await expect(rows.first().locator('td').nth(0).locator('span')).toHaveText(first.name)
    await expect(rows.first().locator('td').nth(0).locator('small')).toHaveText(first.instance)
    await expect(rows.first().locator('td').nth(1)).toHaveText(first.event)
    expect(first.instance).toMatch(/^[A-Z][A-Za-z0-9]*\\/)

    // By event, by observer name and by class: a reader arrives with any one of them. The
    // class is searched by its namespace, which neither of the other two columns contains.
    const namespace = first.instance.split('\\').slice(0, 2).join('\\')
    for (const term of [first.event, first.name, namespace]) {
      await page.locator('.ndb-sheet input.ndb-search').fill(term)
      await waitForState(page, (data) => data.observerSearch !== '')
      const shown = await state(page, (data) => data.visibleObservers)
      const needle = term.toLowerCase()

      expect(shown.length, term).toBeGreaterThan(0)
      expect(shown.every((observer) => [observer.name, observer.event, observer.instance]
        .some((field) => String(field).toLowerCase().includes(needle))), term).toBe(true)
      await expect(rows).toHaveCount(shown.length)
    }

    await page.locator('.ndb-sheet input.ndb-search').fill('no_observer_is_called_this')
    await expect(page.locator('.ndb-sheet .ndb-empty', { hasText: 'No observers match.' })).toBeVisible()
    expect(await ourAlpineErrors(page)).toEqual([])
  })
})

test.describe('the Magewire section', () => {
  test('says so when the page has no Magewire', async ({ page }) => {
    await openBar(page)
    test.skip(await page.evaluate(() => Boolean(window.Magewire || window.magewire)),
      'this store puts Magewire on the cart')

    await state(page, (data) => { data.section = 'magewire' })
    await expect(page.locator('.ndb-sheet .ndb-note', { hasText: 'No Magewire on this page.' })).toBeVisible()
    await expect(page.locator('.ndb-sheet .ndb-tabs')).toBeHidden()
    expect(await ourAlpineErrors(page)).toEqual([])
  })

  test('lists a page\'s components, opens one, and records its round trips', async ({ page }) => {
    // A stand-in with the shape the section reads, installed before the page's scripts the
    // way Magewire loads before the bar. The test store has no Magewire of its own, and a
    // section that only ever met its empty state would pass this suite showing nothing.
    await page.addInitScript(() => {
      const hooks = {}

      window.__magewireHooks = hooks
      window.Magewire = {
        components: {
          componentsById: {
            c1: {
              fingerprint: { id: 'c1', name: 'cart-totals', resolver: 'layout', handle: 'checkout_cart_index' },
              serverMemo: { data: { qty: 2, coupon: 'SUMMER' }, children: {} },
              effects: { listeners: ['cartUpdated'] },
            },
          },
        },
        hook(name, callback) {
          (hooks[name] = hooks[name] || []).push(callback)
        },
      }
    })

    await openBar(page)
    await state(page, (data) => { data.section = 'magewire' })
    await waitForState(page, (data) => data.magewireComponents.length === 1)
    await expect(page.locator('.ndb-sheet .ndb-note', { hasText: 'No Magewire on this page.' })).toBeHidden()

    const component = page.locator('.ndb-sheet li.ndb-alpine').first()
    await expect(component.locator('.ndb-alpine-name')).toHaveText('cart-totals')
    await expect(component.locator('.ndb-alpine-path')).toHaveText('layout · 2 properties · 1 listener')
    await component.locator('button.ndb-alpine-head').click()
    await expect(component.locator('pre.ndb-json')).toContainText('"qty"')

    await page.evaluate(() => {
      const fire = (name, ...args) => window.__magewireHooks[name].forEach((callback) => callback(...args))
      const component = window.Magewire.components.componentsById.c1
      const update = (method) => ({
        component,
        updateQueue: [{ type: 'callMethod', payload: { method } }],
      })

      fire('message.sent', update('applyCoupon'), component)
      fire('message.processed', update('applyCoupon'), component)
      fire('message.sent', update('removeItem'), component)
      fire('message.failed', update('removeItem'), component)
    })

    await state(page, (data) => { data.magewireTab = 'updates' })
    const updates = page.locator('.ndb-sheet [data-ndb-show="magewireTab === \'updates\'"] li.ndb-alpine')
    await expect(updates).toHaveCount(2)
    // Newest first.
    await expect(updates.nth(0).locator('.ndb-alpine-name')).toHaveText('cart-totals removeItem()')
    await expect(updates.nth(0).locator('.ndb-tag.is-bad')).toBeVisible()
    await expect(updates.nth(1).locator('.ndb-alpine-name')).toHaveText('cart-totals applyCoupon()')
    await expect(updates.nth(1).locator('.ndb-tag.is-bad')).toBeHidden()
    await expect(updates.nth(1).locator('.ndb-pill')).toHaveText(/^\d+(\.\d)? ms$/)
    expect(await ourAlpineErrors(page)).toEqual([])
  })
})

test.describe('a section from another module', () => {
  /**
   * Needs dev/fixture-section installed. Without it the API has nothing to draw, and these
   * tests say so rather than pass.
   *
   * @param {import('@playwright/test').Page} page
   */
  async function openFixture(page) {
    await openBar(page)
    test.skip(
      !(await state(page, (data) => data.isExtension('fixture'))),
      'needs dev/fixture-section installed'
    )
    await state(page, (data) => { data.section = 'fixture' })
  }

  test('is listed, and draws the stored view and the live reader as one panel', async ({ page }) => {
    await openFixture(page)

    await waitForState(page, (data) => data.extension.tabs.length === 2)
    expect(await state(page, (data) => data.extension.tabs.map((tab) => tab.id))).toEqual(['stored', 'live'])
    await expect(page.locator('.ndb-nav-item', { hasText: 'Fixture' })).toBeVisible()

    // The view was built from the profile it came with, so it names this request.
    const profileId = await state(page, (data) => data.profile.id)
    await expect(page.locator('.ndb-extension .ndb-fact-value').first()).toHaveText(profileId)
    await expect(page.locator('.ndb-extension td', { hasText: /^request$/ })).toBeVisible()

    await page.locator('.ndb-extension .ndb-subtab', { hasText: 'Live' }).click()
    await waitForState(page, (data) => data.extension.tab === 'live')
    await expect(page.locator('.ndb-extension .ndb-fact-value').nth(1)).toHaveText(profileId)
    expect(await ourAlpineErrors(page)).toEqual([])
  })

  test('reads the page again when its reader says the page changed', async ({ page }) => {
    await openFixture(page)
    await waitForState(page, (data) => data.extension.tabs.length === 2)

    const before = await page.evaluate(() => window.__debugBarFixtureReads)
    await page.evaluate(() => window.dispatchEvent(new Event('debugbar-fixture')))

    await expect.poll(() => page.evaluate(() => window.__debugBarFixtureReads)).toBeGreaterThan(before)
  })

  test('a row the reader points at is outlined on the page while hovered', async ({ page }) => {
    await openFixture(page)
    await state(page, (data) => { data.selectExtensionTab('live') })
    const row = page.locator('.ndb-extension tr.is-target').first()
    test.skip(await row.count() === 0, 'this page has no headings to point at')

    await row.dispatchEvent('mouseenter')
    await expect.poll(() => page.evaluate(() => document.querySelector('h1, h2').style.outline)).toContain('solid')

    await row.dispatchEvent('mouseleave')
    await expect.poll(() => page.evaluate(() => document.querySelector('h1, h2').style.outline)).not.toContain('solid')
  })
})
