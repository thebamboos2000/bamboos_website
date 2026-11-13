import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { IllustrativeTag, VisualFrame } from "@/components/media/visual-frame";
import type { Visual } from "@/types/domain";
import { EnquiryForm } from "./enquiry-form";

/**
 * The form reads ?event= on the client, so the static HTML holds this fallback.
 * It therefore carries direct contact options and reserves the form's height.
 */
function FormFallback({ directContact }: { directContact: ReactNode }) {
  return (
    <div className="min-h-[46rem] md:min-h-[38rem]">
      <p className="type-subheading">Loading the enquiry form</p>
      <p className="mt-4 max-w-[48ch] text-stone-600">
        The form needs JavaScript. If it doesn&apos;t appear, you can reach us directly:
      </p>
      <div className="mt-4">{directContact}</div>
    </div>
  );
}

interface EnquirySectionProps {
  whatsappNumber: string | null;
  /** Direct contact options, composed by the route. */
  directContact: ReactNode;
  visual: Visual;
  aside?: ReactNode;
}

/**
 * Enquiring is a private moment, so the page divides in two: the room stays in
 * view on one side while the visitor writes on the other.
 */
export function EnquirySection({ whatsappNumber, directContact, visual, aside }: EnquirySectionProps) {
  return (
    <div className="grid bg-ivory-50 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <section className="relative isolate flex min-h-[72svh] overflow-hidden bg-forest-950 text-ivory-50 lg:sticky lg:top-0 lg:h-svh">
        <VisualFrame
          visual={visual}
          sizes="half"
          priority
          compact
          className="hero-media absolute! inset-0 -z-20 size-full"
        />
        <div aria-hidden="true" className="floor-shade absolute inset-0 -z-10" />
        {visual.kind === "image" && visual.asset.illustrative && (
          <IllustrativeTag className="top-[calc(var(--header-h)+0.5rem)] right-2" />
        )}
        <div className="flex flex-col justify-end px-(--gutter) pb-[clamp(2.5rem,5vw,4.5rem)]">
          <p className="type-eyebrow hero-copy text-champagne-300">Contact</p>
          <h1 className="type-statement-lg mt-4">
            Begin <em>the conversation</em>
          </h1>
          <p className="mt-5 max-w-[38ch] text-ivory-100">
            Tell us what you&apos;re planning, and we&apos;ll help you work out whether BAMBOOS is
            the right place for it.
          </p>
        </div>
      </section>

      <section
        id="enquiry"
        aria-label="Booking enquiry"
        className="px-(--gutter) py-[clamp(4rem,8vw,7rem)] lg:px-[clamp(3rem,7vw,7rem)]"
      >
        <Suspense fallback={<FormFallback directContact={directContact} />}>
          <EnquiryForm whatsappNumber={whatsappNumber} />
        </Suspense>

        <div className="mt-12 grid gap-8 border-t border-forest-900/15 pt-8 text-[0.9375rem] leading-relaxed text-stone-600 md:grid-cols-2">
          <p>
            <strong className="font-semibold text-forest-900">An enquiry is not a booking.</strong>{" "}
            It starts a conversation, and only BAMBOOS staff can confirm a booking.
          </p>
          <p>
            Your details stay in your browser until you open WhatsApp and press Send. See our{" "}
            <Link href="/privacy" className="underline underline-offset-2">
              privacy notice
            </Link>
            .
          </p>
        </div>
        {aside}
      </section>
    </div>
  );
}
