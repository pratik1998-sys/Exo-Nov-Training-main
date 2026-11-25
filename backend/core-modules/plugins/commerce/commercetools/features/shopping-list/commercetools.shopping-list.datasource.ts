import { RequestContext } from '@context/request';
import {
    CommercetoolsBaseDatasource,
    CommercetoolsBaseDatasourcePathParams,
    CommercetoolsEntityActionRequest,
    CommercetoolsEntityQueryParams,
    CommercetoolsQueryParams,
    CommercetoolsServiceDefinition,
    CommercetoolsServiceDefinitions,
} from '@plugin-commercetools/common';
import { HttpMethods } from '@plugin-datasource-rest';
import { StringUtility } from '@utilities';
import { CommercetoolsShoppingList, CommercetoolsShoppingListDraft, CommercetoolsShoppingListResultSet } from './schema/commercetools.shopping-list.schema';

export interface CommercetoolsShoppingListServiceDefinitions extends CommercetoolsServiceDefinitions {
    queryShoppingLists: CommercetoolsServiceDefinition;
    getShoppingListById: CommercetoolsServiceDefinition;
    getShoppingListByKey: CommercetoolsServiceDefinition;
    createShoppingList: CommercetoolsServiceDefinition;
    deleteShoppingListById: CommercetoolsServiceDefinition;
    deleteShoppingListByKey: CommercetoolsServiceDefinition;
    updateShoppingListById: CommercetoolsServiceDefinition;
    updateShoppingListByKey: CommercetoolsServiceDefinition;
}

export class CommercetoolsShoppingListDatasource extends CommercetoolsBaseDatasource {
    protected serviceDefinitions: CommercetoolsShoppingListServiceDefinitions = {
        queryShoppingLists: {
            id: 'queryShoppingLists',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/shopping-lists`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/shopping-lists`,
            timeout: 10000,
        },
        getShoppingListById: {
            id: 'getShoppingListById',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/shopping-lists/${CommercetoolsBaseDatasourcePathParams.id}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/shopping-lists/${CommercetoolsBaseDatasourcePathParams.id}`,
            timeout: 10000,
        },
        getShoppingListByKey: {
            id: 'getShoppingListByKey',
            method: HttpMethods.get,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/shopping-lists/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/shopping-lists/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            timeout: 10000,
        },
        createShoppingList: {
            id: 'createShoppingList',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/shopping-lists`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/shopping-lists`,
            timeout: 10000,
        },
        deleteShoppingListById: {
            id: 'deleteShoppingListById',
            method: HttpMethods.delete,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/shopping-lists/${CommercetoolsBaseDatasourcePathParams.id}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/shopping-lists/${CommercetoolsBaseDatasourcePathParams.id}`,
            timeout: 10000,
        },
        deleteShoppingListByKey: {
            id: 'deleteShoppingListByKey',
            method: HttpMethods.delete,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/shopping-lists/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/shopping-lists/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            timeout: 10000,
        },
        updateShoppingListById: {
            id: 'updateShoppingListById',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/shopping-lists/${CommercetoolsBaseDatasourcePathParams.id}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/shopping-lists/${CommercetoolsBaseDatasourcePathParams.id}`,
            timeout: 10000,
        },
        updateShoppingListByKey: {
            id: 'updateShoppingListByKey',
            method: HttpMethods.post,
            path: `${CommercetoolsBaseDatasourcePathParams.projectKey}/shopping-lists/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            storePath: `${CommercetoolsBaseDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsBaseDatasourcePathParams.storeKey}/shopping-lists/key=${CommercetoolsBaseDatasourcePathParams.key}`,
            timeout: 10000,
        },
    };

    async queryShoppingLists(requestContext: RequestContext, query: CommercetoolsQueryParams): Promise<CommercetoolsShoppingListResultSet> {
        const methodname = `${CommercetoolsShoppingListDatasource.name}.queryShoppingLists`;
        try {
            return await this.execute(requestContext, this.serviceDefinitions.queryShoppingLists, query, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error querying shopping lists: ${error.message}`, requestContext);
            throw error;
        }
    }

    async getShoppingList(requestContext: RequestContext, id: string, key: string, query?: CommercetoolsEntityQueryParams): Promise<CommercetoolsShoppingList> {
        const methodname = `${CommercetoolsShoppingListDatasource.name}.getShoppingList`;

        let serviceDefinition = this.serviceDefinitions.getShoppingListById;

        if (StringUtility.isStringNotEmpty(key)) {
            serviceDefinition = this.serviceDefinitions.getShoppingListByKey;
        }

        const paramMap = {
            [CommercetoolsBaseDatasourcePathParams.id]: id,
            [CommercetoolsBaseDatasourcePathParams.key]: key,
        };

        try {
            return await this.execute(requestContext, serviceDefinition, query, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching shopping list [${id || key}]: ${error.message}`, requestContext);
            throw error;
        }
    }

    async createShoppingList(
        requestContext: RequestContext,
        body: CommercetoolsShoppingListDraft,
        query?: CommercetoolsEntityQueryParams,
    ): Promise<CommercetoolsShoppingList> {
        const methodname = `${CommercetoolsShoppingListDatasource.name}.createShoppingList`;
        try {
            return await this.execute(requestContext, this.serviceDefinitions.createShoppingList, query, {}, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating shopping list: ${error.message}`, requestContext);
            throw error;
        }
    }

    async deleteShoppingList(requestContext: RequestContext, id: string, key: string, query?: CommercetoolsEntityQueryParams): Promise<CommercetoolsShoppingList> {
        const methodname = `${CommercetoolsShoppingListDatasource.name}.deleteShoppingList`;

        let serviceDefinition = this.serviceDefinitions.deleteShoppingListById;

        if (StringUtility.isStringNotEmpty(key)) {
            serviceDefinition = this.serviceDefinitions.deleteShoppingListByKey;
        }

        const paramMap = {
            [CommercetoolsBaseDatasourcePathParams.id]: id,
            [CommercetoolsBaseDatasourcePathParams.key]: key,
        };

        try {
            return await this.execute(requestContext, serviceDefinition, query, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting shopping list [${id || key}]: ${error.message}`, requestContext);
            throw error;
        }
    }

    async updateShoppingList(
        requestContext: RequestContext,
        id: string,
        key: string,
        body: CommercetoolsEntityActionRequest,
        query: CommercetoolsEntityQueryParams,
    ): Promise<CommercetoolsShoppingList> {
        const methodname = `${CommercetoolsShoppingListDatasource.name}.updateShoppingList`;

        let serviceDefinition = this.serviceDefinitions.updateShoppingListById;

        if (StringUtility.isStringNotEmpty(key)) {
            serviceDefinition = this.serviceDefinitions.updateShoppingListByKey;
        }

        const paramMap = {
            [CommercetoolsBaseDatasourcePathParams.id]: id,
            [CommercetoolsBaseDatasourcePathParams.key]: key,
        };

        try {
            return await this.execute(requestContext, serviceDefinition, query, {}, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating shopping list [${id || key}]: ${error.message}`, requestContext);
            throw error;
        }
    }
}
