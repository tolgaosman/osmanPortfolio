"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useMediaQuery } from "@/lib/media";

/**
 * Code being typed onto a laptop screen, one character at a time.
 *
 * The snippet is real: it is the lerp out of lib/motion.ts that drives the
 * tilt of the very laptop this renders inside. Nothing on this page is lorem
 * ipsum or a fabricated metric, and that applies to decoration too.
 *
 * Colouring is monochromatic on purpose — brightness levels of the one accent
 * rather than the usual six-hue syntax theme. A red-and-purple editor theme
 * dropped into a green CRT reads as a screenshot pasted onto the page; levels
 * of one green read as an emitting display.
 *
 * The animation is gated on `useInView`, so a laptop scrolled off screen is
 * not burning a timer, and it is replaced by the finished text under
 * `prefers-reduced-motion` — a typing effect is the exact class of animation
 * that setting exists to suppress.
 */

type Kind = "kw" | "fn" | "str" | "num" | "cmt" | "punct" | "plain";
type Token = readonly [string, Kind];

const TONE: Record<Kind, string> = {
  kw: "text-accent",
  fn: "text-text",
  str: "text-accent-bright",
  num: "text-accent-bright",
  cmt: "text-accent-dim",
  punct: "text-faint",
  plain: "text-muted",
};

const LINES: readonly (readonly Token[])[] = [
  [["// lib/motion.ts", "cmt"]],
  [
    ["const", "kw"],
    [" tick ", "plain"],
    ["= () => {", "punct"],
  ],
  [
    ["  have", "plain"],
    [".x += (want", "punct"],
    [".x - have", "punct"],
    [".x) * ", "punct"],
    ["0.1", "num"],
    [";", "punct"],
  ],
  [
    ["  node", "plain"],
    [".style.", "punct"],
    ["setProperty", "fn"],
    ["(", "punct"],
  ],
  [
    ["    ", "plain"],
    ['"--rx"', "str"],
    [", ", "punct"],
    ["`${have.x}deg`", "str"],
    [",", "punct"],
  ],
  [["  );", "punct"]],
  [
    ["  raf = ", "plain"],
    ["requestAnimationFrame", "fn"],
    ["(tick);", "punct"],
  ],
  [["};", "punct"]],
];

const CHAR_MS = 26;
const HOLD_MS = 2600;

/**
 * Every token's absolute character offset, computed ONCE at module scope.
 *
 * LINES is a module constant, so none of this depends on props or state and
 * none of it belongs in a hook. Doing the running-total inside a `useMemo`
 * callback also trips `react-hooks/immutability`, which is right to complain:
 * a closure that mutates a variable from an enclosing render scope is the
 * shape of a real bug even when this particular instance is harmless.
 */
type Placed = { text: string; kind: Kind; start: number };

const PLACED: Placed[][] = [];
const LINE_START: number[] = [];
{
  let cursor = 0;
  for (const line of LINES) {
    LINE_START.push(cursor);
    const placedLine: Placed[] = [];
    for (const [text, kind] of line) {
      placedLine.push({ text, kind, start: cursor });
      cursor += text.length;
    }
    PLACED.push(placedLine);
  }
}
const TOTAL = LINE_START.length
  ? LINE_START[LINE_START.length - 1] +
    LINES[LINES.length - 1].reduce((n, [text]) => n + text.length, 0)
  : 0;

export default function TypingCode() {
  const ref = useRef<HTMLPreElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  // framer-motion's `useReducedMotion` reads `matchMedia` synchronously, so a
  // client with the OS preference on is already `true` on its very first
  // render while the server (no `matchMedia`) always rendered `false` — a
  // hydration mismatch, since `reduced` feeds this component's first-paint
  // output below. `useMediaQuery` is SSR-safe: same value on both.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [typed, setTyped] = useState(0);

  // Derived, not synchronised. Writing TOTAL into state from inside the
  // effect would be a cascading render for a value that is a pure function of
  // a prop-like input.
  const shown = reduced ? TOTAL : typed;

  useEffect(() => {
    if (reduced || !inView) return;

    // The counter lives in the closure, not in state. Scheduling the next
    // tick from inside a setState updater would be a side effect in a
    // function React is allowed to call twice.
    let n = 0;
    let id = 0;
    const advance = () => {
      n = n < TOTAL ? n + 1 : 0;
      setTyped(n);
      // Pause on the finished screen before wrapping back to an empty one.
      id = window.setTimeout(advance, n === TOTAL ? HOLD_MS : CHAR_MS);
    };
    id = window.setTimeout(advance, CHAR_MS);
    return () => clearTimeout(id);
  }, [inView, reduced]);

  return (
    <pre ref={ref} className="whitespace-pre p-2.5 text-screen">
      <code>
        {PLACED.map((line, i) => {
          const lineStart = LINE_START[i];
          const nextStart = LINE_START[i + 1] ?? TOTAL;
          const isCurrent = shown > lineStart && shown <= nextStart;
          return (
            <span key={i} className="block">
              {line.map((token, j) => {
                const visible = Math.max(
                  0,
                  Math.min(token.text.length, shown - token.start),
                );
                if (visible === 0) return null;
                return (
                  <span key={j} className={TONE[token.kind]}>
                    {token.text.slice(0, visible)}
                  </span>
                );
              })}
              {/* The caret rides whichever line is currently being written. */}
              {isCurrent && <span className="caret" aria-hidden="true" />}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
