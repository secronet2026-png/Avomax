import { createFileRoute } from "@tanstack/react-router";
import { useReveal } from "@/hooks/use-reveal";
import { ADDRESS, EMAIL, PHONES, wa, INSTAGRAM } from "@/lib/site";
import { InquiryForm } from "@/components/InquiryForm";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact AVOMAX — Harare Office, WhatsApp & Global Lines" },
      { name: "description", content: "Reach AVOMAX Global Consultancy in Harare. WhatsApp, phone lines across Zimbabwe and India, and our Karigamombe Centre office." },
      { property: "og:title", content: "Contact AVOMAX Global Consultancy" },
      { property: "og:description", content: "Talk to our global concierge — Harare, India, and worldwide." },
    ],
  }),
});

function ContactPage() {
  useReveal();
  return (
    <div className="pt-32">
      <section className="container-px mx-auto max-w-[1500px] pb-20">
        <div className="max-w-3xl reveal">
          <div className="text-xs uppercase tracking-[0.28em] text-accent">Get In Touch</div>
          <h1 className="mt-5 font-display text-6xl md:text-7xl text-ink leading-[0.95] text-balance">
            Let's begin your <em className="not-italic text-primary">global journey.</em>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl">
            Speak with a concierge today. We respond to every enquiry — by WhatsApp,
            phone or email — within a few hours.
          </p>
          <a
            href={wa("Hello AVOMAX, I'd like to make a new enquiry.")}
            target="_blank" rel="noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-[#25D366] px-8 py-4 text-white font-medium hover:scale-[1.03] transition-transform"
          >
            Chat on WhatsApp — +263 780 078 824
          </a>
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-3 reveal">
          <div className="border-t border-border pt-8">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Head Office</div>
            <p className="mt-4 font-display text-2xl text-ink leading-snug">{ADDRESS}</p>
          </div>
          <div className="border-t border-border pt-8">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Email</div>
            <a href={`mailto:${EMAIL}`} className="mt-4 block font-display text-2xl text-primary hover:underline">
              {EMAIL}
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm text-muted-foreground hover:text-primary">
              @avomax_global_consultancy
            </a>
          </div>
          <div className="border-t border-border pt-8">
            <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Direct Lines</div>
            <ul className="mt-4 space-y-2">
              {PHONES.map((p) => (
                <li key={p}>
                  <a href={`tel:${p.replace(/\s+/g, "")}`} className="font-display text-2xl text-ink hover:text-primary transition-colors">
                    {p}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-20 reveal">
          <InquiryForm
            title="Send an Admissions Inquiry"
            subtitle="Connect with our Harare and global concierge team. All inquiries are directly assigned to an educational counselor."
            source="contact_page"
          />
        </div>

        <div className="mt-20 overflow-hidden rounded-2xl aspect-[16/9] border border-border reveal">
          <iframe
            title="Avomax Office Location"
            src="https://www.google.com/maps?q=Karigamombe+Centre+Samora+Machel+Avenue+Harare&output=embed"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </div>
  );
}
