"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WhatsAppIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";

const inputClass =
  "w-full border-2 border-border bg-bg px-4 py-3 font-mono text-sm text-text placeholder:text-muted/60 transition-colors focus:border-accent focus:outline-none";

const WHATSAPP_NUMBER = "905338346699";

export default function ContactForm() {
  const { t } = useLang();
  const c = t.contact;

  const [form, setForm] = useState({ name: "", message: "" });
  const [error, setError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (error) setError(false);
  };

  const isValid = () =>
    form.name.trim() && form.message.trim();

  const buildBody = () =>
    `Name: ${form.name}\n\n${form.message}`;

  const sendWhatsApp = () => {
    if (!isValid()) {
      setError(true);
      return;
    }
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildBody())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="border-2 border-border bg-surface p-6 sm:p-8">
      <div className="space-y-5">
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
            className={inputClass}
          />
        </div>

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
            className={`${inputClass} resize-none`}
          />
        </div>

        <div>
          {/* WhatsApp — green */}
          <button
            type="button"
            onClick={sendWhatsApp}
            className="group flex w-full items-center justify-center gap-2 border-2 border-accent bg-accent px-6 py-3.5 font-mono text-sm font-bold text-bg shadow-neo-sm transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {c.whatsappLabel}
          </button>
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
