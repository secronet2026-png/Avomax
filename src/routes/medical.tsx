import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { MedicalSection } from "@/components/MedicalSection";
import { HowItWorks } from "@/components/HowItWorks";
import hospital from "@/assets/hospital.jpg";
import { wa } from "@/lib/site";

export const Route = createFileRoute("/medical")({
  component: Medical,
  head: () => ({
    meta: [
      { title: "Medical Tourism — AVOMAX Global Consultancy" },
      { name: "description", content: "World-class medical care coordinated end-to-end: quotations, consultations, recovery monitoring, visa and ambulance support." },
      { property: "og:title", content: "Medical Tourism with AVOMAX" },
      { property: "og:description", content: "Premier hospitals · concierge medical journeys." },
      { property: "og:image", content: "/og-medical.jpg" },
    ],
  }),
});

function Medical() {
  useReveal();
  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <img src={hospital} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="relative container-px mx-auto max-w-[1500px]">
          <div className="text-xs uppercase tracking-[0.28em] text-accent">Medical Tourism</div>
          <h1 className="mt-5 font-display text-6xl md:text-8xl text-ink leading-[0.95] text-balance max-w-5xl">
            Specialist care, <em className="not-italic text-primary">arranged with the precision of a private office.</em>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            Treatment quotations, online doctor consultations, recovery monitoring and
            medical-visa assistance across Aakash, Max and Fortis networks.
          </p>
          <a
            href={wa("I'd like a Medical Tourism consultation through AVOMAX.")}
            target="_blank" rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-primary-foreground font-medium hover:scale-[1.03] transition-transform"
          >
            Request Medical Quotation →
          </a>
        </div>
      </section>
      <MedicalSection />
      <HowItWorks />
    </>
  );
}
