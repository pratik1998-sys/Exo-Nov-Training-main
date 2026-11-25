---
title: Logger — Deep dive
layout: default
---

# Logger — Deep dive

[← Back to Components](../components.md)

## What is the Logger?

The **Logger** is a foundation component that provides application-wide logging. The framework resolves a single logger module at startup (e.g. Winston-based) and uses it for both framework and application log output. The same logger is registered as the NestJS application logger (via an adapter) and is injectable anywhere using the framework’s **LoggerKey** token. Configuration (e.g. log levels, masked fields) is driven by `configuration.yaml` and environment variables.

The logger is **extendible**: you can replace or extend the default by providing your own logger module and implementation in an app or global directory. The resolved logger class is the one used for the whole app.

## How the logger is loaded

1. **Resolution** — `ApplicationModuleLoader` resolves the logger module by looking for a module under the `foundation/logger` directory (e.g. `**/logger/*.logger.module.js`). `ClassResolver` is used, so the first match in the class loading hierarchy (core → core-modules → core-staging → global → app) wins.
2. **Initialization** — The logger module’s `forRootAsync(configuration, moduleData, moduleClass)` is called (e.g. `LoggerModule.initializeModule()`). Inside, the actual logger **service** class is resolved (e.g. by config key `logger: winston` → `**/winston.*logger.service.js`) and registered as a provider for **LoggerKey**.
3. **Nest adapter** — A **NestJSLoggerServiceAdapter** is registered that wraps the logger instance so NestJS can use it as the application logger (`app.useLogger(adapter)`).
4. **Exports** — The module exports **LoggerKey** and **NestJSLoggerServiceAdapter** so any module can inject the logger.

## Configuration

In `configuration.yaml`:

```yaml
logger: winston
loggerMaskedFields:
  - password
  - clientSecret
  - access_token
```

- **logger** — Identifier for which logger implementation to load (e.g. `winston` → `winston.logger.service.js`). Default is typically `winston` if not set.
- **loggerMaskedFields** — Field names that should be masked in log output (e.g. when logging config or request context).

Environment variables (e.g. log levels) can override or supplement this.

## Implementing a custom logger

1. **Implement the logger service** — Your class should satisfy the framework’s `Logger` interface (e.g. `log`, `error`, `warn`, `debug`) and accept any dependencies (e.g. `ConfigService`, `ModuleRef`) in the constructor.
2. **Place the file** in a path that resolves when the framework looks for the logger module and logger service:
   - To **replace** the default: put your module and service under `src/apps/{appName}/foundation/logger/` (or `src/apps/global/...`) with the same relative path and file naming (e.g. `winston.logger.service.ts` if you keep `logger: winston`, or a new key and matching file name).
3. **Register the implementation** — The loader uses `configuration.logger` (or default) to build the file pattern (e.g. `**/{loggerType}.*logger.service.js`). Ensure your file name matches so `ClassResolver` finds it.
4. **Optional: custom module** — You can provide a custom logger **module** class that extends the base and overrides how the logger service is created; place it so it wins in the class loading hierarchy.

Because the logger is a foundation module resolved once per app, only one logger implementation is active per application.

## Related

- [Architecture](../architecture.md) — How foundation modules are loaded
- [Class Loading Hierarchy](../class-loading-hierarchy.md) — Resolution order for logger module and service
