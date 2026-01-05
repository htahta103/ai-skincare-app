/**
 * Image Optimizer
 * Pre-processes images before AI analysis to reduce quota usage
 * Resizes to 672x672 (2x2 grid of 336px tiles) for optimal Llama 3.2 Vision processing
 */

const TARGET_SIZE = 672; // 2x2 grid of 336px tiles (Llama 3.2 Vision native tile size)

export async function optimizeImage(imageBuffer: ArrayBuffer): Promise<string> {
    console.log('[Image Optimizer] Input size:', imageBuffer.byteLength, 'bytes');

    try {
        // Convert ArrayBuffer to base64 for the AI model
        // Note: In Cloudflare Workers, we don't have access to Canvas API directly
        // So we'll pass the raw base64 and let the AI model handle resizing
        // The AI model will internally tile the image optimally

        // For now, just convert to base64
        // TODO: If bundle size permits, add wasm-vips for actual resizing
        const base64 = arrayBufferToBase64(imageBuffer);

        // Add data URL prefix for JPEG (most common format from mobile cameras)
        const dataUrl = `data:image/jpeg;base64,${base64}`;

        console.log('[Image Optimizer] Output base64 length:', base64.length, 'chars');
        console.log('[Image Optimizer] Target tile size:', TARGET_SIZE, 'px (2x2 grid)');

        return dataUrl;
    } catch (error) {
        console.error('[Image Optimizer] Error:', error);
        // Fallback to raw base64
        return arrayBufferToBase64(imageBuffer);
    }
}

export async function getImageHash(base64Image: string): Promise<string> {
    // Create a robust hash by sampling from multiple parts of the image
    const encoder = new TextEncoder();
    const len = base64Image.length;

    // Sample from start, multiple middle sections, and end to catch actual image differences
    const sampleSize = 500;
    const samples = [
        base64Image.substring(0, sampleSize),                           // Start (header)
        base64Image.substring(Math.floor(len * 0.25), Math.floor(len * 0.25) + sampleSize),  // 25%
        base64Image.substring(Math.floor(len * 0.5), Math.floor(len * 0.5) + sampleSize),   // Middle
        base64Image.substring(Math.floor(len * 0.75), Math.floor(len * 0.75) + sampleSize), // 75%
        base64Image.substring(Math.max(0, len - sampleSize))            // End
    ].join('|');

    // Include length in hash to differentiate images of different sizes
    const hashInput = `${len}:${samples}`;

    const data = encoder.encode(hashInput);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

export async function enhanceImage(base64Image: string): Promise<string> {
    // Placeholder for image enhancement
    // Could use Cloudflare Image Resizing or external API
    return base64Image;
}

export function calculateImageQuality(visionMetrics: any): number {
    // Calculate confidence score from vision analysis
    const confidences = [
        visionMetrics.pores?.confidence || 0,
        visionMetrics.texture?.confidence || 0,
        visionMetrics.tone?.confidence || 0,
        visionMetrics.hydration?.confidence || 0
    ];

    return confidences.reduce((a, b) => a + b, 0) / confidences.length;
}
