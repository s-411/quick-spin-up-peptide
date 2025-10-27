# Deployment Guide - Vercel

This guide walks you through deploying the Starter App Template to Vercel with all required services configured.

## Prerequisites

Before deploying, ensure you have:

- [ ] Vercel account ([sign up free](https://vercel.com/signup))
- [ ] Supabase project ([create one](https://supabase.com/dashboard))
- [ ] Stripe account ([create one](https://dashboard.stripe.com/register))
- [ ] Resend account ([create one](https://resend.com/signup))
- [ ] OpenAI API key ([get one](https://platform.openai.com/api-keys))
- [ ] GitHub/GitLab/Bitbucket repository with this code

## Step 1: Configure Supabase

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and set:
   - **Project name**: starter-app-prod (or your preference)
   - **Database password**: Generate a strong password (save it securely)
   - **Region**: Choose closest to your users
4. Click "Create new project" (takes ~2 minutes)

### 1.2 Enable pgvector Extension

```sql
-- Run in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
```

Or upload [infra/supabase/enable-vector.sql](infra/supabase/enable-vector.sql) via SQL Editor.

### 1.3 Run Database Migrations

Execute migrations in order via Supabase SQL Editor:

1. `001_enable_auth.sql` - Auth setup
2. `002_create_profiles.sql` - User profiles
3. `003_create_subscriptions.sql` - Stripe subscriptions
4. `004_create_email_templates.sql` - Email templates
5. `005_create_documents.sql` - Document storage
6. `006_create_document_chunks.sql` - Vector chunks
7. `007_create_chat_sessions.sql` - Chat sessions
8. `008_create_chat_messages.sql` - Chat messages

Or run all at once:

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

### 1.4 Configure Authentication

1. Navigate to **Authentication > Providers**
2. Enable **Email** provider
3. Configure email templates in **Authentication > Email Templates**:
   - Customize confirmation, reset password, and magic link emails
   - Use your domain (e.g., `https://yourdomain.com`)

4. Optional: Enable OAuth providers (Google, GitHub, etc.)

### 1.5 Get Supabase Credentials

Navigate to **Project Settings > API**:

- `NEXT_PUBLIC_SUPABASE_URL`: Your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon/public key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (keep secret!)

## Step 2: Configure Stripe

### 2.1 Create Products and Prices

1. Go to [Stripe Dashboard > Products](https://dashboard.stripe.com/products)
2. Click "+ Add product"
3. Create your subscription tiers:

**Example: Pro Plan**
- **Name**: Pro Plan
- **Description**: Full access to all features
- **Pricing**: Recurring, $29/month
- **Price ID**: Copy the `price_xxxxx` ID

**Example: Enterprise Plan**
- **Name**: Enterprise Plan
- **Pricing**: Recurring, $99/month
- **Price ID**: Copy the `price_xxxxx` ID

### 2.2 Configure Webhook

1. Go to [Stripe Dashboard > Developers > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "+ Add endpoint"
3. Set **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** (`whsec_xxxxx`)

### 2.3 Get Stripe Credentials

From [Stripe Dashboard > Developers > API Keys](https://dashboard.stripe.com/apikeys):

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Publishable key (pk_test_xxx or pk_live_xxx)
- `STRIPE_SECRET_KEY`: Secret key (sk_test_xxx or sk_live_xxx)
- `STRIPE_WEBHOOK_SECRET`: Webhook signing secret (from step 2.2)

## Step 3: Configure Resend

### 3.1 Add and Verify Domain

1. Go to [Resend Dashboard > Domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the provided DNS records to your domain:
   - SPF record
   - DKIM records
5. Verify domain (may take a few minutes)

### 3.2 Get API Key

1. Go to [Resend Dashboard > API Keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it (e.g., "Production")
4. Copy the key (starts with `re_`)

### 3.3 Configure From Email

Set `RESEND_FROM_EMAIL` to an email from your verified domain:
- Format: `noreply@yourdomain.com` or `Your App <noreply@yourdomain.com>`

## Step 4: Get OpenAI API Key

1. Go to [OpenAI Platform > API Keys](https://platform.openai.com/api-keys)
2. Click "+ Create new secret key"
3. Name it (e.g., "Production - Starter App")
4. Copy the key (starts with `sk-`)
5. Set usage limits in [Settings > Limits](https://platform.openai.com/account/limits) to prevent unexpected charges

## Step 5: Deploy to Vercel

### 5.1 Import Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your Git repository
4. Select the repository containing this code

### 5.2 Configure Project Settings

- **Framework Preset**: Next.js
- **Root Directory**: `starter-app` (if not already at root)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 5.3 Add Environment Variables

Click "Environment Variables" and add the following:

#### Public Variables (visible to client)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

#### Secret Variables (server-side only)
```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=Your App <noreply@yourdomain.com>
OPENAI_API_KEY=sk-xxxxx
```

#### Optional Variables
```bash
# Analytics (if using Vercel Analytics)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=xxxxx

# Rate limiting (adjust as needed)
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

**Important**:
- Use production keys for production deployment
- Keep test keys for preview deployments (configure per environment)
- Never commit secrets to version control

### 5.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-5 minutes)
3. Vercel will automatically:
   - Install dependencies
   - Build the Next.js app
   - Deploy to global edge network
   - Generate a deployment URL

## Step 6: Configure Custom Domain

### 6.1 Add Domain to Vercel

1. Go to your project > "Settings" > "Domains"
2. Click "Add"
3. Enter your domain (e.g., `yourdomain.com`)
4. Choose whether to redirect `www` to apex or vice versa

### 6.2 Update DNS Records

Add these DNS records at your domain registrar:

**For apex domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Verification may take a few minutes to propagate.**

### 6.3 Update Environment Variables

Update these variables with your production domain:

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

Redeploy for changes to take effect.

### 6.4 Update External Services

Update callback URLs in:
- **Supabase**: Authentication > URL Configuration > Site URL
- **Stripe**: Webhook endpoint URL (if not already set)
- **OAuth providers**: Redirect URIs (if using social login)

## Step 7: Post-Deployment Verification

### 7.1 Test Authentication

1. Visit `https://yourdomain.com/auth/sign-up`
2. Create a test account
3. Check email for confirmation
4. Verify email confirmation works
5. Test sign-in/sign-out

### 7.2 Test Stripe Integration

1. Visit `https://yourdomain.com/billing`
2. Subscribe to a plan (use [Stripe test cards](https://stripe.com/docs/testing#cards))
3. Verify webhook received in Stripe Dashboard > Webhooks
4. Check subscription status updates in app

### 7.3 Test Email Sending

1. Trigger password reset
2. Check email delivery
3. Verify email formatting
4. Test from address and domain

### 7.4 Test RAG Chatbot

1. Visit `https://yourdomain.com/documents`
2. Upload a test document
3. Wait for processing (check status)
4. Visit `https://yourdomain.com/chat`
5. Ask questions about uploaded document
6. Verify responses include source citations

### 7.5 Monitor Logs

Check for errors in:
- **Vercel Dashboard** > Your Project > Deployments > [Latest] > Logs
- **Supabase Dashboard** > Logs
- **Stripe Dashboard** > Developers > Logs
- **OpenAI** > Usage (monitor token consumption)

## Step 8: Enable Monitoring (Optional)

### 8.1 Vercel Analytics

```bash
# Already installed if following setup
npm install @vercel/analytics
```

Enable in [Vercel Dashboard > Analytics](https://vercel.com/docs/analytics).

### 8.2 Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay
- [Datadog](https://www.datadoghq.com) for APM

### 8.3 Uptime Monitoring

Use services like:
- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://www.pingdom.com)
- [Better Uptime](https://betteruptime.com)

## Step 9: Security Hardening

### 9.1 Environment Security

- [ ] Rotate all API keys from development
- [ ] Enable Stripe webhook signature verification
- [ ] Set up Supabase RLS policies (already configured in migrations)
- [ ] Review CORS settings

### 9.2 Rate Limiting

Rate limiting is configured in API routes. Adjust limits in:
```typescript
// src/app/api/*/route.ts
const limit = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
})
```

### 9.3 Content Security Policy

Add to `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]
```

## Troubleshooting

### Build Fails

**Error**: `Module not found`
- **Solution**: Ensure all dependencies in `package.json`, run `npm install`

**Error**: `Type errors`
- **Solution**: Run `npm run type-check` locally first

### Environment Variables Not Working

**Error**: Variables undefined in runtime
- **Solution**: Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- **Solution**: Redeploy after adding new variables

### Stripe Webhooks Not Receiving Events

**Error**: 404 on webhook endpoint
- **Solution**: Verify URL is `https://yourdomain.com/api/webhooks/stripe` (exact path)
- **Solution**: Check Vercel function logs for errors

**Error**: Signature verification failed
- **Solution**: Ensure `STRIPE_WEBHOOK_SECRET` matches the webhook signing secret in Stripe Dashboard

### Supabase Connection Issues

**Error**: `Failed to fetch`
- **Solution**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Solution**: Check Supabase project status (not paused)

### OpenAI API Errors

**Error**: `429 Rate limit exceeded`
- **Solution**: Check usage limits in OpenAI Dashboard
- **Solution**: Implement request queuing or caching

**Error**: `401 Unauthorized`
- **Solution**: Verify `OPENAI_API_KEY` is correct and active

### Email Delivery Issues

**Error**: Emails not sending
- **Solution**: Verify Resend domain is verified
- **Solution**: Check DNS records are properly configured
- **Solution**: Review Resend logs for delivery failures

## Scaling Considerations

### Database

- Monitor Supabase usage in Dashboard > Database > Usage
- Upgrade plan if approaching connection limits
- Consider read replicas for high-traffic apps

### Serverless Functions

- Vercel free tier: 100GB-Hrs/month
- Monitor in Dashboard > Usage
- Optimize function execution time
- Consider Edge Functions for faster response times

### OpenAI Costs

- Monitor token usage in OpenAI Dashboard
- Implement caching for common queries
- Set user quotas to prevent abuse
- Consider fine-tuned models for cost reduction

### Vector Search Performance

- HNSW indexes are already configured
- Monitor query performance in Supabase
- Adjust `m` and `ef_construction` parameters if needed
- Consider upgrading Supabase plan for larger datasets

## Production Checklist

Before going live:

- [ ] All environment variables configured with production keys
- [ ] Custom domain configured and DNS propagated
- [ ] SSL certificate active (automatic with Vercel)
- [ ] Supabase migrations applied
- [ ] Stripe products and prices created
- [ ] Stripe webhook configured and tested
- [ ] Resend domain verified and emails tested
- [ ] OpenAI API key configured with usage limits
- [ ] Authentication flow tested end-to-end
- [ ] Payment flow tested with test cards
- [ ] Email delivery tested
- [ ] RAG chatbot tested with sample documents
- [ ] Error tracking configured
- [ ] Monitoring and alerts set up
- [ ] Security headers configured
- [ ] Rate limiting tested
- [ ] Privacy policy and terms of service pages added
- [ ] Favicon and metadata customized
- [ ] Analytics configured

## Support and Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Supabase Documentation**: https://supabase.com/docs
- **Stripe Documentation**: https://stripe.com/docs
- **Resend Documentation**: https://resend.com/docs
- **OpenAI Documentation**: https://platform.openai.com/docs

---

**Deployment complete!** Your Starter App is now live at `https://yourdomain.com`.
