"use client";

import SectionLabel from "@/components/SectionLabel";
import Reveal, { RevealItem } from "@/components/Reveal";
import Link from "next/link";
import { ExternalLinkIcon } from "@/components/Icons";
import { asset } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

export default function AboutSection() {
  const { t } = useLang();
  const a = t.about;

  const facts = [
    { label: a.factLocationLabel, value: a.factLocation },
    { label: a.factEducationLabel, value: a.factEducation },
    { label: a.factLanguagesLabel, value: a.factLanguages },
  ];

  return (
    // A full-bleed slab on `surface`. The alternating background is what
    // separates sections now, in place of six identical wells of whitespace.
    <section id="about" className="plane-sheet relative z-10 border-b border-border-structural bg-surface">
      <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-28">
        {/* Magazine folio. Used in two sections only — as wayfinding, not as
            a badge stamped on every heading like the old `01 // about`. */}
        {/* Large enough to sit genuinely behind the sidebar and prose rather
            than just above the fold — occlusion is free depth, and a folio
            numeral you can't quite read because the text is standing on it
            reads as printed into the stock, not pasted on top of it. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -left-3 top-2 -z-10 select-none font-display text-[clamp(7rem,20vw,17rem)] leading-[0.7] text-accent-dim/25 sm:-left-8"
        >
          01
        </span>

        <div className="relative grid gap-14 lg:grid-cols-[18rem_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel>{a.label}</SectionLabel>

            <Reveal stagger={0.07} className="mt-8">
              <RevealItem as="h2" className="font-display text-sub text-text">
                {a.title}
              </RevealItem>

              {/* Hairline definition list — the same three facts the old
                  3-up card grid held, minus the three boxes. */}
              <RevealItem as="dl" className="mt-8 divide-y divide-border-faint border-y border-border">
                {facts.map(({ label, value }) => (
                  <div key={label} className="flex flex-wrap justify-between gap-x-6 gap-y-1 py-3.5">
                    <dt className="font-sans text-label font-medium uppercase text-faint">
                      {label}
                    </dt>
                    <dd className="font-sans text-sm text-text">{value}</dd>
                  </div>
                ))}
              </RevealItem>

              <RevealItem className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {/* Routes through the site's own /cv viewer (app/cv/page.tsx)
                    rather than opening the raw file — that route existed and
                    was in the sitemap already, but nothing on the page linked
                    to it. */}
                <Link
                  href="/cv"
                  className="group inline-flex items-center gap-2 font-sans text-sm text-text transition-colors hover:text-accent"
                >
                  <span className="link-underline">{a.viewCv}</span>
                  <ExternalLinkIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={asset("/osmanCV.pdf")}
                  download="osmanCV.pdf"
                  className="link-underline font-sans text-sm text-muted transition-colors hover:text-text"
                >
                  {a.downloadCv}
                </a>
              </RevealItem>
            </Reveal>
          </aside>

          {/* Prose is primary text at reading size. Body copy in `muted` is a
              template habit — it makes the one thing people came to read the
              least legible thing on the page. */}
          <Reveal
            stagger={0.09}
            className="max-w-[46rem] space-y-6 font-sans text-lede text-text"
          >
            <RevealItem
              as="p"
              className="first-letter:float-left first-letter:mr-3 first-letter:mt-2 first-letter:font-display first-letter:text-[4.25rem] first-letter:leading-[0.72] first-letter:text-accent"
            >
              {a.p1}
            </RevealItem>
            <RevealItem as="p">{a.p2}</RevealItem>
            <RevealItem as="p">{a.p3}</RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
