"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { SPRING_SNAP } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Lang } from "@/data/translations";

const OPTIONS: readonly Lang[] = ["en", "tr"];

/**
 * Recessed two-position hardware switch (`EN` / `TR`).
 *
 * Matches the site's `rounded-md` instrument geometry: a sunken well
 * (`inset-shadow-well`) housing a tactile, spring-animated backlit keycap.
 */
export default function LanguageToggle() {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className="flex items-center gap-0.5 rounded-md border border-border-structural bg-bg/90 p-0.5 inset-shadow-well"
    >
      {OPTIONS.map((option) => {
        const isActive = lang === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={isActive}
            className={cn(
              "relative inline-flex min-h-9 items-center justify-center rounded-sm px-3 py-1.5 font-mono text-label font-semibold uppercase transition-colors duration-200 sm:min-h-0 sm:px-2.5 sm:py-1.5",
              isActive ? "text-bg" : "text-muted hover:text-text",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="lang-pill"
                transition={SPRING_SNAP}
                className="absolute inset-0 rounded-sm border border-accent-bright/50 bg-gradient-to-b from-accent-bright via-accent to-[#20c978] shadow-glow-sm inset-shadow-[0_1px_0_rgba(255,255,255,0.38)]"
              />
            )}
            <span className="relative">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
