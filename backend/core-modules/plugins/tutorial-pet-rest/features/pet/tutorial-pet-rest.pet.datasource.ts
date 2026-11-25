import { RequestContext } from '@context/request';
import { TutorialPetRestPet, TutorialPetRestPetBodyCreate, TutorialPetRestPetBodyUpdate, TutorialPetRestPetQuery, TutorialPetRestPetResultSet } from './schema/tutorial-pet-rest.pet.schema';
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from '@plugin-datasource-rest';
import { TutorialPetRestBaseDatasource, TutorialPetRestBaseDatasourcePathParams } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.datasource';

export const TutorialPetRestPetDatasourcePathParams = {
    ...TutorialPetRestBaseDatasourcePathParams,
};

export const pathRoot = 'pet';
export const pathByIdentifier = `${pathRoot}/${TutorialPetRestPetDatasourcePathParams.identifier}`;

export interface TutorialPetRestPetDatasourceServiceDefinitions extends RestDatasourceServiceDefinitions {
    getPets: RestDatasourceServiceDefinition;
    getPet: RestDatasourceServiceDefinition;
    createPet: RestDatasourceServiceDefinition;
    updatePet: RestDatasourceServiceDefinition;
    deletePet: RestDatasourceServiceDefinition;
}

export class TutorialPetRestPetDatasource extends TutorialPetRestBaseDatasource {
    protected serviceDefinitions: TutorialPetRestPetDatasourceServiceDefinitions = {
        getPets: {
            id: 'getPets',
            method: HttpMethods.get,
            path: pathRoot,
            timeout: 5000,
        },
        getPet: {
            id: 'getPet',
            method: HttpMethods.get,
            path: pathByIdentifier,
            timeout: 5000,
        },
        createPet: {
            id: 'createPet',
            method: HttpMethods.post,
            path: pathRoot,
            timeout: 5000,
        },
        updatePet: {
            id: 'updatePet',
            method: HttpMethods.put,
            path: pathByIdentifier,
            timeout: 5000,
        },
        deletePet: {
            id: 'deletePet',
            method: HttpMethods.delete,
            path: pathByIdentifier,
            timeout: 5000,
        },
    }

    async getPets(requestContext: RequestContext, query: TutorialPetRestPetQuery): Promise<TutorialPetRestPetResultSet> {
        const methodname = `${TutorialPetRestPetDatasource.name}.getPets`;

        return await this.execute(requestContext, this.serviceDefinitions.getPets, query);
    }

    async getPet(requestContext: RequestContext, identifier: string): Promise<TutorialPetRestPet> {
        const methodname = `${TutorialPetRestPetDatasource.name}.getPet`;

        const paramMap = {
            [TutorialPetRestPetDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.getPet, {}, {}, paramMap);
    }

    async createPet(requestContext: RequestContext, body: TutorialPetRestPetBodyCreate): Promise<TutorialPetRestPet> {
        const methodname = `${TutorialPetRestPetDatasource.name}.createPet`;

        return await this.execute(requestContext, this.serviceDefinitions.createPet, {}, {}, {}, body);
    }

    async updatePet(requestContext: RequestContext, identifier: string, body: TutorialPetRestPetBodyUpdate): Promise<TutorialPetRestPet> {
        const methodname = `${TutorialPetRestPetDatasource.name}.updatePet`;

        const paramMap = {
            [TutorialPetRestPetDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.updatePet, {}, {}, paramMap, body);
    }

    async deletePet(requestContext: RequestContext, identifier: string): Promise<TutorialPetRestPet> {
        const methodname = `${TutorialPetRestPetDatasource.name}.deletePet`;

        const paramMap = {
            [TutorialPetRestPetDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.deletePet, {}, {}, paramMap);
    }
}
