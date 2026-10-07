import { listProjectSlugs, requireProject } from "./projects";
import type { HistoricalProjectData } from "./types";

export interface CliProjectSelection {
  slugs: string[];
  isAll: boolean;
}

/**
 * Parses `--project <slug>` and `--all` from argv.
 *
 * Read-only commands should pass `allowAllByDefault: true`: with no flags,
 * they run across every project. Commands that write project data must pass
 * `allowAllByDefault: false` and will refuse to run (exit 1) without an
 * explicit `--project <slug>`.
 */
export function resolveProjectSelection(
  argv: string[],
  options: { allowAllByDefault: boolean }
): CliProjectSelection {
  const projectIndex = argv.indexOf("--project");
  const explicitSlug = projectIndex !== -1 ? argv[projectIndex + 1] : undefined;
  const wantsAll = argv.includes("--all");
  const available = listProjectSlugs();

  if (explicitSlug) {
    if (!available.includes(explicitSlug)) {
      console.error(`Refused: unknown project "${explicitSlug}". Available projects: ${available.join(", ") || "none"}`);
      process.exit(1);
    }
    return { slugs: [explicitSlug], isAll: false };
  }

  if (wantsAll || options.allowAllByDefault) {
    return { slugs: available, isAll: true };
  }

  console.error(`Refused: this command requires --project <slug>. Available projects: ${available.join(", ") || "none"}`);
  process.exit(1);
}

export function loadSelectedProjects(selection: CliProjectSelection): HistoricalProjectData[] {
  return selection.slugs.map((slug) => requireProject(slug));
}
