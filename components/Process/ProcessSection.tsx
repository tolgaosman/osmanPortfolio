"use client";

import { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import ScrambleText from "@/components/ScrambleText";
import { useLang } from "@/lib/i18n";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

/**
 * The four steps, as a trace that draws itself as you read down it.
 *
 * The rail is real progress through this list — `scrollYProgress` bound
 * straight to `scaleY`, which is the one shape Framer can hand to the
 * compositor because nothing derives from it in between. Each node lights on
 * its own `whileInView` rather than from a shared index, so the sequence
 * survives someone scrolling upward into the middle of it.
 *
 * This section is a narrow band on `surface` between two full-width sections
 * on `bg` — its measure and its ground both differ from its neighbours on
 * purpose. Five sections sharing one container width is the thing that makes
 * a page read as a template.
 */
export default function ProcessSection() {
  const { t } = useLang();
  const pr = t.process;
  const listRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 70%", "end 70%"],
  });

  return (
    <section
      id="process"
      className="plane relative z-10 border-y border-border-structural bg-surface"
    >
      <div className="mx-auto max-w-5xl px-5 py-20 sm:px-8 sm:py-24">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-6 -z-10 select-none font-display text-[clamp(6rem,16vw,13rem)] font-bold leading-[0.7] text-accent-dim/20 sm:right-8"
        >
          03
        </span>

        <SectionLabel index="03">{pr.label}</SectionLabel>

        <div className="mt-8 max-w-3xl">
          <h2 className="font-display text-title font-medium text-text">
            <ScrambleText text={pr.title} />
          </h2>
          <p className="mt-4 border-l border-accent-dim pl-5 text-sm leading-relaxed text-muted">
            {pr.subtitle}
          </p>
        </div>

        <ol ref={listRef} className="relative mt-16 space-y-12 pl-10 sm:pl-14">
          {/* The trace. One hairline at rest, filled by scroll progress. */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-[0.4375rem] w-px bg-border-faint sm:left-[0.6875rem]"
          >
            <motion.div
              style={{ scaleY: scrollYProgress }}
              className="h-full w-px origin-top bg-accent"
            />
          </div>

          {pr.steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={{ hidden: {}, show: {} }}
              className="relative"
            >
              {/* Node. A square, not a dot: a pulsing round dot on a dark
                  page reads as a status light, and this is a step marker, not
                  telemetry. */}
              <motion.span
                aria-hidden="true"
                variants={{
                  hidden: { scale: 0.4, opacity: 0 },
                  show: { scale: 1, opacity: 1 },
                }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="absolute -left-10 top-1.5 block h-2 w-2 bg-accent shadow-glow-sm sm:-left-14 sm:h-2.5 sm:w-2.5"
              />

              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: { opacity: 1, x: 0 },
                }}
                transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.05 }}
              >
                <p className="font-mono text-label uppercase text-accent-dim">
                  {`step ${String(i + 1).padStart(2, "0")}`}
                </p>
                <h3 className="mt-2 font-display text-sub font-medium text-text">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                  {step.desc}
                </p>
              </motion.div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
