# Token Source of Truth Specification

Author: Codex  
Status: Draft  
Applies to: `design-system`, all downstream Next.js/Vercel apps

## 1. Objectives
- Establish a single canonical definition for every design token (color, typography, spacing, motion).
- Generate all runtime artifacts (CSS variables, Tailwind theme, TypeScript exports) from that source automatically.
- Guarantee that any token update propagates across the design system, demo app, and future projects with one command.
- Provide guardrails so no Next.js app can bypass the tokens (linting, CI validation).

## 2. Canonical Files & Structure
```
design-system/
  config/
    design-tokens.json        # canonical token registry (hand-edited)
  scripts/
    build-tokens.ts           # generates derived artifacts (auto-generated files live elsewhere)
  styles/
    color-tokens.css          # generated
    globals.css               # generated
  tailwind.config.ts          # imports generated theme extension
  lib/tokens.ts               # generated TypeScript constants

demo-app/
  design-system/
    tokens.ts                 # re-exported/generated from root package
```
- `design-tokens.json` is the only file edited directly.
- Everything marked “generated” is overwritten by `npm run tokens:build` and should not be hand-edited.
- Downstream apps either import the published package or consume `lib/tokens.ts` once the design system is packaged.

## 3. Token Schema
Use a nested object grouped by token category. Each token object includes:
- `value`: the primary value (CSS color, font size, spacing, etc.).
- `type`: classification (`color`, `fontFamily`, `fontSize`, `radius`, `shadow`, `duration`, etc.).
- `attributes`: optional metadata (mode-specific overrides, description, usage, figmaId).

```jsonc
{
  "brand": {
    "primary": {
      "type": "color",
      "value": "#ef2f23",
      "attributes": { "role": "brand-primary", "figmaId": "SOME_FIGMA_ID" }
    }
  },
  "semantic": {
    "primary": {
      "type": "color",
      "value": {
        "light": "hsl(4 86% 54%)",
        "dark": "hsl(4 86% 54%)"
      },
      "attributes": { "role": "cta" }
    }
  },
  "typography": {
    "heading": {
      "type": "fontFamily",
      "value": "'National2Condensed','Arial Black',sans-serif"
    }
  },
  "layout": {
    "radius": {
      "large": { "type": "radius", "value": "100px" }
    }
  },
  "motion": {
    "transition": {
      "fast": { "type": "duration", "value": "0.2s" }
    }
  }
}
```
- For multi-mode tokens (light/dark), store as an object keyed by mode. The generator produces CSS variables per mode.
- Enforce consistent naming: kebab-case when serialized to CSS (`--color-mm-primary`) and camelCase for TypeScript exports.

## 4. Build Pipeline
1. **Tooling**: Compile the generator with the local TypeScript compiler (`tsc`) and execute the emitted JS via Node.
2. **Script**: `design-system/scripts/build-tokens.ts`
   - Load `config/design-tokens.json`.
   - Validate against a JSON schema (use `zod` or `ajv`).
   - Produce:
     - `styles/color-tokens.css`: flattened brand tokens and semantic variables under `:root` + `[data-theme="dark"]`.
     - `styles/globals.css`: imports `color-tokens.css`, sets font families, radius, base body styles driven by tokens.
     - `lib/tokens.ts`: exports strongly typed constants for consumption in JS/TS.
     - `config/generated-tailwind-theme.ts`: object for `extend.colors`, `borderRadius`, etc., imported by `tailwind.config.ts`.
3. **Command** (`design-system/package.json`):
   ```json
   {
     "scripts": {
       "tokens:build": "tsc --project scripts/tsconfig.json && node scripts/dist/build-tokens.js",
       "tokens:check": "tsc --project scripts/tsconfig.json && node scripts/dist/build-tokens.js --check"
     }
   }
   ```
4. **App Integration**:
  - Use the workspace script: `npm run tokens:build` (root) or `npm run tokens:build --workspace design-system`.
  - Ensure consuming apps import CSS from the packaged design system or local build output.

## 5. Generated Output Requirements
- **CSS Variables**:
  - Namespace brand tokens as `--color-mm-*`.
  - Semantic tokens follow shadcn pattern: `--primary`, `--primary-foreground`, etc.
  - Include comments grouping sections for readability (generated once at top-level).
- **Tailwind Theme**:
  - `extend.colors` reads `hsl(var(--token))` style values to prevent drift.
  - Border radius and spacing derive from layout tokens.
- **TypeScript Exports**:
  - Provide `tokens.brand.primary.hex`, `tokens.semantic.primary.light`, etc.
  - Include helper functions like `getToken('semantic.primary', 'dark')`.
- **Parallels for Fonts**:
  - Generate `font-face` declarations in `globals.css` if tokens reference local font files.

## 6. Update Workflow
1. Edit `design-system/config/design-tokens.json` (or extend via script).
2. Run `npm run tokens:build` (root or package script).
3. Commit both the JSON and generated artifacts.
4. Execute lint/test suite.
- Add a `CONTRIBUTING.md` note describing this workflow.

## 7. Validation & Guardrails
- Add `design-system/config/design-tokens.schema.json` to validate structure.
- `tokens:check` compares generated outputs to disk and exits non-zero if differences exist (prevents manual edits).
- GitHub Actions workflow (`.github/workflows/ci.yml`) runs `npm run tokens:check` and the demo app lint on every push/PR.
- `demo-app/.eslintrc.js` blocks hard-coded hex/rgb/hsl literals so UI code must reference tokens (`hsl(var(--token))`, `var(--color-mm-*)`, etc.).
- Introduce ESLint rule (custom or `no-restricted-syntax`) in Next.js apps:
  - Forbid literal colors (regex for `#` hex or `rgb(`) unless annotated with `// eslint-disable-next-line`.
- Optional: integrate Stylelint in CSS to forbid hard-coded colors outside generated files.

## 8. Packaging for Next.js on Vercel
- Publish `design-system` as a private npm package (e.g., `mm-design-system` or a scoped variant). Include generated files in the package entry points.
- Next.js apps on Vercel:
  - Import global styles in `app/layout.tsx` or `_app.tsx`: `import "mm-design-system/styles/globals.css"`.
  - Ensure the tokens build step runs before `next build`; add `prebuild` script to run `tokens:build`.
  - Provide tree-shakeable exports for component libraries that rely on tokens (e.g., design-system React components).
- Keep build scripts lightweight—no native binaries—to align with Vercel build environments.

## 9. Backward Compatibility
- During adoption, keep existing CSS variables until the generator replicates them, then switch imports gradually.
- Provide a migration checklist in the consolidation document:
  - Map old token names to new schema keys.
  - Update Tailwind config to require generated theme module.
  - Review demo app for any hard-coded legacy values.

## 10. Open Questions / Next Decisions
- Do we enforce strict typing via `zod` or adopt an established solution like Style Dictionary? (Recommendation: start with the current custom TypeScript generator; reconsider Style Dictionary once tokens stabilize.)
- Should we version tokens separately (changelog per token release)? Suggest tagging releases `tokens-vX`.
- Are there additional modes beyond light/dark (e.g., high contrast)? Keep schema flexible by allowing more keys under `value`.

Once approved, Phase 3 will implement the build script, wire package scripts, and regenerate artifacts.
