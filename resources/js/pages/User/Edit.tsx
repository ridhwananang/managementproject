import React, { useState } from "react";
import { useForm, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar?: string;
};

type Props = {
  user: User;
};

export default function Edit({ user }: Props) {
  const { data, setData, post, errors, processing } = useForm({
    _method: "put",
    name: user.name || "",
    email: user.email || "",
    role: user.role || "",
    password: "",
    password_confirmation: "",
    avatar: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(
    user.avatar ? `/storage/${user.avatar}` : null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("users.update", user.id));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData("avatar", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <AppLayout>
      <div className=" p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Edit User
          </h1>
          <Link
            href={route("users.index")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </Link>
        </div>

        {/* Card Container */}
        <Card className="max-w-3xl mx-auto border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/60 backdrop-blur-md shadow-lg dark:shadow-gray-900/40 rounded-2xl transition-all duration-300">
          <CardHeader className="pb-0">
            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              User Information
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm transition-all duration-300 hover:shadow-md">
                {preview ? (
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="w-28 h-28 rounded-full object-cover mb-3 border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 p-[2px]"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 mb-3 flex items-center justify-center text-gray-500 dark:text-gray-300">
                    No Image
                  </div>
                )}

                <label className="cursor-pointer text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline transition">
                  Change Avatar
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAvatarChange}
                    accept="image/*"
                  />
                </label>
                {errors.avatar && (
                  <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>
                )}
              </div>

              {/* Name */}
              <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                <Label
                  htmlFor="name"
                  className="font-semibold text-gray-800 dark:text-gray-200"
                >
                  Name
                </Label>
                <Input
                  id="name"
                  value={data.name}
                  onChange={(e) => setData("name", e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-blue-500 border border-gray-700 "
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                <Label
                  htmlFor="email"
                  className="font-semibold text-gray-800 dark:text-gray-200"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className="mt-1 focus:ring-2 focus:ring-blue-500 border border-gray-700 "
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Role */}
              <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                <Label
                  htmlFor="role"
                  className="font-semibold text-gray-800 dark:text-gray-200"
                >
                  Role
                </Label>
                <select
                  id="role"
                  value={data.role}
                  onChange={(e) => setData("role", e.target.value)}
                  className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select Role</option>
                  <option value="project_manager">Project Manager</option>
                  <option value="backend">Backend</option>
                  <option value="frontend">Frontend</option>
                  <option value="fullstack">Fullstack</option>
                  <option value="uiux">UI/UX Designer</option>
                  <option value="marketing">Marketing</option>
                </select>
                {errors.role && (
                  <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                  <Label
                    htmlFor="password"
                    className="font-semibold text-gray-800 dark:text-gray-200"
                  >
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    placeholder="Leave blank to keep old password"
                    className="mt-1 focus:ring-2 focus:ring-blue-500 border border-gray-700"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                  <Label
                    htmlFor="password_confirmation"
                    className="font-semibold text-gray-800 dark:text-gray-200"
                  >
                    Confirm Password
                  </Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={data.password_confirmation}
                    onChange={(e) =>
                      setData("password_confirmation", e.target.value)
                    }
                    placeholder="Leave blank to keep old password"
                    className="mt-1 focus:ring-2 focus:ring-blue-500 border border-gray-700"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={processing}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold hover:from-indigo-500 hover:to-blue-600 shadow-md hover:shadow-lg transition-all"
                >
                  {processing ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
