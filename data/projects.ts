import type { Project, ProjectCategory } from "@/types";

export const PROJECT_CATEGORIES: ("All" | ProjectCategory)[] = ["All", "Web"];

export const projects: Project[] = [
  {
    id: "alara-soysan",
    title: {
      en: "Alara Soysan Portfolio",
      tr: "Alara Soysan Portföyü",
    },
    description: {
      en: "Minimalist branding portfolio with custom folder-tabs and polaroid-style image grids.",
      tr: "Klasör sekmeli tasarım ve polaroid resim ızgaralı minimalist pazarlama portföyü.",
    },
    category: "Web",
    stack: ["HTML", "CSS", "JavaScript"],
    github: "https://github.com/tolgaosman/webAS",
    live: "https://alarasysn.com",
    status: "live",
  },
  {
    id: "cigdem-durut",
    title: {
      en: "Dr. Çiğdem Dürüst Website",
      tr: "Dr. Çiğdem Dürüst Web Sitesi",
    },
    description: {
      en: "Professional counseling & booking platform with dynamic forms and WhatsApp integration.",
      tr: "Dinamik anamnez formu ve WhatsApp entegrasyonuna sahip danışmanlık platformu.",
    },
    category: "Web",
    stack: ["HTML", "CSS", "JavaScript", "Tailwind"],
    github: "https://github.com/tolgaosman/cigdemWebsite",
    live: "https://tolgaosman.github.io/cigdemWebsite/",
    status: "soon",
  },
  {
    id: "cahit-cenksoy-ivf",
    title: {
      en: "Dr. Cahit Cenksoy IVF Website",
      tr: "Dr. Cahit Cenksoy Tüp Bebek Web Sitesi",
    },
    description: {
      en: "High-performance IVF clinic platform with a 7-language system, RTL support, and custom treatment tools.",
      tr: "7 dilli çeviri sistemi, RTL desteği ve tedavi yönetim araçları içeren tüp bebek kliniği platformu.",
    },
    category: "Web",
    stack: ["HTML", "CSS", "JavaScript", "Tailwind", "i18n"],
    github: "https://github.com/tolgaosman/cahitCenksoyIVF",
    live: "https://tolgaosman.github.io/cahitCenksoyIVF/",
    status: "soon",
  },
];
