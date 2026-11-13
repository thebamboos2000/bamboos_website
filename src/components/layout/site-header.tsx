"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { enquiryHref, primaryNavigation } from "@/config/navigation";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

function isCurrent(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Quiet by default: transparent over each page's full-screen opening photograph, then a slim bar
 * that steps aside while reading and returns as soon as the visitor scrolls up.
 */
export function SiteHeader({ whatsappHref }: { whatsappHref: string | null }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // Contact opens split in two, so the header needs its own ground from the start.
  const alwaysSolid = pathname === "/contact";
  const [solid, setSolid] = useState(alwaysSolid);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const update = () => {
      const y = window.scrollY;
      setSolid(alwaysSolid || y > (isHome ? window.innerHeight * 0.55 : 32));
      if (y <= window.innerHeight || y < last - 2) setHidden(false);
      else if (y > last + 2) setHidden(true);
      last = y;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [isHome, alwaysSolid]);

  return (
    <header
      data-solid={solid}
      data-hidden={hidden}
      data-brand={isHome && !solid ? "intro" : undefined}
      className="site-header fixed inset-x-0 top-0 z-40"
    >
      <div className="shell relative flex h-(--header-h) items-center justify-between gap-3">
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-7">
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="nav-link"
                  aria-current={isCurrent(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="xl:hidden">
          <MobileMenu pathname={pathname} whatsappHref={whatsappHref} />
        </div>

        <Logo className="site-logo absolute left-1/2 -translate-x-1/2" />

        <Link href={enquiryHref} className="header-cta">
          Enquire
        </Link>
      </div>
    </header>
  );
}
