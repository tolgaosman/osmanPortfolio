"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLinkIcon, WhatsAppIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";
import { LIMITS, validateContact, type Channel } from "@/lib/validation";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border-2 border-border bg-bg px-4 py-3 font-mono text-sm text-text placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none";

const WHATSAPP_NUMBER = "905338346699";
const EMAIL = "tofbusiness2002@gmail.com";

export default function ContactForm() {
  const { t } = useLang();
  const c = t.contact;

  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [error, setError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError(false);
  };

  const pickChannel = (next: Channel) => {
    if (next === channel) return;
    setChannel(next);
    if (error) setError(false);
  };

  const send = () => {
    const { ok, values } = validateContact({ ...form, channel });
    if (!ok) {
      setError(true);
      return;
    }
    if (channel === "whatsapp") {
      const body = `Name: ${values.name}\nEmail: ${values.contact}\n\n${values.message}`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      const subject = `Portfolio contact — ${values.name}`;
      const body = `Name: ${values.name}\nPhone: ${values.contact}\n\n${values.message}`;
      const url = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const isMail = channel === "mail";

  return (
    <div className="border-2 border-border bg-surface p-6 sm:p-8">
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-mono text-xs text-muted"
          >
            <span className="text-accent">const</span> {c.nameLabel} =
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder={c.namePlaceholder}
            maxLength={LIMITS.name}
            autoComplete="name"
            className={inputClass}
          />
        </div>

        {/* Channel toggle */}
        <div className="flex gap-3">
          {(["whatsapp", "mail"] as const).map((ch) => {
            const active = channel === ch;
            return (
              <button
                key={ch}
                type="button"
                onClick={() => pickChannel(ch)}
                aria-pressed={active}
                className={cn(
                  "flex-1 border-2 px-4 py-2.5 font-mono text-sm transition-colors",
                  active
                    ? "border-accent bg-accent text-bg"
                    : "border-border text-muted hover:border-accent/50 hover:text-text",
                )}
              >
                {ch === "whatsapp" ? c.channelWhatsApp : c.channelMail}
              </button>
            );
          })}
        </div>

        {/* Conditional contact field */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={channel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <label
              htmlFor="contact"
              className="mb-2 block font-mono text-xs text-muted"
            >
              <span className="text-accent">const</span>{" "}
              {isMail ? c.phoneLabel : c.emailLabel} =
            </label>
            <input
              id="contact"
              name="contact"
              type={isMail ? "tel" : "email"}
              value={form.contact}
              onChange={handleChange}
              placeholder={isMail ? c.phonePlaceholder : c.emailPlaceholder}
              maxLength={isMail ? LIMITS.phone : LIMITS.email}
              autoComplete={isMail ? "tel" : "email"}
              className={inputClass}
            />
          </motion.div>
        </AnimatePresence>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block font-mono text-xs text-muted"
          >
            <span className="text-accent">const</span> {c.messageLabel} =
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder={c.messagePlaceholder}
            maxLength={LIMITS.message}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Send button — swaps by channel */}
        <div>
          {isMail ? (
            <button
              type="button"
              onClick={send}
              className="group flex w-full items-center justify-center gap-2 border-2 border-accent bg-accent/10 px-6 py-3.5 font-mono text-sm font-bold text-accent shadow-neo-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-accent hover:text-bg active:translate-x-0 active:translate-y-0"
            >
              <ExternalLinkIcon className="h-4 w-4" />
              {c.emailLabelBtn}
            </button>
          ) : (
            <button
              type="button"
              onClick={send}
              className="group flex w-full items-center justify-center gap-2 border-2 border-accent bg-accent px-6 py-3.5 font-mono text-sm font-bold text-bg shadow-neo-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
            >
              <WhatsAppIcon className="h-4 w-4" />
              {c.whatsappLabel}
            </button>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="font-mono text-xs text-[#fca5a5]"
            >
              {c.validationNote}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
