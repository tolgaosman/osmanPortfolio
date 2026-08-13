"use client";

import { asset } from "@/lib/utils";

// Client component per Next's error.tsx convention. Same restrained styling
// as not-found.tsx — existing tokens only, no new visual language.
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-grid px-5 text-center">
      <span className="font-mono text-sm text-accent">500 // something_broke</span>
      <h1 className="mt-4 font-mono text-4xl font-bold text-text sm:text-5xl">
        Something went wrong.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 border-2 border-accent bg-accent px-6 py-3 font-mono text-sm font-bold text-bg shadow-neo transition-transform hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0"
        >
          try_again
        </button>
        <a
          href={asset("/")}
          className="inline-flex items-center gap-2 border-2 border-border bg-transparent px-6 py-3 font-mono text-sm font-bold text-text transition-colors hover:border-accent hover:text-accent"
        >
          back_to_home
        </a>
      </div>
    </main>
  );
}
