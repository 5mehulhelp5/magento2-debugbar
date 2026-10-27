# Siteation_DebugBarFixture

A section from another module, for the browser suite. Not part of the package, and never
for a store anyone uses.

It declares one section, `fixture`, with both halves the extension API offers: a view built
from the stored profile (`Presentation/FixtureView.php`) and a reader of the live page
(`view/base/web/js/fixture-section.js`). The browser suite's "a section from another module"
tests skip themselves when it is not installed.

```
ln -s <pkg>/dev/fixture-section app/code/Siteation/DebugBarFixture
bin/magento module:enable Siteation_DebugBarFixture
bin/magento setup:upgrade
```

Remove the link and run `setup:upgrade` again when done.
