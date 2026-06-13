import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

// Content-Security-Policy delivered via <meta> because the site is a static
// export on GitHub Pages, which cannot set real HTTP response headers and
// cannot mint a per-request nonce. 'unsafe-inline' is required for Next's
// hydration payload + Framer Motion inline-style attributes; everything else
// is locked to same-origin. `frame-ancestors 'none'` replaces X-Frame-Options
// (anti-clickjacking); `object-src 'none'` + `base-uri 'self'` close common
// injection vectors. See SECURITY.md for the rationale and the header set you
// should add when fronting this site with a real server/CDN.
const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://wa.me mailto:",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self' https://api.emailjs.com",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

export const metadata: Metadata = {
  title: "Tolga Osman Falay — Software Engineering Student & Web/Mobile Developer",
  description:
    "Software Engineering student building clean, scalable web and mobile experiences — from interface to deployment.",
  keywords: [
    "Software Engineering Student",
    "Web Developer",
    "Mobile Developer",
    "Next.js",
    "Flutter",
    "Tolga Osman",
  ],
  authors: [{ name: "Tolga Osman" }],
  openGraph: {
    title: "Tolga Osman — Software Engineering Student & Web/Mobile Developer",
    description:
      "Software Engineering student building clean, scalable web and mobile experiences.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full bg-bg text-text antialiased">
        {/* Security headers — hoisted into <head> by React 19. */}
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
