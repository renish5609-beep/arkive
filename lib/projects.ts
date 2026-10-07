import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { isMappablePlace } from "@/lib/geo";
import type {
  ArchivalMention,
  EntityMatchCandidate,
  GeoreferenceQueueItem,
  HistoricalPerson,
  HistoricalPlace,
  HistoricalProjectData,
  HistoricalProjectManifest,
  HistoricalRelationship,
  HistoricalSource,
  LocationEvidence,
  ResearchQueueItem,
} from "@/lib/types";

// Server-only: reads project data from the filesystem. Never import this file
// from a "use client" component — use lib/geo.ts or lib/format.ts there, or
// pass the already-loaded data down as props from a server component.

const PROJECTS_ROOT = resolve(process.cwd(), "data/projects");

// A valid slug is the whole directory name: lowercase letters, digits, and
// hyphens only. This alone rejects "..", "/", and absolute paths.
const SLUG_PATTERN = /^[a-z0-9-]+$/;

function isSafeSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

function resolveProjectDir(slug: string): string | null {
  if (!isSafeSlug(slug)) return null;

  const dir = join(PROJECTS_ROOT, slug);
  const rel = relative(PROJECTS_ROOT, dir);

  // Defense in depth: the resolved directory must stay immediately under
  // data/projects, even if the slug pattern above were ever loosened.
  if (rel.startsWith("..") || rel.includes(`..${sep}`) || resolve(dir) !== dir) {
    return null;
  }

  return dir;
}

function readJson<T>(filePath: string, label: string): T {
  if (!existsSync(filePath)) {
    throw new Error(`Missing required project file: ${label} (expected at ${filePath})`);
  }

  let raw: string;
  try {
    raw = readFileSync(filePath, "utf8");
  } catch (error) {
    throw new Error(`Could not read ${label}: ${error instanceof Error ? error.message : String(error)}`);
  }

  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    throw new Error(`Could not parse ${label} as JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export function listProjectSlugs(): string[] {
  if (!existsSync(PROJECTS_ROOT)) return [];

  return readdirSync(PROJECTS_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => isSafeSlug(slug) && existsSync(join(PROJECTS_ROOT, slug, "project.json")))
    .sort();
}

// In-process cache, cleared on every call outside production so local edits
// to data/projects/**/*.json show up without a server restart.
const projectCache = new Map<string, HistoricalProjectData>();

export function loadProject(slug: string): HistoricalProjectData | null {
  if (process.env.NODE_ENV !== "production") {
    projectCache.delete(slug);
  } else if (projectCache.has(slug)) {
    return projectCache.get(slug) ?? null;
  }

  const dir = resolveProjectDir(slug);
  if (!dir || !existsSync(dir) || !existsSync(join(dir, "project.json"))) {
    return null;
  }

  const manifest = readJson<HistoricalProjectManifest>(
    join(dir, "project.json"),
    `project.json for "${slug}"`
  );

  if (manifest.slug !== slug) {
    throw new Error(
      `project.json for "${slug}" declares slug "${manifest.slug}", which does not match its directory name`
    );
  }

  const data: HistoricalProjectData = {
    manifest,
    people: readJson<HistoricalPerson[]>(join(dir, "people.json"), `people.json for "${slug}"`),
    places: readJson<HistoricalPlace[]>(join(dir, "places.json"), `places.json for "${slug}"`),
    sources: readJson<HistoricalSource[]>(join(dir, "sources.json"), `sources.json for "${slug}"`),
    relationships: readJson<HistoricalRelationship[]>(
      join(dir, "relationships.json"),
      `relationships.json for "${slug}"`
    ),
    locationEvidence: readJson<LocationEvidence[]>(
      join(dir, "location-evidence.json"),
      `location-evidence.json for "${slug}"`
    ),
    georeferenceQueue: readJson<GeoreferenceQueueItem[]>(
      join(dir, "georeference-queue.json"),
      `georeference-queue.json for "${slug}"`
    ),
    mentions: readJson<ArchivalMention[]>(join(dir, "mentions.json"), `mentions.json for "${slug}"`),
    matchCandidates: readJson<EntityMatchCandidate[]>(
      join(dir, "match-candidates.json"),
      `match-candidates.json for "${slug}"`
    ),
    researchQueue: readJson<ResearchQueueItem[]>(
      join(dir, "research-queue.json"),
      `research-queue.json for "${slug}"`
    ),
  };

  projectCache.set(slug, data);
  return data;
}

export function requireProject(slug: string): HistoricalProjectData {
  const project = loadProject(slug);
  if (!project) {
    const available = listProjectSlugs();
    throw new Error(
      `Unknown project "${slug}". Available projects: ${available.join(", ") || "none"}`
    );
  }
  return project;
}

export function listProjectManifests(): HistoricalProjectManifest[] {
  return listProjectSlugs()
    .map((slug) => loadProject(slug)?.manifest)
    .filter((manifest): manifest is HistoricalProjectManifest => Boolean(manifest))
    .sort((a, b) => a.project_number.localeCompare(b.project_number));
}

export function getProjectEntityName(project: HistoricalProjectData, entityId: string): string {
  const person = getProjectPersonById(project, entityId);
  if (person) return person.name;

  const place = getProjectPlaceById(project, entityId);
  if (place) return place.name;

  return entityId;
}

export function getProjectPersonById(project: HistoricalProjectData, id: string) {
  return project.people.find((person) => person.id === id);
}

export function getProjectPlaceById(project: HistoricalProjectData, id: string) {
  return project.places.find((place) => place.id === id);
}

export function getProjectSourceById(project: HistoricalProjectData, id: string) {
  return project.sources.find((source) => source.id === id);
}

export function getProjectRelationshipsForEntity(project: HistoricalProjectData, entityId: string) {
  return project.relationships.filter(
    (relationship) => relationship.from_entity_id === entityId || relationship.to_entity_id === entityId
  );
}

export function getProjectSourcesForIds(project: HistoricalProjectData, sourceIds: string[]) {
  return project.sources.filter((source) => sourceIds.includes(source.id));
}

export function getProjectMentionsForEntity(project: HistoricalProjectData, entityId: string) {
  return project.mentions.filter((mention) => mention.linked_entity_id === entityId);
}

export function getProjectOpenResearchItemsForEntity(project: HistoricalProjectData, entityId: string) {
  return project.researchQueue.filter(
    (item) => item.status !== "resolved" && item.entity_ids.includes(entityId)
  );
}

export function getProjectLocationEvidenceForPlace(project: HistoricalProjectData, placeId: string) {
  return project.locationEvidence.filter((item) => item.place_id === placeId);
}

export function getProjectGeoreferenceQueueItemForPlace(project: HistoricalProjectData, placeId: string) {
  return project.georeferenceQueue.find((item) => item.place_id === placeId);
}

// Re-exported for convenience so callers of lib/projects.ts don't also need
// to import lib/geo.ts separately.
export { isMappablePlace as isMappableProjectPlace };
