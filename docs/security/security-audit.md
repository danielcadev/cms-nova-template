# Security Audit

## Scope

This document records the current high-level security posture of `CMS Nova` as a research artifact.

It focuses on structural risk patterns rather than claiming a complete penetration test.

For an itemized issue list and remediation trail, see:

- `docs/security/vulnerability-catalog.md`
- `docs/security/remediation-log.md`

## Quick Policy Checks

The repository includes a lightweight “default private” policy for `/api/*` routes:

- `src/server/policy/api-visibility.js` (explicit public allowlist)
- `scripts/security/check-api-policy.js` (repo-wide static check)

Run:

```bash
npm run security:check-api
```

## Current Positive Signals

- `/api/*` routes are treated as private by default and enforced through a static policy check.
- Public headless routing is gated through the `public-typepaths` plugin and rejects access when disabled.
- Public content detail lookup enforces `status: 'published'` and avoids permissive slug fallback.
- Public rich-text rendering applies a basic HTML sanitization pass before `dangerouslySetInnerHTML`.
- Plugin configuration is stored server-side (DB-backed), and sensitive-looking config fields are masked in responses.
- A centralized server logger redacts common secret keys and avoids noisy logs in production.

These are meaningful improvements, but they do not eliminate the need for centralized policy and consistent enforcement.

## Main Structural Risks

### 1. Sanitization is a policy surface, not a one-off fix

The current HTML sanitizer (`src/shared/security/html.ts`) blocks obvious high-risk vectors, but it is intentionally minimal.

Risk:

- future rich-text features reintroduce stored XSS,
- editors paste hostile markup that slips through simplistic filters,
- different renderers diverge in safety behavior.

Recommended direction:

- replace the current sanitizer with a stricter allowlist-based sanitizer,
- treat “public HTML rendering” as a centralized policy surface with tests.

### 2. Secrets and plugin config still need clear boundaries

Risk:

- accidental client exposure,
- policy drift,
- duplicated secret-handling logic,
- confusion between public config and privileged config.

Recommended direction:

- keep plugin definitions secret-free (`src/modules/plugins/config.ts`),
- ensure sensitive settings are encrypted at rest where applicable (requires `ENCRYPTION_KEY`),
- enforce one-way serialization rules for plugin config returned to the admin UI.

### 3. Authorization logic is improved but still easy to drift

The repo now has reusable session helpers, but authorization is still applied across multiple surfaces (API routes, server actions, and admin pages).

Risk:

- inconsistent access rules,
- missing checks in newly generated routes,
- difficult auditing as the codebase grows.

Recommended direction:

- create explicit authorization guards per domain,
- require privileged routes to call policy wrappers,
- document an authorization matrix per route and action class.

### 4. Policy coverage is still partial

The API-visibility check is a concrete example of policy externalization, but it covers only one class of regression.

Risk:

- other surfaces (Server Actions, public pages, plugin transport endpoints) can regress without a policy tripwire,
- review still depends on file-by-file reasoning outside the covered policy surface.

Recommended direction:

- expand policy checks beyond `/api/*` visibility (e.g., server action authorization, publication invariants),
- keep policy rules centralized and repository-scannable (Vibe-Guard direction).

## Preliminary Conclusion

The project is not defined by a single catastrophic flaw. Its main risk is still architectural inconsistency: security decisions exist, but drift is easy when enforcement is not centralized.

That is exactly the problem Vibe-Guard is intended to address.
