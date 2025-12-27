'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import Link from 'next/link';

export default function Home() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const { data } = await api.get('/snippets/');
        setSnippets(data);
      } catch (err) {
        console.error("Feed error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) return <div className="p-8 text-center animate-pulse">Loading snippets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Community Feed</h1>
        <Link href="/create" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-opacity">
          Create Snippet
        </Link>
      </div>

      <div className="grid gap-4">
        {snippets.length === 0 ? (
          <div className="community-card text-center py-12 text-zinc-500">
            No snippets found. Be the first to post!
          </div>
        ) : (
          snippets.map((snippet) => (
            <article key={snippet.id} className="community-card">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-bold">{snippet.title}</h2>
                <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                  {snippet.language}
                </span>
              </div>
              <div className="bg-zinc-900 rounded p-4 mb-3 overflow-x-auto border border-zinc-800">
                <pre className="text-sm text-zinc-300 font-mono">
                  <code>{snippet.code_content}</code>
                </pre>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex gap-2">
                  {snippet.tags?.map((tag: any) => (
                    <span key={tag.id} className="text-sm text-[var(--color-primary)] font-medium">#{tag.name}</span>
                  ))}
                </div>
                <span className="text-xs text-zinc-500">★ {snippet.like_count || 0}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}