# Case Study: CMS Nova

## TL;DR (1 minute)

- AI-assisted changes can improve one visible security issue while silently weakening another cross-cutting rule.
- The most common failures were not “syntax bugs”, but **policy bugs**: what should be public, who can mutate state, what counts as “published”, and where secrets/logs can go.
- This repo includes a small “default private” guardrail for `/api/*` routes as an example of policy externalization.

## Plain-language (ELI5)

`CMS Nova` is like a school with many rooms.
Some rooms are public (hallway), some are private (teacher office).
AI helpers often build features fast, but sometimes they accidentally leave a door unlocked because the door is in a different file than the feature they were working on.
The case study is about finding those “unlocked doors” and then writing down rules so they are harder to reintroduce.

## Why CMS Nova Matters

`CMS Nova` is a strong research artifact because it is neither a toy example nor a narrowly scoped demo. It contains dynamic content modeling, authentication, admin workflows, plugin configuration, public routing, file handling, and productization efforts through a CLI. That combination makes it large enough for structural failures to emerge.

The system includes:

- a Next.js App Router application,
- Better Auth integration,
- Prisma-based persistence,
- dynamic content types and entries,
- public type-based routes,
- plugin-driven feature toggles,
- media and configuration surfaces,
- an install/upgrade CLI.

This makes the project suitable for observing how AI-generated or AI-assisted changes affect the integrity of an evolving codebase.

## What the Case Study Demonstrates

The project demonstrates a recurring pattern in AI-assisted engineering:

1. The model produces useful features quickly.
2. The resulting code often appears coherent at the file level.
3. Security weaknesses emerge where multiple files, policies, or lifecycle rules intersect.
4. Human review detects issues only after enough system knowledge has accumulated.

This pattern is especially visible in route exposure, authorization boundaries, plugin configuration, debug tooling, and data publication rules.

## Local Heuristics vs Global Security Policy

One of the most consistent failure patterns observed during AI-assisted iteration was this:

- the model completed work based on *local signals* (a single file, a route name, an HTTP verb),
- instead of enforcing a *global security policy* (default-deny, explicit allowlists, and data-classification rules).

Why this happens:

- many endpoints *sound* public by naming alone (e.g. `plans`, `experiences`, `content-types`),
- `GET` is often misinterpreted as "safe" even when it returns administrative metadata, drafts, schemas, or operational listings,
- when the codebase does not have a centralized rule (e.g. "all `/api/*` routes are private unless allowlisted"), the model cannot reliably infer it.

What fixes the class of problem:

- explicit policy: treat CMS operational data as private by default,
- explicit allowlist: only expose public routes when the product design requires it,
- structural verification: add a policy check that fails builds when a new route is created without an auth guard.

This repository now includes a static policy check for that purpose:

- `src/server/policy/api-visibility.js` (public allowlist)
- `scripts/security/check-api-policy.js` (repo-wide scan)
- `npm run security:check-api` (enforces "default private" across `/api/*`)

## Evidence From the Previous Commit

The previous Git revision contains both defensive improvements and structural regressions. That is exactly why it is useful as research evidence.

### Security Hardening Observed

The revision removed several high-risk operational or debug routes, including:

- `src/app/api/admin/diagnose-password/route.ts`
- `src/app/api/admin/fix-credential-accounts/route.ts`
- `src/app/api/admin/fix-password-format/route.ts`
- `src/app/api/test-login/route.ts`
- `src/app/api/destinations/route.ts`

It also reduced unnecessary observability exposure by removing debugging logs from:

- `src/contexts/AuthContext.tsx`
- `src/lib/auth-client.ts`
- `src/lib/prisma.ts`

These changes show deliberate hardening of obvious attack surface.

### Structural Regressions Observed

At the same time, `src/app/[typePath]/[slug]/page.tsx` was changed in ways that weakened global guarantees:

- the public route no longer explicitly restricts results to `status: 'published'`,
- the plugin-based public route gate was replaced with a placeholder comment,
- public-facing request tracing logs were introduced,
- entry lookup became more permissive by searching globally by slug when content type resolution failed.

This is a canonical example of local reasoning defeating global policy. The code became more tolerant and more convenient, but also less aligned with publication and exposure invariants.

## Why This Supports the Research Thesis

The commit does not show a simple secure-versus-insecure contrast. It shows something more important: AI-assisted development can improve one area of security while degrading another.

That matters because it challenges a common assumption that visible fixes imply systemic improvement. In reality:

- removing debug endpoints may reduce obvious risk,
- while weakened publication checks may create subtler but broader exposure,
- and both can happen in the same revision.

This is the strongest argument for policy-aware auditing. A structural guardrail should detect not only whether a file compiles or a route works, but whether the change preserves the security model of the system.

## Research Value

As a case study, CMS Nova provides a realistic environment for analyzing:

- route exposure drift,
- authorization inconsistency,
- secret-handling boundaries,
- debug-surface persistence,
- architecture erosion under AI-assisted iteration.

For that reason, the project should be documented and refactored as a research-grade artifact rather than only as a product codebase.

The concrete refactor trajectory is documented in `docs/research/architecture-evolution.md`.
