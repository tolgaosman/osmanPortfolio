import Link from "next/link";
import { btnPrimary } from "@/lib/buttons";

/**
 * Replaces Next's stock white 404, which breaks against this site's ground.
 *
 * Set as terminal output rather than as a centred apology, because that is
 * the page's own language — the boot screen, the skills shell and the contact
 * form are all the same instrument, and a wrong URL is exactly the kind of
 * thing a shell reports. Every line here is a plausible thing a shell would
 * actually print; none of it is invented diagnostics.
 *
 * The copy is language-neutral. This route renders outside any place the
 * language context is guaranteed to have resolved, and an error page is the
 * worst possible place to introduce a translation flash.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-20">
      <div className="w-full max-w-xl overflow-hidden rounded-lg border border-border-structural">
        <div className="flex items-center justify-between border-b border-border bg-surface-2 px-4 py-2.5">
          <span className="font-mono text-label uppercase text-faint">
            <span className="text-accent-dim">{"~/"}</span>
            router
          </span>
          <span className="font-mono text-label text-danger">404</span>
        </div>

        <div className="term space-y-1.5 p-6 text-screen">
          <p className="text-text">{"$ resolve --route $(location.pathname)"}</p>
          <p className="text-danger">{"ERR_404: route not found"}</p>
          <p className="text-faint">
            {"  the page was moved, renamed, or never existed"}
          </p>
          <p className="text-accent">{"  1 known route: /"}</p>
        </div>

        <div className="border-t border-border bg-surface p-6">
          <h1 className="font-display text-sub font-medium text-text">
            This page doesn&apos;t exist.
          </h1>
          <Link href="/" className={`${btnPrimary} mt-6`}>
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
