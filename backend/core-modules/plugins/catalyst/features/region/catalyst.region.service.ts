import { RequestContext } from "@context/request";
import { Country, CountryResultSet, RegionService, State, StateResultSet } from "@feature-region";
import { PaginationInput } from "@feature/models";
import { BasePluginServiceImpl } from "@plugin/service";
import { CatalystRegionData } from "core-modules/plugins/catalyst/features/region/catalyst.region.data";

export class CatalystRegionServiceImpl extends BasePluginServiceImpl implements RegionService {
    private countryResultSet: CountryResultSet;

    async getCountries(pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<CountryResultSet> {
        const methodname = `${CatalystRegionServiceImpl.name}.getCountries`;

        if (!this.countryResultSet) {
            this.countryResultSet = {
                pagination: {
                    page: 1,
                    pageCount: 1,
                    pageSize: CatalystRegionData.countries.length,
                    hasMorePages: false,
                    resultCount: CatalystRegionData.countries.length,
                },
                results: CatalystRegionData.countries.map((country) => {
                    return {
                        id: country.id,
                        identifier: country.id,
                        code: country.id,
                        name: country.name,
                        description: country.name,
                        states: country.states.map((state) => ({
                            id: state.id,
                            identifier: state.id,
                            code: state.id,
                            name: state.name,
                            description: state.name,
                        })),
                    };
                }),
            };
        }

        return this.countryResultSet;
    }

    async getCountry(identifier: string, requestContext: RequestContext, context?: any): Promise<Country> {
        const methodname = `${CatalystRegionServiceImpl.name}.getCountry`;

        const countryResultSet = await this.getCountries(null, requestContext, context);

        return countryResultSet.results.find((country) => country.identifier == identifier);
    }

    async getCountryStates(countryIdentifier: string, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<StateResultSet> {
        const methodname = `${CatalystRegionServiceImpl.name}.getCountryStates`;

        const country = await this.getCountry(countryIdentifier, requestContext, context);

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
        const methodname = `${CatalystRegionServiceImpl.name}.getCountryState`;

        const countryStateResultSet = await this.getCountryStates(countryIdentifier, null, requestContext, context);

        return countryStateResultSet.results.find((state) => state.identifier == stateIdentifier);
    }
}
