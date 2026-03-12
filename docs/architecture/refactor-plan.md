# Refactor Plan

## Objective

The refactor of `CMS Nova` should support the research goals directly. The repository must evolve from an organically grown product codebase into a research-grade artifact where security boundaries, module ownership, and policy enforcement are explicit.

## Refactor Principles

- organize by domain instead of by technical artifact alone,
- separate server-only policy and secret-handling code from shared code,
- make public versus privileged behavior obvious from folder boundaries,
- reduce ad hoc route logic by moving critical checks into reusable policy modules,
- ensure documentation can point to stable architectural locations.

## Proposed Target Structure

```text
src/
  app/
    (public)/
    admin/
    api/
  modules/
    auth/
      client/
      server/
      components/
      schemas/
      types/
    users/
      client/
      server/
      components/
      schemas/
      types/
    content-types/
      client/
      server/
      components/
      schemas/
      types/
    content-entries/
      client/
      server/
      components/
      schemas/
      types/
    media/
    plugins/
    templates/
  server/
    auth/
    db/
    security/
    policies/
    services/
    repositories/
    logging/
  shared/
    components/
      ui/
    config/
    hooks/
    lib/
    types/
```

## Security-Driven Moves

### Server-only concerns

Move the following concerns into `src/server`:

- secret resolution and decryption,
- authorization policy,
- public content visibility policy,
- repository access wrappers,
- structured logging,
- plugin persistence and secure config serialization.

The goal is to make it hard for client code or generic shared utilities to accidentally import privileged logic.

### Domain ownership

Group features by domain so that route handlers, components, actions, types, and schemas that belong to the same capability live together. This improves traceability and makes it easier to state security rules such as:

- every `content-entries/server` mutation must pass through publication policy,
- every `plugins/server` operation must sanitize secrets,
- every `users/server` write path must enforce role checks.

### Route simplification

Keep `src/app` thin. Routes should compose domain modules and policy wrappers, not implement core business rules directly.

That reduces the chance that future AI-generated route files bypass security assumptions.

## Documentation Alignment

This refactor should be mirrored by documentation:

- `docs/architecture` explains boundaries,
- `docs/security` explains policy,
- `docs/research` explains why the change matters,
- `docs/vibe-guard` explains how real-time auditing applies to the new structure.

## Suggested Refactor Phases

### Phase 1: Baseline preservation

- freeze the current repository as the baseline artifact,
- document known weaknesses,
- tag structural hotspots and risky routes.

### Phase 2: Security centralization

- create server-only policy modules,
- centralize logging,
- centralize secret handling,
- define public content retrieval policy.

### Phase 3: Module migration

- move auth, users, content, media, plugins, and templates into domain modules,
- update imports gradually,
- keep route files as composition layers only.

### Phase 4: Documentation and evaluation

- map old structure to new structure,
- compare baseline and refactored security posture,
- record which classes of issues Vibe-Guard would have blocked.

## Expected Research Benefit

The refactor is not just a cleanup effort. It is part of the experiment. It demonstrates how a system built with fast AI assistance can be transformed into one governed by explicit architecture and enforceable policy.
