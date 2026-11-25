# REST Plugin

Implement a feature with a **REST plugin**: a base REST datasource shared across features, and per-feature datasources that call external REST APIs. The service uses the datasource and mapper to fulfill the feature contract.

**Base classes:** When **creating a new plugin**, you **must** create `common/` with base datasource, base mapper, and base service; feature datasource, mapper, and service **extend** these plugin base classes. When the **plugin already exists and has no `common/`** (or no base for a component), the feature class extends the framework base directly. See Plugin SKILL "Base classes and common directory" and "Templated example code (tutorial-pet-rest)".

**Reference implementation:** `core-modules/plugins/tutorial-pet-rest` — common base classes in `common/` (e.g. `tutorial-pet-rest.base.datasource.ts`, `tutorial-pet-rest.base.mapper.ts`, `tutorial-pet-rest.base.service.ts`); feature implementations in `features/pet/`, `features/user/`, etc., extend these bases. Full templated code for common and feature components is in the Plugin SKILL section **"Templated example code (tutorial-pet-rest)"**.

## Do not reference project code

**Do not reference project code.** Use only the templates in this file and the derivation rules in the Feature and Plugin skills. All method names, path params, and types must match the feature contract derived from the user prompt (see Feature SKILL "Deriving specific code" and Plugin SKILL "Deriving specific code").

## Deriving specific code from the user prompt

Replace placeholders using the Plugin and Feature skill derivation rules:

- **`$pluginId`**, **`$featureId`**, **`$FeatureName`** — From user prompt (see Plugin SKILL). Example: "tutorial-pet-rest plugin for pet feature" → pluginId `tutorial-pet-rest`, featureId `pet`, FeatureName `Pet`.
- **`$PluginId`** — PascalCase plugin id (e.g. `TutorialPetRest`). Use for class names and type names.
- **Service definition method names** — Must match the feature contract. Plural-resource: getPets, getPet, createPet, updatePet, deletePet. Generic: getItems, getItem, createItem, updateItem, deleteItem.
- **Path params** — Use `{identifier}` or resource-specific path params (e.g. `{petId}`). Export path param keys in `$PluginIdBaseDatasourcePathParams` and extend in feature datasource as needed.
- **Datasource config** — Extend `RestDatasourceConfiguration` if the plugin needs extra config (e.g. `clientId`, `clientSecret`, `apiKey`). Use in base datasource `composeHeaders` or similar.

---

## API discovery and selection (required for REST datasource — do not skip)

**First response in the thread:** If the user asked to create a new REST plugin or to add a new REST plugin feature, your **first reply** in that thread must ask for the API source (OpenAPI or system documentation). Do not read the codebase, list files, or create any schema/datasource code before sending that reply. This is required by the Plugin SKILL "Mandatory gate: REST/GraphQL plugin or plugin feature"; there are no exceptions.

**Reminder:** Before writing any REST datasource or schema code, you must ask for the API location/source and complete the discovery flow. No exceptions.

**No prior known API:** When creating a REST datasource (new plugin or new feature on an existing plugin), **there is no prior known API.** Do not assume the API is known because:
- the plugin already exists,
- the backend is a well-known vendor (e.g. Commercetools, Stripe), or
- other features in the same plugin use the same backend.

The only source of operations is the **user-provided API definition** (OpenAPI or system docs) and the **user's selection** of which operations to implement. Always run the full discovery flow; never infer paths, methods, or types from existing plugin code or general API knowledge.

**Your first response when creating a REST datasource:** When the user asks to create a new REST plugin or to add a new feature with a REST datasource, your **first reply** in that thread must be to ask for the **API location/source**: how will the APIs be defined? (1) OpenAPI file — local path, (2) OpenAPI file — URL, or (3) System documentation URL. Do not output any file paths, code snippets, or implementation plans until after the user has provided that source and selected operations. This applies every time, including when adding a feature to an existing plugin (e.g. "add ec-user to commercetools") and when the backend is a well-known API (e.g. Commercetools, Stripe). Do not infer paths or operations from existing plugin code or vendor knowledge; always prompt for the API location/source first.

**Mandatory gate:** Before writing any REST datasource code (paths, methods, serviceDefinitions, or schema types), you **must** complete the full flow below. There are **no exceptions**: not for an existing plugin, not for a well-known API (e.g. Commercetools, Stripe), not because the feature contract "implies" certain operations.

- **Treat every REST datasource as if the API is unknown:** the only source of operations is the user-provided API definition and the user's operation selection.
- **Step 1 is always:** Prompt the user for the API source (OpenAPI local path, OpenAPI URL, or system documentation URL). Do not assume, infer, or discover a URL yourself.
- Do not implement operations by copying from other feature datasources in the same plugin or by using general API knowledge. Always: (1) prompt for API source, (2) obtain the operation list, (3) ask the user to select which operations to implement; then implement only those.

**Pre-implementation checklist (all must be true before writing any datasource or schema code):**
- [ ] I have sent the user a message that asks them to choose API source (local OpenAPI path, OpenAPI URL, or system documentation URL).
- [ ] The user has provided that source.
- [ ] I have obtained the operation list (from OpenAPI or from parsing docs) and sent it to the user **in a markdown table with row numbers** (Step 3 format).
- [ ] The user has selected which operations the datasource should implement.
- [ ] Plugin/feature files will be created under `src/core-staging/plugins/$pluginId/features/$featureId` (not under `core-modules`) unless the user explicitly said otherwise.
- [ ] I have not yet written any serviceDefinitions, paths, HTTP methods, or schema types for this datasource.

If any checkbox is false, do not write datasource or schema code; send the appropriate prompt instead.

### Step 1: Prompt for API source (required)

**First, prompt the user to choose one of these three options:**

1. **OpenAPI file (local)** — They will provide a path to a local OpenAPI spec (e.g. `openapi.yaml`, `swagger.json`).
2. **OpenAPI file URL** — They will provide a URL to an OpenAPI spec (remote).
3. **System documentation URL** — They will provide a URL to system/API documentation; you will parse it to discover APIs and produce an OpenAPI file.

**Example prompt:** *"How would you like to define the APIs for this datasource? Please choose one: (1) OpenAPI file — local file path, (2) OpenAPI file — remote URL, or (3) System documentation URL. If you choose (3), I can use that URL to discover endpoints and build an OpenAPI-style spec."*

**Optional default for system documentation:** If the user chooses option 3 (system documentation URL) and the backend is known (e.g. Commercetools), you may suggest a default URL so they can accept it easily (e.g. *"For Commercetools Customers API you can use: https://docs.commercetools.com/api/projects/customers — or provide another documentation URL."*). Do not proceed with a URL you found yourself unless the user has explicitly chosen "system documentation URL" and accepted or provided that URL.

### Step 2: Obtain the operation list

**If the user provides an OpenAPI file (local path or URL):**

- **Local:** Read the file from the given path. **Remote:** Fetch the URL and parse the response as OpenAPI (YAML or JSON).
- Parse the OpenAPI spec and extract the list of **paths** and **operations** (e.g. `GET /pets`, `GET /pets/{id}`, `POST /pets`, `PUT /pets/{id}`, `DELETE /pets/{id}`).

**If the user provides a system documentation URL:**

- Fetch the documentation page(s) and try to **parse the content** to identify APIs: look for path/method tables, endpoint lists, code samples, or structured API descriptions.
- From the parsed information, **create an OpenAPI file** (OpenAPI 3.x YAML or JSON) that describes the discovered operations (paths, methods, parameters, request/response). **Save the file** in the plugin (e.g. under `common/openapi.yaml` or `docs/openapi.yaml`) or in a location agreed with the user.

### Step 3: Present the operation list and ask the user to select (required)

**Presenting the operation list:** Always present the list of operations **in a markdown table with row numbers** so the user can select by number or range. Use this format:

| # | Operation | Method | Path / description | Response |
|---|-----------|--------|--------------------|----------|
| 1 | Operation name | GET/POST/PUT/DELETE | path or short description | Response type or code |
| 2 | ... | ... | ... | ... |

- **#** — Row number (1, 2, 3, …). User will select by these numbers.
- **Operation** — Short, readable name for the operation.
- **Method** — HTTP method.
- **Path / description** — Path pattern (e.g. `/{projectKey}/customers/{id}`) or brief description.
- **Response** — Response type, status, or body summary.

**After** you have the list of operations (from OpenAPI or from parsing system docs), **you must present that table to the user and ask them to select which operations the datasource should implement** (e.g. by row numbers: "1, 2, 7" or "1–5"). Do not choose operations for the user based on the feature name or contract.

- **Example:** *"Which of these should this datasource implement? Reply with the row number(s), e.g. 1, 2, 7 or 1–5."*

Use **only** the operations the user selected to define `serviceDefinitions` and datasource methods (paths, HTTP methods, path params, request/response shapes). Map OpenAPI path parameters to `pathByIdentifier` or path param objects as needed.

### Datasource naming: align to the backend system, not the plugin/feature id

The **datasource** (service definition `id`, interface property names, and **method names**) must reflect the **backend API's operations and resource names** from the chosen API (e.g. from the operation table or OpenAPI), **not** the feature or plugin id.

- **Do:** Use backend naming in the datasource. Examples: Commercetools Customers API → `queryCustomers`, `getCustomerById`, `getCustomerByKey`, `createCustomer`, `updateCustomerById`, `updateCustomerByKey`, `deleteCustomerById`, `deleteCustomerByKey` for both the service definition `id` values and the datasource method names (and the TypeScript interface property names).
- **Do not:** Use feature-centric names in the datasource such as `getEcUsers`, `getEcUserById`, `createEcUser`. Those names belong to the **feature contract** and are implemented only in the **plugin service** (e.g. `EcUserService.getEcUsers`), which calls the datasource's backend-named methods and then uses the mapper.

This keeps the datasource layer clearly aligned with the external API and makes logging, metrics, and debugging map directly to API documentation. The **plugin service** implements the feature contract (e.g. `getEcUsers`, `getEcUser`, `createEcUser`) and delegates to the datasource's backend-named methods (e.g. `queryCustomers`, `getCustomerById`, `createCustomer`).

---

## 1. Datasource config (`common/$pluginId.datasource.config.ts`)

Optional: extend REST datasource configuration when the plugin needs consumer-specific credentials or API keys.

```ts
import { RestDatasourceConfiguration } from '@plugin-datasource-rest';

export interface $PluginIdDatasourceConfig extends RestDatasourceConfiguration { }
```

Add fields as needed (e.g. `clientId`, `clientSecret`, `apiKey`). Document required keys in `setup.env`.

---

## 2. Base REST datasource (`common/$pluginId.base.datasource.ts`)

Shared base for all feature datasources in the plugin. Extends `BaseRestDatasource`. Override `composeHeaders` to add API key, token, or auth headers. Export path param placeholders for use in feature datasources.

```ts
import { RequestContext } from '@context/request';
import { $PluginIdDatasourceConfig } from './$pluginId.datasource.config';
import { BaseRestDatasource, RestDatasourceServiceDefinition } from '@plugin-datasource-rest';

export const $PluginIdBaseDatasourcePathParams = {
    identifier: '{identifier}',
};

export abstract class $PluginIdBaseDatasource extends BaseRestDatasource {
    protected consumerApiKeys: Record<string, string> = {};

    protected readonly headerAPIKey: string = 'x-api-key';
    protected readonly headerToken: string = 'x-token';

    protected composeHeaders(
        requestContext: RequestContext,
        datasourceConfig: any,
        headers: Record<string, any>,
        serviceDefinition: RestDatasourceServiceDefinition,
    ) {
        headers = super.composeHeaders(requestContext, datasourceConfig, headers, serviceDefinition);

        const { clientId, clientSecret } = this.getDatasourceConfig<$PluginIdDatasourceConfig>(requestContext);

        if (!this.consumerApiKeys[requestContext.consumer]) {
            this.consumerApiKeys[requestContext.consumer] = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        }

        headers[this.headerAPIKey] = this.consumerApiKeys[requestContext.consumer];
        headers[this.headerToken] = requestContext.tokens?.[this.getPluginTokenId(requestContext)]?.token;

        return headers;
    }
}
```

If the plugin does not need custom headers, the base datasource can be a thin extension with only path params:

```ts
import { BaseRestDatasource } from '@plugin-datasource-rest';

export const $PluginIdBaseDatasourcePathParams = {
    identifier: '{identifier}',
};

export abstract class $PluginIdBaseDatasource extends BaseRestDatasource {}
```

**common/index.ts:** Export base datasource and config:

```ts
export * from './$pluginId.datasource.config';
export * from './$pluginId.base.datasource';
```

---

## 3. Feature REST datasource (`features/$featureId/$pluginId.$featureId.datasource.ts`)

Per-feature datasource that defines service definitions (HTTP method + path) and methods that call `this.execute`. Method names and response types align with the feature contract and with what the feature mapper expects (e.g. list result set, single resource).

**Path and service definitions:**

- Define `pathRoot` (e.g. `'pet'`) and `pathByIdentifier` using base path params.
- Define an interface extending `RestDatasourceServiceDefinitions` with one property per operation. **Use the backend's operation/resource names** for both the interface property names and the datasource method names (e.g. `queryCustomers`, `getCustomerById`, `createCustomer`), not the feature id (e.g. `getEcUsers`, `getEcUser`). See "Datasource naming: align to the backend system" above.
- Set `serviceDefinitions` with `id`, `method` (`HttpMethods.get/post/put/delete`), `path`, and `timeout`. Use the same backend names for `id` and for the property key (e.g. `queryCustomers: { id: 'queryCustomers', ... }`).

**Execute:**

- Datasource methods are named after the backend (e.g. `queryCustomers`, `getCustomerById`, `createCustomer`). The plugin service implements the feature contract (e.g. `getEcUsers`) and calls these datasource methods.
- List: `this.execute(requestContext, this.serviceDefinitions.queryCustomers, query)` (query as query params).
- Get one: `this.execute(requestContext, this.serviceDefinitions.getCustomerById, {}, {}, paramMap)` with `paramMap` for path params.
- Create: `this.execute(requestContext, this.serviceDefinitions.createCustomer, {}, {}, {}, body)`.
- Update: `this.execute(requestContext, this.serviceDefinitions.updateCustomerById, {}, {}, paramMap, body)`.
- Delete: `this.execute(requestContext, this.serviceDefinitions.deleteCustomerById, {}, {}, paramMap)`.

Template (backend-named datasource — use the backend API's operation/resource names for interface, serviceDefinitions, and methods; the plugin service implements the feature contract and calls these methods):

```ts
import { RequestContext } from '@context/request';
import {
    $PluginId$FeatureNameQuery,
    $PluginId$FeatureNameResultSet,
    $PluginId$FeatureName,
    $PluginId$FeatureNameBodyCreate,
    $PluginId$FeatureNameBodyUpdate,
} from './schema/$pluginId.$featureId.schema';
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from '@plugin-datasource-rest';
import { $PluginIdBaseDatasource, $PluginIdBaseDatasourcePathParams } from '@plugin-$pluginId/common/$pluginId.base.datasource';

export const $PluginId$FeatureNameDatasourcePathParams = {
    ...$PluginIdBaseDatasourcePathParams,
};

export const pathRoot = '$pathRoot';
export const pathByIdentifier = `${pathRoot}/${$PluginId$FeatureNameDatasourcePathParams.identifier}`;

// Use backend API names (e.g. queryCustomers, getCustomerById); substitute with the chosen API's resource/operation names
export interface $PluginId$FeatureNameDatasourceServiceDefinitions extends RestDatasourceServiceDefinitions {
    queryCustomers: RestDatasourceServiceDefinition;
    getCustomerById: RestDatasourceServiceDefinition;
    createCustomer: RestDatasourceServiceDefinition;
    updateCustomerById: RestDatasourceServiceDefinition;
    deleteCustomerById: RestDatasourceServiceDefinition;
}

export class $PluginId$FeatureNameDatasource extends $PluginIdBaseDatasource {
    protected serviceDefinitions: $PluginId$FeatureNameDatasourceServiceDefinitions = {
        queryCustomers: { id: 'queryCustomers', method: HttpMethods.get, path: pathRoot, timeout: 5000 },
        getCustomerById: { id: 'getCustomerById', method: HttpMethods.get, path: pathByIdentifier, timeout: 5000 },
        createCustomer: { id: 'createCustomer', method: HttpMethods.post, path: pathRoot, timeout: 5000 },
        updateCustomerById: { id: 'updateCustomerById', method: HttpMethods.put, path: pathByIdentifier, timeout: 5000 },
        deleteCustomerById: { id: 'deleteCustomerById', method: HttpMethods.delete, path: pathByIdentifier, timeout: 5000 },
    };

    async queryCustomers(
        requestContext: RequestContext,
        query: $PluginId$FeatureNameQuery,
    ): Promise<$PluginId$FeatureNameResultSet> {
        return await this.execute(requestContext, this.serviceDefinitions.queryCustomers, query);
    }

    async getCustomerById(requestContext: RequestContext, identifier: string): Promise<$PluginId$FeatureName> {
        const paramMap = { [$PluginId$FeatureNameDatasourcePathParams.identifier]: identifier };
        return await this.execute(requestContext, this.serviceDefinitions.getCustomerById, {}, {}, paramMap);
    }

    async createCustomer(
        requestContext: RequestContext,
        body: $PluginId$FeatureNameBodyCreate,
    ): Promise<$PluginId$FeatureName> {
        return await this.execute(requestContext, this.serviceDefinitions.createCustomer, {}, {}, {}, body);
    }

    async updateCustomerById(
        requestContext: RequestContext,
        identifier: string,
        body: $PluginId$FeatureNameBodyUpdate,
    ): Promise<$PluginId$FeatureName> {
        const paramMap = { [$PluginId$FeatureNameDatasourcePathParams.identifier]: identifier };
        return await this.execute(requestContext, this.serviceDefinitions.updateCustomerById, {}, {}, paramMap, body);
    }

    async deleteCustomerById(requestContext: RequestContext, identifier: string): Promise<$PluginId$FeatureName> {
        const paramMap = { [$PluginId$FeatureNameDatasourcePathParams.identifier]: identifier };
        return await this.execute(requestContext, this.serviceDefinitions.deleteCustomerById, {}, {}, paramMap);
    }
}
```

**Placeholder summary:**

| Placeholder | Example (pet feature) |
|-------------|------------------------|
| `$pluginId` | `tutorial-pet-rest` |
| `$PluginId` | `TutorialPetRest` |
| `$featureId` | `pet` |
| `$FeatureName` | `Pet` |
| `$FeatureNamePlural` | `Pets` |
| `$pathRoot` | `pet` |
| Schema types | `$PluginId$FeatureNameQuery`, `$PluginId$FeatureNameResultSet`, `$PluginId$FeatureName`, `$PluginId$FeatureNameBodyCreate`, `$PluginId$FeatureNameBodyUpdate` — define in `features/$featureId/schema/$pluginId.$featureId.schema.ts` (or equivalent) and align with API response shape. |

---

## 4. Schema types (`features/$featureId/schema/$pluginId.$featureId.schema.ts`)

Define request/response types used by the feature datasource and mapper. Align with the external API (query params, list shape, single resource, create/update body). Export: query type, result set type, entity type, body create/update types. Derive field names from the feature model and API contract; do not reference project code.

---

## 5. Feature module (`features/$featureId/$pluginId.$featureId.module.ts`)

For REST (and GraphQL) datasource plugins, the feature module must extend `BasePluginModule` (from `@plugin/module`).

```ts
import { BasePluginModule } from '@plugin/module';

export class $PluginId$FeatureNameModule extends BasePluginModule {}
```

---

## 6. setup.configuration.yaml and setup.env (REST plugin)

- **setup.configuration.yaml:** Plugin id, tokenId; no `database` block. Optionally document plugin-specific config keys that come from consumer configuration.
- **setup.env:** Example env vars for the REST backend (e.g. host, clientId, clientSecret, apiKey). Document the keys the datasource config expects (e.g. from `RestDatasourceConfiguration`: host; from extended config: clientId, clientSecret).

---

## 7. Specs (REST datasource) — required

**You must create `$pluginId.$featureId.datasource.spec.ts` for every feature datasource.** Use `PluginDatasourceTestHarness.create({ pluginId, featureId, consumerIds, datasourceConfig })` and `harness.createDatasource($PluginId$FeatureNameDatasource, { componentId, execute: mockExecute })`. Mock `execute` and assert that the datasource calls it with the correct service definition, query, paramMap, or body. Do not load the real REST stack in tests; mock `@plugin-datasource-rest` (e.g. provide a stub `BaseRestDatasource` and `HttpMethods`).

---

## Checklist

- [ ] Base datasource in `common/$pluginId.base.datasource.ts` extending `BaseRestDatasource`; optional `composeHeaders` and path params export.
- [ ] Optional datasource config in `common/$pluginId.datasource.config.ts` extending `RestDatasourceConfiguration`.
- [ ] Feature datasource in `features/$featureId/$pluginId.$featureId.datasource.ts` with `serviceDefinitions` and methods calling `this.execute`.
- [ ] Schema types for query, result set, entity, body create/update in `features/$featureId/schema/$pluginId.$featureId.schema.ts`.
- [ ] Feature module extends `BasePluginModule` (from `@plugin/module`) — required for REST/GraphQL datasource plugins.
- [ ] Feature service and mapper use this datasource and map API responses to the feature model (see Plugin SKILL Datasource row).
- [ ] For every datasource file: corresponding `*.datasource.spec.ts` with harness and mocked execute.
- [ ] **Documentation (mandatory):** Create `features/$featureId/docs/index.md` with overview and required Mermaid diagrams (component + sequence including backend/API). Title must include " (Staging)" or " ($appId)" when in core-staging or app. Do not skip.