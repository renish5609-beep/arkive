import { loadSelectedProjects, resolveProjectSelection } from "../lib/cli-project";

// Reports the state of each project's source URLs. Never edits data, and
// never fails the build on network problems. Archive links drift, so this is
// a maintenance aid, not a release gate.
type Outcome = "healthy" | "redirect" | "broken" | "unreachable";

const TIMEOUT_MS = 10_000;

async function probe(url: string): Promise<{ outcome: Outcome; detail: string }> {
  for (const method of ["HEAD", "GET"] as const) {
    try {
      const response = await fetch(url, {
        method,
        redirect: "manual",
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { "User-Agent": "ArkiveLinkCheck/1.0 (source link maintenance)" },
      });

      if (method === "HEAD" && response.status >= 400) continue;

      const status = response.status;
      if (status >= 300 && status < 400) {
        return { outcome: "redirect", detail: `HTTP ${status} to ${response.headers.get("location") ?? "unknown"}` };
      }
      if (status >= 200 && status < 300) return { outcome: "healthy", detail: `HTTP ${status}` };
      return { outcome: "broken", detail: `HTTP ${status}` };
    } catch (error) {
      if (method === "GET") {
        const message = error instanceof Error ? error.message : String(error);
        return { outcome: "unreachable", detail: message };
      }
    }
  }
  return { outcome: "unreachable", detail: "no response" };
}

async function main() {
  const selection = resolveProjectSelection(process.argv.slice(2), { allowAllByDefault: true });
  const projects = loadSelectedProjects(selection);

  console.log("ARKIVE SOURCE LINK CHECK");
  console.log("========================");

  const totals: Record<Outcome, number> = { healthy: 0, redirect: 0, broken: 0, unreachable: 0 };
  // Dedupe only for a cleaner display; the underlying sources are unchanged.
  const seenUrls = new Set<string>();

  for (const project of projects) {
    const withUrl = project.sources.filter((source) => source.url);

    console.log("");
    console.log(project.manifest.slug.toUpperCase());

    for (const source of withUrl) {
      const url = source.url as string;
      const dedupeKey = `${project.manifest.slug}:${url}`;
      if (seenUrls.has(dedupeKey)) continue;
      seenUrls.add(dedupeKey);

      const result = await probe(url);
      totals[result.outcome] += 1;
      console.log(`[${result.outcome.toUpperCase()}] ${source.id} ${url}`);
      console.log(`    ${result.detail}`);
    }

    if (withUrl.length === 0) {
      console.log("  (no sources with a URL)");
    }
  }

  console.log("");
  console.log(`Healthy: ${totals.healthy}`);
  console.log(`Redirect: ${totals.redirect}`);
  console.log(`Broken: ${totals.broken}`);
  console.log(`Unreachable: ${totals.unreachable}`);
  console.log("");
  console.log(
    "Broken and redirected links are recorded for review. URLs are not rewritten automatically. Unreachable results may be temporary."
  );
}

main();
