import "reflect-metadata";

const PLUGIN_DATABASE_CONNECTION_METADATA_KEY = "plugin:database-connection";

/**
 * Class decorator for TypeORM entities that selects which of a plugin's
 * configured `databases` connections the entity is registered against.
 *
 * Optional: entities without this decorator resolve to the plugin's primary
 * database connection (see `resolvePluginPrimaryDatabaseId`). Only needed when
 * a plugin declares more than one database connection and an entity does not
 * live on the primary one.
 *
 * @example
 * ```ts
 * @Entity({ name: 'veteran', schema: 'atom' })
 * @PluginDatabaseConnection('secondary-database')
 * export class DBVeteransAffairsDbVeteranEntity { ... }
 * ```
 */
export function PluginDatabaseConnection(databaseId: string): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(
      PLUGIN_DATABASE_CONNECTION_METADATA_KEY,
      databaseId,
      target,
    );
  };
}

/**
 * Reads the database connection id assigned to an entity class via
 * `@PluginDatabaseConnection`, if any.
 */
export function getPluginDatabaseConnection(
  target: Function,
): string | undefined {
  return Reflect.getMetadata(PLUGIN_DATABASE_CONNECTION_METADATA_KEY, target);
}
