import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { business } from "@/config/business";
import { contact } from "@/config/contact";
import { EVENT_TYPE_IDS, isEventTypeId } from "@/config/event-types";
import { resolveSiteUrl } from "@/config/env";
import { findLaunchBlockers, WHATSAPP_NUMBER_FORMAT } from "@/lib/launch-check";
import type { Visual } from "@/types/domain";
import { getCelebrationBySlug, getCelebrations } from "./celebrations";
import { getFacilities } from "./facilities";
import { stock } from "./stock-images";
import { getFeaturedGalleryItems, getGalleryItems } from "./gallery";
import { getVenue } from "./venue";

const expectUnique = (values: string[]) => {
  expect(new Set(values).size).toBe(values.length);
};

const expectUsableVisual = (visual: Visual) => {
  if (visual.kind === "pending") {
    expect(visual.brief.length).toBeGreaterThan(5);
    return;
  }
  // A real image must describe itself unless it is explicitly decorative.
  if (!visual.asset.decorative) expect(visual.asset.alt.trim()).not.toBe("");
  // Random or remote URLs are not allowed as business assets (ADR-006).
  if (typeof visual.asset.src === "string") expect(visual.asset.src).toMatch(/^\//);
};

describe("celebrations", () => {
  it("have unique URL-safe slugs and valid event types", async () => {
    const celebrations = await getCelebrations();
    expectUnique(celebrations.map((celebration) => celebration.slug));
    for (const celebration of celebrations) {
      expect(celebration.slug).toMatch(/^[a-z0-9-]+$/);
      expect(isEventTypeId(celebration.eventTypeId)).toBe(true);
      expect(celebration.seo.description.length).toBeLessThanOrEqual(170);
      expectUsableVisual(celebration.heroVisual);
      celebration.visuals.forEach(expectUsableVisual);
    }
  });

  it("cover every event named in the brief", async () => {
    const titles = (await getCelebrations()).map((celebration) => celebration.title);
    expect(titles).toEqual(
      expect.arrayContaining([
        "Weddings",
        "Engagements",
        "Receptions",
        "Birthday celebrations",
        "Corporate events",
        "Conferences",
      ]),
    );
  });

  it("can be found by slug", async () => {
    expect((await getCelebrationBySlug("weddings"))?.title).toBe("Weddings");
    expect(await getCelebrationBySlug("nope")).toBeUndefined();
  });
});

describe("gallery", () => {
  it("has unique ids and usable visuals", async () => {
    const items = await getGalleryItems();
    expectUnique(items.map((item) => item.id));
    for (const item of items) {
      if (item.kind === "visual") expectUsableVisual(item.visual);
    }
  });

  it("features at least enough items for the homepage teaser", async () => {
    expect((await getFeaturedGalleryItems()).length).toBeGreaterThanOrEqual(5);
  });
});

describe("stock photographs", () => {
  it("are all flagged, credited and disclose that they aren't BAMBOOS", () => {
    for (const visual of Object.values(stock)) {
      expect(visual.kind).toBe("image");
      if (visual.kind !== "image") continue;
      expect(visual.asset.illustrative).toBe(true);
      expect(visual.asset.credit).toBeTruthy();
      expect(visual.asset.alt).toContain("not BAMBOOS");
    }
  });

  it("are recorded in the attribution document", () => {
    const attribution = readFileSync("ASSET_ATTRIBUTION.md", "utf8");
    for (const file of readdirSync("src/assets/media/stock")) {
      expect(attribution).toContain(file);
    }
  });
});

describe("unverified facts stay unverified", () => {
  // Fails deliberately when a value is added, as a prompt to record who verified it.
  it("has no invented contact details or figures", async () => {
    // WhatsApp number set by the project owner to the venue phone, committed by 13 November 2026.
    expect(contact).toEqual({
      phoneE164: "+917592925757",
      whatsappNumber: "917592925757",
      email: null,
      enquiryHours: null,
    });
    expect(WHATSAPP_NUMBER_FORMAT.test(contact.whatsappNumber ?? "")).toBe(true);
    // Collected from the venue's Google Maps listing and Instagram profile on 9 November 2026.
    expect(business.address.postalCode).toBe("683562");
    expect(business.geo).toEqual({ latitude: 10.0568624, longitude: 76.394549 });
    expect(business.googleMapsEmbedUrl).toMatch(/^https:\/\/www\.google\.com\/maps\/embed\?/);

    const venue = await getVenue();
    expect(venue.specs.filter((spec) => spec.value !== null).map((spec) => spec.id)).toEqual(["seating", "parking"]);
    const described = (await getFacilities()).filter((facility) => facility.description !== null);
    expect(described.map((facility) => facility.id)).toEqual(["climate", "parking"]);
  });
});

describe("event types", () => {
  it("have unique ids", () => {
    expectUnique([...EVENT_TYPE_IDS]);
  });
});

describe("resolveSiteUrl", () => {
  it("defaults to localhost off Vercel", () => {
    expect(resolveSiteUrl(undefined, false)).toBe("http://localhost:3000");
  });

  it("is required on Vercel", () => {
    expect(() => resolveSiteUrl(undefined, true)).toThrow(/must be set/);
  });

  it("rejects an invalid value and strips a trailing slash", () => {
    expect(() => resolveSiteUrl("not a url", false)).toThrow();
    expect(() => resolveSiteUrl("javascript:alert(1)", false)).toThrow();
    expect(resolveSiteUrl("https://example.test/", true)).toBe("https://example.test");
  });
});

describe("WhatsApp number format", () => {
  it.each(["910000000000", "14155550100"])("accepts %s", (number) => {
    expect(WHATSAPP_NUMBER_FORMAT.test(number)).toBe(true);
  });

  it.each(["+910000000000", "91 00000 00000", "91-00000-00000", "0910000000", "12345"])(
    "rejects %s",
    (number) => {
      expect(WHATSAPP_NUMBER_FORMAT.test(number)).toBe(false);
    },
  );
});

describe("findLaunchBlockers", () => {
  it("blocks launch on every unverified fact today, and clears once they are supplied", async () => {
    const venue = await getVenue();
    const facilities = await getFacilities();
    const blocked = findLaunchBlockers({
      business,
      contact: { ...contact, whatsappNumber: null },
      venue,
      facilities,
      gallery: await getGalleryItems(),
      celebrationPendingVisuals: 3,
      siteUrl: "http://localhost:3000",
    });
    expect(blocked).toEqual(
      expect.arrayContaining(["WhatsApp number", "Dining capacity", "Facility: Seating"]),
    );
    expect(blocked.join()).toMatch(/placeholder images still need real BAMBOOS photography/);

    const badFormat = findLaunchBlockers({
      business,
      contact: { ...contact, whatsappNumber: "+91 00000 00000" },
      venue,
      facilities,
      gallery: [],
      celebrationPendingVisuals: 0,
      siteUrl: "https://example.test",
    });
    expect(badFormat.join()).toMatch(/WhatsApp number format/);

    const previewOn = findLaunchBlockers({
      business,
      contact,
      venue,
      facilities,
      gallery: [],
      celebrationPendingVisuals: 0,
      siteUrl: "https://example.test",
      venuePhotoPreview: true,
    });
    expect(previewOn.join()).toMatch(/Venue photo preview is on/);

    const image: Visual = { kind: "image", asset: { src: "/a.jpg", alt: "A" } };
    expect(
      findLaunchBlockers({
        business: {
          ...business,
          legalName: "Name",
          googleMapsUrl: "https://example.test",
          address: { ...business.address, streetAddress: "Road", postalCode: "000000" },
        },
        contact: { ...contact, phoneE164: "+1", whatsappNumber: "910000000000", enquiryHours: "9-5" },
        venue: {
          ...venue,
          heroVisual: image,
          houseVisuals: { main: image, accent: image, tall: image },
          storyVisual: image,
          auditoriumVisuals: { main: image, detail: image, tall: image },
          locationVisual: image,
          closing: { home: image, venue: image, events: image, occasion: image, facilities: image, gallery: image },
          pageVisuals: { events: image, venue: image, facilities: image, contact: image },
          specs: venue.specs.map((spec) => ({ ...spec, value: "1" })),
          halls: [
            {
              id: "a",
              name: "A",
              description: "A",
              capacity: { seated: 1, dining: 1 },
              visual: image,
            },
          ],
        },
        facilities: facilities.map((facility) => ({ ...facility, description: "Yes", visual: null })),
        gallery: [],
        celebrationPendingVisuals: 0,
        siteUrl: "https://example.test",
      }),
    ).toEqual([]);
  });
});
