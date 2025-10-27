# MM Design System – AI Implementation Guide

Status: Draft  
Companion doc: `docs/SYSTEM_OVERVIEW.md`

## 1. Immutable Rules
- Never hard-code colors, typography, spacing, or shadows—always reference tokens (`hsl(var(--token))`, `var(--color-mm-*)`, or Tailwind utilities backed by tokens).
- Run `npm run tokens:build` whenever tokens change; finish with `npm run tokens:check` before opening a PR.
- Import shared globals exactly once (`import "mm-design-system/styles/globals.css"` inside your root layout).
- Extend Tailwind via `mm-design-system/config/generated-tailwind-theme`—do not edit the color map manually.
- `npm run lint:demo` / `npm run lint:starter` enforce the no-hardcoded-color rule; fix violations instead of disabling the lint.
- The Next.js rule `@next/next/no-img-element` is disabled intentionally—the demo renders remote avatar/image placeholders that don’t warrant optimization yet.

## 2. Environment Setup
- Install everything from the repository root (workspaces automatically cascade):
  ```bash
  npm install --legacy-peer-deps
  ```
- Regenerate token artifacts after dependency updates:
  ```bash
  npm run tokens:build
  ```
- Verify guardrails locally:
  ```bash
  npm run tokens:check
  npm run lint:starter
  npm run lint:demo
  ```

## 3. Starter App Workflow
- Development entry point:
  ```bash
  npm run dev:starter
  ```
- The starter shell already:
  - Imports global styles and ThemeProvider from `mm-design-system`.
  - Spreads `mmTailwindTheme` into `tailwind.config.ts`.
  - Ships with lint rules prohibiting inline color literals.
- Use the starter when kicking off a new product surface; copy production-ready sections from `demo-app` as needed.

## 4. Building New Pages/Features
1. Identify relevant demo section or component in `demo-app/` (use manifest once available).
2. Scaffold layout with Tailwind classes; prefer token-backed utilities (e.g., `bg-background`, `text-foreground`, `rounded-mm`).
3. Compose components by importing from the design system package or reusing `demo-app/components`.
4. Reference canvas screenshots for spacing/visual alignment; never guess values.
5. Verify dark mode in the Next.js preview (`prefers-color-scheme` toggle or theme switcher).

## 5. Component Checklist
- Based on `archive/docs/COMPONENT_CHECKLIST.md` (to be migrated verbatim with updates).
- Ensure hover, focus, disabled, and active states use semantic tokens.
- Include responsive adjustments—check breakpoints defined in `design-tokens.json`.

## 6. Tokens Cheatsheet
- Brand colors: `var(--color-mm-primary)`, `var(--color-mm-secondary)`, etc.
- Semantic HSL channels: `hsl(var(--primary))`, `hsl(var(--background))`.
- Typography vars: `var(--font-family-heading)`, `var(--font-family-body)`.
- Motion: `var(--transition-fast|medium|slow)`.

## 7. Demo Section Reuse Workflow
1. Locate the section in `demo-app` and corresponding screenshot in `canvas-images/`.
2. Copy component tree and styles; swap content only.
3. If new token needed, update `design-tokens.json`, regenerate, and document the usage.

## 8. Starter Prompt (copy/paste for new agents)
```
You are working inside the MM Design System monorepo.
- Never hard-code colors or spacing; use Tailwind utilities or `hsl(var(--token))`.
- Import shared globals only from `mm-design-system/styles/globals.css`.
- Run `npm run tokens:check` after modifying `design-system/config/design-tokens.json`.
- Run `npm run lint:starter` (or `lint:demo`) before finishing work; do not suppress the no-restricted-syntax rule.
- If you need a new token, add it to `design-system/config/design-tokens.json`, regenerate with `npm run tokens:build`, and document it in the overview.
```

## 9. QA & Handoff Expectations
- Run lint/tests (`npm run lint`, upcoming visual regression suite).
- Capture screenshots or Storybook stories for new components.
- Document any token additions in the change log section of `SYSTEM_OVERVIEW.md`.
