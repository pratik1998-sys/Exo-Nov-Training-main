---
title: Testing
layout: default
---

# Testing

[← Back to Documentation](index.md)

The framework uses [Vitest](https://vitest.dev/) for unit and component tests. Test files are `*.spec.ts` (or `*.test.ts` for shared harness modules, which are excluded from the test run). This page gives a high-level overview and points to component-specific testing docs.

## Test runner and scripts

- **`yarn test`** — Runs Vitest once with the default reporter (project root).
- **`yarn test:run`** — Custom script (`core/scripts/run-tests.js`) that runs Vitest and supports a **dynamic `--verbose` flag**: pass `--verbose` to get per-test output (Vitest’s `--reporter=verbose`). Example: `yarn test:run --verbose` or `yarn test:run --verbose core-modules/features/tutorial-pet/pet/`. You can also enable verbose via environment: `VERBOSE=1 yarn test:run` or `VITEST_VERBOSE=1 yarn test:run`. Any other arguments (e.g. file or directory paths) are passed through to Vitest.
- **`yarn test:watch`** — Vitest in watch mode.
- **`yarn test:cov`** — Vitest with coverage.

Configuration lives in the project root: `vitest.config.mts` (path aliases, includes/excludes, environment).

## Component testing frameworks

Two harness-based frameworks provide shared setup so you don’t duplicate mocks and Nest testing modules:

| Area | Description | Doc |
|------|--------------|-----|
| **Feature testing** | Test feature **resolvers** and **controllers** with a shared harness; override `resolveService` with a mock service. | [Feature component testing](components/feature/testing.md) |
| **Plugin testing** | Test plugin **services**, **mappers**, and **datasources** with shared config, mocks, and `createService` / `createMapper` / `createDatasource` factories. | [Plugin component testing](components/plugin/testing.md) |

Use the harnesses from your `*.spec.ts` files: create the harness once per test suite (e.g. in `beforeEach`), then create the component under test with the harness and optional mocks (e.g. mock service, datasource, or mapper). See the linked docs for API details and examples.

## Related

- [Feature — Deep dive](components/feature/feature.md) — Feature components and structure
- [Plugin — Deep dive](components/plugin/plugin.md) — Plugin components and structure
