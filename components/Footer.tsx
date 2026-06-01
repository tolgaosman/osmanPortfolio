"use client";

import { socialLinks } from "@/data/skills";
import { SOCIAL_ICONS } from "@/components/Icons";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t-2 border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
        <div className="font-mono text-sm">
          <span className="text-text">tolga</span>
          <span className="text-accent">osman</span>
          <span className="ml-2 text-muted">{`// ${year}`}</span>
        </div>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => {
            const Icon = SOCIAL_ICONS[link.icon];
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-muted transition-colors hover:text-accent"
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
