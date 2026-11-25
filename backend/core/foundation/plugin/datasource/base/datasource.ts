import { RequestContext } from "@context/request";
import { Logger } from "@logger";
import { ConfigService } from "@nestjs/config";
import { ModuleRef } from "@nestjs/core";
import { BasePluginComponent } from "@plugin/base/plugin.component";
import { PluginModuleData } from "@server/loader/types/loader.types";
import { StringUtility } from "@utilities";

export type BaseDatasourceInterfaceParameter = {
  id: string;
};

export enum DatasourceRequiredFieldType {
  string = "string",
  number = "number",
  object = "object",
}

export interface DatasourceServiceOverrideConfiguration {
  host: string;
  services: string[];
  [key: string]: any;
}

export abstract class BaseDatasource extends BasePluginComponent {
  protected datasourceId: string;

  protected consumerDatasourceConfigs: Record<string, any> = {};

  protected serviceOverrideConfigs: Record<
    string,
    Record<string, DatasourceServiceOverrideConfiguration>
  > = {};

  protected serviceOverrideLabels: Record<string, Record<string, string>> = {};

  protected abstract getRequiredConfigFields(): Record<
    string,
    DatasourceRequiredFieldType
  >;

  constructor(
    protected componentId: string,
    protected consumerIds: string[],
    protected plugin: PluginModuleData,
    protected moduleRef: ModuleRef,
    protected configService: ConfigService,
    protected logger: Logger,
  ) {
    super(componentId, consumerIds, plugin, moduleRef, configService, logger);

    this.datasourceId = this.buildDatasourceId();

    this.resolveDatasourceConfigurations();

    this.validateDatasourceConfigurations();
  }

  protected buildDatasourceId() {
    return `${this.plugin.id}.${this.plugin.feature.id}`;
  }

  protected validateDatasourceConfigurations() {
    const methodname = this.composeMethodName(
      "validateDatasourceConfigurations",
    );

    Object.values(this.consumerDatasourceConfigs).forEach((dsConfig) => {
      this.validateDatasourceConfigFields(methodname, dsConfig);
    });
  }

  protected validateDatasourceConfigFields(
    methodname: string,
    dsConfig: Record<string, any>,
  ) {
    const requiredConfigFields = this.getRequiredConfigFields();

    if (requiredConfigFields) {
      Object.keys(requiredConfigFields).forEach((name) => {
        const type = requiredConfigFields[name];

        if (!dsConfig.hasOwnProperty(name)) {
          this.logger.info(
            `${methodname} - Missing datasource configuration field: ${name}`,
          );
          throw new Error(
            `PLUGIN_DATASOURCE_CONFIGURATION_FIELD_MISSING:${this.plugin.id}:${name}`,
          );
        } else if (
          DatasourceRequiredFieldType.string == type &&
          StringUtility.isStringEmpty(dsConfig[name])
        ) {
          this.logger.info(
            `${methodname} - Invalid datasource configuration field: ${name}`,
          );
          throw new Error(
            `PLUGIN_DATASOURCE_CONFIGURATION_FIELD_INVALID:${this.plugin.id}:${name}`,
          );
        }
      });
    }
  }

  protected resolveDatasourceConfigurations() {
    const methodname = this.composeMethodName(
      "resolveDatasourceConfigurations",
    );

    const dsConfigIdToken = this.standardizeComponent();

    for (const consumerId of this.consumerIds) {
      const logPrefix = this.buildLogPrefix(methodname, consumerId);

      let dsConfig: any;

      dsConfig = this.fetchDatasourceConfiguration(
        logPrefix,
        dsConfigIdToken,
        consumerId,
      );

      if (!dsConfig) {
        //Check for component id specific datasource configuration
        dsConfig = this.fetchDatasourceConfiguration(
          logPrefix,
          dsConfigIdToken,
        );
      }

      if (!dsConfig) {
        //Check for plugin id datasource configuration
        dsConfig = this.fetchDatasourceConfiguration(
          logPrefix,
          null,
          consumerId,
        );
      }

      if (!dsConfig) {
        //Check for plugin id datasource configuration
        dsConfig = this.fetchDatasourceConfiguration(logPrefix);
      }

      if (dsConfig) {
        this.consumerDatasourceConfigs[consumerId] = dsConfig;

        this.logger.info(
          `${logPrefix} Datasource Id: ${this.datasourceId}, Consumer: ${consumerId} Datasource Config: ${this.logger.formatJSON(this.consumerDatasourceConfigs[consumerId])}`,
        );
      } else {
        this.logger.warn(`${logPrefix} Missing datasource config`);
        throw new Error(
          `PLUGIN_DATASOURCE_MISSING_CONFIGURATION_${this.datasourceId.toUpperCase()}`,
        );
      }
    }
  }

  protected fetchDatasourceConfiguration(
    logPrefix: string,
    datasourceConfigIdToken: string = null,
    consumerId?: string,
  ) {
    const dsConfigId = `DATASOURCE_CONFIG_${this.buildDatasourceConfigId(datasourceConfigIdToken, consumerId)}`;

    let dsConfig = this.configService.get(dsConfigId);

    if (dsConfig) {
      dsConfig = JSON.parse(dsConfig);
    }

    return dsConfig;
  }

  protected buildDatasourceConfigId(
    componentIdToken: string = null,
    consumerId?: string,
  ) {
    let dsId = consumerId ? `${consumerId}_` : "";

    dsId = `${dsId}${this.plugin.id}`;

    if (StringUtility.isStringNotEmpty(componentIdToken)) {
      dsId = `${dsId}_${componentIdToken}`;
    }

    return dsId.toUpperCase();
  }

  protected resolveServiceOverrideConfigurations(validServiceIds: string[]) {
    const methodname = this.composeMethodName(
      "resolveServiceOverrideConfigurations",
    );

    const componentOverrideToken = `${this.standardizeComponent()}_OVERRIDES`;
    const validServiceIdSet = new Set(validServiceIds);

    for (const consumerId of this.consumerIds) {
      const logPrefix = this.buildLogPrefix(methodname, consumerId);

      const overridesConfig = this.fetchServiceOverridesConfiguration(
        logPrefix,
        componentOverrideToken,
        consumerId,
      );

      if (!overridesConfig) {
        continue;
      }

      this.logger.info(
        `${logPrefix} Resolved datasource override config: ${this.logger.formatJSON(overridesConfig)}`,
      );

      if (!this.serviceOverrideConfigs[consumerId]) {
        this.serviceOverrideConfigs[consumerId] = {};
      }

      if (!this.serviceOverrideLabels[consumerId]) {
        this.serviceOverrideLabels[consumerId] = {};
      }

      const validatedOverrideBlocks =
        new Set<DatasourceServiceOverrideConfiguration>();

      Object.entries(overridesConfig).forEach(([label, block]) => {
        if (!block || typeof block !== "object") {
          throw new Error(
            `PLUGIN_DATASOURCE_INVALID_OVERRIDE_CONFIGURATION_${this.plugin.id.toUpperCase()}:${label}`,
          );
        }

        const overrideBlock = block as DatasourceServiceOverrideConfiguration;

        if (!Array.isArray(overrideBlock.services)) {
          throw new Error(
            `PLUGIN_DATASOURCE_INVALID_OVERRIDE_CONFIGURATION_${this.plugin.id.toUpperCase()}:${label}:services`,
          );
        }

        const mappedServiceIds = overrideBlock.services.filter((serviceId) =>
          validServiceIdSet.has(serviceId),
        );

        if (mappedServiceIds.length > 0) {
          validatedOverrideBlocks.add(overrideBlock);
        }

        overrideBlock.services.forEach((serviceId) => {
          if (!validServiceIdSet.has(serviceId)) {
            this.logger.warn(
              `${logPrefix} Override '${label}' references unknown service id '${serviceId}' for datasource ${this.datasourceId}`,
            );
            return;
          }

          if (this.serviceOverrideConfigs[consumerId][serviceId]) {
            throw new Error(
              `PLUGIN_DATASOURCE_AMBIGUOUS_OVERRIDE_CONFIGURATION_${this.plugin.id.toUpperCase()}:${serviceId}`,
            );
          }

          this.serviceOverrideConfigs[consumerId][serviceId] = overrideBlock;
          this.serviceOverrideLabels[consumerId][serviceId] = label;
        });
      });

      validatedOverrideBlocks.forEach((overrideBlock) => {
        this.validateDatasourceConfigFields(methodname, overrideBlock);
      });
    }
  }

  protected fetchServiceOverridesConfiguration(
    logPrefix: string,
    componentOverrideToken: string,
    consumerId: string,
  ) {
    return (
      this.fetchDatasourceConfiguration(
        logPrefix,
        componentOverrideToken,
        consumerId,
      ) ??
      this.fetchDatasourceConfiguration(logPrefix, componentOverrideToken) ??
      this.fetchDatasourceConfiguration(logPrefix, "OVERRIDES", consumerId) ??
      this.fetchDatasourceConfiguration(logPrefix, "OVERRIDES")
    );
  }

  getDatasourceConfig<T>(
    requestContext: RequestContext,
    serviceId?: string,
  ): T {
    const consumerId = requestContext.consumer;
    const overrideConfig = serviceId
      ? this.serviceOverrideConfigs[consumerId]?.[serviceId]
      : undefined;

    return (overrideConfig ?? this.consumerDatasourceConfigs[consumerId]) as T;
  }

  getDatasourceConfigCacheKey(
    requestContext: RequestContext,
    serviceId?: string,
  ): string {
    const consumerId = requestContext.consumer;
    const overrideLabel = serviceId
      ? this.serviceOverrideLabels[consumerId]?.[serviceId]
      : undefined;

    return overrideLabel ? `${consumerId}:${overrideLabel}` : consumerId;
  }

  protected standardizeComponent() {
    return this.componentId.replace(".datasource", "").replaceAll(".", "_");
  }

  protected buildLogPrefix(methodname: string, consumerId: string) {
    return `${methodname} - [${this.plugin.id}.${this.componentId}] - Consumer: ${consumerId} -`;
  }

  protected composeMethodName(methodname: string) {
    return `${BaseDatasource.name}.${methodname} [${this.plugin.id}]`;
  }
}
