import { useEffect } from "react";
import { X } from "lucide-react";
import { wa } from "@/lib/site";
import graduates from "@/assets/gallery/graduates.jpeg";
import arrivalsBanner from "@/assets/gallery/arrivals-banner.jpeg";
import admissionsOffice from "@/assets/gallery/admissions-office.jpeg";
import teamGroup from "@/assets/gallery/team-group.jpeg";

const lifestyleReel = [
  { img: arrivalsBanner, label: "Arrival" },
  { img: admissionsOffice, label: "Admissions" },
  { img: teamGroup, label: "Campus Life" },
  { img: graduates, label: "Graduation" },
];

export type CountryExperienceData = {
  code: string;
  name: string;
  flag: string;
  img: string;
  videoSrc?: string;
  tagline: string;
  benefits: string[];
  universities: string[];
  advantages?: { title: string; body: string }[];
};

export function CountryExperience({
  country,
  onClose,
}: {
  country: CountryExperienceData | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!country) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [country, onClose]);

  if (!country) return null;

  const advantages =
    country.advantages ||
    country.benefits.map((b) => ({ title: b, body: "Concierge-managed through Avomax." }));

  return (
    <div className="fixed inset-0 z-[100] bg-ink text-white overflow-y-auto animate-in fade-in duration-500">
      {/* Cinematic hero */}
      <div className="relative h-screen min-h-[680px] w-full overflow-hidden">
        {country.videoSrc ? (
          <video
            src={country.videoSrc}
            autoPlay
            muted
            loop
            playsInline
            poster={country.img}
            className="absolute inset-0 h-full w-full object-cover scale-110"
          />
        ) : (
          <img src={country.img} alt={country.name} className="absolute inset-0 h-full w-full object-cover scale-110" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/30 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="absolute inset-x-0 bottom-0 px-6 md:px-16 pb-20">
          <div className="text-[11px] uppercase tracking-[0.32em] text-accent animate-[fade-up_1s_ease-out_both]">
            Step inside {country.name}
          </div>
          <div className="mt-4 flex items-end gap-6 animate-[fade-up_1.1s_ease-out_both]">
            <div className="text-8xl md:text-9xl drop-shadow-2xl">{country.flag}</div>
            <div className="font-display text-6xl md:text-8xl leading-[0.9]">{country.name}</div>
          </div>
          <p className="mt-6 max-w-2xl text-xl text-white/80 animate-[fade-up_1.3s_ease-out_both]">
            {country.tagline}
          </p>
          <div className="mt-10 flex flex-wrap gap-3 animate-[fade-up_1.5s_ease-out_both]">
            <a
              href={wa(`I'd like to apply for Study Abroad in ${country.name}.`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-gradient-to-r from-primary to-accent px-8 py-4 font-medium hover:scale-[1.03] transition-transform shadow-[0_20px_60px_-10px_oklch(0.55_0.12_158/0.6)]"
            >
              Apply to {country.name} →
            </a>
            <a
              href={wa(`Hello AVOMAX, tell me about studying in ${country.name}.`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/25 backdrop-blur px-8 py-4 hover:bg-white/10 transition"
            >
              WhatsApp Inquiry
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.3em] text-white/50 animate-bounce">
          Scroll to explore ↓
        </div>
      </div>

      {/* Advantages */}
      <div className="px-6 md:px-16 py-24 max-w-7xl mx-auto">
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent">Why {country.name}</div>
        <h3 className="mt-3 font-display text-4xl md:text-5xl max-w-3xl">
          A future shaped by global advantages.
        </h3>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {advantages.slice(0, 4).map((a, i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl p-6 hover:-translate-y-1 hover:border-accent/40 transition-all duration-500"
            >
              <div className="text-3xl font-display text-accent">{String(i + 1).padStart(2, "0")}</div>
              <div className="mt-4 font-display text-xl">{a.title}</div>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{a.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Universities */}
      <div className="px-6 md:px-16 pb-16 max-w-7xl mx-auto">
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent">Partner Universities</div>
        <h3 className="mt-3 font-display text-4xl md:text-5xl">Premium institutions in {country.name}.</h3>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {country.universities.map((u) => (
            <div
              key={u}
              className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-6 hover:border-accent/50 transition"
            >
              <div className="font-display text-2xl">{u}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.25em] text-white/50">
                Avomax Partner Institution
              </div>
              <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-accent/20 blur-3xl group-hover:bg-accent/40 transition" />
            </div>
          ))}
        </div>
      </div>

      {/* Lifestyle reel */}
      <div className="px-6 md:px-16 pb-24 max-w-7xl mx-auto">
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent">Living Experience</div>
        <h3 className="mt-3 font-display text-4xl md:text-5xl">Life in {country.name}.</h3>
        <div className="mt-10 grid md:grid-cols-4 gap-4">
          {lifestyleReel.map((q, i) => (
            <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
              <img
                src={q.img}
                alt={`${country.name} ${q.label}`}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
              <div className="absolute bottom-3 left-4 text-xs uppercase tracking-[0.2em] text-white/85">
                {q.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="px-6 md:px-16 pb-32 max-w-4xl mx-auto text-center">
        <div className="font-display text-4xl md:text-5xl">Your {country.name} story begins here.</div>
        <p className="mt-4 text-white/65">From Zimbabwe to arrival — Avomax handles every step.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={wa(`I'd like to apply for Study Abroad in ${country.name}.`)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-gradient-to-r from-primary to-accent px-10 py-4 font-medium hover:scale-[1.03] transition-transform"
          >
            Start My Application →
          </a>
          <a
            href="tel:+263782457669"
            className="rounded-full border border-white/25 px-10 py-4 hover:bg-white/10 transition"
          >
            Call Zimbabwe Office
          </a>
        </div>
      </div>
    </div>
  );
}
