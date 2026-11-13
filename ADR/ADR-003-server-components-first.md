# ADR-003: Server Components First

**Status:** Accepted · **Date:** 2026-11-05

## Context

An image-heavy site must perform on mid-range phones. Almost all of the content is static, and only a few elements are interactive.

## Decision

All components are Server Components by default. `"use client"` is allowed only for state, effects, browser APIs or event handlers, and is placed as low in the tree as possible.

Approved islands: mobile navigation and active link, gallery explorer, lightbox, enquiry form, hero video, reveal animation, and map facade. Adding another is a code review decision.

**Supporting rule:** Client Components don't import `src/content`, because that data references image files. Data arrives as props.

## Alternatives considered

| Option | Why not |
|---|---|
| Client Components by default | Larger bundles and slower interaction, with no benefit for static content |
| Zero-JS site | Filter, form and lightbox do need JavaScript |
| One client wrapper per page | Pulls entire pages into the bundle |

## Consequences

**Positive:** Less JavaScript, better INP and LCP. Content is in the initial HTML for search engines. Data stays on the server side of the boundary.

**Negative:** Developers must understand the boundary, including that props crossing it must be serialisable. Large props can inflate the page payload, so gallery data sent to the client is kept to what the island needs. Animation libraries need client wrappers, which is one reason CSS is the first choice.
