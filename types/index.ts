export type ProjectCategory = "Web";

export type ProjectStatus = "live" | "soon" | "wip" | "prod";

export interface Localized {
  en: string;
  tr: string;
}

export interface ProjectDetails {
  /** Longer narrative shown in the modal overview section */
  overview: Localized;
  /** Bullet highlights, each localized */
  features: Localized[];
  /** Short role descriptor, e.g. "Design + Full-stack build" */
  role?: Localized;
  /** Delivery year, e.g. "2024" */
  year?: string;
  /**
   * Real screenshot paths (wrapped with asset() at render).
   * When empty/undefined the carousel renders styled placeholder slides.
   */
  images?: string[];
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
  /** Extended content for the project detail modal */
  details?: ProjectDetails;
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
