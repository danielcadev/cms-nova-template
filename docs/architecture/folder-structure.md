# Folder Structure

## Goal

The repository is being reorganized so it can serve both as:

- a reusable CMS platform for multiple projects,
- and a research artifact for structural security in AI-assisted development.

The key rule is that folders should communicate architectural intent, not just file type.

## Target Layout

```text
src/
  app/
    (public)/
    admin/
    api/
  verticals/
    tourism/
    experiences/
  modules/
    auth/
    content/
    media/
    plugins/
    templates/
    users/
  server/
    auth/
    observability/
    plugins/
    policies/
    repositories/
    services/
  shared/
    components/
    security/
    types/
    utils/
  lib/
  utils/
```

## Meaning of Each Layer

### `app/`

Routing and composition only.

- page assembly
- route handlers
- minimal orchestration
- no core policy logic when avoidable

### `modules/`

Business domains.

- content types
- entries
- media
- templates
- auth
- users

Each module should eventually contain its own server logic, client hooks, components, schemas, and types.

### `verticals/`

Project-facing feature packs.

- tourism
- experiences
- future market-specific bundles

These packs compose core CMS capabilities into opinionated business experiences without polluting the reusable core.

### `server/`

Privileged runtime logic.

- auth configuration
- session guards
- logging
- secret resolution
- policy checks
- repository helpers

Nothing here should depend on client UI code.

### `shared/`

Truly reusable cross-project code.

- sanitized HTML helpers
- shared UI primitives
- generic types
- small pure utilities

### `lib/` and `utils/`

Compatibility layer during migration.

These folders still exist because the refactor is incremental. Existing imports can continue working while code is moved into `server/`, `modules/`, and `shared/`.

## First Completed Refactor Step

The repository now has an initial architecture foundation:

- `src/server/auth/config.ts`
- `src/server/auth/session.ts`
- `src/server/observability/logger.ts`
- `src/server/plugins/public-typepaths.ts`
- `src/shared/security/html.ts`
- `src/modules/auth/client.ts`
- `src/modules/auth/utils.ts`
- `src/modules/auth/server.ts`
- `src/modules/plugins/config.ts`
- `src/modules/plugins/utils.ts`
- `src/modules/plugins/service.ts`
- `src/modules/content/slug-config.ts`
- `src/modules/content/slug-actions.ts`
- `src/modules/content/content-type-actions.ts`
- `src/verticals/tourism/index.ts`
- `src/verticals/experiences/index.ts`

Legacy paths such as `src/lib/auth.ts`, `src/lib/server-session.ts`, `src/lib/plugins/public-typepaths.ts`, `src/lib/security/html.ts`, and `src/utils/logger.ts` now act as compatibility exports.

This keeps the project stable while preparing a larger domain-based migration.

The first populated feature modules are now `auth`, `plugins`, and the initial content layer, while `tourism` and `experiences` now have vertical entry points that separate business-specific UI from the reusable CMS core.

The latest cleanup pass also introduces `src/server/auth/guards.ts` so request-bound auth checks can be shared across routes without repeating session parsing logic in each file.
