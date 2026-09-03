"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { asset } from "@/lib/utils";
import { siteConfig } from "@/data/site";
import { useLang } from "@/lib/i18n";

/** "Tolga Osman" -> "TO", for the load-failure fallback plate below. */
function initialsOf(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function HeroPortrait() {
  const { t } = useLang();
  const [errored, setErrored] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      className="relative h-36 w-36 shrink-0 sm:h-44 sm:w-44"
    >
      <div
        className="relative h-full w-full overflow-hidden border-2 border-border shadow-glow-sm"
        style={{ borderRadius: "9999px 9999px 18px 18px" }}
      >
        {errored ? (
          // Same-size fallback plate — if the photo 404s, the layout doesn't
          // shift and the frame still reads as an intentional avatar.
          <div className="flex h-full w-full items-center justify-center bg-surface-2 font-mono text-3xl font-bold text-accent">
            {initialsOf(siteConfig.shortName)}
          </div>
        ) : (
          <>
            <Image
              src={asset("/osman_cv_pp.jpeg")}
              alt={t.about.photoAlt}
              fill
              sizes="(min-width: 640px) 176px, 144px"
              unoptimized
              priority
              onError={() => setErrored(true)}
              className="object-cover grayscale contrast-125 brightness-90"
            />
            <div aria-hidden className="duotone-tint pointer-events-none absolute inset-0" />
            <div aria-hidden className="duotone-fade pointer-events-none absolute inset-0" />
          </>
        )}
      </div>
    </motion.div>
  );
}
