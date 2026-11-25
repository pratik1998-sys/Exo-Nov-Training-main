import { RequestContext } from "@context/request";
import { Cart, CartItem } from "@feature-commerce/cart";
import { ShippingMethod } from "@feature-commerce/common";
import { CommercetoolsCart, CommercetoolsCartLineItem } from "./schema/commercetools.cart.schema";
import { CommercetoolsQuoteMapper, CommercetoolsShippingMethod } from "@plugin-commercetools/features/quote";
import { CommercetoolsCustomer } from "@plugin-commercetools/features/ec-user";

export class CommercetoolsCartMapper extends CommercetoolsQuoteMapper {
    mapResultSetEntity(requestContext: RequestContext, dsCart: CommercetoolsCart): Cart {
        return this.mapCart(requestContext, dsCart);
    }

    mapCart(requestContext: RequestContext, dsCart: CommercetoolsCart): Cart {
        const cart: Cart = this.mapQuote(requestContext, dsCart);

        return cart;
    }

    mapLineItem(requestContext: RequestContext, dsLineItem: CommercetoolsCartLineItem): CartItem {
        const lineItem: CartItem = super.mapLineItem(requestContext, dsLineItem);

        lineItem.estimatedShippingDate = null;

        return lineItem;
    }

    mapShippingMethods(requestContext, dsShippingMethods: CommercetoolsShippingMethod[]): ShippingMethod[] {
        return dsShippingMethods.length > 0 ? dsShippingMethods.map((dsShippingMethod) => this.mapShippingMethod(requestContext, dsShippingMethod)) : [];
    }
}
