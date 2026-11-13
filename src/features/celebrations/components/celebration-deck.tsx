import type { Route } from "next";
import Link from "next/link";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { Arrow } from "@/components/ui/button";
import { IllustrativeTag, VisualFrame } from "@/components/media/visual-frame";
import type { Celebration } from "@/types/domain";

export function celebrationHref(slug: string) {
  return `/celebrations/${slug}` as Route;
}

/**
 * The occasions pass by as a reel of large rooms, each turning towards the visitor
 * as it reaches the centre. On desktop, ordinary vertical scrolling drives it. On touch
 * screens, and with reduced motion, it is a native rail that swipes and scrolls freely.
 */
export function CelebrationDeck({ celebrations }: { celebrations: Celebration[] }) {
  return (
    <ScrollScene mode="pinned" className="reel" aria-labelledby="occasions-heading">
      <div className="reel-stage">
        <div className="shell">
          <p className="type-eyebrow text-champagne-300">Weddings and celebrations</p>
          <h2 id="occasions-heading" className="type-statement mt-3 max-w-[30ch]">
            Choose the day you want to <em>remember</em>
          </h2>
        </div>

        <ul
          tabIndex={0}
          aria-label="Occasions"
          className="reel-track"
          style={{ "--n": celebrations.length } as React.CSSProperties}
        >
          {celebrations.map((celebration, index) => (
            <li
              key={celebration.slug}
              data-reel-index={index}
              className="reel-card"
              style={{ "--i": index } as React.CSSProperties}
            >
              <VisualFrame
                visual={celebration.heroVisual}
                sizes="half"
                compact
                className="absolute! inset-0 size-full"
              />
              <div aria-hidden="true" className="floor-shade absolute inset-0" />
              {celebration.heroVisual.kind === "image" && celebration.heroVisual.asset.illustrative && (
                <IllustrativeTag className="top-[20%] right-2 z-10" />
              )}
              <div className="reel-copy">
                <p className="type-eyebrow text-champagne-300">
                  <span aria-hidden="true">0{index + 1} · </span>
                  {celebration.kicker}
                </p>
                <h3 className="type-statement-lg mt-3">
                  <Link href={celebrationHref(celebration.slug)} className="deck-link">
                    {celebration.title}
                  </Link>
                </h3>
                <span aria-hidden="true" className="link-line mt-3">
                  <span>Discover</span>
                  <Arrow />
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ScrollScene>
  );
}
