# Methodology

## Research Goal

The goal of this research is to study how AI-assisted coding affects software security at the structural level, with particular attention to cases where locally plausible code compromises global system integrity.

## Research Questions

The study is organized around the following questions:

1. How often does AI-assisted code preserve local functionality while weakening global security policy?
2. What recurring reasoning failures explain these regressions?
3. Can a centralized auditing protocol, such as Vibe-Guard, detect those regressions earlier than conventional file-level review?

## Case Study Strategy

`CMS Nova` is used as the main case study because it contains enough real complexity to expose interactions between routing, authorization, content state, plugins, persistence, and UI.

The project is analyzed in two phases:

- `Baseline phase`: review the organically evolved codebase and collect security weaknesses, architectural inconsistencies, and examples of AI-generated local reasoning.
- `Intervention phase`: refactor the system and documentation around explicit domain boundaries and centralized policy, then compare the security posture before and after intervention.

## Data Sources

The analysis uses:

- Git commit history,
- code review of routes, actions, and plugin surfaces,
- structural comparisons between revisions,
- vulnerability reports gathered from audits,
- documentation artifacts produced during refactoring.

## Policy Enforcement Added

To reduce reliance on per-file reasoning (and to capture AI-assisted regressions), the repository includes a static policy check:

- `src/server/policy/api-visibility.js` defines which `/api/*` routes are intentionally public.
- `scripts/security/check-api-policy.js` scans `src/app/api/**/route.ts` (following re-exports) and fails if a non-public route lacks an auth guard.

This converts an implicit security assumption into an explicit, testable rule.

## Analytical Lens

Each observed issue is classified according to:

- `surface`: route, action, client state, config, logging, or persistence,
- `failure mode`: missing authorization, unsafe exposure, secret leakage, policy bypass, over-permissive query, or debug residue,
- `reasoning pattern`: Naming Bias, local optimization, context loss, or inconsistent enforcement,
- `impact`: confidentiality, integrity, availability, or architectural drift,
- `preventability`: whether the issue could have been caught by Vibe-Guard policy checks.

## Expected Output

The expected output is not only a vulnerability list, but a structured explanation of why these vulnerabilities appear under AI-assisted development and how centralized policy enforcement can reduce them.

The project therefore functions as:

- a technical artifact,
- an empirical dataset,
- and a design argument for policy-aware AI governance in software engineering.
