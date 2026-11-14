import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund & Service Policy — AVOMAX" },
      { name: "description", content: "Consultation fees, processing timelines and refund terms." },
      { property: "og:title", content: "Refund Policy — AVOMAX" },
      { property: "og:description", content: "Refund eligibility and service terms." },
      { property: "og:url", content: "/refund" },
    ],
    links: [{ rel: "canonical", href: "/refund" }],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <LegalPage title="Refund & Service Policy" updated="May 2026">
      <h2>Consultation fees</h2>
      <p>Initial consultations are typically complimentary. Where a paid service is agreed in writing, the fee and scope will be confirmed before any payment is collected.</p>
      <h2>Processing timelines</h2>
      <ul>
        <li>Admission processing: typically 7–21 working days after complete documents are submitted.</li>
        <li>Visa processing: subject to embassy timelines.</li>
        <li>Medical coordination: scheduled with the hospital partner.</li>
      </ul>
      <h2>Non-refundable costs</h2>
      <p>Third-party costs (university application fees, visa fees, courier, translations, medical tests) are non-refundable once paid to the third party.</p>
      <h2>Refund eligibility</h2>
      <ul>
        <li>AVOMAX service fees are refundable if work has not yet commenced.</li>
        <li>Once processing has started, refunds are pro-rated based on work completed.</li>
        <li>Refund requests must be submitted in writing to avomaxadmission@gmail.com within 14 days of the event.</li>
      </ul>
    </LegalPage>
  );
}
