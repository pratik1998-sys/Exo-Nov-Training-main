
import { RequestContext } from '@context/request';
import {
    TutorialPetRestPharmacy,
    TutorialPetRestPharmacyBodyCreate,
    TutorialPetRestPharmacyBodyUpdate,
    TutorialPetRestPharmacyQuery,
    TutorialPetRestPharmacyResultSet,
} from './schema/tutorial-pet-rest.pharmacy.schema';
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from '@plugin-datasource-rest';
import { TutorialPetRestBaseDatasource, TutorialPetRestBaseDatasourcePathParams } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.datasource';

export const TutorialPetRestPharmacyDatasourcePathParams = {
    ...TutorialPetRestBaseDatasourcePathParams,
};

export const pathRoot = 'pharmacy';
export const pathByIdentifier = `${pathRoot}/${TutorialPetRestPharmacyDatasourcePathParams.identifier}`;

export interface TutorialPetRestPharmacyDatasourceServiceDefinitions extends RestDatasourceServiceDefinitions {
    getPharmacies: RestDatasourceServiceDefinition;
    getPharmacy: RestDatasourceServiceDefinition;
    createPharmacy: RestDatasourceServiceDefinition;
    updatePharmacy: RestDatasourceServiceDefinition;
    deletePharmacy: RestDatasourceServiceDefinition;
}

export class TutorialPetRestPharmacyDatasource extends TutorialPetRestBaseDatasource {
    protected serviceDefinitions: TutorialPetRestPharmacyDatasourceServiceDefinitions = {
        getPharmacies: {
            id: 'getPharmacies',
            method: HttpMethods.get,
            path: pathRoot,
            timeout: 5000,
        },
        getPharmacy: {
            id: 'getPharmacy',
            method: HttpMethods.get,
            path: pathByIdentifier,
            timeout: 5000,
        },
        createPharmacy: {
            id: 'createPharmacy',
            method: HttpMethods.post,
            path: pathRoot,
            timeout: 5000,
        },
        updatePharmacy: {
            id: 'updatePharmacy',
            method: HttpMethods.put,
            path: pathByIdentifier,
            timeout: 5000,
        },
        deletePharmacy: {
            id: 'deletePharmacy',
            method: HttpMethods.delete,
            path: pathByIdentifier,
            timeout: 5000,
        },
    };

    async getPharmacies(requestContext: RequestContext, query: TutorialPetRestPharmacyQuery): Promise<TutorialPetRestPharmacyResultSet> {
        const methodname = `${TutorialPetRestPharmacyDatasource.name}.getPharmacies`;

        return await this.execute(requestContext, this.serviceDefinitions.getPharmacies, query);
    }

    async getPharmacy(requestContext: RequestContext, identifier: string): Promise<TutorialPetRestPharmacy> {
        const methodname = `${TutorialPetRestPharmacyDatasource.name}.getPharmacy`;

        const paramMap = {
            [TutorialPetRestPharmacyDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.getPharmacy, {}, {}, paramMap);
    }

    async createPharmacy(requestContext: RequestContext, body: TutorialPetRestPharmacyBodyCreate): Promise<TutorialPetRestPharmacy> {
        const methodname = `${TutorialPetRestPharmacyDatasource.name}.createPharmacy`;

        return await this.execute(requestContext, this.serviceDefinitions.createPharmacy, {}, {}, {}, body);
    }

    async updatePharmacy(requestContext: RequestContext, identifier: string, body: TutorialPetRestPharmacyBodyUpdate): Promise<TutorialPetRestPharmacy> {
        const methodname = `${TutorialPetRestPharmacyDatasource.name}.updatePharmacy`;

        const paramMap = {
            [TutorialPetRestPharmacyDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.updatePharmacy, {}, {}, paramMap, body);
    }

    async deletePharmacy(requestContext: RequestContext, identifier: string): Promise<TutorialPetRestPharmacy> {
        const methodname = `${TutorialPetRestPharmacyDatasource.name}.deletePharmacy`;

        const paramMap = {
            [TutorialPetRestPharmacyDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.deletePharmacy, {}, {}, paramMap);
    }
}
