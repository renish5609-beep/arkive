// Public site configuration. No production domain is assumed.
// Set NEXT_PUBLIC_SITE_URL (for example https://arkive.example) when a
// production URL exists. Local development does not need it.
export const SITE = {
  name: "Arkive",
  title: "Arkive - Computational Public History",
  description:
    "Arkive reconstructs historical communities from fragmented archival records while preserving source provenance, uncertainty, and the evidence behind every connection.",
  repoUrl: "https://github.com/renish5609-beep/arkive",
  issuesNewUrl: "https://github.com/renish5609-beep/arkive/issues/new/choose",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
} as const;
