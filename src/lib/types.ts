// src/lib/types.ts
// Shared TypeScript type definitions for GitWatcher

// ─── GitHub API Response Types ───────────────────────────────────────

export interface GitHubProfile {
    login: string;
    avatar_url: string;
    name: string | null;
    bio: string | null;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
    html_url: string;
}

export interface GitHubRepo {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    language: string | null;
    stargazers_count: number;
    forks_count: number;
    updated_at: string;
    html_url: string;
    fork: boolean;
    topics: string[];
}

export interface CommitInfo {
    sha: string;
    message: string;
    date: string;
    repo: string;
    html_url: string;
}

export interface LanguageStats {
    [language: string]: number; // percentage (0-100)
}

// ─── Dashboard Composite Types ───────────────────────────────────────

export interface DashboardData {
    profile: GitHubProfile;
    repos: GitHubRepo[];
    languages: LanguageStats;
    recentCommits: CommitInfo[];
    totalStars: number;
    totalForks: number;
}

// ─── Error Types ─────────────────────────────────────────────────────

export type ApiErrorType = 'rate_limit' | 'not_found' | 'network' | 'unknown';

export interface ApiError {
    type: ApiErrorType;
    message: string;
}
