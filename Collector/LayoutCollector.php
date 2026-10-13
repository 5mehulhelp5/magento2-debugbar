<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Collector;

use Magento\Framework\App\ResponseInterface;
use Magento\Framework\View\Layout;
use Siteation\DebugBar\Model\CallSiteResolver;
use Siteation\DebugBar\Model\Clock;
use Siteation\DebugBar\Model\LayoutFiles;
use Siteation\DebugBar\Model\Redactor;
use SimpleXMLElement;

/**
 * The layout handles this request loaded, in order, and the files behind each one.
 *
 * "Which XML put this on the page?" is the question every Magento frontend developer asks
 * and the merged layout cannot answer, because the merge keeps no record of where a node
 * came from. The handles the page asked for can be read from the layout once it is
 * generated. The rest are found by walking the files the way the merge did, through
 * LayoutFiles: each `<update handle>` in a file is merged before that file's own content.
 * Those handles are listed after the one whose file pulled them in, with `via` naming it.
 *
 * Each block on the page is also credited to the first handle, in merge order, whose files
 * declare it, which is what lets the Blocks section be filtered by handle. That is the same
 * rule the Page cache section uses to name the handle of an uncacheable block.
 *
 * A request can generate more than one layout: prices are rendered through a small layout
 * of their own, and so are emails. The page's own layout, the one that loaded `default`,
 * is listed first and the others after it, marked as separate, rather than in the order
 * they happened to be generated, which put the price layout ahead of the page.
 *
 * The lookup reads and parses every file of every handle, so it is done in finalize(),
 * after the page has rendered, rather than in the middle of it where the time would be
 * charged to whatever block came next.
 */
class LayoutCollector extends AbstractCollector
{
    /** Block names kept for the handle filter. A page has a few hundred. */
    private const MAX_BLOCKS = 2000;

    /** Deeper than any real chain of updates; the seen list already stops a cycle. */
    private const MAX_DEPTH = 20;

    /** @var array<int, array{layout: Layout, handles: list<string>}> by object id, in generation order */
    private array $layouts = [];

    /** @var array<string, true> */
    private array $seen = [];

    /** @var list<array{handle: string, via: ?string, layout: string, files: list<array<string, string>>, block_count: int}> */
    private array $handles = [];

    /** @var array<string, string> block name to the handle that declared it */
    private array $blocks = [];

    private int $droppedBlocks = 0;

    private int $fileCount = 0;

    public function __construct(
        Redactor $redactor,
        Clock $clock,
        private readonly LayoutFiles $layoutFiles,
        private readonly CallSiteResolver $callSites,
        int $maxItems = 200
    ) {
        parent::__construct($redactor, $clock, $maxItems);
    }

    public function label(): string
    {
        return 'Layout';
    }

    public function reset(): void
    {
        parent::reset();
        $this->layouts = [];
        $this->seen = [];
        $this->handles = [];
        $this->blocks = [];
        $this->droppedBlocks = 0;
        $this->fileCount = 0;
    }

    /**
     * A layout was generated. Only its handles are read here; see the class comment.
     */
    public function generated(Layout $layout): void
    {
        $handles = [];

        foreach ($layout->getUpdate()->getHandles() as $handle) {
            $handles[] = (string) $handle;
        }

        $this->layouts[spl_object_id($layout)] = ['layout' => $layout, 'handles' => $handles];
    }

    public function finalize(ResponseInterface $response): void
    {
        $layouts = array_values($this->layouts);

        // The page first. usort is stable, so the rest keep the order they were generated in.
        $isPage = static fn (array $entry): bool => in_array('default', $entry['handles'], true);
        usort($layouts, static fn (array $left, array $right): int => $isPage($right) <=> $isPage($left));

        foreach ($layouts as $entry) {
            $kind = $isPage($entry) ? 'page' : 'separate';

            foreach ($entry['handles'] as $handle) {
                $this->walk($handle, null, $entry['layout'], $kind, 0);
            }
        }

        foreach ($this->handles as $handle) {
            $this->fileCount += count($handle['files']);
            $this->record($handle);
        }
    }

    /**
     * One handle, then every handle its files pull in, in the order the merge reads them.
     */
    private function walk(string $handle, ?string $via, Layout $layout, string $kind, int $depth): void
    {
        if (isset($this->seen[$handle]) || $depth > self::MAX_DEPTH) {
            return;
        }

        $this->seen[$handle] = true;

        // Listed before the handles it pulls in, though they merge first: a list that put
        // checkout_cart_item_renderers above checkout_cart_index would read backwards.
        $index = count($this->handles);
        $this->handles[] = ['handle' => $handle, 'via' => $via, 'layout' => $kind, 'files' => [], 'block_count' => 0];

        foreach ($this->layoutFiles->forHandle($handle) as $file) {
            $xml = $this->layoutFiles->parse($file['path']);

            foreach ($xml === false ? [] : $xml->children() as $child) {
                if (strtolower($child->getName()) === 'update' && isset($child['handle'])) {
                    $this->walk((string) $child['handle'], $handle, $layout, $kind, $depth + 1);
                }
            }

            $this->handles[$index]['files'][] = [
                'file' => $this->callSites->relativePath($file['path']),
                'module' => $file['module'],
                'theme' => $file['theme'],
            ];
            $this->handles[$index]['block_count'] += $this->credit($handle, $xml, $layout);
        }
    }

    /**
     * Credits the blocks a file declares to its handle, unless an earlier handle already
     * declared them. Only blocks that are on the page: a file can declare a block a later
     * file removes.
     *
     * @return int how many blocks this file was the first to declare
     */
    private function credit(string $handle, SimpleXMLElement|false $xml, Layout $layout): int
    {
        if ($xml === false) {
            return 0;
        }

        $credited = 0;

        foreach ($xml->xpath('//block[@name]') ?: [] as $element) {
            $name = (string) $element['name'];

            if ($name === '' || isset($this->blocks[$name]) || !$layout->hasElement($name)) {
                continue;
            }

            if (count($this->blocks) >= self::MAX_BLOCKS) {
                $this->droppedBlocks++;
                continue;
            }

            $this->blocks[$name] = $handle;
            $credited++;
        }

        return $credited;
    }

    public function summary(): array
    {
        return [
            ...parent::summary(),
            'handle_count' => count($this->handles),
            'file_count' => $this->fileCount,
            'block_count' => count($this->blocks),
            'blocks_dropped' => $this->droppedBlocks,
        ];
    }

    /**
     * The block map is kept beside the items rather than inside them. A handle such as
     * default declares more blocks than the redactor keeps of one array, and a block name is
     * a key here, where a name containing "session" would be masked as a secret.
     */
    public function payload(): array
    {
        $blocks = [];

        foreach ($this->blocks as $name => $handle) {
            $blocks[substr((string) $name, 0, 200)] = substr($handle, 0, 200);
        }

        return ['items' => $this->items, 'blocks' => $blocks];
    }
}
