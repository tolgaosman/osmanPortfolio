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
 * bezel is a leaf and everything inside it is 2D.
 *
 *   - The deck is stacked under the lid by Z position, not `z-index`.
 *   - The deck is absolutely positioned so it does not reserve un-rotated
 *     height in layout.
 *   - `.lap__front` counter-rotates by -60deg to stand vertical as the
 *     machined aluminum chassis front lip.
 */

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
      {/* Ground contact shadow — outside the 3D rig so it sits on the floor. */}
      <span
        aria-hidden="true"
        className="lap__ground pointer-events-none absolute inset-x-[-10%] top-[84%] h-[58%]"
      />

      <div ref={rig} className="lap__rig relative">
        <div className="lap__lid">
          <div className="lap__bezel aspect-[16/10] px-[2.4%] pb-[4.4%] pt-[2.8%]">
            {/* Recessed webcam lens with subtle optical glint. */}
            <span
              aria-hidden="true"
              className="lap__cam absolute left-1/2 top-[1%] flex aspect-square w-[1.8%] -translate-x-1/2 items-center justify-center rounded-full"
            >
              <span className="h-[38%] w-[38%] rounded-full bg-accent/40" />
            </span>

            <div className="lap__screen relative h-full overflow-hidden rounded-[2px]">
              {children}
              {/* Diagonal glass reflection — leaf inside a leaf. */}
              <span
                aria-hidden="true"
                className="lap__glare pointer-events-none absolute inset-0"
              />
            </div>

            {/* Subtle anodized lid chin accent. */}
            <span
              aria-hidden="true"
              className="lap__chin absolute bottom-[1.7%] left-1/2 h-[1px] w-[8%] -translate-x-1/2"
            />
          </div>
        </div>

        {/* Machined dark-anodized clutch hinge barrel. */}
        <span
          aria-hidden="true"
          className="lap__hinge absolute inset-x-[6%] top-full h-[3.2%]"
        />

        <div
          aria-hidden="true"
          className="lap__deck absolute left-0 top-full aspect-[16/9] w-full"
        >
          {/* Soft screen-to-deck bounce light near the hinge. */}
          <span className="lap__deck-glow pointer-events-none absolute inset-x-[4%] top-0 h-[44%]" />

          {/* Left & right micro-perforated speaker grilles. */}
          <span className="lap__grille pointer-events-none absolute bottom-[38%] left-[2.2%] top-[9%] w-[4.4%]" />
          <span className="lap__grille pointer-events-none absolute bottom-[38%] right-[2.2%] top-[9%] w-[4.4%]" />

          {/* Recessed keyboard well with subtle jade keycap backlighting. */}
          <div className="lap__well absolute inset-x-[8%] bottom-[38%] top-[9%] flex flex-col gap-[2.4%] p-[1.4%]">
            {KEY_ROWS.map((count, row) => (
              <div key={row} className="flex flex-1 gap-[1.15%]">
                {Array.from({ length: count }, (_, key) => (
                  <span key={key} className="lap__key flex-1" />
                ))}
              </div>
            ))}
            {/* Modifier row + space bar. */}
            <div className="flex flex-1 gap-[1.15%]">
              <span className="lap__key w-[11%]" />
              <span className="lap__key w-[8%]" />
              <span className="lap__key w-[8%]" />
              <span className="lap__key flex-1" />
              <span className="lap__key w-[8%]" />
              <span className="lap__key w-[8%]" />
              <span className="lap__key w-[11%]" />
            </div>
          </div>

          {/* Chamfered glass trackpad. */}
          <span className="lap__pad absolute bottom-[6%] left-1/2 h-[27%] w-[32%] -translate-x-1/2" />

          {/* Machined aluminum front lip with recessed thumb scoop. */}
          <span className="lap__front absolute inset-x-0 top-full block h-[8%]">
            <span className="lap__notch absolute left-1/2 top-0 h-[44%] w-[15%] -translate-x-1/2 rounded-b-[3px]" />
          </span>
        </div>
      </div>
    </div>
  );
}
