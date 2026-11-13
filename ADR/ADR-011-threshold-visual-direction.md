# ADR-011: The Threshold Visual Direction

**Status:** Accepted · **Date:** 2026-11-06

## Context

The first implementation was rejected by the client as reading like an ordinary business website. The two reference reels are built as one continuous camera move in pale, restrained space: an object framed by a gold line, a short uppercase statement, then a move through the object into full-screen rooms.

## Decision

The site is built around one idea: the visitor is led through a doorway.

- **Journey:** the homepage opens on an arched window in pale space. A `--p` scroll variable, set by one small client component, drives CSS that expands the arch to full screen. Later scenes rise in the same arch.
- **Scenes, not sections:** events are full-screen rooms stacked with CSS `position: sticky`.
- **Type:** uppercase Cormorant statements, with italic lower-case words carrying the feeling.
- **Colour:** pale ivory ground, deep forest, champagne line. All stock photography passes through one grade.
- **Motion:** never scroll-jacked. With reduced motion or no JavaScript, the Journey is a composed still and everything is readable.

## Alternatives considered

| Option | Why not |
|---|---|
| Full-bleed hero with an overlay | The previous design. It reads as a template |
| Scroll library such as GSAP or Lenis | Unnecessary dependency, and smooth-scroll libraries take over native scrolling |
| Auto-playing hero slideshow | Needs pause controls, and moves without the visitor's intent |

## Consequences

**Positive:** A distinctive first impression, with almost no added JavaScript.

**Negative:** The homepage is long, with about 4.8 screens of travel in the opening. The arch depends on a strong central subject, so **real BAMBOOS photography must be art-directed for it**, not simply swapped in.
