import { Reveal } from "@/components/motion/reveal";
import { VisualFrame } from "@/components/media/visual-frame";
import { Pending } from "@/components/ui/pending";
import type { Venue } from "@/types/domain";
import { VenueSpecList } from "./auditorium-highlights";

export function VenueStory({ venue }: { venue: Venue }) {
  const { tall, detail } = venue.auditoriumVisuals;
  return (
    <section className="bg-ivory-50 py-[clamp(6rem,13vw,12rem)]">
      <div className="shell grid grid-cols-12 gap-x-4 md:gap-x-8">
        <div className="col-span-12 md:col-span-7 md:pb-44">
          <p className="type-eyebrow text-champagne-700">The room</p>
          {venue.story.map((paragraph, index) => (
            <Reveal key={paragraph}>
              <p
                className={
                  index === 0
                    ? "mt-8 font-display text-[clamp(1.5rem,2.8vw,2.875rem)] leading-[1.22] font-light tracking-[-0.01em]"
                    : "type-lead mt-8 max-w-[50ch] text-stone-600"
                }
              >
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
        <Reveal effect="clip" className="col-span-8 col-start-5 mt-14 md:col-span-4 md:col-start-9 md:mt-0">
          <VisualFrame visual={tall} className="aspect-[3/4] rounded-t-[50vw]" sizes="third" />
        </Reveal>
        <Reveal effect="clip" delay={140} className="relative z-10 col-span-7 -mt-24 md:col-span-3 md:col-start-6 md:-mt-40">
          <VisualFrame visual={detail} className="aspect-square outline-[6px] outline-ivory-50 md:outline-[12px]" sizes="third" />
        </Reveal>
      </div>
    </section>
  );
}

export function VenueSpecsSection({ venue }: { venue: Venue }) {
  return (
    <section className="bg-forest-950 py-[clamp(6rem,12vw,11rem)] text-ivory-100">
      <div className="shell grid items-start gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          <p className="type-eyebrow text-champagne-300">By the numbers</p>
          <h2 className="type-statement mt-6 max-w-[16ch]">
            The details planners <em>ask for first</em>
          </h2>
          <p className="mt-6 max-w-[44ch] text-ivory-100/90">
            Figures appear here once BAMBOOS has confirmed them. Anything still being verified is
            marked until it is.
          </p>
        </div>
        <Reveal className="lg:col-span-5 lg:col-start-8">
          <VenueSpecList specs={venue.specs} />
        </Reveal>
      </div>
    </section>
  );
}

export function HallsSection({ venue }: { venue: Venue }) {
  return (
    <section className="bg-ivory-100 py-[clamp(5rem,10vw,9rem)]">
      <div className="shell">
        <p className="type-eyebrow text-champagne-700">Spaces</p>
        <h2 className="type-statement mt-6">The rooms within</h2>
        {venue.halls.length === 0 ? (
          <p className="mt-6">
            <Pending>Hall names, sizes and descriptions to be confirmed</Pending>
          </p>
        ) : (
          <ul className="mt-12 grid gap-10 md:grid-cols-2">
            {venue.halls.map((hall) => (
              <li key={hall.id}>
                <VisualFrame visual={hall.visual} className="aspect-[5/4]" />
                <h3 className="type-subheading mt-5">{hall.name}</h3>
                <p className="mt-3 text-stone-600">{hall.description}</p>
                <dl className="mt-4 flex gap-8">
                  {hall.capacity.seated && (
                    <div>
                      <dt className="text-sm text-stone-600">Seated</dt>
                      <dd className="font-display text-2xl">{hall.capacity.seated}</dd>
                    </div>
                  )}
                  {hall.capacity.dining && (
                    <div>
                      <dt className="text-sm text-stone-600">Dining</dt>
                      <dd className="font-display text-2xl">{hall.capacity.dining}</dd>
                    </div>
                  )}
                </dl>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
