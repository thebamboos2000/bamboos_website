import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "gold" | "forest" | "line" | "whatsapp";

export function buttonClasses(variant: ButtonVariant = "gold", className?: string) {
  return cn("btn", `btn-${variant}`, className);
}

export function Arrow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("btn-arrow", className)}
      width="22"
      height="10"
      viewBox="0 0 22 10"
      fill="none"
    >
      <path d="M0 5h20.5M16.5 1l4 4-4 4" stroke="currentColor" />
    </svg>
  );
}

interface ButtonLinkProps {
  href: Route;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ href, variant = "gold", className, children }: ButtonLinkProps) {
  return (
    <Link href={href} className={buttonClasses(variant, className)}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}

export function TextLink({
  href,
  className,
  children,
}: {
  href: Route;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn("link-line", className)}>
      <span>{children}</span>
      <Arrow />
    </Link>
  );
}
