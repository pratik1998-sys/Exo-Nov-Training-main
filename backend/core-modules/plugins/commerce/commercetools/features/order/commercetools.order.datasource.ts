import { RequestContext } from "@context/request";
import { CommercetoolsBaseDatasource, CommercetoolsBaseDatasourcePathParams, CommercetoolsEntityActionRequest, CommercetoolsEntityQueryParams, CommercetoolsQueryParams, CommercetoolsServiceDefinition, CommercetoolsServiceDefinitions, CommercetoolsStateResultSet } from "@plugin-commercetools/common";
import { CommercetoolsOrder, CommercetoolsOrderResultSet } from "./schema/commercetools.order.schema";
import { HttpMethods } from "@plugin-datasource-rest";
import { StringUtility } from "@utilities";

const CommercetoolsOrderDatasourcePathParams = {
    ...CommercetoolsBaseDatasourcePathParams,
    orderNumber: '{orderNumber}',
};

export interface CommercetoolsOrderServiceDefinitions extends CommercetoolsServiceDefinitions {
    getOrderById: CommercetoolsServiceDefinition;
    getOrderByOrderNumber: CommercetoolsServiceDefinition;
    queryOrders: CommercetoolsServiceDefinition;
    queryStates: CommercetoolsServiceDefinition;
    updateOrderById: CommercetoolsServiceDefinition;
    deleteOrderById: CommercetoolsServiceDefinition;
}

export class CommercetoolsOrderDatasource extends CommercetoolsBaseDatasource {
    protected serviceDefinitions: CommercetoolsOrderServiceDefinitions = {
        getOrderById: {
            id: 'getOrderById',
            method: HttpMethods.get,
            path: `${CommercetoolsOrderDatasourcePathParams.projectKey}/orders/${CommercetoolsOrderDatasourcePathParams.id}`,
            storePath: `${CommercetoolsOrderDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsOrderDatasourcePathParams.storeKey}/orders/${CommercetoolsOrderDatasourcePathParams.id}`,
            timeout: 5000,
        },
        getOrderByOrderNumber: {
            id: 'getOrderByOrderNumber',
            method: HttpMethods.get,
            path: `${CommercetoolsOrderDatasourcePathParams.projectKey}/orders/order-number=${CommercetoolsOrderDatasourcePathParams.orderNumber}`,
            storePath: `${CommercetoolsOrderDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsOrderDatasourcePathParams.storeKey}/orders/order-number=${CommercetoolsOrderDatasourcePathParams.orderNumber}`,
            timeout: 5000,
        },
        queryOrders: {
            id: 'queryOrders',
            method: HttpMethods.get,
            path: `${CommercetoolsOrderDatasourcePathParams.projectKey}/orders`,
            storePath: `${CommercetoolsOrderDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsOrderDatasourcePathParams.storeKey}/orders`,
            timeout: 5000,
        },
        queryStates: {
            id: 'queryStates',
            method: HttpMethods.get,
            path: `${CommercetoolsOrderDatasourcePathParams.projectKey}/states`,
            isAdminService: true,
            timeout: 5000,
        },
        updateOrderById: {
            id: 'updateOrderById',
            method: HttpMethods.post,
            path: `${CommercetoolsOrderDatasourcePathParams.projectKey}/orders/${CommercetoolsOrderDatasourcePathParams.id}`,
            storePath: `${CommercetoolsOrderDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsOrderDatasourcePathParams.storeKey}/orders/${CommercetoolsOrderDatasourcePathParams.id}`,
            isAdminService: true,
            timeout: 5000,
        },
        deleteOrderById: {
            id: 'deleteOrderById',
            method: HttpMethods.delete,
            path: `${CommercetoolsOrderDatasourcePathParams.projectKey}/orders/${CommercetoolsOrderDatasourcePathParams.id}`,
            storePath: `${CommercetoolsOrderDatasourcePathParams.projectKey}/in-store/key=${CommercetoolsOrderDatasourcePathParams.storeKey}/orders/${CommercetoolsOrderDatasourcePathParams.id}`,
            isAdminService: true,
            timeout: 5000,
        },
    };

    async getOrder(requestContext: RequestContext, id: string, orderNumber: string, query?: CommercetoolsEntityQueryParams): Promise<CommercetoolsOrder> {
        const methodname = `${CommercetoolsOrderDatasource.name}.getOrder`;

        let dsResult: CommercetoolsOrder = null;

        let serviceDefinition = this.serviceDefinitions.getOrderByOrderNumber;

        if (StringUtility.isStringNotEmpty(id)) {
            serviceDefinition = this.serviceDefinitions.getOrderById;
        }

        const paramMap = {
            [CommercetoolsOrderDatasourcePathParams.id]: id,
            [CommercetoolsOrderDatasourcePathParams.orderNumber]: orderNumber,
        };

        try {
            dsResult = await this.execute(requestContext, serviceDefinition, query, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching order [${id || orderNumber}] (${serviceDefinition.id}): ${this.logger.formatJSON(error.message)}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async updateOrder(requestContext: RequestContext, id: string, body: CommercetoolsEntityActionRequest, query?: CommercetoolsEntityQueryParams): Promise<CommercetoolsOrder> {
        const methodname = `${CommercetoolsOrderDatasource.name}.updateOrder`;

        let dsResult: CommercetoolsOrder = null;

        const paramMap = {
            [CommercetoolsOrderDatasourcePathParams.id]: id,
        };

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.updateOrderById, query, {}, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating order [${id}] - ${this.logger.formatJSON(body)}: ${this.logger.formatJSON(error.message)}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async deleteOrder(requestContext: RequestContext, id: string, query: CommercetoolsEntityQueryParams): Promise<CommercetoolsOrder> {
        const methodname = `${CommercetoolsOrderDatasource.name}.deleteOrder`;

        let dsResult: CommercetoolsOrder = null;

        const paramMap = {
            [CommercetoolsOrderDatasourcePathParams.id]: id,
        };

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.deleteOrderById, query, {}, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting order [${id}]: ${this.logger.formatJSON(error.message)}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async getOrders(requestContext: RequestContext, query?: CommercetoolsQueryParams): Promise<CommercetoolsOrderResultSet> {
        const methodname = `${CommercetoolsOrderDatasource.name}.getOrders`;

        let dsResult: CommercetoolsOrderResultSet = null;

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.queryOrders, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching orders - ${this.logger.formatJSON(query)}: ${this.logger.formatJSON(error.message)}`, requestContext);
            throw error;
        }

        return dsResult;
    }

    async getOrderStates(requestContext: RequestContext): Promise<CommercetoolsStateResultSet> {
        const methodname = `${CommercetoolsBaseDatasource.name}.getOrderStates`;

        let dsResult: CommercetoolsStateResultSet = null;

        const query: CommercetoolsQueryParams = {
            where: ['type = "OrderState"'],
        };

        try {
            dsResult = await this.execute(requestContext, this.serviceDefinitions.queryStates, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching order states - ${this.logger.formatJSON(query)}: ${this.logger.formatJSON(error.message)}`, requestContext);
            throw error;
        }

        return dsResult;
    }
}
