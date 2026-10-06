import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import {
  getMentionById,
  matchCandidates,
  researchQueue,
  sources,
} from "@/lib/quakertown";

function sourceTitle(sourceId: string) {
  return sources.find((source) => source.id === sourceId)?.title ?? sourceId;
}

export default function ReviewPage() {
  const pending = matchCandidates
    .filter((candidate) => candidate.review_status === "pending")
    .sort(
      (a, b) =>
        b.confidence_score - a.confidence_score || a.id.localeCompare(b.id)
    );
  const accepted = matchCandidates.filter(
    (candidate) => candidate.review_status === "accepted"
  ).length;
  const needsEvidence = matchCandidates.filter(
    (candidate) => candidate.review_status === "needs_more_evidence"
  ).length;
  const openResearch = researchQueue.filter(
    (item) => item.status !== "resolved"
  ).length;

  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]"><SiteHeader /><main>
      <article className="mx-auto max-w-5xl px-6 py-16 md:px-12 md:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-45">
          Research review
        </p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-0.04em] md:text-6xl">
          Entity resolution queue
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-7 opacity-75">
          Candidate matches are proposals for human review. A pending candidate
          is not a confirmed identity, and a heuristic score is not evidence
          that two mentions refer to the same entity. Conflicting evidence is
          shown alongside the reasons for each proposal.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6 border-y border-black/10 py-6 md:grid-cols-4">
          <div>
            <div className="text-3xl font-medium">{pending.length}</div>
            <div className="mt-1 text-xs uppercase tracking-wide opacity-50">Pending</div>
          </div>
          <div>
            <div className="text-3xl font-medium">{accepted}</div>
            <div className="mt-1 text-xs uppercase tracking-wide opacity-50">Accepted</div>
          </div>
          <div>
            <div className="text-3xl font-medium">{needsEvidence}</div>
            <div className="mt-1 text-xs uppercase tracking-wide opacity-50">Needs more evidence</div>
          </div>
          <div>
            <div className="text-3xl font-medium">{openResearch}</div>
            <div className="mt-1 text-xs uppercase tracking-wide opacity-50">Open research</div>
          </div>
        </div>

        <section className="mt-14">
          <h2 className="text-2xl font-medium">Pending candidates</h2>
          <p className="mt-2 text-sm opacity-60">Sorted by heuristic match score, highest first.</p>

          {pending.length === 0 && (
            <p className="mt-6 text-sm opacity-60">No pending candidates.</p>
          )}

          <div className="mt-6 space-y-5">
            {pending.map((candidate) => {
              const left = getMentionById(candidate.left_mention_id);
              const right = getMentionById(candidate.right_mention_id);

              return (
                <div
                  key={candidate.id}
                  className="border border-black/15 bg-white/25 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="text-xs uppercase tracking-[0.14em] opacity-50">
                      Heuristic match score {candidate.confidence_score} / 100 · {candidate.confidence} · not a verification
                    </div>
                    <span className="border border-dashed border-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.14em] opacity-70">
                      Pending review
                    </span>
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    {[left, right].map((mention, index) =>
                      mention ? (
                        <div key={mention.id} className="border-l border-black/20 pl-4 text-sm">
                          <div className="text-[10px] uppercase tracking-[0.14em] opacity-45">
                            {index === 0 ? "Left mention" : "Right mention"}
                          </div>
                          <div className="mt-1 font-medium">{mention.raw_name ?? "No name"}</div>
                          <div className="mt-1 opacity-70">Source: {sourceTitle(mention.source_id)}</div>
                          {mention.address_text && (
                            <div className="opacity-70">Address: {mention.address_text}</div>
                          )}
                          {mention.occupation_text && (
                            <div className="opacity-70">Occupation: {mention.occupation_text}</div>
                          )}
                          {mention.date_text && (
                            <div className="opacity-70">Date: {mention.date_text}</div>
                          )}
                          <div className="mt-1 text-xs opacity-50">
                            Linked: {mention.linked_entity_id ?? "none"}
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>

                  <div className="mt-5 grid gap-5 border-t border-black/10 pt-5 text-sm md:grid-cols-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.14em] opacity-45">Reasons for proposal</div>
                      {candidate.reasons.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {candidate.reasons.map((reason) => (
                            <li key={reason}>{reason}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 opacity-50">No positive evidence recorded.</p>
                      )}
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.14em] opacity-45">Conflicts</div>
                      {candidate.conflicting_evidence.length > 0 ? (
                        <ul className="mt-2 space-y-1">
                          {candidate.conflicting_evidence.map((conflict) => (
                            <li key={conflict}>{conflict}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="mt-2 opacity-50">None recorded.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16 border-t border-black/10 pt-10">
          <h2 className="text-2xl font-medium">Open research items</h2>
          <div className="mt-6 space-y-4">
            {researchQueue
              .filter((item) => item.status !== "resolved")
              .map((item) => (
                <div key={item.id} className="border border-black/15 p-5">
                  <div className="text-[10px] uppercase tracking-[0.14em] opacity-50">
                    {item.kind.replaceAll("_", " ")} · {item.priority} priority · {item.status}
                  </div>
                  <p className="mt-2 leading-7">{item.question}</p>
                </div>
              ))}
          </div>
        </section>
      </article>
    </main><SiteFooter /></div>
  );
}
