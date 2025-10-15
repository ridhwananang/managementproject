<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;
use App\Models\ProjectMember;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProjectMemberController extends Controller
{
    use AuthorizesRequests;
    public function store(Request $request, Project $project)
    {
        $this->authorize('create', [ProjectMember::class, $project]);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_in_project' => 'required|in:project_manager,backend,frontend,fullstack,uiux,sales_marketing',
        ]);

        $validated['project_id'] = $project->id;

        ProjectMember::create($validated);

        return redirect()->route('projects.show', $project->id)
            ->with('success', 'Member added.');
    }

    public function destroy(ProjectMember $member)
    {
        $this->authorize('delete', $member);

        $projectId = $member->project_id;
        $member->delete();

        return redirect()->route('projects.show', $projectId)
            ->with('success', 'Member removed.');
    }
}
