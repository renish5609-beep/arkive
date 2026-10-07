// Download links for a project's public dataset. All links are relative so
// they work in local development and in any deployment.
export default function DatasetLinks({ projectSlug }: { projectSlug: string }) {
  const base = `/api/export/${projectSlug}`;
  const links = [
    { href: `${base}?format=json`, label: "JSON, full dataset" },
    { href: `${base}?format=csv&entity=people`, label: "People CSV" },
    { href: `${base}?format=csv&entity=places`, label: "Places CSV" },
    { href: `${base}?format=csv&entity=relationships`, label: "Relationships CSV" },
    { href: `${base}?format=csv&entity=mentions`, label: "Mentions CSV" },
    { href: `${base}?format=csv&entity=sources`, label: "Sources CSV" },
  ];

  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="block border border-black/20 px-4 py-3 text-sm underline-offset-4 hover:bg-black hover:text-white hover:no-underline focus-visible:underline"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-5 max-w-3xl text-sm leading-6 opacity-75">
        Exports include source IDs and verification metadata so downstream users can audit the
        reconstruction. Match scores are heuristics for review, not historical verification.
      </p>
    </div>
  );
}
