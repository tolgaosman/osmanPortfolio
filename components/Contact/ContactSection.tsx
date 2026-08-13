"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import ContactForm from "./ContactForm";
import { socialLinks } from "@/data/skills";
import { ArrowUpRightIcon, SOCIAL_ICONS } from "@/components/Icons";
import { useLang } from "@/lib/i18n";

export default function ContactSection() {
  const { t } = useLang();
  const c = t.contact;

  const [copied, setCopied] = useState<string | null>(null);

  // On desktop, mailto:/tel: silently do nothing when no mail/phone handler is
  // configured. Copy the value to the clipboard as a reliable fallback while
  // still letting the native link fire on devices that support it.
  const copy = (value: string) => {
    navigator.clipboard?.writeText(value).then(
      () => {
        setCopied(value);
        setTimeout(() => setCopied((v) => (v === value ? null : v)), 2000);
      },
      () => {},
    );
  };

  const EMAIL = "tofbusiness2002@gmail.com";
  const PHONE = "+90 533 834 6699";

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute right-1/4 top-20 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          index={c.index}
          title={c.title}
          subtitle={c.subtitle}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_0.9fr]">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <ContactForm />
          </motion.div>

          {/* Social links + availability */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="flex flex-col gap-4"
          >
            <div className="border-2 border-border bg-surface p-6">
              <div className="flex items-center gap-2 font-mono text-sm">
                <span className="h-2.5 w-2.5 animate-pulse-dot rounded-full bg-accent" />
                <span className="text-accent">{c.available}</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {c.availableNote}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {socialLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.icon];
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between border-2 border-border bg-surface p-4 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-accent hover:shadow-neo-sm"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-text transition-colors group-hover:text-accent" />
                      <div>
                        <div className="font-mono text-sm font-bold text-text">
                          {link.label}
                        </div>
                        <div className="font-mono text-xs text-muted">
                          {link.handle}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRightIcon className="h-4 w-4 text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                  </a>
                );
              })}
            </div>

            <div className="space-y-3">
              <div className="group flex items-center justify-between gap-3 border-2 border-accent bg-accent/10 p-4 transition-colors hover:bg-accent/20">
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=tofbusiness2002@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 flex-1 items-center gap-2"
                >
                  <span className="break-all font-mono text-sm text-accent">
                    {EMAIL}
                  </span>
                  <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                {/* mailto:/tel: silently do nothing on many desktop setups
                    with no default handler configured — copy is a reliable
                    fallback that always works. */}
                <button
                  type="button"
                  onClick={() => copy(EMAIL)}
                  className="shrink-0 font-mono text-xs text-muted transition-colors hover:text-accent"
                >
                  {copied === EMAIL ? c.copied : c.copy}
                </button>
              </div>
              <div className="group flex items-center justify-between gap-3 border-2 border-accent bg-accent/10 p-4 transition-colors hover:bg-accent/20">
                <a
                  href="tel:+905338346699"
                  className="flex min-w-0 flex-1 items-center gap-2"
                >
                  <span className="font-mono text-sm text-accent">{PHONE}</span>
                  <ArrowUpRightIcon className="h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <button
                  type="button"
                  onClick={() => copy(PHONE)}
                  className="shrink-0 font-mono text-xs text-muted transition-colors hover:text-accent"
                >
                  {copied === PHONE ? c.copied : c.copy}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
