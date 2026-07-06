// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/actions';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleLogin(formData: FormData) {
        setIsLoading(true);
        setError('');

        const result = await loginUser(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else if (result?.success) {
            router.push('/dashboard');
        }
    }

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#0a0e1a] text-slate-100 p-6 selection:bg-blue-500/30 selection:text-blue-200">
            {/* Background Glows */}
            <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl shadow-2xl shadow-black/50 animate-[fadeIn_0.4s_ease-out]">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <span className="text-2xl">🔍</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                            GitWatcher
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-100">Welcome Back</h1>
                    <p className="text-xs text-slate-500 mt-1">Sign in to your account to monitor repositories</p>
                </div>

                {/* Form */}
                <form action={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Email Address
                        </label>
                        <input
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            className="w-full px-4 py-3 bg-white/[0.02] text-slate-200 placeholder:text-slate-600 border border-white/[0.08] rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-150 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                            Password
                        </label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="w-full px-4 py-3 bg-white/[0.02] text-slate-200 placeholder:text-slate-600 border border-white/[0.08] rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-150 text-sm"
                        />
                    </div>

                    {/* Error message with bounce animation */}
                    {error && (
                        <p className="text-rose-400 text-xs font-semibold bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-lg animate-[fadeIn_0.2s_ease-out]">
                            ⚠️ {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg shadow-purple-500/10 transition-all duration-150 text-sm cursor-pointer mt-2"
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-xs text-slate-500 border-t border-white/[0.04] pt-5">
                    Don't have an account?{' '}
                    <Link href="/register" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        Create one here
                    </Link>
                </div>
            </div>
        </div>
    );
}