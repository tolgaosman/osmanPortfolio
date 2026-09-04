import type { Transition, Variants } from "framer-motion";

/**
 * One place for easing and spring constants. Previously `[0.22, 1, 0.36, 1]`
 * was pasted into nine files, which meant every element on the page moved
 * with exactly the same curve.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const SPRING_SNAP: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 34,
  mass: 0.9,
};

export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 190,
  damping: 26,
};

/** Shared viewport config so sections don't each invent a reveal margin. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

export type RevealVariant =
  | "rise"
  | "fade"
  | "slideL"
  | "slideR"
  | "draw"
  | "unmask";

/**
 * Six distinct entrances. Sections pick different ones on purpose — a page
 * where everything fades up by 20px reads as generated.
 *
 * Every variant animates only `transform`, `opacity` or `clipPath`, so none
 * of them trigger layout. Under `prefers-reduced-motion` Framer's
 * `<MotionConfig reducedMotion="user">` strips the transforms and leaves the
 * opacity fade, so nothing is ever stranded invisible.
 */
export function revealVariants(
  variant: RevealVariant,
  duration = 0.55,
): Variants {
  const transition = { duration, ease: EASE_OUT };

  switch (variant) {
    case "fade":
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition },
      };
    case "slideL":
      return {
        hidden: { opacity: 0, x: -24 },
        show: { opacity: 1, x: 0, transition },
      };
    case "slideR":
      return {
        hidden: { opacity: 0, x: 24 },
        show: { opacity: 1, x: 0, transition },
      };
    case "draw":
      // For hairlines: scales out from the left edge rather than fading in.
      return {
        hidden: { opacity: 1, scaleX: 0 },
        show: { opacity: 1, scaleX: 1, transition: { duration: 0.6, ease: EASE_OUT } },
      };
    case "unmask":
      // Text wipes upward from behind its own baseline.
      return {
        hidden: { opacity: 0, y: "0.35em", clipPath: "inset(0 0 100% 0)" },
        show: {
          opacity: 1,
          y: 0,
          clipPath: "inset(0 0 -10% 0)",
          transition: { duration: 0.7, ease: EASE_OUT },
        },
      };
    case "rise":
    default:
      return {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition },
      };
  }
}

/** Parent variants that only orchestrate timing for `revealVariants` children. */
export function staggerParent(stagger = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
}
