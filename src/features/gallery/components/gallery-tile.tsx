import Image from "next/image";
import { VisualFrame } from "@/components/media/visual-frame";
import { cn, imageSizes } from "@/lib/utils";
import type { GalleryItem, GalleryLayout } from "@/types/domain";

export const layoutShape: Record<GalleryLayout, string> = {
  wide: "aspect-[3/2]",
  tall: "aspect-[4/5]",
  square: "aspect-square",
};

export function GalleryTile({ item, className }: { item: GalleryItem; className?: string }) {
  if (item.kind === "visual") {
    return <VisualFrame visual={item.visual} className={className} sizes="galleryCard" />;
  }

  return (
    <div className={cn("frame-host relative overflow-hidden bg-forest-800", className)}>
      <Image
        src={item.poster.src}
        alt={item.poster.alt}
        fill
        sizes={imageSizes.galleryCard}
        className="frame-zoom object-cover"
      />
      <span className="type-eyebrow absolute bottom-3 left-3 bg-forest-950/85 px-3 py-2 text-ivory-100">
        Film
      </span>
    </div>
  );
}
