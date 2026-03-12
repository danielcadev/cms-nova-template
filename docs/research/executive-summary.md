# Executive Summary

This research investigates the security behavior of AI-assisted software development through a real-world case study: `CMS Nova`, a Next.js-based headless CMS that evolved through iterative human-AI collaboration.

The central claim is that modern coding models often preserve local correctness while weakening global system integrity. In practice, they can produce working code that appears reasonable inside a single file, yet violates cross-cutting security invariants such as authorization boundaries, publication rules, route exposure constraints, and secret-handling policies.

The research introduces `Vibe-Guard`, a structural auditing proposal built around centralized policy enforcement through an MCP-style protocol. Rather than depending on developers or models to manually remember every security rule in every file, Vibe-Guard externalizes architectural and security expectations into a single policy layer that can evaluate code changes in real time.

The case study is grounded in three concepts:

- `Naming Bias`: the tendency of AI systems to infer safety from labels, file names, or route names instead of verifying actual data sensitivity or authorization context.
- `Lack of Global Context`: the inability of the model to consistently reason across middleware, route contracts, plugin gates, data lifecycles, and repository-wide invariants.
- `Minimum Viable Understanding (MVU)`: the minimum architectural knowledge a human operator must possess to detect when AI-generated code is locally plausible but globally unsafe.

This work is motivated by real findings. During audits of production-grade systems, 24 security vulnerabilities were identified in AI-assisted code paths, especially around API exposure, Server Actions, missing authorization, unsafe debugging routes, and state transitions that bypassed intended policy.

`CMS Nova` is therefore treated not only as a product, but as a controlled research artifact. Its evolution provides evidence that:

- AI can accelerate implementation significantly.
- AI often fixes visible issues while preserving or introducing structural weaknesses elsewhere.
- Human oversight remains essential, but should be elevated from line-level review to policy-level governance.
- Security in AI-assisted software engineering should be framed as an architectural verification problem, not merely a linting problem.

The expected contribution of this research is twofold:

- an empirical account of how structural security regressions emerge in AI-generated code,
- and a practical governance model, `Vibe-Guard`, for auditing those regressions before they reach production.
