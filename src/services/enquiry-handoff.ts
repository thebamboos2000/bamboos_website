import { eventTypeLabel } from "@/config/event-types";
import type { Enquiry } from "@/schemas/enquiry";
import { buildWhatsAppUrl, MAX_WHATSAPP_URL_LENGTH, normaliseWhatsAppNumber } from "./whatsapp";

export type EnquiryHandoff =
  | { ok: true; url: string; message: string }
  | { ok: false; reason: "whatsapp-not-configured" | "message-too-long"; message: string };

/** WhatsApp shows text between asterisks in bold. */
export const ENQUIRY_DETAILS_HEADING = "*EVENT ENQUIRY DETAILS*";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function formatEnquiryDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

export function formatEnquiryMessage(enquiry: Enquiry): string {
  const details = [
    ENQUIRY_DETAILS_HEADING,
    `Name: ${enquiry.name}`,
    `Phone: ${enquiry.phone}`,
    `Event Type: ${eventTypeLabel(enquiry.eventType)}`,
    `Preferred Date: ${formatEnquiryDate(enquiry.preferredDate)}`,
    `Expected Guests: ${enquiry.guestCount}`,
  ].join("\n");

  return [
    "Hello BAMBOOS Team!",
    "I would like to enquire about hosting an event at your auditorium.",
    details,
    enquiry.message && `Additional Message:\n${enquiry.message}`,
    "Please share the availability, packages and further details.",
    "Thank you!",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export function prepareEnquiryHandoff(
  enquiry: Enquiry,
  whatsappNumber: string | null,
): EnquiryHandoff {
  const message = formatEnquiryMessage(enquiry);

  if (!whatsappNumber || normaliseWhatsAppNumber(whatsappNumber).length < 8) {
    return { ok: false, reason: "whatsapp-not-configured", message };
  }

  const url = buildWhatsAppUrl(whatsappNumber, message);

  // Encoded length matters: Malayalam text grows about 9x when URL-encoded.
  if (url.length > MAX_WHATSAPP_URL_LENGTH) {
    return { ok: false, reason: "message-too-long", message };
  }

  return { ok: true, url, message };
}
