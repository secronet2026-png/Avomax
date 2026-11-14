import { Link, useLocation } from "@tanstack/react-router";
import logo from "@/assets/avomax-logo.png";
import { wa } from "@/lib/site";
import { useEffect, useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/study-abroad", label: "Study Abroad" },
  { to: "/medical", label: "Medical Tourism" },
  { to: "/services", label: "Services" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const textColor = transparent ? "text-white" : "text-primary";
  const linkBase = transparent
    ? "text-white/85 hover:text-white"
    : "text-primary hover:text-primary/75";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        transparent
          ? "bg-transparent"
          : "bg-background/90 backdrop-blur-xl border-b border-border/60"
      }`}
    >
      <div className="container-px mx-auto flex h-20 max-w-[1500px] items-center justify-between">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="Avomax Global Consultancy" className="h-11 w-auto" />
          <div className="hidden sm:block leading-tight">
            <div className={`font-display text-lg tracking-tight ${textColor}`}>AVOMAX</div>
            <div className={`text-[10px] uppercase tracking-[0.22em] ${transparent ? "text-white/70" : "text-muted-foreground"}`}>
              Global Consultancy
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`text-sm transition-colors ${linkBase}`}
              activeProps={{ className: transparent ? "text-white font-medium" : "text-primary font-semibold" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:+263782457669"
            className={`hidden xl:inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-medium backdrop-blur transition-colors ${
              transparent
                ? "border-white/30 text-white hover:border-white"
                : "border-border bg-background/60 text-foreground hover:border-primary"
            }`}
          >
            📞 +263 780 078 824
          </a>
          <a
            href={wa("Hello AVOMAX, I'd like to make an inquiry.")}
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            WhatsApp Inquiry
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden flex h-10 w-10 items-center justify-center rounded-full border ${
              transparent ? "border-white/40 text-white" : "border-border text-primary"
            }`}
          >
            <span className="text-lg">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="container-px mx-auto py-6 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-base text-primary"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
