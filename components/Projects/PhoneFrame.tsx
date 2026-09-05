import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A flat iPhone-style bezel around a project screenshot.
 *
 * Deliberately NOT `Laptop3D`: that component is scenery — tilted, keyed,
 * perspective-projected — built to feel like an object sitting in the hero.
 * This wraps a fixed-size screenshot inside a project card, so it stays 2D
 * chrome with zero layout opinion of its own; `children` keeps whatever
 * aspect ratio `ImageCarousel` (or the empty-state terminal) already sets,
 * this only adds the bezel around it.
 */
export default function PhoneFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-[2.75rem] border border-border-structural bg-[rgb(var(--ink))] p-2.5 shadow-plate",
        className,
      )}
    >
      {/* Side controls. Purely a silhouette — inset rather than protruding,
          so they never depend on the parent tolerating overflow. */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-20 h-6 w-[3px] rounded-r-sm bg-border-structural"
      />
      <span
        aria-hidden="true"
        className="absolute left-0 top-28 h-10 w-[3px] rounded-r-sm bg-border-structural"
      />
      <span
        aria-hidden="true"
        className="absolute right-0 top-24 h-12 w-[3px] rounded-l-sm bg-border-structural"
      />

      <div className="relative overflow-hidden rounded-[2rem] bg-black">
        {/* Dynamic-island notch, layered over the screenshot rather than
            reserving space — a real screenshot has no gap cut out for it. */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-2 z-10 h-[16px] w-[72px] -translate-x-1/2 rounded-full bg-[rgb(var(--ink))]"
        />
        {children}
      </div>
    </div>
  );
}
