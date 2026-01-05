export interface Env {
    AI: any;
    CACHE: KVNamespace;
    VECTORIZE: VectorizeIndex;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_KEY: string;
    SUPABASE_JWT_SECRET: string; // For JWT verification
    WORKER_SECRET: string; // Legacy, can be removed after migration
}

export interface AnalysisRequest {
    image_url: string;
    user_id: string;
    scan_id: string;
}

export interface SkinMetrics {
    pores: { score: number; confidence: number };
    texture: { score: number; confidence: number };
    tone: { score: number; confidence: number };
    hydration: { score: number; confidence: number };
}

export interface RAGContext {
    condition: string;
    relevance: number;
    recommendations: string[];
    roast_templates: string[];
    products: string[];
}

export interface AnalysisResponse {
    glow_score: number;
    analysis_summary: {
        hydration: { score: number; severity: string; description: string };
        texture: { score: number; severity: string; description: string };
        tone: { score: number; severity: string; description: string };
        pores: { score: number; severity: string; description: string };
    };
    roast_message: string;
    recommendations: string[];
    product_suggestions: string[];
    processing_time_ms: number;
    cache_hit: boolean;
}

export interface KnowledgeEntry {
    id: string;
    condition: string;
    symptoms: string[];
    severity_indicators: {
        mild: string;
        moderate: string;
        severe: string;
    };
    recommendations: string[];
    products: string[];
    roast_templates: string[];
    embedding?: number[];
}
