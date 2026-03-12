# CMS Nova

[![CI](https://github.com/danielcadev/cms-nova-template/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/danielcadev/cms-nova-template/actions/workflows/ci.yml)

CMS Nova is a reusable CMS platform built with Next.js, Prisma, and Better Auth.

It combines three goals in one repository:

- a headless CMS core with dynamic content types and entries,
- vertical packs for domain-specific products such as tourism and experiences,
- a research-grade case study on security and structural integrity in AI-assisted software development.

## Quick Links

- Commercial overview: [README.commercial.md](./README.commercial.md)
- Academic overview: [README.academic.md](./README.academic.md)
- Developer guide: [docs/dev/README.md](./docs/dev/README.md)
- Docs index: [docs/README.md](./docs/README.md)
- Security audit: [docs/security/security-audit.md](./docs/security/security-audit.md)
- Vibe-Guard protocol: [docs/vibe-guard/protocol-overview.md](./docs/vibe-guard/protocol-overview.md)
- CLI: [cli/README.md](./cli/README.md)

Choose one path:

- Building/using the CMS: start with [README.commercial.md](./README.commercial.md)
- Reading the case study: start with [README.academic.md](./README.academic.md)

## What It Is

CMS Nova is not just an admin panel.

It is a platform-oriented codebase designed to support:

- custom CMS deployments,
- multi-project reuse,
- public headless routes,
- plugin-based behavior,
- media management,
- and vertical product layers such as travel or destination platforms.

The repository is also used as the main case study for `Vibe-Guard`, a structural auditing proposal focused on the security risks of AI-generated code.

## Core Capabilities

- Dynamic content types with field builders
- Content entries with public headless routes
- Better Auth integration and admin access control
- Media library and S3-related workflows
- Plugin configuration and feature gating
- Vertical packs for tourism and experiences
- CLI support for productization and reuse

## Architecture Direction

The codebase is being organized around explicit ownership boundaries:

```text
src/
  app/        # route registration and composition
  server/     # privileged runtime behavior
  modules/    # reusable CMS capabilities
  shared/     # cross-project helpers and UI
  verticals/  # domain-specific product packs
```

Current examples:

- `src/server/auth/`
- `src/server/observability/`
- `src/modules/auth/`
- `src/modules/plugins/`
- `src/modules/content/`
- `src/verticals/tourism/`
- `src/verticals/experiences/`

This structure supports both product reuse and research on architectural integrity.

## Research Context

CMS Nova is the primary artifact for an ongoing investigation into AI-assisted coding security.

The research focuses on:

- `Naming Bias`
- `Minimum Viable Understanding (MVU)`
- lack of global context in coding models
- route exposure and authorization drift
- centralized policy enforcement through `Vibe-Guard`

Key research documents:

- [docs/research/executive-summary.md](./docs/research/executive-summary.md)
- [docs/research/case-study-cms-nova.md](./docs/research/case-study-cms-nova.md)
- [docs/research/architecture-evolution.md](./docs/research/architecture-evolution.md)
- [docs/research/findings-matrix.md](./docs/research/findings-matrix.md)
- [docs/research/portfolio-statement.md](./docs/research/portfolio-statement.md)

## Security Direction

The repository has already gone through a substantial security-focused refactor.

Major improvements include:

- tighter public route gating,
- restored publication-state checks,
- reduced plugin secret exposure,
- sanitized centralized logging,
- restricted admin-only API surfaces,
- hardened first-admin bootstrap,
- thinner route and action layers.

Security documentation:

- [docs/security/security-audit.md](./docs/security/security-audit.md)
- [docs/security/vulnerability-catalog.md](./docs/security/vulnerability-catalog.md)
- [docs/security/fix-vs-regression-analysis.md](./docs/security/fix-vs-regression-analysis.md)
- [docs/security/error-log.md](./docs/security/error-log.md)
- [docs/security/remediation-log.md](./docs/security/remediation-log.md)

## Quick Start

Requirements:

- Node.js 20.19+
- npm
- a supported database configured through Prisma

Setup:

```bash
npm install
npm run generate
npm run db:push
npm run dev
```

Then open `http://localhost:3000`.

## Main Scripts

```bash
npm run dev
npm run build
npm run start
npm run type-check
npm run lint
npm run security:check-api
npm run generate
npm run db:push
npm run migrate
npm run db:studio
```

## Environment

Typical variables include:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
ENCRYPTION_KEY=
NOVA_SETUP_TOKEN=
```

Use `.env.example` as the base reference when available in your local copy.

## Headless Routing

CMS Nova supports public type-path routing through content types.

- `/{typePath}` lists published entries for a content type
- `/{typePath}/{slug}` renders a published entry
- exposure is controlled by the `public-typepaths` plugin

Dynamic navigation can also be enabled through the `dynamic-nav` plugin.

## Documentation

- [docs/README.md](./docs/README.md)
- [docs/dev/README.md](./docs/dev/README.md)
- [docs/architecture/folder-structure.md](./docs/architecture/folder-structure.md)
- [docs/architecture/core-vs-verticals.md](./docs/architecture/core-vs-verticals.md)
- [docs/architecture/dead-code-audit.md](./docs/architecture/dead-code-audit.md)
- [docs/vibe-guard/protocol-overview.md](./docs/vibe-guard/protocol-overview.md)

## Status

The repository is in active architectural consolidation.

It already functions as:

- a working CMS platform,
- a reusable base for downstream projects,
- and a documented research artifact.

Some migration bridges still remain, but the structure is now significantly clearer than the original organically grown version.

## License

MIT
