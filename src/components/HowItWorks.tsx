const steps = [
  { n: "01", t: "Contact AVOMAX", d: "Reach out via WhatsApp, phone or email. We respond within hours." },
  { n: "02", t: "Receive Consultation", d: "Personalised pathway built around your goals and budget." },
  { n: "03", t: "Submit Documents", d: "We prepare, verify and submit every application document." },
  { n: "04", t: "Get Approval", d: "Admission letter, medical clearance or visa — secured for you." },
  { n: "05", t: "Travel Successfully", d: "Flights booked, accommodation reserved, airport pickup arranged." },
];

export function HowItWorks() {
  return (
    <section className="container-px mx-auto max-w-[1500px] py-28">
      <div className="max-w-2xl reveal">
        <div className="text-xs uppercase tracking-[0.28em] text-accent">The Avomax Journey</div>
        <h2 className="mt-4 font-display text-5xl md:text-6xl text-ink text-balance">
          A five-step path, <em className="not-italic text-primary">handled end-to-end.</em>
        </h2>
      </div>

      <div className="mt-20 relative">
        <div className="absolute left-0 right-0 top-[44px] hidden md:block h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="grid gap-10 md:grid-cols-5">
          {steps.map((s, i) => (
            <div key={s.n} className="reveal" style={{ transitionDelay: `${i * 90}ms` }}>
              <div className="flex items-center justify-center md:justify-start">
                <span className="relative z-10 flex h-[88px] w-[88px] items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-2xl">
                  {s.n}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl text-ink">{s.t}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
