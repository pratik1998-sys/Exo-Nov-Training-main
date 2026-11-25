---
title: CatalystJS Documentation
layout: default
---

<!-- <p style="text-align: center; margin-bottom: 1.5rem;">
  <img src="{{ '/images/catalyst_logo.png' | relative_url }}" alt="Catalyst logo" style="max-width: 70%; height: auto;" />
</p> -->

Previously known as the "services application of IBM Consulting Experience Orchestrator", we realized there was far more use cases to unlock with the new engine that deserved its own framework. 

CatalystJS is a powerful, modular framework built on NestJS that simplifies building scalable backend applications with declarative APIs and comprehensive authorization controls. The framework provides a structured approach to developing enterprise-grade applications with support for both REST and GraphQL APIs.

## What is CatalystJS?

The name **Catalyst** fits the framework’s role: like a catalyst in chemistry, it speeds up reactions without being consumed. CatalystJS accelerates how quickly you can build and run production-ready backends—configuration-driven features, plugins, and APIs—without replacing the engine underneath (NestJS). It targets use cases such as multi-tenant APIs, REST and GraphQL services with shared auth and access control, and multi-app monorepos; for those scenarios, it acts as a catalyst that helps teams go from zero to a running, extensible application in short order.

CatalystJS extends NestJS with a feature-rich foundation that enables rapid development through:

- **Declarative API Development**: Build REST and GraphQL APIs using custom decorators that reduce boilerplate and enforce consistency
- **Modular Architecture**: Organize your application using features, plugins, and databases that can be easily installed and configured
- **Built-in Authorization**: Comprehensive authorization guard system with API access control, user scopes, and operation-level security
- **Configuration-Driven**: YAML-based configuration system that allows environment-specific settings and feature toggling
- **Multi-App Support**: Run multiple applications from a single codebase with shared core functionality

## Key Capabilities

The framework provides a robust foundation for building backend services with:

- Unified REST and GraphQL API support with shared type definitions
- Flexible plugin system for extending functionality
- Database abstraction layer supporting multiple database types
- Middleware system with consumer-specific configurations
- Admin features and tooling for application management
- Type-safe decorators and configuration with full TypeScript support

## Tracing and Observability

CatalystJS provides built-in observability features to help you monitor and debug your applications:

- **Operation-level logging** — Enable detailed request/response logging for REST and GraphQL datasource operations, with configurable per-operation control and runtime toggling. See [Logging datasource operations](components/plugin/logging-datasource-operations.md) for configuration and examples.
- **Access logging** — Framework-level access logs for API requests
- **Performance metrics** — Execution time tracking for datasource operations
- **Log masking** — Automatic masking of sensitive fields (passwords, tokens, secrets) in log output

## Documentation

Explore the framework documentation to get started:

- **[Developer Quick Start](developer-quick-start.md)** — Get up and running with your first CatalystJS application
- **[Architecture](architecture.md)** — Understand the framework's structure and design patterns
- **[Configuration](configuration.md)** — configuration.yaml: what it does, where it lives, and field definitions
- **[Components](components.md)** — Learn about features, plugins, databases, and other building blocks
- **[Authorization and Access Control](authorization-and-access-control.md)** — Deep dive into the authorization system and security features
- **[Class Loading Hierarchy](class-loading-hierarchy.md)** — Understand how classes are discovered and loaded in the framework
- **[Tracing and Observability](tracing-and-observability.md)** — RequestContext, logger behavior, and dynamic component logging
- **[Logging Datasource Operations](components/plugin/logging-datasource-operations.md)** — Configure operation-level logging for REST and GraphQL datasources
- **[Assigning Entities to a Database](components/plugin/assigning-entities-to-databases.md)** — How to bind TypeORM entity classes to a plugin database connection (`@PluginDatabaseConnection`)
- **[Testing](testing.md)** — Automated testing with Vitest, test harnesses for features and plugins
- **[Agentic Development](agentic-development.md)** — Custom agent skills for features, plugins, and extensions; example prompts and user interaction
- **[Versions](versions.md)** — Version history and changelog
- **[Enhancement Plans](enhancements/index.md)** — Design/enhancement plans behind notable framework changes

