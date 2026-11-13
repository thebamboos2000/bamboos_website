import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EnquiryForm } from "./enquiry-form";
import { WHATSAPP_REOPEN_DELAY_MS } from "./enquiry-review";

let search = "";

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(search),
}));

const NOW = new Date(2027, 0, 10);
const NUMBER = "910000000000";

const renderForm = (number: string | null = NUMBER) =>
  render(<EnquiryForm whatsappNumber={number} now={NOW} />);

const fillRequired = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText("Name"), "Test Visitor");
  await user.type(screen.getByLabelText("Phone number"), "+91 00000 00000");
  await user.selectOptions(screen.getByLabelText("Type of event"), "reception");
  await user.type(screen.getByLabelText("Preferred date"), "2027-02-14");
  await user.type(screen.getByLabelText("Expected guests"), "500");
};

const sentText = (link: HTMLElement) =>
  new URL(link.getAttribute("href") ?? "").searchParams.get("text");

/** The preview renders WhatsApp's asterisks as bold, so they aren't in its text. */
const previewAsSent = () =>
  screen.getByTestId("message-preview").textContent?.replace(
    "EVENT ENQUIRY DETAILS",
    "*EVENT ENQUIRY DETAILS*",
  );

const submit = (user: ReturnType<typeof userEvent.setup>) =>
  user.click(screen.getByRole("button", { name: "Review my enquiry" }));

beforeEach(() => {
  search = "";
});

describe("EnquiryForm: entering details", () => {
  it("shows field errors, a summary, and moves focus to the first invalid field", async () => {
    const user = userEvent.setup();
    renderForm();
    await submit(user);

    expect(await screen.findByRole("alert")).toHaveTextContent("Name");
    const name = screen.getByLabelText("Name");
    expect(name).toHaveAttribute("aria-invalid", "true");
    expect(name).toHaveAccessibleDescription("Please enter your name");
    expect(name).toHaveFocus();
    expect(screen.queryByText("Please check your details")).not.toBeInTheDocument();
  });

  it("connects hints to their fields", () => {
    renderForm();
    expect(screen.getByLabelText("Preferred date")).toHaveAccessibleDescription(
      "This doesn't reserve the date.",
    );
  });

  it("rejects a past date", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequired(user);
    const date = screen.getByLabelText("Preferred date");
    await user.clear(date);
    await user.type(date, "2027-01-09");
    await submit(user);
    expect(await screen.findByText(/not in the past/)).toBeInTheDocument();
    expect(screen.queryByText("Please check your details")).not.toBeInTheDocument();
  });

  it("explains every missing required field", async () => {
    const user = userEvent.setup();
    renderForm();
    await submit(user);
    expect(await screen.findByText("Please enter your name")).toBeInTheDocument();
    expect(screen.getByText(/valid phone number/)).toBeInTheDocument();
    expect(screen.getByText("Please choose the type of event")).toBeInTheDocument();
    expect(screen.getByText("Please choose your preferred event date")).toBeInTheDocument();
    expect(screen.getByText("Please enter the expected number of guests")).toBeInTheDocument();
  });

  it("rejects an invalid phone number", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequired(user);
    const phone = screen.getByLabelText("Phone number");
    await user.clear(phone);
    await user.type(phone, "12345");
    await submit(user);
    expect(await screen.findByText(/valid phone number/)).toBeInTheDocument();
    expect(screen.queryByText("Please check your details")).not.toBeInTheDocument();
  });

  it("rejects a guest count that isn't positive", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequired(user);
    const guests = screen.getByLabelText("Expected guests");
    await user.clear(guests);
    await user.type(guests, "0");
    await submit(user);
    expect(await screen.findByText(/at least 1 guest/)).toBeInTheDocument();
  });

  it("offers exactly the agreed event types", () => {
    renderForm();
    const options = [...screen.getByLabelText("Type of event").querySelectorAll("option")];
    expect(options.map((option) => option.textContent)).toEqual([
      "Choose one",
      "Wedding",
      "Engagement",
      "Reception",
      "Birthday Celebration",
      "Corporate Event",
      "Conference",
      "Other",
    ]);
  });

  it("preselects a valid event type from the URL", () => {
    search = "event=wedding";
    renderForm();
    expect(screen.getByLabelText("Type of event")).toHaveValue("wedding");
  });

  it("ignores an unknown event type from the URL", () => {
    search = "event=%3Cscript%3E";
    renderForm();
    expect(screen.getByLabelText("Type of event")).toHaveValue("");
  });
});

describe("EnquiryForm: review and handoff", () => {
  it("requires review before offering WhatsApp", async () => {
    const user = userEvent.setup();
    renderForm();
    expect(screen.queryByRole("link", { name: /WhatsApp/ })).not.toBeInTheDocument();

    await fillRequired(user);
    await submit(user);

    expect(await screen.findByRole("heading", { name: "Please check your details" })).toHaveFocus();
    expect(screen.getByText("Test Visitor")).toBeInTheDocument();
    expect(screen.getByText("Reception")).toBeInTheDocument();
  });

  it("offers a real, safe link containing the reviewed message", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequired(user);
    await user.type(screen.getByLabelText("Your message", { exact: false }), "Hall details & dates");
    await submit(user);

    const link = await screen.findByRole("link", { name: /Send Enquiry via WhatsApp/ });
    const url = new URL(link.getAttribute("href") ?? "");
    expect(url.origin + url.pathname).toBe(`https://wa.me/${NUMBER}`);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(sentText(link)).toBe(previewAsSent());
    expect(sentText(link)).toContain("Additional Message:\nHall details & dates");
    expect(sentText(link)).toContain("Name: Test Visitor");
    expect(sentText(link)).toContain("Preferred Date: 14 February 2027");
    expect(sentText(link)).toContain("Expected Guests: 500");
  });

  it("keeps Malayalam intact, and sends an empty message without a blank section", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequired(user);
    await submit(user);
    const plain = await screen.findByRole("link", { name: /Send Enquiry via WhatsApp/ });
    expect(sentText(plain)).not.toContain("Additional Message");

    await user.click(screen.getByRole("button", { name: "Edit details" }));
    await user.type(await screen.findByLabelText("Your message", { exact: false }), "വിവാഹം 100% & വിവരങ്ങൾ");
    await submit(user);
    const link = await screen.findByRole("link", { name: /Send Enquiry via WhatsApp/ });
    expect(sentText(link)).toContain("വിവാഹം 100% & വിവരങ്ങൾ");
  });

  it("says plainly that the enquiry isn't sent until the visitor presses Send", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequired(user);
    await submit(user);
    expect(await screen.findByText(/only when you press Send inside\s+WhatsApp/)).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: /Send Enquiry via WhatsApp/ }));
    expect(await screen.findByText(/hasn't been sent yet/)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/enquiry (was|has been) (sent|submitted|received)/i);
  });

  it("ignores repeat clicks while WhatsApp opens, then allows a retry", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequired(user);
    await submit(user);
    const link = await screen.findByRole("link", { name: /Send Enquiry via WhatsApp/ });

    vi.useFakeTimers();
    try {
      // fireEvent returns false when the click was cancelled.
      expect(fireEvent.click(link)).toBe(true);
      expect(fireEvent.click(link)).toBe(false);
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link).toHaveTextContent("Opening WhatsApp");

      act(() => vi.advanceTimersByTime(WHATSAPP_REOPEN_DELAY_MS));
      expect(link).not.toHaveAttribute("aria-disabled");
      expect(fireEvent.click(link)).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("states that an enquiry is not a booking", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequired(user);
    await submit(user);
    expect(await screen.findByText("This is an enquiry, not a booking.")).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/\b(booking confirmed|reserved for you)\b/i);
  });

  it("keeps values when returning to edit", async () => {
    const user = userEvent.setup();
    renderForm();
    await fillRequired(user);
    await submit(user);
    await user.click(await screen.findByRole("button", { name: "Edit details" }));

    expect(await screen.findByRole("heading", { name: /Tell us about/ })).toHaveFocus();
    expect(screen.getByLabelText("Name")).toHaveValue("Test Visitor");
    expect(screen.getByLabelText("Type of event")).toHaveValue("reception");
  });

  it("copies the message and reports it", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    renderForm();
    await fillRequired(user);
    await submit(user);
    await user.click(await screen.findByRole("button", { name: "Copy my message" }));
    expect(writeText).toHaveBeenCalledWith(previewAsSent());
    expect(await screen.findByRole("status")).toHaveTextContent("Message copied.");
  });

  it("handles a blocked clipboard", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied"));
    renderForm();
    await fillRequired(user);
    await submit(user);
    await user.click(await screen.findByRole("button", { name: "Copy my message" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/blocked copying/);
  });

  it("offers no link, and never a made-up number, while WhatsApp is unconfirmed", async () => {
    const user = userEvent.setup();
    renderForm(null);
    await fillRequired(user);
    await submit(user);
    expect(await screen.findByText("WhatsApp number to be confirmed")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /WhatsApp/ })).not.toBeInTheDocument();
    expect(document.querySelector('a[href*="wa.me"]')).toBeNull();
  });

  it("sends nothing over the network", async () => {
    const user = userEvent.setup();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    renderForm();
    await fillRequired(user);
    await submit(user);
    await screen.findByRole("link", { name: /Send Enquiry via WhatsApp/ });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
