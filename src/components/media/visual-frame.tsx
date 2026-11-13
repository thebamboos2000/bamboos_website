import Image from "next/image";
import type { ReactNode } from "react";
import { cn, imageSizes, type ImageSizePreset } from "@/lib/utils";
import type { Visual } from "@/types/domain";
import { PlateArt } from "./plate-art";

interface VisualFrameProps {
  visual: Visual;
  /** The frame's shape, for example "aspect-[4/5]". The box is always reserved. */
  className?: string;
  sizes?: ImageSizePreset;
  /** Set only on the page's LCP image. */
  priority?: boolean;
  /** Hides the visible label, for when a parent renders its own. Alt text still discloses it. */
  compact?: boolean;
  /** Which bottom corner holds the label. Use the one no overlapping photograph covers. */
  tagSide?: "left" | "right";
  /** Clipped to the frame, above the photograph and below its label. */
  overlay?: ReactNode;
}

/** The visible disclosure on every stock photograph, set quietly along the frame's edge. */
export function IllustrativeTag({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("illus-tag", className ?? "right-1.5 bottom-1.5")}>
      Illustrative image
    </span>
  );
}

export function VisualFrame({
  visual,
  className,
  sizes = "half",
  priority = false,
  compact = false,
  tagSide = "right",
  overlay,
}: VisualFrameProps) {
  if (visual.kind === "image") {
    const { asset } = visual;
    return (
      <div className={cn("frame-host relative overflow-hidden bg-forest-800", className)}>
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={imageSizes[sizes]}
          className="frame-zoom object-cover"
          style={asset.focal ? { objectPosition: asset.focal } : undefined}
          placeholder={typeof asset.src === "string" ? "empty" : "blur"}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />
        {overlay}
        {asset.illustrative && !compact && (
          <IllustrativeTag className={tagSide === "left" ? "bottom-1.5 left-1.5" : undefined} />
        )}
      </div>
    );
  }

  const label = `Reserved frame: ${visual.brief}. Photograph to be supplied by BAMBOOS.`;

  return (
    <div
      role="img"
      aria-label={label}
      data-pending="true"
      className={cn(
        "frame-host relative overflow-hidden bg-forest-800 text-champagne-400",
        className,
      )}
    >
      <PlateArt kind={visual.art} className="frame-zoom absolute inset-0 size-full" />
      {overlay}
      {!compact && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 bg-forest-950/85 px-4 py-3 text-ivory-100"
        >
          <p className="text-[0.625rem] font-semibold tracking-[0.18em] text-champagne-300 uppercase">
            Reserved · Photograph to be supplied
          </p>
          <p className="mt-1 line-clamp-2 text-xs leading-snug">{visual.brief}</p>
        </div>
      )}
    </div>
  );
}
