import {
  RequestParameterDefinition,
  RequestParameters,
  RequestParametersType,
} from "@api-parameters";

export interface AdminDatasourceRequestParametersType extends RequestParametersType {
  datasourceServices: RequestParameterDefinition;
}

export const AdminDatasourceRequestParameters: AdminDatasourceRequestParametersType =
  {
    ...RequestParameters,
    datasourceServices: {
      id: "datasourceServices",
      description: "datasource services description",
    },
  };
