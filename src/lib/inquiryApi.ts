export type InquiryPayload = {
  full_name: string;
  email: string;
  phone: string;
  destination_country?: string;
  program_of_interest?: string;
  intake?: string;
  passport_id?: string;
  date_of_birth?: string;
  gender?: string;
  marital_status?: string;
  nationality?: string;
  high_school?: string;
  address?: string;
  notes?: string;
  heard_from?: string;
  source?: string;
};

const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const CRM_API_URL =
  (import.meta as any).env?.VITE_CRM_API_URL || (isLocalhost ? 'http://localhost:5001/api' : '/api');

export async function submitInquiry(payload: InquiryPayload) {
  const res = await fetch(`${CRM_API_URL}/inquiries`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      ...payload,
      source: payload.source || 'website'
    })
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMsg =
      json.error?.message ||
      json.message ||
      'Unable to submit inquiry right now. Please try again or chat with us on WhatsApp.';
    throw new Error(errorMsg);
  }

  return json;
}

