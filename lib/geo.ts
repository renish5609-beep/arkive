import type { HistoricalPlace } from "@/lib/types";

// Pure, filesystem-free. Safe to import from client components (the map).
// Do not import lib/projects.ts or node:fs here.
export function isMappablePlace(place: HistoricalPlace) {
  return (
    place.georeference_status !== "unresolved" &&
    typeof place.latitude === "number" &&
    Number.isFinite(place.latitude) &&
    typeof place.longitude === "number" &&
    Number.isFinite(place.longitude)
  );
}
