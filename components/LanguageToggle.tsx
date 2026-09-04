"use client";

import { motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import { SPRING_SNAP } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { Lang } from "@/data/translations";

const OPTIONS: readonly Lang[] = ["en", "tr"];

/**
 * A two-position switch rather than the dropdown this replaces.
 *
 * With exactly two languages, a listbox is three interactions (open, read,
 * pick) to accomplish one, and it needs its own open state, outside-click
 * handling and keyboard model. A segmented control shows both options at once
 * and costs one click — and at this size it fits inside the nav rail instead
 * of hanging a panel off it.
 *
 * `role="group"` with `aria-pressed` on each button, not a listbox: these are
 * toggles that take effect immediately, not a value being selected from a
 * list and committed later.
 */
export default function LanguageToggle() {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className="flex items-center gap-0.5 rounded-full border border-border-faint bg-surface/60 p-0.5"
    >
      {OPTIONS.map((option) => {
        const isActive = lang === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLang(option)}
            aria-pressed={isActive}
            data-cursor="link"
            className={cn(
              "relative rounded-full px-2.5 py-1 font-mono text-label uppercase transition-colors duration-200",
              isActive ? "text-bg" : "text-faint hover:text-text",
            )}
          >
            {isActive && (
              <motion.span
                layoutId="lang-pill"
                transition={SPRING_SNAP}
                className="absolute inset-0 rounded-full bg-accent"
              />
            )}
            <span className="relative">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
