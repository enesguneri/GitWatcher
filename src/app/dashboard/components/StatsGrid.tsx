// src/app/dashboard/components/StatsGrid.tsx
interface StatsGridProps {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    followers: number;
    following: number;
}

const statItems = [
    { key: 'repos', label: 'Repositories', icon: '📦', color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400' },
    { key: 'stars', label: 'Total Stars', icon: '⭐', color: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/20', text: 'text-amber-400' },
    { key: 'forks', label: 'Total Forks', icon: '🔱', color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400' },
    { key: 'followers', label: 'Followers', icon: '👥', color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    { key: 'following', label: 'Following', icon: '➡️', color: 'from-slate-500/20 to-slate-600/5', border: 'border-slate-500/20', text: 'text-slate-400' },
];

export function StatsGrid({ totalRepos, totalStars, totalForks, followers, following }: StatsGridProps) {
    const values: Record<string, number> = {
        repos: totalRepos,
        stars: totalStars,
        forks: totalForks,
        followers,
        following,
    };

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {statItems.map((item) => (
                <div
                    key={item.key}
                    className={`relative overflow-hidden rounded-xl border ${item.border} bg-gradient-to-br ${item.color} p-4 backdrop-blur-sm transition-transform duration-200 hover:scale-[1.03]`}
                >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <p className={`text-2xl font-bold ${item.text}`}>
                        {values[item.key].toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.label}</p>
                </div>
            ))}
        </div>
    );
}
