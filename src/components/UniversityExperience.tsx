import { useEffect } from "react";
import { X } from "lucide-react";
import { wa } from "@/lib/site";
import { UniLogo } from "./UniLogo";
import { galleryPool } from "@/lib/gallery";

const fallbackCampus = galleryPool[9].src;

export type UniExperienceData = {
  name: string;
  domain: string;
  logoUrl?: string;
  location: string;
  description: string;
  courses: string[];
  campusImg?: string;
  videoSrc?: string;
  scholarship?: string;
  accommodation?: string;
  gallery?: string[];
};

export function UniversityExperience({
  uni,
  onClose,
}: {
  uni: UniExperienceData | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!uni) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [uni, onClose]);

  if (!uni) return null;
  const campus = uni.campusImg || fallbackCampus;
  const reel = (uni.gallery && uni.gallery.length > 0 ? uni.gallery : [campus]).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute inset-0 bg-ink/70 backdrop-blur-md"
      />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-card text-ink shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] border border-border animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-white border border-border shadow-md transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header media */}
        <div className="relative h-[260px] md:h-[340px] w-full overflow-hidden rounded-t-3xl">
          {uni.videoSrc ? (
            <video src={uni.videoSrc} autoPlay muted loop playsInline poster={campus} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <img src={campus} alt={uni.name} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 text-white flex items-end gap-4">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-white/95 p-2 border border-white/30 shadow-xl">
              <UniLogo domain={uni.domain} logoUrl={uni.logoUrl} name={uni.name} className="h-full w-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.3em] text-accent">{uni.location}</div>
              <div className="mt-1 font-display text-3xl md:text-4xl leading-tight truncate">{uni.name}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 md:px-8 py-7 space-y-7">
          <p className="text-muted-foreground leading-relaxed">{uni.description}</p>

          <div className="grid sm:grid-cols-3 gap-3">
            <MiniCard title="Programs">
              <div className="flex flex-wrap gap-1.5">
                {uni.courses.slice(0, 5).map((c) => (
                  <span key={c} className="rounded-full bg-muted px-2.5 py-1 text-[11px] text-ink/80">{c}</span>
                ))}
              </div>
            </MiniCard>
            <MiniCard title="Scholarship">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {uni.scholarship || "Avomax-negotiated 20–50% scholarships for qualifying Zimbabwean students."}
              </p>
            </MiniCard>
            <MiniCard title="Accommodation">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {uni.accommodation || "On-campus & vetted private hostels pre-arranged before arrival."}
              </p>
            </MiniCard>
          </div>

          {reel.length > 0 && (
            <div className={`grid gap-3 ${reel.length === 1 ? "grid-cols-1" : reel.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
              {reel.map((src, i) => (
                <div key={i} className="relative aspect-[4/5] rounded-xl overflow-hidden">
                  <img src={src} alt={`${uni.name} ${i + 1}`} className="absolute inset-0 h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={wa(`I'd like to apply to ${uni.name}.`)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center rounded-full bg-gradient-to-r from-primary to-accent text-white px-6 py-3.5 font-medium hover:scale-[1.02] transition-transform shadow-[0_20px_50px_-15px_oklch(0.55_0.12_158/0.5)]"
            >
              Apply to {uni.name} →
            </a>
            <a
              href={wa(`Hello AVOMAX, I have questions about ${uni.name}.`)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 text-center rounded-full border border-border px-6 py-3.5 hover:bg-muted transition"
            >
              WhatsApp Inquiry
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="text-[10px] uppercase tracking-[0.28em] text-accent mb-2">{title}</div>
      {children}
    </div>
  );
}
