"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import ProjectCard from "./ProjectCard";
import { PROJECT_CATEGORIES, projects } from "@/data/projects";
import type { ProjectCategory } from "@/types";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

type Filter = "All" | ProjectCategory;

export default function ProjectsSection() {
  const { t } = useLang();
  const p = t.projects;
  const [filter, setFilter] = useState<Filter>("All");

  const filterLabel = (cat: Filter) => {
    if (cat === "All") return p.all;
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
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index={p.index}
          title={p.title}
          subtitle={p.subtitle}
        />

        {/* Filter pills */}
        <div className="mb-10 flex flex-wrap gap-3">
          {PROJECT_CATEGORIES.map((cat) => {
            const active = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "relative border-2 px-4 py-2 font-mono text-sm transition-colors",
                  active
                    ? "border-accent text-bg"
                    : "border-border text-muted hover:border-accent/50 hover:text-text",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="filter-bg"
                    className="absolute inset-0 -z-10 bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                {filterLabel(cat)}
                <span className="ml-1.5 opacity-60">
                  [
                  {cat === "All"
                    ? projects.length
                    : projects.filter((proj) => proj.category === cat).length}
                  ]
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visible.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
