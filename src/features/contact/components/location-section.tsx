import { Reveal } from "@/components/motion/reveal";
import { VisualFrame } from "@/components/media/visual-frame";
import { Arrow } from "@/components/ui/button";
import { Pending } from "@/components/ui/pending";
import type { BusinessInfo, Visual } from "@/types/domain";
import { MapFacade } from "./map-facade";

interface LocationSectionProps {
  business: BusinessInfo;
  visual: Visual;
}

export function LocationSection({ business, visual }: LocationSectionProps) {
  const { address } = business;

  return (
    <section
      className="overflow-hidden bg-forest-950 py-[clamp(5rem,10vw,9rem)] text-ivory-100"
      aria-labelledby="location-heading"
    >
      <div className="shell grid items-end gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-8">
          <p className="type-eyebrow text-champagne-300">Find us</p>
          <h2
            id="location-heading"
            className="mt-6 font-display text-[clamp(4rem,15vw,15rem)] leading-[0.9] font-light tracking-[-0.015em] uppercase"
          >
            Aluva
          </h2>
          <address className="type-lead mt-8 max-w-[34ch] not-italic">
            {address.streetAddress ? (
              <p>{address.streetAddress}</p>
            ) : (
              <p className="mb-2">
                <Pending>Street address to be confirmed</Pending>
              </p>
            )}
            <p>
              {address.addressLocality}, {business.district}, {address.addressRegion}
              {address.postalCode && ` ${address.postalCode}`}
            </p>
          </address>
          <div className="mt-6">
            {business.googleMapsUrl ? (
              <a
                href={business.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-line"
              >
                <span>Get directions</span>
                <Arrow />
              </a>
            ) : (
              <Pending>Directions link to be confirmed</Pending>
            )}
          </div>
        </div>
        <Reveal effect="clip" className="lg:col-span-4 lg:col-start-9">
          {business.googleMapsEmbedUrl ? (
            <MapFacade embedUrl={business.googleMapsEmbedUrl} title={`Map showing ${business.name}`} />
          ) : (
            <VisualFrame visual={visual} className="aspect-[4/5] rounded-t-[50vw]" sizes="third" />
          )}
        </Reveal>
      </div>
    </section>
  );
}
