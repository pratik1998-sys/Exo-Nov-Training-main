import { RequestContext } from "@context/request";
import {
    findOrderHistory,
    deleteOrderHistory,
    findOMSOrderDetailsByExternalOrderId,
    findByORMOrder,
    getOrderCommentsByOrderId,
    addCSROrderComments,
    processOMSOrderByExternalOrderId,
    findByBuyerId,
    getInventoryOverallAvailabilityByOrderId,
    findByOrderId,
    copyOMSOrderByExternalOrderId,
    ordersICanWorkonbehalf,
    findByStatus,
} from './schema/hcl-commerce.order.schema';
import { HCLCommerceBaseRestDatasource } from '@plugin-hcl-commerce/common';
import { RestDatasourceServiceDefinitions, HttpMethods, RestDatasourceServiceDefinition } from '@plugin-datasource-rest';

const HCLCommerceOrderDatasourcePathParams = {
    storeId: '{storeId}',
    extOrderId: '{extOrderId}',
    ORMOrder: '{ORMOrder}',
    orderId: '{orderId}',
    buyerId: '{buyerId}',
    status: '{status}',
};

export interface HCLCommerceOrderServiceDefinitions extends RestDatasourceServiceDefinitions {
    findOrderHistory: RestDatasourceServiceDefinition;
    deleteOrderHistory: RestDatasourceServiceDefinition;
    findOMSOrderDetailsByExternalOrderId: RestDatasourceServiceDefinition;
    findByORMOrder: RestDatasourceServiceDefinition;
    getOrderCommentsByOrderId: RestDatasourceServiceDefinition;
    addCSROrderComments: RestDatasourceServiceDefinition;
    processOMSOrderByExternalOrderId: RestDatasourceServiceDefinition;
    findByBuyerId: RestDatasourceServiceDefinition;
    getInventoryOverallAvailabilityByOrderId: RestDatasourceServiceDefinition;
    findByOrderId: RestDatasourceServiceDefinition;
    copyOMSOrderByExternalOrderId: RestDatasourceServiceDefinition;
    ordersICanWorkonbehalf: RestDatasourceServiceDefinition;
    findByStatus: RestDatasourceServiceDefinition;
}

export class HCLCommerceOrderDatasource extends HCLCommerceBaseRestDatasource {
    protected serviceDefinitions: HCLCommerceOrderServiceDefinitions = {
        findOrderHistory: {
            id: 'findOrderHistory',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/@history`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        deleteOrderHistory: {
            id: 'deleteOrderHistory',
            method: HttpMethods.delete,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/@history`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findOMSOrderDetailsByExternalOrderId: {
            id: 'findOMSOrderDetailsByExternalOrderId',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/oms_order/${HCLCommerceOrderDatasourcePathParams.extOrderId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findByORMOrder: {
            id: 'findByORMOrder',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/byORMOrder/${HCLCommerceOrderDatasourcePathParams.ORMOrder}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getOrderCommentsByOrderId: {
            id: 'getOrderCommentsByOrderId',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/${HCLCommerceOrderDatasourcePathParams.orderId}/comment`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        addCSROrderComments: {
            id: 'addCSROrderComments',
            method: HttpMethods.post,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/${HCLCommerceOrderDatasourcePathParams.orderId}/comment`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        processOMSOrderByExternalOrderId: {
            id: 'processOMSOrderByExternalOrderId',
            method: HttpMethods.post,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/process_oms_order/${HCLCommerceOrderDatasourcePathParams.extOrderId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findByBuyerId: {
            id: 'findByBuyerId',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/byBuyerId/${HCLCommerceOrderDatasourcePathParams.buyerId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getInventoryOverallAvailabilityByOrderId: {
            id: 'getInventoryOverallAvailabilityByOrderId',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/inventoryavailability/byOrderId/${HCLCommerceOrderDatasourcePathParams.orderId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findByOrderId: {
            id: 'findByOrderId',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/${HCLCommerceOrderDatasourcePathParams.orderId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        copyOMSOrderByExternalOrderId: {
            id: 'copyOMSOrderByExternalOrderId',
            method: HttpMethods.post,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/copy_oms_order/${HCLCommerceOrderDatasourcePathParams.extOrderId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        ordersICanWorkonbehalf: {
            id: 'ordersICanWorkonbehalf',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        findByStatus: {
            id: 'findByStatus',
            method: HttpMethods.get,
            path: `/store/${HCLCommerceOrderDatasourcePathParams.storeId}/order/byStatus/${HCLCommerceOrderDatasourcePathParams.status}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };

    async findOrderHistory(
        requestContext: RequestContext,
        queryParams?: findOrderHistory.Query,
        headers?: findOrderHistory.Header,
    ): Promise<findOrderHistory.Response._200 | findOrderHistory.Response._400 | findOrderHistory.Response._401 | findOrderHistory.Response._403 | findOrderHistory.Response._500> {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.findOrderHistory`;

        let result: findOrderHistory.Response._200 | findOrderHistory.Response._400 | findOrderHistory.Response._401 | findOrderHistory.Response._403 | findOrderHistory.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findOrderHistory, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findOrderHistory]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async deleteOrderHistory(
        requestContext: RequestContext,
        body?: deleteOrderHistory.Body,
        queryParams?: deleteOrderHistory.Query,
        headers?: deleteOrderHistory.Header,
    ): Promise<deleteOrderHistory.Response._200 | deleteOrderHistory.Response._400 | deleteOrderHistory.Response._401 | deleteOrderHistory.Response._403 | deleteOrderHistory.Response._500> {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.deleteOrderHistory`;

        let result: deleteOrderHistory.Response._200 | deleteOrderHistory.Response._400 | deleteOrderHistory.Response._401 | deleteOrderHistory.Response._403 | deleteOrderHistory.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.deleteOrderHistory, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [deleteOrderHistory]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findOMSOrderDetailsByExternalOrderId(
        requestContext: RequestContext,
        extOrderId: string,
        queryParams?: findOMSOrderDetailsByExternalOrderId.Query,
        headers?: findOMSOrderDetailsByExternalOrderId.Header,
    ): Promise<
        | findOMSOrderDetailsByExternalOrderId.Response._200
        | findOMSOrderDetailsByExternalOrderId.Response._400
        | findOMSOrderDetailsByExternalOrderId.Response._401
        | findOMSOrderDetailsByExternalOrderId.Response._403
        | findOMSOrderDetailsByExternalOrderId.Response._500
        | null
    > {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.findOMSOrderDetailsByExternalOrderId`;

        let result:
            | findOMSOrderDetailsByExternalOrderId.Response._200
            | findOMSOrderDetailsByExternalOrderId.Response._400
            | findOMSOrderDetailsByExternalOrderId.Response._401
            | findOMSOrderDetailsByExternalOrderId.Response._403
            | findOMSOrderDetailsByExternalOrderId.Response._500
            | null = null;

        let paramMap = {
            [HCLCommerceOrderDatasourcePathParams.extOrderId]: extOrderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findOMSOrderDetailsByExternalOrderId, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findOMSOrderDetailsByExternalOrderId]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findByORMOrder(
        requestContext: RequestContext,
        ORMOrder: string,
        queryParams?: findByORMOrder.Query,
        headers?: findByORMOrder.Header,
    ): Promise<findByORMOrder.Response._200 | findByORMOrder.Response._400 | findByORMOrder.Response._401 | findByORMOrder.Response._403 | findByORMOrder.Response._500> {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.findByORMOrder`;

        let result: findByORMOrder.Response._200 | findByORMOrder.Response._400 | findByORMOrder.Response._401 | findByORMOrder.Response._403 | findByORMOrder.Response._500 = null;

        let paramMap = {
            [HCLCommerceOrderDatasourcePathParams.ORMOrder]: ORMOrder,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findByORMOrder, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findByORMOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getOrderCommentsByOrderId(
        requestContext: RequestContext,
        orderId: string,
        queryParams?: getOrderCommentsByOrderId.Query,
        headers?: getOrderCommentsByOrderId.Header,
    ): Promise<
        | getOrderCommentsByOrderId.Response._200
        | getOrderCommentsByOrderId.Response._400
        | getOrderCommentsByOrderId.Response._401
        | getOrderCommentsByOrderId.Response._403
        | getOrderCommentsByOrderId.Response._500
    > {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.getOrderCommentsByOrderId`;

        let result:
            | getOrderCommentsByOrderId.Response._200
            | getOrderCommentsByOrderId.Response._400
            | getOrderCommentsByOrderId.Response._401
            | getOrderCommentsByOrderId.Response._403
            | getOrderCommentsByOrderId.Response._500 = null;

        let paramMap = {
            [HCLCommerceOrderDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getOrderCommentsByOrderId, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getOrderCommentsByOrderId]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async addCSROrderComments(
        requestContext: RequestContext,
        orderId: string,
        body: addCSROrderComments.Body,
        queryParams?: addCSROrderComments.Query,
        headers?: addCSROrderComments.Header,
    ): Promise<addCSROrderComments.Response._200 | addCSROrderComments.Response._400 | addCSROrderComments.Response._401 | addCSROrderComments.Response._403 | addCSROrderComments.Response._500> {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.addCSROrderComments`;

        let result: addCSROrderComments.Response._200 | addCSROrderComments.Response._400 | addCSROrderComments.Response._401 | addCSROrderComments.Response._403 | addCSROrderComments.Response._500 =
            null;

        let paramMap = {
            [HCLCommerceOrderDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.addCSROrderComments, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [addCSROrderComments]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async processOMSOrderByExternalOrderId(
        requestContext: RequestContext,
        extOrderId: string,
        body: processOMSOrderByExternalOrderId.Body,
        queryParams?: processOMSOrderByExternalOrderId.Query,
        headers?: processOMSOrderByExternalOrderId.Header,
    ): Promise<
        | processOMSOrderByExternalOrderId.Response._200
        | processOMSOrderByExternalOrderId.Response._400
        | processOMSOrderByExternalOrderId.Response._401
        | processOMSOrderByExternalOrderId.Response._403
        | processOMSOrderByExternalOrderId.Response._500
        | null
    > {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.processOMSOrderByExternalOrderId`;

        let result:
            | processOMSOrderByExternalOrderId.Response._200
            | processOMSOrderByExternalOrderId.Response._400
            | processOMSOrderByExternalOrderId.Response._401
            | processOMSOrderByExternalOrderId.Response._403
            | processOMSOrderByExternalOrderId.Response._500
            | null = null;

        let paramMap = {
            [HCLCommerceOrderDatasourcePathParams.extOrderId]: extOrderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.processOMSOrderByExternalOrderId, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [processOMSOrderByExternalOrderId]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findByBuyerId(
        requestContext: RequestContext,
        buyerId: string,
        queryParams?: findByBuyerId.Query,
        headers?: findByBuyerId.Header,
    ): Promise<findByBuyerId.Response._200 | findByBuyerId.Response._400 | findByBuyerId.Response._401 | findByBuyerId.Response._403 | findByBuyerId.Response._500> {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.findByBuyerId`;

        let result: findByBuyerId.Response._200 | findByBuyerId.Response._400 | findByBuyerId.Response._401 | findByBuyerId.Response._403 | findByBuyerId.Response._500 = null;

        let paramMap = {
            [HCLCommerceOrderDatasourcePathParams.buyerId]: buyerId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findByBuyerId, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findByBuyerId]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getInventoryOverallAvailabilityByOrderId(
        requestContext: RequestContext,
        orderId: string,
        queryParams?: getInventoryOverallAvailabilityByOrderId.Query,
        headers?: getInventoryOverallAvailabilityByOrderId.Header,
    ): Promise<
        | getInventoryOverallAvailabilityByOrderId.Response._200
        | getInventoryOverallAvailabilityByOrderId.Response._400
        | getInventoryOverallAvailabilityByOrderId.Response._401
        | getInventoryOverallAvailabilityByOrderId.Response._403
        | getInventoryOverallAvailabilityByOrderId.Response._404
        | getInventoryOverallAvailabilityByOrderId.Response._500
    > {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.getInventoryOverallAvailabilityByOrderId`;

        let result:
            | getInventoryOverallAvailabilityByOrderId.Response._200
            | getInventoryOverallAvailabilityByOrderId.Response._400
            | getInventoryOverallAvailabilityByOrderId.Response._401
            | getInventoryOverallAvailabilityByOrderId.Response._403
            | getInventoryOverallAvailabilityByOrderId.Response._404
            | getInventoryOverallAvailabilityByOrderId.Response._500 = null;

        let paramMap = {
            [HCLCommerceOrderDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getInventoryOverallAvailabilityByOrderId, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getInventoryOverallAvailabilityByOrderId]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findByOrderId(
        requestContext: RequestContext,
        orderId: string,
        queryParams?: findByOrderId.Query,
        headers?: findByOrderId.Header,
    ): Promise<findByOrderId.Response._200 | findByOrderId.Response._400 | findByOrderId.Response._401 | findByOrderId.Response._403 | findByOrderId.Response._404 | findByOrderId.Response._500> {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.findByOrderId`;

        let result: findByOrderId.Response._200 | findByOrderId.Response._400 | findByOrderId.Response._401 | findByOrderId.Response._403 | findByOrderId.Response._404 | findByOrderId.Response._500 =
            null;

        let paramMap = {
            [HCLCommerceOrderDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findByOrderId, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findByOrderId]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async copyOMSOrderByExternalOrderId(
        requestContext: RequestContext,
        extOrderId: string,
        body: copyOMSOrderByExternalOrderId.Body,
        queryParams?: copyOMSOrderByExternalOrderId.Query,
        headers?: copyOMSOrderByExternalOrderId.Header,
    ): Promise<
        | copyOMSOrderByExternalOrderId.Response._200
        | copyOMSOrderByExternalOrderId.Response._400
        | copyOMSOrderByExternalOrderId.Response._401
        | copyOMSOrderByExternalOrderId.Response._403
        | copyOMSOrderByExternalOrderId.Response._500
        | null
    > {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.copyOMSOrderByExternalOrderId`;

        let result:
            | copyOMSOrderByExternalOrderId.Response._200
            | copyOMSOrderByExternalOrderId.Response._400
            | copyOMSOrderByExternalOrderId.Response._401
            | copyOMSOrderByExternalOrderId.Response._403
            | copyOMSOrderByExternalOrderId.Response._500
            | null = null;

        let paramMap = {
            [HCLCommerceOrderDatasourcePathParams.extOrderId]: extOrderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.copyOMSOrderByExternalOrderId, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [copyOMSOrderByExternalOrderId]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async ordersICanWorkonbehalf(
        requestContext: RequestContext,
        queryParams?: ordersICanWorkonbehalf.Query,
        headers?: ordersICanWorkonbehalf.Header,
    ): Promise<
        ordersICanWorkonbehalf.Response._200 | ordersICanWorkonbehalf.Response._400 | ordersICanWorkonbehalf.Response._401 | ordersICanWorkonbehalf.Response._403 | ordersICanWorkonbehalf.Response._500
    > {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.ordersICanWorkonbehalf`;

        let result:
            | ordersICanWorkonbehalf.Response._200
            | ordersICanWorkonbehalf.Response._400
            | ordersICanWorkonbehalf.Response._401
            | ordersICanWorkonbehalf.Response._403
            | ordersICanWorkonbehalf.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.ordersICanWorkonbehalf, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [ordersICanWorkonbehalf]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async findByStatus(
        requestContext: RequestContext,
        status: string,
        queryParams?: findByStatus.Query,
        headers?: findByStatus.Header,
    ): Promise<findByStatus.Response._200 | findByStatus.Response._400 | findByStatus.Response._401 | findByStatus.Response._403 | findByStatus.Response._500> {
        const methodname: string = `${HCLCommerceOrderDatasource.name}.findByStatus`;

        let result: findByStatus.Response._200 | findByStatus.Response._400 | findByStatus.Response._401 | findByStatus.Response._403 | findByStatus.Response._500 = null;

        let paramMap = {
            [HCLCommerceOrderDatasourcePathParams.status]: status,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.findByStatus, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [findByStatus]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }
}
