import { PageHero } from "@/components/layout/page-hero";
import { showsVenuePhotos } from "@/config/venue-photos";
import { getGalleryItems } from "@/content/gallery";
import { getVenue } from "@/content/venue";
import { EnquiryCallout } from "@/features/enquiries";
import { GalleryExplorer } from "@/features/gallery/explorer";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Gallery",
  description:
    "A visual guide to the atmosphere of weddings, receptions, celebrations and corporate events, from BAMBOOS, an auditorium in Aluva, Kerala.",
  path: "/gallery",
});

export default async function GalleryPage() {
  const [items, venue] = await Promise.all([getGalleryItems(), getVenue()]);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            Moments, <em>held still</em>
          </>
        }
        lead={
          showsVenuePhotos
            ? "The venue, and a mood for the occasions we love to host. Images marked as illustrative are stock photographs, not pictures of BAMBOOS or its events."
            : "A mood for the occasions we love to host. These are illustrative stock photographs, not pictures of BAMBOOS or its events, and they will make way for our own."
        }
      />
      <section className="bg-ivory-50 pt-12 pb-[var(--section)] md:pt-16" aria-label="Gallery">
        <div className="shell">
          <GalleryExplorer items={items} />
        </div>
      </section>
      <EnquiryCallout visual={venue.closing.gallery} />
    </>
  );
}
