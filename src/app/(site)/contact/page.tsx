import { business } from "@/config/business";
import { contact } from "@/config/contact";
import { getVenue } from "@/content/venue";
import { ContactDetails, LocationSection } from "@/features/contact";
import { EnquirySection } from "@/features/enquiries/form";
import { buildVenueJsonLd, JsonLd } from "@/lib/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Contact and Booking Enquiries",
  description:
    "Send a booking enquiry to BAMBOOS in Aluva, Kerala, and continue the conversation on WhatsApp. An enquiry is not a confirmed booking.",
  path: "/contact",
});

export default async function ContactPage() {
  const venue = await getVenue();
  const jsonLd = buildVenueJsonLd(business, contact, null);

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <EnquirySection
        whatsappNumber={contact.whatsappNumber}
        visual={venue.pageVisuals.contact}
        directContact={<ContactDetails contact={contact} />}
        aside={
          <div className="mt-10">
            <h2 className="type-eyebrow mb-4 text-champagne-700">Reach us directly</h2>
            <ContactDetails contact={contact} />
          </div>
        }
      />
      <LocationSection business={business} visual={venue.locationVisual} />
    </>
  );
}
