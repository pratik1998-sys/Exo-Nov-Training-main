import { RequestContext } from '@context/request';
import { Cart, CartItem, CartItemResultSet } from '@feature-commerce/cart';
import { HCLCommerceQuoteMapper } from '@plugin-hcl-commerce/features/quote';
import { Product } from '@feature-commerce/product';

/**
 * When Order is implemented, a lot of this should be moved to QuoteMapper
 */
export class HCLCommerceCartGQLMapper extends HCLCommerceQuoteMapper {
    mapCart(requestContext: RequestContext, dsCart: any): Cart {
        let cart: Cart = {};

        if (dsCart) {
            const productTotal = parseFloat(dsCart.totalProductPrice);
            const taxTotal = parseFloat(dsCart.totalSalesTax);
            const adjustmentTotal = parseFloat(dsCart.totalAdjustment);

            let itemQuantity = 0;

            dsCart.orderItem.forEach((dsOrderItem) => {
                itemQuantity += parseFloat(dsOrderItem.quantity);
            });

            cart = {
                email: '',
                coupons: [],
                id: dsCart.orderId,
                identifier: dsCart.id,
                itemQuantity,
                items: this.mapCartItemsResultSet(requestContext, dsCart),
                pricing: {
                    total: this.mapPrice(requestContext, dsCart.grandTotal, dsCart.grandTotalCurrency),
                    shipping: this.mapPrice(requestContext, dsCart.totalShippingCharge, dsCart.totalShippingChargeCurrency),
                    adjustment: this.mapPrice(requestContext, dsCart.totalAdjustment, dsCart.totalAdjustmentCurrency),
                    tax: this.mapPrice(requestContext, dsCart.totalSalesTax, dsCart.totalSalesTaxCurrency),
                    amount: this.mapPrice(requestContext, dsCart.totalProductPrice, dsCart.totalProductPriceCurrency),
                    amountWithTax: this.mapPrice(requestContext, `${productTotal + taxTotal}`, dsCart.totalProductPriceCurrency),
                    amountWithAdjustment: this.mapPrice(requestContext, `${productTotal + adjustmentTotal}`, dsCart.totalProductPriceCurrency),
                    amountWithTaxAndAdjustment: this.mapPrice(requestContext, `${productTotal + adjustmentTotal + taxTotal}`, dsCart.totalProductPriceCurrency),
                    adjustments: [],
                    taxes: [],
                },
            };
        }

        return cart;
    }

    mapCartItemsResultSet(requestContext: RequestContext, dsCart: any): CartItemResultSet {
        const resultSet: CartItemResultSet = {
            pagination: {
                hasMorePages: false,
                resultCount: dsCart.orderItem.length,
                page: 1,
                pageCount: 1,
                pageSize: dsCart.orderItem.length,
            },
            results: dsCart.orderItem.map((dsOrderItem) => this.mapCartItem(requestContext, dsCart, dsOrderItem)),
        };

        return resultSet;
    }

    mapCartItem(requestContext: RequestContext, dsCart: any, dsOrderItem: any): CartItem {
        const product: Product = this.mapItemProduct(requestContext, dsOrderItem.product);

        let unitPrice = dsOrderItem.orderItemAmount?.unitPrice;
        let currency = dsOrderItem.orderItemAmount?.currency || dsCart.grandTotalCurrency;

        if (!dsOrderItem.orderItemAmount && dsOrderItem.orderItemPrice && dsOrderItem.quantity) {
            const calculatedUnitPrice = parseFloat(dsOrderItem.orderItemPrice) / parseFloat(dsOrderItem.quantity);
            unitPrice = calculatedUnitPrice.toString();
        }

        const cartItem: CartItem =
            dsOrderItem ?
                {
                    id: dsOrderItem.orderItemId,
                    quantity: parseFloat(dsOrderItem.quantity),
                    product: product,
                    pricing: {
                        price: this.mapPrice(requestContext, unitPrice, currency),
                        amount: this.mapPrice(requestContext, dsOrderItem.orderItemPrice, dsCart.grandTotalCurrency),
                        tax: this.mapPrice(requestContext, dsOrderItem.orderItemAmount?.salesTax, dsOrderItem.orderItemAmount?.salesTaxCurrency || dsCart.salesTaxCurrency),
                        shipping: this.mapPrice(requestContext, dsOrderItem.orderItemAmount?.shippingTax, dsOrderItem.orderItemAmount?.shippingTaxCurrency || dsCart.shippingTaxCurrency),
                        adjustment: this.mapPrice(
                            requestContext,
                            dsOrderItem.orderItemAmount?.totalAdjustment?.value,
                            dsOrderItem.orderItemAmount?.totalAdjustment?.currency || dsCart.totalAdjustment?.currency,
                        ),
                    },
                }
                : {};

        return cartItem;
    }
}
