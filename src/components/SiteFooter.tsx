import { Link } from "@tanstack/react-router";
import logo from "@/assets/avomax-logo.png";
import { ADDRESS, EMAIL, INSTAGRAM, FACEBOOK, TIKTOK, WHATSAPP_CHANNEL, PHONES, wa } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-32 bg-ink text-primary-foreground">
      <div className="container-px mx-auto max-w-[1500px] py-20 grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-2 max-w-md">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-12 w-12 rounded-md bg-white/95 p-1" />
            <div>
              <div className="font-display text-2xl">AVOMAX</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/60">
                Global Consultancy Pvt. Ltd.
              </div>
            </div>
          </div>
          <p className="mt-6 text-white/65 leading-relaxed">
            International mobility, designed with care. From admissions to medical
            tourism, visas to airport pickup — every step, concierge-managed.
          </p>
          <a
            href={wa("Hello AVOMAX, I'd like to learn more.")}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:scale-[1.03] transition-transform"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-white/50">Explore</div>
          <ul className="mt-5 space-y-3 text-white/80">
            <li><Link to="/study-abroad" className="hover:text-white">Study Abroad</Link></li>
            <li><Link to="/medical" className="hover:text-white">Medical Tourism</Link></li>
            <li><Link to="/services" className="hover:text-white">Travel Services</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-white/50">Contact</div>
          <ul className="mt-5 space-y-3 text-white/80 text-sm">
            <li>{ADDRESS}</li>
            <li><a href={`mailto:${EMAIL}`} className="hover:text-white">{EMAIL}</a></li>
            {PHONES.map((p) => (
              <li key={p}><a href={`tel:${p.replace(/\s+/g, "")}`} className="hover:text-white">{p}</a></li>
            ))}
            <li className="pt-2 flex flex-wrap gap-x-4 gap-y-2">
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="hover:text-white">Instagram</a>
              <a href={FACEBOOK} target="_blank" rel="noreferrer" className="hover:text-white">Facebook</a>
              <a href={TIKTOK} target="_blank" rel="noreferrer" className="hover:text-white">TikTok</a>
              <a href={WHATSAPP_CHANNEL} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp Channel</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-px mx-auto max-w-[1500px] py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Avomax Global Consultancy Pvt. Ltd.</span>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/refund" className="hover:text-white">Refund</Link>
            <Link to="/cookies" className="hover:text-white">Cookies</Link>
            <Link to="/disclaimer" className="hover:text-white">Disclaimer</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
