#!/bin/bash

echo "🔍 Verifying Webpack Optimizations..."
echo ""

# Check package.json build script
echo "1. Checking package.json build script..."
BUILD_SCRIPT=$(grep '"build"' package.json | head -1)
if echo "$BUILD_SCRIPT" | grep "webpack" > /dev/null 2>&1; then
    echo "   ✅ Build script includes --webpack flag"
    echo "   📝 $BUILD_SCRIPT"
else
    echo "   ❌ Build script missing --webpack flag"
    echo "   📝 $BUILD_SCRIPT"
fi
echo ""

# Check next.config.ts for webpack config
echo "2. Checking next.config.ts for webpack configuration..."
if grep -q "webpack:" next.config.ts; then
    echo "   ✅ Webpack configuration found in next.config.ts"
    if grep -q "splitChunks" next.config.ts; then
        echo "   ✅ Code splitting configuration found"
    fi
    if grep -q "optimizePackageImports" next.config.ts; then
        echo "   ✅ optimizePackageImports configuration found"
    fi
else
    echo "   ❌ No webpack configuration found"
fi
echo ""

# Run build and check output
echo "3. Running build to verify webpack is used..."
BUILD_OUTPUT=$(npm run build 2>&1)
if echo "$BUILD_OUTPUT" | grep -q "Next.js.*webpack"; then
    echo "   ✅ Webpack is being used (not Turbopack)"
    VERSION=$(echo "$BUILD_OUTPUT" | grep "Next.js" | head -1)
    echo "   📝 $VERSION"
else
    echo "   ❌ Webpack is NOT being used - check build output"
fi

if echo "$BUILD_OUTPUT" | grep -q "optimizePackageImports"; then
    echo "   ✅ optimizePackageImports experiment is active"
fi
echo ""

# Check for build artifacts
echo "4. Checking build artifacts..."
if [ -d ".next" ]; then
    echo "   ✅ .next directory exists"
    if [ -d ".next/static/chunks" ]; then
        CHUNK_COUNT=$(ls -1 .next/static/chunks/*.js 2>/dev/null | wc -l | tr -d ' ')
        echo "   ✅ Found $CHUNK_COUNT chunk files (code splitting working)"
    fi
else
    echo "   ❌ .next directory not found - build may have failed"
fi
echo ""

echo "✅ Verification complete!"
echo ""
echo "📋 Summary:"
echo "   - Check Cloudflare Pages build logs for: 'Next.js.*webpack'"
echo "   - Ensure build command is: 'npm run build && npx @cloudflare/next-on-pages@1'"
echo "   - Look for 'optimizePackageImports' in build output"
