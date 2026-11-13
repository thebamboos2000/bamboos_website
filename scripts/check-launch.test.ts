import { expect, it } from "vitest";
import { business } from "@/config/business";
import { contact } from "@/config/contact";
import { venuePhotoPreview } from "@/config/venue-photos";
import { siteUrl } from "@/config/env";
import { getCelebrations } from "@/content/celebrations";
import { getFacilities } from "@/content/facilities";
import { getGalleryItems } from "@/content/gallery";
import { getVenue } from "@/content/venue";
import { findLaunchBlockers, isPlaceholderVisual } from "@/lib/launch-check";

it("has every launch-required fact and asset", async () => {
  const celebrations = await getCelebrations();
  const blockers = findLaunchBlockers({
    business,
    contact,
    venue: await getVenue(),
    facilities: await getFacilities(),
    gallery: await getGalleryItems(),
    celebrationPendingVisuals: celebrations
      .flatMap((celebration) => [celebration.heroVisual, ...celebration.visuals])
      .filter(isPlaceholderVisual).length,
    siteUrl,
    venuePhotoPreview,
  });

  expect(blockers, `Launch blocked by:\n- ${blockers.join("\n- ")}\n`).toEqual([]);
});
