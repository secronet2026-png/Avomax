import { wa } from "@/lib/site";
import hospital from "@/assets/hospital.jpg";

const services = [
  "Treatment Quotation",
  "Online Doctor Consultations",
  "Recovery Monitoring",
  "Ambulance Coordination",
  "Medical Visa Assistance",
];
const hospitals = ["Aakash Hospital", "Max Hospital", "Fortis Hospital"];

export function MedicalSection() {
  return (
    <section id="medical" className="relative py-32 bg-ink text-primary-foreground overflow-hidden">
      <div className="container-px mx-auto max-w-[1500px] grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5 reveal">
          <div className="text-xs uppercase tracking-[0.28em] text-accent">Medical Tourism</div>
          <h2 className="mt-5 font-display text-5xl md:text-6xl leading-[1.05] text-balance">
            World-class care, <em className="not-italic text-accent">coordinated for you.</em>
          </h2>
          <p className="mt-7 text-white/70 max-w-md leading-relaxed">
            From the first consultation to recovery follow-ups, Avomax orchestrates
            every detail with India's most respected medical institutions.
          </p>

          <div className="mt-12 space-y-5">
            {services.map((s) => (
              <div key={s} className="flex items-center gap-4 border-b border-white/10 pb-4">
                <span className="font-display text-2xl text-accent">→</span>
                <span className="text-lg">{s}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {hospitals.map((h) => (
              <span key={h} className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80">
                {h}
              </span>
            ))}
          </div>

          <a
            href={wa("Hello AVOMAX, I'd like to speak with a Medical Advisor.")}
            target="_blank"
            rel="noreferrer"
            className="mt-12 inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-accent-foreground font-medium hover:scale-[1.03] transition-transform"
          >
            Speak to a Medical Advisor →
          </a>
        </div>

        <div className="lg:col-span-7 space-y-5 reveal">
          <div className="relative overflow-hidden rounded-2xl aspect-[16/10]">
            <video
              src="/videos/medical.mp4"
              poster={hospital}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-sm text-white/90">
              Premium hospital network · Pan-India
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="overflow-hidden rounded-2xl aspect-square">
              <video
                src="/videos/medical2.mp4"
                autoPlay muted loop playsInline
                className="h-full w-full object-cover"
              />
            </div>
            <img
              src={hospital}
              alt="Premium hospital interior"
              loading="lazy"
              width={1600}
              height={896}
              className="h-full w-full object-cover rounded-2xl aspect-square"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
