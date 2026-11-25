import { RequestContext } from "@context/request";
import { RegionService, CountryResultSet, Country, StateResultSet, State } from "@feature-region";
import { PaginationInput } from "@feature/models";
import { SAPCommerceBaseServiceImpl } from "@plugin-sap-commerce/common";
import { SAPCommerceRegionCountryRegistry } from "./sap-commerce.region.country.registry";

export class SAPCommerceRegionServiceImpl extends SAPCommerceBaseServiceImpl implements RegionService {
    async getCountries(pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<CountryResultSet> {
        const methodname = `${SAPCommerceRegionServiceImpl.name}.getCountries`;

        const { consumer } = requestContext;

        const countries = this.getRegionCountryRegistry(requestContext).getCountries(consumer);

        return {
            pagination: {
                page: 1,
                pageCount: 1,
                pageSize: countries.length,
                hasMorePages: false,
                resultCount: countries.length,
            },
            results: countries,
        };
    }

    async getCountry(identifier: string, requestContext: RequestContext, context?: any): Promise<Country> {
        const methodname = `${SAPCommerceRegionServiceImpl.name}.getCountry`;

        const { consumer } = requestContext;

        return this.getRegionCountryRegistry(requestContext).getCountry(consumer, identifier);
    }

    async getCountryStates(countryIdentifier: string, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<StateResultSet> {
        const methodname = `${SAPCommerceRegionServiceImpl.name}.getCountryStates`;

        const country = await this.getCountry(countryIdentifier, requestContext);

        return {
            pagination: {
                page: 1,
                pageSize: country.states.length,
                hasMorePages: false,
                resultCount: country.states.length,
                pageCount: 1,
            },
            results: country.states,
        };
    }

    async getCountryState(countryIdentifier: string, stateIdentifier: string, requestContext: RequestContext, context?: any): Promise<State> {
        const methodname = `${SAPCommerceRegionServiceImpl.name}.getCountryState`;

        const stateResultSet = await this.getCountryStates(countryIdentifier, null, requestContext, context);

        return stateResultSet.results.find((state) => state.identifier == stateIdentifier);
    }

    protected getRegionCountryRegistry(requestContext: RequestContext) {
        return this.getRegistry<SAPCommerceRegionCountryRegistry>(requestContext, SAPCommerceRegionCountryRegistry);
    }
}
