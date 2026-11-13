import { expect, test, type Page } from "@playwright/test";
import { contact } from "../../src/config/contact";

async function fillEnquiry(page: Page) {
  await page.getByLabel("Name").fill("Test Visitor");
  await page.getByLabel("Phone number").fill("+91 00000 00000");
  await page.getByLabel("Preferred date").fill(futureDate);
  await page.getByLabel("Expected guests").fill("500");
}

const futureDate = new Date(Date.now() + 90 * 86_400_000).toISOString().slice(0, 10);

/** The preview renders WhatsApp's asterisks as bold, so they aren't in its text. */
const asSent = (preview: string | null) =>
  preview?.replace("EVENT ENQUIRY DETAILS", "*EVENT ENQUIRY DETAILS*");

test.describe("booking enquiry", () => {
  test("arriving from an event page preselects the event", async ({ page }) => {
    await page.goto("/celebrations/receptions");
    await page.getByRole("link", { name: "Enquire about receptions" }).click();
    await expect(page).toHaveURL(/\/contact\?event=reception#enquiry$/);
    await expect(page.getByLabel("Type of event")).toHaveValue("reception");
  });

  test("invalid input stays on the form and focuses the first problem", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Review my enquiry" }).click();
    // The form's own alert, not the route announcer Next.js adds.
    await expect(page.locator("form [role=alert]")).toContainText("Name");
    await expect(page.getByLabel("Name")).toBeFocused();
    await expect(page.getByText("Please check your details")).toHaveCount(0);
  });

  test("details can be reviewed and edited, and nothing is sent to the site", async ({ page }) => {
    const posts: string[] = [];
    page.on("request", (request) => {
      if (request.method() !== "GET") posts.push(request.url());
    });

    await page.goto("/contact?event=wedding#enquiry");
    await fillEnquiry(page);
    await page.getByLabel("Your message", { exact: false }).fill("വിവാഹം & details");
    await page.getByRole("button", { name: "Review my enquiry" }).click();

    await expect(page.getByRole("heading", { name: "Please check your details" })).toBeFocused();
    await expect(page.getByTestId("message-preview")).toContainText("Event Type: Wedding");
    await expect(page.getByTestId("message-preview")).toContainText("വിവാഹം & details");
    await expect(page.getByText("This is an enquiry, not a booking.")).toBeVisible();

    await page.getByRole("button", { name: "Edit details" }).click();
    await expect(page.getByLabel("Name")).toHaveValue("Test Visitor");

    expect(posts).toEqual([]);
  });

  test("the WhatsApp step matches the configured number", async ({ page }) => {
    await page.goto("/contact?event=wedding");
    await fillEnquiry(page);
    await page.getByRole("button", { name: "Review my enquiry" }).click();
    await expect(page.getByText("Please check your details")).toBeVisible();

    const link = page.getByRole("link", { name: /Send Enquiry via WhatsApp/ });

    if (contact.whatsappNumber === null) {
      await expect(link).toHaveCount(0);
      await expect(page.getByText("WhatsApp number to be confirmed")).toBeVisible();
      return;
    }

    // This test stops at the link. It never opens WhatsApp, so staff get no test messages.
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    await expect(link).toHaveAttribute("target", "_blank");
    const href = await link.getAttribute("href");
    const url = new URL(href ?? "");
    expect(url.origin).toBe("https://wa.me");
    expect(url.pathname).toBe(`/${contact.whatsappNumber}`);
    expect(url.searchParams.get("text")).toBe(asSent(await page.getByTestId("message-preview").textContent()));
  });

  test("clicking once opens WhatsApp with the message, and a double click opens one window", async ({
    context,
    page,
  }) => {
    test.skip(contact.whatsappNumber === null, "The official WhatsApp number isn't configured yet");

    // Intercepted, so nothing reaches WhatsApp and staff get no test messages.
    await context.route("https://wa.me/**", (route) =>
      route.fulfill({ contentType: "text/html", body: "<title>WhatsApp stand-in</title>" }),
    );
    const popups: string[] = [];
    context.on("page", (opened) => popups.push(opened.url()));

    await page.goto("/contact?event=wedding");
    await fillEnquiry(page);
    await page.getByLabel("Your message", { exact: false }).fill("വിവാഹം 100% & details");
    await page.getByRole("button", { name: "Review my enquiry" }).click();

    const link = page.getByRole("link", { name: /Send Enquiry via WhatsApp/ });
    const popup = context.waitForEvent("page");
    await link.dblclick();
    const opened = await popup;
    await opened.waitForLoadState();

    const url = new URL(opened.url());
    expect(url.origin + url.pathname).toBe(`https://wa.me/${contact.whatsappNumber}`);
    const text = url.searchParams.get("text");
    expect(text).toBe(asSent(await page.getByTestId("message-preview").textContent()));
    expect(text).toContain("Additional Message:\nവിവാഹം 100% & details");

    await expect(page.getByText(/hasn't been sent yet/)).toBeVisible();
    await page.waitForTimeout(500);
    expect(popups).toHaveLength(1);
  });

  test("the generic WhatsApp button stays out of the enquiry form's way", async ({ page }) => {
    test.skip(contact.whatsappNumber === null, "The official WhatsApp number isn't configured yet");
    await page.setViewportSize({ width: 390, height: 844 });
    const floating = page.locator(".floating-whatsapp");
    await page.goto("/contact");
    await expect(floating).toBeHidden();
    await page.goto("/");
    await expect(floating).toBeHidden();
    await page.goto("/gallery");
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, window.innerHeight * 1.5);
    });
    await expect(floating).toBeVisible();
  });

  test("the review step can be completed with the keyboard", async ({ context, page }) => {
    test.skip(contact.whatsappNumber === null, "The official WhatsApp number isn't configured yet");
    await context.route("https://wa.me/**", (route) =>
      route.fulfill({ contentType: "text/html", body: "<title>WhatsApp stand-in</title>" }),
    );
    await page.goto("/contact?event=wedding");
    await fillEnquiry(page);
    await page.getByRole("button", { name: "Review my enquiry" }).press("Enter");

    const link = page.getByRole("link", { name: /Send Enquiry via WhatsApp/ });
    await link.focus();
    const popup = context.waitForEvent("page");
    await link.press("Enter");
    expect(new URL((await popup).url()).origin).toBe("https://wa.me");
  });
});

test.describe("gallery", () => {
  test("the images are in the prerendered HTML, for search engines", async ({ request }) => {
    const html = await (await request.get("/gallery")).text();
    expect(html).toContain("Long banquet tables in a grand hall beneath an arched skylight");
  });

  test("filtering changes what is shown", async ({ page }) => {
    await page.goto("/gallery");
    const tiles = page.getByRole("button", { name: /^View:/ });
    await expect(tiles).toHaveCount(12);

    const venue = page.getByRole("group", { name: "Filter the gallery" }).getByRole("button", { name: /The venue/ });
    await venue.click();
    await expect(venue).toHaveAttribute("aria-pressed", "true");
    await expect(tiles).toHaveCount(6);
  });

  test("show more reveals the rest", async ({ page }) => {
    await page.goto("/gallery");
    await page.getByRole("button", { name: "Show more" }).click();
    await expect(page.getByRole("button", { name: /^View:/ })).toHaveCount(24);
  });

  test("the lightbox opens, steps, closes with Esc and returns focus", async ({ page }) => {
    await page.goto("/gallery");
    const first = page.getByRole("button", { name: /^View:/ }).first();
    await first.click();

    const dialog = page.locator("dialog.lightbox[open]");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("1 / 12")).toBeVisible();

    await dialog.getByRole("button", { name: "Next" }).click();
    await expect(dialog.getByText("2 / 12")).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await expect(dialog.getByText("1 / 12")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator("dialog.lightbox[open]")).toHaveCount(0);
    await expect(first).toBeFocused();
  });
});
