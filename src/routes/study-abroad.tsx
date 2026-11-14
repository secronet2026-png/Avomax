import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { CountriesFlags } from "@/components/CountriesFlags";
import { Universities } from "@/components/Universities";
import { ApplicationForm } from "@/components/ApplicationForm";
import { HowItWorks } from "@/components/HowItWorks";
import { wa } from "@/lib/site";
import graduation from "@/assets/graduation.jpg";

export const Route = createFileRoute("/study-abroad")({
  component: StudyAbroad,
  head: () => ({
    meta: [
      { title: "Study Abroad — AVOMAX Global Consultancy" },
      { name: "description", content: "Admissions, scholarships and end-to-end support for studying in India, Malaysia, UAE, Poland, Italy and China." },
      { property: "og:title", content: "Study Abroad with AVOMAX" },
      { property: "og:description", content: "Admissions, scholarships and concierge support across six countries." },
      { property: "og:image", content: "/og-study.jpg" },
    ],
  }),
});

function StudyAbroad() {
  useReveal();
  return (
    <>
      <section className="relative pt-32 pb-20 overflow-hidden">
        <img src={graduation} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="relative container-px mx-auto max-w-[1500px]">
          <div className="text-xs uppercase tracking-[0.28em] text-accent">Study Abroad</div>
          <h1 className="mt-5 font-display text-6xl md:text-8xl text-ink leading-[0.95] text-balance max-w-5xl">
            Admissions, scholarships <em className="not-italic text-primary">and a passport stamped with possibility.</em>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-muted-foreground">
            Avomax represents 16+ partner universities across India and Malaysia,
            with active pathways to Europe, UAE and East Asia.
          </p>
          <a
            href={wa("I'd like to apply for Study Abroad through AVOMAX.")}
            target="_blank" rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-primary-foreground font-medium hover:scale-[1.03] transition-transform"
          >
            Start My Application →
          </a>
        </div>
      </section>
      <CountriesFlags />
      <Universities />
      <HowItWorks />
      <ApplicationForm />
    </>
  );
}
