---
title: Shopping list feature (Staging)
layout: default
---

# Shopping list feature (Staging)

## Overview

The **shopping-list** feature models a cart-like container for commerce **without** quote/cart concerns: **no line or container pricing, taxes, promotions, coupons, payments, or shipping**. It supports named lists, line quantities, optional product identifiers, variant option keys, and notes. List reads can filter and paginate lines using the same `ItemFilterInput` / `PaginationInput` / `SortByInput` pattern as cart.

The **Commercetools** plugin provides an in-memory `CommercetoolsShoppingListServiceImpl` stub (per consumer and anonymous token purse key) until a real Shopping Lists API integration is added.

## Controller operations

Base path: `/shopping-list`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/:id` | Get a list; use `current` or omit path semantics per deployment for the session list |
| PUT | `/:id` | Update list metadata (`name`, `identifier`) |
| DELETE | `/:id` | Remove the list from the stub store |
| POST | `/:id/item` | Add one line |
| POST | `/:id/items` | Add multiple lines (body `items`) |
| PUT | `/:id/item/:itemId` | Update one line |
| PUT | `/:id/items` | Update multiple lines |
| DELETE | `/:id/item/:itemId` | Delete one line |
| PUT | `/:id/items/@delete` | Delete multiple lines (body `items`) |

Query parameters for read/update line operations follow `QuoteResultSetQuery` (filter, pagination, sort) like cart.

## GraphQL API

| Operation | Type | Arguments | Returns |
|-----------|------|-----------|---------|
| `shoppingList` | Query | `id`, `filter`, `pagination`, `sortBy` | `ShoppingList` |
| `shoppingListUpdate` | Mutation | `id`, `updateShoppingList`, `filter`, `pagination`, `sortBy` | `ShoppingList` |
| `shoppingListDelete` | Mutation | `id` | `ShoppingList` |
| `shoppingListItemsAdd` | Mutation | `id`, `items`, `filter`, `pagination`, `sortBy` | `ShoppingList` |
| `shoppingListItemsUpdate` | Mutation | `id`, `items`, `filter`, `pagination`, `sortBy` | `ShoppingList` |
| `shoppingListItemsDelete` | Mutation | `id`, `items`, `filter`, `pagination`, `sortBy` | `ShoppingList` |

## Schema (model)

- **`ShoppingList`**: `id`, `identifier`, `name`, `itemQuantity`, `status`, `createdOn`, `updatedOn`, `items` (`ShoppingListItemResultSet`). No pricing, coupons, payments, or shipping fields.
- **`ShoppingListItem`**: `id`, `identifier`, `quantity`, `notes`, `status`, `options` (`ItemOption[]`). No `Money`, adjustments, or taxes.
- **Inputs**: `ShoppingListUpdateInput`, `ShoppingListItemAddInput`, `ShoppingListItemUpdateInput`, `ShoppingListItemDeleteInput`, plus batch body types for REST.

## Service interface contract (plugin contract)

Abstract **`ShoppingListService`** (`shopping-list.service.ts`):

- `getShoppingList(id, filter, pagination, sortBy, requestContext, context?)`
- `deleteShoppingList(id, requestContext, context?)`
- `updateShoppingList(id, updateInput, filter, pagination, sortBy, requestContext, context?)`
- `addShoppingListItems(id, items, filter, pagination, sortBy, requestContext, context?)`
- `updateShoppingListItems(id, items, filter, pagination, sortBy, requestContext, context?)`
- `deleteShoppingListItems(id, items, filter, pagination, sortBy, requestContext, context?)`

Errors: **`ShoppingListErrors`** — `getShoppingListFailed`, `deleteShoppingListFailed`, `updateShoppingListFailed`, `missingShoppingListId`, `addShoppingListItemsFailed`, `updateShoppingListItemsFailed`, `deleteShoppingListItemsFailed` (plus shared commerce errors).

## Diagrams

### Component diagram

```mermaid
flowchart TD
  ClientREST[REST Client]
  ClientGQL[GraphQL Client]
  Controller[ShoppingListController]
  Resolver[ShoppingListResolver]
  ApiConfig[ShoppingListApiConfiguration]
  Params[ShoppingListRequestParameters]
  Service[ShoppingListService]
  Plugin[CommercetoolsShoppingListServiceImpl]
  ClientREST --> Controller
  ClientGQL --> Resolver
  Controller --> Service
  Resolver --> Service
  Controller --> ApiConfig
  Resolver --> ApiConfig
  Controller --> Params
  Resolver --> Params
  Service --> Plugin
```

### Sequence: GET shopping list (REST)

```mermaid
sequenceDiagram
  participant RESTClient as REST Client
  participant Controller as ShoppingListController
  participant Service as ShoppingListService
  RESTClient->>Controller: GET /shopping-list/:id
  Controller->>Service: getShoppingList
  Service-->>Controller: ShoppingList
  Controller-->>RESTClient: ShoppingList
```

### Sequence: PUT shopping list update (REST)

```mermaid
sequenceDiagram
  participant RESTClient as REST Client
  participant Controller as ShoppingListController
  participant Service as ShoppingListService
  RESTClient->>Controller: PUT /shopping-list/:id
  Controller->>Service: updateShoppingList
  Service-->>Controller: ShoppingList
  Controller-->>RESTClient: ShoppingList
```

### Sequence: DELETE shopping list (REST)

```mermaid
sequenceDiagram
  participant RESTClient as REST Client
  participant Controller as ShoppingListController
  participant Service as ShoppingListService
  RESTClient->>Controller: DELETE /shopping-list/:id
  Controller->>Service: deleteShoppingList
  Service-->>Controller: ShoppingList
  Controller-->>RESTClient: ShoppingList
```

### Sequence: POST shopping list item (REST)

```mermaid
sequenceDiagram
  participant RESTClient as REST Client
  participant Controller as ShoppingListController
  participant Service as ShoppingListService
  RESTClient->>Controller: POST /shopping-list/:id/item
  Controller->>Service: addShoppingListItems
  Service-->>Controller: ShoppingList
  Controller-->>RESTClient: ShoppingList
```

### Sequence: POST shopping list items (REST)

```mermaid
sequenceDiagram
  participant RESTClient as REST Client
  participant Controller as ShoppingListController
  participant Service as ShoppingListService
  RESTClient->>Controller: POST /shopping-list/:id/items
  Controller->>Service: addShoppingListItems
  Service-->>Controller: ShoppingList
  Controller-->>RESTClient: ShoppingList
```

### Sequence: PUT shopping list item (REST)

```mermaid
sequenceDiagram
  participant RESTClient as REST Client
  participant Controller as ShoppingListController
  participant Service as ShoppingListService
  RESTClient->>Controller: PUT /shopping-list/:id/item/:itemId
  Controller->>Service: updateShoppingListItems
  Service-->>Controller: ShoppingList
  Controller-->>RESTClient: ShoppingList
```

### Sequence: PUT shopping list items (REST)

```mermaid
sequenceDiagram
  participant RESTClient as REST Client
  participant Controller as ShoppingListController
  participant Service as ShoppingListService
  RESTClient->>Controller: PUT /shopping-list/:id/items
  Controller->>Service: updateShoppingListItems
  Service-->>Controller: ShoppingList
  Controller-->>RESTClient: ShoppingList
```

### Sequence: DELETE shopping list item (REST)

```mermaid
sequenceDiagram
  participant RESTClient as REST Client
  participant Controller as ShoppingListController
  participant Service as ShoppingListService
  RESTClient->>Controller: DELETE /shopping-list/:id/item/:itemId
  Controller->>Service: deleteShoppingListItems
  Service-->>Controller: ShoppingList
  Controller-->>RESTClient: ShoppingList
```

### Sequence: PUT shopping list items delete (REST)

```mermaid
sequenceDiagram
  participant RESTClient as REST Client
  participant Controller as ShoppingListController
  participant Service as ShoppingListService
  RESTClient->>Controller: PUT /shopping-list/:id/items/@delete
  Controller->>Service: deleteShoppingListItems
  Service-->>Controller: ShoppingList
  Controller-->>RESTClient: ShoppingList
```

### Sequence: Query shoppingList (GraphQL)

```mermaid
sequenceDiagram
  participant GQLClient as GraphQL Client
  participant Resolver as ShoppingListResolver
  participant Service as ShoppingListService
  GQLClient->>Resolver: shoppingList
  Resolver->>Service: getShoppingList
  Service-->>Resolver: ShoppingList
  Resolver-->>GQLClient: ShoppingList
```

### Sequence: Mutation shoppingListUpdate (GraphQL)

```mermaid
sequenceDiagram
  participant GQLClient as GraphQL Client
  participant Resolver as ShoppingListResolver
  participant Service as ShoppingListService
  GQLClient->>Resolver: shoppingListUpdate
  Resolver->>Service: updateShoppingList
  Service-->>Resolver: ShoppingList
  Resolver-->>GQLClient: ShoppingList
```

### Sequence: Mutation shoppingListDelete (GraphQL)

```mermaid
sequenceDiagram
  participant GQLClient as GraphQL Client
  participant Resolver as ShoppingListResolver
  participant Service as ShoppingListService
  GQLClient->>Resolver: shoppingListDelete
  Resolver->>Service: deleteShoppingList
  Service-->>Resolver: ShoppingList
  Resolver-->>GQLClient: ShoppingList
```

### Sequence: Mutation shoppingListItemsAdd (GraphQL)

```mermaid
sequenceDiagram
  participant GQLClient as GraphQL Client
  participant Resolver as ShoppingListResolver
  participant Service as ShoppingListService
  GQLClient->>Resolver: shoppingListItemsAdd
  Resolver->>Service: addShoppingListItems
  Service-->>Resolver: ShoppingList
  Resolver-->>GQLClient: ShoppingList
```

### Sequence: Mutation shoppingListItemsUpdate (GraphQL)

```mermaid
sequenceDiagram
  participant GQLClient as GraphQL Client
  participant Resolver as ShoppingListResolver
  participant Service as ShoppingListService
  GQLClient->>Resolver: shoppingListItemsUpdate
  Resolver->>Service: updateShoppingListItems
  Service-->>Resolver: ShoppingList
  Resolver-->>GQLClient: ShoppingList
```

### Sequence: Mutation shoppingListItemsDelete (GraphQL)

```mermaid
sequenceDiagram
  participant GQLClient as GraphQL Client
  participant Resolver as ShoppingListResolver
  participant Service as ShoppingListService
  GQLClient->>Resolver: shoppingListItemsDelete
  Resolver->>Service: deleteShoppingListItems
  Service-->>Resolver: ShoppingList
  Resolver-->>GQLClient: ShoppingList
```
