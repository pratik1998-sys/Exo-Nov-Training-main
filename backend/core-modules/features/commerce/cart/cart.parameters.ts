import { RequestParameterDefinition } from "@api-parameters";
import { CommerceRequestParameters, CommerceRequestParametersType } from "@feature-commerce/common";

export interface CartRequestParametersType extends CommerceRequestParametersType {
    itemId: RequestParameterDefinition;
    items: RequestParameterDefinition;
    address: RequestParameterDefinition;
    billingAddress: RequestParameterDefinition;
    shippingAddress: RequestParameterDefinition;
    shippingMethod: RequestParameterDefinition;
    paymentMethod: RequestParameterDefinition;
    paymentMethods: RequestParameterDefinition;
    couponCodeId: RequestParameterDefinition;
    couponCode: RequestParameterDefinition;
    updateCart: RequestParameterDefinition;
    isSplitPayment: RequestParameterDefinition;
}

export const CartRequestParameters: CartRequestParametersType = {
    ...CommerceRequestParameters,
    itemId: {
        id: 'itemId',
        description: 'cart item id',
    },
    items: {
        id: 'items',
        description: 'cart items',
    },
    address: {
        id: 'address',
        description: 'address',
    },
    billingAddress: {
        id: 'billingAddress',
        description: 'Billing address',
    },
    shippingAddress: {
        id: 'billingAddress',
        description: 'Billing address',
    },
    shippingMethod: {
        id: 'shippingMethod',
        description: 'Billing address',
    },
    paymentMethod: {
        id: 'paymentMethod',
        description: 'Payment method',
    },
    paymentMethods: {
        id: 'paymentMethods',
        description: 'Payment methods',
    },
    couponCodeId: {
        id: 'couponCodeId',
        description: 'Coupon code id',
    },
    couponCode: {
        id: 'couponCode',
        description: 'Coupon code',
    },
    updateCart: {
        id: 'updateCart',
        description: 'update cart input',
    },
    isSplitPayment: {
        id: 'isSplitPayment',
        description: 'is payment split - will not delete all other payments if true',
    },
};
