"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { createContext, useContext, type ElementType, type ReactNode } from "react";
import {
  revealVariants,
  staggerParent,
  VIEWPORT,
  type RevealVariant,
} from "@/lib/motion";

/**
 * A staggering parent can't animate itself (see below), so its own `variant`
 * would otherwise be silently discarded — a section that asked for `slideL`
 * and got the default `rise` with no error. This hands the parent's choice
 * down to its items instead, so `variant` means the same thing on `Reveal`
 * whether or not `stagger` is set.
 */
const RevealVariantContext = createContext<RevealVariant>("rise");

interface RevealProps extends Omit<HTMLMotionProps<"div">, "variants" | "children"> {
  children: ReactNode;
  /** Which entrance to use. Sections deliberately differ. */
  variant?: RevealVariant;
  /** Seconds before this element starts. */
  delay?: number;
  /** When set, children rendered as <Reveal.Item> are staggered by this much. */
  stagger?: number;
  duration?: number;
  as?: ElementType;
}

/**
 * The single scroll-reveal primitive. Replaces three competing patterns that
 * coexisted in this codebase: `variants` + `whileInView`, `useInView` with
 * hand-computed `delay: i * 0.1`, and bare `whileInView` on one element.
 *
 * Use `stagger` with `RevealItem` children to sequence a list; use it alone
 * for a single element.
 */
export default function Reveal({
  children,
  variant = "rise",
  delay = 0,
  stagger,
  duration,
  as = "div",
  ...rest
}: RevealProps) {
  const MotionTag = motion[as as "div"] ?? motion.div;

  // A staggering parent must not animate itself, or its children inherit the
  // parent's transform and the sequence collapses into one movement.
  const variants =
    stagger !== undefined
      ? staggerParent(stagger, delay)
      : revealVariants(variant, duration);

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={variants}
      transition={stagger === undefined ? { delay } : undefined}
      {...rest}
    >
      <RevealVariantContext.Provider value={variant}>
        {children}
      </RevealVariantContext.Provider>
    </MotionTag>
  );
}

interface RevealItemProps extends Omit<HTMLMotionProps<"div">, "variants" | "children"> {
  children: ReactNode;
  variant?: RevealVariant;
  duration?: number;
  as?: ElementType;
}

/** A child of a staggering `Reveal`. Inherits the parent's timing, and its
 * entrance unless this item names its own. */
export function RevealItem({
  children,
  variant,
  duration,
  as = "div",
  ...rest
}: RevealItemProps) {
  const MotionTag = motion[as as "div"] ?? motion.div;
  const inherited = useContext(RevealVariantContext);
  return (
    <MotionTag
      variants={revealVariants(variant ?? inherited, duration)}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
