<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        \App\Models\Project::class => \App\Policies\ProjectPolicy::class,
        \App\Models\Sprint::class => \App\Policies\SprintPolicy::class,
        \App\Models\Task::class => \App\Policies\TaskPolicy::class,
        \App\Models\TimeLog::class => \App\Policies\TimeLogPolicy::class,
        \App\Models\Attachment::class => \App\Policies\AttachmentPolicy::class,
        \App\Models\ProjectMember::class => \App\Policies\ProjectMemberPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // contoh gate tambahan (opsional)
        Gate::define('isProjectManager', function ($user) {
            return $user->role === 'Project Manager';
        });
    }
}
