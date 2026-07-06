// src/app/dashboard/analysis/components/RecommendationGrid.tsx
import type { IRecommendation } from '@/models/Analysis';

interface RecommendationGridProps {
    recommendations: IRecommendation[];
}

export function RecommendationGrid({ recommendations }: RecommendationGridProps) {
    const getCategoryIcon = (category: string) => {
        const cat = category.toLowerCase();
        if (cat.includes('security')) return '🛡️';
        if (cat.includes('document')) return '📝';
        if (cat.includes('architect') || cat.includes('design') || cat.includes('code')) return '🏗️';
        if (cat.includes('test')) return '🧪';
        if (cat.includes('devops') || cat.includes('deploy') || cat.includes('ci')) return '🚀';
        return '💡';
    };

    const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
        switch (priority) {
            case 'high':
                return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'medium':
                return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            default:
                return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        }
    };

    if (recommendations.length === 0) {
        return (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                    Improvement Recommendations
                </h3>
                <p className="text-slate-500 text-sm">No specific recommendations available at this time.</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                Actionable Recommendations ({recommendations.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((rec, idx) => (
                    <div
                        key={idx}
                        className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-sm transition-all duration-200 hover:border-white/10 hover:bg-white/[0.04]"
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl" role="img" aria-label={rec.category}>
                                    {getCategoryIcon(rec.category)}
                                </span>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-200 line-clamp-1">
                                        {rec.title}
                                    </h4>
                                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                        {rec.category}
                                    </p>
                                </div>
                            </div>

                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getPriorityColor(rec.priority)}`}>
                                {rec.priority}
                            </span>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">
                            {rec.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
