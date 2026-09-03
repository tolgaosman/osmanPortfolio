"use client";

import { motion } from "framer-motion";
import HeroPortrait from "./HeroPortrait";
import ServiceCards from "./ServiceCards";
import { ArrowUpRightIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";
import { smoothScrollTo } from "@/lib/utils";
import { siteConfig } from "@/data/site";

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

  const scrollTo = (id: string) => smoothScrollTo(id);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-grid pt-16"
    >
      {/* Accent glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-4xl flex-col items-center gap-10 px-5 py-24 text-center sm:px-8 sm:py-28"
      >
        <motion.div variants={item}>
          <HeroPortrait />
        </motion.div>

        <div>
          <motion.div
            variants={item}
            className="mx-auto mb-6 inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 font-mono text-xs text-muted"
          >
            <span className="h-2 w-2 animate-pulse-dot rounded-full bg-accent" />
            {h.badge}
          </motion.div>

          <motion.h1
            variants={item}
            className="font-mono text-3xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            <span className="block text-text">
              {h.greeting} {siteConfig.shortName}.
            </span>
            <span className="mt-1 block text-muted">{h.roleTitle}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-glow font-mono text-xl font-bold text-accent sm:text-2xl lg:text-3xl"
          >
            &ldquo;{h.slogan}&rdquo;
          </motion.p>

          <motion.p
            variants={item}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {h.description}
          </motion.p>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap items-center justify-center gap-4"
          >
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
        </div>

        <motion.div variants={item} className="w-full pt-4">
          <ServiceCards />
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
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
