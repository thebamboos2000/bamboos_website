import { PageHero } from "@/components/layout/page-hero";
import { CinematicBand } from "@/components/media/cinematic-band";
import { TextLink } from "@/components/ui/button";
import { getVenue } from "@/content/venue";
import { EnquiryCallout } from "@/features/enquiries";
import { HallsSection, VenueSpecsSection, VenueStory } from "@/features/venue";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "The Auditorium in Aluva",
  description:
    "Discover BAMBOOS, an auditorium and event venue in Aluva, Kerala: the space, its halls and the details that matter when you plan an event.",
  path: "/venue",
});

export default async function VenuePage() {
  const venue = await getVenue();

  return (
    <>
      <PageHero
        eyebrow="The auditorium"
        background={venue.pageVisuals.venue}
        title={
          <>
            Built for <em>the moment</em>
          </>
        }
        lead={venue.headline}
      />
      <VenueStory venue={venue} />
      <CinematicBand visual={venue.auditoriumVisuals.main}>
        Every seat has <em>its own view</em> of the moment
      </CinematicBand>
      <VenueSpecsSection venue={venue} />
      <HallsSection venue={venue} />
      <div className="bg-ivory-100 pb-16 text-center">
        <TextLink href="/facilities">See the facilities</TextLink>
      </div>
      <EnquiryCallout visual={venue.closing.venue} />
    </>
  );
}
