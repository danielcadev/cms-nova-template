# Error Log

## Purpose

This log records concrete errors found during the security refactor, including whether they were pre-existing, what they affected, and whether they were fixed.

## Entries

### ERR-001 - TypeScript compile error in slug configuration

- Status: `Fixed`
- Type: `Build / pre-existing`
- File: `src/lib/slug-config.ts:1`
- Error: `Cannot find module '@/data/regions-static' or its corresponding type declarations.`
- Detected by: `npm run type-check`
- Impact: prevents a clean repository-wide type-check, reducing confidence in further refactors.
- Research relevance: this is a useful example of baseline instability in organically evolved codebases.
- Resolution: removed the stale import because the slug wizard config already operates in database-driven mode and no longer uses static region data.

### ERR-002 - Public type-path gate interpreted the wrong field

- Status: `Fixed`
- Type: `Security / logic`
- Files: `src/app/[typePath]/page.tsx`, `src/app/api/plugins/public-typepaths/route.ts`
- Error: route logic used `data.success` instead of `data.enabled`.
- Impact: public route exposure could remain enabled even when the feature flag was disabled.
- Resolution: centralized gate logic in `src/lib/plugins/public-typepaths.ts` and updated public routes to consume it.

### ERR-003 - Public content detail route lacked publication enforcement

- Status: `Fixed`
- Type: `Security / access control`
- File: `src/app/[typePath]/[slug]/page.tsx`
- Error: detail route resolved entries without an explicit `status: 'published'` constraint.
- Impact: draft or unpublished entries could be exposed publicly.
- Resolution: required a valid content type, removed permissive slug fallback, and enforced `status: 'published'`.

### ERR-004 - Public rich-text rendering lacked sanitization

- Status: `Fixed`
- Type: `Security / output encoding`
- File: `src/app/[typePath]/[slug]/page.tsx`
- Error: database content was rendered through `dangerouslySetInnerHTML` without visible sanitization.
- Impact: stored XSS risk on public pages.
- Resolution: introduced `src/lib/security/html.ts` and sanitized public HTML before rendering.

### ERR-005 - Plugin config secrets were allowed into client persistence

- Status: `Fixed`
- Type: `Security / secret handling`
- Files: `src/lib/plugins/config.ts`, `src/lib/plugins/service.ts`, `src/components/admin/dashboard/PluginsPage/usePlugins.ts`, `src/app/api/plugins/[id]/route.ts`
- Error: env-backed secrets were embedded in plugin defaults and plugin config could be cached in browser `localStorage`.
- Impact: privileged configuration could leak into client-side state.
- Resolution: removed env secrets from defaults, masked sensitive fields in API responses, and removed localStorage persistence for plugin config.

### ERR-006 - Multiple admin-oriented GET APIs were publicly reachable

- Status: `Fixed`
- Type: `Security / route exposure`
- Files:
  - `src/app/api/content-types/[slug]/entries/route.ts`
  - `src/app/api/content-types/[slug]/entries/[id]/route.ts`
  - `src/app/api/content-entries/route.ts`
  - `src/app/api/plans/route.ts`
  - `src/app/api/plans/[id]/route.ts`
  - `src/app/api/experiences/route.ts`
  - `src/app/api/media/route.ts`
  - `src/app/api/media/folders/route.ts`
  - `src/app/api/content-types/[slug]/route.ts`
- Error: GET handlers returned admin or internal data without requiring an admin session.
- Impact: unauthorized data enumeration and visibility into unpublished or internal CMS structures.
- Resolution: added admin-session or admin-role checks to these GET handlers.

### ERR-007 - Taxonomy hierarchy server action allowed unauthenticated reads

- Status: `Fixed`
- Type: `Security / server action exposure`
- File: `src/app/actions/slug-data.ts`
- Error: `getSlugHierarchy()` returned region, subregion, and zone data without requiring an admin session.
- Impact: internal taxonomy data could be queried from admin-adjacent client flows without authorization.
- Resolution: required `getAdminSession()` before returning hierarchy data.

### ERR-008 - First-admin bootstrap lacked basic setup hardening

- Status: `Fixed`
- Type: `Security / initialization`
- File: `src/app/api/admin/create-first-admin/route.ts`
- Error: the bootstrap endpoint had no rate limit and no optional setup-token enforcement.
- Impact: a fresh deployment could be claimed by the first external caller with minimal friction.
- Resolution: added request rate limiting and optional setup-token validation through `NOVA_SETUP_TOKEN` or `SETUP_TOKEN`.

### ERR-009 - Sensitive operational logging persisted in critical auth and admin routes

- Status: `Fixed`
- Type: `Security / observability`
- Files:
  - `src/app/api/auth/[...all]/route.ts`
  - `src/app/api/admin/create-user/route.ts`
  - `src/app/api/admin/delete-user/route.ts`
  - `src/app/actions/slug-data.ts`
  - `src/utils/logger.ts`
  - `src/app/api/content-types/route.ts`
  - `src/app/api/content-types/[slug]/route.ts`
  - `src/app/api/content-types/[slug]/entries/route.ts`
  - `src/app/api/content-types/[slug]/entries/[id]/route.ts`
  - `src/app/api/experiences/route.ts`
  - `src/app/api/media/folders/route.ts`
  - `src/app/api/plugins/[id]/route.ts`
- Error: debug logs exposed environment details, user metadata, and operational traces in sensitive paths.
- Impact: increased risk of leaking internal state through logs.
- Resolution: removed high-sensitivity debug logs, introduced a sanitized centralized logger, and migrated a set of critical routes and actions to it.
- Remaining concern: the repository still contains lower-priority raw console usage in other areas that should be migrated gradually.

### ERR-010 - Stale Next generated route types after legacy route deletion

- Status: `Fixed`
- Type: `Build / generated artifacts`
- Files: `.next/dev/types/validator.ts`, `.next/types/validator.ts`
- Error: after deleting legacy `/admin/dashboard/plans` routes, TypeScript still referenced removed generated route files under `.next`.
- Impact: `npm run type-check` failed even though source code was valid.
- Resolution: cleared the stale `.next` build cache and reran type-check so generated route types matched the current app tree.

### ERR-011 - Debug and repair routes remained in the production app tree

- Status: `Fixed`
- Type: `Security / architectural residue`
- Files:
  - `src/app/api/admin/system/debug-fields/route.ts`
  - `src/app/api/admin/system/inspect-fields/route.ts`
  - `src/app/api/admin/system/fix-selects/route.ts`
  - `src/app/api/admin/system/fix-seo/route.ts`
  - `src/app/api/admin/system/repopulate-options/route.ts`
- Error: one-off maintenance and debug routes remained in the live application tree even after the main architecture cleanup.
- Impact: unnecessary admin surface, higher review cost, and weaker separation between product code and internal repair tooling.
- Resolution: removed the routes from the app tree.

### ERR-012 - Duplicate and bridge paths remained after the main refactor

- Status: `Fixed`
- Type: `Architecture / residual duplication`

### ERR-013 - Plaintext secrets persisted in a filesystem plugin store

- Status: `Fixed`
- Type: `Security / secret handling`
- Files: `src/lib/plugins/store.json`, `src/app/api/plugins/[id]/route.ts`, `src/modules/plugins/utils.ts`
- Error: plugin state/config was persisted on disk in `src/lib/plugins/store.json`, and server code read from that file.
- Impact: secrets could exist in plaintext on developer machines and in backups; the store also created cross-instance drift in multi-node deployments.
- Resolution: removed the filesystem store, migrated plugin persistence to `NovaConfig` (database), and enforced encryption for sensitive plugin fields (e.g. API keys) when saving via the admin plugin API.

### ERR-014 - Next.js build failed due to middleware + proxy conflict

- Status: `Fixed`
- Type: `Build / framework constraint`
- Files: `src/middleware.ts`, `src/proxy.ts`
- Error: Next.js detected both `middleware.ts` and `proxy.ts` and refused to build (`middleware-to-proxy`).
- Impact: production build blocked.
- Resolution: removed `src/middleware.ts` and relied on the framework-supported `src/proxy.ts` entry point.
- Files:
  - `src/app/api/admin/create-user/route.ts`
  - `src/components/admin/dashboard/TemplatesPage/TemplateDetailModal.tsx`
  - `src/lib/plugins/config.ts`
  - `src/lib/plugins/utils.ts`
  - `src/lib/plugins/index.ts`
  - `src/lib/plugins/service.ts`
  - `src/lib/auth.ts`
  - `src/lib/server-session.ts`
  - `src/utils/logger.ts`
- Error: a duplicate admin user-creation endpoint, an unused modal with simulated actions, and plugin compatibility bridges remained after the primary module migration.
- Impact: unnecessary maintenance surface and continued ambiguity about canonical paths.
- Resolution: removed the duplicate endpoint, removed the unused modal, and deleted the obsolete plugin bridge files after verifying no active imports remained.

### ERR-013 - Generated artifacts, dead bridges, and unused route layers remained in the repository

- Status: `Fixed`
- Type: `Architecture / repository residue`
- Files:
  - `test-editor.html`
  - `analyze_out.json`
  - `strict_analyze_out.json`
  - `lint_report.json`
  - `script_output.txt`
  - `ts_errors.txt`
  - `tsconfig.tsbuildinfo`
  - `src/app/api/templates/tourism/route.ts`
  - `src/verticals/tourism/server/api/templates.ts`
  - `src/app/actions/content-type-actions.ts`
  - `src/app/actions/experience-actions.ts`
  - `src/app/actions/plan-actions.ts`
  - `src/app/actions/slug-data.ts`
  - `src/components/admin/content-types/ContentTypesManager/index.tsx`
  - `src/components/admin/content-types/ContentTypesManager/ContentTypesManager.tsx`
  - `src/components/admin/content-types/ContentTypesManager/components/ContentTypeEditor.tsx`
  - `src/components/admin/content-types/ContentTypesManager/hooks/useContentTypes.ts`
  - and other unused UI/report artifacts removed in the same pass
- Error: generated outputs, compatibility wrappers, and obsolete UI layers were still tracked even after the main cleanup.
- Impact: the repository still contained non-essential files that increased noise and weakened the claim of minimal structure.
- Resolution: removed the tracked artifacts, unused route layers, dead action bridges, and unused manager entrypoints after validating that no active imports remained.

## Notes

- This log intentionally includes both security flaws and build/runtime errors.
- For the research, these entries matter because they show the difference between visible functionality and structural correctness.
