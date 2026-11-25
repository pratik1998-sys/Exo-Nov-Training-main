import { RequestParameters, RequestParametersType } from "@api-parameters";

export interface AdminRegistryRequestParametersType extends RequestParametersType {}

export const AdminRegistryRequestParameters: AdminRegistryRequestParametersType =
  {
    ...RequestParameters,
  };
