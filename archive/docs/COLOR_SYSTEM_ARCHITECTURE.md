# Color System Architecture

Complete technical documentation of the MM Design System color architecture, including the dual-layer system, implementation patterns, and maintenance guidelines.

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [The Dual-Layer System](#the-dual-layer-system)
4. [Implementation Guide](#implementation-guide)
5. [Update Procedures](#update-procedures)
6. [Troubleshooting](#troubleshooting)
7. [Migration Guide](#migration-guide)

---

## Overview

The MM Design System uses a **dual-layer color architecture** to support both **Tailwind CSS 4** and **shadcn/ui** component patterns simultaneously. This design ensures:

- ✅ Consistency across all components
- ✅ Automatic light/dark mode support
- ✅ Single source of truth for colors
- ✅ Future-proof scalability
- ✅ Developer experience (DX) with autocomplete

### Core Principle

**One Color Change → Updates Everywhere**

When you update a color in `globals.css`, it automatically updates:
- All Tailwind utility classes (`.bg-primary`, `.text-primary`, etc.)
- All custom component classes (`.btn-mm`, `.card-mm`, etc.)
- All shadcn/ui compatible components
- Both light AND dark modes

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       globals.css                                │
│                  (Single Source of Truth)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
                   ┌──────────┴──────────┐
                   │                     │
                   ▼                     ▼
        ┌──────────────────┐  ┌──────────────────┐
        │   @theme Layer   │  │ @layer base      │
        │ (Tailwind CSS 4) │  │ (shadcn/ui)      │
        └──────────────────┘  └──────────────────┘
                   │                     │
        ┌──────────┴──────────┐         │
        │                     │         │
        ▼                     ▼         ▼
┌─────────────┐     ┌─────────────┐  ┌──────────────┐
│  --color-*  │     │ Tailwind    │  │  --primary   │
│  variables  │────▶│  Utilities  │  │  --ring      │
│  (full HSL) │     │  Classes    │  │  --card      │
└─────────────┘     └─────────────┘  │  etc.        │
                            │         │ (HSL channels)│
                            │         └──────────────┘
                            │                │
                            ▼                ▼
                    ┌──────────────────────────┐
                    │   Component Styles       │
                    ├──────────────────────────┤
                    │ .bg-primary              │
                    │ .text-primary-foreground │
                    │ hsl(var(--primary))      │
                    │ hsl(var(--ring))         │
                    └──────────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │    Final Rendered    │
                    │       Colors         │
                    └──────────────────────┘
```

---

## The Dual-Layer System

### Layer 1: @theme (Tailwind CSS 4)

**Purpose:** Provide color values for Tailwind utility classes

**Location:** `globals.css` lines 25-72

**Format:** Full HSL values with `hsl()` wrapper

```css
@theme {
  /* Full HSL color values */
  --color-mm-primary: #ef2f23;        /* Brand color (hex) */
  --color-primary: hsl(4 86% 54%);    /* Semantic color (full HSL) */
  --color-ring: hsl(4 86% 54%);       /* Focus ring color */
  --color-background: hsl(0 0% 100%); /* Background */
}
```

**Used By:**
- Tailwind utility classes: `.bg-primary`, `.text-primary`, `.border-primary`
- Accessed as: `var(--color-primary)`
- No `hsl()` wrapper needed when using

**Example:**
```css
.text-primary {
  color: var(--color-primary);  /* Resolves to hsl(4 86% 54%) */
}
```

### Layer 2: @layer base (shadcn/ui Compatible)

**Purpose:** Provide color values for custom components and shadcn/ui

**Location:** `globals.css` lines 78-134

**Format:** HSL channel values only (no `hsl()` wrapper)

```css
@layer base {
  :root {
    /* HSL channels only - light mode */
    --primary: 4 86% 54%;           /* No hsl() wrapper */
    --ring: 4 86% 54%;
    --background: 0 0% 100%;
  }

  .dark {
    /* HSL channels only - dark mode */
    --primary: 4 86% 54%;           /* Same primary in dark mode */
    --background: 0 0% 12%;         /* Different background */
  }
}
```

**Used By:**
- Custom component classes: `.btn-mm`, `.card-mm`, `.input-mm`
- shadcn/ui components
- Accessed as: `hsl(var(--primary))`
- **MUST** wrap in `hsl()` when using

**Example:**
```css
.btn-mm {
  background-color: hsl(var(--primary));  /* Resolves to hsl(4 86% 54%) */
  color: hsl(var(--primary-foreground));
}
```

### Why Two Layers?

1. **Tailwind CSS 4 Compatibility**
   - Tailwind CSS 4 uses `@theme` for theme values
   - Requires full color values (e.g., `hsl(4 86% 54%)`)
   - Automatically generates utility classes

2. **shadcn/ui Compatibility**
   - shadcn/ui uses CSS channel values for flexibility
   - Requires HSL channels only (e.g., `4 86% 54%`)
   - Allows easy opacity manipulation: `hsl(var(--primary) / 0.5)`

3. **Best of Both Worlds**
   - Use Tailwind classes: `<div className="bg-primary">`
   - Use custom components: `.btn-mm` with `hsl(var(--primary))`
   - Both reference the same color values underneath

---

## Implementation Guide

### For Tailwind Utility Classes

**When to Use:** Simple, utility-first styling

```tsx
// ✅ Correct - uses @theme layer
<button className="bg-primary text-primary-foreground rounded-mm">
  Click me
</button>

<div className="text-primary hover:text-primary/80">
  Link text
</div>
```

**How it Works:**
1. Tailwind reads `--color-primary` from `@theme`
2. Generates `.bg-primary { background-color: var(--color-primary); }`
3. Resolves to `hsl(4 86% 54%)`

### For Custom Component Classes

**When to Use:** Reusable component patterns, complex styling

```css
/* ✅ Correct - uses @layer base */
.btn-mm {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius-mm);
}

.input-mm:focus {
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}
```

**How it Works:**
1. CSS reads `--primary` from `@layer base`
2. Wraps in `hsl()` function
3. Resolves to `hsl(4 86% 54%)`

### For Inline Styles (Avoid if Possible)

```tsx
// ⚠️ Only use when absolutely necessary
<div style={{
  backgroundColor: 'hsl(var(--primary))',  // Won't work!
  backgroundColor: 'var(--color-primary)',  // ✅ Works
}}>
  Content
</div>
```

**Note:** CSS variables in inline styles require the full value from `@theme` layer.

### Adding Opacity

```css
/* Tailwind utilities */
.bg-primary/50     /* 50% opacity */
.border-primary/20  /* 20% opacity */

/* Custom CSS */
background-color: hsl(var(--primary) / 0.5);  /* 50% opacity */
box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2); /* 20% opacity */
```

---

## Update Procedures

### How to Change the Primary Color

**Scenario:** You want to change from red (#ef2f23) to blue (#0066cc)

**Steps:**

1. **Convert hex to HSL:** Use a color converter
   - #0066cc → `hsl(210 100% 40%)`

2. **Update @theme layer:**
```css
@theme {
  --color-mm-primary: #0066cc;         /* Brand color */
  --color-primary: hsl(210 100% 40%);  /* Semantic color */
  --color-ring: hsl(210 100% 40%);     /* Focus ring */
}
```

3. **Update @layer base (both :root and .dark):**
```css
@layer base {
  :root {
    --primary: 210 100% 40%;  /* Light mode */
    --ring: 210 100% 40%;
  }

  .dark {
    --primary: 210 100% 40%;  /* Dark mode */
    --ring: 210 100% 40%;
  }
}
```

4. **Test:**
   - [ ] Buttons show new color
   - [ ] Focus rings show new color
   - [ ] Rating tiles show new color when selected
   - [ ] Table links show new color
   - [ ] Works in both light and dark modes

### How to Add a New Semantic Color

**Scenario:** You want to add a "warning" color

**Steps:**

1. **Add to @theme:**
```css
@theme {
  --color-warning: hsl(38 92% 50%);  /* Orange */
  --color-warning-foreground: hsl(0 0% 100%);  /* White text */
}
```

2. **Add to @layer base:**
```css
@layer base {
  :root {
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;
  }

  .dark {
    --warning: 38 92% 50%;
    --warning-foreground: 0 0% 100%;
  }
}
```

3. **Use it:**
```tsx
{/* Tailwind */}
<div className="bg-warning text-warning-foreground">
  Warning!
</div>

{/* Custom CSS */}
.alert-warning {
  background-color: hsl(var(--warning));
  color: hsl(var(--warning-foreground));
}
```

---

## Troubleshooting

### Issue: Color Not Updating

**Symptoms:** Changed color in globals.css but component still shows old color

**Solutions:**

1. **Check both layers:**
   - Did you update `@theme` AND `@layer base`?
   - Both must match for consistency

2. **Clear Next.js cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Hard refresh browser:**
   - Chrome/Edge: Ctrl+Shift+R (Cmd+Shift+R on Mac)
   - Or open DevTools and right-click refresh → "Empty Cache and Hard Reload"

4. **Check for hardcoded colors:**
   ```bash
   grep -r "#ef2f23\|#00A1FE" --include="*.tsx" --include="*.css"
   ```

### Issue: Different Colors in Light vs Dark Mode

**Symptoms:** Component color changes unexpectedly when switching themes

**Solutions:**

1. **Check if color is semantic or fixed:**
   - Use `--color-mm-primary` for FIXED red (never changes)
   - Use `--primary` for ADAPTIVE colors (changes with theme)

2. **Verify dark mode overrides:**
   ```css
   :root {
     --background: 0 0% 100%;  /* White in light */
   }

   .dark {
     --background: 0 0% 12%;   /* Dark gray in dark mode */
   }
   ```

### Issue: Tailwind Classes Not Working

**Symptoms:** `.bg-primary` doesn't apply color

**Solutions:**

1. **Check @theme layer has full HSL:**
   ```css
   /* ✅ Correct */
   --color-primary: hsl(4 86% 54%);

   /* ❌ Wrong */
   --color-primary: 4 86% 54%;
   ```

2. **Verify Tailwind config:**
   - Using Tailwind CSS 4 with `@tailwindcss/postcss`
   - Check `postcss.config.mjs`

### Issue: opacity Not Working

**Symptoms:** `.bg-primary/50` doesn't apply opacity

**Solutions:**

1. **Check HSL format (no commas):**
   ```css
   /* ✅ Correct (space-separated) */
   --primary: 4 86% 54%;

   /* ❌ Wrong (comma-separated) */
   --primary: 4, 86%, 54%;
   ```

2. **Use proper syntax:**
   ```css
   /* Tailwind */
   .bg-primary/50

   /* Custom CSS */
   hsl(var(--primary) / 0.5)
   ```

---

## Migration Guide

### From Hardcoded Colors to CSS Variables

**Before:**
```tsx
<button style={{ backgroundColor: '#ef2f23', color: '#fff' }}>
  Click me
</button>

<div className="hover:bg-[#ef2f23]">
  Custom Tailwind color
</div>
```

**After:**
```tsx
<button className="bg-primary text-primary-foreground">
  Click me
</button>

<div className="hover:bg-primary">
  Semantic Tailwind color
</div>
```

### From Tailwind v3 to v4

**Changes Required:**

1. **Update color format (remove commas):**
   ```css
   /* v3 */
   --primary: 4, 86%, 54%;

   /* v4 */
   --primary: 4 86% 54%;
   ```

2. **Add @theme layer:**
   ```css
   @theme {
     --color-primary: hsl(4 86% 54%);
   }
   ```

3. **Update utility class usage:**
   ```tsx
   {/* v3 */}
   <div className="bg-brand-red">

   {/* v4 */}
   <div className="bg-primary">
   ```

### From CSS Modules to Utility Classes

**Before (CSS Module):**
```css
/* Button.module.css */
.button {
  background-color: #ef2f23;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 100px;
}
```

**After (Tailwind + CSS Variables):**
```tsx
<button className="bg-primary text-primary-foreground px-6 py-3 rounded-mm">
  Click me
</button>
```

Or use the pre-built class:
```tsx
<button className="btn-mm">
  Click me
</button>
```

---

## Best Practices

### ✅ DO

1. **Always update both layers** when changing semantic colors
2. **Use semantic colors** (`--primary`) for adaptive theming
3. **Use brand colors** (`--color-mm-primary`) for fixed branding
4. **Test in both light and dark modes** after any color change
5. **Use space-separated HSL** format (e.g., `4 86% 54%`)
6. **Wrap @layer base colors** in `hsl()` (e.g., `hsl(var(--primary))`)
7. **Keep color definitions in globals.css only**

### ❌ DON'T

1. **Don't hardcode colors** in components (#hex, rgb(), hsl() literals)
2. **Don't use inline styles** for colors
3. **Don't define colors** outside of globals.css
4. **Don't use comma-separated HSL** (e.g., `4, 86%, 54%`)
5. **Don't forget the hsl() wrapper** for @layer base colors
6. **Don't skip dark mode testing**
7. **Don't create one-off color variables** without documenting

---

## Quick Reference

### Color Format Cheat Sheet

| Layer | Format | Example | Usage |
|-------|--------|---------|-------|
| @theme | Full HSL or Hex | `hsl(4 86% 54%)` or `#ef2f23` | Tailwind utilities |
| @layer base :root | HSL channels | `4 86% 54%` | Custom components (light) |
| @layer base .dark | HSL channels | `4 86% 54%` | Custom components (dark) |

### When to Use What

| Scenario | Use This | Example |
|----------|----------|---------|
| Tailwind utility class | `className="bg-primary"` | `<div className="bg-primary">` |
| Custom CSS class | `hsl(var(--primary))` | `.btn-mm { background: hsl(var(--primary)); }` |
| Fixed brand color | `var(--color-mm-primary)` or `.bg-mm-primary` | Logo, headers |
| Inline style (avoid) | `var(--color-primary)` | `style={{ color: 'var(--color-primary)' }}` |
| With opacity (Tailwind) | `.bg-primary/50` | 50% opacity |
| With opacity (CSS) | `hsl(var(--primary) / 0.5)` | 50% opacity |

---

## Maintenance Checklist

### After Changing Colors

- [ ] Both @theme and @layer base updated
- [ ] Light mode values set in `:root`
- [ ] Dark mode values set in `.dark`
- [ ] Cleared .next cache
- [ ] Hard refreshed browser
- [ ] Tested all components in light mode
- [ ] Tested all components in dark mode
- [ ] Ran color audit script
- [ ] Updated documentation (if new color added)

### Monthly Audit

- [ ] Run: `grep -r "#[0-9a-fA-F]{6}" --include="*.tsx"`
- [ ] Verify no hardcoded colors found
- [ ] Check all focus states use `--ring`
- [ ] Verify contrast ratios meet WCAG AA
- [ ] Review any recent component additions

---

**Architecture Version:** 2.0
**Last Updated:** October 16, 2025
**Maintainer:** MM Design Team
