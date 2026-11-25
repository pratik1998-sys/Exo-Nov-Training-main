import { RequestContext } from "@context/request";
import { ItemCollectionCoupon, ItemQuoteCollectionPricing, ItemQuotePaymentMethod, ItemQuotePricing, Quote, QuoteItem, QuoteItemResultSet, ShippingMethod } from "@feature-commerce/common";
import { ProductAttributeValue } from "@feature-commerce/product";
import { CommercetoolsBaseMapper, CommercetoolsConsumerConfigurationConfig, CommercetoolsMoney } from "@plugin-commercetools/common";
import { CommercetoolsAddressMapper } from "@plugin-commercetools/features/address";
import { CommercetoolsAttribute, CommercetoolsProductMapper, CommercetoolsProductTypeRegistry } from "@plugin-commercetools/features/product";
import { CommercetoolsDiscountCodeInfo, CommercetoolsQuote, CommercetoolsQuoteLineItem, CommercetoolsShippingInfo, CommercetoolsShippingMethod, CommercetoolsShippingRate } from "./schema/commercetools.quote.schema";
import { CommercetoolsCustomer } from "@plugin-commercetools/features/ec-user";
import { CONTEXT } from "@nestjs/graphql";


export abstract class CommercetoolsQuoteMapper extends CommercetoolsBaseMapper {
    mapQuote(requestContext: RequestContext, dsQuote: CommercetoolsQuote): Quote {
        const { user } = requestContext;

        const addressMapper = this.getMapper<CommercetoolsAddressMapper>(requestContext, CommercetoolsAddressMapper);

        return dsQuote ?
            {
                id: dsQuote.id,
                identifier: dsQuote.id,
                createdOn: dsQuote.createdAt,
                updatedOn: dsQuote.lastModifiedAt,
                email: user?.email,
                phone: user?.phone,
                shippingAddress: addressMapper.mapAddress(requestContext, dsQuote.shippingAddress),
                billingAddress: addressMapper.mapAddress(requestContext, dsQuote.billingAddress),
                shippingMethod: this.mapShippingInfo(requestContext, dsQuote.shippingInfo),
                paymentMethods: this.mapPaymentMethods(requestContext, []),
                shipDate: null,
                deliveryDate: null,
                itemQuantity: dsQuote.totalLineItemQuantity,
                items: this.mapLineItems(requestContext, dsQuote.lineItems),
                pricing: this.mapPricing(requestContext, dsQuote),
                coupons: this.mapCoupons(requestContext, dsQuote.discountCodes),
            }
            : null;
    }

    protected mapCoupons(requestContext: RequestContext, dsDiscountCodes: CommercetoolsDiscountCodeInfo[]): ItemCollectionCoupon[] {
        return dsDiscountCodes?.length > 0 ? dsDiscountCodes.map((dsDiscountCode) => this.mapCoupon(requestContext, dsDiscountCode)) : [];
    }

    protected mapCoupon(requestContext: RequestContext, dsDiscountCode: CommercetoolsDiscountCodeInfo): ItemCollectionCoupon {
        return dsDiscountCode?.discountCode ?
            {
                id: dsDiscountCode.discountCode.id,
                identifier: dsDiscountCode.discountCode.obj?.key,
                code: dsDiscountCode.discountCode.obj?.code,
                name: this.resolveLocaleFieldValue(requestContext, dsDiscountCode.discountCode.obj?.name),
                description: this.resolveLocaleFieldValue(requestContext, dsDiscountCode.discountCode.obj?.description),
            }
            : null;
    }

    //@todo this needs to be investigated more and cleaned up
    protected mapPricing(requestContext: RequestContext, dsQuote: CommercetoolsQuote): ItemQuoteCollectionPricing {
        const pricing: ItemQuoteCollectionPricing = {};

        if (dsQuote) {
            const total = {
                ...dsQuote.totalPrice,
            };

            const grandTotal = {
                ...dsQuote.totalPrice,
            };

            const totalWithAdjustment = {
                ...dsQuote.totalPrice,
            };

            if (dsQuote.discountOnTotalPrice) {
                pricing.adjustment = this.mapMoney(requestContext, dsQuote.discountOnTotalPrice.discountedAmount);

                const amt = dsQuote.discountOnTotalPrice.discountedAmount.preciseAmount || dsQuote.discountOnTotalPrice.discountedAmount.centAmount;

                if (totalWithAdjustment.preciseAmount) {
                    totalWithAdjustment.preciseAmount -= amt;
                } else if (totalWithAdjustment.centAmount) {
                    totalWithAdjustment.centAmount -= amt;
                }

                if (grandTotal.preciseAmount) {
                    grandTotal.preciseAmount -= amt;
                } else if (grandTotal.centAmount) {
                    grandTotal.centAmount -= amt;
                }

                pricing.adjustments = dsQuote.discountOnTotalPrice.includedDiscounts.map((dsDiscount) => {
                    return {
                        id: dsDiscount.discount.id,
                        identifier: dsDiscount.discount.obj?.key,
                        description: this.resolveLocaleFieldValue(requestContext, dsDiscount.discount.obj?.description),
                        name: this.resolveLocaleFieldValue(requestContext, dsDiscount.discount.obj?.name),
                        amount: this.mapMoney(requestContext, dsDiscount.discountedAmount),
                        type: 'DISCOUNT',
                    };
                });
            }

            if (dsQuote.shippingInfo) {
                pricing.shipping = this.mapMoney(requestContext, dsQuote.shippingInfo.price);

                const amt = dsQuote.shippingInfo.price.preciseAmount || dsQuote.shippingInfo.price.centAmount;

                if (grandTotal.preciseAmount) {
                    grandTotal.preciseAmount += amt;
                } else if (grandTotal.centAmount) {
                    grandTotal.centAmount += amt;
                }
            }

            let totalTax = null;

            if (dsQuote.taxedPrice) {
                totalTax = { ...dsQuote.taxedPrice.totalTax };

                const totalTaxAmount = totalTax.preciseAmount || totalTax.centAmount;

                if (grandTotal.preciseAmount) {
                    grandTotal.preciseAmount += totalTaxAmount;
                } else if (grandTotal.centAmount) {
                    grandTotal.centAmount += totalTaxAmount;
                }

            }

            //This is weird, CT totalTax includes shipping tax, but doesnt align to grand total?
            if (dsQuote?.taxedShippingPrice && totalTax) {
                totalTax.preciseAmount -= dsQuote.taxedShippingPrice.totalTax.preciseAmount;
                totalTax.centAmount -= dsQuote.taxedShippingPrice.totalTax.centAmount;
            }

            if (totalTax) {
                pricing.tax = this.mapMoney(requestContext, totalTax);
            }

            let subtotal = null;

            dsQuote.lineItems?.forEach((dsLineItem) => {
                if (!subtotal) {
                    subtotal = { ...dsLineItem.totalPrice };
                } else {
                    subtotal.preciseAmount += dsLineItem.totalPrice.preciseAmount;
                    subtotal.centAmount += dsLineItem.totalPrice.centAmount;
                }
            });


            //TODO - this isn't the true subtotal - this could have taxes and line item discounts...
            //And the amountWith* fields aren't 100% accurate
            // pricing.amount = this.mapMoney(requestContext, dsQuote?.totalPrice);
            // pricing.total = this.mapMoney(requestContext, subtotal);

            pricing.amount = this.mapMoney(requestContext, subtotal);
            pricing.total = this.mapMoney(requestContext, dsQuote?.taxedPrice?.totalGross ?? grandTotal);

            pricing.amountWithAdjustment = this.mapMoney(requestContext, totalWithAdjustment);
            pricing.amountWithTax = this.mapMoney(requestContext, dsQuote.totalPrice);
            pricing.amountWithTaxAndAdjustment = this.mapMoney(requestContext, totalWithAdjustment);
        }

        return pricing;
    }

    protected mapLineItems(requestContext: RequestContext, dsLineItems: CommercetoolsQuoteLineItem[]): QuoteItemResultSet {
        const lineItems = dsLineItems?.length > 0 ? dsLineItems.map((dsLineItem) => this.mapLineItem(requestContext, dsLineItem)) : [];

        return {
            pagination: {
                page: 1,
                pageCount: 1,
                pageSize: lineItems.length,
                resultCount: lineItems.length,
                hasMorePages: false,
            },
            results: lineItems,
        };
    }

    protected mapLineItem(requestContext: RequestContext, dsLineItem: CommercetoolsQuoteLineItem): QuoteItem {
        //This will be set when the doFetchProduct configuration value is set
        let product = dsLineItem._product;

        if (!product) {
            const dsAttributeDefinitionMap: Record<string, CommercetoolsAttribute> = this.getRegistry<CommercetoolsProductTypeRegistry>(
                requestContext,
                CommercetoolsProductTypeRegistry,
            ).getProductTypeAttributes(dsLineItem.productType.id);

            product = this.getMapper<CommercetoolsProductMapper>(requestContext, CommercetoolsProductMapper).mapVariant(requestContext, dsLineItem.variant, dsAttributeDefinitionMap);
            product.id = dsLineItem.productId;
            product.identifier = dsLineItem.productKey;
            product.name = this.resolveLocaleFieldValue(requestContext, dsLineItem.name);
            product.slug = dsLineItem.variant._slug ?? this.resolveLocaleFieldValue(requestContext, dsLineItem.productSlug);
            product.description = dsLineItem.variant._description;
        }

        const variantSku = dsLineItem.variant?.sku;

        if (variantSku) {
            product.sku = variantSku;
        }

        const item =
            dsLineItem ?
                {
                    id: dsLineItem.id,
                    identifier: dsLineItem.key,
                    quantity: dsLineItem.quantity,
                    notes: null,
                    status: null,
                    rewards: [],
                    pricing: this.mapLineItemPricing(requestContext, dsLineItem),
                    shipDate: null,
                    deliveryDate: null,
                    product: product,
                }
                : null;

        this.mapOptions(requestContext, item);

        return item;
    }

    protected mapOptions(requestContext: RequestContext, item: QuoteItem) {
        item.options = [];

        item.product.attributeList.forEach((attribute) => {
            const value: ProductAttributeValue = attribute.value ?? (attribute.values?.length > 0 ? attribute.values[0] : null);

            if (attribute.isDefining) {
                item.options.push({
                    id: attribute.id,
                    identifier: attribute.identifier,
                    description: attribute.name,
                    value: {
                        id: value?.id,
                        identifier: value?.identifier,
                        description: value?.value,
                    },
                });
            }
        });
    }

    //TODO - This amountWith* is not accurate
    protected mapLineItemPricing(requestContext: RequestContext, dsLineItem: CommercetoolsQuoteLineItem): ItemQuotePricing {
        return dsLineItem ?
            {
                price: this.mapMoney(requestContext, dsLineItem.totalPrice),
                tax: this.mapMoney(requestContext, dsLineItem.taxedPrice?.totalTax),
                amount: this.mapMoney(requestContext, dsLineItem.totalPrice),
                amountWithTax: this.mapMoney(requestContext, dsLineItem.totalPrice),
                amountWithAdjustment: this.mapMoney(requestContext, dsLineItem.totalPrice),
                amountWithTaxAndAdjustment: this.mapMoney(requestContext, dsLineItem.totalPrice),
            }
            : null;
    }

    protected mapShippingInfo(requestContext: RequestContext, dsShippingInfo: CommercetoolsShippingInfo): ShippingMethod {
        const shippingMethod: ShippingMethod = this.mapShippingMethod(requestContext, dsShippingInfo?.shippingMethod?.obj);

        shippingMethod.id = dsShippingInfo?.shippingMethod?.id;
        shippingMethod.amount = this.mapMoney(requestContext, dsShippingInfo?.price);
        shippingMethod.deliveryDate = null;
        shippingMethod.name = shippingMethod.name ?? dsShippingInfo?.shippingMethodName;

        return shippingMethod;
    }

    mapShippingMethod(requestContext: RequestContext, dsShippingMethod: CommercetoolsShippingMethod): ShippingMethod {
        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfigurationConfig>(requestContext);

        const currency = requestContext.currency ?? configuration?.defaultCurrency;

        let shippingMethod: ShippingMethod = {};

        if (dsShippingMethod) {
            //@todo ZONE - this needs to be more robust - we should be able to handle multiple zones
            const zone = dsShippingMethod.zoneRates?.length > 0 ? dsShippingMethod.zoneRates[0] : null;

            let shippingRatePrice: CommercetoolsMoney = null;

            if (zone) {
                const shippingRate = zone.shippingRates?.find((shippingRate) => shippingRate.price?.currencyCode === currency);
                shippingRatePrice = shippingRate?.price;
            }

            shippingMethod = {
                id: dsShippingMethod.id,
                identifier: dsShippingMethod.key ?? dsShippingMethod.id,
                name: this.resolveLocaleFieldValue(requestContext, dsShippingMethod.localizedName),
                description: this.resolveLocaleFieldValue(requestContext, dsShippingMethod.localizedDescription),
            };

            if (shippingRatePrice) {
                shippingMethod.amount = this.mapMoney(requestContext, shippingRatePrice);
            }
        }

        return shippingMethod;
    }

    protected mapPaymentMethods(requestContext: RequestContext, dsPaymentMethods: any[]): ItemQuotePaymentMethod[] {
        return dsPaymentMethods?.length > 0 ? dsPaymentMethods.map((dsPaymentMethod) => this.mapPaymentMethod(requestContext, dsPaymentMethod)) : [];
    }

    protected mapPaymentMethod(requestContext: RequestContext, dsPaymentMethod: any): ItemQuotePaymentMethod {
        return dsPaymentMethod ? {} : null;
    }
}
