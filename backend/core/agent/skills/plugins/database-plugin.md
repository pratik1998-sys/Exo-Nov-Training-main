# Database Plugin

Implement a feature with a **database plugin**: TypeORM entities, repository access via `BasePluginServiceImpl` (`getRepository`/`getDatabaseConnection` are built into this base class — there is no separate database service base class), and mappers to the feature model (or Ext model).

**Base classes:** When **creating a new plugin**, create `common/` with base service and base mapper; feature service and mapper extend those. When the **plugin already exists and has no `common/`**, feature service and mapper extend the framework base classes (`BasePluginServiceImpl`, `BaseMapper`) directly. See Plugin SKILL "Base classes and common directory".

## Do not reference project code

**Do not reference project code.** Use only the templates in this file and the derivation rules in the Feature and Plugin skills. All service method names, error names, mapper method names, and types must match the feature contract derived from the user prompt (see Feature SKILL "Deriving specific code" and Plugin SKILL "Deriving specific code"). Entity columns and DDL are derived from the feature model (and any extension fields the user requests), not from existing project tables.

## Deriving specific code from the user prompt

Replace placeholders using the Plugin and Feature skill derivation rules:

- **`$pluginId`**, **`$featureId`**, **`$FeatureName`** — From user prompt (see Plugin SKILL). Example: "user-db plugin for user feature" → pluginId `user-db`, featureId `user`, FeatureName `User`.
- **Service method names and errors** — Must match the feature. If the feature uses plural-resource: getUsers, getUser, createUser, updateUser, deleteUser; UserErrors.getUserFailed(), createUserFailed(), userExists(), userNotEditable(). If generic: getItems, getItem, createItem, updateItem, deleteItem; $FeatureErrors.getFailed(), createFailed(), exists(), notEditable(). Use the same in the plugin service; do not reference project code to discover these.
- **Mapper methods** — map$FeatureNameResultSet, map$FeatureName (e.g. mapUserResultSet, mapUser). Repository getter: get$FeatureNameRepository (e.g. getUserRepository). Entity class: DB$PluginId$FeatureNameEntity (e.g. UserDbUserEntity); base mapper/service: DB$PluginIdBaseMapper, DB$PluginIdBaseServiceImpl (e.g. UserDbBaseMapper, UserDbBaseServiceImpl).
- **`$table_name`** — Database table name; derive from feature/resource (e.g. `user`, `user_profile`, `pet`). Use snake_case.
- **`$schema_name`** — PostgreSQL (or DB) schema name for the table. **How to derive:** (1) If the user prompt names a schema (e.g. "schema app", "tables in schema ase", "use schema public"), use that value. (2) If the prompt mentions an app or project name that suggests a schema, use its lowercase/snake_case form (e.g. "app" for application-owned tables). (3) Otherwise use a default convention such as **`app`**. Use lowercase; no spaces. Use `$schema_name` consistently in the entity `@Entity({ schema: '$schema_name' })`, in DDL (`CREATE SCHEMA IF NOT EXISTS $schema_name`; `$schema_name.$table_name`), in `setup.env` (e.g. `DATABASE_$DATABASE_ID_SCHEMA=$schema_name`), and in the application database configuration if the connection specifies a default schema.
- **`$DATABASE_ID`** — Id for the database in `configuration.yaml` (e.g. `user-db-database`, `ase-database`). Often `$pluginId-database`.
- **Entity columns** — From the feature model the plugin implements. The template shows a typical set (id, identifier, username, password, type, first_name, middle_name, last_name, email, phone, roles, can_edit). Add or remove columns based on the **feature's model types** (from the Feature skill model template: $Feature has which fields?) and any **extension fields** the user requests (e.g. thumbnail_url, image_url, last_logon, field1, field2, field3 for Ext user). Use snake_case for column names; map to camelCase in the entity. Do not copy columns from project code; derive from the feature/extension model and user prompt. **Always** specify `type` (e.g. `'varchar'`, `'int'`, `'boolean'`, `'date'`), `length` when applicable (e.g. for varchar/string columns), and `nullable` when it can be derived (required fields → omit or `nullable: false`; optional fields → `nullable: true`). This avoids reliance on TypeORM reflection and keeps tests and runtimes consistent.

Entity file **must** be named `$pluginId.$featureId.entity.ts` and live under `features/$featureId/entities/` so the framework discovers it.

- **`$DATABASE_ID`** — the database connection id this entity should register on. A plugin can declare **more than one** database connection under `databases` in its configuration; when it does, mark exactly one entry `primary: true` (or the first entry is used as the default). Entities register on the plugin's primary connection unless annotated with `@PluginDatabaseConnection('$OTHER_DATABASE_ID')` (from `@plugin/database`) to target a different declared connection. Single-database plugins never need the decorator.

---

## 1. Base mapper (`common/db-$pluginId.base.mapper.ts`)

Provides `composePagination` for result sets. Used by feature mappers.

```ts
import { Pagination } from '@feature/models';
import { BaseMapper } from '@plugin/mapper';

export class DB$PluginIdBaseMapper extends BaseMapper {
    composePagination(limit: number, offset: number, count: number): Pagination {
        const totalPages = limit > 0 ? (count < limit ? 1 : Math.ceil(count / limit)) : 0;
        const pageNumber = limit > 0 ? Math.floor(offset / limit) + 1 : 1;
        return {
            page: pageNumber,
            pageSize: limit,
            resultCount: count,
            pageCount: totalPages,
            hasMorePages: pageNumber < totalPages,
        };
    }
}
```

---

## 2. Base service (`common/db-$pluginId.base.service.ts`)

Extends `BasePluginServiceImpl` directly (its `getRepository`/`getDatabaseConnection` methods are what provide database access). Add any plugin-wide helpers (e.g. auth checks). Feature services extend this and implement the feature's abstract service.

```ts
import { BasePluginServiceImpl } from '@plugin/service';

export class DB$PluginIdBaseServiceImpl extends BasePluginServiceImpl {}
```

**common/index.ts:**

```ts
export * from './db-$pluginId.base.service';
export * from './db-$pluginId.base.mapper';
```

---

## 3. Entity (`features/$featureId/entities/$pluginId.$featureId.entity.ts`)

TypeORM entity. Column names typically snake_case in DB; use `@Column({ name: 'column_name', type, length?, nullable?, default? })`. Set **`schema`** to **`$schema_name`** (derived as above) so the entity targets the correct schema. **Always include `type`**, and **`length`** for string/varchar columns, and **`nullable`** when it can be derived (required vs optional from the feature model).

```ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// Only import/apply this decorator when the plugin has more than one database
// connection and this entity does not live on the primary one:
// import { PluginDatabaseConnection } from '@plugin/database';

@Entity({ name: '$table_name', schema: '$schema_name' })
// @PluginDatabaseConnection('$OTHER_DATABASE_ID')
export class DB$PluginId$FeatureNameEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ name: 'identifier', type: 'varchar', length: 255 })
    identifier?: string;

    @Column({ name: 'username', type: 'varchar', length: 255 })
    username?: string;

    @Column({ name: 'password', type: 'varchar', length: 255, nullable: true })
    password?: string;

    @Column({ name: 'type', type: 'varchar', length: 64, nullable: true })
    type?: string;

    @Column({ name: 'first_name', type: 'varchar', length: 255, nullable: true })
    firstName?: string;

    @Column({ name: 'middle_name', type: 'varchar', length: 255, nullable: true })
    middleName?: string;

    @Column({ name: 'last_name', type: 'varchar', length: 255, nullable: true })
    lastName?: string;

    @Column({ name: 'email', type: 'varchar', length: 255, nullable: true })
    email?: string;

    @Column({ name: 'phone', type: 'varchar', length: 64, nullable: true })
    phone?: string;

    @Column({ name: 'roles', type: 'varchar', length: 512, nullable: true })
    roles?: string;

    @Column({ name: 'can_edit', type: 'boolean', nullable: true, default: true })
    canEdit?: boolean;

    // Extension columns if feature has Ext model (e.g. thumbnail_url, image_url, last_logon, field1, field2, field3)
    // Always specify type, length (for varchar), and nullable when derivable:
    // @Column({ name: 'thumbnail_url', type: 'varchar', length: 512, nullable: true })
    // thumbnailUrl?: string;
    // @Column({ name: 'field2', type: 'int', nullable: true })
    // field2?: number;
    // @Column({ name: 'field3', type: 'boolean', nullable: true, default: false })
    // field3?: boolean;
    // ...
}
```

---

## 4. Mapper (`features/$featureId/$pluginId.$featureId.mapper.ts`)

Maps entity ↔ feature model (or Ext model). Extends the plugin base mapper. Implements `map$FeatureNameResultSet` and `map$FeatureName`.

```ts
import { RequestContext } from '@context/request';
import { DB$PluginIdBaseMapper } from '@plugin-$pluginId/common/db-$pluginId.base.mapper';
import { DB$PluginId$FeatureNameEntity } from './entities/$pluginId.$featureId.entity';
import { $FeatureResultSet, $Feature } from '@feature-$featureId';

export class DB$PluginId$FeatureNameMapper extends DB$PluginIdBaseMapper {
    map$FeatureNameResultSet(
        requestContext: RequestContext,
        dbItems: DB$PluginId$FeatureNameEntity[],
        count: number,
        limit: number,
        offset: number,
    ): $FeatureResultSet {
        return {
            pagination: this.composePagination(limit, offset, count),
            results: dbItems ? dbItems.map((dbItem) => this.map$FeatureName(requestContext, dbItem)) : [],
        };
    }

    map$FeatureName(requestContext: RequestContext, dbItem: DB$PluginId$FeatureNameEntity): $Feature {
        if (!dbItem) return null;
        return {
            id: `${dbItem.id}`,
            identifier: dbItem.identifier,
            username: dbItem.username,
            firstName: dbItem.firstName,
            middleName: dbItem.middleName,
            lastName: dbItem.lastName,
            type: dbItem.type,
            email: dbItem.email,
            phone: dbItem.phone,
            roles: dbItem.roles?.split(',').map((r) => r.trim()),
        } as $Feature;
    }
}
```

If the app has an Ext model, import the Ext type from the app (e.g. relative path `../../../../features/$featureId/$featureId-ext.model`) and return that type; map any extra columns (thumbnail, image, lastLogon, field1, field2, field3) there.

---

## 5. Service (`features/$featureId/$pluginId.$featureId.service.ts`)

Implements the feature's abstract service. Extends the plugin base service. Uses `this.getRepository(Entity)` (from `BasePluginServiceImpl`), `this.translateLimitOffsetPagination`, `this.getMapper()`, and optionally `this.getService()` for cross-feature calls. **Substitute method and error names per Plugin SKILL derivation:** the template below uses generic names (getItems, getItem, $FeatureErrors.getFailed()); replace with the feature's chosen convention (e.g. getUsers, getUser, UserErrors.getUserFailed(), createUserFailed(), userExists(), userNotEditable()) so the plugin implements the exact feature contract without referencing project code.

```ts
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { RequestContext } from '@context/request';
import { v4 as uuidv4 } from 'uuid';
import {
    $FeatureNameService,
    $FeatureFilterInput,
    $FeatureResultSet,
    $Feature,
    $FeatureCreateInput,
    $FeatureCreate,
    $FeatureInput,
    $FeatureErrors,
} from '@feature-$featureId';
import { PaginationInput } from '@feature/models';
import { DB$PluginId$FeatureNameEntity } from './entities/$pluginId.$featureId.entity';
import { DB$PluginId$FeatureNameMapper } from './$pluginId.$featureId.mapper';
import { DB$PluginIdBaseServiceImpl } from '@plugin-$pluginId/common/db-$pluginId.base.service';

export class DB$PluginId$FeatureNameServiceImpl extends DB$PluginIdBaseServiceImpl implements $FeatureNameService {
    getTokenId(requestContext: RequestContext): string {
        return this.getPluginTokenId(requestContext);
    }

    async getItems(
        filter: $FeatureFilterInput,
        pagination: PaginationInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<$FeatureResultSet> {
        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination);
        const where: FindOptionsWhere<DB$PluginId$FeatureNameEntity> = {};
        if (filter?.identifiers?.length) where.identifier = In(filter.identifiers);
        if (filter?.usernames?.length) where.username = In(filter.usernames);

        const [entities, count] = await this.get$FeatureNameRepository().findAndCount({
            where,
            skip: offset,
            take: limit,
        });
        return this.getMapper(requestContext).map$FeatureNameResultSet(requestContext, entities, count, limit, offset);
    }

    async getItem(identifier: string, requestContext: RequestContext, context?: any): Promise<$Feature> {
        identifier = identifier ?? requestContext.user?.identifier ?? requestContext.tokens[this.getTokenId(requestContext)]?.token;
        const resultSet = await this.getItems({ identifiers: [identifier] }, null, requestContext, context);
        const item = resultSet?.results?.[0] ?? null;
        if (!item) throw $FeatureErrors.getFailed();
        return item;
    }

    async createItem(
        input: $FeatureCreateInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<$FeatureCreate> {
        const existing = await this.getItems({ usernames: [input.username] }, null, requestContext, context);
        if (existing?.results?.length) throw $FeatureErrors.exists();

        const entity: Partial<DB$PluginId$FeatureNameEntity> = {
            identifier: uuidv4(),
            username: input.username,
            password: input.password ?? null,
            type: input.type ?? null,
            firstName: input.firstName ?? null,
            middleName: input.middleName ?? null,
            lastName: input.lastName ?? null,
            email: input.email ?? null,
            phone: input.phone ?? null,
            roles: input.roles?.join(',') ?? null,
            canEdit: true,
        };
        const saved = await this.get$FeatureNameRepository().save(entity);
        return (await this.getItem(saved.identifier, requestContext, context)) as $FeatureCreate;
    }

    async updateItem(
        identifier: string,
        input: $FeatureInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<$Feature> {
        identifier = identifier ?? requestContext.user?.identifier;
        const existing = await this.get$FeatureNameRepository().findOne({ where: { identifier } });
        if (!existing) throw $FeatureErrors.getFailed();
        if (existing.canEdit === false) throw $FeatureErrors.notEditable();

        const update: Partial<DB$PluginId$FeatureNameEntity> = {
            firstName: input.firstName ?? existing.firstName,
            middleName: input.middleName ?? existing.middleName,
            lastName: input.lastName ?? existing.lastName,
            email: input.email ?? existing.email,
            phone: input.phone ?? existing.phone,
            roles: input.roles?.length ? input.roles.join(',') : existing.roles,
        };
        await this.get$FeatureNameRepository().update({ identifier }, update);
        return this.getItem(identifier, requestContext, context);
    }

    async deleteItem(identifier: string, requestContext: RequestContext, context?: any): Promise<$Feature> {
        const item = await this.getItem(identifier, requestContext, context);
        const existing = await this.get$FeatureNameRepository().findOne({ where: { identifier } });
        if (existing?.canEdit === false) throw $FeatureErrors.notEditable();
        await this.get$FeatureNameRepository().delete({ identifier });
        return item;
    }

    protected getMapper(requestContext: RequestContext): DB$PluginId$FeatureNameMapper {
        return this.getMapper<DB$PluginId$FeatureNameMapper>(requestContext, DB$PluginId$FeatureNameMapper);
    }

    protected get$FeatureNameRepository(): Repository<DB$PluginId$FeatureNameEntity> {
        return this.getRepository<Repository<DB$PluginId$FeatureNameEntity>>(DB$PluginId$FeatureNameEntity);
    }
}
```

The base class `BasePluginServiceImpl` defines `getRepository(repositoryClass, databaseId?)`. Connection resolution order: explicit `databaseId` argument, then the entity's `@PluginDatabaseConnection` decorator, then the plugin's primary database connection. Single-database plugins never need to pass `databaseId` or use the decorator — `this.getRepository(Entity)` resolves to the one connection automatically. The typed helper `get$FeatureNameRepository()` is for convenience and type safety.

---

## 6. Module (`features/$featureId/$pluginId.$featureId.module.ts`)

Extends `BasePluginModule` — the same base every plugin module uses (REST, GraphQL, or database). No extra code needed; it discovers and registers this feature's entities automatically by convention when `database.id` is configured.

```ts
import { BasePluginModule } from '@plugin/module';

export class DB$PluginId$FeatureNameModule extends BasePluginModule {}
```

---

## 7. Index (`features/$featureId/index.ts`)

```ts
export * from './entities/$pluginId.$featureId.entity';
export * from './$pluginId.$featureId.mapper';
export * from './$pluginId.$featureId.service';
export * from './$pluginId.$featureId.module';
```

---

## 8. setup.configuration.yaml

Database plugin **must** set `databases` (an array) so the framework can register TypeORM entities with the referenced connection(s). Use the same database id(s) as in the application's `configuration.yaml` under `databases`. Mark exactly one entry `primary: true` — this is the default connection for entities without a `@PluginDatabaseConnection` decorator. Most plugins declare a single entry (still an array, still marked `primary: true`); add a second entry only when the plugin genuinely needs a second connection, in which case at least one entity must use `@PluginDatabaseConnection` to target the non-primary connection (see the Entity template above).

**Include an example database configuration snippet** in this file (or in comments) so integrators know how to add the database to the application. The snippet below shows the plugin block; also provide (or reference) the `databases` entry format.

**Plugin configuration (setup.configuration.yaml):**

```yaml
id: &$pluginId $pluginId
tokenId: $pluginId-token
databases:
  - id: $DATABASE_ID
    primary: true
    configuration:
      test:
        key1: value1.1
    consumers:
    - id: $CONSUMER_ID
```

**Example database configuration snippet** (for application `configuration.yaml` under `databases` — include this in setup.configuration.yaml as a comment or separate snippet so install/config tooling or docs can copy it). Do **not** put connection details (host, port, username, password, database, schema) here; they are loaded from `.env` using an env var key that is **all uppercase** (e.g. `DATABASE_CONFIG_POSTGRES_USER-DB-DATABASE` for database id `user-db-database`):

```yaml
# Example databases entry for application configuration.yaml
# Connection details come from .env (see setup.env).
databases:
  -
    id: &$DATABASE_ID $DATABASE_ID
    type: postgres
```

---

## 9. setup.env

Example environment variables for the database connection. Application will reference the database by `$DATABASE_ID` (e.g. `user-db-database`). **The env var key must be all uppercase:** the pattern is `DATABASE_CONFIG_{TYPE}_{ID}` where both the database `type` and `id` are uppercased (e.g. `postgres` → `POSTGRES`, `user-db-database` → `USER-DB-DATABASE`). So the key is `DATABASE_CONFIG_POSTGRES_USER-DB-DATABASE`, not `DATABASE_CONFIG_POSTGRES_user-db-database`. **For database plugins, include the following entry as-is** (use the exact key and JSON shape; use the **uppercased** database id in the key, e.g. `USER-DB-DATABASE`; replace `$USERNAME`, `$PASSWORD`, `$HOST`, `$PORT`, `$DATABASE`, `$SCHEMA`, `$BASE64_CERT` with actual values or variable names as needed):

```
# $pluginId plugin — database connection ($DATABASE_ID)
# Copy to .env and set values.
# Key must be ALL UPPERCASE (e.g. user-db-database → USER-DB-DATABASE)

# PostgreSQL — single config object (include as-is for database plugins)
# Example for database id "user-db-database":
DATABASE_CONFIG_POSTGRES_USER-DB-DATABASE={"isLoggingEnabled": true, "username":$USERNAME,"password":$PASSWORD,"host":$HOST,"port":$PORT,"database":$DATABASE,"schema":$SCHEMA,"certificate":$BASE64_CERT}
```

---

## 10. Application configuration.yaml

Define the database and the plugin, then attach the plugin to the feature. Do **not** put database connection details (host, port, username, password, database, schema) in `configuration.yaml`; they are loaded from `.env` (env var key is all uppercase, e.g. `DATABASE_CONFIG_POSTGRES_USER-DB-DATABASE`).

```yaml
databases:
  -
    id: &$DATABASE_ID $DATABASE_ID
    type: postgres

plugins:
  # ...
  -
    id: &$pluginId $pluginId
    tokenId: $pluginId-token
    databases:
      - id: *$DATABASE_ID
        primary: true
        consumers:
        - id: *site-1

features:
  -
    id: $featureId
    enabled: true
    plugin:
      id: *$pluginId
```

---

## 11. DDL (PostgreSQL)

Create the table (and optional schema) before using the plugin. Align column names and types with the entity. Use **`$schema_name`** (derived as in "Deriving specific code") for the schema in all DDL.

```sql
CREATE SCHEMA IF NOT EXISTS $schema_name;

CREATE TABLE IF NOT EXISTS $schema_name.$table_name (
    id BIGSERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    type VARCHAR(64),
    first_name VARCHAR(255),
    middle_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(64),
    roles VARCHAR(512),
    can_edit BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_$table_name_identifier ON $schema_name.$table_name(identifier);
CREATE INDEX IF NOT EXISTS idx_$table_name_username ON $schema_name.$table_name(username);
```

---

## 12. Specs (mapper and service) — required

**You must create `*.spec.ts` files for every mapper and service file.** Do not skip. If the plugin also defines a datasource, create a datasource spec per the Plugin SKILL Testing section.

**Mapper spec:** For every `$pluginId.$featureId.mapper.ts`, create `$pluginId.$featureId.mapper.spec.ts` in the same directory. Use `PluginMapperTestHarness.create({ pluginId: '$pluginId', featureId: '$featureId', consumerIds: ['site-1'] })` and `harness.createMapper(DB$PluginId$FeatureNameMapper, { componentId: '$pluginId.$featureId.mapper' })`. Assert mapped entity → feature model (and result set).

**Service spec:** For every `$pluginId.$featureId.service.ts`, create `$pluginId.$featureId.service.spec.ts` in the same directory. Mock the mapper and the entity (to avoid loading TypeORM decorators in test). Override `get$FeatureNameRepository` (or the repository getter you use) with a mock that has `findAndCount`, `findOne`, `save`, `update`, `delete`. Use a variable for the map function (e.g. `map$FeatureNameFn`) and reference it in the result-set mock to avoid "Mock is not callable" (e.g. `results: entities.map((e) => map$FeatureNameFn(_ctx, e))`).

---

## Checklist

- [ ] Entity file name is `$pluginId.$featureId.entity.ts` under `features/$featureId/entities/`.
- [ ] Entity uses `@Entity({ name: '$table_name', schema: '$schema_name' })` with `$schema_name` derived from the user prompt or default convention (e.g. `app`).
- [ ] Every `@Column` includes **`type`**; **`length`** for string/varchar columns; **`nullable`** when it can be derived from the feature model.
- [ ] Base service extends `BasePluginServiceImpl`; feature service uses `this.getRepository(Entity)`.
- [ ] `setup.configuration.yaml` has `databases` set (array, one entry `primary: true`); application `configuration.yaml` defines that database and references it in the plugin.
- [ ] If the plugin has more than one database connection, entities not on the primary connection use `@PluginDatabaseConnection('$OTHER_DATABASE_ID')` from `@plugin/database`.
- [ ] For every mapper file: `$pluginId.$featureId.mapper.spec.ts` exists; for every service file: `$pluginId.$featureId.service.spec.ts` exists; service spec mocks repository and uses a shared map function for the result-set mock.
