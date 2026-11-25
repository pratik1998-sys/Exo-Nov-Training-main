import {
  AdminMessengerModel,
  AdminMessengerResultSet,
  AdminMessengersUpdateBody,
} from "./admin-messenger.model";
import { AdminMessengerRequestParameters } from "./admin-messenger.parameters";
import {
  ApiConfiguration,
  ApiOperationDefinition,
  ApiOperationOptions,
} from "@api";

export interface AdminMessengerApiOperations {
  messengers: ApiOperationDefinition;
  messenger: ApiOperationDefinition;
  messengersUpdate: ApiOperationDefinition;
}

export class AdminMessengerApiConfiguration extends ApiConfiguration {
  static operations: AdminMessengerApiOperations = {
    messengers: {
      id: "messengers",
      description: "Get messengers",
      summary: "Get messengers",
      isAuthRequired: true,
      suppressAPIAccessControl: false,
      queryOptions: {
        required: false,
      },
      restOptions: {
        apiOkResponseOptions: {
          type: AdminMessengerResultSet,
        },
      },
    },
    messenger: {
      id: "messenger",
      description: "Get a messenger by id",
      summary: "Get a messenger by id",
      isAuthRequired: true,
      suppressAPIAccessControl: false,
      queryOptions: {
        required: false,
      },
      restOptions: {
        isById: true,
        path: `:${AdminMessengerRequestParameters.id.id}`,
        apiOkResponseOptions: {
          type: AdminMessengerModel,
        },
      },
    },
    messengersUpdate: {
      id: "messengersUpdate",
      description: "Update messengers",
      summary: "Update messengers",
      isAuthRequired: true,
      suppressAPIAccessControl: false,
      mutationOptions: {
        required: false,
      },
      restOptions: {
        apiOkResponseOptions: {
          type: AdminMessengerResultSet,
        },
        apiBodyOptions: {
          type: AdminMessengersUpdateBody,
        },
      },
    },
  };

  static messengers(): ApiOperationOptions {
    return this.composeOperationOptions(
      AdminMessengerApiConfiguration.operations.messengers,
    );
  }

  static messenger(): ApiOperationOptions {
    return this.composeOperationOptions(
      AdminMessengerApiConfiguration.operations.messenger,
    );
  }

  static messengersUpdate(): ApiOperationOptions {
    return this.composeOperationOptions(
      AdminMessengerApiConfiguration.operations.messengersUpdate,
    );
  }
}
