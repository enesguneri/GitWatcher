// src/lib/github.ts
// GitHub REST API service module — fetches profile, repos, languages, and commits

import type {
    GitHubProfile,
    GitHubRepo,
    CommitInfo,
    LanguageStats,
    DashboardData,
    ApiError,
} from './types';

const GITHUB_API = 'https://api.github.com';

// Build request headers (with optional token for higher rate limits)
function getHeaders(): HeadersInit {
    const headers: HeadersInit = {
        Accept: 'application/vnd.github.v3+json',
    };
    if (process.env.GITHUB_TOKEN) {
        headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    return headers;
}

// Centralized error handler for GitHub API responses
function handleGitHubError(response: Response, context: string): never {
    if (response.status === 403) {
        throw {
            type: 'rate_limit',
            message: 'GitHub API rate limit exceeded. Please try again later or add a GitHub token.',
        } as ApiError;
    }
    if (response.status === 404) {
        throw {
            type: 'not_found',
            message: `GitHub user not found. Please check the username.`,
        } as ApiError;
    }
    throw {
        type: 'network',
        message: `Failed to fetch ${context} from GitHub (HTTP ${response.status}).`,
    } as ApiError;
}

// ─── Public API Functions ────────────────────────────────────────────

export async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
    const response = await fetch(`${GITHUB_API}/users/${username}`, {
        headers: getHeaders(),
        next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) handleGitHubError(response, 'profile');
    return response.json();
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
    const response = await fetch(
        `${GITHUB_API}/users/${username}/repos?sort=updated&per_page=30&type=owner`,
        {
            headers: getHeaders(),
            next: { revalidate: 300 },
        }
    );

    if (!response.ok) handleGitHubError(response, 'repositories');
    const repos: GitHubRepo[] = await response.json();

    // Filter out forks to show only original repos
    return repos.filter((repo) => !repo.fork);
}

export async function fetchLanguageStats(repos: GitHubRepo[]): Promise<LanguageStats> {
    // Use the primary language from each repo to avoid excessive API calls
    // This avoids hitting rate limits (1 call per repo for /languages endpoint)
    const languageCounts: Record<string, number> = {};
    let totalRepos = 0;

    for (const repo of repos) {
        if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
            totalRepos++;
        }
    }

    // Convert counts to percentages
    const stats: LanguageStats = {};
    for (const [lang, count] of Object.entries(languageCounts)) {
        stats[lang] = Math.round((count / totalRepos) * 100);
    }

    // Sort by percentage descending
    const sorted = Object.entries(stats)
        .sort(([, a], [, b]) => b - a)
        .reduce((acc, [lang, pct]) => ({ ...acc, [lang]: pct }), {} as LanguageStats);

    return sorted;
}

export async function fetchRecentCommits(
    username: string,
    repos: GitHubRepo[]
): Promise<CommitInfo[]> {
    // Fetch commits from the 3 most recently updated repos
    const recentRepos = repos.slice(0, 3);
    const commitPromises = recentRepos.map(async (repo) => {
        try {
            const response = await fetch(
                `${GITHUB_API}/repos/${username}/${repo.name}/commits?per_page=5`,
                {
                    headers: getHeaders(),
                    next: { revalidate: 300 },
                }
            );

            if (!response.ok) return [];

            const commits = await response.json();
            return commits.map((commit: any) => ({
                sha: commit.sha?.substring(0, 7) || '',
                message: commit.commit?.message?.split('\n')[0] || 'No message',
                date: commit.commit?.author?.date || '',
                repo: repo.name,
                html_url: commit.html_url || '',
            })) as CommitInfo[];
        } catch {
            return [];
        }
    });

    const allCommits = (await Promise.all(commitPromises)).flat();

    // Sort by date descending and return top 10
    return allCommits
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
}

// ─── Aggregate Function ─────────────────────────────────────────────

export async function fetchDashboardData(username: string): Promise<DashboardData> {
    // Fetch profile and repos in parallel
    const [profile, repos] = await Promise.all([
        fetchGitHubProfile(username),
        fetchGitHubRepos(username),
    ]);

    // Fetch language stats and commits (depend on repos data)
    const [languages, recentCommits] = await Promise.all([
        fetchLanguageStats(repos),
        fetchRecentCommits(username, repos),
    ]);

    // Calculate totals
    const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);

    return {
        profile,
        repos,
        languages,
        recentCommits,
        totalStars,
        totalForks,
    };
}
