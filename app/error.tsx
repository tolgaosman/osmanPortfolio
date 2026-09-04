"use client";

import { asset } from "@/lib/utils";

// Client component per Next's error.tsx convention. Same restrained styling
// as not-found.tsx — existing tokens only.
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="font-sans text-label font-medium uppercase text-accent">
        500
      </span>
      <h1 className="mt-5 font-display text-title text-text">
        Something went wrong.
      </h1>
      <p className="mt-4 max-w-md font-sans text-lede text-muted">
        An unexpected error occurred. You can try again, or head back home.
      </p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 font-sans text-sm font-medium text-bg transition-colors hover:bg-accent-bright"
        >
          Try again
        </button>
        <a
          href={asset("/")}
          className="link-underline font-sans text-sm text-muted transition-colors hover:text-text"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
