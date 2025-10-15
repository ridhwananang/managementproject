import * as React from "react";
import { Head, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import AppLayout from "@/layouts/app-layout";
import { Button, Input, Label } from "@/components/ui";
import toast from "react-hot-toast";

export default function Create() {
  const { data, setData, post, processing, errors, reset } = useForm<{
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
    avatar: File | null;
  }>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    avatar: null,
  });

  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setData("avatar", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    post(route("users.store"), {
      onSuccess: () => {
        reset();
        setAvatarPreview(null);
        toast.success("✅ User berhasil ditambahkan!");
      },
      onError: () => {
        toast.error("❌ Terjadi kesalahan saat menambahkan user.");
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Add New User" />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Tambah User Baru
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Lengkapi informasi pengguna baru untuk ditambahkan ke sistem.
          </p>
        </div>

        {/* Card Layout */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row transition-all">
          {/* Avatar Preview Section */}
          <div className="relative lg:w-1/3 bg-gradient-to-b from-red-600 to-orange-400 flex flex-col items-center justify-center p-8 overflow-hidden">
            {/* Large Background Icon */}
            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
              <span className="text-[220px] font-extrabold select-none opacity-10 transform -rotate-12 translate-y-42 drop-shadow-lg text-white">
                {"</>"}
              </span>
            </div>

            {/* Avatar Preview */}
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="avatar preview"
                className="relative z-10 w-52 h-52 rounded-full border-4 border-white object-cover shadow-4xl transition-transform hover:scale-105"
              />
            ) : (
              <div className="relative z-10 w-48 h-48 rounded-full bg-white flex items-center justify-center text-6xl font-bold text-orange-500 shadow-xl">
                ?
              </div>
            )}

            <p className="relative z-10 mt-12 text-white font-semibold text-lg">
              Preview Avatar
            </p>
          </div>

          {/* Form Area */}
          <div className="lg:w-2/3 p-10 relative overflow-hidden">
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {/* Name */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="name"
                  className="font-semibold text-gray-700 dark:text-gray-200"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  placeholder="Enter full name"
                  className="w-full border rounded-xl px-4 py-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className="font-semibold text-gray-700 dark:text-gray-200"
                >
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  placeholder="Enter email"
                  className="w-full border rounded-xl px-4 py-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="password"
                  className="font-semibold text-gray-700 dark:text-gray-200"
                >
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  placeholder="Enter password"
                  className="w-full border rounded-xl px-4 py-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="password_confirmation"
                  className="font-semibold text-gray-700 dark:text-gray-200"
                >
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  id="password_confirmation"
                  value={data.password_confirmation}
                  onChange={(e) =>
                    setData("password_confirmation", e.target.value)
                  }
                  placeholder="Confirm password"
                  className="w-full border rounded-xl px-4 py-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500"
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password_confirmation}
                  </p>
                )}
              </div>

              {/* Role */}
{/* Role & Avatar (sejajar) */}
<div className="flex flex-col md:flex-row gap-8 md:col-span-2">
  {/* Role */}
  <div className="flex-1 flex flex-col gap-2">
    <Label
      htmlFor="role"
      className="font-semibold text-gray-700 dark:text-gray-200"
    >
      Role
    </Label>
    <select
      id="role"
      value={data.role}
      onChange={(e) => setData("role", e.target.value)}
      className="w-full border rounded-xl px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-500"
    >
      <option value="">-- Select Role --</option>
      <option value="project_manager">Project Manager</option>
      <option value="backend">Backend</option>
      <option value="frontend">Frontend</option>
      <option value="fullstack">Fullstack</option>
      <option value="uiux">UI/UX</option>
      <option value="marketing">Marketing</option>
    </select>
    {errors.role && (
      <p className="text-red-500 text-sm mt-1">{errors.role}</p>
    )}
  </div>

  {/* Avatar Upload */}
  <div className="flex-1 flex flex-col gap-2">
    <Label
      htmlFor="avatar"
      className="font-semibold text-gray-700 dark:text-gray-200"
    >
      Avatar
    </Label>
    <label
      htmlFor="avatar"
      className="cursor-pointer flex items-center justify-center w-full px-6 py-3 border-2 border-dashed rounded-xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-red-500 transition-all duration-300"
    >
      <span className="text-sm">Choose File</span>
      <input
        type="file"
        id="avatar"
        accept="image/*"
        onChange={handleAvatarChange}
        className="hidden"
      />
    </label>
    {errors.avatar && (
      <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
    )}
  </div>
</div>


              {/* Submit Button */}
              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={processing}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-400 hover:from-red-600 hover:to-orange-500 text-white font-bold rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  {processing ? "Saving..." : "Add User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
