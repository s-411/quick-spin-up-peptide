# Stripe Setup Guide

Complete guide to setting up Stripe payments for the starter app.

## Prerequisites

- Stripe account ([stripe.com](https://stripe.com))
- Access to Stripe Dashboard

## Step 1: Get API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_`)
4. Copy your **Secret key** (starts with `sk_test_`)
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

## Step 2: Create Products and Prices

1. Go to **Products** in Stripe Dashboard
2. Create three products:

### Basic Plan
- Name: Basic
- Description: Perfect for individuals and small projects
- Price: $9.99/month (or your pricing)
- Copy the Price ID (starts with `price_`)

### Pro Plan
- Name: Pro
- Description: For professionals and growing teams
- Price: $29.99/month
- Copy the Price ID

### Enterprise Plan
- Name: Enterprise
- Description: For large organizations
- Price: $99.99/month
- Copy the Price ID

3. Add price IDs to `.env.local`:
   ```
   STRIPE_PRICE_ID_BASIC=price_...
   STRIPE_PRICE_ID_PRO=price_...
   STRIPE_PRICE_ID_ENTERPRISE=price_...
   ```

## Step 3: Setup Webhooks

### Development (Local)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe

   # Windows
   # Download from stripe.com/docs/stripe-cli
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the webhook signing secret (starts with `whsec_`)
5. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Production

1. Go to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. Enter your production URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret
6. Add to production environment variables

## Step 4: Configure Customer Portal

1. Go to **Settings** → **Billing** → **Customer portal**
2. Enable customer portal
3. Configure:
   - **Business information**: Add your business name and support email
   - **Products**: Select which products customers can upgrade/downgrade to
   - **Features**: Enable invoice history, update payment method, cancel subscription

## Step 5: Test the Integration

### Test Cards

Use these test card numbers in test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Any future expiration date and any 3-digit CVC.

### Test Flow

1. Start your dev server: `npm run dev`
2. In another terminal, run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Go to `http://localhost:3000/pricing`
4. Click "Get Started" on any plan
5. Use test card: `4242 4242 4242 4242`
6. Complete checkout
7. Verify:
   - Redirected to billing page
   - Subscription appears in database
   - Webhook events logged in terminal

## Step 6: Production Checklist

Before going live:

- [ ] Switch to live mode API keys (remove `_test_` from keys)
- [ ] Update webhook endpoint to production URL
- [ ] Verify webhook secret is production secret
- [ ] Test with real card in live mode
- [ ] Configure customer portal for production
- [ ] Set up email receipts in Stripe
- [ ] Enable Stripe Tax if needed
- [ ] Configure billing thresholds
- [ ] Set up failed payment recovery emails

## Troubleshooting

### Webhook Not Receiving Events

- Verify `stripe listen` is running (development)
- Check webhook secret matches in `.env.local`
- Verify endpoint URL is correct (production)
- Check webhook logs in Stripe Dashboard

### Payment Failing

- Verify API keys are correct
- Check price IDs exist in Stripe
- Ensure customer has valid payment method
- Check Stripe logs for detailed errors

### Subscription Not Updating

- Verify webhook handler is processing events
- Check database for subscription records
- Review server logs for errors
- Test webhook manually in Stripe Dashboard

## Support

For issues with Stripe integration:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)
- Check `/api/health` endpoint for service status
