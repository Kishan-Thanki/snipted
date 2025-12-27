'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api/client';

export default function CreateSnippet() {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [lang, setLang] = useState('python');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/snippets/', {
        title,
        code_content: code,
        language: lang,
        tags: tags.split(',').map(t => t.trim()).filter(t => t !== '')
      });
      router.push('/');
    } catch (err) {
      alert("Failed to create snippet. Ensure you are logged in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 community-card">
      <h1 className="text-2xl font-bold mb-6">Share a Snippet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          placeholder="Title (e.g. FastAPI Auth Middleware)" 
          className="w-full p-3 border border-[var(--color-border)] rounded bg-white dark:bg-zinc-800"
          value={title} onChange={(e) => setTitle(e.target.value)} required 
        />
        <select 
          className="w-full p-3 border border-[var(--color-border)] rounded bg-white dark:bg-zinc-800"
          value={lang} onChange={(e) => setLang(e.target.value)}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="go">Go</option>
        </select>
        <textarea 
          placeholder="Paste your code here..." 
          className="w-full h-64 p-3 font-mono text-sm border border-[var(--color-border)] rounded bg-zinc-50 dark:bg-zinc-900"
          value={code} onChange={(e) => setCode(e.target.value)} required 
        />
        <input 
          placeholder="Tags (comma separated: web, auth, fast)" 
          className="w-full p-3 border border-[var(--color-border)] rounded bg-white dark:bg-zinc-800"
          value={tags} onChange={(e) => setTags(e.target.value)}
        />
        <button 
          disabled={isSubmitting}
          className="w-full bg-[var(--color-primary)] text-white font-bold py-3 rounded-full hover:brightness-110 disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post Snippet'}
        </button>
      </form>
    </div>
  );
}