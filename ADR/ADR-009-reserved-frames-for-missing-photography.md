# ADR-009: Reserved Frames for Missing Photography

**Status:** Accepted, amended by [ADR-010](ADR-010-illustrative-stock-photography.md), which allows labelled stock photographs · **Date:** 2026-11-05

## Context

The site's design depends on photography, but no licensed BAMBOOS photography or video exists yet. Stock images presented as the venue would mislead visitors, and random URLs are ruled out by ADR-006. Empty sections would leave the layout, gallery and lightbox impossible to build or review.

## Decision

Every image slot accepts a `Visual`: either a real image or a `pending` frame. A pending frame renders an original abstract line drawing, labelled "Reserved · Photograph to be supplied", with a brief describing the shot needed.

The briefs double as the photographer's shot list. Replacing an entry with a real image needs no component changes. `check:launch` blocks production while any pending frame remains.

## Alternatives considered

| Option | Why not |
|---|---|
| Stock photography | Could mislead visitors, and is prohibited by the brief |
| AI-generated venue images | Would misrepresent a real place |
| Omitting image sections | The design and gallery could not be built or reviewed |
| Grey boxes | Would make the client review less meaningful |

## Consequences

**Positive:** The full design and all interactions can be built, tested and reviewed honestly today.

**Negative:** The final visual impact can't be judged until real media arrives, and image-related performance must be measured again then.
