// src/app/dashboard/components/ProfileCard.tsx
import type { GitHubProfile } from '@/lib/types';

interface ProfileCardProps {
    profile: GitHubProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
    const memberSince = new Date(profile.created_at).getFullYear();
    const yearsOnGitHub = new Date().getFullYear() - memberSince;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
            {/* Gradient accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

            <div className="flex items-start gap-5">
                {/* Avatar */}
                <img
                    src={profile.avatar_url}
                    alt={profile.login}
                    width={80}
                    height={80}
                    className="rounded-full ring-2 ring-white/10 ring-offset-2 ring-offset-[#0a0e1a]"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-100 truncate">
                        {profile.name || profile.login}
                    </h2>
                    <a
                        href={profile.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        @{profile.login} ↗
                    </a>

                    {profile.bio && (
                        <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                            {profile.bio}
                        </p>
                    )}

                    <p className="mt-2 text-xs text-slate-500">
                        📅 On GitHub for {yearsOnGitHub} year{yearsOnGitHub !== 1 ? 's' : ''} (since {memberSince})
                    </p>
                </div>
            </div>
        </div>
    );
}
