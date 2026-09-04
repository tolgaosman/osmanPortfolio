"use client";

import { asset } from "@/lib/utils";
import { btnPrimary, btnQuiet } from "@/lib/buttons";

/**
 * Client component per Next's error.tsx convention. Same terminal frame as
 * not-found.tsx, so a failure looks like part of this site rather than like
 * the framework's default.
 *
 * `error.digest` is shown when it exists. That is the one genuinely useful
 * thing on an error page: a stable id the visitor can quote. Everything else
 * here is honest about knowing nothing — no invented status code, no "our
 * engineers have been notified" when nobody has been notified.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-20">
      <div className="w-full max-w-xl overflow-hidden rounded-lg border border-border-structural">
        <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
          <span className="font-mono text-label uppercase text-faint">
            <span className="text-accent-dim">{"~/"}</span>
            runtime
          </span>
          <span className="font-mono text-label text-danger">500</span>
        </div>

        <div className="term space-y-1.5 p-6 text-screen">
          <p className="text-text">{"$ render --route ."}</p>
          <p className="text-danger">{"ERR_RUNTIME: render failed"}</p>
          {error.digest && (
            <p className="break-all text-faint">{`  digest: ${error.digest}`}</p>
          )}
          <p className="text-faint">{"  the page did not finish rendering"}</p>
          <p className="text-accent">{"  recoverable: retry available"}</p>
        </div>

        <div className="border-t border-border bg-surface p-6">
          <h1 className="font-display text-sub font-medium text-text">
            Something went wrong.
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button onClick={reset} className={btnPrimary}>
              Try again
            </button>
            <a href={asset("/")} className={btnQuiet}>
              Back to home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
