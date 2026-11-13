# Testing Strategy

**Status:** implemented. Test tooling is installed, and `.github/workflows/ci.yml` is the live CI definition (it has not run yet, because the repository has no GitHub remote).

Testing effort follows business risk. The most costly failures for this site are a broken or wrong enquiry path, false business facts, and a slow image-heavy mobile experience. Purely presentational components get lighter coverage.

## 1. Testing levels

| Level | Tool | What it covers | When it runs |
|---|---|---|---|
| Static types | TypeScript strict, via `next typegen && tsc --noEmit` | Types, typed routes, data shape | Editor, CI |
| Static analysis | ESLint | Next rules, hooks, `jsx-a11y`, module boundaries, cycles | Editor, CI |
| Unit | Vitest | Pure logic: schemas, services, filtering, SEO builders, content integrity | Local, CI |
| Component | Vitest + React Testing Library + jsdom | Interactive islands from the user's perspective | Local, CI |
| Integration | Vitest + RTL | Form + schema + service working together, with no network | Local, CI |
| End-to-end | Playwright against `next build && next start` | Journeys, routing, status codes, headers, metadata in real browsers | CI |
| Responsive | Playwright device projects | Layout and navigation at each width | CI |
| Accessibility | `@axe-core/playwright`; `jsx-a11y`; manual | WCAG issues | CI, manual before release |
| Performance | Lighthouse CI; field data | Web Vitals, budgets | Preview, post-launch |
| Build | `next build` and output gate | Compile, prerender, static-only | CI, Vercel |
| Content | `check:launch` | Verified required facts | Production release |
| Real device | Manual | WhatsApp handoff | Before release |

### Limitations to plan for

- The bundled Next.js guide notes **Vitest doesn't support `async` Server Components**. So routes (the async callers) are covered by E2E tests, and feature components are designed as synchronous and prop-driven. That keeps them unit-testable.
- jsdom has no layout engine and a partial `<dialog>` implementation. Responsive behaviour and real dialog focus are verified in Playwright.
- Automated accessibility tools catch only some issues. Manual testing is still required.

## 2. Coverage priorities

| Priority | Area | Required cases |
|---|---|---|
| **P0** | Enquiry schema | Valid data; each required field; length limits; control characters; Indian and international phone numbers; invalid event type; **optional fields submitted as empty strings**; unknown fields |
| **P0** | WhatsApp URL generation | Number normalised to digits; `+`, spaces and dashes removed; encoding of spaces, newlines, `&`, `?`, `#`, `+`, `%`, emoji and Malayalam; **round-trip decode equals the original**; no double encoding; no `text` when empty |
| **P0** | Enquiry message | Exact agreed format; empty message omitted; date format; Malayalam and special characters preserved |
| **P0** | Handoff | Missing number; over budget with long Malayalam; exactly at budget; success |
| **P0** | Enquiry journey | E2E: fill, validate, review, correct `wa.me` link and attributes. **Never actually sends a message** |
| **P1** | Gallery filter | All category; each category; empty category; no mutation; order preserved |
| **P1** | Gallery UI | Filter selection state; load more; lightbox opens, Esc closes, and focus returns |
| **P1** | `EnquiryForm` | Errors shown and announced; focus moves to first error; `?event=` preselection; unknown value ignored |
| **P1** | SEO builders | Title, canonical, Open Graph; JSON-LD omits nulls; `<` escaped; address missing removes the block |
| **P1** | Content integrity | Unique ids and slugs; all alt text present; celebration event type ids valid; `https:` URLs |
| **P1** | Routes | Every route returns 200; unknown slug and URL return 404; sitemap lists every indexable route; preview robots disallow |
| **P1** | Headers | CSP and others are present on deployed preview |
| **P2** | Navigation | Mobile menu open/close, keyboard, active link |
| **P2** | Video | Pause control works; reduced motion disables autoplay |
| **P3** | Static presentational components | Covered by E2E and visual review |

**Coverage thresholds.** Enforce 95% for `src/services` and `src/schemas`, and 80% for feature `lib/` code. There's no global percentage target, since one would only reward testing markup.

## 3. Example specifications

Illustrative only, not implemented.

```ts
// src/services/whatsapp.test.ts
describe("buildWhatsAppUrl", () => {
  it("normalises the number to digits", () => {
    expect(buildWhatsAppUrl("+91 00000-00000")).toBe("https://wa.me/910000000000");
  });

  it.each(["a & b", "line 1\nline 2", "100% + #1?", "വിവാഹം 🎉"])(
    "round-trips %s",
    (text) => {
      const url = new URL(buildWhatsAppUrl("910000000000", text));
      expect(url.searchParams.get("text")).toBe(text);
    },
  );
});
```

```ts
// src/services/enquiry-handoff.test.ts
it("rejects a message whose encoded URL is over budget", () => {
  const result = prepareEnquiryHandoff(enquiryWith({ message: "വി".repeat(5000) }), "910000000000");
  expect(result).toEqual({ ok: false, reason: "message-too-long" });
});
```

```ts
// tests/e2e/enquiry.spec.ts
test("prepares a WhatsApp link without sending anything to the site", async ({ page }) => {
  const posts: string[] = [];
  page.on("request", (r) => { if (r.method() === "POST") posts.push(r.url()); });

  await page.goto("/contact?event=wedding#enquiry");
  await expect(page.getByLabel("Event type")).toHaveValue("wedding");
  await page.getByLabel("Name").fill("Test Visitor");
  await page.getByLabel("Phone").fill("+91 00000 00000");
  await page.getByRole("button", { name: /continue|review/i }).click();

  const link = page.getByRole("link", { name: /whatsapp/i });
  await expect(link).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?text=/);
  await expect(link).toHaveAttribute("rel", /noopener/);
  expect(posts.filter((u) => u.includes("enquir"))).toEqual([]);
  // The test stops here and doesn't click through to WhatsApp.
});
```

## 4. Responsive and browser matrix

| Project | Viewport | Engine | Why |
|---|---|---|---|
| `mobile-small` | 360 × 800 | Chromium | Common low-end Android width |
| `mobile-ios` | iPhone device profile | WebKit | Safari behaviour |
| `tablet` | 768 × 1024 | Chromium | Layout transition |
| `desktop` | 1440 × 900 | Chromium | Primary desktop |
| `desktop-firefox` | 1280 × 800 | Firefox | Cross-browser, main journeys only |

Assert no horizontal overflow on each route at each size. Add visual snapshots only after the design stabilises, since they're costly to maintain.

## 5. Accessibility

**Automated:** axe scan, failing on `serious` or `critical`, on every route, plus form error state, open mobile menu and open lightbox.

**Manual, before release:**

- [ ] Whole journey using only a keyboard, with visible focus.
- [ ] NVDA with Firefox or Chrome on Windows; VoiceOver on iOS.
- [ ] 200% zoom and 320 px reflow.
- [ ] Contrast of text over images.
- [ ] Reduced motion on.
- [ ] Forced colours mode.

## 6. Quality gates

| Gate | Pull request | Production release | Blocking |
|---|---|---|---|
| `npm ci` | ✅ | ✅ | Yes |
| Type check | ✅ | ✅ | Yes |
| ESLint, no warnings | ✅ | ✅ | Yes |
| Unit and component tests with coverage thresholds | ✅ | ✅ | Yes |
| `next build` | ✅ | ✅ | Yes |
| **Static-only gate:** no `ƒ` in route table | ✅ | ✅ | Yes |
| Playwright journeys and axe | ✅ | ✅ | Yes |
| `npm audit --omit=dev` (high or critical) | ✅ | ✅ | Yes, with documented exceptions |
| Lighthouse budgets | ✅ when real media exists | ✅ | Warn first, then block |
| `check:launch` | n/a | ✅ | Yes |
| Real-device WhatsApp and manual a11y pass | n/a | ✅ per release with relevant changes | Yes |

Enforce required checks through branch protection. Vercel deploys only what passes its own build, while GitHub required checks control what can merge to `main`.

## 7. CI verification strategy

**Summary of the workflow:**

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
  push: { branches: [main] }
permissions: { contents: read }
jobs:
  verify:
    runs-on: ubuntu-latest
    env:
      NEXT_PUBLIC_SITE_URL: http://localhost:3000
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm audit --omit=dev --audit-level=high
      - run: npm run typecheck
      - run: npm run lint -- --max-warnings=0
      - run: npm run test:coverage
      - run: npm run build
      - run: npm run check:static
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

Confirm the action versions when the repository moves to GitHub.

### Scripts

| Script | Command |
|---|---|
| `typecheck` | `next typegen && tsc --noEmit` |
| `test` | `vitest` |
| `test:coverage` | `vitest run --coverage` |
| `test:e2e` | `playwright test` |
| `test:run` | `vitest run` |
| `check:static` | Fails if any route renders per request |
| `check:launch` | Runs the launch content check. Expected to fail until facts and photography are supplied |


## 8. Test data and safety

- Tests use only clearly fake numbers such as `910000000000`, never BAMBOOS's real number where it can be avoided.
- **Automated tests never click through to WhatsApp.** They assert the URL only, so staff never receive test messages.
- Manual device tests are coordinated with staff, and use a marked test message.
- Tests inject the current date for date rules, so they don't fail as time passes.

## 9. Definition of done for a change

1. Types and lint are clean.
2. Tests added at the lowest useful level.
3. Build gate is green, with no dynamic route introduced.
4. Reviewed on preview at mobile width.
5. No unverified fact introduced.
