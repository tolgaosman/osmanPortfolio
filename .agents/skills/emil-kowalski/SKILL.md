---
name: emil-kowalski
description: >-
  Applies Emil Kowalski's (animations.dev) motion engineering principles: custom ease-out
  curves, spring physics, sub-300ms UI timing budgets, origin-aware micro-interactions,
  interaction frequency restraint, and 60-120fps GPU compositing. Use when designing,
  implementing, or reviewing UI animations, transitions, hover/tap states, modals, or drawers.
---

# Emil Kowalski Motion & Micro-Interaction Engineering (`emil-kowalski`)

Use this skill to craft fast, natural, physical UI motion that makes interfaces feel responsive rather than sluggish or theatrical.

## Project Alignment
- If `lib/motion.ts` (or a shared motion primitive module) exists in the workspace, **import curves, springs, and reveal variants from that module** rather than pasting raw cubic-bezier arrays inline. Check `.agents/rules/emil-kowalski.md` and `CLAUDE.md` first.

---

## 1. The Decision Gate: Should This Animate?

Before adding an animation, evaluate **Interaction Frequency**:
- **High-Frequency Actions (100+ times/day):** Keyboard shortcuts, tab switching among power tools, command-palette arrow navigation, typing feedback → Keep instant (`0ms`) or ultra-crisp (`< 120ms`). Repeated slow animations become friction.
- **Medium-Frequency Actions:** Button presses, toggles, dropdowns, modals, accordions, toast entrances → Use snappy `ease-out` or critically damped springs (`120–280ms`).
- **Low-Frequency / Orientation Moments:** Initial hero reveal, scroll-triggered section entrances (`once: true`), layout FLIP reordering → Richer choreography (`300–550ms`) is appropriate when it clarifies spatial relationships.

---

## 2. Easing Physics (Why `ease-in` & `linear` Fail UI)

1. **Never use `ease-in` on UI entrances or state changes.** `ease-in` starts near zero velocity at the exact millisecond the user clicks, making the app feel laggy.
2. **Never use `linear`** except for continuous ambient loops (marquees, spinners) or direct 1:1 scroll/pointer scrubbing.
3. **Default to strong `ease-out` curves** for entrances and user-triggered transitions (fast initial acceleration, gentle settling):
   - **Snappy UI Out:** `cubic-bezier(0.22, 1, 0.36, 1)` (quintic/expo feel)
   - **Crisp Micro Out:** `cubic-bezier(0.23, 1, 0.32, 1)`
   - **iOS Sheet / Drawer Curve:** `cubic-bezier(0.32, 0.72, 0, 1)`
   - **Symmetric Layout Move (`ease-in-out`):** `cubic-bezier(0.65, 0, 0.35, 1)` — use *only* when an element already on screen moves from point A to point B.

---

## 3. Strict Timing Budgets

| Surface | Duration / Spring | Notes |
| :--- | :--- | :--- |
| **Button / Control Press (`:active` / `whileTap`)** | `100–160ms` | Scale `0.97`–`0.98`; never shrink huge containers below `0.95` |
| **Tooltip / Popover / Context Menu** | `125–200ms` | Animate from `scale(0.95)` + `opacity: 0` (never `scale(0)`!) |
| **Dropdown / Select / Toast** | `150–240ms` | Subtle `translateY(4px–8px)` + `opacity` |
| **Modal / Sheet / Drawer** | `200–380ms` | Pair backdrop fade with sheet spring/drawer curve |
| **Stagger Delay (`staggerChildren`)** | `30–50ms` per item | Cap total group stagger under `350ms` so trailing items never lag |

---

## 4. Springs vs. Fixed Durations

- **Prefer Springs** (`stiffness: 380–450, damping: 28–35, mass: 1`) for anything interactive, draggable, or **interruptible** (toggles, tabs, hover plates, sheets). Springs preserve momentum if the user reverses direction mid-flight; CSS durations snap or restart awkwardly.
- **Avoid Bouncy Toys:** Keep springs near critically damped (`bounce: 0` to `0.15`) for professional interfaces unless playful physical overshoot is explicitly part of the brief.

---

## 5. Spatial & Rendering Mechanics

1. **Origin-Aware Scaling:** Set `transform-origin` to match the trigger point (e.g., `top right` for a menu anchored to a top-right avatar, `bottom center` for a dock tooltip).
2. **Never Animate from `scale(0)`:** Starting at `0.93–0.96` with `opacity: 0` feels natural and crisp; starting at `0` looks like a cheap pop-in.
3. **Exit Faster Than Enter:** Unmounting transitions (`AnimatePresence`) should be `~20–30%` faster and subtler than entrances so the UI never blocks the user's next click.
4. **Compositor-Only Properties (`60–120fps`):**
   - Animate **only** `transform` (`translate3d`, `scale`, `rotate`) and `opacity` (plus CSS `clip-path` when justified).
   - Never animate `width`, `height`, `padding`, `margin`, `top`, `left`, or `background-position`. Use Framer Motion `layout` (FLIP) or CSS `grid-template-rows: 0fr -> 1fr` when height transitions are unavoidable.
   - Verify zero unexpected green rectangles under Chrome DevTools **Paint Flashing**.
5. **Respect `prefers-reduced-motion`:** Replace spatial movement (`x`, `y`, `tilt`, continuous ambient loops) with calm opacity cross-fades or static states when reduced motion is requested.

