# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page portfolio website for **Tolga Osman, Software Engineering Student & Web/Mobile Developer**. Dark, Neo-Brutalist aesthetic with an emerald (`#10b981`) accent, monospaced display type (JetBrains Mono), and Framer Motion micro-interactions. Bilingual (EN/TR) via a client-side language switch.

## Commands

- `npm run dev` — start the dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (runs TypeScript + lint as part of `next build`)
- `npm start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · **Tailwind CSS v4** · Framer Motion. Deployed to GitHub Pages via `.github/workflows/deploy.yml`.

## Architecture Notes

- **Tailwind v4 is CSS-first.** There is no `tailwind.config.ts`. All design tokens (colors `bg`/`surface`/`border`/`accent`/`muted`, fonts, custom utilities like `.shadow-neo`, `.bg-grid`, `.animate-blink`) live in [app/globals.css](app/globals.css) under `@theme` and `@layer`. Add new tokens there, not in a JS config. A global `:focus-visible` ring and a `prefers-reduced-motion` block also live here — don't remove them when touching this file.
- **Single page composition.** [app/page.tsx](app/page.tsx) is a Server Component that stacks five sections (Hero → About → Projects → Skills → Contact) plus NavBar and Footer. Each section has an `id` used for scroll-spy navigation.
- **Component organization.** Sections live in `components/<Section>/`. Interactive pieces are Client Components (`"use client"`); presentational ones (Footer, Icons) stay server-side.
- **Content is data-driven.** Edit [data/projects.ts](data/projects.ts) and [data/skills.ts](data/skills.ts) to change projects, skills, and social links — components map over these. All UI copy lives in [data/translations.ts](data/translations.ts) (EN + TR); `types/index.ts`'s `Dict = typeof en` pattern means a missing Turkish key fails the build. Types are centralized in [types/index.ts](types/index.ts).
- **Icons** are inline SVGs in [components/Icons.tsx](components/Icons.tsx) (no icon library, except `@icons-pack/react-simple-icons` for a handful of brand marks — Fiverr in `SOCIAL_ICONS`, the stack icons in `SkillColumn`); social icons are keyed via the `SOCIAL_ICONS` map.
- **Contact form** ([components/Contact/ContactForm.tsx](components/Contact/ContactForm.tsx)) is a real `<form>` with no backend. Submitting opens a pre-filled link built from the form state: a green **WhatsApp** button (`wa.me/905338346699?text=...`) or a pastel-red **email** button (a Gmail compose URL, not a `mailto:` link). Validation is per-field (see `lib/validation.ts`'s `ContactFieldErrors`), and a blocked popup surfaces its own message.
- **Project carousels.** Optional image carousels display project screenshots. Add an `images` array to `ProjectDetails` in [data/projects.ts](data/projects.ts) with paths like `/screenshots/project-id/image1.webp`. Images are stored as WebP in `public/screenshots/` and rendered via the ProjectDetails modal. Currently used by all 5 projects (7–12 images each).
- **SEO/sharing.** `app/opengraph-image.tsx`, `app/sitemap.ts`, and `app/robots.ts` are generated at build time (each needs `export const dynamic = "force-static"` to work with `output: "export"`). `themeColor` lives in a separate `viewport` export in `app/layout.tsx`, not in `metadata` (Next 16 requirement).

## Conventions

- Use the `cn()` helper in [lib/utils.ts](lib/utils.ts) for conditional/merged class names.
- Animations must avoid layout shift — prefer `transform`/`opacity`, use `whileInView` with `viewport={{ once: true }}` for scroll reveals, and `layout` + `AnimatePresence` for the project filter reflow.
- `//` literals in JSX text must be wrapped in braces (e.g. `{`// ${year}`}`) — bare `//` triggers `react/jsx-no-comment-textnodes`.

## Design law

1. **Taste** — clean, minimalist whitespace, muted pastel or monochrome high-contrast tones (Vercel style), elegant typography. Never cheap default colors or raw CSS grids without intent.
2. **Emil Kowalski** — organic animations, micro-interactions, and state transitions on every frontend component, smooth `cubic-bezier` easing curves. Target 60 fps for all animations.
3. **Impeccable** — pixel-perfection, explicit handling of loading states, error rollbacks, empty directories, and unsafe filenames.
4. **Vercel & Anthropic UI/UX** — monochrome design language, user-focused simplicity, no visual noise.
5. **Best practices** — modular, DRY, typed, clean code. Component-driven React with clean, minimal state.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
