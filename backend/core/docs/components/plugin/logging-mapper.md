---
title: Logging mapper methods
layout: default
---

# Logging mapper methods

[← Back to Mapper](mapper.md)

This page describes the **mapper method logging** framework: how it works, how to invoke it from your mapper code, and how to configure which mapper methods are logged.

## Technical overview

- **Registry** — **MapperLoggingRegistry** extends the framework’s [ConfigurableLoggingRegistry](registry.md) and is loaded at application startup. It reads its configuration from the **MAPPER_LOGGING** environment variable, which must be a JSON string. The registry parses this into a nested map keyed by `pluginId` → `featureId` → `mapperId`, and supports a **wildcard** `*` at any level so you can enable logging for a single method, all methods of a mapper, or all mappers in a feature or plugin.
- **Lookup** — When your mapper calls **logTransformation(...)**, the base class calls **MapperLoggingRegistry.getInstance().isMapperLoggingEnabled(featureId, pluginId, mapperId)**. The registry resolves the value from its nested data (with wildcard fallback). If the result is true, the base class logs the transformation.
- **Log output** — Logging is done via the framework logger (e.g. `logger.info`) with a message that includes the method name, the mapped input, and the mapped output. Sensitive fields can be masked by the application’s [logger configuration](../logger.md#configuration) (e.g. `loggerMaskedFields`).
- **Runtime** — The same configurable logging registry pattern used for [datasource operation logging](logging-datasource-operations.md) applies: configuration can be updated at runtime if your application supports it (e.g. through an admin API that updates the registry), so you can turn mapper logging on or off without restarting.

## How to invoke it from a mapper method

Inside any mapper method that performs a transformation you want to log:

1. Call **this.logTransformation(methodname, requestContext, mapperId, input, output)** where:
   - **methodname** — A string identifying the caller (e.g. `${YourMapperClass.name}.toPet` or `PetMapper.toPet`). Used in the log message.
   - **requestContext** — The current **RequestContext** (passed into your mapper method by the service).
   - **mapperId** — A string that identifies this transformation in the logging config (e.g. `toPet`, `toPetList`, `mapPet`). This is the key used in configuration under `pluginId.featureId.<mapperId>`.
   - **input** — The raw input (e.g. the datasource response or DTO) before mapping.
   - **output** — The mapped output (e.g. the CatalystJS model or schema object).

2. The base class will only log if mapper logging is enabled for the current plugin, feature, and `mapperId` (or a matching wildcard). If disabled, the call is a no-op.

Example:

```ts
// In your mapper class extending BaseMapper
toPet(requestContext: RequestContext, dto: PetDto): Pet {
  const mapped: Pet = {
    id: dto.id,
    name: dto.name,
    // ...
  };
  this.logTransformation(
    `${PetMapper.name}.toPet`,
    requestContext,
    'toPet',
    dto,
    mapped,
  );
  return mapped;
}
```

Use a consistent `mapperId` (e.g. the method name) so configuration stays simple.

## Configuration to log a mapper method

Logging is controlled by the **MAPPER_LOGGING** environment variable. The value must be a **JSON string** representing a flat object.

**Key format:** `pluginId.featureId.mapperId`

- **pluginId** — The plugin id (e.g. `tutorial-pet-rest`).
- **featureId** — The feature id (e.g. `pet`).
- **mapperId** — The string you pass as `mapperId` when calling **logTransformation** (e.g. `toPet`, `toPetList`).

**Value:** `true` to enable logging for that key, `false` to disable.

The registry builds a nested map and supports the **wildcard** `*` at any segment. Examples:

### Enable logging for one mapper method

Enable logging only for the `toPet` method of the `tutorial-pet-rest` plugin’s `pet` feature:

```json
{
  "tutorial-pet-rest.pet.toPet": true
}
```

Example in `.env`:

```bash
MAPPER_LOGGING='{"tutorial-pet-rest.pet.toPet":true}'
```

### Enable logging for all methods of a mapper

Enable logging for every method of the same plugin/feature mapper (any `mapperId`):

```json
{
  "tutorial-pet-rest.pet.*": true
}
```

Example in `.env`:

```bash
MAPPER_LOGGING='{"tutorial-pet-rest.pet.*":true}'
```

### Enable logging for all mappers in a feature or plugin

Enable for all mapper methods in the plugin (all features):

```json
{
  "tutorial-pet-rest.*.*": true
}
```

### Multiple entries and disabling

You can combine multiple keys and use `false` to disable:

```json
{
  "tutorial-pet-rest.pet.toPet": true,
  "tutorial-pet-rest.pet.toPetList": true,
  "tutorial-pet-rest.user.*": false
}
```

## Related

- [Mapper](mapper.md) — What a mapper is and base class helpers
- [Logging datasource operations](logging-datasource-operations.md) — Operation-level logging for REST/GraphQL
- [Registry](registry.md) — Configurable logging registry pattern
- [Logger](../logger.md) — Application logging and masking
