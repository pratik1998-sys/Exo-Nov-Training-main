import {
  RequestParameterDefinition,
  RequestParameters,
  RequestParametersType,
} from "@api-parameters";

export interface AdminMessengerRequestParametersType extends RequestParametersType {
  messengers: RequestParameterDefinition;
}

export const AdminMessengerRequestParameters: AdminMessengerRequestParametersType =
  {
    ...RequestParameters,
    messengers: {
      id: "messengers",
      description: "messengers description",
    },
  };
