// app/(public)/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, TrendingUp, Users, Code, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { SnippetCard } from '@/components/features/snippets/snippet-card';
import { apiClient } from '@/lib/api/client';
import { useQuery } from '@tanstack/react-query';

export default function HomePage() {
    const [search, setSearch] = useState('');

    // Fetch trending snippets
    const { data: trendingSnippets, isLoading } = useQuery({
        queryKey: ['trending-snippets'],
        queryFn: () =>
            apiClient.get('/api/v1/snippets', {
                params: { limit: 6, sort: 'trending' }
            }).then(res => res.data),
    });

    // Featured languages
    const featuredLanguages = [
        { name: 'JavaScript', color: 'bg-yellow-400', count: '12.5k' },
        { name: 'Python', color: 'bg-blue-500', count: '8.7k' },
        { name: 'TypeScript', color: 'bg-blue-600', count: '6.3k' },
        { name: 'Go', color: 'bg-cyan-500', count: '3.2k' },
        { name: 'Rust', color: 'bg-orange-600', count: '2.8k' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20">
                <div className="container mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                        <Sparkles className="h-4 w-4" />
                        Over 50,000 snippets shared
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Share Code. Learn Together.
                    </h1>

                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
                        Discover, share, and collaborate on code snippets with developers worldwide.
                        From quick solutions to complex algorithms, find what you need.
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto mb-12">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search snippets by language, tags, or problem..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-12 pr-24 h-14 text-lg rounded-xl border-2 shadow-lg"
                            />
                            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10">
                                Search
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center mt-4">
                            <span className="text-sm text-gray-500">Try:</span>
                            {['authentication', 'sorting', 'api', 'react hooks', 'database'].map((tag) => (
                                <button
                                    key={tag}
                                    onClick={() => setSearch(tag)}
                                    className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="h-12 px-8 rounded-xl text-lg" asChild>
                            <Link href="/snippets">
                                Explore Snippets
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl text-lg" asChild>
                            <Link href="/register">
                                Join Community
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">50K+</div>
                            <div className="text-gray-600 dark:text-gray-400">Snippets</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">10K+</div>
                            <div className="text-gray-600 dark:text-gray-400">Developers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">25+</div>
                            <div className="text-gray-600 dark:text-gray-400">Languages</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">1M+</div>
                            <div className="text-gray-600 dark:text-gray-400">Likes</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Snippets */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="h-6 w-6 text-orange-500" />
                                <h2 className="text-3xl font-bold">Trending Snippets</h2>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">Most liked snippets this week</p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/snippets">
                                View All
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {trendingSnippets?.slice(0, 6).map((snippet: any) => (
                                <SnippetCard
                                    key={snippet.id}
                                    snippet={{
                                        ...snippet,
                                        code_preview: snippet.code?.slice(0, 100) || '',
                                        tags: snippet.tags?.map((t: any) => t.name) || [],
                                    }}
                                    showLikeButton={false} // Don't show like button for public
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Languages Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Code className="h-8 w-8 text-blue-500" />
                            <h2 className="text-3xl font-bold">Popular Languages</h2>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Browse snippets by programming language
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {featuredLanguages.map((lang) => (
                            <Link
                                key={lang.name}
                                href={`/snippets?language=${lang.name.toLowerCase()}`}
                                className="group"
                            >
                                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                    <CardContent className="p-6 text-center">
                                        <div className={`${lang.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4`}>
                                            <span className="text-white font-bold">
                                                {lang.name.charAt(0)}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-lg mb-1">{lang.name}</h3>
                                        <p className="text-sm text-gray-500">{lang.count} snippets</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Users className="h-8 w-8" />
                        <h2 className="text-4xl font-bold">Join Our Community</h2>
                    </div>
                    <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90">
                        Share your knowledge, learn from others, and build together with developers worldwide.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" className="h-12 px-8 rounded-xl text-lg" asChild>
                            <Link href="/register">
                                Create Free Account
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 rounded-xl text-lg border-white text-white hover:bg-white/10" asChild>
                            <Link href="/snippets">
                                Browse Without Account
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}