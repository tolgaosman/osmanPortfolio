"use client";

import React from "react";
import Link from "next/link";
import WallName from "@/components/Hero/WallName";
import { siteConfig } from "@/data/site";
import { socialLinks } from "@/data/skills";
import { useLang } from "@/lib/i18n";
import { smoothScrollTo } from "@/lib/utils";
import { btnSecondarySm } from "@/lib/buttons";

const FOOTER_SOCIALS = socialLinks.filter(
  (link) => link.icon === "github" || link.icon === "linkedin",
);

/**
 * Closes the page with the same wall name it opened with, cropped by the
 * bottom of the document so the type runs off the edge rather than sitting
 * politely inside a container. The hero's version is occluded by the figure;
 * this one is occluded by the end of the page — the bookend is the point.
 */
export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    if (document.getElementById("home")) {
      smoothScrollTo("home");
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className="crt relative overflow-hidden border-t border-border-structural bg-bg">
      <div className="mx-auto max-w-[92rem] px-5 pt-14 sm:px-8 sm:pt-16">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="font-mono text-label uppercase text-faint">
            {`// ${year}`}
          </p>

          <nav
            aria-label={t.footer.quickLinks}
            className="flex flex-wrap items-center justify-center gap-3 font-mono text-label uppercase"
          >
            {FOOTER_SOCIALS.map((link) => (
              <React.Fragment key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-wipe text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </a>
                <span aria-hidden="true" className="select-none text-border-structural">
                  /
                </span>
              </React.Fragment>
            ))}
            <Link
              href="/cv"
              className="link-wipe text-muted transition-colors hover:text-text"
            >
              {t.footer.cv}
            </Link>
          </nav>

          <button
            type="button"
            onClick={scrollToTop}
            className={btnSecondarySm}
          >
            {t.nav.backToTop}
          </button>
        </div>
      </div>

      {/* Bleeds off the bottom edge. -mb pulls the descender line under the
          document edge so the name is cut rather than centred in dead space. */}
      <div className="pointer-events-none -mb-[3vw] mt-10 flex justify-center">
        <WallName text={siteConfig.shortName.toUpperCase()} />
      </div>
    </footer>
  );
}
