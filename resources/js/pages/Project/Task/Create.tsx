import React from "react";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button, Input, Label, Textarea } from "@/components/ui";
import InputError from "@/components/input-error";
import toast from "react-hot-toast";
import { TaskFormData } from "@/types/TaskFormData";
import UserPicker from "@/components/UserPicker"; // ✅ import komponen baru

export default function Create({
  project,
  sprints,
  users = [], // ✅ pastikan nggak undefined
}: {
  project: any;
  sprints: any[];
  users?: any[];
}) {
  const { data, setData, post, processing, errors } = useForm<TaskFormData>({
    title: "",
    description: "",
    project_id: project.id,
    sprint_id: null,
    status: "todo",
    assigned_to: null, // ✅ tambahkan field assigned_to
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(route("projects.tasks.store", [project.id]), {
      onSuccess: () => toast.success("Task berhasil dibuat!"),
      onError: () => toast.error("Gagal membuat task."),
    });
  };

  return (
    <AppLayout>
      <Head title="Create Task" />

      <div className="max-w-5xl mx-auto my-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Header */}
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Create Task for "{project.name}"
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Name */}
          <div>
            <Label htmlFor="title">Task Name</Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => setData("title", e.target.value)}
              placeholder="Enter task name"
              className="mt-1"
            />
            <InputError message={errors.title} />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              placeholder="Describe this task..."
              className="mt-1"
            />
            <InputError message={errors.description} />
          </div>

          {/* Module Type */}
          <div>
            <Label htmlFor="module_type">Module Type</Label>
            <select
              id="module_type"
              value={data.module_type || "backend"}
              onChange={(e) =>
                setData(
                  "module_type",
                  e.target.value as TaskFormData["module_type"]
                )
              }
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="uiux">UI/UX</option>
              <option value="project_manager">Project Manager</option>
              <option value="marketing">Marketing</option>
              <option value="fullstack">Fullstack</option>
            </select>
            <InputError message={errors.module_type} />
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              value={data.priority || "medium"}
              onChange={(e) =>
                setData("priority", e.target.value as TaskFormData["priority"])
              }
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <InputError message={errors.priority} />
          </div>

          {/* Progress */}
          <div>
            <Label htmlFor="progress_percentage">Progress (%)</Label>
            <Input
              id="progress_percentage"
              type="number"
              value={data.progress_percentage || 0}
              onChange={(e) =>
                setData("progress_percentage", Number(e.target.value))
              }
              placeholder="0"
              className="mt-1"
            />
            <InputError message={errors.progress_percentage} />
          </div>

          {/* Due Date */}
          <div>
            <Label htmlFor="due_date">Due Date</Label>
            <Input
              id="due_date"
              type="date"
              value={data.due_date || ""}
              onChange={(e) => setData("due_date", e.target.value)}
              className="mt-1"
            />
            <InputError message={errors.due_date} />
          </div>

          {/* Sprint Selector */}
          <div>
            <Label htmlFor="sprint_id">Sprint (Optional)</Label>
            <select
              id="sprint_id"
              value={data.sprint_id ?? ""}
              onChange={(e) =>
                setData(
                  "sprint_id",
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="">— No Sprint —</option>
              {Array.isArray(sprints) && sprints.length > 0 ? (
                sprints.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))
              ) : (
                <option value="">No sprints available</option>
              )}
            </select>
            <InputError message={errors.sprint_id} />
          </div>

          {/* ✅ Assigned To (UserPicker) */}
          <div>
            <UserPicker
              users={users}
              selectedUserId={data.assigned_to}
              onChange={(id) => setData("assigned_to", id)}
            />
            <InputError message={errors.assigned_to} />
          </div>

          {/* Status Selector */}
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={data.status}
              onChange={(e) =>
                setData("status", e.target.value as TaskFormData["status"])
              }
              className="w-full border border-gray-300 rounded-lg p-2 mt-1 dark:bg-gray-900 dark:text-gray-100"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            <InputError message={errors.status} />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={processing}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
            >
              {processing ? "Saving..." : "Create Task"}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
