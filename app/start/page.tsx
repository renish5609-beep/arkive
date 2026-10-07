import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Start a reconstruction",
  description:
    "How a historian, teacher, student, library, museum, or community group can start a new Arkive reconstruction project.",
  openGraph: {
    title: "Start a reconstruction | Arkive",
    description:
      "How a historian, teacher, student, library, museum, or community group can start a new Arkive reconstruction project.",
  },
};

export default function StartPage() {
  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16 md:px-12 md:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Start</p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-0.04em] md:text-6xl">Start a reconstruction</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 opacity-85">
          Arkive is built to be reused. A historian, teacher, student, library, museum, or
          community group can propose a new local-history reconstruction, using the same
          evidence, review, and mapping workflow that powers Quakertown and Freedmen&apos;s Town.
        </p>

        <div className="mt-10 border border-black/20 bg-white/30 p-6">
          <p className="font-medium">You do not need a massive archive to begin.</p>
          <p className="mt-2 text-sm leading-6 opacity-80">
            A useful pilot can start with a bounded question, a few credible sources, and explicit
            uncertainty. This is important for small historical societies, classrooms, and
            community groups.
          </p>
        </div>

        <section className="mt-16 border-t border-black/10 pt-10">
          <h2 className="text-2xl font-medium">Start a reconstruction</h2>
          <p className="mt-4 leading-7 opacity-85">Arkive works best when a project has:</p>
          <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 opacity-85">
            <li>a bounded community or topic,</li>
            <li>at least a few credible archival sources,</li>
            <li>named people, places, or institutions,</li>
            <li>a question worth reconstructing.</li>
          </ul>
        </section>

        <section className="mt-16 border-t border-black/10 pt-10">
          <h2 className="text-2xl font-medium">Workflow</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 leading-7 opacity-85">
            <li>Choose a bounded historical community.</li>
            <li>Collect sources.</li>
            <li>Record raw mentions.</li>
            <li>Link only evidence-supported entities.</li>
            <li>Preserve uncertainty.</li>
            <li>Georeference carefully.</li>
            <li>Publish records and exports.</li>
          </ol>
        </section>

        <section className="mt-16 border-t border-black/10 pt-10">
          <h2 className="text-2xl font-medium">Ways to participate</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 leading-7 opacity-85">
            <li>Propose a new project.</li>
            <li>Contribute a source.</li>
            <li>Help verify a record.</li>
            <li>Pilot Arkive in a class or history group.</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link href="/feedback" className="bg-black px-5 py-3 text-white hover:opacity-80">
              Propose or contribute
            </Link>
            <a
              href={SITE.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="border border-black/20 px-5 py-3 hover:bg-black hover:text-white"
            >
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link href="/projects" className="border border-black/20 px-5 py-3 hover:bg-black hover:text-white">
              See current projects
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
