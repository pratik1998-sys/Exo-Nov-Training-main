# Plugin documentation

Every plugin must have an associated **`docs`** directory with an **`index.md`** that provides an overview for developers and integrators. Place it at the **plugin root**. Where to create the plugin (and thus its docs) follows [Component location](../component-location/SKILL.md): default **`src/core-staging/plugins/$pluginId/docs/index.md`**; app or core-modules paths only when the user explicitly requested. Create **`src/core-staging`** if it does not exist.

**Additions to existing core-modules:** When the new components are **additions to existing core-modules** (e.g. a new plugin feature under `src/core-staging/plugins/$pluginId/features/$featureId` while the plugin already exists in core-modules), create docs **at the new component location only**: **`features/$featureId/docs/index.md`** next to the new code. **Do not create or update documentation under core-modules.**

**Plugin root docs when adding a feature under core-staging:** When you add a new plugin feature under **`src/core-staging/plugins/$pluginId/features/$featureId`**, you **must** also ensure the **plugin root** has docs so the project root documentation lists the plugin. If **`src/core-staging/plugins/$pluginId/docs/`** does not exist, create **`src/core-staging/plugins/$pluginId/docs/index.md`** with: (1) YAML frontmatter and title **`$pluginId plugin (Staging)`**; (2) an Overview stating the plugin purpose and that it provides staging implementations; (3) a list of feature(s) with links to **`features/$featureId/docs/index.md`** — the feature's **docs** directory, not `features/$featureId/index.md` (e.g. `- [ec-user](features/ec-user/docs/index.md) — ec-user plugin feature (Staging)`). This allows `yarn generate:docs` to copy the plugin docs and add the plugin to `docs/plugins/index.md`, so the project root docs know there is a core-staging plugin with that feature.

**YAML frontmatter (required):** Every plugin `docs/index.md` (at the plugin root) and every plugin feature `features/$featureId/docs/index.md` must start with a YAML frontmatter block on the first four lines:

```markdown
---
title: $pluginId[ $featureId] plugin feature (Staging|$appId) or $pluginId plugin
layout: default
---
```

Choose a **title** that clearly describes the document, for example:

- `commercetools ec-user plugin feature (Staging)`
- `shopify plugin`

The **layout** must always be `default`. The first heading after the frontmatter should repeat the title in `# ...` form.

**Document title (location suffix):** The first-level heading in `index.md` must include a location suffix so readers can tell where the component lives. **Do not update existing core-modules docs.** Use:
- **" (Staging)"** when the component is under **`src/core-staging`** (e.g. `# $pluginId $featureId plugin feature (Staging)`).
- **" ($appId)"** when the component is under **`src/apps/$appId`** (e.g. `# $pluginId $featureId plugin feature ($appId)`).

**Do not reference project code.** Document the plugin using only the Plugin and (for DB plugins) database-plugin skill templates and the derived names ($pluginId, $featureId, $FeatureName, table/schema from derivation and user prompt). Describe purpose, configuration, and for database plugins the tables and columns derived from the entity template and derivation.

## Required content

### 1. Overview

- **Purpose:** What the plugin does and which feature(s) it implements.
- **Logic:** How it fits into the system (e.g. database-backed implementation, REST client, GraphQL client), key flows, and configuration requirements.

### 2. Backend integration (non-database plugins)

For plugins that integrate with **external or backend services** (REST, GraphQL, other APIs):

- **Services integrated:** List the backend systems or APIs the plugin talks to (e.g. "User REST API at …", "Pet GraphQL endpoint").
- **Endpoints / operations:** Document the main endpoints, queries, or operations used (paths, methods, or operation names).
- **Configuration:** How the plugin is configured (env vars, `setup.configuration.yaml` keys) to reach those services.
- **Authentication / headers:** Any API keys, tokens, or headers required.

This section should be enough for operators to configure the plugin and for developers to understand integration points.

### 3. Database schema (database plugins)

For **database plugins**, document the **tables and their columns** (and schema name if applicable):

- **Schema:** Database schema name if used (e.g. `ase`).
- **Tables:** One subsection per table (e.g. `ase.user_profile`).
  - **Columns:** Name, type, nullable, default, and short description. Include primary key, unique constraints, and foreign keys if any.
  - **Indexes:** List indexes and their columns (and purpose if non-obvious).
- **Relations:** Any references to other tables or schemas.

Align this with the TypeORM entity and DDL so it stays accurate. Plugin consumers use this to understand the data model and to run or verify DDL.

### 4. Diagrams (Mermaid) — required (do not skip)

**Gate:** Before considering plugin (or plugin feature) documentation complete, you **must** add the Mermaid diagrams below. **Do not skip this section.** Omitting diagrams is a documentation failure.

Every plugin `docs/index.md` **must** include detailed **Mermaid** diagrams so developers can see how the plugin works and how it integrates with the backend.

- **Component/architecture diagram:** One diagram showing how the plugin's internal components relate (e.g. Resolver/Controller, Plugin Service, Mapper, Datasource; for DB plugins add entities/repository). Use a flowchart: nodes for each component, edges for "calls" or "uses." Use node IDs in camelCase or PascalCase (no spaces).
- **Sequence diagram(s) — one per flow:** You **must** create a **separate Mermaid sequence diagram for every flow** that enters the plugin from the controller or resolver (i.e. for each controller operation and each resolver query/mutation that uses this plugin). Do not document only one representative flow; document **all** operations that hit the plugin through to the backend.
  - Each sequence diagram must include:
    - **Client** (GraphQL or REST caller),
    - **Resolver** and/or **Controller**,
    - **Plugin Service** (implements feature contract),
    - **Mapper** (if present),
    - **Datasource** (plugin's data layer),
    - **Backend system:** For REST/GraphQL plugins, show the **external API** (e.g. "Backend REST API" or "Backend GraphQL") and the actual API calls (e.g. `GET /customers`, `query getCustomer`). For database plugins, show the **database** and operations (e.g. query, insert). Participants should make the integration boundary clear (e.g. `participant BackendRESTAPI`, `participant BackendGraphQL`, `participant Database`).
  - Title or caption each diagram so it is clear which operation it describes (e.g. "Sequence: GET list → plugin → backend", "Sequence: Query item by id → plugin → backend", "Sequence: Mutation create → plugin → backend").

**Mermaid rules:** Use camelCase or PascalCase for node/participant IDs; avoid spaces in IDs. For labels with special characters use double quotes. Do not use reserved words as node IDs.

## Example outline for index.md (non-database plugin)

Use a title that includes the location suffix when the plugin (or plugin feature) lives in core-staging or an app (see "Document title (location suffix)" above), and include the YAML frontmatter block first. Example for a plugin feature in core-staging:

```markdown
---
title: $pluginId $featureId plugin feature (Staging)
layout: default
---

# $pluginId $featureId plugin feature (Staging)

## Overview
Purpose and how it implements the feature(s).

## Backend integration
- Services integrated: …
- Endpoints / operations: …
- Configuration and authentication.

## Diagrams
- **Component diagram:** flowchart of Resolver/Controller, Plugin Service, Mapper, Datasource and how they connect.
- **Sequence diagram(s):** one sequence diagram **per** controller/resolver flow that hits the plugin (each operation through to backend). Include **backend system and APIs** (e.g. Client → Resolver → Service → Mapper → Datasource → Backend REST/GraphQL API, with actual API calls shown). Title each (e.g. "Sequence: GET list", "Sequence: Query item by id", "Sequence: Mutation create").
```

## Example outline for index.md (database plugin)

```markdown
---
title: $pluginId plugin (Staging|$appId) or $pluginId plugin
layout: default
---

# $pluginId plugin (Staging|$appId) or $pluginId plugin

## Overview
Purpose and how it implements the feature(s) with the database.

## Database schema
- Schema: e.g. ase
- Table: ase.$table_name
  - Columns: id, identifier, username, …
  - Indexes: …

## Diagrams
- **Component diagram:** flowchart of Resolver/Controller, Plugin Service, Mapper, Datasource, entities and how they connect.
- **Sequence diagram(s):** one sequence diagram **per** controller/resolver flow that hits the plugin (each operation through to database). Include the **database** (e.g. Client → Resolver → Service → Mapper → Datasource → Database, with query/insert/update operations shown). Title each (e.g. "Sequence: GET list", "Sequence: Query item by id", "Sequence: Mutation create").
```

## Checklist

- [ ] Plugin (or plugin feature when an addition to existing core-modules) has a `docs/` directory with `index.md` at the **new component location**; do not update core-modules docs.
- [ ] Document title includes " (Staging)" when under src/core-staging, or " ($appId)" when under src/apps/$appId.
- [ ] Plugin has a `docs/` directory with `index.md` (at plugin root when creating a new plugin).
- [ ] index.md includes overview (purpose, logic).
- [ ] For non-database plugins: backend services and integration points are documented.
- [ ] For database plugins: tables and their columns (and schema) are documented.
- [ ] **Diagrams (Mermaid) — mandatory:** At least one component diagram (internal plugin components and how they work together) and **one sequence diagram per controller/resolver flow** that hits the plugin (each operation through to backend/database), so that **all** integration flows are documented. Each sequence diagram must **include the backend system and APIs** (external REST/GraphQL API or database). **Do not skip.** If `docs/index.md` has no Mermaid code blocks or is missing sequence diagrams for any operation, the documentation is incomplete.
