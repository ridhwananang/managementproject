import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputError from "@/components/input-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";

interface TaskEditProps {
  task: {
    id: number;
    title: string;
    description?: string;
    project_id: number;
    sprint_id?: number | null;
    status: string;
    due_date?: string | null;
  };
  projects: { id: number; name: string }[];
  sprints: { id: number; name: string }[];
}

export default function Edit({ task, projects, sprints }: TaskEditProps) {
  const { data, setData, put, processing, errors } = useForm({
    title: task.title || "",
    description: task.description || "",
    project_id: task.project_id || "",
    sprint_id: task.sprint_id || "",
    status: task.status || "todo",
    due_date: task.due_date || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    put(route("projects.tasks.update", [task.project_id, task.id]), {
      onSuccess: () => toast.success("Task updated successfully!"),
      onError: () => toast.error("Failed to update task."),
    });
  };

  return (
    <AppLayout>
      <Head title={`Edit Task - ${task.title}`} />

      <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl">
        <h2 className="text-xl font-semibold mb-6">Edit Task</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Task Name */}
          <div>
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              placeholder="Task title"
            />
            <InputError message={errors.title} />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              placeholder="Task details..."
            />
            <InputError message={errors.description} />
          </div>

          {/* Project Select */}
          <div>
            <Label>Project</Label>
            <Select
              value={String(data.project_id)}
              onValueChange={(value) => setData("project_id", Number(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((proj) => (
                  <SelectItem key={proj.id} value={String(proj.id)}>
                    {proj.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <InputError message={errors.project_id} />
          </div>

          {/* Sprint Select (optional) */}
{/* Sprint Select (optional) */}
<div>
  <Label>Sprint (optional)</Label>
<Select
  value={data.sprint_id?.toString() ?? "none"}
  onValueChange={(value) =>
    setData("sprint_id", value === "none" ? "" : Number(value))
  }
>
  <SelectTrigger>
    <SelectValue placeholder="No Sprint" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="none">No Sprint</SelectItem>
    {sprints.map((s) => (
      <SelectItem key={s.id} value={String(s.id)}>
        {s.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

  <InputError message={errors.sprint_id} />
</div>


          {/* Status */}
          <div>
            <Label>Status</Label>
            <Select
              value={data.status}
              onValueChange={(value) => setData("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
<SelectItem value="in_progress">In Progress</SelectItem>
<SelectItem value="review">Review</SelectItem>
<SelectItem value="done">Done</SelectItem>

              </SelectContent>
            </Select>
            <InputError message={errors.status} />
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={data.due_date || ""}
              onChange={(e) => setData("due_date", e.target.value)}
            />
            <InputError message={errors.due_date} />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <Button type="submit" disabled={processing} className="w-full">
              {processing ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
