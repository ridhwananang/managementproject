<?php

namespace App\Policies;

use App\Models\Sprint;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use App\Models\Project;


class SprintPolicy
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
    public function view(User $user, Sprint $sprint): bool
    {
        return $sprint->project->projectMembers()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, Project $project): bool
    {
        return $this->isPMorFullstack($user, $project);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Sprint $sprint): bool
    {
        return $this->isPMorFullstack($user, $sprint->project);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Sprint $sprint): bool
    {
        return $this->isPMorFullstack($user, $sprint->project);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Sprint $sprint): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Sprint $sprint): bool
    {
        return false;
    }
     protected function isPMorFullstack(User $user, Project $project)
    {
        return $project->projectMembers()
            ->where('user_id', $user->id)
            ->whereIn('role_in_project', ['project_manager', 'fullstack'])
            ->exists();
    }
}
