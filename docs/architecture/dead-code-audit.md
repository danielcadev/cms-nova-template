# Dead Code Audit

## Purpose

This document records likely unused or legacy code discovered during the architectural cleanup of `CMS Nova`.

For the research context, these files matter because they represent architectural drift: code that remains in the repository after the active system has already moved on. In AI-assisted workflows, this kind of drift is especially common because new implementations are often added without fully removing superseded ones.

## Categories

### Safe Delete Candidates

These files appear to have no active imports or meaningful runtime role.

- `src/components/admin/tourism/TourismPlansManager.tsx` - deleted after confirming it was empty and unreferenced.
- `src/hooks/use-transportation.ts` - deleted after confirming no usage.
- `src/hooks/use-form-persistence.ts` - deleted after confirming no usage.
- `src/hooks/useUsersTable.ts` - deleted after confirming no usage.
- `src/components/admin/shared/HeroSection.tsx` - deleted after confirming no usage.
- `src/components/admin/shared/FormContainer.tsx` - deleted after confirming no usage.
- `src/components/admin/shared/ContentHeader.tsx` - deleted after confirming no usage.
- `src/app/admin/dashboard/content-types/ContentTypesClient.tsx` - deleted as abandoned route helper.
- `src/app/admin/dashboard/content-types/ContentTypesServer.tsx` - deleted as an unreferenced duplicate of current route behavior.

### Archive or Maybe-Reusable Candidates

These files are currently low-value in the active app, but may still be useful as compatibility bridges or as a temporary migration layer.

At this point, the main bridge files in this category have already been removed after import migration completed.

The following bridge files were removed after import migration completed:

- `src/lib/auth-client.ts`
- `src/lib/auth-utils.ts`
- `src/lib/security/html.ts`
- `src/lib/slug-config.ts`
- `src/lib/plugins/public-typepaths.ts`
- `src/components/templates/index.tsx`

Additional cleanup completed in the latest pass:

- `src/app/api/admin/system/debug-fields/route.ts`
- `src/app/api/admin/system/inspect-fields/route.ts`
- `src/app/api/admin/system/fix-selects/route.ts`
- `src/app/api/admin/system/fix-seo/route.ts`
- `src/app/api/admin/system/repopulate-options/route.ts`
- `src/app/api/templates/tourism/[id]/route.ts`
- `src/verticals/tourism/server/api/template-by-id.ts`
- `src/components/admin/media/MediaPickerModal.tsx`
- `src/components/public/HomeTopNav.tsx`
- `src/components/admin/content-types/fields/SimpleRichEditor.tsx`
- `src/components/templates/TemplatesManager/usePlans.ts`
- `src/hooks/index.ts`
- `src/app/api/users/is-first-admin/route.ts`
- `src/components/admin/dashboard/ContentTypesPage/ContentEntriesPage.tsx`
- `src/components/admin/dashboard/ContentTypesPage/CreateContentEntry.tsx`
- `src/components/admin/dashboard/ContentTypesPage/EditContentEntry.tsx`
- `src/components/admin/dashboard/ContentTypesPage/hooks/useContentEntries.ts`
- `src/components/admin/dashboard/ContentTypesPage/hooks/useCreateContentEntry.ts`
- `src/components/admin/dashboard/ContentTypesPage/hooks/useEditContentEntry.ts`
- `src/app/api/admin/create-user/route.ts`
- `src/components/admin/dashboard/TemplatesPage/TemplateDetailModal.tsx`
- `src/lib/plugins/config.ts`
- `src/lib/plugins/utils.ts`
- `src/lib/plugins/index.ts`
- `src/lib/plugins/service.ts`
- `src/lib/auth.ts`
- `src/lib/server-session.ts`
- `src/utils/logger.ts`
- `test-editor.html`
- `analyze_out.json`
- `strict_analyze_out.json`
- `lint_report.json`
- `script_output.txt`
- `ts_errors.txt`
- `tsconfig.tsbuildinfo`
- `src/components/admin/media/MediaCard.tsx`
- `src/components/ui/PageLayout.tsx`
- `src/components/ui/index.ts`
- `src/components/admin/dashboard/ViewContentPage/index.tsx`
- `src/components/admin/dashboard/PluginsPage/TemplatesSelector.tsx`
- `src/app/api/templates/tourism/route.ts`
- `src/verticals/tourism/server/api/templates.ts`
- `src/app/actions/content-type-actions.ts`
- `src/app/actions/experience-actions.ts`
- `src/app/actions/plan-actions.ts`
- `src/app/actions/slug-data.ts`
- `src/hooks/useDebounce.ts`
- `src/lib/projects.ts`
- `src/types/blog.ts`
- `src/components/admin/content-types/ContentTypesManager/index.tsx`
- `src/components/admin/content-types/ContentTypesManager/ContentTypesManager.tsx`
- `src/components/admin/content-types/ContentTypesManager/hooks/useContentTypes.ts`
- `src/components/admin/content-types/ContentTypesManager/components/ContentTypeEditor.tsx`
- `src/components/admin/dashboard/index.tsx`

### Suspicious Duplicates or Legacy Paths Requiring Review

These files likely represent older implementations, alternate paths, or duplicated UI layers.

- `src/app/admin/dashboard/plans/page.tsx` - deleted as a legacy duplicate of `src/app/admin/dashboard/templates/tourism/page.tsx`.
- `src/app/admin/dashboard/plans/create/page.tsx` - deleted as a legacy duplicate of `src/app/admin/dashboard/templates/tourism/create/page.tsx`.
- `src/app/admin/dashboard/plans/templates/page.tsx` - deleted as an old template stub route.
- `src/components/admin/plans/TemplatesPageContent.tsx` - deleted with the legacy plans template route.
- `src/components/admin/dashboard/TemplatesManager/TouristPlansView.tsx` - deleted as an older duplicate of `src/components/templates/TemplatesManager/TouristPlansView.tsx`.
- `src/components/admin/dashboard/TemplatesPage/EditTourismTemplate.tsx` - deleted as an older edit flow superseded by `src/components/templates/TouristPlan/EditPlanForm.tsx`.
- `src/components/admin/dashboard/ContentTypesPage/CreateContentEntry.tsx` - deleted as an old content-entry flow after the newer `src/components/admin/content-types/` path became canonical.
- `src/components/admin/dashboard/ContentTypesPage/EditContentEntry.tsx` - deleted as an old content-entry flow after the newer `src/components/admin/content-types/` path became canonical.
- `src/components/admin/dashboard/ContentTypesPage/ContentEntriesPage.tsx` - deleted as an old content-entry listing flow after the newer `src/components/admin/content-types/` path became canonical.
- `src/components/admin/media/MediaGrid.tsx` and `src/components/admin/media/MediaGrid/index.tsx` - duplicate implementations; the root file was deleted and the localized directory version is now canonical.
- `src/components/admin/media/MediaList.tsx` and `src/components/admin/media/MediaList/index.tsx` - duplicate implementations; the root file was deleted and the localized directory version is now canonical.
- `src/components/admin/media/MediaToolbar.tsx` and `src/components/admin/media/MediaToolbar/index.tsx` - duplicate implementations; the root file was deleted and the localized directory version is now canonical.
- `src/hooks/use-users.ts` and `src/components/admin/dashboard/UsersPage/useUsers.ts` - overlapping user-management hooks.

## Research Relevance

This audit supports the broader thesis of the project:

- AI-assisted iteration can increase speed,
- but it also tends to leave behind legacy branches, duplicate flows, and compatibility residue,
- which weakens architectural clarity even when the app still works.

Dead-code analysis is therefore not only maintenance work. It is evidence of structural drift under iterative generation.

## Recommended Cleanup Order

1. Delete clearly empty or unreferenced files.
2. Review duplicated admin/template/media flows and choose a single canonical path.
3. Keep compatibility re-exports until module migration is substantially complete.
4. Only then remove legacy bridge files from `src/lib/`.
