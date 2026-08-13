"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLinkIcon, WhatsAppIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";
import { LIMITS, validateContact, type Channel, type ContactFieldErrors } from "@/lib/validation";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border-2 border-border bg-bg px-4 py-3 font-mono text-sm text-text placeholder:text-muted/75 transition-colors focus:border-accent";
const inputErrorClass = "border-[#fca5a5]";

const WHATSAPP_NUMBER = "905338346699";
const EMAIL = "tofbusiness2002@gmail.com";

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
      const body = `Name: ${values.name}\nEmail: ${values.contact}\n\n${values.message}`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
      win = window.open(url, "_blank");
    } else {
      const subject = `Portfolio contact — ${values.name}`;
      const body = `Name: ${values.name}\nPhone: ${values.contact}\n\n${values.message}`;
      const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
      className="border-2 border-border bg-surface p-6 sm:p-8"
    >
      <div className="space-y-5">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block font-mono text-xs text-muted"
          >
            <span aria-hidden className="text-accent">const</span> {c.nameLabel}{" "}
            <span aria-hidden>=</span>
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
              <span aria-hidden className="text-accent">const</span>{" "}
              {isMail ? c.phoneLabel : c.emailLabel} <span aria-hidden>=</span>
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
            className="mb-2 block font-mono text-xs text-muted"
          >
            <span aria-hidden className="text-accent">const</span> {c.messageLabel}{" "}
            <span aria-hidden>=</span>
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
            className="group flex w-full items-center justify-center gap-2 border-2 border-accent bg-accent px-6 py-3.5 font-mono text-sm font-bold text-bg shadow-neo-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
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
              className="font-mono text-xs text-[#fca5a5]"
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
              className="font-mono text-xs text-[#fca5a5]"
            >
              {c.popupBlocked}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
