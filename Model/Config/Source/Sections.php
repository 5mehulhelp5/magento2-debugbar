<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;
use Siteation\DebugBar\Model\ContributedSections;

/**
 * The sections a developer can turn off.
 *
 * Findings and the overview are absent deliberately. The overview is how a stored profile is
 * identified by the history, the report and the MCP tools, and the findings are the answer
 * the rest of the bar is evidence for; neither is clutter anyone wants rid of.
 *
 * The ids match the ones the bar names its panels by, because the same setting decides what
 * is collected and what is drawn.
 *
 * Sections other modules add are offered after the built in ones, under their own label.
 */
class Sections implements OptionSourceInterface
{
    /**
     * Also the ids a section from another module may not take.
     *
     * @var array<string, string>
     */
    public const BUILT_IN = [
        'timeline' => 'Timeline',
        'queries' => 'Queries',
        'blocks' => 'Blocks',
        'observers' => 'Observers',
        'events' => 'Events',
        'cache' => 'Cache',
        'pagecache' => 'Page cache',
        'layout' => 'Layout',
        'plugins' => 'Plugins',
        'alpine' => 'Alpine',
        'magewire' => 'Magewire',
        'seo' => 'SEO',
        'datalayer' => 'Data layer',
        'vitals' => 'Web Vitals',
        'history' => 'History',
    ];

    public function __construct(private readonly ContributedSections $contributed)
    {
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    public function toOptionArray(): array
    {
        $options = [];

        foreach (self::BUILT_IN as $value => $label) {
            $options[] = ['value' => $value, 'label' => __($label)->render()];
        }

        foreach ($this->contributed->all() as $id => $section) {
            $options[] = ['value' => $id, 'label' => $section['label']];
        }

        return $options;
    }
}
