<?php

namespace App\Policies;

use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ProjectMemberPolicy
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
    public function view(User $user, ProjectMember $projectMember): bool
    {
        return $projectMember->project->projectMembers()->where('user_id', $user->id)->exists();
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user, $project): bool
    {
        return $this->isPM($user, $project);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ProjectMember $projectMember): bool
    {
       return $this->isPM($user, $projectMember->project);
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ProjectMember $projectMember): bool
    {
        return $this->isPM($user, $projectMember->project);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ProjectMember $projectMember): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ProjectMember $projectMember): bool
    {
        return false;
    }
      protected function isPM(User $user, $project)
    {
        return $project->projectMembers()
            ->where('user_id', $user->id)
            ->where('role_in_project', 'project_manager')
            ->exists();
    }
}
