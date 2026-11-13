import { PageHero } from "@/components/layout/page-hero";
import { showsVenuePhotos } from "@/config/venue-photos";
import { getFacilities } from "@/content/facilities";
import { getVenue } from "@/content/venue";
import { EnquiryCallout } from "@/features/enquiries";
import { FacilitiesDetail } from "@/features/facilities";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Auditorium Facilities",
  description:
    "Seating, stage, dining, parking and more: what to know about the facilities when planning an event at BAMBOOS in Aluva, Kerala.",
  path: "/facilities",
});

export default async function FacilitiesPage() {
  const [facilities, venue] = await Promise.all([getFacilities(), getVenue()]);

  return (
    <>
      <PageHero
        eyebrow="Facilities"
        background={venue.pageVisuals.facilities}
        title={
          <>
            The <em>quiet</em> details
          </>
        }
        lead={
          showsVenuePhotos
            ? "Facts on this page are published once BAMBOOS has confirmed them, and anything still being verified is marked. A photograph doesn't confirm a facility."
            : "Facts on this page are published once BAMBOOS has confirmed them, and anything still being verified is marked. Photographs are illustrative, and don't show BAMBOOS."
        }
      />
      <FacilitiesDetail facilities={facilities} />
      <EnquiryCallout
        title={
          <>
            Have a <em>specific</em> requirement?
          </>
        }
        label="Ask us about it"
        visual={venue.closing.facilities}
      />
    </>
  );
}
