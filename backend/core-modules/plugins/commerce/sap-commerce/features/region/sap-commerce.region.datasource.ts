import { RequestContext } from "@context/request";
import { RestDatasourceServiceDefinitions, HttpMethods, RestDatasourceServiceDefinition } from "@plugin-datasource-rest";
import { SAPCommerceBaseDatasourcePathParams, SAPCommerceBaseDatasource, GetCountries, GetCountryRegions } from "@plugin-sap-commerce/common";

const SAPCommerceRegionDatasourcePathParams = {
    ...SAPCommerceBaseDatasourcePathParams,
    countryISOCode: '{coutnryIsoCode}',
};

const countriesBasePath = `/occ/v2/${SAPCommerceRegionDatasourcePathParams.baseSiteId}/countries`;

export interface SAPCommerceRegionServiceDefinitions extends RestDatasourceServiceDefinitions {
    getCountries: RestDatasourceServiceDefinition;
    getCountryRegions: RestDatasourceServiceDefinition;
}

export class SAPCommerceRegionDatasource extends SAPCommerceBaseDatasource {
    protected serviceDefinitions: SAPCommerceRegionServiceDefinitions = {
        getCountries: {
            id: 'getCountries',
            method: HttpMethods.get,
            path: countriesBasePath,
            timeout: 5000,
        },
        getCountryRegions: {
            id: 'getCountryRegions',
            method: HttpMethods.get,
            path: `${countriesBasePath}/${SAPCommerceRegionDatasourcePathParams.countryISOCode}/regions`,
            timeout: 5000,
        },
    };

    async getCountries(requestContext: RequestContext): Promise<GetCountries.Response._200> {
        const methodname = `${SAPCommerceRegionDatasource.name}.getCountries`;

        return await this.executeRegionService(requestContext, this.serviceDefinitions.getCountries);
    }

    async getCountryRegions(requestContext: RequestContext, id: string): Promise<GetCountryRegions.Response._200> {
        const methodname = `${SAPCommerceRegionDatasource.name}.getCountryRegions`;

        const paramMap = {
            [SAPCommerceRegionDatasourcePathParams.countryISOCode]: id,
        };

        return await this.executeRegionService(requestContext, this.serviceDefinitions.getCountryRegions, {}, {}, paramMap);
    }

    protected async executeRegionService(
        requestContext: RequestContext,
        serviceDefinition: RestDatasourceServiceDefinition,
        queryParams?: Record<string, any>,
        headers?: Record<string, string>,
        paramMap?: Record<string, string>,
    ) {
        const methodname = `${SAPCommerceRegionDatasource.name}.executeRegionService`;

        let result;

        paramMap = paramMap ?? {};

        try {
            result = await this.execute(requestContext, serviceDefinition, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [${serviceDefinition.id}] - (${this.logger.formatJSON(paramMap)}): ${this.logger.formatJSON(error)}`, requestContext);
            throw error;
        }

        return result;
    }
}
