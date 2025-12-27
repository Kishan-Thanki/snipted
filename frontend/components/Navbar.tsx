"use client";
import Link from "next/link";
import { ModeToggle } from "./ui/theme-toggle";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
    const { user } = useAuth();

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tighter">
                    SNIP<span className="text-blue-600">TED</span>
                </Link>

                <div className="flex items-center gap-4">
                    <ModeToggle />
                    {user ? (
                        <Link href="/dashboard" className="text-sm font-medium">Dashboard</Link>
                    ) : (
                        <Link href="/login" className="text-sm font-medium bg-foreground text-background px-4 py-2 rounded-full">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}