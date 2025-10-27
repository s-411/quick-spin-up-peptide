# New Component Checklist

Complete checklist for adding new components to the MM Design System to ensure consistency, accessibility, and proper integration.

---

## 📋 Pre-Development Checklist

### 1. Planning & Design
- [ ] Component purpose and use cases are clearly defined
- [ ] Design mockups exist for both light and dark modes
- [ ] Component fits within existing design system patterns
- [ ] Similar existing components have been reviewed
- [ ] Responsive behavior is planned (mobile, tablet, desktop)

### 2. Technical Setup
- [ ] Component name follows naming conventions (PascalCase for components, kebab-case for CSS classes)
- [ ] File location determined (`components/ui/` for shadcn-style, `design-system/` for custom)
- [ ] Dependencies are minimal and necessary
- [ ] TypeScript will be used (`.tsx` not `.jsx`)

---

## 🎨 Design Token Integration

### Required: Color Usage
- [ ] **NO hardcoded colors** - All colors use CSS variables from [globals.css](design-system/styles/globals.css)
- [ ] Primary/interactive elements use `hsl(var(--primary))` or `.bg-primary`
- [ ] Text uses `hsl(var(--foreground))` or `.text-foreground`
- [ ] Backgrounds use `hsl(var(--background))` or `.bg-background`
- [ ] Focus states use `hsl(var(--ring))` or `.ring-ring`
- [ ] Component works in BOTH light and dark modes

**Example:**
```tsx
// ✅ CORRECT
<button className="bg-primary text-primary-foreground">
  Click me
</button>

// ❌ WRONG
<button style={{ backgroundColor: '#ef2f23', color: '#fff' }}>
  Click me
</button>
```

### Required: Typography
- [ ] Headings use `var(--font-family-heading)` or `.font-heading`
- [ ] Body text uses `var(--font-family-body)` or `.font-body`
- [ ] Font sizes use Tailwind classes or responsive CSS
- [ ] Line heights are appropriate for readability

### Required: Spacing & Layout
- [ ] Buttons use `var(--radius-mm)` (100px pill shape) or `.rounded-mm`
- [ ] Cards/panels use `var(--radius-card)` (0.5rem) or `.rounded-card`
- [ ] Inputs use `var(--radius-input)` (0.5rem) or `.rounded-input`
- [ ] Padding and margins use Tailwind spacing scale

### Required: Animations
- [ ] Transitions use `var(--transition-fast)`, `--transition-medium`, or `--transition-slow`
- [ ] Hover states are smooth and performant
- [ ] No jarring animations (respect `prefers-reduced-motion`)

---

## ♿ Accessibility Checklist

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible (Tab, Enter, Space)
- [ ] Focus states are visible (uses `--ring` variable for focus rings)
- [ ] Tab order is logical
- [ ] Escape key closes modals/dropdowns (if applicable)
- [ ] Arrow keys navigate lists/menus (if applicable)

### Screen Readers
- [ ] Semantic HTML elements used (`<button>`, `<nav>`, `<main>`, etc.)
- [ ] `aria-label` provided for icon-only buttons
- [ ] `aria-describedby` used for error messages
- [ ] `aria-live` regions for dynamic content
- [ ] Form inputs have associated `<label>` elements

### Visual Accessibility
- [ ] Color contrast meets WCAG AA standards (4.5:1 for text, 3:1 for UI)
- [ ] Text is readable in both light and dark modes
- [ ] Interactive elements have minimum 44x44px touch target
- [ ] Disabled states are visually distinct
- [ ] Error states are clear and not color-only

### Testing
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with screen reader (VoiceOver, NVDA, or JAWS)
- [ ] Tested at 200% zoom
- [ ] Color contrast checked with tool (e.g., WebAIM Contrast Checker)

---

## 📱 Responsive Design

### Breakpoints (Tailwind)
- [ ] Mobile-first approach used
- [ ] Component adapts to these breakpoints:
  - `sm:` 640px
  - `md:` 768px
  - `lg:` 1024px
  - `xl:` 1280px
  - `2xl:` 1536px

### Mobile Optimization
- [ ] Touch targets are at least 44x44px
- [ ] Text is readable on small screens
- [ ] Component fits within mobile viewport (no horizontal scroll)
- [ ] Padding/spacing adjusted for mobile
- [ ] Modals/dropdowns work on mobile (full-screen if needed)

### Testing
- [ ] Tested on actual mobile device (iOS and/or Android)
- [ ] Tested in browser responsive mode (Chrome DevTools)
- [ ] Tested at 320px width (smallest common viewport)
- [ ] Tested in landscape and portrait orientations

---

## 💻 Component Implementation

### File Structure
```
design-system/
├── components/
│   └── MyComponent/
│       ├── MyComponent.tsx          # Main component
│       ├── MyComponent.test.tsx     # Tests (optional but recommended)
│       └── index.ts                 # Re-export
```

### Component Template
```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * MyComponent - Brief description
 *
 * @example
 * ```tsx
 * <MyComponent variant="primary">
 *   Content here
 * </MyComponent>
 * ```
 */
export interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Visual variant
   * @default "default"
   */
  variant?: "default" | "primary" | "secondary"

  /**
   * Component size
   * @default "md"
   */
  size?: "sm" | "md" | "lg"

  /**
   * Disabled state
   */
  disabled?: boolean
}

export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", size = "md", disabled = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center",
          "font-body text-base",
          "transition-colors duration-200",

          // Variant styles
          variant === "primary" && "bg-primary text-primary-foreground",
          variant === "secondary" && "bg-secondary text-secondary-foreground",

          // Size styles
          size === "sm" && "px-3 py-1.5 text-sm",
          size === "md" && "px-4 py-2 text-base",
          size === "lg" && "px-6 py-3 text-lg",

          // State styles
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "hover:opacity-90 cursor-pointer",

          // Custom className
          className
        )}
        aria-disabled={disabled}
        {...props}
      />
    )
  }
)

MyComponent.displayName = "MyComponent"
```

### Code Quality
- [ ] TypeScript types are properly defined
- [ ] Props have JSDoc comments
- [ ] Component uses `React.forwardRef` if ref access is needed
- [ ] Component uses `cn()` utility for className merging
- [ ] No console.log statements left in code
- [ ] No commented-out code
- [ ] Imports are organized (React, third-party, local)

---

## 🎯 Testing Checklist

### Visual Testing
- [ ] Component renders correctly in light mode
- [ ] Component renders correctly in dark mode
- [ ] Hover states work as expected
- [ ] Focus states are visible
- [ ] Active/pressed states work
- [ ] Disabled states look correct
- [ ] Loading states work (if applicable)
- [ ] Error states are clear (if applicable)

### Functional Testing
- [ ] All interactive elements work
- [ ] Props control component behavior correctly
- [ ] Default props work as expected
- [ ] Edge cases handled (empty state, long text, etc.)
- [ ] Component doesn't crash with invalid props

### Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest, if on Mac)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### Integration Testing
- [ ] Component works with other design system components
- [ ] Component works inside forms (if form element)
- [ ] Component works inside modals/dialogs
- [ ] No z-index conflicts
- [ ] No CSS specificity issues

---

## 📚 Documentation

### Required Documentation
- [ ] Component has JSDoc comment with description
- [ ] All props have JSDoc comments
- [ ] Usage example provided in JSDoc
- [ ] README.md updated (if major component)
- [ ] Storybook story added (if using Storybook)

### Demo Page
- [ ] Component demonstrated in demo app ([demo-app/app/page.tsx](demo-app/app/page.tsx))
- [ ] Shows different variants/sizes
- [ ] Shows different states (hover, focus, disabled, error)
- [ ] Works in both light and dark modes

---

## 🚀 Pre-Commit Final Checks

### Code Audit
- [ ] Run color audit: `grep -r "#[0-9a-fA-F]{6}" MyComponent.tsx` (should return nothing)
- [ ] No inline `style` attributes with colors
- [ ] All colors use CSS variables
- [ ] No accessibility warnings in console
- [ ] TypeScript compiles without errors
- [ ] ESLint passes without errors

### Performance
- [ ] No unnecessary re-renders
- [ ] Large lists use virtualization (if applicable)
- [ ] Images are optimized
- [ ] No memory leaks (check React DevTools Profiler)

### Git
- [ ] Meaningful commit message
- [ ] Only related files included in commit
- [ ] No debug code or console.logs
- [ ] `.gitignore` updated if needed

---

## 📦 Component Complexity Tiers

### Tier 1: Simple (< 1 hour)
Examples: Badge, Divider, Skeleton
- Single responsibility
- Few props
- No complex state
- Mostly presentational

**Checklist:** Basic styling, accessibility, documentation

### Tier 2: Moderate (1-4 hours)
Examples: Button, Card, Input, Select
- Multiple variants
- Some interactivity
- Simple state management
- Compound components

**Checklist:** Full checklist above

### Tier 3: Complex (4+ hours)
Examples: DataTable, Calendar, Combobox, Dialog
- Many features
- Complex state management
- Multiple sub-components
- Advanced interactions

**Checklist:** Full checklist + extra testing, comprehensive docs, peer review

---

## 🎓 Best Practices Summary

### Always
- ✅ Use CSS variables for all colors
- ✅ Support light and dark modes
- ✅ Make it keyboard accessible
- ✅ Use semantic HTML
- ✅ Write TypeScript
- ✅ Document with JSDoc
- ✅ Test on mobile

### Never
- ❌ Hardcode colors (#hex, rgb(), hsl() literals)
- ❌ Use inline styles for colors
- ❌ Skip accessibility testing
- ❌ Ignore responsive design
- ❌ Leave console.log in code
- ❌ Commit without testing

---

## 🔗 Quick Links

- [Design Tokens Reference](DESIGN_TOKENS.md)
- [Component Audit](COMPONENT_AUDIT.md)
- [Color System Architecture](COLOR_SYSTEM_ARCHITECTURE.md)
- [TypeScript Types](design-system/types/design-tokens.ts)
- [globals.css](design-system/styles/globals.css)

---

## ✅ Checklist Summary

Print this for quick reference:

```
□ Uses CSS variables only (no hardcoded colors)
□ Works in light AND dark modes
□ Keyboard accessible
□ Screen reader tested
□ Responsive (mobile, tablet, desktop)
□ TypeScript types defined
□ JSDoc documentation
□ Demo added to page.tsx
□ Tested in 3+ browsers
□ No console errors
□ Ready to commit!
```

---

**Last Updated:** October 16, 2025
**Version:** 2.0
