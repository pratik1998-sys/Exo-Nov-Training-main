
import { Pharmacy, PharmacyInput, PharmacyResultSet } from './pharmacy.model';
import { PharmacyRequestParameters } from './pharmacy.parameters';
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';

export interface PharmacyApiOperations {
    pharmacies: ApiOperationDefinition;
    pharmacy: ApiOperationDefinition;
    pharmacyCreate: ApiOperationDefinition;
    pharmacyUpdate: ApiOperationDefinition;
    pharmacyDelete: ApiOperationDefinition;
}

export class PharmacyApiConfiguration extends ApiConfiguration {
    static operations: PharmacyApiOperations = {
        pharmacies: {
            id: 'pharmacies',
            description: 'Get pharmacy result set',
            summary: 'Get pharmacy result set',
            restOptions: {
                apiOkResponseOptions: {
                    type: PharmacyResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        pharmacy: {
            id: 'pharmacy',
            description: 'Get pharmacy by identifier',
            summary: 'Get pharmacy by identifier',
            restOptions: {
                isById: true,
                idPathParameter: PharmacyRequestParameters.identifier,
                // path: `:${PharmacyRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Pharmacy,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        pharmacyCreate: {
            id: 'pharmacyCreate',
            description: 'Create pharmacy',
            summary: 'Create pharmacy',
            restOptions: {
                apiOkResponseOptions: {
                    type: Pharmacy,
                },
                apiBodyOptions: {
                    type: PharmacyInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        pharmacyUpdate: {
            id: 'pharmacyUpdate',
            description: 'Update pharmacy',
            summary: 'Update pharmacy',
            restOptions: {
                path: `:${PharmacyRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Pharmacy,
                },
                apiBodyOptions: {
                    type: PharmacyInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        pharmacyDelete: {
            id: 'pharmacyDelete',
            description: 'Delete pharmacy',
            summary: 'Delete pharmacy',
            restOptions: {
                path: `:${PharmacyRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Pharmacy,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
    };

    static pharmacies(): ApiOperationOptions {
        return this.composeOperationOptions(PharmacyApiConfiguration.operations.pharmacies);
    }

    static pharmacy(): ApiOperationOptions {
        return this.composeOperationOptions(PharmacyApiConfiguration.operations.pharmacy);
    }

    static pharmacyCreate(): ApiOperationOptions {
        return this.composeOperationOptions(PharmacyApiConfiguration.operations.pharmacyCreate);
    }

    static pharmacyUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(PharmacyApiConfiguration.operations.pharmacyUpdate);
    }

    static pharmacyDelete(): ApiOperationOptions {
        return this.composeOperationOptions(PharmacyApiConfiguration.operations.pharmacyDelete);
    }
}
