"use client";

import { Fragment } from "react";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import { isMappablePlace } from "@/lib/quakertown";
import type {
  HistoricalPlace,
  HistoricalRelationship,
  HistoricalSource,
  LocationEvidence,
} from "@/lib/types";

interface ReconstructionMapProps {
  places: HistoricalPlace[];
  relationships: HistoricalRelationship[];
  sources: HistoricalSource[];
  locationEvidence: LocationEvidence[];
}

const DENTON_CENTER: LatLngExpression = [33.2148, -97.1331];

function sourceNames(sourceIds: string[], sources: HistoricalSource[]) {
  return sourceIds
    .map((sourceId) => sources.find((source) => source.id === sourceId)?.title)
    .filter((title): title is string => Boolean(title));
}

function methodLabels(evidence: LocationEvidence[]) {
  return [...new Set(evidence.map((item) => item.method.replaceAll("_", " ")))];
}

export default function ReconstructionMap({
  places,
  relationships,
  sources,
  locationEvidence,
}: ReconstructionMapProps) {
  const mappablePlaces = places.filter(isMappablePlace);

  const placeLookup = new Map(
    mappablePlaces.map((place) => [place.id, place] as const)
  );

  const mapCenter: LatLngExpression =
    mappablePlaces.length > 0
      ? [
          mappablePlaces.reduce(
            (total, place) => total + (place.latitude ?? 0),
            0
          ) / mappablePlaces.length,
          mappablePlaces.reduce(
            (total, place) => total + (place.longitude ?? 0),
            0
          ) / mappablePlaces.length,
        ]
      : DENTON_CENTER;

  const geographicRelationships = relationships.flatMap((relationship) => {
    const from = placeLookup.get(relationship.from_entity_id);
    const to = placeLookup.get(relationship.to_entity_id);

    if (!from || !to) return [];

    return [
      {
        relationship,
        positions: [
          [from.latitude as number, from.longitude as number],
          [to.latitude as number, to.longitude as number],
        ] as [LatLngExpression, LatLngExpression],
      },
    ];
  });

  const approximateCount = mappablePlaces.filter(
    (place) => place.georeference_status === "approximate"
  ).length;
  const exactCount = mappablePlaces.length - approximateCount;

  return (
    <div className="relative h-[540px] w-full overflow-hidden border border-black/15 bg-[#d8d0bf]">
      <MapContainer
        center={mapCenter}
        zoom={mappablePlaces.length > 0 ? 15 : 13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {geographicRelationships.map(({ relationship, positions }) => (
          <Polyline
            key={relationship.id}
            positions={positions}
            pathOptions={{ color: "#171714", weight: 3, opacity: 0.7 }}
          >
            <Popup>
              <div className="space-y-2 text-sm">
                <div className="font-semibold">
                  {relationship.relationship_type.replaceAll("_", " ")}
                </div>
                <div>{relationship.notes}</div>
              </div>
            </Popup>
          </Polyline>
        ))}

        {mappablePlaces.map((place) => {
          const isApproximate = place.georeference_status === "approximate";
          const placeEvidence = locationEvidence.filter(
            (item) => item.place_id === place.id
          );
          const linkedSources = sourceNames(place.source_ids, sources);
          const center: LatLngExpression = [
            place.latitude as number,
            place.longitude as number,
          ];
          const uncertainty = placeEvidence.find(
            (item) => item.radius_meters !== null
          )?.radius_meters;

          return (
            <Fragment key={place.id}>
              {isApproximate && uncertainty ? (
                <Circle
                  center={center}
                  radius={uncertainty}
                  pathOptions={{
                    color: "#171714",
                    weight: 1,
                    dashArray: "2 6",
                    fillOpacity: 0.06,
                  }}
                />
              ) : null}

              <CircleMarker
                center={center}
                radius={isApproximate ? 12 : 9}
                pathOptions={{
                  color: "#171714",
                  fillColor: "#f4f0e7",
                  fillOpacity: isApproximate ? 0.5 : 1,
                  weight: 2,
                  dashArray: isApproximate ? "4 4" : undefined,
                }}
              >
                <Popup>
                  <div className="max-w-[260px] space-y-2 text-sm">
                    <div className="text-[10px] uppercase tracking-wide opacity-60">
                      {place.place_type}
                    </div>
                    <div className="font-semibold">{place.name}</div>
                    <div className="text-xs uppercase tracking-[0.12em]">
                      Status: {place.georeference_status}
                    </div>
                    {place.historical_address && (
                      <div>Historical address: {place.historical_address}</div>
                    )}
                    {place.modern_address && (
                      <div>Modern address: {place.modern_address}</div>
                    )}
                    {placeEvidence.length > 0 && (
                      <div>Method: {methodLabels(placeEvidence).join("; ")}</div>
                    )}
                    {placeEvidence.map((item) => (
                      <div key={item.id} className="text-xs leading-5">
                        {item.evidence_text}
                      </div>
                    ))}
                    {isApproximate && (
                      <div className="border-t border-black/10 pt-2 text-xs">
                        Approximate location — uncertainty is explicitly
                        represented.
                      </div>
                    )}
                    {linkedSources.length > 0 && (
                      <div className="border-t border-black/10 pt-2 text-xs">
                        Evidence: {linkedSources.join("; ")}
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-4 z-[500] border border-black/15 bg-[#f4f0e7]/95 px-3 py-2 text-xs shadow-sm">
        <div className="font-semibold uppercase tracking-[0.12em]">
          Spatial reconstruction
        </div>
        <div className="mt-1 opacity-60">
          {exactCount} exact · {approximateCount} approximate
        </div>
        <ul className="mt-3 space-y-1.5 border-t border-black/10 pt-2">
          <li className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border-2 border-[#171714] bg-[#f4f0e7]" />
            Exact
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border border-dashed border-[#171714] bg-[#f4f0e7]/50" />
            Approximate
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-block h-0 w-4 border-t-2 border-[#171714]/70" />
            Relocation / spatial relationship
          </li>
        </ul>
      </div>

      {mappablePlaces.length === 0 && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[500] border border-black/15 bg-[#f4f0e7]/95 p-4 shadow-sm md:left-auto md:max-w-md">
          <div className="text-xs font-semibold uppercase tracking-[0.12em]">
            No historical markers plotted yet
          </div>
          <p className="mt-2 text-sm leading-6 opacity-70">
            Arkive distinguishes &ldquo;not yet located&rdquo; from
            &ldquo;located.&rdquo; Historical sites are withheld until they are
            georeferenced and reviewed, so the sparse map is intentional. The
            base map is live.
          </p>
        </div>
      )}
    </div>
  );
}
