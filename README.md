# Design to Vercel

A comprehensive design system and demo application showcasing modern UI components built with Next.js, React, and Tailwind CSS.

## Project Structure

```
.
├── design-system/     # Token source, build scripts, and publishable package (mm-design-system)
├── demo-app/          # Full showcase application using every section of the design system
├── starter-app/       # Minimal production shell wired to the design system (recommended starting point)
├── canvas-images/     # Screenshot references for demo sections
├── docs/              # Living system documentation
├── archive/           # Historical plans and legacy docs (read-only)
└── package.json       # Monorepo workspace scripts (`tokens:build`, `lint:*`, etc.)
```

## Getting Started

Install all dependencies from the repository root (workspaces will bootstrap each package):

```bash
npm install --legacy-peer-deps
```

Regenerate design tokens and verify guardrails:

```bash
npm run tokens:build
npm run tokens:check
```

### Starter App (token-first shell)

```bash
npm run dev:starter
```

The starter shell imports `mm-design-system` globals, spreads the generated Tailwind theme, and enforces lint rules that forbid hard-coded colors. Use this project when kicking off a new product surface.

## Demo Application

The demo application is located in the `demo-app/` directory and showcases a complete design system with multiple tiers of components:

- **Tier 1-7**: Various UI components organized by category
- **Admin & Settings**: User preferences, notifications, privacy settings
- **Data Visualization**: Charts, graphs, and analytics components
- **Interactive Elements**: Forms, modals, dialogs, and more

### Local Development (Demo)

```bash
npm run lint:demo
npm --workspace demo-app run dev
```

The app runs on [http://localhost:3001](http://localhost:3001).

## Deployment

### Deploy to Vercel

This project deploys the `demo-app` subdirectory to Vercel.

#### Option 1: Vercel Dashboard (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import this repository: `https://github.com/s-411/design-to-vercel`
3. **Important**: Before deploying, configure the project:
   - Click "Configure Project"
   - Set **Root Directory** to `demo-app`
   - Framework Preset should auto-detect as **Next.js**
4. Click "Deploy"

That's it! Vercel will build and deploy the demo-app automatically.

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Navigate to the demo-app directory
cd demo-app

# Deploy
vercel
```

### Configuration

When deploying via the Vercel dashboard, make sure to set:
- **Root Directory**: `demo-app`
- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Theming**: next-themes

## Features

- Dark mode support with vibrant color schemes
- Responsive design (mobile-first)
- Accessible components (ARIA labels, keyboard navigation)
- Interactive demos for all components
- Comprehensive design token system

## Documentation

Start here:
- `docs/SYSTEM_OVERVIEW.md` – architecture, folder map, token workflow.
- `docs/AI_IMPLEMENTATION_GUIDE.md` – enforced rules and build playbook for agents.
- `docs/TOKEN_SOURCE_OF_TRUTH_SPEC.md` – canonical token schema and automation details.
Legacy documentation and planning notes now live under `archive/` for reference.

## License

Private project
