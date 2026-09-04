"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLinkIcon, WhatsAppIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";
import { LIMITS, validateContact, type Channel, type ContactFieldErrors } from "@/lib/validation";
import { cn } from "@/lib/utils";
import { btnPrimary } from "@/lib/buttons";
import { siteConfig } from "@/data/site";

// `text-base` below `sm`, not `text-sm`. iOS Safari force-zooms the viewport
// when a focused field is under 16px, and this page sets no `maximum-scale`
// (it must not — that disables pinch-zoom for everyone), so nothing zooms the
// page back out afterwards.
const inputClass =
  "w-full rounded-sm border border-border-strong bg-bg px-4 py-3 font-mono text-base text-text placeholder:text-faint transition-colors hover:border-muted focus:border-accent sm:text-sm";
const inputErrorClass = "border-danger";

const NO_ERRORS: ContactFieldErrors = { name: false, contact: false, message: false };

export default function ContactForm() {
  const { t } = useLang();
  const c = t.contact;

  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [form, setForm] = useState({ name: "", contact: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState<ContactFieldErrors>(NO_ERRORS);
  const [popupBlocked, setPopupBlocked] = useState(false);

  const isMail = channel === "mail";
  const hasErrors = fieldErrors.name || fieldErrors.contact || fieldErrors.message;

  const errorMessage = () => {
    const count = [fieldErrors.name, fieldErrors.contact, fieldErrors.message].filter(
      Boolean,
    ).length;
    if (count > 1) return c.errorMultiple;
    if (fieldErrors.name) return c.errorName;
    if (fieldErrors.contact) return isMail ? c.errorPhone : c.errorEmail;
    if (fieldErrors.message) return c.errorMessage;
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFieldErrors(NO_ERRORS);
    setPopupBlocked(false);
  };

  const pickChannel = (next: Channel) => {
    if (next === channel) return;
    setChannel(next);
    setFieldErrors(NO_ERRORS);
    setPopupBlocked(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPopupBlocked(false);

    const { ok, values, errors } = validateContact({ ...form, channel });
    if (!ok) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors(NO_ERRORS);

    let win: Window | null;
    if (channel === "whatsapp") {
      const body = `${c.msgName}: ${values.name}\n${c.msgEmail}: ${values.contact}\n\n${values.message}`;
      const url = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(body)}`;
      win = window.open(url, "_blank");
    } else {
      const subject = `${c.msgSubject} ${values.name}`;
      const body = `${c.msgName}: ${values.name}\n${c.msgPhone}: ${values.contact}\n\n${values.message}`;
      const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      win = window.open(url, "_blank");
    }

    // window.open returns null (or a closed/inaccessible window) when the
    // popup was blocked — previously that return value was discarded, so a
    // user whose message silently failed to send had no idea anything went
    // wrong.
    if (!win || win.closed) {
      setPopupBlocked(true);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="overflow-hidden rounded-lg border border-border-structural shadow-lift"
    >
      {/* Header bar, matching the skills shell and the boot screen. The three
          of them are one instrument, not three unrelated panels. */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-surface-2 px-4 py-2.5">
        <span className="font-mono text-label uppercase text-faint">
          <span className="text-accent-dim">{"~/"}</span>
          {c.label}
        </span>
        <span aria-hidden="true" className="font-mono text-label text-accent-dim">
          {isMail ? "smtp" : "wa"}
        </span>
      </div>

      <div className="space-y-5 bg-surface p-6 sm:p-8">
        {/* Name */}
        <div>
          {/* Mono labels, but still plain words. The identity here IS a
              terminal, so the face is consistent rather than costume — what
              stays out is the fake syntax (`const name =`, `name:` in accent)
              that spends the accent colour on a non-semantic token. */}
          <label
            htmlFor="name"
            className="mb-2 block font-mono text-label uppercase text-faint"
          >
            {c.nameLabel}
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
            aria-invalid={fieldErrors.name || undefined}
            aria-describedby={hasErrors ? "contact-form-error" : undefined}
            className={cn(inputClass, fieldErrors.name && inputErrorClass)}
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
                  "flex-1 rounded-sm border px-4 py-2.5 font-mono text-sm transition-colors duration-300",
                  // Tinted, not filled. This is a state indicator, and a
                  // solid accent block here competes with the submit button
                  // directly below it for "the loud green thing you press".
                  active
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border-strong text-muted hover:border-accent hover:text-text",
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
              className="mb-2 block font-mono text-label uppercase text-faint"
            >
              {isMail ? c.phoneLabel : c.emailLabel}
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
              aria-invalid={fieldErrors.contact || undefined}
              aria-describedby={hasErrors ? "contact-form-error" : undefined}
              className={cn(inputClass, fieldErrors.contact && inputErrorClass)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="mb-2 block font-mono text-label uppercase text-faint"
          >
            {c.messageLabel}
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder={c.messagePlaceholder}
            maxLength={LIMITS.message}
            aria-invalid={fieldErrors.message || undefined}
            aria-describedby={hasErrors ? "contact-form-error" : undefined}
            className={cn(inputClass, "resize-none", fieldErrors.message && inputErrorClass)}
          />
        </div>

        {/* Send button — swaps by channel */}
        <div>
          <button
            type="submit"
            className={cn(btnPrimary, "w-full px-6")}
          >
            {isMail ? (
              <ExternalLinkIcon className="h-4 w-4" />
            ) : (
              <WhatsAppIcon className="h-4 w-4" />
            )}
            {isMail ? c.emailLabelBtn : c.whatsappLabel}
          </button>
        </div>

        <AnimatePresence>
          {hasErrors && (
            <motion.p
              id="contact-form-error"
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="font-mono text-xs text-danger"
            >
              {errorMessage()}
            </motion.p>
          )}
          {!hasErrors && popupBlocked && (
            <motion.p
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="font-mono text-xs text-danger"
            >
              {c.popupBlocked}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
