import { describe, expect, it } from "vitest";
import { canShowVenuePhoto, isVenuePhotoPreview, VENUE_PHOTOS, venueVisual } from "./venue-photos";

describe("venue photo permission gate", () => {
  it("is off by default", () => {
    expect(isVenuePhotoPreview(undefined, undefined)).toBe(false);
  });

  it("turns on only locally, when asked", () => {
    expect(isVenuePhotoPreview("1", undefined)).toBe(true);
  });

  it.each(["production", "preview", "development"])("can't be turned on in the %s Vercel environment", (env) => {
    expect(isVenuePhotoPreview("1", env)).toBe(false);
  });

  it("shows an unconfirmed photo only in a preview, and an approved one always", () => {
    expect(canShowVenuePhoto("unconfirmed", false)).toBe(false);
    expect(canShowVenuePhoto("unconfirmed", true)).toBe(true);
    expect(canShowVenuePhoto("approved", false)).toBe(true);
  });

  it("marks every photograph as unconfirmed until BAMBOOS gives permission", () => {
    expect(Object.values(VENUE_PHOTOS).every((photo) => photo.status === "unconfirmed")).toBe(true);
  });

  it("falls back to the stock stand-in in normal builds", () => {
    const fallback = { kind: "pending", art: "stalks", brief: "A stand-in" } as const;
    expect(venueVisual("entranceEvening", fallback)).toBe(fallback);
  });

  it("stores local files and describes each image", () => {
    expect(Object.keys(VENUE_PHOTOS)).toHaveLength(25);
    for (const photo of Object.values(VENUE_PHOTOS)) {
      expect(photo.file).toMatch(/^\/images\/bamboos\/bamboos-[a-z-]+\.webp$/);
      expect(photo.alt.length).toBeGreaterThan(20);
    }
  });
});
