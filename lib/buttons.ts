/**
 * Button tiers as class strings rather than a <Button> component — the call
 * sites are a mix of <button>, <a>, next/link and motion.button, so a wrapper
 * would spend most of its code forwarding props. Compose with `cn()` to add
 * layout or size classes at the call site.
 *
 * Machined instrument controls (`rounded-md`, top specular lip, tactile shadow)
 * matching the terminal panels and anodized laptop hardware across the site:
 *
 *   btnPrimary       lit emerald hardware key. ONE per screen.
 *   btnSecondary     machined dark-surface key with specular top edge.
 *   btnAccentSubtle  emerald-tinted surface key for live project links.
 *   btnSecondarySm   compact dark-surface key for header/footer rails.
 *   btnCommand       mono, square-cornered shell-input chip.
 *   btnQuiet         inline text link inside running prose.
 */

export const btnPrimary =
  "inline-flex items-center justify-center gap-2.5 rounded-md border border-accent-bright/60 bg-gradient-to-b from-accent-bright via-accent to-[#20c978] px-6 py-3 font-mono text-sm font-semibold tracking-tight text-bg shadow-glow inset-shadow-[0_1px_0_rgba(255,255,255,0.42)] transition-[transform,filter,box-shadow] duration-250 hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:scale-[0.98]";

/** Tactile dark-surface action button with specular top lip. */
export const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-md border border-border-structural bg-surface-2/90 px-4 py-2.5 font-mono text-sm text-text shadow-lift inset-shadow-lip transition-[transform,border-color,background-color,color,box-shadow] duration-250 hover:-translate-y-0.5 hover:border-accent/70 hover:bg-surface-2 hover:text-accent active:translate-y-0 active:scale-[0.98]";

/** Emerald-tinted surface button for live deployment links. */
export const btnAccentSubtle =
  "inline-flex items-center justify-center gap-2 rounded-md border border-accent/55 bg-accent/12 px-4 py-2.5 font-mono text-sm text-accent shadow-lift inset-shadow-lip transition-[transform,border-color,background-color,color,box-shadow] duration-250 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-bg hover:shadow-glow-sm active:translate-y-0 active:scale-[0.98]";

/** Compact tactile dark-surface control for header/footer bars. */
export const btnSecondarySm =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-border-structural bg-surface-2/85 px-3.5 py-1.5 font-mono text-label uppercase text-muted shadow-lift inset-shadow-lip transition-[transform,border-color,background-color,color] duration-250 hover:-translate-y-0.5 hover:border-accent/70 hover:bg-surface-2 hover:text-accent active:translate-y-0 active:scale-[0.98] sm:min-h-0 sm:px-3";

/**
 * The command control. Square corners and mono type on purpose: this tier
 * exists so that things which behave like shell input stand distinct from
 * standalone action buttons.
 */
export const btnCommand =
  "inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2.5 font-mono text-xs text-muted transition-colors duration-200 hover:border-accent-dim hover:bg-surface hover:text-accent sm:py-1.5";

/**
 * Icon-only square control: carousel arrows, the menu toggle, the modal close.
 * 44px on touch, 36px from `sm` up.
 */
export const btnIcon =
  "inline-flex h-11 w-11 items-center justify-center rounded-md border border-border text-muted transition-colors duration-200 hover:border-border-strong hover:bg-surface hover:text-text sm:h-9 sm:w-9";

/** An inline text link. */
export const btnQuiet =
  "link-wipe font-mono text-sm text-muted transition-colors hover:text-text";
