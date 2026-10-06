import Link from "next/link";
import { SITE } from "@/lib/site";

const NAV_LINKS = [
  { href: "/projects/quakertown", label: "Project" },
  { href: "/projects/quakertown#archive", label: "Archive" },
  { href: "/projects/quakertown#sources", label: "Sources" },
  { href: "/about", label: "Methodology" },
  { href: "/projects/quakertown#dataset", label: "Dataset" },
];

const linkClass = "hover:underline underline-offset-4 focus-visible:underline";

export default function SiteHeader() {
  return (
    <header className="border-b border-black/10 px-6 py-5 md:px-12">
      <div className="flex items-center justify-between gap-6">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          ARKIVE
        </Link>

        <nav aria-label="Primary" className="hidden flex-wrap items-center gap-x-6 gap-y-2 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={linkClass}>
              {link.label}
            </Link>
          ))}
          <a href={SITE.repoUrl} target="_blank" rel="noreferrer" className={linkClass}>
            GitHub
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none border border-black/20 px-3 py-2 text-sm">
            Menu
          </summary>
          <nav
            aria-label="Primary mobile"
            className="absolute right-0 z-50 mt-3 flex w-56 flex-col gap-4 border border-black/15 bg-[#f4f0e7] p-5 text-sm shadow-sm"
          >
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass}>
                {link.label}
              </Link>
            ))}
            <a href={SITE.repoUrl} target="_blank" rel="noreferrer" className={linkClass}>
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
