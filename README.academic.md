# CMS Nova - Academic Version

## Overview

CMS Nova is a research-oriented case study on the security and structural integrity of AI-assisted software development.

The repository combines a working Next.js CMS platform with a documented architectural intervention process. It is used to study how coding models can produce locally plausible code while weakening system-wide guarantees such as authorization, publication policy, secret boundaries, and route exposure control.

Quick links:

- Executive summary: [docs/research/executive-summary.md](./docs/research/executive-summary.md)
- Vibe-Guard protocol: [docs/vibe-guard/protocol-overview.md](./docs/vibe-guard/protocol-overview.md)
- Commercial version: [README.commercial.md](./README.commercial.md)
- Developer guide: [docs/dev/README.md](./docs/dev/README.md)

If you’re primarily trying to use CMS Nova as a platform/template, start with [README.commercial.md](./README.commercial.md) and [docs/dev/README.md](./docs/dev/README.md).

## Research Focus

This project supports the investigation of:

- `Naming Bias`
- `Minimum Viable Understanding (MVU)`
- lack of global context in AI coding systems
- structural drift under iterative generation
- policy-centered auditing through `Vibe-Guard`

## Why This Repository Matters

CMS Nova is useful as a research artifact because it is not a toy project. It contains enough real complexity to expose structural failures:

- dynamic content types and entries
- authentication and admin workflows
- public headless routing
- plugin configuration
- media handling
- domain-specific vertical packs
- route- and action-level security concerns

This makes it suitable for observing the gap between local code correctness and global architectural integrity.

## Main Contribution

The repository documents a before-vs-after intervention.

Before:

- route logic and business logic were mixed,
- security decisions were distributed,
- business-specific code leaked into reusable layers,
- duplicate and legacy paths increased ambiguity,
- AI-assisted changes could improve local behavior while weakening system invariants.

After:

- privileged logic is more clearly separated into `src/server/`,
- reusable CMS capabilities are moving into `src/modules/`,
- domain-specific features are isolated in `src/verticals/`,
- route and action layers are thinner,
- the repository is now documented as a structural security case study.

## Architectural Model

```text
src/
  app/        # route registration and composition
  server/     # privileged runtime behavior
  modules/    # reusable CMS capabilities
  shared/     # cross-project helpers
  verticals/  # domain-specific packs
```

## Research Documents

- [docs/research/executive-summary.md](./docs/research/executive-summary.md)
- [docs/research/core-concepts.md](./docs/research/core-concepts.md)
- [docs/research/methodology.md](./docs/research/methodology.md)
- [docs/research/case-study-cms-nova.md](./docs/research/case-study-cms-nova.md)
- [docs/research/architecture-evolution.md](./docs/research/architecture-evolution.md)
- [docs/research/findings-matrix.md](./docs/research/findings-matrix.md)
- [docs/research/portfolio-statement.md](./docs/research/portfolio-statement.md)

## Security Documents

- [docs/security/security-audit.md](./docs/security/security-audit.md)
- [docs/security/vulnerability-catalog.md](./docs/security/vulnerability-catalog.md)
- [docs/security/fix-vs-regression-analysis.md](./docs/security/fix-vs-regression-analysis.md)
- [docs/security/error-log.md](./docs/security/error-log.md)
- [docs/security/remediation-log.md](./docs/security/remediation-log.md)

## Expected Use

This version of the project is most relevant for:

- research statements,
- academic review,
- discussions on AI coding governance,
- case-study analysis of security in generated code,
- demonstrating architectural intervention rather than only feature delivery.

## Local Setup

```bash
npm install
npm run generate
npm run db:push
npm run dev
```

## Verification

```bash
npm run type-check
npm run security:check-api
```
