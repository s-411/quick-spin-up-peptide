# MM Design System Overview

Status: Draft  
Last updated: 2024-11-20

## 1. Purpose & Principles
- Deliver a token-first styling system that propagates changes from a single source of truth.
- Keep Next.js/Vercel projects thin—consume the published design system package without forking styles.
- Maintain visual fidelity with the demo app sections and reusable component primitives.

## 2. Repository Map
- `design-system/` – token source (`config/design-tokens.json`), generated CSS/TS artifacts, Tailwind config, utilities (published locally as the `mm-design-system` package).
- `demo-app/` – Next.js showcase wired to the design system for visual regression and copy-pasteable sections.
- `starter-app/` – production starter shell that imports the design system package, Tailwind theme extension, and guardrail lint rules.
- `canvas-images/` – visual references for demo sections (manifest to follow).
- `docs/` – living system documentation (this overview + AI implementation guide).
- `archive/` – historical plans and legacy documentation kept for context only.
- `package.json` (root) – npm workspaces orchestrator and shared scripts.

## 3. Token Architecture
- Canonical registry: `design-system/config/design-tokens.json` (`$schema` at `config/design-tokens.schema.json`).
- Build pipeline: `npm run tokens:build` regenerates `styles/color-tokens.css`, `styles/globals.css`, `config/generated-tailwind-theme.ts`, and `lib/tokens.ts`.
- Guardrail command: `npm run tokens:check` (CI friendly) fails if generated artifacts drift from the JSON source.
- Detailed spec: `docs/TOKEN_SOURCE_OF_TRUTH_SPEC.md`.
- Continuous integration: `.github/workflows/ci.yml` runs the token check and `demo-app` lint on every push/PR.

## 4. Workspace Commands
- `npm install --legacy-peer-deps` – bootstrap all packages (`design-system`, `demo-app`, `starter-app`) and generate `package-lock.json`.
- `npm run tokens:build` – regenerate token artifacts (wraps the design-system script).
- `npm run tokens:check` – verify generated artifacts match the JSON source (fails CI on drift).
- `npm run lint:demo` / `npm run lint:starter` – run `next lint` with guardrails for the demo and starter shells.
- `npm run dev:starter` – launch the starter app with the design system globals applied.

## 5. Generated Artifacts & Consumption
- CSS variables exposed via `design-system/styles/color-tokens.css` and `design-system/styles/globals.css`.
- Tailwind extension: `design-system/config/generated-tailwind-theme.ts` imported by `tailwind.config.ts`.
- TypeScript exports: `design-system/lib/tokens.ts` for runtime lookups and tooling integrations.
- Package scripts ensure Next.js apps pull the latest tokens before `next build`.

## 6. Theming & Modes
- Light/dark mode driven by semantic tokens; `.dark` or `[data-theme="dark"]` toggles.
- `design-system/lib/theme-provider.tsx` provides `next-themes` integration (document usage here).
- Focus on consistency: `--color-*` aliases stay in sync with `--primary`/`--background` etc. for raw CSS usage.

## 7. Demo App & Visual References
- Demo sections live under `demo-app/app/(routes)` and `demo-app/components`.
- Screenshots stored in `canvas-images/` (manifest WIP) so AI agents can map instructions to visuals.
- Use the demo as the contract for component behavior and spacing.

## 8. Update Workflow (High Level)
1. Edit `design-system/config/design-tokens.json`.
2. Run `npm run tokens:build` in `design-system/`.
3. Review downstream effects (Tailwind theme, globals, tokens export).
4. Execute lint/tests (document commands here).
5. Commit JSON + generated files.

## 9. Appendices (To Fill)
- Component inventory snapshot (migrate from `archive/docs/COMPONENT_AUDIT.md`).
- Color rationale summary (condense from `archive/docs/COLOR_SYSTEM_ARCHITECTURE.md`).
- Tokens change log template.
