/**
 * Faint columns of falling glyphs behind everything else.
 *
 * Server component, and every value below is DERIVED FROM THE INDEX rather
 * than from Math.random(). A random layout would differ between the server
 * render and the client render and produce a hydration mismatch on every
 * load — and since this is pure decoration, the mismatch would be invisible
 * until it started warning in the console and re-rendering the subtree.
 *
 * The multipliers are primes so the columns do not fall into a visible
 * repeating rhythm; a grid of glyphs all starting together reads as a table.
 */

const GLYPHS = "01{}<>/\\$#*+=;:~|_".split("");
const COLUMNS = 22;

/** Deterministic 0..1 from an integer. No state, no randomness, no mismatch. */
function noise(n: number) {
  const v = Math.sin(n * 12.9898) * 43758.5453;
  return v - Math.floor(v);
}

/** Three decimals — the precision a browser keeps when it reparses a style. */
function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

export default function CodeRain() {
  return (
    <div
      className="code-rain pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: COLUMNS }, (_, i) => {
        // ROUNDED, and animation set as LONGHANDS. Both are hydration fixes,
        // not tidiness: the browser normalises an inline `left:
        // 74.58103036146416%` down to `74.581%` and expands an `animation`
        // shorthand into its eight longhand properties, so React's virtual
        // style object no longer matches what it reads back out of the DOM
        // and the whole subtree logs a mismatch on every load.
        const left = round((i / COLUMNS) * 100 + noise(i) * 2);
        const duration = round(14 + noise(i * 7) * 16);
        const delay = round(-noise(i * 13) * duration);
        const length = 6 + Math.floor(noise(i * 3) * 8);

        return (
          <span
            key={i}
            className="absolute top-0 flex flex-col gap-1 font-mono text-[0.625rem] leading-none text-accent-dim will-change-transform"
            style={{
              left: `${left}%`,
              animationName: "code-fall",
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
            }}
          >
            {Array.from({ length }, (_, j) => (
              <span
                key={j}
                // Fades toward the tail so each column reads as a trail with
                // a leading edge rather than as a uniform stripe. Opacity on
                // a decorative glyph, never on text that has to be read.
                style={{ opacity: round(0.5 - (j / length) * 0.42) }}
              >
                {GLYPHS[Math.floor(noise(i * 31 + j * 17) * GLYPHS.length)]}
              </span>
            ))}
          </span>
        );
      })}
    </div>
  );
}
