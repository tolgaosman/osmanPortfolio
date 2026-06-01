"use client";

import { motion } from "framer-motion";
import StatusDashboard from "./StatusDashboard";
import TypewriterText from "./TypewriterText";
import { ArrowUpRightIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function HeroSection() {
  const { t } = useLang();
  const h = t.hero;

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-grid pt-16"
    >
      {/* Accent glow */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left: copy */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted"
          >
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" />
            {h.badge}
          </motion.div>

          <motion.h1
            variants={item}
            className="font-mono text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            <span className="block text-text">Tolga Osman</span>
            <span className="mt-2 block text-2xl text-muted sm:text-3xl lg:text-4xl">
              <span className="text-accent">&gt;</span>{h.buildPrefix ? ` ${h.buildPrefix} ` : " "}
              <TypewriterText
                words={h.typewriter}
                className="text-accent text-glow"
              />
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 font-mono text-sm text-muted sm:text-base"
          >
            {h.role}
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
          >
            {h.description}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-4">
            <button
              onClick={() => scrollTo("projects")}
              className="group inline-flex items-center gap-2 border-2 border-accent bg-accent px-6 py-3 font-mono text-sm font-bold text-bg shadow-neo transition-transform hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0"
            >
              {h.viewWork}
              <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="inline-flex items-center gap-2 border-2 border-border bg-transparent px-6 py-3 font-mono text-sm font-bold text-text transition-colors hover:border-accent hover:text-accent"
            >
              {h.contactMe}
            </button>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-10 flex items-center gap-6 font-mono text-xs text-muted"
          >
            <span>
              <span className="text-text">Web</span> · HTML / CSS / JS
            </span>
            <span className="hidden sm:inline">
              <span className="text-text">Mobile</span> · Flutter
            </span>
            <span>
              <span className="text-text">Tools</span> · Git / AI
            </span>
          </motion.div>
        </motion.div>

        {/* Right: dashboard */}
        <div className="flex justify-center lg:justify-end">
          <StatusDashboard />
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-xs text-muted md:flex"
      >
        <span>{h.scroll}</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="text-accent"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  );
}
