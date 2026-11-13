"use client";

import { Reveal } from "@/components/motion/reveal";
import dynamic from "next/dynamic";
import { useMemo, useRef, useState } from "react";
import type { GalleryItem } from "@/types/domain";
import { availableFilters, filterGallery, type GalleryFilter } from "../lib/filter-gallery";
import { GalleryTile } from "./gallery-tile";

const Lightbox = dynamic(() => import("./lightbox").then((module) => module.Lightbox), {
  ssr: false,
});

const PAGE_SIZE = 12;

/**
 * Filter state is deliberately local. `useSearchParams` would drop the whole
 * gallery out of the static HTML, and its images out of search results.
 */
export function GalleryExplorer({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [hasFiltered, setHasFiltered] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [lightboxRequested, setLightboxRequested] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);

  const filters = useMemo(() => availableFilters(items), [items]);
  const filtered = useMemo(() => filterGallery(items, filter), [items, filter]);
  const shown = filtered.slice(0, visible);

  return (
    <>
      <div
        role="group"
        aria-label="Filter the gallery"
        className="-mx-(--gutter) flex gap-x-8 overflow-x-auto px-(--gutter) pb-2 [scrollbar-width:none] md:flex-wrap"
      >
        {filters.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={filter === option.id}
            onClick={() => {
              setFilter(option.id);
              setHasFiltered(true);
              setVisible(PAGE_SIZE);
            }}
            className="gallery-filter"
          >
            {option.label}
            <sup aria-hidden="true" className="ml-1 font-sans text-[0.625rem] tracking-normal">
              {option.count}
            </sup>
          </button>
        ))}
      </div>

      <p role="status" className="sr-only">
        {`Showing ${shown.length} of ${filtered.length} items`}
      </p>

      {/* Remounting on a new filter lets the wall fade back in, one picture after another. */}
      <ul
        key={filter}
        data-filtered={hasFiltered || undefined}
        className="gallery-wall mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12"
      >
        {/* An even grid: every picture the same size, with the same space around it. */}
        {shown.map((item, index) => {
          return (
            <Reveal as="li" effect="clip" delay={(index % 3) * 90} key={item.id}>
              <button
                type="button"
                aria-haspopup="dialog"
                className="group relative block w-full cursor-zoom-in text-left"
                onClick={(event) => {
                  opener.current = event.currentTarget;
                  setLightboxRequested(true);
                  setOpenIndex(index);
                }}
              >
                <span className="sr-only">View: </span>
                <GalleryTile item={item} className="tilt aspect-[4/3]" />
                <span
                  aria-hidden="true"
                  className="pointer-events-none mt-3 block text-[0.9375rem] leading-snug text-forest-900"
                >
                  {item.title}
                </span>
              </button>
            </Reveal>
          );
        })}
      </ul>

      {visible < filtered.length && (
        <div className="mt-16 text-center">
          <button
            type="button"
            className="btn btn-line"
            onClick={() => setVisible((count) => count + PAGE_SIZE)}
          >
            Show more
          </button>
        </div>
      )}

      {lightboxRequested && openIndex !== null && (
        <Lightbox
          items={shown}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => {
            setOpenIndex(null);
            opener.current?.focus();
          }}
        />
      )}
    </>
  );
}
