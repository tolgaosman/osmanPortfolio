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

export const metadata: Metadata = {
  title: "Tolga Osman — Software Engineering Student & Web/Mobile Developer",
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
  icons: {
    icon: "/browserLogo.png",
  },
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
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
