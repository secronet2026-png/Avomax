import { useState } from "react";
import { wa } from "@/lib/site";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import hospital from "@/assets/hospital.jpg";
import maxLogo from "@/assets/hospitals/max.png";
import fortisLogo from "@/assets/hospitals/fortis.png";
import akashLogo from "@/assets/hospitals/akash.png";

type Hospital = {
  name: string;
  logo: string;
  location: string;
  description: string;
  services: string[];
  cover: string;
};

const hospitals: Hospital[] = [
  {
    name: "Max Hospital",
    logo: maxLogo,
    location: "Pan-India · HQ New Delhi",
    description:
      "Max Super Specialty Hospitals — a network of premier multi-specialty hospitals known for cardiac sciences, oncology, neurosciences and orthopaedics.",
    services: ["Cardiology", "Oncology", "Neurology", "Orthopaedics", "Organ Transplants"],
    cover: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Fortis Hospital",
    logo: fortisLogo,
    location: "Pan-India · 36+ Facilities",
    description:
      "Fortis Healthcare — an internationally recognised network delivering world-class clinical outcomes across specialities.",
    services: ["Cardiac Care", "Oncology", "Renal Sciences", "Neurosciences", "Robotic Surgery"],
    cover: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Aakash Hospital",
    logo: akashLogo,
    location: "New Delhi, India",
    description:
      "Aakash Healthcare — a multi-super-speciality hospital with advanced diagnostics and personalised patient care.",
    services: ["Orthopaedics", "Cardiology", "Gastroenterology", "Pediatrics", "Mother & Child"],
    cover: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
  },
];

export function Hospitals() {
  const [active, setActive] = useState<Hospital | null>(null);

  return (
    <section className="bg-background py-28">
      <div className="container-px mx-auto max-w-[1500px]">
        <div className="reveal max-w-2xl">
          <div className="text-xs uppercase tracking-[0.28em] text-accent">Hospital Network</div>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-ink text-balance">
            Premier hospitals,{" "}
            <em className="not-italic text-primary">curated for you.</em>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {hospitals.map((h, i) => (
            <button
              key={h.name}
              onClick={() => setActive(h)}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card text-left reveal hover:-translate-y-1 hover:shadow-[0_30px_60px_-20px_oklch(0.32_0.07_160/0.35)] transition-all duration-500"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={h.cover}
                  alt={h.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                  onError={(e) => ((e.target as HTMLImageElement).src = hospital)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                <div className="absolute top-4 left-4 h-16 w-24 rounded-xl bg-white flex items-center justify-center p-2 shadow-lg">
                  <img src={h.logo} alt={h.name} className="max-h-12 max-w-full object-contain" />
                </div>
              </div>
              <div className="p-6">
                <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {h.location}
                </div>
                <h3 className="mt-2 font-display text-2xl text-ink">{h.name}</h3>
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  View profile →
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden border-0">
          {active && (
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[4/5] md:aspect-auto bg-secondary">
                <img
                  src={active.cover}
                  alt={active.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  onError={(e) => ((e.target as HTMLImageElement).src = hospital)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="text-[10px] uppercase tracking-[0.25em] text-white/70">{active.location}</div>
                  <div className="mt-1 font-display text-3xl">{active.name}</div>
                </div>
              </div>
              <div className="p-8">
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-24 rounded-xl bg-white border border-border flex items-center justify-center p-2">
                      <img src={active.logo} alt={active.name} className="max-h-12 max-w-full object-contain" />
                    </div>
                    <div>
                      <DialogTitle className="font-display text-2xl text-ink">{active.name}</DialogTitle>
                      <DialogDescription>{active.location}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
                  {active.description}
                </p>

                <div className="mt-6 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Services
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {active.services.map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs text-ink">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-2">
                  <a
                    href={wa(`I'd like a consultation at ${active.name} via AVOMAX.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-gradient-to-r from-primary to-accent text-white text-center px-6 py-3 font-medium hover:scale-[1.02] transition-transform"
                  >
                    Book Consultation →
                  </a>
                  <a
                    href="tel:+263780078824"
                    className="rounded-full border border-border text-ink text-center px-6 py-3 hover:bg-secondary transition-colors"
                  >
                    Direct Zimbabwe Call · +263 780 078 824
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
