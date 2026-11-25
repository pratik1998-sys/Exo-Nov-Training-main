import { Body, Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import { Cart, CartCheckout, CartCouponAddInputBody, CartItemAddInput, CartItemsAddInputBody, CartItemsDeleteInputBody, CartItemsUpdateInputBody, CartItemUpdateInput, CartPaymentAddInputBody, CartPaymentOptions, CartPresubmitInputBody, CartShippingMethodsQuery, CartShippingOptions, CartShippingUpdateInputBody } from './cart.model';
import { CartRequestParameters } from './cart.parameters';
import { CartModule } from './cart.module';
import { CartApiConfiguration } from './cart.api.configuration';
import { CartService } from './cart.service';
import { RequestContext } from '@context/request';
import { ShippingMethodResultSet } from '@feature-commerce/common';
import { QuoteController, QuoteResultSetQuery } from '@feature-commerce/quote';

const feature = CartModule.feature;

@Controller({ tags: 'cart', path: 'cart', feature })
export class CartController extends QuoteController {
    @Get(CartApiConfiguration.cart().restOptions, feature)
    async cart(@Param(CartRequestParameters.id.id) id: string, @Query() query: QuoteResultSetQuery, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        const q = this.processResultSetQuery(query);

        return await service.getCart(cartId, q.filter, q.pagination, q.sortBy, requestContext, request);
    }

    @Delete(CartApiConfiguration.cartDelete().restOptions, feature)
    async cartDelete(@Param(CartRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        return await service.deleteCart(cartId, requestContext, request);
    }

    @Post(CartApiConfiguration.cartItemAdd().restOptions, feature)
    async cartItemAdd(@Param(CartRequestParameters.id.id) id: string, @Body() body: CartItemAddInput, @Query() query: QuoteResultSetQuery, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        const q = this.processResultSetQuery(query);

        return await service.addCartItems(cartId, [body], q.filter, q.pagination, q.sortBy, requestContext, request);
    }

    @Post(CartApiConfiguration.cartItemsAdd().restOptions, feature)
    async cartItemsAdd(@Param(CartRequestParameters.id.id) id: string, @Body() body: CartItemsAddInputBody, @Query() query: QuoteResultSetQuery, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        const q = this.processResultSetQuery(query);

        return await service.addCartItems(cartId, body.items, q.filter, q.pagination, q.sortBy, requestContext, request);
    }

    @Put(CartApiConfiguration.cartItemUpdate().restOptions, feature)
    async cartItemUpdate(
        @Param(CartRequestParameters.id.id) id: string,
        @Param(CartRequestParameters.itemId.id) itemId: string,
        @Body() body: CartItemUpdateInput,
        @Query() query: QuoteResultSetQuery,
        @Req() request: FastifyRequest,
    ): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        const q = this.processResultSetQuery(query);

        body.id = itemId;

        return await service.updateCartItems(cartId, [body], q.filter, q.pagination, q.sortBy, requestContext, request);
    }

    @Put(CartApiConfiguration.cartItemsUpdate().restOptions, feature)
    async cartItemsUpdate(@Param(CartRequestParameters.id.id) id: string, @Body() body: CartItemsUpdateInputBody, @Query() query: QuoteResultSetQuery, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        const q = this.processResultSetQuery(query);

        return await service.updateCartItems(cartId, body.items, q.filter, q.pagination, q.sortBy, requestContext, request);
    }

    @Delete(CartApiConfiguration.cartItemDelete().restOptions, feature)
    async cartItemDelete(
        @Param(CartRequestParameters.id.id) id: string,
        @Param(CartRequestParameters.itemId.id) itemId: string,
        @Query() query: QuoteResultSetQuery,
        @Req() request: FastifyRequest,
    ): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        const q = this.processResultSetQuery(query);

        return await service.deleteCartItems(cartId, [{ id: itemId }], q.filter, q.pagination, q.sortBy, requestContext, request);
    }

    @Put(CartApiConfiguration.cartItemsDelete().restOptions, feature)
    async cartItemsDelete(@Param(CartRequestParameters.id.id) id: string, @Body() body: CartItemsDeleteInputBody, @Query() query: QuoteResultSetQuery, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        const q = this.processResultSetQuery(query);

        return await service.deleteCartItems(cartId, body.items, q.filter, q.pagination, q.sortBy, requestContext, request);
    }

    @Get(CartApiConfiguration.cartShippingMethods().restOptions, feature)
    async cartShippingMethods(@Param(CartRequestParameters.id.id) id: string, @Query() query: CartShippingMethodsQuery, @Req() request: FastifyRequest): Promise<ShippingMethodResultSet> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        const q = this.processResultSetQuery(query);

        return await service.getShippingMethods(cartId, q.pagination, requestContext, request);
    }

    @Get(CartApiConfiguration.cartShippingOptions().restOptions, feature)
    async cartShippingOptions(@Param(CartRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<CartShippingOptions> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        return await service.getShippingOptions(cartId, requestContext, request);
    }

    @Get(CartApiConfiguration.cartPaymentOptions().restOptions, feature)
    async cartPaymentOptions(@Param(CartRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<CartPaymentOptions> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        return await service.getPaymentOptions(cartId, requestContext, request);
    }

    @Post(CartApiConfiguration.cartShippingUpdate().restOptions, feature)
    async cartShippingUpdate(@Param(CartRequestParameters.id.id) id: string, @Body() body: CartShippingUpdateInputBody, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        return await service.updateShipping(cartId, body.address, body.shippingMethod, requestContext, request);
    }

    @Post(CartApiConfiguration.cartPaymentAdd().restOptions, feature)
    async cartPaymentAdd(@Param(CartRequestParameters.id.id) id: string, @Body() body: CartPaymentAddInputBody, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        return await service.addPayments(cartId, body.payments, body.isSplitPayment, requestContext, request);
    }

    @Post(CartApiConfiguration.cartCouponAdd().restOptions, feature)
    async cartCouponAdd(@Param(CartRequestParameters.id.id) id: string, @Body() body: CartCouponAddInputBody, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        return await service.addCouponCode(cartId, body.couponCode, requestContext, request);
    }

    @Delete(CartApiConfiguration.cartCouponRemove().restOptions, feature)
    async cartCouponRemove(@Param(CartRequestParameters.id.id) id: string, @Param(CartRequestParameters.couponCodeId.id) couponCodeId: string, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        return await service.removeCouponCode(cartId, couponCodeId, requestContext, request);
    }

    @Post(CartApiConfiguration.cartPrecheckout().restOptions, feature)
    async cartPrecheckout(@Param(CartRequestParameters.id.id) id: string, @Body() body: CartPresubmitInputBody, @Query() query: QuoteResultSetQuery, @Req() request: FastifyRequest): Promise<Cart> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        const q = this.processResultSetQuery(query);

        return await service.precheckout(cartId, q.filter, q.pagination, q.sortBy, requestContext, request);
    }

    @Post(CartApiConfiguration.cartCheckout().restOptions, feature)
    async cartCheckout(@Param(CartRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<CartCheckout> {
        const { requestContext, service, cartId } = this.resolveCartIdCartServiceRequestContext(request, id);

        return await service.checkout(cartId, requestContext, request);
    }

    protected resolveCartIdCartServiceRequestContext(request: FastifyRequest, id: string): { cartId: string; service: CartService; requestContext: RequestContext } {
        const { requestContext, service } = this.getRequestContextAndService<CartService>(request, CartService);

        const cartId = this.resolveCartId(id);

        return { cartId, service, requestContext };
    }

    protected resolveCartId(id: string) {
        let cartId;

        if (id && id.toLowerCase() != 'current') {
            cartId = id;
        }

        return cartId;
    }
}
