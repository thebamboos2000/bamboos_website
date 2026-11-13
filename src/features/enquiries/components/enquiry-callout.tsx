import type { Route } from "next";
import { Reveal } from "@/components/motion/reveal";
import { VisualFrame } from "@/components/media/visual-frame";
import { ButtonLink } from "@/components/ui/button";
import { enquiryHref } from "@/config/navigation";
import { cn } from "@/lib/utils";
import type { Visual } from "@/types/domain";

interface EnquiryCalloutProps {
  title?: React.ReactNode;
  href?: Route;
  label?: string;
  visual?: Visual;
  /** The oversized word across the arch. It changes colour inside, so every letter reads. */
  word?: string;
}

/** Both copies share one position, so the letters line up exactly across the arch's edge. */
function ClosingWord({ word, className }: { word: string; className: string }) {
  return (
    <p
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute bottom-[14%] left-1/2 w-screen -translate-x-1/2 text-center font-display text-[17vw] leading-[0.85] md:text-[min(20vw,28rem)] font-light tracking-[-0.01em] uppercase",
        className,
      )}
    >
      {word}
    </p>
  );
}

/** The bookend to the homepage's opening: one more arched window, waiting in pale space. */
export function EnquiryCallout({
  title = (
    <>
      Tell us about the day <em>you have in mind</em>
    </>
  ),
  href = enquiryHref,
  label = "Begin your enquiry",
  visual,
  word = "BEGIN",
}: EnquiryCalloutProps) {
  return (
    <section className="relative isolate overflow-hidden bg-ivory-100 pt-[clamp(5rem,10vw,9rem)] text-forest-900">
      <div className="shell text-center">
        <Reveal>
          <h2 className="type-statement-lg mx-auto max-w-[17ch]">{title}</h2>
        </Reveal>
        <Reveal delay={120} className="mt-8 flex justify-center">
          <ButtonLink href={href}>{label}</ButtonLink>
        </Reveal>
        <Reveal delay={220}>
          <p className="mx-auto mt-6 max-w-[44ch] text-[0.875rem] leading-relaxed text-stone-600">
            An enquiry is not a booking. Only BAMBOOS staff can confirm a booking.
          </p>
        </Reveal>
      </div>
      {visual ? (
        <div className="relative mx-auto mt-12 w-[78vw] max-w-[44rem] md:mt-16 md:w-[46vw]">
          <ClosingWord word={word} className="-z-10 text-champagne-500/60" />
          <Reveal effect="clip">
            <VisualFrame
              visual={visual}
              className="aspect-[4/5] rounded-t-[50vw] md:aspect-[5/4]"
              sizes="half"
              overlay={<ClosingWord word={word} className="closing-word-lit text-ivory-50" />}
            />
          </Reveal>
        </div>
      ) : (
        <div className="h-[clamp(5rem,10vw,9rem)]" />
      )}
    </section>
  );
}
