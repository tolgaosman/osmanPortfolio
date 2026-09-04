# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page portfolio website for **Tolga Osman, Software Engineering Student & Web/Mobile Developer**. Warm-dark editorial aesthetic: an ink background (`#14120f`), an ochre accent (`#c8873f`), Instrument Serif for display type over Instrument Sans body copy, with JetBrains Mono demoted to genuine metadata only. Framer Motion micro-interactions. Bilingual (EN/TR) via a client-side language switch.

## Commands

- `npm run dev` — start the dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (runs TypeScript + lint as part of `next build`)
- `npm start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`)

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · **Tailwind CSS v4** · Framer Motion. Deployed to GitHub Pages via `.github/workflows/deploy.yml`.

## Architecture Notes

- **Tailwind v4 is CSS-first.** There is no `tailwind.config.ts`. All design tokens live in [app/globals.css](app/globals.css) under `@theme` and `@layer`: the colour ramp (`bg`/`surface`/`surface-2`/`border-faint`/`border`/`border-structural`/`border-strong`/`accent`/`text`/`muted`/`faint`/`danger`), a fluid type scale (`text-display`/`title`/`sub`/`lede`/`label`, each `clamp()`-based so headings need one class, not three breakpoint variants), the three font vars, the elevation tokens (`shadow-lift`/`plate`/`float` + `inset-shadow-lip`/`edge`/`well`), and a short list of utilities (`.grain`, `.plane-sheet`, `.plane-well`, `.photo-warm`, `.photo-vignette`, `.link-underline`). Add new tokens there, not in a JS config.
  - Measured contrast is documented in a comment above the palette; `faint` on `surface-2` is the tightest text pair at 4.53:1. **Never apply an `/opacity` modifier to text** — use `text-faint` as the third level. Four border weights, not one: `border-faint` for a run of 3+ repeated dividers, `border` for a single rule, `border-structural` for a slab boundary (About/Process/Contact/Footer's top edge), `border-strong` (3.12:1) for form inputs and other interactive edges (SC 1.4.11).
  - Elevation is the exception, not the rule — most of the page renders at level 0 (no shadow). See the assignment note above `--shadow-lift` in globals.css and the numeric guard rails in [.agents/rules/taste.md](.agents/rules/taste.md) before adding a new shadow.
  - A global `:focus-visible` ring and a `prefers-reduced-motion` block also live here — don't remove them when touching this file.
- **Single page composition.** [app/page.tsx](app/page.tsx) is a Server Component that stacks six sections (Hero → About → Projects → Process → Skills → Contact) plus NavBar and Footer. Each section has an `id` used for scroll-spy navigation.
- **Component organization.** Sections live in `components/<Section>/`. Interactive pieces are Client Components (`"use client"`); presentational ones (Footer, Icons) stay server-side.
- **Content is data-driven.** Edit [data/projects.ts](data/projects.ts) and [data/skills.ts](data/skills.ts) to change projects, skills, and social links — components map over these. All UI copy lives in [data/translations.ts](data/translations.ts) (EN + TR); `types/index.ts`'s `Dict = typeof en` pattern means a missing Turkish key fails the build. Types are centralized in [types/index.ts](types/index.ts).
- **Icons** are inline SVGs in [components/Icons.tsx](components/Icons.tsx). The only icon dependency is `@icons-pack/react-simple-icons`, used for real brand marks in `SkillsSection` and keyed **by skill name, not array index**; social icons come from the `SOCIAL_ICONS` map. `lucide-react` was removed — it only ever supplied decorative icons standing in for abstract nouns.
- **Contact form** ([components/Contact/ContactForm.tsx](components/Contact/ContactForm.tsx)) is a real `<form>` with no backend. Submitting opens a pre-filled link built from the form state: a **WhatsApp** button (`wa.me/905338346699?text=...`) or an **email** button (a Gmail compose URL, not a `mailto:` link). Validation is per-field (see `lib/validation.ts`'s `ContactFieldErrors`), and a blocked popup surfaces its own message.
- **Project carousels.** Optional image carousels display project screenshots. Add an `images` array to `ProjectDetails` in [data/projects.ts](data/projects.ts) with paths like `/screenshots/project-id/image1.webp`. Images are stored as WebP in `public/screenshots/` and rendered via the ProjectDetails modal. All 4 current projects have them (7-16 each), and the first image of each doubles as the row preview in `ProjectRow` — so a project without `images` degrades to a plain id placeholder. A project without real screenshots should not be added to `data/projects.ts` until it has some; the row has no good fallback for one.
- **SEO/sharing.** `app/opengraph-image.tsx`, `app/sitemap.ts`, and `app/robots.ts` are generated at build time (each needs `export const dynamic = "force-static"` to work with `output: "export"`). `themeColor` lives in a separate `viewport` export in `app/layout.tsx`, not in `metadata` (Next 16 requirement).

- **Section rhythm is deliberately uneven.** There is no shared section-heading component — `SectionHeading` was deleted precisely because five sections opening in an identical shape is what made the page read as generated. Each section writes its own `<h2>` and owns its own vertical measure, container width and background; [components/SectionLabel.tsx](components/SectionLabel.tsx) supplies only the small eyebrow + animated hairline. **When adding a section, give it a measure and a background that differ from its neighbours** rather than copying the one above it.
- **Motion goes through one primitive.** [lib/motion.ts](lib/motion.ts) holds the easing/spring constants and the six reveal variants; [components/Reveal.tsx](components/Reveal.tsx) (with `RevealItem`) is the only scroll-reveal path. Don't reintroduce `useInView` with hand-computed `delay: i * 0.1`, and don't paste a raw cubic-bezier into a component.

## Conventions

- Use the `cn()` helper in [lib/utils.ts](lib/utils.ts) for conditional/merged class names.
- Animations must avoid layout shift — prefer `transform`/`opacity`, use `whileInView` with `viewport={{ once: true }}` for scroll reveals, and `layout` + `AnimatePresence` for the project filter reflow.
- `//` literals in JSX text must be wrapped in braces (e.g. `{`// ${year}`}`) — bare `//` triggers `react/jsx-no-comment-textnodes`.

## Design law

1. **Taste** — warm editorial layout, elegant typography, uneven rhythm. See [.agents/rules/taste.md](.agents/rules/taste.md); note it deliberately rejects the Vercel/Linear dark-SaaS look this site used to have.
2. **Emil Kowalski** — organic animations, micro-interactions, and state transitions on every frontend component, smooth `cubic-bezier` easing curves. Target 60 fps for all animations.
3. **Impeccable** — pixel-perfection, explicit handling of loading states, error rollbacks, empty directories, and unsafe filenames.
4. **User-focused simplicity** — no visual noise, nothing decorative that does not carry meaning.
5. **Best practices** — modular, DRY, typed, clean code. Component-driven React with clean, minimal state.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
