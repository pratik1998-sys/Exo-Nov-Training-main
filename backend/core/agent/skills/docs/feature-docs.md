# Feature documentation

Every feature must have an associated **`docs`** directory with an **`index.md`** that provides an overview for developers and integrators. Where to create the feature (and thus its docs) follows [Component location](../component-location/SKILL.md): default **`src/core-staging/features/$featureId/docs/index.md`**; **`src/apps/$appId/features/$featureId/docs/index.md`** or **`core/`** / **`core-modules/`** only when the user explicitly requested. Create **`src/core-staging`** if it does not exist.

**Gate for feature creation:** When creating a new feature (Feature skill), the feature is **not complete** until **`docs/index.md`** exists at the feature root with the required content and §6 diagrams. The Feature skill checklist requires this file; do not skip it.

**Additions to existing core-modules:** When the new feature (or feature extension) is an **addition to existing core-modules** (e.g. feature created under `src/core-staging/features/...` while related feature or plugin exists in core-modules), create docs **at the new component location only**. **Do not create or update documentation under core-modules.**

**YAML frontmatter (required):** Every feature `docs/index.md` must start with a YAML frontmatter block on the first four lines:

```markdown
---
title: $FeatureName feature (Staging|$appId)
layout: default
---
```

The **title** must be specific to the document (e.g. `EcUser feature (Staging)`, `Order feature (catalyst-tutorial)`); the **layout** must always be `default`. The heading on the first line *after* the frontmatter should repeat the title (e.g. `# EcUser feature (Staging)`).

**Document title (location suffix):** The first-level heading in `index.md` must include a location suffix so readers can tell where the component lives. Use:
- **" (Staging)"** when the feature is under **`src/core-staging`** (e.g. `# $FeatureName feature (Staging)`).
- **" ($appId)"** when the feature is under **`src/apps/$appId`** (e.g. `# $FeatureName feature ($appId)`).

**Do not reference project code.** Document the feature using only the Feature SKILL templates and the derived names ($featureId, $FeatureName, operation names, service contract) from the user prompt. Describe the API (paths, queries, mutations), schema (types and fields from the model template and derivation), and service interface contract (method names and semantics from the abstract service template and derivation).

## Required content

### 1. Overview

- **Purpose:** What the feature does and why it exists.
- **Logic:** High-level behavior, key flows, and any important constraints or side effects.

### 2. Controller operations (if any)

If the feature exposes REST endpoints via a controller, document:

- Each HTTP method and path (e.g. `GET /$featureId`, `GET /$featureId/:id`, `POST /$featureId`, `PUT /$featureId/:id`, `DELETE /$featureId/:id`).
- Request parameters, query shape, and body schema where relevant.
- Response shape and status codes.
- Any special behavior (e.g. `@current` for current user).

### 3. GraphQL API (if any)

If the feature exposes a resolver, document:

- **Queries:** Name, arguments (e.g. filter, pagination), return type, and short description.
- **Mutations:** Name, arguments, return type, and short description.
- Any notable behavior (e.g. current-user resolution, error conditions).

### 4. Schema (model)

Document the **public schema** exposed by the feature:

- **Types:** List the main GraphQL/REST types (e.g. `$Feature`, `$FeatureResultSet`, `$FeatureInput`, `$FeatureCreateInput`, `$FeatureFilterInput`).
- **Fields:** For each type, list fields, types, and whether they are required or optional. Include IDs, identifiers, and any domain-specific fields.
- **Relations:** Any references to other features or shared types.

This section should be enough for API consumers and for plugin authors to map to their storage or external services.

### 5. Service interface contract (plugin contract)

Document the **abstract service interface** that plugins must implement. This is the contract between the feature and any plugin that provides the implementation.

Include:

- **Service class/interface name** (e.g. `$FeatureNameService`).
- **Methods** that plugins must implement, with:
  - Method name and signature (parameters and return type).
  - Semantics: what each method is expected to do (e.g. get by id, list with filter and pagination, create, update, delete).
  - Any special methods (e.g. `getTokenId(requestContext)`).
- **Errors:** When the feature throws (e.g. getFailed, notEditable, exists). Reference `$featureId.error.ts` or the equivalent.
- **Request context:** How `RequestContext` and optional `context` are used (e.g. auth, tenant, plugin token).

Plugin authors use this section to implement the feature correctly; keep it accurate and up to date when the feature or service interface changes.

### 6. Diagrams (Mermaid) — required (do not skip)

**Gate:** Before considering feature documentation complete, you **must** add the Mermaid diagrams below. **Do not skip this section.** Omitting diagrams is a documentation failure.

Every feature `docs/index.md` **must** include detailed **Mermaid** diagrams so developers can see how components interact.

- **Component/architecture diagram:** One diagram showing how the feature’s internal components relate (e.g. Resolver, Controller, Service, parameters, DTOs). Use a flowchart or graph: nodes for each component type, edges for "calls" or "uses." Use `flowchart` or `graph` with node IDs in camelCase or PascalCase (no spaces). Example: `Resolver --> Service`, `Controller --> Service`, `Service --> RequestContext`.
- **Sequence diagram(s) — one per operation:** You **must** create a **separate Mermaid sequence diagram for every**:
  - **Controller operation** (each REST endpoint the feature exposes), and
  - **Resolver query and mutation** (each GraphQL query and mutation the feature exposes).
  - Derive operation names from the feature contract and API configuration (e.g. plural-resource: `$featureNamePlural`, `$featureName`, `$featureNameCreate`, `$featureNameUpdate`, `$featureNameDelete`; generic: `items`, `item`, `itemCreate`, `itemUpdate`, `itemDelete`). Do not document only one representative flow; document **all** operations.
  - Each sequence diagram must include:
    - **Client** (label as **REST Client** for controller flows, **GraphQL Client** for resolver flows),
    - **Controller** or **Resolver** (as applicable for that operation),
    - **Service** (the feature's abstract service),
    - **RequestContext** or auth/context if relevant.
  - Title or caption each diagram so it is clear which operation it describes (e.g. "Sequence: GET list ($featureNamePlural)", "Sequence: Query $featureName by id", "Sequence: Mutation $featureNameCreate").
  - Use `sequenceDiagram` with participant names without spaces (e.g. `participant Controller`, `participant Service`).

**Mermaid rules:** Use camelCase or PascalCase for node/participant IDs; avoid spaces in IDs. For labels with special characters use double quotes. Do not use reserved words (e.g. `end`, `graph`) as node IDs.

## Example outline for index.md

Use a title that includes the location suffix when the feature lives in core-staging or an app (see "Document title (location suffix)" above), and include the YAML frontmatter block first.

```markdown
---
title: $FeatureName feature (Staging)
layout: default
---

# $FeatureName feature (Staging)

## Overview
Purpose and high-level logic.

## Controller operations
(If applicable) List REST endpoints, methods, paths, and request/response.

## GraphQL API
(If applicable) Queries and mutations with args and return types.

## Schema (model)
Types and fields for $Feature, $FeatureResultSet, inputs, filters.

## Service interface contract (plugin contract)
$FeatureNameService methods and semantics; errors; request context usage.

## Diagrams
- **Component diagram:** flowchart of Resolver/Controller, Service, parameters, DTOs and how they connect.
- **Sequence diagram(s):** one sequence diagram **per** controller operation and **per** resolver query/mutation (e.g. list, get by id, create, update, delete — for both REST and GraphQL when both exist). Each diagram: Client (REST or GraphQL), Controller or Resolver, Service, RequestContext. Title each diagram with the operation (e.g. "Sequence: GET list", "Sequence: Query item by id", "Sequence: Mutation create").
```

## Checklist

- [ ] Feature has a `docs/` directory with `index.md` at the **new component location** when the feature is an addition to existing core-modules; do not update core-modules docs.
- [ ] Document title includes " (Staging)" when under src/core-staging, or " ($appId)" when under src/apps/$appId.
- [ ] Feature has a `docs/` directory with `index.md`.
- [ ] index.md includes overview (purpose, logic).
- [ ] Controller operations are documented if the feature has a controller.
- [ ] GraphQL queries and mutations are documented if the feature has a resolver.
- [ ] Schema (model) is documented with types and fields.
- [ ] Service interface contract is documented for plugin implementers.
- [ ] **Diagrams (Mermaid) — mandatory:** At least one component/architecture diagram (internal components and how they work together) and **one sequence diagram per controller operation and per resolver query/mutation** (all REST endpoints and all GraphQL queries/mutations). **Do not skip.** If `docs/index.md` has no Mermaid code blocks or is missing sequence diagrams for any operation, the documentation is incomplete.
