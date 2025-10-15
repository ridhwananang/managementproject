import React, { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import AddMember from "./Member/AddMember";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Users,
  ListTodo,
  ArrowLeft,
  CircleDollarSign,
} from "lucide-react";
import { router } from "@inertiajs/react";

type Project = {
  id: number;
  name: string;
  description?: string;
  status: string;
  nilai_budget?: string;
  start_date?: string;
  end_date?: string;
  sprints?: {
    id: number;
    name: string;
    description?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    tasks: { id: number; title: string }[];
  }[];
  project_members?: {
    user: { name: string; email: string; avatar?: string };
    role_in_project?: string;
  }[];
  created_by?: { name: string };
};

type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  created_at: string;
};

type Props = {
  project: Project;
  users: User[];
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export default function Show({ project, users }: Props) {
  const { data, setData, processing } = useForm({
    status: project.status,
  });

  useEffect(() => {
    setData("status", project.status);
  }, [project.status]);

  const statusOptions = [
    {
      value: "planning",
      label: "Planning",
      color:
        "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    },
    {
      value: "in_progress",
      label: "In Progress",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    {
      value: "completed",
      label: "Completed",
      color:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    {
      value: "on_hold",
      label: "On Hold",
      color:
        "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-300",
    },
  ];

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setData("status", newStatus);

    router.put(
      route("projects.update", project.id),
      { status: newStatus },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => toast.success("Status project berhasil diperbarui!"),
        onError: () => toast.error("Gagal memperbarui status."),
      }
    );
  };

  const currentStatus = statusOptions.find((s) => s.value === data.status);

  return (
    <AppLayout>
      <Head title={`Project: ${project.name}`} />

      <div className="p-6 max-w-7xl mx-auto space-y-10">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
            {project.name}
          </h1>
          <Link
            href={route("projects.index")}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>

        {/* PROJECT DETAILS */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 space-y-6 transition">
          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            {project.description || "No description provided."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Status:
              </span>
              <select
                value={data.status}
                onChange={handleStatusChange}
                disabled={processing}
                className={`px-3 py-1 text-xs rounded-full font-medium cursor-pointer transition-colors ${currentStatus?.color}`}
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Calendar size={16} className="text-blue-500" />
              <span className="font-semibold">Start:</span>
              <span>{formatDate(project.start_date)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Calendar size={16} className="text-purple-500" />
              <span className="font-semibold">End:</span>
              <span>{formatDate(project.end_date)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <Users size={16} className="text-green-500" />
              <span className="font-semibold">Created By:</span>
              <span>{project.created_by?.name ?? "Unknown"}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <CircleDollarSign size={16} className="text-yellow-500" />
              <span className="font-semibold">Nilai Nominal:</span>
              <span>
                {project.nilai_budget
                  ? new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(parseFloat(project.nilai_budget))
                  : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* MEMBERS */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="text-blue-500" size={22} />
            <h2 className="font-bold text-2xl text-gray-900 dark:text-gray-100">
              Members
            </h2>
          </div>

          {project.project_members?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.project_members.map((pm, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow hover:shadow-xl transition"
                >
                  {pm.user.avatar ? (
                    <img
                      src={`/storage/${pm.user.avatar}`}
                      alt={pm.user.name}
                      className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-gray-200 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-lg font-bold border-2 border-gray-200 dark:border-gray-700">
                      {pm.user.name.charAt(0)}
                    </div>
                  )}

                  <h3 className="text-center text-sm font-semibold text-gray-900 dark:text-white">
                    {pm.user.name}
                  </h3>
                  <p className="text-center text-xs text-gray-500 dark:text-gray-400">
                    {pm.user.email}
                  </p>

                  <span
                    className={`block text-center mt-3 px-3 py-1 text-xs font-medium rounded-full ${
                      pm.role_in_project === "project_manager"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        : pm.role_in_project === "backend"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : pm.role_in_project === "frontend"
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                        : pm.role_in_project === "fullstack"
                        ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
                        : pm.role_in_project === "uiux"
                        ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300"
                        : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {pm.role_in_project}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No members yet.</p>
          )}

          <div className="pt-4">
            <AddMember projectId={project.id} users={users} />
          </div>
        </div>

        {/* ✅ SPRINTS SECTION */}
        <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-200/70 dark:border-gray-800 p-8 space-y-6 transition-all duration-300">
          <div className="flex justify-between items-center mb-6 border-b border-gray-200/60 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <ListTodo className="text-purple-500 dark:text-purple-400" size={26} />
              <h2 className="font-extrabold text-3xl text-gray-900 dark:text-gray-100">
                Project Sprints
              </h2>
            </div>
            <Link
              href={route("projects.sprints.create", project.id)}
              className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform duration-200"
            >
              + New Sprint
            </Link>
          </div>

          {project.sprints?.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {project.sprints.map((sprint) => {
                const formatDate = (dateStr?: string) => {
                  if (!dateStr) return "—";
                  const date = new Date(dateStr);
                  return date.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });
                };

                return (
                  <div
                    key={sprint.id}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 backdrop-blur-sm p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 opacity-80 group-hover:opacity-100 transition" />

                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 truncate">
                          {sprint.name}
                        </h3>

                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                            sprint.status === "completed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200"
                              : sprint.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-100"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {(sprint.status ?? "unknown").replace("_", " ")}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                        {sprint.description || "No description provided."}
                      </p>

                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-5">
                        <Calendar className="w-4 h-4 mr-1.5 text-purple-500 dark:text-purple-400" />
                        <span>
                          <strong>Start:</strong> {formatDate(sprint.start_date)} •{" "}
                          <strong>End:</strong> {formatDate(sprint.end_date)}
                        </span>
                      </div>

{/* Task List (tanpa scroll, lebih elegan) */}
<div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/40 rounded-lg p-3 border border-gray-100 dark:border-gray-700/70 shadow-inner space-y-2">
  {sprint.tasks?.length ? (
    sprint.tasks.map((task) => (
      <div
        key={task.id}
        className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200 bg-white/70 dark:bg-gray-800/60 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        {/* Icon */}
        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
          ✓
        </div>

        {/* Task Title */}
        <span className="flex-1 truncate">{task.title}</span>

        {/* Optional Status Badge (jika nanti task punya status) */}
        {/* <span className="px-2 py-0.5 text-[10px] rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-200">
          Done
        </span> */}
      </div>
    ))
  ) : (
    <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
      No tasks yet.
    </p>
  )}
</div>
                    </div>

                    <div className="flex justify-between mt-6 pt-4 border-t border-gray-200/70 dark:border-gray-800">
                      <Link
                        href={route("projects.sprints.show", [project.id, sprint.id])}
                        className="flex-1 mr-2 text-center text-sm px-4 py-2 rounded-lg font-medium border border-gray-400/70 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        View
                      </Link>
                      <Link
                        href={route("projects.sprints.edit", [project.id, sprint.id])}
                        className="flex-1 ml-2 text-center text-sm px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-md hover:opacity-95 transition"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
              <p className="text-lg font-medium mb-3">No sprints yet 💤</p>
              <Link
                href={route("projects.sprints.create", project.id)}
                className="inline-block bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition"
              >
                + Create Sprint
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
