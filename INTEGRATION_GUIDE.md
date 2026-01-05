# Setting Up Cloudflare Worker with Supabase Edge Function

## Architecture

```
Next.js App → Supabase Edge Function → Cloudflare Worker AI → Response
```

This keeps all secrets server-side and provides better security.

## Setup Instructions

### 1. Set Supabase Environment Variables

Go to your Supabase dashboard and add these secrets to the Edge Function:

**Navigate to**: `https://supabase.com/dashboard/project/ntbqjbmitptpcftnxavi/functions`

Click on "analyze-scan" function → "Settings" → "Secrets"

Add these three secrets:

```
CLOUDFLARE_WORKER_URL=https://skin-analyzer.ai-skincare.workers.dev
CLOUDFLARE_WORKER_SECRET=a4da79183c91d284550024c0c3b1ce304f84b9ab3e63aae3b86359fd9149121c
SUPABASE_URL=https://ntbqjbmitptpcftnxavi.supabase.co
```

### 2. Deploy Updated Edge Function

```bash
# From project root
npx supabase functions deploy analyze-scan
```

### 3. How It Works

1. User uploads image via scan page
2. Image is stored in Supabase Storage
3. Server action calls Supabase Edge Function with:
   - `scan_id`
   - `image_path`
   - `user_id`
4. Edge Function calls Cloudflare Worker with full image URL
5. Cloudflare Worker:
   - Downloads image
   - Runs AI analysis (vision + RAG)
   - Returns structured results
6. Edge Function returns results to server action
7. Server action updates database and redirects to results

### 4. Fallback Behavior

If Cloudflare Worker is not configured or fails:
- Edge Function automatically falls back to mock data
- App continues to work normally
- No user-facing errors

This ensures graceful degradation!

### 5. Test the Integration

After deploying, test with a real scan through the app:

1. Go to `/scan`
2. Click Gallery
3. Select an image
4. Wait for processing
5. View results

Check Supabase logs to see if worker was called successfully.

## Monitoring

- **Supabase Logs**: Check Edge Function logs in dashboard
- **Cloudflare Logs**: Run `cd workers/skin-analyzer && npx wrangler tail`
- **Next.js Logs**: Check terminal for server action logs

## Troubleshooting

**Edge Function falls back to mock data?**
1. Check Supabase secrets are set correctly
2. Verify Cloudflare Worker URL is accessible
3. Check worker secret matches

**Worker returns error?**
1. Check Cloudflare Worker logs: `npx wrangler tail`
2. Verify image URLs are publicly accessible
3. Check AI quota hasn't been exceeded

**No results at all?**
1. Check Supabase Edge Function logs
2. Verify server action is calling edge function
3. Check network requests in browser DevTools
