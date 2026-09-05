"use client";

import { motion } from "framer-motion";
import GridFloor from "./GridFloor";
import CodeRain from "./CodeRain";
import Spotlight from "./Spotlight";
import WallName from "./WallName";
import StackMarquee from "./StackMarquee";
import Laptop3D from "@/components/Laptop/Laptop3D";
import TypingCode from "@/components/Laptop/TypingCode";
import TerminalOut from "@/components/Laptop/TerminalOut";
import ProjectPeek from "@/components/Laptop/ProjectPeek";
import { ArrowUpRightIcon } from "@/components/Icons";

import { siteConfig } from "@/data/site";
import { useLang } from "@/lib/i18n";
import { LG, useMediaQuery } from "@/lib/media";
import { cn, smoothScrollTo } from "@/lib/utils";
import { btnPrimary } from "@/lib/buttons";
import {
  EASE_OUT,
  floatTransition,
  revealVariants,
  staggerParent,
  usePointerVars,
} from "@/lib/motion";

const lines = staggerParent(0.08, 0.35);
const rise = revealVariants("rise", 0.65);
const wall = revealVariants("unmask", 0.9);

/** Shared entrance for the figure and the machines. */
const enter = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE_OUT, delay },
});

/**
 * DESKTOP STAGE. The copy block now sits right under the wall name rather
 * than anchored to the section's bottom edge, so the machines are pushed
 * down into the lower band of the section — spread left to right rather than
 * stacked, at deliberately uneven `top`/size values so the row reads as
 * scattered rather than a mirrored triptych. `pointer-events-none` on the two
 * decorative laptops so they never steal a click; the third re-enables them
 * on its own button, because its screen IS a control.
 *
 * The section's `lg:min-h-[122svh]` exists for this trio: at 100svh there
 * isn't enough room below the relocated copy to fit three enlarged laptops
 * without clipping into the marquee. Each gets its own inner `motion.div` on
 * a slow vertical mirror-loop plus a hairline rotate — `floatTransition` —
 * with a different duration/delay so the three drift out of phase rather
 * than breathing in lockstep.
 */
function DesktopStage({ peekLabel }: { peekLabel: string }) {

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.6 }}
        className="pointer-events-none absolute left-[6%] top-[70%] w-[16rem]"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
          transition={floatTransition(6, 0.6)}
        >
          <Laptop3D label="Source code">
            <TypingCode />
          </Laptop3D>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.72 }}
        className="pointer-events-none absolute left-[38%] top-[63%] w-[15rem]"
      >
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, -1, 0] }}
          transition={floatTransition(5.2, 1)}
        >
          <Laptop3D label="Build output">
            <TerminalOut />
          </Laptop3D>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.84 }}
        className="absolute right-[7%] top-[75%] w-[14rem]"
      >
        <motion.div
          animate={{ y: [0, -9, 0], rotate: [0, 0.8, 0] }}
          transition={floatTransition(6.8, 1.4)}
        >
          <Laptop3D label={peekLabel}>
            <ProjectPeek onOpen={(id) => {
              // Without the modal, the laptop screen simply takes you to the projects section
              smoothScrollTo("projects");
            }} />
          </Laptop3D>
        </motion.div>
      </motion.div>
    </>
  );
}

/**
 * MOBILE MACHINES. In flow, under the copy, at a size where the screen is
 * actually legible.
 *
 * They used to be the desktop pair scaled down to `w-[6.5rem]` — 104px,
 * inside which 11px mono in a 3D-transformed layer is noise — and both sat
 * underneath the in-flow portrait, which painted over their inner halves. One
 * readable machine says more than two illegible ones; the second joins from
 * `sm`, where there is width for it.
 *
 * The bottom padding is not slack. The deck and the chassis front are
 * absolutely positioned below the lid, so a laptop layout box is its LID —
 * roughly 40% shorter than the thing you can see.
 */
function MobileMachines() {
  return (
    <motion.div
      {...enter(0.6)}
      className="mt-12 flex items-start justify-center gap-8 pb-20 sm:gap-10 sm:pb-24"
    >
      <motion.div animate={{ y: [0, -8, 0] }} transition={floatTransition(6, 0.6)}>
        <Laptop3D label="Source code" className="w-[14rem] shrink-0 sm:w-[16rem]">
          <TypingCode />
        </Laptop3D>
      </motion.div>
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={floatTransition(5.2, 1)}
        className="hidden sm:block"
      >
        <Laptop3D label="Build output" className="w-[16rem] shrink-0">
          <TerminalOut />
        </Laptop3D>
      </motion.div>
    </motion.div>
  );
}

/**
 * Seven layers, back to front:
 *
 *   1  grid floor      receding, travelling, composited
 *   2  code rain       deterministic columns, no Math.random (hydration)
 *   3  wall name       decoration, aria-hidden, NOT the h1
 *   4  spotlight       screen-blended, brightens 1-3 for one transform
 *   5  laptops         CSS-3D assemblies with live screens
 *   6  copy + actions  the real h1 lives here, right under the wall name
 *   7  stack marquee   the actual stack, from data/skills.ts
 *
 * `isolation: isolate` on the section is load-bearing twice over: it confines
 * the spotlight's `mix-blend-mode: screen` to this section (otherwise the
 * light would blend against whatever the page composites underneath), and it
 * keeps the atmosphere from escaping into the sections below.
 *
 * TWO STAGES, NOT ONE THAT STRETCHES — and two mounted COMPONENTS, not one
 * component branching on a class. Above `lg` the copy is pulled out of flow
 * and pinned right under the wall name, and the machines fill the taller
 * band that opens up below it. Below `lg` there is no room for any of that,
 * so everything returns to normal flow and stacks in the order it reads.
 *
 * `useMediaQuery` reports false on the server and on the first client render,
 * so the exported HTML carries the cheap stacked layout, matching the DOM the
 * static export ships.
 */
export default function HeroSection() {
  const { t } = useLang();
  const h = t.hero;
  const isDesktop = useMediaQuery(LG);

  // Writes --sx/--sy onto every [data-spot] inside. No-ops on touch and under
  // reduced motion, where the spotlight is display:none anyway.
  const heroRef = usePointerVars<HTMLElement>();

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden lg:min-h-[122svh]"
    >
      <GridFloor />
      <CodeRain />

      {/* Wall name, at wall scale behind the copy and the laptops. */}
      <motion.div
        variants={wall}
        initial="hidden"
        animate="show"
        className="absolute inset-x-0 top-[19%] flex justify-center sm:top-[21%] lg:top-[23%]"
      >
        <WallName text="tolgaosman_" />
      </motion.div>

      <Spotlight />

      {isDesktop && <DesktopStage peekLabel={t.projects.label} />}

      <div className="relative mx-auto flex w-full max-w-[92rem] flex-1 flex-col justify-end px-5 pb-8 pt-24 sm:px-8 sm:pt-28 lg:absolute lg:inset-x-0 lg:top-[38%] lg:flex-none lg:justify-start lg:pb-0 lg:pt-0">
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
                className="group inline-flex min-h-11 items-center gap-1.5 font-mono text-sm text-muted transition-colors hover:text-text"
              >
                <span className="link-wipe">{h.contactMe}</span>
                <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.div>
          </div>
        </motion.div>

        {!isDesktop && <MobileMachines />}
      </div>

      <div className="lg:absolute lg:inset-x-0 lg:bottom-0">
        <StackMarquee />
      </div>
    </section>
  );
}
