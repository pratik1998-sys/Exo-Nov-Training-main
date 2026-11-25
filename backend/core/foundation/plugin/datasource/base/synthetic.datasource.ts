import * as fs from "fs";
import YAML from "yaml";
import { join } from "path";
import { RequestContext } from "@context/request";
import { AppConfigurationKeys } from "@configuration/app";
import { BaseInternalDatasource } from "@plugin/datasource";

export abstract class BaseSyntheticDatasource extends BaseInternalDatasource {
  private dataMap = {};

  async get(requestContext: RequestContext): Promise<any> {
    return this.dataMap[requestContext.consumer];
  }

  async onModuleInit() {
    const methodname = `${BaseSyntheticDatasource.name}.onModuleInit`;

    const consumerIds = this.configService.get(
      AppConfigurationKeys.consumerIds,
    );

    const appName = this.configService.get(AppConfigurationKeys.appName);

    /** @todo - UPDATE THIS TO BE MORE DYNAMIC */
    const appPath = `src/apps/${appName}/plugins/synthetic/features/${this.plugin.feature.id}/data`;
    const globalPath = `src/apps/global/plugins/synthetic/features/${this.plugin.feature.id}/data`;

    const defaultFile = await this.fetchDataFile(appPath, globalPath);

    if (defaultFile && defaultFile != null) {
      this.logger.info(
        `${methodname} - [${this.plugin.feature.id}] - (Default) - Reading data from file path: ${defaultFile.path.replace(process.cwd(), "")}`,
      );

      this.dataMap["default"] = YAML.parse(defaultFile.file);
    }

    await consumerIds.reduce(async (prevPromise, consumerId: string) => {
      await prevPromise;

      let clientFile = await this.fetchDataFile(
        appPath,
        globalPath,
        consumerId,
      );

      clientFile = clientFile && clientFile != null ? clientFile : defaultFile;

      if (clientFile && clientFile != null) {
        this.logger.info(
          `${methodname} - [${this.plugin.feature.id}] - (${consumerId}) - Reading data from file path: ${clientFile.path.replace(process.cwd(), "")}`,
        );

        this.dataMap[consumerId] = YAML.parse(clientFile.file);
      }
    }, Promise.resolve());
  }

  private async fetchDataFile(
    appPath: string,
    globalPath: string,
    consumerId: string = null,
  ) {
    const appName = this.configService.get(AppConfigurationKeys.appName);

    const prefix = consumerId != null ? `${consumerId}.` : "";

    const results = await Promise.all([
      this.readDataFile(
        join(
          process.cwd(),
          `${appPath}/${prefix}${this.plugin.feature.id}.yaml`,
        ),
      ),
      this.readDataFile(
        join(
          process.cwd(),
          `${globalPath}/${prefix}${this.plugin.feature.id}.yaml`,
        ),
      ),
    ]);

    const result = results.find((fileObj: any) => {
      return fileObj.file != null;
    });

    return result;
  }

  private async readDataFile(filePath: string): Promise<any> {
    const fileObj = {
      path: filePath,
      file: null,
    };

    return new Promise((resolve, reject) => {
      try {
        fileObj.file = fs.readFileSync(filePath, "utf-8");
      } catch (error) {}

      resolve(fileObj);
    });
  }
}
