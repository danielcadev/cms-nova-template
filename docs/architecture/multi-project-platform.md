# Multi-Project Platform Direction

## Why This Matters

`CMS Nova` is not only a single site. It is intended to power multiple products, including domain-specific sites such as travel, experiences, or country portals like `ConociendoColombia`.

That changes the architecture requirement.

The codebase should not be optimized only for one app. It should support:

- multiple vertical implementations,
- reusable admin capabilities,
- shared security policy,
- template-level customization without core drift.

## Product Perspective

The platform should be understood as three layers:

1. `Nova Core`
- auth
- content modeling
- entries
- media
- plugins
- admin permissions

2. `Nova Vertical Packs`
- tourism / travel
- experiences
- destination directories
- future project-specific packs

3. `Nova Project Instances`
- one repository instance for a client or product
- custom branding
- custom templates
- selected plugins and routes

## Architectural Consequence

To support multiple projects cleanly:

- project-agnostic logic should move into `modules/`, `server/`, and `shared/`,
- project-specific templates should be isolated in `verticals/`,
- security rules should remain centralized even when templates differ,
- plugin contracts should stay stable across deployments.

The first step of this separation is now in place:

- `src/verticals/tourism/index.ts`
- `src/verticals/experiences/index.ts`

These entry points make it easier to expose one business pack to a downstream project without importing generic internal folders directly.

## Research Consequence

This structure also strengthens the research.

When a system is intended for reuse across projects, local AI fixes become even more dangerous because they can spread architectural weaknesses to every downstream instance.

That makes `Vibe-Guard` more important, not less.

The research value is therefore broader than one CMS deployment:

- it studies how insecure local reasoning can propagate through reusable software foundations,
- and how centralized structural policy can protect a platform used across multiple products.

## Recommended Next Migration Steps

1. Continue from the first completed module migration: `auth`, `plugins`, and initial content configuration are now seeded under `src/modules/`.
2. Move the rest of content types and content entry policy into `modules/` plus `server/`.
3. Isolate travel-specific and project-specific templates from core CMS capability.
4. Create explicit `public` versus `admin` contracts for content type discovery and content reads.
5. Keep compatibility exports only as a temporary bridge, then remove them once imports are fully migrated.
