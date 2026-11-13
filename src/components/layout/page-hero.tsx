import type { ReactNode } from "react";
import { IllustrativeTag, VisualFrame } from "@/components/media/visual-frame";
import { cn } from "@/lib/utils";
import type { Visual } from "@/types/domain";

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** A full-bleed photograph. Without one, the hero is a quiet forest band with a gold arch. */
  background?: Visual;
  /** Use "lg" for longer titles. */
  size?: "xl" | "lg";
  className?: string;
}

/** One opening scene: a full-screen room with the page's name set large across its floor. */
export function PageHero({ eyebrow, title, lead, background, size = "xl", className }: PageHeroProps) {
  return (
    <section
      className={cn(
        "depth-field relative isolate flex overflow-hidden bg-forest-950 text-ivory-50",
        background ? "min-h-svh" : "min-h-[62svh]",
        className,
      )}
    >
      {background ? (
        <>
          <VisualFrame
            visual={background}
            sizes="full"
            priority
            compact
            className="hero-media absolute! inset-0 -z-20 size-full"
          />
          <div aria-hidden="true" className="floor-shade absolute inset-0 -z-10" />
          {background.kind === "image" && background.asset.illustrative && (
            <IllustrativeTag className="top-[calc(var(--header-h)+0.5rem)] right-2" />
          )}
        </>
      ) : (
        <svg
          aria-hidden="true"
          viewBox="0 0 400 300"
          preserveAspectRatio="xMaxYMax meet"
          fill="none"
          stroke="currentColor"
          className="absolute inset-y-0 right-0 -z-10 h-full text-champagne-500/40"
        >
          <path d="M60 300V170a110 110 0 0 1 220 0v130" />
          <path d="M100 300V175a70 70 0 0 1 140 0v125" />
        </svg>
      )}
      <div className="shell flex flex-col justify-end pt-[calc(var(--header-h)+3rem)] pb-[clamp(2.5rem,6vw,5rem)]">
        <p className="type-eyebrow hero-copy text-champagne-300">{eyebrow}</p>
        <h1 className={cn("mt-5", size === "xl" ? "type-statement-xl" : "type-statement-lg")}>{title}</h1>
        {lead && <div className="type-lead mt-6 max-w-[52ch] text-ivory-100">{lead}</div>}
      </div>
    </section>
  );
}
