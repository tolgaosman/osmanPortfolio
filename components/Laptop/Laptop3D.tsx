"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTilt } from "@/lib/motion";

/**
 * A laptop, built out of CSS boxes in a real 3D rendering context.
 *
 * THE RULE THIS COMPONENT EXISTS TO ENFORCE:
 *   `transform-style: preserve-3d` goes on assembly nodes (.lap__rig,
 *   .lap__lid). `overflow: hidden` goes on leaf nodes (.lap__bezel). Never
 *   both on one element.
 *
 * That is spec, not a browser quirk — CSS Transforms Level 2 forces
 * transform-style to `flat` on any element with overflow other than visible
 * (and on opacity < 1, filter, mask, clip-path, non-normal mix-blend-mode,
 * isolation, contain: paint). The bezel MUST clip its screen contents, so the
 * bezel is a leaf and everything inside it is 2D. Move `overflow: hidden` up
 * one level and the whole assembly silently flattens into a rectangle.
 *
 * Two more things that look like they want "cleaning up" and must not be:
 *
 *   - The deck is stacked under the lid by Z position, not `z-index`. Inside
 *     a 3D context, painting order is determined by computed Z; reaching for
 *     z-index here is what produces the classic "the keyboard draws on top of
 *     the screen" bug.
 *   - The deck is absolutely positioned. In normal flow it would reserve its
 *     full un-rotated height in layout — roughly five times the ~20% of it
 *     that is visible after rotateX(78deg) — and leave a large dead gap under
 *     every laptop.
 *
 * The tilt range is capped at 8/6 degrees by `useTilt`. Past roughly that,
 * 11px mono inside a transformed layer goes soft in WebKit and Gecko, and the
 * entire point of these is that you can read what is on the screen.
 */
export default function Laptop3D({
  children,
  label,
  className,
  style,
}: {
  children: ReactNode;
  /** What the screen is showing, for assistive tech. */
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const rig = useTilt<HTMLDivElement>(7);

  return (
    <div className={cn("lap", className)} style={style} role="group" aria-label={label}>
      <div ref={rig} className="lap__rig relative">
        <div className="lap__lid">
          <div className="lap__bezel aspect-[16/10] p-[3.5%]">
            <div className="lap__screen relative h-full overflow-hidden rounded-[2px] px-2 py-1.5">
              {children}
              {/* Glare. A leaf inside a leaf — no 3D implications. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent"
              />
            </div>
          </div>
          {/* Hinge lip: a single lit hairline where the lid meets the deck.
              This is what makes the fold read as a fold rather than as two
              unrelated rectangles. */}
          <span
            aria-hidden="true"
            className="absolute inset-x-[8%] top-full h-px bg-border-strong"
          />
        </div>

        <div
          aria-hidden="true"
          className="lap__deck absolute left-[-7%] top-full aspect-[16/6] w-[114%]"
        >
          <span className="lap__keys absolute inset-x-[6%] inset-y-[14%] block rounded-[1px]" />
          {/* Trackpad. Slightly off-centre-low, the way a real deck is. */}
          <span className="absolute bottom-[6%] left-1/2 h-[16%] w-[22%] -translate-x-1/2 rounded-[1px] border border-border bg-bg/40" />
        </div>
      </div>
    </div>
  );
}
