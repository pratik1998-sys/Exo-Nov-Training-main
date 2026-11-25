import { RequestContext } from "@context/request";
import { ParamsSerializerOptions } from "axios";
import { BaseRestDatasource, RestDatasourceServiceDefinition } from "@plugin-datasource-rest";
import { HCLCommerceConsumerConfiguration } from "./types/hcl-commerce.configuration.type";
import { HCLCommerceDatasourceConfiguration } from "./types/hcl-commerce.datasource.configuration";
import { HCLCommerceECToken } from "./types/hcl-commerce.ec-token.type";

export const HCLCommerceBaseDatasourcePathParams = {
    storeId: "{storeId}",
};

export abstract class HCLCommerceBaseRestDatasource extends BaseRestDatasource {
    protected getHost(requestContext: RequestContext, datasourceConfig: HCLCommerceDatasourceConfiguration, serviceDefinition: RestDatasourceServiceDefinition) {
        return datasourceConfig.host;
    }

    protected composeQueryParams(requestContext: RequestContext, datasourceConfig: HCLCommerceDatasourceConfiguration, queryParams: any) {
        const { configuration } = this.getPluginConsumerConfiguration<HCLCommerceConsumerConfiguration>(requestContext);

        queryParams = super.composeQueryParams(requestContext, datasourceConfig, queryParams);

        queryParams = {
            ...queryParams,
            catalogId: datasourceConfig.catalogId,
            langId: configuration.languageIds?.[requestContext.locale],
        };

        return queryParams;
    }

    protected composePath(requestContext: RequestContext, datasourceConfig: any, serviceDefinition: RestDatasourceServiceDefinition, paramMap: any) {
        paramMap[HCLCommerceBaseDatasourcePathParams.storeId] = datasourceConfig.storeId;

        return super.composePath(requestContext, datasourceConfig, serviceDefinition, paramMap);
    }

    protected addAuthTokenToHeaders(requestContext: RequestContext, datasourceConfig: HCLCommerceDatasourceConfiguration, headers: Record<string, any>, serviceDefinition: RestDatasourceServiceDefinition) {
        const token = this.getPluginToken<HCLCommerceECToken>(requestContext);

        if (token) {
            headers.WCToken = token.WCToken;
            headers.WCTrustedToken = token.WCTrustedToken;
        }

        return headers;
    }

    /**
     * HCL Search / storefront REST expect repeated keys for arrays (`id=1&id=2`), not bracket or CSV forms.
     */
    protected composeParamsSerializer(
        _requestContext: RequestContext,
        _datasourceConfig: HCLCommerceDatasourceConfiguration,
    ): ParamsSerializerOptions {
        return {
            indexes: null,
            serialize: (params: Record<string, unknown>) => {
                const segments: string[] = [];

                for (const key of Object.keys(params)) {
                    const value = params[key];

                    if (value === undefined || value === null || value === "") {
                        continue;
                    }

                    if (Array.isArray(value)) {
                        for (const item of value) {
                            if (item === undefined || item === null || item === "") {
                                continue;
                            }
                            segments.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(item))}`);
                        }
                        continue;
                    }

                    segments.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
                }

                const result = segments.join("&");

                return result;
            },
        };
    }
}
