"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Arrow, buttonClasses } from "@/components/ui/button";
import { enquiryHref, primaryNavigation } from "@/config/navigation";

export function MobileMenu({
  pathname,
  whatsappHref,
}: {
  pathname: string;
  whatsappHref: string | null;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const close = () => dialogRef.current?.close();

  // Close after navigating, including browser back and forward.
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          dialogRef.current?.showModal();
          setOpen(true);
        }}
        className="flex min-h-11 min-w-11 items-center gap-3"
      >
        <span aria-hidden="true" className="flex w-6 flex-col gap-[7px]">
          <span className="h-px w-full bg-current" />
          <span className="h-px w-2/3 bg-current" />
        </span>
        <span className="type-eyebrow max-sm:sr-only">Menu</span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Menu"
        onClose={() => {
          setOpen(false);
          // Safari doesn't focus buttons on click, so restore focus explicitly.
          triggerRef.current?.focus();
        }}
        className="menu-dialog"
      >
        <svg
          aria-hidden="true"
          className="menu-arch pointer-events-none absolute inset-x-0 bottom-0 h-[78%] w-full text-champagne-500"
          viewBox="0 0 400 600"
          preserveAspectRatio="xMidYMax meet"
          fill="none"
          stroke="currentColor"
        >
          <path pathLength={1} d="M40 600V200a160 160 0 0 1 320 0v400" />
          <path pathLength={1} d="M80 600V210a120 120 0 0 1 240 0v390" strokeOpacity="0.5" />
        </svg>

        <div className="shell relative flex min-h-full flex-col pb-8">
          <div className="flex h-(--header-h) flex-none items-center justify-between">
            <span className="font-display text-[1.125rem] tracking-[0.3em]">BAMBOOS</span>
            <button
              type="button"
              onClick={close}
              className="type-eyebrow flex min-h-11 min-w-11 items-center justify-end"
            >
              Close
            </button>
          </div>

          <nav aria-label="Menu" className="flex flex-1 flex-col justify-center py-8">
            <ul className="space-y-1 text-center">
              {primaryNavigation.map((item, index) => (
                <li
                  key={item.href}
                  className="menu-item"
                  style={{ "--i": index } as React.CSSProperties}
                >
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="block py-2 font-display text-[clamp(1.75rem,8vw,3rem)] leading-tight font-light tracking-[0.02em] uppercase aria-[current=page]:text-champagne-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className="menu-item flex flex-col gap-3"
            style={{ "--i": primaryNavigation.length } as React.CSSProperties}
          >
            <Link href={enquiryHref} onClick={close} className={buttonClasses("gold", "w-full")}>
              <span>Begin your enquiry</span>
              <Arrow />
            </Link>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClasses("line", "w-full")}
              >
                Chat on WhatsApp
              </a>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
