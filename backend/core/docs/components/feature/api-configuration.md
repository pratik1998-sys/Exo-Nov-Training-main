---
title: API Configuration
layout: default
---

# API Configuration (`*.api.configuration.ts`)

The **API configuration** file defines a class that extends `ApiConfiguration` and holds shared operation definitions (ids, descriptions, auth, and REST/GraphQL options). Controllers and resolvers reference these definitions so operation metadata is consistent and can be consumed by the [authorization guard](../guards.md) and OpenAPI/Swagger.

## Object definition

- **Base class**: Extend **`ApiConfiguration`** (import from `@api` or your project's API package path).
- **Operation map**: Define a static `operations` object whose keys are operation names and whose values are **`ApiOperationDefinition`**.
- **Helper methods**: Add static methods that call `this.composeOperationOptions(operations.operationName)` and return **`ApiOperationOptions`** for use in decorators.

## `ApiOperationDefinition` fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | **Required.** Operation identifier (used by the guard and OpenAPI). |
| `name` | string | Optional. GraphQL operation name; defaults to `id` when not set. |
| `description` | string | Optional. Human-readable description (REST summary/description, GraphQL description). |
| `summary` | string | Optional. Short summary (REST/OpenAPI). |
| `isAuthRequired` | boolean | Optional. Whether user auth is required for this operation. |
| `suppressAPIAccessControl` | boolean | Optional. If `true`, API-key (consumer) access control is skipped for this operation. |
| `scope` | string[] | Optional. Required user scopes (used with the authorization guard). |
| `restOptions` | object | Optional. REST/OpenAPI options for this operation (see below). |
| `queryOptions` | object | Optional. GraphQL query options. Extends NestJS [QueryOptions](https://docs.nestjs.com/graphql/resolvers#query-type-name) (e.g. `name`, `nullable`, `required`, `description`). |
| `mutationOptions` | object | Optional. GraphQL mutation options. Extends NestJS [MutationOptions](https://docs.nestjs.com/graphql/resolvers#mutation-type-name) (e.g. `name`, `nullable`, `required`, `description`). |

## `restOptions` (REST / OpenAPI)

These fields align with NestJS HTTP and Swagger decorators:

| Field | Type | Description |
|-------|------|-------------|
| `path` | string \| string[] | REST path(s) for the route. See NestJS [Controller routing](https://docs.nestjs.com/controllers#routing). |
| `apiOkResponseOptions` | object | **Required for REST.** Response type and metadata. Maps to [@ApiOkResponse](https://docs.nestjs.com/openapi/operations#response) (e.g. `type`, `description`). |
| `apiBodyOptions` | object | Optional. Request body type. Maps to [@ApiBody](https://docs.nestjs.com/openapi/operations#request-body) (e.g. `type`). Use for POST/PUT. |
| `apiParamOptions` | array | Optional. Path parameters. Each item maps to [@ApiParam](https://docs.nestjs.com/openapi/operations#parameters). |
| `apiQueryOptions` | array | Optional. Query parameters. Each item maps to [@ApiQuery](https://docs.nestjs.com/openapi/operations#parameters). |
| `tags` | string \| string[] | Optional. OpenAPI tags. Maps to [@ApiTags](https://docs.nestjs.com/openapi/operations#tags). |
| `isById` | boolean | Optional. If `true`, adds a single id path parameter (e.g. `:id`). |
| `idPathParameter` | Parameter | Optional. When `isById` is true, the parameter definition for the path (e.g. `{ id: 'id', description: '...' }`). |
| `doPagination` | boolean | Optional. Adds standard pagination query params. |
| `doSort` | boolean | Optional. Adds sort query params. |
| `doSearchTerm` | boolean | Optional. Adds search term query param. |

## Example

```typescript
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';
import { User, UserResultSet, UserInput, UserCreateInput } from '@feature-user';
import { UserRequestParameters } from '@feature-user';

export interface UserApiOperations {
  users: ApiOperationDefinition;
  user: ApiOperationDefinition;
  userCreate: ApiOperationDefinition;
  userUpdate: ApiOperationDefinition;
  userDelete: ApiOperationDefinition;
}

export class UserApiConfiguration extends ApiConfiguration {
  static operations: UserApiOperations = {
    users: {
      id: 'users',
      description: 'Get user result set',
      summary: 'Get user result set',
      isAuthRequired: true,
      restOptions: {
        apiOkResponseOptions: { type: UserResultSet },
        tags: ['user'],
      },
      queryOptions: {
        required: false,
      },
    },
    user: {
      id: 'user',
      description: 'Get user by identifier',
      summary: 'Get user by identifier',
      isAuthRequired: true,
      restOptions: {
        isById: true,
        idPathParameter: UserRequestParameters.identifier,
        apiOkResponseOptions: { type: User },
        tags: ['user'],
      },
      queryOptions: {
        required: false,
      },
    },
    userCreate: {
      id: 'userCreate',
      description: 'Create user',
      summary: 'Create user',
      isAuthRequired: false,
      restOptions: {
        apiOkResponseOptions: { type: User },
        apiBodyOptions: { type: UserCreateInput },
        tags: ['user'],
      },
      mutationOptions: {
        required: true,
      },
    },
    userUpdate: {
      id: 'userUpdate',
      description: 'Update user',
      summary: 'Update user',
      restOptions: {
        isById: true,
        path: `:${UserRequestParameters.identifier.id}`,
        apiOkResponseOptions: { type: User },
        apiBodyOptions: { type: UserInput },
        tags: ['user'],
      },
      mutationOptions: {
        required: true,
      },
    },
    userDelete: {
      id: 'userDelete',
      description: 'Delete user',
      summary: 'Delete user',
      restOptions: {
        isById: true,
        path: `:${UserRequestParameters.identifier.id}`,
        apiOkResponseOptions: { type: User },
        tags: ['user'],
      },
      mutationOptions: {
        required: true,
      },
    },
  };

  static users(): ApiOperationOptions {
    return this.composeOperationOptions(UserApiConfiguration.operations.users);
  }

  static user(): ApiOperationOptions {
    return this.composeOperationOptions(UserApiConfiguration.operations.user);
  }

  static userCreate(): ApiOperationOptions {
    return this.composeOperationOptions(UserApiConfiguration.operations.userCreate);
  }

  static userUpdate(): ApiOperationOptions {
    return this.composeOperationOptions(UserApiConfiguration.operations.userUpdate);
  }

  static userDelete(): ApiOperationOptions {
    return this.composeOperationOptions(UserApiConfiguration.operations.userDelete);
  }
}
```

## Related

- [API Decorators](api-decorators.md) — How to use API configuration values in decorators
- [Feature — Deep dive](feature.md) — Features include API configuration files
- [Authorization and Access Control](../../authorization-and-access-control.md) — How operation metadata is used by the guard
