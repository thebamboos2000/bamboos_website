"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** How quickly a scene catches up with the scroll position. Higher is more languid. */
const GLIDE_MS = 130;
const FRAME_MS = 16;
const MAX_FRAME_MS = 64;
const SETTLED_WITHIN = 0.0004;

interface ScrollSceneProps {
  /** "pinned" measures a sticky stage's travel. "pass" measures the element crossing the screen. */
  mode?: "pinned" | "pass";
  className?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
}

/**
 * Publishes scroll progress as the CSS variable --p (0 to 1), easing towards it so
 * wheel notches don't show as steps. All drawing is done in CSS. Native scrolling
 * is never hijacked: the page itself moves exactly as the visitor scrolls it. With reduced motion or without
 * JavaScript, nothing runs, and each scene's CSS default shows a finished state.
 */
export function ScrollScene({
  mode = "pass",
  className,
  children,
  "aria-labelledby": labelledBy,
}: ScrollSceneProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const viewport = window.innerHeight;
      const raw =
        mode === "pinned"
          ? -rect.top / Math.max(1, rect.height - viewport)
          : (viewport * 0.85 - rect.top) / Math.max(1, rect.height + viewport * 0.35);
      return Math.min(1, Math.max(0, raw));
    };

    // Starts where the page already is, so nothing replays after a reload or a jump link.
    let current = measure();
    let frame = 0;
    let lastTime = 0;

    const write = () => element.style.setProperty("--p", current.toFixed(4));

    const tick = (time: number) => {
      const target = measure();
      const elapsed = lastTime ? Math.min(time - lastTime, MAX_FRAME_MS) : FRAME_MS;
      current += (target - current) * (1 - Math.exp(-elapsed / GLIDE_MS));
      const settled = Math.abs(target - current) < SETTLED_WITHIN;
      if (settled) current = target;
      write();
      // The loop runs only while catching up, so an idle page does no work.
      lastTime = settled ? 0 : time;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    write();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [mode]);

  return (
    <section ref={ref} className={className} aria-labelledby={labelledBy}>
      {children}
    </section>
  );
}
