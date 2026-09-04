# Taste & Aesthetic Standards

> This file was rewritten when the site moved from a warm-editorial identity
> (ochre accent, ink ground, display serif, no mono) to the current one. The
> previous rules explicitly banned glow, grid backdrops and terminal metadata;
> every one of those is now load-bearing. If something here reads as the
> opposite of good taste elsewhere, that is the point — these rules describe
> *this* site. Do not "restore" the old ones.

- **Emitting instrument, not warm page.** This site reads as a piece of working software: a jade-on-black ground, a grotesk display face, and JetBrains Mono carrying every label, folio numeral, meta strip, terminal line and screen. The danger this identity has to actively avoid is not "too much SaaS" — it is **costume**. Mono is the face of things that genuinely are metadata, code or shell output. Mono on a paragraph of prose is a costume. Fake syntax highlighting on a form label (`const name =`) is a costume. The instrument reading has to be earned by things that actually behave like instruments: the boot screen, the skills shell, the contact form, the error pages, the laptop screens.

- **Vary the rhythm.** Sections must differ from their neighbours in vertical measure, container width and background. `app/page.tsx` documents the intended alternation (`bg` / `surface`, 92rem / 5xl / 6xl). Five sections on one `py-24 max-w-7xl` template under one shared heading component is the single strongest "this was generated" tell, regardless of how good the individual pieces are. There is deliberately no `<SectionHeading>`: each section writes its own `<h2>`.

- **Typography is king.** High contrast for primary text, low contrast for secondary. Body copy is *primary* text at reading size — muted body copy is a template habit that makes the thing people came to read the least legible thing on the page. Three faces, each with a job: **Space Grotesk** display, **JetBrains Mono** metadata/code/UI-chrome, **Inter** running prose. A fourth face is a bug.

- **Glow is legal, and scoped.** This is the rule that most directly reverses the old file, so it gets the tightest boundary. `--shadow-glow` / `--shadow-glow-sm` are permitted on: the filled primary CTA, an active or focused interactive edge, a lit terminal caret, an active timeline node. They are **not** permitted on body text, cards, panels, section backgrounds, images, or anything at rest that the user cannot interact with. Blur stays under 40px so it remains a rim and never becomes an orb. A page where five things glow has no primary action.

- **Depth is material.** Elevation, overlap and surface texture are encouraged; a flat page of hairlines and text reads as under-designed, not restrained. Use the named tokens (`shadow-lift` pressable, `shadow-plate` image plates and cards, `shadow-float` true overlays, `shadow-rail` the header) and the `inset-shadow-lip/edge/well` set; assign per element, not per component type — most of the page stays at level 0. Prefer overlap (the figure occluding the wall name, a folio numeral behind the text that covers it) before reaching for a new shadow. A *dark* shadow is decoration rather than material if it fails any of: `offset-x = 0`; `blur >= 2x|offset-y|`; `spread <= 0`, and `<= -0.45x blur` past 8px of blur; `blur <= 64px`; composited result darker than the surface it lands on. Glow is the single named exception, bounded above.

- **Still banned.** Glassmorphism. Faux window chrome (macOS traffic lights, fake `.app` filenames). `text-shadow`. Blurred accent orbs floating behind content — the grid, the spotlight and the code rain are structured, positioned and motivated; a soft coloured blob is none of those.

- **No fake telemetry.** No uptime percentages, proficiency bars, count-up counters, pulsing "available" dots, or vanity stats. Every number on the page must be verifiable: the boot progress counts lines that actually resolved, the terminal reports the real project count, the reading rails track real scroll position, and the build output on the hero laptop is output this project genuinely produces. A portfolio that fakes its own metrics is making a claim it cannot back, and anyone who knows the tool spots it instantly.

- **Icons stand for things, not ideas.** Real brand marks for real technologies, from `components/BrandMarks.tsx`, **keyed by skill name and never by array index** — an index-keyed map silently reassigns every logo the moment `data/skills.ts` is reordered. An icon picked to represent an abstract noun is filler.

- **No default colours.** Never pure red or pure blue. Tailored, harmonic shades only. Measure contrast and record it in the `@theme` comment. Never fix a contrast failure by adding an `/opacity` modifier to text — `text-faint` is the third level. (`/opacity` on borders, fills and decorative glyphs is fine.)

- **Generous, uneven whitespace.** Interfaces should breathe, but symmetric padding everywhere reads as a template. Let some things sit tight and others sit wide.

- **Zero visual noise.** Every layer in the hero has a job. If a new one cannot say what it is for in a sentence, it does not go in.

## Motion and 3D — the non-negotiable mechanics

These are correctness rules, not preferences. Breaking them produces bugs that
look like design problems.

1. **`transform-style: preserve-3d` on assembly nodes; `overflow: hidden` on leaf nodes. Never both on one element.** Per CSS Transforms Level 2, `overflow` other than `visible` — and `opacity < 1`, `filter`, `mask`, `clip-path`, non-normal `mix-blend-mode`, `isolation`, `contain: paint` — forces `transform-style` to `flat`. Move `overflow: hidden` up one level in a laptop and the whole assembly silently collapses into a rectangle.
2. **Inside a 3D context, order by `translateZ()`, never `z-index`.** Painting order is computed Z. Reaching for `z-index` is what produces the "keyboard draws on top of the screen" bug.
3. **Animate transform and opacity. Never `background-position`, gradient stops, or a gradient's centre.** Those are paint properties: a cursor-driven gradient repaints a viewport-sized layer sixty times a second. Move an element containing a *static* gradient instead — that is why `.spot` is built the way it is.
4. **Every pointer-driven custom property is registered with `@property … inherits: false`, and is written onto the element that consumes it.** An unregistered custom property mutation invalidates style for the whole inheriting subtree. Non-inheriting means the writer must target consumers directly (see `usePointerVars`).
5. **One rAF loop per effect, and it stops when it converges.** The pointer handler records a target into a ref; the loop lerps and performs exactly one style write per frame, then cancels itself. A permanently running rAF costs main-thread time on an idle page.
6. **Tilt stays within ±8°, screen text at 11px or larger.** Past that, mono inside a transformed layer goes soft in WebKit and Gecko, and the readability of those screens is the entire reason they exist.
7. **`100svh`, not `100vh`,** anywhere a pin or a full-height section is involved. On iOS the large viewport unit overshoots by the URL bar.
8. **`body` uses `overflow-x: clip`, not `hidden`.** `hidden` makes the element a scroll container and silently kills every `position: sticky` descendant, including the pinned projects track.
9. **Reduced motion is honoured for real.** The boot screen, code rain, scanlines, spotlight, marquee, tilt and pinned track all switch off — not merely speed up. Check the block at the end of `app/globals.css` when adding anything ambient.
