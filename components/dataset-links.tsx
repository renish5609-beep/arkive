// Download links for the public dataset. All links are relative so they work
// in local development and in any deployment.
const LINKS = [
  { href: "/api/export/quakertown?format=json", label: "JSON, full dataset" },
  { href: "/api/export/quakertown?format=csv&entity=people", label: "People CSV" },
  { href: "/api/export/quakertown?format=csv&entity=places", label: "Places CSV" },
  { href: "/api/export/quakertown?format=csv&entity=relationships", label: "Relationships CSV" },
  { href: "/api/export/quakertown?format=csv&entity=mentions", label: "Mentions CSV" },
  { href: "/api/export/quakertown?format=csv&entity=sources", label: "Sources CSV" },
];

export default function DatasetLinks() {
  return (
    <div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LINKS.map((link) => (
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
