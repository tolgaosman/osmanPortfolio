---
name: task-observer
description: >-
  Monitors multi-step agent execution for workflow friction, user corrections, repeated
  build/lint mistakes, and missing skill rules (inspired by rebelytics/one-skill-to-rule-them-all),
  logging structured observations and upgrading workspace skills/rules. Use when the user
  corrects agent behavior, asks to log/review workflow observations, or wants continuous
  skill self-improvement.
---

# Task Observer — Continuous Skill Improvement (`task-observer`)

Use this meta-skill as the feedback loop for `.agents/skills/` and `.agents/rules/`: capture friction and user corrections as structured observations so the same mistake is never repeated twice.

## Coexistence Boundary
- **`task-observer`** tracks **how the agent works** (skill gaps, prompt/trigger misfires, repeated lint/build stumbles, user style corrections).
- **`claude-mem`** tracks **project state & domain history**. Keep their logs cleanly separated.

---

## 1. What Triggers an Observation?

Capture an observation whenever any of the following occurs during a task:
1. **Explicit User Correction:** The user corrects tone, design taste, library usage, language, or workflow (*"don't do X"*, *"we use Y here"*, *"too verbose"*).
2. **Repeated Verification Failure:** A build/lint rule trips the agent (e.g., bare `//` or `$` in JSX text tripping `react/jsx-no-comment-textnodes`, synchronous `setState` in React 19 `useEffect`, Tailwind v4 config assumptions).
3. **Manual Workaround Pattern:** A multi-step sequence had to be improvised repeatedly because no existing skill or script documented the exact command path.
4. **Skill Collision / Trigger Misfire:** Two skills offered contradictory guidance or a skill failed to activate when needed.

---

## 2. Logging Format (`.agents/skill-observations/`)

Append or write concise entries under `.agents/skill-observations/<YYYY-MM-DD>-<slug>.md` (only when genuine friction occurred — never generate empty noise logs!):

```markdown
---
date: 2026-11-22
status: open # open | applied | dismissed
category: user-correction | build-trap | skill-gap | collision
target_skill: framer-motion # or CLAUDE.md / .agents/rules/taste.md
---

## Friction Observed
One-sentence factual description of what went wrong or required manual correction.

## Root Cause
Why the existing skill/rule allowed this gap.

## Proposed Skill / Rule Patch
Exact bullet or constraint to add to `target_skill` so future sessions prevent it automatically.
```

---

## 3. Synthesis & Upgrade Workflow

When the user asks *"Any observations logged?"*, *"Review open skill observations"*, or triggers a `/learn`-style retrospective:
1. Read all `status: open` files in `.agents/skill-observations/`.
2. Group repeated patterns by target file (`.agents/skills/<name>/SKILL.md`, `.agents/rules/*.md`, or `CLAUDE.md`).
3. Present a compact summary table (`Observation | Target File | Proposed Rule`) for confirmation, or apply requested upgrades directly.
4. Mark promoted entries `status: applied` so future reviews stay clean and zero-bloat.

