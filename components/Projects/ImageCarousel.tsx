"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";
import { asset, cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";

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
    <div className="term border-b border-border">
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
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            initial={{ opacity: 0, x: dir > 0 ? "100%" : "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir > 0 ? "-100%" : "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            {/* Loading skeleton, inside the slide rather than behind it.
                As a sibling at `inset-0` it also pulsed in the letterbox
                bars an `object-contain` screenshot leaves — so the frame
                breathed around a fully-loaded image. */}
            {!loaded && (
              <div className="absolute inset-0 animate-pulse bg-surface-2" />
            )}
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
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md border border-border-strong bg-surface/90 text-text shadow-plate backdrop-blur-sm transition-all duration-200 hover:border-accent hover:bg-surface hover:text-accent active:scale-95"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label={m.nextImage}
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md border border-border-strong bg-surface/90 text-text shadow-plate backdrop-blur-sm transition-all duration-200 hover:border-accent hover:bg-surface hover:text-accent active:scale-95"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>

            <span
              aria-live="polite"
              className="absolute bottom-3 right-3 rounded-xs border border-border bg-surface/90 px-2 py-0.5 text-[11px] text-faint backdrop-blur-sm"
            >
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {!single && (
        <div className="flex items-center justify-center gap-0.5 border-t border-border bg-surface-2 py-1.5">
          {/* The bar is the indicator; the button around it is the target.
              These used to BE the button at h-1.5 — a 6px-tall hit area,
              well under any usable touch target and the crudest control on
              the page. The padding does the reaching, the bar does the
              showing. */}
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
              className="group flex h-7 items-center px-1"
            >
              <span
                aria-hidden
                className={cn(
                  "block h-1 rounded-full transition-all duration-300",
                  i === index
                    ? "w-7 bg-accent"
                    : "w-4 bg-border-strong group-hover:w-5 group-hover:bg-accent-bright",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
