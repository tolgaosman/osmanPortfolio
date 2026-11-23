---
name: superpowers
description: >-
  Enforces Jesse Vincent's (obra/superpowers) disciplined software engineering methodology:
  Socratic brainstorming, bite-sized implementation plans, strict RED-GREEN-REFACTOR TDD,
  4-stage systematic root-cause debugging, subagent-driven task isolation, and hard
  verification gates before completion. Use for multi-step features, complex refactors,
  or non-trivial bug fixes.
---

# Superpowers Engineering Framework (`superpowers`)

Use this skill to replace ad-hoc "vibe coding" with a deterministic, high-rigor engineering workflow across five phases.

## Coexistence & Scope
- Do not stack competing full-lifecycle frameworks simultaneously. When `superpowers` is active, it owns task decomposition, debugging discipline, and completion verification, while delegating visual aesthetics to `taste-skill`/`impeccable` and security checks to `security-guidance`.
- Scale ceremony to task size: a 2-line typo fix skips Phase 1–2 and goes straight to edit + verify; multi-file features, architectural changes, and subtle bugs run the full pipeline.

---

## Phase 1: Socratic Brainstorming (`brainstorming`)
Before writing implementation code on an ambiguous or architectural feature:
1. Inspect existing repository contracts (`CLAUDE.md`, types, shared primitives, build config) first — never ask the user questions the codebase already answers.
2. Surface hidden edge cases, trade-offs, and constraints (2–3 concise options with a clear recommendation).
3. Lock down the **Specification Contract**: inputs, outputs, state shape, failure modes, and non-goals (YAGNI — ruthlessly cut speculative extras).

---

## Phase 2: Bite-Sized Implementation Planning (`writing-plans`)
Break approved designs into atomic, independently verifiable steps:
- Each step names **exact file paths** (`create`, `modify`, `delete`), the data/type contract change, and its verification check.
- Order dependencies bottom-up: `types` → `data / pure utilities` → `state / hooks` → `UI components` → `integration & wiring`.
- Keep changes modular so the build stays green at each checkpoint.

---

## Phase 3: Test-Driven & Contract-First Implementation (`test-driven-development`)
For logic, parsers, validators, state machines, and API handlers:
1. **RED:** Write a minimal test (or type-level / build assertion) that reproduces the missing behavior or bug and watch it fail for the expected reason.
2. **GREEN:** Write the simplest clean implementation that satisfies the test without over-engineering.
3. **REFACTOR:** Eliminate duplication, sharpen types, and verify tests remain green.
*(In static UI repositories without a unit test runner configured, treat strict `tsc --noEmit`, ESLint rules, build-time type contracts like `Dict = typeof en`, and browser/Playwright checks as hard executable gates.)*

---

## Phase 4: Systematic Debugging (`systematic-debugging`)
**Iron Law: Zero shotgun patching.** Never guess at a fix or stack multiple speculative workarounds when a build, test, or UI behavior fails. Follow four strict stages:
1. **Reproduce & Read Completely:** Capture the exact error message, stack trace, or visual reproduction trigger. Read every line of the error before touching code.
2. **Trace Data & Isolate Boundary:** Trace backward from the symptom to where bad state/props/CSS entered. Check recent diffs and framework invariants (e.g., React 19 hook rules, SSR vs static export hydration, CSS stacking/3D flattening).
3. **Single Hypothesis Test:** Form one falsifiable root-cause hypothesis and change **one variable at a time** to confirm it. If 3 consecutive fix attempts fail, **STOP** — step back and question the architectural assumption rather than piling on a 4th hack.
4. **Root-Cause Fix + Guardrail:** Fix the source, revert any temporary diagnostic instrumentation, and ensure regression coverage.

---

## Phase 5: Subagent Isolation & Verification Before Completion
- **Subagent-Driven Execution (`subagent-driven-development`):** When fanning out independent tasks or heavy research, give each subagent a self-contained brief with explicit file boundaries (never let two parallel agents edit the same file) and review outputs in two passes: **(1) Spec Compliance** then **(2) Code Quality**.
- **Hard Completion Gate (`verification-before-completion`):**
  - **Never claim a task is "fixed", "passing", or "ready" from memory or inspection alone.**
  - Run the fresh verification commands (`npm run lint && npm run build`, plus test suite or browser check where applicable) **after** the very last edit and read the exit code (`0`) and output before reporting completion.

