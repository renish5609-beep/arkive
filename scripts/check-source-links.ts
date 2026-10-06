import { sources } from "../lib/quakertown";

// Reports the state of each source URL. Never edits data, and never fails the
// build on network problems. Archive links drift, so this is a maintenance aid.
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

      // Some archives reject HEAD. Retry with GET before deciding.
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
  const withUrl = sources.filter((source) => source.url);
  const counts: Record<Outcome, number> = { healthy: 0, redirect: 0, broken: 0, unreachable: 0 };
  const lines: string[] = [];

  for (const source of withUrl) {
    const url = source.url as string;
    const result = await probe(url);
    counts[result.outcome] += 1;
    lines.push(`[${result.outcome.toUpperCase()}] ${source.id} ${url}\n    ${result.detail}`);
  }

  console.log("ARKIVE SOURCE LINK CHECK");
  console.log("========================");
  for (const line of lines) console.log(line);
  console.log("");
  console.log(`Checked: ${withUrl.length}`);
  console.log(`Healthy: ${counts.healthy}`);
  console.log(`Redirect: ${counts.redirect}`);
  console.log(`Broken: ${counts.broken}`);
  console.log(`Unreachable: ${counts.unreachable}`);
  console.log("");
  console.log(
    "Broken and redirected links are recorded for review. URLs are not rewritten automatically. Unreachable results may be temporary."
  );
}

main();
