---
name: taste-skill
description: >-
  Calibrates frontend art direction, spatial rhythm, typography hierarchy, material depth,
  and 3D/motion mechanics using quantitative control dials (Variance, Motion, Density) from
  Leonxlnx/taste-skill paired with project-specific taste laws. Use when directing aesthetic
  vision, designing layouts, tuning shadows/glows, or enforcing visual restraint.
---

# Design Taste & Aesthetic Calibration (`taste-skill`)

Use this skill to govern visual judgment, spatial rhythm, typography, material elevation, and rendering correctness so interfaces read as intentional software rather than templates.

## Priority 0 — Project-Local Taste Law Wins
1. Check `.agents/rules/taste.md` and `CLAUDE.md` **first**.
2. In this repository (`osmanPortfolio`), `.agents/rules/taste.md` defines the exact **emitting-instrument** identity (`#0a0f0d` ground, `#2ee88f` jade, Space Grotesk + JetBrains Mono + Inter, scoped glow, real telemetry, 9 non-negotiable 3D/motion mechanics). Those project rules override every default dial below.
3. Use the calibration dials below whenever creating new sections, exploring variations requested by the user, or working on projects without an existing `taste.md`.

---

## Section 0: The Design Read (3 Control Dials, Scale 1–10)

Before writing UI markup, establish (or honor user-specified) values for three orthogonal dials:

| Dial | Low (`1–3`) | Mid (`4–7`) | High (`8–10`) |
| :--- | :--- | :--- | :--- |
| **`DESIGN_VARIANCE`** *(Structural asymmetry & layout variety)* | Strict symmetrical grids, documentation clarity, predictable enterprise alignment | Alternating container widths (`5xl` / `6xl` / `92rem`), intentional overlap, asymmetric 60/40 splits | Editorial/studio art direction, wall-scale typography behind foreground planes, bold spatial tension |
| **`MOTION_INTENSITY`** *(Choreography & kinetic presence)* | Quiet, near-static utility UI; instant state changes + subtle hover states | Snappy spring/cubic-bezier reveals, tactile press feedback, layout FLIP transitions | Scroll-pinned tracks, pointer-driven 3D tilt, live terminal/instrument layers (60fps compositor-only) |
| **`VISUAL_DENSITY`** *(Information packing & whitespace)* | Gallery-scale breathing room, monumental display type, sparse focal points | Balanced editorial rhythm with uneven, purposeful whitespace | Cockpit/instrument density, mono metadata strips, compact tabular readouts |

*(Default high-craft baseline when unspecified: `DESIGN_VARIANCE: 7`, `MOTION_INTENSITY: 6`, `VISUAL_DENSITY: 4`.)*

---

## Non-Negotiable Taste Principles

1. **Earn Your Aesthetic (No Costume):**
   - Monospace belongs exclusively on genuine metadata, folio numerals, timestamps, shell commands, code, and interactive chrome — never on multi-sentence prose paragraphs or fake `const title =` labels.
2. **Break Template Cadence:**
   - Neighbouring sections must alternate ground (`bg` vs `surface`), container measure, and heading composition. Avoid a single rubber-stamped `<SectionHeading>` across every section.
3. **Typography Carries 80% of the Design:**
   - Assign strict roles (max 3 font families: Display, Sans Prose, Mono Chrome).
   - Keep body prose high-contrast and legible; reserve muted/faint tokens strictly for tertiary metadata, captions, and hairlines. Never slap `/opacity` modifiers onto text tokens to improvise new greys.
4. **Scoped Glow & Material Shadows:**
   - A page where five elements glow has no primary CTA. Restrict glow strictly to the single primary CTA, active/focused interactive edges, active timeline nodes, and live carets (`blur < 40px`).
   - Dark shadows must behave like physical light (`offset-x = 0`, `blur >= 2 * |offset-y|`, negative spread past `8px` blur). Prefer plane overlap and hairline lip highlights (`inset-shadow`) over heavy drop shadows.
5. **Hard Bans:**
   - Unmotivated glassmorphism, floating blurred neon orbs, `text-shadow`, pure `#ff0000` / `#0000ff` defaults, and fake vanity telemetry.

---

## 3D & Compositor Correctness Checklist
Whenever building layered, sticky, or 3D-transformed surfaces:
- Separate `transform-style: preserve-3d` (assembly parent) from `overflow: hidden` / `opacity < 1` / `filter` / `clip-path` (leaf node) — combining them flattens the 3D context per CSS Transforms Level 2.
- Order children inside a 3D context with `translateZ()`, never `z-index`.
- Register pointer-driven CSS variables via `@property` with `inherits: false` and write directly onto consuming nodes inside a self-cancelling `requestAnimationFrame` loop.
- Keep 3D card/screen tilt within `±8°` so monospace text stays crisp across WebKit/Blink/Gecko.
- Use `overflow-x: clip` on `body` (never `hidden`, which breaks `position: sticky` tracks) and `100svh` (never `100vh`).

