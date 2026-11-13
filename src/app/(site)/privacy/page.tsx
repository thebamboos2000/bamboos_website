import { PageHero } from "@/components/layout/page-hero";
import { Pending } from "@/components/ui/pending";
import { contact } from "@/config/contact";
import { business } from "@/config/business";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacy Notice",
  description: "How the BAMBOOS website handles the details you enter in the enquiry form.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy notice" />
      <section className="section">
        <div className="shell max-w-[52rem] space-y-10">
          <p className="border-l-2 border-champagne-500 pl-4">
            <Pending>Draft, awaiting review by BAMBOOS and its legal adviser</Pending>
          </p>

          <div>
            <h2 className="type-subheading">What the enquiry form does</h2>
            <p className="mt-3 text-stone-600">
              The form asks for your name, phone number, type of event, preferred date, expected
              guest count and, if you choose, a message. It uses these only to prepare a WhatsApp
              message for you to review.
            </p>
          </div>

          <div>
            <h2 className="type-subheading">Where your details go</h2>
            <p className="mt-3 text-stone-600">
              This website doesn&apos;t store your enquiry or send it to a server of ours. Your
              details stay in your browser until you choose Continue to WhatsApp. That opens
              WhatsApp with your message ready, and it reaches BAMBOOS only if you press Send.
              WhatsApp&apos;s own terms and privacy policy apply there.
            </p>
          </div>

          <div>
            <h2 className="type-subheading">After you send a message</h2>
            <p className="mt-3 text-stone-600">
              BAMBOOS staff receive your message on WhatsApp and use it to respond to your enquiry.
              An enquiry is not a booking, and only BAMBOOS staff can confirm a booking.
            </p>
          </div>

          <div>
            <h2 className="type-subheading">Third-party content</h2>
            <p className="mt-3 text-stone-600">
              Any maps or videos from third parties load only after you choose to view them.
            </p>
          </div>

          <div>
            <h2 className="type-subheading">Contact about your data</h2>
            <p className="mt-3 text-stone-600">
              To ask about or request deletion of details you have shared with{" "}
              {business.legalName ?? business.name}, contact us at:
            </p>
            <p className="mt-3">
              {contact.email ?? <Pending>Privacy contact to be confirmed</Pending>}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
