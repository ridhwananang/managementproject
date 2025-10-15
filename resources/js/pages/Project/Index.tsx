import React from "react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/id";
import { Calendar, Users, FolderOpen } from "lucide-react";

dayjs.extend(relativeTime);
dayjs.locale("id");

type Project = {
  id: number;
  name: string;
  description: string;
  nilai_nominal: string;
  status: string;
  start_date: string;
  end_date: string;
  project_members: { user: { name: string } }[];
};

type Props = {
  projects: Project[];
};

function formatDateWithRelative(date: string) {
  if (!date) return "-";
  const d = dayjs(date);
  return `${d.format("dddd, D MMM YYYY")}`;
  /*(${d.fromNow()})*/
}

// 🟢 Custom Status Badge
function renderStatus(status: string) {
  const statusMap: Record<
    string,
    { label: string; color: string; icon: React.ReactElement }
  > = {
    planning: {
      label: "Planning",
      color: "bg-blue-100 text-blue-800 border border-blue-200",
      icon: <FolderOpen size={14} className="mr-1 text-blue-600" />,
    },
    in_progress: {
      label: "In Progress",
      color: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      icon: (
        <span className="mr-1 animate-spin inline-block w-3 h-3 border-2 border-yellow-600 border-t-transparent rounded-full"></span>
      ),
    },
    completed: {
      label: "Completed",
      color: "bg-green-100 text-green-800 border border-green-200",
      icon: <span className="mr-1 text-green-600">✔</span>,
    },
    on_hold: {
      label: "On Hold",
      color: "bg-gray-100 text-gray-700 border border-gray-200",
      icon: <span className="mr-1 text-gray-500">⏸</span>,
    },
  };

  const current =
    statusMap[status] ?? {
      label: status,
      color: "bg-gray-100 text-gray-800 border border-gray-200",
      icon: <span className="mr-1 text-gray-500">•</span>,
    };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${current.color}`}
    >
      {current.icon}
      {current.label}
    </span>
  );
}

export default function Index({ projects }: Props) {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center gap-2">
            <FolderOpen className="text-blue-500" /> Projects
          </h1>
          <Link
            href={route("projects.create")}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
          >
            + New Project
          </Link>
        </div>

        {/* Projects Grid */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.01] p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Project Name */}
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {project.name}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                    {project.description || "No description provided."}
                  </p>

                  {/* Status */}
                  <div className="mt-3 text-sm flex items-center gap-2">
                    <span className="text-gray-600 dark:text-gray-400">
                      Status:
                    </span>
                    {renderStatus(project.status)}
                  </div>

                  {/* Progress Bar (optional visual aid) */}
                  <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        project.status === "completed"
                          ? "w-full bg-green-500"
                          : project.status === "in_progress"
                          ? "w-2/3 bg-yellow-400"
                          : project.status === "planning"
                          ? "w-1/3 bg-blue-400"
                          : "w-1/2 bg-gray-400"
                      }`}
                    ></div>
                  </div>

                  {/* Dates */}
                  <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p className="flex items-center gap-2">
                      <Calendar size={14} />
                      Start: {formatDateWithRelative(project.start_date)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar size={14} />
                      End: {formatDateWithRelative(project.end_date)}
                    </p>
                  </div>

                  {/* Members */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Users size={16} />
                    <span>
                      {project.project_members.length > 0
                        ? project.project_members
                            .map((m) => m.user.name)
                            .join(", ")
                        : "No members"}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <div className="mt-5">
                  <Link
                    href={route("projects.show", project.id)}
                    className="inline-block w-full text-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl shadow">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No projects available.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
