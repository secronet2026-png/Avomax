import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { CountriesFlags } from "@/components/CountriesFlags";
import { MedicalSection } from "@/components/MedicalSection";
import { Hospitals } from "@/components/Hospitals";
import { Universities } from "@/components/Universities";
import { StudentJourney } from "@/components/StudentJourney";
import { CampusReels } from "@/components/CampusReels";
import { HowItWorks } from "@/components/HowItWorks";
import { Travel } from "@/components/Travel";
import { ApplicationForm } from "@/components/ApplicationForm";
import { SuccessStories } from "@/components/SuccessStories";
import { Moments } from "@/components/Moments";
import { useReveal } from "@/hooks/use-reveal";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AVOMAX Global Consultancy — Study Abroad, Medical Tourism & Visa Concierge" },
      { name: "description", content: "Unlock global opportunities without limits. Study abroad admissions, medical tourism, visa support, flights and airport pickup — concierge-managed by AVOMAX." },
      { property: "og:title", content: "AVOMAX Global Consultancy" },
      { property: "og:description", content: "Premium international mobility — study, medical and travel concierge." },
    ],
  }),
});

function Index() {
  useReveal();
  return (
    <>
      <Hero />
      <CountriesFlags />
      <Universities />
      <CampusReels />
      <StudentJourney />
      <MedicalSection />
      <Hospitals />
      <HowItWorks />
      <Travel />
      <ApplicationForm />
      <SuccessStories />
      <Moments />
    </>
  );
}
