---
name: anti-slop
description: >-
  Eliminates AI-generated prose clichés, templated SaaS visual tropes, fake UI telemetry,
  and bloated code patterns. Use when writing or reviewing copy, UI layouts, landing pages,
  documentation, or source code to ensure authentic, sharp human-engineer craft.
---

# Anti-Slop Enforcement (`anti-slop`)

Use this skill to detect and strip "AI slop" across three surfaces: **Communication & Copy**, **Visual UI Architecture**, and **Source Code**.

## 1. Prose, Microcopy & Response Hygiene

### Banned Conversational Fluff
- Never open responses with *"Certainly!"*, *"Here is the code"*, *"I understand"*, *"Great question"*, or *"Let's break this down."*
- Never close responses with *"I hope this helps!"* or *"Let me know if you need anything else."*
- Do not narrate obvious actions or summarize trivial diffs in multi-paragraph essays.

### Banned AI Vocabulary (EN & TR)
Replace inflated LLM buzzwords with concrete, falsifiable engineering statements:
- **Banned EN:** `delve`, `tapestry`, `testament`, `seamless`, `elevate`, `unleash`, `empower`, `cutting-edge`, `game-changer`, `robust`, `crucial`, `dive in`, `crafted with precision`, `next-generation`, `harnessing the power of`, `in today's fast-paced world`.
- **Banned TR:** `kusursuz bir deneyim`, `gücünü keşfedin`, `yeni nesil çözümler`, `adeta bir sanat eseri`, `modern dünyanın vazgeçilmezi`, `sınırları zorlayan`, `bütüncül yaklaşım`.
- **Rule of Specificity:** If a headline or description could be pasted onto 50 unrelated startups without changing a noun, rewrite it with real metrics, real stack details, or concrete outcomes.

### Banned Syntactic Tell-Tales
- **Contrastive Cliché ("Not X, just Y"):** Avoid repetitive *"It's not just a portfolio — it's an experience"* constructions.
- **Rule-of-Three Adjective Stacking:** Avoid *"Fast, modern, and intuitive."* Show one concrete mechanism instead.
- **Emoji Litter:** Never sprinkle 🚀✨💡🔥 across UI headings, buttons, commit messages, or code comments unless explicitly requested.

---

## 2. Visual & UI Anti-Slop Rules

Flag and remove the unmistakable visual signatures of unguided AI generation:
1. **Uniform 3-Card Icon Grids:** Five consecutive `py-24 max-w-7xl` sections each with a centered pill badge, gradient `<h2>`, muted subtitle, and three identical rounded cards with Lucide icons in tinted squares. Vary container widths, vertical measure, and layout structure per section.
2. **Purple/Indigo-to-Pink Default Gradients:** Never reach for generic `#6366f1` → `#ec4899` text gradients or floating blurred colour blobs behind dark cards.
3. **Costume Chrome & Fake Telemetry:**
   - No fake macOS red/yellow/green window dots unless rendering an actual macOS app screenshot.
   - No fake syntax labels on normal prose (`const aboutMe =`), fake `99.99% uptime` badges, fake proficiency percentage bars (`React 95%`), or unverified count-up vanity stats.
4. **Cards Inside Cards Inside Cards:** Eliminate triple-nested bordered boxes (`border` + `bg-white/5` + `p-6` nested three levels deep). Use spacing, hairlines, and typographic hierarchy instead of boxing every group.
5. **Abstract Filler Icons:** Icons must represent concrete objects, actions, or real technology brand marks — never generic sparkles, shields, or rockets next to abstract nouns.

---

## 3. Source Code Anti-Slop Rules

- **Zero Obvious Comments:** Delete comments that restate the next line (`// Set loading state to true`, `// Map over projects`). Comment *why* a non-obvious constraint exists (e.g., browser rendering quirks, static export workarounds).
- **Hyper-Specific Naming:** Ban vague identifiers (`data`, `res`, `val`, `temp`, `item`, `info`, `handleData`, `processStuff`). Name variables after their domain payload (`showcaseProjects`, `activeSectionId`, `validationErrors`).
- **Surgical Edits Only:** Preserve surrounding formatting, imports, and architecture. Never refactor untouched functions or add speculative abstractions ("just in case we need multi-tenant plugins later").
- **Clean Artifacts:** No leftover `console.log`, commented-out dead code blocks, or unrequested `// TODO:` placeholders before finishing a task.

