# MM Design System v2.0

**A complete, scalable design system with automatic light/dark mode support, built with Tailwind CSS 4 and shadcn/ui compatibility.**

---

## 🎉 What's New in v2.0

### ✅ All Dark Mode Issues Fixed

All 7 dark mode color issues have been resolved:

1. ✅ **Dark Mode Toggle** - Now shows white icon in dark mode
2. ✅ **Primary Buttons** - Display red (#ef2f23) in both modes
3. ✅ **Secondary Buttons** - Fully visible in dark mode
4. ✅ **Form Input Focus Rings** - Red (#ef2f23) instead of blue
5. ✅ **Card Action Buttons** - Clearly visible in dark mode
6. ✅ **Rating Tiles** - Show red background when selected (no more disappearing!)
7. ✅ **Table Action Links** - Red (#ef2f23) instead of blue

### 🚀 New Features

- **Dual-Layer Color System** - Supports both Tailwind CSS 4 and shadcn/ui
- **Single Source of Truth** - All colors defined in one place (globals.css)
- **TypeScript Support** - Full type definitions for design tokens
- **Comprehensive Documentation** - Complete guides for all aspects of the system
- **Component Audit** - All components verified to use CSS variables
- **Developer Checklists** - Easy-to-follow guides for adding new components

---

## 📚 Documentation

### Core Documentation

| Document | Description |
|----------|-------------|
| **[DESIGN_TOKENS.md](DESIGN_TOKENS.md)** | Complete reference of all CSS variables, colors, typography, and spacing tokens |
| **[COLOR_SYSTEM_ARCHITECTURE.md](COLOR_SYSTEM_ARCHITECTURE.md)** | Technical deep-dive into the dual-layer color system and how it works |
| **[COMPONENT_AUDIT.md](COMPONENT_AUDIT.md)** | Audit report showing all components use CSS variables correctly |
| **[COMPONENT_CHECKLIST.md](COMPONENT_CHECKLIST.md)** | Step-by-step checklist for creating new components |
| **[design-system/types/design-tokens.ts](design-system/types/design-tokens.ts)** | TypeScript types and helper functions for design tokens |

### Quick Links

- **Demo App:** `http://localhost:3002` (when running `npm run dev`)
- **Main CSS:** [design-system/styles/globals.css](design-system/styles/globals.css)
- **Components:** [demo-app/components/ui/](demo-app/components/ui/)

---

## 🎨 Color System Overview

### The Dual-Layer Architecture

The MM Design System uses a unique dual-layer color architecture that provides the best of both worlds:

**Layer 1: @theme (Tailwind CSS 4)**
- Used by Tailwind utility classes (`.bg-primary`, `.text-primary`)
- Full HSL values: `hsl(4 86% 54%)`

**Layer 2: @layer base (shadcn/ui Compatible)**
- Used by custom components (`.btn-mm`, `.card-mm`)
- HSL channels only: `4 86% 54%` (wrapped in `hsl()` when used)

**Result:** Change one color in `globals.css` → Updates everywhere automatically!

### Brand Colors (Fixed)

These colors never change between light and dark modes:

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#ef2f23` | Main brand red |
| **Secondary** | `#ff811c` | Accent orange |
| **Dark** | `#1f1f1f` | Dark backgrounds |
| **White** | `#ffffff` | White elements |
| **Gray** | `#ababab` | Mid-tone accents |

### Semantic Colors (Adaptive)

These colors automatically adapt between light and dark modes:

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `--background` | White | Dark gray | Page background |
| `--foreground` | Near black | White | Text color |
| `--primary` | Red (#ef2f23) | Red (#ef2f23) | Interactive elements |
| `--card` | White | Dark gray | Card backgrounds |
| `--ring` | Red (#ef2f23) | Red (#ef2f23) | Focus states |

---

## 🛠️ Quick Start

### 1. Installation

```bash
cd demo-app
npm install
npm run dev
```

Visit `http://localhost:3002` to see the design system in action.

### 2. Using Colors

**Option A: Tailwind Utility Classes**
```tsx
<button className="bg-primary text-primary-foreground rounded-mm">
  Click me
</button>
```

**Option B: Pre-built Component Classes**
```tsx
<button className="btn-mm">
  Click me
</button>
```

**Option C: Custom CSS**
```css
.my-component {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius-mm);
}
```

### 3. Dark Mode

Dark mode is automatically handled! Just toggle the theme:

```tsx
import { ThemeToggle } from '@/design-system/lib/theme-toggle'

export function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  )
}
```

---

## 📝 Common Tasks

### How to Change the Primary Color

1. **Open** `design-system/styles/globals.css`

2. **Update @theme layer** (line 42 and 54):
```css
@theme {
  --color-mm-primary: #your-new-color;
  --color-primary: hsl(H S% L%);  /* Convert hex to HSL */
  --color-ring: hsl(H S% L%);     /* Same as primary */
}
```

3. **Update @layer base** (lines 87, 99, 115, 127):
```css
@layer base {
  :root {
    --primary: H S% L%;  /* HSL channels only */
    --ring: H S% L%;
  }

  .dark {
    --primary: H S% L%;  /* Same for dark mode */
    --ring: H S% L%;
  }
}
```

4. **Repeat for demo-app** `demo-app/design-system/styles/globals.css`

5. **Restart dev server** and hard refresh browser

### How to Add a New Component

Follow the **[Component Checklist](COMPONENT_CHECKLIST.md)**:

1. ✅ Plan design for light AND dark modes
2. ✅ Use CSS variables for ALL colors (no hardcoded values)
3. ✅ Make it keyboard accessible
4. ✅ Test on mobile
5. ✅ Add TypeScript types
6. ✅ Document with JSDoc
7. ✅ Add to demo page

### How to Audit for Hardcoded Colors

Run the audit script:

```bash
# Search for hardcoded hex colors
grep -r "#[0-9a-fA-F]{6}" --include="*.tsx" --include="*.ts" --exclude-dir=node_modules

# Search for old blue color
grep -r "#00A1FE\|rgb(0.*162.*255)" --include="*.tsx" --include="*.css" --exclude-dir=node_modules
```

Should return **no results** (except in globals.css where colors are defined).

---

## 🎯 Design System Features

### Typography

- **Headings:** National2Condensed (bold, condensed)
- **Body:** ESKlarheit (readable, modern)
- **Responsive:** Automatic size adjustments on mobile

### Components

All components support:
- ✅ Light and dark modes
- ✅ Keyboard navigation
- ✅ Screen reader accessibility
- ✅ Responsive design
- ✅ CSS variable-based colors

**Available Components:**
- Buttons (primary, secondary, disabled states)
- Form inputs (text, select, textarea with focus states)
- Cards (standard, glass effect)
- Rating tiles (interactive selection)
- Tables (with action links)
- Modals (with backdrop blur)
- Navigation (sidebar, mobile)
- And more...

### Utilities

- **Color utilities:** `.bg-mm-primary`, `.text-mm-white`, etc.
- **Typography utilities:** `.font-heading`, `.font-body`
- **Border radius utilities:** `.rounded-mm`, `.rounded-card`
- **Animation utilities:** `.animate-fade-in`, `.animate-slide-up`

---

## 🔧 Development Workflow

### Before Starting

1. Read **[Component Checklist](COMPONENT_CHECKLIST.md)**
2. Review **[Design Tokens Reference](DESIGN_TOKENS.md)**
3. Understand **[Color System Architecture](COLOR_SYSTEM_ARCHITECTURE.md)**

### During Development

1. Use CSS variables from `globals.css`
2. Test in both light and dark modes
3. Verify keyboard accessibility
4. Check mobile responsiveness
5. Run color audit before committing

### Before Committing

- [ ] No hardcoded colors (`grep` returns nothing)
- [ ] Works in light AND dark modes
- [ ] Keyboard accessible
- [ ] TypeScript types defined
- [ ] JSDoc documentation added
- [ ] Tested on mobile

---

## 🎓 Best Practices

### ✅ DO

- Use semantic color tokens (`--primary`, `--foreground`)
- Use brand color tokens for fixed branding (`--color-mm-primary`)
- Wrap @layer base colors in `hsl()`: `hsl(var(--primary))`
- Test every component in dark mode
- Use space-separated HSL format: `4 86% 54%`
- Keep all color definitions in `globals.css`

### ❌ DON'T

- Hardcode colors in components: `#ef2f23`, `rgb()`, `hsl()` literals
- Use inline styles for colors
- Define colors outside of `globals.css`
- Use comma-separated HSL: `4, 86%, 54%`
- Forget to test dark mode
- Skip accessibility testing

---

## 🐛 Troubleshooting

### Color Not Updating?

1. Did you update **both** @theme AND @layer base?
2. Clear cache: `rm -rf .next && npm run dev`
3. Hard refresh browser: Ctrl+Shift+R (Cmd+Shift+R on Mac)
4. Check for hardcoded colors: `grep -r "#ef2f23"`

### Wrong Color in Dark Mode?

1. Check if you want fixed or adaptive:
   - Fixed: Use `--color-mm-primary` (always red)
   - Adaptive: Use `--primary` (changes with theme)
2. Verify `.dark` overrides in `globals.css`

### Tailwind Class Not Working?

1. Check @theme layer has **full HSL**: `hsl(4 86% 54%)`
2. Not just channels: `4 86% 54%`

See **[Color System Architecture - Troubleshooting](COLOR_SYSTEM_ARCHITECTURE.md#troubleshooting)** for more solutions.

---

## 📊 System Status

### Component Compliance

| Category | Status |
|----------|--------|
| **Color Audit** | ✅ 100% - All components use CSS variables |
| **Dark Mode** | ✅ 100% - All components work in both modes |
| **Accessibility** | ✅ All interactive elements keyboard accessible |
| **Documentation** | ✅ Complete documentation for all aspects |
| **TypeScript** | ✅ Full type definitions available |

### Files Modified (v2.0 Update)

- ✅ `design-system/styles/globals.css` - Color variable fixes
- ✅ `demo-app/design-system/styles/globals.css` - Color variable fixes
- ✅ `demo-app/design-system/lib/theme-toggle.tsx` - Removed hardcoded blue
- ✅ `design-system/lib/theme-toggle.tsx` - Removed hardcoded blue
- ✅ `demo-app/app/page.tsx` - Updated color display text

### New Documentation Files

- 📄 `DESIGN_TOKENS.md` - Complete token reference
- 📄 `COLOR_SYSTEM_ARCHITECTURE.md` - Technical architecture guide
- 📄 `COMPONENT_AUDIT.md` - Audit report
- 📄 `COMPONENT_CHECKLIST.md` - Development checklist
- 📄 `design-system/types/design-tokens.ts` - TypeScript types
- 📄 `DESIGN_SYSTEM_README.md` - This file

---

## 🚀 Future Enhancements

Potential areas for expansion:

- [ ] Additional color themes (beyond light/dark)
- [ ] More pre-built components
- [ ] Storybook integration
- [ ] Visual regression testing
- [ ] Design token JSON export
- [ ] Figma plugin for token sync

---

## 📞 Support

### Need Help?

1. **Check Documentation:**
   - [Design Tokens Reference](DESIGN_TOKENS.md)
   - [Color System Architecture](COLOR_SYSTEM_ARCHITECTURE.md)
   - [Component Checklist](COMPONENT_CHECKLIST.md)

2. **Common Issues:**
   - See [Troubleshooting](#troubleshooting) section above
   - Review [Component Audit](COMPONENT_AUDIT.md) for examples

3. **Still Stuck?**
   - Review the demo app code in `demo-app/app/page.tsx`
   - Check existing components in `demo-app/components/ui/`

---

## 📜 License

[Your License Here]

---

## 🙏 Acknowledgments

Built with:
- **Next.js 14** - React framework
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - Component patterns
- **Lucide React** - Icon library
- **next-themes** - Dark mode support

---

**Version:** 2.0
**Last Updated:** October 16, 2025
**Status:** ✅ Production Ready

---

## Quick Command Reference

```bash
# Start dev server
cd demo-app && npm run dev

# Audit colors
grep -r "#[0-9a-fA-F]{6}" --include="*.tsx" --exclude-dir=node_modules

# Clear cache
rm -rf .next

# Run on different port
PORT=3001 npm run dev
```

**Happy coding! 🎨**
