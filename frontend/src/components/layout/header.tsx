'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/store/auth.store';
import { api } from '@/lib/api/client';

export function Header() {
    const { user, isAuthenticated, setAuth } = useAuth();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            setAuth(null);
            window.location.href = '/'; // Refresh to clear state
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-14 bg-white dark:bg-zinc-900 border-b border-[var(--color-border)] z-50 px-4">
            <div className="max-w-[1280px] mx-auto h-full flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter text-[var(--color-primary)]">
                    <span className="bg-[var(--color-primary)] text-white px-1.5 rounded">S</span>
                    Snipted
                </Link>

                {/* Search Bar (Functional logic will be added in the Feed step) */}
                <div className="flex-1 max-w-2xl hidden sm:block">
                    <input
                        type="text"
                        placeholder="Search snippets (e.g. 'fastapi auth' or '#python')"
                        className="w-full bg-zinc-100 dark:bg-zinc-800 border border-[var(--color-border)] rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
                    />
                </div>

                {/* Auth Actions */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold leading-none">{user?.username}</span>
                                <span className="text-[10px] text-yellow-600 font-bold">★ {user?.reputation_stars}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="text-xs font-bold uppercase hover:text-red-500 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-[var(--color-primary)] hover:bg-blue-50 px-4 py-1.5 rounded-full border border-[var(--color-primary)] transition-colors">
                                Log In
                            </Link>
                            <Link href="/register" className="text-sm font-bold bg-[var(--color-primary)] text-white hover:bg-blue-700 px-4 py-1.5 rounded-full transition-colors">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}