# CMS Nova - Commercial Version

## Overview

CMS Nova is a reusable CMS platform built for teams that want to launch custom content-driven products faster.

It combines a flexible headless CMS core with business-specific vertical packs such as tourism and experiences, making it suitable for agency work, product studios, travel platforms, and multi-project deployments.

## Product Positioning

CMS Nova is designed as:

- a reusable CMS foundation,
- an admin system for custom content operations,
- a platform for downstream project instances,
- and a base for vertical products like destination portals or Expedia-style travel experiences.

## What It Offers

- Dynamic content types and content entry management
- Public headless routes based on content-type paths
- Better Auth integration and admin access control
- Media library and S3-related workflows
- Plugin-based feature toggles and configuration
- Vertical packs for tourism and experiences
- Modular architecture for reuse across projects

## Platform Structure

```text
src/
  app/        # routes and composition
  server/     # privileged runtime logic
  modules/    # reusable CMS core capabilities
  shared/     # cross-project utilities and helpers
  verticals/  # business-specific packs
```

This makes it easier to separate:

- core CMS infrastructure,
- project-specific product layers,
- and future vertical extensions.

## Example Use Cases

- tourism and destination platforms
- travel packages and experiences
- branded content hubs
- custom admin dashboards for agencies and clients
- white-label CMS deployments

## Why It Is Valuable

CMS Nova is useful when you need more control than a hosted CMS, but want more speed than building an internal content platform from scratch.

It gives you:

- reusable architecture,
- direct ownership of code and deployment,
- room for domain-specific customization,
- and a cleaner path to productizing custom CMS builds.

## Quick Start

```bash
npm install --legacy-peer-deps
npm run generate
npm run db:push
npm run dev
```

Open `http://localhost:3000` after setup.

## Main Scripts

```bash
npm run dev
npm run build
npm run start
npm run type-check
npm run lint
```

## Documentation

- `docs/dev/README.md`
- `docs/README.md`
- `docs/architecture/folder-structure.md`
- `docs/architecture/core-vs-verticals.md`
- `docs/security/security-audit.md`

## License

MIT
