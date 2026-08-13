"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, smoothScrollTo } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import LanguageToggle from "@/components/LanguageToggle";

const LINK_IDS = ["home", "about", "projects", "skills", "contact"] as const;
const MOBILE_MENU_ID = "mobile-nav-menu";

export default function NavBar() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  // Suppressed while a programmatic (smoothScrollTo) scroll is in flight, so
  // clicking a nav link doesn't trip the hide-on-scroll-down logic and make
  // the bar slide away mid-navigation.
  const suppressHideRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const LINKS = useMemo(
    () => [
      { id: "home", label: t.nav.home },
      { id: "about", label: t.nav.about },
      { id: "projects", label: t.nav.work },
      { id: "skills", label: t.nav.skills },
    ],
    [t],
  );

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return; // already scheduled this frame
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const currentScrollY = window.scrollY;
        setScrolled(currentScrollY > 16);

        if (!suppressHideRef.current) {
          if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
            setHidden(true);
          } else {
            setHidden(false);
          }
        }

        lastScrollY.current = currentScrollY;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const sections = LINK_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    // Track the entry with the greatest intersection ratio rather than the
    // last one to fire — when two sections intersect the tracking band at
    // once, "last in the callback's array order" was picking the wrong tab.
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        let bestId: string | null = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId) setActive(bestId);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll and allow Escape to close the mobile menu.
  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    suppressHideRef.current = true;
    smoothScrollTo(id);
    setHidden(false);
    // Matches the scroll animation duration in lib/utils.ts, plus a small
    // margin so the suppression outlives the last scroll event it triggers.
    window.setTimeout(() => {
      suppressHideRef.current = false;
    }, 700);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? "-100%" : 0, opacity: hidden ? 0 : 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8"
      >
        <button
          onClick={() => go("home")}
          className="group font-mono text-base font-bold tracking-tight"
        >
          <span className="text-text">tolga</span>
          <span className="text-accent">osman</span>
          <span
            aria-hidden
            className="ml-0.5 inline-block w-2 animate-blink text-accent"
          >
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
                  aria-current={active === link.id ? "true" : undefined}
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
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={menuOpen}
          aria-controls={MOBILE_MENU_ID}
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
            id={MOBILE_MENU_ID}
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
                    aria-current={active === link.id ? "true" : undefined}
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
