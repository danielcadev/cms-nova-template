# Security Fixes vs Structural Regressions

## Purpose

This document captures a key observation from the previous Git revision: local hardening and global regression can coexist in the same commit. That pattern is central to the Vibe-Guard thesis.

## Comparative Table

| Change | Positive Effect | Structural Regression or Remaining Concern | Vibe-Guard Policy Implication |
| --- | --- | --- | --- |
| Removal of `src/app/api/admin/diagnose-password/route.ts` | Reduced exposure of password diagnostics and sensitive internals | Indicates such operational repair routes were allowed to exist in the main app surface | Dangerous admin tooling should require explicit policy classification and isolation |
| Removal of `src/app/api/admin/fix-credential-accounts/route.ts` | Reduced privilege abuse surface | Repair actions were mixed with normal application routes | Mutation routes with credential impact should be blocked unless tagged as maintenance-only |
| Removal of `src/app/api/admin/fix-password-format/route.ts` | Reduced chance of direct password rewriting through app endpoints | Password repair logic existed in routable form | Credential state transitions should require dedicated protected workflows |
| Removal of `src/app/api/test-login/route.ts` | Reduced debug authentication surface | Test helpers were near production code | Debug endpoints should fail policy checks outside isolated environments |
| Removal of auth debug logs in `src/contexts/AuthContext.tsx` and `src/lib/auth-client.ts` | Lowered leakage of session and auth flow details | Logging remains inconsistent elsewhere | Public and auth surfaces should enforce sanitized logging only |
| Removal of Prisma query logging in `src/lib/prisma.ts` | Lowered database visibility in logs | No repository-wide logging standard yet | Data-layer logging should be centrally configured |
| Public route change in `src/app/[typePath]/[slug]/page.tsx` | More tolerant content lookup behavior | Missing explicit publication-state filter and plugin gate enforcement | Public route queries must prove publication and route enablement |
| Public route logging in `src/app/[typePath]/[slug]/page.tsx` | Easier debugging during development | Production-facing route now emits internal lookup details | Public routes should prohibit raw request tracing unless sanitized and environment-gated |
| Fallback global slug lookup in `src/app/[typePath]/[slug]/page.tsx` | More resilient rendering when content type resolution fails | Weakens coupling between route identity and content-type policy | Route resolution should not bypass content-type and visibility policy |

## Interpretation

The revision improved obvious security concerns by deleting unsafe endpoints and reducing debug leakage. However, it also illustrates a deeper problem: the system still lacks a mechanism that protects global invariants when individual files are changed.

This is the core difference between patching and governance.

- Patching removes visible symptoms.
- Governance preserves system rules.

## Research Relevance

This example should be used in the research narrative because it avoids simplistic framing. The issue is not that AI only makes code insecure. The issue is that AI-assisted development can make code look more secure while still weakening the architecture.

That is why Vibe-Guard must evaluate structural policy, not just local code quality.
