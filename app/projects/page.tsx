import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import { getProjectMetrics } from "@/lib/project-metrics";
import { listProjectManifests, loadProject } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Every historical reconstruction currently published on Arkive, with its scope, status, and dataset counts.",
  openGraph: {
    title: "Projects | Arkive",
    description:
      "Every historical reconstruction currently published on Arkive, with its scope, status, and dataset counts.",
  },
};

export default function ProjectsPage() {
  const manifests = listProjectManifests();

  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Projects</p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-0.04em] md:text-6xl">Reconstructions</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 opacity-80">
          Arkive is a reusable local-history reconstruction framework. Each project below runs on
          the same evidence, review, mapping, and export workflow.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {manifests.map((manifest) => {
            const project = loadProject(manifest.slug);
            const metrics = project ? getProjectMetrics(project) : null;

            return (
              <Link
                key={manifest.slug}
                href={`/projects/${manifest.slug}`}
                className="block border border-black/15 bg-white/30 p-7 transition hover:bg-white/55"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] opacity-60">
                    Project {manifest.project_number}
                  </span>
                  <span className="border border-black/15 px-2 py-1 text-[10px] uppercase tracking-[0.14em] opacity-60">
                    {manifest.status.replaceAll("_", " ")}
                  </span>
                </div>
                <h2 className="mt-4 text-3xl font-medium">{manifest.title}</h2>
                <p className="mt-2 text-sm opacity-60">{manifest.location}</p>
                <p className="mt-4 leading-7 opacity-80">{manifest.summary}</p>
                {metrics && (
                  <div className="mt-6 grid grid-cols-4 gap-3 border-t border-black/10 pt-5 text-sm">
                    <div>
                      <div className="text-xl font-medium">{metrics.people}</div>
                      <div className="text-xs opacity-50">People</div>
                    </div>
                    <div>
                      <div className="text-xl font-medium">{metrics.places}</div>
                      <div className="text-xs opacity-50">Places</div>
                    </div>
                    <div>
                      <div className="text-xl font-medium">{metrics.sources}</div>
                      <div className="text-xs opacity-50">Sources</div>
                    </div>
                    <div>
                      <div className="text-xl font-medium">{metrics.relationships}</div>
                      <div className="text-xs opacity-50">Relationships</div>
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/start" className="bg-black px-6 py-3 text-sm text-white hover:opacity-80">
            Start a reconstruction
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
