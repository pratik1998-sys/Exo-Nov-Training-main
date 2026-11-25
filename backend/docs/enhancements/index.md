---
title: Enhancement Plans
layout: default
---

# Enhancement Plans

This section tracks the design/enhancement plans behind notable framework changes — the problem being solved, the approach taken, and the exact files/mechanisms involved. Each plan is written to stay accurate as the corresponding code evolves; see [Versions](../versions.md) for the changelog entry (when one exists) tied to a given plan.

| Plan | Status | Summary |
|------|--------|---------|
| [Database access for all plugins](database-access-for-all-plugins.md) | Shipped | Database entity registration and repository access moved into the standard plugin base classes, so any plugin (REST, GraphQL, or otherwise) can use a database — not just dedicated database plugins. |
| [Datasource service-level configuration override](datasource-service-level-configuration-override.md) | Shipped | Per-service-operation datasource configuration overrides (`*_OVERRIDES` environment variables), for pointing a subset of a datasource's operations at a different host/credentials than the rest. |
| [Multi-database-per-plugin support](multi-database-per-plugin.md) | Shipped | A plugin can declare more than one database connection (`databases[]`) and select which connection a given entity or query uses via the `@PluginDatabaseConnection` decorator or an explicit parameter. How-to: [Assigning entity classes to a database](../components/plugin/assigning-entities-to-databases.md). |
