"use client";

import { motion } from "framer-motion";
import type { Project } from "@/types";
import { ArrowUpRightIcon, GitHubIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";

export default function ProjectCard({
  project,
  onSelect,
}: {
  project: Project;
  onSelect: (project: Project) => void;
}) {
  const { lang, t } = useLang();
  const p = t.projects;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, x: -6 }}
      className="group flex h-full flex-col border-2 border-border bg-surface transition-shadow duration-200 hover:shadow-neo"
    >
      {/* Window title bar */}
      <div className="flex items-center justify-between border-b-2 border-border bg-surface-2 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-xs text-muted">{project.id}.app</span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          {/* The card's real trigger — was previously a role="button" on the
              whole <article>, which invalidly nested the source/live <a>
              links below inside a button and made aria-label swallow the
              rest of the card's text from screen readers. */}
          <h3 className="font-mono text-xl font-bold text-text">
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="text-left underline-offset-4 hover:underline focus-visible:underline"
            >
              {project.title[lang]}
            </button>
          </h3>
          <span className="shrink-0 border border-border px-2 py-0.5 font-mono text-[10px] uppercase text-muted">
            {project.category}
          </span>
        </div>

        <p className="text-sm leading-relaxed text-muted">
          {project.description[lang]}
        </p>

        <div className="mt-auto pt-5">
          {/* Tech stack: always visible on mobile, hover-reveal on md+ */}
          <div className="mb-4 flex flex-wrap gap-2 md:max-h-0 md:overflow-hidden md:opacity-0 md:transition-all md:duration-300 md:group-hover:max-h-40 md:group-hover:opacity-100">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-[11px] text-accent"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center justify-between gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-text"
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
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-accent transition-colors hover:text-text"
                >
                  <ArrowUpRightIcon className="h-4 w-4" />
                  {p.live}
                </a>
              )}
              {!project.github && !project.live && (
                <span className="font-mono text-xs text-muted/75">
                  {p.privateRepo}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onSelect(project)}
              className="font-mono text-xs text-muted/75 transition-colors group-hover:text-accent hover:text-accent"
            >
              {p.viewDetails} →
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
