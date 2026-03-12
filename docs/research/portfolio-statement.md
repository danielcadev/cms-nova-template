# Portfolio Statement

## Research Statement

My research focuses on the security of AI-assisted software development, especially on how coding models often compromise system integrity when they operate without stable global context.

To study this problem in a realistic setting, I built and audited `CMS Nova`, a Next.js-based headless CMS with dynamic content types, authentication, public routing, plugins, media handling, and reusable template layers. Rather than treating the project only as an application, I used it as a live case study for architectural drift, route exposure, authorization inconsistency, secret handling, and boundary failures in AI-assisted code generation.

This work led to the formulation of several concepts:

- `Naming Bias`, where models infer safety from names rather than verified policy,
- `Minimum Viable Understanding (MVU)`, the minimum architectural knowledge a human needs to supervise AI effectively,
- and `Lack of Global Context`, the recurring failure mode in which locally plausible code weakens system-wide guarantees.

From this research, I developed the idea of `Vibe-Guard`: a policy-centered structural auditing approach that uses centralized rules, rather than human memory alone, to verify whether generated code still respects security and architectural invariants.

## What I Built

In practical terms, I did not only analyze the problem. I intervened in it.

I performed a security-focused and architecture-focused refactor of `CMS Nova` that included:

- tightening public content visibility rules,
- reducing plugin secret exposure,
- introducing sanitized centralized logging,
- removing dead code and duplicate flows,
- separating reusable CMS concerns into `server`, `modules`, and `shared`,
- and isolating business-specific features into `verticals` such as tourism and experiences.

The result is a codebase that better reflects ownership boundaries, supports multi-project reuse, and provides a concrete before-vs-after case study for research on AI-generated software integrity.

## Why This Matters

I believe the central challenge of AI coding is no longer only code generation quality. It is governance.

Modern models can produce impressive local completions, but secure systems depend on preserved relationships between routes, data states, auth policies, secret boundaries, and architectural layers. My work aims to understand those failures empirically and design practical mechanisms to reduce them.

That is why I am interested in research environments that combine software systems, security, and AI. I want to contribute to the emerging question of how human architectural judgment and machine generation can be combined without sacrificing structural integrity.
