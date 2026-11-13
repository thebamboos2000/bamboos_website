import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { SiteChrome } from "@/components/layout/site-chrome";
import { ButtonLink, TextLink } from "@/components/ui/button";
import { enquiryHref } from "@/config/navigation";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <SiteChrome>
      <PageHero
        eyebrow="404"
        size="lg"
        title={
          <>
            This door <em>doesn&apos;t</em> lead anywhere
          </>
        }
        lead={
          <>
            <p>The page you were looking for isn&apos;t here. These might help instead.</p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <ButtonLink href="/">Back to home</ButtonLink>
              <TextLink href={enquiryHref} className="self-start sm:self-auto">
                Send an enquiry
              </TextLink>
            </div>
          </>
        }
        className="min-h-svh"
      />
    </SiteChrome>
  );
}
