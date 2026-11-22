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
 * No scrollbar-width padding here: `html { scrollbar-gutter: stable }` keeps
 * the gutter reserved, so the viewport width never changes. Padding only the
 * body used to move static content while the fixed nav (which ignores body
 * padding) still shifted, which read as the language switch wobbling.
 */
let holders = 0;
let restore: (() => void) | null = null;

function acquire() {
  holders += 1;
  if (holders > 1) return;

  const { body } = document;
  const previousOverflow = body.style.overflow;

  body.style.overflow = "hidden";

  restore = () => {
    body.style.overflow = previousOverflow;
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
