import type { BusinessInfo } from "@/types/domain";

/**
 * Public facts, collected on 9 November 2026 at the project owner's request.
 * Address: the venue's Google Maps listing, matching its BookMyMandap listing.
 * Location and map: Google Maps. Anything not found stays null (PROJECT_SCOPE.md section 8).
 */
export const business: BusinessInfo = {
  name: "BAMBOOS",
  legalName: null,
  category: "Auditorium, Wedding Venue and Event Destination",
  district: "Ernakulam",
  address: {
    streetAddress: "Pukkattupady–Kizhakkambalam Road, near Curry Chatti Family Restaurant, Pukkattupady",
    addressLocality: "Aluva",
    addressRegion: "Kerala",
    postalCode: "683562",
    addressCountry: "IN",
  },
  geo: { latitude: 10.0568624, longitude: 76.394549 },
  googleMapsUrl:
    "https://www.google.com/maps/place/The+Bamboos/@10.0568624,76.394549,17z/data=!4m6!3m5!1s0x3b080b4cb589350b:0x8d0e698e1d244b6d!8m2!3d10.0568624!4d76.394549",
  googleMapsEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.51449587845!2d76.394549!3d10.0568624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080b4cb589350b%3A0x8d0e698e1d244b6d!2sThe%20Bamboos!5e0!3m2!1sen!2sin!4v1794206448019!5m2!1sen!2sin",
  openingHours: null,
};
