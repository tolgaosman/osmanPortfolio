"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn, smoothScrollTo } from "@/lib/utils";
import { EASE_OUT, SPRING_SNAP } from "@/lib/motion";
import { useScrollLock } from "@/lib/scroll-lock";
import { LG } from "@/lib/media";
import { btnSecondary } from "@/lib/buttons";
import { useLang } from "@/lib/i18n";
import { siteConfig } from "@/data/site";
import LanguageToggle from "@/components/LanguageToggle";

/**
 * These ids are a hard contract with the page. They drive the scroll-spy
 * observer AND `smoothScrollTo`, and nothing throws if a section is renamed —
 * the observer simply observes fewer elements and the active tab stops
 * moving. Rename here and in app/page.tsx together, or not at all.
 */
const LINK_IDS = ["home", "about", "projects", "process", "skills", "contact"] as const;
const MOBILE_MENU_ID = "mobile-nav-menu";

/**
 * Tuned to this header's height, not inherited. The scroll offset has to clear
 * the fixed band or every anchor lands with its heading tucked underneath; if
 * the band's padding changes, these numbers change with it.
 *
 * There are two, because the band is two heights: 10px vertical padding
 * around a 36px control on desktop, around a 44px control on mobile (which
 * never gets the `sm:` padding bump), plus breathing room. A single desktop
 * constant landed every mobile anchor low.
 */
const NAV_OFFSET = 72;
const NAV_OFFSET_SM = 80;

export default function NavBar() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  // Suppressed while a programmatic scroll is in flight, so clicking a nav
  // link cannot trip the hide-on-scroll-down rule and slide the bar away
  // mid-navigation.
  const suppressHideRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useScrollLock(menuOpen);

  const LINKS = useMemo(
    () => [
      { id: "home", label: t.nav.home },
      { id: "about", label: t.nav.about },
      { id: "projects", label: t.nav.work },
      { id: "process", label: t.nav.process },
      { id: "skills", label: t.nav.skills },
    ],
    [t],
  );

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return; // already scheduled this frame
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const y = window.scrollY;
        setScrolled(y > 16);
        if (!suppressHideRef.current) {
          setHidden(y > lastScrollY.current && y > 80);
        }
        lastScrollY.current = y;
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
    // last one to fire — when two sections cross the band at once, "last in
    // the callback's array" picks the wrong tab.
    const ratios = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
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

  /**
   * Dismissal. Escape was already handled; tapping the page was not, and on a
   * phone that is the gesture people actually reach for — the sheet covers a
   * sixth of the screen and the other five sixths did nothing. `pointerdown`
   * rather than `click` so it beats the scroll the tap would otherwise start,
   * and the header is excluded so the toggle's own click is not swallowed and
   * immediately re-opened.
   *
   * `inert` on <main> while the sheet is open is the same treatment the boot
   * overlay gives the page: without it, a screen reader and Tab both walk
   * straight past the sheet into content that is visually behind it.
   */
  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };

    const main = document.querySelector("main");
    // Captured now: by cleanup time React may have swapped the node the ref
    // points at, and the whole point is to return focus to the control this
    // effect was opened from.
    const toggle = toggleRef.current;
    main?.setAttribute("inert", "");

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      main?.removeAttribute("inert");
      // Back to the control that opened it — the sheet's own buttons are gone
      // by now, and focus on <body> strands a keyboard user at the top.
      toggle?.focus();
    };
  }, [menuOpen]);

  const go = (id: string) => {
    setMenuOpen(false);
    suppressHideRef.current = true;
    smoothScrollTo(
      id,
      window.matchMedia(LG).matches ? NAV_OFFSET : NAV_OFFSET_SM,
    );
    setHidden(false);
    // Matches the scroll animation duration in lib/utils.ts, plus a margin so
    // the suppression outlives the last scroll event it triggers.
    window.setTimeout(() => {
      suppressHideRef.current = false;
    }, 700);
  };

  const nameParts = siteConfig.name.split(" ");

  return (
    <motion.header
      ref={headerRef}
      animate={{ y: hidden && !menuOpen ? "-140%" : "0%" }}
      transition={{ duration: 0.35, ease: EASE_OUT }}
      className={cn(
        // A full-width band flush with the viewport edge, not a floating
        // pill: no top gap, no rounding, border-b instead of a border box. At
        // rest it is invisible chrome over the hero; once the page has moved
        // it becomes a real surface so the copy behind it cannot read
        // through the links.
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-bg/85 shadow-rail backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div
        // gap-2 / px-3 at the base size, not gap-4 / px-4: the wordmark, the
        // language toggle and a 44px menu control together ran 3px past a
        // 320px viewport, and the header is fixed — `body { overflow-x:
        // clip }` propagates to the viewport but a fixed element's
        // containing block IS the viewport, so it was the one thing on the
        // page that could genuinely be cut off at the edge.
        className="mx-auto flex max-w-[92rem] items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6"
      >
        <button
          onClick={() => go("home")}
          data-cursor="link"
          className="min-w-0 shrink font-display text-sm font-medium tracking-tight text-text sm:shrink-0 sm:text-base"
        >
          {nameParts.slice(0, -1).join(" ")}{" "}
          <span className="text-accent">{nameParts[nameParts.length - 1]}</span>
        </button>

        {/* Bare labels, not a pill rail. The active indicator is a shared
            layoutId underline, so switching sections slides one element
            instead of cross-fading two. */}
        <nav
          aria-label={t.nav.primaryNav}
          suppressHydrationWarning
          className="hidden items-center gap-6 lg:flex"
        >
          {LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <button
                key={link.id}
                onClick={() => go(link.id)}
                aria-current={isActive ? "true" : undefined}
                data-cursor="link"
                className={cn(
                  "relative px-1 py-1.5 font-mono text-label uppercase transition-colors duration-200",
                  isActive ? "text-accent" : "text-muted hover:text-text",
                )}
              >
                {link.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={SPRING_SNAP}
                    aria-hidden="true"
                    className="absolute inset-x-1 -bottom-1 h-px bg-accent"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <button
            onClick={() => go("contact")}
            data-cursor="link"
            // Outlined, not filled. `btnPrimary` carries `shadow-glow`, and
            // glow is scoped to THE primary action on the screen — with the
            // hero CTA already filled and lit, a second green pill in the rail
            // reads as two primary actions, which is no hierarchy at all.
            className={cn(btnSecondary, "hidden px-4 py-1.5 text-label uppercase sm:inline-flex")}
          >
            {t.nav.hireMe}
          </button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            data-cursor="link"
            className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-text lg:hidden"
          >
            {/* Two bars that rotate into a cross. One element per bar, both
                animating transform only, so nothing reflows mid-toggle. */}
            <span className="relative block h-3 w-4">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="absolute left-0 top-0 block h-px w-4 bg-current"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="absolute bottom-0 left-0 block h-px w-4 bg-current"
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id={MOBILE_MENU_ID}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.primaryNav}
            suppressHydrationWarning
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="mx-3 mt-2 overflow-hidden rounded-lg border border-border-structural bg-surface shadow-float sm:mx-6 lg:hidden"
          >
            <ul className="divide-y divide-border-faint">
              {[...LINKS, { id: "contact", label: t.nav.hireMe }].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => go(link.id)}
                    className={cn(
                      "flex w-full items-center justify-between px-5 py-3.5 font-mono text-sm transition-colors",
                      active === link.id
                        ? "text-accent"
                        : "text-muted hover:text-text",
                    )}
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-accent-dim">
                      {"->"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
