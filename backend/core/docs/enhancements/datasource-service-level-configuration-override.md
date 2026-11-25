---
title: "Enhancement: Datasource Service-Level Configuration Override"
layout: default
---

# Enhancement: Datasource Service-Level Configuration Override

**Status:** Shipped in [1.3.113](../versions.md#v1-3-113)
**Shipped:** `59a786b` (2026-09-05)
**Implementation:** `core/foundation/plugin/datasource/base/datasource.ts` (`BaseDatasource`)
**Reference:** [Datasources — Service-operation-level configuration overrides](../components/plugin/datasources.md#service-operation-level-configuration-overrides)

## Problem

A REST/GraphQL datasource's configuration (host, credentials, etc.) already resolves per plugin and per consumer, down to a per-datasource-class override via a `{COMPONENT_TOKEN}` suffix (see the existing 4-level fallback below). But that resolution is **all-or-nothing per datasource class** — every service operation defined on that datasource shares the same resolved config for a given consumer.

Sometimes only a subset of a datasource's operations need different configuration — for example, one or two endpoints live on a different upstream host, need different credentials, or should be pointed at a staging/mock service while the rest of the datasource's operations continue hitting production. Previously, the only way to do that was to split those operations into an entirely separate plugin/datasource, duplicating shared configuration, mappers, and boilerplate.

## Change

`BaseDatasource` gained a second, independent override mechanism layered on top of the existing base config resolution: **service-operation-level overrides**, keyed by an `_OVERRIDES` suffix, that can redirect a named subset of a datasource's service operations to a different configuration block.

### Base per-datasource-class configuration (pre-existing, commit `5fc270a`)

`resolveDatasourceConfigurations()` resolves one configuration object per consumer, trying environment variable keys in this order (most to least specific):

1. `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}_{COMPONENT_TOKEN}`
2. `DATASOURCE_CONFIG_{PLUGIN_ID}_{COMPONENT_TOKEN}`
3. `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}`
4. `DATASOURCE_CONFIG_{PLUGIN_ID}`

Where `{COMPONENT_TOKEN}` = `standardizeComponent()` — the datasource's `componentId` with `.datasource` stripped and remaining `.` replaced with `_` (e.g. `tutorial-pet-rest.pet.datasource` → `TUTORIAL-PET-REST_PET`). This resolved value is stored per-consumer in `consumerDatasourceConfigs`.

### Service-level override (new)

`resolveServiceOverrideConfigurations(validServiceIds)` looks for an additional JSON blob per consumer, using the same 4-level fallback with an `_OVERRIDES` suffix on the component/plugin token:

1. `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}_{COMPONENT_TOKEN}_OVERRIDES`
2. `DATASOURCE_CONFIG_{PLUGIN_ID}_{COMPONENT_TOKEN}_OVERRIDES`
3. `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}_OVERRIDES`
4. `DATASOURCE_CONFIG_{PLUGIN_ID}_OVERRIDES`

The value is a JSON object keyed by an arbitrary **label**, where each entry is a `DatasourceServiceOverrideConfiguration`:

```typescript
export interface DatasourceServiceOverrideConfiguration {
  host: string;
  services: string[];
  [key: string]: any;
}
```

- `host` (and any other required config fields for that datasource type) — the override's own configuration values, validated the same way as the base config (`validateDatasourceConfigFields`).
- `services` — the list of service operation ids (matching the datasource's `serviceDefinitions` keys) that this override applies to.

Example, for a REST datasource with component token `TUTORIAL-PET-REST_PET` and consumer `site-1`:

```bash
# .env
DATASOURCE_CONFIG_SITE-1_TUTORIAL-PET-REST_PET_OVERRIDES='{
  "staging-api": {
    "host": "https://staging.example.com",
    "services": ["getPet", "listPets"],
    "clientId": "staging-client",
    "clientSecret": "staging-secret"
  }
}'
```

Here, only the `getPet` and `listPets` service operations for consumer `site-1` are redirected to `https://staging.example.com`; every other operation on the same datasource keeps using the base-resolved config.

### Runtime resolution

`getDatasourceConfig(requestContext, serviceId)` is called from `composeRequest()` with the specific `serviceDefinition.id` being executed, and returns the override config if one is mapped for that service id, otherwise falls back to the base per-consumer config:

```292:302:core/foundation/plugin/datasource/base/datasource.ts
getDatasourceConfig<T>(
  requestContext: RequestContext,
  serviceId?: string,
): T {
  const consumerId = requestContext.consumer;
  const overrideConfig = serviceId
    ? this.serviceOverrideConfigs[consumerId]?.[serviceId]
    : undefined;

  return (overrideConfig ?? this.consumerDatasourceConfigs[consumerId]) as T;
}
```

### Validation and error handling

- An override block that isn't an object, or whose `services` isn't an array, throws `PLUGIN_DATASOURCE_INVALID_OVERRIDE_CONFIGURATION_{PLUGIN_ID}:{label}` (or `:services`).
- A `services` entry that doesn't match any known service definition id logs a warning (`... references unknown service id ...`) and is skipped — it does not fail startup.
- If two override blocks (for the same consumer) both claim the same service id, startup throws `PLUGIN_DATASOURCE_AMBIGUOUS_OVERRIDE_CONFIGURATION_{PLUGIN_ID}:{serviceId}` — overrides for a given service id must be unambiguous.
- Valid override blocks still go through the datasource's own `getRequiredConfigFields()` validation (e.g. REST datasources require `host`).

### Caching

`getDatasourceConfigCacheKey(requestContext, serviceId)` incorporates the override's label (not just the consumer id) into the cache key, so cached responses for an overridden service operation don't collide with cached responses for the same operation under the default configuration:

```304:314:core/foundation/plugin/datasource/base/datasource.ts
getDatasourceConfigCacheKey(
  requestContext: RequestContext,
  serviceId?: string,
): string {
  const consumerId = requestContext.consumer;
  const overrideLabel = serviceId
    ? this.serviceOverrideLabels[consumerId]?.[serviceId]
    : undefined;

  return overrideLabel ? `${consumerId}:${overrideLabel}` : consumerId;
}
```

## Wiring

`resolveServiceOverrideConfigurations()` is invoked from `BaseRestDatasource.onModuleInit()` (`core/foundation/plugin/datasource/api/rest/rest.datasource.ts`), passing the datasource's known service definition ids as the valid set. `BaseGraphqlDatasource` extends `BaseRestDatasource`, so GraphQL datasources inherit this behavior automatically — no additional wiring is needed for GraphQL-backed plugins.

## Env var reference (full picture)

| Pattern | Applies to | Description |
|---------|-----------|--------------|
| `DATASOURCE_CONFIG_{PLUGIN_ID}` | All operations | Plugin default |
| `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}` | All operations, one consumer | Consumer override |
| `DATASOURCE_CONFIG_{PLUGIN_ID}_{COMPONENT_TOKEN}` | All operations on one datasource class | Per-datasource-class default |
| `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}_{COMPONENT_TOKEN}` | All operations on one datasource class, one consumer | Per-datasource-class, per-consumer override |
| `DATASOURCE_CONFIG_{PLUGIN_ID}_OVERRIDES` | Named subset of service operations (via `services[]`) | Service-level override, plugin-wide |
| `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}_OVERRIDES` | Named subset of service operations, one consumer | Service-level override, consumer-scoped |
| `DATASOURCE_CONFIG_{PLUGIN_ID}_{COMPONENT_TOKEN}_OVERRIDES` | Named subset of service operations on one datasource class | Service-level override, datasource-class-scoped |
| `DATASOURCE_CONFIG_{CONSUMER_ID}_{PLUGIN_ID}_{COMPONENT_TOKEN}_OVERRIDES` | Named subset of service operations on one datasource class, one consumer | Most specific service-level override |

## Reference

The [Datasources](../components/plugin/datasources.md#service-operation-level-configuration-overrides) page documents the base `DATASOURCE_CONFIG_*` keys and the `_OVERRIDES` mechanism together.
