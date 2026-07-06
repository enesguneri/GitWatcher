// src/app/dashboard/analysis/components/AnalyzeButton.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { runAnalysis } from '@/lib/actions';

interface AnalyzeButtonProps {
    isRefresh?: boolean;
    onStart?: () => void;
    onError?: (msg: string) => void;
}

export function AnalyzeButton({ isRefresh = false, onStart, onError }: AnalyzeButtonProps) {
    const [loading, setLoading] = useState(false);
    const [progressStep, setProgressStep] = useState(0);
    const router = useRouter();

    const steps = [
        'Fetching public repositories...',
        'Running OWASP security scans...',
        'Synthesizing developer persona...',
        'Formulating recommendations...',
        'Saving results to database...',
    ];

    const handleClick = async () => {
        setLoading(true);
        if (onStart) onStart();

        // Simulate progress step changes every few seconds to keep the user engaged
        const interval = setInterval(() => {
            setProgressStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 4000);

        try {
            const result = await runAnalysis(isRefresh);
            clearInterval(interval);

            if (result?.error) {
                if (onError) onError(result.error);
                setLoading(false);
            } else {
                router.refresh();
            }
        } catch (error) {
            clearInterval(interval);
            if (onError) onError('Failed to complete AI analysis. Try again.');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center animate-[fadeIn_0.3s_ease-out]">
                {/* Custom Spinner */}
                <div className="relative w-16 h-16 mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/20" />
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500 border-t-transparent animate-spin" />
                </div>
                <h4 className="text-slate-200 font-semibold mb-1">
                    Analyzing Profile
                </h4>
                <p className="text-xs text-purple-400 animate-pulse">
                    {steps[progressStep]}
                </p>
                <p className="text-[10px] text-slate-500 mt-2">
                    This can take up to 30-40 seconds. Please do not close this page.
                </p>
            </div>
        );
    }

    if (isRefresh) {
        return (
            <button
                onClick={handleClick}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-purple-500 hover:bg-purple-600 active:scale-[0.98] text-white border border-purple-400/20 shadow-lg shadow-purple-500/20 cursor-pointer transition-all duration-150"
            >
                🔄 Recalculate AI Report
            </button>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h3 className="text-lg font-bold text-slate-200 mb-2">
                AI Profile Audit & Security Scan
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
                Leverage Google Gemini to analyze your GitHub projects. Get a customized persona, comprehensive security checks, and developer improvements.
            </p>
            <button
                onClick={handleClick}
                className="px-6 py-3 font-semibold rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 hover:opacity-95 active:scale-[0.98] text-white shadow-xl shadow-purple-500/10 cursor-pointer transition-all duration-150"
            >
                🔍 Begin Audit (Takes ~30s)
            </button>
        </div>
    );
}
