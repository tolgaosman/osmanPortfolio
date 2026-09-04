import Link from "next/link";

// Replaces Next's stock white 404, which broke against this site's dark
// theme. Uses only existing tokens — no visual language of its own.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <span className="font-sans text-label font-medium uppercase text-accent">
        404
      </span>
      <h1 className="mt-5 font-display text-title text-text">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md font-sans text-lede text-muted">
        The page you&apos;re looking for was moved, renamed, or never existed.
      </p>
      <Link
        href="/"
        className="mt-9 inline-flex items-center gap-2 border border-accent bg-accent px-6 py-3 font-sans text-sm font-medium text-bg transition-colors hover:bg-accent-bright"
      >
        Back to home
      </Link>
    </main>
  );
}
