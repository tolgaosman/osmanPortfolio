import type { Project, ProjectCategory } from "@/types";

export const PROJECT_CATEGORIES: ("All" | ProjectCategory)[] = ["All", "Web", "Mobile"];

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
    featured: true,
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
        "/screenshots/alara-soysan/alara1.webp",
        "/screenshots/alara-soysan/alara2.webp",
        "/screenshots/alara-soysan/alara3.webp",
        "/screenshots/alara-soysan/alara4.webp",
        "/screenshots/alara-soysan/alara5.webp",
        "/screenshots/alara-soysan/alara6.webp",
        "/screenshots/alara-soysan/alara7.webp",
        "/screenshots/alara-soysan/alara8.webp",
      ],
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
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Laravel", "PHP", "MySQL"],
    github: "https://github.com/tolgaosman/staff-leave-tracker",
    live: "http://178.105.207.98:4003/login/",
    status: "intern",
    featured: true,
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
        en: "Full-stack Developer (Internship)",
        tr: "Tam Yığın (Full-stack) Geliştirici (Staj)",
      },
      year: "2024",
      images: [
        "/screenshots/staff-leave-tracker/1.png",
        "/screenshots/staff-leave-tracker/3.png",
        "/screenshots/staff-leave-tracker/4.png",
        "/screenshots/staff-leave-tracker/5.png",
        "/screenshots/staff-leave-tracker/6.png",
        "/screenshots/staff-leave-tracker/7.png",
        "/screenshots/staff-leave-tracker/8.png",
        "/screenshots/staff-leave-tracker/9.png",
        "/screenshots/staff-leave-tracker/10.png",
        "/screenshots/staff-leave-tracker/11.png",
        "/screenshots/staff-leave-tracker/12.png",
        "/screenshots/staff-leave-tracker/13.png",
        "/screenshots/staff-leave-tracker/14.png",
        "/screenshots/staff-leave-tracker/15.png",
        "/screenshots/staff-leave-tracker/16.png",
      ],
    },
  },
  {
    id: "inventory-management",
    title: {
      en: "Inventory Management System",
      tr: "Envanter Yönetim Sistemi",
    },
    description: {
      en: "A multi-warehouse inventory system with stock transfers, purchase orders, and critical-stock alerts.",
      tr: "Stok transferleri, satın alma siparişleri ve kritik stok uyarıları içeren çoklu depo envanter sistemi.",
    },
    category: "Web",
    stack: ["Next.js", "TypeScript", "Laravel", "PHP", "SQLite"],
    github: "https://github.com/tolgaosman/inventory-management",
    live: null,
    status: "intern",
    featured: true,
    details: {
      overview: {
        en: "An inventory and warehouse management system built during a second internship, sized for a company running 5 warehouses, around 2,000 products, and 10 suppliers. Warehouse staff log stock entries, exits, and inter-warehouse transfers; purchasing staff manage suppliers and purchase orders through Draft, Ordered, Received, and Cancelled stages; administrators get a dashboard with product counts, critical-stock alerts, and movement reporting. Backend is a Laravel API, frontend is Next.js with shadcn/ui — the same split as the Staff Leave Tracker.",
        tr: "İkinci bir staj sırasında geliştirilen, 5 depo, yaklaşık 2.000 ürün ve 10 tedarikçiyle çalışan bir şirket ölçeğinde tasarlanmış envanter ve depo yönetim sistemi. Depo personeli stok girişi, çıkışı ve depolar arası transferleri kaydediyor; satınalma personeli tedarikçileri ve satın alma siparişlerini Taslak, Sipariş Edildi, Teslim Alındı ve İptal aşamaları üzerinden yönetiyor; yöneticiler ürün sayıları, kritik stok uyarıları ve hareket raporlarını gösteren bir panel görüyor. Arka uç Laravel API, ön yüz shadcn/ui ile Next.js — Personel İzin Takip Sistemi ile aynı ayrım.",
      },
      features: [
        {
          en: "Multi-warehouse stock tracking with inter-warehouse transfer history",
          tr: "Depolar arası transfer geçmişiyle çoklu depo stok takibi",
        },
        {
          en: "Purchase order workflow with Draft / Ordered / Received / Cancelled status tracking",
          tr: "Taslak / Sipariş Edildi / Teslim Alındı / İptal durumlarıyla satın alma sipariş akışı",
        },
        {
          en: "Critical stock alerts when a product falls below its minimum threshold",
          tr: "Bir ürün minimum eşiğin altına düştüğünde kritik stok uyarısı",
        },
        {
          en: "Admin dashboard with product, warehouse, and daily movement metrics",
          tr: "Ürün, depo ve günlük hareket metrikleriyle yönetici paneli",
        },
      ],
      role: {
        en: "Full-stack Developer (Internship)",
        tr: "Tam Yığın (Full-stack) Geliştirici (Staj)",
      },
      year: "2026",
    },
  },
  {
    id: "sevgi-butik",
    title: {
      en: "Sevgi Butik",
      tr: "Sevgi Butik",
    },
    description: {
      en: "E-commerce platform for a clothing boutique offering diverse collections from dresses to accessories.",
      tr: "Elbiselerden aksesuarlara kadar geniş koleksiyonlar sunan bir giyim butiği için e-ticaret platformu.",
    },
    category: "Web",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    github: "https://github.com/tolgaosman/sevgi-butik",
    live: "https://sevgibutik.com",
    status: "live",
    featured: true,
    details: {
      overview: {
        en: "Sevgi Butik is a modern e-commerce platform built for a local clothing boutique in Düzova, Cyprus. The platform offers a seamless shopping experience with categorized collections including dresses, tops, bottoms, accessories, makeup, and kids' clothing. It features a responsive design, fast loading times, and a user-friendly interface that brings the boutique's curated selections to customers island-wide.",
        tr: "Sevgi Butik, Kıbrıs'ın Düzova bölgesindeki yerel bir giyim butiği için geliştirilmiş modern bir e-ticaret platformudur. Site, elbiseler, üst ve alt giyim, aksesuarlar, makyaj malzemeleri ve çocuk giyimi gibi kategorize edilmiş koleksiyonlarla kesintisiz bir alışveriş deneyimi sunar. Butiğin özenle seçilmiş ürünlerini tüm adaya ulaştıran duyarlı tasarıma, hızlı yüklenme sürelerine ve kullanıcı dostu bir arayüze sahiptir.",
      },
      features: [
        {
          en: "Comprehensive product catalog with advanced filtering and categories",
          tr: "Gelişmiş filtreleme ve kategoriler ile kapsamlı ürün kataloğu",
        },
        {
          en: "Fully responsive, mobile-first design for seamless shopping on any device",
          tr: "Her cihazda kesintisiz alışveriş için tamamen duyarlı, mobil öncelikli tasarım",
        },
        {
          en: "Integration with order tracking and customer account management",
          tr: "Sipariş takibi ve müşteri hesabı yönetimi entegrasyonu",
        },
      ],
      role: {
        en: "Full-stack Developer",
        tr: "Tam Yığın (Full-stack) Geliştirici",
      },
      year: "2024",
      images: [],
    },
  },
  {
    id: "ib-tattoo",
    title: {
      en: "tatt2me",
      tr: "tatt2me",
    },
    description: {
      en: "A modern portfolio and booking website for tattoo artist Irmak Bozkurt.",
      tr: "Dövme sanatçısı Irmak Bozkurt için modern portföy ve randevu web sitesi.",
    },
    category: "Web",
    stack: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
    github: null,
    live: "https://tatt2me.net",
    status: "live",
    featured: true,
    details: {
      overview: {
        en: "tatt2me is a minimalist portfolio and booking website built for Irmak Bozkurt, a tattoo artist based in North Cyprus. The site features a clean, responsive design that highlights the artist's fine line, neo-traditional, and geometric dot work. It includes a gallery of recent tattoos, a detailed explanation of the booking process, and an integrated contact form for appointment requests.",
        tr: "tatt2me, Kuzey Kıbrıs'ta yaşayan dövme sanatçısı Irmak Bozkurt için hazırlanmış minimalist bir portföy ve randevu web sitesidir. Site, sanatçının ince çizgi, neo-traditional ve geometrik nokta çalışmalarını öne çıkaran temiz ve duyarlı bir tasarıma sahiptir. Güncel dövmelerden oluşan bir galeri, randevu sürecinin detaylı bir açıklaması ve randevu talepleri için entegre bir iletişim formu içerir.",
      },
      features: [
        {
          en: "Minimalist design with a focus on typography and high-quality imagery",
          tr: "Tipografi ve yüksek kaliteli görsellere odaklanan minimalist tasarım",
        },
        {
          en: "Fully responsive layout optimized for all devices",
          tr: "Tüm cihazlar için optimize edilmiş tamamen duyarlı düzen",
        },
        {
          en: "Integrated booking form for easy appointment scheduling",
          tr: "Kolay randevu planlama için entegre rezervasyon formu",
        },
      ],
      role: {
        en: "Design + Full-stack build",
        tr: "Tasarım + Tam Yığın (Full-stack) Geliştirme",
      },
      year: "2024",
      images: [
        "/screenshots/ib-tattoo/1.jpeg",
        "/screenshots/ib-tattoo/2.jpeg",
        "/screenshots/ib-tattoo/3.jpeg",
        "/screenshots/ib-tattoo/4.jpeg",
        "/screenshots/ib-tattoo/5.jpeg",
        "/screenshots/ib-tattoo/6.jpeg",
      ],
    },
  },
];

