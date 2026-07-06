// src/app/page.tsx
// Public landing page for GitWatcher — introduces features with links to login/register
import Link from 'next/link';
import { verifySession } from '@/lib/session';

export const metadata = {
    title: 'GitWatcher — AI-Powered GitHub Profile Analyzer & Security Auditor',
    description: 'Analyze your GitHub profile, coding habits, and repository security vulnerabilities using Google Gemini AI.',
};

// Prevent caching to dynamically render CTA buttons based on authentication state
export const dynamic = 'force-dynamic';

export default async function Home() {
    // Check if user is logged in to dynamically adjust CTA button text/links
    const session = await verifySession();
    const isAuthenticated = !!session;

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-slate-100 font-sans flex flex-col justify-between selection:bg-blue-500/30 selection:text-blue-200">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

            {/* Navbar */}
            <header className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/[0.04]">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🔍</span>
                    <span className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                        GitWatcher
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/20 hover:bg-blue-500/25 transition-all duration-200"
                        >
                            Go to Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all duration-150"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center flex-1 flex flex-col items-center justify-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-6 animate-[fadeIn_0.5s_ease-out]">
                    🤖 Powered by Google Gemini AI
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-none mb-6 max-w-3xl animate-[fadeIn_0.6s_ease-out]">
                    Discover the Identity & Security of Your{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                        GitHub Profile
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg text-slate-400 max-w-xl mb-8 leading-relaxed animate-[fadeIn_0.7s_ease-out]">
                    GitWatcher scans your public repositories, provides detailed security vulnerability audits, maps developer personas, and recommends clean code optimizations.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center justify-center gap-4 mb-16 sm:mb-24 animate-[fadeIn_0.8s_ease-out]">
                    {isAuthenticated ? (
                        <Link
                            href="/dashboard"
                            className="px-6 py-3 font-semibold rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 hover:opacity-95 active:scale-[0.98] text-white shadow-xl shadow-purple-500/10 transition-all duration-150"
                        >
                            Open Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/register"
                                className="px-6 py-3 font-semibold rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 hover:opacity-95 active:scale-[0.98] text-white shadow-xl shadow-purple-500/10 transition-all duration-150"
                            >
                                Create Free Account
                            </Link>
                            <Link
                                href="/login"
                                className="px-6 py-3 font-semibold rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] text-slate-300 transition-all duration-150"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left animate-[fadeIn_0.9s_ease-out]">
                    {/* Feature 1 */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                        <div className="text-3xl mb-4">🛡️</div>
                        <h3 className="text-base font-bold text-slate-200 mb-2">
                            Security Vulnerability Auditing
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Scans your repository names and descriptions to audit potential API key leaks, missing configurations, and license compliance based on OWASP principles.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                        <div className="text-3xl mb-4">🤖</div>
                        <h3 className="text-base font-bold text-slate-200 mb-2">
                            Developer Persona Identification
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Maps developer identity titles based on language usage ratios, commit frequencies, community interactions, and active project distributions.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm">
                        <div className="text-3xl mb-4">📈</div>
                        <h3 className="text-base font-bold text-slate-200 mb-2">
                            Optimization Recommendations
                        </h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            Provides categorized actionable suggestions spanning code quality, documentation completeness, architecture structure, testing, and DevOps deployment.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6 border-t border-white/[0.04] text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-600">
                <p>© {new Date().getFullYear()} GitWatcher. All rights reserved.</p>
                <p className="mt-2 sm:mt-0">
                    Built for developers and security analysts.
                </p>
            </footer>
        </div>
    );
}