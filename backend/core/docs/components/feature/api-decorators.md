---
title: API Decorators
layout: default
---

# API Decorators

CatalystJS provides **custom decorators** that have the **same names** as NestJS decorators (`Controller`, `Resolver`, `Get`, `Post`, `Put`, `Delete`, `Query`, `Mutation`, `Args`, `Field`, etc.) but add framework behavior (API metadata for the [authorization guard](../guards.md), unified REST + GraphQL options). You **must import these from the Catalyst API package** (e.g. `@api-decorators`), not from `@nestjs/common` or `@nestjs/graphql`. Using the NestJS decorators directly will omit metadata and break guard and OpenAPI behavior.

## Best practice: Using API configuration

The recommended pattern is to define operation metadata in an **[API configuration](api-configuration.md)** class (`*.api.configuration.ts`) and reference it in decorators. This ensures:

- **Single source of truth**: Operation `id`, `description`, `summary`, `isAuthRequired`, `suppressAPIAccessControl`, and `scope` are defined once and shared by both REST and GraphQL.
- **Consistency**: REST controllers and GraphQL resolvers for the same operation use the same metadata, so the authorization guard and OpenAPI docs are aligned.
- **Maintainability**: Changes to operation metadata (e.g. auth requirements, descriptions) happen in one place.

### How it works

1. **Define operations** in your API configuration class (e.g. `UserApiConfiguration`) with both `restOptions` and `queryOptions`/`mutationOptions`.
2. **Call helper methods** that return `ApiOperationOptions` (e.g. `UserApiConfiguration.users()`).
3. **Pass the appropriate options** to decorators:
   - REST decorators (`@Get`, `@Post`, etc.): Use `.restOptions`
   - GraphQL decorators (`@Query`, `@Mutation`): Use `.queryOptions` or `.mutationOptions`

### Example: REST controller

```typescript
import { Controller, Get, Post } from '@api-decorators';
import { UserApiConfiguration } from './user.api.configuration';
import { UserModule } from './user.module';

const feature = UserModule.feature;

@Controller({ tags: 'user', path: 'user', feature })
export class UserController {
  // Uses restOptions from API configuration
  @Get(UserApiConfiguration.users().restOptions, feature)
  async users() {
    // ...
  }

  // Uses restOptions from API configuration
  @Post(UserApiConfiguration.userCreate().restOptions, feature)
  async userCreate() {
    // ...
  }
}
```

### Example: GraphQL resolver

```typescript
import { Resolver, Query, Mutation } from '@api-decorators';
import { UserApiConfiguration } from './user.api.configuration';
import { UserModule } from './user.module';

const feature = UserModule.feature;

@Resolver((of) => User, { feature })
export class UserResolver {
  // Uses queryOptions from API configuration (same operation id, description, auth as REST)
  @Query(() => UserResultSet, UserApiConfiguration.users().queryOptions, feature)
  async users() {
    // ...
  }

  // Uses mutationOptions from API configuration
  @Mutation(() => User, UserApiConfiguration.userCreate().mutationOptions, feature)
  async userCreate() {
    // ...
  }
}
```

Both REST and GraphQL operations share the same `id`, `description`, `isAuthRequired`, and `scope` from the API configuration, ensuring consistent behavior across APIs.

## Class decorators

| Decorator | Parameters | Purpose |
|-----------|------------|---------|
| **Controller** | `options: ControllerOptions` | Marks the class as a REST controller. Options extend NestJS [ControllerOptions](https://docs.nestjs.com/controllers#routing) and add `tags` (OpenAPI) and `feature` (API id for the guard). |
| **Resolver** | `typeFunc`, `options: ResolverOptions` | Marks the class as a GraphQL resolver. Options extend NestJS [ResolverOptions](https://docs.nestjs.com/graphql/resolvers); add `feature` for the guard. |

### ControllerOptions

- Extends NestJS `ControllerOptions` (see [NestJS Controller routing](https://docs.nestjs.com/controllers#routing))
- Additional fields:
  - `tags: string | string[]` — OpenAPI tags
  - `feature?: FeatureModuleData` — Feature module data (for guard)

### ResolverOptions

- Extends NestJS `ResolverOptions` (see [NestJS Resolvers](https://docs.nestjs.com/graphql/resolvers))
- Additional fields:
  - `feature?: FeatureModuleData` — Feature module data (for guard)

## REST method decorators

| Decorator | Parameters | Purpose |
|-----------|------------|---------|
| **Get** | `options: RestGetAPIOptions`, `feature?` | GET handler. Options include `path`, `apiOkResponseOptions`, `isById`, `apiBodyOptions`, `apiParamOptions`, `apiQueryOptions`, `tags`, plus guard fields: `isAuthRequired`, `suppressAPIAccessControl`, `scope`. |
| **Post** | `options: RestPostPutAPIOptions`, `feature?` | POST handler. Options include `path`, `apiOkResponseOptions`, `apiBodyOptions`, `apiParamOptions`, `apiQueryOptions`, `tags`, and guard fields. |
| **Put** | `options: RestPostPutAPIOptions`, `feature?` | PUT handler. Same shape as Post; typically used with `isById` and path/body params. |
| **Delete** | `options: RestAPIOptions`, `feature?` | DELETE handler. Same options shape (path, response, params, tags, guard fields). |

### RestGetAPIOptions / RestPostPutAPIOptions

Extends `RestAPIOptions`:

- **Guard fields** (from `ApiOperationBaseOptions`):
  - `id?: string` — Operation identifier
  - `isAuthRequired?: boolean` — Whether user auth is required
  - `suppressAPIAccessControl?: boolean` — Skip API-key access control
  - `scope?: string[]` — Required user scopes
- **REST/OpenAPI fields**:
  - `path?: string | string[]` — Route path(s)
  - `summary?: string` — OpenAPI summary
  - `description?: string` — OpenAPI description
  - `apiOkResponseOptions` — Response type (maps to [@ApiOkResponse](https://docs.nestjs.com/openapi/operations#response))
  - `apiBodyOptions?` — Request body type (maps to [@ApiBody](https://docs.nestjs.com/openapi/operations#request-body))
  - `apiParamOptions?` — Path parameters (maps to [@ApiParam](https://docs.nestjs.com/openapi/operations#parameters))
  - `apiQueryOptions?` — Query parameters (maps to [@ApiQuery](https://docs.nestjs.com/openapi/operations#parameters))
  - `tags?: string | string[]` — OpenAPI tags
- **RestGetAPIOptions only**:
  - `isById?: boolean` — Add id path parameter
  - `doPagination?: boolean` — Add pagination query params
  - `doSort?: boolean` — Add sort query params
  - `doSearchTerm?: boolean` — Add search term query param

## GraphQL method decorators

| Decorator | Parameters | Purpose |
|-----------|------------|---------|
| **Query** | `typeFunction`, `options: QueryOptions`, `feature?` | GraphQL query. Options extend NestJS [QueryOptions](https://docs.nestjs.com/graphql/resolvers#query-type-name); add `isAuthRequired`, `suppressAPIAccessControl`, `scope`. |
| **Mutation** | `typeFunction`, `options: MutationOptions`, `feature?` | GraphQL mutation. Options extend NestJS [MutationOptions](https://docs.nestjs.com/graphql/resolvers#mutation-type-name); add guard fields. |

### QueryOptions / MutationOptions

Extends NestJS `QueryOptions` / `MutationOptions` (see [NestJS GraphQL Resolvers](https://docs.nestjs.com/graphql/resolvers#query-type-name)):

- **NestJS fields**: `name`, `nullable`, `required`, `description`, `deprecationReason`
- **Guard fields** (from `ApiOperationBaseOptions`):
  - `id?: string` — Operation identifier
  - `isAuthRequired?: boolean` — Whether user auth is required
  - `suppressAPIAccessControl?: boolean` — Skip API-key access control
  - `scope?: string[]` — Required user scopes

## Parameter decorators

| Decorator | Parameters | Purpose |
|-----------|------------|---------|
| **Args** | `options: ArgsOptions`, `...pipes` | GraphQL argument. Options extend NestJS [ArgsOptions](https://docs.nestjs.com/graphql/resolvers#passing-arguments); include `parameter: { id, description }` for consistent docs and guard. |
| **ApiQuery** | `options: ApiQueryOptions` | REST query parameter. Wraps [@ApiQuery](https://docs.nestjs.com/openapi/operations#parameters); options include `parameter: { id, description }`. |
| **ApiParam** | `options: ApiParamOptions` | REST path parameter. Wraps [@ApiParam](https://docs.nestjs.com/openapi/operations#parameters); options include `parameter: { id, description }`. |

### ArgsOptions

Extends NestJS `ArgsOptions` (see [NestJS Passing Arguments](https://docs.nestjs.com/graphql/resolvers#passing-arguments)):

- **NestJS fields**: `name`, `type`, `nullable`, `description`, `defaultValue`
- **Additional**: `parameter: { id: string, description: string }` — Parameter definition for consistent documentation

### ApiQueryOptions / ApiParamOptions

Extends NestJS `ApiQueryOptions` / `ApiParamOptions` (see [NestJS OpenAPI Parameters](https://docs.nestjs.com/openapi/operations#parameters)):

- **NestJS fields**: `name`, `type`, `required`, `description`, `enum`, etc.
- **Additional**: `parameter: { id: string, description: string }` — Parameter definition for consistent documentation

## Model / property decorator

| Decorator | Parameters | Purpose |
|-----------|------------|---------|
| **Field** | `options: PropertyOptions`, `propertyType?` | Defines a property for both GraphQL and OpenAPI. Applies NestJS [Field](https://docs.nestjs.com/graphql/resolvers-map#code-first) and [ApiProperty](https://docs.nestjs.com/openapi/types-and-parameters). Options: `description`, `required`, `defaultValue`, `type`, and optional `rest` / `graphql` overrides. Use **FieldType** (e.g. `FieldType.integer`, `FieldType.id`) for shared REST/GraphQL type mapping. |

### PropertyOptions

- `description: string` — Property description (used for both REST and GraphQL)
- `required?: boolean` — Whether the field is required
- `defaultValue?: any` — Default value
- `type?: Function | ReturnTypeFunc` — Type (used for both REST and GraphQL if not overridden)
- `rest?: ApiPropertyOptions` — Optional REST/OpenAPI-specific overrides (maps to [@ApiProperty](https://docs.nestjs.com/openapi/types-and-parameters))
- `graphql?: FieldOptions` — Optional GraphQL-specific overrides (maps to [@Field](https://docs.nestjs.com/graphql/resolvers-map#code-first))

### FieldType

Predefined type mappings for common REST/GraphQL type differences:

- `FieldType.integer` — REST: `"integer"`, GraphQL: `Int`
- `FieldType.integerArray` — REST: `["integer"]`, GraphQL: `[Int]`
- `FieldType.float` — REST: `"number"`, GraphQL: `Float`
- `FieldType.floatArray` — REST: `["number"]`, GraphQL: `[Float]`
- `FieldType.json` — REST: `Object`, GraphQL: `GraphQLJSON`
- `FieldType.id` — REST: `String`, GraphQL: `ID`

Example:

```typescript
import { Field, FieldType } from '@api-decorators';

export class User {
  @Field({ description: 'User identifier' }, FieldType.id)
  id: string;

  @Field({ description: 'User age' }, FieldType.integer)
  age: number;
}
```

## Import example

```typescript
// Correct: use Catalyst decorators
import { Controller, Get, Post, Resolver, Query, Mutation, Args, Field, FieldType } from '@api-decorators';
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';

// Wrong: do not use NestJS decorators for API classes
// import { Controller, Get } from '@nestjs/common';
// import { Query, Resolver } from '@nestjs/graphql';
```

## Related

- [API Configuration](api-configuration.md) — Define operation metadata shared by REST and GraphQL
- [Feature — Deep dive](feature.md) — Features use decorators in controllers and resolvers
- [Authorization and Access Control](../../authorization-and-access-control.md) — How decorator metadata is used by the guard
