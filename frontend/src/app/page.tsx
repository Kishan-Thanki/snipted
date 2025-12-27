'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';
import Link from 'next/link';
import { useAuth } from '@/lib/store/auth.store';

export default function Home() {
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const fetchFeed = async () => {
    try {
      const { data } = await api.get('/snippets/');
      setSnippets(data);
    } catch (err) {
      console.error("Feed fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handleLike = async (id: number) => {
    if (!isAuthenticated) {
      alert("You must be logged in to like snippets!");
      return;
    }
    try {
      await api.post(`/snippets/${id}/like`);
      fetchFeed(); // Refresh data to show new star count
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse text-zinc-500 font-medium">Fetching snippets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Community Feed</h1>
        {/* Mobile-only create button */}
        <Link href="/create" className="md:hidden bg-[var(--color-primary)] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
          + New
        </Link>
      </div>

      <div className="grid gap-4">
        {snippets.length === 0 ? (
          <div className="community-card text-center py-12 text-zinc-500">
            No snippets found. Be the first to share!
          </div>
        ) : (
          snippets.map((snippet) => (
            <article key={snippet.id} className="community-card hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-xl font-bold group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{snippet.title}</h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-zinc-600">
                  {snippet.language}
                </span>
              </div>
              
              <div className="bg-zinc-950 rounded-lg p-4 mb-4 border border-zinc-800/50 shadow-inner">
                <pre className="text-sm text-zinc-300 font-mono overflow-x-auto scrollbar-hide">
                  <code>{snippet.code_content}</code>
                </pre>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {snippet.tags?.map((tag: any) => (
                    <span key={tag.id} className="text-xs text-[var(--color-primary)] font-semibold bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                      #{tag.name}
                    </span>
                  ))}
                </div>
                
                <button 
                  onClick={() => handleLike(snippet.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
                    isAuthenticated 
                    ? 'hover:bg-yellow-50 hover:text-yellow-700 text-zinc-500' 
                    : 'opacity-40 cursor-not-allowed text-zinc-400'
                  }`}
                >
                  <span className="text-lg leading-none">★</span>
                  <span className="text-sm font-bold">{snippet.like_count || 0}</span>
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}