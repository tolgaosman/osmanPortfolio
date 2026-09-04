"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";
import { useScrollLock } from "@/lib/scroll-lock";

/**
 * The boot sequence. Plays once per session, then never again until the tab
 * is closed.
 *
 * HYDRATION, which is the only genuinely hard part of this component:
 *
 * The overlay is rendered by the server AND by the first client render,
 * unconditionally. It is tempting to write
 * `useState(() => sessionStorage.getItem("booted") === "1")` and return null
 * for a returning visitor, but that is a *structural* mismatch — the server
 * emitted an element the client did not — and `suppressHydrationWarning`
 * covers attributes and text, not a removed subtree. React would recover by
 * re-rendering, which is exactly the flash this is trying to prevent.
 *
 * Instead: the returning visitor's inline <head> script (app/layout.tsx) sets
 * `html[data-booted]` synchronously during parse, and globals.css hides
 * `[data-boot]` under that attribute. So the element is in the markup but was
 * never painted, and the effect below simply unmounts it. Same pixels, no
 * mismatch.
 *
 * The copy is deliberately language-neutral. A translated boot screen would
 * reintroduce, inside the overlay, the very English-to-Turkish flash the head
 * script exists to prevent — the language context has not resolved yet at
 * this point in the render.
 */

const LINES = [
  { text: "$ ./init --portfolio", tone: "cmd" },
  { text: "resolving modules", tone: "step" },
  { text: "mounting sections", tone: "step" },
  { text: "hydrating interface", tone: "step" },
  { text: "$ ready", tone: "done" },
] as const;

const STEP_MS = 190;
const HOLD_MS = 320;

export default function BootOverlay() {
  const [gone, setGone] = useState(false);
  const [shown, setShown] = useState(0);

  useScrollLock(!gone);

  useEffect(() => {
    let alreadyBooted = false;
    try {
      alreadyBooted = sessionStorage.getItem("booted") === "1";
    } catch {
      /* private mode: treat as a fresh boot, it is only cosmetic */
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const finish = () => {
      try {
        sessionStorage.setItem("booted", "1");
      } catch {
        /* ignore */
      }
      setGone(true);
    };

    if (alreadyBooted || reduced) {
      finish();
      return;
    }

    // The rest of the page must not be reachable by keyboard while a modal
    // overlay is up. React 19 supports `inert` natively, but <main> is a
    // sibling rendered by `children`, so it is set imperatively here.
    const main = document.getElementById("main");
    main?.setAttribute("inert", "");

    const timers: number[] = [];
    LINES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setShown(i + 1), i * STEP_MS));
    });
    timers.push(
      window.setTimeout(finish, LINES.length * STEP_MS + HOLD_MS),
    );

    // Anyone who has seen this once and is impatient can leave immediately.
    const skip = () => finish();
    window.addEventListener("keydown", skip, { once: true });
    window.addEventListener("pointerdown", skip, { once: true });

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      main?.removeAttribute("inert");
    };
  }, []);

  useEffect(() => {
    if (gone) document.getElementById("main")?.removeAttribute("inert");
  }, [gone]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          data-boot
          role="status"
          aria-live="polite"
          aria-label="Loading"
          // Wipes upward off the screen rather than fading, so the hero is
          // revealed rather than cross-dissolved into.
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: EASE_OUT }}
          className="term fixed inset-0 z-[95] flex items-center justify-center px-6"
          style={{ clipPath: "inset(0 0 0% 0)" }}
        >
          <div className="w-full max-w-md">
            <ol className="space-y-1.5 text-screen">
              {LINES.map((line, i) => (
                <li
                  key={line.text}
                  className={
                    i < shown
                      ? "opacity-100 transition-opacity duration-150"
                      : "opacity-0"
                  }
                >
                  {line.tone === "step" ? (
                    <span className="flex items-baseline gap-2 text-muted">
                      <span className="text-accent-dim" aria-hidden="true">
                        {"::"}
                      </span>
                      <span className="flex-1">{line.text}</span>
                      <span
                        aria-hidden="true"
                        className="flex-1 border-b border-dotted border-border translate-y-[-0.2em]"
                      />
                      <span className="text-accent">ok</span>
                    </span>
                  ) : (
                    <span
                      className={
                        line.tone === "done" ? "text-accent" : "text-text"
                      }
                    >
                      {line.text}
                    </span>
                  )}
                </li>
              ))}
            </ol>

            {/* Progress is real: it tracks how many lines have actually
                resolved. There is no fake percentage anywhere on this page. */}
            <div className="mt-6 h-px w-full bg-border-faint">
              <div
                className="h-px bg-accent transition-[width] duration-150 ease-linear"
                style={{ width: `${(shown / LINES.length) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
