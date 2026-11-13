import { ScrollScene } from "@/components/motion/scroll-scene";
import { IllustrativeTag, VisualFrame } from "@/components/media/visual-frame";
import { TextLink } from "@/components/ui/button";
import { Pending } from "@/components/ui/pending";
import type { Venue, VenueSpec } from "@/types/domain";

export function VenueSpecList({ specs }: { specs: VenueSpec[] }) {
  return (
    <dl>
      {specs.map((spec) => (
        <div
          key={spec.id}
          className="flex items-baseline justify-between gap-6 border-t border-current/20 py-4"
        >
          <dt>{spec.label}</dt>
          <dd className="text-right font-display text-2xl leading-none">
            {spec.value ?? <Pending className="font-sans" />}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The auditorium's main moment. The room starts framed in an arch beneath its name,
 * then opens to fill the screen as the visitor scrolls, and the words settle over it.
 * With reduced motion it is simply the finished, full-screen composition.
 */
export function AuditoriumHighlights({ venue }: { venue: Venue }) {
  const { main } = venue.auditoriumVisuals;
  return (
    <ScrollScene mode="pinned" className="showcase">
      <div className="showcase-stage">
        <div className="showcase-frame">
          <VisualFrame visual={main} sizes="full" compact className="absolute! inset-0 size-full" />
          {main.kind === "image" && main.asset.illustrative && (
            <IllustrativeTag className="showcase-tag" />
          )}
        </div>

        <h2 aria-label="The auditorium" className="showcase-word">
          Auditorium
        </h2>

        <div className="showcase-foot shell">
          <div className="showcase-copy glass-panel">
            <p className="type-statement max-w-[20ch]">{venue.headline}</p>
            <TextLink href="/venue" className="mt-6">
              Inside the auditorium
            </TextLink>
          </div>
        </div>
      </div>
    </ScrollScene>
  );
}
