/**
 * Single source of truth for identity + contact details. These values were
 * previously duplicated across ContactForm, ContactSection, skills.ts, the
 * hero, the JSON-LD block and the OG image, which meant a phone number change
 * needed six edits. Import from here instead of retyping.
 */
export const siteConfig = {
  name: "Tolga Osman Falay",
  shortName: "Tolga Osman",
  email: "tofbusiness2002@gmail.com",
  phoneDisplay: "+90 533 834 6699",
  phoneE164: "+905338346699",
  whatsappNumber: "905338346699",
  url: "https://tolgaosman.github.io/osmanPortfolio/",
} as const;

export const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}`;
