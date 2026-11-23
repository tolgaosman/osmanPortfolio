---
name: ui-ux-pro-max
description: >-
  Provides systematic product UX architecture, domain-to-style mapping, font pairings,
  colour psychology, ergonomic touch sizing, and an 8-tier priority checklist inspired by
  nextlevelbuilder/ui-ux-pro-max-skill. Use when architecting UX flows, dashboards, forms,
  design systems for new apps, or auditing usability and ergonomics.
---

# UI/UX Pro Max — Systematic UX Intelligence (`ui-ux-pro-max`)

Use this skill to make data-backed UX, accessibility, information-architecture, and design-system decisions across web and mobile applications.

## Strict Precedence & Anti-Scope-Creep Guard
1. **Local Tokens Win:** If the workspace already defines a design system (`CLAUDE.md`, `.agents/rules/taste.md`, `DESIGN.md`, `app/globals.css`), **never** override its palette, fonts, or aesthetic bans (for example, `taste.md` explicitly bans glassmorphism — never apply a glassmorphism style preset there!).
2. **Zero Unrequested Feature Bloat:** Apply UX intelligence to make the **requested** feature clear, ergonomic, and accessible. Never invent unrequested SaaS compliance badges, fake pricing tiers, mock search bars, or extra filter toolbars.

---

## 1. The 8-Tier UX Priority Hierarchy

Resolve design trade-offs strictly in this priority order (`Tier 1` always beats `Tier 8`):

| Priority | Dimension | Non-Negotiable Standard |
| :--- | :--- | :--- |
| **1. Accessibility** | Contrast, Focus, Semantics | $\ge 4.5:1$ normal text contrast, $\ge 3:1$ interactive borders (`border-strong`), visible `:focus-visible` ring, semantic roles, never convey status by colour alone (pair with icon/label/glyph) |
| **2. Touch & Ergonomics** | Hit Targets & Spacing | $\ge 44\times44\text{px}$ tap targets on coarse pointers with $\ge 8\text{px}$ gap between adjacent destructive/primary actions; thumb-friendly mobile nav placement |
| **3. Performance & Stability** | Perceived Speed & CLS | Instant press acknowledgement (`< 100ms`), zero layout shift on async loads or validation errors, optimistic or clear pending feedback |
| **4. Layout & Resilient Copy** | Hierarchy & Overflow | Clear F/Z-pattern scan path, `45–75ch` prose measure, safe wrapping for long dynamic/localized strings (`min-w-0`, `text-wrap: balance` on headings, `pretty` on prose) |
| **5. Typography System** | Role Separation & Scale | Modular fluid type scale (`clamp()`), distinct display vs body vs mono roles, `tabular-nums` on counters/timestamps/metrics |
| **6. Colour Architecture** | Semantic Tokens | Ground → Surface → Elevated ramp, restrained primary accent (60-30-10 or 85-12-3 dark-mode ratio), semantic error/warning/success shades tuned to the palette |
| **7. Interaction Feedback** | Micro-States | Distinct `rest`, `hover`, `focus-visible`, `active`, `disabled`, `loading`, and `error` states on every interactive control |
| **8. Data & Content Clarity** | Honest Representation | Direct labels over hidden legend keys, real units, scannable empty states |

---

## 2. Greenfield Design-System Blueprint Workflow

When asked to architect a **brand-new** product or application without existing design rules:
1. **Domain & User Intent Read:** Map the domain (Developer Tooling, Fintech, Editorial, E-Commerce, Creative Portfolio, Health/Science) to appropriate trust signals, information density, and visual mood.
2. **Curated Font Pairing Selection** (always include `"latin-ext"` when Turkish support is needed):
   - *Technical / Dev / Instrument:* `Space Grotesk` + `Inter` + `JetBrains Mono`
   - *Editorial / Cultural:* `Fraunces` or `Instrument Serif` + `Plus Jakarta Sans`
   - *Precision SaaS / Linear-esque:* `Geist` or `Inter` (optical display tracking `-0.03em`) + `Geist Mono`
   - *Industrial / Bold:* `Syne` or `Cabinet Grotesk` + `DM Sans` + `IBM Plex Mono`
3. **Component Contract:** Define button hierarchy (`Primary` — max 1 per screen, `Secondary`, `Ghost/Quiet`, `Destructive`) and form validation flow (validate on blur / submit, clear inline on edit, preserve user input on failure) before generating page code.

