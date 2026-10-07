import type { HistoricalProjectData } from "@/lib/types";

export type CsvValue = string | number | boolean | null | string[] | object;

export const CSV_ENTITIES = ["people", "places", "relationships", "mentions", "sources"] as const;
export type CsvEntity = (typeof CSV_ENTITIES)[number];

// RFC 4180 style: quote fields containing commas, quotes, or line breaks,
// and double any embedded quotes. Arrays are joined with semicolons.
export function formatCsvCell(value: CsvValue | undefined): string {
  if (value === null || value === undefined) return "";

  let text: string;
  if (Array.isArray(value)) {
    text = value.map((item) => String(item)).join(";");
  } else if (typeof value === "object") {
    text = JSON.stringify(value);
  } else {
    text = String(value);
  }

  if (/[",\r\n]/.test(text)) {
    return `"${text.replaceAll('"', '""')}"`;
  }
  return text;
}

export function toCsv(rows: Record<string, CsvValue>[]) {
  if (rows.length === 0) return "";

  const columns = Object.keys(rows[0]);
  const header = columns.map((column) => formatCsvCell(column)).join(",");
  const body = rows.map((row) => columns.map((column) => formatCsvCell(row[column])).join(","));

  return [header, ...body].join("\r\n") + "\r\n";
}

export function getProjectDatasets(project: HistoricalProjectData): Record<CsvEntity, Record<string, CsvValue>[]> {
  return {
    people: project.people as unknown as Record<string, CsvValue>[],
    places: project.places as unknown as Record<string, CsvValue>[],
    relationships: project.relationships as unknown as Record<string, CsvValue>[],
    mentions: project.mentions as unknown as Record<string, CsvValue>[],
    sources: project.sources as unknown as Record<string, CsvValue>[],
  };
}

export function buildProjectJsonExport(project: HistoricalProjectData) {
  return {
    project: {
      name: project.manifest.title,
      slug: project.manifest.slug,
      location: project.manifest.location,
      status: project.manifest.status,
      description: project.manifest.summary,
      exported_at: new Date().toISOString(),
      notice: "Match candidate scores are heuristics for review, not historical verification.",
    },
    people: project.people,
    places: project.places,
    relationships: project.relationships,
    sources: project.sources,
    mentions: project.mentions,
    match_candidates: project.matchCandidates,
    location_evidence: project.locationEvidence,
  };
}
