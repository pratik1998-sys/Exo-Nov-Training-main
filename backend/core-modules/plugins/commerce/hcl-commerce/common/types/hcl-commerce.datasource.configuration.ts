import { RestDatasourceConfiguration } from "@plugin-datasource-rest";

export interface HCLCommerceDatasourceConfiguration extends RestDatasourceConfiguration {
    storeId: string;
    catalogId: string;
    searchHost: string;
    assetHost: string;
}
