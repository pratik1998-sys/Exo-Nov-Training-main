import { HttpException } from '@nestjs/common';
import { ErrorType } from '@error/error';
import { CartErrors, CartErrorsType } from '@feature-commerce/cart';

export interface SAPCommerceCartErrorsType extends CartErrorsType {
    cartUpdateInvalidAction: ErrorType;
    cartItemUpdateInvalidQuantity: ErrorType;
    cartCheckoutMissingCartId: ErrorType;
}

export class SAPCommerceCartErrors extends CartErrors {
    static errors: SAPCommerceCartErrorsType = {
        ...CartErrors.errors,
        cartUpdateInvalidAction: {
            code: 'CART_UPDATE_INVALID_ACTION',
            message: 'Invalid cart update action',
            statusCode: 400,
        },
        cartItemUpdateInvalidQuantity: {
            code: 'CART_ITEM_UPDATE_INVALID_QUANTITY',
            message: 'Invalid cart item update quantity',
            statusCode: 400,
        },
        cartCheckoutMissingCartId: {
            code: 'CART_CHECKOUT_MISSING_CART_ID',
            message: 'Missing required cart id',
            statusCode: 400,
        },
    };

    static cartUpdateInvalidAction(): HttpException {
        return this.composeHTTPError(this.errors.cartUpdateInvalidAction);
    }

    static cartItemUpdateInvalidQuantity(): HttpException {
        return this.composeHTTPError(this.errors.cartItemUpdateInvalidQuantity);
    }

    static cartCheckoutMissingCartId(): HttpException {
        return this.composeHTTPError(this.errors.cartCheckoutMissingCartId);
    }
}
