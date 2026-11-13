"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/icons";
import { Pending } from "@/components/ui/pending";
import { eventTypeLabel } from "@/config/event-types";
import type { Enquiry } from "@/schemas/enquiry";
import {
  ENQUIRY_DETAILS_HEADING,
  formatEnquiryDate,
  type EnquiryHandoff,
} from "@/services/enquiry-handoff";

/** Long enough to absorb a double click, short enough to retry if WhatsApp didn't open. */
export const WHATSAPP_REOPEN_DELAY_MS = 4000;

/** Shows the message as staff will read it, with WhatsApp's bold markers rendered as bold. */
function MessagePreview({ message }: { message: string }) {
  const at = message.indexOf(ENQUIRY_DETAILS_HEADING);
  return (
    <div className="mt-3 bg-forest-950 p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1 text-ivory-50">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <span className="text-whatsapp-500">
            <WhatsAppIcon />
          </span>
          WhatsApp
        </span>
        <span className="rounded-full bg-forest-800 px-3 py-1 text-xs font-medium text-ivory-100">
          Message preview
        </span>
      </div>
      <p
        data-testid="message-preview"
        className="rounded-xl bg-whatsapp-100 p-4 text-sm leading-relaxed break-words whitespace-pre-wrap text-forest-950"
      >
        {message.slice(0, at)}
        <strong className="font-semibold">{ENQUIRY_DETAILS_HEADING.slice(1, -1)}</strong>
        {message.slice(at + ENQUIRY_DETAILS_HEADING.length)}
      </p>
    </div>
  );
}

interface EnquiryReviewProps {
  enquiry: Enquiry;
  handoff: EnquiryHandoff;
  onEdit: () => void;
}

export function EnquiryReview({ enquiry, handoff, onEdit }: EnquiryReviewProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [copyStatus, setCopyStatus] = useState("");
  const [opened, setOpened] = useState(false);
  const [opening, setOpening] = useState(false);
  // State only updates after a render, so a fast double click needs a ref to catch it.
  const reopenTimer = useRef<number | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
    return () => {
      if (reopenTimer.current !== null) window.clearTimeout(reopenTimer.current);
    };
  }, []);

  const openWhatsApp = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reopenTimer.current !== null) {
      event.preventDefault();
      return;
    }
    setOpened(true);
    setOpening(true);
    reopenTimer.current = window.setTimeout(() => {
      reopenTimer.current = null;
      setOpening(false);
    }, WHATSAPP_REOPEN_DELAY_MS);
  };

  const details: [string, string][] = [
    ["Name", enquiry.name],
    ["Phone", enquiry.phone],
    ["Event type", eventTypeLabel(enquiry.eventType)],
    ["Preferred date", formatEnquiryDate(enquiry.preferredDate)],
    ["Expected guests", String(enquiry.guestCount)],
    ...(enquiry.message ? ([["Message", enquiry.message]] as [string, string][]) : []),
  ];

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(handoff.message);
      setCopyStatus("Message copied.");
    } catch {
      setCopyStatus("Your browser blocked copying. Please select the message and copy it manually.");
    }
  };

  return (
    <div>
      <h2 ref={headingRef} tabIndex={-1} className="type-statement outline-none">
        Please check your details
      </h2>

      <dl className="mt-6 border-t border-forest-900/25">
        {details.map(([label, value]) => (
          <div
            key={label}
            className="grid gap-1 border-b border-forest-900/25 py-3.5 sm:grid-cols-[10rem_1fr] sm:gap-4"
          >
            <dt className="text-sm text-stone-600">{label}</dt>
            <dd className="break-words whitespace-pre-wrap">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <h3 className="text-sm font-semibold">The message you will send</h3>
        <MessagePreview message={handoff.message} />
      </div>

      <p className="mt-6 border-l-2 border-champagne-500 pl-4 text-sm leading-relaxed">
        <strong className="font-semibold">This is an enquiry, not a booking.</strong> Your date
        isn&apos;t reserved. Only BAMBOOS staff can confirm a booking.
      </p>

      {handoff.ok && (
        <p className="mt-4 border-l-2 border-champagne-500 pl-4 text-sm leading-relaxed">
          <strong className="font-semibold">One more step.</strong> The button below opens WhatsApp
          with your message ready. Your enquiry reaches BAMBOOS only when you press Send inside
          WhatsApp.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {handoff.ok ? (
          <a
            href={handoff.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={openWhatsApp}
            aria-disabled={opening || undefined}
            className={buttonClasses("whatsapp")}
          >
            <WhatsAppIcon />
            <span>{opening ? "Opening WhatsApp…" : "Send Enquiry via WhatsApp"}</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <p className="max-w-[46ch] text-sm leading-relaxed">
            <Pending>WhatsApp number to be confirmed</Pending>
            <span className="mt-2 block">
              Our WhatsApp line isn&apos;t available here yet, so this enquiry can&apos;t be sent from
              this page.
            </span>
          </p>
        )}
        <button type="button" onClick={onEdit} className={buttonClasses("line")}>
          Edit details
        </button>
      </div>

      <div aria-live="polite">
        {opened && (
          <p className="mt-4 text-sm leading-relaxed text-stone-600">
            Your enquiry hasn&apos;t been sent yet. Press Send in WhatsApp to reach us. If WhatsApp
            didn&apos;t open, try the button again or copy your message.
          </p>
        )}
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={copyMessage}
          className="min-h-11 text-sm font-medium underline underline-offset-4"
        >
          Copy my message
        </button>
        <p role="status" className="min-h-6 text-sm">
          {copyStatus}
        </p>
      </div>
    </div>
  );
}
