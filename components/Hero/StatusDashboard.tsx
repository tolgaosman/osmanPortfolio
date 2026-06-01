"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

interface CounterProps {
  to: number;
  suffix?: string;
  start: boolean;
}

/** Counts up from 0 to `to` once `start` flips true. */
function Counter({ to, suffix = "", start }: CounterProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const duration = 900;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to]);

  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

interface BarProps {
  level: number;
  start: boolean;
  delay: number;
}

function MiniBar({ level, start, delay }: BarProps) {
  const cells = 10;
  const filled = Math.round((level / 100) * cells);
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: cells }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.15 }}
          animate={start ? { opacity: i < filled ? 1 : 0.15 } : {}}
          transition={{ delay: delay + i * 0.04, duration: 0.2 }}
          className={i < filled ? "h-3 w-1.5 bg-accent" : "h-3 w-1.5 bg-border"}
        />
      ))}
    </div>
  );
}

const ROWS = [
  { label: "UPTIME", type: "bar", level: 99, render: () => "99.9%" },
  { label: "STACK", type: "text", value: "READY" },
  { label: "PROJECTS", type: "counter", to: 3 },
  { label: "LANGUAGES", type: "text", value: "TR/EN" },
] as const;

export default function StatusDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24, rotate: -1 }}
      animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-md border-2 border-border bg-surface shadow-neo"
    >
      {/* Title bar */}
      <div className="flex items-center justify-between border-b-2 border-border bg-surface-2 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-xs text-muted">system_status.sh</span>
        <span className="w-10" />
      </div>

      {/* Body */}
      <div className="space-y-3 p-4 font-mono text-sm">
        {ROWS.map((row, idx) => (
          <motion.div
            key={row.label}
            initial={{ opacity: 0, x: -12 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 + idx * 0.12, duration: 0.35 }}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-muted">{row.label}</span>
            <div className="flex items-center gap-2">
              {row.type === "bar" && (
                <>
                  <MiniBar level={row.level} start={inView} delay={0.4} />
                  <span className="w-12 text-right text-accent">
                    {row.render()}
                  </span>
                </>
              )}
              {row.type === "text" && (
                <span className="text-accent">{row.value}</span>
              )}
              {row.type === "counter" && (
                <span className="text-text">
                  <Counter to={row.to} start={inView} />
                </span>
              )}
            </div>
          </motion.div>
        ))}

        {/* Live status row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 + ROWS.length * 0.12, duration: 0.4 }}
          className="mt-2 flex items-center justify-between border-t border-border pt-3"
        >
          <span className="text-muted">STATUS</span>
          <span className="flex items-center gap-2 text-accent">
            <span className="h-2.5 w-2.5 animate-pulse-dot rounded-full bg-accent" />
            AVAILABLE
          </span>
        </motion.div>

        {/* Blinking prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 + ROWS.length * 0.12 }}
          className="flex items-center gap-1 pt-1 text-muted"
        >
          <span className="text-accent">$</span>
          <span>ready</span>
          <span className="inline-block w-2 animate-blink bg-accent">&nbsp;</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
