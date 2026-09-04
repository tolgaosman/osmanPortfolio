"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import Reveal, { RevealItem } from "@/components/Reveal";
import ProjectRow from "./ProjectRow";
import ProjectModal from "./ProjectModal";
import { PROJECT_CATEGORIES, projects } from "@/data/projects";
import type { Project, ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { SPRING_SNAP } from "@/lib/motion";

type Filter = "All" | ProjectCategory;

export default function ProjectsSection() {
  const { t } = useLang();
  const p = t.projects;
  const [filter, setFilter] = useState<Filter>("All");
  const [selected, setSelected] = useState<Project | null>(null);

  const filterLabel = (cat: Filter) => {
    if (cat === "All") return p.all;
    if (cat === "Mobile") return p.mobile;
    return p.web;
  };

  const visible = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((proj) => proj.category === filter),
    [filter],
  );

  return (
    // The tallest section on the page, on the base background — deliberately
    // unlike the `surface` slabs on either side of it.
    <section id="projects" className="relative py-24 sm:py-36">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <SectionLabel>{p.label}</SectionLabel>

        <Reveal stagger={0.08} className="mt-8 max-w-3xl">
          <RevealItem as="h2" className="font-display text-title text-text">
            {p.title}
          </RevealItem>
          <RevealItem as="p" className="mt-4 font-sans text-lede text-muted">
            {p.subtitle}
          </RevealItem>
        </Reveal>

        {/* Filter pills. The `layoutId` shared-element highlight is one of the
            best motion moments in the codebase, so it survives the redesign —
            restyled from a 2px-bordered box to a quieter tinted pill. */}
        <div className="mt-12 flex flex-wrap gap-2 border-b border-border pb-5">
          {PROJECT_CATEGORIES.map((cat) => {
            const active = filter === cat;
            const count =
              cat === "All"
                ? projects.length
                : projects.filter((proj) => proj.category === cat).length;
            return (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                whileTap={{ scale: 0.96 }}
                aria-pressed={active}
                className={cn(
                  "relative px-3.5 py-1.5 font-sans text-label font-medium uppercase transition-colors",
                  active ? "text-accent" : "text-faint hover:text-text",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="filter-bg"
                    className="absolute inset-0 -z-10 bg-accent/12 inset-shadow-lip"
                    transition={SPRING_SNAP}
                  />
                )}
                {filterLabel(cat)}
                <span className="ml-1.5 opacity-60">{count}</span>
              </motion.button>
            );
          })}
        </div>

        <motion.div layout className="mt-14 space-y-14 sm:space-y-20">
          <AnimatePresence mode="popLayout">
            {visible.map((project, i) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={i + 1}
                flipped={i % 2 === 1}
                onSelect={setSelected}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
