"use client";

import { useEffect } from "react";
import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";
import { enquiryHref } from "@/config/navigation";

export default function SiteError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="on-dark min-h-[80svh] bg-forest-950">
      <div className="shell pt-[calc(var(--header-h)+5rem)] pb-20">
        <Eyebrow className="mb-6 text-champagne-400">Something went wrong</Eyebrow>
        <h1 className="type-title max-w-[18ch]">This page couldn&apos;t be displayed.</h1>
        <p className="type-lead mt-6 max-w-[48ch]">
          Please try again. If it keeps happening, you can still reach us through the enquiry page.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => retry()} className={buttonClasses("gold")}>
            Try again
          </button>
          <Link href={enquiryHref} className={buttonClasses("line")}>
            Go to enquiries
          </Link>
        </div>
      </div>
    </section>
  );
}
