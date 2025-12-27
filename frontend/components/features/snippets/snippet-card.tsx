// components/features/snippets/snippet-card.tsx
'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Copy, Eye } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { UserAvatar } from '@/components/shared/user-avatar';

interface SnippetCardProps {
  snippet: {
    id: number;
    title: string;
    description?: string;
    language: string;
    code_preview: string;
    tags: string[];  // Changed from Tag[] to string[]
    author: {
      id: number;
      username: string;
    };
    likes_count: number;
    is_liked: boolean;
    created_at: string;
  };
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () =>
      apiClient.post(`/api/v1/snippets/${snippet.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries(['snippets']);
      queryClient.invalidateQueries(['snippet', snippet.id]);
    },
  });

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(snippet.code_preview);
      toast.success('Code copied to clipboard');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2 truncate">
              {snippet.title}
            </h3>
            {snippet.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                {snippet.description}
              </p>
            )}
          </div>
          <Badge variant="secondary" className="ml-2 flex-shrink-0">
            {snippet.language}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {snippet.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {snippet.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{snippet.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
          <code>{snippet.code_preview}</code>
        </pre>
      </CardContent>
      <CardFooter className="pt-3 border-t flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserAvatar user={snippet.author} size="sm" />
          <div>
            <p className="text-sm font-medium">{snippet.author.username}</p>
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(snippet.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isLoading}
            className="h-8 w-8 p-0"
          >
            <Heart
              className={`h-4 w-4 ${snippet.is_liked ? 'fill-red-500 text-red-500' : ''}`}
            />
            <span className="ml-1 text-xs">{snippet.likes_count}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8 w-8 p-0"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-8 w-8 p-0"
          >
            <a href={`/snippets/${snippet.id}`}>
              <Eye className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}