import Link from "next/link";
import { SITE } from "@/lib/site";

const linkClass = "underline underline-offset-4 hover:opacity-70";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 px-6 py-10 text-sm md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <div className="font-semibold">Arkive</div>
          <p className="mt-2 leading-6 opacity-70">
            An open-source computational public-history platform. Historical claims stay tied to
            their sources, and uncertainty is shown rather than hidden.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3">
          <Link href="/demo" className={linkClass}>Demo</Link>
          <Link href="/review-guide" className={linkClass}>Review guide</Link>
          <Link href="/feedback" className={linkClass}>Feedback and corrections</Link>
          <Link href="/about" className={linkClass}>Methodology</Link>
          <a href={`${SITE.repoUrl}/blob/main/docs/provenance-policy.md`} target="_blank" rel="noreferrer" className={linkClass}>
            Provenance policy
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href={SITE.repoUrl} target="_blank" rel="noreferrer" className={linkClass}>
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
      </div>
    </footer>
  );
}
