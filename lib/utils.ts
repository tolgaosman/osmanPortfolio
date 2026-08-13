import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class names and dedupe conflicting Tailwind classes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Prefix a public asset path with the GitHub Pages basePath in production. */
export const asset = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const SCROLL_DURATION_MS = 600;

// Module-level so a second call (or user scroll input) can cancel an
// in-flight animation — previously two clicks in quick succession started
// two concurrent rAF loops that fought over window.scrollTo.
let activeScrollRaf: number | null = null;
let cancelOnUserInput: (() => void) | null = null;

function cancelActiveScroll() {
  if (activeScrollRaf !== null) {
    cancelAnimationFrame(activeScrollRaf);
    activeScrollRaf = null;
  }
  if (cancelOnUserInput) {
    window.removeEventListener("wheel", cancelOnUserInput);
    window.removeEventListener("touchstart", cancelOnUserInput);
    cancelOnUserInput = null;
  }
}

/** Scroll smoothly to an element by its ID with an offset. */
export function smoothScrollTo(id: string, offset = 80) {
  if (typeof window === "undefined") return;
  const element = document.getElementById(id);
  if (!element) return;

  cancelActiveScroll();

  const targetPosition = element.getBoundingClientRect().top + window.scrollY - offset;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) {
    window.scrollTo(0, targetPosition);
    return;
  }

  let start: number | null = null;

  function animation(currentTime: number) {
    if (start === null) start = currentTime;
    const timeElapsed = currentTime - start;
    const progress = Math.min(timeElapsed / SCROLL_DURATION_MS, 1);

    // easeInOutQuad easing function for a smooth slide
    const ease = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    window.scrollTo(0, startPosition + distance * ease);

    if (timeElapsed < SCROLL_DURATION_MS) {
      activeScrollRaf = requestAnimationFrame(animation);
    } else {
      cancelActiveScroll();
    }
  }

  // Let the user's own scroll input take over instead of fighting it.
  cancelOnUserInput = () => cancelActiveScroll();
  window.addEventListener("wheel", cancelOnUserInput, { passive: true, once: true });
  window.addEventListener("touchstart", cancelOnUserInput, { passive: true, once: true });

  activeScrollRaf = requestAnimationFrame(animation);
}
