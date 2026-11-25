import { RequestContext } from "@context/request";
import { Quote, QuoteItem } from "@feature-commerce/common";
import { components, SAPCommerceBaseMapper } from "@plugin-sap-commerce/common";
import { SAPCommerceCart } from "@plugin-sap-commerce/features/cart";
import { SAPCommerceOrder } from "@plugin-sap-commerce/features/order";
import { SAPCommerceProductMapper } from "@plugin-sap-commerce/features/product";

export class SAPCommerceQuoteMapper extends SAPCommerceBaseMapper {
    mapQuote(requestContext: RequestContext, dsQuote: SAPCommerceCart | SAPCommerceOrder): Quote {
        let quote: Quote = null;

        if (dsQuote) {
            const amountWithTax = dsQuote.subTotal;

            if (dsQuote.totalTax?.value) {
                amountWithTax.value += dsQuote.totalTax?.value;
            }

            let itemQuantity = 0;

            const quoteItems: QuoteItem[] = [];

            dsQuote.entries?.forEach((dsQuoteItem) => {
                itemQuantity += dsQuoteItem.quantity;

                quoteItems.push(this.mapQuoteItem(requestContext, dsQuoteItem));
            });

            quote = {
                id: dsQuote.code,
                identifier: dsQuote.code,
                purchaseOrderNumber: dsQuote.purchaseOrderNumber,
                itemQuantity,
                pricing: {
                    amount: this.mapPrice(requestContext, dsQuote.subTotal),
                    adjustment: this.mapPrice(requestContext, dsQuote.totalDiscounts),
                    adjustments: [],
                    tax: this.mapPrice(requestContext, dsQuote.totalTax),
                    taxes: [],
                    amountWithTax: this.mapPrice(requestContext, amountWithTax),
                    amountWithAdjustment: this.mapPrice(requestContext, dsQuote.totalPrice),
                    amountWithTaxAndAdjustment: this.mapPrice(requestContext, dsQuote.totalPriceWithTax),
                },
                items: {
                    pagination: {
                        page: 1,
                        pageCount: 1,
                        pageSize: quoteItems.length,
                        resultCount: quoteItems.length,
                        hasMorePages: false,
                    },
                    results: quoteItems,
                },
                shippingAddress: this.mapAddress(requestContext, dsQuote.deliveryAddress),
            };
        }

        return quote;
    }

    protected mapQuoteItem(requestContext: RequestContext, dsQuoteItem: components['schemas']['OrderEntry']) {
        let quoteItem: QuoteItem = null;

        if (dsQuoteItem) {
            const id = `${dsQuoteItem.entryNumber}`;

            quoteItem = {
                id,
                identifier: id,
                quantity: dsQuoteItem.quantity,
                pricing: {
                    amount: this.mapPrice(requestContext, dsQuoteItem.totalPrice),
                },
                product: this.getMapper<SAPCommerceProductMapper>(requestContext, SAPCommerceProductMapper).mapProduct(requestContext, dsQuoteItem.product),
            };
        }

        return quoteItem;
    }

    protected mapPrice(requestContext: RequestContext, dsPrice: components['schemas']['Price']) {
        return dsPrice ? this.mapMoney(requestContext, dsPrice.value, dsPrice.currencyIso) : null;
    }
}
