import { z } from "zod";
import { EVENT_TYPE_IDS } from "@/config/event-types";

// Zod otherwise probes for eval support, which our Content Security Policy blocks and reports.
z.config({ jitless: true });

// Removes control characters and trims. The result stays plain text, which is
// encoded for its output context rather than stripped of "unsafe" characters.
const cleanText = (max: number, tooLong: string) =>
  z
    .string()
    .transform((value) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim())
    .pipe(z.string().max(max, tooLong));

// Blank HTML inputs submit "". Without this, a blank optional field fails validation.
const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const invalidPhone = "Please enter a valid phone number, with the country code if you are outside India";

export const enquirySchema = z.object({
  name: cleanText(80, "Please keep your name under 80 characters").pipe(
    z.string().min(2, "Please enter your name"),
  ),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s()-]{8,20}$/, invalidPhone)
    // The international maximum is 15 digits, and punctuation alone isn't a number.
    .refine((value) => /^\d{8,15}$/.test(value.replace(/\D/g, "")), invalidPhone),
  eventType: z.enum(EVENT_TYPE_IDS, { error: "Please choose the type of event" }),
  preferredDate: z
    .string({ error: "Please choose your preferred event date" })
    .min(1, "Please choose your preferred event date")
    .pipe(z.iso.date({ error: "Please enter a valid date" })),
  guestCount: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number({ error: "Please enter the expected number of guests" })
      .int("Please enter a whole number of guests")
      .min(1, "Please enter at least 1 guest")
      .max(100000, "Please enter a smaller number of guests"),
  ),
  message: z.preprocess(
    emptyToUndefined,
    cleanText(300, "Please keep your message under 300 characters").optional(),
  ),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

/** The visitor's local date as YYYY-MM-DD. */
export function localIsoDate(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/** Browser form rules: the shared schema plus a check that depends on the visitor's "today". */
export function createEnquiryFormSchema(today: string) {
  return enquirySchema.refine(
    (enquiry) => enquiry.preferredDate >= today,
    { path: ["preferredDate"], message: "Please choose a date that is not in the past" },
  );
}
