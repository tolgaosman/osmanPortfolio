import type { HeroService } from "@/types";

/**
 * Hero "services" strip — what I build + the stack behind it. Titles are
 * localized in data/translations.ts (hero.services); the stack list here is
 * language-agnostic (tech names don't translate).
 */
export const heroServices: HeroService[] = [
  { id: "web", stack: ["Next.js", "React", "TypeScript"] },
  { id: "mobile", stack: ["Flutter", "Dart"] },
  { id: "backend", stack: ["Laravel", "PHP", "SQL"] },
];
