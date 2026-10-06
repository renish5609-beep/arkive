import type { Metadata } from "next";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Feedback and corrections",
  description:
    "How to report a factual correction, suggest a source, flag a missing person or place, raise a georeference concern, or report an accessibility issue in Arkive.",
};

const REPORT_TYPES = [
  {
    title: "Factual correction",
    body: "A claim, date, name, or relationship is wrong or overstated. Include the record, the claim, and the source that shows the correction.",
    template: "historical-correction.yml",
  },
  {
    title: "Source suggestion",
    body: "An archival collection, oral history, map, or record that documents something in Quakertown. Include a link and what it covers.",
    template: "source-suggestion.yml",
  },
  {
    title: "Missing person or place",
    body: "A person, home, school, church, or business that the sources document but Arkive does not yet include. Name the source that mentions it.",
    template: "historical-correction.yml",
  },
  {
    title: "Georeference concern",
    body: "A location is misplaced, or a question has been raised about how a location was derived. Name the place and the evidence you have.",
    template: "historical-correction.yml",
  },
  {
    title: "Accessibility issue",
    body: "Something is hard to use with a screen reader, keyboard, zoom, or on a small screen. Describe the page and what happened.",
    template: "bug-report.yml",
  },
];

export default function FeedbackPage() {
  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16 md:px-12 md:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Feedback</p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-0.04em] md:text-6xl">Report a correction</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 opacity-85">
          Arkive is a research project, and readers who know this history can improve it. Reports
          are submitted through GitHub Issues, so they are public and can be discussed.
        </p>

        <div className="mt-10 border border-black/20 bg-white/30 p-6">
          <p className="font-medium">Submitted corrections are reviewed before they affect the canonical dataset.</p>
          <p className="mt-3 text-sm leading-6 opacity-80">
            Nothing changes automatically. A reviewer checks each report against its source before
            any record, status, or coordinate is updated.
          </p>
          <a
            href={SITE.issuesNewUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-block bg-black px-5 py-3 text-sm text-white hover:opacity-80"
          >
            Open a new GitHub issue
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>

        <h2 className="mt-16 text-2xl font-medium">What to report</h2>
        <ul className="mt-6 space-y-6">
          {REPORT_TYPES.map((type) => (
            <li key={type.title} className="border-l-2 border-black/20 pl-5">
              <h3 className="font-medium">{type.title}</h3>
              <p className="mt-2 leading-7 opacity-85">{type.body}</p>
              <p className="mt-2 text-xs opacity-60">Use the form: {type.template}</p>
            </li>
          ))}
        </ul>

        <h2 className="mt-16 text-2xl font-medium">Good reports include</h2>
        <ul className="mt-6 list-disc space-y-2 pl-6 leading-7 opacity-85">
          <li>The record or page, by its ID or URL.</li>
          <li>The specific claim, and the change you propose.</li>
          <li>A source you can point to, with a link or citation.</li>
          <li>Anything that is uncertain, stated as uncertain.</li>
        </ul>

        <h2 className="mt-16 text-2xl font-medium">Please do not</h2>
        <ul className="mt-6 list-disc space-y-2 pl-6 leading-7 opacity-85">
          <li>Send private information about living people.</li>
          <li>Propose coordinates without a documented source for how they were derived.</li>
          <li>Submit unsourced family claims or claims taken from search snippets.</li>
        </ul>
      </main>

      <SiteFooter />
    </div>
  );
}
