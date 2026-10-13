<?php
/**
 * Autoloader for CI, where there is no shop and so no generated/ directory.
 *
 * Classes such as Magento\Framework\Controller\Result\RawFactory only exist once Magento
 * generates them. This registers the generator Magento's own unit tests use, so PHPUnit can
 * mock those classes and PHPStan can resolve them. Expects the module at ../module.
 *
 * A class Composer can find is never generated: the generator would otherwise shadow real
 * classes whose names end in Factory, such as CookieMetadataFactory.
 */
declare(strict_types=1);

use Magento\Framework\Code\Generator\Io;
use Magento\Framework\Filesystem\Driver\File;
use Magento\Framework\TestFramework\Unit\Autoloader\ExtensionAttributesGenerator;
use Magento\Framework\TestFramework\Unit\Autoloader\ExtensionAttributesInterfaceGenerator;
use Magento\Framework\TestFramework\Unit\Autoloader\FactoryGenerator;
use Magento\Framework\TestFramework\Unit\Autoloader\GeneratedClassesAutoloader;

// phpcs:ignore Magento2.Security.IncludeFile -- the autoloader, at a fixed path
$composer = require __DIR__ . '/vendor/autoload.php';

$generatedClasses = new GeneratedClassesAutoloader(
    [new ExtensionAttributesGenerator(), new ExtensionAttributesInterfaceGenerator(), new FactoryGenerator()],
    new Io(new File(), __DIR__ . '/generated/code')
);
spl_autoload_register(static function (string $class) use ($composer, $generatedClasses): void {
    if ($composer->findFile($class) === false) {
        $generatedClasses->load($class);
    }
});
