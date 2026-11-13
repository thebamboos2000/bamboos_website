import type { ReactNode } from "react";
import { contact } from "@/config/contact";
import { buildWhatsAppUrl, GENERAL_ENQUIRY_TEXT } from "@/services/whatsapp";
import { MotionField } from "@/components/motion/motion-field";
import { PageTransition } from "./page-transition";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export function SiteChrome({ children }: { children: ReactNode }) {
  const whatsappHref = contact.whatsappNumber
    ? buildWhatsAppUrl(contact.whatsappNumber, GENERAL_ENQUIRY_TEXT)
    : null;

  return (
    <>
      <a
        href="#main"
        className="btn btn-gold sr-only z-50 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <MotionField />
      <span aria-hidden="true" className="scroll-progress" />
      <SiteHeader whatsappHref={whatsappHref} />
      <PageTransition>{children}</PageTransition>
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="floating-whatsapp btn btn-gold fixed right-4 bottom-4 z-30 min-h-11 px-4 py-2 lg:hidden"
        >
          WhatsApp
        </a>
      )}
      <SiteFooter />
    </>
  );
}
