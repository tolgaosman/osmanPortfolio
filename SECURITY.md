# Security

This document records the security posture of the portfolio site **and** the
hardening playbook to use **if/when a backend is added**. Read the threat model
first — it explains why most "backend" controls are documented here as a guide
rather than wired into this repo.

---

## 1. What this repository actually is

- **100 % static frontend.** `next.config.ts` sets `output: "export"`; `npm run
  build` emits plain HTML/CSS/JS into `out/`.
- **Hosted on GitHub Pages.** A static file host. It **cannot** run server code
  and **cannot** set custom HTTP response headers.
- **No backend in this repo.** No Node/Express server, no database, no
  authentication, no sessions, no password reset, no API routes.
- **The contact form does not submit anywhere.** It builds a `wa.me` deep link
  from the form fields and opens it in the visitor's own client.
- `@emailjs/browser` is a dependency but is **not imported anywhere** (dead
  dependency — see Maintenance below).

### Consequence for the requested controls

| Requested control | Status in this repo | Why |
|---|---|---|
| 1. Hide API keys / `.env` hygiene | ✅ Done | Verified no secrets in code; `.gitignore` + `.gitattributes` cover env files |
| 2. CORS policy | 📘 Guide only | No server exists to receive cross-origin requests |
| 3. Rate limiting | 📘 Guide only | No server endpoints to rate-limit |
| 4. Input validation / injection | ✅ Partial + 📘 Guide | Client form is sanitized/capped; DB-injection guidance is for a future backend |
| 5. 30-min reset-link expiry | 📘 Guide only | No auth / no email flow exists |
| 6. Security headers (Helmet) | ✅ Adapted | Helmet is Express-only; delivered the meta-tag CSP that GitHub Pages allows |
| 7. JWT / session security | 📘 Guide only | No login exists |
| 8. Breach alerts / monitoring | 📘 Guide only | No server to detect server-side anomalies |

> **Bottom line:** A static portfolio has a tiny attack surface. The realistic
> threats are (a) leaking a secret into the public repo and (b) supply-chain /
> dependency risk — both addressed below. The auth/session/CORS items only
> become real the day you stand up the Render backend; the copy-paste configs
> for that day are in §4.

---

## 2. Implemented in this repo (frontend)

### 2.1 Secrets hygiene
- No secrets are hardcoded anywhere (verified).
- `.gitignore` ignores `.env*`; **no env file is tracked** (verified with
  `git ls-files`), and history contains none.
- `.gitattributes` adds `export-ignore` for `.env*` and dev files so they can
  never leak into a `git archive` / release tarball.
- ⚠️ **Anything prefixed `NEXT_PUBLIC_` is shipped to the browser in clear
  text.** It is *not* a secret. EmailJS "public keys" are designed for this, but
  never put a private/server key behind a `NEXT_PUBLIC_` name.

### 2.2 Security headers (CSP via `<meta>`)
GitHub Pages cannot set HTTP headers and a static export cannot mint per-request
nonces, so the Content-Security-Policy is delivered via `<meta http-equiv>` in
[`app/layout.tsx`](app/layout.tsx). It locks every resource type to same-origin,
sets `object-src 'none'` and `base-uri 'self'`, and restricts `form-action`.
`script-src`/`style-src` must include `'unsafe-inline'` because Next's hydration
payload and Framer Motion's inline styles require it — there is no way around
this on a nonce-less static host.

**Known limitations of a `<meta>` CSP (by spec, the browser ignores these
directives unless sent as a real header):** `frame-ancestors`, `sandbox`,
`report-uri`. So clickjacking is **not** fully blocked on GitHub Pages. This is
low-risk here because the site has no authenticated/sensitive actions to
hijack. To close it properly, serve the site behind a header-capable host
(Cloudflare Pages `_headers`, Netlify, or the Express server in §4) and send the
header set in §4.4.

### 2.3 Contact-form input handling
[`lib/validation.ts`](lib/validation.ts) sanitizes every field (strips C0/C1
control chars incl. CR/LF to prevent deep-link/header smuggling) and caps
length; [`ContactForm.tsx`](components/Contact/ContactForm.tsx) also enforces
`maxLength` at the input. Values are URL-encoded before being placed in the
`wa.me` link.

---

## 3. Maintenance / supply chain

- `npm audit` currently reports 2 **moderate** advisories from a transitive
  `postcss` pulled in by Next's toolchain (CSS stringify XSS, build-time only).
  The only "fix" downgrades Next to v9 (breaking) — **do not run `audit fix
  --force`.** It does not affect the shipped static site; clears when Next
  bumps the dependency. Re-check after each `next` upgrade.
- **Remove the unused `@emailjs/browser` dependency** to shrink the attack
  surface (the form does not use it): `npm remove @emailjs/browser` and delete
  the stale [`.env.local.example`](.env.local.example). Left in place only
  because removing a dependency while you were asleep wasn't something to decide
  for you — see the note at the end.
- Enable **Dependabot** (`.github/dependabot.yml`) and **GitHub Secret
  Scanning + Push Protection** (repo Settings → Code security) so a future
  accidental key commit is blocked at push time.

---

## 4. Backend hardening playbook (use when you add the Render API)

Everything below is production-ready for a **Node + TypeScript + Express** API
on Render. Install:

```bash
npm i express cors helmet express-rate-limit zod jsonwebtoken cookie-parser
npm i -D @types/express @types/cors @types/jsonwebtoken @types/cookie-parser
```

### 4.0 Environment & Render config
Never commit real values. Locally use `.env` (already git-ignored). On Render,
set these under **Dashboard → your service → Environment**:

```ini
# .env (local only — never committed)
NODE_ENV=production
PORT=10000
# Comma-separated allow-list of front-end origins
ALLOWED_ORIGINS=https://tolgaosman.github.io,http://localhost:3000
# Secrets — generate with: node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=__64+_char_random__
JWT_REFRESH_SECRET=__different_64+_char_random__
RESET_TOKEN_SECRET=__another_64+_char_random__
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy
```

```ts
// src/env.ts — validate env at boot; crash early if misconfigured.
import { z } from "zod";

const Env = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(10000),
  ALLOWED_ORIGINS: z.string().transform((s) => s.split(",").map((o) => o.trim())),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  RESET_TOKEN_SECRET: z.string().min(32),
  DISCORD_WEBHOOK_URL: z.string().url().optional(),
});

export const env = Env.parse(process.env);
```

### 4.1 App bootstrap + 4.6 Helmet headers

```ts
// src/app.ts
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { corsMiddleware } from "./security/cors";
import { apiLimiter, authLimiter } from "./security/rateLimit";
import { env } from "./env";

export function createApp() {
  const app = express();
  app.set("trust proxy", 1); // Render sits behind a proxy — needed for real client IPs

  // §6 Security headers. Helmet ships sensible defaults; we tighten CSP + HSTS.
  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          defaultSrc: ["'self'"],
          baseUri: ["'self'"],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"], // real anti-clickjacking (header, not meta)
          scriptSrc: ["'self'"],
        },
      },
      hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      crossOriginResourcePolicy: { policy: "same-site" },
    }),
  );
  app.use(corsMiddleware);
  app.use(express.json({ limit: "10kb" })); // cap body size — anti-DoS
  app.use(cookieParser());

  app.use("/api/", apiLimiter);
  app.use("/api/auth/", authLimiter);

  // ... mount routers here ...
  return app;
}
```

### 4.2 CORS — strict allow-list, never `*`

```ts
// src/security/cors.ts
import cors from "cors";
import { env } from "../env";

export const corsMiddleware = cors({
  origin(origin, cb) {
    // Allow same-origin/curl (no Origin header) and explicit allow-list only.
    if (!origin || env.ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true, // required to send the httpOnly auth cookie
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
});
```

### 4.3 Rate limiting — global + strict on auth

```ts
// src/security/rateLimit.ts
import rateLimit from "express-rate-limit";

// General API: 100 req / 15 min / IP.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth & form submit: 5 attempts / 15 min / IP — blunts brute force & spam.
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many attempts. Try again later." },
  // Fire a breach alert when an IP keeps hammering after the limit.
  handler: (req, res, _next, options) => {
    void notifyBreach("rate-limit", { ip: req.ip, path: req.path });
    res.status(options.statusCode).json(options.message);
  },
});
import { notifyBreach } from "./alerts";
```

### 4.4 Input validation & injection protection (Zod)

```ts
// src/security/validate.ts
import type { RequestHandler } from "express";
import { z, ZodSchema } from "zod";

// Reusable middleware: validate+sanitize body, then replace req.body with the
// parsed (typed, stripped) result. Unknown keys are dropped by default.
export const validateBody =
  (schema: ZodSchema): RequestHandler =>
  (req, res, next) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid input", issues: parsed.error.flatten() });
    }
    req.body = parsed.data;
    next();
  };

// Example schema — mirror lib/validation.ts on the client.
export const ContactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(120),
  message: z.string().trim().min(1).max(2000),
});
```

**Injection rules (defense beyond Zod):**
- **SQL:** only ever use parameterized queries / an ORM (Prisma, Drizzle,
  `pg` with `$1` placeholders). Never string-concatenate user input into SQL.
- **NoSQL (Mongo):** reject objects where strings are expected (Zod does this),
  and/or run `express-mongo-sanitize` to strip `$`/`.` operator keys.
- Treat **every** `req.body`, `req.query`, and `req.params` as hostile until it
  has passed a schema.

### 4.5 Password-reset tokens with hard 30-minute expiry

```ts
// src/auth/resetToken.ts
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { env } from "../env";

const RESET_TTL = "30m"; // hard expiry, 30 minutes from issue

// Issue: sign a short-lived token bound to the user + a hash of their current
// password so the link self-invalidates once the password changes (single-use).
export function issueResetToken(userId: string, passwordHash: string) {
  const secret = env.RESET_TOKEN_SECRET + passwordHash; // rotates per password
  return jwt.sign({ sub: userId }, secret, { expiresIn: RESET_TTL });
}

// Verify: throws if expired (>30 min) or if password already changed.
export function verifyResetToken(token: string, userId: string, passwordHash: string) {
  const secret = env.RESET_TOKEN_SECRET + passwordHash;
  return jwt.verify(token, secret, { subject: userId }) as { sub: string };
}
```

The link emailed to the user is `https://app/reset?token=<jwt>`. `jwt.verify`
rejects anything older than 30 minutes automatically. Binding the secret to the
current password hash makes each link **single-use**.

### 4.7 JWT & session security (httpOnly cookies)

```ts
// src/auth/session.ts
import type { Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env";

const cookieOpts = {
  httpOnly: true,                 // JS cannot read it → blunts XSS token theft
  secure: env.NODE_ENV === "production", // HTTPS only
  sameSite: "strict" as const,    // blunts CSRF
  path: "/",
};

export function issueSession(res: Response, userId: string) {
  const access = jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "15m" });
  const refresh = jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
  res.cookie("access", access, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
  res.cookie("refresh", refresh, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export function clearSession(res: Response) {
  res.clearCookie("access", cookieOpts);
  res.clearCookie("refresh", cookieOpts);
}
```

**Rules:** short-lived access token (15 min) + longer refresh token, both in
`httpOnly; Secure; SameSite=Strict` cookies — **never** in `localStorage`
(XSS-readable). Hash passwords with `argon2` or `bcrypt` (cost ≥ 12). Rotate
refresh tokens on use and keep a server-side denylist for logout/revocation.

### 4.8 Breach alerts & monitoring (Discord webhook)

```ts
// src/security/alerts.ts
import { env } from "../env";

type BreachKind = "rate-limit" | "auth-fail-burst" | "cors-block" | "5xx-spike";

// Fire-and-forget alert to Discord. Never throws into the request path.
export async function notifyBreach(kind: BreachKind, meta: Record<string, unknown>) {
  if (!env.DISCORD_WEBHOOK_URL) return;
  try {
    await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🚨 **${kind}** @ ${new Date().toISOString()}\n\`\`\`json\n${JSON.stringify(meta, null, 2)}\n\`\`\``,
      }),
    });
  } catch {
    /* alerting must never break the API */
  }
}
```

Wire it into: the `authLimiter` handler (§4.3), the CORS error handler, repeated
401/403s from one IP (track failures in memory/Redis and alert at a threshold),
and a global error handler for 5xx spikes. For real monitoring, also enable
Render's built-in logs/alerts and consider Sentry for stack traces.

### 4.9 Quick checklist for the backend day
- [ ] All secrets in Render env vars, never in code; `.env` git-ignored.
- [ ] CORS allow-list set to the GitHub Pages origin (+ localhost for dev).
- [ ] Helmet on, HSTS preloaded, `frame-ancestors 'none'` as a real header.
- [ ] Every endpoint behind `validateBody`/`validateQuery`.
- [ ] `express.json({ limit })` + rate limiters mounted.
- [ ] Auth in httpOnly/Secure/SameSite cookies; passwords argon2/bcrypt.
- [ ] Reset tokens expire in 30 min and are single-use.
- [ ] Discord/Slack breach webhook wired to limiter + error handler.
- [ ] Dependabot + secret scanning + push protection enabled on the repo.

---

## Reporting a vulnerability
Email **tofbusiness2002@gmail.com**. Please allow reasonable time to remediate
before public disclosure.
