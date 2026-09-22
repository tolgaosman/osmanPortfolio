"use client";

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";
import { asset, cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { SPRING_SOFT } from "@/lib/motion";

/** Offset-plus-projected-velocity, in px, that counts as a swipe. */
const SWIPE = 60;

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
            // Use a precise phone aspect ratio instead of arbitrary heights.
            // This ensures the container shape exactly matches the screenshot.
            ? "aspect-[9/19.5] bg-surface-2"
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
            initial={{ opacity: 0, x: dir > 0 ? "100%" : "-100%", rotateZ: 0.01 }}
            animate={{ opacity: 1, x: 0, rotateZ: 0.01 }}
            exit={{ opacity: 0, x: dir > 0 ? "-100%" : "100%", rotateZ: 0.01 }}
            // Underdamped at the old stiffness/damping pair, the slide
            // overshot its resting position and bounced back — read as a
            // jitter right as each transition settled. SPRING_SOFT sits at
            // (very nearly) critical damping, so it decelerates into place
            // instead.
            transition={SPRING_SOFT}
            // Swipe. `dragConstraints` pinned to zero with elastic resistance
            // means the slide never actually travels — the drag is a gesture
            // reader, and the real movement is the same AnimatePresence
            // transition the arrows and the arrow keys drive, so all three
            // paths produce one animation instead of three.
            drag={single ? false : "x"}
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              const throw_ = info.offset.x + info.velocity.x * 0.2;
              if (throw_ < -SWIPE) paginate(1);
              else if (throw_ > SWIPE) paginate(-1);
            }}
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            className="absolute inset-0 touch-pan-y will-change-transform"
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
              draggable={false}
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
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-border-strong bg-surface/90 text-text shadow-plate backdrop-blur-sm transition-all duration-200 hover:border-accent hover:bg-surface hover:text-accent active:scale-95 sm:left-3 sm:h-9 sm:w-9"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label={m.nextImage}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-md border border-border-strong bg-surface/90 text-text shadow-plate backdrop-blur-sm transition-all duration-200 hover:border-accent hover:bg-surface hover:text-accent active:scale-95 sm:right-3 sm:h-9 sm:w-9"
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
        <div className="flex items-center justify-center gap-1.5 border-t border-border bg-surface-2 py-2">
          {/* The dot is the indicator; the button around it is the target —
              h-6 clears the 24px WCAG minimum without the row itself ballooning
              into a slab, which is what happened at the old 44px iOS-ideal
              target on an 8-image row inside a phone-width card. */}
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
              className="group flex h-6 items-center px-0.5"
            >
              <span
                aria-hidden
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300",
                  i === index
                    ? "w-6 bg-accent shadow-glow-sm"
                    : "w-1.5 bg-border-strong group-hover:bg-accent-bright",
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
