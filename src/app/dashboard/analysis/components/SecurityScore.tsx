// src/app/dashboard/analysis/components/SecurityScore.tsx
interface SecurityScoreProps {
    score: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export function SecurityScore({ score, riskLevel }: SecurityScoreProps) {
    // Circle SVG params
    const radius = 50;
    const strokeWidth = 10;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    // Determine colors based on score / riskLevel
    let colorClass = 'stroke-emerald-500 text-emerald-400';
    let bgGlow = 'bg-emerald-500/10 border-emerald-500/20';
    if (score < 40 || riskLevel === 'critical' || riskLevel === 'high') {
        colorClass = 'stroke-rose-500 text-rose-400';
        bgGlow = 'bg-rose-500/10 border-rose-500/20';
    } else if (score < 75 || riskLevel === 'medium') {
        colorClass = 'stroke-amber-500 text-amber-400';
        bgGlow = 'bg-amber-500/10 border-amber-500/20';
    }

    return (
        <div className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6`}>
            <div className="flex-1 text-center sm:text-left">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Security Score
                </h3>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                    <span className="text-3xl font-extrabold text-slate-100">{score}</span>
                    <span className="text-slate-500 text-sm">/ 100</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                    Your codebase risk level is assessed as{' '}
                    <span className={`font-semibold capitalize px-2 py-0.5 rounded text-xs ${bgGlow}`}>
                        {riskLevel}
                    </span>
                </p>
                <p className="mt-2 text-xs text-slate-500">
                    *Based on public repository names, metadata, and description scanning.
                </p>
            </div>

            {/* Circular Gauge */}
            <div className="relative flex items-center justify-center shrink-0 w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background track circle */}
                    <circle
                        className="stroke-slate-800"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Foreground progress circle */}
                    <circle
                        className={`transition-all duration-1000 ease-out ${colorClass.split(' ')[0]}`}
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference + ' ' + circumference}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <div className="absolute text-xl font-bold font-mono tracking-tight text-slate-300">
                    {score}%
                </div>
            </div>
        </div>
    );
}
