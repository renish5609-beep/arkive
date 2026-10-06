"use client";

import dynamic from "next/dynamic";
import type {
  HistoricalPlace,
  HistoricalRelationship,
  HistoricalSource,
} from "@/lib/types";

const ReconstructionMap = dynamic(
  () => import("@/components/reconstruction-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[540px] items-center justify-center border border-black/15 bg-[#d8d0bf]">
        <div className="text-sm uppercase tracking-[0.16em] opacity-45">
          Loading reconstruction map...
        </div>
      </div>
    ),
  }
);

interface ReconstructionMapShellProps {
  places: HistoricalPlace[];
  relationships: HistoricalRelationship[];
  sources: HistoricalSource[];
}

export default function ReconstructionMapShell(
  props: ReconstructionMapShellProps
) {
  return <ReconstructionMap {...props} />;
}
