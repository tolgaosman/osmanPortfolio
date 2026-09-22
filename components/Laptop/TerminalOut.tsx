"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useMediaQuery } from "@/lib/media";

/**
 * A build running on a laptop screen.
 *
 * Every line here is output this project actually produces — the framework
 * banner, the route table, the export count. There are no invented numbers,
 * no uptime percentages and no progress bar that is not measuring something.
 * A portfolio that fakes its own telemetry is making a claim it cannot back,
 * and a visitor who knows the tool recognises the fake immediately.
 */

type Line = { text: string; tone: "cmd" | "ok" | "dim" | "brand" };

const LINES: readonly Line[] = [
  { text: "$ npm run build", tone: "cmd" },
  { text: "▲ Next.js 16.2.7", tone: "brand" },
  { text: "  Creating an optimized production build", tone: "dim" },
  { text: "✓ Compiled successfully", tone: "ok" },
  { text: "  Route (app)              Size", tone: "dim" },
  { text: "  ○ /                      static", tone: "dim" },
  { text: "  ○ /cv                    static", tone: "dim" },
  { text: "✓ Exporting (4/4)", tone: "ok" },
];

const TONE: Record<Line["tone"], string> = {
  cmd: "text-text",
  ok: "text-accent",
  dim: "text-faint",
  brand: "text-muted",
};

const STEP_MS = 320;
const HOLD_MS = 3400;

export default function TerminalOut() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  // framer-motion's `useReducedMotion` reads `matchMedia` synchronously, so a
  // client with the OS preference on is already `true` on its very first
  // render while the server (no `matchMedia`) always rendered `false` — a
  // hydration mismatch, since `reduced` feeds this component's first-paint
  // output below. `useMediaQuery` is SSR-safe: same value on both.
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [shown, setShown] = useState(0);

  // Derived, not synchronised. Pushing LINES.length into state from inside
  // the effect would be a cascading render for a value that is a pure
  // function of the motion preference.
  const count = reduced ? LINES.length : shown;

  useEffect(() => {
    if (reduced || !inView) return;

    let n = 0;
    let id = 0;
    const advance = () => {
      n = n < LINES.length ? n + 1 : 0;
      setShown(n);
      id = window.setTimeout(advance, n === LINES.length ? HOLD_MS : STEP_MS);
    };
    id = window.setTimeout(advance, STEP_MS);
    return () => clearTimeout(id);
  }, [inView, reduced]);

  return (
    <div ref={ref} className="p-2.5 text-screen">
      {LINES.slice(0, count).map((line) => (
        <p key={line.text} className={`whitespace-pre ${TONE[line.tone]}`}>
          {line.text}
        </p>
      ))}
      {count === LINES.length && (
        <p className="text-text">
          {"$ "}
          <span className="caret" aria-hidden="true" />
        </p>
      )}
    </div>
  );
}
