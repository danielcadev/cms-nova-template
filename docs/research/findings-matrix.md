# Findings Matrix

## Purpose

This matrix summarizes the main findings from the `CMS Nova` case study in a format suitable for research writing, portfolio presentation, and discussion of the Vibe-Guard proposal.

## Matrix

| Issue | Root Cause | AI Failure Mode | Intervention | Outcome |
| --- | --- | --- | --- | --- |
| Public route could expose unpublished content | Publication policy was not enforced at query level | Local route convenience overrode global visibility invariant | Restored public-typepath gating and `published` filtering in `src/app/[typePath]/[slug]/page.tsx` | Public content access now respects publication state |
| Plugin gate used `success` instead of `enabled` | Policy signal was interpreted incorrectly | Surface-level reasoning without contract verification | Centralized gate logic in `src/server/plugins/public-typepaths.ts` | Feature flag behavior now matches actual policy state |
| Rich HTML rendering created stored XSS risk | Output safety was not treated as a cross-cutting concern | Functional rendering prioritized over browser safety | Added sanitization in `src/shared/security/html.ts` and applied it to public rendering | Public rich-text output is now filtered before injection |
| Plugin config risked secret leakage to the client | Secret-aware config and UI config were too close (and config drifted via filesystem state) | Naming and config convenience obscured sensitivity boundary | Removed env-backed defaults from client-facing config, masked secret fields, removed localStorage caching, and removed filesystem plugin state in favor of DB-backed `NovaConfig` | Plugin secret flow is now more clearly server-governed |
| Admin-oriented GET endpoints were publicly reachable | Route exposure grew faster than authorization discipline | New endpoints were treated as harmless data accessors | Added admin session checks to content, plans, experiences, media, and schema APIs | Internal retrieval surfaces now better match intended admin scope |
| First-admin bootstrap was weak | Deployment-time trust assumptions were implicit | AI-assisted flows often ignore initialization risk | Added rate limiting and optional setup-token protection | Fresh deployments are less vulnerable to first-caller takeover |
| Logging leaked operational context | Debugging convenience had no central policy | Local observability decisions ignored system sensitivity | Introduced sanitized centralized logging in `src/server/observability/logger.ts` | Critical routes now log with reduced leakage risk |
| Core CMS and business-specific code were mixed | Folder structure reflected growth history, not ownership boundaries | Lack of global context made every change harder to scope | Introduced `src/server/`, `src/modules/`, `src/shared/`, and `src/verticals/` | The repository now communicates boundaries more clearly |
| Tourism and experiences polluted reusable CMS code | Vertical-specific features evolved inside generic folders | Product-specific assumptions spread into platform-level code | Added `src/verticals/tourism/` and `src/verticals/experiences/` entry points and server paths | Reusable core and business packs are now more clearly separated |
| `app/actions` held too much business logic | Routing layer also became execution layer | File-local edits could alter policy-sensitive behavior directly | Moved plan, experience, content-type, and slug implementations into vertical/module server paths; kept `app/actions` as compatibility wrappers | Application layer is thinner and more suitable for future governance |
| `app/api` contained vertical business logic directly | Route files mixed transport concerns with domain logic | AI edits in route files risked breaking structural boundaries | Moved plans, experiences, and tourism template APIs into vertical server handlers | API routes now act more like composition/registration layers |
| Dead code and duplicate implementations obscured system intent | Iterative generation added replacements without removing older paths | AI-assisted expansion produced architectural residue | Removed unused hooks/components, deleted duplicate plans flow, and consolidated media components | Auditability improved and false complexity was reduced |

## Interpretation

The pattern across these findings is consistent: the most important failures were not syntax failures or isolated vulnerabilities. They were integrity failures caused by ambiguous ownership, mixed layers, and missing system-wide checks.

That is exactly the class of problem Vibe-Guard is designed to address.

## Vibe-Guard Relevance

Each intervention above can be reframed as a future policy check:

- public routes must prove publication policy,
- secret-bearing config must not cross into client persistence,
- admin retrieval routes must require explicit auth guards,
- route and action files should not become the primary home of privileged business logic,
- reusable core and vertical packs must remain distinguishable.

In other words, the findings matrix is not only a summary of problems. It is a draft policy map for structural auditing.
