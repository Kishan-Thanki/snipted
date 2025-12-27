'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api/client';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await api.post('/users/', { email, username, password });
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 community-card">
            <h1 className="text-2xl font-bold mb-6">Create Account</h1>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleRegister} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input
                        type="email"
                        required
                        className="w-full p-2 border border-[var(--color-border)] rounded bg-white dark:bg-zinc-800"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input
                        type="text"
                        required
                        className="w-full p-2 border border-[var(--color-border)] rounded bg-white dark:bg-zinc-800"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        type="password"
                        required
                        className="w-full p-2 border border-[var(--color-border)] rounded bg-white dark:bg-zinc-800"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[var(--color-primary)] text-white font-bold py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}