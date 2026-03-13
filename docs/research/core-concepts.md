# Core Concepts

## Plain-language (ELI5)

- **Naming Bias:** trusting the *label* on a box instead of checking what’s inside.
- **Lack of Global Context:** fixing one room in a house without understanding how the whole house works.
- **MVU:** the minimum “map” a human needs to notice when something is locally fine but globally unsafe.
- **Vibe-Guard:** a rulebook + a referee (central rules that can be checked automatically).

## Naming Bias

`Naming Bias` describes the tendency of AI coding systems to use names as security signals. If a file, route, variable, or module sounds harmless, the model may infer that it is safe to expose, relax, or bypass. This inference is often made without validating the actual sensitivity of the underlying data or checking project-wide policies.

Examples of naming-driven failure modes include:

- assuming that a route such as `public-data` or `preview` is intentionally public,
- assuming that `debug` utilities are acceptable because they sound operational rather than sensitive,
- assuming that a `test` or `temporary` endpoint is low risk and can remain enabled.

Naming Bias is dangerous because it compresses security reasoning into superficial cues.

## Lack of Global Context

`Lack of Global Context` is the core structural limitation observed in AI-generated code. The model may optimize a file, route, or component in isolation while ignoring global rules enforced elsewhere.

Typical consequences include:

- removing an authorization check because it does not appear necessary in the current file,
- exposing a route because it compiles and returns correct data,
- altering data retrieval logic without preserving publication-state invariants,
- introducing logs that are locally useful for debugging but globally unsafe in production.

In large systems, security depends on interactions between middleware, route guards, plugin toggles, data states, and deployment assumptions. A model without stable global reasoning can easily violate those interactions.

## Minimum Viable Understanding (MVU)

`Minimum Viable Understanding` is the minimum level of architectural literacy required from the human operator supervising AI-assisted development. MVU does not mean writing every subsystem manually. It means knowing enough to detect when the model has produced code that is syntactically correct, functionally useful, and still structurally wrong.

MVU includes the ability to:

- identify critical trust boundaries,
- distinguish public from private routes,
- recognize sensitive state transitions,
- reason about repository-wide invariants,
- detect when a fix in one area weakens another.

MVU is the human complement to Vibe-Guard. The human defines and interprets policy; the system checks whether generated code still obeys it.

## Vibe-Guard

`Vibe-Guard` is the proposed policy-centered auditing layer derived from these observations. It is designed to evaluate changes against structural rules instead of relying on per-file intuition.

Its purpose is to answer questions such as:

- Can this route expose unpublished content?
- Does this Server Action mutate privileged state without role checks?
- Is this plugin configuration leaking secret material to the client?
- Has a debugging endpoint bypassed environment controls?

The main idea is simple: security should be enforced as a centralized architectural policy, not as a memory exercise for developers or language models.
