<?php

namespace App\Policies;

use App\Models\TimeLog;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TimeLogPolicy
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
    public function view(User $user, TimeLog $timeLog): bool
    {
        return $timeLog->task->project->projectMembers()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, $project): bool
    {
        return $this->hasAccess($user, $project);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TimeLog $timeLog): bool
    {
        return $timeLog->user_id === $user->id || $this->isPM($user, $timeLog->task->project);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, TimeLog $timeLog): bool
    {
        return $timeLog->user_id === $user->id || $this->isPM($user, $timeLog->task->project);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, TimeLog $timeLog): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, TimeLog $timeLog): bool
    {
        return false;
    }
    protected function hasAccess(User $user, $project)
    {
        return $project->projectMembers()->where('user_id', $user->id)->exists();
    }

    protected function isPM(User $user, $project)
    {
        return $project->projectMembers()
            ->where('user_id', $user->id)
            ->where('role_in_project', 'project_manager')
            ->exists();
    }
}
