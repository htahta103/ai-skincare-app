# ROAST - Environment Setup Guide

## Prerequisites

- Node.js 18+ (for Lovable development)
- Flutter 3.16+ (for mobile wrapper)
- Supabase CLI (optional, for local development)

## Quick Start

### 1. Supabase Project Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Navigate to **SQL Editor** and run the migrations in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_storage_buckets.sql`
   - `supabase/migrations/004_seed_data.sql`

### 2. Configure Authentication

In your Supabase Dashboard:

1. Go to **Authentication > Providers**
2. Enable:
   - ✅ Email (with confirm email disabled for testing)
   - ✅ Google OAuth
   - ✅ Apple OAuth

#### Google OAuth Setup
```
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI:
   https://<your-project>.supabase.co/auth/v1/callback
4. Copy Client ID and Secret to Supabase
```

#### Apple OAuth Setup
```
1. Go to Apple Developer Portal
2. Create a Services ID
3. Configure Sign in with Apple
4. Add authorized redirect URI:
   https://<your-project>.supabase.co/auth/v1/callback
5. Copy credentials to Supabase
```

### 3. Environment Variables

Create `.env` file for the web app:

```env
# Supabase
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>

# AI Services (configured in Edge Functions)
# These are stored in Supabase Vault, not in .env

# Stripe (Web subscriptions)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Storage Configuration

The following buckets are created automatically:

| Bucket | Access | Max Size | File Types |
|--------|--------|----------|------------|
| `avatars` | Public | 5MB | JPEG, PNG, WebP |
| `scans` | Private | 10MB | JPEG, PNG, WebP |
| `progress` | Private | 10MB | JPEG, PNG, WebP |
| `ingredients` | Private | 10MB | JPEG, PNG, WebP |
| `reports` | Private | 20MB | PDF |

### 5. Edge Functions Setup

Deploy edge functions for AI features:

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref <your-project-ref>

# Set secrets for AI services
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set FACEPP_API_KEY=...
supabase secrets set FACEPP_API_SECRET=...

# Deploy functions
supabase functions deploy analyze-face
supabase functions deploy scan-ingredients
supabase functions deploy roast-chat
supabase functions deploy generate-routine
supabase functions deploy generate-report
```

## Database Schema Overview

```
profiles ─────────────────┐
    │                     │
    ├── skin_profiles     │
    ├── skin_scans ───────┼── scan_results
    │       │             │       └── scan_metrics
    ├── routines ─────────┼── routine_steps ─── products
    ├── progress_photos   │
    ├── challenges ───────┼── challenge_progress
    ├── subscriptions     │
    ├── chat_sessions ────┼── chat_messages
    ├── ingredient_scans ─┼── ingredient_results
    └── scan_usage        │
```

## Testing the Setup

1. **Test Authentication:**
   - Create a test user via email signup
   - Verify profile is auto-created in `profiles` table
   - Verify subscription defaults to `free`

2. **Test Storage:**
   - Upload a test image to `avatars/{user_id}/avatar.jpg`
   - Verify RLS allows access

3. **Test RLS Policies:**
   - Create test data as one user
   - Try to access as another user (should fail)

## Troubleshooting

### "Permission denied" errors
- Ensure RLS policies are applied (check `002_rls_policies.sql`)
- Verify user is authenticated with valid JWT

### Storage upload fails
- Check bucket exists
- Verify file path includes user_id: `{bucket}/{user_id}/filename.ext`
- Check file size and type limits

### Profile not created on signup
- Ensure trigger exists: `on_auth_user_created`
- Check function: `handle_new_user`
