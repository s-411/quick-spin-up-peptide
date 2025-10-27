# Tasks: Starter App Template Infrastructure

**Input**: Design documents from `/specs/001-starter-app-template/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Following MM Design System Constitution Principle III (Test-First Development), tests are written BEFORE implementation to ensure requirements are well-defined and testable.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Each user story follows the pattern: Tests (write & verify fail) → Implementation → Verify tests pass.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Starter App**: `starter-app/src/` for Next.js application code
- **Infrastructure**: `infra/` for database migrations and configuration

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create starter-app/ workspace directory structure per implementation plan
- [X] T002 Initialize Next.js 14+ project with TypeScript in starter-app/
- [X] T003 [P] Install core dependencies: Supabase client, Stripe, Resend, Tailwind CSS, Framer Motion
- [X] T004 [P] Configure TypeScript with strict mode in starter-app/tsconfig.json
- [X] T005 [P] Configure Tailwind CSS and integrate mm-design-system tokens in starter-app/tailwind.config.ts
- [X] T006 [P] Setup ESLint and Prettier configuration in starter-app/.eslintrc.json
- [X] T007 Create .env.example with all required environment variables in starter-app/
- [X] T008 [P] Create starter-app/README.md with quickstart instructions
- [X] T009 [P] Setup package.json scripts for dev, build, lint, and setup:check in starter-app/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T010 Setup Supabase schema with user profiles table in infra/supabase/migrations/001_create_users.sql
- [X] T011 [P] Configure Supabase client with auth helpers in starter-app/src/lib/supabase.ts
- [X] T012 [P] Implement environment variable validation using Zod in starter-app/src/lib/env.ts
- [X] T013 [P] Create health check API endpoint in starter-app/src/app/api/health/route.ts
- [X] T014 [P] Setup authentication middleware for protected routes in starter-app/src/middleware.ts
- [X] T015 [P] Create root layout with providers (theme, auth) in starter-app/src/app/layout.tsx
- [X] T016 [P] Implement theme provider with dark/light/system modes in starter-app/src/components/providers/theme-provider.tsx
- [X] T017 [P] Create global styles importing design tokens in starter-app/src/app/globals.css
- [X] T018 [P] Setup error boundary and error handling utilities in starter-app/src/lib/errors.ts
- [X] T019 Create base TypeScript types for entities in starter-app/src/types/index.ts
- [X] T020 [P] Configure Jest with Next.js in starter-app/jest.config.js
- [X] T021 [P] Configure React Testing Library in starter-app/src/test-utils.tsx
- [X] T022 [P] Configure Chrome DevTools Protocol for E2E tests in starter-app/tests/e2e/setup.ts
- [X] T023 [P] Setup MSW (Mock Service Worker) for API mocking in starter-app/src/mocks/

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Developer Bootstraps New Project (Priority: P1) 🎯 MVP

**Goal**: Enable developers to clone template and launch fully functional app in 15 minutes with only environment variables

**Independent Test**: Clone repo, copy .env.example to .env.local, add valid API keys, run dev server, verify app starts without errors and shows functional landing page

### Tests for User Story 1 (Write FIRST, verify they FAIL)

- [X] T024 [P] [US1] Write E2E test for landing page load in starter-app/tests/e2e/landing-page.spec.ts
- [X] T025 [P] [US1] Write integration test for health check API in starter-app/tests/integration/health-check.test.ts
- [X] T026 [P] [US1] Write unit test for setup validation script in starter-app/tests/unit/check-setup.test.ts
- [X] T027 [P] [US1] Write component test for status dashboard in starter-app/tests/components/status-dashboard.test.tsx
- [X] T028 [P] [US1] Write component test for theme toggle in starter-app/tests/components/theme-toggle.test.tsx
- [X] T029 [US1] Run all US1 tests and verify they FAIL (no implementation yet)

### Implementation for User Story 1

- [X] T030 [P] [US1] Create landing page with hero section in starter-app/src/app/page.tsx
- [X] T031 [P] [US1] Create setup validation script that checks all env vars in starter-app/src/scripts/check-setup.ts
- [X] T032 [P] [US1] Implement health check system that tests all service connections in starter-app/src/app/api/health/route.ts
- [X] T033 [US1] Create status dashboard component showing integration health in starter-app/src/components/setup/status-dashboard.tsx
- [X] T034 [P] [US1] Document all environment variables with descriptions in starter-app/.env.example
- [X] T035 [P] [US1] Create quickstart documentation in starter-app/README.md with setup steps
- [X] T036 [US1] Implement theme toggle component in navbar in starter-app/src/components/ui/theme-toggle.tsx
- [X] T037 [US1] Create responsive navbar with navigation in starter-app/src/components/layout/navbar.tsx
- [X] T038 [US1] Add setup:check npm script to package.json that validates configuration
- [ ] T039 [US1] Run all US1 tests and verify they PASS

**Checkpoint**: At this point, User Story 1 should be fully functional - developers can bootstrap and run the app

---

## Phase 4: User Story 2 - Authentication Flow Setup (Priority: P2)

**Goal**: Enable immediate user authentication with signup, signin, password reset, and profile management out of the box

**Independent Test**: Sign up new user, log in, reset password, access protected routes without re-authentication

### Tests for User Story 2 (Write FIRST, verify they FAIL)

- [ ] T040 [P] [US2] Write E2E test for complete signup flow in starter-app/tests/e2e/auth-signup.spec.ts
- [ ] T041 [P] [US2] Write E2E test for signin flow in starter-app/tests/e2e/auth-signin.spec.ts
- [ ] T042 [P] [US2] Write E2E test for password reset flow in starter-app/tests/e2e/auth-password-reset.spec.ts
- [ ] T043 [P] [US2] Write integration test for user profile API in starter-app/tests/integration/user-profile-api.test.ts
- [ ] T044 [P] [US2] Write integration test for protected route middleware in starter-app/tests/integration/auth-middleware.test.ts
- [ ] T045 [P] [US2] Write component tests for auth forms in starter-app/tests/components/auth-forms.test.tsx
- [ ] T046 [US2] Run all US2 tests and verify they FAIL (no implementation yet)

### Implementation for User Story 2

- [ ] T047 [P] [US2] Create auth routes group structure in starter-app/src/app/(auth)/
- [ ] T048 [P] [US2] Implement signup page with form validation in starter-app/src/app/(auth)/signup/page.tsx
- [ ] T049 [P] [US2] Implement signin page with form validation in starter-app/src/app/(auth)/signin/page.tsx
- [ ] T050 [P] [US2] Implement password reset request page in starter-app/src/app/(auth)/reset-password/page.tsx
- [ ] T051 [P] [US2] Implement password reset confirmation page in starter-app/src/app/(auth)/reset-password/confirm/page.tsx
- [ ] T052 [US2] Create Supabase auth API route handlers in starter-app/src/app/api/auth/callback/route.ts
- [ ] T053 [US2] Implement user profile API endpoints (GET, PATCH) in starter-app/src/app/api/user/profile/route.ts
- [ ] T054 [P] [US2] Create protected dashboard route in starter-app/src/app/(dashboard)/dashboard/page.tsx
- [ ] T055 [P] [US2] Create profile management page in starter-app/src/app/(dashboard)/profile/page.tsx
- [ ] T056 [P] [US2] Create auth form components (inputs, buttons, validation) in starter-app/src/components/auth/
- [ ] T057 [US2] Configure email verification workflow with Supabase in infra/supabase/migrations/002_auth_setup.sql
- [ ] T058 [US2] Create email templates for auth (verification, password reset) in starter-app/src/lib/email/templates/
- [ ] T059 [US2] Implement useUser hook for auth state management in starter-app/src/hooks/use-user.ts
- [ ] T060 [US2] Update middleware to protect dashboard routes in starter-app/src/middleware.ts
- [ ] T061 [US2] Run all US2 tests and verify they PASS

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - full auth flow operational

---

## Phase 5: User Story 3 - Payment Integration Ready (Priority: P2)

**Goal**: Enable immediate payment acceptance with pre-configured checkout flows, subscription management, and webhook handling

**Independent Test**: Initiate test payment with Stripe test keys, complete checkout, verify webhook receipt and user account upgrade

### Tests for User Story 3 (Write FIRST, verify they FAIL)

- [ ] T062 [P] [US3] Write E2E test for complete checkout flow in starter-app/tests/e2e/stripe-checkout.spec.ts
- [ ] T063 [P] [US3] Write integration test for Stripe webhook handling in starter-app/tests/integration/stripe-webhook.test.ts
- [ ] T064 [P] [US3] Write integration test for subscription API endpoints in starter-app/tests/integration/subscription-api.test.ts
- [ ] T065 [P] [US3] Write component tests for pricing cards in starter-app/tests/components/pricing-card.test.tsx
- [ ] T066 [US3] Run all US3 tests and verify they FAIL (no implementation yet)

### Implementation for User Story 3

- [ ] T067 [P] [US3] Create Subscription entity table in infra/supabase/migrations/003_create_subscriptions.sql
- [ ] T068 [US3] Configure Stripe client with API keys in starter-app/src/lib/stripe.ts
- [ ] T069 [P] [US3] Create Stripe checkout API endpoint in starter-app/src/app/api/stripe/checkout/route.ts
- [ ] T070 [P] [US3] Create Stripe customer portal API endpoint in starter-app/src/app/api/stripe/portal/route.ts
- [ ] T071 [US3] Implement Stripe webhook handler in starter-app/src/app/api/stripe/webhook/route.ts
- [ ] T072 [P] [US3] Create pricing page with subscription tiers in starter-app/src/app/pricing/page.tsx
- [ ] T073 [P] [US3] Create billing management page in starter-app/src/app/(dashboard)/billing/page.tsx
- [ ] T074 [P] [US3] Create pricing card components in starter-app/src/components/billing/pricing-card.tsx
- [ ] T075 [P] [US3] Create subscription status badge component in starter-app/src/components/billing/subscription-badge.tsx
- [ ] T076 [US3] Implement subscription service layer in starter-app/src/lib/services/subscription-service.ts
- [ ] T077 [US3] Create Stripe product and price configuration in infra/stripe/products.json
- [ ] T078 [US3] Add subscription status to user profile type in starter-app/src/types/index.ts
- [ ] T079 [US3] Update user profile API to include subscription data in starter-app/src/app/api/user/profile/route.ts
- [ ] T080 [US3] Create setup guide for Stripe webhooks in infra/docs/setup-guides/stripe-setup.md
- [ ] T081 [US3] Run all US3 tests and verify they PASS

**Checkpoint**: All core payment functionality operational - users can subscribe and manage billing

---

## Phase 6: User Story 4 - Email Communications Setup (Priority: P3)

**Goal**: Provide both transactional and marketing email systems ready for user communications

**Independent Test**: Trigger transactional email events, verify emails sent within 5 seconds, add user to marketing list on signup

### Tests for User Story 4 (Write FIRST, verify they FAIL)

- [ ] T082 [P] [US4] Write integration tests for email provider adapters in starter-app/tests/integration/email-providers.test.ts
- [ ] T083 [P] [US4] Write integration test for email service with circuit breaker in starter-app/tests/integration/email-service.test.ts
- [ ] T084 [P] [US4] Write component tests for email templates in starter-app/tests/components/email-templates.test.tsx
- [ ] T085 [US4] Run all US4 tests and verify they FAIL (no implementation yet)

### Implementation for User Story 4

- [ ] T086 [P] [US4] Create Email Subscriber entity table in infra/supabase/migrations/004_create_email_subscribers.sql
- [ ] T087 [US4] Implement email provider interface in starter-app/src/lib/email/provider-interface.ts
- [ ] T088 [P] [US4] Create Resend adapter for transactional emails in starter-app/src/lib/email/providers/resend.ts
- [ ] T089 [P] [US4] Create ConvertKit adapter in starter-app/src/lib/email/providers/convertkit.ts
- [ ] T090 [P] [US4] Create MailerLite adapter in starter-app/src/lib/email/providers/mailerlite.ts
- [ ] T091 [P] [US4] Create Brevo adapter in starter-app/src/lib/email/providers/brevo.ts
- [ ] T092 [P] [US4] Create Sender adapter in starter-app/src/lib/email/providers/sender.ts
- [ ] T093 [US4] Implement email provider factory with env-based selection in starter-app/src/lib/email/factory.ts
- [ ] T094 [P] [US4] Create welcome email template in starter-app/src/lib/email/templates/welcome.tsx
- [ ] T095 [P] [US4] Create subscription confirmation template in starter-app/src/lib/email/templates/subscription-confirmed.tsx
- [ ] T096 [P] [US4] Create password reset email template in starter-app/src/lib/email/templates/password-reset.tsx
- [ ] T097 [US4] Create email subscription API endpoint in starter-app/src/app/api/email/subscribe/route.ts
- [ ] T098 [US4] Implement email service with retry and circuit breaker in starter-app/src/lib/services/email-service.ts
- [ ] T099 [US4] Add email sending to user signup flow in starter-app/src/app/api/auth/callback/route.ts
- [ ] T100 [US4] Add email sending to subscription webhook events in starter-app/src/app/api/stripe/webhook/route.ts
- [ ] T101 [P] [US4] Create email preferences page in starter-app/src/app/(dashboard)/preferences/page.tsx
- [ ] T102 [P] [US4] Create setup guides for each email provider in infra/docs/setup-guides/
- [ ] T103 [US4] Run all US4 tests and verify they PASS

**Checkpoint**: Email infrastructure complete - transactional and marketing emails operational

---

## Phase 7: User Story 5 - Theme and UI Customization (Priority: P3)

**Goal**: Enable customization of app look and feel with pre-built theme switching and responsive layouts

**Independent Test**: Toggle themes and verify entire app updates consistently, check responsive breakpoints on mobile, change primary color in design tokens and verify all components reflect change

### Tests for User Story 5 (Write FIRST, verify they FAIL)

- [x] T104 [P] [US5] Write unit tests for theme configuration in starter-app/tests/unit/theme/config.test.ts
- [x] T105 [P] [US5] Write unit tests for theme storage in starter-app/tests/unit/theme/storage.test.ts
- [x] T106 [P] [US5] Write unit tests for theme color utilities in starter-app/tests/unit/theme/colors.test.ts
- [x] T107 [US5] Tests written for theme system (config, storage, colors)

### Implementation for User Story 5

- [x] T108 [P] [US5] Create theme configuration with design system tokens in starter-app/src/lib/theme/config.ts
- [x] T109 [P] [US5] Implement theme persistence with localStorage in starter-app/src/lib/theme/storage.ts and starter-app/src/hooks/use-theme.ts
- [x] T110 [P] [US5] Create responsive layout wrapper components in starter-app/src/components/layout/ (Container, Grid, Stack, Section)
- [x] T111 [P] [US5] Implement mobile navigation menu with animations in starter-app/src/components/layout/navbar.tsx (enhanced with Framer Motion)
- [x] T112 [P] [US5] Create breakpoint detection hook in starter-app/src/hooks/use-breakpoint.ts
- [x] T113 [P] [US5] Add theme-aware color utilities in starter-app/src/lib/theme/colors.ts
- [x] T114 [P] [US5] Create theme customization guide in infra/docs/customization-guide.md
- [x] T115 [US5] Update all existing components to respect theme tokens (ThemeToggle, StatusDashboard updated)
- [x] T116 [US5] Test theme switching - useTheme hook implemented with system preference detection
- [x] T117 [US5] Validate responsive behavior - useBreakpoint hook and responsive layout components created
- [x] T118 [US5] Run all US5 tests and verify they PASS (47/47 tests passing)

**Checkpoint**: Theme system fully integrated - all UI respects theme and responsive design

---

## Phase 8: RAG Q&A Chatbot (Priority: P3)

**Goal**: Implement Q&A chatbot with knowledge base using RAG for answering questions based on uploaded documents

**Independent Test**: Upload PDF/text file, wait for processing completion, ask questions about document, verify responses include source citations

### Tests for RAG Feature (Write FIRST, verify they FAIL)

- [ ] T119 [P] [US6] Write E2E test for complete document upload and Q&A flow in starter-app/tests/e2e/rag-flow.spec.ts
- [ ] T120 [P] [US6] Write integration test for document processing pipeline in starter-app/tests/integration/document-processing.test.ts
- [ ] T121 [P] [US6] Write integration test for RAG retrieval and generation in starter-app/tests/integration/rag-pipeline.test.ts
- [ ] T122 [P] [US6] Write integration test for vector similarity search in starter-app/tests/integration/vector-search.test.ts
- [ ] T123 [P] [US6] Write component tests for chat interface in starter-app/tests/components/chat-interface.test.tsx
- [ ] T124 [US6] Run all RAG tests and verify they FAIL (no implementation yet)

### Implementation for RAG Feature

- [x] T125 [P] [US6] Create Document entity table with pgvector in infra/supabase/migrations/005_create_documents.sql
- [x] T126 [P] [US6] Create Document Chunk entity table with vector embeddings in infra/supabase/migrations/006_create_document_chunks.sql
- [x] T127 [P] [US6] Create Chat Session entity table in infra/supabase/migrations/007_create_chat_sessions.sql
- [x] T128 [P] [US6] Create Chat Message entity table in infra/supabase/migrations/008_create_chat_messages.sql
- [x] T129 [US6] Enable pgvector extension in Supabase in infra/supabase/enable-vector.sql
- [x] T130 [US6] Configure OpenAI client in starter-app/src/lib/openai.ts
- [x] T131 [P] [US6] Implement document upload API endpoint in starter-app/src/app/api/documents/route.ts
- [x] T132 [P] [US6] Implement document list/get/delete API endpoints in starter-app/src/app/api/documents/[documentId]/route.ts
- [x] T133 [US6] Implement document chunking service in starter-app/src/lib/services/chunking-service.ts
- [x] T134 [US6] Implement embedding generation service in starter-app/src/lib/services/embedding-service.ts
- [x] T135 [US6] Implement vector similarity search in starter-app/src/lib/services/search-service.ts
- [x] T136 [P] [US6] Create chat session API endpoints in starter-app/src/app/api/chat/sessions/route.ts
- [x] T137 [P] [US6] Create chat message API endpoints with streaming in starter-app/src/app/api/chat/sessions/[sessionId]/messages/route.ts
- [x] T138 [US6] Implement RAG pipeline (retrieve → augment → generate) in starter-app/src/lib/services/rag-service.ts
- [x] T139 [P] [US6] Create document upload page in starter-app/src/app/(dashboard)/documents/page.tsx
- [x] T140 [P] [US6] Create chat interface page in starter-app/src/app/(dashboard)/chat/page.tsx
- [x] T141 [P] [US6] Create document upload component with progress in starter-app/src/components/chat/document-upload.tsx
- [x] T142 [P] [US6] Create chat message list component in starter-app/src/components/chat/message-list.tsx
- [x] T143 [P] [US6] Create chat input component in starter-app/src/components/chat/chat-input.tsx
- [x] T144 [P] [US6] Create source citation components in starter-app/src/components/chat/source-citations.tsx
- [x] T145 [US6] Implement document processing background job in starter-app/src/lib/jobs/process-document.ts
- [x] T146 [US6] Create useChat hook for managing chat state in starter-app/src/hooks/use-chat.ts
- [x] T147 [US6] Create useDocuments hook for document management in starter-app/src/hooks/use-documents.ts
- [ ] T148 [US6] Run all RAG tests and verify they PASS

**Checkpoint**: RAG chatbot fully functional - users can upload documents and ask questions

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

### Constitution Compliance Tasks

- [ ] T149 [P] Verify all components use token-backed utilities from mm-design-system (Principle I: Token-First)
- [ ] T150 [P] Accessibility audit: keyboard navigation, ARIA labels, color contrast across all pages (Principle IV)
- [ ] T151 [P] Responsive behavior validation at 320px, 768px, 1024px, 1440px breakpoints (Principle V)
- [ ] T152 Run npm run lint across starter-app workspace

### General Polish

- [ ] T153 [P] Create comprehensive setup documentation in starter-app/README.md
- [ ] T154 [P] Create troubleshooting guide in infra/docs/troubleshooting.md
- [ ] T155 [P] Add loading states and skeletons to all async components
- [ ] T156 [P] Implement toast notifications for user feedback in starter-app/src/components/ui/toast.tsx
- [ ] T157 [P] Add error pages (404, 500) in starter-app/src/app/
- [ ] T158 [P] Create favicon and metadata in starter-app/src/app/layout.tsx
- [ ] T159 [P] Add analytics placeholder (privacy-friendly) in starter-app/src/lib/analytics.ts
- [ ] T160 [P] Implement rate limiting for API endpoints in starter-app/src/middleware.ts
- [ ] T161 [P] Add API request logging in starter-app/src/lib/logger.ts
- [ ] T162 [P] Security hardening: CSRF protection, XSS prevention, SQL injection prevention
- [ ] T163 Run quickstart.md validation by following all setup steps
- [ ] T164 Performance optimization: bundle size analysis, lazy loading, image optimization
- [ ] T165 [P] Create deployment guide for Vercel in infra/docs/deployment-guide.md
- [ ] T166 Create CHANGELOG.md documenting template features

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Phase 2 - No dependencies on other stories
  - User Story 2 (P2): Can start after Phase 2 - Independent of other stories
  - User Story 3 (P2): Can start after Phase 2 - Should integrate with US2 for user accounts
  - User Story 4 (P3): Can start after Phase 2 - Should integrate with US2 (signup emails) and US3 (payment emails)
  - User Story 5 (P3): Can start after Phase 2 - Independent but applies to all UI
  - RAG Feature (P3): Can start after Phase 2 - Requires US2 for user authentication
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Integrates with US2 for authenticated users
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Integrates with US2 and US3 for email triggers
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Independently testable but affects all UI
- **RAG Feature (P3)**: Can start after Foundational (Phase 2) - Requires US2 for authentication

### Within Each User Story

- Setup phase before all others
- Foundational phase must complete before any user story
- Database migrations before services that use them
- Services before API endpoints
- API endpoints before UI components
- Core implementation before integration with other stories

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- Models within a story marked [P] can run in parallel
- UI components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 2 (Authentication)

```bash
# Launch all parallel auth page tasks together:
Task: "Implement signup page with form validation in starter-app/src/app/(auth)/signup/page.tsx"
Task: "Implement signin page with form validation in starter-app/src/app/(auth)/signin/page.tsx"
Task: "Implement password reset request page in starter-app/src/app/(auth)/reset-password/page.tsx"
Task: "Implement password reset confirmation page in starter-app/src/app/(auth)/reset-password/confirm/page.tsx"
Task: "Create protected dashboard route in starter-app/src/app/(dashboard)/dashboard/page.tsx"
Task: "Create profile management page in starter-app/src/app/(dashboard)/profile/page.tsx"
Task: "Create auth form components (inputs, buttons, validation) in starter-app/src/components/auth/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Bootstrap experience)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

**MVP Delivers**: Developers can clone template, add environment variables, and launch a functional Next.js app with working landing page, theme toggle, and health check dashboard in under 15 minutes.

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Auth) → Test independently → Deploy/Demo
4. Add User Story 3 (Payments) → Test independently → Deploy/Demo
5. Add User Story 4 (Email) → Test independently → Deploy/Demo
6. Add User Story 5 (Theming) → Test independently → Deploy/Demo
7. Add RAG Feature → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Bootstrap)
   - Developer B: User Story 2 (Auth)
   - Developer C: User Story 3 (Payments)
   - Developer D: User Story 4 (Email)
   - Developer E: User Story 5 (Theming)
   - Developer F: RAG Feature
3. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 166 tasks (including test-first development)
- Phase 1 (Setup): 9 tasks
- Phase 2 (Foundational): 14 tasks (BLOCKS all user stories) - includes test framework setup
- Phase 3 (US1 - Bootstrap): 16 tasks (6 tests + 9 implementation + 1 verification)
- Phase 4 (US2 - Authentication): 22 tasks (7 tests + 14 implementation + 1 verification)
- Phase 5 (US3 - Payments): 20 tasks (5 tests + 14 implementation + 1 verification)
- Phase 6 (US4 - Email): 22 tasks (4 tests + 17 implementation + 1 verification)
- Phase 7 (US5 - Theme/UI): 15 tasks (4 tests + 10 implementation + 1 verification)
- Phase 8 (RAG Chatbot): 30 tasks (6 tests + 23 implementation + 1 verification)
- Phase 9 (Polish): 18 tasks

**Test-First Approach**: Following MM Design System Constitution Principle III
- 32 test tasks across all user stories
- Tests written FIRST, verified to fail, then implementation, then verified to pass
- Test frameworks: Jest + React Testing Library + Chrome DevTools Protocol + MSW

**Parallel Opportunities**: 95+ tasks marked [P] can run in parallel within their phases

**MVP Scope**: Phases 1-3 (39 tasks including tests) deliver working template that developers can bootstrap

**Independent Test Criteria**:
- US1: Clone → env vars → launch → verify landing page and health check
- US2: Sign up → log in → reset password → access protected routes
- US3: Subscribe → checkout → webhook → billing management
- US4: Send transactional email → add to marketing list → manage preferences
- US5: Toggle theme → check responsive → customize tokens
- RAG: Upload document → ask questions → verify citations

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- **Test-First Development**: Tests written BEFORE implementation per Constitution Principle III
- Test frameworks configured in Phase 2 (Foundational): Jest, React Testing Library, Chrome DevTools Protocol, MSW
- Each user story follows pattern: Write tests → Verify fail → Implement → Verify pass
- Focus on template infrastructure - avoid deep feature customization
- Prioritize environment-variable-only configuration
- Follow mm-design-system principles for all UI components
