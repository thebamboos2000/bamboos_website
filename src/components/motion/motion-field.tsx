"use client";

import { useEffect } from "react";

const MAX_TILT_DEGREES = 5;
const EASE_MS = 180;
const SETTLED_WITHIN = 0.002;

/**
 * One listener for the whole site, so depth costs no per-component JavaScript.
 *
 * - `.depth-field` elements receive --mx and --my (-1 to 1), eased, from the pointer.
 * - `.tilt` elements receive --rx and --ry in degrees while the pointer is over them.
 * - A keyboard user tabbing through the pinned reel is scrolled to the focused card.
 *
 * Pointer effects run only with a real mouse and no reduced-motion preference. Touch
 * devices get none of this, and nothing depends on it: the CSS defaults are at rest.
 */
export function MotionField() {
  useEffect(() => {
    const onFocus = (event: FocusEvent) => {
      const card = (event.target as Element).closest?.<HTMLElement>("[data-reel-index]");
      const reel = card?.closest<HTMLElement>(".reel");
      const stage = reel?.querySelector<HTMLElement>(".reel-stage");
      if (!card || !reel || !stage || getComputedStyle(stage).position !== "sticky") return;
      const count = reel.querySelectorAll("[data-reel-index]").length;
      const progress = Number(card.dataset.reelIndex) / Math.max(1, count - 1);
      const top = reel.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + progress * (reel.offsetHeight - window.innerHeight) });
    };
    document.addEventListener("focusin", onFocus);

    const canTrack =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canTrack) return () => document.removeEventListener("focusin", onFocus);

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    let lastTime = 0;
    let pointer: PointerEvent | null = null;
    let tilted: HTMLElement | null = null;

    const release = () => {
      tilted?.style.removeProperty("--rx");
      tilted?.style.removeProperty("--ry");
      tilted = null;
    };

    const tick = (time: number) => {
      if (pointer) {
        const target = pointer.target as Element | null;
        const element = target?.closest?.<HTMLElement>(".tilt") ?? null;
        if (element !== tilted) release();
        if (element) {
          tilted = element;
          const rect = element.getBoundingClientRect();
          const across = (pointer.clientX - rect.left) / rect.width - 0.5;
          const down = (pointer.clientY - rect.top) / rect.height - 0.5;
          element.style.setProperty("--ry", (across * 2 * MAX_TILT_DEGREES).toFixed(2));
          element.style.setProperty("--rx", (down * -2 * MAX_TILT_DEGREES).toFixed(2));
        }
        pointer = null;
      }

      const elapsed = lastTime ? Math.min(time - lastTime, 64) : 16;
      const step = 1 - Math.exp(-elapsed / EASE_MS);
      x += (targetX - x) * step;
      y += (targetY - y) * step;

      for (const field of document.querySelectorAll<HTMLElement>(".depth-field")) {
        // Sections that have scrolled away don't need repainting.
        if (field.getBoundingClientRect().bottom <= 0) continue;
        field.style.setProperty("--mx", x.toFixed(3));
        field.style.setProperty("--my", y.toFixed(3));
      }

      const settled =
        Math.abs(targetX - x) < SETTLED_WITHIN && Math.abs(targetY - y) < SETTLED_WITHIN;
      lastTime = settled ? 0 : time;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      pointer = event;
      schedule();
    };
    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      release();
      schedule();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      document.removeEventListener("focusin", onFocus);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      if (frame) cancelAnimationFrame(frame);
      release();
    };
  }, []);

  return null;
}
