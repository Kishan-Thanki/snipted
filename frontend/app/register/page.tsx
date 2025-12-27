// app/register/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth.store";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { apiClient } from "@/lib/api/client"; // ADD THIS IMPORT

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuthStore();
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate inputs
            if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
                toast.error("Please fill in all required fields");
                setIsLoading(false);
                return;
            }

            if (form.password !== form.confirmPassword) {
                toast.error("Passwords do not match");
                setIsLoading(false);
                return;
            }

            if (form.password.length < 6) {
                toast.error("Password must be at least 6 characters");
                setIsLoading(false);
                return;
            }

            if (!form.email.includes("@")) {
                toast.error("Please enter a valid email address");
                setIsLoading(false);
                return;
            }

            // Register the user
            await apiClient.post('/api/v1/auth/register', {
                username: form.username,
                email: form.email,
                password: form.password
            });

            // Auto-login after registration
            await login(form.email, form.password);

            toast.success("Account created successfully! Welcome!");
            router.push("/dashboard");

        } catch (err: any) {
            console.error("Registration error:", err);

            if (err.response?.status === 409) {
                toast.error("Email or username already exists");
            } else if (err.response?.status === 422) {
                toast.error("Invalid input. Please check your details");
            } else if (err.response?.status === 429) {
                toast.error("Too many attempts. Please try again later");
            } else {
                toast.error("Registration failed. Please try again");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md border-border/40 shadow-2xl rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                        <User className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                        Join Snipted to share and discover amazing code snippets
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="username" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Username
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="username"
                                        placeholder="john_doe"
                                        value={form.username}
                                        onChange={(e) => setForm({ ...form, username: e.target.value })}
                                        className="pl-10 rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        required
                                        disabled={isLoading}
                                        autoComplete="username"
                                    />
                                </div>
                            </div>

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
                                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </label>
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
                                        autoComplete="new-password"
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
                                <p className="text-xs text-gray-500">
                                    Must be at least 6 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={form.confirmPassword}
                                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                        className="pl-10 pr-10 rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                                        required
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        disabled={isLoading}
                                    >
                                        {showConfirmPassword ? (
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
                            className="w-full rounded-xl h-12 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-semibold text-green-600 hover:text-green-500 dark:text-green-400"
                        >
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}