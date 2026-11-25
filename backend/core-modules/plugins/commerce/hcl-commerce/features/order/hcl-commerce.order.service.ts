import { RequestContext } from "@context/request";
import { Order, OrderErrors, OrderFilterInput, OrderInput, OrderResultSet, OrderService, OrderStatus, OrderStatusResultSet } from "@feature-commerce/order";
import { PaginationInput, SortByInput } from "@feature/models";
import { HCLCommerceConsumerConfiguration } from "@plugin-hcl-commerce/common";
import { findOrderHistory } from "./schema/hcl-commerce.order.schema";
import { HCLCommerceOrderDatasource } from "./hcl-commerce.order.datasource";
import { HCLCommerceOrderMapper } from "./hcl-commerce.order.mapper";
import { HCLCommerceQuoteServiceImpl } from "@plugin-hcl-commerce/features/quote";

export class HCLCommerceOrderServiceImpl extends HCLCommerceQuoteServiceImpl implements OrderService {
    protected readonly orderStatuses: Record<string, string> = {
        Submitted: 'M',
        Pending: 'P',
        Cancelled: 'X',
    };

    async updateOrder(id: string, orderInput: OrderInput, requestContext: RequestContext, context?: any): Promise<Order> {
        throw new Error('Method not implemented.');
    }

    async getOrder(id: string, requestContext: RequestContext, context?: any): Promise<Order> {
        const methodname = `${HCLCommerceOrderServiceImpl.name}.getOrder`;

        const dsOrder = await this.fetchOrder(id, requestContext, context);

        return this.getMapper<HCLCommerceOrderMapper>(requestContext, HCLCommerceOrderMapper).mapOrder(requestContext, dsOrder);
    }

    async getOrders(isDetailed: boolean, filter: OrderFilterInput, pagination: PaginationInput, sortBy: SortByInput, requestContext: RequestContext, context?: any): Promise<OrderResultSet> {
        const methodname = `${HCLCommerceOrderServiceImpl.name}.getOrders`;

        let dsOrders;

        const { configuration } = this.getPluginConsumerConfiguration<HCLCommerceConsumerConfiguration>(requestContext);

        const query: findOrderHistory.Query = {
            pageNumber: pagination?.page ?? 1,
            pageSize: pagination?.pageSize ?? configuration.pagination?.pageSize?.default ?? 20,
        };

        const orderDS = this.getDatasource<HCLCommerceOrderDatasource>(requestContext, HCLCommerceOrderDatasource);

        try {
            if (filter?.statuses?.length > 0) {
                const dsStatus = this.orderStatuses[filter.statuses[0]] ?? filter.statuses[0];

                dsOrders = await orderDS.findByStatus(requestContext, dsStatus, query);
            } else {
                dsOrders = await orderDS.findOrderHistory(requestContext, query);
            }

            if (isDetailed) {
                const async = [];

                dsOrders?.Order?.forEach((dsOrder) => {
                    async.push(this.fetchOrder(dsOrder.orderId, requestContext, context));
                });

                if (async.length > 0) {
                    const results = await Promise.all(async);

                    dsOrders.Order = results;
                }
            }
        } catch (error) {
            this.logger.info(`${methodname} - Error getting orders: ${error}`, requestContext);
            throw OrderErrors.getOrdersFailed();
        }

        return this.getMapper<HCLCommerceOrderMapper>(requestContext, HCLCommerceOrderMapper).mapOrderResultSet(requestContext, dsOrders);
    }

    protected async fetchOrder(id: string, requestContext: RequestContext, context: any): Promise<any> {
        const methodname = `${HCLCommerceOrderServiceImpl.name}.fetchOrder`;

        let dsOrder;

        try {
            dsOrder = await this.getDatasource<HCLCommerceOrderDatasource>(requestContext, HCLCommerceOrderDatasource).findByOrderId(requestContext, id);

            await this.addProductsToItems(dsOrder, requestContext, context);
        } catch (error) {
            this.logger.info(`${methodname} - Error getting order ${id}: ${this.logger.formatJSON(error)}`, requestContext);
            throw OrderErrors.getOrderFailed();
        }

        return dsOrder;
    }

    async getOrderStatuses(pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<OrderStatusResultSet> {
        const orderStatuses: OrderStatus[] = [
            {
                id: 'M',
                identifier: 'M',
                description: 'Submitted',
            },
            {
                id: 'X',
                identifier: 'X',
                description: 'Cancelled',
            },
        ];

        return {
            pagination: {
                pageSize: orderStatuses.length,
                pageCount: 1,
                resultCount: orderStatuses.length,
                hasMorePages: false,
                page: 1,
            },
            results: orderStatuses,
        };
    }
}
