import { RequestContext } from "@context/request";
import { Cart, CartItemResultSet, CartItem, CartShippingOptions } from "@feature-commerce/cart";
import { HCLCommerceAddressMapper } from "@plugin-hcl-commerce/features/address";
import { HCLCommerceQuoteMapper } from "@plugin-hcl-commerce/features/quote";

/**
 * When Order is implemented, a lot of this should be moved to QuoteMapper
 */
export class HCLCommerceCartMapper extends HCLCommerceQuoteMapper {
    mapCart(requestContext: RequestContext, dsCart: any): Cart {
        return this.mapQuote(requestContext, dsCart) as Cart;
    }

    mapCartItemsResultSet(requestContext: RequestContext, dsCart: any): CartItemResultSet {
        return this.mapQuoteItemsResultSet(requestContext, dsCart) as CartItemResultSet;
    }

    mapCartItem(requestContext: RequestContext, dsCart: any, dsOrderItem: any): CartItem {
        return this.mapQuoteItem(requestContext, dsCart, dsOrderItem) as CartItem;
    }

    mapCartShippingOptions(requestContext: RequestContext, dsShippingMethods: any[], dsShippingAddresses: any[]): CartShippingOptions {
        const cartShippingOptions: CartShippingOptions = {
            shippingMethods: dsShippingMethods ? dsShippingMethods.map((dsShippingMethod) => this.mapShippingMethod(requestContext, dsShippingMethod)) : [],
            addresses:
                dsShippingAddresses ?
                    dsShippingAddresses.map((dsAddress) => this.getMapper<HCLCommerceAddressMapper>(requestContext, HCLCommerceAddressMapper).mapAddress(requestContext, dsAddress))
                    : [],
        };

        return cartShippingOptions;
    }
}
