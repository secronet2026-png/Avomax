import { useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const reels = [
  { src: "/videos/arrival.mp4", title: "Arrival Experience", sub: "From airport to dorm" },
  { src: "/videos/culture.mp4", title: "Campus Culture", sub: "Independence celebrations" },
  { src: "/videos/graduation.mp4", title: "Graduation Day", sub: "A global career begins" },
  { src: "/videos/departure.mp4", title: "Departure From Harare", sub: "The journey starts here" },
];

export function CampusReels() {
  return (
    <section className="relative py-28 overflow-hidden bg-background">
      <div className="container-px mx-auto max-w-[1500px]">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 reveal">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.28em] text-accent">Campus Reels</div>
            <h2 className="mt-4 font-display text-5xl md:text-6xl text-ink text-balance">
              Real students. <em className="not-italic text-primary">Real moments.</em>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground">
            Tap any reel to step into the lifestyle our students live every day.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mx-auto max-w-[1200px]">
          {reels.map((r, i) => (
            <Reel key={i} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Reel({ src, title, sub }: { src: string; title: string; sub: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <button
      onClick={toggle}
      className="group relative aspect-[9/16] overflow-hidden rounded-3xl border border-border bg-ink hover:shadow-[0_30px_80px_-20px_oklch(0.32_0.07_160/0.5)] hover:-translate-y-1 transition-all duration-500"
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 flex items-center justify-center opacity-90 group-hover:opacity-100 group-hover:scale-110 transition">
        {playing ? <Pause className="h-6 w-6 text-white" /> : <Play className="h-6 w-6 text-white ml-1" />}
      </div>

      <div className="absolute bottom-4 left-4 right-4 text-left">
        <div className="font-display text-xl text-white">{title}</div>
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/70 mt-1">{sub}</div>
      </div>
    </button>
  );
}
