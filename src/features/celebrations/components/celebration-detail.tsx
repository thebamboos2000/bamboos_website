import type { Route } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { IllustrativeTag, VisualFrame } from "@/components/media/visual-frame";
import { ButtonLink } from "@/components/ui/button";
import type { Celebration } from "@/types/domain";

export function CelebrationHero({ celebration }: { celebration: Celebration }) {
  return (
    <section className="relative isolate flex min-h-svh overflow-hidden bg-forest-950 text-ivory-50">
      <VisualFrame
        visual={celebration.heroVisual}
        sizes="full"
        priority
        compact
        className="absolute! inset-0 -z-20 size-full"
      />
      <div aria-hidden="true" className="floor-shade absolute inset-0 -z-10" />
      {celebration.heroVisual.kind === "image" && (
        <IllustrativeTag className="top-[calc(var(--header-h)+0.5rem)] right-2" />
      )}
      <div className="shell flex flex-col justify-end pt-[calc(var(--header-h)+3rem)] pb-[clamp(2.5rem,6vw,5rem)]">
        <nav aria-label="Breadcrumb" className="text-[0.8125rem]">
          <ol className="flex flex-wrap items-center gap-2 text-ivory-100">
            <li>
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/celebrations" className="nav-link">
                Events
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{celebration.title}</li>
          </ol>
        </nav>
        <p className="type-eyebrow mt-4 text-champagne-300">{celebration.kicker}</p>
        <h1 className="type-statement-xl mt-4">{celebration.title}</h1>
        <p className="type-lead mt-5 max-w-[44ch] text-ivory-100">{celebration.summary}</p>
      </div>
    </section>
  );
}

export function CelebrationStory({ celebration }: { celebration: Celebration }) {
  return (
    <section className="bg-ivory-50 py-[clamp(6rem,13vw,12rem)]">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="max-w-[26ch] font-display text-[clamp(1.5rem,2.8vw,2.875rem)] leading-[1.22] font-light tracking-[-0.01em]">
              {celebration.body[0]}
            </p>
          </Reveal>
          {celebration.body.slice(1).map((paragraph) => (
            <Reveal key={paragraph}>
              <p className="type-lead mt-8 max-w-[50ch] text-stone-600">{paragraph}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="lg:col-span-4 lg:col-start-9 lg:pt-3">
          <h2 className="type-eyebrow text-champagne-700">What to bring to the conversation</h2>
          <ul className="mt-6">
            {celebration.bringToUs.map((item) => (
              <li key={item} className="border-t border-forest-900/15 py-4">
                {item}
              </li>
            ))}
          </ul>
          <ButtonLink
            href={`/contact?event=${celebration.eventTypeId}#enquiry` as Route}
            variant="forest"
            className="mt-4 w-full"
          >
            Enquire about {celebration.title.toLowerCase()}
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

export function CelebrationFrames({ celebration }: { celebration: Celebration }) {
  const [first, second] = celebration.visuals;
  if (!first) return null;
  return (
    <section aria-label={`${celebration.title} imagery`} className="bg-ivory-50 pb-[clamp(6rem,13vw,12rem)]">
      <div className="shell grid grid-cols-12 gap-x-4 md:gap-x-8">
        <Reveal effect="clip" className={second ? "col-span-11 md:col-span-8" : "col-span-12 md:col-span-10 md:col-start-2"}>
          <VisualFrame visual={first} className="aspect-[3/2]" sizes="wide" />
        </Reveal>
        {second && (
          <Reveal effect="clip" delay={120} className="col-span-7 col-start-6 -mt-14 md:col-span-3 md:col-start-10 md:mt-40">
            <VisualFrame visual={second} className="aspect-[4/5] rounded-t-[50vw]" sizes="third" />
          </Reveal>
        )}
      </div>
    </section>
  );
}
