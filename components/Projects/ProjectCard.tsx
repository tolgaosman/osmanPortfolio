/* eslint-disable @next/next/no-img-element --
   next/image cannot help on this site. `images.unoptimized` is set for the
   static export, so it performs no resizing, no format negotiation and no
   lazy-loading policy of its own; all it adds is an absolutely-positioned
   wrapper that fights the transformed ancestors these images live inside.
   The two things it would have given us — an explicit intrinsic size and a
   fetch priority — are set by hand on the <img> below. */

"use client";

import type { Project } from "@/types";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/Icons";
import { useProjectModal } from "./ProjectModalProvider";
import { useLang } from "@/lib/i18n";
import { asset, cn } from "@/lib/utils";
import { useLocalTilt } from "@/lib/motion";
import { btnCommand, btnQuiet } from "@/lib/buttons";

/**
 * One project. Used unchanged by both the pinned horizontal track and the
 * stacked fallback, so the two layouts cannot drift apart in anything except
 * how they are positioned.
 *
 * The plate tilts toward the pointer using `useLocalTilt` — element-relative,
 * so only the card you are actually pointing at moves. The viewport-driven
 * `useTilt` used by the hero laptops would lean all four identically, which
 * reads as the page being crooked rather than as the card responding.
 */
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
  const { openProject } = useProjectModal();
  const plate = useLocalTilt<HTMLDivElement>(5);

  const cover = project.details?.images?.[0];
  const isMobileApp = project.category === "Mobile";
  const folio = String(index + 1).padStart(2, "0");

  return (
    <article className={cn("flex h-full flex-col", className)}>
      {/* Plate. `lap`/`lap__rig` are reused deliberately: the same perspective
          owner and the same preserve-3d assembly node as the hero laptops, so
          the whole page tilts with one set of rules rather than two. */}
      {/* Aspect-driven with a height cap rather than `flex-1`. A flex child
          that has to shrink to fit was overflowing the pinned viewport, and a
          card whose title is cut off by the fold is worse than a smaller
          plate. Now the card is content-sized and always fits. */}
      <div className="lap w-full">
        <div
          ref={plate}
          className={cn(
            "lap__rig max-h-[52svh]",
            // A phone screenshot fitted into a 16:10 plate is ~78px wide on a
            // 375px viewport — a sliver of the app it is meant to show. Below
            // `lg` the plate takes the screenshot's own orientation instead;
            // from `lg` up the row of cards has to share one silhouette, so
            // the landscape plate comes back.
            isMobileApp ? "aspect-[4/5] lg:aspect-[16/10]" : "aspect-[16/10]",
          )}
        >
          <button
            type="button"
            onClick={() => openProject(project.id)}
            data-cursor="view"
            aria-label={`${p.viewDetails}: ${project.title[lang]}`}
            className={cn(
              "group relative block h-full w-full overflow-hidden rounded-md border border-border shadow-plate transition-shadow duration-500 hover:shadow-plate-hover",
              // The letterbox behind a contained screenshot is the PLATE'S OWN
              // background, not a sibling layer. It used to be a `<span>` at
              // `absolute inset-0` carrying a 34px grid "mount" — ruled lines
              // running up to, and reading as across, a photograph. Painting
              // it opaque in place would have been worse: an absolutely
              // positioned sibling paints in step 8 of the stacking order and
              // the static <img> in step 7, so the mount would have covered
              // the screenshot entirely.
              isMobileApp ? "bg-surface-2" : "bg-surface",
            )}
          >
            {cover ? (
              <img
                src={asset(cover)}
                alt=""
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
                className={cn(
                  "h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.03]",
                  // A phone screenshot letterboxed into a 16:9 plate looks
                  // like a mistake; contain it and let the plate frame it.
                  isMobileApp
                    ? "object-contain p-3 sm:p-5 lg:p-8"
                    : "object-cover object-top",
                )}
              />
            ) : (
              // Not a "coming soon" placeholder. This project genuinely has no
              // screenshots yet, and a terminal mid-build is a truthful thing
              // to show for something that is still being built.
              <div className="term flex h-full w-full flex-col justify-center gap-1 px-6 text-screen">
                <p className="text-text">{`$ cd ~/projects/${project.id}`}</p>
                <p className="text-text">{"$ npm run dev"}</p>
                <p className="text-faint">{"  starting development server"}</p>
                <p className="text-accent">
                  {"  building"}
                  <span className="caret" aria-hidden="true" />
                </p>
              </div>
            )}

            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />

            <span className="pointer-events-none absolute left-4 top-4 font-display text-4xl font-bold leading-none text-accent-dim">
              {folio}
            </span>

            {/* Touch only. The one thing that said "this plate opens
                something" was `data-cursor="view"` — a cursor, which does not
                exist on a phone, where this is also the largest and most
                obviously tappable element on the card. Above `lg` the custom
                cursor is doing that job and a second label beside the real
                button below would just be the same word twice. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 right-3 rounded-xs border border-border-strong bg-bg/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-text backdrop-blur-sm lg:hidden"
            >
              {p.viewDetails}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-x-10 gap-y-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="min-w-0">
          {/* Meta strip: every fact here is verifiable from data/projects.ts.
              No invented metrics, no stars, no "10k users". */}
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-label uppercase text-faint">
            <span className="text-accent">
              {isMobileApp ? p.mobile : p.web}
            </span>
            {project.details?.year && (
              <>
                <span aria-hidden="true">/</span>
                <span>{project.details.year}</span>
              </>
            )}
            <span aria-hidden="true">/</span>
            <span>{p.status[project.status]}</span>
            {project.details?.role && (
              <>
                <span aria-hidden="true">/</span>
                <span className="truncate">{project.details.role[lang]}</span>
              </>
            )}
          </p>

          <h3 className="mt-3 font-display text-title font-medium text-text">
            <button
              type="button"
              onClick={() => openProject(project.id)}
              data-cursor="view"
              className="text-left transition-colors duration-300 hover:text-accent"
            >
              {project.title[lang]}
            </button>
          </h3>

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {project.description[lang]}
          </p>

          <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-faint">
            {project.stack.map((tech, i) => (
              <span key={tech}>
                {i > 0 && (
                  <span aria-hidden="true" className="mr-2 text-accent-dim">
                    ·
                  </span>
                )}
                {tech}
              </span>
            ))}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => openProject(project.id)}
            data-cursor="link"
            className={btnCommand}
          >
            {p.viewDetails}
          </button>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className={cn(btnQuiet, "inline-flex items-center gap-1.5")}
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              {p.source}
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className={cn(btnQuiet, "inline-flex items-center gap-1.5")}
            >
              {p.live}
              <ArrowUpRightIcon className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
