# Research Guide (Start Here)

This folder documents a case study about security and architectural integrity in **AI-assisted software development**, using `CMS Nova` as the main research artifact.

## TL;DR (1 minute)

- AI coding can produce changes that look correct **inside one file**, but violate **system-wide security rules** (auth boundaries, publication rules, route visibility, secret handling).
- The case study identifies recurring reasoning failures (e.g. `Naming Bias`, `Lack of Global Context`) and frames the human role as `MVU` (Minimum Viable Understanding).
- The proposed mitigation is `Vibe-Guard`: treat security as **policy verification** (central rules + automated checks), not as “remember everything everywhere”.
- This repo includes a small concrete example of that idea: a default-private policy for `/api/*` routes plus a static checker (`npm run security:check-api`).

## Plain-language (ELI5)

Imagine a helper who is very good at building **one LEGO house at a time**.
Each house looks fine. But a city is not just houses — it also has **city rules**:

- “Only teachers can enter the teacher room.” (authorization)
- “Only finished posters go on the public wall.” (published-only content)
- “Don’t put secret keys on the street.” (secret handling)

AI tools often follow the “house logic” but forget the “city rules” unless those rules are written down and checked.
`Vibe-Guard` is the idea of writing the city rules once, centrally, and having an automated guard verify that every new house still follows them.

## What’s in This Repo (Research Artifacts)

- Concepts and framing:
  - [Core Concepts](./core-concepts.md)
- Evidence and narrative:
  - [Case Study: CMS Nova](./case-study-cms-nova.md)
  - [Findings Matrix](./findings-matrix.md)
- Method and reproducibility:
  - [Methodology](./methodology.md)
  - [API Visibility Policy](../../src/server/policy/api-visibility.js)
  - [API Policy Checker](../../scripts/security/check-api-policy.js)
- Architecture intervention record:
  - [Architecture Evolution](./architecture-evolution.md)

## Suggested Reading Order

1. [Executive Summary](./executive-summary.md)
2. [Core Concepts](./core-concepts.md)
3. [Case Study: CMS Nova](./case-study-cms-nova.md)
4. [Methodology](./methodology.md)
5. [Findings Matrix](./findings-matrix.md)
6. [Architecture Evolution](./architecture-evolution.md)
