# Quickstart Guide: Starter App Template

**Goal**: Get from repository clone to running application in under 15 minutes.

## Prerequisites

- Node.js 18+ installed
- Git installed
- Active accounts for required services (see setup below)

## 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd <repository-name>

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

## 2. Required Service Accounts

### Supabase (Database & Auth)
1. Go to [app.supabase.com](https://app.supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy `URL` and `anon` key to `.env.local`
5. Copy `service_role` key (keep secret!)

### Stripe (Payments)
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Get your test API keys from Developers → API keys
3. Copy publishable and secret keys to `.env.local`
4. Set up webhook endpoint (see Stripe setup guide)

### OpenAI (RAG/AI)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Copy to `.env.local`

### Email Provider (Choose One)
- **Resend**: [resend.com/api-keys](https://resend.com/api-keys)
- **ConvertKit**: [kit.com](https://kit.com) → Account → Account Settings → API Key
- **MailerLite**: [mailerlite.com](https://www.mailerlite.com) → Account → Integrations → API
- **Brevo**: [brevo.com](https://www.brevo.com) → SMTP & API → API Keys

## 3. Environment Configuration

Edit `.env.local` with your API keys:

```bash
# Required: Application
NODE_ENV=development
NEXTAUTH_SECRET=your-32-character-secret-here

# Required: Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Required: Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # (after webhook setup)

# Required: OpenAI
OPENAI_API_KEY=sk-...

# Required: Email (choose one)
EMAIL_PROVIDER=resend # or convertkit, mailerlite, brevo
RESEND_API_KEY=re_... # if using Resend
# CONVERTKIT_API_KEY=... # if using ConvertKit
# MAILERLITE_API_KEY=... # if using MailerLite
# BREVO_API_KEY=... # if using Brevo
```

## 4. Database Setup

```bash
# Run Supabase migrations
npx supabase init
npx supabase start
npx supabase db push

# Enable pgvector extension (for RAG)
npx supabase sql --file ./infra/supabase/enable-vector.sql
```

## 5. Validate Setup

```bash
# Verify environment variables
npm run setup:check

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) - you should see:
- ✅ Landing page loads
- ✅ Theme toggle works
- ✅ Sign up/login functional
- ✅ Protected routes accessible after auth

## 6. Test Core Features

### Authentication Flow
1. Click "Sign Up" → Enter email/password
2. Check email for confirmation link
3. Sign in → Access dashboard

### Payment Flow
1. Go to `/pricing` or billing section
2. Click subscribe → Redirects to Stripe checkout
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout → Returns to success page

### RAG Q&A Chatbot
1. Go to chat/documents section
2. Upload a PDF or text file
3. Wait for processing to complete
4. Ask questions about the document
5. Verify responses include source citations

### Email Integration
1. Sign up triggers welcome email
2. Check email provider dashboard for new subscriber
3. Test unsubscribe flow

## 7. Stripe Webhook Setup

For payments to work in development:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe # macOS
# or download from stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy webhook signing secret from terminal output to .env.local
```

## 8. Production Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables via Vercel dashboard
# Set production API keys (live mode for Stripe, production for others)
```

### Environment Variables for Production
- Switch all services to production/live mode
- Use production URLs and keys
- Set `NODE_ENV=production`
- Configure proper webhook endpoints

## 9. Customization Quick Start

### Theme & Styling
- Colors: Edit `design-system/config/design-tokens.json`
- Components: Extend from `mm-design-system` package
- Layouts: Modify `src/app/layout.tsx`

### Add New Features
- New pages: Add to `src/app/` directory
- API routes: Add to `src/app/api/` directory
- Components: Create in `src/components/`
- Utilities: Add to `src/lib/`

### Email Templates
- Transactional: Edit `src/lib/email/templates/`
- Marketing: Configure in your email provider dashboard

## 10. Troubleshooting

### Common Issues

**"Environment validation failed"**
- Check all required environment variables are set
- Verify API key formats (see error messages for hints)
- Run `npm run setup:check` for detailed validation

**"Supabase connection failed"**
- Verify project URL and anon key
- Check if Supabase project is active
- Ensure pgvector extension is enabled

**"Stripe webhook errors"**
- Install and run `stripe listen` command
- Copy webhook secret to environment variables
- Verify webhook endpoint URL

**"RAG/Chat not working"**
- Check OpenAI API key is valid
- Verify Supabase has pgvector extension
- Ensure document upload completes processing

**"Email sending fails"**
- Verify email provider API key
- Check `EMAIL_PROVIDER` environment variable
- Test with email provider dashboard/tools

### Getting Help

1. Check the health endpoint: `http://localhost:3000/api/health`
2. Review browser console and terminal for error messages
3. Verify all services are configured in their respective dashboards
4. Run `npm run setup:check` for comprehensive validation

## Next Steps

Once running successfully:
1. Customize branding and copy
2. Configure email templates and flows
3. Set up monitoring and analytics
4. Plan your feature development
5. Review security settings for production

The template provides a solid foundation - now build your unique application features on top!