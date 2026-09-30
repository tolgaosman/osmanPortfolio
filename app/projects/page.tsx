"use client";

import { useMemo, useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import ProjectGridCard from "@/components/Projects/ProjectGridCard";
import { ProjectModalProvider } from "@/components/Projects/ProjectModalProvider";
import { projects } from "@/data/projects";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { btnCommand } from "@/lib/buttons";
import type { ProjectCategory } from "@/types";

type Filter = "all" | ProjectCategory;

export default function ProjectsGallery() {
  const { t } = useLang();
  const p = t.projects;
  const [filter, setFilter] = useState<Filter>("all");

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: p.all },
    { key: "Web", label: p.web },
    { key: "Intern", label: p.intern },
  ];

  const filtered = useMemo(
    () =>
      filter === "all"
        ? projects
        : projects.filter((project) => project.category === filter),
    [filter],
  );

  return (
    <>
      <NavBar />
      <main id="main" className="pt-32 sm:pt-40 pb-20 sm:pb-28">
        <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
          <div className="mb-10 sm:mb-14">
            <h1 className="font-display text-4xl sm:text-5xl font-medium text-text">
              {p.allProjectsTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              {p.subtitle}
            </p>
          </div>

          <div
            role="tablist"
            aria-label={p.allProjectsTitle}
            className="mb-8 flex flex-wrap gap-2 sm:mb-10"
          >
            {filters.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
                className={cn(
                  btnCommand,
                  "uppercase",
                  filter === key
                    ? "border-accent bg-accent/10 text-accent"
                    : "text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <ProjectModalProvider>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((project) => (
                <ProjectGridCard key={project.id} project={project} />
              ))}
            </div>
          </ProjectModalProvider>
        </div>
      </main>
      <Footer />
    </>
  );
}
