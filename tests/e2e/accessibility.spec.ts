import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Reduced motion keeps all content visible, so contrast is checked on everything.
test.use({ reducedMotion: "reduce" });

async function expectNoSeriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  const serious = violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .map((violation) => ({
      id: violation.id,
      targets: violation.nodes.slice(0, 5).map((node) => node.target.join(" ")),
    }));
  expect(serious).toEqual([]);
}

for (const route of [
  "/",
  "/venue",
  "/celebrations",
  "/celebrations/weddings",
  "/gallery",
  "/facilities",
  "/contact",
  "/privacy",
  "/does-not-exist",
]) {
  test(`axe finds no serious issues on ${route}`, async ({ page }) => {
    await page.goto(route);
    await expectNoSeriousViolations(page);
  });
}

test("axe: enquiry form with errors", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Review my enquiry" }).click();
  await expect(page.locator("form [role=alert]")).toBeVisible();
  await expectNoSeriousViolations(page);
});

test("axe: enquiry review step", async ({ page }) => {
  await page.goto("/contact?event=wedding");
  await page.getByLabel("Name").fill("Test Visitor");
  await page.getByLabel("Phone number").fill("+91 00000 00000");
  await page.getByLabel("Preferred date").fill(new Date(Date.now() + 90 * 86_400_000).toISOString().slice(0, 10));
  await page.getByLabel("Expected guests").fill("500");
  await page.getByRole("button", { name: "Review my enquiry" }).click();
  await expect(page.getByText("Please check your details")).toBeVisible();
  await expectNoSeriousViolations(page);
});

test("axe: open lightbox", async ({ page }) => {
  await page.goto("/gallery");
  await page.getByRole("button", { name: /^View:/ }).first().click();
  await expect(page.locator("dialog.lightbox[open]")).toBeVisible();
  await expectNoSeriousViolations(page);
});

test("axe: open mobile menu", async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) >= 1024, "Mobile and tablet only");
  await page.goto("/");
  await page.getByRole("button", { name: /menu/i }).first().click();
  await expect(page.getByRole("dialog", { name: "Menu" })).toBeVisible();
  await expectNoSeriousViolations(page);
});
