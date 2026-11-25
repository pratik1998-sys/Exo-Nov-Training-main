import { RestDatasourceConfiguration } from "@plugin-datasource-rest";

export interface GraphQLDatasourceConfig extends RestDatasourceConfiguration {
  graphqlPath: string;
}
