# GraphQL Plugin (Datasource)

**Mandatory gate — read first:** If you are here because the user asked to **create** or **add** a GraphQL datasource (new plugin or new feature on an existing plugin), you **must not** write any schema or datasource code yet. Your **first reply** in that thread must: (1) ask the user for the **API source** — either a **system documentation URL** or a **GraphQL endpoint** (for introspection); (2) after they provide it, obtain the list of queries and mutations and present it in a **markdown table with row numbers**; (3) ask the user to **select which operations** the datasource should implement (by row number). Only after the user has selected operations may you generate the schema file and datasource code. Skipping this flow (e.g. because the plugin already exists or the API is "well known") is not allowed.

## First reply rule (read before any other action)

**Before running any tool or writing any code** for a new or added GraphQL datasource:

1. If the user asked to create or add a GraphQL plugin/feature datasource → your **next message in the thread must be only** the API-source prompt (see "API discovery and selection" below). Do not search the codebase, do not read existing plugin/feature files, and do not generate any schema or datasource code until the user has provided the source and selected operations.
2. There are **no exceptions**: not for an existing plugin, not for a known vendor (e.g. Adobe Commerce, Commercetools), not when other code already imports the plugin feature.

**STOP checklist — answer YES to all before writing any schema/datasource code:**

- [ ] I have sent the user a message that asks for the API source (system documentation URL or GraphQL endpoint).
- [ ] The user has provided that source.
- [ ] I have presented the operation list in a markdown table with row numbers and asked the user to select operations.
- [ ] The user has selected which operations to implement.

Implement a feature with a **GraphQL plugin**: a base GraphQL datasource shared across features, and per-feature datasources that call an external GraphQL API. Query and mutation definitions live in schema files; the feature service uses the datasource and mapper to fulfill the feature contract.

**Reference implementations:**
- Base datasource: `core-modules/plugins/commerce/adobe-commerce/common/adobe-commerce.base.datasource.ts`
- Feature datasource: `core-modules/plugins/commerce/adobe-commerce/features/ec-user/adobe-commerce.ec-user.datasource.ts`
- Schema (queries/mutations and types): `core-modules/plugins/commerce/adobe-commerce/features/ec-user/schema/adobe-commerce.ec-user.schema.ts`

**Base classes:** When **creating a new plugin**, create `common/` with base datasource; feature datasource extends it. When the **plugin already exists and has no `common/`**, the feature datasource extends `BaseGraphqlDatasource` directly. See Plugin SKILL "Base classes and common directory".

## Do not reference project code

**Do not reference project code.** Use only the templates in this file and the derivation rules in the Feature and Plugin skills. All method names, query/mutation names, and types must match the feature contract derived from the user prompt (see Feature SKILL "Deriving specific code" and Plugin SKILL "Deriving specific code").

## Deriving specific code from the user prompt

Replace placeholders using the Plugin and Feature skill derivation rules:

- **`$pluginId`**, **`$featureId`**, **`$FeatureName`** — From user prompt (see Plugin SKILL). Example: "adobe-commerce plugin for ec-user feature" → pluginId `adobe-commerce`, featureId `ec-user`, FeatureName `ECUser`.
- **`$PluginId`** — PascalCase plugin id (e.g. `AdobeCommerce`). Use for class names.
- **Datasource naming (align to backend):** The **datasource** layer (service definition `id`, interface property names, and **method names**) must use the **backend API's GraphQL operation names** from the chosen API (e.g. `getCustomer`, `createCustomer`, `updateCustomer`), **not** the feature id (e.g. `getEcUser`, `createEcUser`). The **plugin service** implements the feature contract (e.g. `getEcUser`, `createEcUser`) and calls the datasource's backend-named methods (e.g. `getCustomer()`, `createCustomer()`). See "Datasource naming: align to the backend system" below.
- **Schema types** — Request/response types and input types aligned with the GraphQL schema (variables and response shape). Use `static baseGQL` on type classes for field selection strings when building queries in schema.

---

## API discovery and selection (required for GraphQL datasource)

**First response in the thread:** If the user asked to create a new GraphQL plugin or to add a new GraphQL plugin feature, your **first reply** in that thread must ask for the API source (GraphQL endpoint for introspection or system documentation URL). Do not read the codebase or create any schema/datasource code before sending that reply. This is required by the Plugin SKILL "Mandatory gate: REST/GraphQL plugin or plugin feature"; there are no exceptions.

**Location and API prompt (do both before any code):** Before writing any GraphQL datasource code: (1) **Path:** Confirm the plugin feature path is `src/core-staging/plugins/$pluginId/features/$featureId/` (not `core-modules/...`) unless the user explicitly said otherwise. (2) **API source:** Send the user a message asking them to choose: **system documentation URL** or **GraphQL endpoint** (for introspection). Do not write any schema file, serviceDefinitions, or datasource methods until the user has provided that source and selected which queries/mutations to implement.

**Your first response when creating a GraphQL datasource:** When the user asks to create a new GraphQL plugin or to add a new feature with a GraphQL datasource, your **first reply** in that thread must be to ask for the API source (system documentation URL or GraphQL endpoint for introspection). Do not output any schema files, serviceDefinitions, or datasource code until after the user has provided the source and selected which queries/mutations to implement. This applies every time, including when adding a feature to an existing plugin and when the backend is a well-known API. Do not infer queries, mutations, or types from existing plugin code or vendor knowledge; always prompt for the API source first.

**Mandatory gate:** Before writing any GraphQL datasource code (serviceDefinitions, query/mutation documents, schema types, or datasource methods), you **must** complete the full flow below. **Do not read or search the existing plugin codebase (other features, base datasource, schema files) before sending the API-source prompt.** The only way to know which operations to implement is the user-provided source and the user's selection — not inference from existing code. There are **no exceptions**: not for an existing plugin, not for a known GraphQL API. **Step 1 is always:** send the user a message asking for the API source (system documentation URL or GraphQL endpoint). Only after the user has selected which operations to implement may you generate the schema file and datasource code. Writing schema or datasource code before sending the API-source prompt is not allowed.

**Pre-implementation checklist (all must be true before writing any schema or datasource code):**
- [ ] I have sent the user a message asking for the API source (system documentation URL or GraphQL endpoint).
- [ ] The user has provided that source.
- [ ] I have obtained the list of queries and mutations (from docs or introspection) and sent it to the user **in a markdown table with row numbers** ("Presenting the operation list" format).
- [ ] The user has selected which operations the datasource should implement.
- [ ] Plugin/feature files will be created under `src/core-staging/plugins/$pluginId/features/$featureId` (not under `core-modules`) unless the user explicitly said otherwise.
- [ ] I have not assumed the API is known from the plugin name or existing features; I have explicitly prompted for API source and received it.
- [ ] I have not yet written any schema file, serviceDefinitions, or datasource methods for this datasource.

If any checkbox is false, do not write schema or datasource code; send the appropriate prompt instead.

**Common mistake:** Starting by exploring the codebase (e.g. reading the feature contract, other feature datasources, or the plugin's base datasource) and then implementing. That skips the API-source prompt. Always send the API-source prompt first; do not explore the plugin or feature code until after the user has provided the source and selected operations.

**No inference from plugin or vendor:** Do not infer operations from the fact that the plugin already exists, that the feature is ec-user (or any other feature id), or that the backend is a known system (e.g. Adobe Commerce, Magento, Commercetools). The only valid source is the user-provided API source and the user's operation selection.

When creating a **GraphQL datasource** (new plugin or new feature datasource), determine which queries and mutations to integrate by asking the user to choose one of:

**Prompt the user to choose one of:**

1. **System documentation URL** — They will provide a URL to system/API documentation (e.g. GraphQL docs, developer portal). You will try to parse the documentation to discover available queries and mutations, then present a list for the user to select from.
2. **GraphQL endpoint** — They will provide the GraphQL endpoint URL. You will **invoke the GraphQL introspection query** against that endpoint to retrieve the full schema (types, queries, mutations). Parse the introspection result and present the list of queries and mutations to the user so they can select which ones the datasource should integrate with.

**Presenting the operation list:** Always present the list of queries and mutations **in a markdown table with row numbers** so the user can select by number or range. Use this format:

| # | Operation | Type | Description / signature |
|---|-----------|------|-------------------------|
| 1 | operationName | Query | Brief description or signature |
| 2 | ... | Mutation | ... |

- **#** — Row number (1, 2, 3, …). User will select by these numbers.
- **Operation** — GraphQL operation name.
- **Type** — Query or Mutation.
- **Description / signature** — Brief description or argument/return summary.

Ask the user to select by row number(s) (e.g. "1, 3, 5" or "1–8").

**If the user provides a system documentation URL:**

- Fetch and parse the documentation (e.g. tables of operations, code samples, schema snippets). Extract named **queries** and **mutations** and their signatures (name, arguments, return type) where possible.
- Present them in the **table format above** and ask: *"Which of these should this datasource implement? Reply with the row number(s), e.g. 1, 2, 7 or 1–5."*
- Use the selected operations to define the schema file (`$PluginId$FeatureNameQueries` or equivalent) and datasource `serviceDefinitions` and methods. If the docs include request/response shapes, align schema types with them.

**If the user provides a GraphQL endpoint:**

- **Run the introspection query** against the endpoint (standard `__schema` / `__type` introspection). Parse the response to get the full schema: query and mutation names, arguments, and return types.
- Present them in the **table format above** and ask the user to select by row number(s).
- Use the selected operations to define the schema file (query/mutation strings and variable types) and datasource `serviceDefinitions` and methods. Align TypeScript types and `baseGQL` field selections with the introspected types.

After the user has selected the operations, generate the schema file under `features/$featureId/schema/$pluginId.$featureId.schema.ts` and the feature datasource so that `serviceDefinitions` and methods match the selected queries and mutations.

### Datasource naming: align to the backend system, not the plugin/feature id

The **datasource** (service definition `id`, interface property names, and **method names**) must reflect the **backend API's GraphQL operation names** from the chosen API (e.g. from the operation list or introspection), **not** the feature or plugin id.

- **Do:** Use backend operation names in the datasource. Examples: GraphQL query `customer` or `getCustomer` → `getCustomer`; mutation `createCustomer` → `createCustomer`; mutation `updateCustomer` → `updateCustomer`. Use these for the service definition `id`, the TypeScript interface property names, and the datasource method names (e.g. `async getCustomer(...)`, `async createCustomer(...)`).
- **Do not:** Use feature-centric names in the datasource such as `getEcUser`, `createEcUser`. Those names belong to the **feature contract** and are implemented only in the **plugin service** (e.g. `EcUserService.getEcUser`), which calls the datasource's backend-named methods and then uses the mapper.

This keeps the datasource layer aligned with the external GraphQL API and makes logging and debugging map directly to the API. The **plugin service** implements the feature contract (e.g. `getEcUser`, `createEcUser`) and delegates to the datasource's backend-named methods (e.g. `getCustomer()`, `createCustomer()`). Same rule as REST — see [rest-plugin.md](rest-plugin.md) "Datasource naming: align to the backend system".

---

## 1. Base GraphQL datasource (`common/$pluginId.base.datasource.ts`)

Shared base for all feature datasources in the plugin. Extends `BaseGraphqlDatasource` (from `@plugin-datasource-graphql`). Override `composeHeaders` to add auth, store, or other headers. Optionally override `addAuthTokenToHeaders` to attach the plugin token.

```ts
import { RequestContext } from '@context/request';
import { BaseGraphqlDatasource, GraphqlDatasourceServiceDefinition } from '@plugin-datasource-graphql';

export abstract class $PluginIdBaseDatasource extends BaseGraphqlDatasource {
    protected composeHeaders(
        requestContext: RequestContext,
        datasourceConfig: any,
        headers: Record<string, any>,
        serviceDefinition: GraphqlDatasourceServiceDefinition,
    ) {
        headers = super.composeHeaders(requestContext, datasourceConfig, headers, serviceDefinition);

        // Optional: add consumer-specific headers (e.g. store, locale) from plugin consumer configuration
        // const { configuration } = this.getPluginConsumerConfiguration<YourConsumerConfig>(requestContext);
        // if (configuration?.locales[requestContext.locale]) {
        //     headers.store = configuration.locales[requestContext.locale].storeId;
        // }
        return headers;
    }

    protected addAuthTokenToHeaders(
        requestContext: RequestContext,
        headers: Record<string, any>,
        serviceDefinition: GraphqlDatasourceServiceDefinition,
    ) {
        const token = this.getPluginToken(requestContext);
        if (!headers.authorization && token?.isRegistered) {
            headers.authorization = `Bearer ${token.token}`;
        }
        return headers;
    }
}
```

If the plugin needs no custom headers or auth, the base can be empty:

```ts
import { BaseGraphqlDatasource } from '@plugin-datasource-graphql';

export abstract class $PluginIdBaseDatasource extends BaseGraphqlDatasource {}
```

**common/index.ts:** Export the base datasource (and any shared config types).

---

## 2. Schema file (`features/$featureId/schema/$pluginId.$featureId.schema.ts`)

Put all **GraphQL query and mutation definitions** and **request/response types** for this feature in a separate schema file. Use this file for the `query` property of each `serviceDefinition` in the feature datasource.

- **Service definition `query` property (required):** The `query` field on each `GraphqlDatasourceServiceDefinition` must be assigned the **whole query entry object** (type `GraphqlDatasourceQuery`: object with `queryId` and `query`), e.g. `$PluginId$FeatureNameQueries.get$FeatureName`. **Do not** assign only the string (e.g. not `$PluginId$FeatureNameQueries.get$FeatureName.query`). The framework expects `serviceDefinition.query` to be `GraphqlDatasourceQuery`, not `string`; assigning the string causes a compilation error.
- **Types:** Define TypeScript classes or interfaces for GraphQL response shapes and input types. Use **`static baseGQL`** (string or function returning string) for field selection fragments so queries can reuse them (e.g. `customer { ${AdobeCommerceCustomer.baseGQL} }`).
- **Queries object:** Export a const that implements `GraphqlDatasourceQueries`: each key is the **backend GraphQL operation name** (e.g. `getCustomer`, `createCustomer`), matching the datasource interface and method names; each value has `queryId` and `query` (the GraphQL document string). Variables in the document must match the variables passed to `executeGQLService`. For dynamic queries (e.g. optional fields), you can export functions that return `GraphqlDatasourceQuery` (see category schema reference).

**Example (static queries; keys use backend operation names):**

```ts
import { GraphqlDatasourceQueries } from '@plugin-datasource-graphql';

export class $PluginId$FeatureNameInput {
    email?: string;
    firstname?: string;
    lastname?: string;
    password?: string;
    // ... align with GraphQL input type
}

export class $PluginId$FeatureName {
    id?: string;
    email?: string;
    firstname?: string;
    lastname?: string;
    // ... align with GraphQL type

    static baseGQL = `
        id
        email
        firstname
        lastname
    `;
}

export const $PluginId$FeatureNameQueries: GraphqlDatasourceQueries = {
    getCustomer: {
        queryId: 'getCustomer',
        query: `query GetCustomer {
            customer {
                ${$PluginId$FeatureName.baseGQL}
            }
        }`,
    },
    createCustomer: {
        queryId: 'createCustomer',
        query: `mutation CreateCustomer($input: CreateCustomerInput!) {
            createCustomer(input: $input) {
                customer {
                    ${$PluginId$FeatureName.baseGQL}
                }
            }
        }`,
    },
    // ... one entry per selected query/mutation (use backend operation names as keys)
};
```

**Example (dynamic query via function):** When the query string depends on parameters (e.g. optional product attributes), export a function that returns `GraphqlDatasourceQuery` and call it when building `serviceDefinitions` or when calling `executeGQLService` with an override query.

---

## 3. Feature GraphQL datasource (`features/$featureId/$pluginId.$featureId.datasource.ts`)

Per-feature datasource that defines `serviceDefinitions` (each with `id`, `method`, `timeout`, optional `retryConfig`, and `query` from the schema). **Reminder:** Assign `query` to the full schema entry (e.g. `$PluginId$FeatureNameQueries.getCustomer`), not the `.query` string. **Datasource naming:** Use the **backend API's GraphQL operation names** for the interface property names, service definition `id`, and **method names** (e.g. `getCustomer`, `createCustomer`), not the feature id (e.g. `getEcUser`, `createEcUser`). See "Datasource naming: align to the backend system" above. The plugin service implements the feature contract and calls these backend-named methods. Methods call `this.executeGQLService`. Use `GraphqlHttpMethods.post` or `GraphqlHttpMethods.get` per API convention.

**executeGQLService signature:**  
`this.executeGQLService<T>(requestContext, serviceDefinition, variables, queryOverride?, headers?, maskedLogParams?)`  
- `T` = shape of the GraphQL response root (e.g. `{ customer: AdobeCommerceCustomer }`).  
- Pass `variables` for the operation; pass `null` for `queryOverride` to use `serviceDefinition.query`; pass `[]` for `maskedLogParams` (e.g. `['password']`) to redact from logs.

```ts
import { RequestContext } from '@context/request';
import { $PluginIdBaseDatasource } from '@plugin-$pluginId/common';
import {
    $PluginId$FeatureNameQueries,
    $PluginId$FeatureName,
    $PluginId$FeatureNameInput,
} from './schema/$pluginId.$featureId.schema';
import {
    GraphqlDatasourceServiceDefinition,
    GraphqlDatasourceServiceDefinitions,
    GraphqlHttpMethods,
} from '@plugin-datasource-graphql';

// Use backend GraphQL operation names (e.g. getCustomer, createCustomer); substitute with the chosen API's operation names
export interface $PluginId$FeatureNameDatasourceServiceDefinitions extends GraphqlDatasourceServiceDefinitions {
    getCustomer: GraphqlDatasourceServiceDefinition;
    createCustomer: GraphqlDatasourceServiceDefinition;
    // ... one per selected operation
}

export class $PluginId$FeatureNameDatasource extends $PluginIdBaseDatasource {
    protected serviceDefinitions: $PluginId$FeatureNameDatasourceServiceDefinitions = {
        getCustomer: {
            id: 'getCustomer',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: { maxAttempts: 5, ignoreStatuses: [401] },
            query: $PluginId$FeatureNameQueries.getCustomer,
        },
        createCustomer: {
            id: 'createCustomer',
            method: GraphqlHttpMethods.post,
            timeout: 5000,
            retryConfig: { maxAttempts: 5, ignoreStatuses: [401] },
            query: $PluginId$FeatureNameQueries.createCustomer,
        },
        // ...
    };

    async getCustomer(requestContext: RequestContext): Promise<$PluginId$FeatureName> {
        const gqlResult = await this.executeGQLService<{ customer: $PluginId$FeatureName }>(
            requestContext,
            this.serviceDefinitions.getCustomer,
            {},
            null,
            {},
            [],
        );
        return gqlResult.customer;
    }

    async createCustomer(
        requestContext: RequestContext,
        input: $PluginId$FeatureNameInput,
    ): Promise<$PluginId$FeatureName> {
        const variables = { input };
        const gqlResult = await this.executeGQLService<{ createCustomer: { customer: $PluginId$FeatureName } }>(
            requestContext,
            this.serviceDefinitions.createCustomer,
            variables,
            null,
            {},
            ['password'],
        );
        return gqlResult.createCustomer?.customer;
    }
}
```

Map response paths to the feature model in the service/mapper layer; the datasource returns the raw GraphQL response shape (or the nested node you extract). The **plugin service** implements the feature contract (e.g. `getEcUser`, `createEcUser`) and calls these datasource methods (e.g. `ds.getCustomer()`, `ds.createCustomer()`), then maps the result via the mapper.

---

## 4. Feature module (`features/$featureId/$pluginId.$featureId.module.ts`)

For GraphQL datasource plugins, the feature module must extend `BasePluginModule` (from `@plugin/module`).

```ts
import { BasePluginModule } from '@plugin/module';

export class $PluginId$FeatureNameModule extends BasePluginModule {}
```

---

## 5. setup.configuration.yaml and setup.env (GraphQL plugin)

- **setup.configuration.yaml:** Plugin id, tokenId; no `database` block. Include `graphqlPath` or endpoint-related config in consumer configuration if needed.
- **setup.env:** Example env vars for the GraphQL backend (e.g. endpoint URL, auth). The framework typically expects a config field such as `graphqlPath` (see `BaseGraphqlDatasource.getRequiredConfigFields()`).

---

## 6. Specs (GraphQL datasource) — required

**You must create `$pluginId.$featureId.datasource.spec.ts` for every feature datasource.** Use `PluginDatasourceTestHarness.create({ pluginId, featureId, consumerIds, datasourceConfig })` and `harness.createDatasource($PluginId$FeatureNameDatasource, { componentId, executeGQLService: mockExecuteGQLService })`. Mock `executeGQLService` (and optionally `@plugin-datasource-graphql`) and assert that the datasource calls it with the correct service definition and variables. Do not call the real GraphQL endpoint in tests.

---

## Checklist

- [ ] **API discovery:** Ask user for system documentation URL or GraphQL endpoint; if endpoint, run introspection and list queries/mutations; ask user to select which operations to integrate.
- [ ] Schema file at `features/$featureId/schema/$pluginId.$featureId.schema.ts` with types, `baseGQL` where helpful, and `$PluginId$FeatureNameQueries` (or equivalent) defining each selected query/mutation.
- [ ] Base datasource in `common/$pluginId.base.datasource.ts` extending `BaseGraphqlDatasource`; optional `composeHeaders` and `addAuthTokenToHeaders`.
- [ ] Feature datasource in `features/$featureId/$pluginId.$featureId.datasource.ts` with `serviceDefinitions` (query from schema) and **backend-named methods** (e.g. `getCustomer()`, `createCustomer()`) calling `this.executeGQLService` with correct variables and `maskedLogParams` for sensitive fields. Plugin service implements feature contract and calls these methods.
- [ ] Feature module extends `BasePluginModule`.
- [ ] For every datasource file: corresponding `*.datasource.spec.ts` with harness and mocked `executeGQLService`.
