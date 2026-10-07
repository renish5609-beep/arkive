import Link from "next/link";
import type { HistoricalSource } from "@/lib/types";

// Lists every source with a link to its Arkive provenance page and, where
// one exists, the original external archive (opened in a new tab).
export default function ProvenanceList({
  projectSlug,
  sources,
}: {
  projectSlug: string;
  sources: HistoricalSource[];
}) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {sources.map((source) => (
        <li key={source.id} className="border border-black/15 bg-white/25 p-6">
          <div className="text-xs uppercase tracking-[0.14em] opacity-60">
            {source.source_type.replaceAll("_", " ")}
          </div>
          <h3 className="mt-3 text-xl font-medium">{source.title}</h3>
          {source.archive && <p className="mt-2 text-sm opacity-70">{source.archive}</p>}
          {source.notes && <p className="mt-4 text-sm leading-7 opacity-80">{source.notes}</p>}
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href={`/projects/${projectSlug}/sources/${source.id}`} className="font-medium underline underline-offset-4">
              Source provenance record
            </Link>
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                Original archive
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
