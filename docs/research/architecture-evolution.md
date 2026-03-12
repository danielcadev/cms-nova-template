# Architecture Evolution

## Purpose

This document explains the structural evolution of `CMS Nova` from an organically grown application into a more explicit platform architecture. It is written as both a technical record and a research artifact for the Vibe-Guard case study.

## Starting State

At the beginning of the refactor, the repository showed a familiar AI-assisted growth pattern:

- working features existed across many surfaces,
- security logic was present but distributed,
- public and privileged behavior were mixed,
- business-specific code lived alongside reusable CMS code,
- duplicate routes and components increased maintenance noise,
- `app/`, `lib/`, `components/`, and `actions/` carried mixed responsibilities.

This state was functional, but structurally weak. The codebase communicated implementation history more clearly than architectural intent.

## Before

### Folder Semantics Were Weak

The old layout made it hard to answer basic architectural questions:

- Which files are server-only?
- Which code is reusable across projects?
- Which code belongs to tourism or experiences only?
- Which routes are public versus admin-only?

Because those answers were not encoded in folder boundaries, many decisions had to be inferred manually.

### `app/` Held Too Much Logic

Route files and action files often contained core business logic directly. This increased the risk that future edits, including AI-generated edits, would modify policy-sensitive behavior in place without preserving broader invariants.

### `lib/` Became a Catch-All

Authentication, plugin configuration, session helpers, security helpers, and runtime behavior were mixed together in ways that obscured privilege boundaries.

### Business Verticals Polluted the Core

Tourism plans, experiences, and generic CMS concerns were not yet clearly separated. This made the repository look like one evolving product instead of a reusable platform capable of powering multiple instances such as `ConociendoColombia` or an Expedia-like travel product.

## Intervention Steps

The refactor proceeded incrementally to avoid breaking the system while improving architectural clarity.

### 1. Security-first stabilization

The first phase focused on security-critical fixes:

- public route gating was restored,
- unpublished content exposure was reduced,
- rich-text sanitization was introduced,
- plugin secret leakage was reduced,
- admin-only GET surfaces were restricted,
- first-admin bootstrap was hardened,
- sensitive logging was reduced and centralized.

This established a safer baseline before moving folders and ownership boundaries.

### 2. Server and shared foundations

Dedicated structural homes were created for privileged and reusable concerns:

- `src/server/auth/`
- `src/server/observability/`
- `src/server/plugins/`
- `src/shared/security/`

This allowed runtime-sensitive behavior to leave generic helper folders.

### 3. Module extraction

Core CMS concerns began moving into module-oriented entry points:

- `src/modules/auth/`
- `src/modules/plugins/`
- `src/modules/content/`
- `src/modules/content/server/`

At this stage, `app/actions` and some `lib/*` files were reduced to compatibility bridges rather than primary implementation locations.

### 4. Vertical extraction

Business-specific layers were separated into vertical packs:

- `src/verticals/tourism/`
- `src/verticals/experiences/`
- `src/verticals/tourism/server/`
- `src/verticals/experiences/server/`

This introduced a clearer distinction between reusable CMS infrastructure and opinionated business features.

### 5. API thinning

Vertical-specific API logic was extracted from `src/app/api/` into vertical-owned server handlers, leaving route files as thin exports.

This reduced accidental coupling between routing and business logic.

### 6. Dead-code reduction

Obvious unused files, duplicate media components, and legacy plan/template routes were removed.

This was not cosmetic. It reduced false complexity and improved the auditability of the repository.

## After

The repository now communicates architectural intent more clearly.

### Core structure

- `src/server/` contains privileged runtime behavior
- `src/modules/` contains reusable CMS capabilities
- `src/shared/` contains reusable cross-project helpers
- `src/verticals/` contains business-specific packs
- `src/app/` increasingly acts as route registration and composition

### Compatibility strategy

Legacy files still exist where needed, but they now mostly serve as migration bridges. This preserves stability while allowing a gradual move away from historical paths.

### Product meaning

The codebase now supports a more credible product story:

- `Nova Core` for reusable CMS infrastructure,
- `Nova Verticals` for tourism, experiences, and future domain packs,
- project instances for branded downstream deployments.

## Why This Matters for the Research

This evolution directly supports the Vibe-Guard thesis.

The original problem was not only insecure code. It was structurally ambiguous code. Ambiguity allowed AI-assisted changes to make local sense while weakening global integrity.

The refactor shows the opposite strategy:

- encode trust boundaries in folders,
- reduce policy-sensitive logic in routes,
- separate core from vertical assumptions,
- create stable ownership boundaries,
- keep compatibility explicit rather than accidental.

In research terms, this transforms the repository from a passive example of drift into an active example of architectural intervention.

## Before vs After Summary

| Dimension | Before | After |
| --- | --- | --- |
| Security policy | Distributed and inconsistent | More centralized and documentable |
| Route ownership | Mixed with business logic | Thinner route composition |
| Core vs business logic | Blended together | Split between `modules/` and `verticals/` |
| Server/client boundary | Often implicit | More explicit through `server/` and `shared/` |
| Legacy paths | Accumulated organically | Reduced or turned into deliberate bridges |
| Reusability | Suggested but unclear | Architecturally supported |

## Remaining Work

The refactor is substantial, but not complete.

Still needed:

- fuller population of `src/modules/`,
- broader migration away from remaining legacy imports,
- central authorization wrappers,
- continued logging cleanup,
- eventual removal of temporary compatibility bridges.

## Conclusion

The most important outcome is not that the project became "cleaner." It is that the repository now better preserves system intent. That matters for both productization and research, because structural integrity is exactly what AI-assisted coding tends to weaken when global context is missing.
