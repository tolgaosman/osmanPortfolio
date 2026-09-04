"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import {
  revealVariants,
  staggerParent,
  VIEWPORT,
  type RevealVariant,
} from "@/lib/motion";

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
      {children}
    </MotionTag>
  );
}

interface RevealItemProps extends Omit<HTMLMotionProps<"div">, "variants" | "children"> {
  children: ReactNode;
  variant?: RevealVariant;
  duration?: number;
  as?: ElementType;
}

/** A child of a staggering `Reveal`. Inherits the parent's timing. */
export function RevealItem({
  children,
  variant = "rise",
  duration,
  as = "div",
  ...rest
}: RevealItemProps) {
  const MotionTag = motion[as as "div"] ?? motion.div;
  return (
    <MotionTag variants={revealVariants(variant, duration)} {...rest}>
      {children}
    </MotionTag>
  );
}
