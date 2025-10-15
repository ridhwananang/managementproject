import React from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import { LoaderCircle } from "lucide-react";

import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("register"), {
            onSuccess: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to get started"
        >
            <Head title="Register" />

            <form
                onSubmit={submit}
                className="flex flex-col gap-6 bg-white dark:bg-zinc-900 shadow-lg rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800"
            >
                <div className="grid gap-4">
                    {/* Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="John Doe"
                            autoFocus
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="email@example.com"
                            required
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Confirm Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">
                            Confirm Password
                        </Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            placeholder="••••••••"
                            required
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    {/* Submit */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="mt-2 w-full flex items-center justify-center gap-2 font-medium"
                    >
                        {processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                        )}
                        Create Account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground mt-2">
                    Already have an account?{" "}
                    <TextLink href={route("login")} className="font-semibold">
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
