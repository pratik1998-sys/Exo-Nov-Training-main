# Feature Extension

Extend a core feature in an app without changing core. Extension files live under **`src/apps/$appId/features/$featureId/`** with the **same path and file names** as core. Use the **`Ext`** prefix for extension types.

## Do not reference project code

**Do not reference project code.** Use only the templates in this file and in the Feature SKILL. All names and method signatures are derived from the user prompt and the **same naming convention** as the base feature (see Feature SKILL "Deriving specific code from the user prompt"). If the base feature uses plural-resource naming (e.g. `users()`, `user()`, `userCreate()`, `getUsers`, `getUser`), the extension must use those exact getter and service method names; only the **return types** and **response types** become Ext types (e.g. `ExtUser`, `ExtUserResultSet`). If the base uses generic naming (`items()`, `item()`, `getItems`, `getItem`), use that. The extension overrides only the API configuration getters to set the Ext type on the options; resolver and controller method names and service calls stay identical to the base.

## Placeholders (derive from user prompt)

Replace placeholders using the same derivation as the Feature SKILL:

- `$appId` — application id from user prompt (e.g. "catalyst-cerebrum" → `catalyst-cerebrum`)
- `$featureId` — feature id (e.g. `user`, `pet`)
- `$FeatureName` — PascalCase singular (e.g. `User`, `Pet`)
- `$Feature` — base model type from core (same as `$FeatureName`)
- **Getter and service method names** — must match the base feature: either generic (`items`, `item`, `itemCreate`, …) or plural-resource (`users`, `user`, `userCreate`, …) per Feature SKILL derivation.

---

## 1. Extension model (`$featureId-ext.model.ts`)

Add an **Ext** type that extends the base feature model, an **Ext** result set, and optionally **Ext** input for updates. Put shared types (e.g. `Image`) from `@feature-shared-models` or the base feature as needed.

```ts
import { ObjectType, InputType } from '@nestjs/graphql';
import { Field } from '@api-decorators';
import { Image } from '@feature-shared-models';
import { ResultSet } from '@feature/models';
import { $Feature, $FeatureInput } from '@feature-$featureId';

@InputType({ description: 'Ext $Feature input for update' })
export class Ext$FeatureNameInput extends $FeatureInput {
    @Field({ type: () => Image, required: false, description: 'Thumbnail image' })
    thumbnail?: Image;

    @Field({ type: () => Image, required: false, description: 'Profile image' })
    image?: Image;

    @Field({ required: false, description: 'Last logon timestamp' })
    lastLogon?: string;

    @Field({ required: false, description: 'Custom string field' })
    field1?: string;

    @Field({ type: () => Number, required: false, description: 'Custom integer field' })
    field2?: number;

    @Field({ type: () => Boolean, required: false, description: 'Custom boolean field' })
    field3?: boolean;
}

@ObjectType({ description: 'Ext $Feature with profile and custom fields' })
export class Ext$FeatureName extends $Feature {
    @Field({ type: () => Image, required: false, description: 'Thumbnail image' })
    thumbnail?: Image;

    @Field({ type: () => Image, required: false, description: 'Profile image' })
    image?: Image;

    @Field({ required: false, description: 'Last logon timestamp' })
    lastLogon?: string;

    @Field({ required: false, description: 'Custom string field' })
    field1?: string;

    @Field({ type: () => Number, required: false, description: 'Custom integer field' })
    field2?: number;

    @Field({ type: () => Boolean, required: false, description: 'Custom boolean field' })
    field3?: boolean;
}

@ObjectType({ description: 'Ext $Feature Result Set' })
export class Ext$FeatureNameResultSet extends ResultSet<Ext$FeatureName> {
    @Field({ type: () => [Ext$FeatureName], required: false, description: 'results' })
    results?: Ext$FeatureName[];
}
```

---

## 2. API configuration extension (`$featureId.api.configuration.ts`)

Extend the base API configuration from the feature. **Override only the getter methods** for operations that should return the Ext type. In each overridden getter: call `super.method()`, set the extension type on the returned options (e.g. `restOptions.apiOkResponseOptions.type`), then return the object. Do **not** put Ext types on the base `operations` in core.

```ts
import { ApiOperationOptions } from '@api';
import { $FeatureNameApiConfiguration as Base$FeatureNameApiConfiguration } from '@feature-$featureId';
import { Ext$FeatureName, Ext$FeatureNameResultSet } from './$featureId-ext.model';

export class $FeatureNameApiConfiguration extends Base$FeatureNameApiConfiguration {
    static override items(): ApiOperationOptions {
        const options = super.items();
        if (options.restOptions) {
            options.restOptions = {
                ...options.restOptions,
                apiOkResponseOptions: {
                    ...options.restOptions.apiOkResponseOptions,
                    type: Ext$FeatureNameResultSet,
                },
            };
        }
        return options;
    }

    static override item(): ApiOperationOptions {
        const options = super.item();
        if (options.restOptions) {
            options.restOptions = {
                ...options.restOptions,
                apiOkResponseOptions: {
                    ...options.restOptions.apiOkResponseOptions,
                    type: Ext$FeatureName,
                },
            };
        }
        return options;
    }

    static override itemUpdate(): ApiOperationOptions {
        const options = super.itemUpdate();
        if (options.restOptions) {
            options.restOptions = {
                ...options.restOptions,
                apiOkResponseOptions: {
                    ...options.restOptions.apiOkResponseOptions,
                    type: Ext$FeatureName,
                },
            };
        }
        return options;
    }

    static override itemDelete(): ApiOperationOptions {
        const options = super.itemDelete();
        if (options.restOptions) {
            options.restOptions = {
                ...options.restOptions,
                apiOkResponseOptions: {
                    ...options.restOptions.apiOkResponseOptions,
                    type: Ext$FeatureName,
                },
            };
        }
        return options;
    }
}
```

(Keep `itemCreate()` or `$featureNameCreate()` returning the base create type unless you explicitly extend it.) **If the base feature uses plural-resource naming, override `$featureNamePlural()`, `$featureName()`, `$featureNameUpdate()`, `$featureNameDelete()` instead of items/item/… and use the same names in the resolver and controller methods and service calls.**

---

## 3. Resolver extension (`$featureId.resolver.ts`)

Import the **app's** API configuration (the extended class) and Ext types from the same app directory. Use `Ext$FeatureName` and `Ext$FeatureNameResultSet` for return types and for the resolver `@Resolver((of) => Ext$FeatureName, { feature })`. Use base types from `@feature-$featureId` for inputs and for the service call; cast list/single responses to Ext types. **Method names and parameter references must match the base feature:** use `users`, `user`, `userCreate`, `userUpdate`, `userDelete` (and `UserRequestParameters.user`, `service.getUsers`, `service.getUser`, etc.) when the base uses plural-resource naming, or `items`, `item`, `itemCreate`, … when the base uses generic naming. Substitute from the derivation rules; do not reference project code.

```ts
import { Context } from '@nestjs/graphql';
import { $FeatureNameCreate, $FeatureNameCreateInput, $FeatureNameFilterInput, $FeatureNameInput, $FeatureNameModule, $FeatureNameRequestParameters, $FeatureNameService } from '@feature-$featureId';
import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput } from '@feature/models';
import { $FeatureNameApiConfiguration } from './$featureId.api.configuration';
import { Ext$FeatureName, Ext$FeatureNameResultSet } from './$featureId-ext.model';

const feature = $FeatureNameModule.feature;

@Resolver((of) => Ext$FeatureName, { feature })
export class $FeatureNameResolver extends BaseFeatureResolver {
    @Query(() => Ext$FeatureNameResultSet, $FeatureNameApiConfiguration.items().queryOptions, feature)
    async items(
        @Args({ parameter: $FeatureNameRequestParameters.filter, type: () => $FeatureNameFilterInput, required: false })
        filter: $FeatureNameFilterInput,
        @Args({ parameter: $FeatureNameRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context() context: any,
    ): Promise<Ext$FeatureNameResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService);
        return (await service.getItems(filter, pagination, requestContext, context)) as Ext$FeatureNameResultSet;
    }

    @Query(() => Ext$FeatureName, $FeatureNameApiConfiguration.item().queryOptions, feature)
    async item(
        @Args({ parameter: $FeatureNameRequestParameters.id, required: false }) id: string,
        @Context() context: any,
    ): Promise<Ext$FeatureName> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService);
        return (await service.getItem(id, requestContext, context)) as Ext$FeatureName;
    }

    @Mutation(() => $FeatureNameCreate, $FeatureNameApiConfiguration.itemCreate().queryOptions, feature)
    async itemCreate(
        @Args({ parameter: $FeatureNameRequestParameters.item, type: () => $FeatureNameCreateInput, required: true })
        input: $FeatureNameCreateInput,
        @Context() context: any,
    ): Promise<$FeatureNameCreate> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService);
        return await service.createItem(input, requestContext, context);
    }

    @Mutation(() => Ext$FeatureName, $FeatureNameApiConfiguration.itemUpdate().queryOptions, feature)
    async itemUpdate(
        @Args({ parameter: $FeatureNameRequestParameters.id, required: false }) id: string,
        @Args({ parameter: $FeatureNameRequestParameters.item, type: () => $FeatureNameInput, required: true })
        input: $FeatureNameInput,
        @Context() context: any,
    ): Promise<Ext$FeatureName> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService);
        return (await service.updateItem(id, input, requestContext, context)) as Ext$FeatureName;
    }

    @Mutation(() => Ext$FeatureName, $FeatureNameApiConfiguration.itemDelete().queryOptions, feature)
    async itemDelete(
        @Args({ parameter: $FeatureNameRequestParameters.id, required: true }) id: string,
        @Context() context: any,
    ): Promise<Ext$FeatureName> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(context, $FeatureNameService);
        return (await service.deleteItem(id, requestContext, context)) as Ext$FeatureName;
    }
}
```

---

## 4. Controller extension (`$featureId.controller.ts`)

Same idea: import the app's `$FeatureNameApiConfiguration` and Ext types. Use Ext types for return types of GET list, GET single, PUT, DELETE; use base create type for POST create. Build filter from query and call the same service methods.

```ts
import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { $FeatureNameCreate, $FeatureNameFilterInput, $FeatureNameInput, $FeatureNameModule, $FeatureNameRequestParameters, $FeatureNameResultSetQuery, $FeatureNameService } from '@feature-$featureId';
import { Body, Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { ResultSetQueryType } from '@feature/controller/types';
import { $FeatureNameApiConfiguration } from './$featureId.api.configuration';
import { Ext$FeatureName, Ext$FeatureNameResultSet } from './$featureId-ext.model';

const paths = { root: '$featureId' };
const feature = $FeatureNameModule.feature;

@Controller({ tags: '$featureId', path: paths.root, feature })
export class $FeatureNameController extends BaseFeatureController {
    @Get($FeatureNameApiConfiguration.items().restOptions, feature)
    async items(@Req() request: FastifyRequest, @Query() query: $FeatureNameResultSetQuery): Promise<Ext$FeatureNameResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(request, $FeatureNameService);
        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);
        const filter: $FeatureNameFilterInput = {
            identifiers: query.identifiers
                ? (Array.isArray(query.identifiers) ? query.identifiers : [query.identifiers])
                : undefined,
        };
        return (await service.getItems(filter, resultSetQuery.pagination, requestContext, request)) as Ext$FeatureNameResultSet;
    }

    @Get($FeatureNameApiConfiguration.item().restOptions, feature)
    async item(
        @Param($FeatureNameRequestParameters.identifier.id) identifier: string,
        @Req() request: FastifyRequest,
    ): Promise<Ext$FeatureName> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(request, $FeatureNameService);
        if (identifier === '@current') identifier = null;
        return (await service.getItem(identifier, requestContext, request)) as Ext$FeatureName;
    }

    @Post($FeatureNameApiConfiguration.itemCreate().restOptions, feature)
    async itemCreate(@Body() input: $FeatureNameInput, @Req() request: FastifyRequest): Promise<$FeatureNameCreate> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(request, $FeatureNameService);
        return await service.createItem(input, requestContext, request);
    }

    @Put($FeatureNameApiConfiguration.itemUpdate().restOptions, feature)
    async itemUpdate(
        @Param($FeatureNameRequestParameters.identifier.id) identifier: string,
        @Body() input: $FeatureNameInput,
        @Req() request: FastifyRequest,
    ): Promise<Ext$FeatureName> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(request, $FeatureNameService);
        return (await service.updateItem(identifier, input, requestContext, request)) as Ext$FeatureName;
    }

    @Delete($FeatureNameApiConfiguration.itemDelete().restOptions, feature)
    async itemDelete(
        @Param($FeatureNameRequestParameters.identifier.id) identifier: string,
        @Req() request: FastifyRequest,
    ): Promise<Ext$FeatureName> {
        const { requestContext, service } = this.getRequestContextAndService<$FeatureNameService>(request, $FeatureNameService);
        return (await service.deleteItem(identifier, requestContext, request)) as Ext$FeatureName;
    }
}
```

---

## Checklist

- [ ] Extension files are under `src/apps/$appId/features/$featureId/` with the **same path and file names** as core.
- [ ] Extension class names use the **`Ext`** prefix (e.g. `Ext$FeatureName`, `Ext$FeatureNameResultSet`).
- [ ] API configuration extension **overrides getter methods**, sets the extension type on the composed options object, and returns it.
- [ ] Resolver and controller import the app's API configuration and Ext types from the same app directory.
- [ ] For every **resolver** and **controller** file created or extended: a corresponding **`*.spec.ts`** file exists (e.g. `$featureId.resolver.spec.ts`, `$featureId.controller.spec.ts`) per the Feature SKILL Testing section. Use `FeatureResolverTestHarness` and the project's controller test harness; mock the feature service and assert behavior.
- [ ] For every **plugin extension** (service, datasource, or mapper) created in the app: a valid **`*.spec.ts`** file exists in the same directory, using the appropriate harness (`PluginServiceTestHarness`, `PluginDatasourceTestHarness`, or `PluginMapperTestHarness`) and mocks; tests pass. See [Extension SKILL §7 (Extension testing)](../extension/SKILL.md).
- [ ] Core feature code is **unchanged**.
