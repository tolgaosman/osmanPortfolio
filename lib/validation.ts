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
  message: 2000,
} as const;

// C0 controls (00-1F), DEL (7F), and C1 controls (80-9F).
const CONTROL_RE = /[\x00-\x1F\x7F-\x9F]/g;

/** Remove control chars (incl. CR/LF/NUL) and trim surrounding whitespace. */
export function sanitize(value: string): string {
  return value.replace(CONTROL_RE, "").trim();
}

export type ContactInput = { name: string; message: string };

/**
 * Sanitize + cap each field, then report whether the result is non-empty.
 * Returns the cleaned values so callers send exactly what was validated.
 */
export function validateContact(input: ContactInput): {
  ok: boolean;
  values: ContactInput;
} {
  const values: ContactInput = {
    name: sanitize(input.name).slice(0, LIMITS.name),
    message: sanitize(input.message).slice(0, LIMITS.message),
  };
  return { ok: Boolean(values.name && values.message), values };
}
