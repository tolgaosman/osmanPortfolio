import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A flat MacBook-style bezel around a project screenshot.
 *
 * Deliberately NOT `Laptop3D`: that component is scenery — tilted, keyed,
 * perspective-projected — built to feel like an object sitting in the hero.
 * This wraps a fixed-size screenshot inside a project card, so it stays 2D
 * chrome with zero layout opinion of its own; `children` keeps whatever
 * aspect ratio `ImageCarousel` (or the empty-state terminal) already sets,
 * this only adds the bezel and a thin base bar around it.
 */
export default function LaptopFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <div className="relative rounded-t-xl border border-b-0 border-border-structural bg-[rgb(var(--ink))] p-2 shadow-plate sm:p-2.5">
        {/* Camera, centred in the top bezel. */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-border-strong/70 sm:top-1.5"
        />
        <div className="overflow-hidden rounded-[6px] bg-black">{children}</div>
      </div>

      {/* Base. Wider than the screen, like a real deck peeking out from under
          the lid — a thin bar, not the hero's full 3D keyboard. */}
      <div className="relative mx-[-4%] h-2.5 rounded-b-xl rounded-t-[4px] border border-t-0 border-border-structural bg-gradient-to-b from-surface-2 to-surface sm:h-3">
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-1 w-14 -translate-x-1/2 rounded-b-full bg-[rgb(var(--ink))]"
        />
      </div>
    </div>
  );
}
