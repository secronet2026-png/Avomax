import { Link } from "@tanstack/react-router";
import { wa } from "@/lib/site";

import destIndia from "@/assets/dest-india.jpg";
import destMalaysia from "@/assets/dest-malaysia.jpg";
import destUAE from "@/assets/dest-uae.jpg";
import destPoland from "@/assets/dest-poland.jpg";
import destItaly from "@/assets/dest-italy.jpg";
import destChina from "@/assets/dest-china.jpg";

const items = [
  { name: "India", tagline: "World-class universities · 16+ partner institutions", img: destIndia, top: "Chandigarh University · Amity · Sharda" },
  { name: "Malaysia", tagline: "English-medium degrees · Affordable luxury living", img: destMalaysia, top: "Lincoln University Malaysia" },
  { name: "UAE", tagline: "Global business hub · Premium career corridors", img: destUAE, top: "Top international branch campuses" },
  { name: "Poland", tagline: "Schengen access · EU recognised diplomas", img: destPoland, top: "Public & private institutions" },
  { name: "Italy", tagline: "Heritage academia · Design & medicine focus", img: destItaly, top: "Scholarship pathways available" },
  { name: "China", tagline: "Scholarship-friendly · STEM excellence", img: destChina, top: "Government scholarships" },
];

export function Destinations() {
  return (
    <section id="destinations" className="container-px mx-auto max-w-[1500px] py-28">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 reveal">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-[0.28em] text-accent">Global Reach</div>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-ink text-balance">
            Six countries. <em className="not-italic text-primary">One concierge.</em>
          </h2>
        </div>
        <p className="max-w-md text-muted-foreground">
          Hover any destination to preview top universities, scholarships and
          how to apply through Avomax.
        </p>
      </div>

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map((d, i) => (
          <a
            key={d.name}
            href={wa(`I'm interested in studying in ${d.name}. Please share details.`)}
            target="_blank"
            rel="noreferrer"
            className="group relative overflow-hidden rounded-2xl reveal"
            style={{ aspectRatio: "4/5", transitionDelay: `${i * 60}ms` }}
          >
            <img
              src={d.img}
              alt={d.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/70">
                Destination · 0{items.indexOf(d) + 1}
              </div>
              <h3 className="mt-2 font-display text-4xl">{d.name}</h3>
              <p className="mt-2 text-sm text-white/85">{d.tagline}</p>
              <div className="mt-5 flex items-center justify-between opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-xs text-white/70">{d.top}</span>
                <span className="inline-flex items-center gap-1 text-sm text-white">
                  Apply →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
