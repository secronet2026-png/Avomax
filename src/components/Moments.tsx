import graduates from "@/assets/gallery/graduates.jpeg";
import arrivalsBanner from "@/assets/gallery/arrivals-banner.jpeg";
import admissionsOffice from "@/assets/gallery/admissions-office.jpeg";
import founderConference from "@/assets/gallery/founder-conference.jpeg";
import airportPickup from "@/assets/gallery/airport-pickup.jpeg";
import studentPortrait from "@/assets/gallery/student-portrait.jpeg";
import teamTshirts from "@/assets/gallery/team-tshirts.jpeg";
import indiaAfrica from "@/assets/gallery/india-africa.jpeg";
import teamGroup from "@/assets/gallery/team-group.jpeg";
import cgcSummit from "@/assets/campuses/cgc-summit.jpeg";

type Item = { src: string; caption: string; tag: string; span: string };

const items: Item[] = [
  { src: graduates, caption: "Class of 2025 — Chandigarh University graduates", tag: "Graduation", span: "md:col-span-5 md:row-span-2 aspect-[3/4]" },
  { src: cgcSummit, caption: "honoured at CGC Thrive Summit 2026", tag: "Recognition", span: "md:col-span-4 aspect-[4/3]" },
  { src: founderConference, caption: "Founder at Chandigarh University Conference", tag: "Founder", span: "md:col-span-3 aspect-[3/4]" },
  { src: arrivalsBanner, caption: "Avomax welcome banner — Indira Gandhi International", tag: "On-Ground", span: "md:col-span-3 aspect-[4/5]" },
  { src: admissionsOffice, caption: "International Division — admissions in progress", tag: "Admissions", span: "md:col-span-4 aspect-[4/3]" },
  { src: teamGroup, caption: "Avomax & partner team across India", tag: "Team", span: "md:col-span-5 aspect-[16/10]" },
  { src: airportPickup, caption: "Door-to-door airport pickup, every arrival", tag: "Concierge", span: "md:col-span-4 aspect-[3/4]" },
  { src: indiaAfrica, caption: "India–Africa delegation, 2025", tag: "Global Reach", span: "md:col-span-4 aspect-[4/3]" },
  { src: studentPortrait, caption: "Fueling careers. Empowering ambition.", tag: "Our Students", span: "md:col-span-4 aspect-[3/4]" },
  { src: teamTshirts, caption: "Avomax representatives — India operations", tag: "Boots on the Ground", span: "md:col-span-12 aspect-[21/9]" },
];

export function Moments() {
  return (
    <section className="bg-background py-28">
      <div className="container-px mx-auto max-w-[1500px]">
        <div className="flex flex-col lg:flex-row items-end justify-between gap-6 reveal">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.28em] text-accent">Moments</div>
            <h2 className="mt-4 font-display text-5xl md:text-6xl text-ink text-balance">
              Lived experiences across{" "}
              <em className="not-italic text-primary">two continents.</em>
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            From the Avomax desk in Harare to arrivals in Delhi — a single, accompanied journey.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-12 gap-4 auto-rows-auto">
          {items.map((it, i) => (
            <figure
              key={i}
              className={`group relative overflow-hidden rounded-2xl reveal ${it.span}`}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <img
                src={it.src}
                alt={it.caption}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
              <figcaption className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="text-[10px] uppercase tracking-[0.25em] text-accent">{it.tag}</div>
                <div className="mt-1 font-display text-lg leading-snug">{it.caption}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
