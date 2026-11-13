import { describe, expect, it } from "vitest";
import type { BusinessInfo, ContactInfo } from "@/types/domain";
import { buildBreadcrumbJsonLd, buildVenueJsonLd, serialiseJsonLd } from "./json-ld";
import { buildMetadata } from "./metadata";

const unverified: BusinessInfo = {
  name: "BAMBOOS",
  legalName: null,
  category: "Auditorium",
  district: "Ernakulam",
  address: {
    streetAddress: null,
    addressLocality: "Aluva",
    addressRegion: "Kerala",
    postalCode: null,
    addressCountry: "IN",
  },
  geo: null,
  googleMapsUrl: null,
  googleMapsEmbedUrl: null,
  openingHours: null,
};

const noContact: ContactInfo = {
  phoneE164: null,
  whatsappNumber: null,
  email: null,
  enquiryHours: null,
};

const withAddress: BusinessInfo = {
  ...unverified,
  address: { ...unverified.address, streetAddress: "Test Road", postalCode: "000000" },
};

describe("buildVenueJsonLd", () => {
  it("is omitted entirely until the full address is verified", () => {
    expect(buildVenueJsonLd(unverified, noContact, null)).toBeNull();
  });

  it("contains only verified properties", () => {
    const data = buildVenueJsonLd(withAddress, noContact, null);
    expect(data).toMatchObject({ "@type": ["LocalBusiness", "EventVenue"], name: "BAMBOOS" });
    for (const key of ["telephone", "email", "geo", "openingHoursSpecification", "maximumAttendeeCapacity", "aggregateRating"]) {
      expect(data).not.toHaveProperty(key);
    }
  });

  it("adds verified optional properties", () => {
    const data = buildVenueJsonLd(
      {
        ...withAddress,
        geo: { latitude: 1, longitude: 2 },
        openingHours: [{ days: ["Mo", "Su"], opens: "09:00", closes: "18:00" }],
      },
      { ...noContact, phoneE164: "+910000000000" },
      250,
    );
    expect(data).toMatchObject({
      telephone: "+910000000000",
      maximumAttendeeCapacity: 250,
      geo: { latitude: 1, longitude: 2 },
      openingHoursSpecification: [{ dayOfWeek: ["Monday", "Sunday"] }],
    });
  });
});

describe("serialiseJsonLd", () => {
  it("can't close the script element", () => {
    const output = serialiseJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(output).not.toContain("<");
    expect(JSON.parse(output).name).toBe("</script><script>alert(1)</script>");
  });
});

describe("buildBreadcrumbJsonLd", () => {
  it("numbers items in order", () => {
    const data = buildBreadcrumbJsonLd([
      { name: "Home", path: "" },
      { name: "Events", path: "/celebrations" },
    ]);
    expect(data.itemListElement).toMatchObject([{ position: 1 }, { position: 2, name: "Events" }]);
  });
});

describe("buildMetadata", () => {
  const metadata = buildMetadata({ title: "Gallery", description: "Photos", path: "/gallery" });

  it("sets a canonical path without a query string", () => {
    expect(metadata.alternates?.canonical).toBe("/gallery");
  });

  it("applies the title template to social metadata", () => {
    expect(metadata.openGraph?.title).toBe("Gallery | BAMBOOS, Aluva");
    expect(metadata.title).toBe("Gallery");
  });

  it("supports absolute titles", () => {
    const home = buildMetadata({ title: "Home", description: "d", path: "/", absoluteTitle: true });
    expect(home.title).toEqual({ absolute: "Home" });
    expect(home.openGraph?.title).toBe("Home");
  });
});
