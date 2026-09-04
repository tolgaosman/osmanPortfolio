"use client";

import { socialLinks } from "@/data/skills";
import { SOCIAL_ICONS } from "@/components/Icons";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="plane-sheet border-t border-border-structural bg-surface">
      <div className="mx-auto flex max-w-[92rem] flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-lg text-text">
            Tolga Osman <span className="text-accent">Falay</span>
          </span>
          <span className="font-mono text-xs text-faint">{year}</span>
        </div>

        {/* Labelled, not bare icons — four unlabelled 20px glyphs read as an
            empty bar. The handles were already in data/skills.ts and went
            unused; this is the cheapest way to put real content back in the
            one section that had none. */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {socialLinks.map((link) => {
            const Icon = SOCIAL_ICONS[link.icon];
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-faint transition-colors hover:text-accent"
              >
                <Icon className="h-4 w-4" />
                <span className="font-sans text-sm text-muted group-hover:text-text">
                  {link.label}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
