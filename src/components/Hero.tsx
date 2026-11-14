import { useEffect, useRef } from "react";
import { wa } from "@/lib/site";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  // subtle parallax
  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const y = window.scrollY;
      ref.current.style.setProperty("--py", `${y * 0.18}px`);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden bg-black text-white">
      {/* Cinematic background video */}
      <video
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-[120%] w-full object-cover"
        style={{ transform: "translateY(calc(var(--py, 0px) * -1))" }}
      />

      {/* Luxury dark overlay stack */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/45 to-black/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.32_0.07_160/0.45),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.55_0.12_158/0.25),transparent_60%)]" />
      <div className="absolute inset-0 grain opacity-40 mix-blend-overlay" />

      <div className="relative container-px mx-auto max-w-[1500px] pt-32 pb-20 grid lg:grid-cols-12 gap-10 min-h-[100svh]">
        <div className="lg:col-span-7 flex flex-col justify-center">

          <h1 className="mt-8 font-display text-[clamp(3rem,8vw,7.5rem)] leading-[0.92] tracking-tight text-white text-balance animate-fade-up">
            Unlock global
            <br />
            opportunities{" "}
            <em className="not-italic bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent">
              without limits.
            </em>
          </h1>

          <p
            className="mt-8 max-w-xl text-lg text-white/75 leading-relaxed animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            Study abroad admissions, medical tourism, visa support, travel assistance
            and global consultancy — delivered as one seamless, concierge-managed experience.
          </p>

          <div
            className="mt-10 flex flex-wrap gap-3 animate-fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            <a
              href={wa("I'd like to apply for Study Abroad through AVOMAX.")}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-7 py-4 text-primary-foreground font-medium shadow-[0_8px_40px_-8px_oklch(0.32_0.07_160/0.6)] hover:scale-[1.03] transition-transform"
            >
              Apply for Study Abroad
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="https://wa.me/263780078824?text=Hello%20AVOMAX%2C%20I'd%20like%20to%20chat."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 backdrop-blur-xl px-7 py-4 text-white hover:bg-white/10 transition-colors"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
              WhatsApp Inquiry
            </a>
            <a
              href="tel:+263780078824"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 backdrop-blur-xl px-7 py-4 text-white hover:bg-white/10 transition-colors"
            >
              📞 Zimbabwe · +263 780 078 824
            </a>
          </div>

          <dl
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 max-w-2xl animate-fade-up"
            style={{ animationDelay: "0.5s" }}
          >
            {[
              ["2500+", "Success Students"],
              ["25+", "Partner Universities"],
              ["15", "Premier Hospitals"],
              ["10", "Global Destinations"],
            ].map(([n, l]) => (
              <div key={l} className="border-l border-white/20 pl-4">
                <dt className="font-display text-3xl text-white">{n}</dt>
                <dd className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/55">{l}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Floating glassmorphism panels */}
        <div className="lg:col-span-5 relative hidden lg:flex items-center justify-end">
          <div className="relative w-full max-w-[520px] grid grid-cols-2 gap-4">
            <div className="space-y-4 animate-float" style={{ animationDelay: "0s" }}>
              <FloatFrame>
                <video src="/videos/study-abroad.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
                <Caption label="Now boarding" title="Study abroad reel" />
              </FloatFrame>
              <FloatFrame square accent>
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-white/70">Live</div>
                  <div className="font-display text-xl leading-tight text-white">
                    Fast-track visa assistance — Harare to anywhere.
                  </div>
                </div>
              </FloatFrame>
            </div>
            <div className="space-y-4 pt-12 animate-float" style={{ animationDelay: "1.5s" }}>
              <FloatFrame square>
                <video src="/videos/medical.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
                <Caption label="Medical" title="Top hospital network" />
              </FloatFrame>
              <FloatFrame>
                <video src="/videos/students.mp4" autoPlay muted loop playsInline className="h-full w-full object-cover" />
                <Caption label="Students" title="Thriving globally" />
              </FloatFrame>
            </div>
          </div>
        </div>
      </div>

      {/* bottom fade into next section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}

function FloatFrame({
  children,
  square,
  accent,
}: {
  children: React.ReactNode;
  square?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] ${
        square ? "aspect-square" : "aspect-[3/4]"
      } ${accent ? "bg-gradient-to-br from-primary/80 to-accent/60" : ""}`}
    >
      {children}
    </div>
  );
}

function Caption({ label, title }: { label: string; title: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
      <div className="text-[9px] uppercase tracking-[0.28em] text-white/70">{label}</div>
      <div className="font-display text-base text-white">{title}</div>
    </div>
  );
}
