import { BaseFeatureService } from "@feature/service";
import { RequestContext } from "@context/request";
import { Cart, CartAddressInput, CartCheckout, CartItemAddInput, CartItemDeleteInput, CartItemUpdateInput, CartPaymentMethodInput, CartPaymentOptions, CartShippingMethodInput, CartShippingOptions, CartUpdateInput } from "./cart.model";
import { ItemFilterInput, ShippingMethodResultSet } from "@feature-commerce/common";
import { PaginationInput, SortByInput } from "@feature/models";

export abstract class CartService extends BaseFeatureService {
    abstract getCart(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart>;
    abstract deleteCart(id: string, requestContext: RequestContext, context?: any): Promise<Cart>;
    abstract updateCart(
        id: string,
        cartUpdateInput: CartUpdateInput,
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart>;
    abstract addCartItems(
        id: string,
        items: CartItemAddInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart>;
    abstract updateCartItems(
        id: string,
        items: CartItemUpdateInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart>;
    abstract deleteCartItems(
        id: string,
        items: CartItemDeleteInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart>;

    abstract precheckout(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart>;

    abstract checkout(id: string, requestContext: RequestContext, context?: any): Promise<CartCheckout>;

    abstract getShippingMethods(id: string, paginationInput: PaginationInput, requestContext: RequestContext, context?: any): Promise<ShippingMethodResultSet>;

    abstract getShippingOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartShippingOptions>;
    abstract getPaymentOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartPaymentOptions>;

    abstract addCouponCode(id: string, couponCode: string, requestContext: RequestContext, context?: any): Promise<Cart>;
    abstract removeCouponCode(id: string, couponCodeId: string, requestContext: RequestContext, context?: any): Promise<Cart>;

    abstract mergeCarts(fromCartId: string, toCartId: string, requestContext: RequestContext, context?: any): Promise<Cart>;

    abstract updateShipping(id: string, addressInput: CartAddressInput, shippingMethod: CartShippingMethodInput, requestContext: RequestContext, context?: any): Promise<Cart>;
    abstract addPayments(id: string, paymentMethods: CartPaymentMethodInput[], isSplitPayment: boolean, requestContext: RequestContext, context?: any): Promise<Cart>;
}
