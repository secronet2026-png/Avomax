import { useState } from "react";
import { submitInquiry } from "@/lib/inquiryApi";
import { wa } from "@/lib/site";

export function InquiryForm({
  title = "Start Your Application & Inquiry",
  subtitle = "Fill in your details below and an AVOMAX global admissions counselor will review your profile and reach out within hours.",
  source = "contact_page",
  className = "",
}: {
  title?: string;
  subtitle?: string;
  source?: string;
  className?: string;
}) {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    parent_phone: "",
    destination_country: "United Kingdom",
    program_of_interest: "Medicine / MBBS",
    intake: "Fall 2026",
    notes: "",
    heard_from: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.full_name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 6) {
      setError("Please provide a valid telephone/WhatsApp number.");
      return;
    }

    setLoading(true);

    try {
      const res = await submitInquiry({
        ...formData,
        source,
      });

      setReferenceId(res.data?.id ? res.data.id.slice(0, 8).toUpperCase() : "AVX-" + Math.floor(1000 + Math.random() * 9000));
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit inquiry. Please reach out via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setReferenceId("");
    setFormData({
      full_name: "",
      email: "",
      phone: "",
      parent_phone: "",
      destination_country: "United Kingdom",
      program_of_interest: "Medicine / MBBS",
      intake: "Fall 2026",
      notes: "",
      heard_from: "",
    });
  };

  if (submitted) {
    return (
      <div
        style={{ backgroundColor: "#0a1813" }}
        className={`relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#0a1813] p-8 md:p-12 text-center text-white shadow-2xl ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.32_0.07_160/0.45),transparent_70%)] pointer-events-none" />

        <div className="relative z-10">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl mb-5 shadow-lg">
            ✓
          </div>
          <div className="text-xs uppercase tracking-[0.28em] text-emerald-400 font-bold">
            Inquiry Successfully Sent
          </div>
          <h3 className="mt-3 font-display text-3xl md:text-4xl text-white text-balance font-bold">
            Thank you, {formData.full_name}!
          </h3>
          <p className="mt-3 text-slate-200 max-w-md mx-auto text-sm leading-relaxed">
            Your admission enquiry has been directly lodged into our Admissions Management System
            under reference <strong className="text-emerald-300 font-mono bg-white/10 px-2 py-0.5 rounded border border-white/20">#{referenceId}</strong>.
            An assigned concierge counselor will contact you shortly.
          </p>

          {/* Highlighted Admission Fee Notice */}
          <div className="mt-6 max-w-lg mx-auto rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/15 border-2 border-amber-400/60 p-5 shadow-xl text-left backdrop-blur-md">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-lg flex-shrink-0">
                ⚠️
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                  Important Notice
                </div>
                <p className="mt-1 text-sm font-semibold text-white leading-relaxed">
                  Upon receiving your offer letter, you are required to pay the admission fee <span className="text-amber-300 underline underline-offset-4 font-bold">within 15 days</span> to secure your admission.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <a
              href={wa(`Hello AVOMAX, I just submitted an inquiry (Ref: #${referenceId}) for ${formData.program_of_interest} in ${formData.destination_country}.`)}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white px-6 py-3.5 text-sm font-semibold hover:scale-[1.02] transition-transform shadow-lg"
            >
              Chat with Counselor on WhatsApp
            </a>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto rounded-full bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 text-sm font-medium transition border border-white/15"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: "#0a1813" }}
      className={`relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-[#0a1813] p-8 md:p-12 text-white shadow-2xl ${className}`}
    >
      {/* Decorative ambient gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.32_0.07_160/0.45),transparent_70%)] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-700/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl">
        <div className="inline-block text-xs uppercase tracking-[0.28em] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
          Direct CRM Inquiry
        </div>
        <h2 className="mt-3 font-display text-3xl md:text-4xl text-white text-balance font-bold leading-tight">
          {title}
        </h2>
        <p className="mt-2 text-sm text-slate-200 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {error && (
        <div className="relative z-10 mt-6 rounded-xl bg-red-950/80 border border-red-500/50 p-4 text-xs text-red-100 flex items-start gap-3">
          <span className="text-red-400 font-bold text-sm">✕</span>
          <div className="flex-1">
            <p className="font-medium">{error}</p>
            <p className="mt-1 text-slate-300">
              You can also directly message us on{" "}
              <a href={wa("Hello AVOMAX, I would like to inquire about studying abroad.")} target="_blank" rel="noreferrer" className="underline text-emerald-300 font-medium">
                WhatsApp
              </a>.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative z-10 mt-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">
              Full Name <span className="text-emerald-400">*</span>
            </span>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => handleChange("full_name", e.target.value)}
              placeholder="e.g. Tendai Sibanda"
              className="w-full rounded-xl bg-white/10 border border-white/25 focus:border-emerald-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-colors"
            />
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">
              Email Address <span className="text-emerald-400">*</span>
            </span>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="tendai@example.com"
              className="w-full rounded-xl bg-white/10 border border-white/25 focus:border-emerald-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-colors"
            />
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">
              Phone / WhatsApp <span className="text-emerald-400">*</span>
            </span>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+263 7..."
              className="w-full rounded-xl bg-white/10 border border-white/25 focus:border-emerald-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-colors"
            />
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">
              Parent / Guardian Phone <span className="text-slate-400 font-normal lowercase">(optional)</span>
            </span>
            <input
              type="tel"
              value={formData.parent_phone}
              onChange={(e) => handleChange("parent_phone", e.target.value)}
              placeholder="+263 7..."
              className="w-full rounded-xl bg-white/10 border border-white/25 focus:border-emerald-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-colors"
            />
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">
              Preferred Country
            </span>
            <select
              value={formData.destination_country}
              onChange={(e) => handleChange("destination_country", e.target.value)}
              className="w-full rounded-xl bg-[#0f231c] border border-white/25 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 px-4 py-3 text-sm text-white transition-colors"
            >
              <option value="United Kingdom" className="bg-[#0a1813] text-white">United Kingdom</option>
              <option value="India" className="bg-[#0a1813] text-white">India</option>
              <option value="Malaysia" className="bg-[#0a1813] text-white">Malaysia</option>
              <option value="Canada" className="bg-[#0a1813] text-white">Canada</option>
              <option value="Australia" className="bg-[#0a1813] text-white">Australia</option>
              <option value="Germany" className="bg-[#0a1813] text-white">Germany</option>
              <option value="Cyprus" className="bg-[#0a1813] text-white">Cyprus</option>
              <option value="Poland" className="bg-[#0a1813] text-white">Poland</option>
              <option value="Other" className="bg-[#0a1813] text-white">Other</option>
            </select>
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">
              Preferred Intake
            </span>
            <select
              value={formData.intake}
              onChange={(e) => handleChange("intake", e.target.value)}
              className="w-full rounded-xl bg-[#0f231c] border border-white/25 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 px-4 py-3 text-sm text-white transition-colors"
            >
              <option value="Fall 2026" className="bg-[#0a1813] text-white">Fall 2026</option>
              <option value="Spring 2027" className="bg-[#0a1813] text-white">Spring 2027</option>
              <option value="Summer 2027" className="bg-[#0a1813] text-white">Summer 2027</option>
              <option value="Immediate" className="bg-[#0a1813] text-white">Immediate Available</option>
            </select>
          </label>
        </div>

        <div>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">
              Program or Course of Interest
            </span>
            <input
              type="text"
              value={formData.program_of_interest}
              onChange={(e) => handleChange("program_of_interest", e.target.value)}
              placeholder="e.g. MBBS, Computer Science, MBA, Nursing, Aviation"
              className="w-full rounded-xl bg-white/10 border border-white/25 focus:border-emerald-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-colors"
            />
          </label>
        </div>

        <div>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">
              Questions / Qualifications / Notes
            </span>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Tell us about your current academic level, budget, or specific university preferences..."
              className="w-full rounded-xl bg-white/10 border border-white/25 focus:border-emerald-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-colors"
            />
          </label>
        </div>

        <div>
          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">
              Where did you hear about us?
            </span>
            <input
              type="text"
              value={formData.heard_from}
              onChange={(e) => handleChange("heard_from", e.target.value)}
              placeholder="e.g. Instagram, Friend recommendation, TikTok, Facebook, Google, School event..."
              className="w-full rounded-xl bg-white/10 border border-white/25 focus:border-emerald-400 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 px-4 py-3 text-sm text-white placeholder:text-slate-400 transition-colors"
            />
          </label>
        </div>

        {/* Highlighted Policy Notice */}
        <div className="rounded-xl bg-amber-500/10 border border-amber-400/30 p-3.5 flex items-start gap-3 text-left">
          <span className="text-amber-300 text-base flex-shrink-0" aria-hidden="true">⚠️</span>
          <p className="text-xs text-amber-100/90 leading-relaxed">
            <strong className="text-amber-300 font-semibold">Important:</strong> Upon receiving your offer letter, you are required to pay the admission fee within 15 days to secure your admission.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            Data is securely routed to our admissions CRM. An educational counselor will contact you strictly for advisory purposes.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white px-8 py-4 font-bold text-sm hover:scale-[1.02] shadow-xl shadow-black/40 transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <span className="animate-spin text-lg">◌</span>
                Submitting to CRM...
              </>
            ) : (
              <>
                Send Inquiry to Admissions Concierge →
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
