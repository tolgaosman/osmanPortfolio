"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { asset } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function AboutSection() {
  const { t } = useLang();
  const a = t.about;

  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.p variants={item} className="mb-2 font-mono text-sm text-accent">
            {a.index}
          </motion.p>
          <motion.h2
            variants={item}
            className="font-mono text-3xl font-bold text-text sm:text-4xl"
          >
            {a.title}
          </motion.h2>
          <motion.p variants={item} className="mt-3 max-w-xl text-muted">
            {a.subtitle}
          </motion.p>
        </motion.div>

        {/* Main grid: photo left, text right */}
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[auto_1fr]">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-64 shrink-0 sm:w-72 lg:mx-0"
          >
            <div className="border-2 border-accent shadow-neo shadow-glow">
              <Image
                src={asset("/osman_foto.jpeg")}
                alt="Tolga Osman"
                width={288}
                height={360}
                className="block h-auto w-full object-cover grayscale-[20%]"
                unoptimized
                priority
              />
            </div>
            {/* decorative offset box */}
            <div className="pointer-events-none absolute -bottom-3 -right-3 -z-10 h-full w-full border-2 border-border" />
          </motion.div>

          {/* Text */}
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-5"
          >
            <motion.p variants={item} className="leading-relaxed text-muted">
              {a.p1}
            </motion.p>
            <motion.p variants={item} className="leading-relaxed text-muted">
              {a.p2}
            </motion.p>
            <motion.p variants={item} className="leading-relaxed text-muted">
              {a.p3}
            </motion.p>

            {/* Quick facts */}
            <motion.div
              variants={item}
              className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-8 sm:grid-cols-3"
            >
              {[
                { label: a.factLocationLabel, value: a.factLocation },
                { label: a.factEducationLabel, value: a.factEducation },
                { label: a.factLanguagesLabel, value: a.factLanguages },
              ].map(({ label, value }) => (
                <div key={label} className="border border-border bg-surface p-4">
                  <p className="mb-1 font-mono text-xs text-accent">{label}</p>
                  <p className="font-mono text-sm text-text">{value}</p>
                </div>
              ))}
            </motion.div>

            {/* CV Actions */}
            <motion.div variants={item} className="mt-4 flex flex-wrap gap-4">
              <a
                href={asset("/osman cv.pdf")}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 border-2 border-border px-5 py-2.5 font-mono text-sm font-bold text-text transition-colors hover:border-accent hover:text-accent"
              >
                {a.viewCv}
                <svg
                  className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" />
                </svg>
              </a>
              <a
                href={asset("/osman cv.pdf")}
                download
                className="group inline-flex items-center gap-2 border-2 border-border px-5 py-2.5 font-mono text-sm font-bold text-text transition-colors hover:border-accent hover:text-accent"
              >
                {a.downloadCv}
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M12 15V3m0 12-4-4m4 4 4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
