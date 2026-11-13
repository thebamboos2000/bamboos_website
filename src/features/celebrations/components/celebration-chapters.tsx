import { Reveal } from "@/components/motion/reveal";
import { VisualFrame } from "@/components/media/visual-frame";
import { TextLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Celebration } from "@/types/domain";
import { celebrationHref } from "./celebration-deck";

/**
 * The Events page: every occasion shares one calm structure. Its words sit on one side
 * and its two photographs on the other, side by side at the same height. Sides alternate.
 */
export function CelebrationChapters({ celebrations }: { celebrations: Celebration[] }) {
  return (
    <div className="bg-ivory-50 py-[clamp(2rem,4vw,3.5rem)]">
      {celebrations.map((celebration, index) => {
        const flip = index % 2 === 1;
        const second = celebration.visuals[0];
        return (
          <section
            key={celebration.slug}
            aria-labelledby={`chapter-${celebration.slug}`}
            className="shell grid gap-6 py-[clamp(2rem,4.5vw,4rem)] md:grid-cols-12 md:items-center md:gap-8"
          >
            <Reveal className={cn("md:col-span-4", flip && "md:order-2 md:col-start-9")}>
              <p className="type-eyebrow text-champagne-700">
                <span aria-hidden="true">0{index + 1} · </span>
                {celebration.kicker}
              </p>
              <h2 id={`chapter-${celebration.slug}`} className="type-statement mt-4">
                {celebration.title}
              </h2>
              <p className="mt-4 max-w-[34ch] text-stone-600">{celebration.summary}</p>
              <TextLink href={celebrationHref(celebration.slug)} className="mt-5">
                Discover
              </TextLink>
            </Reveal>

            <div
              className={cn(
                "grid h-[clamp(13rem,30vw,26rem)] grid-cols-3 gap-3 md:col-span-8 md:gap-4",
                flip ? "md:order-1 md:col-start-1" : "md:col-start-5",
              )}
            >
              <Reveal effect="clip" className={cn("h-full", second ? "col-span-2" : "col-span-3")}>
                <VisualFrame visual={celebration.heroVisual} className="tilt h-full" sizes="half" />
              </Reveal>
              {second && (
                <Reveal effect="clip" delay={120} className="h-full">
                  <VisualFrame visual={second} className="tilt h-full" sizes="third" />
                </Reveal>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
