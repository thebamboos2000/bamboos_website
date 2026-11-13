"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Between pages, a forest curtain lifts in the shape of the site's arch.
 * It never runs on first load, so it can't affect LCP.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const curtain = useRef<HTMLDivElement>(null);
  const previous = useRef(pathname);

  useEffect(() => {
    if (previous.current === pathname) return;
    previous.current = pathname;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    curtain.current?.animate(
      [
        { clipPath: "inset(0 0 0 0 round 0)", opacity: 1 },
        { clipPath: "inset(0 0 100% 0 round 0 0 50% 50%)", opacity: 1 },
      ],
      { duration: 850, easing: "cubic-bezier(0.76, 0, 0.24, 1)" },
    );
  }, [pathname]);

  return (
    <>
      <div ref={curtain} aria-hidden="true" className="page-curtain" />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
    </>
  );
}
