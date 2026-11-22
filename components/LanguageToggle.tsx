"use client";

import { useLang } from "@/lib/i18n";
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

  const activeIndex = OPTIONS.indexOf(lang);

  return (
    <div
      role="group"
      aria-label={t.nav.language}
      className="relative grid grid-cols-2 gap-0.5 rounded-md border border-border-structural bg-bg/90 p-0.5 inset-shadow-well"
    >
      {/* The keycap is a plain CSS-transformed element, not a framer
          `layoutId`. A shared layout animation re-measures the switch on every
          parent render, so when the mobile sheet opened (scroll lock, URL-bar
          resize) the pill read a few pixels of drift and wobbled. Two equal
          columns make the travel exactly one cell + the gap. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0.5 grid grid-cols-2 gap-0.5">
        <span
          style={{ transform: `translateX(calc(${activeIndex} * (100% + 0.125rem)))` }}
          className={cn(
            "col-start-1 row-start-1 rounded-sm border border-accent-bright/50 bg-gradient-to-b from-accent-bright via-accent to-[#20c978] shadow-glow-sm inset-shadow-[0_1px_0_rgba(255,255,255,0.38)]",
            "transition-transform duration-300 ease-out",
          )}
        />
      </span>
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
            {option}
          </button>
        );
      })}
    </div>
  );
}
