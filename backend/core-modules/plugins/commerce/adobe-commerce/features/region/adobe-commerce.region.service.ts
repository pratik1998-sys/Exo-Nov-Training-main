import { RequestContext } from "@context/request";
import { RegionService, CountryResultSet, Country, StateResultSet, State } from "@feature-region";
import { PaginationInput } from "@feature/models";
import { AdobeCommerceBaseServiceImpl } from "@plugin-adobe-commerce/common";
import { AdobeCommerceRegionCountryRegistry } from "./adobe-commerce.region.country.registry";

export class AdobeCommerceRegionServiceImpl extends AdobeCommerceBaseServiceImpl implements RegionService {
    async getCountries(pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<CountryResultSet> {
        const methodname = `${AdobeCommerceRegionServiceImpl.name}.getCountries`;

        /*
        let dsCountries: AdobeCommerceCountry[];

        try {
            dsCountries = await this.getDatasource<AdobeCommerceRegionDatasource>(requestContext, AdobeCommerceRegionDatasource).getCountries(requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching countries: ${error}`);
            throw RegionError.getCountriesFailed();
        }

        return this.getMapper<AdobeCommerceRegionMapper>(requestContext, AdobeCommerceRegionMapper).mapCountryResultSet(requestContext, dsCountries);
        */

        const { consumer, locale } = requestContext;

        return this.getRegistry<AdobeCommerceRegionCountryRegistry>(requestContext, AdobeCommerceRegionCountryRegistry).getCountryResultSet(consumer, locale);
    }

    async getCountry(identifier: string, requestContext: RequestContext, context?: any): Promise<Country> {
        const methodname = `${AdobeCommerceRegionServiceImpl.name}.getCountry`;

        /*
        let dsCountry: AdobeCommerceCountry;

        try {
            dsCountry = await this.getDatasource<AdobeCommerceRegionDatasource>(requestContext, AdobeCommerceRegionDatasource).getCountry(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching country [${identifier}]: ${error}`);
            throw RegionError.getCountryFailed();
        }

        return this.getMapper<AdobeCommerceRegionMapper>(requestContext, AdobeCommerceRegionMapper).mapCountry(requestContext, dsCountry);
        */

        const { consumer, locale } = requestContext;

        return this.getRegistry<AdobeCommerceRegionCountryRegistry>(requestContext, AdobeCommerceRegionCountryRegistry).getCountry(consumer, locale, identifier);
    }

    async getCountryStates(countryIdentifier: string, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<StateResultSet> {
        const methodname = `${AdobeCommerceRegionServiceImpl.name}.getCountryStates`;

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
        const methodname = `${AdobeCommerceRegionServiceImpl.name}.getCountryState`;

        const stateResultSet = await this.getCountryStates(countryIdentifier, null, requestContext, context);

        return stateResultSet.results.find((state) => state.identifier == stateIdentifier);
    }
}
