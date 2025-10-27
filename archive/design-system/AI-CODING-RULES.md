# AI Coding Agent Instructions

## MANDATORY: Read This First

**If you are an AI coding agent (Claude, Cursor, GitHub Copilot, etc.) working on any project that uses this design system, you MUST follow these rules with 100% accuracy. No exceptions.**

---

## 🎯 Core Design Principles

### 1. Brand Colors (STRICT - Never Deviate)

**MM Primary Color:**
- Hex: `#00A1FE`
- HSL: `202 100% 50%`
- RGB: `rgb(0, 161, 254)`
- Usage: Primary actions, CTAs, active states, highlights, links, focus states
- CSS Variable: `var(--color-mm-blue)` or Tailwind `bg-primary`

**MM Secondary Color (Gray):**
- Hex: `#ababab`
- HSL: `0 0% 67%`
- RGB: `rgb(171, 171, 171)`
- Usage: Secondary text, borders, placeholders, inactive states
- CSS Variable: `var(--color-mm-gray)` or Tailwind `text-mm-gray`

**Background Colors:**
- Dark: `#1f1f1f` (var(--color-mm-dark)) - Main background
- Dark2: `#2a2a2a` (var(--color-mm-dark2)) - Elevated surfaces, cards
- Light: `#ffffff` (var(--color-mm-white))

**Text Colors:**
- Primary: `#ffffff` (white) in dark mode, `#1f1f1f` (dark) in light mode
- Secondary: `#ababab` (gray text)

**Semantic Colors:**
- Error: `#ff6b6b` (var(--color-error))
- Success: `#51cf66` (var(--color-success))
- Warning: Uses MM Primary `#00A1FE`

**Never use:**
- Generic blue colors (#007bff, #0066cc, #3b82f6, etc.)
- Bootstrap/Material UI default colors
- Any primary color that isn't #00A1FE
- Any gray that isn't #ababab for secondary elements

### 2. Typography (STRICT)

**Headings:**
- Font: National2Condensed Bold
- Usage: ALL headings (h1-h6), brand text, emphasis
- Font-weight: bold (700)
- CSS: `font-family: var(--font-heading)` or class `font-heading`

**Body Text:**
- Font: ESKlarheit Grotesk Regular
- Usage: Body text, UI components, general content
- Font-weight: normal (400)
- CSS: `font-family: var(--font-body)` or class `font-body`

**NEVER use:**
- Generic system fonts (Arial, Helvetica, sans-serif) unless as fallback
- Font weights other than bold (700) for headings
- Any font not specified above

### 3. Border Radius (CRITICAL - Signature Design Element)

**Buttons: ALWAYS 100px**
```css
border-radius: 100px; /* or var(--radius-mm) */
```

**Cards/Inputs: 0.5rem (8px)**
```css
border-radius: 0.5rem; /* or var(--radius-card) */
```

**NEVER use:**
- 0.25rem, 0.375rem, or other small radii on buttons
- Sharp corners (border-radius: 0) on buttons
- Arbitrary values - only use defined variables

### 4. Component Classes (Use These Exactly)

**Buttons:**
```tsx
// Primary button - MM Blue, 100px radius
<button className="btn-mm">Click Me</button>

// Secondary button - Outlined, 100px radius
<button className="btn-secondary">Secondary</button>
```

**Forms:**
```tsx
// Text input
<input className="input-mm" type="text" />

// Select dropdown
<select className="select-mm">...</select>
```

**Cards:**
```tsx
// Standard card
<div className="card-mm">Content</div>

// Glass effect card
<div className="glass-card">Content</div>
```

**NEVER:**
- Create custom button styles without using these classes
- Use inline styles for buttons/cards
- Override the 100px border-radius on buttons

---

## 🚨 Enforcement Rules

### Rule 1: Button Border Radius
**If generating a button component:**
```tsx
// ✅ CORRECT
<button className="btn-mm">Click</button>
<button className="rounded-[100px] px-6 py-3 bg-primary">Click</button>

// ❌ WRONG - Will be rejected
<button className="rounded-lg">Click</button>
<button className="rounded-md">Click</button>
<button style={{borderRadius: '8px'}}>Click</button>
```

### Rule 2: Primary Color Usage
**If using primary/brand color:**
```tsx
// ✅ CORRECT
<div className="bg-primary text-primary-foreground">
<div style={{backgroundColor: 'var(--color-mm-blue)'}}>
<div className="bg-[#00A1FE]">

// ❌ WRONG - Will be rejected
<div className="bg-blue-500">
<div className="bg-blue-600">
<div style={{backgroundColor: '#0066cc'}}>
```

### Rule 3: Typography
**If creating headings:**
```tsx
// ✅ CORRECT - Headings automatically use National2Condensed
<h1>Title</h1>
<h2 className="font-heading">Subtitle</h2>

// ❌ WRONG
<h1 className="font-sans">Title</h1>
<div className="font-inter">Heading Text</div>
```

### Rule 4: Theme Support
**All components MUST support both light and dark mode:**
```tsx
// ✅ CORRECT - Uses semantic color tokens
<div className="bg-background text-foreground">
<div className="bg-card text-card-foreground border-border">

// ❌ WRONG - Hardcoded colors
<div className="bg-black text-white">
<div style={{backgroundColor: '#1a1a1a', color: '#fff'}}>
```

---

## 📋 Code Generation Checklist

Before generating ANY component, verify:

- [ ] Buttons use `btn-mm` or `btn-secondary` class OR `rounded-[100px]`
- [ ] Primary color is `#00A1FE` (var(--color-mm-blue) or bg-primary)
- [ ] Headings use National2Condensed (font-heading)
- [ ] Body text uses ESKlarheit (font-body or default)
- [ ] Component supports light/dark mode via semantic tokens
- [ ] No arbitrary color values (bg-blue-500, etc.)
- [ ] No generic border-radius on buttons (no rounded-md, rounded-lg)

---

## 🎨 Common Patterns

### Button States
```tsx
// Primary button with hover/focus
<button className="btn-mm hover:opacity-90 focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Click Me
</button>

// Disabled state
<button className="btn-mm opacity-50 cursor-not-allowed" disabled>
  Disabled
</button>
```

### Form Inputs
```tsx
// Standard input
<input
  className="input-mm focus:border-primary focus:ring-1 focus:ring-primary"
  type="text"
  placeholder="Enter text"
/>

// With label
<div className="space-y-2">
  <label className="text-sm font-medium">Email</label>
  <input className="input-mm" type="email" />
</div>
```

### Cards
```tsx
// Standard card
<div className="card-mm space-y-4">
  <h3 className="font-heading text-xl">Card Title</h3>
  <p>Card content goes here.</p>
</div>

// Interactive card
<div className="card-mm hover:border-primary transition-colors cursor-pointer">
  Clickable card content
</div>
```

### Dark Mode Specific Styles
```tsx
// Conditional dark mode styling
<div className="bg-white dark:bg-mm-dark border-gray-200 dark:border-mm-gray">
  Content
</div>
```

---

## 🔧 shadcn/ui Integration

**When using shadcn/ui components:**

1. **ALWAYS** install via the CLI (components will auto-match design system):
   ```bash
   npx shadcn-ui@latest add button
   ```

2. **DO NOT** override default styles unless necessary

3. **If customizing** shadcn components, maintain:
   - 100px border-radius on buttons
   - MM Blue (#00A1FE) as primary
   - Font hierarchy (National2Condensed for labels, ESKlarheit for body)

4. **Shadcn Button Example:**
   ```tsx
   // Default shadcn button will automatically use your design system
   import { Button } from "@/components/ui/button"

   <Button>Click Me</Button> // Already has 100px radius + MM Blue
   ```

---

## 🎯 Project-Specific Component Examples

### Rating Tiles (Hotness Rating System)
```tsx
// Rating tile component
const ratingValues = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0]

<div className="grid grid-cols-6 gap-2">
  {ratingValues.map((rating) => (
    <button
      key={rating}
      className={`rating-tile ${selected === rating ? 'selected' : ''}`}
      onClick={() => setSelected(rating)}
    >
      {rating}
    </button>
  ))}
</div>
```

### Navigation Sidebar
```tsx
<nav className="w-64 bg-card border-r border-border">
  <div className="p-4 space-y-2">
    <a href="/" className="sidebar-item active">
      <Icon />
      Home
    </a>
    <a href="/about" className="sidebar-item">
      <Icon />
      About
    </a>
  </div>
</nav>
```

### Modal/Dialog
```tsx
<div className="modal-backdrop">
  <div className="modal-content">
    <div className="modal-header">
      <h2>Modal Title</h2>
      <button className="modal-close">×</button>
    </div>
    <div className="p-6">
      Modal content
    </div>
  </div>
</div>
```

---

## 🚫 Absolute Prohibitions

**NEVER do these things:**

1. ❌ Change button border-radius to anything other than 100px
2. ❌ Use any primary color other than MM Primary (#00A1FE)
3. ❌ Use any secondary gray other than MM Secondary (#ababab)
4. ❌ Import fonts other than National2Condensed and ESKlarheit
5. ❌ Hardcode dark/light mode colors (always use semantic tokens)
6. ❌ Create components without considering theme support
7. ❌ Override CSS variables without understanding their purpose
8. ❌ Use inline styles for colors (use Tailwind classes or CSS variables)
9. ❌ Ignore the existing component classes (btn-mm, card-mm, etc.)

---

## 📚 Reference Files

**Before making changes, review:**

1. [design-system/config/design-tokens.json](./config/design-tokens.json) - All design specifications
2. [design-system/config/colors.json](./config/colors.json) - Color palette
3. [design-system/styles/globals.css](./styles/globals.css) - All CSS variables and component classes
4. [design-system/tailwind.config.ts](./tailwind.config.ts) - Tailwind configuration

---

## 🤖 AI Agent Workflow

When asked to create a component:

1. **Check design-tokens.json** for spacing, colors, typography
2. **Use existing component classes** first (btn-mm, card-mm, etc.)
3. **If creating custom:** Use CSS variables or Tailwind tokens
4. **Always test** in both light and dark mode
5. **Verify** button border-radius is 100px
6. **Confirm** primary color is #00A1FE

**Example workflow:**
```
User: "Create a login form"

Agent Process:
1. Read design-tokens.json for button/input specs
2. Use btn-mm for submit button (ensures 100px radius)
3. Use input-mm for text inputs
4. Use card-mm for form container
5. Apply font-heading to form title
6. Use semantic colors (bg-background, text-foreground)
7. Generate code with proper classes
```

---

## 🎓 Quick Reference Table

| Element | Class | Radius | Color | Font |
|---------|-------|--------|-------|------|
| Primary Button | `btn-mm` | 100px | MM Primary (#00A1FE) | National2Condensed |
| Secondary Button | `btn-secondary` | 100px | MM Secondary (#ababab) + Border | National2Condensed |
| Card | `card-mm` | 0.5rem | bg-card | ESKlarheit |
| Input | `input-mm` | 0.5rem | bg-input | ESKlarheit |
| Heading | `font-heading` | N/A | text-foreground | National2Condensed |
| Body Text | default | N/A | text-foreground | ESKlarheit |

---

## ✅ Final Reminder

**This design system is production-ready and battle-tested. DO NOT:**
- Try to "improve" the design
- Suggest alternative approaches
- Use different colors "for better contrast"
- Change border-radius values "for modern look"

**The design is intentional. Follow it exactly.**

If you encounter a situation not covered here, refer to the design-tokens.json file or ask the user before deviating.

---

**Version:** 2.0
**Last Updated:** 2025-10-08
**Maintained By:** MM Design System Team
