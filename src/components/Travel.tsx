import airport from "@/assets/gallery/airport-arrival.jpeg";
import { wa } from "@/lib/site";

const services = [
  { t: "Flight Booking", d: "Best fares, premium carriers, flexible itineraries — sourced and booked for you." },
  { t: "Airport Pickup", d: "On-arrival concierge with chauffeur transfer to your campus or hospital." },
  { t: "Accommodation", d: "Hostel, apartment or hotel — pre-reserved and inspected before you land." },
];

export function Travel() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="container-px mx-auto max-w-[1500px] grid gap-16 lg:grid-cols-2 items-center">
        <div className="reveal">
          <div className="text-xs uppercase tracking-[0.28em] text-accent">Travel Assistance</div>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-ink text-balance">
            From terminal to threshold, <em className="not-italic text-primary">we're with you.</em>
          </h2>
          <p className="mt-6 text-muted-foreground max-w-md">
            Avomax travel concierge ensures arrival is the easiest part of your journey.
          </p>

          <div className="mt-12 space-y-px">
            {services.map((s) => (
              <div key={s.t} className="grid grid-cols-[140px_1fr] gap-6 py-6 border-t border-border last:border-b">
                <div className="font-display text-xl text-primary">{s.t}</div>
                <div className="text-muted-foreground">{s.d}</div>
              </div>
            ))}
          </div>

          <a
            href={wa("I need travel assistance — flight, accommodation and pickup.")}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-white font-medium hover:scale-[1.03] transition-transform"
          >
            Arrange My Travel →
          </a>
        </div>

        <div className="relative reveal">
          <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
            <img
              src={airport}
              alt="Avomax concierge welcoming students at the international arrivals hall"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="text-xs uppercase tracking-[0.25em] text-white/70">On Arrival</div>
              <div className="mt-2 font-display text-3xl">A familiar face at every terminal.</div>
            </div>
          </div>
          <div className="absolute -top-6 -left-6 hidden md:flex h-32 w-32 items-center justify-center rounded-full bg-accent text-accent-foreground font-display text-xl text-center animate-float">
            24/7<br/>support
          </div>
        </div>
      </div>
    </section>
  );
}
