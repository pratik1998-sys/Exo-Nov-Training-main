import { RequestContext } from "@context/request";
import { Order, OrderStatus } from "@feature-commerce/order";
import { CommercetoolsState } from "@plugin-commercetools/common";
import { CommercetoolsOrder } from "./schema/commercetools.order.schema";
import { CommercetoolsQuoteMapper } from "@plugin-commercetools/features/quote";
import { CommercetoolsCustomer } from "@plugin-commercetools/features/ec-user";

export class CommercetoolsOrderMapper extends CommercetoolsQuoteMapper {
    mapResultSetEntity(requestContext: RequestContext, dsOrder: CommercetoolsOrder): Order {
        return this.mapOrder(requestContext, dsOrder);
    }

    mapOrder(requestContext: RequestContext, dsOrder: CommercetoolsOrder): Order {
        const order: Order = this.mapQuote(requestContext, dsOrder);

        order.identifier = dsOrder.orderNumber ?? dsOrder.id;
        order.orderNumber = dsOrder.orderNumber;
        order.purchaseOrderNumber = dsOrder.purchaseOrderNumber;
        order.status = dsOrder.orderState;

        return order;
    }

    mapOrderStatuses(requestContext: RequestContext, dsStates: CommercetoolsState[]): OrderStatus[] {
        return dsStates?.length ? dsStates.map((dsState) => this.mapOrderStatus(requestContext, dsState)) : [];
    }

    mapOrderStatus(requestContext: RequestContext, dsState: CommercetoolsState): OrderStatus {
        return dsState ?
            {
                id: dsState.id,
                identifier: dsState.key,
                name: this.resolveLocaleFieldValue(requestContext, dsState.name),
                description: this.resolveLocaleFieldValue(requestContext, dsState.description),
            }
            : {};
    }
    /*
    mapLineItem(requestContext: RequestContext, dsLineItem: CommercetoolsCartLineItem): CartItem {
        const lineItem: CartItem = super.mapLineItem(requestContext, dsLineItem);

        lineItem.estimatedShippingDate = null;

        return lineItem;
    }
    */
}
