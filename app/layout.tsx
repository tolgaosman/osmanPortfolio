import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/lib/i18n";
import { socialLinks, skillCategories } from "@/data/skills";
import { siteConfig } from "@/data/site";
import "./globals.css";

// Every face here must carry "latin-ext". Turkish needs ı ş ğ İ Ğ Ş, which
// live in Latin Extended-A — the "latin" subset alone drops them and the
// browser substitutes a system font mid-word (184 such characters in
// data/translations.ts). Verify latin-ext support before swapping any family.
// next/font needs these spelled out literally — it parses the call statically,
// so a shared constant or a spread is rejected at build time.
// Body face. Instrument Sans is drawn as a companion to Instrument Serif,
// so the two share proportions; Inter, which this replaces, is the default
// sans of every generated portfolio and brought nothing the pair doesn't.
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Display face, headings only. High-contrast serif against the mono/sans
// pair so headings read as typeset rather than as terminal output.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Content-Security-Policy delivered via <meta> because the site is a static
// export on GitHub Pages, which cannot set real HTTP response headers and
// cannot mint a per-request nonce. 'unsafe-inline' is required for Next's
// hydration payload + Framer Motion inline-style attributes; everything else
// is locked to same-origin. `frame-ancestors 'none'` is included for parity
// with a server-delivered CSP, though per spec it (like the rest of this
// policy) has no effect when delivered via <meta> — see SECURITY.md for the
// header set to add when fronting this site with a real server/CDN.
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
const SITE_TITLE = "Tolga Osman — Software Engineering Student & Web/Mobile Developer";
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
  themeColor: "#14120f",
};

// Person schema for search engines — invisible, no rendered UI. Derived from
// the same data the page already renders (data/skills.ts) so it can't drift.
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

// Reads the saved language preference and sets <html lang> before first
// paint, so the static "en" markup never flashes for a returning Turkish
// visitor. Runs before hydration; CSP above already allows inline scripts.
const NO_FLASH_LANG_SCRIPT = `
try {
  var l = localStorage.getItem("lang");
  if (l === "tr" || l === "en") document.documentElement.lang = l;
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
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          id="lang-flash-prevent"
          dangerouslySetInnerHTML={{ __html: NO_FLASH_LANG_SCRIPT }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: personJsonLd() }}
        />
      </head>
      <body className="grain min-h-full bg-bg text-text antialiased" suppressHydrationWarning>
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
          <LanguageProvider>{children}</LanguageProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
