import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — AVOMAX" },
      { name: "description", content: "How AVOMAX uses cookies and similar technologies." },
      { property: "og:title", content: "Cookie Policy — AVOMAX" },
      { property: "og:description", content: "Cookies and analytics on the AVOMAX website." },
      { property: "og:url", content: "/cookies" },
    ],
    links: [{ rel: "canonical", href: "/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updated="May 2026">
      <p>This site uses a small number of cookies to keep the experience reliable.</p>
      <h2>Analytics cookies</h2>
      <p>We use privacy-respecting analytics to understand which pages are useful and where visitors come from. No personal profile is built.</p>
      <h2>Performance tracking</h2>
      <p>Cookies help us measure page speed and detect errors so we can keep the website fast.</p>
      <h2>User experience</h2>
      <p>Functional cookies remember small preferences such as your last viewed section.</p>
      <h2>Your control</h2>
      <p>You can clear or block cookies in your browser settings. The site will still work without them.</p>
    </LegalPage>
  );
}
