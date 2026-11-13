import { cn } from "@/lib/utils";

/**
 * Marks a business fact BAMBOOS has not verified yet. Launch is blocked while
 * any required fact is pending, so this should never appear in production.
 */
export function Pending({
  className,
  children = "To be confirmed",
}: {
  className?: string;
  children?: string;
}) {
  return (
    <span
      data-pending="true"
      className={cn(
        "inline-block border-b border-dashed border-current pb-px text-[0.8125rem] font-medium tracking-wide",
        className,
      )}
    >
      {children}
    </span>
  );
}
