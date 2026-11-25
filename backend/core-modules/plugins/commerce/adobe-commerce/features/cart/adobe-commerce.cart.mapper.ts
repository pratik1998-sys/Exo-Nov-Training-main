import { RequestContext } from "@context/request";
import { Cart, CartItem, CartItemResultSet } from "@feature-commerce/cart";
import { Tax, PriceAdjustment, ItemOption } from "@feature-commerce/common";
import { Product, ProductType } from "@feature-commerce/product";
import { AdobeCommerceMoney } from "@plugin-adobe-commerce/common";
import { AdobeCommerceCart, AdobeCommerceCartItem, AdobeCommerceCartTaxItem, AdobeCommerceConfigurableCartItem } from "./schema/adobe-commerce.cart.schema";
import { AdobeCommerceDiscount, AdobeCommerceQuoteMapper } from "@plugin-adobe-commerce/features/quote";

export class AdobeCommerceCartMapper extends AdobeCommerceQuoteMapper {
    mapCart(requestContext: RequestContext, dsCart: AdobeCommerceCart): Cart {
        let totalTax: AdobeCommerceCartTaxItem;
        let totalDiscount: AdobeCommerceDiscount;
        let totalShipping: AdobeCommerceMoney;

        const taxes: Tax[] = [];
        const adjustments: PriceAdjustment[] = [];

        let itemQuantity = 0;

        dsCart?.items?.forEach((dsItem) => {
            itemQuantity += dsItem.quantity;
        });

        dsCart?.shipping_addresses?.forEach((shippingAddress, i) => {
            if (shippingAddress.selected_shipping_method) {
                if (!totalShipping) {
                    totalShipping = shippingAddress.selected_shipping_method.amount;
                } else {
                    totalShipping.value += shippingAddress.selected_shipping_method.amount.value;
                }
            }
        });

        dsCart?.prices?.applied_taxes?.forEach((tax, i) => {
            if (i == 0) {
                totalTax = tax;
            } else {
                totalTax.amount.value += tax.amount.value;
            }

            taxes.push({
                description: tax.label,
                amount: {
                    value: `${tax.amount.value}`,
                    currency: tax.amount.currency,
                },
            });
        });

        dsCart?.prices?.discounts?.forEach((discount, i) => {
            if (i == 0) {
                totalDiscount = discount;
            } else {
                totalDiscount.amount.value += discount.amount.value;
            }

            adjustments.push({
                description: discount.label,
                amount: {
                    value: `${discount.amount.value}`,
                    currency: discount.amount.currency,
                },
            });
        });

        const cart: Cart =
            dsCart ?
                {
                    id: dsCart.id,
                    email: dsCart.email,
                    itemQuantity: itemQuantity,
                    items: this.mapCartItemResultSet(requestContext, dsCart.items),
                    coupons: dsCart.applied_coupons?.map((dsCoupon) => {
                        return {
                            id: dsCoupon.code,
                            identifier: dsCoupon.code,
                            code: dsCoupon.code,
                        };
                    }),
                    pricing: {
                        total: {
                            value: `${dsCart.prices.grand_total.value}`,
                            currency: dsCart.prices.grand_total.currency,
                        },
                        shipping:
                            totalShipping?.value ?
                                {
                                    value: `${totalShipping.value}`,
                                    currency: totalShipping.currency,
                                }
                                : null,
                        adjustments: adjustments,
                        adjustment:
                            totalDiscount?.amount?.value ?
                                {
                                    value: `${totalDiscount?.amount.value}`,
                                    currency: totalDiscount?.amount.currency,
                                }
                                : null,
                        taxes: taxes,
                        tax:
                            totalTax?.amount?.value ?
                                {
                                    value: `${totalTax?.amount.value}`,
                                    currency: totalTax?.amount.currency,
                                }
                                : null,
                        amount: {
                            value: `${dsCart.prices.subtotal_excluding_tax.value}`,
                            currency: dsCart.prices.subtotal_excluding_tax.currency,
                        },
                        amountWithTax: {
                            value: `${dsCart.prices.subtotal_including_tax.value}`,
                            currency: dsCart.prices.subtotal_including_tax.currency,
                        },
                        amountWithAdjustment: {
                            value: `${dsCart.prices.subtotal_with_discount_excluding_tax.value}`,
                            currency: dsCart.prices.subtotal_with_discount_excluding_tax.currency,
                        },
                        amountWithTaxAndAdjustment: {},
                    },
                    shippingAddress: dsCart?.shipping_addresses.length > 0 ? this.mapAddress(requestContext, dsCart?.shipping_addresses[0]) : null,
                    billingAddress: dsCart?.shipping_addresses.length > 0 ? this.mapAddress(requestContext, dsCart?.billing_address) : null,
                }
                : {};

        return cart;
    }

    mapCartItemResultSet(requestContext: RequestContext, dsCartItems: AdobeCommerceCartItem[]) {
        const resultSet: CartItemResultSet = {
            pagination: {
                hasMorePages: false,
                resultCount: dsCartItems.length,
                page: 1,
                pageCount: 1,
                pageSize: dsCartItems.length,
            },
            results: dsCartItems.map((dsCartItem) => this.mapCartItem(requestContext, dsCartItem)),
        };

        return resultSet;
    }

    mapCartItem(requestContext: RequestContext, dsCartItem: AdobeCommerceCartItem) {
        const product: Product = this.mapItemProduct(requestContext, dsCartItem.product);

        const cartItem: CartItem =
            dsCartItem ?
                {
                    id: dsCartItem.uid,
                    quantity: dsCartItem.quantity,
                    product: product,
                    pricing: {
                        price: {
                            value: `${dsCartItem.prices.price.value}`,
                            currency: dsCartItem.prices.price.currency,
                        },
                        amount: {
                            value: `${dsCartItem.prices.row_total.value}`,
                            currency: dsCartItem.prices.row_total.currency,
                        },
                        adjustments: [],
                        taxes: [],
                        tax: {},
                        adjustment:
                            dsCartItem.prices.total_item_discount?.value ?
                                {
                                    value: `${dsCartItem.prices.total_item_discount.value}`,
                                    currency: dsCartItem.prices.total_item_discount.currency,
                                }
                                : null,
                        amountWithAdjustment: {},
                        amountWithTax:
                            dsCartItem.prices.row_total_including_tax?.value ?
                                {
                                    value: `${dsCartItem.prices.row_total_including_tax.value}`,
                                    currency: dsCartItem.prices.row_total_including_tax.currency,
                                }
                                : null,
                        amountWithTaxAndAdjustment: {},
                    },
                    options: this.mapCartItemOptions(requestContext, dsCartItem, product),
                }
                : {};

        return cartItem;
    }

    // mapShippingOptions(requestContext: RequestContext, dsAddresses: AdobeCommerceCustomerAddress[], dsShippingMethods: any[]): CartShippingOptions {
    //     return {
    //         addresses: dsAddresses?.length > 0 ? dsAddresses.map((dsAddress) => this.mapAddress(requestContext, dsAddress)) : [],
    //         //TODO - Map shippingMethods when integrated with Adobe Commerce
    //         shippingMethods: []
    //     }
    // }

    protected mapCartItemOptions(requestContext: RequestContext, dsCartItem: AdobeCommerceCartItem, product: Product) {
        let options: ItemOption[] = [];

        if (product.type == ProductType.CONFIGURABLE) {
            const dsConfigurableCartItem = dsCartItem as AdobeCommerceConfigurableCartItem;

            options = dsConfigurableCartItem.configurable_options.map((dsOption) => {
                return {
                    id: dsOption.configurable_product_option_uid,
                    identifier: dsOption.configurable_product_option_uid,
                    description: dsOption.option_label,
                    value: {
                        id: dsOption.configurable_product_option_value_uid,
                        identifier: dsOption.configurable_product_option_value_uid,
                        description: dsOption.value_label,
                    },
                };
            });
        }

        return options;
    }
}
