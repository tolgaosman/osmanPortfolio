/* eslint-disable @next/next/no-img-element --
   next/image cannot help on this site. `images.unoptimized` is set for the
   static export, so it performs no resizing, no format negotiation and no
   lazy-loading policy of its own; all it adds is an absolutely-positioned
   wrapper that fights the transformed ancestors these images live inside.
   The two things it would have given us — an explicit intrinsic size and a
   fetch priority — are set by hand on the <img> below. */

"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { projects } from "@/data/projects";
import { useLang } from "@/lib/i18n";
import { asset, cn } from "@/lib/utils";

/**
 * Real project screenshots cycling on a laptop screen, each one a shortcut
 * into that project.
 *
 * Two implementation notes that are not preference:
 *
 *   - Plain <img>, not next/image. `images.unoptimized` is set for the static
 *     export, so next/image provides nothing here except a `position:
 *     absolute` wrapper that interacts badly with a 3D-transformed
 *     containing block. Explicit width/height still prevents layout shift.
 *   - Every src goes through `asset()`. Without the basePath prefix these
 *     resolve locally and 404 on GitHub Pages — the failure mode that only
 *     appears in production.
 */

const SLIDE_MS = 2800;

// Only web projects that actually ship screenshots. This laptop screen is
// standing in for a browser, so a mobile app screenshot inside it reads as a
// mistake; inventory-management has no screenshots yet, and a laptop showing
// a "no image" placeholder is worse than a laptop showing one fewer project.
const PEEKS = projects
  .filter((p) => p.category === "Web" && p.details?.images?.length)
  .map((p) => ({ id: p.id, title: p.title, src: p.details!.images![0] }));

export default function ProjectPeek({
  onOpen,
}: {
  onOpen: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduced = useReducedMotion();
  const { lang, t } = useLang();
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Pick a random project on mount to ensure a different one shows each time,
    // without causing SSR hydration mismatches (since random differs on server vs client).
    setIndex(Math.floor(Math.random() * Math.max(1, PEEKS.length)));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (reduced || !inView || PEEKS.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % PEEKS.length),
      SLIDE_MS,
    );
    return () => clearInterval(id);
  }, [inView, reduced]);

  if (PEEKS.length === 0) return null;
  const peek = PEEKS[index];

  return (
    <div ref={ref} className="absolute inset-0 bg-[#080808]">
      <button
        type="button"
        onClick={() => onOpen(peek.id)}
        data-cursor="view"
        className="group absolute inset-0 block overflow-hidden text-left"
        aria-label={`${t.projects.viewDetails}: ${peek.title[lang]}`}
      >
        <img
          // Keyed by src so React swaps the element rather than mutating one
          // <img>, which would otherwise show the previous frame until the
          // new file decodes.
          key={peek.src}
          src={asset(peek.src)}
          alt=""
          width={1280}
          height={800}
          loading="lazy"
          decoding="async"
          className={cn(
            "h-full w-full object-contain object-top transition-opacity duration-500",
            mounted ? "opacity-90 group-hover:opacity-100" : "opacity-0"
          )}
        />
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-bg/95 backdrop-blur-sm px-1.5 py-1 font-mono text-[0.5625rem] leading-none">
          <span className="truncate text-text">{peek.title[lang]}</span>
          <span className="shrink-0 text-accent" aria-hidden="true">
            {index + 1}/{PEEKS.length}
          </span>
        </span>
      </button>
    </div>
  );
}
