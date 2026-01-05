import { Env, SkinMetrics, RAGContext } from '../types';

/**
 * Roast Agent
 * Generates personalized, detailed roast messages with professional flair
 * Think: sassy dermatologist meets beauty influencer - honest but helpful
 */

interface RoastResult {
    headline: string;      // Short punchy roast (display in UI)
    detailed_roast: string; // Full professional analysis with personality
    vibe_check: string;    // One-word vibe assessment
    priority_fix: string;  // What to fix first
}

export async function generateRoast(
    env: Env,
    metrics: SkinMetrics,
    ragContext: RAGContext[]
): Promise<string> {
    try {
        const roastResult = await generateDetailedRoast(env, metrics, ragContext);
        return roastResult.detailed_roast;
    } catch (error) {
        console.error('Roast generation error:', error);
        return getFallbackRoast(metrics);
    }
}

export async function generateDetailedRoast(
    env: Env,
    metrics: SkinMetrics,
    ragContext: RAGContext[]
): Promise<RoastResult> {
    try {
        const overallScore = Math.round(
            (metrics.hydration.score + metrics.texture.score +
                metrics.tone.score + metrics.pores.score) / 4
        );

        const worstIssue = findWorstIssue(metrics);
        const bestFeature = findBestFeature(metrics);
        const conditions = ragContext.map(r => r.condition).join(', ');

        const prompt = `You are RoastBot, a sassy but professional skincare expert. Analyze this skin data and give a DETAILED roast that's honest, funny, and actually helpful.

SKIN METRICS:
- Hydration: ${metrics.hydration.score}/100 (${getLevel(metrics.hydration.score)})
- Texture: ${metrics.texture.score}/100 (${getLevel(metrics.texture.score)})
- Skin Tone: ${metrics.tone.score}/100 (${getLevel(metrics.tone.score)})
- Pores: ${metrics.pores.score}/100 (${getLevel(metrics.pores.score)})
- Overall Glow Score: ${overallScore}/100
- Detected Issues: ${conditions || 'General skin concerns'}

INSTRUCTIONS:
Write a 2-3 sentence roast that:
1. Opens with a slay/witty observation about their biggest issue (${worstIssue})
2. Acknowledges what's working (${bestFeature} looks decent)
3. Gives ONE specific action they should take TODAY
4. Ends with encouraging but real talk

Be like a best friend who's a dermatology resident - brutally honest but wants you to glow. Use modern slang naturally. No emojis.

Format: Just the roast text, no labels or quotes.`;

        const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            prompt: prompt,
            max_tokens: 200,
            temperature: 0.8
        });

        let roast = (response.response || '').trim();

        // Clean up any quotation marks
        roast = roast.replace(/^["']|["']$/g, '').trim();

        if (roast && roast.length > 30 && roast.length < 500) {
            return {
                headline: getHeadlineRoast(worstIssue, overallScore),
                detailed_roast: roast,
                vibe_check: getVibeCheck(overallScore),
                priority_fix: worstIssue
            };
        }

        // Fallback to crafted roast
        return getCraftedRoast(metrics, overallScore, worstIssue, bestFeature);

    } catch (error) {
        console.error('Detailed roast generation error:', error);
        const overallScore = Math.round(
            (metrics.hydration.score + metrics.texture.score +
                metrics.tone.score + metrics.pores.score) / 4
        );
        const worstIssue = findWorstIssue(metrics);
        const bestFeature = findBestFeature(metrics);
        return getCraftedRoast(metrics, overallScore, worstIssue, bestFeature);
    }
}

function findWorstIssue(metrics: SkinMetrics): string {
    const issues = [
        { name: 'hydration', score: metrics.hydration.score, label: 'hydration' },
        { name: 'texture', score: metrics.texture.score, label: 'texture' },
        { name: 'tone', score: metrics.tone.score, label: 'skin tone' },
        { name: 'pores', score: metrics.pores.score, label: 'pores' }
    ];
    issues.sort((a, b) => a.score - b.score);
    return issues[0].label;
}

function findBestFeature(metrics: SkinMetrics): string {
    const features = [
        { name: 'hydration', score: metrics.hydration.score, label: 'hydration levels' },
        { name: 'texture', score: metrics.texture.score, label: 'skin texture' },
        { name: 'tone', score: metrics.tone.score, label: 'tone evenness' },
        { name: 'pores', score: metrics.pores.score, label: 'pore appearance' }
    ];
    features.sort((a, b) => b.score - a.score);
    return features[0].label;
}

function getLevel(score: number): string {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 55) return 'needs work';
    return 'struggling';
}

function getVibeCheck(score: number): string {
    if (score >= 85) return 'Glowing';
    if (score >= 75) return 'Serving';
    if (score >= 65) return 'Potential';
    if (score >= 50) return 'Struggling';
    return 'SOS';
}

function getHeadlineRoast(issue: string, score: number): string {
    const headlines: Record<string, string[]> = {
        'hydration': [
            "Desert vibes detected",
            "Your skin is parched bestie",
            "Hydration? Never heard of her"
        ],
        'texture': [
            "Texture check failed",
            "Smooth isn't the word here",
            "Your skin has... character"
        ],
        'skin tone': [
            "The unevenness is giving chaos",
            "Tone needs some therapy",
            "Hyperpigmentation has entered the chat"
        ],
        'pores': [
            "Pores said go big or go home",
            "Your pores are screaming",
            "Congestion is real"
        ]
    };

    const options = headlines[issue] || ["Room for improvement detected"];
    return options[Math.floor(Math.random() * options.length)];
}

function getCraftedRoast(
    metrics: SkinMetrics,
    overallScore: number,
    worstIssue: string,
    bestFeature: string
): RoastResult {
    let detailed = '';

    if (overallScore >= 80) {
        detailed = `Okay, your skin is actually looking kind of slay right now. ${bestFeature.charAt(0).toUpperCase() + bestFeature.slice(1)} is serving, and I respect it. But let's talk about that ${worstIssue} situation - it's the one thing holding you back from elite status. Focus on ${getActionFor(worstIssue)} and you'll be hitting 90s in no time. The foundation is there, now let's build.`;
    } else if (overallScore >= 65) {
        detailed = `Look, you're not a lost cause - that ${bestFeature} is actually doing something. But we need to have a serious conversation about your ${worstIssue}. It's giving "I skip skincare when I'm tired" energy. Start with ${getActionFor(worstIssue)} tonight, no excuses. You have good bones here, let's actually use them.`;
    } else if (overallScore >= 50) {
        detailed = `Bestie, your skin is going through it. The ${worstIssue} is the main character right now and not in a good way. At least your ${bestFeature} isn't completely giving up on you. Real talk: ${getActionFor(worstIssue)} is non-negotiable starting today. We're building a comeback story here.`;
    } else {
        detailed = `Okay so... we have work to do. Your ${worstIssue} is in crisis mode and honestly, your skin barrier is probably crying for help. The good news? Even the ${bestFeature} shows there's something to work with. Emergency protocol: ${getActionFor(worstIssue)} immediately. We're rebuilding from the ground up but you can absolutely turn this around.`;
    }

    return {
        headline: getHeadlineRoast(worstIssue, overallScore),
        detailed_roast: detailed,
        vibe_check: getVibeCheck(overallScore),
        priority_fix: worstIssue
    };
}

function getActionFor(issue: string): string {
    const actions: Record<string, string> = {
        'hydration': 'layer a hyaluronic acid serum under your moisturizer on damp skin',
        'texture': 'add a gentle exfoliating toner with AHAs 2-3 times a week',
        'skin tone': 'apply vitamin C serum every morning before sunscreen',
        'pores': 'use a niacinamide serum daily to minimize and regulate oil'
    };
    return actions[issue] || 'establish a consistent AM and PM routine';
}

function getFallbackRoast(metrics: SkinMetrics): string {
    const overallScore = Math.round(
        (metrics.hydration.score + metrics.texture.score +
            metrics.tone.score + metrics.pores.score) / 4
    );
    const worstIssue = findWorstIssue(metrics);
    const bestFeature = findBestFeature(metrics);

    return getCraftedRoast(metrics, overallScore, worstIssue, bestFeature).detailed_roast;
}
