import type { GalleryCategory, GalleryItem } from "@/types/domain";

export type GalleryFilter = GalleryCategory | "all";

export const GALLERY_FILTERS: readonly { id: GalleryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "wedding", label: "Weddings" },
  { id: "engagement", label: "Engagements" },
  { id: "reception", label: "Receptions" },
  { id: "celebration", label: "Celebrations" },
  { id: "corporate", label: "Corporate" },
  { id: "venue", label: "The venue" },
];

export function filterGallery(items: readonly GalleryItem[], filter: GalleryFilter): GalleryItem[] {
  return filter === "all" ? [...items] : items.filter((item) => item.category === filter);
}

/** Filters that have at least one item, so a visitor never lands on an empty view. */
export function availableFilters(items: readonly GalleryItem[]) {
  return GALLERY_FILTERS.filter(
    (filter) => filter.id === "all" || items.some((item) => item.category === filter.id),
  ).map((filter) => ({
    ...filter,
    count: filterGallery(items, filter.id).length,
  }));
}

/** The previous or next index, wrapping at either end. */
export function stepIndex(current: number, delta: number, length: number): number {
  return (current + delta + length) % length;
}
