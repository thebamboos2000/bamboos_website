# ADR-006: Media Management Strategy

**Status:** Accepted · **Date:** 2026-11-05

## Context

Photography sells this venue, yet it's also the biggest threat to Core Web Vitals. The site needs a repeatable way to add images with correct dimensions, alt text and rights. Random image URLs are not acceptable as permanent assets. Next.js 16 changed some image defaults, including `qualities` and deprecating `priority`.

## Decision

| Media | Approach |
|---|---|
| Photos | Web masters in `src/assets/media/`, **statically imported** and delivered through `next/image` |
| Short background video | `public/media/video/`, with a poster rendered through `next/image`. Under 4 MB, muted, with a pause control |
| Long film | YouTube, using a click-to-load facade |
| Originals | Outside Git, in BAMBOOS's archive |

- `MediaAsset` requires `alt`, and types `src` as `StaticImageData | string`.
- Rights confirmed and metadata stripped before intake.
- Named `sizes` presets; restricted `deviceSizes` and `qualities`.
- WebP by default, with AVIF only if measurement justifies it.
- Hero poster is the LCP element, with `fetchPriority="high"`, and isn't animated in.

## Alternatives considered

| Option | Why not (now) |
|---|---|
| Image paths in `public/` | Manual width and height, no blur placeholder, and a missing file becomes a runtime 404 instead of a build failure |
| Cloudinary or other media CDN | Another account and cost, unnecessary for a curated gallery. The planned next step at scale |
| CMS media library | No CMS yet |
| Pre-generating variants with a script | Duplicates what `next/image` does |
| Git LFS | Extra setup; size limits make it unnecessary |
| Self-hosting long video | Large files, no adaptive streaming |

## Consequences

**Positive:** Missing images fail the build. No layout shift. Automatic blur placeholders. Hashed, cacheable URLs. Assets are versioned with the code.

**Negative:** Git history grows with every image, and removed images stay in history. Adding images needs a developer. Blur data adds a small payload per image. On-demand optimisation consumes Vercel usage.

**Move to a media CDN or CMS when:** more than 300 images, more than 300 MB in the repository, or non-developers need to upload. Components don't change, because of the `src` union type.
