# Design Tokens Reference

Complete reference for all CSS variables and design tokens in the MM Design System.

## Table of Contents
- [Color Tokens](#color-tokens)
- [Typography Tokens](#typography-tokens)
- [Spacing & Layout Tokens](#spacing--layout-tokens)
- [Animation Tokens](#animation-tokens)
- [Usage Examples](#usage-examples)

---

## Color Tokens

### Brand Colors (Fixed Values)
These colors remain constant across light and dark modes.

| Token | Value | Hex | Usage |
|-------|-------|-----|-------|
| `--color-mm-primary` | `#ef2f23` | ![#ef2f23](https://via.placeholder.com/15/ef2f23/ef2f23.png) | Primary brand red |
| `--color-mm-secondary` | `#ff811c` | ![#ff811c](https://via.placeholder.com/15/ff811c/ff811c.png) | Secondary brand orange |
| `--color-mm-dark` | `#1f1f1f` | ![#1f1f1f](https://via.placeholder.com/15/1f1f1f/1f1f1f.png) | Dark background |
| `--color-mm-dark2` | `#2a2a2a` | ![#2a2a2a](https://via.placeholder.com/15/2a2a2a/2a2a2a.png) | Dark background variant |
| `--color-mm-white` | `#ffffff` | ![#ffffff](https://via.placeholder.com/15/ffffff/ffffff.png) | Pure white |
| `--color-mm-gray` | `#ababab` | ![#ababab](https://via.placeholder.com/15/ababab/ababab.png) | Mid-tone gray |

### Semantic Color Tokens (Adaptive)
These tokens change based on light/dark mode for optimal contrast.

#### @theme Layer (Tailwind CSS 4)
Used by Tailwind utility classes like `.text-primary`, `.bg-primary`, etc.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--color-primary` | `hsl(4 86% 54%)` | `hsl(4 86% 54%)` | Primary interactive elements |
| `--color-primary-foreground` | `hsl(0 0% 100%)` | `hsl(0 0% 100%)` | Text on primary backgrounds |
| `--color-secondary` | `hsl(0 0% 96.1%)` | `hsl(0 0% 96.1%)` | Secondary backgrounds |
| `--color-secondary-foreground` | `hsl(0 0% 9%)` | `hsl(0 0% 9%)` | Text on secondary backgrounds |

#### @layer base (shadcn/ui Compatible)
Used in component classes like `.btn-mm`, `.card-mm`, etc.

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--background` | `0 0% 100%` | `0 0% 12%` | Page background |
| `--foreground` | `0 0% 3.9%` | `0 0% 100%` | Text color |
| `--card` | `0 0% 100%` | `0 0% 16%` | Card backgrounds |
| `--card-foreground` | `0 0% 3.9%` | `0 0% 100%` | Card text |
| `--primary` | `4 86% 54%` | `4 86% 54%` | Primary color (#ef2f23) |
| `--primary-foreground` | `0 0% 100%` | `0 0% 100%` | Text on primary |
| `--secondary` | `0 0% 96.1%` | `0 0% 16%` | Secondary backgrounds |
| `--secondary-foreground` | `0 0% 9%` | `0 0% 100%` | Text on secondary |
| `--muted` | `0 0% 96.1%` | `0 0% 18%` | Muted backgrounds |
| `--muted-foreground` | `0 0% 45.1%` | `0 0% 67%` | Muted text |
| `--accent` | `0 0% 96.1%` | `0 0% 18%` | Accent/hover states |
| `--accent-foreground` | `0 0% 9%` | `0 0% 100%` | Text on accent |
| `--destructive` | `0 84.2% 60.2%` | `0 100% 71%` | Error/destructive actions |
| `--destructive-foreground` | `0 0% 98%` | `0 0% 100%` | Text on destructive |
| `--border` | `0 0% 89.8%` | `0 0% 20%` | Border colors |
| `--input` | `0 0% 89.8%` | `0 0% 20%` | Input borders |
| `--ring` | `4 86% 54%` | `4 86% 54%` | Focus rings (#ef2f23) |

---

## Typography Tokens

### Font Families

| Token | Value | Usage |
|-------|-------|-------|
| `--font-family-heading` | `'National2Condensed', 'Arial Black', sans-serif` | All headings (h1-h6) |
| `--font-family-body` | `'ESKlarheit', 'Inter', system-ui, sans-serif` | Body text, paragraphs |

### Font Sizes (Responsive)

| Element | Desktop | Mobile |
|---------|---------|--------|
| `h1` | 2.5rem (40px) | 2rem (32px) |
| `h2` | 2rem (32px) | 1.5rem (24px) |
| `h3` | 1.5rem (24px) | 1.25rem (20px) |
| `h4` | 1.25rem (20px) | 1.25rem (20px) |
| `h5` | 1rem (16px) | 1rem (16px) |
| `h6` | 0.875rem (14px) | 0.875rem (14px) |
| `body` | 1rem (16px) | 1rem (16px) |

---

## Spacing & Layout Tokens

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-mm` | `100px` | Primary buttons (signature style) |
| `--radius-card` | `0.5rem` | Cards, modals |
| `--radius-input` | `0.5rem` | Form inputs, rating tiles |
| `--radius` | `0.5rem` | Generic border radius |

### Container Widths

| Class | Max Width |
|-------|-----------|
| `.max-w-6xl` | 72rem (1152px) - Main content |
| `.max-w-lg` | 32rem (512px) - Forms, modals |

---

## Animation Tokens

### Transition Durations

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `0.2s` | Quick interactions (hovers, clicks) |
| `--transition-medium` | `0.3s` | Standard animations |
| `--transition-slow` | `0.5s` | Fade-ins, page transitions |

### Keyframe Animations

Available via utility classes:
- `.animate-fade-in` - Fade in over `--transition-slow`
- `.animate-slide-up` - Slide up over `--transition-medium`
- `.animate-slide-in` - Slide in from left over `--transition-medium`
- `.animate-pulse-custom` - Continuous pulse effect

---

## Usage Examples

### Using Brand Colors (Fixed)

```css
/* In CSS */
.my-element {
  background-color: var(--color-mm-primary); /* Always #ef2f23 */
  color: var(--color-mm-white);
}
```

```tsx
/* In JSX with Tailwind */
<div className="bg-mm-primary text-mm-white">
  Fixed brand color
</div>
```

### Using Semantic Colors (Adaptive)

```css
/* In CSS - shadcn/ui style */
.my-button {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--border));
}

/* Focus ring */
.my-input:focus {
  border-color: hsl(var(--ring));
  box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
}
```

```tsx
/* In JSX with Tailwind - uses @theme layer */
<button className="bg-primary text-primary-foreground">
  Adaptive primary button
</button>

<div className="bg-card text-card-foreground border border-border">
  Adaptive card
</div>
```

### Using Typography Tokens

```css
.custom-heading {
  font-family: var(--font-family-heading);
  font-weight: bold;
  line-height: 1.2;
}

.custom-body {
  font-family: var(--font-family-body);
  line-height: 1.6;
}
```

```tsx
/* In JSX with Tailwind */
<h1 className="font-heading">Uses National2Condensed</h1>
<p className="font-body">Uses ESKlarheit</p>
```

### Using Spacing & Radius Tokens

```css
.rounded-button {
  border-radius: var(--radius-mm); /* 100px pill shape */
}

.rounded-card {
  border-radius: var(--radius-card); /* 0.5rem */
}
```

```tsx
/* In JSX with Tailwind */
<button className="rounded-mm">Pill button</button>
<div className="rounded-card">Standard card</div>
```

### Using Animation Tokens

```css
.smooth-transition {
  transition: all var(--transition-medium) ease-out;
}

.quick-hover {
  transition: opacity var(--transition-fast);
}
```

---

## Important Notes

### Color Token Architecture

The design system uses TWO parallel color systems:

1. **@theme layer** (`--color-*` variables)
   - Used by Tailwind CSS 4 utility classes
   - Accessed via `var(--color-primary)`, `var(--color-background)`, etc.
   - Full HSL values: `hsl(4 86% 54%)`

2. **@layer base** (`--*` variables without "color")
   - Used by shadcn/ui compatible components
   - Accessed via `hsl(var(--primary))`, `hsl(var(--background))`, etc.
   - HSL channels only: `4 86% 54%` (wrapped in `hsl()` when used)

**CRITICAL:** When updating colors, you MUST update BOTH layers to maintain consistency!

### HSL Color Format

Colors use space-separated HSL format (Tailwind CSS 4 standard):
- ✅ Correct: `4 86% 54%` or `hsl(4 86% 54%)`
- ❌ Wrong: `4, 86%, 54%` (comma-separated)

### Color Opacity

To add opacity to semantic colors:

```css
/* Using alpha channel */
background-color: hsl(var(--primary) / 0.5); /* 50% opacity */
box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2); /* 20% opacity */
```

```tsx
/* Using Tailwind */
<div className="bg-primary/50">50% opacity</div>
<div className="border-primary/20">20% opacity border</div>
```

---

## Quick Reference Card

| I want to... | Use this... | Example |
|--------------|-------------|---------|
| Always show brand red | `var(--color-mm-primary)` or `.bg-mm-primary` | Logo, brand elements |
| Adaptive primary color | `hsl(var(--primary))` or `.bg-primary` | Buttons, links |
| Focus ring | `hsl(var(--ring))` | Input focus states |
| Heading font | `var(--font-family-heading)` or `.font-heading` | All h1-h6 |
| Body font | `var(--font-family-body)` or `.font-body` | Paragraphs, UI text |
| Pill-shaped button | `var(--radius-mm)` or `.rounded-mm` | Primary buttons |
| Card corners | `var(--radius-card)` or `.rounded-card` | Cards, modals |
| Quick animation | `var(--transition-fast)` | Hover effects |

---

**Last Updated:** October 16, 2025
**Version:** 2.0
