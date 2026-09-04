"use client";

import { useSyncExternalStore } from "react";

/**
 * SSR-safe media query.
 *
 * The server snapshot is always `false`, so the static export and the first
 * client render agree and there is no hydration mismatch — the "small" or
 * "no pointer" branch is what ships in the HTML, and the richer branch swaps
 * in after hydration. That ordering is deliberate: the cheap layout is the
 * one a crawler, a no-JS visitor and a slow phone see first.
 *
 * useSyncExternalStore rather than useState + useEffect because the latter
 * paints once with the wrong value before correcting itself.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Matches Tailwind's `lg` breakpoint (64rem). */
export const LG = "(min-width: 64rem)";

/**
 * A real mouse — not `(pointer: fine)` alone. A Surface with both a pen and a
 * touchscreen reports `pointer: fine` while the user is touching the glass;
 * requiring `hover: hover` too is what separates "has a cursor" from "can
 * momentarily produce a precise point".
 */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
