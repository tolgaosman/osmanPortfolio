import type { Project, ProjectCategory } from "@/types";

export const PROJECT_CATEGORIES: ("All" | ProjectCategory)[] = ["All", "Web", "Mobile"];

export const projects: Project[] = [
  {
    id: "habits-plus",
    title: {
      en: "Habits+",
      tr: "Habits+",
    },
    description: {
      en: "Flutter habit-tracking app with streak tracking, daily side quests, calendar history, and per-habit insights.",
      tr: "Seri takibi, günlük yan görevler, takvim geçmişi ve alışkanlık bazlı içgörüler sunan Flutter alışkanlık takip uygulaması.",
    },
    category: "Mobile",
    stack: ["Flutter", "Dart"],
    github: "https://github.com/tolgaosman/mobil_habit_tracker",
    live: null,
    status: "prod",
    details: {
      overview: {
        en: "Habits+ is a mobile habit-tracking app built with Flutter, designed to turn daily routines into lasting behaviours. The home screen greets the user by name, shows a real-time completion ring, and lists today's habits with one-tap check-off. Habits are colour-coded by category — nutrition, hydration, fitness, productivity, learning — and each one tracks its own streak. A calendar-based History view logs completion rates day by day, while the Insights screen renders a GitHub-style activity heatmap per habit. Side Quests adds a gamified twist: three randomly generated challenges each day, rated Easy / Medium / Hard, with a countdown timer and a searchable archive of past quest sets.",
        tr: "Habits+, Flutter ile geliştirilmiş ve günlük rutinleri kalıcı davranışlara dönüştürmek için tasarlanmış bir mobil alışkanlık takip uygulamasıdır. Ana ekran kullanıcıyı adıyla karşılar, gerçek zamanlı bir tamamlama halkası gösterir ve bugünkü alışkanlıkları tek dokunuşla işaretlenebilir şekilde listeler. Alışkanlıklar kategoriye göre renk kodlanır — beslenme, hidrasyon, fitness, üretkenlik, eğitim — ve her biri kendi serisini takip eder. Takvim tabanlı Geçmiş görünümü tamamlanma oranlarını gün gün kaydederken, İçgörüler ekranı her alışkanlık için GitHub tarzı bir aktivite ısı haritası oluşturur. Yan Görevler ise oyunlaştırılmış bir boyut katar: her gün rastgele üretilen üç görev, Kolay / Orta / Zor olarak derecelendirilir, geri sayım sayacı ve geçmiş görev setlerinin aranabilir arşiviyle birlikte sunulur.",
      },
      features: [
        {
          en: "Real-time completion ring and percentage counter on the home screen",
          tr: "Ana ekranda gerçek zamanlı tamamlama halkası ve yüzde sayacı",
        },
        {
          en: "Per-habit streak counter with flame indicator",
          tr: "Alev göstergeli alışkanlık bazlı seri sayacı",
        },
        {
          en: "Five habit categories with distinct colour coding (nutrition, hydration, fitness, productivity, learning)",
          tr: "Farklı renk kodlarıyla beş alışkanlık kategorisi (beslenme, hidrasyon, fitness, üretkenlik, eğitim)",
        },
        {
          en: "Calendar history view with daily completion rates and per-habit log",
          tr: "Günlük tamamlanma oranları ve alışkanlık bazlı kayıt içeren takvim geçmişi",
        },
        {
          en: "GitHub-style activity heatmap per habit in the Insights screen",
          tr: "İçgörüler ekranında alışkanlık başına GitHub tarzı aktivite ısı haritası",
        },
        {
          en: "Side Quests: daily Easy / Medium / Hard challenges with countdown timer and past-quest archive",
          tr: "Yan Görevler: geri sayım sayacı ve geçmiş görev arşiviyle günlük Kolay / Orta / Zor görevler",
        },
        {
          en: "New habit creation with category picker, repeat-day selector, and notification/alarm reminder",
          tr: "Kategori seçici, tekrar günü ayarı ve bildirim/alarm hatırlatıcı ile yeni alışkanlık oluşturma",
        },
      ],
      role: {
        en: "Design + Mobile build",
        tr: "Tasarım + Mobil geliştirme",
      },
      year: "2026",
      images: [
        "/screenshots/habits-plus/habits1.jpg",
        "/screenshots/habits-plus/habits2.jpg",
        "/screenshots/habits-plus/habits3.jpg",
        "/screenshots/habits-plus/habits4.jpg",
        "/screenshots/habits-plus/habits5.jpg",
        "/screenshots/habits-plus/habits6.jpg",
        "/screenshots/habits-plus/habits7.jpg",
      ],
    },
  },
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
    id: "cigdem-durust",
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
      images: [
        "/screenshots/cigdem-durut/cigdem1.png",
        "/screenshots/cigdem-durut/cigdem2.png",
        "/screenshots/cigdem-durut/cigdem3.png",
        "/screenshots/cigdem-durut/cigdem4.png",
        "/screenshots/cigdem-durut/cigdem5.png",
        "/screenshots/cigdem-durut/cigdem6.png",
        "/screenshots/cigdem-durut/cigdem7.png",
        "/screenshots/cigdem-durut/cigdem8.png",
        "/screenshots/cigdem-durut/cigdem9.png",
      ],
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
  {
    id: "staff-leave-tracker",
    title: {
      en: "Staff Leave Tracker",
      tr: "Personel İzin Takip Sistemi",
    },
    description: {
      en: "A full-stack staff leave management system built with Next.js and Laravel.",
      tr: "Next.js ve Laravel ile geliştirilmiş tam yığın personel izin yönetim platformu.",
    },
    category: "Web",
    stack: ["Next.js", "React", "Tailwind CSS", "Laravel", "PHP", "MySQL"],
    github: "https://github.com/tolgaosman/staff-leave-tracker-frontend",
    live: null,
    status: "wip",
    details: {
      overview: {
        en: "Staff Leave Tracker is a comprehensive human resources tool designed to streamline the process of requesting and managing employee leave. Built with a modern Next.js frontend and a robust Laravel backend, it allows staff to easily submit leave requests, while administrators can review, approve, or deny them through a dedicated dashboard. The system features dynamic calendar views, automated email notifications, and detailed reporting to ensure clear communication and efficient workforce planning.",
        tr: "Personel İzin Takip Sistemi, çalışan izinlerini talep etme ve yönetme sürecini kolaylaştırmak için tasarlanmış kapsamlı bir insan kaynakları aracıdır. Modern Next.js ön yüzü ve güçlü Laravel arka planı ile geliştirilmiş olup, personelin kolayca izin talebinde bulunmasına olanak tanırken, yöneticilerin özel bir panel üzerinden bu talepleri incelemesini, onaylamasını veya reddetmesini sağlar. Sistem, net iletişim ve verimli işgücü planlaması sağlamak için dinamik takvim görünümleri, otomatik e-posta bildirimleri ve ayrıntılı raporlama özellikleri sunar.",
      },
      features: [
        {
          en: "User-friendly dashboard for submitting and tracking leave requests",
          tr: "İzin taleplerini göndermek ve takip etmek için kullanıcı dostu panel",
        },
        {
          en: "Admin interface for reviewing, approving, or denying employee leave",
          tr: "Çalışan izinlerini incelemek, onaylamak veya reddetmek için yönetici arayüzü",
        },
        {
          en: "Dynamic calendar integration for visualizing team availability",
          tr: "Ekip uygunluğunu görselleştirmek için dinamik takvim entegrasyonu",
        },
        {
          en: "Secure authentication and role-based access control",
          tr: "Güvenli kimlik doğrulama ve rol tabanlı erişim kontrolü",
        },
      ],
      role: {
        en: "Full-stack Developer",
        tr: "Tam Yığın (Full-stack) Geliştirici",
      },
      year: "2024",
      images: [
        "/screenshots/staff-leave-tracker/1.jpg",
        "/screenshots/staff-leave-tracker/2.jpg",
        "/screenshots/staff-leave-tracker/3.jpg",
        "/screenshots/staff-leave-tracker/4.jpg",
        "/screenshots/staff-leave-tracker/5.jpg",
        "/screenshots/staff-leave-tracker/6.jpg",
        "/screenshots/staff-leave-tracker/7.jpg",
        "/screenshots/staff-leave-tracker/8.jpg",
        "/screenshots/staff-leave-tracker/9.jpg",
        "/screenshots/staff-leave-tracker/10.jpg",
        "/screenshots/staff-leave-tracker/11.jpg",
        "/screenshots/staff-leave-tracker/12.jpg"
      ],
    },
  },
];
