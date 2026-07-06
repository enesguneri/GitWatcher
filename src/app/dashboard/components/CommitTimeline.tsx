// src/app/dashboard/components/CommitTimeline.tsx
import type { CommitInfo } from '@/lib/types';

// Consistent colors for repos in timeline
const REPO_COLORS = [
    '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b',
    '#ef4444', '#06b6d4', '#ec4899', '#84cc16',
];

interface CommitTimelineProps {
    commits: CommitInfo[];
}

export function CommitTimeline({ commits }: CommitTimelineProps) {
    if (commits.length === 0) {
        return (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Recent Commits
                </h3>
                <p className="text-slate-500 text-sm">No recent commit activity found.</p>
            </div>
        );
    }

    // Map repo names to colors
    const repoNames = [...new Set(commits.map((c) => c.repo))];
    const repoColorMap: Record<string, string> = {};
    repoNames.forEach((name, i) => {
        repoColorMap[name] = REPO_COLORS[i % REPO_COLORS.length];
    });

    function formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
                Recent Commits
            </h3>

            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/[0.08]" />

                <div className="space-y-4">
                    {commits.map((commit, index) => (
                        <div key={`${commit.sha}-${index}`} className="relative flex gap-4 pl-6">
                            {/* Dot */}
                            <div
                                className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 shrink-0"
                                style={{
                                    borderColor: repoColorMap[commit.repo],
                                    backgroundColor: `${repoColorMap[commit.repo]}33`,
                                }}
                            />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-200 truncate">
                                    {commit.message}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className="text-xs px-1.5 py-0.5 rounded font-mono"
                                        style={{
                                            color: repoColorMap[commit.repo],
                                            backgroundColor: `${repoColorMap[commit.repo]}15`,
                                        }}
                                    >
                                        {commit.repo}
                                    </span>
                                    <span className="text-xs text-slate-600 font-mono">
                                        {commit.sha}
                                    </span>
                                    <span className="text-xs text-slate-600">
                                        {formatDate(commit.date)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
