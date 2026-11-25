import {
  DatastoreDynamicModule,
  DatastoreLoader,
} from "@server/loader/datastore/base/datastore.loader";
import { AppConfigurationValues } from "@configuration/app";
import { AppConfiguration, DatastoreConfiguration } from "@configuration/types";

export class MessengerLoader extends DatastoreLoader {
  protected static readonly datastoreType: string = "messenger";

  protected static getDatastoresConfiguration(
    configuration: AppConfiguration,
  ): DatastoreConfiguration[] {
    return configuration.messengers;
  }

  static getEnabledDatastores(
    appId: string,
    configuration: AppConfiguration,
    filterOutTypes: string[] = [],
  ): DatastoreConfiguration[] {
    const methodname = `${DatastoreLoader.name}.getEnabledDatastores`;

    filterOutTypes.push(AppConfigurationValues.messenger.types.apollo);

    let enabledDatastores: DatastoreConfiguration[] =
      super.getEnabledDatastores(appId, configuration);

    enabledDatastores = enabledDatastores.filter(
      (datastore) => !filterOutTypes.includes(datastore.type),
    );

    return enabledDatastores;
  }

  protected static async loadDatastoreClientModule(
    appId: string,
    configuration: AppConfiguration,
    datastoreConfig: DatastoreConfiguration,
  ): Promise<DatastoreDynamicModule> {
    return await this.initializeDatastoreModule(
      appId,
      configuration,
      "messengers",
      datastoreConfig,
    );
  }
}
