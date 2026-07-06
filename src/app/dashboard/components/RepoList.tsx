// src/app/dashboard/components/RepoList.tsx
'use client';

import { useState } from 'react';
import type { GitHubRepo } from '@/lib/types';

// GitHub-inspired language colors (subset)
const LANG_COLORS: Record<string, string> = {
    TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5',
    Java: '#b07219', 'C#': '#178600', 'C++': '#f34b7d', Go: '#00ADD8',
    Rust: '#dea584', Ruby: '#701516', PHP: '#4F5D95', Swift: '#F05138',
    Kotlin: '#A97BFF', HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051',
    Dart: '#00B4AB', Vue: '#41b883',
};

type SortKey = 'updated' | 'stars' | 'name';

interface RepoListProps {
    repos: GitHubRepo[];
}

export function RepoList({ repos }: RepoListProps) {
    const [sortBy, setSortBy] = useState<SortKey>('updated');
    const [filterLang, setFilterLang] = useState<string>('all');

    // Get unique languages for filter
    const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))] as string[];

    // Filter
    let filtered = filterLang === 'all'
        ? repos
        : repos.filter((r) => r.language === filterLang);

    // Sort
    const sorted = [...filtered].sort((a, b) => {
        if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    function timeAgo(dateStr: string): string {
        const diff = Date.now() - new Date(dateStr).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        if (days === 0) return 'today';
        if (days === 1) return 'yesterday';
        if (days < 30) return `${days}d ago`;
        if (days < 365) return `${Math.floor(days / 30)}mo ago`;
        return `${Math.floor(days / 365)}y ago`;
    }

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
            {/* Header with controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Repositories ({sorted.length})
                </h3>
                <div className="flex items-center gap-2">
                    {/* Language filter */}
                    <select
                        value={filterLang}
                        onChange={(e) => setFilterLang(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300 px-2 py-1.5 outline-none focus:border-blue-500/50 cursor-pointer"
                    >
                        <option value="all">All Languages</option>
                        {languages.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>

                    {/* Sort buttons */}
                    <div className="flex bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                        {([
                            ['updated', 'Recent'],
                            ['stars', 'Stars'],
                            ['name', 'Name'],
                        ] as [SortKey, string][]).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setSortBy(key)}
                                className={`text-xs px-3 py-1.5 transition-colors ${
                                    sortBy === key
                                        ? 'bg-blue-500/20 text-blue-400'
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Repo grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sorted.map((repo) => (
                    <a
                        key={repo.id}
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-500/[0.04] hover:-translate-y-0.5"
                    >
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 truncate">
                                📁 {repo.name}
                            </h4>
                            <span className="text-xs text-slate-600 shrink-0">
                                {timeAgo(repo.updated_at)}
                            </span>
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 min-h-[2rem]">
                            {repo.description || 'No description provided.'}
                        </p>

                        <div className="flex items-center gap-3 text-xs">
                            {repo.language && (
                                <span className="flex items-center gap-1 text-slate-400">
                                    <span
                                        className="w-2.5 h-2.5 rounded-full"
                                        style={{ backgroundColor: LANG_COLORS[repo.language] || '#6e7681' }}
                                    />
                                    {repo.language}
                                </span>
                            )}
                            {repo.stargazers_count > 0 && (
                                <span className="text-slate-500">⭐ {repo.stargazers_count}</span>
                            )}
                            {repo.forks_count > 0 && (
                                <span className="text-slate-500">🔱 {repo.forks_count}</span>
                            )}
                        </div>
                    </a>
                ))}
            </div>

            {sorted.length === 0 && (
                <p className="text-center text-slate-500 text-sm py-8">
                    No repositories found for this filter.
                </p>
            )}
        </div>
    );
}
