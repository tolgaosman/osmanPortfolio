"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import ScrambleText from "@/components/ScrambleText";
import ProjectCard from "./ProjectCard";
import { projects } from "@/data/projects";
import { useLang } from "@/lib/i18n";
import { LG, useMediaQuery } from "@/lib/media";
import { SPRING_SCROLL } from "@/lib/motion";

/**
 * Projects, as a gallery that moves sideways while the page scrolls down.
 *
 * WHY THIS IS TWO SIBLING COMPONENTS AND NOT ONE WITH A FLAG:
 * `useScroll` must not be called with a `target` ref pointing at a subtree
 * that was never rendered — it logs a dev invariant ("Target ref is defined
 * but not hydrated"), and hooks cannot be called conditionally anyway. So the
 * decision is made once, here, and the branch mounts an entire component.
 * `useMediaQuery` reports false on the server and on the first client render,
 * which means the STACKED list is what ships in the exported HTML; the pinned
 * track swaps in after hydration on a desktop. That ordering is deliberate —
 * the cheap layout is the one crawlers and slow devices get.
 *
 * WHAT IS DELIBERATELY GONE: the All/Web/Mobile filter chips. Four projects
 * split three-and-one, so the control mostly removed one card, and changing
 * the card count mid-pin changes the section's height underneath the reader.
 * The category is now on every card's meta strip, which is where someone
 * scanning for "mobile" actually looks.
 */
export default function ProjectsSection() {
  const { t } = useLang();
  const p = t.projects;
  const isDesktop = useMediaQuery(LG);
  const reduced = useReducedMotion();

  return (
    <section id="projects" className="crt relative bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <SectionLabel index="02">{p.label}</SectionLabel>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <h2 className="max-w-2xl font-display text-title font-medium text-text">
            <ScrambleText text={p.title} />
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted lg:text-right">
            {p.subtitle}
          </p>
        </div>
      </div>

      {isDesktop && !reduced ? <PinnedTrack /> : <StackedList />}
    </section>
  );
}

function PinnedTrack() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  // Measures the DOM that the .pin CSS produced, so the JS travel and the
  // CSS-computed section height are two views of the same geometry.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () =>
      setTravel(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Progress hits 0 exactly as the sticky child engages and 1 exactly as it
    // releases. Any other offset desynchronises the track from the pin.
    offset: ["start start", "end end"],
    // Re-measures when the screenshots finish decoding and the cards settle.
    trackContentSize: true,
  });

  // Stiff, low-mass spring. A soft one keeps travelling after the scroll has
  // stopped, and at the pin boundary that reads as the track snapping back.
  const smooth = useSpring(scrollYProgress, SPRING_SCROLL);
  const x = useTransform(smooth, [0, 1], [0, -travel]);

  // Tabbing into an off-screen card would otherwise scroll the sticky
  // container itself, which detaches the track from the pin and makes the
  // card appear to jump. Move the PAGE instead, to the scroll position that
  // brings that card into view.
  const onFocusCapture = (e: React.FocusEvent<HTMLDivElement>) => {
    const card = (e.target as HTMLElement).closest("[data-card-index]");
    const section = sectionRef.current;
    if (!card || !section || projects.length < 2) return;
    const i = Number(card.getAttribute("data-card-index"));
    const range = section.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: section.offsetTop + range * (i / (projects.length - 1)),
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={sectionRef}
      className="pin mt-14"
      style={{ "--cards": projects.length } as CSSProperties}
    >
      <div className="pin__sticky" onFocusCapture={onFocusCapture}>
        <motion.div ref={trackRef} style={{ x }} className="pin__track">
          {projects.map((project, i) => (
            <div key={project.id} data-card-index={i} className="h-[68svh]">
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * No fixed row height. `h-[62svh] min-h-[26rem]` resolved to 416px on a 667px
 * phone while a card renders 510-650px of plate, title, description, stack and
 * actions — `ProjectCard` is `flex h-full flex-col` with no overflow, so every
 * long card spilled out of its box and into the 80px gap below it, overlapping
 * the next one. The pinned desktop track needs a measured height because it
 * has to fit a viewport; a stacked list is exactly as tall as its content.
 */
function StackedList() {
  return (
    <div className="mx-auto mt-14 max-w-[92rem] space-y-20 px-5 sm:px-8">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </div>
  );
}
