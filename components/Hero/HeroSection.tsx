"use client";

import { motion } from "framer-motion";
import HeroPortrait from "./HeroPortrait";
import { ArrowUpRightIcon } from "@/components/Icons";
import { siteConfig } from "@/data/site";
import { useLang } from "@/lib/i18n";
import { smoothScrollTo } from "@/lib/utils";
import { EASE_OUT, revealVariants, staggerParent } from "@/lib/motion";

const lines = staggerParent(0.09, 0.1);
const unmask = revealVariants("unmask");
const rise = revealVariants("rise", 0.6);
const strip = revealVariants("rise", 0.5);

/** The stack strip's three columns. Tech names don't translate; only the
 * group label (h.stackWeb etc.) is looked up per-language at render time. */
const STACK_GROUPS = [
  { labelKey: "stackWeb", items: ["Next.js", "React", "TypeScript"] },
  { labelKey: "stackMobile", items: ["Flutter", "Dart"] },
  { labelKey: "stackBackend", items: ["Laravel", "PHP", "SQL"] },
] as const;

export default function HeroSection() {
  const { t } = useLang();
  const h = t.hero;
  const [firstName, ...restOfName] = siteConfig.shortName.split(" ");

  return (
    <section id="home" className="relative border-b border-border pt-20 sm:pt-24">
      <div className="mx-auto grid max-w-[92rem] grid-cols-1 gap-12 px-5 sm:px-8 lg:min-h-[76svh] lg:grid-cols-12 lg:gap-0">
        {/* Type column — left aligned. The old hero centred everything in a
            max-w-4xl stack, which is the shape every generated portfolio has. */}
        <motion.div
          variants={lines}
          initial="hidden"
          animate="show"
          className="lg:col-span-7 lg:pr-16 lg:pb-14 lg:pt-10"
        >
          <motion.p
            variants={rise}
            className="flex items-center gap-3 font-mono text-xs text-faint"
          >
            <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
            {h.meta}
          </motion.p>

          <h1 className="mt-8 font-display text-display">
            {/* Each line unmasks from behind its own baseline, so the name
                arrives as two typeset lines rather than one faded block. */}
            <span className="block">
              <motion.span variants={unmask} className="block">
                {firstName}
              </motion.span>
            </span>
            <span className="block text-accent">
              <motion.span variants={unmask} className="block">
                {restOfName.join(" ")}
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={rise}
            className="mt-6 font-sans text-lede text-muted"
          >
            {h.roleTitle}
          </motion.p>

          {/* The slogan is the one line on the page with a real point of view,
              so it gets display italic and a hanging quote mark. */}
          <motion.p
            variants={rise}
            className="relative mt-10 max-w-xl font-display text-sub italic text-text"
          >
            <span
              aria-hidden
              className="absolute -left-5 -top-2 text-accent/50 sm:-left-7"
            >
              &ldquo;
            </span>
            {h.slogan}
          </motion.p>

          <motion.p
            variants={rise}
            className="mt-8 max-w-xl font-sans text-base leading-relaxed text-muted"
          >
            {h.description}
          </motion.p>

          <motion.div variants={rise} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <motion.button
              onClick={() => smoothScrollTo("projects")}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className="group inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 font-sans text-sm font-medium text-bg shadow-lift inset-shadow-lip"
            >
              {h.viewWork}
              <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>
            <button
              onClick={() => smoothScrollTo("contact")}
              className="link-underline font-sans text-sm text-muted transition-colors hover:text-text"
            >
              {h.contactMe}
            </button>
          </motion.div>
        </motion.div>

        {/* Portrait column, separated by a hairline rather than floated in
            the middle of the page. The frame's own bottom edge overlaps the
            strip's top rule by a few pixels (`lg:-mb-4`) — the one place in
            the hero where two things actually touch instead of just sitting
            in adjacent boxes. */}
        <div className="relative lg:col-span-5 lg:border-l lg:border-border lg:pl-16 lg:pb-14 lg:pt-10">
          <HeroPortrait className="lg:max-w-[460px] lg:-mb-4 lg:aspect-[4/5.15]" />
        </div>
      </div>

      {/* Bottom strip. The hero previously reserved a full screen for ~50
          words of copy and left its lower half empty; this fills that space
          with real, checkable information instead of more chrome — what's
          being built right now, and the same three-way stack split the
          deleted ServiceCards/data/services.ts used to carry, which nothing
          replaced when that component was removed. */}
      <div className="border-t border-border">
        <motion.div
          variants={strip}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto grid max-w-[92rem] grid-cols-1 gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-12 lg:gap-0 lg:divide-x lg:divide-border-faint"
        >
          <p className="font-sans text-sm leading-relaxed text-muted lg:col-span-7 lg:pr-16">
            {h.focus}
          </p>
          <dl className="grid grid-cols-3 gap-4 lg:col-span-5 lg:pl-16">
            {STACK_GROUPS.map(({ labelKey, items }) => (
              <div key={labelKey}>
                <dt className="font-sans text-label font-medium uppercase text-faint">
                  {h[labelKey]}
                </dt>
                <dd className="mt-1.5 font-mono text-xs leading-relaxed text-muted">
                  {items.join(" · ")}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
