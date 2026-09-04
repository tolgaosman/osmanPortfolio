"use client";

import Link from "next/link";
import { asset } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { btnQuiet, btnSecondarySm } from "@/lib/buttons";
import { ArrowUpRightIcon, ExternalLinkIcon } from "@/components/Icons";

/**
 * The viewer used to be a bare full-screen <iframe> with no chrome: no way
 * back to the site, and nothing at all for a browser that refuses to display
 * a PDF inline (mobile Safari and Firefox's pdf.js opt-outs both do). About's
 * primary CV action points here, so a dead end was reachable in one click.
 *
 * The fallback message used to live BETWEEN the iframe tags, on the theory
 * that a browser without inline-PDF support renders that content instead.
 * It doesn't: `<iframe>`'s content model is legacy text (like `<title>` or
 * `<textarea>`), so the HTML parser reads everything between the tags as a
 * raw string, never as elements — no browser shipping today falls back to
 * it. React's SSR, unaware of that special parsing rule, rendered a real
 * `<p>` there, so the server's markup and the client's re-parse of the same
 * bytes permanently disagreed and the whole tree re-hydrated on every load.
 * The fallback now lives in a persistent strip BELOW the iframe instead: a
 * real, always-reachable affordance that costs nothing when the PDF renders
 * fine and rescues the case when it doesn't — which is the actual guarantee
 * "there is a way to get the file" needs, not a browser trick nothing honors.
 */
export default function CvViewer() {
  const { t } = useLang();

  return (
    <div className="flex h-screen w-screen flex-col bg-bg">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border-structural px-4 py-3 sm:px-6">
        <Link href="/" className={`${btnSecondarySm} group`}>
          {/* The one arrow glyph in Icons.tsx, turned to point back west. */}
          <ArrowUpRightIcon className="h-3 w-3 -rotate-[135deg] transition-transform duration-300 group-hover:-translate-x-0.5" />
          {t.cv.back}
        </Link>
        <a
          href={asset("/osmanCV.pdf")}
          download="osmanCV.pdf"
          className={`${btnQuiet} inline-flex items-center gap-1.5`}
        >
          {t.cv.download}
          <ExternalLinkIcon className="h-3.5 w-3.5" />
        </a>
      </header>

      <iframe
        src={asset("/osmanCV.pdf")}
        className="min-h-0 flex-1 border-none"
        title="Tolga Osman CV"
      />

      <p className="shrink-0 border-t border-border-faint bg-surface px-4 py-2.5 text-center font-mono text-xs text-faint sm:px-6">
        {t.cv.fallback}{" "}
        <a
          href={asset("/osmanCV.pdf")}
          download="osmanCV.pdf"
          className="link-wipe text-accent"
        >
          {t.cv.download}
        </a>
      </p>
    </div>
  );
}
