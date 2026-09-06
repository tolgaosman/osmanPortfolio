"use client";

import type { Project, ProjectStatus } from "@/types";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { btnSecondary } from "@/lib/buttons";
import ImageCarousel from "./ImageCarousel";
import PhoneFrame from "./PhoneFrame";
import LaptopFrame from "./LaptopFrame";

const statusColor: Record<ProjectStatus, string> = {
  live: "text-accent-bright border-accent-bright/40",
  soon: "text-faint border-border",
  wip: "text-accent border-accent/40",
  intern: "text-accent border-accent/40",
  prod: "text-accent-bright border-accent-bright/40",
};

export default function ProjectCard({
  project,
  index,
  className,
}: {
  project: Project;
  index: number;
  className?: string;
}) {
  const { lang, t } = useLang();
  const p = t.projects;
  const m = p.modal;
  const d = project.details;

  const isMobileApp = project.category === "Mobile";
  const categoryLabel = isMobileApp ? p.mobile : p.web;
  const hasImages = Boolean(d?.images?.length);

  // For mobile apps (portrait images), a 5/7 split looks better to remove empty space on sides.
  // For web apps (landscape images), use 7/5 split.
  const imageCols = isMobileApp ? "lg:col-span-4" : "lg:col-span-7";
  const detailsCols = isMobileApp ? "lg:col-span-8" : "lg:col-span-5";

  // Even index -> image left, odd index -> image right
  const imageOrderClass = index % 2 === 0 ? `lg:order-1 ${imageCols}` : `lg:order-2 ${imageCols}`;
  const detailsOrderClass = index % 2 === 0 ? `lg:order-2 ${detailsCols}` : `lg:order-1 ${detailsCols}`;

  const media = hasImages ? (
    <ImageCarousel
      images={d!.images!}
      title={project.title[lang]}
      altLabel={m.imageAlt}
      orientation={isMobileApp ? "portrait" : "landscape"}
    />
  ) : (
    <div className="term flex aspect-video w-full flex-col justify-center gap-1 bg-surface-2 px-6 text-screen">
      <p className="text-text">{`$ cd ~/projects/${project.id}`}</p>
      <p className="text-text">{"$ npm run dev"}</p>
      <p className="text-faint">{"  starting development server"}</p>
      <p className="text-accent">
        {"  building"}
        <span className="caret" aria-hidden="true" />
      </p>
    </div>
  );

  return (
    <article className={cn("grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16", className)} id={`project-${project.id}`}>

      {/* Title row. Full card width rather than confined to the details
          column's half — at the column's width "Inventory Management
          System" wraps to three lines; spanning both columns gives it room
          to sit on one. */}
      <div className="flex items-center gap-4 lg:col-span-12">
        <h2 className="font-display text-title font-medium text-text">
          {project.title[lang]}
        </h2>
        <span
          className={cn(
            "shrink-0 rounded-xs border px-2 py-0.5 font-mono text-[10px] uppercase",
            statusColor[project.status],
          )}
        >
          {p.status[project.status]}
        </span>
      </div>

      {/* Image / Carousel Column. The device frame reflects what the project
          IS — a phone for a mobile app, a laptop for a web one — rather than
          a generic card; the frame is chrome only, it doesn't touch this
          column's own size. */}
      <div
        className={cn(
          "min-w-0 w-full",
          isMobileApp && "max-w-[320px] sm:max-w-[360px] mx-auto lg:max-w-none",
          imageOrderClass
        )}
      >
        {isMobileApp ? (
          <PhoneFrame>{media}</PhoneFrame>
        ) : (
          <LaptopFrame>{media}</LaptopFrame>
        )}
      </div>

      {/* Details Column */}
      <div className={cn("flex flex-col min-w-0", detailsOrderClass)}>
        <section className="mb-8">
          <p className="text-lede text-text">
            {d?.overview[lang] ?? project.description[lang]}
          </p>
        </section>

        {d?.features?.length ? (
          <section className="mb-8">
            <h3 className="mb-3 font-mono text-label uppercase text-accent">
              {m.features}
            </h3>
            <ul className="space-y-2">
              {d.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex gap-2.5 text-sm leading-relaxed text-muted"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 bg-accent"
                  />
                  <span>{feature[lang]}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mb-7">
          <h3 className="mb-3 font-mono text-label uppercase text-accent">
            {m.builtWith}
          </h3>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-xs border border-accent-dim bg-accent/10 px-2 py-1 font-mono text-[11px] text-accent"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-6 border-t border-border-faint pt-5">
          <h3 className="mb-3 font-mono text-label uppercase text-faint">
            {m.info}
          </h3>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-faint">{m.category}</dt>
              <dd className="mt-0.5 text-text">{categoryLabel}</dd>
            </div>
            <div>
              <dt className="text-faint">{m.statusLabel}</dt>
              <dd className="mt-0.5 text-text">{p.status[project.status]}</dd>
            </div>
            {d?.role && (
              <div>
                <dt className="text-faint">{m.role}</dt>
                <dd className="mt-0.5 text-text">{d.role[lang]}</dd>
              </div>
            )}
            {d?.year && (
              <div>
                <dt className="text-faint">{m.year}</dt>
                <dd className="mt-0.5 text-text">{d.year}</dd>
              </div>
            )}
          </dl>
        </section>

        <section>
          <h3 className="mb-3 font-mono text-label uppercase text-faint">
            {m.links}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            {project.github && project.status !== "live" && (project.status === "intern" || project.category === "Mobile") && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className={cn(btnSecondary, "px-4 py-2 text-muted")}
              >
                <GitHubIcon className="h-4 w-4" />
                {p.source}
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className={cn(
                  btnSecondary,
                  "border-accent bg-accent/10 px-4 py-2 text-accent hover:bg-accent hover:text-bg",
                )}
              >
                <ArrowUpRightIcon className="h-4 w-4" />
                {p.live}
              </a>
            )}
            {(!project.github || project.status === "live" || (project.status !== "intern" && project.category !== "Mobile")) && !project.live && (
              <span className="font-mono text-sm text-faint">
                {p.privateRepo}
              </span>
            )}
          </div>
        </section>
      </div>
    </article>
  );
}
