import { RequestContext } from "@context/request";
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from "@plugin-datasource-rest";
import { HCLCommerceBaseDatasourcePathParams, HCLCommerceBaseRestDatasource } from "@plugin-hcl-commerce/common";
import { HCLCommerceCountriesStates } from "./types/hcl-commerce.region.type";

const HCLCommerceCartDatasourcePathParams = {
    ...HCLCommerceBaseDatasourcePathParams,
};

export interface HCLCommerceRegionServiceDefinitions extends RestDatasourceServiceDefinitions {
    getCountryStateList: RestDatasourceServiceDefinition;
}

export class HCLCommerceRegionDatasource extends HCLCommerceBaseRestDatasource {
    protected serviceDefinitions: HCLCommerceRegionServiceDefinitions = {
        getCountryStateList: {
            id: 'getCountryStateList',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/country/country_state_list`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };

    async getCountries(requestContext: RequestContext): Promise<HCLCommerceCountriesStates> {
        const methodname = `${HCLCommerceRegionDatasource.name}.getCountries`;

        return await this.executeGetCountriesStates(requestContext);
    }

    async getCountry(requestContext: RequestContext, identifier: string): Promise<any> {
        const methodname = `${HCLCommerceRegionDatasource.name}.getCountry`;

        const dsResult = await this.executeGetCountriesStates(requestContext);

        return dsResult.countries.find((dsCountry) => dsCountry.code == identifier);
    }

    protected async executeGetCountriesStates(requestContext: RequestContext, query: Record<string, string> = {}): Promise<HCLCommerceCountriesStates> {
        const methodname = `${HCLCommerceRegionDatasource.name}.executeGetCountriesStates`;

        let dsResult = null;

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.getCountryStateList, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching countries [${this.logger.formatJSON(query)}]: ${error.message}`, requestContext);
            throw error;
        }

        return dsResult;
    }
}
