import type { Route } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { getCelebrations } from "@/content/celebrations";
import { getVenue } from "@/content/venue";
import { CelebrationChapters } from "@/features/celebrations";
import { EnquiryCallout } from "@/features/enquiries";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Events: Weddings, Receptions and Corporate Functions",
  description:
    "Weddings, engagements, receptions, birthdays, corporate events and conferences at BAMBOOS, an auditorium and event venue in Aluva, Kerala.",
  path: "/celebrations",
});

export default async function CelebrationsPage() {
  const [celebrations, venue] = await Promise.all([getCelebrations(), getVenue()]);

  return (
    <>
      <PageHero
        eyebrow="Events"
        background={venue.pageVisuals.events}
        title={
          <>
            One room. <em>Many</em> occasions
          </>
        }
        lead="From the most personal ceremony to the most public announcement, every event asks something different of the space around it."
      />
      <CelebrationChapters celebrations={celebrations} />
      <EnquiryCallout
        title={
          <>
            Planning <em>something else?</em>
          </>
        }
        label="Tell us about it"
        visual={venue.closing.events}
        href={"/contact?event=other#enquiry" as Route}
      />
    </>
  );
}
