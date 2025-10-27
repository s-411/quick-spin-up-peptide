# MM Design System Constitution

<!--
Sync Impact Report - 2025-10-23
═══════════════════════════════════════════════════════════════════════════════
VERSION CHANGE: Initial → 1.0.0 (MAJOR)
RATIONALE: First formal constitution establishing foundational governance.

MODIFIED PRINCIPLES: N/A (initial creation)
ADDED SECTIONS:
  - All Core Principles (I-V)
  - Technical Standards section
  - Development Workflow section
  - Governance section

REMOVED SECTIONS: N/A

TEMPLATE CONSISTENCY STATUS:
  ✅ plan-template.md - Constitution Check section aligns with principles
  ✅ spec-template.md - User story structure supports token-first principle
  ✅ tasks-template.md - Phase structure supports test-first and modular approach
  ⚠️  No command templates found in .specify/templates/commands/
  ✅ AI_IMPLEMENTATION_GUIDE.md - Runtime guidance aligned with immutable rules

FOLLOW-UP TODOs: None
═══════════════════════════════════════════════════════════════════════════════
-->

## Core Principles

### I. Token-First (NON-NEGOTIABLE)

All visual properties MUST derive from the centralized token system. Hard-coded colors, spacing, typography, or shadows are prohibited.

**Rules:**
- Reference tokens via `hsl(var(--token))`, `var(--color-mm-*)`, or Tailwind utilities backed by tokens
- Run `npm run tokens:build` after any token changes
- Run `npm run tokens:check` before opening PRs
- Lint rules enforce this principle; violations MUST be fixed, not disabled

**Rationale:** Centralized tokens ensure design consistency, enable theme switching (dark mode), and allow system-wide changes from a single source of truth. Hard-coded values create fragmentation and maintenance debt.

### II. Modular Architecture

The system is organized as a workspace monorepo with clear separation of concerns and reusable packages.

**Rules:**
- `design-system/` package: Token source, build scripts, publishable artifacts (`mm-design-system`)
- `demo-app/`: Full showcase of every design system section
- `starter-app/`: Minimal production shell wired to the design system (recommended starting point)
- Each package maintains independent lint rules and build commands
- Import shared globals exactly once (`import "mm-design-system/styles/globals.css"` in root layout)

**Rationale:** Modular structure enables independent development, testing, and deployment. The publishable design-system package can be consumed by multiple applications. Clear boundaries prevent circular dependencies.

### III. Test-First Development

Tests are written before implementation to ensure requirements are well-defined and testable.

**Rules:**
- Tests written → User approved → Tests fail → Then implement
- Contract tests for API boundaries and library interfaces
- Integration tests for inter-component communication and user journeys
- Tests must be independently runnable and isolated
- CI/CD gates enforce passing tests before merge

**Rationale:** TDD ensures features are properly specified, reduces defects, enables safe refactoring, and serves as living documentation. Writing tests first forces clarity of requirements.

### IV. Accessibility & Semantic HTML

All components MUST be accessible and use semantic HTML structure.

**Rules:**
- ARIA labels, roles, and properties where appropriate
- Keyboard navigation support for all interactive elements
- Sufficient color contrast ratios (WCAG AA minimum)
- Semantic HTML elements (`<button>`, `<nav>`, `<header>`, etc.) over generic divs
- Focus indicators visible and clear
- Screen reader testing for complex interactions

**Rationale:** Accessibility is not optional. Inclusive design serves more users, meets legal requirements, and improves overall usability. Semantic HTML provides structure for assistive technologies.

### V. Responsive & Mobile-First

All interfaces MUST work across device sizes with a mobile-first design approach.

**Rules:**
- Start with mobile layout, progressively enhance for larger screens
- Use breakpoints defined in `design-tokens.json`
- Test on actual devices or browser dev tools
- Touch targets minimum 44x44px
- Responsive typography using fluid scales
- No horizontal scroll on mobile viewports

**Rationale:** Mobile traffic often exceeds desktop. Mobile-first constraints force prioritization of essential content. Progressive enhancement ensures baseline functionality for all users.

## Technical Standards

### Build & Deployment Workflow

**Monorepo Management:**
- Root `package.json` orchestrates workspace commands
- Use `--workspace` flag to target specific packages
- Install dependencies from repository root: `npm install --legacy-peer-deps`

**Quality Gates:**
- `npm run tokens:check` validates token integrity
- `npm run lint:demo` and `npm run lint:starter` enforce code standards
- All checks MUST pass before PR approval
- No suppression of lint rules without documented justification

**Token Generation:**
- Source of truth: `design-system/config/design-tokens.json`
- Build command: `npm run tokens:build` generates CSS variables and Tailwind config
- Generated artifacts are committed to enable immediate consumption
- Token additions require documentation in `SYSTEM_OVERVIEW.md`

### Code Style Standards

**TypeScript/JavaScript:**
- Strict TypeScript configuration
- No `any` types without explicit justification
- Functional components and hooks for React
- Named exports preferred over default exports

**CSS/Tailwind:**
- Tailwind utilities backed by tokens
- Custom CSS only when Tailwind insufficient (document reasoning)
- Extend Tailwind via `mm-design-system/config/generated-tailwind-theme`
- No inline styles or `style` prop (use className with Tailwind)

**File Organization:**
- Co-locate related files (component, styles, tests)
- Index files for clean imports
- Clear naming conventions: kebab-case for files, PascalCase for components

## Development Workflow

### Feature Development Process

1. **Specification Phase**: Define user stories with acceptance criteria in `spec.md`
2. **Planning Phase**: Create implementation plan with technical context in `plan.md`
3. **Constitution Check**: Verify feature complies with all principles
4. **Task Generation**: Break down into dependency-ordered tasks in `tasks.md`
5. **Implementation**: Follow test-first approach, organized by user story priority
6. **Validation**: Run lint, tests, and visual QA before PR

### Component Development Checklist

- Identify relevant demo section or existing component for reference
- Scaffold layout with token-backed Tailwind utilities
- Implement interactive states (hover, focus, disabled, active) using semantic tokens
- Verify accessibility (keyboard nav, ARIA, color contrast)
- Test responsive behavior across breakpoints
- Reference canvas screenshots for spacing/visual alignment
- Verify dark mode rendering
- Document any new token requirements

### Pull Request Requirements

- All tests passing
- Lint checks passing
- No hard-coded visual values
- Token additions documented
- Accessibility tested
- Responsive behavior verified
- Clear commit messages following conventional commit format

## Governance

### Amendment Process

Constitution amendments require:
1. Documented proposal with rationale
2. Impact analysis on existing features and workflows
3. Template consistency updates (plan, spec, tasks templates)
4. Team review and approval
5. Migration plan for affected code
6. Version increment per semantic versioning

### Versioning Policy

Constitution version follows semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Backward incompatible governance changes, principle removals/redefinitions
- **MINOR**: New principles added or materially expanded guidance
- **PATCH**: Clarifications, wording refinements, typo fixes

### Compliance Review

- All PRs MUST verify compliance with constitution principles
- Constitution Check section in `plan.md` gates Phase 0 research
- Re-check after Phase 1 design
- Complexity violations require explicit justification
- Simpler alternatives must be documented as rejected

### Runtime Guidance

For AI agents and automated tooling, refer to `docs/AI_IMPLEMENTATION_GUIDE.md` for:
- Immutable rules and environment setup
- Token workflow and cheat sheet
- Component development patterns
- QA and handoff expectations

**Version**: 1.0.0 | **Ratified**: 2025-10-23 | **Last Amended**: 2025-10-23
