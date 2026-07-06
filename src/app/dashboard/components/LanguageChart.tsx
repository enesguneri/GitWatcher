// src/app/dashboard/components/LanguageChart.tsx
import type { LanguageStats } from '@/lib/types';

// GitHub-inspired language colors
const LANG_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Java: '#b07219',
    'C#': '#178600',
    'C++': '#f34b7d',
    C: '#555555',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Vue: '#41b883',
    Svelte: '#ff3e00',
};

function getColor(language: string): string {
    return LANG_COLORS[language] || '#6e7681';
}

interface LanguageChartProps {
    languages: LanguageStats;
}

export function LanguageChart({ languages }: LanguageChartProps) {
    const entries = Object.entries(languages).slice(0, 8);

    if (entries.length === 0) {
        return (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Languages
                </h3>
                <p className="text-slate-500 text-sm">No language data available.</p>
            </div>
        );
    }

    // Build conic-gradient string
    let gradientParts: string[] = [];
    let currentPercent = 0;
    for (const [lang, pct] of entries) {
        const nextPercent = currentPercent + pct;
        gradientParts.push(`${getColor(lang)} ${currentPercent}% ${nextPercent}%`);
        currentPercent = nextPercent;
    }
    // Fill remaining with gray
    if (currentPercent < 100) {
        gradientParts.push(`#1e293b ${currentPercent}% 100%`);
    }

    const gradient = `conic-gradient(${gradientParts.join(', ')})`;

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
                Languages
            </h3>

            <div className="flex items-center gap-6">
                {/* Donut Chart */}
                <div
                    className="w-28 h-28 rounded-full shrink-0"
                    style={{
                        background: gradient,
                        mask: 'radial-gradient(circle, transparent 55%, black 56%)',
                        WebkitMask: 'radial-gradient(circle, transparent 55%, black 56%)',
                    }}
                />

                {/* Legend */}
                <div className="flex-1 space-y-2">
                    {entries.map(([lang, pct]) => (
                        <div key={lang} className="flex items-center gap-2 text-sm">
                            <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: getColor(lang) }}
                            />
                            <span className="text-slate-300 truncate flex-1">{lang}</span>
                            <span className="text-slate-500 font-mono text-xs">{pct}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
