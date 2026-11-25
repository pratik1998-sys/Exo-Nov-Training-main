import { RequestContext } from "@context/request";
import { Order, OrderFilterInput, OrderInput, OrderResultSet, OrderStatusResultSet } from "./order.model";
import { PaginationInput, SortByInput } from "@feature/models";
import { BaseFeatureService } from "@feature/service";

export abstract class OrderService extends BaseFeatureService {
    //abstract getOrderHistory(input: CustomerOrderHistoryInput, requestContext: RequestContext, context?: any): Promise<CustomerOrderHistoryOutput[]>;
    abstract getOrder(id: string, requestContext: RequestContext, context?: any): Promise<Order>;
    abstract getOrders(isDetailed: boolean, filter: OrderFilterInput, pagination: PaginationInput, sortBy: SortByInput, requestContext: RequestContext, context?: any): Promise<OrderResultSet>;

    abstract updateOrder(id: string, orderInput: OrderInput, requestContext: RequestContext, context?: any): Promise<Order>;

    // abstract submitOrder(id: string, requestContext: RequestContext, context?: any): Promise<Order>;

    abstract getOrderStatuses(pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<OrderStatusResultSet>;
}
