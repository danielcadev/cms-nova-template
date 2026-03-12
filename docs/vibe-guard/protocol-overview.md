# Vibe-Guard Protocol Overview

## Purpose

`Vibe-Guard` is a proposed structural auditing system for AI-assisted development. Its purpose is to verify that generated or modified code still respects system-wide security policy.

The key idea is that software integrity should not depend on whether a model or developer remembers every rule in every file. Instead, critical rules should be externalized into an auditable policy layer.

## Problem It Solves

Traditional review often asks whether code is:

- syntactically valid,
- logically coherent,
- functionally complete.

Vibe-Guard asks an additional question:

- does this change preserve architectural and security invariants?

That distinction matters because many AI-generated regressions are not syntax failures. They are policy failures.

## Example Policy Questions

Vibe-Guard should be able to evaluate checks such as:

- Does a public route query unpublished content?
- Does a server action mutate privileged state without authorization?
- Does a plugin response serialize secret material back to the client?
- Is a debug endpoint reachable in production code paths?
- Does a route bypass the middleware or guard assumptions defined elsewhere?

## Conceptual Workflow

1. A code change is proposed by a developer or AI agent.
2. Vibe-Guard receives structural metadata about the affected files and execution surface.
3. The policy engine maps the change to relevant invariants.
4. The system returns one of three outcomes:
   - `allow`
   - `warn`
   - `block`
5. The result is attached to the change as a policy decision rather than a style opinion.

## Why MCP-style Integration Matters

An MCP-oriented protocol is useful because it allows the auditing layer to work with tool-assisted coding workflows in real time. Instead of acting only after code lands in the repository, Vibe-Guard can participate during generation, editing, and review.

This is especially important in vibe coding environments, where large volumes of plausible code may be produced quickly and without stable global reasoning.

## Role in This Research

In this research, Vibe-Guard is not presented merely as a product idea. It is the proposed answer to a specific empirical problem:

- AI coding systems often optimize for local completion.
- security failures often arise from missing structural awareness.
- centralized policy auditing can compensate for that limitation.

The CMS Nova case study is the experimental ground where this argument is developed.

## Concrete Prototype Inside This Repo

While Vibe-Guard is a proposed system, the repository includes a small concrete example of policy externalization:

- `src/server/policy/api-visibility.js` declares a default-deny policy for `/api/*` with an explicit public allowlist.
- `scripts/security/check-api-policy.js` enforces that every `src/app/api/**/route.ts` route either:
  - is on the public allowlist, or
  - contains (or re-exports a handler that contains) an explicit authorization guard.

This directly targets the observed failure mode where AI-generated endpoints were treated as public because they were `GET` handlers or had "catalog-like" names.
