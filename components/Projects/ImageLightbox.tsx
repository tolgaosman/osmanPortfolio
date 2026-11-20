/* eslint-disable @next/next/no-img-element --
   next/image cannot help on this site (`images.unoptimized` is set for the
   static export). A plain <img> inside the lightbox viewport scales naturally
   to its intrinsic aspect ratio with max-w / max-h constraints. */

"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from "@/components/Icons";
import { useLang } from "@/lib/i18n";
import { EASE_IN_OUT, SPRING_SOFT } from "@/lib/motion";
import { useScrollLock } from "@/lib/scroll-lock";
import { asset } from "@/lib/utils";

interface ImageLightboxProps {
  open: boolean;
  images: string[];
  index: number;
  title: string;
  altLabel: string;
  onClose: () => void;
  onPaginate: (step: number) => void;
}

/**
 * Full-screen screenshot viewer portalled directly to `document.body`.
 *
 * Portalling is load-bearing, not cosmetic: `ImageCarousel` can sit inside
 * transformed ancestors (`ProjectModal`, `Reveal`), and CSS makes any
 * transformed ancestor the containing block for `position: fixed`.
 *
 * Keyboard handling runs in the capture phase on `window` so pressing Escape
 * (or Tab / Arrow keys) while stacked on top of `ProjectModal` closes ONLY
 * the lightbox without bubbling to the modal's own document listener.
 */
export default function ImageLightbox(props: ImageLightboxProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {props.open && <LightboxPanel {...props} />}
    </AnimatePresence>,
    document.body,
  );
}

function LightboxPanel({
  images,
  index,
  title,
  altLabel,
  onClose,
  onPaginate,
}: ImageLightboxProps) {
  const { t } = useLang();
  const m = t.projects.modal;
  const count = images.length;
  const single = count <= 1;

  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useScrollLock(true);

  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => {
      triggerRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopImmediatePropagation();
        onClose();
        return;
      }

      if (!single && e.key === "ArrowRight") {
        e.preventDefault();
        e.stopImmediatePropagation();
        onPaginate(1);
        return;
      }

      if (!single && e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopImmediatePropagation();
        onPaginate(-1);
        return;
      }

      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      e.stopImmediatePropagation();
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose, onPaginate, single]);

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — ${altLabel} ${index + 1}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.16, ease: EASE_IN_OUT } }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      className="fixed inset-0 z-[70] flex flex-col bg-bg/95 backdrop-blur-sm"
    >
      {/* Header bar — same instrument chrome as ProjectModal and TerminalPanel. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-surface-2 px-4 py-3 sm:px-6"
      >
        <span className="truncate font-mono text-label uppercase text-faint">
          <span className="text-accent-dim">{"~/preview/"}</span>
          {title}
        </span>

        <div className="flex shrink-0 items-center gap-3">
          {!single && (
            <span aria-live="polite" className="font-mono text-xs text-muted">
              {index + 1} / {count}
            </span>
          )}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={m.close}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface hover:text-text sm:-mr-1 sm:h-8 sm:w-8"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stage — plain surface with no CRT scanlines over the photograph. */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center p-4 sm:p-10">
        <motion.div
          key={images[index]}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={SPRING_SOFT}
          onClick={(e) => e.stopPropagation()}
          className="relative flex max-h-full max-w-full items-center justify-center"
        >
          <img
            src={asset(images[index])}
            alt={`${title} — ${altLabel} ${index + 1}`}
            draggable={false}
            className="max-h-[82svh] max-w-[92vw] rounded-sm border border-border-structural object-contain shadow-float"
          />
        </motion.div>

        {!single && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPaginate(-1);
              }}
              aria-label={m.prevImage}
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-border-strong bg-surface/90 text-text shadow-plate backdrop-blur-sm transition-all duration-200 hover:border-accent hover:bg-surface hover:text-accent active:scale-95 sm:left-6 sm:h-10 sm:w-10"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPaginate(1);
              }}
              aria-label={m.nextImage}
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-border-strong bg-surface/90 text-text shadow-plate backdrop-blur-sm transition-all duration-200 hover:border-accent hover:bg-surface hover:text-accent active:scale-95 sm:right-6 sm:h-10 sm:w-10"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
