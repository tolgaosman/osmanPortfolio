export type ProjectCategory = "Web";

export type ProjectStatus = "live" | "soon" | "wip" | "prod";

export interface Localized {
  en: string;
  tr: string;
}

export interface Project {
  id: string;
  title: Localized;
  description: Localized;
  category: ProjectCategory;
  stack: string[];
  /** Public source link, or null if private */
  github: string | null;
  /** Live deployment link, or null if none */
  live: string | null;
  status: ProjectStatus;
}

export type SkillCategoryName = "web" | "languages" | "tools";

export interface SkillCategory {
  name: SkillCategoryName;
  tag: string;
  skills: string[];
}

export interface SocialLink {
  label: string;
  handle: string;
  href: string;
  icon: "github" | "linkedin" | "whatsapp" | "instagram";
}
