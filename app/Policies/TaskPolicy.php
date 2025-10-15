<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {
        return $task->project->projectMembers()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, $project): bool
    {
         return $this->hasAccess($user, $project, ['project_manager', 'backend', 'frontend', 'fullstack', 'uiux', 'marketing']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        return $this->hasAccess($user, $task->project, ['project_manager', 'backend', 'frontend', 'fullstack', 'uiux', 'marketing']);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        return $this->isRole($user, $task->project, 'project_manager');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Task $task): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        return false;
    }
    protected function hasAccess(User $user, $project, array $roles)
    {
        return $project->projectMembers()
            ->where('user_id', $user->id)
            ->whereIn('role_in_project', $roles)
            ->exists();
    }

    protected function isRole(User $user, $project, string $role)
    {
        return $project->projectMembers()
            ->where('user_id', $user->id)
            ->where('role_in_project', $role)
            ->exists();
    }
}
