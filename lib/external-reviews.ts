import type { ExternalReview } from "@/lib/types";

// Shared rules for recorded external reviews. Used by review:status and
// audit:impact so both enforce the same definition of a valid record.

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(value: string) {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateExternalReviews(reviews: ExternalReview[]): string[] {
  const errors: string[] = [];
  const seen = new Set<string>();

  reviews.forEach((review, index) => {
    const label = review.id || `record ${index + 1}`;

    if (!review.id || review.id.trim() === "") {
      errors.push(`${label}: id is empty`);
    } else if (seen.has(review.id)) {
      errors.push(`${label}: duplicate review id`);
    }
    if (review.id) seen.add(review.id);

    if (!review.reviewer_role || review.reviewer_role.trim() === "") {
      errors.push(`${label}: reviewer_role is empty`);
    }
    if (!isValidDate(review.date)) {
      errors.push(`${label}: date "${review.date}" is not a valid YYYY-MM-DD date`);
    }
    if (!review.scope || review.scope.trim() === "") {
      errors.push(`${label}: scope is empty`);
    }
    if (!review.feedback_summary || review.feedback_summary.trim() === "") {
      errors.push(`${label}: feedback_summary is empty`);
    }
    if (typeof review.permission_to_name !== "boolean") {
      errors.push(`${label}: permission_to_name must be true or false`);
    }
    if (review.permission_to_name !== true && review.public_name !== null) {
      errors.push(`${label}: public_name must be null unless permission_to_name is true`);
    }
  });

  return errors;
}
