"use client";

import { useEffect, useRef, useState } from "react";
import type { VideoSource } from "@/types/domain";

interface AmbientVideoProps {
  source: VideoSource;
  /** Poster is rendered separately through next/image, so it can be the LCP element. */
  className?: string;
}

/**
 * Muted background film. It never delays first paint, is skipped for reduced
 * motion and Save-Data, and has a pause control as WCAG 2.2.2 requires.
 */
export function AmbientVideo({ source, className }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [allowed, setAllowed] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || connection?.saveData) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- browser-only preference, unknown during prerender
    setAllowed(true);
  }, []);

  if (!allowed) return null;

  const toggle = () => {
    const video = ref.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={ref}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        {source.webm && <source src={source.webm} type="video/webm" />}
        <source src={source.mp4} type="video/mp4" />
      </video>
      <button
        type="button"
        onClick={toggle}
        className="type-eyebrow absolute right-3 bottom-3 z-10 min-h-11 bg-forest-950/80 px-4 text-ivory-100"
      >
        {playing ? "Pause film" : "Play film"}
      </button>
    </>
  );
}

/** A standard player with native controls. It downloads nothing until the visitor presses play. */
export function FilmPlayer({
  source,
  title,
  posterSrc,
  className,
}: {
  source: VideoSource;
  title: string;
  posterSrc?: string;
  className?: string;
}) {
  return (
    <video className={className} controls preload="none" poster={posterSrc} aria-label={title}>
      {source.webm && <source src={source.webm} type="video/webm" />}
      <source src={source.mp4} type="video/mp4" />
      {source.captions && (
        <track src={source.captions} kind="captions" srcLang="en" label="English" />
      )}
      <a href={source.mp4}>Download the film: {title}</a>
    </video>
  );
}
