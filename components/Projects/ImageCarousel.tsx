"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";
import { asset, cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { EASE_OUT } from "@/lib/motion";

interface ImageCarouselProps {
  /**
   * Real screenshot paths. The caller (ProjectModal) only mounts this
   * component when a project has at least one, so this list is never empty —
   * there's no placeholder-slide fallback to keep in sync with that check.
   */
  images: string[];
  title: string;
  altLabel: string;
  /** "portrait" fits phone screenshots without cropping (object-contain). */
  orientation?: "landscape" | "portrait";
}

export default function ImageCarousel({
  images,
  title,
  altLabel,
  orientation = "landscape",
}: ImageCarouselProps) {
  const { t } = useLang();
  const m = t.projects.modal;
  const portrait = orientation === "portrait";
  const count = images.length;

  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const [loaded, setLoaded] = useState(false);

  const paginate = useCallback(
    (step: number) => {
      setLoaded(false);
      setState(([current]) => {
        const next = (current + step + count) % count;
        return [next, step];
      });
    },
    [count],
  );

  const single = count <= 1;

  return (
    <div className="plane-well border-b border-border">
      <div
        className={cn(
          "relative w-full overflow-hidden",
          portrait
            ? "h-[55vh] max-h-[480px] bg-surface-2 sm:h-[70vh] sm:max-h-[640px]"
            : "aspect-video",
        )}
        role="group"
        aria-roledescription="carousel"
        aria-label={title}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") paginate(1);
          if (e.key === "ArrowLeft") paginate(-1);
        }}
        tabIndex={0}
      >
        {/* Loading skeleton — reuses the existing grid/surface-2 texture
            instead of leaving a blank box while the screenshot downloads. */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-surface-2" />
        )}

        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir >= 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir >= 0 ? -40 : 40 }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="absolute inset-0"
          >
            <Image
              src={asset(images[index])}
              alt={`${title} — ${altLabel} ${index + 1}`}
              fill
              className="object-contain"
              unoptimized
              onLoad={() => setLoaded(true)}
              sizes={portrait ? "(max-width: 768px) 100vw, 400px" : "(max-width: 768px) 100vw, 768px"}
            />
          </motion.div>
        </AnimatePresence>

        {!single && (
          <>
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label={m.prevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 border border-border-strong bg-surface/90 p-2 text-text shadow-lift transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label={m.nextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 border border-border-strong bg-surface/90 p-2 text-text shadow-lift transition-colors hover:border-accent hover:text-accent"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>

            <span
              aria-live="polite"
              className="absolute bottom-3 right-3 border border-border bg-surface/90 px-2 py-0.5 font-mono text-[11px] text-faint"
            >
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {!single && (
        <div className="flex items-center justify-center gap-2 border-t border-border bg-surface-2 py-2.5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`${m.goToImage} ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => {
                if (i === index) return;
                setLoaded(false);
                setState([i, i > index ? 1 : -1]);
              }}
              className={cn(
                "h-1.5 w-6 border border-border transition-colors",
                i === index ? "bg-accent" : "bg-transparent hover:bg-accent/30",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
