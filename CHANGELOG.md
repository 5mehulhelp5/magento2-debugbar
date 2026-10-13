# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The **SEO server half**, first part
  ([#10](https://github.com/Siteation/magento2-debugbar/issues/10)):
  a profile of a storefront page now keeps what the HTML the server sent told search
  engines: title, description, canonical links, robots meta tag and header, language and
  hreflang alternates, headings, Open Graph and X tags, and structured data types. Five SEO
  findings come from it: no canonical on a product or category page, more than one
  canonical, noindex on a page meant to be found, more than one H1, and no H1. A new MCP tool,
  `get_debug_seo`, returns the facts and the findings together, and the markdown report has
  an SEO table. A finding opens the SEO view that shows the same thing on the live page.

- The **SEO server half**, second part
  ([#10](https://github.com/Siteation/magento2-debugbar/issues/10)):
  the SEO overview puts the HTML the server sent next to the live page and marks what a
  script changed after load, which a crawler that does not run JavaScript never sees.
  Compare, the markdown report and `compare_debug_profiles` list the SEO facts that differ
  between two requests.

- The **SEO server half**, third part
  ([#10](https://github.com/Siteation/magento2-debugbar/issues/10)):
  for the title, description, H1, canonical and robots on a product, category or CMS page,
  the SEO overview names the attribute, CMS field or setting Magento takes it from, with a
  link to edit it, and marks a value the page does not match as set elsewhere. The report
  and `get_debug_seo` carry the same. Three new findings check a product page's structured
  data offers against the product: a price it does not sell for, another currency, and a
  stock status that says the opposite of whether it can be bought.

- A **Layout** section
  ([#9](https://github.com/Siteation/magento2-debugbar/issues/9)):
  the layout handles the request loaded, in the order Magento merged them, with the XML
  files behind each one and the module or theme each file comes from. Handles pulled in by
  an `<update handle>` are listed after the handle that pulled them in. A separate layout,
  such as the one prices render through, is listed after the page's own and marked. Each
  handle links to the Blocks section, filtered to the blocks that handle put on the page.
  The Page cache section now reads layout files through the same lookup.

- A **Page cache** section
  ([#8](https://github.com/Siteation/magento2-debugbar/issues/8)):
  whether the page was served from the full page cache, stored for the next request, or
  not cached, and every reason in the order Magento checks them. Each block marked
  `cacheable="false"` is listed with the layout handle and file that declared it, and the
  headers are shown as the application offered them to the cache. A CMS page, category or
  product page that was not cached is a finding. The overview no longer guesses at a cache
  hit from an empty profile when this section can say.

- An **SEO** section, read from the live page, with five views
  ([#4](https://github.com/Siteation/magento2-debugbar/issues/4)):
  Overview (title, meta description, canonical, robots, hreflang, language, viewport,
  charset, word count and quick links), Headings, Images, Links and Social.
  Each view counts what needs a look, and the sidebar shows the total.

- A **Schema** view in the SEO section
  ([#6](https://github.com/Siteation/magento2-debugbar/issues/6)):
  JSON-LD and microdata as one list of entities, parse errors with their line,
  Google's rich result rules for the types a shop uses, a warning when one entity is
  described twice, and the markup ready to paste into Google's tools when they cannot
  reach the shop.

- A **Data layer** section
  ([#5](https://github.com/Siteation/magento2-debugbar/issues/5)),
  with Pushes, Tags and Consent views: every `dataLayer.push` from the first byte, kept
  across pages in the tab, with paths to copy and GA4 ecommerce checks; the tags on the
  page and the ones loaded twice; and the Consent Mode v2 state. Values go through the
  value policy before they are shown or kept.

- A **Web Vitals** section
  ([#7](https://github.com/Siteation/magento2-debugbar/issues/7)):
  LCP, CLS and INP, with TTFB and FCP, rated against Google's thresholds and updated as the
  page is used. It points at the LCP element, the slowest interaction's target, and the
  elements each layout shift moved. Clicks on the bar are left out of INP.

- Request entries in the head script's buffer carry `at`, the time the response arrived,
  so a data layer push can be matched to the request before it.

- **Edit this page in the admin**, on product, category and CMS pages.
  It goes through a new admin route, `siteation_debugbar/entity/edit`,
  which checks the role for that kind of page and adds the secret key when the store uses one.

- The `request` section records the `X-Robots-Tag` response header as `robots_header`
  when one is sent, because the page cannot read its own response headers.

### Changed

- A store that already chose which sections to show keeps that list,
  so the SEO, Data layer and Web Vitals sections stay off there until they are added under
  Sections in the configuration.

[Unreleased]: https://github.com/Siteation/magento2-debugbar/compare/1.2.0...main

## [1.2.0] - 2026-10-11

[1.2.0]: https://github.com/Siteation/magento2-debugbar/compare/1.1.1...1.2.0

### Added

- The collapsed bar can be moved, by dragging the grip on the left of the pill.
  Where you leave it is remembered across pages,
  and kept inside the viewport when the window resizes.
  Thanks [@wpoortman](https://github.com/wpoortman)
  ([#2](https://github.com/Siteation/magento2-debugbar/pull/2))

- The bar goes back to its edge on a double click of the grip,
  on Enter or Space while the grip is focused,
  or from the new "Put the bar back on its edge" palette command.

- Arrow keys on the grip move the bar ten pixels at a time.

### Changed

- Supported PHP is now 8.2 through 8.5, where it was 8.3 and 8.4.
  Nothing here ever needed 8.3, so the old constraint only kept the module
  off Magento installs running an older PHP.

### Fixed

- A block that returns `null` or `false` instead of a string no longer causes a 500.
  `BlockPlugin::aroundToHtml()` declared a `string` return type
  that Magento's own `AbstractBlock::toHtml()` does not.
  Thanks [@claudio-ferraro](https://github.com/claudio-ferraro)
  ([#1](https://github.com/Siteation/magento2-debugbar/pull/1))

## [1.1.1] - 2026-08-21

[1.1.1]: https://github.com/Siteation/magento2-debugbar/compare/1.1.0...1.1.1

Packaging only. No code changed.

### Added

- A LICENSE file, a maintainer in `composer.json`, and compatibility badges in the README.

### Changed

- The README is a landing page rather than the manual.

### Removed

- The development notes, which shipped inside every tarball.
  In their place, a user guide and a developer guide, rendered by `dev/docs`.

## [1.1.0] - 2026-08-21

[1.1.0]: https://github.com/Siteation/magento2-debugbar/compare/1.0.0...1.1.0

Three defects the security audit named, closed. Nothing in the interface changed.

### Security

- A profile past the age bound is refused on read, not only swept.
  Retention was enforced by deletion alone,
  so on an instance nobody is browsing a profile stayed readable by id
  for as long as its file survived.

- Every MCP response says its payload is recorded data,
  so an agent reads the captured values as evidence rather than as instructions.

- The access key needs at least 32 characters and locks out an address
  after ten wrong keys in fifteen minutes.
  The floor is applied when the configuration resolves as well as on save,
  so writing a short one straight to the database is no way around it.

## 1.0.0 - 2026-08-21

Initial release 🎉
