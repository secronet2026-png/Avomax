import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { Travel } from "@/components/Travel";
import { wa } from "@/lib/site";

const offerings = [
  { t: "Visa Processing", d: "Student, medical and travel visas — applications prepared and tracked to approval." },
  { t: "Flight Booking", d: "Best fares with premium carriers, flexible itineraries, multi-city options." },
  { t: "Airport Pickup", d: "Chauffeur transfer from arrival to campus, hospital or accommodation." },
  { t: "Accommodation Reservation", d: "Hostels, apartments and hotels — pre-vetted and reserved for your stay." },
  { t: "Doctor Consultations", d: "Online specialist consultations coordinated with India's leading hospitals." },
  { t: "Global Consultancy", d: "Personal advisors for relocation, education and life-changing decisions." },
];

export const Route = createFileRoute("/services")({
  component: Services,
  head: () => ({
    meta: [
      { title: "Services — AVOMAX Global Consultancy" },
      { name: "description", content: "Visa processing, flights, accommodation, airport pickup and doctor consultations — managed end-to-end." },
      { property: "og:title", content: "AVOMAX Services" },
      { property: "og:description", content: "Concierge mobility: visas, travel, accommodation, healthcare." },
    ],
  }),
});

function Services() {
  useReveal();
  return (
    <>
      <section className="pt-32 pb-10 container-px mx-auto max-w-[1500px]">
        <div className="text-xs uppercase tracking-[0.28em] text-accent">Services</div>
        <h1 className="mt-5 font-display text-6xl md:text-8xl text-ink leading-[0.95] text-balance max-w-5xl">
          One concierge, <em className="not-italic text-primary">every detail handled.</em>
        </h1>
      </section>

      <section className="container-px mx-auto max-w-[1500px] py-16">
        <div className="border-t border-border">
          {offerings.map((o) => (
            <a
              key={o.t}
              href={wa(`I'd like to enquire about ${o.t}.`)}
              target="_blank" rel="noreferrer"
              className="group grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-6 items-start py-10 border-b border-border hover:bg-secondary/40 transition-colors px-4 -mx-4 reveal"
            >
              <h3 className="font-display text-3xl md:text-4xl text-ink group-hover:text-primary transition-colors">{o.t}</h3>
              <p className="text-muted-foreground max-w-xl">{o.d}</p>
              <span className="text-primary text-2xl translate-x-0 group-hover:translate-x-2 transition-transform">→</span>
            </a>
          ))}
        </div>
      </section>

      <Travel />
    </>
  );
}
