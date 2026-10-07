import { buildProjectJsonExport, CSV_ENTITIES, getProjectDatasets, toCsv } from "@/lib/export-project";
import type { CsvEntity } from "@/lib/export-project";
import { loadProject } from "@/lib/projects";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = loadProject(slug);

  if (!project) {
    return Response.json({ error: `Unknown project "${slug}"` }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") ?? "json";

  if (format === "json") {
    const payload = buildProjectJsonExport(project);
    return new Response(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="arkive-${slug}.json"`,
      },
    });
  }

  if (format !== "csv") {
    return Response.json({ error: "format must be 'json' or 'csv'" }, { status: 400 });
  }

  const entity = searchParams.get("entity");

  if (!entity || !CSV_ENTITIES.includes(entity as CsvEntity)) {
    return Response.json({ error: `entity must be one of: ${CSV_ENTITIES.join(", ")}` }, { status: 400 });
  }

  const datasets = getProjectDatasets(project);
  const csv = toCsv(datasets[entity as CsvEntity]);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="arkive-${slug}-${entity}.csv"`,
    },
  });
}
