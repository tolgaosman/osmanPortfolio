"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Project } from "@/types";
import type { Dict, Lang } from "@/data/translations";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";
import { asset, cn } from "@/lib/utils";
import { EASE_OUT, VIEWPORT } from "@/lib/motion";

interface ProjectRowProps {
  project: Project;
  /** 1-based position, rendered as the row's index number. */
  index: number;
  /** Odd rows put the image right, even rows put it left. */
  flipped: boolean;
  onSelect: (project: Project) => void;
}

/**
 * One project per full-width row, alternating sides — replaces the uniform
 * `md:2 xl:3` card grid. The preview is a real screenshot rather than a
 * macOS-window mockup, which is the whole reason the deleted `images` arrays
 * in data/projects.ts had to be restored first.
 */
export default function ProjectRow({
  project,
  index,
  flipped,
  onSelect,
}: ProjectRowProps) {
  const { lang, t } = useLang();
  const p = t.projects;
  const preview = project.details?.images?.[0];
  const isMobileApp = project.category === "Mobile";
  const indexLabel = String(index).padStart(2, "0");
  const featured = project.details?.features?.slice(0, 2) ?? [];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, x: flipped ? 24 : -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.55, ease: EASE_OUT }}
      className="group border-t border-border pt-8 first:border-t-0 first:pt-0 sm:pt-10"
    >
      <div
        className={cn(
          "grid items-center gap-8 lg:gap-16",
          flipped ? "lg:grid-cols-[5fr_7fr]" : "lg:grid-cols-[7fr_5fr]",
        )}
      >
        {/* Text block. `order` swaps it against the image on alternating rows. */}
        <div className={cn(flipped && "lg:order-2")}>
          <p className="flex items-center gap-3 font-mono text-xs text-faint">
            <span className="text-accent">{indexLabel}</span>
            <span aria-hidden className="h-px w-6 bg-border" />
            {project.details?.year && <span>{project.details.year}</span>}
            <span>·</span>
            <span>{p.status[project.status]}</span>
            {project.details?.role && (
              <>
                <span>·</span>
                <span>{project.details.role[lang]}</span>
              </>
            )}
          </p>

          <h3 className="mt-4 font-display text-title text-text">
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="link-underline text-left"
            >
              {project.title[lang]}
            </button>
          </h3>

          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-muted">
            {project.description[lang]}
          </p>

          {/* Two concrete features, pulled from the same bilingual copy the
              modal's full list draws from — this was previously one click
              away from the page and never surfaced here at all. */}
          {featured.length > 0 && (
            <ul className="mt-4 max-w-xl space-y-1.5">
              {featured.map((feature) => (
                <li
                  key={feature[lang]}
                  className="flex gap-2.5 font-sans text-sm text-muted"
                >
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-accent" />
                  {feature[lang]}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-faint">
            {project.stack.map((tech, i) => (
              <span key={tech}>
                {tech}
                {i < project.stack.length - 1 && (
                  <span aria-hidden className="ml-3 text-border">
                    /
                  </span>
                )}
              </span>
            ))}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="link-underline font-sans text-sm font-medium text-text"
            >
              {p.viewDetails}
            </button>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-sans text-sm text-muted transition-colors hover:text-text"
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
                className="group/live inline-flex items-center gap-1.5 font-sans text-sm text-accent transition-colors hover:text-accent-bright"
              >
                {p.live}
                <ArrowUpRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover/live:-translate-y-0.5 group-hover/live:translate-x-0.5" />
              </a>
            )}
            {!project.github && !project.live && (
              <span className="font-sans text-sm text-faint">
                {p.privateRepo}
              </span>
            )}
          </div>
        </div>

        {/* Preview. A folio numeral straddles the plate's top edge — the same
            occlusion device as the section-level "01"/"02" folios, scaled
            down to row size — and the plate bleeds past its own column into
            the outer gutter on wide screens (safe: body has overflow-x
            hidden). Phone screenshots get a recessed mount instead of a flat
            frame, since a lone 260px plate in a 5fr column was previously
            the emptiest single area on the page. */}
        <div className={cn("relative", flipped && "lg:order-1")}>
          <span
            aria-hidden
            style={{ [flipped ? "right" : "left"]: "-0.4rem" }}
            className="pointer-events-none absolute -top-5 z-10 select-none font-display text-[clamp(2.5rem,5vw,4rem)] leading-none text-accent-dim/70 lg:-top-7"
          >
            {indexLabel}
          </span>

          {isMobileApp ? (
            <div className="plane-well flex w-full items-center justify-center border border-border px-8 py-8 sm:py-10">
              <button
                type="button"
                onClick={() => onSelect(project)}
                aria-label={`${project.title[lang]} — ${p.viewDetails}`}
                className="relative block aspect-[9/19.5] w-full max-w-[220px] overflow-hidden border border-border bg-surface-2 shadow-plate inset-shadow-lip"
              >
                <PlatePreview project={project} preview={preview} p={p} lang={lang} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onSelect(project)}
              aria-label={`${project.title[lang]} — ${p.viewDetails}`}
              className={cn(
                "relative block aspect-[16/9] w-full overflow-hidden border border-border bg-surface-2 shadow-plate inset-shadow-lip transition-shadow duration-500 ease-out",
                "group-hover:shadow-[0_3px_6px_-2px_rgb(var(--ink)/.7),0_22px_44px_-20px_rgb(var(--ink)/.65)]",
                flipped
                  ? "lg:-ml-8 lg:w-[calc(100%+2rem)] xl:-ml-16 xl:w-[calc(100%+4rem)]"
                  : "lg:-mr-8 lg:w-[calc(100%+2rem)] xl:-mr-16 xl:w-[calc(100%+4rem)]",
              )}
            >
              <PlatePreview project={project} preview={preview} p={p} lang={lang} />
            </button>
          )}

          <figcaption className="mt-3 flex items-baseline gap-2 font-mono text-[11px] text-faint">
            <span aria-hidden className="h-px w-4 bg-border" />
            {project.title[lang]} —{" "}
            {preview ? p.modal.imageAlt : p.modal.screenshotsSoon}
          </figcaption>
        </div>
      </div>
    </motion.article>
  );
}

/** The image itself, shared between the flat desktop mount and the recessed
 * phone mount so the darkening inner edge and hover zoom stay consistent. */
function PlatePreview({
  project,
  preview,
  p,
  lang,
}: {
  project: Project;
  preview: string | undefined;
  p: Dict["projects"];
  lang: Lang;
}) {
  return preview ? (
    <>
      <Image
        src={asset(preview)}
        alt={`${project.title[lang]} — ${p.modal.imageAlt}`}
        fill
        sizes="(min-width: 1024px) 45vw, 90vw"
        unoptimized
        loading="lazy"
        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      {/* Darkens the frame's inner edge so a bright screenshot doesn't bleed
          into its own mount, and gives the flat image pixels a lit top lip. */}
      <span aria-hidden className="pointer-events-none absolute inset-0 inset-shadow-edge" />
    </>
  ) : (
    // A deliberate "not yet" state, not a broken placeholder — this is what
    // a project renders before its screenshots arrive, styled the same way
    // an out-of-stock notice would be: plain, static, no invented imagery.
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      <span aria-hidden className="h-1.5 w-1.5 bg-accent-dim" />
      <span className="font-sans text-label uppercase text-faint">
        {p.modal.screenshotsSoon}
      </span>
    </span>
  );
}
