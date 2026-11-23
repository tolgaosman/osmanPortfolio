---
name: framer-motion
description: >-
  Implements declarative React 19 animations with Framer Motion v12+ (framer-motion /
  motion/react): FLIP layout transitions, shared layoutId morphs, AnimatePresence exit
  lifecycles, zero-rerender MotionValues (useScroll, useSpring, useTransform), and strict
  React 19 hook/lint compliance. Use when building or debugging Framer Motion components.
---

# Framer Motion (v12+ & React 19) Engineering (`framer-motion`)

Use this skill to implement smooth, 60–120fps declarative animations, scroll choreography, and shared-element transitions in React 19 without triggering layout thrashing or strict lint errors.

## 1. Workspace Contract & Import Hygiene
- **Match `package.json`:** Check whether the repo installs `"framer-motion"` (import from `"framer-motion"`, as in `osmanPortfolio` v12) or `"motion"` (import from `"motion/react"`). Never mix both import specifiers in the same repository.
- **Centralized Primitives First:** In `osmanPortfolio`, always import shared curves, springs, reveal variants, and pointer hooks (`useTilt`, `useLocalTilt`, `usePointerVars`) from `lib/motion.ts`, and use `components/Reveal.tsx` (`Reveal` + `RevealItem`) for scroll reveals — never hardcode raw `cubic-bezier` arrays inside feature components.

---

## 2. Core Mechanics & Anti-Bug Patterns

### A. Unmount Animations (`AnimatePresence`)
1. `AnimatePresence` MUST stay **mounted outside** the conditional branch (`{isOpen && <motion.div exit={...} />}` inside `<AnimatePresence>`, never `<AnimatePresence>` inside `{isOpen && ...}`).
2. Every direct child inside `AnimatePresence` requires a stable, unique `key`.
3. Choose the right `mode`:
   - Default (`"sync"`): Enter and exit run simultaneously (modals + backdrops).
   - `mode="wait"`: Outgoing view finishes exiting before incoming view mounts (tab content / language / step swaps).
   - `mode="popLayout"`: Exiting item is popped out of layout flow immediately so remaining `layout` siblings snap smoothly into place (lists/tags). When wrapping a custom component in `mode="popLayout"`, ensure ref forwarding works cleanly (React 19 passes `ref` as a standard prop).

### B. FLIP Layout & Shared Element Transitions (`layout` / `layoutId`)
- Use `layout` when flex/grid order or dimensions change; add `layout="position"` on text or icon children inside a resizing parent so characters do not stretch/distort during the FLIP scale transform!
- Wrap independent components sharing a `layoutId` (e.g., active nav pill or expanding card modal) in `<LayoutGroup id="...">` if multiple instances of the widget can exist on the page simultaneously.
- Set `style={{ borderRadius: ... }}` inline when morphing between two elements with different border radii so Framer Motion applies scale-corrected radii without corner warping.

### C. Zero-Rerender Scroll & Pointer Pipelines
- Bind continuous scroll/pointer motion via `MotionValue` chains (`useScroll` → `useTransform` / `useSpring` → `style={{ x, y, opacity, scale }}` or `useMotionTemplate`) — **never** subscribe to scroll events and call React `setState` on every frame!
- **React 19 + `useScroll({ target })` Invariant:** Never pass a `target` ref to `useScroll` inside a component that conditionally omits rendering that ref element on mobile/reduced-motion! Instead, split into two dedicated child components (e.g., `<PinnedTrack />` vs `<StackedList />`) and mount only the matching one from the parent.

---

## 3. React 19 Strict Lint & Hydration Guardrails
- **No Synchronous `setState` in `useEffect`:** Derive state from props/hooks or drive animations declaratively via `variants`, `animate`, or `MotionValue` subscriptions (`useMotionValueEvent`).
- **No Reading `.current` Refs During Render:** Only read/mutate refs inside event handlers, `useMotionValueEvent`, or `useEffect`.
- **Viewport Reveals:** Prefer `whileInView="visible"` with `initial="hidden"` and `viewport={{ once: true, amount: 0.2 }}` so elements reveal cleanly once without re-triggering on upward scroll.
- **Reduced Motion:** Always respect `useReducedMotion()` (alongside CSS `@media (prefers-reduced-motion: reduce)`), bypassing pinned scroll-jacking, tilt, and large translations when active.

