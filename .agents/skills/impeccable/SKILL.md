---
name: impeccable
description: >-
  Executes production-grade frontend quality, edge-case hardening, UX critique, accessibility
  auditing, and final UI polish inspired by pbakaus/impeccable. Use when asked to polish,
  critique, harden, or audit UI components, or when shipping production frontend features
  requiring zero CLS, strict TypeScript, and complete loading/empty/error states.
---

# Impeccable Frontend Engineering & Polish (`impeccable`)

Use this skill to elevate working UI components to human-craft, production-ready quality through structured UX critique, measurable technical audits, edge-case hardening, and final optical polish.

## Precedence & Project Alignment
- Always read `CLAUDE.md` and `.agents/rules/impeccable.md` (plus `.agents/rules/taste.md` if present) **before** modifying tokens, typography, or layout structure.
- Never overwrite project tokens or generate a conflicting `DESIGN.md` if the repository already defines tokens in `app/globals.css` or `CLAUDE.md`.

---

## Core Operational Modes

Select the mode matching the user's intent (or run **Harden → Audit → Polish** sequentially before shipping a feature):

### 1. `critique` — Heuristic Design Director Review
Evaluate the screen as a senior design director without touching code yet:
- **Visual Hierarchy & Focal Point:** In a 2-second squint test, is there exactly one unmistakable primary action per viewport?
- **Typography & Rhythm:** Check measure (`45–75ch` for prose), contrast hierarchy (primary copy must be high-contrast, never washed-out muted grey), and vertical cadence between sections.
- **Cognitive Load & Noise:** Flag decorative chrome, redundant badges, repeated borders (`3+` stacked dividers), or abstract filler icons that carry zero information.
- **Deliverable:** Scored UX evaluation with prioritized, concrete fixes (`file:line`).

### 2. `harden` — Edge Cases, State Integrity & Type Safety
Assume hostile network, viewport, and input conditions:
- **Complete State Matrix:** Every data-driven or interactive surface MUST explicitly design:
  1. **Loading / Pending:** Dimension-matched skeleton or inline command state (zero layout jump when resolved).
  2. **Empty State:** Intentional, styled empty state (never a blank white/black box or raw `"No data"` text).
  3. **Error & Rollback:** Image `onError` fallbacks, Error Boundaries, clipboard/popup-blocked fallbacks, and mutation rollback feedback.
  4. **Double-Submit / Race Protection:** Disable or lock triggers while async work is in flight; abort stale requests via `AbortController`.
- **Absolute Type Safety:** Strict TypeScript only. Zero `any`, zero `@ts-ignore`, exhaustive discriminated unions (`never` check), and derived state during render instead of synchronous `setState` inside `useEffect`.
- **Text Resilience:** Guard long localized strings (especially Turkish `latin-ext` vs English length shifts), long unbroken URLs/emails (`min-w-0`, `truncate` or `break-words`), and `200%` browser zoom.

### 3. `audit` — Measurable Technical Quality Report (0–4 Scale)
Score each dimension from `0` (broken) to `4` (exemplary) with `file:line` evidence:
1. **Accessibility (A11y):**
   - Contrast $\ge 4.5:1$ normal text, $\ge 3:1$ large text and interactive boundaries.
   - Semantic landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<dialog>`, `<button>` — never `<div onClick>`).
   - Icon-only buttons carry descriptive `aria-label`; decorative SVGs carry `aria-hidden="true"`.
   - Full keyboard traversal (`Tab`, `Shift+Tab`, `Escape`, `Enter`/`Space`) with visible `:focus-visible` ring and proper modal scroll/focus locking.
   - Real `@media (prefers-reduced-motion: reduce)` handling.
2. **Performance & Zero CLS:**
   - Explicit `width` and `height` (or `aspect-ratio`) on every `<img>` / media slot; `fetchPriority="high"` on LCP hero asset only.
   - Animations touch only compositor properties (`transform`, `opacity`) — zero layout thrashing (`top`, `left`, `width`, `height`).
   - Self-cancelling `requestAnimationFrame` loops; passive scroll/pointer listeners.
3. **Responsive Fidelity:**
   - Test across `320px`, `375px`, `768px`, `1024px`, `1440px`, plus coarse-pointer (`pointer: coarse`) touch targets ($\ge 44\times44\text{px}$).
   - Use `100svh` instead of `100vh` for mobile viewport stability; `overflow-x: clip` instead of `hidden` when `position: sticky` descendants exist.

### 4. `polish` & `distill` — The Final Shipping Sweep
- **Optical Alignment:** Balance icon-to-label optical centers, button padding ratios, and border radii nesting (`outer_radius = inner_radius + padding`).
- **Distill (`quieter` / `bolder`):** Strip any AI-generated tells (cliché gradient headings, unmotivated glassmorphism, side-stripe callout cards) while sharpening the project's authentic visual identity.

## Verification Gate
Run `npm run lint` and `npm run build` after hardening or polishing to verify zero TypeScript, ESLint, or static-export regressions.

