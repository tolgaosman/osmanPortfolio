# Tolga Osman — Portfolio

Personal portfolio site for Tolga Osman Falay, Software Engineering student and web/mobile developer. Single-page, bilingual (EN/TR), dark neo-brutalist design.

**Live:** https://tolgaosman.github.io/osmanPortfolio/

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, static export)
- [React 19](https://react.dev/) · TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config, no `tailwind.config.ts`)
- [Framer Motion](https://www.framer.com/motion/)

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build (runs TypeScript + ESLint via next build)
npm start        # serve the production build locally
npm run lint     # ESLint only
```

## Deployment

Pushes to `main` build and deploy automatically to GitHub Pages via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). The site is a static export (`output: "export"` in `next.config.ts`) served under the `/osmanPortfolio` base path.

## Project structure

- `app/` — routes, layout, metadata, global styles
- `components/` — one folder per page section, plus shared components
- `data/` — projects, skills, and all EN/TR copy (`translations.ts`)
- `lib/` — i18n context, form validation, small utilities
- `types/` — shared TypeScript types

See [CLAUDE.md](CLAUDE.md) for detailed architecture notes and conventions.
