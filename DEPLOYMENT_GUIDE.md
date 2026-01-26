# Cloudflare Pages Deployment Guide

## What I Can Help With ✅

I've prepared:
- ✅ Optimized `next.config.ts` with webpack configurations
- ✅ `wrangler.toml` with nodejs_compat flag
- ✅ Updated `package.json` build script
- ✅ Verification scripts to check configurations

## What You Need to Do Manually 🔧

### Option 1: Deploy via Cloudflare Pages Dashboard (Recommended)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Navigate to: **Pages** → **Create a project**

2. **Connect Your Repository**
   - Connect your GitHub/GitLab repository
   - Select the `ai-skincare-app` repository

3. **Configure Build Settings**
   - **Build command**: `npm run build && npx @cloudflare/next-on-pages@1`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: (leave empty)
   - **Node.js version**: 20.x or 22.x

4. **Set Environment Variables**
   Add these in the Cloudflare Pages dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. **Configure Compatibility Flags**
   - Go to: **Settings** → **Functions** → **Compatibility Flags**
   - Add: `nodejs_compat`
   - Or ensure `wrangler.toml` is in the root (it should be picked up automatically)

6. **Deploy**
   - Click **Save and Deploy**
   - Monitor the build logs for:
     - `▲ Next.js 16.1.1 (webpack)` ← Confirms webpack is used
     - Bundle size warnings
     - Any errors

### Option 2: Deploy via Wrangler CLI (Alternative)

If you prefer CLI deployment:

1. **Install Wrangler** (if not already installed):
   ```bash
   npm install -g wrangler
   ```

2. **Login to Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Deploy to Pages**:
   ```bash
   # Build first
   npm run build && npx @cloudflare/next-on-pages@1
   
   # Deploy (requires wrangler pages project setup)
   wrangler pages deploy .vercel/output/static
   ```

## Verification Checklist

After deployment, verify:

- [ ] Build logs show `(webpack)` not `(Turbopack)`
- [ ] Build completes without bundle size errors
- [ ] `nodejs_compat` flag is enabled
- [ ] Environment variables are set
- [ ] Application loads correctly

## Troubleshooting

### If Bundle Size Still Exceeds 3 MB:

1. **Check build logs** for actual bundle size
2. **Verify webpack is used** (look for `(webpack)` in logs)
3. **Consider upgrading** to Cloudflare paid plan (10 MB limit)
4. **Alternative**: Migrate to OpenNext adapter (see BUNDLE_ANALYSIS.md)

### If Build Fails:

1. Check that build command includes `npm run build` first
2. Verify Node.js version is 20+ in Cloudflare Pages settings
3. Check environment variables are set correctly
4. Review build logs for specific errors

## Current Configuration Files

All configuration files are ready:
- ✅ `next.config.ts` - Webpack optimizations
- ✅ `wrangler.toml` - Cloudflare compatibility flags
- ✅ `package.json` - Build script with --webpack flag

## Next Steps

1. **Commit and push** your changes to Git
2. **Go to Cloudflare Pages dashboard**
3. **Configure build settings** as shown above
4. **Deploy and monitor** the build logs
