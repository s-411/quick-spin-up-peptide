# Color Reference Guide

## Your Brand Colors

### Primary Color: MM Primary
- **Hex:** `#00A1FE`
- **RGB:** `rgb(0, 161, 254)`
- **HSL:** `hsl(202, 100%, 50%)`
- **Usage:** Primary buttons, links, active states, focus rings

### How to Use

```tsx
// CSS class (direct color, doesn't change with theme)
<div className="bg-mm-blue text-mm-dark">
  Fixed MM Blue background
</div>

// Tailwind/shadcn (recommended, theme-aware)
<div className="bg-primary text-primary-foreground">
  MM Blue that works in both modes
</div>
```

## Dark Mode Colors (Your Original Design)

When `theme="dark"` (the default):

| Element | Color | HSL Value | Hex Equivalent |
|---------|-------|-----------|----------------|
| Background | `hsl(0 0% 12%)` | `0 0% 12%` | `#1f1f1f` |
| Foreground (text) | `hsl(0 0% 100%)` | `0 0% 100%` | `#ffffff` |
| Card | `hsl(0 0% 16%)` | `0 0% 16%` | `#2a2a2a` |
| Primary | `hsl(202 100% 50%)` | `202 100% 50%` | `#00A1FE` |
| Muted Text | `hsl(0 0% 67%)` | `0 0% 67%` | `#ababab` |
| Border | `hsl(0 0% 20%)` | `0 0% 20%` | `#333333` |

**Dark Mode Preview:**
- Main background: Very dark gray (#1f1f1f)
- Cards/elevated surfaces: Slightly lighter gray (#2a2a2a)
- Text: White (#ffffff)
- Buttons: MM Blue (#00A1FE) with dark text
- Borders: Subtle dark borders

## Light Mode Colors

When `theme="light"`:

| Element | Color | HSL Value | Hex Equivalent |
|---------|-------|-----------|----------------|
| Background | `hsl(0 0% 100%)` | `0 0% 100%` | `#ffffff` |
| Foreground (text) | `hsl(0 0% 3.9%)` | `0 0% 3.9%` | `#0a0a0a` |
| Card | `hsl(0 0% 100%)` | `0 0% 100%` | `#ffffff` |
| Primary | `hsl(202 100% 50%)` | `202 100% 50%` | `#00A1FE` |
| Muted Text | `hsl(0 0% 45.1%)` | `0 0% 45.1%` | `#737373` |
| Border | `hsl(0 0% 89.8%)` | `0 0% 89.8%` | `#e5e5e5` |

**Light Mode Preview:**
- Main background: White (#ffffff)
- Cards/elevated surfaces: White with subtle borders
- Text: Nearly black (#0a0a0a)
- Buttons: MM Blue (#00A1FE) with dark text
- Borders: Light gray borders

## What Stays the Same in Both Modes

✅ **MM Blue (#00A1FE)** - Your primary color is identical in both modes
✅ **National2Condensed** - Heading font
✅ **ESKlarheit** - Body font
✅ **100px border radius** - Signature button style
✅ **Component spacing** - All padding/margins stay consistent

## What Changes

| Element | Dark Mode | Light Mode |
|---------|-----------|------------|
| Background | Dark gray | White |
| Text | White | Dark gray |
| Cards | Dark elevated | White with borders |
| Borders | Subtle dark | Subtle light |
| Inputs | Dark with glow | Light with borders |

## Theme-Aware Classes

Use these classes and they'll automatically adapt:

```tsx
// Background colors
<div className="bg-background">        // Dark gray → White
<div className="bg-card">              // Dark elevated → White
<div className="bg-primary">           // MM Blue (same in both)

// Text colors
<div className="text-foreground">      // White → Dark
<div className="text-muted-foreground"> // Gray → Darker gray
<div className="text-primary">         // MM Blue (same in both)

// Borders
<div className="border-border">        // Dark border → Light border
<div className="border-input">         // Matches input borders
```

## How to Change Primary Color

Edit `design-system/styles/globals.css`:

```css
:root {
  --primary: 202 100% 50%;  /* MM Blue - CHANGE THIS */
  /* ... */
}

.dark {
  --primary: 202 100% 50%;  /* MM Blue - CHANGE THIS */
  /* ... */
}
```

### Common Color Conversions (HSL format)

| Color Name | HSL Value | Hex |
|------------|-----------|-----|
| MM Blue (current) | `202 100% 50%` | `#00A1FE` |
| Red | `0 100% 50%` | `#FF0000` |
| Orange | `30 100% 50%` | `#FF8000` |
| Yellow | `60 100% 50%` | `#FFFF00` |
| Green | `120 100% 50%` | `#00FF00` |
| Cyan | `180 100% 50%` | `#00FFFF` |
| Purple | `270 100% 50%` | `#8000FF` |
| Pink | `330 100% 50%` | `#FF0080` |

**Pro Tip:** Use [hslpicker.com](https://hslpicker.com) to convert any hex color to HSL format.

## Legacy Color Classes

These still work but don't change with theme (always the same color):

```tsx
// Direct brand colors (fixed, no theme adaptation)
className="bg-mm-blue"    // Always #00A1FE
className="bg-mm-dark"    // Always #1f1f1f
className="bg-mm-dark2"   // Always #2a2a2a
className="bg-mm-white"   // Always #ffffff
className="bg-mm-gray"    // Always #ababab

className="text-mm-blue"  // Always #00A1FE text
className="text-mm-dark"  // Always #1f1f1f text
className="text-mm-white" // Always #ffffff text
className="text-mm-gray"  // Always #ababab text

className="border-mm-blue"  // Always #00A1FE border
className="border-mm-gray"  // Always #ababab border
```

Use these when you want a specific color regardless of theme. Otherwise, use theme-aware classes.

## Testing Colors

Create a test page to see all colors:

```tsx
export default function ColorTest() {
  return (
    <div className="space-y-4 p-8">
      <div className="bg-primary text-primary-foreground p-4 rounded-mm">
        Primary (MM Blue)
      </div>
      <div className="bg-background text-foreground border border-border p-4 rounded">
        Background
      </div>
      <div className="bg-card text-card-foreground border border-border p-4 rounded">
        Card
      </div>
      <div className="bg-muted text-muted-foreground p-4 rounded">
        Muted
      </div>
      <div className="bg-accent text-accent-foreground p-4 rounded">
        Accent
      </div>
    </div>
  )
}
```

Toggle between light/dark mode and watch everything adapt perfectly!
