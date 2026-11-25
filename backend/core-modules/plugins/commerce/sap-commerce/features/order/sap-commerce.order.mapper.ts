import { RequestContext } from "@context/request";
import { OrderResultSet, Order, OrderItem } from "@feature-commerce/order";
import { components, SAPCommerceQuoteMapper } from "@plugin-sap-commerce/features/quote";

export class SAPCommerceOrderMapper extends SAPCommerceQuoteMapper {
    mapOrderResultSet(requestContext: RequestContext, dsOrderResultSet: any): OrderResultSet {
        const page = dsOrderResultSet?.pagination?.currentPage ? dsOrderResultSet?.pagination?.currentPage + 1 : 1;
        const pageCount = dsOrderResultSet?.pagination?.totalPages ?? 1;
        const pageSize = dsOrderResultSet?.pagination?.pageSize ?? 0;
        const resultCount = dsOrderResultSet?.pagination?.totalResults ?? 0;

        return {
            pagination: {
                page,
                pageCount,
                pageSize,
                hasMorePages: page < pageCount,
                resultCount,
            },
            results: dsOrderResultSet?.orders ? dsOrderResultSet.orders.map((dsOrder) => this.mapOrder(requestContext, dsOrder)) : [],
        };
    }

    mapOrder(requestContext: RequestContext, dsOrder: any): Order {
        const order: Order = this.mapQuote(requestContext, dsOrder);

        return order;
    }

    protected mapQuoteItem(requestContext: RequestContext, dsOrderItem: components['schemas']['OrderEntry']) {
        const orderItem: OrderItem = super.mapQuoteItem(requestContext, dsOrderItem);

        return orderItem;
    }
}
