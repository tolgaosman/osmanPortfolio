"use client";

import { motion } from "framer-motion";

interface SectionHeadingProps {
  /** Monospace tag shown above the title, e.g. "01 // work" */
  index: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({
  index,
  title,
  subtitle,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="mb-12"
    >
      <span className="font-mono text-sm text-accent">{index}</span>
      <h2 className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-base text-muted">{subtitle}</p>
      )}
      <div className="mt-6 h-1 w-16 bg-accent" />
    </motion.div>
  );
}
