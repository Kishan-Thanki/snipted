'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/store/auth.store';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { setAuth } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Use URLSearchParams to ensure the format is 'application/x-www-form-urlencoded'
            const params = new URLSearchParams();
            params.append('username', username); // This must match the 'username' field in your backend
            params.append('password', password);

            // 2. Post to the login endpoint
            await api.post('/auth/login', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            // 3. Re-verify the session to update the Global Store
            const userRes = await api.get('/users/me');
            setAuth(userRes.data);

            router.push('/');
        } catch (err: any) {
            // Detailed error logging to see exactly what the backend disliked
            console.error("Login Error Details:", err.response?.data);
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 community-card">
            <h1 className="text-2xl font-bold mb-6">Log In</h1>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handleLogin} className="space-y-4">
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
                    Log In
                </button>
            </form>

            <p className="mt-4 text-center text-sm">
                New to Snipted? <Link href="/register" className="text-blue-500 hover:underline">Sign Up</Link>
            </p>
        </div>
    );
}