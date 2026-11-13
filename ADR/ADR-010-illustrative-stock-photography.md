# ADR-010: Illustrative Stock Photography Before Launch

**Status:** Accepted · **Date:** 2026-11-05 · **Amends:** [ADR-009](ADR-009-reserved-frames-for-missing-photography.md)

## Context

The client asked for the site to show premium photography throughout, while real BAMBOOS photography doesn't exist yet. The same brief prohibits presenting stock photographs as BAMBOOS, or implying that stock shows a real facility.

## Decision

Use properly licensed stock photographs as clearly disclosed placeholders.

- Files are stored locally in `src/assets/media/stock/` and statically imported, per ADR-006. Nothing is hotlinked.
- `MediaAsset.illustrative` marks each one. Frames show a visible "Illustrative image" label, alt text says it isn't BAMBOOS, and the footer carries a site-wide statement.
- `check:launch` counts illustrative images as blockers, the same as reserved frames.
- The venue exterior stays a reserved frame, because a stock building would misrepresent the location.
- Facility text stays "To be confirmed". A photograph never confirms a facility.
- All stock passes through one colour grade, and stays in its own folder, separate from future real photographs.
- Selection avoids religious imagery, recognisable faces and well-known buildings, so the site doesn't imply an affiliation or exclude communities. Sources are in [ASSET_ATTRIBUTION.md](../ASSET_ATTRIBUTION.md).

## Alternatives considered

| Option | Why not |
|---|---|
| Stock without labels | Misleading, and prohibited by the brief |
| `public/images` folder | Loses automatic dimensions, blur placeholders and build failure on a missing file |
| Hotlinking from Unsplash | Prohibited by the brief, and adds a third-party dependency and CSP changes |
| Waiting for real photography | The client wants to review and present the visual direction now |

## Consequences

**Positive:** The client can judge the visual direction, and performance can be measured with realistic images.

**Negative:** The labels are a visible reminder that the site isn't final. Repository size grows until the stock files are deleted. **The site must not launch with these images**, however good they look.
