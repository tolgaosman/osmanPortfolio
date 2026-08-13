import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "Tolga Osman — Software Engineering Student & Web/Mobile Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static-export-compatible: Next generates this once at build time since the
// route has no dynamic params. Uses the site's own design tokens (bg, accent,
// JetBrains Mono terminal framing) so the card looks like the site it links to.
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
          padding: "80px",
          backgroundColor: "#0a0a0f",
          backgroundImage:
            "linear-gradient(to right, rgba(42,42,58,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(42,42,58,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "monospace",
            fontSize: 28,
            color: "#9ca3af",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              backgroundColor: "#10b981",
            }}
          />
          available for new projects
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 76,
            fontWeight: 700,
            color: "#e5e7eb",
            letterSpacing: "-0.02em",
          }}
        >
          Tolga Osman Falay
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 40,
            color: "#10b981",
            marginTop: "18px",
          }}
        >
          {"> "}Software Engineer & Web / Mobile Developer
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "monospace",
            fontSize: 26,
            color: "#9ca3af",
            marginTop: "56px",
          }}
        >
          tolgaosman.github.io/osmanPortfolio
        </div>
      </div>
    ),
    { ...size },
  );
}
