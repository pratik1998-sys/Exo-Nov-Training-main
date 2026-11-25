import {
  PluginConfiguration,
  PluginDatabaseReference,
} from "@configuration/types";
import { getPluginDatabaseConnection } from "./plugin-database-connection.decorator";

/**
 * Resolves the primary database connection id for a plugin, used as the default
 * connection for entities/queries that do not explicitly select a connection
 * (via `@PluginDatabaseConnection` or an explicit `databaseId` argument).
 *
 * The primary connection is the entry in `plugin.databases` flagged `primary: true`,
 * or the first entry when none is flagged. Throws if the plugin has no `databases`
 * configured at all, since database access is not available in that case.
 */
export function resolvePluginPrimaryDatabaseId(
  pluginConfig: PluginConfiguration,
): string {
  const databases: PluginDatabaseReference[] = pluginConfig?.databases ?? [];

  if (databases.length === 0) {
    throw new Error(
      `Plugin[${pluginConfig?.id}] has no 'databases' configured - database access is not available`,
    );
  }

  const primary =
    databases.find((database) => database.primary) ?? databases[0];

  return primary.id;
}

/**
 * Validates that a resolved connection id is one of the plugin's configured
 * database connections. Throws a descriptive error (naming the offending entity
 * and the undeclared connection id) when it is not, so misconfiguration fails
 * fast at boot rather than surfacing as an opaque NestJS DI resolution error.
 */
export function validatePluginDatabaseConnectionId(
  pluginConfig: PluginConfiguration,
  connectionId: string,
  entityName: string,
) {
  const configuredDatabases = pluginConfig?.configuredDatabases ?? {};

  if (!configuredDatabases[connectionId]) {
    throw new Error(
      `Plugin[${pluginConfig?.id}] entity ${entityName} references database connection '${connectionId}', ` +
        `which is not declared in this plugin's 'databases' configuration`,
    );
  }
}

/**
 * Groups a plugin's entity classes by the database connection each should be
 * registered against: the id from the entity's `@PluginDatabaseConnection`
 * decorator when present, otherwise the plugin's primary database connection.
 * Validates every resolved connection id is declared in `pluginConfig.databases`,
 * throwing a descriptive error (naming the entity and the undeclared id)
 * otherwise so misconfiguration fails fast at boot.
 */
export function groupEntityClassesByDatabaseConnection(
  pluginConfig: PluginConfiguration,
  entityClasses: any[],
): Record<string, any[]> {
  const primaryDatabaseId = resolvePluginPrimaryDatabaseId(pluginConfig);

  const entityClassesByConnectionId: Record<string, any[]> = {};

  for (const entityClass of entityClasses) {
    const connectionId =
      getPluginDatabaseConnection(entityClass) ?? primaryDatabaseId;

    validatePluginDatabaseConnectionId(
      pluginConfig,
      connectionId,
      entityClass?.name,
    );

    entityClassesByConnectionId[connectionId] =
      entityClassesByConnectionId[connectionId] ?? [];
    entityClassesByConnectionId[connectionId].push(entityClass);
  }

  return entityClassesByConnectionId;
}
