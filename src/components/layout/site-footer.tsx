import Link from "next/link";
import { formatPhone } from "@/lib/utils";
import { InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Reveal } from "@/components/motion/reveal";
import { showsVenuePhotos, venuePhotoPreview } from "@/config/venue-photos";
import { Pending } from "@/components/ui/pending";
import { business } from "@/config/business";
import { contact } from "@/config/contact";
import { legalNavigation, primaryNavigation } from "@/config/navigation";
import { socialLinks } from "@/config/social";
import { buildWhatsAppUrl, GENERAL_ENQUIRY_TEXT } from "@/services/whatsapp";

export function SiteFooter() {
  const { address } = business;

  return (
    <footer className="on-dark relative overflow-hidden border-t border-champagne-500/30 bg-forest-950">
      <div className="shell grid gap-12 pt-20 pb-12 md:grid-cols-12 md:pt-28">
        <Reveal className="md:col-span-5">
          <p className="type-statement max-w-[14ch]">
            An auditorium for the days that <em>matter most</em>
          </p>
        </Reveal>

        <Reveal as="nav" aria-label="Footer" delay={100} className="md:col-span-3">
          <h2 className="type-eyebrow mb-5 text-champagne-400">Explore</h2>
          <ul>
            {primaryNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={200} className="md:col-span-4">
          <h2 className="type-eyebrow mb-5 text-champagne-400">Visit and contact</h2>
          <address className="not-italic">
            {address.streetAddress ? (
              <p>{address.streetAddress}</p>
            ) : (
              <p>
                <Pending>Street address to be confirmed</Pending>
              </p>
            )}
            <p className="mt-1">
              {address.addressLocality}, {business.district}, {address.addressRegion}
              {address.postalCode && ` ${address.postalCode}`}
            </p>
          </address>
          <ul className="mt-5 space-y-1">
            <li>
              {contact.phoneE164 ? (
                <a href={`tel:${contact.phoneE164}`} className="nav-link gap-2.5">
                  <PhoneIcon size={16} className="flex-none text-champagne-400" />
                  {formatPhone(contact.phoneE164)}
                </a>
              ) : (
                <Pending>Phone to be confirmed</Pending>
              )}
            </li>
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="nav-link">
                  {contact.email}
                </a>
              </li>
            )}
            {!contact.whatsappNumber && (
              <li>
                <Pending>WhatsApp to be confirmed</Pending>
              </li>
            )}
          </ul>

          {/* Logos only. Each link is still named for screen readers and shows its name on hover. */}
          <ul aria-label="Chat and follow" className="mt-4 flex items-center gap-3">
            {contact.whatsappNumber && (
              <li>
                <a
                  href={buildWhatsAppUrl(contact.whatsappNumber, GENERAL_ENQUIRY_TEXT)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  title="Chat on WhatsApp"
                  className="icon-link"
                >
                  <WhatsAppIcon size={22} className="flex-none text-whatsapp-500" />
                </a>
              </li>
            )}
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="icon-link"
                >
                  {link.label === "Instagram" ? <InstagramIcon size={22} /> : link.label}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="shell flex flex-wrap justify-between gap-x-8 gap-y-2 pb-8 text-[0.8125rem] text-ivory-100/75">
        <p>
          An enquiry is not a booking. Only BAMBOOS staff can confirm a booking.{" "}
          {showsVenuePhotos
            ? "Images marked as illustrative are stock photographs and don't show BAMBOOS, its facilities or its events."
            : "Photographs on this site are illustrative stock images and don't show BAMBOOS, its facilities or its events."}
          {venuePhotoPreview && " Local preview: the venue photographs shown here are not cleared for publication."}
        </p>
        <p>© {business.legalName ?? business.name}</p>
      </div>

      <Reveal effect="lines" atPageEnd>
        <span className="mask-line">
          <span style={{ "--i": 0 } as React.CSSProperties}>
            <svg
              aria-hidden="true"
              viewBox="0 0 1000 160"
              className="pointer-events-none block w-full select-none fill-forest-800"
            >
              <text
                x="500"
                y="142"
                textAnchor="middle"
                textLength="970"
                lengthAdjust="spacing"
                fontSize="205"
                className="font-display"
              >
                BAMBOOS
              </text>
            </svg>
          </span>
        </span>
      </Reveal>
    </footer>
  );
}
