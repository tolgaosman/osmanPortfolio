"use client";

import SectionLabel from "@/components/SectionLabel";
import ScrambleText from "@/components/ScrambleText";
import Reveal, { RevealItem } from "@/components/Reveal";
import TerminalPanel from "./TerminalPanel";
import { useLang } from "@/lib/i18n";

/**
 * Skills, as something you can actually operate.
 *
 * A list of technologies with progress bars next to them is the single most
 * common thing on a developer portfolio and the least believable: nobody can
 * verify "React 85%", and the number is invented. This section shows the same
 * data — straight out of data/skills.ts — inside a shell that answers real
 * commands against the real project list. The claim it makes is one the page
 * demonstrates rather than asserts.
 *
 * The terminal's opening transcript is a genuine `skills` run, so the full
 * categorised list is in the exported HTML as semantic markup for crawlers
 * and screen readers, with the interactivity layered on top.
 *
 * Narrower measure than its neighbours (max-w-6xl against the page's 92rem),
 * because a shell that runs the full width of a desktop reads as a log file.
 */
export default function SkillsSection() {
  const { t } = useLang();
  const s = t.skills;

  return (
    <section id="skills" className="crt relative bg-bg py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionLabel index="04">{s.label}</SectionLabel>

        {/* `[&>*]:min-w-0`: a grid item's default `min-width: auto` is its
            MIN-CONTENT width, so the terminal panel's longest unbreakable mono
            line was widening the whole track — 10px past a 320px viewport, and
            since the page clips rather than scrolls, invisibly. */}
        <div className="mt-10 grid gap-12 [&>*]:min-w-0 lg:grid-cols-[22rem_1fr] lg:gap-14">
          <Reveal stagger={0.08} variant="slideL">
            <RevealItem
              as="h2"
              variant="unmask"
              className="font-display text-title font-medium text-text"
            >
              <ScrambleText text={s.title} />
            </RevealItem>

            <RevealItem
              as="p"
              className="mt-4 text-sm leading-relaxed text-muted"
            >
              {s.subtitle}
            </RevealItem>

            {/* The coda. These are the things that have no logo and no
                command, so they are set as plain type rather than being given
                an invented icon each. */}
            <RevealItem className="mt-10 border-t border-border-faint pt-6">
              <h3 className="font-mono text-label uppercase text-accent">
                {s.softSkillsTitle}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {s.softSkills.map((item) => (
                  <li
                    key={item}
                    className="group flex items-baseline gap-3 text-sm text-text"
                  >
                    <span
                      aria-hidden="true"
                      className="h-px w-4 shrink-0 bg-accent-dim transition-all duration-300 group-hover:w-7 group-hover:bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          </Reveal>

          <Reveal variant="slideR" duration={0.7}>
            <TerminalPanel />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
