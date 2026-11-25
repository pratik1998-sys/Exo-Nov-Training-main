
import { RequestContext } from '@context/request';
import { TutorialPetRestUser, TutorialPetRestUserBodyCreate, TutorialPetRestUserBodyUpdate, TutorialPetRestUserQuery, TutorialPetRestUserResultSet } from './schema/tutorial-pet-rest.user.schema';
import { TutorialPetRestBaseDatasource, TutorialPetRestBaseDatasourcePathParams } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.datasource';
import { HttpMethods, RestDatasourceServiceDefinition, RestDatasourceServiceDefinitions } from '@plugin-datasource-rest';

export const serviceIds = {
    getUsers: 'getUsers',
    getUser: 'getUser',
    createUser: 'createUser',
    updateUser: 'updateUser',
    deleteUser: 'deleteUser',
};

export const TutorialPetRestUserDatasourcePathParams = {
    ...TutorialPetRestBaseDatasourcePathParams,
};

export const pathRoot = 'user';
export const pathByIdentifier = `${pathRoot}/${TutorialPetRestUserDatasourcePathParams.identifier}`;


export interface TutorialPetRestUserDatasourceServiceDefinitions extends RestDatasourceServiceDefinitions {
    getUsers: RestDatasourceServiceDefinition;
    getUser: RestDatasourceServiceDefinition;
    createUser: RestDatasourceServiceDefinition;
    updateUser: RestDatasourceServiceDefinition;
    deleteUser: RestDatasourceServiceDefinition;
}

export class TutorialPetRestUserDatasource extends TutorialPetRestBaseDatasource {
    protected serviceDefinitions: TutorialPetRestUserDatasourceServiceDefinitions = {
        getUsers: {
            id: 'getUsers',
            method: HttpMethods.get,
            path: pathRoot,
            timeout: 5000,
        },
        getUser: {
            id: 'getUser',
            method: HttpMethods.get,
            path: pathByIdentifier,
            timeout: 5000,
        },
        createUser: {
            id: 'createUser',
            method: HttpMethods.post,
            path: pathRoot,
            timeout: 5000,
        },
        updateUser: {
            id: 'updateUser',
            method: HttpMethods.put,
            path: pathByIdentifier,
            timeout: 5000,
        },
        deleteUser: {
            id: 'deleteUser',
            method: HttpMethods.delete,
            path: pathByIdentifier,
            timeout: 5000,
        },
    };

    async getUsers(requestContext: RequestContext, query: TutorialPetRestUserQuery): Promise<TutorialPetRestUserResultSet> {
        const methodname = `${TutorialPetRestUserDatasource.name}.getUsers`;

        return await this.execute(requestContext, this.serviceDefinitions.getUsers, query);
    }

    async getUser(requestContext: RequestContext, identifier: string): Promise<TutorialPetRestUser> {
        const methodname = `${TutorialPetRestUserDatasource.name}.getUsers`;

        const paramMap = {
            [TutorialPetRestUserDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.getUser, {}, {}, paramMap);
    }

    async createUser(requestContext: RequestContext, body: TutorialPetRestUserBodyCreate): Promise<TutorialPetRestUser> {
        const methodname = `${TutorialPetRestUserDatasource.name}.createUser`;

        return await this.execute(requestContext, this.serviceDefinitions.createUser, {}, {}, {}, body);
    }

    async updateUser(requestContext: RequestContext, identifier: string, body: TutorialPetRestUserBodyUpdate): Promise<TutorialPetRestUser> {
        const methodname = `${TutorialPetRestUserDatasource.name}.updateUser`;

        const paramMap = {
            [TutorialPetRestUserDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.updateUser, {}, {}, paramMap, body);
    }

    async deleteUser(requestContext: RequestContext, identifier: string): Promise<TutorialPetRestUser> {
        const methodname = `${TutorialPetRestUserDatasource.name}.deleteUser`;

        const paramMap = {
            [TutorialPetRestUserDatasourcePathParams.identifier]: identifier,
        };

        return await this.execute(requestContext, this.serviceDefinitions.deleteUser, {}, {}, paramMap);
    }
}
