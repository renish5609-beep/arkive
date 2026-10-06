import {
  locationEvidence,
  matchCandidates,
  mentions,
  people,
  places,
  relationships,
  sources,
} from "@/lib/quakertown";

type CsvValue = string | number | boolean | null | string[] | object;

const CSV_ENTITIES = [
  "people",
  "places",
  "relationships",
  "mentions",
  "sources",
] as const;

type CsvEntity = (typeof CSV_ENTITIES)[number];

const datasets: Record<CsvEntity, Record<string, CsvValue>[]> = {
  people: people as unknown as Record<string, CsvValue>[],
  places: places as unknown as Record<string, CsvValue>[],
  relationships: relationships as unknown as Record<string, CsvValue>[],
  mentions: mentions as unknown as Record<string, CsvValue>[],
  sources: sources as unknown as Record<string, CsvValue>[],
};

// RFC 4180 style: quote fields containing commas, quotes, or line breaks,
// and double any embedded quotes. Arrays are joined with semicolons.
function formatCsvCell(value: CsvValue | undefined): string {
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

function toCsv(rows: Record<string, CsvValue>[]) {
  if (rows.length === 0) return "";

  const columns = Object.keys(rows[0]);
  const header = columns.map((column) => formatCsvCell(column)).join(",");
  const body = rows.map((row) =>
    columns.map((column) => formatCsvCell(row[column])).join(",")
  );

  return [header, ...body].join("\r\n") + "\r\n";
}

function jsonExport() {
  const payload = {
    project: {
      name: "Quakertown Reconstructed",
      description:
        "Source-traceable reconstruction of Denton's historic Quakertown community. Historical claims are linked to sources; unresolved locations and unconfirmed identity matches are included as-is.",
      exported_at: new Date().toISOString(),
      notice:
        "Match candidate scores are heuristics for review, not historical verification.",
    },
    people,
    places,
    relationships,
    sources,
    mentions,
    match_candidates: matchCandidates,
    location_evidence: locationEvidence,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="arkive-quakertown.json"',
    },
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "json";

  if (format === "json") return jsonExport();

  if (format !== "csv") {
    return Response.json(
      { error: "format must be 'json' or 'csv'" },
      { status: 400 }
    );
  }

  const entity = searchParams.get("entity");

  if (!entity || !CSV_ENTITIES.includes(entity as CsvEntity)) {
    return Response.json(
      { error: `entity must be one of: ${CSV_ENTITIES.join(", ")}` },
      { status: 400 }
    );
  }

  const csv = toCsv(datasets[entity as CsvEntity]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="arkive-quakertown-${entity}.csv"`,
    },
  });
}
