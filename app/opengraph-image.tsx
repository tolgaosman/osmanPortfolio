import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const dynamic = "force-static";
export const alt = "Tolga Osman — Web & mobile developer, Nicosia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The share card. Generated once at build time (`force-static`, no dynamic
 * params) so it survives `output: "export"`.
 *
 * Colours are written out rather than read from `@theme`, because Satori has
 * no access to the CSS layer. KEEP THESE IN SYNC WITH app/globals.css BY
 * HAND — there is no build-time check that they match, and the failure mode
 * is a share card in last season's palette.
 */
const COLOR = {
  bg: "#0a0f0d",
  surface: "#101815",
  text: "#e9f2ec",
  muted: "#94a89d",
  faint: "#7b9186",
  accent: "#2ee88f",
  accentDim: "#1d6b47",
  border: "#22332b",
  wall: "#2e453a",
} as const;

/**
 * Satori cannot read next/font's buffers, so the display face is fetched
 * directly at build time.
 *
 * Two things that are easy to get wrong here:
 *   - Satori supports TTF, OTF and WOFF, but NOT WOFF2. Google's CSS API
 *     returns woff2 only when it recognises a modern browser User-Agent, so
 *     this request deliberately does NOT send one and gets TTF back.
 *   - Everything is wrapped in try/catch and falls back to `null`. A share
 *     card is not worth failing a deploy over; without the font the card
 *     still renders, in the system sans.
 */
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700",
    ).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:[^)]+)\)/)?.[1];
    if (!url) return null;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const displayFont = await loadDisplayFont();
  const display = displayFont ? "Space Grotesk" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
          padding: "72px",
          backgroundColor: COLOR.bg,
        }}
      >
        {/* The grid, drawn as explicit rules rather than a
            repeating-linear-gradient — Satori's support for repeating
            gradients is not something a build should depend on. */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={`h${i}`}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 90 + i * 108,
              height: 1,
              backgroundColor: COLOR.border,
            }}
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={`v${i}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 60 + i * 150,
              width: 1,
              backgroundColor: COLOR.border,
            }}
          />
        ))}

        {/* Wall name, at the same job it does on the page: the largest thing
            on the card, sitting behind everything else. */}
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 122,
            display: "flex",
            fontFamily: display,
            fontWeight: 700,
            fontSize: 168,
            lineHeight: 0.82,
            letterSpacing: "-0.045em",
            color: COLOR.wall,
          }}
        >
          {siteConfig.shortName.toUpperCase()}
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 26,
              color: COLOR.accent,
            }}
          >
            <div style={{ width: 12, height: 12, backgroundColor: COLOR.accent }} />
            Web &amp; mobile developer · Nicosia, Cyprus
          </div>

          <div
            style={{
              display: "flex",
              fontFamily: display,
              fontWeight: 700,
              fontSize: 46,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: COLOR.text,
              maxWidth: 900,
            }}
          >
            I build websites and mobile apps, end to end.
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 22,
              paddingTop: 24,
              borderTop: `1px solid ${COLOR.border}`,
              fontSize: 22,
              color: COLOR.faint,
            }}
          >
            <div style={{ display: "flex" }}>
              Next.js · React · TypeScript · Flutter · Laravel
            </div>
            <div style={{ display: "flex", color: COLOR.muted }}>
              tolgaosman.github.io/osmanPortfolio
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: displayFont
        ? [{ name: "Space Grotesk", data: displayFont, weight: 700, style: "normal" }]
        : [],
    },
  );
}
