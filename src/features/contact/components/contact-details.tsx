import { Reveal } from "@/components/motion/reveal";
import { formatPhone } from "@/lib/utils";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";
import { Pending } from "@/components/ui/pending";
import { buildWhatsAppUrl, GENERAL_ENQUIRY_TEXT } from "@/services/whatsapp";
import type { ContactInfo } from "@/types/domain";

/** Direct contact options: plain links in the static HTML, so they work without JavaScript. */
export function ContactDetails({ contact }: { contact: ContactInfo }) {
  return (
    <dl className="border-t border-current/25">
      <Reveal delay={0} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-current/25 py-3">
        <dt>Phone</dt>
        <dd>
          {contact.phoneE164 ? (
            <a href={`tel:${contact.phoneE164}`} className="nav-link gap-2">
              <PhoneIcon size={15} className="flex-none text-champagne-700" />
              {formatPhone(contact.phoneE164)}
            </a>
          ) : (
            <Pending />
          )}
        </dd>
      </Reveal>
      <Reveal delay={80} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-current/25 py-3">
        <dt>WhatsApp</dt>
        <dd>
          {contact.whatsappNumber ? (
            <a
              href={buildWhatsAppUrl(contact.whatsappNumber, GENERAL_ENQUIRY_TEXT)}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link gap-2"
            >
              <WhatsAppIcon size={15} className="flex-none text-[#128c4a]" />
              Chat with us
            </a>
          ) : (
            <Pending />
          )}
        </dd>
      </Reveal>
      {contact.email && (
        <Reveal delay={160} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-current/25 py-3">
          <dt>Email</dt>
          <dd>
            <a href={`mailto:${contact.email}`} className="nav-link">
              {contact.email}
            </a>
          </dd>
        </Reveal>
      )}
      <Reveal delay={240} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-current/25 py-3">
        <dt>Enquiry hours</dt>
        <dd>{contact.enquiryHours ?? <Pending />}</dd>
      </Reveal>
    </dl>
  );
}
