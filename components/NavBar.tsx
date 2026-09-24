"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { cn, smoothScrollTo } from "@/lib/utils";
import { EASE_OUT, SPRING_SNAP } from "@/lib/motion";
import { useScrollLock } from "@/lib/scroll-lock";
import { LG } from "@/lib/media";
import { btnSecondary } from "@/lib/buttons";
import { useLang } from "@/lib/i18n";
import { siteConfig } from "@/data/site";
import LanguageToggle from "@/components/LanguageToggle";

const LINK_IDS = ["home", "about", "projects", "process", "skills", "contact"] as const;
const MOBILE_MENU_ID = "mobile-nav-menu";

const NAV_OFFSET = 72;
const NAV_OFFSET_SM = 80;

type NavLink = { id: string; label: string; href?: string };

export default function NavBar() {
  const { t } = useLang();
  const pathname = usePathname();
  const router = useRouter();
  
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const suppressHideRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useScrollLock(menuOpen);

  const LINKS: NavLink[] = useMemo(
    () => [
      { id: "home", label: t.nav.home },
      { id: "about", label: t.nav.about },
      { id: "projects", label: t.nav.featuredWork }, // showcase
      { id: "all-projects", label: t.nav.work, href: "/projects" },
      { id: "process", label: t.nav.process },
      { id: "skills", label: t.nav.skills },
    ],
    [t],
  );

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current !== null) return;
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
    if (pathname === "/projects" || pathname === "/projects/") {
      setActive("all-projects");
      return;
    }

    const sections = LINK_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
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
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };

    const main = document.querySelector("main");
    const toggle = toggleRef.current;
    main?.setAttribute("inert", "");

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
      main?.removeAttribute("inert");
      toggle?.focus();
    };
  }, [menuOpen]);

  const go = (link: NavLink | { id: string, href?: string }) => {
    setMenuOpen(false);

    if (link.href) {
      if (pathname === link.href) return;
      router.push(link.href);
      return;
    }

    if (pathname !== "/") {
      router.push(`/#${link.id}`);
      return;
    }

    suppressHideRef.current = true;
    smoothScrollTo(
      link.id,
      window.matchMedia(LG).matches ? NAV_OFFSET : NAV_OFFSET_SM,
    );
    setHidden(false);
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
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled
          ? "border-border bg-bg/85 shadow-rail backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6">
        <button
          onClick={() => go({ id: "home" })}
          data-cursor="link"
          className="min-w-0 shrink font-display text-sm font-medium tracking-tight text-text sm:shrink-0 sm:text-base"
        >
          {nameParts.slice(0, -1).join(" ")}{" "}
          <span className="text-accent">{nameParts[nameParts.length - 1]}</span>
        </button>

        <nav
          aria-label={t.nav.primaryNav}
          suppressHydrationWarning
          className="hidden items-center gap-4 lg:flex"
        >
          {LINKS.map((link, index) => {
            const isActive = active === link.id;
            return (
              <React.Fragment key={link.id}>
                <button
                  onClick={() => go(link)}
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
                {index < LINKS.length - 1 && (
                  <span aria-hidden="true" className="text-border-faint select-none">
                    /
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <button
            onClick={() => go({ id: "contact" })}
            data-cursor="link"
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
                    onClick={() => go(link)}
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
