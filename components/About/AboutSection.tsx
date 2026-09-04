"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import AboutPortrait from "./AboutPortrait";
import SectionLabel from "@/components/SectionLabel";
import ScrambleText from "@/components/ScrambleText";
import Reveal, { RevealItem } from "@/components/Reveal";
import { ExternalLinkIcon } from "@/components/Icons";
import { asset } from "@/lib/utils";
import { btnQuiet, btnSecondary } from "@/lib/buttons";
import { useLang } from "@/lib/i18n";

export default function AboutSection() {
  const { t } = useLang();
  const a = t.about;
  const proseRef = useRef<HTMLDivElement>(null);

  // Reading progress through the prose column. `scrollYProgress` bound
  // straight to `scaleY` is the one case Framer can hand to the compositor,
  // because nothing derives from it in between.
  const { scrollYProgress } = useScroll({
    target: proseRef,
    offset: ["start 75%", "end 65%"],
  });

  const facts = [
    { label: a.factLocationLabel, value: a.factLocation },
    { label: a.factEducationLabel, value: a.factEducation },
    { label: a.factLanguagesLabel, value: a.factLanguages },
  ];

  return (
    // A full-bleed slab on `surface`, one step up from the hero's ground. The
    // alternating plane is what separates sections here, in place of six
    // identical wells of whitespace.
    <section
      id="about"
      className="plane relative z-10 border-y border-border-structural bg-surface"
    >
      <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-28">
        {/* Folio. Large enough to sit genuinely behind the columns rather than
            above them — a numeral you cannot quite read because the text is
            standing on it reads as printed into the stock, not stamped on. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-3 top-2 -z-10 select-none font-display text-[clamp(3.5rem,20vw,17rem)] font-bold leading-[0.7] text-accent-dim/25 sm:-left-8"
        >
          01
        </span>

        <div className="relative grid gap-14 lg:grid-cols-[19rem_1fr] lg:gap-16">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <SectionLabel index="01">{a.label}</SectionLabel>

            {/* The sidebar enters from the left against the prose's rise, so
                the two columns arrive as two things rather than one block. */}
            <Reveal stagger={0.07} variant="slideL" className="mt-8">
              <RevealItem
                as="h2"
                variant="unmask"
                className="font-display text-sub font-medium text-text"
              >
                <ScrambleText text={a.title} />
              </RevealItem>

              {/* The photograph, with its background. It sits between the
                  title and the readout so the column reads top-down as
                  name → face → facts, and it travels with the sticky aside
                  rather than scrolling away from the prose it belongs to. */}
              <RevealItem className="mt-8">
                <AboutPortrait />
              </RevealItem>

              {/* A readout, not three cards. These are the only content on the
                  page that is a set of discrete equal-weight data points, and
                  a key/value list with dotted leaders says that in less ink
                  than three bordered boxes — which is also the difference
                  between "printed" and "dashboard". */}
              <RevealItem as="dl" className="mt-9 space-y-3.5">
                {facts.map(({ label, value }) => (
                  // Two shapes, because the leader needs width to exist.
                  // Both the key and the value used to be `shrink-0` in a
                  // non-wrapping row: "EDUCATION / Eastern Mediterranean
                  // University (Senior)" measures ~408px of 12px mono against
                  // 335px of usable width at 375px, and `body { overflow-x:
                  // clip }` threw the overflow away with nothing on screen to
                  // say so. Below `sm` the pair stacks and the leader is gone
                  // — a dotted rule between two lines is not a leader, it is
                  // a divider — and from `sm` up the readout returns.
                  <div key={label} className="font-mono text-xs">
                    <div className="flex items-baseline gap-2">
                      <dt className="shrink-0 uppercase text-faint">{label}</dt>
                      <span
                        aria-hidden="true"
                        className="hidden min-w-4 flex-1 translate-y-[-0.2em] border-b border-dotted border-border sm:block"
                      />
                      <dd className="hidden shrink-0 text-right text-text sm:block">
                        {value}
                      </dd>
                    </div>
                    <dd className="mt-0.5 text-text sm:hidden">{value}</dd>
                  </div>
                ))}
              </RevealItem>

              <RevealItem className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
                {/* Routes through the site's own /cv viewer rather than the
                    raw file — that route is in the sitemap and deserves a way
                    in. Download stays quiet: same document, other route. */}
                <Link href="/cv" data-cursor="link" className={`${btnSecondary} group`}>
                  {a.viewCv}
                  <ExternalLinkIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
                <a
                  href={asset("/osmanCV.pdf")}
                  download="osmanCV.pdf"
                  data-cursor="link"
                  className={btnQuiet}
                >
                  {a.downloadCv}
                </a>
              </RevealItem>
            </Reveal>
          </aside>

          <div ref={proseRef} className="relative">
            {/* Reading rail. Real progress through this column — not a
                decorative gauge and not a number anyone has to trust. */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 hidden w-px bg-border-faint lg:block"
            >
              <motion.div
                style={{ scaleY: scrollYProgress }}
                className="h-full w-px origin-top bg-accent"
              />
            </div>

            {/* Prose is PRIMARY text at reading size. Body copy in `muted` is
                a template habit: it makes the one thing people came to read
                the least legible thing on the page. */}
            <Reveal
              stagger={0.09}
              className="max-w-[46rem] space-y-6 text-lede text-text lg:pl-10"
            >
              {/* No drop cap. It belonged to the serif this page used to be
                  set in; Space Grotesk's capital I is a bare stem, so a 4rem
                  first-letter on a paragraph starting "I'm" renders as a
                  stray quotation mark rather than as an initial. */}
              <RevealItem as="p" data-cursor="text">
                {a.p1}
              </RevealItem>
              <RevealItem as="p" data-cursor="text">
                {a.p2}
              </RevealItem>
              <RevealItem as="p" data-cursor="text">
                {a.p3}
              </RevealItem>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
