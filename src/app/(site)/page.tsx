import { VisualFrame } from "@/components/media/visual-frame";
import { business } from "@/config/business";
import { contact } from "@/config/contact";
import { seo } from "@/config/seo";
import { getCelebrations } from "@/content/celebrations";
import { getFacilities } from "@/content/facilities";
import { getFeaturedGalleryItems } from "@/content/gallery";
import { getVenue } from "@/content/venue";
import { CelebrationDeck } from "@/features/celebrations";
import { LocationSection } from "@/features/contact";
import { EnquiryCallout } from "@/features/enquiries";
import { FacilitiesPreview } from "@/features/facilities";
import { GalleryTeaser } from "@/features/gallery";
import { Journey, LineStory, TheHouse } from "@/features/home";
import { AuditoriumHighlights } from "@/features/venue";
import { buildVenueJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: seo.defaultTitle,
  description: seo.defaultDescription,
  path: "/",
  absoluteTitle: true,
});

export default async function HomePage() {
  const [venue, celebrations, facilities, galleryItems] = await Promise.all([
    getVenue(),
    getCelebrations(),
    getFacilities(),
    getFeaturedGalleryItems(),
  ]);
  const jsonLd = buildVenueJsonLd(business, contact, null);

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <Journey venue={venue} />
      <TheHouse venue={venue} />
      <AuditoriumHighlights venue={venue} />
      <LineStory finish={<VisualFrame visual={venue.storyVisual} className="size-full" />} />
      <CelebrationDeck celebrations={celebrations} />
      <FacilitiesPreview facilities={facilities} />
      <GalleryTeaser items={galleryItems} />
      <LocationSection business={business} visual={venue.locationVisual} />
      <EnquiryCallout visual={venue.closing.home} />
    </>
  );
}
