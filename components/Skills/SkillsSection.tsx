"use client";

import SectionLabel from "@/components/SectionLabel";
import Reveal, { RevealItem } from "@/components/Reveal";
import { skillCategories } from "@/data/skills";
import { projects } from "@/data/projects";
import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTailwindcss,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiFlutter,
} from "@icons-pack/react-simple-icons";

// Keyed by skill name, not by array position. The previous soft-skills list
// used `softSkillIcons[i] || Zap`, which silently remapped every icon if the
// translated strings were ever reordered.
const skillIconMap: Record<string, React.ElementType> = {
  HTML5: SiHtml5,
  CSS3: SiCss,
  JavaScript: SiJavascript,
  Tailwind: SiTailwindcss,
  TypeScript: SiTypescript,
  React: SiReact,
  "Next.js": SiNextdotjs,
  PHP: SiPhp,
  Laravel: SiLaravel,
  SQL: SiMysql,
  "Dart / Flutter": SiFlutter,
};

// Which real project each skill actually shipped in — curated by hand
// against each project's confirmed stack (data/projects.ts and, for
// Staff Leave Tracker / Inventory Management, their repos directly) rather
// than a guess. This is what turns "React" from a bare word into a
// checkable claim.
const skillProjectIds: Record<string, string[]> = {
  HTML5: ["alara-soysan", "cigdem-durust"],
  CSS3: ["alara-soysan", "cigdem-durust"],
  JavaScript: ["alara-soysan", "cigdem-durust"],
  Tailwind: ["cigdem-durust", "staff-leave-tracker"],
  TypeScript: ["staff-leave-tracker", "inventory-management"],
  React: ["staff-leave-tracker", "inventory-management"],
  "Next.js": ["staff-leave-tracker", "inventory-management"],
  PHP: ["staff-leave-tracker", "inventory-management"],
  Laravel: ["staff-leave-tracker", "inventory-management"],
  SQL: ["staff-leave-tracker", "inventory-management"],
  "Dart / Flutter": ["habits-plus"],
};

export default function SkillsSection() {
  const { lang, t } = useLang();
  const s = t.skills;

  const usedIn = (skill: string) =>
    (skillProjectIds[skill] ?? [])
      .map((id) => projects.find((p) => p.id === id)?.title[lang])
      .filter((v): v is string => Boolean(v));

  return (
    <section id="skills" className="py-20 sm:py-28">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <SectionLabel>{s.label}</SectionLabel>

        <Reveal stagger={0.08} className="mt-8 max-w-2xl">
          <RevealItem as="h2" className="font-display text-sub text-text">
            {s.title}
          </RevealItem>
          <RevealItem as="p" className="mt-3 font-sans text-base text-muted">
            {s.subtitle}
          </RevealItem>
        </Reveal>

        {/* Two columns instead of one narrow stack — the container widened
            to match its neighbours, and the extra width goes to laying the
            groups side by side rather than to a wider margin. */}
        <div className="mt-14 grid gap-x-16 gap-y-12 lg:grid-cols-2 lg:divide-x lg:divide-border">
          {skillCategories.map((category, i) => (
            <Reveal
              key={category.name}
              stagger={0.03}
              className={cn(i === 1 && "lg:pl-16")}
            >
              <RevealItem className="flex items-baseline justify-between border-b border-border pb-3">
                <h3 className="font-sans text-label font-medium uppercase text-text">
                  {s.categories[category.name]}
                </h3>
                <span className="font-mono text-xs text-faint">
                  {category.tag}
                </span>
              </RevealItem>

              {/* Real brand marks, not decorative icons standing in for
                  abstract nouns. Each row names the project it shipped in —
                  that "used in" line is what tells a percentage bar from a
                  fact. */}
              <ul className="mt-5 space-y-4">
                {category.skills.map((skill) => {
                  const Icon = skillIconMap[skill];
                  const credits = usedIn(skill);
                  return (
                    <li key={skill} className="flex items-start gap-3">
                      {Icon && (
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      )}
                      <div>
                        <span className="font-sans text-sm text-text">
                          {skill}
                        </span>
                        {credits.length > 0 && (
                          <p className="mt-0.5 font-mono text-xs text-faint">
                            {credits.join(" · ")}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          ))}
        </div>

        {/* Replaces the seven generic HR nouns (Communication, Teamwork,
            Adaptability…) with things that are actually checkable. */}
        <Reveal stagger={0.05} className="mt-16 max-w-2xl">
          <RevealItem
            as="h3"
            className="border-b border-border pb-3 font-sans text-label font-medium uppercase text-text"
          >
            {s.softSkillsTitle}
          </RevealItem>
          <ul className="mt-5 space-y-2.5">
            {s.softSkills.map((line) => (
              <RevealItem
                as="li"
                key={line}
                className="flex gap-3 font-sans text-base text-muted"
              >
                <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-accent" />
                {line}
              </RevealItem>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
