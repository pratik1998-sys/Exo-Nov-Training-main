import { BaseDatasource } from "@plugin/datasource";

export abstract class BaseInternalDatasource extends BaseDatasource {
  /**
   * Internal Datasources do not have an environment configuration, as they are internal to the app
   */
  protected resolveDatasourceConfiguration() {}
}
