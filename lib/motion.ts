"use client";

import { useEffect, useRef } from "react";
import type { Transition, Variants } from "framer-motion";
import { FINE_POINTER } from "./media";

/**
 * One place for easing and spring constants, so the page does not end up
 * moving with a single curve pasted into a dozen files.
 */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
/** Mechanical, slightly overshooting — for things that snap into a slot. */
export const EASE_SNAP = [0.34, 1.56, 0.64, 1] as const;

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

/**
 * Stiff on purpose. A soft spring driving a scroll-linked transform keeps
 * moving after the scroll has stopped, which at a pin boundary reads as the
 * track snapping backwards.
 */
export const SPRING_SCROLL: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 40,
  mass: 0.35,
  restDelta: 0.001,
};

/** Shared viewport config so sections do not each invent a reveal margin. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;

export type RevealVariant =
  | "rise"
  | "fade"
  | "slideL"
  | "slideR"
  | "draw"
  | "unmask"
  | "wipeX"
  | "scaleIn";

/**
 * Eight distinct entrances. Sections pick different ones on purpose — a page
 * where everything fades up by 14px reads as generated, which is the whole
 * reason this module exists rather than a `delay: i * 0.1` in each component.
 *
 * Every variant animates only `transform`, `opacity` or `clipPath`, so none
 * of them trigger layout. Under `prefers-reduced-motion`, Framer's
 * <MotionConfig reducedMotion="user"> strips the transforms and leaves the
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
        show: {
          opacity: 1,
          scaleX: 1,
          transition: { duration: 0.6, ease: EASE_OUT },
        },
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
    case "wipeX":
      // Content is revealed left-to-right, like a line being printed. Used
      // for terminal output and the process timeline steps.
      return {
        hidden: { opacity: 1, clipPath: "inset(0 100% 0 0)" },
        show: {
          opacity: 1,
          clipPath: "inset(0 -2% 0 0)",
          transition: { duration: 0.65, ease: EASE_OUT },
        },
      };
    case "scaleIn":
      // Objects with mass — screenshot plates, laptop assemblies.
      return {
        hidden: { opacity: 0, scale: 0.94 },
        show: {
          opacity: 1,
          scale: 1,
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

/**
 * A slow, self-looping vertical drift for scenery that should feel alive at
 * rest — the hero laptops, not anything with a job to do. Two keyframes with
 * `repeatType: "mirror"` read as floating rather than bouncing; give each
 * instance its own `duration`/`delay` so several laptops don't breathe in
 * lockstep. Transform-only, so it costs no repaint, and it is stripped
 * entirely under `prefers-reduced-motion` by the app-wide
 * `<MotionConfig reducedMotion="user">`.
 */
export function floatTransition(duration = 6, delay = 0): Transition {
  return {
    duration,
    delay,
    repeat: Infinity,
    repeatType: "mirror",
    ease: EASE_IN_OUT,
  };
}

/** Parent variants that only orchestrate timing for `revealVariants` children. */
export function staggerParent(stagger = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  };
}

/* ------------------------------------------------------------------------ *
 * Pointer-driven CSS custom properties.
 *
 * Both hooks below follow the same three rules, which are the difference
 * between 60fps and a janky page:
 *
 *   1. The pointer event only records a TARGET into a ref. Writing styles in
 *      the handler means several writes per frame on a 1000Hz mouse.
 *   2. A single rAF loop lerps toward that target and performs exactly one
 *      style write per frame.
 *   3. The loop STOPS once it has converged, and restarts on the next move.
 *      A permanently running rAF costs main-thread time even on an idle page.
 *
 * The properties they write (--rx/--ry, --sx/--sy) are registered with
 * `@property ... inherits: false` in globals.css. That is not cosmetic:
 * mutating an unregistered custom property invalidates style for the entire
 * inheriting subtree, sixty times a second.
 * ------------------------------------------------------------------------ */

const CONVERGED = 0.01;

/**
 * Tilts an element toward the pointer by writing `--rx` / `--ry`, consumed by
 * a `transform: rotateX(var(--rx)) rotateY(var(--ry))` rule.
 *
 * `max` is capped low on purpose. Past roughly 8 degrees, mono text inside a
 * 3D-transformed element goes soft in WebKit and Gecko — the layer is
 * rasterized once and then transformed — and the laptop screens have to stay
 * readable. If you want a more dramatic angle, the honest trade is to drop
 * the live text, not to raise this number.
 */
export function useTilt<T extends HTMLElement>(max = 8) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia(FINE_POINTER).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const want = { x: 0, y: 0 };
    const have = { x: 0, y: 0 };
    let raf = 0;

    const tick = () => {
      have.x += (want.x - have.x) * 0.1;
      have.y += (want.y - have.y) * 0.1;
      node.style.setProperty("--rx", `${have.x.toFixed(2)}deg`);
      node.style.setProperty("--ry", `${have.y.toFixed(2)}deg`);
      raf =
        Math.abs(want.x - have.x) > CONVERGED ||
        Math.abs(want.y - have.y) > CONVERGED
          ? requestAnimationFrame(tick)
          : 0;
    };

    const onMove = (e: PointerEvent) => {
      want.y = (e.clientX / window.innerWidth - 0.5) * 2 * max;
      want.x = -(e.clientY / window.innerHeight - 0.5) * 2 * max;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [max]);

  return ref;
}

/**
 * Per-element tilt, driven by where the pointer is INSIDE this element rather
 * than where it is on the screen.
 *
 * `useTilt` above is viewport-driven, which is correct for the hero laptops —
 * they are scenery, and they should all lean the same way as the light moves
 * across the page. It is wrong for a row of project cards, where every card
 * would lean identically whether or not you were pointing at it. Here the
 * angle is zero unless the pointer is over this card, and the listener only
 * exists between pointerenter and pointerleave.
 */
export function useLocalTilt<T extends HTMLElement>(max = 6) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia(FINE_POINTER).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const want = { x: 0, y: 0 };
    const have = { x: 0, y: 0 };
    let raf = 0;

    const tick = () => {
      have.x += (want.x - have.x) * 0.14;
      have.y += (want.y - have.y) * 0.14;
      node.style.setProperty("--rx", `${have.x.toFixed(2)}deg`);
      node.style.setProperty("--ry", `${have.y.toFixed(2)}deg`);
      raf =
        Math.abs(want.x - have.x) > CONVERGED ||
        Math.abs(want.y - have.y) > CONVERGED
          ? requestAnimationFrame(tick)
          : 0;
    };

    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      want.y = ((e.clientX - rect.left) / rect.width - 0.5) * 2 * max;
      want.x = -((e.clientY - rect.top) / rect.height - 0.5) * 2 * max;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => {
      want.x = 0;
      want.y = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    node.addEventListener("pointermove", onMove, { passive: true });
    node.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      node.removeEventListener("pointermove", onMove);
      node.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [max]);

  return ref;
}

/**
 * Writes the pointer position, in pixels relative to the container, as
 * `--sx` / `--sy` on every `[data-spot]` element inside it. The spotlight and
 * the counter-translating lens read those and move by transform alone, so the
 * cursor light costs zero repaint.
 *
 * The values are written onto each CONSUMER rather than onto the container,
 * because `--sx`/`--sy` are registered `inherits: false` in globals.css — a
 * descendant would read the initial value, not the container's. That is the
 * right trade: non-inheriting means the per-frame style invalidation stops at
 * the two elements that actually use the value, instead of touching the whole
 * hero subtree sixty times a second.
 *
 * Coordinates are container-relative rather than viewport-relative because
 * the spotlight is absolutely positioned inside the hero; clientX/clientY
 * would offset the light by the hero's own position as soon as the page
 * scrolls.
 */
export function usePointerVars<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!window.matchMedia(FINE_POINTER).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Consumers are rendered synchronously with the container, so one query
    // at mount is enough; nothing adds a [data-spot] element later.
    const targets = Array.from(
      node.querySelectorAll<HTMLElement>("[data-spot]"),
    );
    if (targets.length === 0) return;

    const want = { x: 0, y: 0 };
    const have = { x: 0, y: 0 };
    let raf = 0;
    let primed = false;

    const tick = () => {
      have.x += (want.x - have.x) * 0.18;
      have.y += (want.y - have.y) * 0.18;
      const sx = `${have.x.toFixed(1)}px`;
      const sy = `${have.y.toFixed(1)}px`;
      for (const target of targets) {
        target.style.setProperty("--sx", sx);
        target.style.setProperty("--sy", sy);
      }
      raf =
        Math.abs(want.x - have.x) > 0.5 || Math.abs(want.y - have.y) > 0.5
          ? requestAnimationFrame(tick)
          : 0;
    };

    const onMove = (e: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      want.x = e.clientX - rect.left;
      want.y = e.clientY - rect.top;
      // First sighting: jump rather than sweep in from the corner.
      if (!primed) {
        primed = true;
        have.x = want.x;
        have.y = want.y;
      }
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return ref;
}
