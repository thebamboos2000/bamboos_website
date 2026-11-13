import { describe, expect, it } from "vitest";
import { createEnquiryFormSchema, enquirySchema, localIsoDate } from "./enquiry";

const valid = {
  name: "Test Visitor",
  phone: "+91 00000 00000",
  eventType: "wedding",
  preferredDate: "2027-02-14",
  guestCount: "500",
};

const errorFor = (input: unknown, field: string) => {
  const result = enquirySchema.safeParse(input);
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path[0] === field)?.message;
};

describe("enquirySchema", () => {
  it("accepts a complete enquiry and coerces the guest count", () => {
    const result = enquirySchema.parse({
      ...valid,
      preferredDate: "2027-02-14",
      guestCount: "500",
      message: "We would like details.",
    });
    expect(result.guestCount).toBe(500);
    expect(result.preferredDate).toBe("2027-02-14");
  });

  it("treats a blank message as absent", () => {
    expect(enquirySchema.parse({ ...valid, message: "" }).message).toBeUndefined();
  });

  it.each(["", undefined])("requires a preferred date, rejecting %j", (preferredDate) => {
    expect(errorFor({ ...valid, preferredDate }, "preferredDate")).toBe(
      "Please choose your preferred event date",
    );
  });

  it.each(["", undefined])("requires a guest count, rejecting %j", (guestCount) => {
    expect(errorFor({ ...valid, guestCount }, "guestCount")).toBe(
      "Please enter the expected number of guests",
    );
  });

  it.each(["", " ", "A"])("rejects the name %j", (name) => {
    expect(errorFor({ ...valid, name }, "name")).toBe("Please enter your name");
  });

  it("rejects a name that is too long", () => {
    expect(errorFor({ ...valid, name: "a".repeat(81) }, "name")).toMatch(/under 80/);
  });

  it("trims and removes control characters, keeping real text", () => {
    const result = enquirySchema.parse({ ...valid, name: "  As\u0007ha വി  " });
    expect(result.name).toBe("Asha വി");
  });

  it("keeps line breaks in messages", () => {
    const result = enquirySchema.parse({ ...valid, message: "line 1\nline 2" });
    expect(result.message).toBe("line 1\nline 2");
  });

  it.each(["+91 98765 43210", "9876543210", "+971 50 123 4567", "+1 (415) 555-0100", "04842 123456"])(
    "accepts the phone number %s",
    (phone) => {
      expect(enquirySchema.safeParse({ ...valid, phone }).success).toBe(true);
    },
  );

  it.each(["", "abc", "12345", "+91 98765 43210 98765 43210", "98765<script>", "((((((((", "--------", "1234567890123456"])(
    "rejects the phone number %j",
    (phone) => {
      expect(errorFor({ ...valid, phone }, "phone")).toMatch(/valid phone number/);
    },
  );

  it.each(["", "ballroom", undefined])("rejects the event type %j", (eventType) => {
    expect(errorFor({ ...valid, eventType }, "eventType")).toBe("Please choose the type of event");
  });

  it.each(["14/02/2027", "2027-13-01", "2027-02-30", "tomorrow"])("rejects the date %s", (preferredDate) => {
    expect(errorFor({ ...valid, preferredDate }, "preferredDate")).toBe("Please enter a valid date");
  });

  it.each([
    ["0", /at least 1/],
    ["-5", /at least 1/],
    ["12.5", /whole number/],
    ["100001", /smaller number/],
    ["lots", /number of guests/],
  ])("rejects the guest count %s", (guestCount, message) => {
    expect(errorFor({ ...valid, guestCount }, "guestCount")).toMatch(message);
  });

  it("limits messages to 300 characters", () => {
    expect(errorFor({ ...valid, message: "a".repeat(301) }, "message")).toMatch(/under 300/);
    expect(enquirySchema.safeParse({ ...valid, message: "a".repeat(300) }).success).toBe(true);
  });

  it("drops unknown fields", () => {
    expect(enquirySchema.parse({ ...valid, admin: true })).not.toHaveProperty("admin");
  });
});

describe("createEnquiryFormSchema", () => {
  const schema = createEnquiryFormSchema("2027-01-10");

  it("rejects a past date", () => {
    const result = schema.safeParse({ ...valid, preferredDate: "2027-01-09" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/not in the past/);
  });

  it.each(["2027-01-10", "2027-01-11"])("accepts %s", (preferredDate) => {
    expect(schema.safeParse({ ...valid, preferredDate }).success).toBe(true);
  });

  it("requires a date", () => {
    expect(schema.safeParse({ ...valid, preferredDate: "" }).success).toBe(false);
  });
});

describe("localIsoDate", () => {
  it("uses local calendar fields and pads them", () => {
    expect(localIsoDate(new Date(2027, 0, 5, 23, 59))).toBe("2027-01-05");
  });
});
