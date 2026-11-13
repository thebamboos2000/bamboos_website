"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FilmPlayer } from "@/components/media/video-player";
import { VisualFrame } from "@/components/media/visual-frame";
import type { GalleryItem } from "@/types/domain";
import { stepIndex } from "../lib/filter-gallery";

interface LightboxProps {
  items: GalleryItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

function YouTubeFacade({ videoId, title }: { videoId: string; title: string }) {
  const [loaded, setLoaded] = useState(false);
  if (!loaded) {
    return (
      <button
        type="button"
        onClick={() => setLoaded(true)}
        className="btn btn-gold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        Play film from YouTube
      </button>
    );
  }
  return (
    <iframe
      className="absolute inset-0 size-full"
      src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1`}
      title={title}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  );
}

function LightboxMedia({ item }: { item: GalleryItem }) {
  if (item.kind === "visual") {
    if (item.visual.kind === "image") {
      return (
        <Image
          src={item.visual.asset.src}
          alt={item.visual.asset.alt}
          fill
          sizes="100vw"
          quality={85}
          className="object-contain"
        />
      );
    }
    return (
      <div className="flex size-full items-center justify-center">
        <VisualFrame
          visual={item.visual}
          className="aspect-[4/5] h-full max-h-full max-w-full"
          sizes="lightbox"
        />
      </div>
    );
  }

  if (item.source.type === "file") {
    return (
      <FilmPlayer
        source={item.source}
        title={item.title}
        posterSrc={typeof item.poster.src === "string" ? item.poster.src : item.poster.src.src}
        className="absolute inset-0 size-full object-contain"
      />
    );
  }

  return (
    <>
      <Image
        src={item.poster.src}
        alt={item.poster.alt}
        fill
        sizes="100vw"
        className="object-contain"
      />
      <YouTubeFacade key={item.id} videoId={item.source.videoId} title={item.title} />
    </>
  );
}

/** A native dialog: focus containment, Esc and background inertness come from the browser. */
export function Lightbox({ items, index, onIndexChange, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<number | null>(null);
  const item = items[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  if (!item) return null;

  const step = (delta: number) => onIndexChange(stepIndex(index, delta, items.length));

  return (
    <dialog
      ref={dialogRef}
      aria-label={`Gallery viewer: ${item.title}`}
      className="lightbox on-dark"
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") step(1);
        if (event.key === "ArrowLeft") step(-1);
      }}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const end = event.changedTouches[0]?.clientX;
        if (touchStart.current === null || end === undefined) return;
        const distance = end - touchStart.current;
        if (Math.abs(distance) > 50) step(distance < 0 ? 1 : -1);
        touchStart.current = null;
      }}
    >
      <div className="flex h-full flex-col">
        <div className="shell flex min-h-16 flex-none items-center justify-between gap-4">
          <p className="type-eyebrow" aria-live="polite">
            {index + 1} / {items.length}
          </p>
          <button
            type="button"
            className="type-eyebrow min-h-11 min-w-11 text-right"
            onClick={() => dialogRef.current?.close()}
          >
            Close
          </button>
        </div>

        <div className="lightbox-stage relative min-h-0 flex-1">
          <LightboxMedia key={item.id} item={item} />
        </div>

        <div className="shell flex min-h-20 flex-none items-center justify-between gap-4">
          <button type="button" className="type-eyebrow min-h-11" onClick={() => step(-1)}>
            Previous
          </button>
          <p className="line-clamp-2 text-center text-sm">
            {item.title}
            {item.kind === "visual" && item.visual.kind === "image" && item.visual.asset.illustrative && (
              <span className="block text-xs text-ivory-100/80">
                Illustrative stock photograph, not BAMBOOS
              </span>
            )}
          </p>
          <button type="button" className="type-eyebrow min-h-11" onClick={() => step(1)}>
            Next
          </button>
        </div>
      </div>
    </dialog>
  );
}
