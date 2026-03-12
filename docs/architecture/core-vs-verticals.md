# Core vs Verticals

## Purpose

`CMS Nova` is evolving into a reusable platform, so the repository must separate core CMS capabilities from business-specific implementations.

This distinction matters both for productization and for the research case study.

## Core Layers

The reusable core should contain features that apply to any downstream project:

- authentication and sessions
- content modeling
- content entries
- media management
- plugins
- security policy
- shared UI and utility layers

These concerns belong in `src/server/`, `src/modules/`, and `src/shared/`.

## Vertical Layers

A vertical is an opinionated business pack built on top of the core.

Examples in this repository:

- tourism / travel plans
- experiences

These concerns now begin to live behind dedicated entry points in:

- `src/verticals/tourism/index.ts`
- `src/verticals/experiences/index.ts`

Vertical packs now also begin to expose their own action and schema interfaces:

- `src/verticals/tourism/actions.ts`
- `src/verticals/tourism/server/actions.ts`
- `src/verticals/tourism/schema.ts`
- `src/verticals/experiences/actions.ts`
- `src/verticals/experiences/server/actions.ts`
- `src/verticals/experiences/schema.ts`

The purpose of these entry points is to avoid coupling downstream projects directly to internal folder details like `components/templates/...`.

## Why This Separation Matters

Without separation, a reusable CMS gradually turns into a single-product codebase with accidental extras. That makes it harder to:

- reuse in projects like `ConociendoColombia`,
- build industry-specific variants such as an Expedia-like travel product,
- audit security boundaries cleanly,
- explain what belongs to the core versus what belongs to a vertical customization.

## Research Value

This distinction also supports the research argument.

AI-assisted development often mixes general infrastructure with domain-specific shortcuts. Over time, this creates a repository where business-specific assumptions leak into the platform layer.

By separating `core` and `verticals`, the repository becomes a better case study for:

- structural integrity,
- modular reuse,
- policy enforcement across product variants,
- architectural drift under iterative generation.

## Current Direction

The current structure now points toward this model:

- `src/server/` for privileged runtime behavior
- `src/modules/` for domain capabilities shared across projects
- `src/shared/` for reusable helpers and UI
- `src/verticals/` for business-specific packs

The same extraction pattern now also applies to the content domain:

- `src/modules/content/server/content-type-actions.ts`
- `src/modules/content/server/slug-actions.ts`

This means `src/app/actions/` is increasingly reduced to compatibility wrappers rather than acting as the primary implementation layer.

The same boundary now starts to apply to API routes for vertical-specific capabilities:

- `src/verticals/tourism/server/api/plans.ts`
- `src/verticals/tourism/server/api/plan-by-id.ts`
- `src/verticals/tourism/server/api/templates.ts`
- `src/verticals/tourism/server/api/template-by-id.ts`
- `src/verticals/experiences/server/api/list.ts`
- `src/verticals/experiences/server/api/item.ts`

With this change, `src/app/api/` can increasingly act as a thin route registration layer while vertical-specific behavior lives closer to its business domain.

## Next Steps

1. Continue moving tourism and experiences actions, schemas, and API contracts behind vertical-owned entry points.
2. Keep shared CMS capabilities out of vertical folders.
3. Ensure public/admin contracts remain enforced at the core layer, not inside each vertical.
4. Eventually let downstream projects include only the vertical packs they need.
