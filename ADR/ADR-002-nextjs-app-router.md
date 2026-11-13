# ADR-002: Next.js App Router

**Status:** Accepted · **Date:** 2026-11-05

## Context

The site needs static performance, strong SEO, image optimisation for heavy media, and a path to server features. The repository is already scaffolded with Next.js 16.4.5 and the App Router in `src/app`.

## Decision

Use the Next.js App Router with TypeScript, including route groups, nested layouts, metadata routes (`sitemap.ts`, `robots.ts`) and the Metadata API.

The version-matched documentation in `node_modules/next/dist/docs/` is authoritative for this project, because Next.js 16 has breaking changes from earlier versions.

## Alternatives considered

| Option | Why not |
|---|---|
| Next.js Pages Router | Legacy model with no Server Components, and larger client bundles by default |
| Astro | Very strong for static content, and a credible choice for release 1. Rejected because the likely admin and booking future fits better in one Next.js application, and the team's stack is React |
| WordPress | Easy editing, but ongoing plugin and security upkeep, and performance depends on discipline. Reconsider only if self-service editing becomes the top priority |
| Vite + React SPA | Weak default SEO, and no prerendering or image optimisation without extra work |

## Consequences

**Positive:** One framework for static pages now and server features later. Built-in image, font and metadata tooling. Static output is deployable on many hosts.

**Negative:** The framework is complex for a simple site, with frequent major changes. Mitigated by using a small part of it, testing the build output, and following the bundled upgrade guides. Async Server Components can't be unit-tested in Vitest, so routes are covered by E2E tests.
