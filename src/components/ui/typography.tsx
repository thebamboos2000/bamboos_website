import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("shell", className)}>{children}</div>;
}

export function Eyebrow({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <p className={cn("type-eyebrow flex items-center gap-4", className)}>
      <span aria-hidden="true" className="h-px w-8 flex-none bg-current opacity-60" />
      <span>{children}</span>
    </p>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  as?: "h1" | "h2";
  size?: "title" | "heading";
  className?: string;
  eyebrowClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  as: Tag = "h2",
  size = "title",
  className,
  eyebrowClassName,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <Eyebrow className={cn("mb-6 md:mb-8", eyebrowClassName)}>{eyebrow}</Eyebrow>
      <Tag className={size === "title" ? "type-title" : "type-heading"}>{title}</Tag>
    </div>
  );
}
