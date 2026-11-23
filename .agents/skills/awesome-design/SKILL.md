---
name: awesome-design
description: >-
  Extracts, authors, and applies production DESIGN.md brand design systems (inspired by
  awesome-design-md: Linear, Vercel, Stripe, Raycast, Apple, Supabase, Teenage Engineering,
  Anthropic archetypes). Use when the user asks to create or extract a DESIGN.md file,
  codify a project's design system, or model a new project after a world-class brand system.
---

# Awesome Design Systems & `DESIGN.md` Architect (`awesome-design`)

Use this skill to reverse-engineer, document, or apply cohesive, brand-caliber design systems packaged as structured `DESIGN.md` specifications.

## Coexistence Rule
- Never create or overwrite `DESIGN.md` unprompted in a repository that already uses `CLAUDE.md` + `.agents/rules/taste.md` + `app/globals.css` as its canonical design source of truth unless the user explicitly asks to export or generate `DESIGN.md`.
- When asked to apply a reference brand archetype to a *new* project or exploration, translate its structural principles (contrast ratios, spacing cadence, surface elevation, typographic tension) — never copy trademarked logos or proprietary copy.

---

## 1. Reference Brand System Archetypes

Use these verified structural signatures when the user requests a specific design language:

| Archetype | Ground & Surface | Typography & Tracking | Signature Material & Border Mechanics |
| :--- | :--- | :--- | :--- |
| **Linear / Raycast** *(Precision Dark Tooling)* | Near-black cool/neutral `#08090a` → `#111316`, subtle `1px` top-edge `rgba(255,255,255,0.08)` hairlines | `Inter` / `Geist` display at `-0.03em` tight tracking, `500–600` weight + crisp `12px` mono shortcut kbd pills | Top-lit `inset 0 1px 0` lip highlights, keyboard-first command chrome, restrained single accent |
| **Vercel / Geist** *(Stark Architectural Monochrome)* | Pure `#000000` or `#fafafa` structural grid with continuous `1px` `#1f1f1f` / `#eaeaea` hairlines | Geometric grotesk (`Geist`) + `Geist Mono` labels, tabular numerals, zero decorative shadow | Exposed structural grid lines (crosshair `+` intersections), zero card drop-shadows, high-contrast black/white CTAs |
| **Teenage Engineering / Instrument** *(Tactile Hardware Software)* | Matte dark charcoal `#0a0f0d` or anodised light grey `#e5e5e0` + single phosphor/signal accent (`#2ee88f` or `#ff4f00`) | Grotesk display + heavy reliance on functional `JetBrains Mono` / `IBM Plex Mono` readouts, indices, and terminal chrome | Recessed wells (`inset-shadow`), chamfered/tight radii (`2px–6px`), mechanical state switches, real telemetry |
| **Stripe / Editorial Fintech** *(Layered Depth & Clarity)* | Crisp light `#f6f9fc` / `#ffffff` alternating with deep slate `#0a2540` sections | High-authority grotesk headings (`-0.025em`), generous `16–18px` body prose (`1.6` leading) | Multi-layer physical ambient + key shadows, angled/overlapping interactive product diagrams |
| **Anthropic / Warm Monograph** *(Calm Literary Intelligence)* | Warm parchment `#faf9f5` / `#141413` ink, muted terracotta/clay accent | Literary serif display (`Fraunces` / `Copernicus` feel) + humanist sans prose | Zero glow, generous asymmetric margins, calm opacity fades, print-inspired editorial hierarchy |

---

## 2. Canonical 9-Section `DESIGN.md` Schema

Whenever authoring or extracting a `DESIGN.md` file, include all nine deterministic sections so any coding agent can implement pixel-accurate UI without guessing:

1. **Visual North Star (1 Paragraph):** Core metaphor (e.g., *emitting instrument* vs *printed monograph*), emotional register, and primary anti-goal.
2. **Colour Ramp & Measured Contrast Table:** Exact hex/OKLCH values for `bg`, `surface`, `elevated`, `text`, `text-muted`, `text-faint`, `border-faint/default/structural/strong`, `accent`, plus WCAG contrast ratios against ground.
3. **Typography Scale & Font Roles:** Exact font families, variable axes/subsets, fluid `clamp()` steps (`wall`, `display`, `title`, `sub`, `body`, `label`, `mono-screen`), line-heights, and letter-spacing.
4. **Spatial Rhythm & Container Alternation:** Max-widths (`5xl`, `6xl`, `92rem`), section padding cadence, grid column rules, and responsive breakpoints.
5. **Elevation, Borders & Shadow Physics:** Exact `box-shadow` / `inset-shadow` tokens, border weight rules, and explicit glow boundaries (if any).
6. **Radius Scale:** Per-component radius assignment (never blanket `rounded-2xl` everywhere).
7. **Component Anatomy:** Button tiers (`Primary`, `Secondary`, `Command`, `Quiet`), inputs, modals, cards, navigation rails.
8. **Motion Signature:** Allowed easing curves, spring constants, tilt bounds, and `prefers-reduced-motion` shutdown list.
9. **Explicit Bans ("Never Do This"):** Hard list of forbidden patterns so future edits never drift into generic AI slop.

