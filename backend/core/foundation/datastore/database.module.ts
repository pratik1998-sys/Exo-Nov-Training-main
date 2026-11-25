import { AppConfiguration, DatastoreConfiguration } from "@configuration/types";
import { BaseDatastoreModule } from "@datastore";
import { Logger } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DatastoreDynamicModule } from "@server/loader/datastore/base/datastore.loader";

export abstract class BaseDatabaseModule extends BaseDatastoreModule {
  protected static readonly logger = new Logger(BaseDatabaseModule.name);

  protected static readonly datastoreType: string = "database";

  static async forRootAsync(
    appId: string,
    configuration: AppConfiguration,
    databaseConfiguration: DatastoreConfiguration,
  ): Promise<DatastoreDynamicModule> {
    const methodname = `${BaseDatabaseModule.name}.forRootAsync`;

    const { type, id } = databaseConfiguration;

    const module: DatastoreDynamicModule = TypeOrmModule.forRootAsync({
      name: id,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        this.logger.log(
          `${methodname} - Loading TypeORM module for database ${id}`,
        );

        const envConfig = this.getDatastoreEnvironmentConfiguration(
          appId,
          configService,
          databaseConfiguration,
        );

        return this.composeTypeORMModuleOptions(
          appId,
          configService,
          envConfig,
          databaseConfiguration,
        );
      },
      inject: [ConfigService],
    });

    module.datastoreId = id;
    module.type = type;

    return module;
  }

  /**
   * Override in child classes to compose the database configuration for the given database type
   *
   * @param appId
   * @param configService
   * @param envConfig
   * @param datastoreConfig
   */
  protected static composeTypeORMModuleOptions(
    appId: string,
    configService: ConfigService,
    envConfig: any,
    datastoreConfig: DatastoreConfiguration,
  ): TypeOrmModuleOptions {
    throw new Error(
      `DATABASE_MODULE_COMPOSE_TYPEORM_MODULE_OPTIONS_NOT_IMPLEMENTED`,
    );

    //Have to return null to satisfy the TypeORMModule.forRootAsync type
    return null;
  }
}
