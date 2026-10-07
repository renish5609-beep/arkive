import { redirect } from "next/navigation";

// Legacy compatibility route. The canonical URL is now
// /projects/quakertown/review.
export default function LegacyReviewPage() {
  redirect("/projects/quakertown/review");
}
