import {
  ApiConfiguration,
  ApiOperationDefinition,
  ApiOperationOptions,
} from "@api";
import { HealthResponse } from "./health.model";

export interface HealthApiOperations {
  health: ApiOperationDefinition;
}

export class HealthApiConfiguration extends ApiConfiguration {
  static operations: HealthApiOperations = {
    health: {
      id: "health",
      description: "App health check",
      summary: "App health check",
      isAuthRequired: false,
      suppressAPIAccessControl: true,
      restOptions: {
        apiOkResponseOptions: {
          type: HealthResponse,
        },
        tags: [],
      },
      queryOptions: {
        required: false,
      },
    },
  };

  static health(): ApiOperationOptions {
    return this.composeOperationOptions(
      HealthApiConfiguration.operations.health,
    );
  }
}
