"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Text that resolves out of noise the first time it scrolls into view.
 *
 * Three things keep this from being the usual broken version of the effect:
 *
 *   - The real string is ALWAYS in the DOM, in a visually-hidden span. A
 *     screen reader, a crawler and a copy-paste all get the finished text;
 *     only sighted users see it resolve. Animating the accessible text
 *     directly would announce a stream of garbage on every reveal.
 *   - It runs once, on entry, and then stops. A permanently scrambling
 *     heading is unreadable and is exactly what WCAG 2.2.2 is about.
 *   - Spaces are never scrambled, so the word shapes hold still and the line
 *     does not appear to change length while it resolves.
 */
const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>{}[]#$%*";

/**
 * The whole reveal is bounded in TIME, not in frames per character.
 *
 * A fixed per-character tick makes the duration a function of the string
 * length, so a forty-character heading spent nearly four seconds unreadable
 * while a short one flickered past. Section headings are the thing a reader
 * scans first; none of them may be garbled for longer than this.
 */
const TOTAL_MS = 850;
const MIN_TICK_MS = 16;

export default function ScrambleText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  // `null` means "not currently scrambling", and the real text renders. The
  // finished state is therefore the ABSENCE of state rather than a copy of
  // the prop written into it — so nothing has to be re-synchronised when the
  // language changes the prop mid-animation, and the effect body never calls
  // setState synchronously.
  const [noise, setNoise] = useState<string | null>(null);

  useEffect(() => {
    if (reduced || !inView) return;

    const tick = Math.max(MIN_TICK_MS, TOTAL_MS / Math.max(text.length, 1));
    let locked = 0;
    const id = window.setInterval(() => {
      locked += 1;
      if (locked >= text.length) {
        window.clearInterval(id);
        setNoise(null);
        return;
      }
      setNoise(
        text
          .split("")
          .map((char, i) => {
            if (i < locked || char === " ") return char;
            return NOISE[Math.floor(Math.random() * NOISE.length)];
          })
          .join(""),
      );
    }, tick);

    return () => {
      window.clearInterval(id);
      setNoise(null);
    };
  }, [inView, reduced, text]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{noise ?? text}</span>
    </span>
  );
}
