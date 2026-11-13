import { describe, expect, it } from "vitest";
import type { Enquiry } from "@/schemas/enquiry";
import { formatEnquiryDate, formatEnquiryMessage, prepareEnquiryHandoff } from "./enquiry-handoff";
import { MAX_WHATSAPP_URL_LENGTH } from "./whatsapp";

const NUMBER = "910000000000";

const enquiry = (overrides: Partial<Enquiry> = {}): Enquiry => ({
  name: "Test Visitor",
  phone: "+91 00000 00000",
  eventType: "wedding",
  preferredDate: "2027-02-14",
  guestCount: 500,
  message: undefined,
  ...overrides,
});

describe("formatEnquiryDate", () => {
  it("is unambiguous", () => {
    expect(formatEnquiryDate("2027-02-14")).toBe("14 February 2027");
  });
});

describe("formatEnquiryMessage", () => {
  it("uses the agreed format, with the visitor's own details", () => {
    expect(formatEnquiryMessage(enquiry({ message: "Please share your wedding packages." }))).toBe(
      [
        "Hello BAMBOOS Team!",
        "",
        "I would like to enquire about hosting an event at your auditorium.",
        "",
        "*EVENT ENQUIRY DETAILS*",
        "Name: Test Visitor",
        "Phone: +91 00000 00000",
        "Event Type: Wedding",
        "Preferred Date: 14 February 2027",
        "Expected Guests: 500",
        "",
        "Additional Message:",
        "Please share your wedding packages.",
        "",
        "Please share the availability, packages and further details.",
        "",
        "Thank you!",
      ].join("\n"),
    );
  });

  it("leaves out the message section when the message is empty", () => {
    const message = formatEnquiryMessage(enquiry());
    expect(message).not.toMatch(/Additional Message|undefined/);
    expect(message).toContain("Expected Guests: 500\n\nPlease share the availability");
  });
});

describe("prepareEnquiryHandoff", () => {
  it("returns a link that decodes to the message", () => {
    const result = prepareEnquiryHandoff(enquiry({ message: "വി & more" }), NUMBER);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const url = new URL(result.url);
    expect(url.pathname).toBe(`/${NUMBER}`);
    expect(url.searchParams.get("text")).toBe(result.message);
  });

  it.each([null, "", "123"])("reports a missing or implausible number: %j", (number) => {
    const result = prepareEnquiryHandoff(enquiry(), number);
    expect(result).toMatchObject({ ok: false, reason: "whatsapp-not-configured" });
    expect(result.message).toContain("Name: Test Visitor");
  });

  it("preserves spaces, special characters and Malayalam in the link", () => {
    const text = "വിവാഹം 100% & more? #1 = yes + \u{1F389}\nരണ്ടാം വരി";
    const result = prepareEnquiryHandoff(enquiry({ message: text, name: "അഞ്ജലി & Co" }), NUMBER);
    if (!result.ok) throw new Error("expected a link");
    const url = new URL(result.url);
    expect(url.search).not.toMatch(/\s|വ/);
    expect(url.searchParams.get("text")).toBe(result.message);
    expect(result.message).toContain(text);
    expect(result.message).toContain("Name: അഞ്ജലി & Co");
  });

  it("fits a maximum-length enquiry in Malayalam within the budget", () => {
    const result = prepareEnquiryHandoff(
      enquiry({
        name: "വ".repeat(80),
        phone: "+91 00000 00000 0000",
        eventType: "birthday",
        preferredDate: "2027-09-14",
        guestCount: 100000,
        message: "വ".repeat(300),
      }),
      NUMBER,
    );
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.url.length).toBeLessThanOrEqual(MAX_WHATSAPP_URL_LENGTH);
  });

  it("rejects a link over budget", () => {
    const result = prepareEnquiryHandoff(enquiry({ message: "വ".repeat(5000) }), NUMBER);
    expect(result).toMatchObject({ ok: false, reason: "message-too-long" });
  });
});
