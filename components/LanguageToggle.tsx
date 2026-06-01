"use client";
import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLang } from "@/lib/i18n";
import type { Lang } from "@/data/translations";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "tr", label: "TR" },
];

export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside (desktop only)
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const select = (l: Lang) => {
    setLang(l);
    setOpen(false);
  };

  return (
    <>
      {/* Desktop Dropdown View */}
      <div ref={ref} className="relative hidden md:block">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className={cn(
            "flex items-center gap-1 border border-border px-2.5 py-1.5 font-mono text-xs font-bold transition-colors",
            open ? "border-accent text-accent" : "text-muted hover:border-accent hover:text-accent",
          )}
        >
          {lang.toUpperCase()}
          <svg
            className={cn("h-3 w-3 transition-transform", open && "rotate-180")}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-1 min-w-[70px] border border-border bg-surface shadow-neo-sm"
            >
              {OPTIONS.map((opt) => (
                <li key={opt.value}>
                  <button
                    role="option"
                    aria-selected={lang === opt.value}
                    onClick={() => select(opt.value)}
                    className={cn(
                      "w-full px-3 py-2 text-left font-mono text-xs font-bold transition-colors",
                      lang === opt.value
                        ? "bg-accent text-bg"
                        : "text-muted hover:bg-surface-2 hover:text-text",
                    )}
                  >
                    {opt.label}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Inline Selector View */}
      <div className="flex w-full items-center justify-between border border-border bg-surface-2/40 px-3 py-2.5 md:hidden">
        <span className="font-mono text-xs font-bold text-muted">LANGUAGE / DİL</span>
        <div className="flex gap-1">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => select(opt.value)}
              className={cn(
                "border px-3 py-1 font-mono text-xs font-bold transition-all",
                lang === opt.value
                  ? "border-accent bg-accent text-bg"
                  : "border-border text-muted hover:border-accent hover:text-text",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
