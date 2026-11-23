---
name: code-review
description: >-
  Performs high-signal, confidence-scored code and diff reviews across 4 passes (CLAUDE.md
  compliance, logic/state bugs, performance/rendering, and security/types) inspired by
  Anthropic's official code-review plugin. Use when asked to review uncommitted changes,
  commits, pull requests, or specific modules while suppressing low-confidence nitpicks.
---

# High-Signal Confidence-Scored Code Review (`code-review`)

Use this skill to review diffs, commits, PRs, or files with high precision and zero noisy nitpicking.

---

## 1. Pre-Review Context Gathering
1. Inspect the exact change scope (`git status -s`, `git diff`, or `git diff main...HEAD`) and read surrounding context in modified files — never review a diff hunk in isolation without seeing enclosing component/hook contracts.
2. Load local architectural laws (`CLAUDE.md`, `.agents/rules/*.md`, `tsconfig.json`, `eslint.config.mjs`).

---

## 2. Four-Pass Inspection Matrix

Evaluate every changed file across four orthogonal lenses:

### Pass A — Project Contract & `CLAUDE.md` Compliance
- Check every repository-specific invariant (e.g., bilingual `en`/`tr` key parity, `asset()` basePath wrapping for `/public` assets, shared `lib/motion.ts` & `lib/buttons.ts` usage, raw `<script>` tags vs `next/script` in static export, bare `//` or `$` inside JSX text).

### Pass B — Logic, State, Hydration & Edge-Case Bugs
- Race conditions, stale closures, uncleaned event listeners/timers/`rAF` loops, missing `AbortController` cleanup.
- React 19 traps: synchronous `setState` inside `useEffect`, conditional hook calls, `useScroll({ target })` bound to an unmounted ref, SSR/static-export hydration mismatches (`window`/`matchMedia` read directly during initial render instead of `useSyncExternalStore`).
- Off-by-one indexing, array-index React keys on reorderable/mapped icons, unhandled `null`/`undefined` or empty arrays, popup/clipboard failure paths.

### Pass C — Performance, Layout & Bundle Impact
- Layout-thrashing animations (`width`, `height`, `top`, `left`, `background-position`), missing `width`/`height` causing CLS, unregistered pointer-driven CSS custom properties invalidating full subtrees, `overflow: hidden` flattening `preserve-3d` assemblies or breaking `position: sticky`.
- Heavy unnecessary dependencies or client boundaries (`"use client"`) pushed too high up the tree.

### Pass D — Security & Type Integrity
- `any` casts, unsafe `as unknown as T` assertions, non-exhaustive union switches, unescaped HTML/JSON-LD `<script>` payloads, `target="_blank"` missing `rel="noopener noreferrer"`, unvalidated external URLs.

---

## 3. Confidence Scoring & Noise Filter (0–100)

Assign every candidate finding an internal confidence score (`0–100`):
- **`90–100` (Confirmed Bug / Contract Violation):** Deterministic runtime bug, build/lint failure, hydration mismatch, security flaw, or explicit `CLAUDE.md` rule breach.
- **`80–89` (High-Likelihood Defect):** Concrete edge case or performance regression reachable under realistic inputs/viewports.
- **`< 80` (Suppress by Default):** Purely subjective naming bikeshedding, formatting already covered by ESLint, or hypothetical issues in unchanged legacy code.

**Hard Exclusions (False-Positive Guard):**
- Do not flag intentional file-level eslint disables that are already documented in `CLAUDE.md` (e.g., plain `<img>` in `output: "export"` static builds).
- Do not ask for tests/linters to catch issues TypeScript (`tsc`) already guarantees unless the type was bypassed.

---

## 4. Output Format

Group reported findings (`score >= 80`) by severity (**Critical**, **High**, **Medium**):

```markdown
### [Severity] Concise issue title (`Confidence: 92`)
- **Location:** [Component.tsx](file:///abs/path/Component.tsx#L42-L48)
- **Why it matters:** Concrete failure mechanism or user-facing symptom.
- **Fix:** Minimal drop-in replacement snippet.
```

If zero issues score $\ge 80$, state clearly that no high-confidence defects were found and note what verification commands were checked.

