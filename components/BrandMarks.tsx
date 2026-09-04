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
import type { ComponentType } from "react";

/**
 * Real brand marks for the real stack, keyed BY SKILL NAME.
 *
 * Never by array index. An index-keyed map silently reassigns every logo the
 * moment a skill is inserted or reordered in data/skills.ts, and nothing
 * fails loudly when it does — you just get Laravel's mark next to "React"
 * until someone notices.
 *
 * Only marks for things that actually exist as products. There is no icon
 * here standing in for an abstract noun ("performance", "clean code"): an
 * icon for an idea is filler, and filler is what this page does not have.
 */
export const BRAND_MARKS: Record<string, ComponentType<{ className?: string }>> = {
  HTML5: SiHtml5,
  // The package export is SiCss, not SiCss3.
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

export function BrandMark({
  skill,
  className,
}: {
  skill: string;
  className?: string;
}) {
  const Mark = BRAND_MARKS[skill];
  if (!Mark) return null;
  return <Mark className={className} />;
}
