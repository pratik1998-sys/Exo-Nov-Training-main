import { RequestContext } from "@context/request";
import { PaymentMethod, PaymentMethodOption, PriceAdjustment, Quote, QuoteItem, QuoteItemResultSet, ShippingMethod } from "@feature-commerce/common";
import { Product } from "@feature-commerce/product";
import { Money } from "@feature-shared-models";
import { HCLCommerceBaseMapper } from "@plugin-hcl-commerce/common";
import { HCLCommerceAddressMapper } from "@plugin-hcl-commerce/features/address";
import { HCLCommerceProductMapper } from "@plugin-hcl-commerce/features/product";

export class HCLCommerceQuoteMapper extends HCLCommerceBaseMapper {
    protected readonly orderStatuses: Record<string, string> = {
        M: 'Submitted',
        P: 'Pending',
        X: 'Canceled',
    };

    mapQuote(requestContext: RequestContext, dsQuote: any) {
        const addressMapper = this.getMapper<HCLCommerceAddressMapper>(requestContext, HCLCommerceAddressMapper);

        let quote: Quote = {};

        if (dsQuote) {
            const productTotal = parseFloat(dsQuote.totalProductPrice);
            const taxTotal = parseFloat(dsQuote.totalSalesTax) + parseFloat(dsQuote.totalShippingTax ?? '0');
            const adjustmentTotal = parseFloat(dsQuote.totalAdjustment);

            let itemQuantity = 0;

            dsQuote.orderItem?.forEach((dsQuoteItem) => {
                itemQuantity += parseFloat(dsQuoteItem.quantity);
            });

            quote = {
                email: '',
                createdOn: dsQuote.placedDate,
                coupons: [],
                id: dsQuote.orderId,
                identifier: dsQuote.orderId,
                itemQuantity,
                status: this.orderStatuses[dsQuote.orderStatus] ?? this.orderStatuses.M,
                items: this.mapQuoteItemsResultSet(requestContext, dsQuote),
                pricing: {
                    total: this.mapPrice(requestContext, dsQuote.grandTotal, dsQuote.grandTotalCurrency),
                    shipping: this.mapPrice(requestContext, dsQuote.totalShippingCharge, dsQuote.totalShippingChargeCurrency),
                    adjustment: this.mapPrice(requestContext, dsQuote.totalAdjustment, dsQuote.totalAdjustmentCurrency),
                    tax: this.mapPrice(requestContext, `${taxTotal}`, dsQuote.totalSalesTaxCurrency),
                    amount: this.mapPrice(requestContext, dsQuote.totalProductPrice, dsQuote.totalProductPriceCurrency),
                    amountWithTax: this.mapPrice(requestContext, `${productTotal + taxTotal}`, dsQuote.totalProductPriceCurrency),
                    amountWithAdjustment: this.mapPrice(requestContext, `${productTotal + adjustmentTotal}`, dsQuote.totalProductPriceCurrency),
                    amountWithTaxAndAdjustment: this.mapPrice(requestContext, `${productTotal + adjustmentTotal + taxTotal}`, dsQuote.totalProductPriceCurrency),
                    adjustments: dsQuote.adjustment ? dsQuote.adjustment.map((dsAdjustment) => this.mapAdjustment(requestContext, dsAdjustment)) : [],
                    taxes: [],
                },
                paymentMethods: dsQuote.paymentInstruction ? dsQuote.paymentInstruction.map((dsPaymentInstruction) => this.mapPaymentMethod(requestContext, dsPaymentInstruction)) : [],
                billingAddress: dsQuote.paymentInstruction?.length > 0 ? addressMapper.mapAddress(requestContext, dsQuote.paymentInstruction[0]) : {},
                shippingAddress: dsQuote.orderItem?.length > 0 ? addressMapper.mapAddress(requestContext, dsQuote.orderItem[0]) : {},
                shippingMethod: dsQuote.orderItem?.length > 0 ? this.mapShippingMethod(requestContext, dsQuote.orderItem[0]) : {},
            };
        }

        return quote;
    }

    mapQuoteItemsResultSet(requestContext: RequestContext, dsQuote: any): QuoteItemResultSet {
        const resultSet: QuoteItemResultSet =
            dsQuote?.orderItem ?
                {
                    pagination: {
                        hasMorePages: false,
                        resultCount: dsQuote.orderItem?.length,
                        page: 1,
                        pageCount: 1,
                        pageSize: dsQuote.orderItem.length,
                    },
                    results: dsQuote.orderItem.map((dsQuoteItem) => this.mapQuoteItem(requestContext, dsQuote, dsQuoteItem)),
                }
                : {
                    pagination: {
                        hasMorePages: false,
                        resultCount: 0,
                        page: 1,
                        pageCount: 1,
                        pageSize: 20,
                    },
                    results: [],
                };

        return resultSet;
    }

    mapQuoteItem(requestContext: RequestContext, dsQuote: any, dsQuoteItem: any): QuoteItem {
        const quoteItem: QuoteItem =
            dsQuoteItem ?
                {
                    id: dsQuoteItem.orderItemId,
                    quantity: parseFloat(dsQuoteItem.quantity),
                    product: dsQuoteItem.product,
                    pricing: {
                        price: this.mapPrice(requestContext, dsQuoteItem.unitPrice, dsQuoteItem.currency),
                        amount: this.mapPrice(requestContext, dsQuoteItem.orderItemPrice, dsQuoteItem.currency),
                        tax: this.mapPrice(requestContext, dsQuoteItem.salesTax, dsQuoteItem.salesTaxCurrency),
                        shipping: this.mapPrice(requestContext, dsQuoteItem.shippingTax, dsQuoteItem.shippingTaxCurrency),
                        adjustment: this.mapPrice(requestContext, dsQuoteItem.totalAdjustment?.value, dsQuoteItem.totalAdjustment?.currency),
                        adjustments:
                            dsQuoteItem.adjustment ?
                                dsQuoteItem.adjustment.map((dsAdjustment) => {
                                    return this.mapAdjustment(requestContext, dsAdjustment);
                                })
                                : [],
                    },
                }
                : {};

        return quoteItem;
    }

    mapPrice(requestContext: RequestContext, amount: string, currency: string): Money {
        return {
            value: amount,
            currency: currency,
        };
    }

    mapItemProduct(requestContext: RequestContext, dsProduct: any): Product {
        const productMapper = this.getMapper<HCLCommerceProductMapper>(requestContext, HCLCommerceProductMapper);

        const product = productMapper.mapProduct(requestContext, dsProduct);

        return product;
    }

    mapPaymentMethod(requestContext: RequestContext, dsPaymentInstruction: any): PaymentMethod {
        const paymentMethod: PaymentMethod =
            dsPaymentInstruction ?
                {
                    id: dsPaymentInstruction.piId,
                    identifier: dsPaymentInstruction.piId,
                    type: dsPaymentInstruction.payMethodId,
                    description: dsPaymentInstruction.piDescription,
                    account: dsPaymentInstruction.protocolData?.find((protocolData) => protocolData.name === 'account')?.value,
                    amount: this.mapPrice(requestContext, dsPaymentInstruction.piAmount, dsPaymentInstruction.piCurrency),
                    address: this.getMapper<HCLCommerceAddressMapper>(requestContext, HCLCommerceAddressMapper).mapAddress(requestContext, dsPaymentInstruction),
                }
                : {};

        return paymentMethod;
    }

    mapPaymentMethodOption(requestContext: RequestContext, dsPaymentMethodOption: any): PaymentMethodOption {
        const paymentMethodOption: PaymentMethodOption =
            dsPaymentMethodOption ?
                {
                    id: dsPaymentMethodOption.xumet_policyId,
                    identifier: dsPaymentMethodOption.paymentMethodName,
                    type: dsPaymentMethodOption.xumet_attrPageName,
                    description: dsPaymentMethodOption.description,
                }
                : {};

        return paymentMethodOption;
    }

    mapShippingMethod(requestContext: RequestContext, dsShippingMethod: any): ShippingMethod {
        const shippingMethod: ShippingMethod =
            dsShippingMethod ?
                {
                    id: dsShippingMethod.shipModeId,
                    identifier: dsShippingMethod.shipModeId,
                    description: dsShippingMethod.description ?? dsShippingMethod.shipModeDescription,
                    carrier: dsShippingMethod.carrier,
                }
                : {};

        return shippingMethod;
    }

    protected mapAdjustment(requestContext: RequestContext, dsAdjustment: any): PriceAdjustment {
        return dsAdjustment ?
            {
                id: dsAdjustment.code,
                identifier: dsAdjustment.code,
                code: dsAdjustment.code,
                description: dsAdjustment.description,
                amount: this.mapPrice(requestContext, dsAdjustment.amount, dsAdjustment.currency),
                percent: null,
                type: dsAdjustment.displayLevel,
            }
            : {};
    }
}
