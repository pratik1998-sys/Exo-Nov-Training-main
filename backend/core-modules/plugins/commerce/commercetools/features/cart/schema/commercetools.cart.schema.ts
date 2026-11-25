import { CommercetoolsEntityAction, CommercetoolsReferenceFieldInput, CommercetoolsResultSet } from "@plugin-commercetools/common";
import { CommercetoolsAddress } from "@plugin-commercetools/features/address";
import { CommercetoolsExternalTaxRateInput, CommercetoolsCustomShippingInput, CommercetoolsShippingInput, CommercetoolsQuoteLineItem, CommercetoolsQuote, QuoteActions } from "@plugin-commercetools/features/quote";


//TODO - Refactor with quote (for orders, shopping lists, common fields)
export interface CommercetoolsCartCreateBody {
    key?: string;
    currency?: string;
    customerId: string;
    customerEmail?: string;
    customerGroup?: CommercetoolsReferenceFieldInput;
    anonymousId?: string;
    businessUnit?: CommercetoolsReferenceFieldInput;
    store?: CommercetoolsReferenceFieldInput;
    lineItems?: any[];
    customLineItems?: any[];
    taxMode?: string;
    externalTaxRateForShippingMethod?: CommercetoolsExternalTaxRateInput;
    priceRoundingMode?: string;
    taxRoundingMode?: string;
    inventoryMode?: string;
    billingAddress?: CommercetoolsAddress;
    shippingAddress?: CommercetoolsAddress;
    shippingMethod?: CommercetoolsReferenceFieldInput;
    shippingRateInput?: string;
    shippingMode?: string;
    customShipping?: CommercetoolsCustomShippingInput;
    shipping?: CommercetoolsShippingInput;
    itemShippingAddresses?: CommercetoolsAddress[];
    discountCodes?: string[];
    country?: string;
    locale?: string;
    origin?: string;
    deleteDaysAfterLastModification?: number;
}

export interface CommercetoolsCartLineItem extends CommercetoolsQuoteLineItem { }

export interface CommercetoolsCart extends CommercetoolsQuote {
    cartState: string;
    lineItems: CommercetoolsCartLineItem[];
}

export interface CommercetoolsCartResultSet extends CommercetoolsResultSet {
    results: CommercetoolsCart[];
}

export interface CommercetoolsCartActionAddDiscountCode extends CommercetoolsEntityAction {
    code: string;
}

export interface CommercetoolsCartActionRemoveDiscountCode extends CommercetoolsEntityAction {
    discountCode: CommercetoolsReferenceFieldInput;
}

export interface CommercetoolsCartSetBillingAddress extends CommercetoolsEntityAction {
    address: CommercetoolsAddress;
}

export interface CommercetoolsCartAddPayment extends CommercetoolsEntityAction {
    payment: CommercetoolsReferenceFieldInput;
}

export interface CommercetoolsCreateOrderFromCartBody {
    version: number;
    cart: CommercetoolsReferenceFieldInput;
    orderNumber?: string;
}

export const CartActions = {
    ...QuoteActions,
    addDiscountCode: 'addDiscountCode',
    removeDiscountCode: 'removeDiscountCode',
    setBillingAddress: 'setBillingAddress',
    addPayment: 'addPayment',
};
