import { RequestContext } from '@context/request';
import { Cart, CartItem } from '@feature-commerce/cart';
import { ItemOption, ItemOptionValue, ItemQuoteCollectionPricing, ItemQuotePricing } from '@feature-commerce/common';
import { ShopifyBaseMapper } from '@plugin-shopify/common';

export class ShopifyCartMapper extends ShopifyBaseMapper {
    mapCart(data: any, requestContext: RequestContext): Cart {
        // Handle all possible mutation response paths from Shopify so ID doesn't change
        const rawCart = data?.cartCreate?.cart
            || data?.cartLinesAdd?.cart
            || data?.cartLinesUpdate?.cart
            || data?.cartLinesRemove?.cart
            || data?.cartBuyerIdentityUpdate?.cart
            || data?.cart;

        if (!rawCart) return null;

        const cart = new Cart();
        cart.id = rawCart.id;
        cart.checkoutUrl = rawCart.checkoutUrl;

        const edges = rawCart.lines?.edges ? Object.values(rawCart.lines.edges) : [];

        // Using your working structure for items
        cart.items = {
            results: edges.map((edge: any) => this.mapCartItem(edge?.node, requestContext)),
            pagination: { resultCount: edges.length } as any,
        } as any;

        // Using your working structure for itemQuantity
        cart.itemQuantity = edges.reduce((acc: number, edge: any) => acc + (edge?.node?.quantity || 0), 0) as number;

        if (rawCart.cost?.totalAmount) {
            cart.pricing = new ItemQuoteCollectionPricing();
            cart.pricing.total = {
                value: rawCart.cost.totalAmount.amount,
                currency: rawCart.cost.totalAmount.currencyCode,
            };
        }

        return cart;
    }

    private mapCartItem(node: any, requestContext: RequestContext): CartItem {
        if (!node) return null;

        const item = new CartItem();
        item.id = node.id;
        item.quantity = node.quantity;
        this.logger.debug('Mapping Cart Item');
        if (node.merchandise) {
            item.product = {
                id: node.merchandise.id,
                identifier: node.merchandise.sku,
                name: node.merchandise.product?.title,
                selectedOption: node.merchandise.selectedOptions,
                thumbnail: {
                    url: node.merchandise.image?.url || null,
                },
            } as any;

            // Surface the variant's selected options on the line item so the
            // storefront (e.g. minicart) can render them without a round-trip.
            const selectedOptions = node.merchandise.selectedOptions;
            if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
                item.options = selectedOptions.map((opt: any) => {
                    const option = new ItemOption();
                    option.identifier = opt?.name;
                    option.description = opt?.name;
                    const value = new ItemOptionValue();
                    value.identifier = opt?.value;
                    value.description = opt?.value;
                    option.value = value;
                    return option;
                });
            }
        }

        // Initialize the pricing model
        item.pricing = new ItemQuotePricing();

        // 1. Item Level Pricing (Unit Price)
        if (node.merchandise?.price) {
            item.pricing.price = {
                value: node.merchandise.price.amount,
                currency: node.merchandise.price.currencyCode,
            };
        }

        // 2. Row Level Pricing (Line Total)
        if (node.cost?.totalAmount) {
            item.pricing.amount = {
                value: node.cost.totalAmount.amount,
                currency: node.cost.totalAmount.currencyCode,
            };
        }

        return item;
    }
}
