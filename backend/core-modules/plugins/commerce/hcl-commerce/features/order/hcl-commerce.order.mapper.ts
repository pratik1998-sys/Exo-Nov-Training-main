import { RequestContext } from "@context/request";
import { Order, OrderResultSet } from "@feature-commerce/order";
import { HCLCommerceQuoteMapper } from "@plugin-hcl-commerce/features/quote";

export class HCLCommerceOrderMapper extends HCLCommerceQuoteMapper {
    mapOrderResultSet(requestContext: RequestContext, dsOrderResultSet: any): OrderResultSet {
        const orderResultSet: OrderResultSet = {
            pagination: this.mapPagination(requestContext, dsOrderResultSet),
            results: dsOrderResultSet.Order ? dsOrderResultSet.Order.map((dsOrder) => this.mapOrder(requestContext, dsOrder)) : [],
        };

        return orderResultSet;
    }

    mapOrder(requestContext: RequestContext, dsOrder: any): Order {
        const order = this.mapQuote(requestContext, dsOrder) as Order;

        order.orderNumber = dsOrder.orderId;

        return order;
    }
}
