"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

interface SectionLabelProps {
  children: string;
  className?: string;
}

/**
 * Deliberately smaller than the `SectionHeading` it replaces: a label and a
 * rule, nothing else. The old component also owned the h2 and the subtitle,
 * which is why five sections opened in exactly the same shape. Each section
 * now writes its own heading at its own size.
 */
export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="shrink-0 font-sans text-label font-medium uppercase text-accent">
        {children}
      </span>
      <motion.span
        aria-hidden
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="h-px flex-1 origin-left bg-border"
      />
    </div>
  );
}
