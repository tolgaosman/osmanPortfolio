"use client";

import Link from "next/link";
import SectionLabel from "@/components/SectionLabel";
import ScrambleText from "@/components/ScrambleText";
import ProjectCard from "./ProjectCard";
import { showcaseProjects } from "@/data/projects";
import { useLang } from "@/lib/i18n";
import { ArrowUpRightIcon } from "@/components/Icons";
import { btnSecondary } from "@/lib/buttons";
import { cn } from "@/lib/utils";

export default function ProjectsSection() {
  const { t } = useLang();
  const p = t.projects;

  return (
    <section id="projects" className="crt relative z-10 border-b border-border-structural bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-3 top-2 -z-10 select-none font-display text-[clamp(3rem,16vw,13rem)] font-bold leading-[0.7] text-accent-dim sm:-left-8"
        >
          02
        </span>
        <SectionLabel index="02">{p.label}</SectionLabel>
        
        <div className="mt-8">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <h2 className="max-w-2xl font-display text-title font-medium text-text">
              <ScrambleText text={p.title} />
            </h2>
            <Link
              href="/projects"
              data-cursor="link"
              className={cn(btnSecondary, "px-4 py-2 text-muted whitespace-nowrap")}
            >
              <ArrowUpRightIcon className="mr-2 h-4 w-4 inline" />
              {p.seeAll}
            </Link>
          </div>
          <p className="mt-4 max-w-xl text-lede text-muted">
            {p.showcaseDesc}
          </p>
        </div>

        <div className="mt-16 flex flex-col sm:mt-24">
          {showcaseProjects.map((project, i) => (
            <div 
              key={project.id} 
              // Using border-t as the separator, starting from the second item.
              className={i > 0 ? "border-t border-border-faint pt-16 mt-16 sm:pt-24 sm:mt-24" : ""}
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
