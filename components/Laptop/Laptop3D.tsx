"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTilt } from "@/lib/motion";

/**
 * A laptop, built out of CSS boxes in a real 3D rendering context.
 *
 * THE RULE THIS COMPONENT EXISTS TO ENFORCE:
 *   `transform-style: preserve-3d` goes on assembly nodes (.lap__rig,
 *   .lap__lid, .lap__deck). `overflow: hidden` and `container-type` go ONLY on
 *   2D leaf nodes (.lap__bezel, .lap__well). Never both on one element.
 */

type KeySpec =
  | { label: string; w?: number; kind?: "char" | "word" | "fn"; align?: "left" | "right"; home?: boolean }
  | { kind: "space"; w: number }
  | { kind: "touchid"; w?: number }
  | { kind: "arrow-half"; label: string; w?: number }
  | { kind: "arrow-stack"; w?: number };

/**
 * Authentic 6-row US English (ANSI QWERTY) 75% laptop layout.
 * Every row sums to exactly 14.5 units so both edges sit flush while
 * preserving real staggered key offsets across Q-A-Z.
 */
const KEYBOARD_ROWS: readonly { rowClass: string; keys: readonly KeySpec[] }[] = [
  {
    rowClass: "flex-[0.76]",
    keys: [
      { label: "esc", w: 1.5, kind: "word", align: "left" },
      { label: "F1", kind: "fn" },
      { label: "F2", kind: "fn" },
      { label: "F3", kind: "fn" },
      { label: "F4", kind: "fn" },
      { label: "F5", kind: "fn" },
      { label: "F6", kind: "fn" },
      { label: "F7", kind: "fn" },
      { label: "F8", kind: "fn" },
      { label: "F9", kind: "fn" },
      { label: "F10", kind: "fn" },
      { label: "F11", kind: "fn" },
      { label: "F12", kind: "fn" },
      { kind: "touchid", w: 1 },
    ],
  },
  {
    rowClass: "flex-1",
    keys: [
      { label: "`" },
      { label: "1" },
      { label: "2" },
      { label: "3" },
      { label: "4" },
      { label: "5" },
      { label: "6" },
      { label: "7" },
      { label: "8" },
      { label: "9" },
      { label: "0" },
      { label: "-" },
      { label: "=" },
      { label: "delete", w: 1.5, kind: "word", align: "right" },
    ],
  },
  {
    rowClass: "flex-1",
    keys: [
      { label: "tab", w: 1.5, kind: "word", align: "left" },
      { label: "Q" },
      { label: "W" },
      { label: "E" },
      { label: "R" },
      { label: "T" },
      { label: "Y" },
      { label: "U" },
      { label: "I" },
      { label: "O" },
      { label: "P" },
      { label: "[" },
      { label: "]" },
      { label: "\\" },
    ],
  },
  {
    rowClass: "flex-1",
    keys: [
      { label: "caps", w: 1.75, kind: "word", align: "left" },
      { label: "A" },
      { label: "S" },
      { label: "D" },
      { label: "F", home: true },
      { label: "G" },
      { label: "H" },
      { label: "J", home: true },
      { label: "K" },
      { label: "L" },
      { label: ";" },
      { label: "'" },
      { label: "return", w: 1.75, kind: "word", align: "right" },
    ],
  },
  {
    rowClass: "flex-1",
    keys: [
      { label: "shift", w: 2.25, kind: "word", align: "left" },
      { label: "Z" },
      { label: "X" },
      { label: "C" },
      { label: "V" },
      { label: "B" },
      { label: "N" },
      { label: "M" },
      { label: "," },
      { label: "." },
      { label: "/" },
      { label: "shift", w: 2.25, kind: "word", align: "right" },
    ],
  },
  {
    rowClass: "flex-[1.06]",
    keys: [
      { label: "fn", w: 1, kind: "word", align: "left" },
      { label: "ctrl", w: 1, kind: "word" },
      { label: "opt", w: 1, kind: "word" },
      { label: "cmd", w: 1.25, kind: "word" },
      { kind: "space", w: 5 },
      { label: "cmd", w: 1.25, kind: "word" },
      { label: "opt", w: 1, kind: "word" },
      { kind: "arrow-half", label: "◀", w: 1 },
      { kind: "arrow-stack", w: 1 },
      { kind: "arrow-half", label: "▶", w: 1 },
    ],
  },
];

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

          {/* Recessed US English QWERTY keyboard well. */}
          <div className="lap__well absolute inset-x-[8%] bottom-[38%] top-[9%] flex flex-col gap-[2%] p-[1.3%]">
            {KEYBOARD_ROWS.map((row, rIdx) => (
              <div key={rIdx} className={cn("flex min-h-0 gap-[0.95%]", row.rowClass)}>
                {row.keys.map((k, kIdx) => {
                  const style = { flexGrow: k.w ?? 1, flexBasis: 0 };

                  if (k.kind === "space") {
                    return <span key={kIdx} style={style} className="lap__key" />;
                  }

                  if (k.kind === "touchid") {
                    return (
                      <span key={kIdx} style={style} className="lap__key">
                        <span className="lap__touchid" />
                      </span>
                    );
                  }

                  if (k.kind === "arrow-half") {
                    return (
                      <span key={kIdx} style={style} className="flex flex-col justify-end">
                        <span className="lap__key lap__key--fn h-[48%] w-full">
                          {k.label}
                        </span>
                      </span>
                    );
                  }

                  if (k.kind === "arrow-stack") {
                    return (
                      <span key={kIdx} style={style} className="flex flex-col justify-between gap-[6%]">
                        <span className="lap__key lap__key--fn flex-1">{"▲"}</span>
                        <span className="lap__key lap__key--fn flex-1">{"▼"}</span>
                      </span>
                    );
                  }

                  const isWord = k.kind === "word";
                  const isFn = k.kind === "fn";

                  return (
                    <span
                      key={kIdx}
                      style={style}
                      className={cn(
                        "lap__key",
                        isWord && "lap__key--word",
                        isFn && "lap__key--fn",
                        k.align === "left" && "lap__key--left",
                        k.align === "right" && "lap__key--right",
                      )}
                    >
                      {k.label}
                      {k.home && <span className="lap__homing" />}
                    </span>
                  );
                })}
              </div>
            ))}
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
