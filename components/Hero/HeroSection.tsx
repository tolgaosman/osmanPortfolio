"use client";

import { motion } from "framer-motion";
import GridFloor from "./GridFloor";
import CodeRain from "./CodeRain";
import Spotlight from "./Spotlight";
import WallName from "./WallName";
import HeroPortrait from "./HeroPortrait";
import StackMarquee from "./StackMarquee";
import Laptop3D from "@/components/Laptop/Laptop3D";
import TypingCode from "@/components/Laptop/TypingCode";
import TerminalOut from "@/components/Laptop/TerminalOut";
import ProjectPeek from "@/components/Laptop/ProjectPeek";
import { ArrowUpRightIcon } from "@/components/Icons";
import { useProjectModal } from "@/components/Projects/ProjectModalProvider";
import { siteConfig } from "@/data/site";
import { useLang } from "@/lib/i18n";
import { cn, smoothScrollTo } from "@/lib/utils";
import { btnPrimary } from "@/lib/buttons";
import { EASE_OUT, revealVariants, staggerParent, usePointerVars } from "@/lib/motion";

const lines = staggerParent(0.08, 0.35);
const rise = revealVariants("rise", 0.65);
const wall = revealVariants("unmask", 0.9);

/**
 * Eight layers, back to front:
 *
 *   1  grid floor      receding, travelling, composited
 *   2  code rain       deterministic columns, no Math.random (hydration)
 *   3  wall name       decoration, aria-hidden, NOT the h1
 *   4  spotlight       screen-blended, brightens 1-3 for one transform
 *   5  portrait        the figure, standing in front of its own name
 *   6  laptops         three CSS-3D assemblies with live screens
 *   7  copy + actions  the real h1 lives here
 *   8  stack marquee   the actual stack, from data/skills.ts
 *
 * `isolation: isolate` on the section is load-bearing twice over: it confines
 * the spotlight's `mix-blend-mode: screen` to this section (otherwise the
 * light would blend against whatever the page composites underneath), and it
 * keeps the atmosphere from escaping into the sections below.
 *
 * TWO LAYOUTS, NOT ONE THAT STRETCHES. Above `lg` the figure is absolutely
 * positioned in the centre and the copy flanks it in a three-column grid.
 * Below `lg` there is no room to flank anything, so the portrait returns to
 * normal flow and the copy sits underneath it: running text over a
 * photograph is a contrast problem that no scrim really solves, and on a
 * phone the photograph would be directly behind the most important paragraph
 * on the page.
 */
export default function HeroSection() {
  const { t } = useLang();
  const h = t.hero;
  const { openProject } = useProjectModal();

  // Writes --sx/--sy onto every [data-spot] inside. No-ops on touch and under
  // reduced motion, where the spotlight is display:none anyway.
  const heroRef = usePointerVars<HTMLElement>();

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      <GridFloor />
      <CodeRain />

      {/* Wall name. Sits high enough that the portrait's head and shoulders
          cross it — the occlusion is what tells you the figure is in front of
          the type rather than pasted over it. */}
      <motion.div
        variants={wall}
        initial="hidden"
        animate="show"
        className="absolute inset-x-0 top-[15%] flex justify-center sm:top-[17%] lg:top-[19%]"
      >
        <WallName text={siteConfig.shortName.toUpperCase()} />
      </motion.div>

      <Spotlight />

      {/* Laptops. Scattered into the corners the figure and the copy do not
          use. `pointer-events-none` at the wrapper so they never steal a
          click; the third re-enables them on its own button, because its
          screen IS a control. Sized in rem rather than vw so they cannot grow
          past the viewport edge on a narrow phone. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}
        className="pointer-events-none absolute left-2 top-[27%] w-[6.5rem] sm:left-[4%] sm:top-[26%] sm:w-[10rem] lg:top-[30%] lg:w-[13rem]"
      >
        <Laptop3D label="Source code">
          <TypingCode />
        </Laptop3D>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.72 }}
        className="pointer-events-none absolute right-2 top-[21%] w-[6.5rem] sm:right-[4%] sm:top-[20%] sm:w-[9.5rem] lg:top-[24%] lg:w-[12rem]"
      >
        <Laptop3D label="Build output">
          <TerminalOut />
        </Laptop3D>
      </motion.div>

      {/* Interactive, so it only appears where there is room to point at it. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.84 }}
        className="absolute right-[6%] top-[54%] hidden w-[11rem] lg:right-[9%] lg:top-[52%] lg:block"
      >
        <Laptop3D label={t.projects.label}>
          <ProjectPeek onOpen={openProject} />
        </Laptop3D>
      </motion.div>

      {/* Portrait, desktop: absolutely positioned, bottom-anchored so the
          figure stands on the marquee rail rather than floating. */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
        className="absolute bottom-[3.25rem] left-1/2 hidden aspect-[3/4] h-[66%] -translate-x-1/2 lg:block"
      >
        <HeroPortrait />
      </motion.div>

      <div className="relative mx-auto flex w-full max-w-[92rem] flex-1 flex-col justify-end px-5 pb-8 pt-24 sm:px-8 sm:pt-28">
        {/* Portrait, small screens: in flow, above the copy. */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
          className="mx-auto mb-9 aspect-[3/4] h-[34svh] max-w-full sm:h-[38svh] lg:hidden"
        >
          <HeroPortrait />
        </motion.div>

        <motion.div variants={lines} initial="hidden" animate="show">
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,30rem)_1fr_auto]">
            <motion.div variants={rise}>
              <h1>
                {/* The accessible heading carries the name; the wall graphic
                    cannot, because its contrast is set at texture level. */}
                <span className="sr-only">
                  {siteConfig.name} — {h.roleTitle}
                </span>
                <span
                  aria-hidden="true"
                  className="block font-mono text-label uppercase text-accent"
                >
                  {h.roleTitle}
                </span>
                <span
                  aria-hidden="true"
                  className="mt-4 block max-w-md font-display text-sub font-medium text-text"
                >
                  {h.slogan}
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
                {h.description}
              </p>
            </motion.div>

            <div aria-hidden="true" className="hidden lg:block" />

            <motion.div
              variants={rise}
              className="flex flex-wrap items-center gap-x-7 gap-y-4 lg:justify-end"
            >
              <motion.button
                onClick={() => smoothScrollTo("projects")}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                data-cursor="link"
                className={cn(btnPrimary, "group")}
              >
                {h.viewWork}
                <ArrowUpRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.button>

              {/* Not a second pill. An outlined pill beside a filled one
                  shares its silhouette and reads as a pair of equals, which
                  is the opposite of a hierarchy. */}
              <button
                onClick={() => smoothScrollTo("contact")}
                data-cursor="link"
                className="group inline-flex items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-text"
              >
                <span className="link-wipe">{h.contactMe}</span>
                <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <StackMarquee />
    </section>
  );
}
