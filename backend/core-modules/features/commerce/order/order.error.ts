import { ErrorType } from '@error';
import { CommerceErrors, CommerceErrorsType } from '@feature-commerce/common';
import { HttpException } from '@nestjs/common';

export interface OrderErrorsType extends CommerceErrorsType {
    getOrdersFailed: ErrorType;
    getOrderFailed: ErrorType;
    updateOrderFailed: ErrorType;
    invalidGetOrderRequest: ErrorType;
    invalidGetOrdersRequest: ErrorType;
    ordersPageSizeExceedsMax: ErrorType;
    invalidGuestOrderSearch: ErrorType;
    guestOrderSearchFailed: ErrorType;
}

export class OrderErrors extends CommerceErrors {
    protected static errors: OrderErrorsType = {
        ...CommerceErrors.errors,

        getOrdersFailed: {
            code: 'ORDERS_GET_FAILED',
            message: 'Get orders failed',
            statusCode: 400,
        },
        getOrderFailed: {
            code: 'ORDER_GET_FAILED',
            message: 'Get order failed',
            statusCode: 400,
        },
        updateOrderFailed: {
            code: 'ORDER_UPDATE_FAILED',
            message: 'Update order failed',
            statusCode: 400,
        },
        invalidGetOrderRequest: {
            code: 'ORDER_GET_INVALID_REQUEST',
            message: 'Invalid get order request',
            statusCode: 400,
        },
        invalidGetOrdersRequest: {
            code: 'ORDERS_GET_INVALID_REQUEST',
            message: 'Invalid get orders request',
            statusCode: 400,
        },
        ordersPageSizeExceedsMax: {
            code: 'ORDERS_PAGINATION_PAGE_SIZE_EXCEEDS_MAX',
            message: 'Request page size exceeds max',
            statusCode: 400,
        },
        invalidGuestOrderSearch: {
            code: 'ORDER_GUEST_SEARCH_INVALID',
            message: 'Invalid guest order search',
            statusCode: 400,
        },
        guestOrderSearchFailed: {
            code: 'ORDER_GUEST_SEARCH_FAILED',
            message: 'Guest order search failed',
            statusCode: 400,
        }
    };

    static getOrdersFailed(): HttpException {
        return this.composeHTTPError(this.errors.getOrdersFailed);
    }

    static getOrderFailed(): HttpException {
        return this.composeHTTPError(this.errors.getOrderFailed);
    }

    static invalidGetOrderRequest(): HttpException {
        return this.composeHTTPError(this.errors.invalidGetOrderRequest);
    }

    static invalidGetOrdersRequest(): HttpException {
        return this.composeHTTPError(this.errors.invalidGetOrdersRequest);
    }

    static ordersPageSizeExceedsMax(): HttpException {
        return this.composeHTTPError(this.errors.ordersPageSizeExceedsMax);
    }

    static invalidGuestOrderSearch(): HttpException {
        return this.composeHTTPError(this.errors.invalidGuestOrderSearch);
    }

    static guestOrderSearchFailed(): HttpException {
        return this.composeHTTPError(this.errors.guestOrderSearchFailed);
    }

    static updateOrderFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateOrderFailed);
    }
}
