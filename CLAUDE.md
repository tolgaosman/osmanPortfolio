# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page portfolio website for **Tolga Osman, Full-Stack Engineer**. Dark, Neo-Brutalist aesthetic with an electric-blue (`#00d4ff`) accent, monospaced display type (JetBrains Mono), and Framer Motion micro-interactions.

## Commands

- `npm run dev` — start the dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (runs TypeScript + lint as part of `next build`)
- `npm start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · **Tailwind CSS v4** · Framer Motion · EmailJS.

## Architecture Notes

- **Tailwind v4 is CSS-first.** There is no `tailwind.config.ts`. All design tokens (colors `bg`/`surface`/`border`/`accent`/`muted`, fonts, custom utilities like `.shadow-neo`, `.bg-grid`, `.animate-blink`) live in [app/globals.css](app/globals.css) under `@theme` and `@layer`. Add new tokens there, not in a JS config.
- **Single page composition.** [app/page.tsx](app/page.tsx) is a Server Component that stacks the four sections (Hero → Projects → Skills → Contact) plus NavBar and Footer. Each section has an `id` used for scroll-spy navigation.
- **Component organization.** Sections live in `components/<Section>/`. Interactive pieces are Client Components (`"use client"`); presentational ones (Footer, Icons) stay server-side.
- **Content is data-driven.** Edit [data/projects.ts](data/projects.ts) and [data/skills.ts](data/skills.ts) to change projects, skills, and social links — components map over these. Types are centralized in [types/index.ts](types/index.ts).
- **Icons** are inline SVGs in [components/Icons.tsx](components/Icons.tsx) (no icon library); social icons are keyed via the `SOCIAL_ICONS` map.
- **Contact form** ([components/Contact/ContactForm.tsx](components/Contact/ContactForm.tsx)) has no backend. Its two buttons open pre-filled links built from the form state: a green **WhatsApp** button (`wa.me/905338346699?text=...`) and a pastel-red **email** button (`mailto:tofbusiness2002@gmail.com?...`). Empty fields trigger an inline validation note.

## Conventions

- Use the `cn()` helper in [lib/utils.ts](lib/utils.ts) for conditional/merged class names.
- Animations must avoid layout shift — prefer `transform`/`opacity`, use `whileInView` with `viewport={{ once: true }}` for scroll reveals, and `layout` + `AnimatePresence` for the project filter reflow.
- `//` literals in JSX text must be wrapped in braces (e.g. `{`// ${year}`}`) — bare `//` triggers `react/jsx-no-comment-textnodes`.
