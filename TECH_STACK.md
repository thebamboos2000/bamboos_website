# Technology Stack

> **Implementation note (5 November 2026):** Zod, React Hook Form, `@hookform/resolvers`, Vitest, React Testing Library, Playwright and axe are now installed; see `package.json` for exact versions. `motion` and `lucide-react` were **not** needed: animation is CSS with small scripts, and icons are inline SVG. `vite-tsconfig-paths` was dropped because Vite now resolves tsconfig paths natively. `@types/node` moved to `^24` to match Node 24 and Vitest's peer range.

Evaluation of the proposed stack. Versions marked *installed* were read from `node_modules`. Versions marked *latest* were read from the npm registry on 5 November 2026 and **are not installed**. Confirm compatibility when each is added.

**Selection test:** a dependency must solve a concrete requirement better than the platform or a few lines of code. Each one has a bundle, upgrade and security cost.

## Verdict on the proposed stack

| Proposed | Verdict | Change |
|---|---|---|
| Next.js 16, React 19, TypeScript, App Router | Keep | None |
| Tailwind CSS, CSS variables | Keep | None |
| Framer Motion | **Change** | Now use the `motion` package, and CSS first. Optional, not essential |
| Lucide React | Keep, as optional | Not for brand logos |
| React Hook Form, Zod | Keep | Add `@hookform/resolvers`, required to connect them |
| Vitest, React Testing Library, Playwright | Keep | Add required peers, plus `@axe-core/playwright` |
| ESLint, TS strict | Keep | Add boundary rules and stricter flags |
| Vercel, GitHub | Keep | **Vercel Pro required** for a commercial site |

## Essential: runtime

| Technology | Version | Purpose | Why selected | Alternatives considered |
|---|---|---|---|---|
| **Next.js** | 16.4.5 *installed* (exact) | Framework, routing, prerendering, image optimisation, metadata | Static output with a clear path to server features in one codebase | Astro: excellent for static sites, but a later admin and booking system would need a second framework or more integration. Remix/React Router: less suited to image and static needs here. WordPress: quick for editors, but plugin security upkeep and harder performance control |
| **React** / **React DOM** | 19.3.0 *installed* (exact) | UI, Server Components | Required by Next.js | None applicable |
| **TypeScript** | 5.9.3 *installed* (`^5`) | Type safety | Makes content mistakes compile errors | JavaScript: rejected |
| **Tailwind CSS** | 4.3.4 *installed* (`^4`) | Styling with design tokens | No runtime cost, tokens through CSS variables | CSS Modules: more files and less consistency. CSS-in-JS: runtime cost and friction with Server Components |
| **`@tailwindcss/turbopack`** | 4.3.4 *installed* | Tailwind build integration | Already working in the scaffold | `@tailwindcss/postcss`: the route documented in the bundled Next.js CSS guide. Switch if the loader causes problems |
| **Zod** | 4.6.7 *latest* | Enquiry schema, env validation, inferred types | The same schema runs in browser now and on a server later | Valibot: smaller, but less familiar. Manual validation: rules drift between client and server. Measure bundle cost at implementation; `zod/mini` is a fallback |
| **React Hook Form** | 7.91.0 *latest* | Form state, errors, focus management | Small, uncontrolled inputs, good performance on mobile. Peer supports React 19 | Native form + `useActionState`: the likely choice once a Server Action exists, but no action exists yet. Formik: heavier |
| **`@hookform/resolvers`** | 7.0.2 *latest* | Connects Zod to React Hook Form | Peer range accepts Zod 3.25+/4 and RHF 7.55+ | Hand-written resolver: pointless |

## Essential: development and quality

| Technology | Version | Purpose | Why selected | Alternatives considered |
|---|---|---|---|---|
| **ESLint** + `eslint-config-next` | 9.39.5 / 16.4.5 *installed* | Lint, a11y and Next rules, module boundaries | Already present. Includes `jsx-a11y` and `import` plugins | Biome: faster, but would lose the Next rules and `import/no-cycle` |
| **Vitest** | 5.1.0 *latest* | Unit and component tests | Fast, ESM native, documented by Next.js | Jest: more configuration |
| **`@vitejs/plugin-react`**, **`vite-tsconfig-paths`**, **`jsdom`** | 6.2.1, 6.1.1, 30.1.3 *latest* | Vitest setup per the bundled guide | Required | happy-dom: less complete |
| **React Testing Library** + `@testing-library/dom` | 16.3.3, 10.4.2 *latest* | Component tests from the user's perspective | Encourages accessible queries | Enzyme: obsolete |
| **`@testing-library/user-event`**, **`@testing-library/jest-dom`** | 14.6.8, 7.0.1 *latest* | Realistic interactions and matchers | Standard companions | `fireEvent` alone: less realistic |
| **Playwright** | 1.64.1 *latest* | E2E, responsive, cross-browser | Chromium, Firefox and WebKit, and device emulation | Cypress: weaker WebKit story |
| **`@axe-core/playwright`** | 4.14.0 *latest* | Automated accessibility checks | Runs inside E2E journeys | Separate pa11y: another tool. Automated checks are not a substitute for manual testing |
| **GitHub + Actions** | n/a | Source and CI | Required; integrates with Vercel | GitLab: no advantage here |
| **Vercel** | **Pro** plan | Hosting, CDN, previews, image optimiser, rollback | Native Next.js support. See [ADR-008](ADR/ADR-008-hosting-plan.md) | See below |

## Optional: add only when justified

| Technology | Version | Purpose | Add when | Alternative or default |
|---|---|---|---|---|
| **`motion`** | 14.9.1 *latest* | Choreographed or gesture animation. Successor name for Framer Motion. Peer supports React 19 | CSS can't achieve the approved design. Use `LazyMotion` with `motion/react-m`, confirmed in the package's exports | **Default:** CSS transitions with IntersectionObserver for reveals |
| **`lucide-react`** | 1.68.0 *latest* | UI icons | The design uses more than a few icons. In Next.js's default `optimizePackageImports` list | Inline SVG. **Never for the WhatsApp mark:** use WhatsApp's official brand assets |
| **`@vercel/analytics`** | 2.0.1 *latest* | Privacy-friendly page and event analytics | At launch, if BAMBOOS approves | No analytics, or Plausible |
| **`@vercel/speed-insights`** | Check at adoption | Field Core Web Vitals | At launch, if budget allows | `useReportWebVitals`, CrUX |
| **`@lhci/cli`** | 0.16.0 *latest* | Lighthouse budgets in CI | Once real media exists | Manual Lighthouse runs |
| **`@next/bundle-analyzer`** | 16.4.5 *latest* | Bundle inspection | When a budget is exceeded | Build output |
| **`schema-dts`** | 2.1.0 *latest* | Types for JSON-LD (dev only) | When the JSON-LD builder is implemented | Local type definitions |
| **`clsx`** | 2.1.1 *latest* | Conditional class names | Template strings get awkward | Small `cn` helper |
| **`server-only`** | Check at adoption | Fails the build if a server module enters client code | When `content/` is implemented, to enforce rule 6; needs a Vitest stub | Lint rule and bundle review |

## Deliberately excluded

| Excluded | Reason |
|---|---|
| Database, ORM | Nothing to store. See [ADR-004](ADR/ADR-004-static-configuration-instead-of-database.md) |
| Auth library | No accounts |
| Global state (Redux, Zustand) | State is local to a few islands |
| Data fetching (React Query, SWR) | No client data fetching |
| UI kits (MUI, Chakra) | Generic look and extra JavaScript conflict with a premium brand. shadcn/ui is possible for individual primitives, but not needed for this scope |
| Lightbox and carousel libraries | Native `<dialog>` and CSS scroll snap meet the requirement |
| `cva`, `tailwind-merge` | Few variants; plain functions suffice |
| CMS | No evidence yet that staff will edit often. Trigger defined in [ARCHITECTURE.md](ARCHITECTURE.md#21-scalability-strategy) |
| Google Tag Manager, Meta Pixel | Performance and privacy cost. Add only for a specific marketing need, with CSP and privacy notice updated |
| `react-player` | Native `<video>` and a simple YouTube facade are enough |

## Compatibility

| Item | Requirement |
|---|---|
| Node.js | Next.js 16 needs ≥ 20.9. Development machine: 24.17.0. Pin one major version with `.nvmrc`, `engines` and Vercel |
| npm | 11.x with committed `package-lock.json`, `npm ci` in CI |
| Browsers | Next.js 16 minimums: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+ |
| Bundler | Turbopack is the default for `dev` and `build`. Do not add a custom `webpack` config |
| `tsconfig` additions | `noUncheckedIndexedAccess`, `noImplicitOverride`; `allowJs: false` once the scaffold is replaced |
| `next.config.ts` additions | `poweredByHeader: false`, `typedRoutes: true`, security `headers()`, `images` limits |

## Next.js 16 conventions to follow

The bundled documentation in `node_modules/next/dist/docs/` is authoritative, per [AGENTS.md](AGENTS.md).

| Topic | Convention |
|---|---|
| `params`, `searchParams` | Asynchronous: must be awaited |
| Route prop types | Global `PageProps<"/route">` and `LayoutProps<"/route">`, generated by `next typegen` |
| Middleware | Renamed `proxy`. Not needed in release 1 |
| `next lint` | Removed. Use the ESLint CLI (`npm run lint`) |
| Image `priority` | Deprecated. Use `loading="eager"` or `fetchPriority="high"` |
| Image `qualities` | Default is only `[75]`. Others must be declared |
| `images.domains` | Deprecated. Use `remotePatterns` when needed |
| Runtime config | `publicRuntimeConfig` removed. Use environment variables |

## Maintenance

- Enable Dependabot or Renovate, with grouped weekly pull requests. Each must pass all CI gates.
- Review major upgrades against the Next.js upgrade guide.
- `npm audit --omit=dev` runs in CI. Critical advisories are treated as urgent.
- The next Next.js major release is expected to enable Cache Components and Partial Prefetching by default. See [ADR-007](ADR/ADR-007-fully-static-rendering-mode.md).
