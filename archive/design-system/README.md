# MM Design System v2.0

**A production-ready, reusable design system** for React/Next.js applications with full Tailwind CSS 4, shadcn/ui compatibility, and light/dark mode support.

## 🎯 What This Is

This is a **portable design system folder** that you can drop into any Next.js project and get:
- ✅ Your exact brand colors and typography (National2Condensed + ESKlarheit)
- ✅ Signature 100px border-radius buttons
- ✅ Full light/dark mode support
- ✅ shadcn/ui compatibility (all components will match your design)
- ✅ Consistent styling across all projects

## 🚀 Quick Start

### 1. Copy the Folder

Copy the entire `design-system` folder to your Next.js project root:

```bash
cp -r design-system /path/to/your/new/project/
```

Your project structure will look like:
```
your-project/
├── app/
├── components/
├── design-system/        ← The folder you just copied
│   ├── styles/
│   ├── fonts/
│   ├── lib/
│   ├── config/
│   └── ...
├── package.json
└── ...
```

### 2. Install Dependencies

Add these to your project:

```bash
npm install @tailwindcss/postcss@^4.1.0 tailwindcss@^4.1.0 postcss@^8.4.41 tailwindcss-animate next-themes clsx tailwind-merge lucide-react
```

### 3. Copy Configuration Files

Copy the config files to your project root:

```bash
# Copy Tailwind config
cp design-system/tailwind.config.ts ./

# Copy PostCSS config
cp design-system/postcss.config.mjs ./

# Copy components.json for shadcn/ui
cp design-system/components.json ./
```

### 4. Copy Font Files

```bash
mkdir -p public/fonts
cp design-system/fonts/* public/fonts/
```

### 5. Update Your Root Layout

Import the CSS and add the theme provider:

```tsx
// app/layout.tsx
import './design-system/styles/globals.css'
import { ThemeProvider } from './design-system/lib/theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"  {/* Your original design was dark */}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 6. Add a Theme Toggle (Optional)

```tsx
import { ThemeToggle } from './design-system/lib/theme-toggle'

export function Header() {
  return (
    <header className="p-4 border-b">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-heading">My App</h1>
        <ThemeToggle />
      </div>
    </header>
  )
}
```

## 🎨 Using Your Design System

### Using Your Custom Components

```tsx
// Your signature button with 100px border radius
<button className="btn-mm">
  Click Me
</button>

// Secondary button
<button className="btn-secondary">
  Secondary Action
</button>

// Form input
<input
  type="text"
  className="input-mm"
  placeholder="Enter text"
/>

// Card
<div className="card-mm">
  Your content here
</div>

// Glass card effect
<div className="glass-card">
  Glassy content
</div>

// Rating tiles (your hotness rating system)
<div className="grid grid-cols-6 gap-2">
  {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5].map((rating) => (
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

### Using with shadcn/ui

Install shadcn/ui components and they'll automatically use your design:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
```

All shadcn components will:
- Use your MM Blue (#00A1FE) as the primary color
- Respect light/dark mode
- Match your overall aesthetic

### Color System

**Your brand colors are available as:**

```tsx
// CSS classes (legacy, still works)
className="bg-mm-blue text-mm-dark"
className="bg-mm-dark text-mm-white"
className="border-mm-gray"

// Tailwind/shadcn classes (recommended, works in both light/dark)
className="bg-primary text-primary-foreground"  // MM Blue
className="bg-background text-foreground"        // Dark/Light adaptive
className="bg-card text-card-foreground"        // Card backgrounds
className="border-border"                       // Borders
```

### Typography

Your fonts are auto-applied:

```tsx
// Headings automatically use National2Condensed
<h1>Heading Text</h1>

// Body text automatically uses ESKlarheit
<p>Body text content</p>

// Or force with classes
<div className="font-heading">Brand Text</div>
<div className="font-body">Body Text</div>
```

## 🌓 Light/Dark Mode

The system defaults to dark mode (your original design) but fully supports light mode.

### Toggle Theme Programmatically

```tsx
'use client'

import { useTheme } from 'next-themes'

export function CustomToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </button>
  )
}
```

### Detect Current Theme

```tsx
'use client'

import { useTheme } from 'next-themes'

export function ThemeAwareComponent() {
  const { theme } = useTheme()

  return <div>Current theme: {theme}</div>
}
```

## 🎯 How to Change Your Primary Color

Your primary color is MM Blue (`#00A1FE`). To change it in all new projects:

**Edit:** `design-system/styles/globals.css`

Find this section:

```css
:root {
  --primary: 202 100% 50%;  /* MM Blue #00A1FE */
  /* ... */
}

.dark {
  --primary: 202 100% 50%;  /* MM Blue #00A1FE */
  /* ... */
}
```

Replace `202 100% 50%` with your new color in HSL format:
- Red: `0 100% 50%`
- Green: `120 100% 50%`
- Purple: `270 100% 50%`
- Orange: `30 100% 50%`

**Tip:** Convert hex to HSL at [hslpicker.com](https://hslpicker.com)

## 📁 Folder Structure

```
design-system/
├── styles/
│   └── globals.css              # Main CSS file with all styles
├── fonts/
│   ├── National-2-Condensed-Bold.ttf
│   └── ESKlarheitGrotesk-Rg.otf
├── lib/
│   ├── utils.ts                 # cn() utility for shadcn
│   ├── theme-provider.tsx       # Theme context provider
│   └── theme-toggle.tsx         # Pre-built toggle component
├── config/
│   ├── colors.json              # Color palette reference
│   └── design-tokens.json       # Design token specs
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind configuration
├── postcss.config.mjs           # PostCSS configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🔧 Advanced Usage

### Custom Component Classes

The design system provides these reusable classes:

**Buttons:**
- `.btn-mm` - Primary button (100px radius, blue)
- `.btn-secondary` - Secondary outlined button

**Forms:**
- `.input-mm` - Text input
- `.select-mm` - Select dropdown

**Cards:**
- `.card-mm` - Standard card
- `.glass-card` - Glass morphism card

**Navigation:**
- `.sidebar-item` - Sidebar navigation item
- `.sidebar-item.active` - Active state
- `.mobile-nav-item` - Mobile bottom nav item

**Tables:**
- `.table-mm` - Styled table

**Modals:**
- `.modal-backdrop` - Modal backdrop
- `.modal-content` - Modal content
- `.modal-header` - Modal header
- `.modal-close` - Close button

**Rating:**
- `.rating-tile` - Rating button
- `.rating-tile.selected` - Selected state

**Utilities:**
- `.text-error` - Error message text
- `.text-success` - Success message text
- `.divider` - Horizontal divider
- `.skeleton` - Loading skeleton

### Using with Other Frameworks

While designed for Next.js, you can adapt this for:
- **Vite + React:** Copy `globals.css`, fonts, and Tailwind config
- **Remix:** Similar to Next.js setup
- **Astro:** Import CSS in your layout

## 🚨 Common Issues

### Fonts not loading
- Make sure fonts are in `public/fonts/`
- Check the font paths in `globals.css` match your setup

### Dark mode not working
- Ensure `suppressHydrationWarning` is on `<html>` tag
- Verify `ThemeProvider` wraps your app
- Check `attribute="class"` is set in ThemeProvider

### shadcn components look wrong
- Make sure you copied `components.json`
- Verify `tailwind.config.ts` is in your root
- Check the CSS import path in your layout

### Colors not applying
- Ensure `globals.css` is imported in your root layout
- Check Tailwind content paths include your files
- Verify PostCSS config is copied

## 📊 What's Different from v1

- ✅ Full light/dark mode support
- ✅ shadcn/ui compatibility
- ✅ Tailwind CSS 4.0
- ✅ Better organized structure
- ✅ Theme provider included
- ✅ Pre-built theme toggle
- ✅ HSL color system (more flexible)
- ✅ All your original styles preserved

## 🎓 Best Practices

1. **Don't modify the design-system folder** in individual projects. Update the master copy and re-copy it.

2. **Change primary color once** in the master design-system folder, then reuse everywhere.

3. **Use shadcn components** when possible - they'll match your design automatically.

4. **Use the custom classes** (`.btn-mm`, `.card-mm`, etc.) for your unique patterns.

5. **Keep fonts in public/fonts/** so they work in production builds.

## 📝 Customization Checklist

When starting a new project:

- [ ] Copy `design-system` folder
- [ ] Install dependencies
- [ ] Copy config files (tailwind.config.ts, postcss.config.mjs, components.json)
- [ ] Copy fonts to `public/fonts/`
- [ ] Import CSS in root layout
- [ ] Add ThemeProvider
- [ ] Test light/dark mode works
- [ ] (Optional) Adjust primary color if needed

---

**That's it!** Your design system is ready to use. Every project will look exactly the same, and you can toggle between light/dark mode with a single button click.

For questions or issues, refer to the original design tokens in the `config/` folder.
