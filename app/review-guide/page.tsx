import type { Metadata } from "next";
import Link from "next/link";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";

export const metadata: Metadata = {
  title: "Review guide",
  openGraph: {
    title: "Review guide | Arkive",
    description: "A five-minute guide for historians, educators, and community members to review Arkive's Quakertown reconstruction, with five feedback questions.",
  },
  description:
    "A five-minute guide for historians, educators, and community members to review Arkive's Quakertown reconstruction, with five feedback questions.",
};

const STEPS = [
  { title: "Open the Quakertown project", href: "/projects/quakertown", text: "Read the scope statement and the project status counts first." },
  { title: "Inspect one entity", href: "/projects/quakertown/records/person_004", text: "Look at William Evelyn Woods. Check the sources, verification state, and relationships." },
  { title: "Open one source", href: "/projects/quakertown/sources/source_004", text: "Open The Woods House record and follow the link to the original archive." },
  { title: "Inspect map confidence", href: "/projects/quakertown#map", text: "Compare the exact marker with the places that are still unresolved, then read why they are withheld." },
  { title: "Download the dataset", href: "/projects/quakertown#dataset", text: "Download the JSON export and check that source IDs are present." },
];

const QUESTIONS = [
  "Is the historical framing accurate and sufficiently contextualized?",
  "Can you tell where important claims come from?",
  "Does the site communicate both evidence uncertainty and broader historical uncertainty responsibly?",
  "Can you tell who Arkive is for and what task it helps them perform?",
  "What is misleading, confusing, missing, or awkwardly worded?",
];

export default function ReviewGuidePage() {
  return (
    <div className="min-h-screen bg-[#f4f0e7] text-[#171714]">
      <SiteHeader />

      <main className="mx-auto max-w-4xl px-6 pb-24 pt-16 md:px-12 md:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Review guide</p>
        <h1 className="mt-4 text-5xl font-medium tracking-[-0.04em] md:text-6xl">Review Arkive in 5 minutes</h1>
        <p className="mt-8 max-w-3xl text-lg leading-8 opacity-85">
          Thank you for reviewing this project. The steps below cover the main parts of the
          product. You do not need to read the code.
        </p>

        <ol className="mt-12 space-y-6">
          {STEPS.map((step, index) => (
            <li key={step.href} className="grid gap-2 border-t border-black/10 pt-5 md:grid-cols-[3rem_1fr]">
              <span className="text-sm opacity-60">{index + 1}.</span>
              <div>
                <Link href={step.href} className="font-medium underline underline-offset-4">{step.title}</Link>
                <p className="mt-2 leading-7 opacity-80">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h2 className="mt-16 text-2xl font-medium">Five feedback questions</h2>
        <ol className="mt-6 list-decimal space-y-3 pl-6 leading-7">
          {QUESTIONS.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>

        <p className="mt-10 leading-7 opacity-85">
          Send your answers through the{" "}
          <Link href="/feedback" className="underline underline-offset-4">feedback page</Link>.
          Responses are reviewed and recorded only with your permission.
        </p>
        <p className="mt-6 text-sm opacity-70">
          Looking for a guided walkthrough? See the <Link href="/demo" className="underline underline-offset-4">demo</Link>.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
