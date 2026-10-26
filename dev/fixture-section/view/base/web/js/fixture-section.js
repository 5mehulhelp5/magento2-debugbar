/**
 * The live half of the fixture section: headings on the page, how often it was read, and
 * an outline when a row is hovered. The browser suite drives it through the
 * `debugbar-fixture` event.
 */
const outlined = new Map()

window.__debugBarFixtureReads = 0

window.__siteationDebugBar.registerSection({
  id: 'fixture',
  read(context) {
    window.__debugBarFixtureReads += 1

    const headings = Array.from(document.querySelectorAll('h1, h2')).slice(0, 5)

    return {
      tabs: [{
        id: 'live',
        label: 'Live',
        blocks: [
          { type: 'facts', items: [
            { label: 'Reads', value: window.__debugBarFixtureReads },
            { label: 'Profile on screen', value: context.profile.id, mono: true },
          ] },
          {
            type: 'table',
            columns: ['heading'],
            rows: headings.map((heading, index) => ({ heading: heading.textContent.trim(), _target: String(index) })),
            empty: 'This page has no headings.',
          },
        ],
      }],
    }
  },
  watch(refresh) {
    window.addEventListener('debugbar-fixture', refresh)
  },
  highlight(target, on) {
    const heading = document.querySelectorAll('h1, h2')[Number(target)]

    if (!heading) return

    if (on) {
      outlined.set(heading, heading.style.outline)
      heading.style.outline = '2px solid #7f9cf5'
    } else if (outlined.has(heading)) {
      heading.style.outline = outlined.get(heading)
      outlined.delete(heading)
    }
  },
})
