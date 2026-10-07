import { getProjectMetrics } from "@/lib/project-metrics";
import { loadProject } from "@/lib/projects";

// Compact, machine-readable project summary. Export URLs are absolute and
// built from the request origin, so they stay correct in any deployment.
export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = loadProject(slug);

  if (!project) {
    return Response.json({ error: `Unknown project "${slug}"` }, { status: 404 });
  }

  const origin = new URL(request.url).origin;
  const metrics = getProjectMetrics(project);

  const payload = {
    project: project.manifest.title,
    slug: project.manifest.slug,
    location: project.manifest.location,
    status: project.manifest.status,
    counts: {
      people: metrics.people,
      places: metrics.places,
      sources: metrics.sources,
      relationships: metrics.relationships,
      archival_mentions: metrics.mentions,
      georeferenced_places: metrics.mappablePlaces,
      exact_places: metrics.exactPlaces,
      approximate_places: metrics.approximatePlaces,
      unresolved_places: metrics.unresolvedPlaces,
      open_research_questions: metrics.openResearchQuestions,
      pending_identity_matches: metrics.pendingMatches,
    },
    verification_model: {
      verification_states: {
        unverified: "Recorded but not yet checked against its source by a person.",
        machine_suggested: "Proposed by an automated process; a lead, not a finding.",
        human_reviewed: "Checked by a person against the source description.",
        verified: "Confirmed by a person against the original archival material.",
      },
      spatial_states: {
        unresolved: "Evidence does not yet support a location; no marker is drawn.",
        approximate: "Evidence supports an area or relative position; drawn with uncertainty.",
        exact: "Coordinates with documented provenance.",
      },
      match_scores:
        "Heuristic scores for prioritizing review. They are not historical proof and never merge records automatically.",
    },
    export_urls: {
      json: `${origin}/api/export/${slug}?format=json`,
      people_csv: `${origin}/api/export/${slug}?format=csv&entity=people`,
      places_csv: `${origin}/api/export/${slug}?format=csv&entity=places`,
      relationships_csv: `${origin}/api/export/${slug}?format=csv&entity=relationships`,
      mentions_csv: `${origin}/api/export/${slug}?format=csv&entity=mentions`,
      sources_csv: `${origin}/api/export/${slug}?format=csv&entity=sources`,
    },
  };

  return Response.json(payload, {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
