'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';
import { useAuth } from '@/lib/store/auth.store';

export default function CreateSnippetPage() {
    const [title, setTitle] = useState('');
    const [language, setLanguage] = useState('python');
    const [code, setCode] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            const tagArray = tags
                .split(',')
                .map(t => t.trim().toLowerCase())
                .filter(t => t !== "");

            await api.post('/snippets/', {
                title,
                language,
                code_content: code,
                tags: tagArray
            });

            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to post snippet.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isLoading && !isAuthenticated) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 community-card text-center">
                <h1 className="text-xl font-bold mb-4">Access Denied</h1>
                <p className="mb-6 text-zinc-600">You must be logged in to share snippets.</p>
                <button onClick={() => router.push('/login')} className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-full font-bold">
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 community-card">
            <h1 className="text-2xl font-bold mb-6">Share a New Snippet</h1>
            
            {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* TITLE */}
                <div>
                    <label className="block text-sm font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">Title</label>
                    <input
                        type="text"
                        placeholder="e.g., Simple Binary Search"
                        className="w-full p-2.5 border border-[var(--color-border)] rounded bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                
                {/* LANGUAGE */}
                <div>
                    <label className="block text-sm font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">Language</label>
                    <select 
                        className="w-full p-2.5 border border-[var(--color-border)] rounded bg-white dark:bg-zinc-800 outline-none cursor-pointer"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="python">Python</option>
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="cpp">C++</option>
                        <option value="sql">SQL</option>
                    </select>
                </div>

                {/* CODE */}
                <div>
                    <label className="block text-sm font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">Code</label>
                    <textarea
                        placeholder="Paste your code here..."
                        className="w-full h-80 p-4 font-mono text-sm border border-[var(--color-border)] rounded bg-zinc-50 dark:bg-zinc-900 focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none shadow-inner"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                </div>

                {/* TAGS */}
                <div>
                    <label className="block text-sm font-bold mb-1.5 text-zinc-700 dark:text-zinc-300">Tags (comma separated)</label>
                    <input
                        type="text"
                        placeholder="basics, algorithm, web"
                        className="w-full p-2.5 border border-[var(--color-border)] rounded bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-4 pt-6 border-t border-[var(--color-border)]">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 text-sm font-bold text-zinc-500 hover:text-zinc-800 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[var(--color-primary)] text-white font-bold px-8 py-2 rounded-full hover:brightness-110 transition-all shadow-sm disabled:opacity-50"
                    >
                        {isSubmitting ? 'Posting...' : 'Post Snippet'}
                    </button>
                </div>
            </form>
        </div>
    );
}