import React, { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Search } from "lucide-react";
import DeleteModal from "@/components/DeleteModal";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  created_at: string;
};

type Props = {
  users: User[];
  roles: string[];
};

export default function Index({ users, roles }: Props) {
  const { auth } = (usePage().props as unknown) as {
    auth: { user: { id: number; name: string; role: string } };
  };

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const perPage = 6;

  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((user) => roleFilter === "all" || user.role === roleFilter);

  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const roleLabels: Record<string, string> = {
    project_manager: "Project Manager",
    backend: "Backend Developer",
    frontend: "Frontend Developer",
    fullstack: "Fullstack Dev",
    uiux: "UI/UX Designer",
    marketing: "Marketing",
  };

  const roleColors: Record<string, string> = {
    project_manager: "bg-red-500/10 text-red-600 dark:text-red-300",
    backend: "bg-green-500/10 text-green-600 dark:text-green-300",
    frontend: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
    fullstack: "bg-purple-500/10 text-purple-600 dark:text-purple-300",
    uiux: "bg-pink-500/10 text-pink-600 dark:text-pink-300",
    marketing: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-300",
  };

  const openDeleteModal = (id: number) => {
    setDeleteTargetId(id);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setModalOpen(false);
    setDeleting(false);
  };

  const handleConfirmDelete = () => {
    if (!deleteTargetId) return;
    setDeleting(true);

    router.delete(route("users.destroy", deleteTargetId), {
      onFinish: () => closeDeleteModal(),
      onError: () => setDeleting(false),
    });
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
            Developer Directory
          </h1>

          {auth.user.role === "project_manager" && (
            <Link href={route("users.create")}>
              <Button className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-indigo-500 hover:to-blue-600 text-white font-semibold shadow-md hover:shadow-lg transition">
                + Add Developer
              </Button>
            </Link>
          )}
        </div>

        {/* Search & Filter */}
        <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-200/60 dark:border-gray-700 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition w-full sm:w-auto"
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {roleLabels[role] || role}
              </option>
            ))}
          </select>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedUsers.map((user) => (
            <div
              key={user.id}
              className="group relative bg-white dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              {/* Edit & Delete */}
              {auth.user.role === "project_manager" && (
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link
                    href={route("users.edit", user.id)}
                    className="p-2 rounded-full bg-blue-500/10 hover:bg-blue-500/20 transition"
                  >
                    <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => openDeleteModal(user.id)}
                    className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              )}

              {/* Avatar */}
              {user.avatar ? (
                <img
                  src={`/storage/${user.avatar}`}
                  alt={user.name}
                  className="w-24 h-24 rounded-full mb-3 object-cover border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 p-1"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mb-3 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-300 text-2xl font-bold border border-gray-300 dark:border-gray-700">
                  {user.name.charAt(0)}
                </div>
              )}

              {/* Name & Email */}
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>

              {/* Role Badge */}
              <span
                className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                  roleColors[user.role] ||
                  "bg-gray-500/10 text-gray-700 dark:text-gray-300"
                }`}
              >
                {roleLabels[user.role] || user.role}
              </span>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                Joined: {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === i + 1
                    ? "bg-gradient-to-r from-blue-600 to-indigo-500 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Delete Modal */}
        <DeleteModal
          isOpen={modalOpen}
          title="Hapus User"
          message="Yakin mau menghapus user ini? Data ini akan hilang permanen."
          confirmLabel="Ya, hapus"
          cancelLabel="Batal"
          loading={deleting}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppLayout>
  );
}
