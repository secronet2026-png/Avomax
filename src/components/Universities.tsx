import { useEffect, useRef, useState } from "react";
import { UniversityExperience, type UniExperienceData } from "./UniversityExperience";
import { UniLogo } from "./UniLogo";
import cuBuilding from "@/assets/campuses/cu-building.jpeg";
import cuAero from "@/assets/campuses/cu-aero.jpeg";
import cuEvent from "@/assets/campuses/cu-event.jpeg";
import cgcBuilding from "@/assets/campuses/cgc-building.jpeg";
import cgcAthletics from "@/assets/campuses/cgc-athletics.jpeg";
import gdg1 from "@/assets/campuses/gdg-1.jpeg";
import gdg2 from "@/assets/campuses/gdg-2.jpeg";
import invertis1 from "@/assets/campuses/invertis-1.jpeg";
import invertis2 from "@/assets/campuses/invertis-2.jpeg";
import mmu1 from "@/assets/campuses/mmu-1.jpeg";
import mmu2 from "@/assets/campuses/mmu-2.jpeg";
import noida1 from "@/assets/campuses/noida-1.jpeg";
import noida2 from "@/assets/campuses/noida-2.jpeg";
import rimt1 from "@/assets/campuses/rimt-1.jpeg";
import rimt2 from "@/assets/campuses/rimt-2.jpeg";

import amityLogo from "@/assets/logos/amity.jpeg";
import cgcLogo from "@/assets/logos/cgc.jpeg";
import lincolnLogo from "@/assets/logos/lincoln.webp";
import amity1 from "@/assets/campuses/amity-1.jpeg";
import cgcSummit2 from "@/assets/campuses/cgc-summit-2.jpeg";
import sharda1 from "@/assets/campuses/sharda-1.jpeg";
import shoolini1 from "@/assets/campuses/shoolini-1.jpeg";
import sviet1 from "@/assets/campuses/sviet-1.jpeg";
import ct1 from "@/assets/campuses/ct-1.jpeg";
import saraswati1 from "@/assets/campuses/saraswati-1.jpeg";
import chandigarhLogo from "@/assets/logos/chandigarh.png";

const unis: UniExperienceData[] = [
  { name: "Chandigarh University", domain: "cuchd.in", logoUrl: chandigarhLogo, location: "Punjab, India", description: "Globally ranked private university with QS-rated programs and a vibrant international community.", courses: ["Engineering", "Business", "Computer Applications", "Law", "Media"], videoSrc: "/videos/study-abroad.mp4", campusImg: cuBuilding, gallery: [cuBuilding, cuAero, cuEvent] },
  { name: "Amity University", domain: "amity.edu", logoUrl: amityLogo, location: "Noida, India", description: "One of India's largest research-driven private universities with global campuses.", courses: ["Business", "Engineering", "Biotech", "Law", "Communication"], campusImg: amity1, gallery: [amity1] },
  { name: "Noida International University", domain: "niu.edu.in", location: "Noida, India", description: "Multi-disciplinary university focused on industry-aligned programs.", courses: ["MBA", "Engineering", "Pharmacy", "Nursing", "Arts"], campusImg: noida1, gallery: [noida1, noida2] },
  { name: "CGC Mohali", domain: "cgc.edu.in", logoUrl: cgcLogo, location: "Mohali, India", description: "Chandigarh Group of Colleges — strong placements across engineering and management.", courses: ["Engineering", "MBA", "Hotel Mgmt", "Computer Applications"], campusImg: cgcBuilding, gallery: [cgcBuilding, cgcAthletics, cgcSummit2] },
  { name: "Saraswati Group", domain: "sgi.ac.in", location: "Punjab, India", description: "A leading group of professional colleges across engineering and applied sciences.", courses: ["B.Tech", "MBA", "Polytechnic", "Pharmacy"], campusImg: saraswati1, gallery: [saraswati1] },
  { name: "Galgotias University", domain: "galgotiasuniversity.edu.in", location: "Greater Noida, India", description: "Modern campus with research labs, strong industry connections and scholarships.", courses: ["Engineering", "Law", "Business", "Liberal Arts"] },
  { name: "Invertis University", domain: "invertisuniversity.ac.in", location: "Bareilly, India", description: "Multi-disciplinary university with strong placement record.", courses: ["Engineering", "MBA", "Journalism", "Law"], campusImg: invertis2, gallery: [invertis2, invertis1] },
  { name: "Sharda University", domain: "sharda.ac.in", location: "Greater Noida, India", description: "International-focused university with students from 95+ countries.", courses: ["Medicine", "Dental", "Engineering", "Business", "Law"], campusImg: sharda1, gallery: [sharda1] },
  { name: "GD Goenka University", domain: "gdgoenkauniversity.com", location: "Gurugram, India", description: "Premium private university with global affiliations and modern campus.", courses: ["Business", "Hospitality", "Law", "Design", "Education"], campusImg: gdg1, gallery: [gdg1, gdg2] },
  { name: "Shoolini University", domain: "shooliniuniversity.com", location: "Solan, Himachal Pradesh", description: "Top research-ranked private university in India with global collaborations.", courses: ["Biotechnology", "Pharmacy", "Engineering", "Business"], campusImg: shoolini1, gallery: [shoolini1] },
  { name: "CT University", domain: "ctuniversity.in", location: "Ludhiana, Punjab", description: "Industry-oriented programs and strong international student support.", courses: ["Engineering", "Agriculture", "Hotel Mgmt", "Pharmacy"], campusImg: ct1, gallery: [ct1] },
  { name: "MIT World Peace University", domain: "mitwpu.edu.in", location: "Pune, India", description: "MIT-WPU — a values-driven research university with global outlook.", courses: ["Engineering", "Pharmacy", "Liberal Arts", "Management"] },
  { name: "MMU University", domain: "mmumullana.org", location: "Mullana, Haryana", description: "Maharishi Markandeshwar — known for medical, dental and engineering programs.", courses: ["MBBS", "BDS", "Engineering", "Pharmacy"], campusImg: mmu1, gallery: [mmu1, mmu2] },
  { name: "RIMT University", domain: "rimt.ac.in", location: "Punjab, India", description: "Multi-disciplinary university with global accreditation pathways.", courses: ["Engineering", "Law", "Business", "Health Sciences"], campusImg: rimt1, gallery: [rimt1, rimt2] },
  { name: "SVIET Group", domain: "sviet.ac.in", location: "Banur, Punjab", description: "Swami Vivekanand Institute — strong engineering, nursing and pharmacy.", courses: ["Engineering", "Nursing", "Pharmacy", "Polytechnic"], campusImg: sviet1, gallery: [sviet1] },
  { name: "Lincoln University Malaysia", domain: "lincoln.edu.my", logoUrl: lincolnLogo, location: "Petaling Jaya, Malaysia", description: "Internationally recognised Malaysian university with global accreditation.", courses: ["Medicine", "Business", "Engineering", "Pharmacy", "Nursing"], videoSrc: "/videos/students.mp4" },
];

export function Universities() {
  const [active, setActive] = useState<UniExperienceData | null>(null);
  const [tipOpen, setTipOpen] = useState(false);
  const [tipShown, setTipShown] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tipShown || !sectionRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTipOpen(true);
            setTipShown(true);
            io.disconnect();
            setTimeout(() => setTipOpen(false), 5500);
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, [tipShown]);

  return (
    <section id="universities" ref={sectionRef} className="relative py-28 overflow-hidden bg-background">
      <div className="container-px mx-auto max-w-[1500px]">
        <div className="flex items-end justify-between gap-6 reveal">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-[0.28em] text-accent">University Network</div>
            <h2 className="mt-4 font-display text-5xl md:text-6xl text-ink text-balance">
              Direct partnerships with{" "}
              <em className="not-italic text-primary">world-renowned institutions.</em>
            </h2>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-5">
          {unis.map((u) => (
            <button
              key={u.name}
              onClick={() => setActive(u)}
              className="group relative flex h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-card overflow-hidden hover:border-primary hover:shadow-[0_20px_50px_-15px_oklch(0.32_0.07_160/0.35)] hover:-translate-y-1 transition-all duration-500 p-4"
            >
              <div className="flex h-16 items-center justify-center w-full">
                <UniLogo domain={u.domain} logoUrl={u.logoUrl} name={u.name} className="max-h-14 max-w-[70%] object-contain transition-transform group-hover:scale-110" />
              </div>
              <div className="text-[11px] text-center text-muted-foreground font-medium line-clamp-1 px-2">
                {u.name}
              </div>
              <span className="absolute bottom-2 left-0 right-0 text-[10px] uppercase tracking-[0.22em] text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                View Profile →
              </span>
            </button>
          ))}
        </div>
      </div>

      {tipOpen && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-700">
          <div className="rounded-full bg-black/55 backdrop-blur-2xl px-5 py-2.5 text-[13px] font-medium tracking-tight text-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.25)] ring-1 ring-white/10">
            Tap any logo to open the campus profile
          </div>
        </div>
      )}

      <UniversityExperience uni={active} onClose={() => setActive(null)} />
    </section>
  );
}
