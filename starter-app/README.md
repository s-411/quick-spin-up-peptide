# Starter App Template

A production-ready Next.js 14+ starter template with pre-configured authentication, payments, email, and AI-powered Q&A chatbot. Get from clone to running app in under 15 minutes.

## Features

- **Authentication**: Complete auth flow with Supabase (signup, signin, password reset, email verification)
- **Payments**: Stripe integration with subscriptions, webhooks, and customer portal
- **Email**: Transactional emails (Resend) + Marketing email providers (ConvertKit, MailerLite, Brevo, Sender)
- **RAG Q&A Chatbot**: Document upload and AI-powered question answering with source citations
- **Theme System**: Dark/light/system modes with persistent preferences
- **Design System**: Token-first styling with mm-design-system integration
- **Type Safety**: Strict TypeScript configuration with comprehensive type definitions
- **Testing**: Jest + React Testing Library + Chrome DevTools Protocol for E2E

## Quick Start

### Prerequisites

- Node.js 18+ installed
- Active accounts for services (see setup below)

### 1. Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd starter-app

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### 2. Required Service Accounts

#### Supabase (Database & Auth)
1. Go to [app.supabase.com](https://app.supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy `URL` and `anon` key to `.env.local`

#### Stripe (Payments)
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Get test API keys from Developers → API keys
3. Copy publishable and secret keys to `.env.local`

#### OpenAI (AI/RAG)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Copy to `.env.local`

#### Email Provider (Choose One)
- **Resend**: [resend.com/api-keys](https://resend.com/api-keys) (recommended for transactional)
- **ConvertKit**: [kit.com](https://kit.com) → Account Settings → API Key
- **MailerLite**: [mailerlite.com](https://www.mailerlite.com) → Integrations → API
- **Brevo**: [brevo.com](https://www.brevo.com) → SMTP & API → API Keys

### 3. Configure Environment

Edit `.env.local` with your API keys (see `.env.example` for all variables).

### 4. Setup Database

```bash
# Initialize Supabase
npx supabase init
npx supabase start

# Run migrations
npx supabase db push

# Enable pgvector for RAG
npx supabase sql --file ../infra/supabase/enable-vector.sql
```

### 5. Validate Setup

```bash
# Verify environment variables
npm run setup:check

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 6. Stripe Webhook Setup (Development)

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login and forward webhooks
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy webhook secret to .env.local
```

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format with Prettier
npm run setup:check  # Validate environment setup
npm test             # Run tests
```

### Project Structure

```
starter-app/
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── (auth)/        # Auth routes (signup, signin, etc.)
│   │   ├── (dashboard)/   # Protected routes
│   │   └── api/           # API routes and webhooks
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── billing/      # Stripe/payment components
│   │   ├── chat/         # RAG chatbot components
│   │   ├── email/        # Email template components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Core utilities
│   │   ├── email/        # Email provider adapters
│   │   ├── services/     # Business logic services
│   │   └── rag/          # RAG/AI utilities
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript definitions
├── tests/                # Test suites
│   ├── e2e/             # End-to-end tests
│   ├── integration/     # Integration tests
│   ├── unit/            # Unit tests
│   └── components/      # Component tests
└── .env.example         # Environment variables template
```

## Testing Core Features

### Authentication
1. Visit `/signup` and create account
2. Check email for verification link
3. Sign in and access dashboard

### Payments
1. Go to `/pricing`
2. Click subscribe → Stripe checkout
3. Use test card: `4242 4242 4242 4242`
4. Verify subscription in dashboard

### RAG Chatbot
1. Go to `/chat` or `/documents`
2. Upload PDF or text file
3. Wait for processing
4. Ask questions about the document

### Email
- Signup triggers welcome email
- Subscription triggers confirmation email
- Check email provider dashboard

## Customization

### Theme & Styling
- Colors: Edit `design-system/config/design-tokens.json`
- Components: Extend from `mm-design-system` package
- Layouts: Modify `src/app/layout.tsx`

### Email Templates
- Transactional: Edit `src/lib/email/templates/`
- Marketing: Configure in email provider dashboard

### Feature Flags
Toggle features in `.env.local`:
```bash
NEXT_PUBLIC_ENABLE_RAG=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_EMAIL_MARKETING=true
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Switch to production API keys for all services
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use production/live mode keys for all services
- Configure proper webhook endpoints
- Set up domain and SSL

## Troubleshooting

### Common Issues

**"Environment validation failed"**
- Run `npm run setup:check` for detailed validation
- Verify all required environment variables are set
- Check API key formats

**"Supabase connection failed"**
- Verify project URL and anon key
- Ensure Supabase project is active
- Check pgvector extension is enabled

**"Stripe webhook errors"**
- Run `stripe listen` command
- Copy webhook secret to `.env.local`
- Verify webhook endpoint URL

**"RAG/Chat not working"**
- Verify OpenAI API key
- Check Supabase has pgvector extension
- Ensure document processing completes

**"Email sending fails"**
- Verify email provider API key
- Check `EMAIL_PROVIDER` environment variable
- Test with provider's dashboard tools

### Health Check

Visit `/api/health` to verify all service connections.

## Documentation

- [Setup Guides](../infra/docs/setup-guides/) - Detailed integration guides
- [Troubleshooting](../infra/docs/troubleshooting.md) - Common issues and solutions
- [Deployment Guide](../infra/docs/deployment-guide.md) - Production deployment
- [Customization Guide](../infra/docs/customization-guide.md) - Theming and branding

## Tech Stack

- **Framework**: Next.js 14+ with TypeScript
- **Database**: Supabase (PostgreSQL + Auth + Storage + pgvector)
- **Payments**: Stripe
- **Email**: Resend + Multi-provider marketing adapter
- **AI**: OpenAI + Vercel AI SDK
- **Styling**: Tailwind CSS + mm-design-system tokens
- **Testing**: Jest + React Testing Library + Chrome DevTools Protocol
- **Deployment**: Vercel

## License

See repository root for license information.

## Support

For issues and questions, refer to the troubleshooting guide or check the health endpoint at `/api/health`.
