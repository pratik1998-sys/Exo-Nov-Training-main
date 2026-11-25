import { PrescriptionRequestParameters } from './prescription.parameters';
import { Prescription, PrescriptionInput, PrescriptionResultSet } from './prescription.model';
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';

export interface PrescriptionApiOperations {
    prescriptions: ApiOperationDefinition;
    prescription: ApiOperationDefinition;
    prescriptionCreate: ApiOperationDefinition;
    prescriptionUpdate: ApiOperationDefinition;
    prescriptionDelete: ApiOperationDefinition;
}

export class PrescriptionApiConfiguration extends ApiConfiguration {
    static operations: PrescriptionApiOperations = {
        prescriptions: {
            id: 'prescriptions',
            description: 'Get prescription result set',
            summary: 'Get prescription result set',
            restOptions: {
                apiOkResponseOptions: {
                    type: PrescriptionResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        prescription: {
            id: 'prescription',
            description: 'Get prescription by identifier',
            summary: 'Get prescription by identifier',
            restOptions: {
                isById: true,
                idPathParameter: PrescriptionRequestParameters.identifier,
                // path: `:${PrescriptionRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Prescription,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        prescriptionCreate: {
            id: 'prescriptionCreate',
            description: 'Create prescription',
            summary: 'Create prescription',
            restOptions: {
                apiOkResponseOptions: {
                    type: Prescription,
                },
                apiBodyOptions: {
                    type: PrescriptionInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        prescriptionUpdate: {
            id: 'prescriptionUpdate',
            description: 'Update prescription',
            summary: 'Update prescription',
            restOptions: {
                path: `:${PrescriptionRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Prescription,
                },
                apiBodyOptions: {
                    type: PrescriptionInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        prescriptionDelete: {
            id: 'prescriptionDelete',
            description: 'Delete prescription',
            summary: 'Delete prescription',
            restOptions: {
                path: `:${PrescriptionRequestParameters.identifier.id}`,
                apiOkResponseOptions: {
                    type: Prescription,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
    };

    static prescriptions(): ApiOperationOptions {
        return this.composeOperationOptions(PrescriptionApiConfiguration.operations.prescriptions);
    }

    static prescription(): ApiOperationOptions {
        return this.composeOperationOptions(PrescriptionApiConfiguration.operations.prescription);
    }

    static prescriptionCreate(): ApiOperationOptions {
        return this.composeOperationOptions(PrescriptionApiConfiguration.operations.prescriptionCreate);
    }

    static prescriptionUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(PrescriptionApiConfiguration.operations.prescriptionUpdate);
    }

    static prescriptionDelete(): ApiOperationOptions {
        return this.composeOperationOptions(PrescriptionApiConfiguration.operations.prescriptionDelete);
    }
}
