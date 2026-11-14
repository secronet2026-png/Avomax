import team from "@/assets/team.jpeg";
import founder from "@/assets/founder.jpeg";
import graduation from "@/assets/graduation.jpg";

export function SuccessStories() {
  return (
    <section className="container-px mx-auto max-w-[1500px] py-28">
      <div className="flex flex-col lg:flex-row items-end justify-between gap-6 reveal">
        <h2 className="font-display text-5xl md:text-6xl text-ink max-w-2xl text-balance">
          Real journeys. <em className="not-italic text-primary">Real impact.</em>
        </h2>
        <p className="max-w-sm text-muted-foreground">
          500+ students and patients have trusted Avomax to open doors across continents.
        </p>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-12">
        <figure className="lg:col-span-7 relative overflow-hidden rounded-2xl aspect-[16/10] reveal">
          <video
            src="/videos/students.mp4"
            poster={graduation}
            autoPlay muted loop playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <figcaption className="absolute bottom-8 left-8 right-8 text-white">
            <div className="text-xs uppercase tracking-[0.25em] text-white/70">Student Reel</div>
            <div className="mt-2 font-display text-3xl">International students thriving at Chandigarh University.</div>
          </figcaption>
        </figure>

        <figure className="lg:col-span-5 relative overflow-hidden rounded-2xl aspect-[16/10] reveal">
          <img src={team} alt="Avomax students with global brands backdrop" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
          <figcaption className="absolute bottom-6 left-6 right-6 text-white">
            <div className="text-xs uppercase tracking-[0.25em] text-white/70">Career Outcomes</div>
            <div className="mt-1 font-display text-2xl">Our alumni work with 2000+ global superbrands.</div>
          </figcaption>
        </figure>

        <figure className="lg:col-span-5 relative overflow-hidden rounded-2xl aspect-[4/5] reveal">
          <img src={founder} alt="Founder at international entrepreneurship conference" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
          <figcaption className="absolute bottom-6 left-6 right-6 text-white">
            <div className="text-xs uppercase tracking-[0.25em] text-white/70">Founder · Conference 2025</div>
            <div className="mt-1 font-display text-2xl">"Innovation beyond borders, empowering the next generation."</div>
          </figcaption>
        </figure>

        <figure className="lg:col-span-7 relative overflow-hidden rounded-2xl aspect-[16/10] reveal">
          <video
            src="/videos/study-abroad.mp4"
            autoPlay muted loop playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
          <figcaption className="absolute bottom-8 left-8 right-8 text-white">
            <div className="text-xs uppercase tracking-[0.25em] text-white/70">Study Abroad Reel</div>
            <div className="mt-2 font-display text-3xl">From application to arrival — one continuous experience.</div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
