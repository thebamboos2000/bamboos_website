import { siteUrl } from "@/config/env";
import { socialLinks } from "@/config/social";
import type { BusinessInfo, ContactInfo } from "@/types/domain";

type JsonLdObject = Record<string, unknown>;

/** Escapes `<` so build-time data can never close the script element. */
export function serialiseJsonLd(data: JsonLdObject): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: JsonLdObject }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialiseJsonLd(data) }}
    />
  );
}

/**
 * Only verified facts appear here, and Google requires a full address for this
 * type. Until the street address and PIN code are verified the block is omitted.
 */
export function buildVenueJsonLd(
  business: BusinessInfo,
  contact: ContactInfo,
  maximumAttendeeCapacity: number | null,
): JsonLdObject | null {
  const { streetAddress, postalCode, addressLocality, addressRegion, addressCountry } =
    business.address;

  if (!streetAddress || !postalCode) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EventVenue"],
    "@id": `${siteUrl}/#venue`,
    name: business.name,
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress,
      postalCode,
      addressLocality,
      addressRegion,
      addressCountry,
    },
    ...(contact.phoneE164 && { telephone: contact.phoneE164 }),
    ...(contact.email && { email: contact.email }),
    ...(business.geo && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },
    }),
    ...(business.googleMapsUrl && { hasMap: business.googleMapsUrl }),
    ...(business.openingHours && {
      openingHoursSpecification: business.openingHours.map((hours) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: hours.days.map((day) => dayNames[day]),
        opens: hours.opens,
        closes: hours.closes,
      })),
    }),
    ...(maximumAttendeeCapacity && { maximumAttendeeCapacity }),
    ...(socialLinks.length > 0 && { sameAs: socialLinks.map((link) => link.href) }),
  };
}

const dayNames = {
  Mo: "Monday",
  Tu: "Tuesday",
  We: "Wednesday",
  Th: "Thursday",
  Fr: "Friday",
  Sa: "Saturday",
  Su: "Sunday",
} as const;

export function buildBreadcrumbJsonLd(items: { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}
