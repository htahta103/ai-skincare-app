import { SkinMetrics } from '../types';

/**
 * Scoring Agent
 * Calculates glow score from vision metrics (algorithmic, no AI needed)
 */

export interface GlowScoreResult {
    overall: number;
    categories: {
        pores: { score: number; severity: string };
        texture: { score: number; severity: string };
        tone: { score: number; severity: string };
        hydration: { score: number; severity: string };
    };
}

// Weights for each category (must sum to 1)
const WEIGHTS = {
    hydration: 0.30, // Most important for "glow"
    texture: 0.25,
    tone: 0.25,
    pores: 0.20
};

export function calculateGlowScore(metrics: SkinMetrics): GlowScoreResult {
    // Calculate weighted average
    const overall = Math.round(
        metrics.hydration.score * WEIGHTS.hydration +
        metrics.texture.score * WEIGHTS.texture +
        metrics.tone.score * WEIGHTS.tone +
        metrics.pores.score * WEIGHTS.pores
    );

    return {
        overall,
        categories: {
            pores: {
                score: metrics.pores.score,
                severity: getSeverity(metrics.pores.score)
            },
            texture: {
                score: metrics.texture.score,
                severity: getSeverity(metrics.texture.score)
            },
            tone: {
                score: metrics.tone.score,
                severity: getSeverity(metrics.tone.score)
            },
            hydration: {
                score: metrics.hydration.score,
                severity: getSeverity(metrics.hydration.score)
            }
        }
    };
}

function getSeverity(score: number): string {
    if (score >= 85) return 'minimal';
    if (score >= 70) return 'mild';
    if (score >= 50) return 'moderate';
    return 'severe';
}

export function getScoreInterpretation(score: number): string {
    if (score >= 90) return 'Excellent - Your skin is glowing!';
    if (score >= 80) return 'Good - Nice healthy skin';
    if (score >= 70) return 'Fair - Room for improvement';
    if (score >= 60) return 'Needs attention - Time for a better routine';
    return 'Concerning - Consult a dermatologist';
}
