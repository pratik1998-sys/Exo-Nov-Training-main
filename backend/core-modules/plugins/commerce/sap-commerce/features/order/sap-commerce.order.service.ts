import { RequestContext } from "@context/request";
import { OrderService, OrderInput, Order, OrderStatusResultSet, OrderFilterInput, OrderResultSet, OrderErrors } from "@feature-commerce/order";
import { PaginationInput, SortByInput } from "@feature/models";
import { SAPCommerceBaseServiceImpl } from "@plugin-sap-commerce/common";
import { SAPCommerceOrderDatasource } from "./sap-commerce.order.datasource";
import { SAPCommerceOrderMapper } from "./sap-commerce.order.mapper";

export class SAPCommerceOrderServiceImpl extends SAPCommerceBaseServiceImpl implements OrderService {
    //TODO - Implement
    async updateOrder(id: string, orderInput: OrderInput, requestContext: RequestContext, context?: any): Promise<Order> {
        const methodname = `${SAPCommerceOrderServiceImpl.name}.updateOrder`;

        throw new Error('Method not implemented.');
    }

    //TODO - Implement
    async getOrderStatuses(pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<OrderStatusResultSet> {
        const methodname = `${SAPCommerceOrderServiceImpl.name}.getOrderStatuses`;

        return {
            pagination: {
                pageSize: 0,
                pageCount: 0,
                resultCount: 0,
                hasMorePages: false,
                page: 1,
            },
            results: [],
        };
    }

    async getOrder(id: string, requestContext: RequestContext, context?: any): Promise<Order> {
        const methodname = `${SAPCommerceOrderServiceImpl.name}.getOrder`;

        let dsOrder = null;

        try {
            if (this.isB2B(requestContext)) {
                dsOrder = await this.getB2BOrder(requestContext, id);
            } else {
                dsOrder = await this.getB2COrder(requestContext, id);
            }
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching order [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
            OrderErrors.getOrderFailed();
        }

        return this.getOrderMapper(requestContext).mapOrder(requestContext, dsOrder);
    }

    async getOrders(isDetailed: boolean, filter: OrderFilterInput, pagination: PaginationInput, sortBy: SortByInput, requestContext: RequestContext, context?: any): Promise<OrderResultSet> {
        const methodname = `${SAPCommerceOrderServiceImpl.name}.getOrders`;

        let dsOrderResultSet = null;

        const query: Record<string, string> = this.composeOrderQuery(requestContext, filter, pagination, sortBy);

        pagination = this.validatePagination(pagination, requestContext, false);

        const isB2B = this.isB2B(requestContext);
        try {
            if (isB2B) {
                dsOrderResultSet = await this.getB2BOrders(requestContext, query);
            } else {
                dsOrderResultSet = await this.getB2COrders(requestContext, query);
            }

            if (isDetailed) {
                const async = [];

                dsOrderResultSet?.orders?.forEach((dsOrder) => {
                    if (isB2B) {
                        async.push(this.getB2BOrder(requestContext, dsOrder.code));
                    } else {
                        async.push(this.getB2COrder(requestContext, dsOrder.code));
                    }
                });

                const results = await Promise.all(async);

                dsOrderResultSet.orders = results;
            }
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching orders: ${this.logger.formatJSON(error)}`, requestContext);
            OrderErrors.getOrdersFailed();
        }

        return this.getOrderMapper(requestContext).mapOrderResultSet(requestContext, dsOrderResultSet);
    }

    protected composeOrderQuery(requestContext: RequestContext, filter: OrderFilterInput, pagination: PaginationInput, sortBy: SortByInput): Record<string, string> {
        const methodname = `${SAPCommerceOrderServiceImpl.name}.composeOrderQuery`;

        const query: Record<string, any> = {
            currentPage: pagination?.page,
            pageSize: pagination?.pageSize,
        };

        if (filter?.statuses?.length > 0) {
            query.statuses = filter.statuses.join(',');
        }

        if (sortBy) {
            query.sort = `${sortBy.identifier}:${sortBy.isAscending ? 'asc' : 'desc'}`;
        }

        return query;
    }

    protected async getB2BOrders(requestContext: RequestContext, query: Record<string, any>) {
        return await this.getOrderDatasource(requestContext).getB2BOrders(requestContext, query);
    }

    protected async getB2COrders(requestContext: RequestContext, query: Record<string, any>) {
        return await this.getOrderDatasource(requestContext).getOrders(requestContext, query);
    }

    protected async getB2BOrder(requestContext: RequestContext, id: string) {
        return await this.getOrderDatasource(requestContext).getB2BOrder(requestContext, id);
    }

    protected async getB2COrder(requestContext: RequestContext, id: string) {
        return await this.getOrderDatasource(requestContext).getOrder(requestContext, id);
    }

    protected getOrderDatasource(requestContext: RequestContext) {
        return this.getDatasource<SAPCommerceOrderDatasource>(requestContext, SAPCommerceOrderDatasource);
    }

    protected getOrderMapper(requestContext: RequestContext) {
        return this.getMapper<SAPCommerceOrderMapper>(requestContext, SAPCommerceOrderMapper);
    }
}
