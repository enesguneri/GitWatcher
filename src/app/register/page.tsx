// src/app/register/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/lib/actions';

export default function RegisterPage() {
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function clientAction(formData: FormData) {
        setIsLoading(true);
        setMessage('');

        const result = await registerUser(formData);
        if (result?.error) {
            setMessage(result.error);
            setIsLoading(false);
        } else {
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        }
    }

    const isSuccess = message.includes('successful');

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-[#0a0e1a] text-slate-100 p-6 selection:bg-blue-500/30 selection:text-blue-200">
            {/* Background Glows */}
            <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 backdrop-blur-xl shadow-2xl shadow-black/50 animate-[fadeIn_0.4s_ease-out]">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <span className="text-2xl">🔍</span>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 bg-clip-text text-transparent">
                            GitWatcher
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-slate-100">Create Account</h1>
                    <p className="text-xs text-slate-500 mt-1">Join to track and audit your GitHub repositories</p>
                </div>

                {/* Form */}
                <form action={clientAction} className="space-y-4">
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
                            GitHub Username
                        </label>
                        <input
                            name="githubUsername"
                            type="text"
                            placeholder="e.g. enesguneri"
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
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 bg-white/[0.02] text-slate-200 placeholder:text-slate-600 border border-white/[0.08] rounded-xl focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-150 text-sm"
                        />
                    </div>

                    {/* Feedback message */}
                    {message && (
                        <p className={`text-xs font-semibold px-3 py-2 rounded-lg border animate-[fadeIn_0.2s_ease-out] ${
                            isSuccess
                                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                                : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                        }`}>
                            {isSuccess ? '✅' : '⚠️'} {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white shadow-lg shadow-emerald-500/10 transition-all duration-150 text-sm cursor-pointer mt-2"
                    >
                        {isLoading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 text-center text-xs text-slate-500 border-t border-white/[0.04] pt-5">
                    Already have an account?{' '}
                    <Link href="/login" className="font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                        Sign in instead
                    </Link>
                </div>
            </div>
        </div>
    );
}