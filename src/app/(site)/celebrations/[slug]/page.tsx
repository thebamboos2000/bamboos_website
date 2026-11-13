import type { Metadata, Route } from "next";
import { notFound } from "next/navigation";
import { getCelebrationBySlug, getCelebrations } from "@/content/celebrations";
import { getVenue } from "@/content/venue";
import {
  CelebrationFrames,
  CelebrationHero,
  CelebrationStory,
} from "@/features/celebrations";
import { EnquiryCallout } from "@/features/enquiries";
import { buildBreadcrumbJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

// Unknown slugs return a 404 without any on-demand rendering. See ADR-007.
export const dynamicParams = false;

export async function generateStaticParams() {
  const celebrations = await getCelebrations();
  return celebrations.map((celebration) => ({ slug: celebration.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/celebrations/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const celebration = await getCelebrationBySlug(slug);
  if (!celebration) return {};

  return buildMetadata({
    title: celebration.seo.title,
    description: celebration.seo.description,
    path: `/celebrations/${celebration.slug}`,
  });
}

export default async function CelebrationPage({ params }: PageProps<"/celebrations/[slug]">) {
  const { slug } = await params;
  const celebration = await getCelebrationBySlug(slug);
  if (!celebration) notFound();
  const venue = await getVenue();

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: "Events", path: "/celebrations" },
          { name: celebration.title, path: `/celebrations/${celebration.slug}` },
        ])}
      />
      <CelebrationHero celebration={celebration} />
      <CelebrationStory celebration={celebration} />
      <CelebrationFrames celebration={celebration} />
      <EnquiryCallout
        href={`/contact?event=${celebration.eventTypeId}#enquiry` as Route}
        visual={venue.closing.occasion}
      />
    </>
  );
}
