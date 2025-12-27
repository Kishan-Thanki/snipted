'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/store/auth.store';
import { api } from '@/lib/api/client';

export function Header() {
    const { user, isAuthenticated, isLoading, setAuth } = useAuth();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            setAuth(null);
            // Using window.location to ensure all states are wiped fresh
            window.location.href = '/'; 
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

                {/* Auth Actions */}
                <div className="flex items-center gap-3">
                    {/* Don't show anything while we are still checking the session */}
                    {!isLoading && (
                        isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-sm font-bold leading-none">{user?.username}</div>
                                    <div className="text-[10px] text-yellow-600 font-bold">★ {user?.reputation_stars}</div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="text-xs font-bold uppercase hover:text-red-500"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <Link href="/login" className="text-sm font-bold text-[var(--color-primary)] px-4 py-1.5 rounded-full border border-[var(--color-primary)]">
                                    Log In
                                </Link>
                                <Link href="/register" className="text-sm font-bold bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-full">
                                    Sign Up
                                </Link>
                            </div>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}