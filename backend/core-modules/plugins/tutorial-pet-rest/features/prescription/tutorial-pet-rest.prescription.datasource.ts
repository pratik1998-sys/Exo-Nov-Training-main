
import { RequestContext } from '@context/request';
import {
    TutorialPetRestPrescription,
    TutorialPetRestPrescriptionBodyCreate,
    TutorialPetRestPrescriptionBodyUpdate,
    TutorialPetRestPrescriptionQuery,
    TutorialPetRestPrescriptionResultSet,
} from './schema/tutorial-pet-rest.prescription.schema';
import { TutorialPetRestBaseDatasource, TutorialPetRestBaseDatasourcePathParams } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.datasource';
import { RestDatasourceServiceDefinitions, RestDatasourceServiceDefinition, HttpMethods } from '@plugin-datasource-rest';

export const TutorialPetRestPrescriptionDatasourcePathParams = {
    ...TutorialPetRestBaseDatasourcePathParams,
};

export const pathRoot = 'prescription';
export const pathByIdentifier = `${pathRoot}/${TutorialPetRestPrescriptionDatasourcePathParams.identifier}`;

export interface TutorialPetRestPrescriptionDatasourceServiceDefinitions extends RestDatasourceServiceDefinitions {
    getPrescriptions: RestDatasourceServiceDefinition;
    getPrescription: RestDatasourceServiceDefinition;
    createPrescription: RestDatasourceServiceDefinition;
    updatePrescription: RestDatasourceServiceDefinition;
    deletePrescription: RestDatasourceServiceDefinition;
}

export class TutorialPetRestPrescriptionDatasource extends TutorialPetRestBaseDatasource {
    protected serviceDefinitions: TutorialPetRestPrescriptionDatasourceServiceDefinitions = {
        getPrescriptions: {
            id: 'getPrescriptions',
            method: HttpMethods.get,
            path: pathRoot,
            timeout: 5000,
        },
        getPrescription: {
            id: 'getPrescription',
            method: HttpMethods.get,
            path: pathByIdentifier,
            timeout: 5000,
        },
        createPrescription: {
            id: 'createPrescription',
            method: HttpMethods.post,
            path: pathRoot,
            timeout: 5000,
        },
        updatePrescription: {
            id: 'updatePrescription',
            method: HttpMethods.put,
            path: pathByIdentifier,
            timeout: 5000,
        },
        deletePrescription: {
            id: 'deletePrescription',
            method: HttpMethods.delete,
            path: pathByIdentifier,
            timeout: 5000,
        },
    };

    async getPrescriptions(requestContext: RequestContext, query: TutorialPetRestPrescriptionQuery): Promise<TutorialPetRestPrescriptionResultSet> {
        const methodname = `${TutorialPetRestPrescriptionDatasource.name}.getPrescriptions`;

        return await this.execute(requestContext, this.serviceDefinitions.getPrescriptions, query);
    }

    async getPrescription(requestContext: RequestContext, identifier: string): Promise<TutorialPetRestPrescription> {
        const methodname = `${TutorialPetRestPrescriptionDatasource.name}.getPrescription`;

        const paramMap = {
            [TutorialPetRestPrescriptionDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.getPrescription, {}, {}, paramMap);
    }

    async createPrescription(requestContext: RequestContext, body: TutorialPetRestPrescriptionBodyCreate): Promise<TutorialPetRestPrescription> {
        const methodname = `${TutorialPetRestPrescriptionDatasource.name}.createPrescription`;

        return await this.execute(requestContext, this.serviceDefinitions.createPrescription, {}, {}, {}, body);
    }

    async updatePrescription(requestContext: RequestContext, identifier: string, body: TutorialPetRestPrescriptionBodyUpdate): Promise<TutorialPetRestPrescription> {
        const methodname = `${TutorialPetRestPrescriptionDatasource.name}.updatePrescription`;

        const paramMap = {
            [TutorialPetRestPrescriptionDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.updatePrescription, {}, {}, paramMap, body);
    }

    async deletePrescription(requestContext: RequestContext, identifier: string): Promise<TutorialPetRestPrescription> {
        const methodname = `${TutorialPetRestPrescriptionDatasource.name}.deletePrescription`;

        const paramMap = {
            [TutorialPetRestPrescriptionDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.deletePrescription, {}, {}, paramMap);
    }
}
