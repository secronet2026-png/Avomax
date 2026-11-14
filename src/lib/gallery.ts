import graduates from "@/assets/gallery/graduates.jpeg";
import arrivalsBanner from "@/assets/gallery/arrivals-banner.jpeg";
import admissionsOffice from "@/assets/gallery/admissions-office.jpeg";
import airportArrival from "@/assets/gallery/airport-arrival.jpeg";
import founderConference from "@/assets/gallery/founder-conference.jpeg";
import airportPickup from "@/assets/gallery/airport-pickup.jpeg";
import studentPortrait from "@/assets/gallery/student-portrait.jpeg";
import teamTshirts from "@/assets/gallery/team-tshirts.jpeg";
import indiaAfrica from "@/assets/gallery/india-africa.jpeg";
import teamGroup from "@/assets/gallery/team-group.jpeg";

/** Single source of truth — never reuse the same image until all have appeared. */
export const galleryPool = [
  { src: studentPortrait, label: "Student Portrait" },
  { src: teamTshirts, label: "Avomax Team" },
  { src: airportPickup, label: "Airport Pickup" },
  { src: graduates, label: "Graduation Day" },
  { src: admissionsOffice, label: "Admissions Office" },
  { src: arrivalsBanner, label: "Arrival Banner" },
  { src: indiaAfrica, label: "India ↔ Africa" },
  { src: airportArrival, label: "Airport Arrival" },
  { src: founderConference, label: "Founder Conference" },
  { src: teamGroup, label: "Student Team" },
];

/** Pick n unique images starting at offset, wrapping around. */
export function pickGallery(offset: number, n: number) {
  const out: typeof galleryPool = [];
  const len = galleryPool.length;
  for (let i = 0; i < n; i++) out.push(galleryPool[(offset + i) % len]);
  return out;
}
