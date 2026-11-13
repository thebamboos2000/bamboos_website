# ADR-004: Static Configuration Instead of a Database

**Status:** Accepted · **Date:** 2026-11-05

## Context

Release 1 content is venue details, facilities, event categories, gallery items and contact facts. It changes rarely. Nothing needs querying at runtime, and enquiries go through WhatsApp. The brief also forbids hardcoding unverified capacity, amenities or contact details.

## Decision

- **Single facts** live in typed `src/config`.
- **Structured lists** live in typed `src/content`.
- **Environment-varying values** only are environment variables.
- **No database and no CMS.**
- Unverified facts are `null`: omitted from UI and JSON-LD, and blocked at launch by `check:launch`.
- Routes read content through small async `get*()` functions, the one seam for a future CMS.

## Alternatives considered

| Option | Why not |
|---|---|
| Database | Hosting, backups, security and cost, for data that doesn't change at runtime |
| Headless CMS now | Another account, cost and integration before there's evidence staff need it. A good later step |
| Markdown or MDX content | Structured records fit typed data better. Reconsider if long-form articles are added |
| JSON files | Static images can't be imported, and validation is weaker |
| Repository classes | One implementation. Plain functions give the same seam |

## Consequences

**Positive:** No running cost or data-layer attack surface. Errors are caught at build. Every change is reviewed and reversible through Git. Fast, static pages.

**Negative:** Developers must make content changes, with a deployment each time. **Launch can't happen until facts are supplied**, which is intended. Doesn't suit frequent updates.

**Revisit when:** staff need to edit without a developer, or enquiries and bookings must be recorded. See [DATA_MODEL.md](../DATA_MODEL.md#11-future-migration).
