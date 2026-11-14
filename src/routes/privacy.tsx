import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — AVOMAX Global Consultancy" },
      { name: "description", content: "How AVOMAX collects, uses and protects your personal information." },
      { property: "og:title", content: "Privacy Policy — AVOMAX" },
      { property: "og:description", content: "Our commitment to protecting your data." },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="May 2026">
      <p>AVOMAX Global Consultancy Pvt Ltd ("AVOMAX", "we", "us") respects your privacy. This policy explains exactly what we collect and how we handle it.</p>

      <h2>Information we collect</h2>
      <p>To facilitate university admissions, visa processing and medical consultations, we collect the following details through our enquiry, application and document upload forms:</p>
      <ul>
        <li>Full Name</li>
        <li>Email Address</li>
        <li>Passport / National ID Number</li>
        <li>Date of Birth</li>
        <li>Nationality</li>
        <li>Phone Number</li>
        <li>Gender</li>
        <li>Marital Status</li>
        <li>Father's Name</li>
        <li>Father's Place of Birth</li>
        <li>Mother's Name</li>
        <li>Mother's Place of Birth</li>
        <li>Student Residential Address</li>
        <li>Program of Interest</li>
        <li>High School Name</li>
        <li>O-Level / A-Level academic documents</li>
        <li>Passport / ID document uploads</li>
        <li>Messages and documents shared via WhatsApp or email</li>
        <li>Anonymous analytics about how you use this website</li>
      </ul>

      <h2>Our data commitment</h2>
      <p><strong>All submitted academic and identification documents are securely processed solely for admission consultation, application facilitation, and university placement purposes. AVOMAX does not sell or misuse applicant data.</strong></p>

      <h2>How we use it</h2>
      <ul>
        <li>To process admissions, visa, medical or travel applications you initiate.</li>
        <li>To respond to your enquiries and provide concierge support.</li>
        <li>To share the minimum required information with partner universities, hospitals or government bodies on your behalf.</li>
      </ul>

      <h2>What we never do</h2>
      <ul>
        <li>We do not sell, rent or trade your personal information.</li>
        <li>We do not share data with third parties outside of the service you requested.</li>
      </ul>

      <h2>International data transfer</h2>
      <p>Because we operate across Zimbabwe, India and partner countries, your information may be transferred internationally strictly for service delivery. We apply the same protection standards everywhere.</p>

      <h2>Your rights</h2>
      <p>You can request access, correction or deletion of your personal data at any time by emailing <a href="mailto:avomaxadmission@gmail.com">avomaxadmission@gmail.com</a>.</p>
    </LegalPage>
  );
}
