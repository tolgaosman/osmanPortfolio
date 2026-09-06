import { cn } from "@/lib/utils";

/**
 * The name, set at wall scale behind the portrait.
 *
 * This is DECORATION, not a heading. It is `aria-hidden` and it is not the
 * <h1>: its contrast against the ground is deliberately at texture level
 * (somewhere around 2:1), which is fine for a graphic and a WCAG failure for
 * anything the accessibility tree exposes as text. HeroSection renders a real
 * <h1> alongside it — the SEO and the JSON-LD `name` both depend on that
 * heading existing.
 *
 * The glitch copy is a second, offset rendering that flashes for a few frames
 * out of every cycle. It animates `transform` and `opacity` only, and it sits
 * under the same `aria-hidden`, so a screen reader never encounters the name
 * three times.
 */
export default function WallName({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none relative select-none whitespace-nowrap text-center font-display text-wall font-bold uppercase",
        className,
      )}
    >
      {/* The base. text-border-structural rather than an /opacity modifier on
          a text token — the palette has a colour for "this far back". */}
      <span className="block whitespace-nowrap text-border-structural">{text}</span>

      {/* Chromatic split, positioned over the base. Both copies are absolute
          so they cannot affect layout even mid-glitch. */}
      <span
        className="absolute inset-0 block whitespace-nowrap text-accent mix-blend-screen"
        style={{ animation: "glitch-shift 7.3s steps(1, end) infinite" }}
      >
        {text}
      </span>
      <span
        className="absolute inset-0 block whitespace-nowrap text-danger mix-blend-screen"
        style={{ animation: "glitch-shift 7.3s steps(1, end) 0.06s infinite" }}
      >
        {text}
      </span>
    </div>
  );
}
