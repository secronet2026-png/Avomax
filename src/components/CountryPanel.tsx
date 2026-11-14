import { useEffect } from "react";
import { X } from "lucide-react";
import { wa } from "@/lib/site";
import { pickGallery } from "@/lib/gallery";
import type { CountryExperienceData } from "./CountryExperience";

export function CountryPanel({
  country,
  index = 0,
  onClose,
}: {
  country: (CountryExperienceData & { landmark?: string }) | null;
  index?: number;
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
  const reel = pickGallery(index * 2, 3);
  const landmark = country.landmark || country.img;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Soft blurred backdrop — keeps page visible */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-ink/30 backdrop-blur-md animate-in fade-in duration-300"
      />

      {/* Slide-in side panel */}
      <aside
        className="absolute right-0 top-0 h-full w-full sm:w-[80%] md:w-[65%] lg:w-[60%] overflow-y-auto
                   bg-white/10 backdrop-blur-2xl border-l border-white/20
                   shadow-[0_30px_120px_-20px_rgba(0,0,0,0.6)]
                   text-white animate-in slide-in-from-right duration-500"
      >
        {/* dark glass underlay so text stays readable over any backdrop */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink/85 via-ink/75 to-ink/65" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero landmark */}
        <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
          <img
            src={landmark}
            alt={`${country.name} landmark`}
            className="absolute inset-0 h-full w-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute bottom-6 left-8 right-8">
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent">Study in</div>
            <div className="mt-2 flex items-end gap-4">
              <span className="text-6xl drop-shadow-2xl">{country.flag}</span>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.9]">{country.name}</h2>
            </div>
            <p className="mt-3 max-w-xl text-white/85 text-sm md:text-base">{country.tagline}</p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 md:px-10 py-10 space-y-12">
          {/* Advantages */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent">Why {country.name}</div>
            <div className="mt-5 grid sm:grid-cols-2 gap-3">
              {(country.advantages ||
                country.benefits.map((b) => ({ title: b, body: "Concierge-managed by Avomax." }))
              )
                .slice(0, 4)
                .map((a, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur p-5 hover:border-accent/50 hover:-translate-y-0.5 transition-all duration-500"
                  >
                    <div className="font-display text-accent text-2xl">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="mt-2 font-display text-lg">{a.title}</div>
                    <p className="mt-1 text-sm text-white/65 leading-relaxed">{a.body}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Universities */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent">Partner Universities</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {country.universities.map((u) => (
                <span
                  key={u}
                  className="rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs"
                >
                  {u}
                </span>
              ))}
            </div>
          </div>

          {/* Lifestyle reel */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-accent">Avomax Moments</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {reel.map((r, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-xl overflow-hidden group">
                  <img
                    src={r.src}
                    alt={r.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 text-[10px] uppercase tracking-[0.2em] text-white/85">
                    {r.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={wa(`I'd like to apply for Study Abroad in ${country.name}.`)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3.5 font-medium hover:scale-[1.02] transition-transform shadow-[0_20px_60px_-12px_oklch(0.55_0.12_158/0.55)]"
            >
              Apply to {country.name} →
            </a>
            <a
              href={wa(`Hello AVOMAX, tell me about studying in ${country.name}.`)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center rounded-full border border-white/25 backdrop-blur px-6 py-3.5 hover:bg-white/10 transition"
            >
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
