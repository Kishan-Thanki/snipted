// components/layout/header.tsx
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store/auth.store';
import { Button } from '@/components/ui/button';
import { Menu, Search, User, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Header() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{'</>'}</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:inline-block">
                            Snipted
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link
                        href="/snippets"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                    >
                        Explore
                    </Link>
                    <Link
                        href="/create"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                    >
                        Create
                    </Link>
                    <Link
                        href="/docs"
                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                    >
                        Docs
                    </Link>
                    {isAuthenticated && (
                        <Link
                            href="/dashboard"
                            className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium text-sm transition-colors"
                        >
                            Dashboard
                        </Link>
                    )}
                </nav>

                {/* Right side */}
                <div className="flex items-center space-x-4">
                    {/* Search button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden sm:flex"
                        aria-label="Search"
                    >
                        <Search className="h-4 w-4" />
                    </Button>

                    {/* Auth buttons */}
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-4">
                            <Link href={`/profile/${user?.id}`}>
                                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs">
                                        {user?.username?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden md:inline text-sm font-medium">
                                        {user?.username}
                                    </span>
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => logout()}
                                aria-label="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <Button asChild variant="ghost" size="sm">
                                <Link href="/login">Sign In</Link>
                            </Button>
                            <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <Link href="/register">Get Started</Link>
                            </Button>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        <Link
                            href="/snippets"
                            className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Explore
                        </Link>
                        <Link
                            href="/create"
                            className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Create
                        </Link>
                        <Link
                            href="/docs"
                            className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Docs
                        </Link>
                        {isAuthenticated && (
                            <Link
                                href="/dashboard"
                                className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                        )}
                        <div className="pt-4 border-t">
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                size="sm"
                                aria-label="Search"
                            >
                                <Search className="h-4 w-4 mr-2" />
                                Search
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}