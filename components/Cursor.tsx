"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FINE_POINTER, useMediaQuery } from "@/lib/media";

/**
 * A ring that trails the native cursor.
 *
 * Deliberately AUGMENTS rather than replaces: `cursor: none` is not set
 * globally. Hiding the system cursor loses the I-beam over text and the
 * resize affordance over controls, is disorienting for low-vision users, and
 * makes any dropped frame read as the site being broken. The ring is a second
 * indicator, and it is `aria-hidden` because it conveys nothing a pointer
 * user does not already have.
 *
 * Two performance decisions worth keeping:
 *
 *   - Position goes through MotionValues. `MotionValue.set()` does not
 *     trigger a React render, so there is no state, no rAF throttling and no
 *     re-render on pointer move.
 *   - Hover intent is a DOM mutation, not state. One delegated `pointerover`
 *     listener walks up to the nearest `[data-cursor]` and writes the result
 *     onto the ring's own dataset. Call sites opt in with markup alone
 *     (`data-cursor="view"`), and nothing in React re-renders.
 */
export default function Cursor() {
  const finePointer = useMediaQuery(FINE_POINTER);
  const ref = useRef<HTMLDivElement>(null);

  // Start off-screen so the ring never flashes at the origin before the first
  // pointer event arrives.
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 45, mass: 0.35, restDelta: 0.01 });
  const sy = useSpring(y, { stiffness: 900, damping: 45, mass: 0.35, restDelta: 0.01 });

  useEffect(() => {
    if (!finePointer) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [finePointer, x, y]);

  useEffect(() => {
    if (!finePointer) return;
    let last = "";

    // pointerover, not mouseenter: mouseenter does not bubble, so a single
    // document-level listener would never see it. Delegation also means
    // elements added later (the project cards in the pinned track, terminal
    // output rows) are covered without re-binding anything.
    const over = (e: PointerEvent) => {
      const target = e.target as Element | null;
      const holder = target?.closest?.("[data-cursor]");
      const intent = holder?.getAttribute("data-cursor") ?? "default";
      if (intent !== last && ref.current) {
        last = intent;
        ref.current.dataset.state = intent;
      }
    };

    document.addEventListener("pointerover", over, { passive: true });
    return () => document.removeEventListener("pointerover", over);
  }, [finePointer]);

  // The hooks above always run; only the subtree is conditional. On touch the
  // server snapshot is false too, so the ring is simply absent from the
  // exported HTML.
  if (!finePointer) return null;

  return (
    <motion.div
      ref={ref}
      data-state="default"
      aria-hidden="true"
      // Centred with negative margins rather than translate(-50%,-50%):
      // Framer writes x/y into the `transform` property, and a translate
      // coming from a class would fight it non-deterministically.
      style={{ x: sx, y: sy }}
      className={[
        "pointer-events-none fixed left-0 top-0 z-[90] -ml-3 -mt-3 h-6 w-6 rounded-full",
        "border border-accent/70 will-change-transform",
        "transition-[width,height,margin,background-color,border-color] duration-200 ease-out",
        // The ring grows and fills over anything that declares an intent.
        "data-[state=view]:-ml-7 data-[state=view]:-mt-7 data-[state=view]:h-14 data-[state=view]:w-14 data-[state=view]:bg-accent/12",
        "data-[state=link]:-ml-5 data-[state=link]:-mt-5 data-[state=link]:h-10 data-[state=link]:w-10 data-[state=link]:bg-accent/10",
        "data-[state=text]:-ml-px data-[state=text]:-mt-4 data-[state=text]:h-8 data-[state=text]:w-0.5 data-[state=text]:rounded-none data-[state=text]:bg-accent",
      ].join(" ")}
    />
  );
}
