<?php

declare(strict_types=1);

namespace Siteation\DebugBar\Model;

use Psr\Log\LoggerInterface;
use Siteation\DebugBar\Api\SectionViewInterface;
use Siteation\DebugBar\Model\Config\Source\Sections;
use Stringable;
use Throwable;

/**
 * Sections other modules add to the bar, as their di.xml declares them.
 *
 * Declared as arrays rather than as classes, so a section that only reads the live page
 * needs no PHP at all:
 *
 *     <item name="c365" xsi:type="array">
 *         <item name="label" xsi:type="string" translate="true">Commerce365</item>
 *         <item name="lead" xsi:type="string" translate="true">What the page was priced with.</item>
 *         <item name="graded" xsi:type="boolean">true</item>
 *         <item name="view" xsi:type="object">Vendor\Module\Presentation\PricesView</item>
 *         <item name="scripts" xsi:type="array">
 *             <item name="head" xsi:type="array">
 *                 <item name="events" xsi:type="string">Vendor_Module::js/early.js</item>
 *             </item>
 *             <item name="body" xsi:type="array">
 *                 <item name="reader" xsi:type="string">Vendor_Module::js/section.js</item>
 *             </item>
 *         </item>
 *     </item>
 *
 * The item name is the section id. A collector feeding the section is registered under
 * the same id, because that id is what the Sections setting switches.
 *
 * A declaration that is wrong is left out and logged. A typo in another module's di.xml
 * must cost that module its section, never the bar.
 */
class ContributedSections
{
    private const ID_PATTERN = '/^[a-z][a-z0-9_]{0,31}$/';

    /**
     * Collector keys that are not panel ids, but are still taken: a section by one of
     * these names would draw over a built in collector's data.
     *
     * @var list<string>
     */
    private const TAKEN = ['findings', 'overview', 'request', 'interception'];

    /**
     * An asset id the way Magento names one, Vendor_Module::path, kept to the characters a
     * file in a module's web directory actually has.
     */
    private const ASSET_PATTERN = '#^[A-Za-z0-9]+_[A-Za-z0-9]+::[A-Za-z0-9_\-./]+\.js$#';

    /**
     * @var array<string, array{
     *     id: string,
     *     label: string,
     *     lead: string,
     *     graded: bool,
     *     view: ?SectionViewInterface,
     *     head: list<string>,
     *     body: list<string>
     * }>|null
     */
    private ?array $resolved = null;

    /**
     * @param array<string, mixed> $sections keyed by section id
     */
    public function __construct(
        private readonly LoggerInterface $logger,
        private readonly Config $config,
        private readonly array $sections = []
    ) {
    }

    /**
     * @return array<string, array{
     *     id: string,
     *     label: string,
     *     lead: string,
     *     graded: bool,
     *     view: ?SectionViewInterface,
     *     head: list<string>,
     *     body: list<string>
     * }>
     */
    public function all(): array
    {
        return $this->resolved ??= $this->resolve();
    }

    /**
     * @return list<string>
     */
    public function ids(): array
    {
        return array_keys($this->all());
    }

    /**
     * What the bar needs to list them: everything but the view and the scripts.
     *
     * @return list<array{id: string, label: string, lead: string, graded: bool}>
     */
    public function definitions(): array
    {
        return array_values(array_map(
            static fn (array $section): array => [
                'id' => $section['id'],
                'label' => $section['label'],
                'lead' => $section['lead'],
                'graded' => $section['graded'],
            ],
            $this->all()
        ));
    }

    /**
     * The asset ids of every switched on section's scripts, in declaration order.
     *
     * @param 'head'|'body' $where
     * @return list<string>
     */
    public function scripts(string $where): array
    {
        $assets = [];

        foreach ($this->all() as $id => $section) {
            if ($this->config->collects($id)) {
                array_push($assets, ...$section[$where]);
            }
        }

        return $assets;
    }

    /**
     * The profile with each contributed section's view added, for the bar to draw.
     *
     * Views are built when a profile is read, not when it is written, so a stored profile
     * stays data and a module that changes how it draws a section changes it for profiles
     * already on disk too.
     *
     * @param array<string, mixed> $profile
     * @return array<string, mixed>
     */
    public function withViews(array $profile): array
    {
        foreach ($this->all() as $id => $section) {
            if ($section['view'] === null || !$this->config->collects($id)) {
                continue;
            }

            $profile['sections'][$id] ??= ['label' => $section['label'], 'summary' => [], 'payload' => []];
            $profile['sections'][$id]['view'] = $this->view($section['view'], $id, $profile);
        }

        return $profile;
    }

    /**
     * @param array<string, mixed> $profile
     * @return array<string, mixed>
     */
    private function view(SectionViewInterface $view, string $id, array $profile): array
    {
        try {
            return $view->view($profile);
        } catch (Throwable $exception) {
            $this->logger->warning(sprintf(
                'Siteation_DebugBar section %s could not be drawn: %s',
                $id,
                $exception->getMessage()
            ));

            return ['blocks' => [[
                'type' => 'note',
                'tone' => 'bad',
                'text' => 'This section could not be drawn: ' . $exception->getMessage(),
            ]]];
        }
    }

    /**
     * @return array<string, array{
     *     id: string,
     *     label: string,
     *     lead: string,
     *     graded: bool,
     *     view: ?SectionViewInterface,
     *     head: list<string>,
     *     body: list<string>
     * }>
     */
    private function resolve(): array
    {
        $taken = [...self::TAKEN, ...array_keys(Sections::BUILT_IN)];
        $resolved = [];

        foreach ($this->sections as $id => $declared) {
            $id = (string) $id;
            $problem = match (true) {
                preg_match(self::ID_PATTERN, $id) !== 1 => 'its id must be lower case letters, digits and underscores',
                in_array($id, $taken, true) => 'its id is already a built in section',
                !is_array($declared) => 'it is not an array',
                $this->text($declared['label'] ?? null) === '' => 'it has no label',
                isset($declared['view']) && !$declared['view'] instanceof SectionViewInterface
                    => 'its view does not implement ' . SectionViewInterface::class,
                default => null,
            };

            if ($problem !== null || !is_array($declared)) {
                $this->logger->warning(sprintf('Siteation_DebugBar section %s was left out: %s.', $id, $problem));

                continue;
            }

            $scripts = is_array($declared['scripts'] ?? null) ? $declared['scripts'] : [];
            $view = $declared['view'] ?? null;

            $resolved[$id] = [
                'id' => $id,
                'label' => $this->text($declared['label']),
                'lead' => $this->text($declared['lead'] ?? null),
                'graded' => (bool) ($declared['graded'] ?? false),
                'view' => $view instanceof SectionViewInterface ? $view : null,
                'head' => $this->assets($id, $scripts['head'] ?? []),
                'body' => $this->assets($id, $scripts['body'] ?? []),
            ];
        }

        return $resolved;
    }

    /**
     * di.xml hands a translated string over as a Phrase.
     */
    private function text(mixed $value): string
    {
        return is_string($value) || $value instanceof Stringable ? trim((string) $value) : '';
    }

    /**
     * @return list<string>
     */
    private function assets(string $id, mixed $declared): array
    {
        $assets = [];

        foreach (is_array($declared) ? $declared : [] as $asset) {
            if (is_string($asset) && preg_match(self::ASSET_PATTERN, $asset) === 1 && !str_contains($asset, '..')) {
                $assets[] = $asset;

                continue;
            }

            $this->logger->warning(sprintf(
                'Siteation_DebugBar section %s: script %s was left out, it is not a Vendor_Module::path.js asset.',
                $id,
                is_string($asset) ? $asset : get_debug_type($asset)
            ));
        }

        return $assets;
    }
}
