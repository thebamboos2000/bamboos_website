import Link from "next/link";
import { ScrollScene } from "@/components/motion/scroll-scene";
import { TextLink } from "@/components/ui/button";
import type { GalleryItem } from "@/types/domain";
import { GalleryTile } from "./gallery-tile";

function Strip({ items, className }: { items: GalleryItem[]; className: string }) {
  return (
    <ul className={className}>
      {items.map((item, index) => (
        <li
          key={item.id}
          className={index % 3 === 1 ? "w-[62vw] flex-none md:w-[24vw]" : "w-[78vw] flex-none md:w-[36vw]"}
        >
          <Link href="/gallery" className="relative block">
            <span className="sr-only">Open the gallery: </span>
            <GalleryTile
              item={item}
              className={index % 3 === 1 ? "tilt aspect-[3/4] rounded-t-[50vw] md:aspect-[4/5]" : "tilt aspect-[3/2]"}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Two rows of pictures drift gently in opposite directions as the visitor scrolls past. */
export function GalleryTeaser({ items }: { items: GalleryItem[] }) {
  const middle = Math.ceil(items.length / 2);

  return (
    <ScrollScene className="drift overflow-hidden bg-forest-950 py-[clamp(6rem,12vw,11rem)] text-ivory-50">
      <div className="shell flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="type-eyebrow text-champagne-300">Gallery</p>
          <h2 className="type-statement-xl mt-5">Moments</h2>
        </div>
        <TextLink href="/gallery" className="self-start md:self-auto">
          Enter the gallery
        </TextLink>
      </div>
      <Strip items={items.slice(0, middle)} className="drift-a mt-12 flex items-end gap-4 md:mt-16 md:gap-8" />
      <Strip items={items.slice(middle)} className="drift-b mt-4 flex items-start gap-4 md:mt-8 md:gap-8" />
    </ScrollScene>
  );
}
