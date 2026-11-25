import { AppConfiguration, DatastoreConfiguration } from "@configuration/types";
import {
  DatastoreDynamicModule,
  DatastoreLoader,
} from "@server/loader/datastore/base/datastore.loader";

export class DatabaseLoader extends DatastoreLoader {
  protected static readonly datastoreType: string = "database";

  protected static getDatastoresConfiguration(
    configuration: AppConfiguration,
  ): DatastoreConfiguration[] {
    return configuration.databases;
  }

  protected static async loadDatastoreClientModule(
    appId: string,
    configuration: AppConfiguration,
    datastoreConfig: DatastoreConfiguration,
  ): Promise<DatastoreDynamicModule> {
    return await this.initializeDatastoreModule(
      appId,
      configuration,
      "databases",
      datastoreConfig,
    );
  }
}
