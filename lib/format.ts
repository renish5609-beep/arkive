// Pure, filesystem-free. Safe to import from client components.
export function formatVerification(status: string) {
  return status.replaceAll("_", " ");
}
