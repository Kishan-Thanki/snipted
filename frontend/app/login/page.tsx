// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth.store";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { apiClient } from '@/lib/api/client';

export default function LoginPage() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuthStore();
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate inputs
            if (!form.email.trim() || !form.password.trim()) {
                toast.error("Please fill in all fields");
                setIsLoading(false);
                return;
            }

            if (!form.email.includes("@")) {
                toast.error("Please enter a valid email address");
                setIsLoading(false);
                return;
            }

            // Call the login function from our auth store
            await login(form.email, form.password);

            toast.success("Welcome back! Login successful");
            router.push("/dashboard");

        } catch (err: any) {
            console.error("Login error:", err);

            // Provide specific error messages
            if (err.response?.status === 401) {
                toast.error("Invalid email or password");
            } else if (err.response?.status === 429) {
                toast.error("Too many attempts. Please try again later");
            } else if (err.response?.status === 422) {
                toast.error("Please check your input format");
            } else if (err.message?.includes("Network Error")) {
                toast.error("Cannot connect to server. Please check your connection");
            } else {
                toast.error("Login failed. Please try again");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md border-border/40 shadow-2xl rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                        <Lock className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Sign in to your Snipted account to access your code snippets
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="pl-10 rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        required
                                        disabled={isLoading}
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password
                                    </label>
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="pl-10 pr-10 rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        required
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full rounded-xl h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/register"
                            className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                        >
                            Sign up
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-xl h-12"
                        disabled={isLoading}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}