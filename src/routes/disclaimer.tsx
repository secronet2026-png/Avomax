import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — AVOMAX Global Consultancy" },
      { name: "description", content: "AVOMAX facilitates education and medical consultation processes without guaranteeing outcomes." },
      { property: "og:title", content: "Disclaimer — AVOMAX" },
      { property: "og:description", content: "Service facilitation disclaimer." },
      { property: "og:url", content: "/disclaimer" },
    ],
    links: [{ rel: "canonical", href: "/disclaimer" }],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" updated="May 2026">
      <p>
        AVOMAX Global Consultancy Pvt Ltd facilitates education and medical
        consultation processes but does not guarantee university admission,
        visa issuance, or medical treatment outcomes. All final decisions rest
        with the relevant universities, hospitals, embassies and government
        authorities.
      </p>
      <p>
        Information published on this website is for general guidance only and
        may change without notice. Always confirm requirements directly with
        the partner institution before making travel or financial commitments.
      </p>
    </LegalPage>
  );
}
