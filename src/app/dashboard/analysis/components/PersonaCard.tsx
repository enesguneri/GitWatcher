// src/app/dashboard/analysis/components/PersonaCard.tsx
interface PersonaCardProps {
    developerPersona: {
        title: string;
        summary: string;
        strengths: string[];
        focusAreas: string[];
    };
}

export function PersonaCard({ developerPersona }: PersonaCardProps) {
    const { title, summary, strengths, focusAreas } = developerPersona;

    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
            {/* Glowing gradient back-circle to create depth */}
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-5">
                Developer Persona
            </h3>

            {/* Title / Summary */}
            <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/25 mb-3">
                    ✨ AI-Assigned Identity
                </div>
                <h4 className="text-2xl font-extrabold text-slate-100 mb-2 leading-tight">
                    {title || 'Developer Persona'}
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                    {summary || 'Analyzing repository footprint to determine coding profile details...'}
                </p>
            </div>

            {/* Strengths & Focus Areas Side by Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-5 border-t border-white/[0.06]">
                {/* Strengths */}
                <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        💪 Key Strengths
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {strengths.map((str, i) => (
                            <span
                                key={i}
                                className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                            >
                                {str}
                            </span>
                        ))}
                        {strengths.length === 0 && (
                            <span className="text-xs text-slate-500 italic">No key strengths found.</span>
                        )}
                    </div>
                </div>

                {/* Focus Areas */}
                <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                        🎯 Focus & Growth Areas
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {focusAreas.map((focus, i) => (
                            <span
                                key={i}
                                className="text-xs px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/10"
                            >
                                {focus}
                            </span>
                        ))}
                        {focusAreas.length === 0 && (
                            <span className="text-xs text-slate-500 italic">No focus areas defined.</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
