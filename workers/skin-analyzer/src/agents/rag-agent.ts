import { Env, SkinMetrics, RAGContext } from '../types';

/**
 * RAG Agent
 * Queries vectorized skincare knowledge base for relevant recommendations
 */

export async function queryRAG(
    env: Env,
    visionMetrics: SkinMetrics
): Promise<RAGContext[]> {
    try {
        // Create an embedding from the metrics
        const metricsText = createMetricsDescription(visionMetrics);

        // Generate embedding using Cloudflare AI
        const embeddingResponse = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
            text: metricsText
        });

        const embedding = embeddingResponse.data?.[0] || [];

        // Query Vectorize for similar skin conditions
        const matches = await env.VECTORIZE.query(embedding, {
            topK: 3,
            returnMetadata: true
        });

        // Convert matches to RAG context
        const ragContext: RAGContext[] = matches.matches.map((match: any) => ({
            condition: match.metadata?.condition || 'Unknown condition',
            relevance: match.score || 0,
            recommendations: match.metadata?.recommendations || [],
            roast_templates: match.metadata?.roast_templates || [],
            products: match.metadata?.products || []
        }));

        // If no matches or vectorize not set up, return fallback knowledge
        if (ragContext.length === 0) {
            return getFallbackKnowledge(visionMetrics);
        }

        return ragContext;

    } catch (error) {
        console.error('RAG query error:', error);
        return getFallbackKnowledge(visionMetrics);
    }
}

function createMetricsDescription(metrics: SkinMetrics): string {
    const issues: string[] = [];

    if (metrics.pores.score < 70) {
        issues.push('enlarged pores');
    }
    if (metrics.texture.score < 70) {
        issues.push('rough texture');
    }
    if (metrics.tone.score < 75) {
        issues.push('uneven skin tone');
    }
    if (metrics.hydration.score < 70) {
        issues.push('dehydration');
    }

    if (issues.length === 0) {
        return 'healthy skin with good overall condition';
    }

    return `skin showing signs of ${issues.join(', ')}`;
}

function getFallbackKnowledge(metrics: SkinMetrics): RAGContext[] {
    const context: RAGContext[] = [];

    // Dehydration
    if (metrics.hydration.score < 70) {
        context.push({
            condition: 'Dehydration',
            relevance: 0.9,
            recommendations: [
                'Drink at least 8 glasses of water daily',
                'Use a hyaluronic acid serum',
                'Apply a rich moisturizer twice daily'
            ],
            roast_templates: [
                "Your skin's thirstier than a cactus in the Sahara. Hydrate!",
                "I've seen raisins with better moisture levels."
            ],
            products: [
                'The Ordinary Hyaluronic Acid 2% + B5',
                'CeraVe Moisturizing Cream'
            ]
        });
    }

    // Enlarged Pores
    if (metrics.pores.score < 65) {
        context.push({
            condition: 'Enlarged Pores',
            relevance: 0.85,
            recommendations: [
                'Use a niacinamide serum to minimize pores',
                'Try a weekly clay mask',
                'Don\'t skip sunscreen - UV damage enlarges pores'
            ],
            roast_templates: [
                "Your pores called—they want their own ZIP code.",
                "I've seen craters smaller than those pores."
            ],
            products: [
                'The Ordinary Niacinamide 10% + Zinc 1%',
                'Paula\'s Choice 2% BHA Liquid Exfoliant'
            ]
        });
    }

    // Texture Issues
    if (metrics.texture.score < 70) {
        context.push({
            condition: 'Rough Texture',
            relevance: 0.8,
            recommendations: [
                'Exfoliate 2-3 times per week',
                'Use a chemical exfoliant (AHA/BHA)',
                'Consider adding retinol to your routine'
            ],
            roast_templates: [
                "I've seen pizza with better texture. Exfoliate much?",
                "That texture's rougher than sandpaper."
            ],
            products: [
                'Paula\'s Choice 8% AHA Gel Exfoliant',
                'The Ordinary Retinol 0.5% in Squalane'
            ]
        });
    }

    // Ensure at least one context
    if (context.length === 0) {
        context.push({
            condition: 'Maintenance',
            relevance: 0.7,
            recommendations: [
                'Continue your current skincare routine',
                'Always wear SPF 30+ sunscreen',
                'Stay hydrated and get adequate sleep'
            ],
            roast_templates: [
                "Not bad, but there's always room for improvement.",
                "You're doing okay, but don't get cocky."
            ],
            products: [
                'CeraVe AM Facial Moisturizing Lotion SPF 30',
                'Neutrogena Hydro Boost Water Gel'
            ]
        });
    }

    return context.slice(0, 3); // Return top 3
}
