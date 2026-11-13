import type { CSSProperties, ReactNode } from "react";
import { ScrollScene } from "@/components/motion/scroll-scene";

type Timed = CSSProperties & Record<`--${string}`, number>;

const statements = [
  { text: "It begins with a single line", a: 0.0, b: 0.2 },
  { text: "It rises, patient and unhurried", a: 0.2, b: 0.44 },
  { text: "Then it bends, and a threshold appears", a: 0.44, b: 0.68 },
  { text: "The arch becomes a stage. The rest is yours", a: 0.68, b: 1 },
];

// Each stroke draws between its own start (s) and end (e) scroll positions.
const stalk: { d: string; s: number; e: number; w: number }[] = [
  { d: "M500 1000V300", s: 0.02, e: 0.34, w: 1.75 },
  ...[880, 770, 660, 550, 440].map((y, index) => ({
    d: `M488 ${y}H512`,
    s: 0.08 + index * 0.05,
    e: 0.11 + index * 0.05,
    w: 1.75,
  })),
  { d: "M500 660C540 625 590 615 640 628C592 655 545 668 500 660Z", s: 0.27, e: 0.36, w: 1 },
  { d: "M500 550C460 515 410 505 360 518C408 545 455 558 500 550Z", s: 0.31, e: 0.4, w: 1 },
];

const stage: { d: string; s: number; e: number; w: number }[] = [
  { d: "M500 300A320 320 0 0 0 180 620V860", s: 0.44, e: 0.64, w: 1.75 },
  { d: "M500 300A320 320 0 0 1 820 620V860", s: 0.44, e: 0.64, w: 1.75 },
  { d: "M500 240A380 380 0 0 0 120 620V860", s: 0.58, e: 0.72, w: 1 },
  { d: "M500 240A380 380 0 0 1 880 620V860", s: 0.58, e: 0.72, w: 1 },
  { d: "M20 860H980", s: 0.66, e: 0.8, w: 1.75 },
  { d: "M180 860L20 1000M820 860L980 1000M360 860L300 1000M640 860L700 1000", s: 0.72, e: 0.86, w: 1 },
];

/**
 * The site's signature, in the language of the architect's line: one gold stroke
 * grows into bamboo, bends into an arch, and the room appears inside it.
 */
export function LineStory({ finish }: { finish: ReactNode }) {
  return (
    <ScrollScene mode="pinned" className="story bg-ivory-100" aria-labelledby="story-heading">
      <div className="story-stage shell">
        <div className="relative flex flex-col lg:col-span-5">
          <p id="story-heading" className="type-eyebrow text-champagne-700">
            One line
          </p>
          <div className="relative mt-5 min-h-[9rem] md:min-h-[11rem] lg:min-h-[13rem]">
            {statements.map((statement) => (
              <p
                key={statement.text}
                className="story-statement type-statement max-w-[16ch]"
                style={{ "--a": statement.a, "--b": statement.b } as Timed}
              >
                {statement.text}
              </p>
            ))}
          </div>
        </div>

        <div className="story-art lg:col-span-7">
          <div className="story-finish">{finish}</div>
          <svg aria-hidden="true" viewBox="60 200 880 800" className="absolute inset-0 size-full">
            {/* A faint outline of the finished arch, so the space is never empty. The gold line draws over it. */}
            <g className="story-ghost">
              {stage.map((line) => (
                <path key={line.d} d={line.d} strokeWidth={line.w} />
              ))}
            </g>
            <g className="story-stalk">
              {stalk.map((line) => (
                <path
                  key={line.d}
                  d={line.d}
                  pathLength={1}
                  className="story-line"
                  strokeWidth={line.w}
                  style={{ "--s": line.s, "--e": line.e } as Timed}
                />
              ))}
            </g>
            {stage.map((line) => (
              <path
                key={line.d}
                d={line.d}
                pathLength={1}
                className="story-line"
                strokeWidth={line.w}
                style={{ "--s": line.s, "--e": line.e } as Timed}
              />
            ))}
          </svg>
        </div>
      </div>
    </ScrollScene>
  );
}
