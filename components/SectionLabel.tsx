"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

interface SectionLabelProps {
  children: string;
  /** Folio numeral, e.g. "01". Rendered as a path segment, not a decoration. */
  index?: string;
  className?: string;
}

/**
 * A label and a rule, nothing else. There is deliberately no shared
 * section-heading component: five sections opening in an identical shape is
 * the strongest tell that a page was generated rather than designed, so each
 * section writes its own h2 at its own size and owns its own measure.
 *
 * The label is set as a filesystem path because every piece of secondary
 * metadata on this page is — the terminal, the folio numerals, the project
 * meta strips. It is one idea applied consistently rather than an ornament
 * applied once.
 */
export default function SectionLabel({
  children,
  index,
  className,
}: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      {index && (
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-label text-accent-dim"
        >
          {index}
        </span>
      )}
      <span className="shrink-0 font-mono text-label uppercase text-accent">
        {children}
      </span>
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.7, ease: EASE_OUT }}
        className="h-px flex-1 origin-left bg-border"
      />
    </div>
  );
}
