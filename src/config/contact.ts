import type { ContactInfo } from "@/types/domain";

/**
 * Public business facts, deliberately not environment variables: they must be
 * reviewable in one place. Never add a value BAMBOOS has not confirmed.
 *
 * whatsappNumber: the official BAMBOOS WhatsApp Business number, with the country
 * code and digits only: no +, spaces or hyphens. While it is null, the site offers
 * no WhatsApp links, and `npm run check:launch` blocks a production release.
 */
export const contact: ContactInfo = {
  // From the venue's Google Maps listing, 9 November 2026. Confirm it with BAMBOOS.
  phoneE164: "+917592925757",
  whatsappNumber: "917592925757",
  email: null,
  enquiryHours: null,
};
