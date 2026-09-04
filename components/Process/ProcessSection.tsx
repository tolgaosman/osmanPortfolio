"use client";

import SectionLabel from "@/components/SectionLabel";
import Reveal, { RevealItem } from "@/components/Reveal";
import { useLang } from "@/lib/i18n";

export default function ProcessSection() {
  const { t } = useLang();
  const p = t.process;

  return (
    // The shortest section on the page, and a band rather than a well: it
    // reads as a rule between Projects and Skills instead of a third stack
    // of cards.
    <section
      id="process"
      className="plane-sheet relative border-y border-border-structural bg-surface py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <span
          aria-hidden
          className="pointer-events-none absolute -left-2 top-2 -z-10 select-none font-display text-[clamp(5rem,13vw,11rem)] leading-[0.7] text-accent-dim/25 sm:-left-4"
        >
          02
        </span>

        <div className="relative flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <div>
            <SectionLabel className="w-40">{p.label}</SectionLabel>
            <h2 className="mt-6 max-w-2xl font-display text-sub text-text">
              {p.title}
            </h2>
          </div>
          <p className="font-sans text-sm text-muted">{p.subtitle}</p>
        </div>

        {/* Each step is a hairline, a numeral and two lines of text. The old
            version boxed all four in `border-2 ... bg-surface p-6` cards and
            faked the connection with absolutely-positioned 24px stubs; here
            the shared top rule and the column dividers do that honestly. */}
        <Reveal
          as="ol"
          stagger={0.1}
          className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-border-faint"
        >
          {p.steps.map((step, i) => (
            <RevealItem
              as="li"
              key={step.title}
              className="border-t border-border pt-5 lg:px-8 lg:first:pl-0 lg:last:pr-0"
            >
              <span className="font-display text-4xl leading-none text-accent-dim">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 font-display text-2xl text-text">
                {step.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted">
                {step.desc}
              </p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
