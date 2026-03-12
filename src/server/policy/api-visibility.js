// Default policy: all `/api/*` routes are private (admin-only), except an explicit allowlist.
// This exists to prevent the common AI failure mode where "GET" endpoints are assumed to be public
// based on local file semantics rather than the global security model.
export const PUBLIC_API_ALLOWLIST = [
  {
    pattern: /^\/api\/auth\b/, // Better Auth handler must remain reachable
    reason: 'Better Auth transport endpoint',
  },
  {
    pattern: /^\/api\/admin\/check-first-admin$/, // bootstrap UI
    reason: 'Bootstrap UI: detect if the primary admin exists',
  },
  {
    pattern: /^\/api\/admin\/create-first-admin$/, // one-time bootstrap action
    reason:
      'Bootstrap setup: create the initial administrator (gated by NOVA_SETUP_TOKEN when configured)',
  },
  {
    pattern: /^\/api\/plugins\/public-typepaths$/, // public feature gate check
    reason: 'Public feature gate for typePath pages',
  },
  {
    pattern: /^\/api\/plugins\/dynamic-nav$/, // public nav config (sanitized)
    reason: 'Public nav config needed for client navbar',
  },
  {
    pattern: /^\/api\/system\/locale$/, // locale cookie setter
    reason: 'Public locale cookie setter',
  },
]

export function isPublicApiRoute(pathname) {
  return PUBLIC_API_ALLOWLIST.some((rule) => rule.pattern.test(pathname))
}
