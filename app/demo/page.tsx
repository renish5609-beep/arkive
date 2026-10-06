import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Demo walkthrough",
  description:
    "A two-minute guided walkthrough of Arkive: follow a source, inspect a record, check provenance, view a georeferenced location, see unresolved research, and download the data.",
};

const STEPS = [
  {
    title: "Follow a source",
    href: "/sources/source_005",
    text: "Start with the Denton County Historical Commission narrative. The page lists every mention extracted from it and shows which ones are linked to records.",
  },
  {
    title: "See a reconstructed person",
    href: "/records/person_003",
    text: "Frederick Douglass Moore, an educator discussed in the Moore family oral history. Each record shows its verification state and its sources.",
  },
  {
    title: "Inspect provenance",
    href: "/records/place_004",
    text: "The Maude Woods Clark Hembry house at 97 Terry Street. The record lists its evidence, its georeference status, and the open question about its location.",
  },
  {
    title: "View a georeferenced location",
    href: "/records/place_005",
    text: "The same house at 1129 East Hickory Street. This is the one exact coordinate, with its geocoding source and reviewer recorded.",
  },
  {
    title: "See unresolved research",
    href: "/review",
    text: "The entity resolution queue shows pending identity matches and open questions. Arkive shows what it does not yet know, rather than guessing.",
  },
  {
    title: "Download the data",
    href: "/api/export/quakertown?format=json",
    text: "The full dataset in JSON, with source IDs and verification metadata intact.",
  },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16 md:px-12 md:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Demo</p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-0.04em] md:text-6xl">Guided walkthrough</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 opacity-85">
          This takes about two minutes. It follows one source through to a record, a location,
          and the data itself.
        </p>

        <ol className="mt-12 space-y-6">
          {STEPS.map((step, index) => (
            <li key={step.href} className="grid gap-2 border-t border-black/10 pt-5 md:grid-cols-[3rem_1fr]">
              <span className="text-sm opacity-60">{index + 1}.</span>
              <div>
                <Link href={step.href} className="font-medium underline underline-offset-4">{step.title}</Link>
                <p className="mt-2 leading-7 opacity-80">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-12 text-sm opacity-70">
          For a structured review with questions, see the <Link href="/review-guide" className="underline underline-offset-4">review guide</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
