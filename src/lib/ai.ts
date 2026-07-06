// src/lib/ai.ts
// AI service module — Google Gemini integration for GitHub analysis
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { GitHubRepo, LanguageStats } from './types';
import type { IFinding, IRecommendation } from '@/models/Analysis';

// ─── Gemini Client Setup ────────────────────────────────────────────

function getGeminiModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

// ─── Safe JSON Parser ───────────────────────────────────────────────

function parseAIJson<T>(raw: string): T | null {
    try {
        // Strip markdown code fences if present (```json ... ```)
        let cleaned = raw.trim();
        if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
        }
        return JSON.parse(cleaned) as T;
    } catch {
        console.error('Failed to parse AI response as JSON:', raw.substring(0, 200));
        return null;
    }
}

// ─── Prompt Definitions ─────────────────────────────────────────────

function buildSecurityPrompt(
    username: string,
    repos: GitHubRepo[]
): string {
    const repoList = repos
        .slice(0, 15)
        .map((r) => `- ${r.name}: ${r.description || 'No description'} [${r.language || 'Unknown'}] ⭐${r.stargazers_count}`)
        .join('\n');

    return `You are a senior cybersecurity expert. Analyze the following GitHub repositories for security issues based on OWASP Top 10 and secure coding best practices.

Check for:
1. Risk of hardcoded secrets/API keys (based on repo names, descriptions, languages)
2. Potential insecure dependency usage
3. Missing configuration files (.gitignore, .env.example)
4. Missing security documentation in README
5. License and open-source security concerns

GitHub User: ${username}
Total repositories: ${repos.length}
Repositories:
${repoList}

Respond with ONLY valid JSON in this exact format, no other text:
{
  "riskLevel": "low|medium|high|critical",
  "overallScore": 0-100,
  "findings": [
    {
      "repo": "repo-name",
      "issue": "Description of the security concern",
      "severity": "info|warning|critical",
      "recommendation": "Suggested fix or improvement"
    }
  ]
}

Provide 3-8 findings. Be specific and actionable. Score 100 means excellent security, 0 means critical issues.`;
}

function buildPersonaPrompt(
    username: string,
    repoCount: number,
    followers: number,
    totalStars: number,
    languages: LanguageStats,
    repos: GitHubRepo[]
): string {
    const langList = Object.entries(languages)
        .slice(0, 8)
        .map(([lang, pct]) => `${lang}: ${pct}%`)
        .join(', ');

    const recentRepos = repos
        .slice(0, 5)
        .map((r) => r.name)
        .join(', ');

    return `You are a technical talent assessment expert. Analyze the following GitHub profile and assign a fitting developer persona.

Consider language distribution, repo types, community engagement (stars, forks, followers), and overall activity patterns.

Profile: ${username}
Stats: ${repoCount} repos, ${followers} followers, ${totalStars} total stars
Language distribution: ${langList}
Recent active repos: ${recentRepos}

Respond with ONLY valid JSON in this exact format, no other text:
{
  "title": "A technical title (e.g., 'Security-Focused Backend Architect', 'Full-Stack JavaScript Developer')",
  "summary": "2-3 sentence developer profile summary",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "focusAreas": ["Area to improve 1", "Area to improve 2"]
}

Be creative and specific. The title should reflect the developer's actual focus areas.`;
}

function buildRecommendationsPrompt(
    username: string,
    repos: GitHubRepo[]
): string {
    const repoDetails = repos
        .slice(0, 10)
        .map((r) => `- ${r.name} [${r.language || '?'}]: ${r.description || 'No desc'} | ⭐${r.stargazers_count} | Topics: ${r.topics?.join(', ') || 'none'}`)
        .join('\n');

    return `You are a senior software consultant. Review the following repositories and provide actionable improvement recommendations.

Categories to cover: Security, Documentation, Architecture, Testing, DevOps

GitHub User: ${username}
Repositories:
${repoDetails}

Respond with ONLY valid JSON in this exact format, no other text:
{
  "recommendations": [
    {
      "category": "Security|Documentation|Architecture|Testing|DevOps",
      "title": "Short recommendation title",
      "description": "Detailed description of what to improve and how",
      "priority": "low|medium|high"
    }
  ]
}

Provide 5-8 specific, actionable recommendations. Prioritize based on impact.`;
}

// ─── Public Analysis Functions ──────────────────────────────────────

interface SecurityAuditResult {
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    overallScore: number;
    findings: IFinding[];
}

interface PersonaResult {
    title: string;
    summary: string;
    strengths: string[];
    focusAreas: string[];
}

interface RecommendationsResult {
    recommendations: IRecommendation[];
}

export async function analyzeSecurityAudit(
    username: string,
    repos: GitHubRepo[]
): Promise<SecurityAuditResult> {
    const model = getGeminiModel();
    const prompt = buildSecurityPrompt(username, repos);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseAIJson<SecurityAuditResult>(text);

    if (!parsed) {
        return {
            riskLevel: 'medium',
            overallScore: 50,
            findings: [{
                repo: 'general',
                issue: 'AI analysis could not be completed. Please try again.',
                severity: 'info',
                recommendation: 'Retry the analysis.',
            }],
        };
    }

    // Validate and clamp score
    parsed.overallScore = Math.max(0, Math.min(100, parsed.overallScore || 50));
    parsed.riskLevel = parsed.riskLevel || 'medium';
    parsed.findings = (parsed.findings || []).map((f) => ({
        repo: String(f.repo || 'unknown'),
        issue: String(f.issue || ''),
        severity: (['info', 'warning', 'critical'].includes(f.severity) ? f.severity : 'info') as IFinding['severity'],
        recommendation: String(f.recommendation || ''),
    }));

    return parsed;
}

export async function analyzeDeveloperPersona(
    username: string,
    repoCount: number,
    followers: number,
    totalStars: number,
    languages: LanguageStats,
    repos: GitHubRepo[]
): Promise<PersonaResult> {
    const model = getGeminiModel();
    const prompt = buildPersonaPrompt(username, repoCount, followers, totalStars, languages, repos);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseAIJson<PersonaResult>(text);

    if (!parsed) {
        return {
            title: 'Developer',
            summary: 'AI persona analysis could not be completed. Please try again.',
            strengths: [],
            focusAreas: [],
        };
    }

    return {
        title: String(parsed.title || 'Developer'),
        summary: String(parsed.summary || ''),
        strengths: (parsed.strengths || []).map(String),
        focusAreas: (parsed.focusAreas || []).map(String),
    };
}

export async function analyzeRecommendations(
    username: string,
    repos: GitHubRepo[]
): Promise<IRecommendation[]> {
    const model = getGeminiModel();
    const prompt = buildRecommendationsPrompt(username, repos);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseAIJson<RecommendationsResult>(text);

    if (!parsed?.recommendations) {
        return [{
            category: 'General',
            title: 'Analysis Incomplete',
            description: 'AI recommendations could not be generated. Please try again.',
            priority: 'medium',
        }];
    }

    return parsed.recommendations.map((r) => ({
        category: String(r.category || 'General'),
        title: String(r.title || ''),
        description: String(r.description || ''),
        priority: (['low', 'medium', 'high'].includes(r.priority) ? r.priority : 'medium') as IRecommendation['priority'],
    }));
}
