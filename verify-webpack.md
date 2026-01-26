# How to Verify Webpack Optimizations Are Applied

## Quick Verification Methods

### 1. Check Build Output Logs

When you run `npm run build`, look for these indicators:

**✅ Webpack is being used:**
```
▲ Next.js 16.1.1 (webpack)  ← This confirms webpack is active
```

**❌ If you see this instead, Turbopack is being used:**
```
▲ Next.js 16.1.1 (Turbopack)  ← This means webpack optimizations are NOT applied
```

### 2. Check Build Script in package.json

Your `package.json` should have:
```json
"build": "next build --webpack"
```

The `--webpack` flag forces Next.js to use webpack instead of Turbopack.

### 3. Verify in Cloudflare Build Logs

In your Cloudflare Pages deployment logs, you should see:
```
▲ Next.js 16.1.1 (webpack)
```

If you see `(Turbopack)` instead, the optimizations are not being applied.

### 4. Check for Code Splitting Evidence

After building, check the `.next/static/chunks` directory for separate chunks:

```bash
# Check if framer-motion is in a separate chunk
ls -lh .next/static/chunks/*framer-motion* 2>/dev/null

# Check if supabase is in a separate chunk  
ls -lh .next/static/chunks/*supabase* 2>/dev/null
```

### 5. Verify Experimental Features

Look for this in build output:
```
- Experiments (use with caution):
  · optimizePackageImports
```

This confirms the `optimizePackageImports` feature is active.

## How to Test Locally

Run this command to verify:

```bash
npm run build 2>&1 | grep -E "(webpack|Turbopack|optimizePackageImports)"
```

**Expected output:**
```
▲ Next.js 16.1.1 (webpack)
- Experiments (use with caution):
  · optimizePackageImports
```

## Common Issues

### Issue: Still seeing Turbopack

**Cause:** The `--webpack` flag might not be in the build command.

**Fix:** 
1. Check `package.json` has `"build": "next build --webpack"`
2. In Cloudflare Pages, ensure build command is: `npm run build && npx @cloudflare/next-on-pages@1`
3. Not just: `npx @cloudflare/next-on-pages@1`

### Issue: Webpack config not found

**Cause:** `next.config.ts` might have syntax errors.

**Fix:** Run `npm run build` locally and check for errors.

## Verification Checklist

- [ ] Build output shows `(webpack)` not `(Turbopack)`
- [ ] `package.json` has `--webpack` flag in build script
- [ ] Cloudflare build command includes `npm run build`
- [ ] Build logs show `optimizePackageImports` experiment
- [ ] No webpack configuration errors in build output
