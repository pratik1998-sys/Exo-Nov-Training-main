import { Context } from '@nestjs/graphql';
import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { Cart, CartAddressInput, CartCheckout, CartItemAddInput, CartItemDeleteInput, CartItemUpdateInput, CartPaymentMethodInput, CartPaymentOptions, CartShippingMethodInput, CartShippingOptions, CartUpdateInput } from './cart.model';
import { CartApiConfiguration } from './cart.api.configuration';
import { CartRequestParameters } from './cart.parameters';
import { CartService } from './cart.service';
import { ItemFilterInput, ShippingMethodResultSet } from '@feature-commerce/common';
import { PaginationInput } from '@feature/models';
import { SortByInput } from '@feature/models';
import { BaseFeatureResolver } from '@feature/resolver';
import { CartModule } from '@feature-commerce/cart';

const feature = CartModule.feature;

@Resolver((of) => Cart, { feature })
export class CartResolver extends BaseFeatureResolver {
    @Query(() => Cart, CartApiConfiguration.cart().queryOptions, feature)
    async cart(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.filter, type: () => ItemFilterInput, required: false })
        filter: ItemFilterInput,
        @Args({ parameter: CartRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: CartRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context: any,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.getCart(id, filter, pagination, sortBy, requestContext, context);
    }

    @Mutation(() => Cart, CartApiConfiguration.cartUpdate().mutationOptions, feature)
    async cartUpdate(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.updateCart, type: () => CartUpdateInput, required: true })
        updateCartInput: CartUpdateInput,
        @Args({ parameter: CartRequestParameters.filter, type: () => ItemFilterInput, required: false })
        filter: ItemFilterInput,
        @Args({ parameter: CartRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: CartRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context: any,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.updateCart(id, updateCartInput, filter, pagination, sortBy, requestContext, context);
    }

    @Mutation(() => Cart, CartApiConfiguration.cartDelete().mutationOptions, feature)
    async cartDelete(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Context()
        context: any,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.deleteCart(id, requestContext, context);
    }

    @Mutation(() => Cart, CartApiConfiguration.cartItemsAdd().mutationOptions, feature)
    async cartItemsAdd(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.items, type: () => [CartItemAddInput], required: true })
        items: CartItemAddInput[],
        @Args({ parameter: CartRequestParameters.filter, type: () => ItemFilterInput, required: false })
        filter: ItemFilterInput,
        @Args({ parameter: CartRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: CartRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context: any,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.addCartItems(id, items, filter, pagination, sortBy, requestContext, context);
    }

    @Mutation(() => Cart, CartApiConfiguration.cartItemsUpdate().mutationOptions, feature)
    async cartItemsUpdate(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.items, type: () => [CartItemUpdateInput], required: true })
        items: CartItemUpdateInput[],
        @Args({ parameter: CartRequestParameters.filter, type: () => ItemFilterInput, required: false })
        filter: ItemFilterInput,
        @Args({ parameter: CartRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: CartRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context: any,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.updateCartItems(id, items, filter, pagination, sortBy, requestContext, context);
    }

    @Mutation(() => Cart, CartApiConfiguration.cartItemsDelete().mutationOptions, feature)
    async cartItemsDelete(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.items, type: () => [CartItemDeleteInput], required: true })
        items: CartItemDeleteInput[],
        @Args({ parameter: CartRequestParameters.filter, type: () => ItemFilterInput, required: false })
        filter: ItemFilterInput,
        @Args({ parameter: CartRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: CartRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context: any,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.deleteCartItems(id, items, filter, pagination, sortBy, requestContext, context);
    }

    @Query(() => ShippingMethodResultSet, CartApiConfiguration.cartShippingMethods().queryOptions, feature)
    async cartShippingMethods(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<ShippingMethodResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return service.getShippingMethods(id, pagination, requestContext, context);
    }

    @Query(() => CartShippingOptions, CartApiConfiguration.cartShippingOptions().queryOptions, feature)
    async cartShippingOptions(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Context()
        context: any,
    ): Promise<CartShippingOptions> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.getShippingOptions(id, requestContext, context);
    }

    @Query(() => CartPaymentOptions, CartApiConfiguration.cartPaymentOptions().queryOptions, feature)
    async cartPaymentOptions(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Context()
        context: any,
    ): Promise<CartPaymentOptions> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.getPaymentOptions(id, requestContext, context);
    }

    @Mutation(() => Cart, CartApiConfiguration.cartShippingUpdate().mutationOptions, feature)
    async cartShippingUpdate(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.shippingMethod, type: () => CartShippingMethodInput, required: false })
        shippingMethod: CartShippingMethodInput,
        @Args({ parameter: CartRequestParameters.address, type: () => CartAddressInput, required: false })
        address: CartAddressInput,
        @Context()
        context,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.updateShipping(id, address, shippingMethod, requestContext, context);
    }

    @Mutation(() => Cart, CartApiConfiguration.cartPaymentAdd().mutationOptions, feature)
    async cartPaymentAdd(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.paymentMethods, type: () => [CartPaymentMethodInput], required: false })
        paymentMethods: CartPaymentMethodInput[],
        @Args({ parameter: CartRequestParameters.isSplitPayment, type: () => Boolean, required: false })
        isSplitPayment: boolean,
        @Context()
        context,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.addPayments(id, paymentMethods, isSplitPayment, requestContext, context);
    }

    @Mutation(() => Cart, CartApiConfiguration.cartCouponAdd().mutationOptions, feature)
    async cartCouponAdd(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.couponCode, required: true })
        couponCode: string,
        @Context()
        context,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.addCouponCode(id, couponCode, requestContext, context);
    }

    @Mutation(() => Cart, CartApiConfiguration.cartCouponRemove().mutationOptions, feature)
    async cartCouponRemove(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.couponCodeId, required: true })
        couponCodeId: string,
        @Context()
        context,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.removeCouponCode(id, couponCodeId, requestContext, context);
    }

    @Mutation(() => Cart, CartApiConfiguration.cartPrecheckout().mutationOptions, feature)
    async cartPrecheckout(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Args({ parameter: CartRequestParameters.filter, type: () => ItemFilterInput, required: false })
        filter: ItemFilterInput,
        @Args({ parameter: CartRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Args({ parameter: CartRequestParameters.sortBy, type: () => SortByInput, required: false })
        sortBy: SortByInput,
        @Context()
        context,
    ): Promise<Cart> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.precheckout(id, filter, pagination, sortBy, requestContext, context);
    }

    @Mutation(() => CartCheckout, CartApiConfiguration.cartCheckout().mutationOptions, feature)
    async cartCheckout(
        @Args({ parameter: CartRequestParameters.id, required: false })
        id: string,
        @Context()
        context,
    ): Promise<CartCheckout> {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(context, CartService);

        return await service.checkout(id, requestContext, context);
    }
}
