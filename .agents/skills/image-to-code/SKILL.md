---
name: image-to-code
description: >-
  Converts UI screenshots, Figma mockups, wireframes, or visual reference images into clean,
  semantic, responsive production code (React/Next.js + Tailwind CSS v4) via forensic visual
  decomposition. Use when the user uploads or references an image/screenshot and asks to
  reproduce, clone, or translate its UI into code.
---

# Forensic Image-to-Code Pipeline (`image-to-code`)

Use this skill whenever translating a screenshot, mockup, design frame, or reference image into production frontend code. Never code blindly from a cursory glance — run the 6-step decomposition first.

---

## Step 1: Structural & Grid Decomposition
Before writing JSX, dissect the image macro-to-micro:
1. **Viewport & Aspect Ratio:** Identify whether the reference is desktop (`1440×900`), tablet, mobile (`390×844`), or an isolated component card.
2. **Macro Layout Skeleton:** Map top-level landmarks (`<header>`, `<main>`, `<aside>`, `<section>`, `<footer>`), container max-width, outer gutter padding, and column ratios (e.g., `12-col` grid with `7/5` asymmetric split vs `flex` rail).
3. **Plane & Z-Layer Stack:** Identify background layers (grids, spotlights, watermarks), content flow planes, overlapping plates, and sticky/fixed chrome.
4. **Anti-Wrapper Discipline:** Flatten unnecessary wrapper `<div>`s. Never build `card > inner-card > bordered-box` unless visibly present in the reference.

---

## Step 2: Surface, Colour & Border Extraction
- Sample or map every visible tone into semantic tokens (`bg`, `surface`, `elevated`, `border`, `text`, `text-muted`, `accent`).
- **Workspace Token Mapping:** If building inside an existing project (`app/globals.css` `@theme`), map extracted visual roles onto the **existing project tokens** unless the user explicitly asks to adopt the screenshot's exact hex palette.
- Distinguish `1px` hairlines, subtle top-edge `inset` highlights, translucent backdrop blurs, and directional gradients (angle, stop positions, blend modes).

---

## Step 3: Typography & Optical Proportion Read
Estimate and match:
- **Font Classification:** Geometric grotesk vs neo-grotesk sans vs editorial serif vs monospace chrome.
- **Scale Ratio:** Measure headline-to-body size ratio (e.g., `64px` display vs `16px` body = `4:1`), font weights (`400` vs `500` vs `700`), uppercase tracking (`0.08em–0.16em` on mono labels), and tight display tracking (`-0.02em` to `-0.04em`).
- **Line Breaks & Measure:** Use `max-w-[..ch]` and `text-wrap: balance` rather than brittle `<br />` chains that shatter on mobile.

---

## Step 4: Assets, Icons & Real Content Fidelity
- **Exact Copy:** Transcribe every visible label, numeral, button text, and heading verbatim (plus bilingual dictionary keys when required by project rules like `data/translations.ts`).
- **Icons & Graphics:** Recreate clean geometric UI icons as crisp inline `<svg viewBox="...">` with `currentColor` stroke/fill, or pull real technology logos from existing project icon registries (`components/BrandMarks.tsx`). Never substitute random emoji for vector icons!
- **Images & Empty Plates:** Use explicit `width`/`height` and `aspect-ratio` matching the frame; route `/public` paths through `asset()` if required by the project's static-export setup.

---

## Step 5: Infer Missing Responsive & Interactive States
A static screenshot only shows `rest` at one width. You MUST engineer the missing states:
- **Responsive Collapse:** Define clean mobile/tablet stacking (`375px` → `768px` → `1280px`) without horizontal overflow.
- **Interactive States:** Add consistent `:hover`, `:active`, `:focus-visible`, and keyboard semantics (`<button>`, `<a href>`, `<input>`).

---

## Step 6: Self-Audit Against the Reference
Compare your implementation item-by-item against the uploaded image before finishing:
- Element count & ordering (nothing omitted, zero unrequested extra pills/badges invented).
- Whitespace ratios (outer padding vs inner card padding vs gap between groups).
- Contrast & alignment (baseline alignment of adjacent labels/icons, optical button centering).

