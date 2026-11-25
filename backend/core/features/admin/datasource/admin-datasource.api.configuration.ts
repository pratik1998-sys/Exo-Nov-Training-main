import {
  AdminDatasourceServiceInputModel,
  AdminDatasourceServiceModel,
  AdminDatasourceServiceModelResultSet,
  AdminDatasourceServicesUpdateBody,
} from "./admin-datasource.model";
import { AdminDatasourceRequestParameters } from "./admin-datasource.parameters";
import {
  ApiConfiguration,
  ApiOperationDefinition,
  ApiOperationOptions,
} from "@api";

export interface AdminDatasourceApiOperations {
  datasourceServices: ApiOperationDefinition;
  datasourceService: ApiOperationDefinition;
  datasourceServiceUpdate: ApiOperationDefinition;
  datasourceServicesUpdate: ApiOperationDefinition;
}

export class AdminDatasourceApiConfiguration extends ApiConfiguration {
  static operations: AdminDatasourceApiOperations = {
    datasourceServices: {
      id: "datasourceServices",
      description: "Get datasource services",
      summary: "Get datasource services",
      isAuthRequired: true,
      suppressAPIAccessControl: false,
      queryOptions: {
        required: false,
      },
      restOptions: {
        apiOkResponseOptions: {
          type: AdminDatasourceServiceModelResultSet,
        },
      },
    },
    datasourceService: {
      id: "service",
      description: "Get a datasource service by id",
      summary: "Get a datasource service by id",
      isAuthRequired: true,
      suppressAPIAccessControl: false,
      queryOptions: {
        required: false,
      },
      restOptions: {
        isById: true,
        path: `:${AdminDatasourceRequestParameters.id.id}`,
        apiOkResponseOptions: {
          type: AdminDatasourceServiceModel,
        },
      },
    },
    datasourceServicesUpdate: {
      id: "datasourceServicesUpdate",
      description: "Update datasource services",
      summary: "Update datasource services",
      isAuthRequired: true,
      suppressAPIAccessControl: false,
      mutationOptions: {
        required: false,
      },
      restOptions: {
        apiOkResponseOptions: {
          type: AdminDatasourceServiceModelResultSet,
        },
        apiBodyOptions: {
          type: AdminDatasourceServicesUpdateBody,
        },
      },
    },
    datasourceServiceUpdate: {
      id: "datasourceServiceUpdate",
      description: "Update datasource service",
      summary: "Update datasource service",
      isAuthRequired: true,
      suppressAPIAccessControl: false,
      mutationOptions: {
        required: false,
      },
      restOptions: {
        apiOkResponseOptions: {
          type: AdminDatasourceServiceModel,
        },
        apiBodyOptions: {
          type: AdminDatasourceServiceInputModel,
        },
      },
    },
  };

  static datasourceServices(): ApiOperationOptions {
    return this.composeOperationOptions(
      AdminDatasourceApiConfiguration.operations.datasourceServices,
    );
  }

  static datasourceService(): ApiOperationOptions {
    return this.composeOperationOptions(
      AdminDatasourceApiConfiguration.operations.datasourceService,
    );
  }

  static datasourceServicesUpdate(): ApiOperationOptions {
    return this.composeOperationOptions(
      AdminDatasourceApiConfiguration.operations.datasourceServicesUpdate,
    );
  }

  static datasourceServiceUpdate(): ApiOperationOptions {
    return this.composeOperationOptions(
      AdminDatasourceApiConfiguration.operations.datasourceServiceUpdate,
    );
  }
}
