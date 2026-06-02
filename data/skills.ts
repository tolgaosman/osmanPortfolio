import type { SkillCategory, SocialLink } from "@/types";

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
    tag: "~/lang",
    skills: ["Python", "Dart / Flutter"],
  },
  {
    name: "tools",
    tag: "~/tools",
    skills: ["Git / GitHub", "Claude Code", "Google Antigravity"],
  },
];

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
    handle: "+90 533 834 6699",
    href: "https://wa.me/905338346699",
    icon: "whatsapp",
  },
  {
    label: "Instagram",
    handle: "@toigaosman",
    href: "https://www.instagram.com/toigaosman/",
    icon: "instagram",
  },
  {
    label: "Fiverr",
    handle: "tolgaosmanf",
    href: "https://www.fiverr.com/tolgaosmanf",
    icon: "fiverr",
  },
];
