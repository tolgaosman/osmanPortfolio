---
name: frontend-design
description: >-
  Guides intentional, distinctive frontend art direction and component architecture from
  scratch (inspired by anthropics/skills/frontend-design). Use when creating net-new pages,
  standalone web apps, interactive prototypes, or greenfield UI concepts that need a bold
  visual direction, token plan, typography pairing, and layout wireframe before coding.
---

# Intentional Frontend Design (`frontend-design`)

Use this skill to design and build memorable, production-grade web interfaces with clear aesthetic point-of-view rather than generic AI-generated templates.

## Precedence Rule (Established vs. Greenfield)
- **Inside an Existing Codebase:** If `CLAUDE.md`, `.agents/rules/taste.md`, `DESIGN.md`, or `app/globals.css` `@theme` tokens already exist, **inherit that exact identity, palette, and font stack**. Use `frontend-design` strictly for spatial composition and component craft within the existing system — never introduce a fourth typeface or rogue hex palette!
- **Greenfield / New Concept:** Run the full 3-Pass Design Protocol below before writing component code.

---

## Pass 1: Aesthetic Direction & Compact Token Plan

Never start typing JSX before committing to a concrete point of view:

1. **Choose ONE Committed Aesthetic Archetype** tailored to the subject and audience:
   - *Emitting Technical Instrument* (precision dark ground, phosphor/jade or amber functional accents, mono readouts, structural hairlines)
   - *Swiss / International Typographic Grid* (stark contrast, mathematical grid lines, monumental grotesk scale, asymmetric negative space)
   - *Editorial Print / Monograph* (high-contrast serif display + crisp sans prose, warm paper/ink ground, folio numerals, column rhythm)
   - *Industrial / Tactile Hardware* (recessed wells, lip highlights, mechanical toggles, Braun/Teenage Engineering restraint)
   - *Raw Brutalist / Poster* (exposed borders, stark monochrome + single signal colour, uncompromising kinetic type)
2. **Define the Token Blueprint:**
   - **Palette (4–6 tokens):** `ground`, `surface`, `surface-elevated`, `text-primary`, `text-muted`, `accent` — record contrast ratios ($\ge 4.5:1$ prose).
   - **Typography (2–3 families max):** Distinct Display face + Legible Prose face + Functional Monospace (never default to Inter-only or Arial/Roboto everywhere).
   - **Spatial Wireframe:** Sketch a compact ASCII layout showing section alternation, focal hierarchy, and mobile collapse order.

---

## Pass 2: Anti-Cliché Self-Critique
Before writing code, verify the plan passes every check:
- Does every section differ from its neighbour in container width, density, or ground?
- Is there **one** clear primary CTA per viewport?
- Have all AI tropes been eliminated (purple-pink SaaS gradients, 3-equal-card icon rows, floating blurred blobs, unmotivated glassmorphism)?

---

## Pass 3: Production Implementation Standards
- **CSS-First Tokens:** Define fluid typography (`clamp()`), colour ramp, spacing, and elevation tokens centrally (`@theme` in Tailwind v4 or `:root` custom properties).
- **Spatial Composition:** Use CSS Grid (named template areas, `minmax()`, subgrid), intentional asymmetry, overlapping planes, and generous uneven whitespace.
- **Micro-States & Accessibility:** Style `:hover`, `:active`, `:focus-visible`, `:disabled`, loading, and empty states explicitly; honor `prefers-reduced-motion: reduce`; support full keyboard navigation.

