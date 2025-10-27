# Quick Setup Guide

Follow these steps **exactly** when starting a new project:

## Step 1: Copy the Design System

```bash
# In your new project root
cp -r /path/to/this/design-system ./
```

## Step 2: Install Dependencies

```bash
npm install @tailwindcss/postcss@^4.1.0 tailwindcss@^4.1.0 postcss@^8.4.41 tailwindcss-animate next-themes clsx tailwind-merge lucide-react
```

## Step 3: Copy Config Files to Project Root

```bash
cp design-system/tailwind.config.ts ./
cp design-system/postcss.config.mjs ./
cp design-system/components.json ./
```

## Step 4: Copy Fonts

```bash
mkdir -p public/fonts
cp design-system/fonts/* public/fonts/
```

## Step 5: Update Root Layout

```tsx
// app/layout.tsx
import './design-system/styles/globals.css'
import { ThemeProvider } from './design-system/lib/theme-provider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

## Step 6: Test It Works

Create a test page:

```tsx
// app/page.tsx
import { ThemeToggle } from './design-system/lib/theme-toggle'

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1>Design System Test</h1>
          <ThemeToggle />
        </div>

        <button className="btn-mm">Primary Button</button>
        <button className="btn-secondary">Secondary Button</button>

        <input className="input-mm" placeholder="Test input" />

        <div className="card-mm">
          <h3>Card Component</h3>
          <p>This is a test card using your design system.</p>
        </div>
      </div>
    </div>
  )
}
```

Run `npm run dev` and verify:
- ✅ Fonts load correctly
- ✅ Dark mode is default
- ✅ Theme toggle works
- ✅ Buttons have 100px border radius
- ✅ Your MM color shows up

## Step 7: Using Lucide Icons

The design system includes Lucide React for icons. They automatically adapt to light/dark mode.

```tsx
// Import icons you need
import { Home, User, Settings, Mail, Bell } from 'lucide-react'

// Use in your components
<Home className="w-6 h-6" />
<Mail className="w-5 h-5 text-primary" />
<Bell className="w-4 h-4 text-muted-foreground" />

// Icons automatically inherit text color
<button className="btn-mm flex items-center gap-2">
  <User className="w-5 h-5" />
  Profile
</button>
```

**Common icon sizes:**
- `w-4 h-4` - Small (16px) - for inline text
- `w-5 h-5` - Medium (20px) - for buttons
- `w-6 h-6` - Large (24px) - for headings/features

Browse all icons at [lucide.dev](https://lucide.dev)

## Done!

Now you can:
- Use your custom classes (`.btn-mm`, `.card-mm`, etc.)
- Install shadcn components: `npx shadcn-ui@latest add button`
- Use Lucide icons for consistent iconography
- Build your app with consistent styling
