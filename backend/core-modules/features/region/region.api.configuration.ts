import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from "@api";
import { Country, CountryResultSet, RegionRequestParameters, State, StateResultSet } from "@feature-region";

export interface RegionApiOperations {
    countries: ApiOperationDefinition;
    country: ApiOperationDefinition;
    countryStates: ApiOperationDefinition;
    countryState: ApiOperationDefinition;
}

export class RegionApiConfiguration extends ApiConfiguration {
    static operations: RegionApiOperations = {
        countries: {
            id: 'regionCountries',
            description: 'Get country result set',
            summary: 'Get country result set',
            isAuthRequired: false,
            restOptions: {
                path: 'country',
                apiOkResponseOptions: {
                    type: CountryResultSet,
                },
                tags: [],
            },
            queryOptions: {},
        },
        country: {
            id: 'regionCountry',
            description: 'Get country by identifier',
            summary: 'Get country by identifier',
            isAuthRequired: false,
            restOptions: {
                isById: true,
                idPathParameter: RegionRequestParameters.identifier,
                path: `country/:${RegionRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Country,
                },
                tags: [],
            },
            queryOptions: {},
        },
        countryStates: {
            id: 'regionStates',
            description: 'Get country state result set by country identifier',
            summary: 'Get country state result set by country identifier',
            isAuthRequired: false,
            restOptions: {
                path: `country/:${RegionRequestParameters.identifier.id}/state`,
                pathParameters: [RegionRequestParameters.identifier],
                apiOkResponseOptions: {
                    type: StateResultSet,
                },
                tags: [],
            },
            queryOptions: {},
        },
        countryState: {
            id: 'regionState',
            description: 'Get country state by country identifier and state identifier',
            summary: 'Get country state by country identifier and state identifier',
            isAuthRequired: false,
            restOptions: {
                isById: true,
                pathParameters: [RegionRequestParameters.countryIdentifier, RegionRequestParameters.stateIdentifier],
                path: `country/:${RegionRequestParameters.countryIdentifier.id}/state/:${RegionRequestParameters.stateIdentifier.id}`,
                apiOkResponseOptions: {
                    type: State,
                },
                tags: [],
            },
            queryOptions: {},
        },
    };

    static countries(): ApiOperationOptions {
        return this.composeOperationOptions(RegionApiConfiguration.operations.countries);
    }

    static country(): ApiOperationOptions {
        return this.composeOperationOptions(RegionApiConfiguration.operations.country);
    }

    static countryStates(): ApiOperationOptions {
        return this.composeOperationOptions(RegionApiConfiguration.operations.countryStates);
    }

    static countryState(): ApiOperationOptions {
        return this.composeOperationOptions(RegionApiConfiguration.operations.countryState);
    }
}
