"use client";

import { useEffect } from "react";

/**
 * One counter for the whole page.
 *
 * Three components need to freeze the background scroll — the boot overlay,
 * the mobile nav sheet and the project modal — and previously each one wrote
 * `document.body.style.overflow` directly. Whichever unmounted last won, so
 * closing the modal from inside an open mobile sheet unlocked the page while
 * the sheet was still up. A counter makes the lock additive: the body only
 * unlocks when the last holder releases it.
 *
 * The scrollbar-width compensation matters more than it looks: without it,
 * removing the scrollbar shifts every centred element a few pixels sideways
 * at exactly the moment an overlay animates in, which reads as a jump.
 */
let holders = 0;
let restore: (() => void) | null = null;

function acquire() {
  holders += 1;
  if (holders > 1) return;

  const { body, documentElement } = document;
  const previousOverflow = body.style.overflow;
  const previousPaddingRight = body.style.paddingRight;
  const gap = window.innerWidth - documentElement.clientWidth;

  body.style.overflow = "hidden";
  if (gap > 0) body.style.paddingRight = `${gap}px`;

  restore = () => {
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
  };
}

function release() {
  holders = Math.max(0, holders - 1);
  if (holders === 0 && restore) {
    restore();
    restore = null;
  }
}

/** Locks background scrolling while `active` is true. */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    acquire();
    return release;
  }, [active]);
}
