import { Plane, FileCheck, MapPin, Home, Award, GraduationCap } from "lucide-react";

const stops = [
  { icon: MapPin, label: "Your Country", sub: "Your journey begins" },
  { icon: FileCheck, label: "Visa Concierge", sub: "End-to-end processing" },
  { icon: Plane, label: "Flight Booked", sub: "Travel arranged for you" },
  { icon: Home, label: "Airport Arrival", sub: "Pickup & accommodation ready" },
  { icon: Award, label: "Campus Life", sub: "Settled in. Thriving." },
  { icon: GraduationCap, label: "Graduation", sub: "A global career awaits" },
];

export function StudentJourney() {
  return (
    <section className="relative py-28 overflow-hidden bg-ink text-white">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-accent/30 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-primary/40 blur-[120px]" />
      </div>

      <div className="relative container-px mx-auto max-w-[1500px]">
        <div className="text-center max-w-3xl mx-auto reveal">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent">The Student Journey</div>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-balance">
            From your city to <em className="not-italic text-accent">your global future.</em>
          </h2>
          <p className="mt-5 text-white/65">
            One concierge. Six countries. Every step covered — from your first inquiry to your graduation photo.
          </p>
        </div>

        {/* Desktop path */}
        <div className="hidden md:block mt-24 relative">
          <div className="absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          <div className="grid grid-cols-6 gap-4">
            {stops.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="relative flex flex-col items-center text-center reveal"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_20px_60px_-10px_oklch(0.55_0.12_158/0.6)] hover:scale-110 transition-transform duration-500">
                    <Icon className="h-9 w-9" />
                    <span className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-white text-ink text-xs font-bold flex items-center justify-center font-display">
                      {i + 1}
                    </span>
                  </div>
                  <div className="mt-6 font-display text-xl">{s.label}</div>
                  <div className="mt-1 text-xs text-white/55 uppercase tracking-[0.15em]">{s.sub}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile vertical path */}
        <div className="md:hidden mt-16 relative pl-12">
          <div className="absolute left-[34px] top-4 bottom-4 w-px bg-gradient-to-b from-accent/60 via-accent/40 to-transparent" />
          {stops.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="relative mb-8 reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="absolute -left-12 top-0 h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="pl-2 pt-2">
                  <div className="font-display text-2xl">{s.label}</div>
                  <div className="mt-1 text-xs text-white/55 uppercase tracking-[0.15em]">{s.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
