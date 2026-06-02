"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeading from "@/components/SectionHeading";
import SkillColumn from "./SkillColumn";
import { skillCategories } from "@/data/skills";
import { useLang } from "@/lib/i18n";
import {
  MessageSquare,
  Users,
  Shuffle,
  Zap,
  Search,
  Lightbulb,
  Clock,
} from "lucide-react";

const softSkillIcons = [
  MessageSquare,
  Users,
  Shuffle,
  Zap,
  Search,
  Lightbulb,
  Clock,
];

export default function SkillsSection() {
  const { t } = useLang();
  const s = t.skills;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="skills" className="relative bg-grid py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index={s.index}
          title={s.title}
          subtitle={s.subtitle}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {skillCategories.map((category, i) => (
            <SkillColumn key={category.name} category={category} colIndex={i} />
          ))}
        </div>

        {/* Soft Skills */}
        <div className="mt-6 border-2 border-border bg-surface p-6 transition-shadow hover:shadow-neo-border sm:p-8">
          <div className="mb-6 flex items-center justify-between border-b-2 border-border pb-4">
            <h3 className="font-mono text-lg font-bold text-text">
              {s.softSkillsTitle}
            </h3>
            <span className="font-mono text-xs text-accent">~/soft</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {s.softSkills.map((skill: string, i: number) => {
              const Icon = softSkillIcons[i] || Zap;
              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-2 border border-accent/40 bg-accent/10 px-3 py-1.5 transition-colors hover:bg-accent/20"
                >
                  <Icon className="h-4 w-4 text-accent" />
                  <span className="font-mono text-xs text-accent">{skill}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Highlight strip */}
        <div
          ref={ref}
          className="mt-12 grid grid-cols-2 gap-px border-2 border-border bg-border lg:grid-cols-4"
        >
          {s.highlights.map((h, i) => (
            <motion.div
              key={h.label}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-surface p-6 text-center"
            >
              <div className="font-mono text-3xl font-bold text-accent text-glow sm:text-4xl">
                {h.value}
              </div>
              <div className="mt-2 font-mono text-xs text-muted">{h.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
