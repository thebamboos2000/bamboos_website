/**
 * WhatsApp's documented click-to-chat format: https://wa.me/<number>?text=<url-encoded text>
 * https://faq.whatsapp.com/5913398998672934
 */

/** A design budget, not a documented WhatsApp limit. See API_DESIGN.md section 2.3. */
export const MAX_WHATSAPP_URL_LENGTH = 4000;

export function normaliseWhatsAppNumber(number: string): string {
  return number.replace(/\D/g, "").replace(/^0+/, "");
}

export function buildWhatsAppUrl(number: string, text?: string): string {
  const base = `https://wa.me/${normaliseWhatsAppNumber(number)}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const GENERAL_ENQUIRY_TEXT = "Hello BAMBOOS, I would like to know more about the venue.";
