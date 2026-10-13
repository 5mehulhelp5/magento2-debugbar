# Developer guide

For working on Siteation_DebugBar itself. If you want to use it, read the
[user guide](user-guide.md).

## Layout

| | |
| --- | --- |
| `Api/` | `CollectorInterface`, `RuleInterface`, `McpToolInterface` |
| `Plugin/` | The entry hook and the seven collection hooks |
| `Collector/` | Ten collectors and the abstract they share |
| `Analysis/` | Findings, rules, the query analyzer, the timeline, the comparer |
| `Model/` | Config, the gate, the access key, the store, the redactor, the layout file lookup, SEO sources, the admin edit link |
| `Presentation/` | Bar injection, the markdown report, the MCP presenter |
| `Mcp/` | JSON-RPC server and six tools |
| `Controller/` | `Profile/`: `view`, `history`, `compare`; `Adminhtml/Entity/Edit`: the admin edit link |
| `Console/` | `siteation:debugbar:mcp`, `siteation:debugbar:report` |
| `src-js/` | Alpine sources for the bar; build output is committed |
| `view/base/web/` | The committed build output |
| `dev/` | `smoke`, an HTTP test over a running store, and `docs`, the guide renderer |

PHP is edited in place. The package installs as a Composer path symlink, so nothing needs
reinstalling after an edit.

## How a request becomes a profile

**One entry hook.** An `around` plugin on `Magento\Framework\App\Http::launch()` brackets
every web request in every area.

It has to be `around`. `launch()` switches the object manager to the request's area,
`PluginList` reloads its scoped data as it does so, and an `after` listener does not survive
that reload: it dies inside `getPlugin()`. There is no ordering trick that fixes it; the
bracket has to be taken before the switch.

In order:

1. `RequestEligibility::allows()` decides whether to profile at all. It reads the config
   flag, the area list, the IP allowlist, the access key, and whether this is one of the
   bar's own endpoints.
2. `ProfileManager` starts collecting. Every plugin records through it, and it holds a
   single boolean that the plugins branch on, so an unprofiled request pays a plugin hop and
   no config read.
3. `proceed()` runs the application. The query, event, observer, block, cache, layout and
   page cache plugins record as they fire.
4. `finalize()` asks each enabled collector for its section, builds the timeline, runs the
   rules, and hands the result to `ProfileStore`.
5. `BarInjector` sets the profile header, marks the response unshareable, and injects the
   bar if the response can carry one.

**Nothing may read configuration while a request is being collected.** A config read can miss
the cache, a cache miss issues queries and dispatches events, and the query, cache and event
collectors all call back in. `Config` resolves every value once in one guarded pass, at
launch, before any collector is active.

**Never break the page being debugged.** Every collector call and the whole finalize step is
wrapped. A throw discards the profile and returns the untouched response.

## Adding a collector

Implement `Api\CollectorInterface`, extend `Collector\AbstractCollector`, and register it in
the sorted array on `ProfileManager` in `etc/di.xml`.

`AbstractCollector` does redaction, bounding and `at_ms` stamping once for all of them. Do
not do any of those in your collector; a collector that bypasses the abstract is how the
contract stops meaning anything.

Recording is done through `ProfileManager::quietly()`, which is also where the "is this
section switched on" decision is honoured, so a section that is off costs nothing rather
than being gathered and hidden.

Add the section to `src-js/src/sections.js` as well, or the panel will never be drawn.
`Test/Unit/Analysis/RuleSectionTest.php` reads that list from PHP, so the two cannot drift.

## Adding a section

A section is what the sidebar lists. It does not need a collector: Alpine, Magewire, the
data layer and Web Vitals read the live page and have none.

1. An entry in `SECTIONS` in `src-js/src/sections.js`: `id`, `label`, a `lead` that says what
   the panel is for, and `graded: false` when no rule can produce a finding for it.
2. Its badge in `countFor()` in the same file, or `null` for none.
3. Its panel in `src-js/src/template.js`, inside `isSection('<id>')`. Sub views use
   `subTabs()` from `tabs.js`.
4. An option in `Model\Config\Source\Sections`, with the same id, so it can be switched off.
   Findings and Overview are left out of that list on purpose.

The browser suite walks every section and every sub view, so a new one is checked for a
binding that throws as soon as it is in the list. That walk does not wait for the section's
rows or look at them, so a section that renders empty passes it. Give a new section a test of
its own that waits for its items and checks what they show. A section that reads something
the test store lacks, as Magewire does, gets a stand-in installed before the page's scripts.

## Adding a rule

Implement `Api\RuleInterface` and register it in the rules array in `etc/di.xml`. A rule that
throws is skipped and logged rather than taking the profile with it.

A rule returns `Analysis\Finding` objects. Each carries a severity, a message, where it came
from, what to check next, and the section and filter holding its evidence. Point the action
at a filter that actually narrows: mapping `repeated` to `all` is no filter at all, which is
a mistake this codebase has already made once.

Thirteen rules ship, producing nineteen kinds of finding. `RequestErrorRule`,
`RepeatedQueryRule`, `SeoCanonicalRule` and `SeoHeadingRule` emit two each, and
`SeoSchemaOfferRule` three.

## The profile

One JSON file per request under `var/siteation_debugbar/`, `0600` inside a `0700` directory,
pruned to 20 files or 60 minutes.

Retention is enforced twice. `ProfileStore::tidy()` sweeps on a write and when the history
endpoint is read, and `get()` refuses anything past the age bound whether or not a sweep has
reached it. `get()` refuses rather than deletes: the MCP tools read through the same path and
are advertised as read only.

`Model\Redactor` masks sensitive keys at record time, bounds depth and item counts, and
strips string literals from SQL. `src-js/src/redact.js` mirrors it for the Alpine section,
which reads live objects rather than a stored profile and therefore has to apply the policy
itself.

**Query shapes ignore numbers as well as quoted values**, because Magento interpolates ids
unquoted and an N+1 made of them was invisible otherwise. Identifiers are protected, so `t1`
is not `t2`, and `LIMIT 10` and `LIMIT 100` are deliberately one shape.

## The gate and the endpoints

`RequestEligibility::allows()` decides whether a request is profiled. `allowsRead()` decides
whether one may be read. Three controllers call `allowsRead()` rather than repeating the
check, because an endpoint that hands out a profile to someone the bar would not have
collected for is a way around the gate rather than a thing behind it.

Three endpoints, all behind the same gate: `profile/view` for one profile,
`profile/history` for the list, `profile/compare` for the diff. Anything that hands out
profile ids sits behind the same check as the thing that hands out profiles.

`Model\AccessKey` is what makes a live site possible. `Config::MIN_ACCESS_KEY_LENGTH` is 32;
below that the bar refuses to run rather than treating the key as absent, since absent means
keyless. `Model\Config\Backend\AccessKey` refuses it on save so the refusal is visible, and
`Model\AccessAttempts` stops answering an address that offers ten wrong keys inside fifteen
minutes.

`Model\ClientAddress` is the one definition of who a request came from, `REMOTE_ADDR` and
never a forwarded header. The allowlist and the lockout both read it, because a difference
between them would be a way around one of the two.

## The bar

Sources in `src-js/src/`, output committed to `view/base/web/`. Installing the module needs
no build step, and that is deliberate.

```
cd src-js
npm install
npm run build         # or npm run dev, which watches the main bundle
```

`npm run dev` builds `early.js` once and then watches the main bundle only. Editing
`early.js` during a watch session needs another `npm run build`.

**The host is a custom element**, `<siteation-debugbar>`, written before `</body>` alongside
the profile JSON and the module script. It mounts itself in `connectedCallback`, so the tag
name is the only thing `BarInjector`, `debugbar.js` and `early.js` have to agree on.

**A shadow root** keeps the bar's styles off the store and the store's styles off the bar,
and hides the bar's markup from the theme's Alpine.

**Its own bundled Alpine**, the CSP build, under a `data-ndb-` prefix, started with
`Alpine.initTree(root)` and never `Alpine.start()`. A full start installs a document wide
mutation observer that would claim the host theme's `@click` shorthands and bind every
handler twice.

**No inline script or style.** The profile travels as `<script type="application/json">` and
everything else is an external file, so `Magento_Csp` needs no nonce and no `unsafe-inline`.

**Only summaries are embedded**, about 1.5 kB. Section payloads are fetched from
`profile/view` on first open.

File by file: `state.js` is the Alpine component, `template.js` the markup, `sections.js` the
section list, `header.js` the header used by both the dock and the sheet, `palette.js` the
command list, `alpine.js` and `magewire.js` the two live readers, `early.js` the request
watcher and error capture that loads in the head. `nav.js` draws the sidebar, `tabs.js` the
sub views, `dock.js` keeps the collapsed bar inside the screen, `requests.js` brings the
early watcher's requests into the bar, and `transport.js` is every JSON read the bar makes.

`seo.js` holds the SEO checks as plain functions that take a `Document`, plus an environment
for what only a browser can answer (is it visible, how big is it drawn, where is the first
screen). `seo-page.js` is the live half: it reads the real document, keeps the elements it
found out of the bar's reactive state, and draws and removes the outlines. A new check goes in
`seo.js` with a fixture in `test/seo.test.js`.

`Collector\SeoCollector` is the server's half. It parses the response with `DOMDocument` in
`finalize()`, after the page has rendered and before the bar is injected, and keeps what the
HTML told search engines. Its checks mirror the ones in `seo.js` where both read the same tag,
so a canonical found by one is found by the other: `rel` is a token list matched without
case, and headings inside a `<template>` do not count. The SEO rules read only its summary,
which is embedded in every page, so anything long goes in the payload. `serverVersusLive()`
in `seo.js` compares that summary with the live reading, so a value both sides cut (the server
keeps 300 characters, the bar 160) is compared up to the shorter cut. `ProfileComparer` lists
the summary fields that differ between two profiles, already formatted, so the bar, the
report and MCP print the same values.

`schema.js` is the Schema view: it reads JSON-LD and microdata into one entity shape and
checks them against `RICH_RESULT_RULES`, one table of required and recommended properties per
type with the Google page each came from. When Google changes a rule, change that table and
its test in `test/schema.test.js`.

`datalayer.js` holds the Data layer checks, as plain functions over the pushes early.js
records; `datalayer-page.js` reads the buffer, `window.google_tag_manager` and the tab's
session storage. The recorder itself is in `early.js`, because it has to be in place before
the page's tags load. Its tests in `test/early.test.js` run the real file in a `vm` context,
including a push replaced the way GTM replaces it.

`vitals.js` works out the Web Vitals from performance entries, as plain functions: LCP's
last candidate, CLS's session windows, INP's 98th percentile, each rated against
`THRESHOLDS`. `vitals-page.js` keeps a `PerformanceObserver` with `buffered: true` on each
entry type, so the bar needs nothing in `early.js` for them, and keeps the elements the rows
point at. It tells the bar's own nodes apart by its host element, which is what the browser
reports for anything inside the shadow root.

The admin edit link has a server half. `Model\AdminEditLink` names the entity from the
storefront request's route and id parameter and points at the admin route
`siteation_debugbar/entity/edit`. It builds that URL from configuration rather than through
the backend URL model, whose session would otherwise start inside the storefront's.
`Controller\Adminhtml\Entity\Edit` is a secret key public action that checks the target's own
ACL resource and redirects through the backend URL model, which adds the key. Besides the
entities it has two settings targets, `design_config` and `catalog_config`, for the screens
the SEO defaults and canonical switches live on; `AdminEditLink::forTarget()` links to any
of them.

`Model\SeoSources` says where each SEO value came from. It follows the rule Magento's own code
uses (`Catalog\Helper\Product\View`, `Catalog\Block\Category\View`, `Cms\Block\Page`, and
`Framework\View\Page\Config` and `Title` for the defaults and the title prefix and suffix),
predicts the value, and compares it with what SeoCollector read. The product and category
come from the registry, as the controller left them, so there is no dependency on the
catalog module and nothing on a full page cache hit. When Magento changes one of those
rules, change it here. It also states the product's final price in both tax modes and
whether it is salable, which `SeoSchemaOfferRule` checks the structured data's offers
against.

## MCP

`bin/magento siteation:debugbar:mcp`, hand rolled JSON-RPC 2.0 over newline delimited stdio,
six read only tools. It starts in about 0.2 seconds because it only reads files.

| Tool | Class |
| --- | --- |
| `list_debug_profiles` | `Mcp\Tool\ListProfiles` |
| `get_debug_findings` | `Mcp\Tool\GetFindings` |
| `get_debug_profile_section` | `Mcp\Tool\GetSection` |
| `inspect_debug_queries` | `Mcp\Tool\InspectQueries` |
| `compare_debug_profiles` | `Mcp\Tool\CompareProfiles` |
| `get_debug_seo` | `Mcp\Tool\GetSeo` |

Add a tool by implementing `Api\McpToolInterface` and registering it in the tools array in
`etc/di.xml`. Shaping belongs in `Presentation\McpProfilePresenter`, which bounds every
response by item count and byte budget and labels the payload as recorded data.

**The presenter's envelope is built inside the byte budget**, so anything added to it is paid
for out of the response rather than pushing it over.

## Testing

```
vendor/bin/phpcs  --standard=<pkg>/phpcs.xml.dist <pkg>
vendor/bin/phpstan analyse -c <pkg>/phpstan.neon.dist
vendor/bin/phpunit --configuration <pkg>/phpunit.xml.dist \
    --bootstrap vendor/autoload.php                            # 304 tests
<pkg>/dev/smoke https://your-store.test admin                  # 31 checks over HTTP
cd <pkg>/src-js && npm test                                    # 163, no store needed
cd <pkg>/src-js && npm run test:browser                        # 34, needs the store up
```

**The supported PHP range is checked separately**, because `phpstan.neon.dist` has to keep
working with the PHPStan a Magento install carries, and that one is pinned to 1.x by Magento
and by rector. `phpstan-versions.neon.dist` layers the range from `composer.json` on top of
it and needs PHPStan 2.1 or newer, so bring your own and run it from the Magento root, where
it finds the autoloader:

```
composer global require phpstan/phpstan:^2.2
~/.composer/vendor/bin/phpstan analyse -c <pkg>/phpstan-versions.neon.dist
```

That pass is what says the constraint is honest. It reports a typed class constant or a
`json_validate()` as unavailable rather than waiting for a 8.2 install to find it at runtime.
Change the constraint in `composer.json` and change the range beside it.

### CI

`.github/workflows/ci.yml` runs every check above that needs no store, on each pull request
and on main: PHPUnit and PHPStan on PHP 8.2 to 8.5, the PHPStan range pass and phpcs once, the
JS unit tests, and a fresh `npm run build` that fails when `view/base/web` differs from what
is committed. phpcs fails on errors and reports warnings. The smoke and browser suites need a
store, so they stay manual.

There is no shop in CI. `dev/ci` is a small Composer project that installs Magento from the
Mage-OS public mirror, so no Magento keys are needed, plus PHPUnit, PHPStan 2 and the Magento
coding standard. The workflow checks the module out at `module/` and copies `dev/ci` to
`host/` beside it. `dev/ci/bootstrap.php` registers the generator Magento's own unit tests
use, so factories that only exist once a store generates them, such as `RawFactory`, can be
mocked and analysed. To reproduce a run locally:

```
mkdir ci && git clone <repo> ci/module && cp -R ci/module/dev/ci ci/host
composer install -d ci/host && cd ci
host/vendor/bin/phpunit -c module/phpunit.xml.dist --bootstrap host/bootstrap.php
host/vendor/bin/phpstan analyse -c module/phpstan.neon.dist --autoload-file host/bootstrap.php
```

### dev/smoke

```
dev/smoke <base-url> [admin-path]
dev/smoke https://your-store.test admin
```

An end to end check over HTTP, needing `bash`, `curl` and `python3`. It loads the cart page
and checks the bar is injected the way it should be (profile header, the early watcher, the
profile embedded as data with summaries only, the value policy and editor root), reads that
profile back through `profile/view` section by section, including the SEO facts and the
markdown format, lists the history, compares two stored profiles, refuses bad ids, and checks
that the admin, GraphQL and REST are profiled with their bodies untouched and that the bar's
own endpoint is not profiled. The admin path defaults to `admin`.

Run it against a store in developer mode with no access key, or every check that needs the
profile header fails. A check that cannot run, such as a compare on a store holding only one
profile, is counted as skipped rather than passed. It exits non-zero when anything fails, and
64 when no URL is given.

### dev/docs

`php dev/docs` renders `docs/user-guide.md` and `docs/developer-guide.md` to the HTML beside
them. See [Documentation](#documentation).

Magento's integration framework is deliberately not used. It needs its own database and
install and runs in minutes; `dev/smoke` drives a real store over HTTP across all four areas
in seconds and asserts the same regressions.

**The browser suite is the one that catches a binding that throws.** `early.js` watches
`console.warn` for every Alpine on the page, including the bar's own, and the suite walks
every section and sub-tab and asserts that buffer is empty. A throwing binding renders as an
empty element and says nothing otherwise. Two of the tests run under an injected policy that
forbids `unsafe-eval`, because the store's own policy is report-only on most pages and the
violations the bar used to commit were reported and never blocked.

Two habits that suite enforces: the header is built once and used twice, so a header selector
without `.ndb-sheet` matches both; and selecting a section starts work, so wait for the state
rather than for a length of time.

When looking at layout in a browser, measure geometry with JavaScript before diagnosing from
a screenshot. Screenshots are scaled and have misled more than once.

## Adding a setting

1. A field in `etc/adminhtml/system.xml`, under the existing `general` group.
2. A default in `etc/config.xml`.
3. An `XML_PATH_` constant and a resolved property in `Model\Config`, set inside `resolve()`.

Settings live at `siteation_debugbar/general/*` under a Siteation tab, deliberately not under
Advanced > Developer: Magento hides the whole `dev` section in production mode, which is
exactly where the access key makes the bar usable.

One group rather than several, because every field's `depends` on Enabled would otherwise
become a cross group dependency.

## Traps that cost hours

These are the ones that have actually bitten. Check them before believing a bug is real.

**Stale artifacts, in order of likelihood.**

1. **The interception cache.** `cache:clean config` does not reach it. After adding or
   changing a plugin, run `cache:flush` or the plugin silently never runs.
2. **Generated interceptors.** Developer mode creates them once and never rechecks, so
   changing a constructor gives `Too few arguments ... generated/code/.../Interceptor.php`.
   Fix with `rm -rf generated/code/Siteation`.
3. **`generated/metadata`.** Adding an item to a `di.xml` argument array survives both of the
   above. It takes `rm -rf generated/metadata` as well.
4. **Static assets.** Asset URLs carry the built file's mtime, so a rebuilt bundle gets a new
   URL. If the bar looks unchanged after a build, hard reload.

**PHP and Magento.**

- An interface plugin fires **once per implementing object in the chain**, not once per
  logical operation. `LoggerInterface` resolves to `LoggerProxy`, which delegates to another
  implementer, so every query was counted twice for months.
- `preg_replace` reads backslashes in the **replacement** as escapes, so injecting a payload
  containing PHP class names corrupts it silently. Use `preg_replace_callback`.
- Two `<comment>` elements on one `system.xml` field cancel each other out: Magento collapses
  the repeat into an array and renders neither.
- `Cache-Control: private` is not a milder `no-store` to Magento's Varnish. It means a 24 hour
  hit-for-pass that tag invalidation cannot clear.
- The cookie manager resolves its domain through the store, so it cannot be used at the top of
  `launch()`: there is no store yet. Issue cookies after `proceed()`.
- Magento hides the whole `dev` configuration section in production mode. The check runs
  against the structure path, not the stored one.

**The bar.**

- Inside a shadow root, `rem` resolves against the **document** root. Size in `px`.
- A shadow root isolates the bar from the page, not from itself. Generic class names collide.
- `x-show` **evaluates everything inside it while hidden**, so a panel bound to state that
  starts as `null` throws once per binding on every page load, invisibly. Use `x-if` for a
  panel that has no data yet. `x-show` also defers every reveal after the first through a
  `setTimeout`, so nothing can be timed against it.
- An `x-for` variable that shares a name with a component property silently redirects every
  write inside the loop. Nothing throws.
- `Object.keys` on Alpine's merged scope proxy returns `[]`. Use `Reflect.ownKeys`.
- `Alpine.$data(el)` folds every parent scope into the child. For one component's own state,
  read `el._x_dataStack[0]`.
- Alpine 3.14.3, which Hyvä ships, has no `setErrorHandler` and no `injectMagics`. Expression
  errors have to be read from `console.warn`.
- Writing to a key named `__proto__` on a plain object sets the prototype instead of the key,
  so the value disappears. Use `Object.create(null)` for anything built from page data.
- A background tab throttles timers and stops `requestAnimationFrame`, so anything timing
  sensitive measures as broken there.

**Conventions.**

- A query's call site is stored under `callsite`, one word, relative to the application root.
- Label over value beats label beside value. `facts()` in `facts.js` builds the grid.
- No tiny type. 15px body, 14px mono, 12px floor. The uppercase micro label is 12px.
- An editor URL template writes `://file%f`, never `://file/%f`: `%f` is absolute, so the
  second form carries two slashes and Zed ignores it silently.

## Testing a crash

There is no fixture for a 500, on purpose: a route that throws does not belong on a working
instance. Four files under `app/code/Siteation/BoomTest` recreate one, a controller whose
`execute()` throws. Give it a real return type; `never` breaks Magento's generated interceptor
before the exception ever happens. Delete it afterwards.

## Documentation

The two guides are Markdown, and their HTML is generated:

```
php dev/docs
```

Edit the `.md`. The `.html` is a view of it, and `dev/docs` is the only place the two can
differ. It needs no dependencies, for the same reason the bar ships prebuilt.

It understands the Markdown the guides use: headings, paragraphs, lists without nesting,
fenced code, tables, inline code, bold, links and images. Write an image reference style,
`![alt][name]` with a `[name]: ../assets/file.webp "Title"` line at the end of the guide, so
the same path works on GitHub and from the rendered page.

The screenshots live in `assets/` and are WebP. The README and the user guide both use
them.

## Releasing

1. Everything green: phpcs, phpstan, phpunit, smoke, both JS suites.
2. `npm run build`, and commit the output if it changed.
3. `php dev/docs` if a guide changed.
4. A dated section in `CHANGELOG.md`.
5. An annotated tag, plain semver with no `v` prefix, matching the other Siteation packages.
6. `git push origin main && git push origin <tag>`.

There are no GitHub Actions and none are wanted: tests run locally, the build output is
committed, and Packagist reads the tag through a webhook.
