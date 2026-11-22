"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import SectionLabel from "@/components/SectionLabel";
import ScrambleText from "@/components/ScrambleText";
import Reveal, { RevealItem } from "@/components/Reveal";
import ContactForm from "./ContactForm";
import { SOCIAL_ICONS, ArrowUpRightIcon } from "@/components/Icons";
import { socialLinks } from "@/data/skills";
import { siteConfig, whatsappHref } from "@/data/site";
import { useLang } from "@/lib/i18n";
import { EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

export default function ContactSection() {
  const { t } = useLang();
  const c = t.contact;
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      // Clipboard access can be denied outright (insecure context, permission
      // policy). The value is still selectable text next to the button, so
      // failing quietly here leaves the user no worse off than before.
    }
  };

  const rows = [
    { label: c.emailLabel, value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { label: c.phoneLabel, value: siteConfig.phoneDisplay, href: whatsappHref },
  ];

  return (
    <section
      id="contact"
      className="plane relative z-10 border-t border-border-structural bg-surface"
    >
      <div className="mx-auto max-w-[92rem] px-5 py-20 sm:px-8 sm:py-28">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-3 top-2 -z-10 select-none font-display text-[clamp(3.5rem,20vw,17rem)] font-bold leading-[0.7] text-accent-dim sm:-left-8"
        >
          05
        </span>

        <SectionLabel index="05">{c.label}</SectionLabel>

        {/* See the note in SkillsSection: grid items are `min-width: auto` by
            default and the form's own min-content width was widening the
            track past the viewport. */}
        <div className="mt-10 grid gap-14 [&>*]:min-w-0 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal stagger={0.08} variant="slideL">
            <RevealItem
              as="h2"
              variant="unmask"
              className="max-w-xl font-display text-title font-medium text-text"
            >
              <ScrambleText text={c.title} />
            </RevealItem>

            <RevealItem as="p" className="mt-5 max-w-lg text-lede text-text">
              {c.subtitle}
            </RevealItem>

            {/* Availability, as a plain sentence. No pulsing green dot: a
                blinking status light is a claim about live state that nothing
                on a static site is actually checking. */}
            <RevealItem className="mt-8 border-l border-accent pl-5">
              <p className="font-mono text-sm text-accent">{c.available}</p>
              <p className="mt-1 text-sm text-muted">{c.availableNote}</p>
            </RevealItem>

            <RevealItem as="dl" className="mt-10 divide-y divide-border-faint border-y border-border-faint">
              {rows.map((row) => (
                <div
                  key={row.value}
                  className="flex flex-col items-start gap-2 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-x-4"
                >
                  <dt className="font-mono text-label uppercase text-faint">
                    {row.label}
                  </dt>
                  <dd className="flex min-w-0 flex-wrap items-center gap-3">
                    <a
                      href={row.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-wipe break-all font-mono text-sm text-text sm:break-normal"
                    >
                      {row.value}
                    </a>
                    <button
                      type="button"
                      onClick={() => copy(row.value)}
                      className="relative inline-flex min-h-9 items-center rounded-xs border border-border px-2.5 py-0.5 font-mono text-[0.625rem] uppercase text-faint transition-colors hover:border-accent-dim hover:text-accent sm:min-h-0 sm:px-2"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={copied === row.value ? "copied" : "copy"}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15, ease: EASE_OUT }}
                          className="block"
                        >
                          {copied === row.value ? c.copied : c.copy}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </dd>
                </div>
              ))}
            </RevealItem>

            <RevealItem className="mt-10">
              <h3 className="font-mono text-label uppercase text-faint">
                {t.footer.elsewhere}
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {socialLinks.map((link) => {
                  const Icon = SOCIAL_ICONS[link.icon];
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "group flex items-center gap-3.5 rounded-md border border-border bg-bg/75 px-3.5 py-3 shadow-lift inset-shadow-lip transition-[transform,border-color,background-color] duration-250",
                          "hover:-translate-y-0.5 hover:border-accent-dim hover:bg-surface-2",
                        )}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-border-faint bg-surface-2 text-muted transition-colors duration-200 group-hover:border-accent-dim group-hover:text-accent">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-sm text-text transition-colors group-hover:text-accent-bright">
                            {link.label}
                          </span>
                          <span className="block truncate font-mono text-xs text-faint">
                            {link.handle}
                          </span>
                        </span>
                        <ArrowUpRightIcon className="h-3.5 w-3.5 shrink-0 text-faint transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </RevealItem>
          </Reveal>

          <Reveal variant="slideR" duration={0.7}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
