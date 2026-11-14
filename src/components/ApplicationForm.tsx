import { useState } from "react";
import { wa } from "@/lib/site";
import { submitInquiry } from "@/lib/inquiryApi";

type FormData = {
  fullName: string;
  email: string;
  passportId: string;
  dob: string;
  nationality: string;
  phone: string;
  gender: string;
  maritalStatus: string;
  fatherName: string;
  fatherBirthplace: string;
  motherName: string;
  motherBirthplace: string;
  address: string;
  program: string;
  highSchool: string;
  destination: string;
  documents: string;
  notes: string;
};

const steps = ["Personal", "Family & Academic", "Submit"] as const;

const empty: FormData = {
  fullName: "", email: "", passportId: "", dob: "", nationality: "", phone: "",
  gender: "", maritalStatus: "", fatherName: "", fatherBirthplace: "",
  motherName: "", motherBirthplace: "", address: "", program: "",
  highSchool: "", destination: "", documents: "", notes: "",
};

export function ApplicationForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [submittedToCrm, setSubmittedToCrm] = useState(false);
  const [crmRefId, setCrmRefId] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const set = (k: keyof FormData, v: string) => setData((d) => ({ ...d, [k]: v }));

  const handleSubmitToCrm = async () => {
    setSubmitError(null);
    if (!data.fullName.trim()) {
      setSubmitError("Please fill out your Full Name.");
      setStep(0);
      return;
    }
    if (!data.email.trim() || !data.email.includes("@")) {
      setSubmitError("Please provide a valid Email Address.");
      setStep(0);
      return;
    }
    if (!data.phone.trim() || data.phone.length < 6) {
      setSubmitError("Please provide a valid Phone/WhatsApp number.");
      setStep(0);
      return;
    }

    setSubmitting(true);
    try {
      const combinedNotes = [
        data.notes ? `Applicant Notes: ${data.notes}` : "",
        data.fatherName ? `Father: ${data.fatherName} (Born: ${data.fatherBirthplace || 'N/A'})` : "",
        data.motherName ? `Mother: ${data.motherName} (Born: ${data.motherBirthplace || 'N/A'})` : "",
        data.documents ? `Academic Docs: ${data.documents}` : "",
      ].filter(Boolean).join(" | ");

      const res = await submitInquiry({
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        passport_id: data.passportId,
        date_of_birth: data.dob || undefined,
        nationality: data.nationality,
        gender: data.gender,
        marital_status: data.maritalStatus,
        address: data.address,
        program_of_interest: data.program || "Undergraduate Degree",
        destination_country: data.destination || "United Kingdom",
        high_school: data.highSchool,
        notes: combinedNotes,
        source: "website_application_form",
      });

      setCrmRefId(res.data?.id ? res.data.id.slice(0, 8).toUpperCase() : "AVX-" + Math.floor(1000 + Math.random() * 9000));
      setSubmittedToCrm(true);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to submit inquiry to CRM. You can still reach us via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const buildMessage = () =>
    `*New AVOMAX Application*%0A%0A` +
    `Full Name: ${data.fullName}%0A` +
    `Email: ${data.email}%0A` +
    `Passport/ID: ${data.passportId}%0A` +
    `Date of Birth: ${data.dob}%0A` +
    `Nationality: ${data.nationality}%0A` +
    `Phone: ${data.phone}%0A` +
    `Gender: ${data.gender}%0A` +
    `Marital Status: ${data.maritalStatus}%0A` +
    `Father's Name: ${data.fatherName}%0A` +
    `Father's Place of Birth: ${data.fatherBirthplace}%0A` +
    `Mother's Name: ${data.motherName}%0A` +
    `Mother's Place of Birth: ${data.motherBirthplace}%0A` +
    `Address: ${data.address}%0A` +
    `Program of Interest: ${data.program}%0A` +
    `High School: ${data.highSchool}%0A` +
    `Destination: ${data.destination}%0A` +
    `Documents: ${data.documents || "Will share after contact"}%0A` +
    `Notes: ${data.notes || "—"}`;

  const submitTo = (number: string) => {
    window.open(`https://wa.me/${number}?text=${buildMessage()}`, "_blank");
  };

  return (
    <section id="apply" className="relative py-28 bg-ink text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.32_0.07_160/0.4),transparent_60%)]" />
      <div className="absolute inset-0 grain opacity-30" />

      <div className="relative container-px mx-auto max-w-[1100px]">
        <div className="text-center reveal">
          <div className="text-xs uppercase tracking-[0.28em] text-accent">Begin Your Journey</div>
          <h2 className="mt-4 font-display text-5xl md:text-6xl text-balance">
            Premium application,{" "}
            <em className="not-italic bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent">
              one elegant form.
            </em>
          </h2>
          <p className="mt-5 max-w-xl mx-auto text-white/70">
            Tell us about you. Our concierge will respond within hours via WhatsApp.
          </p>
        </div>

        <div className="mt-14 rounded-3xl border border-white/15 bg-white/[0.04] backdrop-blur-2xl p-8 md:p-12 reveal">
          {/* Stepper */}
          <div className="flex items-center justify-center gap-4 mb-10 flex-wrap">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-full flex items-center justify-center font-display text-sm transition-all ${
                    i <= step ? "bg-gradient-to-br from-primary to-accent text-white" : "bg-white/10 text-white/50"
                  }`}
                >
                  {i + 1}
                </div>
                <span className={`text-xs uppercase tracking-[0.2em] ${i === step ? "text-white" : "text-white/40"}`}>
                  {label}
                </span>
                {i < steps.length - 1 && <div className="w-10 h-px bg-white/15" />}
              </div>
            ))}
          </div>

          {step === 0 && (
            <div className="grid md:grid-cols-2 gap-5 animate-fade-up">
              <Field label="Full Name" value={data.fullName} onChange={(v) => set("fullName", v)} placeholder="Jane Doe" />
              <Field label="Email" value={data.email} onChange={(v) => set("email", v)} placeholder="you@email.com" type="email" />
              <Field label="Passport / ID Number" value={data.passportId} onChange={(v) => set("passportId", v)} placeholder="ZW1234567" />
              <Field label="Date of Birth" value={data.dob} onChange={(v) => set("dob", v)} type="date" />
              <Field label="Nationality" value={data.nationality} onChange={(v) => set("nationality", v)} placeholder="Zimbabwean" />
              <Field label="Phone Number" value={data.phone} onChange={(v) => set("phone", v)} placeholder="+263 ..." />
              <Select label="Gender" value={data.gender} onChange={(v) => set("gender", v)} options={["", "Male", "Female", "Prefer not to say"]} />
              <Select label="Marital Status" value={data.maritalStatus} onChange={(v) => set("maritalStatus", v)} options={["", "Single", "Married", "Divorced", "Widowed"]} />
              <div className="md:col-span-2">
                <Field label="Student Address" value={data.address} onChange={(v) => set("address", v)} placeholder="Street, City, Country" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid md:grid-cols-2 gap-5 animate-fade-up">
              <Field label="Father's Name" value={data.fatherName} onChange={(v) => set("fatherName", v)} placeholder="John Doe" />
              <Field label="Father's Place of Birth" value={data.fatherBirthplace} onChange={(v) => set("fatherBirthplace", v)} placeholder="Harare, Zimbabwe" />
              <Field label="Mother's Name" value={data.motherName} onChange={(v) => set("motherName", v)} placeholder="Mary Doe" />
              <Field label="Mother's Place of Birth" value={data.motherBirthplace} onChange={(v) => set("motherBirthplace", v)} placeholder="Bulawayo, Zimbabwe" />
              <Field label="Program of Interest" value={data.program} onChange={(v) => set("program", v)} placeholder="MBBS, MBA, Engineering..." />
              <Field label="High School Name" value={data.highSchool} onChange={(v) => set("highSchool", v)} placeholder="Your high school" />
              <Field label="Preferred Destination" value={data.destination} onChange={(v) => set("destination", v)} placeholder="India, Malaysia..." />
              <Field label="Documents (O-Level / A-Level / Passport)" value={data.documents} onChange={(v) => set("documents", v)} placeholder="To be shared on WhatsApp" />
              <div className="md:col-span-2">
                <Field
                  label="Additional Notes"
                  value={data.notes}
                  onChange={(v) => set("notes", v)}
                  placeholder="Any specific questions or requirements"
                  textarea
                />
              </div>
              <p className="md:col-span-2 text-[11px] leading-relaxed text-white/55 border-t border-white/10 pt-5">
                All submitted academic and identification documents are securely processed
                solely for admission consultation, application facilitation, and university
                placement purposes. AVOMAX does not sell or misuse applicant data.
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="text-center animate-fade-up">
              {submittedToCrm ? (
                <div className="py-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-3xl mb-4">
                    ✓
                  </div>
                  <div className="text-xs uppercase tracking-[0.25em] text-accent">Application Received</div>
                  <h3 className="mt-2 font-display text-3xl md:text-4xl">
                    Thank you, {data.fullName}!
                  </h3>
                  <p className="mt-3 text-white/70 max-w-md mx-auto text-sm leading-relaxed">
                    Your details have been directly recorded in the AVOMAX Admissions Management System
                    under Reference <strong className="text-white font-mono bg-white/10 px-2 py-0.5 rounded">#{crmRefId}</strong>.
                    An admissions counselor has been notified.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto">
                    <a
                      href={wa(`Hello AVOMAX, I submitted an application on the website (Ref: #${crmRefId}) for ${data.program || 'admission'}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full sm:w-auto rounded-full bg-[#25D366] text-white px-7 py-3.5 font-medium hover:scale-[1.03] transition-transform inline-flex items-center justify-center gap-2"
                    >
                      Chat on WhatsApp Now
                    </a>
                    <button
                      onClick={() => {
                        setSubmittedToCrm(false);
                        setData(empty);
                        setStep(0);
                      }}
                      className="w-full sm:w-auto rounded-full bg-white/10 text-white/80 hover:bg-white/15 px-6 py-3.5 text-sm transition"
                    >
                      Submit Another Application
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-xs uppercase tracking-[0.25em] text-accent">Almost there</div>
                  <h3 className="mt-3 font-display text-3xl">Submit your application</h3>
                  <p className="mt-3 text-white/65 max-w-md mx-auto text-sm">
                    Submit your application directly to our CRM portal so an admissions counselor can begin processing your file immediately.
                  </p>

                  {submitError && (
                    <div className="mt-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-200 max-w-md mx-auto text-left">
                      {submitError}
                    </div>
                  )}

                  <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto justify-center">
                    <button
                      onClick={handleSubmitToCrm}
                      disabled={submitting}
                      className="rounded-full bg-gradient-to-r from-primary to-accent text-white px-8 py-4 font-semibold hover:scale-[1.03] transition-transform shadow-lg disabled:opacity-50"
                    >
                      {submitting ? "Submitting to CRM..." : "✓ Submit Directly to CRM Concierge"}
                    </button>
                    <button
                      onClick={() => submitTo("263780078824")}
                      className="rounded-full bg-[#25D366] text-white px-6 py-4 font-medium hover:scale-[1.03] transition-transform inline-flex items-center justify-center gap-2"
                    >
                      WhatsApp Direct
                    </button>
                  </div>

                  <div className="mt-6 text-xs text-white/40 space-y-1">
                    <div>Admissions Desk: +263 780 078 824</div>
                    <div>Harare Office: Karigamombe Centre, 11th Floor</div>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="text-sm text-white/60 hover:text-white disabled:opacity-30 transition-colors"
            >
              ← Back
            </button>
            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
                className="rounded-full bg-white text-ink px-7 py-3 font-medium hover:scale-[1.03] transition-transform"
              >
                Continue →
              </button>
            ) : (
              <a
                href={wa("Hello AVOMAX, continuing my application on WhatsApp.")}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Continue on WhatsApp →
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label, value, onChange, placeholder, type = "text", textarea,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={4}
          maxLength={1000}
          className="w-full rounded-xl bg-white/10 border border-white/25 focus:border-accent focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-accent px-4 py-3 text-white placeholder:text-slate-400 transition-colors"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={255}
          className="w-full rounded-xl bg-white/10 border border-white/25 focus:border-accent focus:bg-white/15 focus:outline-none focus:ring-1 focus:ring-accent px-4 py-3 text-white placeholder:text-slate-400 transition-colors"
        />
      )}
    </label>
  );
}

function Select({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.22em] text-emerald-300 font-semibold mb-1.5 block">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-[#0f231c] border border-white/25 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent px-4 py-3 text-white transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#0a1813] text-white">{o || "Select..."}</option>
        ))}
      </select>
    </label>
  );
}
