export const WHATSAPP_ZW = "https://wa.me/263780078824";
export const WHATSAPP_IN = "https://wa.me/917011978890";
export const WHATSAPP = WHATSAPP_ZW; // backwards-compat default

export const wa = (msg: string) => `${WHATSAPP_ZW}?text=${encodeURIComponent(msg)}`;
export const waOffice = (office: "zw" | "in", msg: string) =>
  `${office === "zw" ? WHATSAPP_ZW : WHATSAPP_IN}?text=${encodeURIComponent(msg)}`;

export const PHONES = [
  "+263 780 078 824",
  "+91 7011 978 890",
  "+91 8580 781 871",
   "+258 871 580 267",
];
export const EMAIL = "avomaxadmission@gmail.com";
export const ADDRESS = "53 Samora Machel Avenue, Karigamombe Center, 11th Floor, Harare";
export const INSTAGRAM = "https://www.instagram.com/avomax_global_consultancy";
export const FACEBOOK = "https://www.facebook.com/avomaxglobalconsultancy";
export const TIKTOK = "https://tiktok.com/@avomax_consultancy24";
export const WHATSAPP_CHANNEL = "https://whatsapp.com/channel/0029VaR7TbJ0wajudmXxO00v";
export const COMPANY = "AVOMAX GLOBAL CONSULTANCY PVT LTD";
