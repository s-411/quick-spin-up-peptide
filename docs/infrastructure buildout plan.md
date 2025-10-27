# Infrastructure Buildout Plan

Status: Draft (2024-11-20)  
Scope: Extend `starter-app/` so every new project launches with 

(Use the bestsaaskit template for inso and layout)

- Supabase
- Auth = Supabase
- Stripe
- Resend
- Email Sender API Integration
      https://kit.com/
      https://www.mailerlite.com/
      https://www.brevo.com/
      https://www.sender.net/
- Dark/Light theme support
- RAG over database
- User settings page
- Smooth animations with Framer Motion https://motion.dev/
- env variable placeholders
- Responsive on all devices
- Mobile Menu Struture
- PWA capabilities


## 1. Objectives
- Bootstrap the starter app with working Supabase auth/storage and Stripe billing before any feature work begins.
- Provide reproducible local/production environments (env files, CLI scripts, docs).
- Encode the workflow into a reusable prompt + checklist so future agents start from the same baseline.

## 2. Phase Breakdown

### Phase A – Environment Scaffolding
- Create `.env.example` with placeholders:
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`
  - `STRIPE_TEST_SECRET_KEY`, `STRIPE_LIVE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL` (if needed), `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Add `.env.local` to `.gitignore`; include instructions in README (`cp .env.example .env.local`).
- Document secret management for Vercel: `vercel env pull`, `vercel env push`.
- Add `npm run check:env` script that fails if required variables are missing (can be a small Node/TS script).

### Phase B – Supabase Integration
- Install `@supabase/supabase-js` in `starter-app`.
- Create `src/lib/supabase-client.ts` with `createBrowserClient`/`createServerClient`.
- Add `src/app/providers/supabase-provider.tsx` for session context; wrap layout inside provider.
- Configure `middleware.ts` to handle Supabase auth cookies (optional but helps gated routes).
- Create minimal auth UI (sign in/sign out) using design-system buttons.
- Document local dev flow:
  - `supabase init` (project), `supabase start` (local Postgres).
  - Provide SQL seed / migration under `/infra/supabase/`.
- Update docs with auth testing checklist.

### Phase C – Stripe Integration
- Install `stripe` (server) + `@stripe/stripe-js` (client).
- Add `src/lib/stripe.ts` for server SDK initialization (reads secret key from env).
- Create API route or server action for checkout session creation.
- Add `app/api/stripe/webhook/route.ts` handling events (verify signature, log payload).
- Provide CLI instructions in `/infra/stripe/README.md`:
  - `stripe login`, `stripe listen --forward-to localhost:3000/api/stripe/webhook`.
- Add simple billing UI (e.g., "Start subscription" button) tied to checkout route.
- Extend `.env.example` with webhook signing secret placeholder.

### Phase D – Automation & Validation
- Extend root CI (`.github/workflows/ci.yml`) to:
  - Run `npm run lint:starter`.
  - Run `npm run check:env` (with CI-friendly stub env file).
- Optional: add Playwright smoke test verifying auth + sample checkout (uses Stripe test keys).
- Document manual QA checklist in `docs/AI_IMPLEMENTATION_GUIDE.md`.

## 3. Prompt & Onboarding Assets
- Create `docs/STARTER_PROMPT.md` (future task) including:
  - Repository summary and guardrails.
  - Infra preflight tasks (Supabase setup, Stripe integration, env command cheatsheet).
  - Required commands before submitting work (`npm run tokens:check`, `npm run lint:starter`, etc.).
- Store PRDs under `docs/prd/*.md` so the kickoff prompt can reference both the template rules and product scope.

## 4. Task Queue
1. Scaffold env files/scripts (`.env.example`, check script).
2. Integrate Supabase client + auth provider; document local CLI usage.
3. Wire Stripe server/client helpers and webhook handler; add README instructions.
4. Update docs (`starter-app/README.md`, `docs/AI_IMPLEMENTATION_GUIDE.md`, `docs/SYSTEM_OVERVIEW.md`).
5. Expand CI to cover starter lint + env checks.
6. Draft `docs/STARTER_PROMPT.md` with the kickoff instructions.

## 5. Open Questions
- Do we bundle Supabase CLI via Docker or instruct manual install?
- Where should shared infra scripts live (`/infra`, `/scripts`, or package.json tasks only)?
- Do we include a Docker Compose stack (Next.js + Supabase + stripe-mock) for unified local dev?
- How do we handle secrets for shared teams (1Password, Doppler, Vercel secrets)?

## 6. Definition of Done
- `starter-app` can authenticate against Supabase locally and in staging.
- Stripe test checkout & webhook verification succeed using test keys.
- `.env.example` mirrors deployed environments; `npm run check:env` enforces presence.
- CI stays green (tokens + lint + env checks).
- Documentation/prompt updated so future agents can start from scratch without human intervention.

