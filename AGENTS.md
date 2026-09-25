# AGENTS.md — ProtoType project dispatcher

## Governance

- Top-level contract: [`constitution/CONSTITUTION.md`](constitution/CONSTITUTION.md)
- Current Operating Model: [`organization/profiles/release-driven-solo.md`](organization/profiles/release-driven-solo.md)
- Project facts: `README.md`, `package.json`, lockfile, source, and accepted project documentation.

## Working rules

- Keep pnpm as the application package/dependency authority. Bun is only an auxiliary Agent Skills runtime unless a separate toolchain decision changes that.
- Use repository-controlled scripts for typecheck/lint/build/test rather than inventing parallel commands.
- Browser/UI evidence is separate from source-only validation and must be bound to the tested candidate.
- Durable implementation/dependency state belongs in GitHub Issues; review/integration evidence belongs in Pull Requests.
