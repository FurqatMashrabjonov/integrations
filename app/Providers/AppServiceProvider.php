<?php

namespace App\Providers;

use ReflectionClass;
use FilesystemIterator;
use RecursiveIteratorIterator;
use RecursiveDirectoryIterator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        $this->bindServicesAutomatically();
        $this->bindRepositoriesAutomatically(); // 🔁 NEW
    }

    private function bindServicesAutomatically(): void
    {
        $servicesPath     = app_path('Services');
        $serviceNamespace = 'App\\Services\\';

        $this->bindClassesInDirectory($servicesPath, $serviceNamespace);
    }

    private function bindRepositoriesAutomatically(): void
    {
        $repositoriesPath     = app_path('Repositories');
        $repositoryNamespace  = 'App\\Repositories\\';

        $this->bindClassesInDirectory($repositoriesPath, $repositoryNamespace);
    }

    private function bindClassesInDirectory(string $directory, string $namespace): void
    {
        if (!is_dir($directory)) {
            return;
        }

        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS)
        );

        foreach ($files as $file) {
            if ($file->getExtension() !== 'php') {
                continue;
            }

            $relativePath = substr($file->getPathname(), strlen($directory) + 1);
            $className    = $namespace . str_replace(['/', '\\', '.php'], ['\\', '\\', ''], $relativePath);

            if (!class_exists($className)) {
                continue;
            }

            $reflection = new ReflectionClass($className);

            if ($reflection->isAbstract() || $reflection->isInterface()) {
                continue;
            }

            $interfaces = $reflection->getInterfaces();

            if (empty($interfaces)) {
                $this->app->bind($className, $className);
            } else {
                foreach ($interfaces as $interface) {
                    $this->app->bind($interface->getName(), $className);
                }
            }
        }
    }
}
