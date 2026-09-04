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
 * The cutout is WebP with alpha, not PNG — `images.unoptimized` is set for
 * the static export so nothing downsizes it at build time, and a PNG at this
 * resolution would run 1-3 MB on what is the page's LCP element. Encoded at
 * quality 88 the actual asset is 57 KB.
 *
 * The face sits at x=50.4% of the 1024x1024 source (measured, not eyeballed —
 * see the centroid script this was generated with). Because the hero's
 * portrait frame is aspect-[3/4] — narrower than the 1:1 source — object-cover
 * always shows the FULL HEIGHT and crops left/right only, so `object-center`
 * keeps the face framed regardless of viewport height.
 */
const HAS_CUTOUT = true;
const PORTRAIT_SRC = HAS_CUTOUT ? "/osman-cutout.webp" : "/osman_cv_pp.jpeg";

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
          "h-full w-full object-cover object-center",
          // .photo-jade / .photo-jade-heavy: see the grading note in
          // globals.css — the cutout needs a light touch, the fallback
          // photo's background needs to be pulled hard toward the palette.
          HAS_CUTOUT ? "photo-jade" : "photo-jade-heavy object-[50%_38%] photo-feather",
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
