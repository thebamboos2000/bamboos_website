# ADR-007: Fully Static Rendering, Cache Components Deferred

**Status:** Accepted · **Date:** 2026-11-05

## Context

No page needs request-time data. Next.js 16.4 offers two ways to build this, and the difference matters mainly for enforcement and unknown URLs.

Both were built and run in a throwaway project on Next.js 16.4.5 with `next build` and `next start`:

| Behaviour | A: Default model | B: `cacheComponents` + `ensureStatic = "navigation"` |
|---|---|---|
| Known slugs | Prerendered | Prerendered |
| Unknown slug | 404 through `dynamicParams = false` | 404, but **rendered and cached on first request per slug** |
| `dynamicParams` | Available | **Not available** |
| Accidental `cookies()` | Route silently becomes dynamic. Needs an external check | **Build fails** |
| `new Date()` in a Server Component | Allowed | **Build fails** unless handled |
| Client navigation | Normal | Uses React `<Activity>`, keeping recently visited routes mounted but hidden |
| Config | None | Two flags plus `ensureStatic` |

The docs state both features will be enabled everywhere in the next major version, with the options removed.

## Decision

**Use option A for release 1.** Pages are static, `dynamicParams = false` on `/celebrations/[slug]`, and `cacheComponents` stays off.

Enforce static output with a CI gate that fails when the `next build` route table contains `ƒ`.

## Alternatives considered

| Option | Why not (now) |
|---|---|
| **Option B** | A real contender with stronger enforcement, and the framework's direction. Rejected for now because its model solves problems the site doesn't have, unknown URLs can trigger on-demand rendering and storage, and hidden-route behaviour adds cases to test (video, dialogs). The CI gate gives enough protection |
| `output: "export"` | Pure static files, but no default image optimiser and no `headers()`. Retained as the fallback in [ADR-008](ADR-008-hosting-plan.md) |
| Request-time rendering | Cost and latency without a requirement |

## Consequences

**Positive:** The simplest model, with no per-request rendering. Unknown URLs need no on-demand work. Low platform cost.

**Negative:** Enforcement depends on the CI gate instead of the framework. **A future migration is expected** at the next major version or when dynamic features arrive, whichever comes first.

**Migration when triggered:** Remove `dynamicParams`, enable both flags, set `ensureStatic = "navigation"` on the `(site)` layout (**not the root layout**, so future `(admin)` routes can be dynamic), and test navigation behaviour. On a fully static site this is a small change, and the test build confirmed the configuration works.

Note: footer years or similar values shouldn't rely on `new Date()` in Server Components, so this migration stays easy.
