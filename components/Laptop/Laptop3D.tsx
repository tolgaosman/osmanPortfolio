"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTilt } from "@/lib/motion";

/**
 * A laptop, built out of CSS boxes in a real 3D rendering context.
 *
 * THE RULE THIS COMPONENT EXISTS TO ENFORCE:
 *   `transform-style: preserve-3d` goes on assembly nodes (.lap__rig,
 *   .lap__lid, .lap__deck). `overflow: hidden` goes on leaf nodes
 *   (.lap__bezel). Never both on one element.
 *
 * That is spec, not a browser quirk — CSS Transforms Level 2 forces
 * transform-style to `flat` on any element with overflow other than visible
 * (and on opacity < 1, filter, mask, clip-path, non-normal mix-blend-mode,
 * isolation, contain: paint). The bezel MUST clip its screen contents, so the
 * bezel is a leaf and everything inside it is 2D. Move `overflow: hidden` up
 * one level and the whole assembly silently flattens into a rectangle. The
 * same rule is why the contact shadow is a radial gradient rather than a
 * blurred box, and why it hangs outside the rig entirely.
 *
 * Three more things that look like they want "cleaning up" and must not be:
 *
 *   - The deck is stacked under the lid by Z position, not `z-index`. Inside
 *     a 3D context, painting order is determined by computed Z; reaching for
 *     z-index here is what produces the classic "the keyboard draws on top of
 *     the screen" bug. The hinge's `translateZ(1px)` is the same mechanism
 *     used deliberately: it settles a coincident-Z tie with the deck's rear
 *     edge that would otherwise z-fight.
 *   - The deck is absolutely positioned. In normal flow it would reserve its
 *     full un-rotated height in layout and leave a large dead gap under every
 *     laptop.
 *   - `.lap__front` counter-rotates by exactly the deck's own 60deg, which
 *     lands it vertical to the camera at the deck's near edge. That is the
 *     chassis thickness, and it is the single part that stops the deck from
 *     reading as a decal painted on the floor.
 *
 * The tilt range is capped at 8/6 degrees by `useTilt`. Past roughly that,
 * 11px mono inside a transformed layer goes soft in WebKit and Gecko, and the
 * entire point of these is that you can read what is on the screen.
 */

/* A keyboard is a specific object, and the thing that makes it specific is
   that its rows are not the same length. Six equal rows read as a grid; 14 /
   14 / 13 / 12 / 11 plus a modifier row reads as a keyboard. Fixed data at
   module scope — nothing here is random, so nothing here can desync between
   the server render and the client one. */
const KEY_ROWS = [14, 14, 13, 12, 11];

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
    <div
      className={cn("lap lap--device relative", className)}
      style={style}
      role="group"
      aria-label={label}
    >
      {/* Ground contact. First in DOM so it paints behind, and outside the
          rig so it is not swept into the 3D context. */}
      <span
        aria-hidden="true"
        className="lap__ground pointer-events-none absolute inset-x-[-6%] top-[86%] h-[52%]"
      />

      <div ref={rig} className="lap__rig relative">
        <div className="lap__lid">
          <div className="lap__bezel aspect-[16/10] px-[3.2%] pb-[7%] pt-[3.2%]">
            {/* Camera, centred in the top bezel. */}
            <span
              aria-hidden="true"
              className="lap__cam absolute left-1/2 top-[1.4%] aspect-square w-[1.6%] -translate-x-1/2 rounded-full"
            />

            <div className="lap__screen relative h-full overflow-hidden rounded-[2px]">
              {children}
              {/* Glare. A leaf inside a leaf — no 3D implications. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent"
              />
            </div>

            {/* Chin mark. */}
            <span
              aria-hidden="true"
              className="lap__chin absolute bottom-[2.6%] left-1/2 h-[1px] w-[9%] -translate-x-1/2"
            />
          </div>
        </div>

        {/* Hinge barrel, square to the camera at the fold. */}
        <span
          aria-hidden="true"
          className="lap__hinge absolute inset-x-[6%] top-full h-[3%]"
        />

        <div
          aria-hidden="true"
          className="lap__deck absolute left-0 top-full aspect-[16/9] w-full"
        >
          <div className="absolute inset-x-[5%] bottom-[38%] top-[9%] flex flex-col gap-[2.2%]">
            {KEY_ROWS.map((count, row) => (
              <div key={row} className="flex flex-1 gap-[1.1%]">
                {Array.from({ length: count }, (_, key) => (
                  <span key={key} className="lap__key flex-1" />
                ))}
              </div>
            ))}
            {/* Modifier row: the space bar is what makes the block scan as a
                keyboard rather than as a spreadsheet. */}
            <div className="flex flex-1 gap-[1.1%]">
              <span className="lap__key w-[11%]" />
              <span className="lap__key w-[8%]" />
              <span className="lap__key w-[8%]" />
              <span className="lap__key flex-1" />
              <span className="lap__key w-[8%]" />
              <span className="lap__key w-[8%]" />
              <span className="lap__key w-[11%]" />
            </div>
          </div>

          {/* Trackpad. Slightly off-centre-low, the way a real deck is. */}
          <span className="lap__pad absolute bottom-[7%] left-1/2 h-[26%] w-[30%] -translate-x-1/2" />

          {/* Chassis front: counter-rotated to stand vertical to the camera,
              with the finger notch a lid is opened by. */}
          <span className="lap__front absolute inset-x-0 top-full block h-[7%]">
            <span className="absolute left-1/2 top-0 h-[38%] w-[14%] -translate-x-1/2 rounded-b-[2px] bg-bg/70" />
          </span>
        </div>
      </div>
    </div>
  );
}
