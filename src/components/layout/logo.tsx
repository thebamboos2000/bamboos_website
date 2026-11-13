import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * A typographic wordmark, standing in until BAMBOOS supplies its official logo.
 * The small arch is the site's motif: the threshold.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="BAMBOOS Auditorium, home"
      className={cn("inline-flex min-h-11 flex-col items-center justify-center gap-1", className)}
    >
      <svg aria-hidden="true" width="15" height="19" viewBox="0 0 20 26" fill="none">
        <path
          d="M1 25V10a9 9 0 0 1 18 0v15M10 25V1"
          stroke="var(--color-champagne-500)"
          strokeWidth="1.5"
        />
      </svg>
      <span className="font-display text-[clamp(0.9375rem,4.6vw,1.125rem)] leading-none tracking-[0.3em] [margin-right:-0.3em] sm:text-[1.25rem]">
        BAMBOOS
      </span>
    </Link>
  );
}
