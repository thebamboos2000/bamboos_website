import { Reveal } from "@/components/motion/reveal";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { VisualFrame } from "@/components/media/visual-frame";
import type { Venue } from "@/types/domain";

const passage =
  "Every gathering has a moment when the room falls quiet, and a hundred separate conversations become one shared memory. BAMBOOS exists for that moment.";

/** The words light up as they pass, and three photographs are layered in the white space. */
export function TheHouse({ venue }: { venue: Venue }) {
  const words = passage.split(" ");

  return (
    <div className="bg-ivory-50">
      <ScrollScene className="lit shell pt-[clamp(4rem,8vw,7rem)]">
        <p className="type-eyebrow text-champagne-700">About BAMBOOS</p>
        <p className="mt-6 max-w-[30ch] font-display text-[clamp(1.375rem,2.6vw,2.75rem)] leading-[1.25] font-light tracking-[-0.01em]">
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="lit-word"
              style={{ "--i": index / words.length } as React.CSSProperties}
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </ScrollScene>

      <div className="shell grid grid-cols-12 gap-x-4 pt-[clamp(3rem,7vw,7rem)] pb-[clamp(6rem,14vw,13rem)] md:gap-x-8">
        <p className="col-span-12 max-w-[38ch] text-[1.0625rem] leading-relaxed text-stone-600 md:col-span-4 md:col-start-8 md:row-start-1 md:self-end md:pb-10">
          A place for the rituals, speeches, first dances and long goodbyes that families and
          organisations plan for months, and remember for years.
        </p>
        <Reveal
          effect="clip"
          className="float-slow col-span-8 mt-10 md:col-span-4 md:col-start-2 md:row-span-2 md:row-start-1 md:mt-0"
        >
          <VisualFrame
            visual={venue.houseVisuals.tall}
            className="tilt aspect-[3/4] rounded-t-[50vw]"
            sizes="third"
            tagSide="left"
          />
        </Reveal>
        <Reveal
          effect="clip"
          delay={120}
          className="float-mid relative z-10 col-span-10 col-start-3 -mt-14 md:col-span-6 md:col-start-7 md:row-start-2 md:mt-0"
        >
          <VisualFrame visual={venue.houseVisuals.main} className="tilt aspect-[3/2]" sizes="wide" />
        </Reveal>
        <Reveal
          effect="clip"
          delay={200}
          className="float-fast relative z-20 col-span-5 col-start-1 -mt-10 md:col-span-3 md:col-start-4 md:row-start-3 md:-mt-28"
        >
          <VisualFrame
            visual={venue.houseVisuals.accent}
            className="tilt aspect-[4/5] outline-[6px] outline-ivory-50 md:outline-[12px]"
            sizes="third"
          />
        </Reveal>
      </div>
    </div>
  );
}
