import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl, normaliseWhatsAppNumber } from "./whatsapp";

describe("normaliseWhatsAppNumber", () => {
  it.each([
    ["+91 00000-00000", "910000000000"],
    ["(91) 00000 00000", "910000000000"],
    ["00910000000000", "910000000000"],
  ])("normalises %s", (input, expected) => {
    expect(normaliseWhatsAppNumber(input)).toBe(expected);
  });
});

describe("buildWhatsAppUrl", () => {
  it("follows the documented format", () => {
    expect(buildWhatsAppUrl("+91 00000-00000")).toBe("https://wa.me/910000000000");
  });

  it("omits text when there is none", () => {
    expect(buildWhatsAppUrl("910000000000", "")).not.toContain("?");
  });

  it.each([
    "a & b",
    "line 1\nline 2",
    "100% + #1? =yes",
    "വിവാഹം \u{1F389}",
    "already%20encoded",
    "<script>alert(1)</script>",
  ])("round-trips %j", (text) => {
    const url = new URL(buildWhatsAppUrl("910000000000", text));
    expect(url.searchParams.get("text")).toBe(text);
    expect(url.origin).toBe("https://wa.me");
  });

  it("encodes exactly once", () => {
    expect(buildWhatsAppUrl("910000000000", "a b")).toBe("https://wa.me/910000000000?text=a%20b");
  });
});
