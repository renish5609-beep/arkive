"use client";

import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type {
  HistoricalPlace,
  HistoricalRelationship,
  HistoricalSource,
} from "@/lib/types";

interface ReconstructionMapProps {
  places: HistoricalPlace[];
  relationships: HistoricalRelationship[];
  sources: HistoricalSource[];
}

const DENTON_CENTER: LatLngExpression = [33.2148, -97.1331];

function hasCoordinates(place: HistoricalPlace) {
  return (
    typeof place.latitude === "number" &&
    Number.isFinite(place.latitude) &&
    typeof place.longitude === "number" &&
    Number.isFinite(place.longitude)
  );
}

function sourceNames(sourceIds: string[], sources: HistoricalSource[]) {
  return sourceIds
    .map((sourceId) => sources.find((source) => source.id === sourceId)?.title)
    .filter((title): title is string => Boolean(title));
}

export default function ReconstructionMap({
  places,
  relationships,
  sources,
}: ReconstructionMapProps) {
  const mappablePlaces = places.filter(hasCoordinates);

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
          const linkedSources = sourceNames(place.source_ids, sources);

          return (
            <CircleMarker
              key={place.id}
              center={[place.latitude as number, place.longitude as number]}
              radius={9}
              pathOptions={{
                color: "#171714",
                fillColor: "#f4f0e7",
                fillOpacity: 1,
                weight: 2,
              }}
            >
              <Popup>
                <div className="max-w-[240px] space-y-2 text-sm">
                  <div className="text-[10px] uppercase tracking-wide opacity-60">
                    {place.place_type}
                  </div>
                  <div className="font-semibold">{place.name}</div>
                  {place.historical_address && (
                    <div>
                      Historical address: {place.historical_address}
                    </div>
                  )}
                  {place.modern_address && (
                    <div>Modern address: {place.modern_address}</div>
                  )}
                  {linkedSources.length > 0 && (
                    <div className="border-t border-black/10 pt-2 text-xs">
                      Evidence: {linkedSources.join("; ")}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className="pointer-events-none absolute left-4 top-4 z-[500] border border-black/15 bg-[#f4f0e7]/95 px-3 py-2 text-xs shadow-sm">
        <div className="font-semibold uppercase tracking-[0.12em]">
          Spatial reconstruction
        </div>
        <div className="mt-1 opacity-60">
          {mappablePlaces.length} verified coordinate
          {mappablePlaces.length === 1 ? "" : "s"} plotted
        </div>
      </div>

      {mappablePlaces.length === 0 && (
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[500] border border-black/15 bg-[#f4f0e7]/95 p-4 shadow-sm md:left-auto md:max-w-md">
          <div className="text-xs font-semibold uppercase tracking-[0.12em]">
            No historical markers plotted yet
          </div>
          <p className="mt-2 text-sm leading-6 opacity-70">
            Arkive is withholding markers until historical locations are
            georeferenced and verified. The base map is live; the absence of a
            marker is intentional rather than missing UI.
          </p>
        </div>
      )}
    </div>
  );
}
