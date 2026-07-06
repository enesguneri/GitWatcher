// src/app/dashboard/page.tsx
// Dashboard overview — fetches GitHub data and displays profile, stats, repos, commits
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { fetchDashboardData } from '@/lib/github';
import type { ApiError } from '@/lib/types';

import { ProfileCard } from './components/ProfileCard';
import { StatsGrid } from './components/StatsGrid';
import { LanguageChart } from './components/LanguageChart';
import { RepoList } from './components/RepoList';
import { CommitTimeline } from './components/CommitTimeline';

export const metadata = {
    title: 'Dashboard — GitWatcher',
    description: 'Your GitHub profile analytics and insights.',
};

// This page accesses cookies and MongoDB at runtime
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    // Verify session (defense in depth — proxy already checks)
    const session = await verifySession();
    if (!session) redirect('/login');

    // Fetch user from database
    await connectToDatabase();
    const user = await User.findById(session.userId).select('email githubUsername').lean();
    if (!user) redirect('/login');

    // Fetch GitHub data
    try {
        const data = await fetchDashboardData(user.githubUsername);

        return (
            <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                {/* Profile + Language side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    <div className="lg:col-span-3">
                        <ProfileCard profile={data.profile} />
                    </div>
                    <div className="lg:col-span-2">
                        <LanguageChart languages={data.languages} />
                    </div>
                </div>

                {/* Stats */}
                <StatsGrid
                    totalRepos={data.profile.public_repos}
                    totalStars={data.totalStars}
                    totalForks={data.totalForks}
                    followers={data.profile.followers}
                    following={data.profile.following}
                />

                {/* Repos + Commits side by side */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2">
                        <RepoList repos={data.repos} />
                    </div>
                    <div className="xl:col-span-1">
                        <CommitTimeline commits={data.recentCommits} />
                    </div>
                </div>
            </div>
        );
    } catch (err) {
        const error = err as ApiError;

        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-8 max-w-md text-center">
                    <div className="text-4xl mb-4">
                        {error.type === 'rate_limit' ? '⏳' : error.type === 'not_found' ? '🔍' : '⚠️'}
                    </div>
                    <h2 className="text-lg font-semibold text-red-400 mb-2">
                        {error.type === 'rate_limit'
                            ? 'Rate Limit Exceeded'
                            : error.type === 'not_found'
                                ? 'GitHub User Not Found'
                                : 'Something Went Wrong'}
                    </h2>
                    <p className="text-sm text-slate-400">
                        {error.message}
                    </p>
                    {error.type === 'rate_limit' && (
                        <p className="text-xs text-slate-500 mt-3">
                            Unauthenticated requests are limited to 60/hour.
                            Add a GITHUB_TOKEN to .env.local for 5,000/hour.
                        </p>
                    )}
                </div>
            </div>
        );
    }
}
