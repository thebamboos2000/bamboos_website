import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/reveal";
import { IllustrativeTag, VisualFrame } from "@/components/media/visual-frame";
import type { Visual } from "@/types/domain";

/** A full-width room with one short statement set into its shadow. */
export function CinematicBand({ visual, children }: { visual: Visual; children: ReactNode }) {
  return (
    <section className="cinematic-band relative isolate flex min-h-svh items-end overflow-hidden bg-forest-950 text-ivory-50">
      <VisualFrame visual={visual} sizes="full" compact className="absolute! inset-0 -z-20 size-full" />
      <div aria-hidden="true" className="floor-shade absolute inset-0 -z-10" />
      {visual.kind === "image" && visual.asset.illustrative && (
        <IllustrativeTag className="top-2 right-2" />
      )}
      <div className="shell pb-[clamp(3rem,7vw,6rem)]">
        <Reveal>
          <p className="type-statement-lg max-w-[20ch]">{children}</p>
        </Reveal>
      </div>
    </section>
  );
}
