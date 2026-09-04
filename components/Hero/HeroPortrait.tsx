/* eslint-disable @next/next/no-img-element --
   next/image cannot help on this site. `images.unoptimized` is set for the
   static export, so it performs no resizing, no format negotiation and no
   lazy-loading policy of its own; all it adds is an absolutely-positioned
   wrapper that fights the transformed ancestors these images live inside.
   The two things it would have given us — an explicit intrinsic size and a
   fetch priority — are set by hand on the <img> below. */

"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { asset, cn } from "@/lib/utils";

/**
 * The portrait, standing in front of the wall name.
 *
 * ONE SWITCH, TWO TREATMENTS. `HAS_CUTOUT` is the only thing that changes if
 * the background-removed asset lands, or has to be reverted:
 *
 *   true  — an alpha cutout. The subject already ends where the subject ends,
 *           so the image only takes the jade grade and its contact shadow.
 *   false — the original rectangular photograph, a dusk garden shot. Its
 *           edges are feathered into the ground on all four sides and its hue
 *           is pushed toward the accent, so foliage, sky and lawn read as one
 *           graded surface rather than as a colour photo dropped into a
 *           monochrome page. The `color` blend preserves luminance, so the
 *           face survives intact.
 *
 * When the cutout arrives it should be WebP with alpha, not PNG.
 * `images.unoptimized` is set for the static export, so nothing downsizes it
 * at build time, a full-height transparent PNG would be 1-3 MB, and this is
 * the LCP element.
 */
const HAS_CUTOUT = false;
const PORTRAIT_SRC = "/osman_cv_pp.jpeg";

export default function HeroPortrait({ className }: { className?: string }) {
  const { t } = useLang();
  const [failed, setFailed] = useState(false);

  if (failed) {
    // Explicit failure state rather than a broken-image icon: the hero still
    // has to compose if the network drops this one file.
    return (
      <div
        className={cn(
          "flex h-full w-full items-end justify-center font-display text-wall font-bold text-border-structural",
          className,
        )}
        aria-hidden="true"
      >
        TO
      </div>
    );
  }

  return (
    <div className={cn("relative h-full w-full", className)}>
      <img
        src={asset(PORTRAIT_SRC)}
        alt={t.about.photoAlt}
        width={1024}
        height={1024}
        fetchPriority="high"
        decoding="async"
        onError={() => setFailed(true)}
        className={cn(
          "photo-jade h-full w-full object-cover",
          // Pulled down off the sky in the original frame. On a 3:4 crop of a
          // square source this is the difference between a portrait and a
          // holiday photo.
          HAS_CUTOUT ? "object-[50%_12%]" : "object-[50%_38%]",
          !HAS_CUTOUT && "photo-feather",
        )}
      />

      {!HAS_CUTOUT && (
        <>
          <span
            aria-hidden="true"
            className="photo-duotone photo-feather pointer-events-none absolute inset-0"
          />
          {/* Deepens the same four edges the mask fades, so the figure sits in
              the dark rather than in front of it. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_38%,transparent_35%,var(--color-bg)_100%)]"
          />
        </>
      )}
    </div>
  );
}
