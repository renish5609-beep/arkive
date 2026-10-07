// Compatibility shim for pre-multiproject imports.
// New code should use lib/validate-project.ts (validateProjectData / validateAllProjects).
import { requireProject } from "@/lib/projects";
import { validateProjectData } from "@/lib/validate-project";
import type { ProjectValidationResult } from "@/lib/validate-project";

export type QuakertownValidationResult = ProjectValidationResult;

export function validateQuakertownData(): QuakertownValidationResult {
  return validateProjectData(requireProject("quakertown"));
}
