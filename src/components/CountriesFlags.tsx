import { useEffect, useRef, useState } from "react";
import { CountryPanel } from "./CountryPanel";
import type { CountryExperienceData } from "./CountryExperience";

// Real landmark editorial photography — no AI renders
const destIndia = "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80"; // Taj Mahal
const destMalaysia = "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1600&q=80"; // Petronas Towers
const destUAE = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80"; // Burj Khalifa
const destChina = "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=1600&q=80"; // Shanghai
const destItaly = "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1600&q=80"; // Rome Colosseum
const destPoland = "https://images.unsplash.com/photo-1607427293702-036933bbf746?auto=format&fit=crop&w=1600&q=80"; // Warsaw

import flagMalaysia from "@/assets/flags/malaysia.jpeg";
import flagIndia from "@/assets/flags/india.jpeg";
import flagUAE from "@/assets/flags/uae.jpeg";
import flagChina from "@/assets/flags/china.jpeg";
import flagItaly from "@/assets/flags/italy.jpeg";
import flagPoland from "@/assets/flags/poland.jpeg";

const flagImg: Record<string, string> = {
  IN: flagIndia, MY: flagMalaysia, AE: flagUAE, CN: flagChina, IT: flagItaly, PL: flagPoland,
};

const countries: CountryExperienceData[] = [
  {
    code: "IN", name: "India", flag: "🇮🇳", img: destIndia,
    videoSrc: "/videos/study-abroad.mp4",
    tagline: "World-class universities · 16+ partner institutions · Scholarships up to 50%",
    benefits: ["Globally ranked universities", "Affordable premium living", "English-medium degrees", "Scholarships up to 50%"],
    universities: ["Chandigarh University", "Amity University", "Sharda University", "Galgotias University", "GD Goenka University", "MIT-WPU"],
    advantages: [
      { title: "Globally Ranked", body: "QS & THE-rated universities across engineering, business, medicine and design." },
      { title: "Affordable Luxury", body: "Premium campus living at a fraction of Western tuition." },
      { title: "English Medium", body: "Internationally recognised degrees taught in English." },
      { title: "50% Scholarships", body: "Avomax-negotiated funding for qualifying Zimbabwean students." },
    ],
  },
  {
    code: "MY", name: "Malaysia", flag: "🇲🇾", img: destMalaysia,
    videoSrc: "/videos/students.mp4",
    tagline: "English-medium degrees · Multicultural society · Direct work pathways",
    benefits: ["Internationally recognised degrees", "Multicultural, English-speaking", "Low cost of living", "Direct work-pathway visas"],
    universities: ["Lincoln University Malaysia", "MMU University"],
    advantages: [
      { title: "Global Recognition", body: "Degrees accredited across the UK, Australia and the Commonwealth." },
      { title: "English Everywhere", body: "Programs, daily life and work entirely in English." },
      { title: "Low Cost", body: "Premium lifestyle at half the cost of Europe." },
      { title: "Work Pathway", body: "Direct post-study work visa opportunities." },
    ],
  },
  {
    code: "AE", name: "UAE", flag: "🇦🇪", img: destUAE,
    videoSrc: "/videos/hero.mp4",
    tagline: "Global business hub · Premium career corridors · Tax-free graduate jobs",
    benefits: ["World-class infrastructure", "Tax-free graduate jobs", "Branch campuses of global universities", "Strategic global location"],
    universities: ["Top international branch campuses"],
    advantages: [
      { title: "Global Business Hub", body: "Gateway to careers across Europe, Asia and Africa." },
      { title: "Tax-Free Salaries", body: "Graduate roles with zero income tax on earnings." },
      { title: "World Campuses", body: "Branch campuses of leading global universities." },
      { title: "Premium Lifestyle", body: "Safe, modern, world-class infrastructure." },
    ],
  },
  {
    code: "CN", name: "China", flag: "🇨🇳", img: destChina,
    videoSrc: "/videos/study-abroad.mp4",
    tagline: "Scholarship-friendly · STEM excellence · Rising global rankings",
    benefits: ["Government scholarships available", "Leading STEM & medical schools", "Rising global rankings", "Cultural immersion"],
    universities: ["Government partner universities"],
    advantages: [
      { title: "Govt Scholarships", body: "Funded study options through bilateral partnerships." },
      { title: "STEM Powerhouse", body: "Leading engineering and medical institutions." },
      { title: "Rising Rankings", body: "Universities climbing into the global top 100." },
      { title: "Cultural Edge", body: "Mandarin proficiency = a lifetime career advantage." },
    ],
  },
  {
    code: "IT", name: "Italy", flag: "🇮🇹", img: destItaly,
    videoSrc: "/videos/hero.mp4",
    tagline: "Heritage academia · Design, fashion & medicine · Schengen mobility",
    benefits: ["Historic, prestigious universities", "Design, fashion, medicine pathways", "Schengen mobility", "Scholarship pathways"],
    universities: ["Scholarship partner universities"],
    advantages: [
      { title: "Heritage Academia", body: "Universities older than most countries." },
      { title: "Design & Medicine", body: "World leaders in design, fashion and medical training." },
      { title: "Schengen Access", body: "Live in Italy, travel 27 European countries." },
      { title: "Scholarship Pathways", body: "Avomax partner funding routes." },
    ],
  },
  {
    code: "PL", name: "Poland", flag: "🇵🇱", img: destPoland,
    videoSrc: "/videos/students.mp4",
    tagline: "Schengen access · EU-recognised diplomas · Affordable European life",
    benefits: ["Affordable tuition", "EU-recognised qualifications", "Safe student cities", "Post-study work options"],
    universities: ["Public & private institutions"],
    advantages: [
      { title: "EU Diplomas", body: "Recognised across the entire European Union." },
      { title: "Affordable Tuition", body: "Europe's most accessible English-medium programs." },
      { title: "Safe Cities", body: "Student-friendly cities with low crime." },
      { title: "Work After Study", body: "Post-study work permits across the EU." },
    ],
  },
];

export function CountriesFlags() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const order = ["MY", "IN", "AE", "CN", "IT", "PL"];
  const ordered = order.map((c) => countries.find((x) => x.code === c)!).filter(Boolean);
  const loop = [...ordered, ...ordered];

  return (
    <section id="destinations" className="relative py-28 overflow-hidden bg-background">
      <div className="container-px mx-auto max-w-[1500px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 reveal">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.28em] text-accent">Global Reach</div>
            <h2 className="mt-4 font-display text-5xl md:text-6xl text-ink text-balance">
              Six countries. <em className="not-italic text-primary">One concierge.</em>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Tap any flag — a premium glass panel slides in with universities, scholarships and life on the ground.
          </p>
        </div>
      </div>

      {/* Desktop marquee */}
      <div className="mt-20 relative hidden md:block">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div
          className="flex gap-10 whitespace-nowrap"
          style={{ animation: "marquee 55s linear infinite", width: "max-content" }}
        >
          {loop.map((c, i) => (
            <button
              key={`${c.code}-${i}`}
              onClick={() => setActiveIdx(ordered.findIndex((x) => x.code === c.code))}
              className="group flex flex-col items-center gap-3 px-6"
            >
              <div className="relative h-32 w-32 rounded-full overflow-hidden shadow-lg border-2 border-white group-hover:scale-110 group-hover:shadow-[0_20px_60px_-10px_oklch(0.32_0.07_160/0.4)] transition-all duration-500">
                <img
                  src={flagImg[c.code]}
                  alt={`${c.name} flag`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="font-display text-xl text-ink group-hover:text-primary transition-colors">
                {c.name}
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                Open Panel →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile swipe carousel — 2 per view, snap, auto-scroll, dots */}
      <MobileFlagsCarousel
        countries={ordered}
        flagImg={flagImg}
        onOpen={(i) => setActiveIdx(i)}
      />


      <CountryPanel
        country={activeIdx !== null ? ordered[activeIdx] : null}
        index={activeIdx ?? 0}
        onClose={() => setActiveIdx(null)}
      />
    </section>
  );
}

function MobileFlagsCarousel({
  countries,
  flagImg,
  onOpen,
}: {
  countries: CountryExperienceData[];
  flagImg: Record<string, string>;
  onOpen: (i: number) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const pages = Math.ceil(countries.length / 2);

  // Auto-scroll slowly
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const id = setInterval(() => {
      if (!el) return;
      const nextPage = (Math.round(el.scrollLeft / (el.clientWidth || 1)) + 1) % pages;
      el.scrollTo({ left: nextPage * el.clientWidth, behavior: "smooth" });
    }, 4500);
    return () => clearInterval(id);
  }, [pages]);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const p = Math.round(el.scrollLeft / (el.clientWidth || 1));
    setPage(Math.min(pages - 1, Math.max(0, p)));
  };

  return (
    <div className="mt-16 md:hidden">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {Array.from({ length: pages }).map((_, p) => (
          <div
            key={p}
            className="min-w-full snap-start grid grid-cols-2 gap-4 px-6"
          >
            {countries.slice(p * 2, p * 2 + 2).map((c, j) => {
              const idx = p * 2 + j;
              return (
                <button
                  key={c.code}
                  onClick={() => onOpen(idx)}
                  className="flex flex-col items-center gap-3 active:scale-95 transition-transform"
                >
                  <div className="relative h-28 w-28 rounded-full overflow-hidden shadow-lg border-2 border-white">
                    <img
                      src={flagImg[c.code]}
                      alt={`${c.name} flag`}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-display text-lg text-ink">{c.name}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: pages }).map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => {
              const el = scrollerRef.current;
              if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
            }}
            className={`h-2 rounded-full transition-all ${
              page === i ? "w-6 bg-primary" : "w-2 bg-ink/25"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
