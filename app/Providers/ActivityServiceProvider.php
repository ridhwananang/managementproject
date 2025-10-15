<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Model;
use App\Observers\ActivityObserver;

class ActivityServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        // path to models
        $modelsPath = app_path('Models');

        if (!is_dir($modelsPath)) {
            return;
        }

        $files = File::allFiles($modelsPath);

        foreach ($files as $file) {
            // build full class name from path
            $relative = str_replace([$modelsPath . DIRECTORY_SEPARATOR, '.php'], '', $file->getRealPath());
            // convert path separators to namespace separators
            $class = 'App\\Models\\' . str_replace(DIRECTORY_SEPARATOR, '\\', str_replace($modelsPath . DIRECTORY_SEPARATOR, '', $file->getRelativePathname()));
            $class = str_replace('.php', '', $class);

            if (!class_exists($class)) {
                continue;
            }

            // Skip ActivityLog itself (to avoid self-observing)
            if ($class === \App\Models\ActivityLog::class) {
                continue;
            }

            try {
                if (is_subclass_of($class, Model::class)) {
                    $class::observe(ActivityObserver::class);
                }
            } catch (\Throwable $e) {
                // silently ignore classes that can't be observed
                // you can log this if desired
            }
        }
    }
}
