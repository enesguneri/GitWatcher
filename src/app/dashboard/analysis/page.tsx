// src/app/dashboard/analysis/page.tsx
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import Analysis from '@/models/Analysis';

import { SecurityScore } from './components/SecurityScore';
import { SecurityFindings } from './components/SecurityFindings';
import { PersonaCard } from './components/PersonaCard';
import { RecommendationGrid } from './components/RecommendationGrid';
import { AnalyzeButton } from './components/AnalyzeButton';

export const metadata = {
    title: 'AI Analysis — GitWatcher',
    description: 'AI-powered security audits, developer personas, and coding improvements.',
};

// Force dynamic runtime check for cookies and database connections
export const dynamic = 'force-dynamic';

export default async function AnalysisPage() {
    const session = await verifySession();
    if (!session) redirect('/login');

    await connectToDatabase();
    const user = await User.findById(session.userId).select('githubUsername').lean();
    if (!user) redirect('/login');

    // Retrieve the most recent analysis for this user
    const analysis = await Analysis.findOne({ userId: session.userId })
        .sort({ analyzedAt: -1 })
        .lean();

    // Check if the cache is stale (older than 24h)
    const isStale = analysis ? new Date(analysis.expiresAt) < new Date() : false;

    function formatTime(dateVal: Date): string {
        return new Date(dateVal).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    return (
        <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-5">
                <div>
                    <h2 className="text-xl font-bold text-slate-100">
                        AI-Powered Analysis Engine
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Security scanning, developer persona mappings, and improvement recommendation cards.
                    </p>
                </div>
                {analysis && (
                    <div className="shrink-0">
                        <AnalyzeButton isRefresh={true} />
                    </div>
                )}
            </div>

            {/* Content Switcher */}
            {!analysis ? (
                // If no analysis exists, show begin audit button
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl">
                    <AnalyzeButton isRefresh={false} />
                </div>
            ) : (
                // If analysis exists, display results
                <div className="space-y-6">
                    {/* Stale cache banner warning */}
                    {isStale && (
                        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400 flex items-center justify-between gap-3">
                            <span>
                                ⏳ This report is older than 24 hours. A fresh audit is recommended to capture your recent commits.
                            </span>
                            <div className="shrink-0 scale-90">
                                <AnalyzeButton isRefresh={true} />
                            </div>
                        </div>
                    )}

                    {/* Security Audit Scores */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-2">
                            <SecurityScore
                                score={analysis.securityAudit.overallScore}
                                riskLevel={analysis.securityAudit.riskLevel}
                            />
                        </div>
                        <div className="lg:col-span-3">
                            <PersonaCard developerPersona={analysis.developerPersona} />
                        </div>
                    </div>

                    {/* Security Detailed Findings */}
                    <SecurityFindings findings={analysis.securityAudit.findings} />

                    {/* Recommendations */}
                    <RecommendationGrid recommendations={analysis.recommendations} />

                    {/* Meta info */}
                    <div className="text-center text-[10px] text-slate-600 font-mono pt-4">
                        Last audited on: {formatTime(analysis.analyzedAt)}
                    </div>
                </div>
            )}
        </div>
    );
}
