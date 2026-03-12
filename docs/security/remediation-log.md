# Remediation Log

## Current Iteration

This log records the security fixes implemented after the initial structural audit.

## Changes Applied

### 1. Public type-path gating was centralized

- Added `src/lib/plugins/public-typepaths.ts`
- Updated `src/app/[typePath]/page.tsx`
- Updated `src/app/[typePath]/[slug]/page.tsx`
- Updated `src/app/api/plugins/public-typepaths/route.ts`

Result:

- public type-path routes now rely on a shared gate,
- the index route no longer misinterprets `success` as `enabled`,
- the detail route now actively enforces the feature gate.

### 2. Public content visibility was tightened

- Updated `src/app/[typePath]/[slug]/page.tsx`

Result:

- public detail lookup now requires a valid content type,
- the route no longer performs permissive global slug fallback,
- content entries must now match `status: 'published'` before rendering.

### 3. Basic HTML sanitization was introduced for public rendering

- Added `src/lib/security/html.ts`
- Updated `src/app/[typePath]/[slug]/page.tsx`

Result:

- public rich-text rendering now strips dangerous tags,
- inline event handlers, style attributes, and `javascript:` URLs are removed before output.

Note:

- this is a meaningful hardening step, but it should later be replaced with a stricter allowlist-based sanitizer if the project continues to support rich HTML from editors.

### 4. Plugin secret exposure was reduced

- Updated `src/lib/plugins/config.ts`
- Updated `src/app/api/plugins/[id]/route.ts`
- Updated `src/lib/plugins/service.ts`
- Updated `src/components/admin/dashboard/PluginsPage/usePlugins.ts`

Result:

- env-backed secrets are no longer embedded in client-facing plugin defaults,
- generic plugin config responses now mask sensitive values before returning to the client,
- plugin config is no longer persisted in browser `localStorage`,
- client code now depends on server responses instead of local secret caching.

### 4.1. Filesystem plugin store was removed and replaced with DB-backed persistence

- Updated `src/app/api/plugins/[id]/route.ts`
- Added `src/app/api/plugins/dynamic-nav/route.ts` (public GET, admin POST)
- Updated `src/modules/plugins/utils.ts`
- Updated `src/server/plugins/public-typepaths.ts`
- Removed `src/lib/plugins/store.json`

Result:

- plugin enablement + config are now stored in `NovaConfig` (database) under `plugin:<id>` keys,
- sensitive config fields (e.g. API keys) are encrypted at rest when saved through the admin API,
- public routes no longer depend on a local on-disk state file,
- multi-instance deployments avoid per-node config drift.

### 5. Admin-only GET surfaces were restricted

- Updated `src/app/api/content-types/[slug]/entries/route.ts`
- Updated `src/app/api/content-types/[slug]/entries/[id]/route.ts`
- Updated `src/app/api/content-entries/route.ts`
- Updated `src/app/api/plans/route.ts`
- Updated `src/app/api/plans/[id]/route.ts`
- Updated `src/app/api/experiences/route.ts`
- Updated `src/app/api/media/route.ts`
- Updated `src/app/api/media/folders/route.ts`
- Updated `src/app/api/content-types/[slug]/route.ts`

Result:

- admin-oriented data retrieval endpoints no longer expose internal data to unauthenticated users,
- content, media, plan, and schema retrieval now align more closely with intended admin access boundaries.

### 6. Remaining exposed admin-adjacent surfaces were hardened

- Updated `src/app/actions/slug-data.ts`
- Updated `src/app/api/content-types/route.ts`
- Updated `src/app/api/admin/create-first-admin/route.ts`

Result:

- taxonomy hierarchy reads now require an admin session,
- content type discovery now requires either an admin session or public type-path exposure to be enabled,
- first-admin bootstrap now has basic anti-abuse controls through rate limiting and optional setup-token enforcement.

### 7. Sensitive logging was reduced in critical routes

- Updated `src/utils/logger.ts`
- Updated `src/app/api/auth/[...all]/route.ts`
- Updated `src/app/api/admin/create-user/route.ts`
- Updated `src/app/api/admin/delete-user/route.ts`
- Updated `src/app/actions/slug-data.ts`
- Updated `src/app/api/content-types/route.ts`
- Updated `src/app/api/content-types/[slug]/route.ts`
- Updated `src/app/api/content-types/[slug]/entries/route.ts`
- Updated `src/app/api/content-types/[slug]/entries/[id]/route.ts`
- Updated `src/app/api/experiences/route.ts`
- Updated `src/app/api/media/folders/route.ts`
- Updated `src/app/api/plugins/[id]/route.ts`

Result:

- environment-level auth bootstrap logs were removed,
- admin user-management routes no longer log raw user metadata on success paths,
- a sanitized centralized logger now redacts sensitive keys before writing context,
- several critical API and action paths now use the centralized logger instead of raw console calls.

### 8. Architecture foundation for reuse and research was created

- Added `src/server/auth/config.ts`
- Added `src/server/auth/session.ts`
- Added `src/server/observability/logger.ts`
- Added `src/server/plugins/public-typepaths.ts`
- Added `src/shared/security/html.ts`
- Added `src/modules/auth/client.ts`
- Added `src/modules/auth/utils.ts`
- Added `src/modules/auth/server.ts`
- Added `src/modules/plugins/config.ts`
- Added `src/modules/plugins/utils.ts`
- Added `src/modules/plugins/service.ts`
- Added `src/modules/content/slug-config.ts`
- Added `src/modules/content/slug-actions.ts`
- Added `src/modules/content/content-type-actions.ts`
- Added `src/verticals/tourism/index.ts`
- Added `src/verticals/experiences/index.ts`
- Added `src/verticals/tourism/actions.ts`
- Added `src/verticals/tourism/server/actions.ts`
- Added `src/verticals/tourism/schema.ts`
- Added `src/verticals/experiences/actions.ts`
- Added `src/verticals/experiences/server/actions.ts`
- Added `src/verticals/experiences/schema.ts`
- Updated compatibility exports in `src/lib/auth.ts`
- Updated compatibility exports in `src/lib/auth-client.ts`
- Updated compatibility exports in `src/lib/auth-utils.ts`
- Updated compatibility exports in `src/lib/server-session.ts`
- Updated compatibility exports in `src/lib/plugins/config.ts`
- Updated compatibility exports in `src/lib/plugins/utils.ts`
- Updated compatibility exports in `src/lib/plugins/public-typepaths.ts`
- Updated compatibility exports in `src/lib/security/html.ts`
- Updated compatibility exports in `src/utils/logger.ts`

Result:

- privileged runtime concerns now have a dedicated `server` home,
- the first domain modules now exist for auth, plugins, and core content flows,
- tourism and experiences now have dedicated vertical entry points,
- tourism and experiences actions/schemas now begin to move behind vertical-owned interfaces,
- vertical server action paths now contain the real implementation, with `src/app/actions/` reduced to compatibility re-exports,
- content-type and slug actions now also live under `src/modules/content/server/`, with `src/app/actions/` kept only as a bridge,
- plans, experiences, and tourism-template API handlers now also live under vertical server paths, with `src/app/api/` reduced to thin route exports,
- shared sanitization now has a dedicated `shared` home,
- legacy imports remain functional during migration,
- the repository can evolve toward a multi-project CMS platform without a breaking refactor.

### 9. Obsolete compatibility bridges were removed

- Removed `src/lib/auth-client.ts`
- Removed `src/lib/auth-utils.ts`
- Removed `src/lib/security/html.ts`
- Removed `src/lib/slug-config.ts`
- Removed `src/lib/plugins/public-typepaths.ts`
- Removed `src/components/templates/index.tsx`
- Updated `src/app/api/plugins/public-typepaths/route.ts`

Result:

- temporary migration bridges that no longer had active imports were removed,
- the repository now depends more directly on `modules`, `server`, `shared`, and `verticals`,
- architectural intent is clearer because fewer historical aliases remain.

### 10. Final architecture cleanup reduced legacy server imports

- Added `src/server/auth/guards.ts`
- Updated vertical API handlers under `src/verticals/tourism/server/api/`
- Updated vertical API handlers under `src/verticals/experiences/server/api/`
- Updated content server actions under `src/modules/content/server/`
- Updated selected admin/content/media/plugin routes under `src/app/api/`
- Updated `src/app/api/auth/[...all]/route.ts`

Result:

- more server-side files now import directly from `src/server/auth/` and `src/server/observability/`,
- repeated request-session logic was reduced through a reusable guard helper,
- legacy bridges such as `src/lib/auth.ts`, `src/lib/server-session.ts`, and `src/utils/logger.ts` now remain primarily in secondary admin pages and utility routes where broader migration is still pending.

After the latest page-level cleanup, those legacy imports are now largely reduced to optional compatibility layers rather than active architectural dependencies.

### 11. Residual garbage and debug-only files were removed

- Removed admin-only repair and debug routes under `src/app/api/admin/system/`
- Removed the mock tourism template detail API under `src/app/api/templates/tourism/[id]/route.ts`
- Removed its backing handler `src/verticals/tourism/server/api/template-by-id.ts`
- Removed unused UI and hooks such as `src/components/admin/media/MediaPickerModal.tsx`, `src/components/public/HomeTopNav.tsx`, `src/components/admin/content-types/fields/SimpleRichEditor.tsx`, `src/components/templates/TemplatesManager/usePlans.ts`, and `src/hooks/index.ts`
- Removed obsolete dashboard content-entry components and hooks under `src/components/admin/dashboard/ContentTypesPage/`

Result:

- the repository contains less operational residue,
- fewer debug and mock surfaces remain in the live app tree,
- duplicated content-entry flows were reduced further,
- review cost and architectural noise decreased again.

### 12. Final duplicate and bridge cleanup reduced ambiguity further

- Removed `src/app/api/admin/create-user/route.ts`
- Removed `src/components/admin/dashboard/TemplatesPage/TemplateDetailModal.tsx`
- Removed `src/lib/plugins/config.ts`
- Removed `src/lib/plugins/utils.ts`
- Removed `src/lib/plugins/index.ts`
- Removed `src/lib/plugins/service.ts`
- Removed `src/lib/auth.ts`
- Removed `src/lib/server-session.ts`
- Removed `src/utils/logger.ts`

Result:

- the canonical user-creation flow is clearer,
- an unused modal with simulated behavior no longer suggests non-existent template management paths,
- plugin access now points directly to module-owned files instead of compatibility bridges,
- auth, session, and logging now resolve directly from `src/server/` instead of legacy aliases.

### 13. Exhaustive residue cleanup removed generated and dead structural layers

- Removed generated report artifacts and build leftovers from the repository root
- Removed unused action bridge files under `src/app/actions/`
- Removed the unused tourism template listing API layer
- Removed unused UI barrels and obsolete manager entrypoints
- Removed dead helper files such as `src/hooks/useDebounce.ts`, `src/lib/projects.ts`, and `src/types/blog.ts`

Result:

- the repository is substantially closer to a zero-residue state,
- tracked files now align more closely with active architecture and runtime behavior,
- the distinction between live code and historical clutter is much sharper.

## Research Relevance

These changes are useful to the study because they show what a policy-aware intervention looks like in practice:

- route exposure was corrected through centralized gating,
- publication policy was restored at the query layer,
- secret handling was moved away from client persistence,
- rendering safety was treated as a cross-cutting concern rather than a UI detail.

## Remaining Work

- centralize authorization wrappers for route handlers and server actions,
- continue migrating remaining raw console usage to the centralized logger,
- move domain logic from generic folders into `src/modules/`,
- migrate the repository to domain-based modules.

## Remaining Risks After This Iteration

- `src/app/api/content-types/route.ts` still serves a dual role for admin and public dynamic navigation, which should eventually be split into explicit public and admin contracts.
- the first-admin bootstrap is safer, but still depends on deployment discipline if no setup token is configured.
- raw logging remains distributed across the repository outside the most sensitive paths and still needs broader migration.
- the domain layer (`src/modules/`) is still a target structure and not yet fully populated.

## Verification Notes

- `npm run type-check` was executed after the changes.
- The previous pre-existing missing-module error in `src/lib/slug-config.ts:1` was fixed by removing a stale dependency on `@/data/regions-static`.
- `npm run type-check` now completes successfully.
