"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { SkillCategory } from "@/types";
import { useLang } from "@/lib/i18n";
import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiTailwindcss,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiPython,
  SiFlutter,
  SiGithub,
  SiAnthropic,
  SiGoogle,
} from "@icons-pack/react-simple-icons";

const skillIconMap: Record<string, React.ElementType> = {
  "HTML5": SiHtml5,
  "CSS3": SiCss,
  "JavaScript": SiJavascript,
  "Tailwind": SiTailwindcss,
  "TypeScript": SiTypescript,
  "React": SiReact,
  "Next.js": SiNextdotjs,
  "Python": SiPython,
  "Dart / Flutter": SiFlutter,
  "Git / GitHub": SiGithub,
  "Claude Code": SiAnthropic,
  "Google Antigravity": SiGoogle,
};

export default function SkillColumn({
  category,
  colIndex,
}: {
  category: SkillCategory;
  colIndex: number;
}) {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const label = t.skills.categories[category.name];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: colIndex * 0.12 }}
      className="border-2 border-border bg-surface p-6 transition-shadow hover:shadow-neo-border"
    >
      <div className="mb-6 flex items-center justify-between border-b-2 border-border pb-4">
        <h3 className="font-mono text-lg font-bold text-text">{label}</h3>
        <span className="font-mono text-xs text-accent">{category.tag}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill, i) => {
          const Icon = skillIconMap[skill];
          return (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: colIndex * 0.12 + i * 0.04, duration: 0.25 }}
              className="flex items-center gap-2 border border-accent/40 bg-accent/10 px-3 py-1.5 transition-colors hover:bg-accent/20"
            >
              {Icon && <Icon className="h-4 w-4 text-accent" />}
              <span className="font-mono text-xs text-accent">{skill}</span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
