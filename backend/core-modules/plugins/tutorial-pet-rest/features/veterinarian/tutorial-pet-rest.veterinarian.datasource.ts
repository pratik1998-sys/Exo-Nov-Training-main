
import { RequestContext } from '@context/request';
import {
    TutorialPetRestVeterinarian,
    TutorialPetRestVeterinarianBodyCreate,
    TutorialPetRestVeterinarianBodyUpdate,
    TutorialPetRestVeterinarianQuery,
    TutorialPetRestVeterinarianResultSet,
} from './schema/tutorial-pet-rest.veterinarian.schema';
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from '@plugin-datasource-rest';
import { TutorialPetRestBaseDatasource, TutorialPetRestBaseDatasourcePathParams } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.datasource';

export const serviceIds = {
    getVeterinarians: 'getVeterinarians',
    getVeterinarian: 'getVeterinarian',
    createVeterinarian: 'createVeterinarian',
    updateVeterinarian: 'updateVeterinarian',
    deleteVeterinarian: 'deleteVeterinarian',
};

export const TutorialPetRestVeterinarianDatasourcePathParams = {
    ...TutorialPetRestBaseDatasourcePathParams,
};

export const pathRoot = 'veterinarian';
export const pathByIdentifier = `${pathRoot}/${TutorialPetRestVeterinarianDatasourcePathParams.identifier}`;

export interface TutorialPetRestVeterinarianDatasourceServiceDefinitions extends RestDatasourceServiceDefinitions {
    getVeterinarians: RestDatasourceServiceDefinition;
    getVeterinarian: RestDatasourceServiceDefinition;
    createVeterinarian: RestDatasourceServiceDefinition;
    updateVeterinarian: RestDatasourceServiceDefinition;
    deleteVeterinarian: RestDatasourceServiceDefinition;
}

export class TutorialPetRestVeterinarianDatasource extends TutorialPetRestBaseDatasource {
    protected serviceDefinitions: TutorialPetRestVeterinarianDatasourceServiceDefinitions = {
        getVeterinarians: {
            id: 'getVeterinarians',
            method: HttpMethods.get,
            path: pathRoot,
            timeout: 5000,
        },
        getVeterinarian: {
            id: 'getVeterinarian',
            method: HttpMethods.get,
            path: pathByIdentifier,
            timeout: 5000,
        },
        createVeterinarian: {
            id: 'createVeterinarian',
            method: HttpMethods.post,
            path: pathRoot,
            timeout: 5000,
        },
        updateVeterinarian: {
            id: 'updateVeterinarian',
            method: HttpMethods.put,
            path: pathByIdentifier,
            timeout: 5000,
        },
        deleteVeterinarian: {
            id: 'deleteVeterinarian',
            method: HttpMethods.delete,
            path: pathByIdentifier,
            timeout: 5000,
        },
    };

    async getVeterinarians(requestContext: RequestContext, query: TutorialPetRestVeterinarianQuery): Promise<TutorialPetRestVeterinarianResultSet> {
        const methodname = `${TutorialPetRestVeterinarianDatasource.name}.getVeterinarians`;

        return await this.execute(requestContext, this.serviceDefinitions.getVeterinarians, query);
    }

    async getVeterinarian(requestContext: RequestContext, identifier: string): Promise<TutorialPetRestVeterinarian> {
        const methodname = `${TutorialPetRestVeterinarianDatasource.name}.getVeterinarian`;

        const paramMap = {
            [TutorialPetRestVeterinarianDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.getVeterinarian, {}, {}, paramMap);
    }

    async createVeterinarian(requestContext: RequestContext, body: TutorialPetRestVeterinarianBodyCreate): Promise<TutorialPetRestVeterinarian> {
        const methodname = `${TutorialPetRestVeterinarianDatasource.name}.createVeterinarian`;

        return await this.execute(requestContext, this.serviceDefinitions.createVeterinarian, {}, {}, {}, body);
    }

    async updateVeterinarian(requestContext: RequestContext, identifier: string, body: TutorialPetRestVeterinarianBodyUpdate): Promise<TutorialPetRestVeterinarian> {
        const methodname = `${TutorialPetRestVeterinarianDatasource.name}.updateVeterinarian`;

        const paramMap = {
            [TutorialPetRestVeterinarianDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.updateVeterinarian, {}, {}, paramMap, body);
    }

    async deleteVeterinarian(requestContext: RequestContext, identifier: string): Promise<TutorialPetRestVeterinarian> {
        const methodname = `${TutorialPetRestVeterinarianDatasource.name}.deleteVeterinarian`;

        const paramMap = {
            [TutorialPetRestVeterinarianDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.deleteVeterinarian, {}, {}, paramMap);
    }
}
