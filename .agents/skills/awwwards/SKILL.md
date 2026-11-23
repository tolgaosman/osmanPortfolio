---
name: awwwards
description: >-
  Engineers Site-of-the-Day (SOTD) caliber creative web experiences scored against the official
  Awwwards jury rubric (Design 40%, Usability 30%, Creativity 20%, Content 10%): monumental
  typography, choreographed hero compositions, pinned scroll tracks, 60fps tactile interactions,
  and editorial rhythm. Use when building or critiquing showcase portfolios, hero experiences,
  or award-level creative frontend work.
---

# Awwwards Site-of-the-Day (SOTD) Creative Engineering (`awwwards`)

Use this skill to design, build, and evaluate showcase-caliber creative web experiences that meet Awwwards Site of the Day standards **without** sacrificing usability, 60fps performance, or accessibility.

## Project Alignment Law
- When working inside `osmanPortfolio` (or any repo with `CLAUDE.md` and `.agents/rules/taste.md`), honor its exact **emitting-instrument** identity, token ramp, CSS-3D mechanics, and anti-telemetry rules. Never inject conflicting third-party smooth-scroll libraries (like Lenis/GSAP) into a codebase that intentionally runs pure CSS + Framer Motion unless explicitly asked by the user!

---

## 1. The Official Awwwards Jury Rubric (Weighted Scoring)

Evaluate and engineer every creative build against the real 4-pillar jury weighting (`0.0–10.0` scale; SOTD target $\ge 8.2$ weighted average):

| Pillar | Weight | What Separates an `8.5+` SOTD from a `6.5` Template |
| :--- | :--- | :--- |
| **1. Design** | **40%** | Unmistakable art direction, typographic scale tension (`wall`/`display` vs crisp `11–12px` mono chrome), deliberate grid breaking/overlap, harmonic bespoke colour ramp, optical spacing precision, zero AI clichés |
| **2. Usability** | **30%** | Instant comprehension in `< 3s`, intuitive navigation & scroll-spy, zero scroll-hijacking frustration, crisp readability on mobile (`375px`), complete keyboard/focus/reduced-motion support, fast load (`CLS = 0`) |
| **3. Creativity** | **20%** | A signature interactive mechanic earned by the subject (e.g., CSS-3D live laptops, pointer-driven spotlight plane, interactive terminal shell, pinned horizontal project stage, tactile custom cursor intent) |
| **4. Content** | **10%** | Authentic voice, real verifiable artifacts/screenshots, zero Lorem Ipsum, zero fake vanity counters, sharp bilingual/editorial microcopy |

---

## 2. Signature SOTD Engineering Mechanics

1. **Hero Composition With Depth Planes (Every Layer Justifies Itself):**
   - Compose distinct depth planes (Background structural grid/rain → Wall-scale typographic anchor → Primary figure/3D object → Crisp foreground CTA & live status strip).
   - Keep hero copy punchy (1–3 lines of display type with `text-wrap: balance`); never bury the fold under a wall of centered subtitle paragraphs.
2. **Rhythm & Pacing Alternation (The Editorial Arc):**
   - Choreograph the scroll like a film edit: *Monumental Hero* → *Focused Editorial Narrative (`max-w-5xl`)* → *Pinned Horizontal Showcase (`100svh` sticky track)* → *Structured Process Timeline* → *Interactive Instrument/Matrix* → *High-Clarity Conversion Contact*.
   - Never repeat the same section layout twice in a row.
3. **Tactile Cursor & Pointer Choreography (Zero React Re-Renders):**
   - Drive custom cursor states declaratively via data attributes (`data-cursor="link" | "view" | "text"`) with a single delegated `pointerover` listener and lerped `transform: translate3d(...)` inside a self-terminating `rAF` loop.
   - Never set global `cursor: none` (preserve native cursor accessibility and touch fallback).
4. **60fps Compositor Discipline & Mobile Grace:**
   - Every continuous scroll/pointer effect touches only `transform` and `opacity` (or registered `@property` custom properties with `inherits: false`).
   - Degrade heavy desktop pointer/pinned effects intentionally on coarse-pointer (`pointer: coarse`) and `prefers-reduced-motion: reduce` devices by mounting a clean, dedicated mobile component rather than leaving broken sticky heights.

---

## 3. SOTD Self-Evaluation Deliverable
When asked to review or elevate a page to Awwwards quality:
1. Score **Design (40%)**, **Usability (30%)**, **Creativity (20%)**, and **Content (10%)** honestly out of `10.0` and compute the weighted score.
2. Identify the top 3 concrete upgrades with highest jury leverage (citing exact files/components) before implementing.

