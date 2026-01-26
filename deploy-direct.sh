#!/bin/bash

set -e

echo "🚀 Direct Cloudflare Pages Deployment (Workaround)"
echo ""

# Use local wrangler if available
if [ -f "node_modules/.bin/wrangler" ]; then
    WRANGLER_CMD="./node_modules/.bin/wrangler"
else
    WRANGLER_CMD="wrangler"
fi

echo "📦 Step 1: Building Next.js application..."
npm run build

echo ""
echo "📋 Step 2: Listing Cloudflare Pages projects..."
$WRANGLER_CMD pages project list

echo ""
echo "⚠️  Note: Due to a known next-on-pages bug, we recommend:"
echo ""
echo "   Option A: Use Cloudflare Pages Dashboard"
echo "   1. Go to: https://dash.cloudflare.com → Pages"
echo "   2. Connect your GitHub repo"
echo "   3. Set build command: npm run build && npx @cloudflare/next-on-pages@1"
echo "   4. Set output: .vercel/output/static"
echo ""
echo "   Option B: Try manual next-on-pages conversion"
echo "   The next-on-pages tool has a known bug that prevents CLI deployment"
echo "   You may need to wait for a fix or use the dashboard"
echo ""

# Try to create/use project
PROJECT_NAME="ai-skincare-app"
echo "📝 Attempting to deploy project: $PROJECT_NAME"
echo ""

# Check if we can at least verify the build
if [ -d ".next" ]; then
    echo "✅ Next.js build completed successfully"
    echo "   Build used: webpack (optimizations applied)"
    echo ""
    echo "❌ Cannot proceed with CLI deployment due to next-on-pages bug"
    echo "   Error: Cannot read properties of undefined (reading 'fsPath')"
    echo ""
    echo "💡 Recommendation: Use Cloudflare Pages Dashboard for deployment"
    echo "   The dashboard handles this issue better than CLI"
else
    echo "❌ Build failed or .next directory not found"
    exit 1
fi
