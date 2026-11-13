# ADR-001: Feature-Based Modular Monolith

**Status:** Accepted · **Date:** 2026-11-05

## Context

BAMBOOS needs a focused website: seven business capabilities, one write path, and likely one small team. It may later gain enquiry management, bookings and a CMS. The structure must stay simple now without forcing a restructure later.

## Decision

Build one Next.js application and one deployment, organised into feature modules (`home`, `venue`, `celebrations`, `gallery`, `facilities`, `enquiries`, `contact`) above shared foundations.

- Features expose a public `index.ts`, and **never import one another**.
- Routes in `src/app` are the only place features are composed.
- Boundaries are enforced with ESLint, using `no-restricted-imports` and `import/no-cycle`, with no new dependencies.

## Alternatives considered

| Option | Why not |
|---|---|
| Layer-only folders | A single capability scatters across the tree. Boundaries can't be enforced by capability |
| Separate frontend and backend | Two deployments and an API for a site with no server data needs |
| Microservices | Operational cost with no benefit at this scale |
| Full Clean or hexagonal architecture | Interfaces with a single implementation create ceremony. Its useful parts are kept: inward dependencies, and logic separate from UI |
| Monorepo with packages | Only one application exists |

## Consequences

**Positive:** Clear ownership. Features can be changed independently. New capabilities are added as new modules. New developers can navigate by business vocabulary.

**Negative:** Some data and UI needs a deliberate move to shared code. The composition rule means pages have a few more imports than if features imported each other. Barrel files need to stay small, to avoid bundling surprises.

**Revisit if:** multiple teams or an independently scaling workload appears. A module could then be extracted, since boundaries already exist.
