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
    details: {
      overview: {
        en: "A personal branding portfolio built for creative professional Alara Soysan. The design leans into a tactile, analog feeling — manila folder tabs for navigation and polaroid-style photo frames — while staying fast and fully responsive. Hand-built from scratch with vanilla HTML, CSS, and JavaScript, with no framework overhead, the site loads instantly and works flawlessly down to small mobile screens.",
        tr: "Yaratıcı profesyonel Alara Soysan için hazırlanmış kişisel marka portföyü. Tasarım; gezinme için klasör sekmeleri ve polaroid tarzı fotoğraf çerçeveleriyle dokunsal, analog bir his yakalarken hızlı ve tamamen duyarlı kalıyor. Hiçbir framework yükü olmadan sıfırdan saf HTML, CSS ve JavaScript ile inşa edildi; site anında yükleniyor ve küçük mobil ekranlara kadar kusursuz çalışıyor.",
      },
      features: [
        {
          en: "Custom folder-tab navigation that mimics a physical document organizer",
          tr: "Fiziksel bir dosya düzenleyiciyi taklit eden özel klasör-sekme navigasyonu",
        },
        {
          en: "Polaroid-style image grid with subtle tilt and hover interactions",
          tr: "İnce eğim ve hover etkileşimleri içeren polaroid tarzı resim ızgarası",
        },
        {
          en: "Fully responsive layout, optimized from desktop down to mobile",
          tr: "Masaüstünden mobile kadar optimize edilmiş tamamen duyarlı düzen",
        },
        {
          en: "Zero-dependency vanilla build for instant load times",
          tr: "Anında yükleme için bağımlılıksız saf (vanilla) yapı",
        },
        {
          en: "Deployed on a custom domain (alarasysn.com)",
          tr: "Özel alan adında yayında (alarasysn.com)",
        },
      ],
      role: {
        en: "Design + Front-end build",
        tr: "Tasarım + Ön yüz geliştirme",
      },
      year: "2024",
      images: [
        "/screenshots/alara-soysan/alara1.png",
        "/screenshots/alara-soysan/alara2.png",
        "/screenshots/alara-soysan/alara3.png",
        "/screenshots/alara-soysan/alara4.png",
        "/screenshots/alara-soysan/alara5.png",
        "/screenshots/alara-soysan/alara6.png",
        "/screenshots/alara-soysan/alara7.png",
        "/screenshots/alara-soysan/alara8.png",
      ],
    },
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
    details: {
      overview: {
        en: "A professional web presence for psychological counselor Dr. Çiğdem Dürüst, built to turn visitors into booked appointments. The site pairs a calm, trustworthy visual identity with practical conversion tools: dynamic intake (anamnesis) forms that adapt to the visitor's answers, and one-tap WhatsApp booking that hands the conversation straight to the practitioner. Styled with Tailwind CSS for a consistent, maintainable design system.",
        tr: "Psikolojik danışman Dr. Çiğdem Dürüst için, ziyaretçileri randevuya dönüştürmek üzere geliştirilmiş profesyonel bir web varlığı. Site; sakin ve güven veren görsel kimliği pratik dönüşüm araçlarıyla birleştiriyor: ziyaretçinin yanıtlarına göre uyarlanan dinamik anamnez formları ve görüşmeyi doğrudan uzmana aktaran tek dokunuşla WhatsApp randevusu. Tutarlı ve sürdürülebilir bir tasarım sistemi için Tailwind CSS ile şekillendirildi.",
      },
      features: [
        {
          en: "Dynamic anamnesis (intake) forms that adapt based on responses",
          tr: "Yanıtlara göre uyarlanan dinamik anamnez (ön değerlendirme) formları",
        },
        {
          en: "One-tap WhatsApp integration that pre-fills the booking message",
          tr: "Randevu mesajını önceden dolduran tek dokunuşla WhatsApp entegrasyonu",
        },
        {
          en: "Calm, trust-building visual identity tailored to counseling",
          tr: "Danışmanlığa uygun, sakin ve güven veren görsel kimlik",
        },
        {
          en: "Tailwind-powered design system for consistency and easy upkeep",
          tr: "Tutarlılık ve kolay bakım için Tailwind tabanlı tasarım sistemi",
        },
        {
          en: "Mobile-first, fully responsive across all devices",
          tr: "Mobil öncelikli, tüm cihazlarda tamamen duyarlı",
        },
      ],
      role: {
        en: "Design + Full-stack build",
        tr: "Tasarım + Tam yığın geliştirme",
      },
      year: "2024",
    },
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
    details: {
      overview: {
        en: "A high-performance platform for an international IVF clinic led by Dr. Cahit Cenksoy, engineered to reach patients across borders. The site ships with a full 7-language translation system — including right-to-left (RTL) layout support for Arabic — and a set of custom treatment tools that help prospective patients understand their options. Built lean with vanilla JavaScript and Tailwind so the experience stays snappy even on slow connections.",
        tr: "Dr. Cahit Cenksoy önderliğindeki uluslararası bir tüp bebek kliniği için, sınır ötesi hastalara ulaşmak üzere tasarlanmış yüksek performanslı bir platform. Site; Arapça için sağdan sola (RTL) düzen desteği dahil tam 7 dilli çeviri sistemiyle ve adayların seçeneklerini anlamasına yardımcı olan özel tedavi araçlarıyla geliyor. Yavaş bağlantılarda bile akıcı kalması için saf JavaScript ve Tailwind ile hafif şekilde inşa edildi.",
      },
      features: [
        {
          en: "7-language translation system covering the clinic's global audience",
          tr: "Kliniğin küresel kitlesini kapsayan 7 dilli çeviri sistemi",
        },
        {
          en: "Full right-to-left (RTL) layout support for Arabic",
          tr: "Arapça için tam sağdan sola (RTL) düzen desteği",
        },
        {
          en: "Custom treatment-information tools tailored to IVF patients",
          tr: "Tüp bebek hastalarına özel tedavi bilgilendirme araçları",
        },
        {
          en: "Performance-focused vanilla build for fast loads on any connection",
          tr: "Her bağlantıda hızlı yükleme için performans odaklı saf yapı",
        },
        {
          en: "Tailwind design system with a clean, clinical, trustworthy aesthetic",
          tr: "Temiz, klinik ve güven veren estetiğe sahip Tailwind tasarım sistemi",
        },
      ],
      role: {
        en: "Design + Full-stack build",
        tr: "Tasarım + Tam yığın geliştirme",
      },
      year: "2024",
    },
  },
];
