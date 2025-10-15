import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Button, Label } from "@/components/ui";
import { ChevronDown, ChevronRight } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  created_at: string;
};

export default function AddMember({
  projectId,
  users,
}: {
  projectId: number;
  users: User[];
}) {
  const { data, setData, post, processing, errors } = useForm({
    user_id: "",
    role_in_project: "",
  });

  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("projects.members.store", projectId), {
      preserveScroll: true,
      onSuccess: () => {
        setData({ user_id: "", role_in_project: "" });
        setSelectedUser(null);
        setOpen(false);
      },
    });
  };

  const roleLabels: Record<string, string> = {
    project_manager: "Project Manager",
    backend: "Backend",
    frontend: "Frontend",
    fullstack: "Fullstack",
    uiux: "UI/UX Designer",
    marketing: "Marketing",
  };

  const roleColors: Record<string, string> = {
    project_manager:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    backend:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    frontend:
      "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    fullstack:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    uiux:
      "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
    marketing:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  };

  return (
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      {/* Header toggle */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left group"
      >
        <h3 className="font-semibold text-md text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition">
          Add Member
        </h3>
        {open ? (
          <ChevronDown
            className="text-gray-500 group-hover:text-blue-500 transition-transform"
            size={18}
          />
        ) : (
          <ChevronRight
            className="text-gray-500 group-hover:text-blue-500 transition-transform"
            size={18}
          />
        )}
      </button>

      {/* Isi form (animate show/hide) */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          open ? "max-h-[4000px] opacity-100 mt-4" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid User Card Picker */}
          <div>
            <Label className="block mb-3 text-gray-700 dark:text-gray-300">
              Select User
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setData("user_id", user.id.toString());
                    setSelectedUser(user.id);
                  }}
                  className={`cursor-pointer bg-white dark:bg-gray-700 border rounded-xl p-4 flex flex-col items-center text-center 
                    transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400
                    ${
                      selectedUser === user.id
                        ? "ring-2 ring-blue-500 shadow-md scale-105"
                        : "border-gray-200 dark:border-gray-600"
                    }`}
                >
                  {user.avatar ? (
                    <img
                      src={`/storage/${user.avatar}`}
                      alt={user.name}
                      className="w-16 h-16 rounded-full mb-2 object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full mb-2 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white text-lg font-bold shadow-inner">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>

                  <span
                    className={`mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                      roleColors[user.role] ||
                      "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {roleLabels[user.role] || user.role}
                  </span>
                </div>
              ))}
            </div>
            {errors.user_id && (
              <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>
            )}
          </div>

          {/* Role Dropdown */}
          <div>
            <Label
              htmlFor="role_in_project"
              className="block mb-2 text-gray-700 dark:text-gray-300"
            >
              Role in Project
            </Label>
            <select
              id="role_in_project"
              value={data.role_in_project}
              onChange={(e) => setData("role_in_project", e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
                bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select Role --</option>
              <option value="project_manager">Project Manager</option>
              <option value="backend">Backend</option>
              <option value="frontend">Frontend</option>
              <option value="fullstack">Fullstack</option>
              <option value="uiux">UI/UX</option>
              <option value="sales_marketing">Sales/Marketing</option>
            </select>
            {errors.role_in_project && (
              <p className="text-red-500 text-sm mt-1">
                {errors.role_in_project}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={processing}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
            >
              {processing ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
