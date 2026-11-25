import { RequestContext } from "@context/request";
import { Country, CountryResultSet, RegionService, State, StateResultSet } from "@feature-region";
import { PaginationInput } from "@feature/models";
import { HCLCommerceBaseServiceImpl } from "@plugin-hcl-commerce/common";
import { HCLCommerceRegionCountryRegistry } from "./hcl-commerce.region.country.registry";

export class HCLCommerceRegionServiceImpl extends HCLCommerceBaseServiceImpl implements RegionService {
    async getCountries(pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<CountryResultSet> {
        const methodname = `${HCLCommerceRegionServiceImpl.name}.getCountries`;

        /*
        let dsCountries: HCLCommerceCountriesStates;

        try {
            dsCountries = await this.getDatasource<HCLCommerceRegionDatasource>(requestContext, HCLCommerceRegionDatasource).getCountries(requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching countries: ${error}`);
            throw RegionError.getCountriesFailed();
        }

        return this.getMapper<HCLCommerceRegionMapper>(requestContext, HCLCommerceRegionMapper).mapCountryResultSet(requestContext, dsCountries.countries);
        */

        const { consumer, locale } = requestContext;

        return this.getRegistry<HCLCommerceRegionCountryRegistry>(requestContext, HCLCommerceRegionCountryRegistry).getCountryResultSet(consumer, locale);
    }

    async getCountry(identifier: string, requestContext: RequestContext, context?: any): Promise<Country> {
        const methodname = `${HCLCommerceRegionServiceImpl.name}.getCountry`;

        /*
        let dsCountry: HCLCommerceCountry;

        try {
            dsCountry = await this.getDatasource<HCLCommerceRegionDatasource>(requestContext, HCLCommerceRegionDatasource).getCountry(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching country [${identifier}]: ${error}`);
            throw RegionError.getCountryFailed();
        }

        return this.getMapper<HCLCommerceRegionMapper>(requestContext, HCLCommerceRegionMapper).mapCountry(requestContext, dsCountry);
        */

        const { consumer, locale } = requestContext;

        return this.getRegistry<HCLCommerceRegionCountryRegistry>(requestContext, HCLCommerceRegionCountryRegistry).getCountry(consumer, locale, identifier);
    }

    async getCountryStates(countryIdentifier: string, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<StateResultSet> {
        const methodname = `${HCLCommerceRegionServiceImpl.name}.getCountryStates`;

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
        const methodname = `${HCLCommerceRegionServiceImpl.name}.getCountryState`;

        const stateResultSet = await this.getCountryStates(countryIdentifier, null, requestContext, context);

        return stateResultSet.results.find((state) => state.identifier == stateIdentifier);
    }
}
