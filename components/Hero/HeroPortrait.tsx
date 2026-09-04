"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { asset, cn } from "@/lib/utils";
import { siteConfig } from "@/data/site";
import { useLang } from "@/lib/i18n";
import { EASE_OUT } from "@/lib/motion";

/** "Tolga Osman" -> "TO", for the load-failure fallback plate below. */
function initialsOf(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

interface HeroPortraitProps {
  className?: string;
}

export default function HeroPortrait({ className }: HeroPortraitProps) {
  const { t } = useLang();
  const [errored, setErrored] = useState(false);

  return (
    <motion.figure
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
      className={cn("relative aspect-[4/5] w-full max-w-[420px]", className)}
    >
      <div className="relative h-full w-full overflow-hidden border border-border shadow-plate inset-shadow-lip">
        {errored ? (
          // Same-size fallback plate — if the photo 404s the layout doesn't
          // shift and the frame still reads as an intentional portrait.
          <div className="flex h-full w-full items-center justify-center bg-surface-2 font-display text-6xl text-accent">
            {initialsOf(siteConfig.shortName)}
          </div>
        ) : (
          <>
            {/* The source is a square dusk garden shot — lawn along the bottom,
                foliage across the top. Cropping to 4:5 and biasing the origin
                upward pushes the lawn out of frame and leaves the greenery as
                a soft band behind the head. `.photo-warm` grades the remaining
                green down so it stops competing with the ochre accent. */}
            <Image
              src={asset("/osman_cv_pp.jpeg")}
              alt={t.about.photoAlt}
              fill
              sizes="(min-width: 1024px) 420px, (min-width: 640px) 60vw, 90vw"
              unoptimized
              priority
              onError={() => setErrored(true)}
              className="photo-warm scale-[1.18] object-cover object-[50%_22%]"
            />
            <div
              aria-hidden
              className="photo-vignette pointer-events-none absolute inset-0"
            />
          </>
        )}
      </div>
    </motion.figure>
  );
}
