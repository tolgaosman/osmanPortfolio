# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Single-page portfolio for **Tolga Osman, Software Engineering Student & Web/Mobile Developer**.

**The identity is an emitting instrument, not a printed page.** A jade-on-black ground (`#0a0f0d` / `#2ee88f`), Space Grotesk for display type, JetBrains Mono carrying every label, folio numeral, meta strip, terminal line and screen, Inter for running prose. The hero is layered: a receding grid floor, deterministic code rain, the name at wall scale behind the figure, a screen-blended cursor spotlight, three CSS-3D laptops with live screens, and a marquee of the real stack. Bilingual (EN/TR) via a client-side switch.

> **This replaced a warm-editorial identity** — ochre accent, ink ground, Instrument Serif, and a rules file that explicitly banned glow, grid backdrops and terminal metadata. All of that is gone on purpose. If a rule you remember contradicts what is written here, what is written here wins; do not "restore" the old one.

## Commands

- `npm run dev` — dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (runs TypeScript + lint as part of `next build`)
- `npm start` — serve the production build
- `npm run lint` — ESLint (flat config, `eslint-config-next`). Note: `next lint` no longer exists in Next 16; the script calls `eslint` directly.

## Stack

Next.js 16 (App Router, static export) · React 19 · TypeScript · **Tailwind CSS v4** · Framer Motion. Deployed to GitHub Pages via `.github/workflows/deploy.yml`. The only icon dependency is `@icons-pack/react-simple-icons`; there is no 3D library — the laptops are CSS.

## Architecture Notes

- **Tailwind v4 is CSS-first.** There is no `tailwind.config.ts`. Every token lives in [app/globals.css](app/globals.css) under `@theme`, `@property` and `@layer`: the colour ramp, a fluid type scale (`text-wall`/`display`/`title`/`sub`/`lede`/`label`/`screen`), three font vars, elevation + glow tokens, the radius scale, and the utilities that make the page work (`.floor`, `.spot`, `.scanlines`, `.lap__*`, `.term`, `.caret`, `.link-wipe`, `.pin*`, `.plane`, `.marquee-*`, `.photo-jade`). Add tokens there, not in a JS config.
  - Measured contrast is documented above the palette. **Never apply an `/opacity` modifier to text** — `text-faint` is the third level. Four border weights: `border-faint` for 3+ repeated dividers, `border` for a single rule, `border-structural` for a slab boundary, `border-strong` (3.72:1) for anything you type in or press.
  - **Glow has a scope.** `shadow-glow`/`shadow-glow-sm` are for the primary CTA, active/focused interactive edges, the terminal caret and active timeline nodes. Nowhere else. The dark-shadow guard rails and the glow boundary are both spelled out in [.agents/rules/taste.md](.agents/rules/taste.md) and in the `@theme` comments.
  - Radius is assigned per element; `rounded-full` is the primary CTA and nothing else. Hairlines, dividers, the wall name, folio numerals and grid lines never take one.
  - A global `:focus-visible` ring and a real `prefers-reduced-motion` block live here. The reduced-motion block *removes* the ambient layers rather than speeding them up — don't reduce it to the blanket duration override.
- **Font variables are indirected on purpose.** next/font declares `--font-grotesk`, `--font-jetbrains`, `--font-inter`; `@theme` maps them to `--font-display`, `--font-mono`, `--font-sans`. **Never name a next/font variable `--font-mono`** — Tailwind v4 already owns the `--font-*` namespace, and the result is a self-referential `var()` that silently resolves to nothing. All three are loaded as **variable** fonts with no `weight` array (6 files instead of ~18), and all three need `subsets: ["latin", "latin-ext"]` for Turkish.
- **Two synchronous head scripts, and they must stay raw `<script>` tags.** `next/script strategy="beforeInteractive"` compiles to a `self.__next_s.push(...)` queue in a static export, which runs *after* the framework bundle — far too late to prevent a flash, and it kept the JSON-LD out of the exported HTML entirely. Both the language/boot script and the Person JSON-LD in [app/layout.tsx](app/layout.tsx) are plain tags now. Verify with `grep '<script type="application/ld+json">' out/index.html` after a build.
- **Single page composition.** [app/page.tsx](app/page.tsx) stacks six sections (Hero → About → Projects → Process → Skills → Contact) inside `ProjectModalProvider`, plus NavBar and Footer. Its docblock records the intended measure/ground alternation.
- **Section `id`s are a contract** with `NavBar`'s `LINK_IDS`, the scroll-spy observer and `smoothScrollTo`. Renaming one throws nothing — the active tab just stops working. `NAV_OFFSET` in NavBar is tuned to that header's height.
- **Content is data-driven.** [data/projects.ts](data/projects.ts), [data/skills.ts](data/skills.ts), [data/site.ts](data/site.ts) and [data/translations.ts](data/translations.ts). `Dict = typeof en` means **a missing Turkish key fails the build** — writing the Turkish is not optional or deferrable. Types are centralized in [types/index.ts](types/index.ts).
- **`asset()`** ([lib/utils.ts](lib/utils.ts)) prefixes the GitHub Pages basePath. Every `<img src>` and `fetch` pointing at `/public` must go through it, or it works locally and 404s in production. It does not help CSS `url()` — keep images out of CSS.
- **Images are plain `<img>`, deliberately.** `images.unoptimized` is set for the static export, so `next/image` performs no optimization and only contributes an absolutely-positioned wrapper that fights the transformed ancestors these images live inside. Each such file carries a documented file-level eslint disable; explicit `width`/`height` and `fetchPriority` are set by hand.
- **Icons** are inline SVGs in [components/Icons.tsx](components/Icons.tsx); real brand marks live in [components/BrandMarks.tsx](components/BrandMarks.tsx), **keyed by skill name, never array index**.
- **Contact form** ([components/Contact/ContactForm.tsx](components/Contact/ContactForm.tsx)) is a real `<form>` with no backend: submitting opens a pre-filled `wa.me` link or a Gmail compose URL. Per-field validation lives in [lib/validation.ts](lib/validation.ts); a blocked popup surfaces its own message.
- **Project screenshots** are WebP/PNG under `public/screenshots/`, listed in each project's `details.images`. A project with none (currently `sevgi-butik`) gets the designed empty state on its card, not a placeholder to fill. The homepage showcase is the curated `showcaseProjects` list at the bottom of [data/projects.ts](data/projects.ts) (max 5, hand-ordered); the hero laptop cycles through *every* project that has screenshots. `public/screenshots/cigdem-durut/` holds assets for a project that is not in `data/projects.ts`; it is kept on disk on purpose.
- **SEO/sharing.** `app/opengraph-image.tsx`, `app/sitemap.ts` and `app/robots.ts` each need `export const dynamic = "force-static"` to survive `output: "export"`. The OG card hardcodes the palette (Satori cannot read `@theme`) and fetches Space Grotesk as **TTF** at build time — Satori does not support WOFF2 — behind a try/catch that falls back to the system sans rather than failing the build.

## Shared primitives

- **Motion goes through one module.** [lib/motion.ts](lib/motion.ts) holds the easings, springs, the eight reveal variants, and the pointer hooks: `useTilt` (viewport-driven, for the hero laptops), `useLocalTilt` (element-driven, for project cards), `usePointerVars` (writes `--sx`/`--sy` onto `[data-spot]` consumers). [components/Reveal.tsx](components/Reveal.tsx) with `RevealItem` is the only scroll-reveal path. **Sections pass a `variant` on purpose** — don't let everything default to `rise`, and never paste a raw cubic-bezier into a component.
- **Buttons are class strings** in [lib/buttons.ts](lib/buttons.ts), four tiers: `btnPrimary` (filled pill, one per screen, the only thing that glows at rest), `btnSecondary`, `btnCommand` (mono, square, for things that behave like shell input), `btnQuiet`.
- **Scroll locking is one counter.** [lib/scroll-lock.ts](lib/scroll-lock.ts)'s `useScrollLock` is used by the boot overlay, the mobile nav and the modal. Do not write `document.body.style.overflow` directly again.
- **Breakpoint/pointer checks** go through [lib/media.ts](lib/media.ts)'s `useMediaQuery` (`useSyncExternalStore`, server snapshot `false`), so the cheap layout is what ships in the exported HTML and there is no hydration mismatch.
- **Custom cursor intent is markup.** Add `data-cursor="link" | "view" | "text"`; [components/Cursor.tsx](components/Cursor.tsx) reads it through one delegated `pointerover` listener and mutates a dataset attribute — zero React re-renders. `cursor: none` is never set globally.

## Conventions

- Use `cn()` from [lib/utils.ts](lib/utils.ts) for conditional/merged class names.
- Animations must avoid layout shift — prefer `transform`/`opacity`, `whileInView` with `viewport={{ once: true }}`, and `AnimatePresence` for enter/exit.
- **`//`, `$` and `~/` in JSX text must be wrapped in braces** (`{"// booting"}`) — a bare `//` trips `react/jsx-no-comment-textnodes`, and `next build` runs lint, so it is a build failure. This page is full of shell glyphs; expect to need it.
- React 19's lint rules are strict about two things this codebase hits constantly: **no synchronous `setState` in an effect body** (derive the value instead — see `TypingCode`, `TerminalOut`, `ScrambleText`) and **no reassigning an enclosing-scope variable from inside a render closure** (precompute at module scope).
- Anything conditional on viewport or pointer capability **mounts a different component**, it does not branch inside one. `useScroll` with a `target` ref that was never rendered logs a dev invariant, and hooks cannot be called conditionally — see `ProjectsSection`'s `PinnedTrack` / `StackedList` split.

## Design law

1. **Taste** — see [.agents/rules/taste.md](.agents/rules/taste.md). It carries the palette rationale, the glow scope, the anti-telemetry rule, and nine non-negotiable motion/3D mechanics (preserve-3d vs. overflow, translateZ vs. z-index, transform-only animation, registered custom properties, self-cancelling rAF, tilt limits, `100svh`, `overflow-x: clip`, real reduced-motion).
2. **Emil Kowalski** — organic animation and state transitions on every interactive component; smooth curves from `lib/motion.ts`; 60 fps. Verify with DevTools paint flashing: the grid, spotlight and tilt must produce **no repaint**.
3. **Impeccable** — pixel-perfection, and explicit loading, error, empty and failure states. The portrait has an `onError` fallback, the screenshot-less project has a designed empty state, the clipboard write and the popup-blocked path both fail visibly.
4. **User-focused simplicity** — nothing decorative that does not carry meaning. Every hero layer must justify itself in a sentence.
5. **Best practices** — modular, DRY, typed, clean. Minimal state; derive rather than synchronise.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
