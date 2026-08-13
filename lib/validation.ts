// Client-side validation + sanitization for the contact form.
//
// The form has no backend: its values are only ever interpolated into a
// `wa.me` URL that the visitor's own client opens. That keeps the server-side
// attack surface at zero, but two things still matter:
//   1. control characters (CR/LF, NUL, other C0) can be abused to forge extra
//      headers / smuggle content in some clients - strip them.
//   2. unbounded input is an abuse vector - cap every field.
// Anything that needs strong guarantees (DB writes, auth) belongs on a real
// backend; see SECURITY.md for the Zod schema to mirror this there.

export const LIMITS = {
  name: 80,
  email: 254,
  phone: 32,
  message: 2000,
} as const;

// C0 controls (00-1F), DEL (7F), and C1 controls (80-9F).
const CONTROL_RE = /[\x00-\x1F\x7F-\x9F]/g;

/** Remove control chars (incl. CR/LF/NUL) and trim surrounding whitespace. */
export function sanitize(value: string): string {
  return value.replace(CONTROL_RE, "").trim();
}

/** Loose email shape check — good enough to catch typos client-side. */
export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/** Phone: digits/+/spaces/-/() only, with at least 7 digits. */
export function isPhone(value: string): boolean {
  return /^[+\d][\d\s()-]{6,}$/.test(value) && (value.match(/\d/g)?.length ?? 0) >= 7;
}

export type Channel = "whatsapp" | "mail";

export type ContactInput = {
  name: string;
  message: string;
  channel: Channel;
  contact: string;
};

export type ContactFieldErrors = {
  name: boolean;
  contact: boolean;
  message: boolean;
};

/**
 * Sanitize + cap each field, then report whether every field is present and
 * the conditional contact value matches its channel (email for whatsapp,
 * phone for mail). Returns the cleaned values so callers send exactly what was
 * validated, plus per-field validity so the UI can point at exactly what's
 * wrong instead of a single "fill in all fields" message that's misleading
 * when e.g. only the email format is invalid.
 */
export function validateContact(input: ContactInput): {
  ok: boolean;
  values: ContactInput;
  errors: ContactFieldErrors;
} {
  const limit = input.channel === "mail" ? LIMITS.phone : LIMITS.email;
  const values: ContactInput = {
    name: sanitize(input.name).slice(0, LIMITS.name),
    message: sanitize(input.message).slice(0, LIMITS.message),
    channel: input.channel,
    contact: sanitize(input.contact).slice(0, limit),
  };
  const contactValid =
    input.channel === "mail" ? isPhone(values.contact) : isEmail(values.contact);
  const errors: ContactFieldErrors = {
    name: !values.name,
    contact: !contactValid,
    message: !values.message,
  };
  return {
    ok: !errors.name && !errors.contact && !errors.message,
    values,
    errors,
  };
}
