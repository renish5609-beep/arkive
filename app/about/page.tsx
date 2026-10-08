import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Methodology",
  openGraph: {
    title: "Methodology | Arkive",
    description: "How Arkive turns archival sources into source-traceable historical reconstructions, including verification states, spatial confidence, entity matching, and limitations.",
  },
  description:
    "How Arkive turns archival sources into source-traceable historical reconstructions, including verification states, spatial confidence, entity matching, and limitations.",
};

const PIPELINE = [
  "Archival source",
  "Raw mention",
  "Structured evidence",
  "Possible entity match",
  "Human review",
  "Canonical historical record",
  "Map, relationship graph, or export",
];

const VERIFICATION = [
  ["unverified", "Recorded but not yet checked by a person against its source."],
  ["machine_suggested", "Proposed by an automated process. Treat as a lead, not a finding."],
  ["human_reviewed", "Checked by a person against the source description. This is not a claim of exhaustive archival verification."],
  ["verified", "Confirmed against the original archival material by a person."],
];

const SPATIAL = [
  ["unresolved", "Evidence does not yet support a location. No marker is drawn."],
  ["approximate", "Evidence supports an area, block, or relative position. Drawn with a dashed marker and, where a radius exists, an uncertainty circle."],
  ["exact", "Coordinates come from a documented address, a georeferenced archival map, an explicit archival coordinate, or an independent human review. Each has a recorded provenance."],
];

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-16 scroll-mt-8 border-t border-black/10 pt-10" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="text-2xl font-medium">{title}</h2>
      <div className="mt-5 max-w-3xl space-y-4 text-base leading-7 opacity-85">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />

      <main className="mx-auto max-w-5xl px-6 pb-24 pt-16 md:px-12 md:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Methodology</p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-0.04em] md:text-6xl">How Arkive works</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 opacity-85">
          Arkive is an open-source computational public-history platform. It reconstructs
          communities from fragmented archival records while keeping the evidence, uncertainty,
          and source provenance behind every connection. The goal is a reconstruction that a
          historian can check claim by claim.
        </p>

        <Section id="what-arkive-does" title="What Arkive does">
          <p>Each historical claim moves through the same steps, and each step is recorded:</p>
          <ol className="mt-4 list-decimal space-y-2 pl-6">
            {PIPELINE.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <p>
            A raw mention is one occurrence of a name, place, or institution in a source. It
            stays separate from any canonical record until a source supports linking the two.
          </p>
        </Section>

        <Section id="verification-states" title="Verification states">
          <p>Every record carries one of four verification states:</p>
          <dl className="mt-4 space-y-4">
            {VERIFICATION.map(([state, meaning]) => (
              <div key={state} className="grid gap-1 border-l-2 border-black/20 pl-5 md:grid-cols-[12rem_1fr]">
                <dt className="font-mono text-sm">{state}</dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="spatial-confidence" title="Spatial confidence">
          <p>Locations have their own confidence states, separate from verification:</p>
          <dl className="mt-4 space-y-4">
            {SPATIAL.map(([state, meaning]) => (
              <div key={state} className="grid gap-1 border-l-2 border-black/20 pl-5 md:grid-cols-[12rem_1fr]">
                <dt className="font-mono text-sm">{state}</dt>
                <dd>{meaning}</dd>
              </div>
            ))}
          </dl>
          <p>Arkive never moves a location from unresolved to approximate or exact without the evidence to support it.</p>
        </Section>

        <Section id="entity-resolution" title="Entity resolution">
          <p className="border-l-4 border-black pl-5 font-medium opacity-100">
            Match scores are heuristics used to prioritize research. They are not historical proof
            and do not automatically merge records.
          </p>
          <p>
            Candidate matches are generated by fixed rules. They are compared only when they share
            an entity type, and each candidate lists the reasons for and against the proposal.
            Every new candidate starts as pending. A person reviews it before it can affect the
            canonical dataset. No language model is used.
          </p>
        </Section>

        <Section id="georeferencing" title="Georeferencing">
          <p className="border-l-4 border-black pl-5 font-medium opacity-100">
            Historical locations are withheld from the map when evidence is insufficient.
          </p>
          <p>
            Absence of a marker is intentional. It means the location is not yet known well enough
            to show. The map lists unresolved places in text, so no site disappears silently.
          </p>
        </Section>

        <Section id="open-data" title="Open data">
          <p>
            The full dataset can be downloaded as JSON, or as CSV for people, places,
            relationships, mentions, and sources. Exports keep source IDs and verification
            metadata, so downstream users can trace where each claim came from. The data
            dictionary and the provenance policy are published in the repository.
          </p>
          <p>
            <Link href="/projects/quakertown#dataset" className="underline underline-offset-4">Download the dataset</Link>
          </p>
        </Section>

        <Section id="historical-uncertainty" title="Historical uncertainty">
          <p>
            Arkive makes some kinds of uncertainty machine-readable: source provenance,
            verification state, entity identity, spatial confidence, and open research questions.
            Each record shows which of these apply and why.
          </p>
          <p className="border-l-4 border-black pl-5 font-medium opacity-100">
            Arkive can make some uncertainties machine-readable, but it cannot reduce historical
            interpretation to a confidence score. Surviving records are incomplete and shaped by
            the institutions and people who created, preserved, or excluded them.
          </p>
          <p>Historical uncertainty is broader than what any of Arkive&apos;s labels capture. It includes:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>survival bias in archives,</li>
            <li>silences and missing voices,</li>
            <li>conflicting testimony,</li>
            <li>ambiguous motives,</li>
            <li>incomplete chronology,</li>
            <li>changing terminology,</li>
            <li>interpretive disagreement,</li>
            <li>uneven institutional recordkeeping.</li>
          </ul>
          <p>
            Arkive does not assign a numeric confidence score to historical interpretation.
            Reading a verified record still requires the same judgment any historical source
            requires.
          </p>
        </Section>

        <Section id="limitations" title="Limitations">
          <ul className="list-disc space-y-3 pl-6">
            <li>The dataset is incomplete.</li>
            <li>Surviving archives are uneven, so some communities and people are documented far better than others.</li>
            <li>Historical records may contain errors or omissions.</li>
            <li>Absence from Arkive does not mean absence from history.</li>
            <li>Unresolved questions are intentionally preserved rather than filled in.</li>
          </ul>
        </Section>

        <Section id="reusable-project-model" title="Reusable project model">
          <p>
            Each reconstruction has its own manifest, sources, records, mentions, spatial
            evidence, and research queues. The same validation and provenance rules run across
            every project.
          </p>
          <p>
            Quakertown Reconstructed is the flagship case study. Freedmen&apos;s Town Reconstructed
            is a second, intentionally small case study, added to test whether the same framework
            can support a different community without rewriting the application. It is a
            portability pilot, not a comprehensive reconstruction.
          </p>
          <p>
            <Link href="/projects" className="underline underline-offset-4">See all projects</Link>
            {" · "}
            <Link href="/start" className="underline underline-offset-4">Start a reconstruction</Link>
          </p>
        </Section>

        <Section id="who-arkive-is-for" title="Who Arkive is for">
          <p>
            Arkive is designed for people who need to connect scattered historical evidence
            without hiding where those connections came from: historians and public historians,
            teachers and students, libraries, archives, museums, and historical societies,
            genealogists and community researchers, and digital-humanities projects. Arkive does
            not yet have confirmed use by any of these groups; this describes who it is built for,
            not who currently uses it.
          </p>
          <p>
            Arkive does not replace archival research or archival discovery tools; it provides a
            structured layer for documenting, checking, teaching, and publishing the connections
            researchers make across records. See{" "}
            <Link href="/start" className="underline underline-offset-4">practical use cases</Link>.
          </p>
        </Section>

        <Section id="corrections" title="Corrections">
          <p>
            Corrections and source suggestions are welcome. They are reviewed before they affect the
            canonical dataset. See the{" "}
            <Link href="/feedback" className="underline underline-offset-4">feedback page</Link>.
          </p>
        </Section>
      </main>

      <SiteFooter />
    </div>
  );
}
