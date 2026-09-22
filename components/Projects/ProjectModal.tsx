"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Project, ProjectStatus } from "@/types";
import { ArrowUpRightIcon, CloseIcon, GitHubIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";
import { EASE_IN_OUT, SPRING_SOFT } from "@/lib/motion";
import { useScrollLock } from "@/lib/scroll-lock";
import { btnSecondary } from "@/lib/buttons";
import { cn } from "@/lib/utils";
import ImageCarousel from "./ImageCarousel";
import PhoneFrame from "./PhoneFrame";

// Palette tokens rather than macOS traffic-light hexes, which get borrowed
// for their familiarity and end up reading as window chrome instead of state.
const statusColor: Record<ProjectStatus, string> = {
  live: "text-accent-bright border-accent-bright/40",
  soon: "text-faint border-border",
  wip: "text-accent border-accent/40",
  intern: "text-accent border-accent/40",
  prod: "text-accent-bright border-accent-bright/40",
};

/**
 * Outer shell: owns presence only. Every hook lives in the panel below, so
 * the focus trap, the Escape listener and the scroll lock are created when
 * the dialog actually exists and torn down when it does not — rather than
 * running permanently against a `project === null` guard.
 */
export default function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {project && (
        <ModalPanel key={project.id} project={project} onClose={onClose} />
      )}
    </AnimatePresence>
  );
}

function ModalPanel({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const { lang, t } = useLang();
  const p = t.projects;
  const m = p.modal;
  const d = project.details;
  const categoryLabel = project.category === "Mobile" ? p.mobile : p.web;
  const hasImages = Boolean(d?.images?.length);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useScrollLock(true);

  // Move focus into the dialog on open and restore it to whatever opened the
  // modal on close. Without this a keyboard or screen-reader user's focus is
  // silently dropped to <body> and they restart from the top of the page.
  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      triggerRef.current?.focus();
    };
  }, []);

  // Escape closes; Tab is trapped inside the panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/88 p-4 backdrop-blur-sm sm:p-6"
    >
      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        // Exits are faster than entrances. The spring gives the panel mass on
        // the way in — it settles rather than decelerating to a stop — but
        // letting that same spring run the exit kept the dialog on screen for
        // the better part of a second after Escape, which reads as the key
        // not having worked.
        exit={{
          opacity: 0,
          scale: 0.97,
          y: 8,
          transition: { duration: 0.16, ease: EASE_IN_OUT },
        }}
        transition={SPRING_SOFT}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={project.title[lang]}
        className={cn(
          "flex max-h-[90svh] w-full flex-col overflow-hidden rounded-lg border border-border-structural bg-surface shadow-float",
          project.category === "Mobile" && hasImages ? "max-w-4xl" : "max-w-3xl"
        )}
      >
        {/* Title bar, set as a path. No fake window chrome — the traffic
            lights that used to live here appeared in three components and
            turned every panel into the same imitation macOS window. */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-surface-2 px-4 py-3">
          <span className="truncate font-mono text-label uppercase text-faint">
            <span className="text-accent-dim">{"~/projects/"}</span>
            {project.id}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={m.close}
            data-cursor="link"
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-text sm:-mr-1 sm:h-8 sm:w-8"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {project.category === "Mobile" && hasImages ? (
            <div className="flex min-h-full flex-col lg:flex-row">
              <div className="flex shrink-0 items-start justify-center border-b border-border-faint bg-surface-2/30 p-8 lg:w-[45%] lg:border-b-0 lg:border-r">
                <div className="w-full max-w-[320px] lg:sticky lg:top-8">
                  <PhoneFrame>
                    <ImageCarousel
                      key={project.id}
                      images={d!.images!}
                      title={project.title[lang]}
                      altLabel={m.imageAlt}
                      orientation="portrait"
                    />
                  </PhoneFrame>
                </div>
              </div>
              <div className="flex-1 p-5 sm:p-8 lg:w-[55%]">
                <div className="mb-6 flex items-start justify-between gap-3">
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
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 font-mono text-xs sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
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
                    {project.github && (
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
                    {!project.github && !project.live && (
                      <span className="font-mono text-sm text-faint">
                        {p.privateRepo}
                      </span>
                    )}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <>
              {hasImages && (
                <ImageCarousel
                  key={project.id}
                  images={d!.images!}
                  title={project.title[lang]}
                  altLabel={m.imageAlt}
                  orientation="landscape"
                />
              )}
              <div className="p-5 sm:p-7">
                <div className="mb-6 flex items-start justify-between gap-3">
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
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 font-mono text-xs sm:grid-cols-2 md:grid-cols-4">
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
                    {project.github && (
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
                    {!project.github && !project.live && (
                      <span className="font-mono text-sm text-faint">
                        {p.privateRepo}
                      </span>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
