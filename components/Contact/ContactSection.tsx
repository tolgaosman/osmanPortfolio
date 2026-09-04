"use client";

import { useState } from "react";
import SectionLabel from "@/components/SectionLabel";
import Reveal, { RevealItem } from "@/components/Reveal";
import ContactForm from "./ContactForm";
import { socialLinks } from "@/data/skills";
import { siteConfig } from "@/data/site";
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

  const EMAIL = siteConfig.email;
  const PHONE = siteConfig.phoneDisplay;

  const directRows = [
    {
      value: EMAIL,
      label: c.emailLabel,
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}`,
      external: true,
    },
    {
      value: PHONE,
      label: c.phoneLabel,
      href: `tel:${siteConfig.phoneE164}`,
      external: false,
    },
  ];

  return (
    <section id="contact" className="plane-sheet relative border-t border-border-structural bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-[92rem] px-5 sm:px-8">
        <SectionLabel className="max-w-md">{c.label}</SectionLabel>

        <Reveal stagger={0.08} className="mt-8 max-w-2xl">
          <RevealItem as="h2" className="font-display text-title text-text">
            {c.title}
          </RevealItem>
          <RevealItem as="p" className="mt-4 font-sans text-lede text-muted">
            {c.subtitle}
          </RevealItem>
        </Reveal>

        {/* The form is now the wide column — the inverse of the old
            `1fr_0.9fr`, where a fake status dashboard took equal billing. */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <Reveal stagger={0.05} className="lg:order-2">
            <ContactForm />
          </Reveal>

          <Reveal stagger={0.06} className="lg:order-1">
            <RevealItem
              as="p"
              className="flex items-center gap-3 font-sans text-sm text-text"
            >
              <span aria-hidden className="h-1.5 w-1.5 bg-accent" />
              {c.available}
            </RevealItem>
            <RevealItem
              as="p"
              className="mt-3 font-sans text-sm leading-relaxed text-muted"
            >
              {c.availableNote}
            </RevealItem>

            {/* Direct contact + socials collapse into one hairline list. The
                old version had a 2-up grid of bordered social cards plus two
                accent-filled boxes — four different box treatments in one
                column. */}
            <RevealItem
              as="ul"
              className="mt-10 divide-y divide-border-faint border-y border-border"
            >
              {directRows.map((row) => (
                <li
                  key={row.value}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <a
                    href={row.href}
                    {...(row.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group flex min-w-0 flex-1 items-baseline gap-3"
                  >
                    <span className="w-16 shrink-0 font-sans text-label font-medium uppercase text-faint">
                      {row.label}
                    </span>
                    <span className="link-underline break-all font-sans text-sm text-text">
                      {row.value}
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => copy(row.value)}
                    className="shrink-0 font-sans text-label uppercase text-faint transition-colors hover:text-accent"
                  >
                    {copied === row.value ? c.copied : c.copy}
                  </button>
                </li>
              ))}

              {socialLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.icon];
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-4 py-3.5"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <Icon className="h-4 w-4 shrink-0 text-faint transition-colors group-hover:text-accent" />
                        <span className="font-sans text-sm text-text">
                          {link.label}
                        </span>
                        <span className="truncate font-sans text-sm text-faint">
                          {link.handle}
                        </span>
                      </span>
                      <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-faint transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                    </a>
                  </li>
                );
              })}
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
