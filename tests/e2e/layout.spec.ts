import { expect, test, type Page } from "@playwright/test";

const routes = [
  "/",
  "/venue",
  "/celebrations",
  "/celebrations/birthdays",
  "/facilities",
  "/gallery",
  "/contact",
  "/privacy",
  "/does-not-exist",
];

const widths: [number, number][] = [
  [320, 568],
  [360, 740],
  [430, 700],
  [600, 900],
  [844, 390],
  [1024, 768],
  [1280, 720],
  [1920, 1080],
  [2560, 1440],
];

/** Finds readable text that runs off the screen, or that something else is covering. */
async function findTextProblems(page: Page) {
  return page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    // Stacked panels cover one another by design, so check each one on its own.
    document.querySelectorAll<HTMLElement>(".deck-panel").forEach((panel) => {
      panel.style.position = "relative";
    });

    const problems: string[] = [];
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    );
    const viewportWidth = document.documentElement.clientWidth;

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent?.trim();
      const parent = node.parentElement;
      if (!text || !parent) continue;
      if (
        parent.closest(
          "[aria-hidden='true'], script, style, dialog, .sr-only, noscript",
        )
      )
        continue;
      const style = getComputedStyle(parent);
      if (
        style.visibility === "hidden" ||
        style.display === "none" ||
        style.opacity === "0"
      )
        continue;

      const range = document.createRange();
      range.selectNodeContents(node);
      const scroller = parent.closest("ul, [role='group']");
      const inScroller = scroller
        ? getComputedStyle(scroller).overflowX !== "visible"
        : false;

      for (const rect of range.getClientRects()) {
        if (rect.width < 2 || rect.height < 2) continue;
        if (!inScroller && (rect.left < -1 || rect.right > viewportWidth + 1)) {
          problems.push(`off-screen: "${text.slice(0, 40)}"`);
          break;
        }
      }

      const first = range.getClientRects()[0];
      if (!first || first.width < 2) continue;
      parent.scrollIntoView({ block: "center", inline: "nearest" });
      const rects = [...range.getClientRects()];
      const lines = [rects[0], rects[rects.length - 1]];
      for (const line of lines) {
        if (!line) continue;
        const x = Math.min(
          viewportWidth - 2,
          Math.max(1, line.left + line.width / 2),
        );
        const hit = document.elementFromPoint(x, line.top + line.height / 2);
        if (
          !hit ||
          hit === parent ||
          parent.contains(hit) ||
          hit.contains(parent)
        )
          continue;
        // The whole panel is a link, through a stretched overlay.
        if (hit.closest("a") && parent.closest("article")) continue;
        if (hit.closest("header, .floating-whatsapp")) continue;
        // Display type's font box overhangs its block, but that space holds no ink.
        const box = hit.getBoundingClientRect();
        if (line.top + line.height / 2 < box.top || line.top + line.height / 2 > box.bottom) continue;
        problems.push(
          `covered: "${text.slice(0, 40)}" by <${hit.tagName.toLowerCase()} class="${String(hit.className).slice(0, 40)}">`,
        );
        break;
      }
    }
    return [...new Set(problems)];
  });
}

test.use({ reducedMotion: "reduce" });

for (const route of routes) {
  test(`no text is covered or clipped on ${route}, from 320px to 2560px`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.goto(route);
    for (const [width, height] of widths) {
      await page.setViewportSize({ width, height });
      // Viewport-sized type takes a moment to settle after a resize.
      await expect(async () => {
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(
          overflow,
          `horizontal overflow at ${width}px`,
        ).toBeLessThanOrEqual(0);
        expect(await findTextProblems(page), `at ${width}x${height}`).toEqual(
          [],
        );
      }).toPass({ timeout: 6_000 });
    }
  });
}

test("the brand's name fits, and the opening screen's parts never collide", async ({ page }) => {
  await page.goto("/");
  for (const [width, height] of widths) {
    await page.setViewportSize({ width, height });
    await expect(async () => {
      const layoutCheck = await page.evaluate(() => {
        const box = (selector: string) => document.querySelector(selector)?.getBoundingClientRect();
        const word = box(".intro-word span[aria-hidden]");
        const tagline = box(".intro-tagline");
        const cue = box(".intro-cue");
        if (!word || !tagline) return { fits: false, cueClear: false };
        return {
          fits: word.left >= 0 && word.right <= document.documentElement.clientWidth,
          // The cue is hidden on short landscape phones.
          cueClear: !cue || cue.height === 0 || tagline.bottom <= cue.top,
        };
      });
      expect(layoutCheck, `at ${width}x${height}`).toEqual({ fits: true, cueClear: true });
    }).toPass({ timeout: 6_000 });
  }
});

test("the header's logo, menu and button keep clear of each other", async ({ page }) => {
  await page.goto("/");
  for (const [width, height] of widths) {
    await page.setViewportSize({ width, height });
    await expect(async () => {
      const gaps = await page.evaluate(() => {
        const box = (selector: string) =>
          document.querySelector(selector)?.getBoundingClientRect();
        const logo = box("header a[aria-label^='BAMBOOS']");
        const button = box("header .header-cta");
        // Below the desktop breakpoint the menu button replaces the links.
        const links = box("header nav");
        const start = links && links.width > 0 ? links : box("header button");
        if (!logo || !button || !start) return [-1];
        return [button.left - logo.right, logo.left - start.right];
      });
      for (const gap of gaps) expect(gap, `at ${width}px`).toBeGreaterThanOrEqual(4);
    }).toPass({ timeout: 6_000 });
  }
});

test("stock labels aren't hidden behind overlapping photographs", async ({
  page,
}) => {
  for (const route of ["/", "/venue"]) {
    await page.goto(route);
    for (const [width, height] of [
      [390, 844],
      [1440, 900],
    ] as const) {
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(1_500);
      const hidden = await page.evaluate(() => {
        document
          .querySelectorAll<HTMLElement>(".deck-panel")
          .forEach((panel) => {
            panel.style.position = "relative";
          });
        const covered: string[] = [];
        for (const tag of document.querySelectorAll<HTMLElement>(
          "main .illus-tag",
        )) {
          // The opening's labels fade with the camera move, and are checked in its own frames.
          if (tag.closest(".journey")) continue;
          tag.style.pointerEvents = "auto";
          tag.scrollIntoView({ block: "center" });
          const rect = tag.getBoundingClientRect();
          const hit = document.elementFromPoint(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2,
          );
          if (hit && hit !== tag && !hit.closest("header, .floating-whatsapp")) {
            covered.push(
              tag
                .closest(".frame-host")
                ?.querySelector("img")
                ?.alt.slice(0, 40) ?? "unknown",
            );
          }
          tag.style.pointerEvents = "";
        }
        return covered;
      });
      expect(hidden, `${route} at ${width}px`).toEqual([]);
    }
  }
});

test("gallery tiles never overlap", async ({ page }) => {
  await page.goto("/gallery");
  for (const [width, height] of widths) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(1_000);
    const overlaps = await page.getByRole("button", { name: /^View:/ }).evaluateAll((tiles) => {
      const rects = tiles.map((tile) => tile.getBoundingClientRect());
      return rects.flatMap((a, i) =>
        rects.slice(i + 1).flatMap((b, j) => {
          const wide = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const tall = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          return wide > 1 && tall > 1 ? [`${i}-${i + j + 1}`] : [];
        }),
      );
    });
    expect(overlaps, `at ${width}x${height}`).toEqual([]);
  }
});
