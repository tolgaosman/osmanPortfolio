/**
 * Button tiers as class strings rather than a <Button> component — the call
 * sites are a mix of <button>, <a>, next/link and motion.button, so a wrapper
 * would spend most of its code forwarding props. Compose with `cn()` to add
 * layout or size classes at the call site.
 *
 * There are four tiers, and the distinction between them is what the page
 * uses instead of decoration:
 *
 *   btnPrimary    the filled accent pill. ONE per screen. The only element
 *                 on the page that is allowed to glow at rest.
 *   btnSecondary  the same silhouette unfilled, for a discrete standalone
 *                 action that is not the primary one.
 *   btnCommand    the mono, square-cornered control. Reads as something you
 *                 would type rather than click: terminal suggestions, filter
 *                 chips, the language switch.
 *   btnQuiet      an inline text link inside running prose.
 *
 * btnSecondary is deliberately NOT applied to every non-primary action. An
 * action that lives inside a row of running text (a project's source/live
 * links) stays quiet; otherwise the page turns into a chip field.
 */

/**
 * The filled accent pill. `rounded-full` and `shadow-glow` are both reserved
 * for this one element — the pill silhouette plus the emission is what marks
 * "this is the primary action on this screen". If two of these are visible at
 * once, one of them is wrong.
 */
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-mono text-sm font-medium tracking-tight text-bg shadow-glow transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-accent-bright active:translate-y-0 active:scale-[0.98]";

/** Outlined pill: a real, discrete action that is not the primary one. */
export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-full border border-border-strong px-5 py-2.5 font-mono text-sm text-text transition-colors duration-300 hover:border-accent hover:text-accent";

/** Same tier, sized for sitting inside a list row rather than under a heading. */
export const btnSecondarySm =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-border-strong px-4 py-1 font-mono text-label uppercase text-faint transition-colors duration-300 hover:border-accent hover:text-accent sm:min-h-0 sm:px-3";

/**
 * The command control. Square corners and mono type on purpose: this tier
 * exists so that things which behave like shell input do not borrow the
 * primary action's pill.
 */
export const btnCommand =
  "inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2.5 font-mono text-xs text-muted transition-colors duration-200 hover:border-accent-dim hover:bg-surface hover:text-accent sm:py-1.5";

/**
 * Icon-only square control: carousel arrows, the menu toggle, the modal close.
 *
 * 44px on touch, 36px from `sm` up. An icon button has no label to widen its
 * target, so it is the one tier where the visual size and the tappable size
 * have to be argued separately — 36px is a comfortable button under a mouse
 * and a miss under a thumb.
 */
export const btnIcon =
  "inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted transition-colors duration-200 hover:border-border-strong hover:bg-surface hover:text-text sm:h-9 sm:w-9";

/** An inline text link. Most actions on the page still are one. */
export const btnQuiet =
  "link-wipe font-mono text-sm text-muted transition-colors hover:text-text";
