import { describe, expect, it, vi } from "vitest";
import { getDataSourceToken, getRepositoryToken } from "@nestjs/typeorm";
import { PluginDatabaseConnection } from "@plugin/database";
import { BasePluginServiceImpl } from "./plugin.service";

class TestServiceImpl extends BasePluginServiceImpl {
  callGetRepository(repositoryClass: any, databaseId?: string) {
    return (this as any).getRepository(repositoryClass, databaseId);
  }

  callGetDatabaseConnection(databaseId?: string) {
    return (this as any).getDatabaseConnection(databaseId);
  }
}

class UndecoratedEntity {}

@PluginDatabaseConnection("reporting-database")
class DecoratedEntity {}

function createService(databases: any[]) {
  const moduleRefGet = vi.fn(() => ({ mocked: true }));
  const moduleRef = { get: moduleRefGet } as any;

  const plugin = {
    id: "my-db",
    feature: { id: "item", group: "" },
    configuration: {
      id: "my-db",
      databases,
      configuredDatabases: databases.reduce(
        (acc, database) => {
          acc[database.id] = database;
          return acc;
        },
        {} as Record<string, any>,
      ),
    },
  } as any;

  const service = new TestServiceImpl(
    "my-db.item.service",
    ["site-1"],
    plugin,
    moduleRef,
    undefined as any,
    undefined as any,
  );

  return { service, moduleRefGet };
}

describe("BasePluginServiceImpl.getRepository", () => {
  it("resolves against the primary connection when the entity is undecorated", () => {
    const { service, moduleRefGet } = createService([
      { id: "primary-database", primary: true },
    ]);

    service.callGetRepository(UndecoratedEntity);

    const expectedToken = getRepositoryToken(
      UndecoratedEntity,
      "primary-database",
    );
    expect(moduleRefGet).toHaveBeenCalledWith(expectedToken, {
      strict: false,
    });
  });

  it("resolves against the entity's @PluginDatabaseConnection when present", () => {
    const { service, moduleRefGet } = createService([
      { id: "primary-database", primary: true },
      { id: "reporting-database" },
    ]);

    service.callGetRepository(DecoratedEntity);

    const expectedToken = getRepositoryToken(
      DecoratedEntity,
      "reporting-database",
    );
    expect(moduleRefGet).toHaveBeenCalledWith(expectedToken, {
      strict: false,
    });
  });

  it("resolves against an explicit databaseId override, taking precedence over the decorator", () => {
    const { service, moduleRefGet } = createService([
      { id: "primary-database", primary: true },
      { id: "reporting-database" },
      { id: "archive-database" },
    ]);

    service.callGetRepository(DecoratedEntity, "archive-database");

    const expectedToken = getRepositoryToken(
      DecoratedEntity,
      "archive-database",
    );
    expect(moduleRefGet).toHaveBeenCalledWith(expectedToken, {
      strict: false,
    });
  });

  it("throws when the plugin has no databases configured", () => {
    const { service } = createService([]);

    expect(() => service.callGetRepository(UndecoratedEntity)).toThrow(
      /has no 'databases' configured/,
    );
  });
});

describe("BasePluginServiceImpl.getDatabaseConnection", () => {
  it("resolves the primary connection when no databaseId is given", () => {
    const { service, moduleRefGet } = createService([
      { id: "database-a" },
      { id: "database-b", primary: true },
    ]);

    service.callGetDatabaseConnection();

    expect(moduleRefGet).toHaveBeenCalledWith(
      getDataSourceToken("database-b"),
      { strict: false },
    );
  });

  it("resolves an explicit connection override", () => {
    const { service, moduleRefGet } = createService([
      { id: "database-a", primary: true },
      { id: "database-b" },
    ]);

    service.callGetDatabaseConnection("database-b");

    expect(moduleRefGet).toHaveBeenCalledWith(
      getDataSourceToken("database-b"),
      { strict: false },
    );
  });
});
