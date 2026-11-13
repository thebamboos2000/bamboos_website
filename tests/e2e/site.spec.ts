import { expect, test } from "@playwright/test";
import { contact } from "../../src/config/contact";

const routes = [
  "/",
  "/venue",
  "/celebrations",
  "/celebrations/weddings",
  "/celebrations/engagements",
  "/celebrations/receptions",
  "/celebrations/birthdays",
  "/celebrations/corporate-events",
  "/celebrations/conferences",
  "/gallery",
  "/facilities",
  "/contact",
  "/privacy",
];

for (const route of routes) {
  test(`${route} loads correctly, with no horizontal overflow`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("every route has a unique title and description, and a canonical without a query", async ({
  page,
}) => {
  const seen = new Set<string>();
  for (const route of routes) {
    await page.goto(route);
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    expect(seen.has(title), `duplicate title: ${title}`).toBe(false);
    seen.add(title);
    expect(description?.length).toBeGreaterThan(30);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]').first()).toHaveAttribute("content", /opengraph-image/);
  }

  await page.goto("/contact?event=wedding");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toMatch(/\/contact$/);
});

test("unknown URLs return a real, branded 404", async ({ page }) => {
  for (const url of ["/celebrations/not-a-real-event", "/does-not-exist"]) {
    const response = await page.goto(url);
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("doesn't");
    await expect(page.getByRole("link", { name: "Back to home" })).toBeVisible();
  }
});

test("security headers are present", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["strict-transport-security"]).toBeTruthy();
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("no page violates the Content Security Policy", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { violations: string[] }).violations = [];
    document.addEventListener("securitypolicyviolation", (event) => {
      (window as unknown as { violations: string[] }).violations.push(event.violatedDirective);
    });
  });
  for (const route of ["/", "/gallery", "/contact"]) {
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    const violations = await page.evaluate(
      () => (window as unknown as { violations: string[] }).violations,
    );
    expect(violations).toEqual([]);
  }
});

test("the sitemap lists every indexable route, and non-production builds disallow crawling", async ({
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const route of routes) {
    const path = route === "/" ? "" : route;
    expect(sitemap).toContain(`${path}</loc>`);
  }

  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \//);
});

test("only collected business facts are published", async ({ page }) => {
  for (const route of ["/", "/contact", "/venue", "/facilities"]) {
    await page.goto(route);
    // The phone number from the venue's Google listing, in the footer.
    await expect(page.locator('footer a[href="tel:+917592925757"]')).toHaveText("+91 75929 25757");
    // Links appear only once the official number is in the central configuration.
    if (contact.whatsappNumber === null) await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
    await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0);
    // The venue's structured data is on the homepage and the contact page, now that its address is known.
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(["/", "/contact"].includes(route) ? 1 : 0);
  }
});

test("every photograph loads, and stock photographs disclose that they aren't BAMBOOS", async ({ page }) => {
  for (const route of ["/", "/venue", "/celebrations", "/celebrations/weddings", "/facilities", "/gallery", "/contact"]) {
    await page.goto(route);
    const failed = await page.evaluate(async () => {
      for (const image of document.images) image.loading = "eager";
      await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
      return [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.alt);
    });
    expect(failed).toEqual([]);

    const images = page.locator("main img");
    expect(await images.count()).toBeGreaterThan(0);
    for (const alt of await images.evaluateAll((list) => list.map((image) => image.getAttribute("alt")))) {
      // Empty alt marks a small decorative thumbnail inside a labelled link.
      if (alt) expect(alt).toContain("not BAMBOOS");
    }
    await expect(page.locator("footer")).toContainText("illustrative stock images");
  }
});

test("remote images are never requested", async ({ page }) => {
  const remote: string[] = [];
  page.on("request", (request) => {
    if (!request.url().startsWith("http://localhost") && !request.url().startsWith("data:")) {
      remote.push(request.url());
    }
  });
  await page.goto("/");
  await page.goto("/gallery");
  expect(remote).toEqual([]);
});

test.describe("navigation", () => {
  test("the desktop navigation marks the current page", async ({ page, isMobile }, testInfo) => {
    test.skip(isMobile || (page.viewportSize()?.width ?? 0) < 1024, "Desktop only");
    testInfo.annotations.push({ type: "width", description: String(page.viewportSize()?.width) });
    await page.goto("/gallery");
    const nav = page.getByRole("navigation", { name: "Main" });
    await expect(nav.getByRole("link", { name: "Gallery" })).toHaveAttribute("aria-current", "page");
    await nav.getByRole("link", { name: "Events" }).click();
    await expect(page).toHaveURL(/\/celebrations$/);
    await expect(nav.getByRole("link", { name: "Events" })).toHaveAttribute("aria-current", "page");
  });

  test("the mobile menu opens, traps focus, closes with Esc and navigates", async ({ page }) => {
    test.skip((page.viewportSize()?.width ?? 0) >= 1024, "Mobile and tablet only");
    await page.goto("/");

    const trigger = page.getByRole("button", { name: /menu/i }).first();
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();

    await trigger.click();
    await dialog.getByRole("link", { name: "Facilities" }).click();
    await expect(page).toHaveURL(/\/facilities$/);
    await expect(dialog).toBeHidden();
  });

  test("the skip link moves focus to the content", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard only");
    await page.goto("/venue");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });
});

test.describe("motion", () => {
  test("the line story draws as the visitor scrolls", async ({ page }) => {
    await page.goto("/");
    const story = page.locator(".story");
    const progress = async () =>
      Number(await story.evaluate((element) => getComputedStyle(element).getPropertyValue("--p")));

    expect(await progress()).toBe(0);
    await story.evaluate((element) => {
      document.documentElement.style.scrollBehavior = "auto";
      const rect = element.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + rect.top + (rect.height - window.innerHeight) / 2);
    });
    await expect.poll(progress).toBeGreaterThan(0.45);
    await expect.poll(progress).toBeLessThan(0.55);
  });

  test("with reduced motion, the whole story and finished drawing show immediately", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");

    const statements = page.locator(".story-statement");
    await expect(statements).toHaveCount(4);
    for (const statement of await statements.all()) {
      await expect(statement).toHaveCSS("opacity", "1");
    }
    await expect(page.locator(".story-line").first()).toHaveCSS("stroke-dashoffset", "0px");

    // Below-the-fold content is never hidden for a later reveal.
    await expect(page.locator('[data-reveal^="armed"]')).toHaveCount(0);
    await context.close();
  });

  test("the content is readable without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("BAMBOOS");
    await expect(page.locator(".story-statement").first()).toHaveCSS("opacity", "1");
    await page.goto("/contact");
    await expect(page.getByText("The form needs JavaScript")).toBeVisible();
    await context.close();
  });
});

test("a tall picture appears even when the visitor jumps part-way past it", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/gallery");
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    // The second tile in the wall is a tall one.
    const tall = [...document.querySelectorAll("li")].filter((item) => item.querySelector("[aria-haspopup]"))[1];
    if (!tall) throw new Error("No gallery tiles");
    const rect = tall.getBoundingClientRect();
    // Leaves only its lower part on screen.
    window.scrollTo(0, window.scrollY + rect.bottom - 120);
  });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          [...document.querySelectorAll('[data-reveal^="armed"]')].filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.bottom > 0 && rect.top < innerHeight * 0.85;
          }).length,
      ),
    )
    .toBe(0);
});

test("the footer finishes its entrance at the very end of the page", async ({ page }) => {
  await page.goto("/privacy");
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, document.body.scrollHeight);
  });
  await expect(page.locator('footer [data-reveal^="armed"]')).toHaveCount(0);
});

test("scroll scenes glide to the scroll position instead of jumping", async ({ page }) => {
  test.skip(test.info().project.name === "mobile-ios", "Covered by the Chromium projects");
  await page.goto("/");
  // The engine starts where the page already is, so it must be running before the jump.
  await page.waitForFunction(() => document.querySelector<HTMLElement>(".story")?.style.getPropertyValue("--p"));
  const samples = await page.evaluate(async () => {
    const story = document.querySelector<HTMLElement>(".story");
    if (!story) return null;
    const read = () => Number(story.style.getPropertyValue("--p"));
    document.documentElement.style.scrollBehavior = "auto";
    const top = story.getBoundingClientRect().top + scrollY;
    scrollTo(0, top + (story.offsetHeight - innerHeight) * 0.6);
    await new Promise(requestAnimationFrame);
    await new Promise(requestAnimationFrame);
    const early = read();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return { early, settled: read() };
  });
  expect(samples).not.toBeNull();
  expect(samples?.settled).toBeCloseTo(0.6, 1);
  // It hasn't teleported there on the first frames.
  expect(samples?.early).toBeLessThan(0.5);
});

test.describe("depth", () => {
  test("pictures tilt and the hero responds to a real mouse", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "A mouse-only effect");
    await page.goto("/gallery");
    const tile = page.getByRole("button", { name: /^View:/ }).first().locator(".tilt");
    await tile.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1600);
    const box = await tile.boundingBox();
    if (!box) throw new Error("No tile");
    await page.mouse.move(box.x + box.width * 0.9, box.y + box.height * 0.2);
    await expect
      .poll(() => tile.evaluate((element) => Number(element.style.getPropertyValue("--ry"))))
      .toBeGreaterThan(1);

    await page.goto("/");
    // Keeps moving, because the listener only exists once the page has hydrated.
    await expect(async () => {
      await page.mouse.move(100, 100);
      await page.mouse.move(1300, 700);
      await page.waitForTimeout(500);
      const shift = await page.evaluate(() =>
        Number(document.querySelector<HTMLElement>(".depth-field")?.style.getPropertyValue("--mx")),
      );
      expect(shift).toBeGreaterThan(0.3);
    }).toPass({ timeout: 10_000 });
  });

  test("with reduced motion, nothing tracks the mouse or pins", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto("/");
    await page.mouse.move(1300, 700);
    await page.waitForTimeout(300);
    const state = await page.evaluate(() => ({
      mx: document.querySelector<HTMLElement>(".depth-field")?.style.getPropertyValue("--mx"),
      reel: getComputedStyle(document.querySelector(".reel-stage") as Element).position,
      showcase: getComputedStyle(document.querySelector(".showcase-stage") as Element).position,
    }));
    expect(state).toEqual({ mx: "", reel: "static", showcase: "relative" });
    await context.close();
  });

  test("tabbing to an occasion in the reel brings it on screen", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "The reel only pins on desktop");
    await page.goto("/");
    const last = page.locator(".reel-card a").last();
    // Refocuses, because the listener only exists once the page has hydrated.
    await expect(async () => {
      await page.locator(".reel-card a").first().focus();
      await last.focus();
      await page.waitForTimeout(1500);
      const box = await last.boundingBox();
      expect(box?.x).toBeGreaterThanOrEqual(0);
      expect(box?.x).toBeLessThan(1440);
    }).toPass({ timeout: 15_000 });
  });
});

test.describe("the opening", () => {
  const stateAt = (page: import("@playwright/test").Page) =>
    page.evaluate(() => {
      const visible = (selector: string) => {
        const element = document.querySelector(selector);
        return element ? Number(getComputedStyle(element).opacity) : 0;
      };
      const reveal = document.querySelector(".intro-reveal");
      return {
        word: visible(".intro-inner"),
        heading: visible(".intro-copy"),
        clip: reveal ? getComputedStyle(reveal).clipPath : "",
      };
    });

  test("shows the brand first, and the venue only after scrolling", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("BAMBOOS");
    await expect(page.getByText("For the days you will retell.")).toBeVisible();

    const start = await stateAt(page);
    expect(start.word).toBe(1);
    expect(start.heading).toBe(0);
    // Clipped to nothing: 100% from the top.
    expect(start.clip).toContain("inset(100%");

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      const journey = document.querySelector<HTMLElement>(".journey");
      if (!journey) throw new Error("No opening");
      window.scrollTo(0, (journey.offsetHeight - window.innerHeight) * 0.9);
    });
    await expect.poll(async () => (await stateAt(page)).heading).toBe(1);
    const end = await stateAt(page);
    expect(end.word).toBe(0);
    await expect(page.getByRole("heading", { name: /A place for every celebration/i })).toBeInViewport();
  });

  test("with reduced motion, the brand and the venue simply follow each other", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    const order = await page.evaluate(() => {
      const brand = document.querySelector(".intro-word")?.getBoundingClientRect();
      const venue = document.querySelector(".intro-reveal")?.getBoundingClientRect();
      return { wordOnScreen: (brand?.top ?? 0) < innerHeight, venueBelow: (venue?.top ?? 0) >= innerHeight };
    });
    expect(order).toEqual({ wordOnScreen: true, venueBelow: true });
    await context.close();
  });

  test("the homepage's sections come in the agreed order", async ({ page }) => {
    await page.goto("/");
    const positions = await page.evaluate(() =>
      [".intro-word", ".intro-reveal", ".lit", ".showcase", ".reel", "#location-heading", "footer"].map(
        (selector) => document.querySelector(selector)?.getBoundingClientRect().top ?? -1,
      ),
    );
    expect(positions.every((top) => top >= 0)).toBe(true);
    expect(positions.slice(1)).toEqual([...positions.slice(1)].sort((a, b) => a - b));
  });
});
