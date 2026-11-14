import { useEffect } from "react";
import { X } from "lucide-react";
import { waOffice } from "@/lib/site";

export type OfficeContext = {
  zw: string;
  in: string;
};

const DEFAULT_CTX: OfficeContext = {
  zw: "Hello AVOMAX Zimbabwe Office, I would like guidance about studying abroad.",
  in: "Hello AVOMAX India Office, I need admission processing assistance.",
};

export function WhatsAppOfficeModal({
  open,
  onClose,
  context = DEFAULT_CTX,
}: {
  open: boolean;
  onClose: () => void;
  context?: OfficeContext;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-md"
      />
      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-white/15 bg-white/[0.08] backdrop-blur-2xl p-7 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] text-white animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-[10px] uppercase tracking-[0.3em] text-accent">Concierge</div>
        <h3 className="mt-2 font-display text-3xl leading-tight">Choose your support office</h3>
        <p className="mt-2 text-sm text-white/65">
          Connect directly with the team closest to your journey.
        </p>

        <div className="mt-6 grid gap-3">
          <OfficeCard
            flag="🇿🇼"
            title="Zimbabwe Office"
            phone="+263 780 078 824"
            sub="Local student guidance & consultation"
            href={waOffice("zw", context.zw)}
            label="Chat Zimbabwe Office"
          />
          <OfficeCard
            flag="🇮🇳"
            title="India Office"
            phone="+91 7011 978 890"
            sub="Admissions processing & university coordination"
            href={waOffice("in", context.in)}
            label="Chat India Office"
          />
        </div>
      </div>
    </div>
  );
}

function OfficeCard({
  flag,
  title,
  phone,
  sub,
  href,
  label,
}: {
  flag: string;
  title: string;
  phone: string;
  sub: string;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/25 p-4 transition-all"
    >
      <div className="text-3xl shrink-0">{flag}</div>
      <div className="min-w-0 flex-1">
        <div className="font-display text-lg leading-tight">{title}</div>
        <div className="text-xs text-white/55 mt-0.5">{phone}</div>
        <div className="text-[11px] text-white/45 mt-1">{sub}</div>
      </div>
      <div className="shrink-0 rounded-full bg-[#25D366] text-white text-xs font-medium px-3.5 py-2 group-hover:scale-105 transition-transform">
        {label.split(" ")[0]} →
      </div>
    </a>
  );
}
