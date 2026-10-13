<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Magento\Framework\View\Layout;
use SimpleXMLElement;

/**
 * The blocks that made a layout uncacheable, and where each one was declared.
 *
 * Layout::isCacheable() answers with one boolean after merging every handle into one
 * document, and the merge keeps no record of which file a node came from. A developer told
 * "this page is not cached" needs the block and the file, so this reads the files of each
 * loaded handle through LayoutFiles and looks for the block in each. Handles are searched
 * in load order, so a block declared in default.xml is reported there rather than in a
 * handle that only references it.
 *
 * Runs only when the bar is collecting and only for blocks that are already known to be
 * uncacheable, which on a healthy page is none.
 */
class UncacheableBlocks
{
    public function __construct(
        private readonly LayoutFiles $layoutFiles,
        private readonly CallSiteResolver $callSites
    ) {
    }

    /**
     * @return list<array{name: string, handle: ?string, file: ?string}>
     */
    public function find(Layout $layout): array
    {
        $root = $layout->getNode();

        if (!$root instanceof SimpleXMLElement) {
            return [];
        }

        $names = [];

        // The same query Layout::isCacheable() runs, so the two cannot disagree.
        foreach ($root->xpath('//block[@cacheable="false"]') ?: [] as $element) {
            $name = method_exists($element, 'getBlockName') ? $element->getBlockName() : (string) $element['name'];

            if ($name !== false && $name !== '' && $layout->hasElement($name)) {
                $names[$name] = true;
            }
        }

        if ($names === []) {
            return [];
        }

        $handles = $layout->getUpdate()->getHandles();
        $blocks = [];

        foreach (array_keys($names) as $name) {
            $blocks[] = ['name' => (string) $name, ...$this->source((string) $name, $handles)];
        }

        return $blocks;
    }

    /**
     * @param list<string> $handles
     * @return array{handle: ?string, file: ?string}
     */
    private function source(string $name, array $handles): array
    {
        foreach ($handles as $handle) {
            foreach ($this->layoutFiles->forHandle($handle) as $file) {
                $path = $file['path'];
                $xml = $this->layoutFiles->parse($path);

                if ($xml === false) {
                    continue;
                }

                $query = sprintf('//block[@name=%s][@cacheable="false"]', $this->literal($name));

                if (($xml->xpath($query) ?: []) !== []) {
                    return ['handle' => $handle, 'file' => $this->callSites->relativePath($path)];
                }
            }
        }

        return ['handle' => null, 'file' => null];
    }

    /**
     * A block name as an XPath string literal. Names are the developer's own and rarely
     * hold a quote, but one that does must not end the expression.
     */
    private function literal(string $value): string
    {
        if (!str_contains($value, '"')) {
            return '"' . $value . '"';
        }

        if (!str_contains($value, "'")) {
            return "'" . $value . "'";
        }

        return 'concat("' . str_replace('"', '", \'"\', "', $value) . '")';
    }
}
