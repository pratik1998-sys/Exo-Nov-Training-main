import { describe, expect, it } from "vitest";
import { PluginConfiguration } from "@configuration/types";
import { PluginDatabaseConnection } from "./plugin-database-connection.decorator";
import {
  groupEntityClassesByDatabaseConnection,
  resolvePluginPrimaryDatabaseId,
  validatePluginDatabaseConnectionId,
} from "./plugin-database.utility";

function buildPluginConfig(
  databases: PluginConfiguration["databases"],
): PluginConfiguration {
  const configuredDatabases: Record<string, any> = {};
  (databases ?? []).forEach((database) => {
    configuredDatabases[database.id] = database;
  });

  return {
    id: "my-db",
    databases,
    configuredDatabases,
  } as PluginConfiguration;
}

describe("resolvePluginPrimaryDatabaseId", () => {
  it("throws when the plugin has no databases configured", () => {
    const pluginConfig = buildPluginConfig([]);

    expect(() => resolvePluginPrimaryDatabaseId(pluginConfig)).toThrow(
      /has no 'databases' configured/,
    );
  });

  it("returns the first entry when none is flagged primary", () => {
    const pluginConfig = buildPluginConfig([
      { id: "database-a" },
      { id: "database-b" },
    ] as any);

    expect(resolvePluginPrimaryDatabaseId(pluginConfig)).toBe("database-a");
  });

  it("returns the entry flagged primary, regardless of position", () => {
    const pluginConfig = buildPluginConfig([
      { id: "database-a" },
      { id: "database-b", primary: true },
    ] as any);

    expect(resolvePluginPrimaryDatabaseId(pluginConfig)).toBe("database-b");
  });
});

describe("validatePluginDatabaseConnectionId", () => {
  it("does not throw when the connection id is declared", () => {
    const pluginConfig = buildPluginConfig([
      { id: "database-a", primary: true },
    ] as any);

    expect(() =>
      validatePluginDatabaseConnectionId(
        pluginConfig,
        "database-a",
        "MyEntity",
      ),
    ).not.toThrow();
  });

  it("throws a descriptive error when the connection id is undeclared", () => {
    const pluginConfig = buildPluginConfig([
      { id: "database-a", primary: true },
    ] as any);

    expect(() =>
      validatePluginDatabaseConnectionId(
        pluginConfig,
        "undeclared-database",
        "MyEntity",
      ),
    ).toThrow(/MyEntity.*undeclared-database/);
  });
});

describe("groupEntityClassesByDatabaseConnection", () => {
  it("groups all entities on the primary connection when undecorated", () => {
    class EntityA {}
    class EntityB {}

    const pluginConfig = buildPluginConfig([
      { id: "primary-database", primary: true },
    ] as any);

    const grouped = groupEntityClassesByDatabaseConnection(pluginConfig, [
      EntityA,
      EntityB,
    ]);

    expect(Object.keys(grouped)).toEqual(["primary-database"]);
    expect(grouped["primary-database"]).toEqual([EntityA, EntityB]);
  });

  it("splits entities across connections per @PluginDatabaseConnection", () => {
    @PluginDatabaseConnection("reporting-database")
    class ReportingEntity {}

    class PrimaryEntity {}

    const pluginConfig = buildPluginConfig([
      { id: "primary-database", primary: true },
      { id: "reporting-database" },
    ] as any);

    const grouped = groupEntityClassesByDatabaseConnection(pluginConfig, [
      PrimaryEntity,
      ReportingEntity,
    ]);

    expect(grouped["primary-database"]).toEqual([PrimaryEntity]);
    expect(grouped["reporting-database"]).toEqual([ReportingEntity]);
  });

  it("throws when an entity references an undeclared connection", () => {
    @PluginDatabaseConnection("undeclared-database")
    class BadEntity {}

    const pluginConfig = buildPluginConfig([
      { id: "primary-database", primary: true },
    ] as any);

    expect(() =>
      groupEntityClassesByDatabaseConnection(pluginConfig, [BadEntity]),
    ).toThrow(/BadEntity.*undeclared-database/);
  });
});
