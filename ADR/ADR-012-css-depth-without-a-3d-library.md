# ADR-012: CSS depth, without a 3D or animation library

## Status

Accepted.

## Context

The site needs a more cinematic feel: layered depth, perspective, mouse response and scroll storytelling. The brief allows GSAP, ScrollTrigger, Three.js or React Three Fiber if they are necessary. The brand is luxury hospitality, not technology, and mobile performance is already short of its load-time target.

## Decision

Add no dependencies. Depth comes from CSS 3D transforms and native scroll-driven animation. One client component, `MotionField`, feeds pointer position to the CSS, and `ScrollScene` feeds it scroll progress.

- Pinned scenes use `position: sticky`, so scrolling always stays native.
- Mouse effects run only with a fine pointer. Touch screens get swipeable rails and scroll-driven layers.
- Every scene's CSS default is its finished composition, which shows with reduced motion or without JavaScript.

## Consequences

- No extra JavaScript weight beyond one small listener.
- Browsers without scroll-driven animation show still layers, which is acceptable.
- WebGL effects aren't available. Reconsider only if a real 3D element, such as a model of the venue, is supplied and earns its cost.
