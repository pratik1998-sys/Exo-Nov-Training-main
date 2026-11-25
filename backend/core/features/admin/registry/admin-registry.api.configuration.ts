import { AdminRegistryModel } from "./admin-registry.model";
import { AdminRegistryRequestParameters } from "./admin-registry.parameters";
import {
  ApiConfiguration,
  ApiOperationDefinition,
  ApiOperationOptions,
} from "@api";

export interface AdminRegistryApiOperations {
  registries: ApiOperationDefinition;
  registry: ApiOperationDefinition;
  registryRefresh: ApiOperationDefinition;
}

export class AdminRegistryApiConfiguration extends ApiConfiguration {
  static operations: AdminRegistryApiOperations = {
    registries: {
      id: "registries",
      description: "Get registries",
      summary: "Get registries",
      isAuthRequired: true,
      suppressAPIAccessControl: false,
      queryOptions: {
        required: false,
      },
      restOptions: {
        apiOkResponseOptions: {
          type: [String],
        },
      },
    },
    registry: {
      id: "registry",
      description: "Get a registry by id",
      summary: "Get a registry by id",
      isAuthRequired: true,
      suppressAPIAccessControl: false,
      queryOptions: {
        required: false,
      },
      restOptions: {
        isById: true,
        path: `:${AdminRegistryRequestParameters.id.id}`,
        apiOkResponseOptions: {
          type: AdminRegistryModel,
        },
      },
    },
    registryRefresh: {
      id: "registryRefresh",
      description: "Refresh registries",
      summary: "Refresh registries",
      isAuthRequired: true,
      suppressAPIAccessControl: false,
      mutationOptions: {
        required: false,
      },
      restOptions: {
        apiOkResponseOptions: {
          type: AdminRegistryModel,
        },
      },
    },
  };

  static registries(): ApiOperationOptions {
    return this.composeOperationOptions(
      AdminRegistryApiConfiguration.operations.registries,
    );
  }

  static registry(): ApiOperationOptions {
    return this.composeOperationOptions(
      AdminRegistryApiConfiguration.operations.registry,
    );
  }

  static registryRefresh(): ApiOperationOptions {
    return this.composeOperationOptions(
      AdminRegistryApiConfiguration.operations.registryRefresh,
    );
  }
}
