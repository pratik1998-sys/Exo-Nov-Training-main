---
title: adobe-aem article plugin feature
layout: default
---

# adobe-aem article plugin feature

## Overview
This plugin feature implements the `article` feature contract using an AEM-backed REST datasource.
It fetches articles (including buying guides) via AEM GraphQL persisted operations exposed at `/graphql/execute.json/*`.

## Backend integration
- Services integrated: AEM GraphQL `execute.json` endpoint (invoked over HTTP REST calls)
- Supported operations:
  - `BuyingGuidePaginated` (list)
  - `BuyingGuideByPath` (single by content fragment path)
- Configuration:
  - Uses the existing `adobe-aem` plugin consumer configuration for:
    - authentication (Basic Auth / IMS token)
    - GraphQL base path (`graphqlPath_Commons`)
- Authentication / headers:
  - Authorization header is injected by the shared `adobe-aem` base datasource.

## Diagrams

### Component diagram
```mermaid
flowchart TD
    Client --> Controller
    Client --> Resolver
    Controller --> Service
    Resolver --> Service
    Service --> Mapper
    Mapper --> Datasource
    Controller --> RequestContext
    Resolver --> RequestContext
```

### Sequence diagrams

#### Sequence: GET list (`articles`) - REST
```mermaid
sequenceDiagram
    participant RESTClient as "REST Client"
    participant ArticleController as "ArticleController"
    participant ArticleService as "ArticleService"
    participant ArticleMapper as "ArticleMapper"
    participant ArticleDatasource as "ArticleDatasource"
    participant AEMExecute as "AEM GraphQL execute.json"

    RESTClient->>ArticleController: GET /article
    ArticleController->>ArticleService: getArticles(filter, pagination, requestContext)
    ArticleService->>ArticleDatasource: getBuyingGuides(requestContext, type)
    ArticleDatasource->>AEMExecute: POST {graphqlPath}/BuyingGuidePaginated (variables: _path={rootCFPath}/buying_guides)
    AEMExecute-->>ArticleDatasource: buyingGuideList.items
    ArticleDatasource-->>ArticleMapper: items
    ArticleMapper-->>ArticleService: ArticleResultSet
    ArticleService-->>ArticleController: ArticleResultSet
    ArticleController-->>RESTClient: 200 OK
```

#### Sequence: GET by id (`article`) - REST
```mermaid
sequenceDiagram
    participant RESTClient as "REST Client"
    participant ArticleController as "ArticleController"
    participant ArticleService as "ArticleService"
    participant ArticleMapper as "ArticleMapper"
    participant ArticleDatasource as "ArticleDatasource"
    participant AEMExecute as "AEM GraphQL execute.json"

    RESTClient->>ArticleController: GET /article/:id
    ArticleController->>ArticleService: getArticle(id, requestContext)
    ArticleService->>ArticleDatasource: getBuyingGuideByPath(requestContext, id)
    ArticleDatasource->>AEMExecute: POST {graphqlPath}/BuyingGuideByPath (variables: _path={rootCFPath}/buying_guides/:id)
    AEMExecute-->>ArticleDatasource: buyingGuideByPath.item
    ArticleDatasource-->>ArticleMapper: item
    ArticleMapper-->>ArticleService: Article
    ArticleService-->>ArticleController: Article
    ArticleController-->>RESTClient: 200 OK
```

#### Sequence: Query list (`articles`) - GraphQL
```mermaid
sequenceDiagram
    participant GraphQLClient as "GraphQL Client"
    participant ArticleResolver as "ArticleResolver"
    participant ArticleService as "ArticleService"
    participant ArticleMapper as "ArticleMapper"
    participant ArticleDatasource as "ArticleDatasource"
    participant AEMExecute as "AEM GraphQL execute.json"

    GraphQLClient->>ArticleResolver: Query articles(filter, pagination)
    ArticleResolver->>ArticleService: getArticles(filter, pagination, requestContext)
    ArticleService->>ArticleDatasource: getBuyingGuides(requestContext, type)
    ArticleDatasource->>AEMExecute: POST {graphqlPath}/BuyingGuidePaginated (variables: _path={rootCFPath}/buying_guides)
    AEMExecute-->>ArticleDatasource: buyingGuideList.items
    ArticleDatasource-->>ArticleMapper: items
    ArticleMapper-->>ArticleService: ArticleResultSet
    ArticleService-->>ArticleResolver: ArticleResultSet
    ArticleResolver-->>GraphQLClient: ArticleResultSet
```

#### Sequence: Query by id (`article`) - GraphQL
```mermaid
sequenceDiagram
    participant GraphQLClient as "GraphQL Client"
    participant ArticleResolver as "ArticleResolver"
    participant ArticleService as "ArticleService"
    participant ArticleMapper as "ArticleMapper"
    participant ArticleDatasource as "ArticleDatasource"
    participant AEMExecute as "AEM GraphQL execute.json"

    GraphQLClient->>ArticleResolver: Query article(id)
    ArticleResolver->>ArticleService: getArticle(id, requestContext)
    ArticleService->>ArticleDatasource: getBuyingGuideByPath(requestContext, id)
    ArticleDatasource->>AEMExecute: POST {graphqlPath}/BuyingGuideByPath (variables: _path={rootCFPath}/buying_guides/:id)
    AEMExecute-->>ArticleDatasource: buyingGuideByPath.item
    ArticleDatasource-->>ArticleMapper: item
    ArticleMapper-->>ArticleService: Article
    ArticleService-->>ArticleResolver: Article
    ArticleResolver-->>GraphQLClient: Article
```
