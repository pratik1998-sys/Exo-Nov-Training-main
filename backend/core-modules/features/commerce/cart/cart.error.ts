import { ErrorType } from '@error/error';
import { CommerceErrors, CommerceErrorsType } from '@feature-commerce/common';
import { HttpException } from '@nestjs/common';

export interface CartErrorsType extends CommerceErrorsType {
    getCartFailed: ErrorType;
    deleteCartFailed: ErrorType;
    updateCartFailed: ErrorType;
    missingCartId: ErrorType;
    addCartItemsFailed: ErrorType;
    updateCartItemsFailed: ErrorType;
    deleteCartItemsFailed: ErrorType;
    createCartFailed: ErrorType;
    updateCartShippingAddressFailed: ErrorType;
    updateCartShippingFailed: ErrorType;
    updateCartBillingAddressFailed: ErrorType;
    addCouponCodeFailed: ErrorType;
    removeCouponCodeFailed: ErrorType;
    getCartShippingMethodsFailed: ErrorType;
    getCartPaymentMethodsFailed: ErrorType;
    getCartShippingOptionsFailed: ErrorType;
    getCartPaymentOptionsFailed: ErrorType;
    addPaymentsFailed: ErrorType;
    precheckoutFailed: ErrorType;
    checkoutFailed: ErrorType;
}

export class CartErrors extends CommerceErrors {
    static errors: CartErrorsType = {
        ...CommerceErrors.errors,
        getCartFailed: {
            code: 'CART_GET_FAILED',
            message: 'Get cart failed',
            statusCode: 400,
        },
        deleteCartFailed: {
            code: 'CART_DELETE_FAILED',
            message: 'Delete cart failed',
            statusCode: 400,
        },
        updateCartFailed: {
            code: 'CART_UPDATE_FAILED',
            message: 'Update cart failed',
            statusCode: 400,
        },
        missingCartId: {
            code: 'CART_MISSING_CART_ID',
            message: 'Missing required cart id',
            statusCode: 400,
        },
        addCartItemsFailed: {
            code: 'CART_ITEMS_ADD_FAILED',
            message: 'Add cart items failed',
            statusCode: 400,
        },
        updateCartItemsFailed: {
            code: 'CART_ITEMS_UPDATE_FAILED',
            message: 'Update cart items failed',
            statusCode: 400,
        },
        deleteCartItemsFailed: {
            code: 'CART_ITEMS_DELETE_FAILED',
            message: 'Delete cart items failed',
            statusCode: 400,
        },
        createCartFailed: {
            code: 'CART_CREATE_FAILED',
            message: 'Create cart failed',
            statusCode: 400,
        },
        updateCartShippingAddressFailed: {
            code: 'CART_UPDATE_SHIPPING_ADDRESS_FAILED',
            message: 'Update cart shipping address failed',
            statusCode: 400,
        },
        updateCartShippingFailed: {
            code: 'CART_UPDATE_SHIPPING_FAILED',
            message: 'Update cart shipping failed',
            statusCode: 400,
        },
        updateCartBillingAddressFailed: {
            code: 'CART_UPDATE_BILLING_ADDRESS_FAILED',
            message: 'Update cart billing address failed',
            statusCode: 400,
        },
        addCouponCodeFailed: {
            code: 'CART_ADD_COUPON_CODE_FAILED',
            message: 'Add coupon code failed',
            statusCode: 400,
        },
        removeCouponCodeFailed: {
            code: 'CART_REMOVE_COUPON_CODE_FAILED',
            message: 'Remove coupon code failed',
            statusCode: 400,
        },
        getCartShippingMethodsFailed: {
            code: 'CART_GET_SHIPPING_METHODS_FAILED',
            message: 'Get shipping methods failed',
            statusCode: 400,
        },
        getCartPaymentMethodsFailed: {
            code: 'CART_GET_PAYMENT_METHODS_FAILED',
            message: 'Get payment methods failed',
            statusCode: 400,
        },
        getCartShippingOptionsFailed: {
            code: 'CART_GET_SHIPPING_OPTIONS_FAILED',
            message: 'Get shipping methods failed',
            statusCode: 400,
        },
        getCartPaymentOptionsFailed: {
            code: 'CART_GET_PAYMENT_OPTIONS_FAILED',
            message: 'Get payment methods failed',
            statusCode: 400,
        },
        addPaymentsFailed: {
            code: 'CART_ADD_PAYMENTS_FAILED',
            message: 'Add cart payments failed',
            statusCode: 400,
        },
        precheckoutFailed: {
            code: 'CART_PRECHECKOUT_FAILED',
            message: 'Cart precheckout failed',
            statusCode: 400,
        },
        checkoutFailed: {
            code: 'ORDER_CHECKOUT_FAILED',
            message: 'Cart checkout failed',
            statusCode: 400,
        }
    }

    static getCartFailed(): HttpException {
        return this.composeHTTPError(this.errors.getCartFailed);
    }

    static deleteCartFailed(): HttpException {
        return this.composeHTTPError(this.errors.deleteCartFailed);
    }

    static updateCartFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateCartFailed);
    }

    static missingCartId(): HttpException {
        return this.composeHTTPError(this.errors.missingCartId);
    }

    static addCartItemsFailed(): HttpException {
        return this.composeHTTPError(this.errors.addCartItemsFailed);
    }

    static updateCartItemsFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateCartItemsFailed);
    }

    static deleteCartItemsFailed(): HttpException {
        return this.composeHTTPError(this.errors.deleteCartItemsFailed);
    }

    static createCartFailed(): HttpException {
        return this.composeHTTPError(this.errors.createCartFailed);
    }

    static updateCartBillingAddressFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateCartBillingAddressFailed);
    }

    static updateCartShippingAddressFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateCartShippingAddressFailed);
    }

    static updateCartShippingFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateCartShippingFailed);
    }

    static addCouponCodeFailed(): HttpException {
        return this.composeHTTPError(this.errors.addCouponCodeFailed);
    }

    static removeCouponCodeFailed(): HttpException {
        return this.composeHTTPError(this.errors.removeCouponCodeFailed);
    }

    static getCartShippingMethodsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getCartShippingMethodsFailed);
    }

    static getCartPaymentMethodsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getCartPaymentMethodsFailed);
    }

    static getCartShippingOptionsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getCartShippingOptionsFailed);
    }

    static getCartPaymentOptionsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getCartPaymentOptionsFailed);
    }

    static addPaymentsFailed(): HttpException {
        return this.composeHTTPError(this.errors.addPaymentsFailed);
    }

    static precheckoutFailed(): HttpException {
        return this.composeHTTPError(this.errors.precheckoutFailed);
    }

    static checkoutFailed(): HttpException {
        return this.composeHTTPError(this.errors.checkoutFailed);
    }
}
