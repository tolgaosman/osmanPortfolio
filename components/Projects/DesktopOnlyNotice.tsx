"use client";

import { useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Says, once and plainly, that an internal tool was built for company
 * workstations and is not adapted to phones. Rendered wherever such a
 * project's screenshots are shown, so nobody opens the live-looking UI on a
 * phone and takes the broken layout for a portfolio defect.
 */
export default function DesktopOnlyNotice({ className }: { className?: string }) {
  const { t } = useLang();
  const n = t.projects.desktopOnly;

  return (
    <aside
      role="note"
      className={cn(
        "flex gap-3 rounded-md border border-border-structural bg-surface-2 p-4",
        className,
      )}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mt-0.5 h-5 w-5 shrink-0 text-accent"
      >
        <rect x="3" y="4" width="18" height="12" rx="1.5" />
        <path d="M8 20h8M12 16v4" />
      </svg>
      <div className="min-w-0">
        <p className="font-mono text-label uppercase text-accent">{n.title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{n.body}</p>
      </div>
    </aside>
  );
}
