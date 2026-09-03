"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import { useLang } from "@/lib/i18n";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProcessSection() {
  const { t } = useLang();
  const p = t.process;

  return (
    <section id="process" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading index={p.index} title={p.title} subtitle={p.subtitle} />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {p.steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={item}
              className="relative border-2 border-border bg-surface p-6"
            >
              <span className="font-mono text-sm text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-mono text-lg font-bold text-text">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.desc}
              </p>
              {/* Connector line to the next step — desktop only, hidden on the last card. */}
              {i < p.steps.length - 1 && (
                <div
                  aria-hidden
                  className="absolute right-0 top-1/2 hidden h-px w-6 -translate-y-1/2 translate-x-full bg-border lg:block"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
