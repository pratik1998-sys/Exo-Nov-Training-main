import { AppConfigurationKeys } from "@configuration/app";
import { AppConfiguration, DatastoreConfiguration } from "@configuration/types";
import { BaseDatabaseModule } from "@datastore";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DatastoreDynamicModule } from "@server/loader/datastore/base/datastore.loader";

export class PostgresDatabaseModule extends BaseDatabaseModule {
    static async forRootAsync(appId: string, configuration: AppConfiguration, databaseConfiguration: DatastoreConfiguration): Promise<DatastoreDynamicModule> {
        return await super.forRootAsync(appId, configuration, databaseConfiguration);
    }

    protected static composeTypeORMModuleOptions(appId: string, configService: ConfigService, envConfig: any, datastoreConfig: DatastoreConfiguration): TypeOrmModuleOptions {
        const methodname = `${PostgresDatabaseModule.name}.composeTypeORMModuleOptions [${appId}]`;

        const config: any = {
            name: datastoreConfig.id,
            type: datastoreConfig.type,
            host: envConfig.host,
            database: envConfig.database,
            port: envConfig.port,
            username: envConfig.username,
            password: envConfig.password,
            schema: envConfig.schema,
            applicationName: `${configService.get(AppConfigurationKeys.appName)}`,
            autoLoadEntities: true,
            logging: envConfig.isLoggingEnabled,
        };

        if (envConfig.certificate) {
            config.ssl = {
                rejectUnauthorized: false,
                cert: Buffer.from(envConfig.certificate, 'base64'),
            };
        }

        const logConfig: any = {
            name: datastoreConfig.id,
            type: datastoreConfig.type,
            host: envConfig.host,
            database: envConfig.database,
            port: envConfig.port,
            username: envConfig.username,
            schema: envConfig.schema,
            applicationName: `${configService.get(AppConfigurationKeys.appName)}`,
            logging: envConfig.isLoggingEnabled,
        };

        this.logger.log(`${methodname} - Loading postgres database [${datastoreConfig.id}]: ${JSON.stringify(logConfig)}`);

        return config;
    }
}