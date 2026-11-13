# ADR-008: Hosting on Vercel Pro

**Status:** Proposed. **This needs a client decision** · **Date:** 2026-11-05

## Context

The brief proposes Vercel. [Vercel's fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) restrict the free Hobby plan to non-commercial personal use, and say commercial use requires Pro or Enterprise. A business website falls under commercial use, so the free plan is not an option. This creates a recurring cost that BAMBOOS should approve.

## Decision

Recommend **Vercel Pro**, with the account and billing owned by the business. Enable usage alerts and a spend limit. Confirm current pricing and included usage directly with Vercel before commitment.

## Alternatives considered

| Option | Benefits | Costs |
|---|---|---|
| **Vercel Pro** (recommended) | Native support, previews, image optimiser, instant rollback, analytics, no platform work | Recurring per-seat fee and usage charges |
| Vercel Hobby | Free | **Not permitted for this commercial site** |
| Static export on a CDN such as Cloudflare Pages | Potentially cheaper. Possible because every route is static | `next/image` default loader unavailable, so an image pipeline is needed. Headers and previews need platform-specific setup |
| Next.js on a VPS or other Node host | Full control, possibly cheaper at scale | The team takes on patching, TLS, CDN, monitoring and rollback |

## Consequences

**Positive:** Minimal engineering effort, and the fastest route to a reliable launch.

**Negative:** A recurring cost, and some platform coupling: previews, rollback, image optimiser usage.

**Portability:** Because the application is static with no platform-specific server code, moving hosts later is limited to headers, previews and images.

## Decision needed from BAMBOOS

1. Approve the Vercel Pro recurring cost, or ask for a costed alternative.
2. Confirm who owns the account and billing.
