// src/models/Analysis.ts
// MongoDB schema for cached AI analysis results
import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── Sub-document interfaces ────────────────────────────────────────

export interface IFinding {
    repo: string;
    issue: string;
    severity: 'info' | 'warning' | 'critical';
    recommendation: string;
}

export interface IRecommendation {
    category: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
}

export interface IAnalysis extends Document {
    userId: mongoose.Types.ObjectId | string;
    githubUsername: string;
    securityAudit: {
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
        findings: IFinding[];
        overallScore: number;
    };
    developerPersona: {
        title: string;
        summary: string;
        strengths: string[];
        focusAreas: string[];
    };
    recommendations: IRecommendation[];
    analyzedAt: Date;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

// ─── Sub-schemas ────────────────────────────────────────────────────

const FindingSchema = new Schema<IFinding>({
    repo: { type: String, required: true },
    issue: { type: String, required: true },
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        required: true,
    },
    recommendation: { type: String, required: true },
}, { _id: false });

const RecommendationSchema = new Schema<IRecommendation>({
    category: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true,
    },
}, { _id: false });

// ─── Main schema ───────────────────────────────────────────────────

const AnalysisSchema = new Schema<IAnalysis>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        githubUsername: { type: String, required: true },

        securityAudit: {
            riskLevel: {
                type: String,
                enum: ['low', 'medium', 'high', 'critical'],
                default: 'low',
            },
            findings: [FindingSchema],
            overallScore: { type: Number, min: 0, max: 100, default: 0 },
        },

        developerPersona: {
            title: { type: String, default: '' },
            summary: { type: String, default: '' },
            strengths: [{ type: String }],
            focusAreas: [{ type: String }],
        },

        recommendations: [RecommendationSchema],

        analyzedAt: { type: Date, default: Date.now },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

// Compound index for fast lookups
AnalysisSchema.index({ userId: 1, analyzedAt: -1 });

const Analysis: Model<IAnalysis> =
    mongoose.models.Analysis || mongoose.model<IAnalysis>('Analysis', AnalysisSchema);

export default Analysis;
