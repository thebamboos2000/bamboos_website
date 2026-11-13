"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

interface RevealProps {
  as?: ElementType;
  /** "rise" lifts text. "clip" uncovers an image while it settles. "lines" raises masked lines. */
  effect?: "rise" | "clip" | "lines";
  delay?: number;
  /** Fires as soon as it enters the screen. For content so close to the page's end that it may never rise further. */
  atPageEnd?: boolean;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

const suffixes = { rise: "", clip: "-clip", lines: "-lines" } as const;

/**
 * Hides content only after hydration and only when it is below the fold, so
 * content is never lost without JavaScript and nothing on screen flashes.
 */
export function Reveal({
  as: Tag = "div",
  effect = "rise",
  delay = 0,
  atPageEnd = false,
  className,
  children,
  "aria-label": ariaLabel,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    const suffix = suffixes[effect];
    element.dataset.reveal = `armed${suffix}`;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          element.dataset.reveal = `in${suffix}`;
          observer.disconnect();
        }
      },
      // The huge top margin counts anything already scrolled past as seen, so a jump
      // down the page (a link, or the End key) never leaves content above it hidden.
      { rootMargin: atPageEnd ? "99999px 0px 0px 0px" : "99999px 0px -8% 0px" },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, [effect, atPageEnd]);

  return (
    <Tag
      ref={ref}
      aria-label={ariaLabel}
      className={className}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

/** A heading whose lines rise from behind a mask, one after another. */
export function MaskedLines({
  lines,
  as: Tag = "h2",
  className,
}: {
  lines: ReactNode[];
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  return (
    <Reveal effect="lines">
      <Tag className={className}>
        {lines.map((line, index) => (
          <span key={index} className="mask-line">
            <span style={{ "--i": index } as React.CSSProperties}>{line}</span>
          </span>
        ))}
      </Tag>
    </Reveal>
  );
}
