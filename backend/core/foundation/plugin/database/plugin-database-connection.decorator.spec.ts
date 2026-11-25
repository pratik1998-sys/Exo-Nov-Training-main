import { describe, expect, it } from "vitest";
import {
  PluginDatabaseConnection,
  getPluginDatabaseConnection,
} from "./plugin-database-connection.decorator";

describe("PluginDatabaseConnection decorator", () => {
  it("returns the decorated database id for a class", () => {
    @PluginDatabaseConnection("reporting-database")
    class DecoratedEntity {}

    expect(getPluginDatabaseConnection(DecoratedEntity)).toBe(
      "reporting-database",
    );
  });

  it("returns undefined for a class without the decorator", () => {
    class UndecoratedEntity {}

    expect(getPluginDatabaseConnection(UndecoratedEntity)).toBeUndefined();
  });

  it("keeps decorations independent across different classes", () => {
    @PluginDatabaseConnection("database-a")
    class EntityA {}

    @PluginDatabaseConnection("database-b")
    class EntityB {}

    expect(getPluginDatabaseConnection(EntityA)).toBe("database-a");
    expect(getPluginDatabaseConnection(EntityB)).toBe("database-b");
  });
});
