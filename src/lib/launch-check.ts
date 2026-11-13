import type { BusinessInfo, ContactInfo, Facility, GalleryItem, Venue, Visual } from "@/types/domain";

/** Reserved frames and stock photographs both stand in for real BAMBOOS photography. */
export function isPlaceholderVisual(visual: Visual): boolean {
  return visual.kind === "pending" || visual.asset.illustrative === true;
}

/** International format for click-to-chat links: country code and digits only. */
export const WHATSAPP_NUMBER_FORMAT = /^[1-9]\d{7,14}$/;

export interface LaunchFacts {
  business: BusinessInfo;
  contact: ContactInfo;
  venue: Venue;
  facilities: Facility[];
  gallery: GalleryItem[];
  celebrationPendingVisuals: number;
  siteUrl: string;
  /** The local switch that shows venue photographs which aren't cleared for publication. */
  venuePhotoPreview?: boolean;
}

/** Lists everything that must be verified or supplied before a production launch. */
export function findLaunchBlockers(facts: LaunchFacts): string[] {
  const { business, contact, venue, facilities, gallery } = facts;
  const blockers: string[] = [];
  const require = (value: unknown, label: string) => {
    if (value === null || value === undefined || value === "") blockers.push(label);
  };

  require(business.legalName, "Legal or trading name");
  require(business.address.streetAddress, "Street address");
  require(business.address.postalCode, "PIN code");
  require(business.googleMapsUrl, "Google Maps link");
  require(contact.phoneE164, "Primary phone number");
  require(contact.whatsappNumber, "WhatsApp number");
  if (contact.whatsappNumber && !WHATSAPP_NUMBER_FORMAT.test(contact.whatsappNumber)) {
    blockers.push("WhatsApp number format: country code and digits only, with no +, spaces or hyphens");
  }
  require(contact.enquiryHours, "Enquiry response hours");

  if (venue.halls.length === 0) blockers.push("Hall details");
  for (const spec of venue.specs) {
    if (spec.requiredForLaunch) require(spec.value, spec.label);
  }
  for (const facility of facilities) {
    if (facility.requiredForLaunch) require(facility.description, `Facility: ${facility.name}`);
  }

  const visuals = [
    venue.heroVisual,
    venue.houseVisuals.main,
    venue.houseVisuals.accent,
    venue.houseVisuals.tall,
    venue.storyVisual,
    venue.auditoriumVisuals.main,
    venue.auditoriumVisuals.detail,
    venue.auditoriumVisuals.tall,
    venue.locationVisual,
    ...Object.values(venue.closing),
    venue.pageVisuals.events,
    venue.pageVisuals.venue,
    venue.pageVisuals.facilities,
    venue.pageVisuals.contact,
    ...facilities.flatMap((facility) => (facility.visual ? [facility.visual] : [])),
  ];
  const pendingVenueVisuals = visuals.filter(isPlaceholderVisual).length;
  const pendingGallery = gallery.filter(
    (item) => item.kind === "visual" && isPlaceholderVisual(item.visual),
  ).length;
  const pending = pendingVenueVisuals + pendingGallery + facts.celebrationPendingVisuals;
  if (pending > 0) blockers.push(`${pending} placeholder images still need real BAMBOOS photography`);

  if (facts.venuePhotoPreview) blockers.push("Venue photo preview is on: unconfirmed photographs would publish");

  if (facts.siteUrl.includes("localhost")) blockers.push("Production domain (NEXT_PUBLIC_SITE_URL)");

  return blockers;
}
