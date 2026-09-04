import { ImageResponse } from "next/og";
import { siteConfig } from "@/data/site";

export const dynamic = "force-static";
export const alt = "Tolga Osman — Web & mobile developer, Nicosia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static-export-compatible: Next generates this once at build time since the
// route has no dynamic params.
//
// Colours are written out rather than read from @theme because Satori has no
// access to the CSS layer — keep these in sync with app/globals.css by hand.
// Fonts are likewise unavailable here (no next/font buffer is loaded), so this
// card intentionally stays on the system serif/sans rather than pretending to
// use Instrument Serif.
const COLOR = {
  bg: "#14120f",
  text: "#f5f0e8",
  muted: "#a8a096",
  accent: "#c8873f",
  border: "#332d28",
} as const;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "88px",
          backgroundColor: COLOR.bg,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            fontSize: 26,
            color: COLOR.muted,
            marginBottom: "36px",
          }}
        >
          <div style={{ width: 10, height: 10, backgroundColor: COLOR.accent }} />
          Nicosia, Cyprus
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "serif",
            fontSize: 104,
            color: COLOR.text,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {siteConfig.shortName}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: COLOR.accent,
            marginTop: "24px",
          }}
        >
          Web &amp; mobile developer
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "56px",
            paddingTop: "28px",
            borderTop: `1px solid ${COLOR.border}`,
            fontSize: 24,
            color: COLOR.muted,
          }}
        >
          tolgaosman.github.io/osmanPortfolio
        </div>
      </div>
    ),
    { ...size },
  );
}
