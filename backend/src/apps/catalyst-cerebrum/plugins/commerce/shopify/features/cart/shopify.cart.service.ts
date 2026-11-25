import { ShopifyBaseServiceImpl } from '@plugin-shopify/common';
import { ShopifyCartDatasource } from './shopify.cart.datasource';
import { ShopifyCartMapper } from './shopify.cart.mapper';
import { Cart, CartAddressInput, CartCheckout, CartItemAddInput, CartItemDeleteInput, CartItemUpdateInput, CartPaymentMethodInput, CartPaymentOptions, CartService, CartShippingMethodInput, CartShippingOptions, CartUpdateInput } from '@feature-commerce/cart';
import { PaginationInput, SortByInput } from '@feature/models';
import { ItemFilterInput, ShippingMethodResultSet } from '@feature-commerce/common';
import { RequestContext } from '@context/request';

export class ShopifyCartServiceImpl extends ShopifyBaseServiceImpl implements CartService {
    async getCart(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const ds = this.getCartDatasource(requestContext);
        const mapper = this.getCartMapper(requestContext);

        const response: any = await ds.getCart(requestContext, id);
        // Pass the data block directly to the mapper
        return mapper.mapCart(response?.data || response, requestContext);
    }

    async addCartItems(
        id: string,
        items: CartItemAddInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const ds = this.getCartDatasource(requestContext);
        const mapper = this.getCartMapper(requestContext);

        const targetId = id || 'current';
        const response: any = await ds.addCartItems(requestContext, targetId, items);

        // Pass the whole response. The mapper is now robust enough to find the cart
        return mapper.mapCart(response?.data || response, requestContext);
    }

    async updateShipping(id: string, addressInput: CartAddressInput, shippingMethod: CartShippingMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const ds = this.getCartDatasource(requestContext);
        const mapper = this.getCartMapper(requestContext);

        const response: any = await ds.updateShipping(requestContext, id, addressInput);
        return mapper.mapCart(response?.data || response, requestContext);
    }

    protected getCartDatasource(requestContext: RequestContext) {
        return this.getDatasource<ShopifyCartDatasource>(requestContext, ShopifyCartDatasource);
    }

    protected getCartMapper(requestContext: RequestContext) {
        return this.getMapper<ShopifyCartMapper>(requestContext, ShopifyCartMapper);
    }
    async deleteCartItems(
        id: string,
        items: CartItemDeleteInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const ds = this.getCartDatasource(requestContext);
        const mapper = this.getCartMapper(requestContext);

        // If ID is 'current' or null, delete won't work in Shopify
        // because you can't delete from a cart that hasn't been created/identified.
        if (!id || id.toLowerCase() === 'current') {
            throw new Error('Cannot delete items without a valid Cart ID');
        }

        const response: any = await ds.deleteCartItems(requestContext, id, items);

        return mapper.mapCart(response?.data || response, requestContext);
    }
    async updateCartItems(
        id: string,
        items: CartItemUpdateInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const ds = this.getCartDatasource(requestContext);
        const mapper = this.getCartMapper(requestContext);

        const response: any = await ds.updateCartItems(requestContext, id, items);

        return mapper.mapCart(response?.data || response, requestContext);
    }

    // --- Mandatory Implementations (Stubs) ---

    precheckout(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    checkout(id: string, requestContext: RequestContext, context?: any): Promise<CartCheckout> {
        throw new Error('Method not implemented.');
    }
    getShippingMethods(id: string, paginationInput: PaginationInput, requestContext: RequestContext, context?: any): Promise<ShippingMethodResultSet> {
        throw new Error('Method not implemented.');
    }

    async deleteCart(id: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async updateCart(
        id: string,
        cartUpdateInput: CartUpdateInput,
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async getShippingOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartShippingOptions> {
        throw new Error('Method not implemented.');
    }
    async getPaymentOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartPaymentOptions> {
        throw new Error('Method not implemented.');
    }
    async addCouponCode(id: string, couponCode: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async removeCouponCode(id: string, couponCodeId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async mergeCarts(fromCartId: string, toCartId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
    async addPayments(id: string, paymentMethods: CartPaymentMethodInput[], isSplitPayment: boolean, requestContext: RequestContext, context?: any): Promise<Cart> {
        throw new Error('Method not implemented.');
    }
}
