// src/app/dashboard/analysis/components/SecurityFindings.tsx
'use client';

import { useState } from 'react';
import type { IFinding } from '@/models/Analysis';

interface SecurityFindingsProps {
    findings: IFinding[];
}

export function SecurityFindings({ findings }: SecurityFindingsProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleOpen = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const getSeverityBadge = (severity: 'info' | 'warning' | 'critical') => {
        switch (severity) {
            case 'critical':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/25">
                        Critical
                    </span>
                );
            case 'warning':
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
                        Warning
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/25">
                        Info
                    </span>
                );
        }
    };

    if (findings.length === 0) {
        return (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Security Audit Findings
                </h3>
                <p className="text-slate-500 text-sm">No security findings or threats detected in your public repositories. Great job!</p>
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
                Security Audit Findings ({findings.length})
            </h3>

            <div className="space-y-3">
                {findings.map((finding, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div
                            key={idx}
                            className={`group rounded-xl border transition-all duration-200 ${
                                isOpen
                                    ? 'border-white/10 bg-white/[0.04]'
                                    : 'border-white/[0.04] bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02]'
                            }`}
                        >
                            {/* Accordion Header */}
                            <button
                                onClick={() => toggleOpen(idx)}
                                className="w-full flex items-center justify-between gap-4 p-4 text-left cursor-pointer"
                            >
                                <div className="flex flex-wrap items-center gap-3 min-w-0">
                                    {getSeverityBadge(finding.severity)}
                                    <span className="text-sm font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                                        {finding.repo}
                                    </span>
                                    <span className="text-slate-400 text-sm hidden md:inline truncate max-w-sm">
                                        - {finding.issue}
                                    </span>
                                </div>
                                <span className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                                    ▼
                                </span>
                            </button>

                            {/* Accordion Content */}
                            {isOpen && (
                                <div className="px-4 pb-4 pt-1 border-t border-white/[0.04] text-sm space-y-3 animate-[fadeIn_0.2s_ease-out]">
                                    <div className="md:hidden">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Issue
                                        </p>
                                        <p className="text-slate-300 font-medium">{finding.issue}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                            Recommendation
                                        </p>
                                        <p className="text-slate-300 bg-white/[0.02] p-3 rounded-lg border border-white/[0.05] leading-relaxed">
                                            {finding.recommendation}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
