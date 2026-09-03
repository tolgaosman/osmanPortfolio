import type { SkillCategory, SocialLink } from "@/types";
import { siteConfig, whatsappHref } from "./site";

export const skillCategories: SkillCategory[] = [
  {
    name: "web",
    tag: "~/web",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "Tailwind",
      "TypeScript",
      "React",
      "Next.js",
    ],
  },
  {
    name: "languages",
    tag: "~/backend",
    skills: ["PHP", "Laravel", "SQL", "Dart / Flutter"],
  },
];

/** Tag shown next to the soft-skills card, matching the `~/web` / `~/backend` style above. */
export const SOFT_SKILLS_TAG = "~/soft";

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    handle: "@tolgaosman",
    href: "https://github.com/tolgaosman",
    icon: "github",
  },
  {
    label: "LinkedIn",
    handle: "tolga-osman-falay",
    href: "https://www.linkedin.com/in/tolga-osman-falay-586b7440a/",
    icon: "linkedin",
  },
  {
    label: "WhatsApp",
    handle: siteConfig.phoneDisplay,
    href: whatsappHref,
    icon: "whatsapp",
  },
  {
    label: "Instagram",
    handle: "@toigaosman",
    href: "https://www.instagram.com/toigaosman/",
    icon: "instagram",
  },
];
