// src/app/dashboard/components/TopBar.tsx
import { verifySession } from '@/lib/session';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import { LogoutButton } from './LogoutButton';

export async function TopBar() {
    const session = await verifySession();
    let userEmail = '';
    let avatarUrl = '';

    if (session) {
        await connectToDatabase();
        const user = await User.findById(session.userId).select('email githubUsername').lean();
        if (user) {
            userEmail = user.email;
            // Use GitHub avatar as user avatar
            avatarUrl = `https://github.com/${user.githubUsername}.png?size=80`;
        }
    }

    return (
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3 border-b border-white/[0.06] bg-[#0a0e1a]/80 backdrop-blur-xl">
            {/* Spacer for mobile hamburger */}
            <div className="lg:hidden w-10" />

            {/* Center title — only mobile */}
            <span className="lg:hidden text-sm font-semibold text-slate-300">Dashboard</span>

            {/* Right section */}
            <div className="flex items-center gap-3 ml-auto">
                <div className="hidden sm:block text-right">
                    <p className="text-sm text-slate-300 font-medium">{userEmail}</p>
                </div>

                {avatarUrl && (
                    <img
                        src={avatarUrl}
                        alt="Avatar"
                        width={32}
                        height={32}
                        className="rounded-full ring-1 ring-white/10"
                    />
                )}

                <LogoutButton />
            </div>
        </header>
    );
}
