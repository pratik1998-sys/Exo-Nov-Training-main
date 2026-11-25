import { NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import * as fs from "fs";
import { Logger } from "@nestjs/common";
import { AppConfiguration } from "@configuration/types";
import { StringUtility } from "@utilities";
import { HeaderUtility } from "@api-headers/utilities";
import { Headers } from "@api-headers";

export class SwaggerInitializer {
  static initializeSwagger(
    logger: Logger,
    configuration: AppConfiguration,
    appModule: any,
    app: NestFastifyApplication,
  ) {
    const methodname = `${SwaggerInitializer.name}.initializeSwagger`;

    const { isSwaggerDisabled } = configuration;
    const swaggerPath = configuration.swaggerPath ?? "swagger";

    if (!isSwaggerDisabled) {
      const document = this.buildSwaggerDocument(logger, configuration, app);

      SwaggerModule.setup(swaggerPath, app, document);

      fs.writeFileSync(
        `${appModule.appId}_swagger.json`,
        JSON.stringify(document, null, 2),
      );
    } else {
      logger.log(`${methodname} - Swagger is disabled`);
    }
  }

  protected static buildSwaggerDocument(
    logger: Logger,
    configuration: AppConfiguration,
    app: NestFastifyApplication,
  ) {
    const methodname = `${SwaggerInitializer.name}.buildSwaggerDocument`;

    const urlBasePath = configuration.urlBasePath;

    const swaggerDocument = new DocumentBuilder();

    if (StringUtility.isStringNotEmpty(urlBasePath)) {
      logger.log(
        `${methodname} - Setting Swagger URL Base Path to: ${urlBasePath}`,
      );

      swaggerDocument.addServer(`/${urlBasePath}`);
    }

    const swaggerConfig = swaggerDocument.build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);

    this.initializeSwaggerHeaders(logger, configuration, document);

    return document;
  }

  protected static initializeSwaggerHeaders(
    logger: Logger,
    configuration: AppConfiguration,
    document: OpenAPIObject,
  ) {
    const methodname = `${SwaggerInitializer.name}.initializeSwaggerHeaders`;

    const headers = this.buildSwaggerHeaders(configuration);

    logger.log(
      `${methodname} - (Swagger) Adding Headers: ${JSON.stringify(headers)}`,
    );

    Object.values(document.paths).forEach((path) => {
      Object.values(path).forEach((pathObj) => {
        pathObj.parameters = pathObj.parameters.concat(headers);
      });
    });
  }

  protected static buildSwaggerHeaders(configuration: AppConfiguration) {
    const swaggerHeaders = [];

    Object.values(Headers).forEach((header) => {
      const { name, description } = header;

      swaggerHeaders.push({
        name: name,
        description: description,
        in: "header",
        schema: {
          type: "string",
          default: HeaderUtility.getHeaderDefaultValue(header, configuration),
        },
      });
    });

    return swaggerHeaders;
  }
}
