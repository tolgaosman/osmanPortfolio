"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import type { Project, ProjectStatus } from "@/types";
import {
  ArrowUpRightIcon,
  CloseIcon,
  GitHubIcon,
} from "@/components/Icons";
import { useLang } from "@/lib/i18n";
import ImageCarousel from "./ImageCarousel";

const statusColor: Record<ProjectStatus, string> = {
  live: "text-[#28c840] border-[#28c840]/40",
  soon: "text-[#febc2e] border-[#febc2e]/40",
  wip: "text-accent border-accent/40",
  prod: "text-[#28c840] border-[#28c840]/40",
};

export default function ProjectModal({
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

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={project.title[lang]}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden border-2 border-border bg-surface shadow-neo"
      >
        {/* Window title bar */}
        <div className="flex shrink-0 items-center justify-between border-b-2 border-border bg-surface-2 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="font-mono text-xs text-muted">{project.id}.app</span>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.close}
            className="text-muted transition-colors hover:text-text"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <ImageCarousel
            images={d?.images}
            title={project.title[lang]}
            altLabel={m.imageAlt}
          />

          <div className="p-5 sm:p-7">
            {/* Heading */}
            <div className="mb-6 flex items-start justify-between gap-3">
              <h2 className="font-mono text-2xl font-bold text-text">
                {project.title[lang]}
              </h2>
              <span
                className={`shrink-0 border px-2 py-0.5 font-mono text-[10px] ${statusColor[project.status]}`}
              >
                {p.status[project.status]}
              </span>
            </div>

            {/* Overview */}
            <section className="mb-7">
              <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
                {m.overview}
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                {d?.overview[lang] ?? project.description[lang]}
              </p>
            </section>

            {/* Key features */}
            {d?.features?.length ? (
              <section className="mb-7">
                <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-accent">
                  {m.features}
                </h3>
                <ul className="space-y-2">
                  {d.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex gap-2.5 text-sm leading-relaxed text-muted"
                    >
                      <span className="mt-0.5 shrink-0 font-mono text-accent">
                        →
                      </span>
                      <span>{feature[lang]}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* Built with */}
            <section className="mb-7">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-accent">
                {m.builtWith}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-[11px] text-accent"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>

            {/* Info */}
            <section className="mb-7">
              <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-accent">
                {m.info}
              </h3>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 font-mono text-xs sm:grid-cols-4">
                <div>
                  <dt className="text-muted/60">{m.category}</dt>
                  <dd className="mt-0.5 text-text">{project.category}</dd>
                </div>
                <div>
                  <dt className="text-muted/60">{m.statusLabel}</dt>
                  <dd className="mt-0.5 text-text">{p.status[project.status]}</dd>
                </div>
                {d?.role && (
                  <div>
                    <dt className="text-muted/60">{m.role}</dt>
                    <dd className="mt-0.5 text-text">{d.role[lang]}</dd>
                  </div>
                )}
                {d?.year && (
                  <div>
                    <dt className="text-muted/60">{m.year}</dt>
                    <dd className="mt-0.5 text-text">{d.year}</dd>
                  </div>
                )}
              </dl>
            </section>

            {/* Links */}
            <section>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-accent">
                {m.links}
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border-2 border-border px-3 py-2 font-mono text-xs text-muted transition-colors hover:border-text hover:text-text"
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
                    className="inline-flex items-center gap-2 border-2 border-accent bg-accent/10 px-3 py-2 font-mono text-xs text-accent transition-colors hover:bg-accent hover:text-bg"
                  >
                    <ArrowUpRightIcon className="h-4 w-4" />
                    {p.live}
                  </a>
                )}
                {!project.github && !project.live && (
                  <span className="font-mono text-xs text-muted/60">
                    {p.privateRepo}
                  </span>
                )}
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
