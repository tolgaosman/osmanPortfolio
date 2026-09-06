import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/lib/i18n";
import BootOverlay from "@/components/BootOverlay";
import { socialLinks, skillCategories } from "@/data/skills";
import { siteConfig } from "@/data/site";
import "./globals.css";

// Every face here must carry "latin-ext". Turkish needs ı ş ğ İ Ğ Ş, which
// live in Latin Extended-A — the "latin" subset alone drops them and the
// browser substitutes a system font mid-word (184 such characters in
// data/translations.ts). Verified for all three families before swapping.
//
// next/font parses these calls STATICALLY, so a shared constant for the
// subsets array or a spread is rejected at build time. They must be spelled
// out literally, once per family.
//
// No `weight` array anywhere below, on purpose: all three are real variable
// fonts. Passing weights downloads one static instance per weight per subset
// (3 families x 3 weights x 2 subsets is ~18 woff2 files and ~18 render-
// blocking preload hints). Omitting it ships one variable file per family per
// subset — six files — and every weight in the axis range comes free.
//
// Display face: the wall name, headings, project titles, the wordmark.
const spaceGrotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Mono is load-bearing here rather than decorative: every label, folio
// numeral, meta strip, terminal line and laptop screen is set in it.
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Body face — running prose only. Inter has a larger x-height than the
// Montserrat it replaces, which is why --text-lede steps down in globals.css.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Content-Security-Policy delivered via <meta> because the site is a static
// export on GitHub Pages, which cannot set real HTTP response headers and
// cannot mint a per-request nonce. 'unsafe-inline' is required for Next's
// hydration payload, Framer Motion's inline style attributes, and the two
// synchronous head scripts below; everything else is locked to same-origin.
// `frame-ancestors 'none'` is included for parity with a server-delivered
// CSP, though per spec it (like the rest of this policy) has no effect when
// delivered via <meta> — see SECURITY.md for the header set to add when
// fronting this site with a real server/CDN.
const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://wa.me mailto:",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  isDev
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
    : "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SITE_URL = siteConfig.url;
const SITE_TITLE = "Tolga Osman Falay — Software Engineering Student & Web/Mobile Developer";
const SITE_DESCRIPTION =
  "Software engineering student in Nicosia. I build websites and mobile apps end to end, from the first conversation to the live URL.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "Software Engineering Student",
    "Web Developer",
    "Mobile Developer",
    "Next.js",
    "Flutter",
    "Tolga Osman",
  ],
  authors: [{ name: siteConfig.shortName, url: SITE_URL }],
  alternates: {
    canonical: SITE_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: siteConfig.shortName,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f0d",
};

// Person schema for search engines — invisible, no rendered UI. Derived from
// the same data the page renders (data/skills.ts) so it cannot drift.
//
// Emitted as a PLAIN <script> tag, not <Script strategy="beforeInteractive">.
// That wrapper compiled this into Next's `self.__next_s` queue, which means
// the tag was absent from the exported HTML entirely and the structured data
// only materialised after the framework bundle booted — invisible to every
// crawler that does not execute JavaScript. Verified against out/index.html.
function personJsonLd() {
  const json = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: SITE_URL,
    jobTitle: "Software Engineering Student & Web/Mobile Developer",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Eastern Mediterranean University",
    },
    knowsAbout: skillCategories.flatMap((c) => c.skills),
    sameAs: socialLinks
      .filter((l) => l.icon !== "whatsapp")
      .map((l) => l.href),
  };
  return JSON.stringify(json);
}

// Runs synchronously during HTML parsing, before the first paint.
//
// Two jobs:
//   1. Apply the saved language to <html lang> before the static English
//      markup is painted.
//   2. Mark returning visitors so the boot overlay (which is in the static
//      HTML on every load) is hidden by CSS before it can ever be seen.
const HEAD_SCRIPT = `
try {
  var l = localStorage.getItem("lang");
  if (l === "tr" || l === "en") document.documentElement.lang = l;
  if (sessionStorage.getItem("booted") === "1") document.documentElement.dataset.booted = "1";
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script id="head-script" dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd() }}
        />
      </head>
      <body className="min-h-full bg-bg text-text antialiased" suppressHydrationWarning>
        {/* Security headers — hoisted into <head> by React 19. */}
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border-2 focus:border-accent focus:bg-bg focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-accent"
        >
          Skip to content
        </a>
        <MotionConfig reducedMotion="user">
          <LanguageProvider>
            {/* Both live outside <main> on purpose: `position: fixed` is
                containing-block'd to the nearest transformed ancestor, and
                the hero subtree is full of them. */}
            <BootOverlay />
            {children}
          </LanguageProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
