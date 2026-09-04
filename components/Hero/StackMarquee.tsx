"use client";

import { BrandMark } from "@/components/BrandMarks";
import { skillCategories } from "@/data/skills";

/**
 * The strip along the bottom of the hero: the real stack, scrolling.
 *
 * This is the honest version of the "services" rail the layout it descends
 * from used — those were invented capability labels with generic icons
 * standing in for abstract nouns. These are the actual entries from
 * data/skills.ts with the actual brand marks, so the row is checkable rather
 * than decorative.
 */
const SKILLS = skillCategories.flatMap((c) => c.skills);

function Row({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-10 pr-10"
      aria-hidden={ariaHidden || undefined}
    >
      {SKILLS.map((skill) => {
        return (
          <li
            key={skill}
            className="flex items-center gap-2.5 whitespace-nowrap font-mono text-label uppercase text-faint"
          >
            <BrandMark skill={skill} className="h-3.5 w-3.5 shrink-0 text-accent-dim" />
            {skill}
          </li>
        );
      })}
    </ul>
  );
}

export default function StackMarquee() {
  return (
    <div className="marquee-mask relative overflow-hidden border-y border-border-faint py-3.5">
      {/* The track holds the list twice and travels exactly -50%, so the loop
          returns to a visually identical frame with no seam and no JS. The
          second copy is aria-hidden: a screen reader should hear the stack
          once, not twice. */}
      <div className="marquee-track flex w-max">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  );
}
