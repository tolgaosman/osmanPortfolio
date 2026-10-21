"use client";

import Link from "next/link";
import { asset } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { btnQuiet, btnSecondary, btnSecondarySm } from "@/lib/buttons";
import { ArrowUpRightIcon, ExternalLinkIcon } from "@/components/Icons";

/**
 * PDF viewer component.
 *
 * Mobile browsers (iOS Safari and Android Chrome) cannot display PDFs inline
 * inside an <iframe>, resulting in a blank or unscrollable viewport.
 * On mobile, we provide dedicated actions to view the PDF natively in a new
 * tab or download it. On desktop, the inline <iframe> is preserved.
 */
export default function CvViewer() {
  const { lang, t } = useLang();
  const cvFile = lang === "tr" ? "osmanCVtr.pdf" : "osmanCVen.pdf";

  return (
    <div className="flex h-screen w-screen flex-col bg-bg">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border-structural px-4 py-3 sm:px-6">
        <Link href="/" className={`${btnSecondarySm} group`}>
          {/* The one arrow glyph in Icons.tsx, turned to point back west. */}
          <ArrowUpRightIcon className="h-3 w-3 -rotate-[135deg] transition-transform duration-300 group-hover:-translate-x-0.5" />
          {t.cv.back}
        </Link>
        <div className="flex items-center gap-2">
          <a
            href={asset(`/${cvFile}`)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnQuiet} inline-flex items-center gap-1.5`}
          >
            <span>{t.about.viewCv}</span>
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={asset(`/${cvFile}`)}
            download={cvFile}
            className={`${btnQuiet} inline-flex items-center gap-1.5`}
          >
            <span>{t.cv.download}</span>
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </header>

      {/* Desktop: inline iframe */}
      <div className="hidden min-h-0 flex-1 sm:block">
        <iframe
          src={asset(`/${cvFile}`)}
          className="h-full w-full border-none"
          title="Tolga Osman CV"
        />
      </div>

      {/* Mobile: clean card with direct native view & download actions */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center sm:hidden">
        <div className="max-w-sm space-y-4 rounded-xl border border-border-structural bg-surface p-6 shadow-lg">
          <p className="font-display text-lg font-medium text-text">
            Tolga Osman — CV
          </p>
          <p className="font-mono text-xs text-muted leading-relaxed">
            {t.cv.fallback}
          </p>
          <div className="flex flex-col gap-3 pt-2">
            <a
              href={asset(`/${cvFile}`)}
              target="_blank"
              rel="noopener noreferrer"
              className={btnSecondary}
            >
              <span>{t.about.viewCv}</span>
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </a>
            <a
              href={asset(`/${cvFile}`)}
              download={cvFile}
              className={btnSecondary}
            >
              <span>{t.cv.download}</span>
            </a>
          </div>
        </div>
      </div>

      <p className="hidden shrink-0 border-t border-border-faint bg-surface px-4 py-2.5 text-center font-mono text-xs text-faint sm:block sm:px-6">
        {t.cv.fallback}{" "}
        <a
          href={asset(`/${cvFile}`)}
          download={cvFile}
          className="link-wipe text-accent"
        >
          {t.cv.download}
        </a>
      </p>
    </div>
  );
}
