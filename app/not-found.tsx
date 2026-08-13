import Link from "next/link";

// Uses only existing design tokens (bg-grid, shadow-neo, font-mono, accent) —
// no new visual language. Replaces Next's stock white 404 page, which broke
// against this site's near-black theme.
export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-grid px-5 text-center">
      <span className="font-mono text-sm text-accent">404 // not_found</span>
      <h1 className="mt-4 font-mono text-4xl font-bold text-text sm:text-5xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The page you&apos;re looking for was moved, renamed, or never existed.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 border-2 border-accent bg-accent px-6 py-3 font-mono text-sm font-bold text-bg shadow-neo transition-transform hover:-translate-x-1 hover:-translate-y-1 active:translate-x-0 active:translate-y-0"
      >
        back_to_home
      </Link>
    </main>
  );
}
