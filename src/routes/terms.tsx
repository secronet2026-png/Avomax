import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — AVOMAX Global Consultancy" },
      { name: "description", content: "Terms governing the use of AVOMAX consultancy services." },
      { property: "og:title", content: "Terms & Conditions — AVOMAX" },
      { property: "og:description", content: "Service terms and disclaimers." },
      { property: "og:url", content: "/terms" },
    ],
    links: [{ rel: "canonical", href: "/terms" }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="May 2026">
      <p>By engaging AVOMAX Global Consultancy Pvt Ltd you agree to the following terms.</p>
      <h2>Nature of our services</h2>
      <ul>
        <li>AVOMAX provides consultancy, facilitation and concierge support — not guaranteed outcomes.</li>
        <li>University admission decisions remain solely with the institution.</li>
        <li>Visa approval is at the discretion of the relevant embassy or government authority.</li>
        <li>Medical treatment outcomes depend on the partner hospital and clinical assessment.</li>
      </ul>
      <h2>Your responsibilities</h2>
      <ul>
        <li>Provide accurate, truthful and complete information and documents.</li>
        <li>Do not misuse our services, brand, or any partner relationships.</li>
        <li>Comply with all visa, immigration and academic regulations in the destination country.</li>
      </ul>
      <h2>Limitation of liability</h2>
      <p>AVOMAX is not liable for delays, refusals or outcomes caused by third parties including universities, hospitals, airlines, visa authorities, or for inaccuracies in applicant-submitted documents.</p>
      <h2>Disputes</h2>
      <p>Any dispute will first be addressed in writing via <a href="mailto:avomaxadmission@gmail.com">avomaxadmission@gmail.com</a>. Unresolved disputes shall be subject to the jurisdiction of Harare, Zimbabwe.</p>
    </LegalPage>
  );
}
