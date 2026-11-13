import { Reveal } from "@/components/motion/reveal";
import { VisualFrame } from "@/components/media/visual-frame";
import { TextLink } from "@/components/ui/button";
import { Pending } from "@/components/ui/pending";
import { cn } from "@/lib/utils";
import type { Facility } from "@/types/domain";

function FacilityText({ facility }: { facility: Facility }) {
  return facility.description ? <p>{facility.description}</p> : <Pending />;
}

const stagger = ["lg:mt-0", "lg:mt-28", "lg:mt-10", "lg:mt-40"];

/** Homepage: tall frames descending like a staircase. On mobile the row swipes natively. */
export function FacilitiesPreview({ facilities }: { facilities: Facility[] }) {
  const featured = facilities.filter((facility) => facility.visual);

  return (
    <section className="overflow-hidden bg-ivory-50 py-[clamp(6rem,13vw,12rem)]">
      <div className="shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="type-eyebrow text-champagne-700">The details</p>
            <h2 className="type-statement-lg mt-6 max-w-[14ch]">
              What a good day <em>quietly</em> depends on
            </h2>
          </div>
          <div className="max-w-[34ch]">
            <p className="text-stone-600">
              The questions worth asking of any venue. We&apos;ll walk you through each one.
            </p>
            <TextLink href="/facilities" className="mt-4">
              All facilities
            </TextLink>
          </div>
        </div>

        {/* Focusable, so keyboard users can scroll the row on small screens. */}
        <ul
          tabIndex={0}
          aria-label="Facilities"
          className="-mx-(--gutter) mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] lg:mx-0 lg:mt-20 lg:grid lg:snap-none lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:px-0"
        >
          {featured.map((facility, index) => (
            <Reveal
              as="li"
              key={facility.id}
              effect="clip"
              delay={index * 90}
              className={cn("w-[72vw] flex-none snap-center sm:w-[44vw] lg:w-auto", stagger[index])}
            >
              {facility.visual && (
                <VisualFrame visual={facility.visual} className="aspect-[3/4]" sizes="quarter" />
              )}
              <h3 className="mt-4 font-display text-[1.5rem] leading-tight font-light">
                {facility.name}
              </h3>
              <p className="mt-1 text-[0.9375rem] leading-snug text-stone-600">{facility.covers}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** The Facilities page: each facility beside a modest picture, alternating sides, closely spaced. */
export function FacilitiesDetail({ facilities }: { facilities: Facility[] }) {
  const featured = facilities.filter((facility) => facility.visual);
  const others = facilities.filter((facility) => !facility.visual);

  return (
    <>
      <section className="bg-ivory-50 pt-[clamp(4rem,7vw,6.5rem)]">
        <div className="shell space-y-[clamp(3.5rem,6vw,6rem)]">
          {featured.map((facility, index) => {
            const flip = index % 2 === 1;
            return (
              <article key={facility.id} className="grid grid-cols-12 items-center gap-x-4 md:gap-x-8">
                <Reveal
                  effect="clip"
                  className={cn(
                    flip
                      ? "col-span-8 col-start-5 md:order-2 md:col-span-4 md:col-start-8"
                      : "col-span-12 md:col-span-6",
                  )}
                >
                  {facility.visual && (
                    <VisualFrame
                      visual={facility.visual}
                      className={flip ? "aspect-[4/5] rounded-t-[50vw]" : "aspect-[4/3]"}
                      sizes="half"
                    />
                  )}
                </Reveal>
                <Reveal
                  className={cn(
                    "col-span-12 mt-6 md:mt-0",
                    flip ? "md:order-1 md:col-span-5 md:col-start-2" : "md:col-span-5 md:col-start-8",
                  )}
                >
                  <h2 className="type-statement">{facility.name}</h2>
                  <p className="mt-4 max-w-[36ch] text-stone-600">{facility.covers}</p>
                  <div className="mt-4">
                    <FacilityText facility={facility} />
                  </div>
                </Reveal>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-ivory-50 py-[clamp(4rem,7vw,6.5rem)]">
        <div className="shell">
          <h2 className="type-eyebrow text-champagne-700">Also on the list</h2>
          <ul className="mt-6">
            {others.map((facility) => (
              <Reveal
                as="li"
                key={facility.id}
                className="grid gap-2 border-t border-forest-900/15 py-6 md:grid-cols-12 md:items-baseline md:gap-8"
              >
                <h3 className="font-display text-[clamp(1.5rem,2.4vw,2.25rem)] leading-tight font-light md:col-span-5">
                  {facility.name}
                </h3>
                <p className="text-stone-600 md:col-span-4">{facility.covers}</p>
                <div className="md:col-span-3 md:text-right">
                  <FacilityText facility={facility} />
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
