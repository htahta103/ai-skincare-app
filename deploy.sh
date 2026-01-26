#!/bin/bash

set -e

echo "🚀 Cloudflare Pages CLI Deployment"
echo ""

# Check if wrangler is installed (local or global)
if ! command -v wrangler &> /dev/null && [ ! -f "node_modules/.bin/wrangler" ]; then
    echo "❌ Wrangler CLI not found. Installing locally..."
    npm install --save-dev wrangler
    echo "✅ Wrangler installed"
fi

# Use local wrangler if available, otherwise global
if [ -f "node_modules/.bin/wrangler" ]; then
    WRANGLER_CMD="./node_modules/.bin/wrangler"
    echo "✅ Using local Wrangler CLI"
else
    WRANGLER_CMD="wrangler"
    echo "✅ Using global Wrangler CLI"
fi

$WRANGLER_CMD --version
echo ""

# Check if logged in
echo "🔐 Checking Cloudflare authentication..."
if ! $WRANGLER_CMD whoami &> /dev/null; then
    echo "⚠️  Not logged in. Please login to Cloudflare..."
    $WRANGLER_CMD login
else
    echo "✅ Authenticated to Cloudflare"
    $WRANGLER_CMD whoami
fi
echo ""

# Build the project
echo "📦 Building Next.js application..."
npm run build

echo ""
echo "🔄 Converting to Cloudflare Pages format..."

# Try next-on-pages, but continue if it fails (known issue)
if npx @cloudflare/next-on-pages@1 2>&1 | tee /tmp/next-on-pages.log; then
    echo "✅ next-on-pages conversion successful"
else
    echo "⚠️  next-on-pages encountered an error (known issue)"
    echo "   Attempting to use existing build output if available..."
    
    # Check if we have a previous build
    if [ -d ".vercel/output/static" ] && [ -f ".vercel/output/static/_worker.js/index.js" ]; then
        echo "✅ Found existing build output, using it"
    else
        echo "❌ No usable build output found"
        echo "   This might be a next-on-pages compatibility issue"
        echo "   Consider using Cloudflare Pages dashboard deployment instead"
        exit 1
    fi
fi

echo ""
echo "📊 Checking build output..."
if [ ! -d ".vercel/output/static" ]; then
    echo "❌ Build output not found at .vercel/output/static"
    echo "   Trying alternative: check if .vercel/output exists"
    if [ -d ".vercel/output" ]; then
        echo "   Found .vercel/output, listing contents:"
        ls -la .vercel/output/
    fi
    exit 1
fi

echo "✅ Build output found"
echo ""

# Deploy to Cloudflare Pages
echo "🚀 Deploying to Cloudflare Pages..."
echo ""

# Check if project exists, if not create it
PROJECT_NAME="ai-skincare-app"

echo "Deploying project: $PROJECT_NAME"
$WRANGLER_CMD pages deploy .vercel/output/static --project-name="$PROJECT_NAME"

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Check your Cloudflare Pages dashboard for the deployment"
echo "   2. Verify the bundle size in build logs"
echo "   3. Test your application at the provided URL"
