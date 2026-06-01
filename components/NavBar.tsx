"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, smoothScrollTo } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

const LINK_IDS = ["home", "about", "projects", "skills", "contact"] as const;

export default function NavBar() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);

  const LINKS = [
    { id: "home", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "projects", label: t.nav.work },
    { id: "skills", label: t.nav.skills },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = LINK_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    smoothScrollTo(id);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => go("home")}
          className="group font-mono text-base font-bold tracking-tight"
        >
          <span className="text-text">tolga</span>
          <span className="text-accent">osman</span>
          <span className="ml-0.5 inline-block w-2 animate-blink text-accent">
            _
          </span>
        </button>

        {/* Desktop links + language toggle */}
        <div className="hidden items-center gap-1 md:flex">
          <ul className="flex items-center gap-1">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => go(link.id)}
                  className={cn(
                    "relative px-3 py-2 font-mono text-sm transition-colors",
                    active === link.id
                      ? "text-accent"
                      : "text-muted hover:text-text",
                  )}
                >
                  {link.label}
                  {active === link.id && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-accent"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => go("contact")}
            className="ml-3 border-2 border-accent bg-accent px-4 py-1.5 font-mono text-sm font-bold text-bg shadow-neo-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
          >
            {t.nav.hireMe}
          </button>
          <div className="ml-3">
            <LanguageToggle />
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center border border-border md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                "h-0.5 w-5 bg-text transition-transform",
                menuOpen && "translate-y-2 rotate-45",
              )}
            />
            <span
              className={cn(
                "h-0.5 w-5 bg-text transition-opacity",
                menuOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "h-0.5 w-5 bg-text transition-transform",
                menuOpen && "-translate-y-2 -rotate-45",
              )}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-b border-border bg-bg/95 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => go(link.id)}
                    className={cn(
                      "w-full px-2 py-3 text-left font-mono text-sm",
                      active === link.id ? "text-accent" : "text-muted",
                    )}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li className="pt-2">
                <button
                  onClick={() => go("contact")}
                  className="w-full border-2 border-accent bg-accent px-4 py-2.5 font-mono text-sm font-bold text-bg shadow-neo-sm"
                >
                  {t.nav.hireMe}
                </button>
              </li>
              <li className="pt-2">
                <LanguageToggle />
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
