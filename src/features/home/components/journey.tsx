import Image from "next/image";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { AmbientVideo } from "@/components/media/video-player";
import { IllustrativeTag } from "@/components/media/visual-frame";
import { ButtonLink } from "@/components/ui/button";
import { enquiryHref } from "@/config/navigation";
import type { Venue } from "@/types/domain";
import { BambooGrove, GoldDust, LitArch } from "./bamboo-grove";

/**
 * The opening of the site, in a fixed order: the brand first, the venue second.
 *
 * The first screen is only the BAMBOOS name. Scrolling lifts it away as the venue
 * rises in an arch and opens to fill the screen. With reduced motion or without
 * JavaScript, the same two moments simply follow each other down the page.
 */
export function Journey({ venue }: { venue: Venue }) {
  const { heroVisual: visual, heroVideo: video } = venue;

  return (
    <ScrollScene mode="pinned" className="journey">
      <div className="journey-stage depth-field">
        <div className="intro-brand">
          <LitArch />
          <BambooGrove side="left" />
          <BambooGrove side="right" />
          <GoldDust />
          <div className="intro-inner">
            <h1 className="intro-word">
              <span className="sr-only">BAMBOOS Auditorium, Aluva</span>
              <span aria-hidden="true">
                {[..."BAMBOOS"].map((letter, index) => (
                  <span
                    key={index}
                    className="intro-letter"
                    style={{ "--i": index } as React.CSSProperties}
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </h1>
            <span aria-hidden="true" className="intro-rule" />
            <p className="intro-sub type-eyebrow">Auditorium &amp; wedding venue · Aluva, Kerala</p>
            <p className="intro-tagline">For the days you will retell.</p>
          </div>
          <p aria-hidden="true" className="intro-cue">
            <span>Scroll to discover</span>
          </p>
        </div>

        <section aria-labelledby="venue-reveal-heading" className="intro-reveal">
          <div className="journey-depth">
            <div className="journey-zoom">
              {visual.kind === "image" && (
                <Image
                  src={visual.asset.src}
                  alt={visual.asset.alt}
                  fill
                  sizes="100vw"
                  placeholder={typeof visual.asset.src === "string" ? "empty" : "blur"}
                  // Eager, so it's ready for the first scroll, but it doesn't outrank the name.
                  loading="eager"
                  className="object-cover"
                  style={visual.asset.focal ? { objectPosition: visual.asset.focal } : undefined}
                />
              )}
              {video && <AmbientVideo source={video} className="absolute inset-0 size-full object-cover" />}
            </div>
          </div>
          <div aria-hidden="true" className="intro-shade" />
          {visual.kind === "image" && visual.asset.illustrative && (
            <IllustrativeTag className="intro-tag" />
          )}
          <div className="intro-copy">
            <h2 id="venue-reveal-heading" className="intro-heading">
              A place for <em>every</em> celebration
            </h2>
            <ButtonLink href={enquiryHref} className="intro-cta">
              Begin your enquiry
            </ButtonLink>
          </div>
        </section>
      </div>
    </ScrollScene>
  );
}
