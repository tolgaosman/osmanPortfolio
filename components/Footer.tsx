"use client";

import WallName from "@/components/Hero/WallName";
import { siteConfig } from "@/data/site";
import { useLang } from "@/lib/i18n";
import { smoothScrollTo } from "@/lib/utils";
import { btnSecondarySm } from "@/lib/buttons";

/**
 * Closes the page with the same wall name it opened with, cropped by the
 * bottom of the document so the type runs off the edge rather than sitting
 * politely inside a container. The hero's version is occluded by the figure;
 * this one is occluded by the end of the page — the bookend is the point.
 */
export default function Footer() {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="crt relative overflow-hidden border-t border-border-structural bg-bg">
      <div className="mx-auto max-w-[92rem] px-5 pt-16 sm:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <div>
            <p className="font-mono text-label uppercase text-faint">
              {`// ${year}`}
            </p>
          </div>

          <button
            onClick={() => smoothScrollTo("home")}
            data-cursor="link"
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
