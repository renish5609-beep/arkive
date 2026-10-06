import type { HistoricalPlace } from "@/lib/types";

interface GeoreferenceStatusProps {
  places: HistoricalPlace[];
  openResearchCount: number;
}

// Shows where the spatial evidence stands. Unresolved places are listed in
// text so that the absence of a marker is explained, not silent.
export default function GeoreferenceStatus({ places, openResearchCount }: GeoreferenceStatusProps) {
  const exact = places.filter((place) => place.georeference_status === "exact");
  const approximate = places.filter((place) => place.georeference_status === "approximate");
  const unresolved = places.filter((place) => place.georeference_status === "unresolved");

  return (
    <div className="border border-black/10 bg-[#f4f0e7]/45 p-5">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-60">
        Georeference status
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.14em] opacity-60">Exact</dt>
          <dd className="mt-1 text-2xl font-medium">{exact.length}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.14em] opacity-60">Approximate</dt>
          <dd className="mt-1 text-2xl font-medium">{approximate.length}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.14em] opacity-60">Unresolved</dt>
          <dd className="mt-1 text-2xl font-medium">{unresolved.length}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.14em] opacity-60">Open research</dt>
          <dd className="mt-1 text-2xl font-medium">{openResearchCount}</dd>
        </div>
      </dl>

      <p className="mt-4 text-sm leading-6 opacity-75">
        Historical locations remain unresolved until the evidence supports a defensible placement.
      </p>

      <div className="mt-5 border-t border-black/10 pt-4">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] opacity-60">
          Awaiting georeference
        </div>
        {unresolved.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm">
            {unresolved.map((place) => (
              <li key={place.id}>{place.name}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm opacity-75">Every recorded place has a georeferenced location.</p>
        )}
      </div>
    </div>
  );
}
