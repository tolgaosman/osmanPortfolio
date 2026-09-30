/* eslint-disable @next/next/no-img-element --
   next/image cannot help on this site. `images.unoptimized` is set for the
   static export, so it performs no resizing, no format negotiation and no
   lazy-loading policy of its own; all it adds is an absolutely-positioned
   wrapper that fights this card's `group-hover:scale-105` cover image,
   which is exactly what was bleeding the screenshot out past the card's
   rounded, clipped edge. Explicit width/height still prevents layout shift. */

"use client";

import type { Project } from "@/types";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";
import { useProjectModal } from "./ProjectModalProvider";
import { asset } from "@/lib/utils";

export default function ProjectGridCard({
  project,
}: {
  project: Project;
}) {
  const { lang, t } = useLang();
  const { openProject } = useProjectModal();
  const p = t.projects;
  const d = project.details;

  const isMobileApp = project.category === "Mobile";
  const hasImages = Boolean(d?.images?.length) && !isMobileApp;
  const coverImage = hasImages ? asset(d!.images![0]) : null;

  // Determine the primary link
  let primaryLink = null;
  let linkIcon = null;
  let linkText = null;

  if (project.live) {
    primaryLink = project.live;
    linkIcon = <ArrowUpRightIcon className="h-4 w-4" />;
    linkText = p.live;
  } else if (project.github) {
    primaryLink = project.github;
    linkIcon = <GitHubIcon className="h-4 w-4" />;
    linkText = p.source;
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-border-faint bg-surface/50 transition-colors hover:border-accent-dim hover:bg-surface">
      <button
        type="button"
        onClick={() => openProject(project.id)}
        data-cursor="view"
        aria-label={`${p.viewDetails}: ${project.title[lang]}`}
        className="flex flex-1 flex-col text-left"
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden border-b border-border-faint bg-surface-2">
          {coverImage ? (
            <img
              src={coverImage}
              alt={project.title[lang]}
              width={1280}
              height={720}
              loading="lazy"
              decoding="async"
              draggable={false}
              className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
            />
          ) : isMobileApp ? (
            // The category badge already says "mobile" — this reads as a
            // deliberate choice (screenshots belong on a phone screen, not
            // cropped into a landscape card) rather than as an unfinished
            // project, which is what reusing the "building" terminal state
            // below would have implied.
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
              <div
                aria-hidden="true"
                className="relative h-14 w-8 shrink-0 rounded-[0.6rem] border-2 border-border-strong"
              >
                <span className="absolute left-1/2 top-1.5 h-0.5 w-2.5 -translate-x-1/2 rounded-full bg-border-strong" />
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-border-strong" />
              </div>
              <p className="max-w-[12rem] text-center font-mono text-[10px] uppercase tracking-wide text-faint">
                {p.mobilePreviewNote}
              </p>
            </div>
          ) : (
            <div className="term flex h-full w-full flex-col justify-center gap-1 bg-surface-2 p-4 text-screen text-xs sm:text-sm">
              <p className="text-text">{`$ cd ${project.id}`}</p>
              <p className="text-accent">
                {"building"}
                <span className="caret" aria-hidden="true" />
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 pb-0">
          <div className="mb-2 flex items-start justify-between gap-2">
            <h3 className="min-w-0 font-display text-lg font-medium text-text">
              {project.title[lang]}
            </h3>
            <span className="shrink-0 rounded-xs border border-border bg-bg px-2 py-0.5 font-mono text-[10px] uppercase text-muted">
              {project.category === "Mobile" ? p.mobile : project.category === "Intern" ? p.intern : p.web}
            </span>
          </div>

          <p className="mb-6 line-clamp-3 text-sm text-muted">
            {project.description[lang]}
          </p>

          <div className="mb-5 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-xs bg-accent/5 px-1.5 py-0.5 font-mono text-[10px] text-accent-dim"
              >
                {tech}
              </span>
            ))}
            {project.stack.length > 4 && (
              <span className="rounded-xs bg-accent/5 px-1.5 py-0.5 font-mono text-[10px] text-accent-dim">
                +{project.stack.length - 4}
              </span>
            )}
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between border-t border-border-faint px-5 py-4">
        <span className="font-mono text-[10px] uppercase text-faint">
          {p.status[project.status]}
        </span>

        {primaryLink ? (
          <a
            href={primaryLink}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="flex items-center gap-1.5 text-xs text-accent transition-colors hover:text-accent-bright"
          >
            {linkText}
            {linkIcon}
          </a>
        ) : (
          <span className="font-mono text-[10px] text-faint">
            {p.privateRepo}
          </span>
        )}
      </div>
    </article>
  );
}
