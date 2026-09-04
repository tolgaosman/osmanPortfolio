/* eslint-disable @next/next/no-img-element --
   next/image cannot help on this site. `images.unoptimized` is set for the
   static export, so it performs no resizing, no format negotiation and no
   lazy-loading policy of its own; all it adds is an absolutely-positioned
   wrapper that fights the transformed ancestors these images live inside.
   The two things it would have given us — an explicit intrinsic size and a
   loading policy — are set by hand on the <img> below. */

"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { asset } from "@/lib/utils";

/**
 * The portrait, with its background, in the About column.
 *
 * This is the ORIGINAL photograph — a dusk garden shot — not the alpha cutout
 * the hero uses. The two are the same person and deliberately not the same
 * image: the hero needs a figure that can stand in front of its own name with
 * nothing behind it, and this section needs a photograph, with the place it
 * was taken in still in it.
 *
 * Because the background is the point here, none of the fallback path's
 * dissolving treatments apply — no `.photo-feather` mask, no `.photo-duotone`
 * colour blend, no vignette. The only grade is `.photo-jade-flat`
 * (saturate 0.92, no contact shadow — the frame carries the elevation), which
 * settles the colour into the palette without draining it. `.photo-jade-heavy`
 * at saturate 0.55 would take the garden with it.
 *
 * The face sits at roughly x=50%, y=38% of the source, so a 4:5 frame with
 * `object-[50%_38%]` keeps the head in the upper third where a portrait wants
 * it, rather than centring the crop on the chest.
 */
export default function AboutPortrait() {
  const { t } = useLang();
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[20rem] overflow-hidden rounded-md border border-border-structural bg-surface-2 shadow-plate lg:max-w-none">
      <div className="aspect-[4/5]">
        {failed ? (
          // The section still has to compose if this one file never arrives.
          <div
            aria-hidden="true"
            className="flex h-full w-full items-center justify-center font-display text-5xl font-bold text-border-structural"
          >
            TO
          </div>
        ) : (
          <img
            src={asset("/osman_cv_pp.jpeg")}
            alt={t.about.photoAlt}
            width={1024}
            height={1024}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
            className="photo-jade-flat h-full w-full object-cover object-[50%_38%]"
          />
        )}
      </div>
    </div>
  );
}
