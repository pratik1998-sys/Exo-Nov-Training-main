import { RequestContext } from "@context/request";
import { AdobeCommerceCustomerOrder, AdobeCommerceCustomerOrderResultSet, AdobeCommerceOrderAddress, AdobeCommerceOrderItem } from "./schema/adobe-commerce.order.schema";
import { OrderItemResultSet, OrderResultSet, OrderItem, Order } from "@feature-commerce/order";
import { PriceAdjustment, Tax } from "@feature-commerce/common";
import { Address } from "@feature-address";
import { AdobeCommerceDiscount, AdobeCommerceQuoteMapper } from "@plugin-adobe-commerce/features/quote";

export class AdobeCommerceOrderMapper extends AdobeCommerceQuoteMapper {
    mapCustomerOrderResultSet(requestContext: RequestContext, dsOrderResultSet: AdobeCommerceCustomerOrderResultSet): OrderResultSet {
        return {
            pagination: this.mapPagination(requestContext, dsOrderResultSet?.page_info, dsOrderResultSet?.total_count),
            results: dsOrderResultSet?.items?.map((dsOrder) => this.mapCustomerOrder(requestContext, dsOrder)),
        };
    }

    mapCustomerOrder(requestContext: RequestContext, dsCustomerOrder: AdobeCommerceCustomerOrder): Order {
        const taxes: Tax[] = [];
        const adjustments: PriceAdjustment[] = [];
        let totalDiscount: AdobeCommerceDiscount;

        dsCustomerOrder.total?.taxes.forEach((tax, i) => {
            taxes.push({
                description: tax.title,
                amount: {
                    value: `${tax.amount.value}`,
                    currency: tax.amount.currency,
                },
            });
        });

        dsCustomerOrder.total?.discounts.forEach((discount, i) => {
            if (!totalDiscount) {
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

        const order: Order =
            dsCustomerOrder ?
                {
                    id: dsCustomerOrder.id,
                    identifier: dsCustomerOrder.number,
                    createdOn: dsCustomerOrder.order_date,
                    notes: dsCustomerOrder.comments?.map((dsComment) => {
                        return {
                            note: dsComment.message,
                            createdOn: dsComment.timestamp,
                        };
                    }),
                    //email: dsCustomerOrder.email,
                    status: dsCustomerOrder.status,
                    paymentMethods: dsCustomerOrder.payment_methods?.map((dsPaymentMethod) => {
                        return {
                            id: dsPaymentMethod.name,
                            identifier: dsPaymentMethod.name,
                            description: dsPaymentMethod.name,
                            /*
                    additionalData: dsPaymentMethod.additionalData.map((dsAdditionalData) => {
                        return {
                            name: dsAdditionalData.name,
                            value: dsAdditionalData.value
                        }
                    })
                    */
                        };
                    }),
                    billingAddress: this.mapOrderAddress(requestContext, dsCustomerOrder.billing_address),
                    shippingAddress: this.mapOrderAddress(requestContext, dsCustomerOrder.shipping_address),
                    shippingMethod: {
                        identifier: dsCustomerOrder.shipping_method,
                        carrier: dsCustomerOrder.carrier,
                    },
                    //coupons: this.mapAppliedCoupons(requestContext, dsCustomerOrder.applied_coupons),
                    items: this.mapOrderItemResultSet(requestContext, dsCustomerOrder.items),
                    pricing:
                        dsCustomerOrder.total ?
                            {
                                total: {
                                    value: `${dsCustomerOrder.total.grand_total.value}`,
                                    currency: dsCustomerOrder.total.grand_total.currency,
                                },
                                shipping:
                                    dsCustomerOrder.total.shipping_handling?.total_amount?.value ?
                                        {
                                            value: `${dsCustomerOrder.total.shipping_handling?.total_amount?.value}`,
                                            currency: dsCustomerOrder.total.shipping_handling?.total_amount?.currency,
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
                                    dsCustomerOrder.total.total_tax?.value ?
                                        {
                                            value: `${dsCustomerOrder.total.total_tax?.value}`,
                                            currency: dsCustomerOrder.total.total_tax?.currency,
                                        }
                                        : null,
                                amount: {
                                    value: `${dsCustomerOrder.total.subtotal.value}`,
                                    currency: dsCustomerOrder.total.subtotal.currency,
                                },
                            }
                            : null,
                }
                : {};

        return order;
    }

    mapOrderAddress(requestContext: RequestContext, dsOrderAddress: AdobeCommerceOrderAddress): Address {
        const address: Address =
            dsOrderAddress ?
                {
                    firstName: dsOrderAddress.firstname,
                    lastName: dsOrderAddress.lastname,
                    city: dsOrderAddress.city,
                    state: dsOrderAddress.region,
                    postalCode: dsOrderAddress.postcode,
                    phone: dsOrderAddress.telephone,
                    line1: dsOrderAddress.street.length > 0 ? dsOrderAddress.street[0] : null,
                    line2: dsOrderAddress.street.length > 1 ? dsOrderAddress.street[1] : null,
                    line3: dsOrderAddress.street.length > 2 ? dsOrderAddress.street[2] : null,
                }
                : {};

        return address;
    }

    mapOrderItemResultSet(requestContext: RequestContext, dsOrderItems: AdobeCommerceOrderItem[]): OrderItemResultSet {
        const orderItemResultSet: OrderItemResultSet = {
            pagination: {
                page: 1,
                pageCount: 1,
                pageSize: dsOrderItems?.length ?? 1000,
                resultCount: dsOrderItems?.length ?? 0,
                hasMorePages: false,
            },
            results: dsOrderItems ? dsOrderItems.map((dsOrderItem) => this.mapOrderItem(requestContext, dsOrderItem)) : [],
        };

        return orderItemResultSet;
    }

    mapOrderItem(requestContext: RequestContext, dsOrderItem: AdobeCommerceOrderItem) {
        //const product: Product = this.mapItemProduct(requestContext, dsOrderItem.product)

        const orderItem: OrderItem =
            dsOrderItem ?
                {
                    id: dsOrderItem.id,
                    identifier: dsOrderItem.id,
                    quantity: dsOrderItem.quantity_ordered,
                    pricing: {
                        amount: {
                            value: `${dsOrderItem.product_sale_price.value}`,
                            currency: dsOrderItem.product_sale_price.currency,
                        },
                    },
                    product: {
                        id: dsOrderItem.product_url_key,
                        name: dsOrderItem.product_name,
                        identifier: dsOrderItem.product_sku,
                        type: dsOrderItem.product_type,
                        slug: dsOrderItem.product_url_key,
                        price: {
                            list: {
                                value: `${dsOrderItem.product_sale_price.value}`,
                                currency: dsOrderItem.product_sale_price.currency,
                            },
                            offer: {
                                value: `${dsOrderItem.product_sale_price.value}`,
                                currency: dsOrderItem.product_sale_price.currency,
                            },
                        },
                    },
                    options: dsOrderItem.selected_options?.map((dsOption) => {
                        return {
                            description: dsOption.label,
                            value: {
                                description: dsOption.value,
                            },
                        };
                    }),
                }
                : {};

        return orderItem;
    }
}
