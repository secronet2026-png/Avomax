import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import founder from "@/assets/founder.jpeg";
import team from "@/assets/team.jpeg";
import { wa, INSTAGRAM } from "@/lib/site";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About AVOMAX — Global Consultancy Pvt. Ltd." },
      { name: "description", content: "AVOMAX is an international mobility company helping clients across Africa, India and beyond with study abroad, medical tourism and travel concierge." },
      { property: "og:title", content: "About AVOMAX" },
      { property: "og:description", content: "Founded to make international opportunity accessible — concierge mobility from Harare to the world." },
    ],
  }),
});

function About() {
  useReveal();
  return (
    <>
      <section className="pt-32 pb-20 container-px mx-auto max-w-[1500px]">
        <div className="text-xs uppercase tracking-[0.28em] text-accent">About Avomax</div>
        <h1 className="mt-5 font-display text-6xl md:text-8xl text-ink leading-[0.95] text-balance max-w-5xl">
          International opportunity <em className="not-italic text-primary">starts here.</em>
        </h1>
        <div className="mt-12 grid gap-12 lg:grid-cols-2 reveal">
          <p className="text-xl text-muted-foreground leading-relaxed">
            AVOMAX Global Consultancy Pvt. Ltd. is a premium international mobility
            company based in Harare, with active corridors across India, Malaysia,
            the UAE and Europe. We exist to make life-changing opportunities —
            education, healthcare, relocation — accessible, transparent and
            beautifully managed.
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Every Avomax journey is handled by a dedicated concierge: from the
            first conversation through admissions, medical bookings, visa,
            flights, airport pickup and arrival. One company. One promise. One
            seamless experience.
          </p>
        </div>
      </section>

      <section className="container-px mx-auto max-w-[1500px] pb-28 grid gap-6 lg:grid-cols-12">
        <figure className="lg:col-span-5 relative overflow-hidden rounded-2xl aspect-[4/5] reveal">
          <img src={founder} alt="Founder of Avomax Global Consultancy" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 to-transparent" />
          <figcaption className="absolute bottom-8 left-8 right-8 text-white">
            <div className="text-xs uppercase tracking-[0.25em] text-white/70">Founder</div>
            <div className="mt-2 font-display text-3xl">Leading from the front, on global stages.</div>
          </figcaption>
        </figure>
        <figure className="lg:col-span-7 relative overflow-hidden rounded-2xl aspect-[4/5] lg:aspect-[5/4] reveal">
          <img src={team} alt="Avomax students with global brand network" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
          <figcaption className="absolute bottom-8 left-8 right-8 text-white">
            <div className="text-xs uppercase tracking-[0.25em] text-white/70">Our Network</div>
            <div className="mt-2 font-display text-3xl">Students placed with 2000+ global superbrands.</div>
          </figcaption>
        </figure>
      </section>

      <section className="container-px mx-auto max-w-[1500px] pb-32 reveal">
        <div className="rounded-2xl bg-ink text-primary-foreground p-12 md:p-20 grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-accent">Talk to Us</div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl text-balance">
              Ready to begin? Our concierge is one message away.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href={wa("Hello AVOMAX, I'd like to begin my journey.")} target="_blank" rel="noreferrer"
              className="rounded-full bg-accent px-7 py-4 text-accent-foreground font-medium hover:scale-[1.03] transition-transform">
              WhatsApp Us
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer"
              className="rounded-full border border-white/30 px-7 py-4 text-white hover:bg-white/10 transition-colors">
              Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
