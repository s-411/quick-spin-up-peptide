# Implementation Plan: Starter App Template Infrastructure

**Branch**: `001-starter-app-template` | **Date**: 2025-10-22 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-starter-app-template/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Creating a Next.js starter app template with pre-wired integrations (Supabase auth/db, Stripe payments, Resend emails, multiple marketing email providers, dark/light themes, RAG Q&A chatbot) that developers can clone and launch in 15 minutes using only environment variables. Goal is to reduce typical SaaS setup time by 60-70% through template-ready infrastructure.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript/JavaScript with Next.js 14+
**Primary Dependencies**: Next.js, Supabase, Stripe, Resend, Tailwind CSS, Framer Motion
**Storage**: Supabase (PostgreSQL + Auth + Storage)
**Testing**: NEEDS CLARIFICATION - testing framework for template validation
**Target Platform**: Web application (responsive desktop/tablet/mobile), deployable to Vercel
**Project Type**: Web application with full-stack capabilities
**Performance Goals**: <3 second page loads, <15 minute setup time from clone to running app
**Constraints**: Environment-variable-only configuration, no hardcoded credentials, template-ready structure
**Scale/Scope**: Template for multiple SaaS projects, supporting 10k+ concurrent users per deployed instance

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Token-First Development**: ✅ PASS - Starter app will use existing `mm-design-system` tokens
**Guardrail Enforcement**: ✅ PASS - Will inherit existing lint rules and token validation
**Workspace Orchestration**: ⚠️  POTENTIAL CONCERN - Creating new workspace `starter-app/` alongside existing workspaces
**Visual Fidelity**: ✅ PASS - Will use existing demo components and design patterns
**Library-First Architecture**: ✅ PASS - Will consume `mm-design-system` components, not modify them

**Analysis**: The starter app template aligns with constitution principles. The new `starter-app/` workspace is justified as it serves a different purpose (template for external use) than `demo-app/` (internal reference). All styling and components will properly consume the `mm-design-system` package.

**Post-Design Re-evaluation**: ✅ CONFIRMED
- Template properly consumes design tokens via `mm-design-system` package
- No hardcoded styling values in planned components
- Workspace structure maintains clear boundaries
- Library-first approach preserved through proper package consumption

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
starter-app/                          # New workspace for template
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (auth)/                # Auth-related routes
│   │   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── api/                   # API routes (webhooks, integrations)
│   │   ├── globals.css           # Global styles with token imports
│   │   └── layout.tsx            # Root layout with providers
│   ├── components/               # App-specific components
│   │   ├── auth/                 # Authentication components
│   │   ├── billing/              # Stripe billing components
│   │   ├── chat/                 # RAG Q&A chat components
│   │   └── email/                # Email template components
│   ├── lib/                      # Core utilities and configurations
│   │   ├── supabase.ts          # Supabase client setup
│   │   ├── stripe.ts            # Stripe client setup
│   │   ├── email/               # Email provider adapters
│   │   └── rag/                 # RAG/AI integration utilities
│   ├── middleware.ts            # Auth middleware
│   └── types/                   # TypeScript type definitions
├── .env.example                 # Template environment variables
├── package.json                 # Dependencies and scripts
└── README.md                    # Setup instructions

infra/                           # Infrastructure setup
├── supabase/
│   ├── migrations/             # Database schema
│   └── seed.sql               # Sample data
├── stripe/
│   └── products.json          # Product/price configuration
└── docs/
    └── setup-guides/          # Integration setup guides
```

**Structure Decision**: Web application structure selected. The `starter-app/` workspace follows Next.js App Router conventions with clear separation of concerns: authentication, billing, chat (RAG), and email functionality. Infrastructure configuration files are organized separately under `infra/` to support the template's environment-variable-based setup approach.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
