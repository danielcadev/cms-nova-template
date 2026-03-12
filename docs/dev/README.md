# Developer Guide

This guide is for engineers using `CMS Nova` as a reusable Next.js CMS template (not the research angle).

If you’re here for the case study / Vibe-Guard research docs, start at `docs/research/executive-summary.md`.

## Quick Start (Local)

Requirements:

- Node.js 18+
- A database supported by Prisma (Postgres recommended)

Setup:

```bash
npm install --legacy-peer-deps
npm run generate
npm run db:push
npm run dev
```

Then open `http://localhost:3000`.

Environment:

- Copy from `.env.example` (and adjust `DATABASE_URL`, `BETTER_AUTH_*`, etc.).
- In production, set env vars through your platform instead of committing `.env`.

## Common Commands

```bash
# dev server
npm run dev

# type safety + lint
npm run type-check
npm run lint

# build / run
npm run build
npm run start

# prisma workflows
npm run db:push
npm run migrate
npm run db:studio
```

## Repo Map (Where to Implement Things)

```text
src/
  app/        # routing + composition (keep thin)
  server/     # privileged runtime logic (auth, policy, logging)
  modules/    # reusable CMS capabilities (domain logic)
  shared/     # cross-project helpers + UI primitives
  verticals/  # business-specific packs (tourism, experiences, ...)
```

Start here:

- CMS domains: `src/modules/`
- Business packs: `src/verticals/`
- Auth/session guards: `src/server/auth/`
- Public-route gates: `src/server/plugins/`

## Security Guardrail (API Visibility)

The repo includes a “default private” rule for `/api/*` routes:

- `src/server/policy/api-visibility.js` declares the public allowlist.
- `scripts/security/check-api-policy.js` enforces that every API route is either allowlisted or guarded.

Run it before shipping:

```bash
npm run security:check-api
```

## Dependency Updates

Recommended workflow:

- Keep `package-lock.json` committed and use `npm ci` in CI for reproducible installs.
- Use Dependabot/Renovate to open weekly PRs for patch/minor updates.
- Treat major updates as planned work (read changelogs + run CI).

If you use `npx create-cms-nova upgrade`, the CLI will show when `package.json` / `package-lock.json` changed upstream, but it will not overwrite them. Merge those changes manually and run `npm install`.

## CLI (Create/Upgrade)

If you’re using the project as a template in multiple downstream repos, see `cli/README.md`.
