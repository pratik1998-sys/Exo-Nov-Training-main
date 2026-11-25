---
title: Tracing and Observability
layout: default
---

# Tracing and Observability

CatalystJS provides tracing and observability through a consistent **RequestContext**, framework logging that attaches this context to log entries, and **dynamic component logging** for datasource operations and mapper methods.

## RequestContext

**RequestContext** is an object that carries request-scoped information through the call stack. It is built by the framework (e.g. in request-context middleware) from the incoming HTTP request and is passed into controllers, resolvers, services, datasources, and mappers. Using it ensures that logs and downstream calls can be correlated to a specific request, consumer, and user.

### Use of RequestContext

- **Correlation** — Controllers and resolvers receive the request and pass `requestContext` (or `request.raw.requestContext`) into feature components. Services and datasources use it for consumer resolution, token lookup, and logging. Passing it into logger calls attaches that context to the log entry so you can trace a request across services and logs.
- **Consumer and locale** — The `consumer` (and optionally `locale`, `language`, `country`) identify the tenant or channel and are used by the framework to resolve plugin instances (e.g. consumer-specific services and mappers).
- **Auth and identity** — Fields such as `user`, `tokens`, `authorizationToken`, `account`, `idpUserId`, `apiKey`, `clientId`, and `clientSecret` support authorization and auditing.
- **Request identity** — `correlationId` and `requestId` uniquely identify the request for distributed tracing and log correlation.

### Tracing a user's path with requestId, correlationId, and service

When you pass **RequestContext** into logger calls, each log entry includes `requestId`, `correlationId`, and `service`. Together they let you trace the path a user is taking through your system.

- **requestId** — Unique to a **single request**. Each incoming HTTP request gets its own `requestId` (from a header or a generated UUID). Every log line produced while handling that request can carry the same `requestId`. Filter logs by `requestId` to see the full lifecycle of one request: controller → service → datasource → mapper and any errors or timing.

- **correlationId** — Unique to a **user session** (or broader “conversation”). The client typically sends one `correlationId` for a session or flow and reuses it across multiple requests. So all requests that are part of the same user journey share the same `correlationId`. Filter or group logs by `correlationId` to see everything that happened during that session—every API call, page load, or step the user took—even across many distinct requests.

- **service** — The **entry point** of the flow for that request. It is set from the incoming request (e.g. `GET /api/pet/42` or `POST /graphql`). It identifies which endpoint or operation started the request. In logs, `service` tells you “this log line belongs to a request that entered via this route,” so you can distinguish flows by entry point when correlating by `requestId` or `correlationId`.

**Example:** A user opens the pet list, then clicks one pet. That might be two requests: `GET /api/pets` (requestId=A, correlationId=S) and `GET /api/pet/42` (requestId=B, correlationId=S). Logs for the first request all have requestId=A and service=`GET /api/pets`; logs for the second have requestId=B and service=`GET /api/pet/42`. Both have correlationId=S, so searching by S shows the entire path (list → detail) in order.

### Fields present on RequestContext

| Field | Type | Description |
|-------|------|-------------|
| `correlationId` | string | Correlation id for the user session or flow; shared across requests so logs can be grouped by journey. |
| `requestId` | string | Unique id for this single request; use to trace one request’s path through the stack. |
| `service` | string | Entry point of the request (e.g. `METHOD /path` or GraphQL operation), set from the incoming request. |
| `locale` | string | Resolved locale. |
| `language` | string | Language. |
| `country` | string | Country. |
| `timezone` | string | Timezone. |
| `currency` | string | Currency. |
| `idpUserId` | string | Identity provider user id. |
| `consumer` | string | Consumer id (tenant/channel). |
| `graphql` | object | GraphQL-specific data: `service`, `args`, `parsingTime`. |
| `tokens` | Record<string, Token> | Plugin tokens keyed by token id. |
| `authorizationToken` | string | Authorization token. |
| `account` | string | Account identifier. |
| `user` | any | Resolved user object. |
| `integrations` | any[] | Integration metadata (e.g. for access logging). |
| `apiKey` | string | API key when present. |
| `clientId` | string | Client id. |
| `clientSecret` | string | Client secret. |

All fields are optional. Sensitive fields (e.g. `clientSecret`, `authorizationToken`, `tokens`) can be masked in log output via the application’s [logger configuration](components/logger.md#configuration) (e.g. `loggerMaskedFields`).

## What the logger logs when RequestContext is passed

The framework logger interface accepts an optional **RequestContext** as the second argument on methods such as `info(message, requestContext?, data?, profile?)`. When you pass **RequestContext**:

- The **log string (message)** is logged as usual.
- The **RequestContext** object is attached to the log payload. The implementation (e.g. Winston) includes it in the structured log entry as **requestContext**. So the full set of fields present on the object at log time (e.g. `correlationId`, `requestId`, `consumer`, `service`, `locale`, `user`, etc.) are included in that log entry, allowing log aggregation and tracing tools to filter or correlate by correlation id, request id, consumer, or user.

So: when RequestContext is passed, the logger logs the message and the entire RequestContext as part of the log output (subject to any transport-level or mask configuration your logger applies to sensitive fields).

**Example — log statement:**

```ts
this.logger.info(
  "PetService.getPet - Fetched pet by id",
  requestContext,
);
```

**Example — resulting log entry (structured output with RequestContext):**

```json
{
  "level": "info",
  "message": "PetService.getPet - Fetched pet by id",
  "timestamp": "2025-02-18 14:32:01.123",
  "requestContext": {
    "correlationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "requestId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "service": "GET /api/pet/42",
    "consumer": "site-1",
    "locale": "en-US",
    "language": "en",
    "country": "US"
  }
}
```

The log string appears as `message`; the second argument is serialized as `requestContext` in the log payload so you can search or filter by correlation id, consumer, or service.

## Dynamic Component Logging

You can enable detailed logging for specific plugin components at runtime via configuration (and in some cases via admin APIs), without changing code. This is referred to as **dynamic component logging**.

- **[Logging datasource operations](components/plugin/logging-datasource-operations.md)** — Enable request/response and execution-time logging per REST or GraphQL datasource operation. Configuration uses `SERVICE_LOGGING` and keys like `pluginId.featureId.serviceId`, with wildcard support for all operations of a datasource or plugin.
- **[Logging mapper methods](components/plugin/logging-mapper.md)** — Enable input/output logging for specific mapper methods. Configuration uses `MAPPER_LOGGING` and keys like `pluginId.featureId.mapperId`, with wildcard support for all methods of a mapper or plugin.

Together with RequestContext-aware logging, these give you tracing and observability across requests, datasource calls, and mapper transformations.

## Related

- [Logger](components/logger.md) — Logger configuration and log masking
- [Logging datasource operations](components/plugin/logging-datasource-operations.md) — Datasource operation logging
- [Logging mapper methods](components/plugin/logging-mapper.md) — Mapper method logging
- [Architecture](architecture.md) — Request lifecycle and module structure
