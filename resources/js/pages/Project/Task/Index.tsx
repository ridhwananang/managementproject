import React from "react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { ListTodo } from "lucide-react";

export default function Index({ project, tasks }: { project: any; tasks: any[] }) {
  return (
    <AppLayout
     
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <ListTodo className="text-indigo-500" size={20} />
            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
              Tasks
            </h2>
          </div>
          <Link
            href={route("projects.tasks.create", [project.id])}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow hover:opacity-90 transition"
          >
            + Add Task
          </Link>
        </div>

        {tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-2">
                  {task.title}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-3">
                  {task.description || "No description provided."}
                </p>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Status:{" "}
                  <span className="font-medium capitalize">
                    {task.status.replace("_", " ")}
                  </span>
                </p>

                {task.sprint && (
                  <p className="text-xs text-gray-500 mt-1">
                    Sprint: {task.sprint.name}
                  </p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <Link
                    href={route("projects.tasks.edit", [project.id, task.id])}
                    className="text-sm px-3 py-1.5 rounded-md border border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-700 transition"
                  >
                    Edit
                  </Link>
                  <Link
                    href={route("projects.tasks.show", [project.id, task.id])}
                    className="text-sm px-3 py-1.5 rounded-md border border-gray-400 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            <p>No tasks yet. Start by creating one 👇</p>
            <Link
              href={route("projects.tasks.create", project.id)}
              className="mt-4 inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-lg shadow hover:opacity-90 transition"
            >
              + Create Task
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
