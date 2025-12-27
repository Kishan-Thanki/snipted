// app/(dashboard)/snippets/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SnippetCard } from '@/components/features/snippets/snippet-card';
import { apiClient } from '@/lib/api/client';
import type { Snippet } from '@/lib/api/types';
import { Search, Filter, Plus } from 'lucide-react';

export default function SnippetsPage() {
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: response, isLoading } = useQuery({
    queryKey: ['snippets', { q: debouncedSearch, tags }],
    queryFn: () =>
      apiClient.get('/api/v1/snippets', {
        params: {
          q: debouncedSearch || undefined,
          tags: tags.length > 0 ? tags.join(',') : undefined,
        },
      }).then(res => res.data),
  });

  // Transform API response to match SnippetCard props
  const transformSnippets = (data: any): any[] => {
    if (!data) return [];

    // Handle different response structures
    const snippets = Array.isArray(data) ? data : data?.items || data?.data || [];

    return snippets.map((snippet: Snippet) => ({
      id: snippet.id,
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      code_preview: snippet.code?.slice(0, 150) || '',
      tags: snippet.tags.map((tag: any) => typeof tag === 'object' ? tag.name : tag),
      author: {
        id: snippet.author.id,
        username: snippet.author.username,
      },
      likes_count: snippet.likes_count || 0,
      is_liked: snippet.is_liked || false,
      created_at: snippet.created_at,
    }));
  };

  const snippets = transformSnippets(response);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Snippets</h1>
        <Button asChild>
          <a href="/snippets/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Snippet
          </a>
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {snippets.map((snippet) => (
          <SnippetCard
            key={snippet.id}
            snippet={snippet}
          />
        ))}
      </div>

      {snippets.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 mb-4">
            No snippets found
          </div>
          <Button asChild>
            <a href="/snippets/create">Create your first snippet</a>
          </Button>
        </div>
      )}
    </div>
  );
}