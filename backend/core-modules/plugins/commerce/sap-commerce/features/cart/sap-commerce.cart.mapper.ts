import { RequestContext } from "@context/request";
import { Cart, CartItem } from "@feature-commerce/cart";
import { ShippingMethod } from "@feature-commerce/common";
import { SAPCommerceDeliveryModes, SAPCommerceDeliveryMode } from "@plugin-sap-commerce/features/order";
import { components, SAPCommerceCart, SAPCommerceQuoteMapper } from "@plugin-sap-commerce/features/quote";

export class SAPCommerceCartMapper extends SAPCommerceQuoteMapper {
    mapCart(requestContext: RequestContext, dsCart: SAPCommerceCart): Cart {
        const cart: Cart = this.mapQuote(requestContext, dsCart);

        return cart;
    }

    mapShippingMethods(requestContext: RequestContext, dsDeliveryModes: SAPCommerceDeliveryModes): ShippingMethod[] {
        return dsDeliveryModes?.deliveryModes ? dsDeliveryModes.deliveryModes.map((dsDeliveryMode) => this.mapShippingMethod(requestContext, dsDeliveryMode)) : [];
    }

    mapShippingMethod(requestContext: RequestContext, dsDeliveryMode: SAPCommerceDeliveryMode): ShippingMethod {
        return dsDeliveryMode ?
            {
                id: dsDeliveryMode.code,
                identifier: dsDeliveryMode.code,
                name: dsDeliveryMode.name,
                description: dsDeliveryMode.description,
                amount: this.mapMoney(requestContext, dsDeliveryMode.deliveryCost?.value, dsDeliveryMode.deliveryCost?.currencyIso),
            }
            : null;
    }

    protected mapQuoteItem(requestContext: RequestContext, dsCartItem: components['schemas']['OrderEntry']) {
        const cartItem: CartItem = super.mapQuoteItem(requestContext, dsCartItem);

        return cartItem;
    }
}
