import { Product } from "@feature-commerce/product";
import { CommercetoolsCustomFieldInput, CommercetoolsEntity, CommercetoolsEntityAction, CommercetoolsEntityActionRequest, CommercetoolsLocaleField, CommercetoolsMoney, CommercetoolsReferenceField, CommercetoolsReferenceFieldInput, CommercetoolsResultSet } from "@plugin-commercetools/common";
import { CommercetoolsAddress } from "@plugin-commercetools/features/address";
import { CommercetoolsProductVariant } from "@plugin-commercetools/features/product";


export interface CommercetoolsExternalSubRateInput {
    name?: string;
    amount?: number;
}

export interface CommercetoolsExternalTaxRateInput {
    name?: string;
    amount?: number;
    includedInPrice?: number;
    country?: string;
    state?: string;
    subRates: CommercetoolsExternalSubRateInput[];
}

export interface CommercetoolsShippingRateInput {
    price: CommercetoolsMoney;
    freeAbove?: CommercetoolsMoney;
    tiers?: string[];
}

export interface CommercetoolsDeliveryItemInput {
    id: string;
    quantity: number;
}

export interface CommercetoolsParcelMeasurementInput {
    heightInMillimeter?: number;
    lengthInMillimeter?: number;
    widthInMillimeter?: number;
    weightInGram?: number;
}

export interface CommercetoolsTrackingDataInput {
    trackingId?: string;
    carrier?: string;
    provider?: string;
    providerTransaction?: string;
    isReturn?: boolean;
}

export interface CommercetoolsParcelInput {
    key?: string;
    measurements?: CommercetoolsParcelMeasurementInput;
    trackingData?: CommercetoolsTrackingDataInput;
    items?: CommercetoolsDeliveryItemInput[];
}

export interface CommercetoolsShippingRateInputInput {
    key: string;
    type: string;
}

export interface CommercetoolsDeliveryInput {
    key?: string;
    items?: CommercetoolsDeliveryItemInput[];
    parcels?: CommercetoolsParcelInput[];
    address?: CommercetoolsAddress;
}

export interface CommercetoolsCustomShippingInput {
    key: string;
    shippingMethodName: string;
    shippingAddress: CommercetoolsAddress;
    shippingRate: CommercetoolsShippingRateInput;
    shippingRateInput?: CommercetoolsShippingRateInputInput;
    taxCategory?: CommercetoolsReferenceFieldInput;
    externalTaxRate?: CommercetoolsExternalTaxRateInput;
    deliveries?: CommercetoolsDeliveryInput[];
}

export interface CommercetoolsShippingInput {
    key: string;
    shippingMethod?: CommercetoolsReferenceFieldInput;
    shippingAddress: CommercetoolsAddress;
    shippingRateInput?: CommercetoolsShippingRateInput;
    externalTaxRate?: CommercetoolsExternalTaxRateInput;
    deliveries?: CommercetoolsDeliveryInput;
}

export interface CommercetoolsExternalLineItemTotalPrice {
    price: CommercetoolsMoney;
    totalPrice: CommercetoolsMoney;
}

export interface CommercetoolsMethodExternalTaxRateInput {
    shippingMethodKey: string;
    taxRate?: CommercetoolsExternalTaxRateInput;
}

export interface CommercetoolsItemShippingTarget {
    addressKey: string;
    quantity: number;
    shippingMethodKey?: string;
}

export interface CommercetoolsItemShippingDetailsInput {
    targets: CommercetoolsItemShippingTarget;
}

export interface CommercetoolsLineItemRecurrenceInfoInput {
    recurrencePolicy: CommercetoolsReferenceFieldInput;
    priceSelectionMode: string;
}

export interface CommercetoolsQuoteActionRemoveItem extends CommercetoolsEntityAction {
    lineItemId?: string;
    lineItemKey?: string;
    quantity?: number;
    externalPrice?: CommercetoolsMoney;
    externalTotalPrice?: CommercetoolsExternalLineItemTotalPrice;
    shippingDetailsToRemove?: CommercetoolsItemShippingDetailsInput;
}

export interface CommercetoolsQuoteSetShippingAddress extends CommercetoolsEntityAction {
    address: CommercetoolsAddress;
}

export interface CommercetoolsQuoteSetShippingMethod extends CommercetoolsEntityAction {
    shippingMethod: CommercetoolsReferenceFieldInput;
}

export interface CommercetoolsQuoteActionAddItem extends CommercetoolsEntityAction {
    key?: string;
    productId?: string;
    variantId?: string;
    sku?: string;
    quantity: number;
    addedAt?: string;
    distributionChannel?: CommercetoolsReferenceFieldInput;
    supplyChannel?: CommercetoolsReferenceFieldInput;
    externalPrice?: CommercetoolsMoney;
    externalTotalPrice?: CommercetoolsExternalLineItemTotalPrice;
    externalTaxRate?: CommercetoolsExternalTaxRateInput;
    perMethodExternalTaxRate?: CommercetoolsMethodExternalTaxRateInput[];
    inventoryMode?: string;
    shippingDetails?: CommercetoolsItemShippingDetailsInput;
    recurrenceInfo?: CommercetoolsLineItemRecurrenceInfoInput;
    custom?: CommercetoolsCustomFieldInput;
}

export interface CommercetoolsQuoteActionUpdateItemQuantity extends CommercetoolsEntityAction {
    lineItemId?: string;
    lineItemKey?: string;
    quantity: number;
    externalPrice?: CommercetoolsMoney;
    externalTotalPrice?: CommercetoolsExternalLineItemTotalPrice;
}

export interface CommercetoolsQuoteActionUpdateItemCustomField extends CommercetoolsEntityAction {
    lineItemId?: string;
    lineItemKey?: string;
    type: {
        id?: string;
        key?: string;
    };
    fields: {
        [key: string]: any;
    };
}

export interface CommercetoolsQuoteActionAddItems extends CommercetoolsEntityActionRequest {
    actions: CommercetoolsQuoteActionAddItem[];
}

export interface CommercetoolsPriceTier extends CommercetoolsEntity {
    minimumQuantity: number;
    value: CommercetoolsMoney;
}

export interface CommercetoolsDiscountedPrice extends CommercetoolsEntity {
    value: CommercetoolsMoney;
    discount: CommercetoolsReferenceField;
}

export interface CommercetoolsPrice extends CommercetoolsEntity {
    value: CommercetoolsMoney;
    country: string;
    customerGroup: CommercetoolsReferenceField;
    channel: CommercetoolsReferenceField;
    validFrom: string;
    validUntil: string;
    discounted: CommercetoolsDiscountedPrice;
    tiers: CommercetoolsPriceTier[];
    recurrencePolicy: CommercetoolsReferenceField;
}

export interface CommercetoolsDiscountedLineItemPortion {
    discount: CommercetoolsReferenceField;
    discountedAmount: CommercetoolsMoney;
}

export interface CommercetoolsDiscountedLineItemPrice {
    value: CommercetoolsMoney;
    includedDiscounts: CommercetoolsDiscountedLineItemPortion[];
}

export interface CommercetoolsDiscountedLineItemPriceForQuantity {
    quantity: number;
    discountedPrice: CommercetoolsDiscountedLineItemPrice;
}

export interface CommercetoolsTaxPortion {
    name: string;
    rate: number;
    amount: CommercetoolsMoney;
}

export interface CommercetoolsTaxedItemPrice {
    totalNet: CommercetoolsMoney;
    totalGross: CommercetoolsMoney;
    taxPortions: CommercetoolsTaxPortion[];
    totalTax: CommercetoolsMoney;
}

export interface CommercetoolsMethodTaxedPrice {
    shippingMethodKey: string;
    taxedPrice: CommercetoolsTaxedItemPrice;
}

export interface CommercetoolsItemState {
    quantity: number;
    state: CommercetoolsReferenceField;
}

export interface CommercetoolsSubRate {
    name: string;
    amount: number;
}

export interface CommercetoolsTaxRate extends CommercetoolsEntity {
    name: string;
    amount: number;
    includedInPrice: boolean;
    country: string;
    state: string;
    subRates: CommercetoolsSubRate[];
}

export interface CommercetoolsMethodTaxRate {
    shippingMethodKey: string;
    taxRate: CommercetoolsTaxRate;
}

export interface CommercetoolsItemShippingDetails {
    targets: CommercetoolsItemShippingTarget[];
    valid: boolean;
}

export interface CommercetoolsLineItemRecurrenceInfo {
    recurrencePolicy: CommercetoolsReferenceField;
    priceSelectionMode: string;
}

export interface CommercetoolsCustomField {
    type: {
        id?: string;
        key?: string;
    };
    fields: {
        [key: string]: any;
    };
}

export interface CommercetoolsQuoteLineItem extends CommercetoolsEntity {
    productId: string;
    productKey: string;
    name: CommercetoolsLocaleField;
    productSlug: CommercetoolsLocaleField;
    productType: CommercetoolsReferenceField;
    variant: CommercetoolsProductVariant;
    price: CommercetoolsPrice;
    quantity: number;
    totalPrice: CommercetoolsMoney;
    discountedPricePerQuantity: CommercetoolsDiscountedLineItemPriceForQuantity;
    taxedPrice: CommercetoolsTaxedItemPrice;
    taxedPricePortions: CommercetoolsMethodTaxedPrice[];
    state: CommercetoolsItemState[];
    taxRate: CommercetoolsTaxRate;
    perMethodTaxRate: CommercetoolsMethodTaxRate[];
    supplyChannel: CommercetoolsReferenceField;
    distributionChannel: CommercetoolsReferenceField;
    priceMode: string;
    lineItemMode: string;
    inventoryMode: string;
    shippingDetails: CommercetoolsItemShippingDetails[];
    addedAt: string;
    recurrenceInfo: CommercetoolsLineItemRecurrenceInfo;
    lastModifiedAt: string;
    custom: CommercetoolsCustomField;
    _product: Product;
}

export interface CommercetoolsCartDiscountValue {
    type: string;
    permyriad: number;
}

export interface CommercetoolsCartDiscount extends CommercetoolsEntity {
    name: CommercetoolsLocaleField;
    description: CommercetoolsLocaleField;
    value: CommercetoolsCartDiscountValue;
    cartPredicate: string;
    target: any;
    sortOrder: string;
    stores: CommercetoolsReferenceField[];
    isActive: boolean;
    validFrom: string;
    validUntil: string;
    requiresDiscountCode: boolean;
    references: CommercetoolsReferenceField[];
    stackingMode: string;
    discountGroup: CommercetoolsReferenceField;
}

export interface CommercetoolsCartDiscountReference extends CommercetoolsReferenceField {
    obj: CommercetoolsCartDiscount;
}

export interface CommercetoolsDiscountCode extends CommercetoolsEntity {
    name: CommercetoolsLocaleField;
    description: CommercetoolsLocaleField;
    code: string;
    cartDiscounts: CommercetoolsCartDiscountReference[];
    cartPredicate: string;
    isActive: boolean;
    references: CommercetoolsReferenceField;
    maxApplications: number;
    maxApplicationsPerCustomer: number;
    groups: string[];
    validFrom: string;
    validUntil: string;
}

export interface CommercetoolsDiscountCodeReference extends CommercetoolsReferenceField {
    obj: CommercetoolsDiscountCode;
}

export interface CommercetoolsDiscountCodeInfo {
    discountCode: CommercetoolsDiscountCodeReference;
    state: string;
}

export interface CommercetoolsDiscountReferenceField extends CommercetoolsReferenceField {
    obj: {
        [key: string]: any;
    };
}

export interface CommercetoolsDiscountedTotalPricePortion {
    discount: CommercetoolsDiscountReferenceField;
    discountedAmount: CommercetoolsMoney;
}

export interface CommercetoolsDiscountOnTotalPrice {
    discountedAmount: CommercetoolsMoney;
    includedDiscounts: CommercetoolsDiscountedTotalPricePortion[];
    discountedNetAmount: CommercetoolsMoney;
    discountedGrossAmount: CommercetoolsMoney;
}

export interface CommercetoolsShippingMethodReference extends CommercetoolsReferenceField {
    obj: CommercetoolsShippingMethod;
}

export interface CommercetoolsDeliveryItem {
    id: string;
    quantity: number;
}

export interface CommercetoolsParcelMeasurement {
    heightInMillimeter: number;
    lengthInMillimeter: number;
    widthInMillimeter: number;
    weightInGram: number;
}

export interface CommercetoolsTrackingData {
    trackingId: String;
    carrier: String;
    provider: String;
    providerTransaction: string;
    isReturn: boolean;
}

export interface CommercetoolsParcel extends CommercetoolsEntity {
    measurements: CommercetoolsParcelMeasurement;
    trackingData: CommercetoolsTrackingData;
    items: CommercetoolsDeliveryItem[];
}

export interface CommercetoolsDelivery extends CommercetoolsEntity {
    items: CommercetoolsDeliveryItem[];
    parcels: CommercetoolsParcel[];
    address: CommercetoolsAddress;
}

export interface CommercetoolsShippingInfo {
    shippingMethodName: string;
    price: CommercetoolsMoney;
    shippingRate: CommercetoolsShippingRate;
    taxedPrice: CommercetoolsTaxedItemPrice;
    taxRate: CommercetoolsTaxRate;
    taxCategory: CommercetoolsTaxCategoryReference;
    shippingMethod: CommercetoolsShippingMethodReference;
    deliveries: CommercetoolsDelivery[];
    discountedPrice: CommercetoolsDiscountedLineItemPrice;
    shippingMethodState: string;
}

export interface CommercetoolsTaxedPrice {
    totalNet: CommercetoolsMoney;
    totalGross: CommercetoolsMoney;
    taxPortions: CommercetoolsTaxPortion[];
    totalTax: CommercetoolsMoney;
}

export interface CommercetoolsQuote extends CommercetoolsEntity {
    taxedShippingPrice: any;
    type: string;
    lineItems: CommercetoolsQuoteLineItem[];
    cartState: string;
    totalPrice: CommercetoolsMoney;
    shippingMode: string;
    shipping: any[];
    shippingAddress: CommercetoolsAddress;
    billingAddress: CommercetoolsAddress;
    customLineItems: any[];
    discountCodes: CommercetoolsDiscountCodeInfo[];
    discountOnTotalPrice: CommercetoolsDiscountOnTotalPrice;
    directDiscounts: any[];
    inventoryMode: string;
    taxMode: string;
    priceRoundingMode: string;
    taxRoundingMode: string;
    taxCalculationMode: string;
    refusedGifts: any[];
    origin: string;
    itemShippingAddresses: any[];
    shippingInfo: CommercetoolsShippingInfo;
    totalLineItemQuantity: number;
    taxedPrice: CommercetoolsTaxedPrice;
    customerId: string;
}

export interface CommercetoolsTaxCategory extends CommercetoolsEntity {
    name: string;
    description: string;
    rates: CommercetoolsTaxRate[];
}

export interface CommercetoolsTaxCategoryReference extends CommercetoolsReferenceField {
    obj: CommercetoolsTaxCategory;
}

export interface CommercetoolsLocation {
    country: string;
    state: string;
}

export interface CommercetoolsZone extends CommercetoolsEntity {
    name: string;
    description: string;
    locations: CommercetoolsLocation[];
}

export interface CommercetoolsZoneReference extends CommercetoolsReferenceField {
    obj: CommercetoolsZone;
}

export interface CommercetoolsShippingRate {
    price: CommercetoolsMoney;
    freeAbove: CommercetoolsMoney;
    isMatching: boolean;
    tiers: any;
}

export interface CommercetoolsZoneRate {
    zone: CommercetoolsZoneReference;
    shippingRates: CommercetoolsShippingRate[];
}

export interface CommercetoolsShippingMethod extends CommercetoolsEntity {
    name: string;
    localizedName: CommercetoolsLocaleField;
    localizedDescription: CommercetoolsLocaleField;
    taxCategory: CommercetoolsTaxCategoryReference;
    zoneRates: CommercetoolsZoneRate[];
    active: boolean;
    isDefault: boolean;
    predication: string;
}

export interface CommercetoolsShippingMethodResultSet extends CommercetoolsResultSet {
    results: CommercetoolsShippingMethod[];
}

export const QuoteActions = {
    addLineItem: 'addLineItem',
    removeLineItem: 'removeLineItem',
    changeLineItemQuantity: 'changeLineItemQuantity',
    setShippingAddress: 'setShippingAddress',
    setShippingMethod: 'setShippingMethod',
    setLineItemCustomType: 'setLineItemCustomType',
    setLineItemCustomField: 'setLineItemCustomField',
};
